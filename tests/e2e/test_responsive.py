"""Mobile layout, compact morph, final control fit, and reduced motion."""
import json
from playwright.sync_api import sync_playwright
from helpers import BASE_URL, sect, scrub

results = {}
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    for width in [320, 375]:
        mobile = browser.new_page(viewport={"width": width, "height": 812})
        mobile.goto(BASE_URL)
        mobile.wait_for_load_state("networkidle")
        mobile.mouse.wheel(0, 120)
        mobile.wait_for_timeout(3000)

        entry = {
            "initial_no_hscroll": mobile.evaluate(
                "document.documentElement.scrollWidth <= innerWidth"
            )
        }
        s2 = sect(mobile, 2)
        scrub(mobile, s2, 0.56, settle=900)
        entry["morph_no_hscroll"] = mobile.evaluate(
            "document.documentElement.scrollWidth <= innerWidth"
        )
        entry["minimum_machine_type"] = mobile.evaluate(
            """() => {
              const stage = document.querySelector(
                'section[data-scene="2"] .sticky > div'
              );
              const scale = new DOMMatrix(
                getComputedStyle(stage).transform
              ).a || 1;
              const sizes = [...stage.querySelectorAll('p, span')]
                .map(e => parseFloat(getComputedStyle(e).fontSize) * scale)
                .filter(Boolean);
              return Math.round(Math.min(...sizes) * 10) / 10;
            }"""
        )
        task = mobile.locator('section[data-scene="4"]')
        task.scroll_into_view_if_needed()
        entry["final_no_hscroll"] = mobile.evaluate(
            "document.documentElement.scrollWidth <= innerWidth"
        )
        entry["entrust_target_height"] = mobile.get_by_role(
            "button", name="ENTRUST THIS TASK"
        ).evaluate("el => Math.round(el.getBoundingClientRect().height)")
        results[str(width)] = entry
        mobile.close()

    reduced = browser.new_page(
        viewport={"width": 1280, "height": 800},
        reduced_motion="reduce",
    )
    reduced.goto(BASE_URL)
    reduced.wait_for_load_state("networkidle")
    reduced.wait_for_timeout(1200)
    results["reduced_matches"] = reduced.evaluate(
        "matchMedia('(prefers-reduced-motion: reduce)').matches"
    )
    results["cursor_animation"] = reduced.evaluate(
        """() => {
          const cursor = document.querySelector('.cursor-blink');
          return cursor ? getComputedStyle(cursor).animationName : 'none';
        }"""
    )
    s2 = sect(reduced, 2)
    scrub(reduced, s2, 0.45, settle=500)
    results["reduced_no_hscroll"] = reduced.evaluate(
        "document.documentElement.scrollWidth <= innerWidth"
    )

    assert all(
        value["initial_no_hscroll"]
        and value["morph_no_hscroll"]
        and value["final_no_hscroll"]
        and value["minimum_machine_type"] >= 10
        and value["entrust_target_height"] >= 44
        for value in [results["320"], results["375"]]
    )
    assert results["reduced_matches"]
    assert results["cursor_animation"] == "none"
    assert results["reduced_no_hscroll"]
    browser.close()

print(json.dumps(results, indent=1))