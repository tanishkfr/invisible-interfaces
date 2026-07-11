"""The instrument: drive a real journey and confirm the reveal reads
back the visitor's own measured attention, honestly, across branches."""
import json

from playwright.sync_api import sync_playwright

from helpers import BASE_URL, WAAPI_SWEEP, collect_errors, sect, scrub

results = {}


def read_reveal(page):
    # The sr-only prose carries the whole trace at once.
    return page.evaluate(
        """() => { const p = [...document.querySelectorAll('section[data-scene="6"] p')]
           .find(e => e.textContent.includes('Your attention, this hour'));
           return p ? p.textContent.trim() : null; }"""
    )


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # ——— Branch A: patient visitor, solves terminal, holds, never uses menu ———
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    errors = collect_errors(page)
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(3200)  # sit in the dark past 2.5s

    # Terminal
    page.locator('section[data-scene="1"]').scroll_into_view_if_needed()
    page.wait_for_timeout(2500)
    page.locator('section[data-scene="1"] .cursor-text').click()
    inp = page.locator('section[data-scene="1"] input')
    for cmd, wait in [("list", 3500), ("open beach.pic", 6000)]:
        inp.fill(cmd)
        inp.press("Enter")
        page.wait_for_timeout(wait)

    # Scene 2 with a deliberate scroll-back
    s2 = sect(page, 2)
    scrub(page, s2, 0.7, settle=600)
    scrub(page, s2, 0.35, settle=600)  # back through the years
    scrub(page, s2, 0.9, settle=400)

    # Scene 4: hold the work up
    s4 = page.locator('section[data-scene="4"]')
    s4.scroll_into_view_if_needed()
    page.wait_for_timeout(2400)
    s4.locator("button").first.click()
    page.wait_for_timeout(4500)
    stage = s4.locator('[role="button"]')
    stage.hover()
    page.mouse.down()
    page.wait_for_timeout(700)
    page.mouse.up()

    # Into the ending; scrub the reveal open
    s6 = sect(page, 6)
    scrub(page, s6, 0.05, settle=800)  # trigger snapshot
    scrub(page, s6, 0.45, settle=800)  # reveal fully accumulated
    prose = read_reveal(page)
    results["A_prose"] = prose
    results["A_checks"] = {
        "waited_dark": "WAITED OUT THE DARK" in (prose or ""),
        "terminal_cost": "THE MACHINE TOOK 2 COMMAND" in (prose or ""),
        "looked_back": "SCROLLED BACK" in (prose or "") or "LOOKED BACK" in (prose or ""),
        "held": "HELD THE HIDDEN WORK" in (prose or ""),
        "never_used_nav": "NEVER USED IT" in (prose or ""),
        "ethics": "left your browser" in (prose or ""),
    }
    # The visible (non-sr) reveal lines at this depth
    results["A_visible"] = page.evaluate(
        """() => [...document.querySelectorAll('section[data-scene="6"] [aria-hidden] p')]
           .filter(e => parseFloat(getComputedStyle(e).opacity) > 0.5)
           .map(e => e.textContent.trim()).slice(0, 12)"""
    )
    results["A_waapi"] = page.evaluate(WAAPI_SWEEP)
    page.screenshot(path="reveal_A.png")

    # The closing statement still lands, after the reveal clears
    scrub(page, s6, 0.8, settle=800)
    results["A_statement"] = page.evaluate(
        """() => [...document.querySelectorAll('section[data-scene="6"] h2 span')]
           .some(e => parseFloat(getComputedStyle(e).opacity) > 0.5)"""
    )
    results["A_errors"] = errors[:5]
    page.close()

    # ——— Branch B: impatient deserter, skips terminal, uses the menu ———
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(600)
    page.mouse.wheel(0, 300)  # skip the dark fast

    # Use the navigation menu (header)
    page.wait_for_timeout(4000)
    try:
        page.locator("header nav button", has_text="04").click()
        page.wait_for_timeout(2000)
    except Exception as e:
        results["B_menu_err"] = str(e)[:80]

    # Skip the terminal entirely: jump toward the end
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_timeout(1500)
    s6 = sect(page, 6)
    scrub(page, s6, 0.05, settle=800)
    scrub(page, s6, 0.45, settle=900)
    prose_b = read_reveal(page)
    results["B_prose"] = prose_b
    results["B_checks"] = {
        "gave_dark_seconds": "GAVE THE DARK" in (prose_b or ""),
        "used_menu": "USED IT" in (prose_b or "") or "REACHED FOR IT" in (prose_b or ""),
        "terminal_branch_present": (
            "PASSED THE MACHINE" in (prose_b or "")
            or "LEFT THE MACHINE" in (prose_b or "")
            or "THE MACHINE TOOK" in (prose_b or "")
        ),
    }
    page.screenshot(path="reveal_B.png")
    page.close()

    browser.close()

print(json.dumps(results, indent=1))
