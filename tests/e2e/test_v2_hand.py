"""Direct manipulation must settle, cancel and yield to the scroll-owned pose."""
import json
import os
import re
from pathlib import Path
from playwright.sync_api import sync_playwright
from helpers import BASE_URL

OUT = Path(__file__).resolve().parents[2] / os.environ.get("II_OUTPUT_DIR", "output/playwright/hand-response")
OUT.mkdir(parents=True, exist_ok=True)
engine = os.environ.get("II_BROWSER", "chromium")

with sync_playwright() as p:
    options = {"headless": True}
    if os.environ.get("II_BROWSER_EXECUTABLE"):
        options["executable_path"] = os.environ["II_BROWSER_EXECUTABLE"]
    browser = getattr(p, engine).launch(**options)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.add_init_script("addEventListener('pointerdown',e=>window.__handPointer=e.pointerId)")
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda e: errors.append(e.text) if e.type == "error" else None)

    def seek(t):
        page.evaluate("t=>scrollTo(0,(document.querySelector('.v2-scroll').offsetHeight-innerHeight)*t/140)", t)
        page.wait_for_function("t=>Math.abs(+document.querySelector('main').dataset.progress-t/140)<.0002", arg=t)
        page.wait_for_timeout(100)

    def preset(name):
        page.get_by_role("button", name=name, exact=True).focus()
        page.keyboard.press("Enter")

    def pull():
        transform = page.locator(".v2-color").evaluate("e=>e.style.transform")
        return float(re.search(r"rotateY\(([-.\d]+)deg\)", transform)[1]) if transform else 0

    def drag(dx, delay=25):
        r = page.locator(".v2-photo").bounding_box()
        x, y = r["x"] + r["width"] * .5, r["y"] + r["height"] * .5
        page.mouse.move(x, y)
        page.mouse.down()
        for i in range(1, 9):
            page.mouse.move(x + dx * i / 8, y)
            page.wait_for_timeout(delay)

    layouts = {}
    for w, h in [(1440, 900), (768, 1024), (390, 844), (375, 667), (320, 568)]:
        page.set_viewport_size({"width": w, "height": h})
        page.goto(BASE_URL + "/v2")
        page.locator("canvas[data-surface-ready=true]").wait_for(state="attached")
        page.evaluate("document.fonts.ready")
        seek(79)
        drag(150 if w <= 700 else 260)
        assert pull() > 2
        assert page.locator(".v2-photo[data-surface-active]").count() == 1
        assert page.evaluate("document.documentElement.scrollWidth<=innerWidth")
        page.screenshot(path=str(OUT / f"{engine}-{w}x{h}-held.png"))
        held = pull()
        page.mouse.up()
        page.wait_for_timeout(150)
        assert 0 < pull() < held
        page.wait_for_timeout(650)
        assert pull() == 0
        assert page.locator(".v2-photo[data-surface-active]").count() == 0
        settled = page.screenshot(path=str(OUT / f"{engine}-{w}x{h}-settled.png"))
        seek(106)
        seek(79)
        assert page.screenshot() == settled, "Hand feedback contaminated scroll replay"
        drag(-90)
        assert pull() < 0
        # Losing capture rolls back the unfinished framing and pressure immediately.
        page.locator(".v2-photo").evaluate("e=>e.releasePointerCapture(window.__handPointer)")
        page.mouse.move(1, 1)
        page.mouse.up()
        page.wait_for_timeout(100)
        assert pull() == 0
        assert float(page.locator(".v2-photo").get_attribute("data-framing")) > 1.47
        # Leaving Gesture during release cannot carry hand pressure into recall.
        drag(-60)
        page.mouse.up()
        seek(94)
        assert pull() == 0
        layouts[f"{w}x{h}"] = True

    page.set_viewport_size({"width": 1440, "height": 900})
    page.wait_for_timeout(300)
    seek(79)
    preset("Wide shore")
    drag(90, 100)
    slow = pull()
    page.mouse.up()
    preset("Wide shore")
    drag(90, 0)
    fast = pull()
    assert fast > slow, (slow, fast)
    page.mouse.up()
    # A new drag interrupts the release; keyboard selection clears it immediately.
    drag(-50)
    assert pull() < 0
    page.mouse.up()
    preset("Closer to the boat")
    assert pull() == 0
    page.emulate_media(reduced_motion="reduce")
    page.wait_for_timeout(400)
    seek(79)
    drag(-90)
    assert pull() == 0
    page.mouse.up()
    assert float(page.locator(".v2-photo").get_attribute("data-framing")) < 1.47
    assert page.locator("canvas[data-surface-ready=true]").count() == 0
    # WebGL failure keeps responsive DOM feedback and the same framing controls.
    fallback = browser.new_page(viewport={"width": 320, "height": 568})
    fallback.on("pageerror", lambda e: errors.append(str(e)))
    fallback.add_init_script("""const get=HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext=function(type,...args){
        return type==='webgl'||type==='webgl2'?null:get.call(this,type,...args);
      };""")
    fallback.goto(BASE_URL + "/v2")
    fallback.locator("main[data-ready=true]").wait_for()
    fallback.evaluate("scrollTo(0,(document.querySelector('.v2-scroll').offsetHeight-innerHeight)*79/140)")
    fallback.wait_for_timeout(250)
    original = page
    page = fallback
    drag(100)
    assert pull() > 0
    assert page.locator(".v2-color").evaluate("e=>getComputedStyle(e).visibility") == "visible"
    page.screenshot(path=str(OUT / f"{engine}-fallback-held.png"))
    page.mouse.up()
    page.wait_for_timeout(800)
    assert pull() == 0
    page.close()
    page = original
    assert not errors, errors
    result = {"engine": engine, "browser": browser.version, "direction_and_speed_response": True,
              "weighted_settle_and_reverse_pixels": True, "lost_capture_rollback": True,
              "act_exit_clears_pressure": True, "interruptible_release": True,
              "immediate_keyboard_and_reduced_motion": True, "webgl_unavailable_feedback": True,
              "viewports": layouts, "errors": errors}
    (OUT / f"{engine}-hand.json").write_text(json.dumps(result, indent=2))
    print(json.dumps(result, indent=2))
    browser.close()
