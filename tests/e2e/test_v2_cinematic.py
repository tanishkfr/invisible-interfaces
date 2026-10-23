"""V2 continuity, reversal, input, restoration, responsive and motion-preference checks.

Run with II_BASE_URL pointing to a served production export. Evidence is written
to output/playwright; Python Playwright and its Chromium browser are required.
"""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright
from helpers import BASE_URL

OUT = Path(__file__).resolve().parents[2] / "output" / "playwright"
OUT.mkdir(parents=True, exist_ok=True)
STATES = [0, .08, .11, .18, .24, .32, .40, .43, .45, .50, .55, .59, .70, .77, .84, .88, .94, 1]
SNAPSHOT = """() => {
  const root = document.querySelector('.v2-exhibition');
  return { act: root.dataset.act, progress: +root.dataset.progress,
    styles: ['.v2-world','.v2-shell','.v2-photo','.v2-dither','.v2-color',
      '.v2-context-one','.v2-context-two','.v2-final','.v2-header',
      '.v2-terminal-copy','.v2-window-bar','.v2-touch-ui'].map(s => {
        const c = getComputedStyle(document.querySelector(s));
        const matrix = new DOMMatrixReadOnly(c.transform === 'none' ? undefined : c.transform);
        return [Array.from(matrix.toFloat64Array(), n => Math.round(n*100000)/100000),c.opacity,c.visibility,c.borderRadius];
      }) };
}"""


def scrub(page, progress):
    page.evaluate("p => scrollTo(0,(document.querySelector('.v2-scroll').offsetHeight-innerHeight)*p)", progress)
    page.wait_for_function("p => Math.abs(+document.querySelector('main').dataset.progress-p)<0.0002", arg=progress)
    page.wait_for_timeout(40)
    return page.evaluate(SNAPSHOT)


def load(page, suffix=""):
    page.goto(BASE_URL + "/v2" + suffix)
    page.locator('[data-ready="true"]').wait_for()
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(120)


