"""Scene 2: era progression, attention ledger (default + personal),
year-marked captions with dead zones, photo fidelity crossfade."""
import json

from playwright.sync_api import sync_playwright

from helpers import BASE_URL, WAAPI_SWEEP, collect_errors, sect, scrub

results = {}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    errors = collect_errors(page)
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1200)
    # Simulate a solved terminal for the personal ledger.
    page.evaluate("localStorage.setItem('ii.commands','8'); localStorage.setItem('ii.seconds','94')")

    geo = sect(page, 2)
    visible = """() => [...document.querySelectorAll('section[data-scene="2"] p')]
        .filter(e => parseFloat(getComputedStyle(e).opacity) > 0.5)
        .map(e => e.textContent.trim())"""

    for pr, name in [(0.08, "terminal"), (0.31, "gui"), (0.56, "touch"), (0.77, "search"), (0.97, "prediction")]:
        scrub(page, geo, pr, settle=900)
        results[name] = page.evaluate(visible)

    # Photo fidelity: indexed <img> in touch era, full SVG by prediction.
    scrub(page, geo, 0.56, settle=700)
    results["touch_photo_is_indexed_img"] = page.evaluate(
        """() => { const c = [...document.querySelectorAll('section[data-scene="2"] img')]
             .filter(i => parseFloat(getComputedStyle(i.parentElement).opacity) > 0.5);
           return c.length; }"""
    )
    results["waapi"] = page.evaluate(WAAPI_SWEEP)
    results["console_errors"] = errors[:5]
    browser.close()

print(json.dumps(results, indent=1))
