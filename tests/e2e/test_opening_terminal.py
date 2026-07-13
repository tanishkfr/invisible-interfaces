"""Scene 0 storyboard (patient + hurried paths) and the Scene 1 terminal:
solve path with time receipt, mercy hints, and the abandonment line."""
import json

from playwright.sync_api import sync_playwright

from helpers import BASE_URL, WAAPI_SWEEP, collect_errors, sect, scrub

results = {}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # ——— Patient visitor: full storyboard ———
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    errors = collect_errors(page)
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(3500)  # line 1 at ~2.5s
    line = page.locator('section[data-scene="0"] [class*="max-w-"] p')
    results["line1"] = line.inner_text() if line.count() else None
    page.wait_for_timeout(6000)  # line 2 at ~8.3s
    results["line2_cursor"] = page.locator('section[data-scene="0"] .cursor-blink').count()
    page.wait_for_timeout(11000)  # field complete ~20s
    results["fragments"] = page.evaluate(
        """() => [...document.querySelectorAll('section[data-scene="0"] [class*="sm:block"] > div')]
           .filter(d => d.firstElementChild && parseFloat(getComputedStyle(d.firstElementChild).opacity) > 0.5).length"""
    )
    # Header arrived with the statement (Phase 3 chrome)
    results["header_wordmark"] = page.get_by_text("INVISIBLE INTERFACES", exact=True).evaluate(
        "el => getComputedStyle(el).opacity"
    )
    page.close()

    # ——— Impatient visitor: scroll fast-forwards the opening ———
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(800)
    page.mouse.wheel(0, 120)  # a nudge during the void
    page.wait_for_timeout(4500)
    results["hurried_fragments_by_5s"] = page.evaluate(
        """() => [...document.querySelectorAll('section[data-scene="0"] [class*="sm:block"] > div')]
           .filter(d => d.firstElementChild && parseFloat(getComputedStyle(d.firstElementChild).opacity) > 0.5).length"""
    )

    # ——— Terminal: solve with a time receipt ———
    s1 = page.locator('section[data-scene="1"]')
    s1.scroll_into_view_if_needed()
    page.wait_for_timeout(2500)
    page.locator('section[data-scene="1"] .cursor-text').click()
    inp = page.locator('section[data-scene="1"] input')

    def send(cmd, settle=2500):
        inp.fill(cmd)
        inp.press("Enter")
        page.wait_for_timeout(settle)

    send("list", settle=3500)
    send("open beach.pic", settle=6000)
    log = page.locator('[role="log"]').inner_text()
    results["receipt"] = [l for l in log.split("\n") if "THAT TOOK" in l]
    results["stored"] = page.evaluate(
        "() => [sessionStorage.getItem('ii.commands'), sessionStorage.getItem('ii.seconds')]"
    )
    results["waapi"] = page.evaluate(WAAPI_SWEEP)
    page.close()

    # ——— Deserter: the machine notes the debt ———
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")
    page.mouse.wheel(0, 200)
    page.wait_for_timeout(4000)
    page.locator('section[data-scene="1"]').scroll_into_view_if_needed()
    page.wait_for_timeout(2500)  # boot
    s2geo = sect(page, 2)
    scrub(page, s2geo, 0.1, settle=2500)  # scroll past without solving
    results["abandoned_flag"] = page.evaluate("() => sessionStorage.getItem('ii.abandoned')")
    results["still_waiting"] = "STILL WAITING." in page.locator('[role="log"]').inner_text()

    results["console_errors"] = errors[:5]
    page.close()
    browser.close()

print(json.dumps(results, indent=1))

assert results["line1"] == "You probably used hundreds of interfaces today."
assert results["fragments"] == 8
assert results["hurried_fragments_by_5s"] >= 4
assert results["receipt"]
assert results["abandoned_flag"] == "1"
assert results["still_waiting"]
assert not results["console_errors"]