results = {"base_url": BASE_URL, "viewports": {}, "limitations": ["Emulated touch input; no physical phone or trackpad.", "Frame intervals measure browser rAF, not display presentation or a low-end device."]}
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    results["browser"] = browser.version
    errors = []
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.on("pageerror", lambda error: errors.append(str(error)))
    load(page)
    anchor = page.locator('[data-persistent-artifact="beach"]').element_handle()
    baseline = {str(t): scrub(page, t) for t in STATES}
    for t in reversed(STATES):
        state = scrub(page, t)
        assert state["styles"] == baseline[str(t)]["styles"], f"Reverse mismatch at {t}: {json.dumps({'before': baseline[str(t)], 'after': state})}"
        assert anchor.evaluate("e => e === document.querySelector('[data-persistent-artifact]')")
    for t in [.77, .18, 1, .43, .24, .59, 0, .88, .32]:
        state = scrub(page, t)
        assert state["styles"] == baseline[str(t)]["styles"], f"Fast scrub mismatch at {t}"
    results["deterministic_states"] = len(STATES)
    results["repeated_fast_scrub"] = True
    results["persistent_dom_anchor"] = True

    scrub(page, 0)
    for _ in range(8):
        page.mouse.wheel(0, 160)
        page.wait_for_timeout(60)
    results["wheel_scroll"] = page.evaluate("scrollY > 600")
    assert results["wheel_scroll"]

    scrub(page, .43)
    before = page.evaluate(SNAPSHOT)
    page.reload()
    page.locator('[data-ready="true"]').wait_for()
    page.wait_for_timeout(300)
    after = page.evaluate(SNAPSHOT)
    assert abs(before["progress"] - after["progress"]) < .002
    assert before["styles"] == after["styles"]
    results["refresh_in_transition"] = True
    load(page, "#touch")
    assert page.locator('main').get_attribute("data-act") == "2"
    results["direct_hash_entry"] = True

    # Resize across the camera breakpoint, then restore the desktop geometry.
    page.set_viewport_size({"width": 390, "height": 844})
    page.wait_for_timeout(300)
    scrub(page, .59)
    page.set_viewport_size({"width": 1440, "height": 900})
    page.wait_for_timeout(300)
    assert scrub(page, .59)["styles"] == baseline[str(.59)]["styles"]
    results["resize_rebuild"] = True

    for width, height in [(1440, 900), (768, 1024), (390, 844), (375, 844)]:
        page.set_viewport_size({"width": width, "height": height})
        load(page)
        checks = []
        for t in STATES:
            state = scrub(page, t)
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), f"Overflow at {width}/{t}"
            assert state["progress"] >= t - .001
            checks.append(state["act"])
            if t in [0, .18, .24, .32, .43, .50, .59, .77, .88, 1]:
                page.screenshot(path=str(OUT / f"v2-{width}-{round(t*100):03d}.png"))
        results["viewports"][f"{width}x{height}"] = {"no_overflow": True, "sampled_states": len(checks)}

    page.set_viewport_size({"width": 1440, "height": 900})
    load(page)
    # Keyboard navigation lands at the same timeline state as scrolling.
    link = page.get_by_role("link", name="03 The Gesture Touch")
    link.focus()
    page.keyboard.press("Enter")
    page.wait_for_timeout(150)
    assert page.locator('[aria-current="step"]').get_attribute("data-act-link") == "2"
    assert abs(float(page.locator('main').get_attribute('data-progress')) - .59) < .001
    results["keyboard_chapter_navigation"] = True

    page.emulate_media(reduced_motion="reduce")
    page.wait_for_timeout(250)
    reduced_states = []
    for t, act, expected in [(.10, "0", .11), (.32, "1", .32), (.59, "2", .59), (.77, "3", .77), (.98, "4", 1)]:
        state = scrub(page, t)
        assert state["act"] == act
        assert state["styles"] == baseline[str(expected)]["styles"], f"Wrong reduced composition for act {act}: {state}"
        reduced_states.append(state["styles"])
        page.screenshot(path=str(OUT / f"v2-reduced-{act}.png"))
    assert len({json.dumps(s) for s in reduced_states}) == 5
    a = scrub(page, .35)["styles"]
    b = scrub(page, .40)["styles"]
    assert a == b, "Reduced motion must hold a static state between acts"
    results["reduced_motion_five_static_states"] = True
    page.emulate_media(reduced_motion="no-preference")
    page.wait_for_timeout(200)
    assert scrub(page, .59)["styles"] == baseline[str(.59)]["styles"]
    results["media_cleanup_and_restore"] = True

    scrub(page, 1)
    page.mouse.wheel(0, 1000)
    page.wait_for_timeout(200)
    assert page.locator('.v2-viewport').evaluate("e => e.getBoundingClientRect().top < -500")
    results["native_scroll_release"] = True
    load(page)
    page.keyboard.press("Tab")
    assert page.evaluate("document.activeElement.textContent") == "Skip animation and read the story"
    page.keyboard.press("Enter")
    assert page.evaluate("document.activeElement.id") == "v2-reading"
    results["skip_animation"] = True
    page.get_by_role("link", name="Experience again").click()
    page.wait_for_function("Math.abs(+document.querySelector('main').dataset.progress-.08)<.001")
    results["replay"] = True
    scrub(page, .43)
    page.reload()
    page.locator('[data-ready="true"]').wait_for()
    page.wait_for_function("Math.abs(+document.querySelector('main').dataset.progress-.43)<.001")
    results["refresh_after_chapter_navigation"] = True

    # A real mobile browser context and CDP touch events, rather than scrollTo.
    mobile = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True, device_scale_factor=1)
    phone = mobile.new_page()
    load(phone)
    cdp = mobile.new_cdp_session(phone)
    cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": 195, "y": 670}]})
    for y in [620, 540, 460, 380, 280]:
        cdp.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": 195, "y": y}]})
        phone.wait_for_timeout(35)
    cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
    phone.wait_for_timeout(300)
    assert phone.evaluate("scrollY > 150")
    results["emulated_touch_scroll"] = True
    mobile.close()

    # Measure update intervals during continuous native-position scrubbing.
    load(page)
    results["frame_intervals"] = page.evaluate("""() => new Promise(resolve => {
      const times = []; let previous; let start;
      const span = document.querySelector('.v2-scroll').offsetHeight-innerHeight;
      function tick(now) {
        if (!start) start = now;
        if (previous) times.push(now-previous);
        previous = now;
        const progress = Math.min(1,(now-start)/6000);
        scrollTo(0,span*progress);
        if (progress < 1) requestAnimationFrame(tick);
        else { times.sort((a,b)=>a-b); resolve({samples:times.length,
          median_ms:times[Math.floor(times.length*.5)],p95_ms:times[Math.floor(times.length*.95)],
          over_33ms:times.filter(t=>t>33.4).length,max_ms:times[times.length-1],
          renderer:document.createElement('canvas').getContext('webgl')?.getParameter(7937)}); }
      } requestAnimationFrame(tick);
    })""")

    # Record all three transitions, forward and back, in an actual browser.
    video_context = browser.new_context(viewport={"width": 1440, "height": 900}, record_video_dir=str(OUT / "video"), record_video_size={"width": 1440, "height": 900})
    film = video_context.new_page()
    load(film)
    film.evaluate("""() => new Promise(resolve => {
      let start; const span = document.querySelector('.v2-scroll').offsetHeight-innerHeight;
      function frame(now) { if(!start) start=now;
        const elapsed=(now-start)/1000;
        const t=elapsed<19?elapsed/19:Math.max(0,1-(elapsed-19)/8);
        scrollTo(0,span*t);
        if(elapsed<27) requestAnimationFrame(frame);else resolve();
      }requestAnimationFrame(frame);
    })""")
    video = film.video
    video_context.close()
    video.save_as(str(OUT / "v2-walkthrough.webm"))
    results["video"] = "output/playwright/v2-walkthrough.webm"
    results["page_errors"] = errors
    assert not errors
    browser.close()

(OUT / "v2-verification.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
print(json.dumps(results, indent=2))
