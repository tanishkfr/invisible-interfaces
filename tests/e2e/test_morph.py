"""Simplification plateaus, personal ledger, photo fidelity, and copy integrity."""
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
    page.evaluate(
        "sessionStorage.setItem('ii.commands','8');"
        "sessionStorage.setItem('ii.seconds','94')"
    )

    geo = sect(page, 2)
    visible = """() => [...document.querySelectorAll(
      'section[data-scene="2"] p'
    )].filter(e => parseFloat(getComputedStyle(e).opacity) > 0.5)
      .map(e => e.textContent.trim())"""

    plateaus = {}
    for progress, name in [
        (0.08, "terminal"),
        (0.31, "gui"),
        (0.56, "touch"),
        (0.77, "search"),
        (0.97, "prediction"),
    ]:
        scrub(page, geo, progress, settle=900)
        plateaus[name] = page.evaluate(visible)

    results["plateaus"] = plateaus
    results["personal"] = any("8 COMMANDS" in line for line in plateaus["terminal"])
    results["prediction"] = any(
        "ATTENTION: AVAILABLE, NOT FREE." in line
        for line in plateaus["prediction"]
    )

    scrub(page, geo, 0.56, settle=700)
    results["indexed_photo"] = page.evaluate(
        """() => [...document.querySelectorAll(
          'section[data-scene="2"] img'
        )].filter(i => parseFloat(
          getComputedStyle(i.parentElement).opacity
        ) > 0.5).length"""
    )
    body = page.locator("body").inner_text()
    results["mojibake"] = any(token in body for token in ["Â", "â", "Ã"])
    results["waapi"] = page.evaluate(WAAPI_SWEEP)
    results["console_errors"] = errors[:5]

    assert results["personal"]
    assert results["prediction"]
    assert results["indexed_photo"] >= 1
    assert not results["mojibake"]
    assert results["waapi"] == 0
    assert not results["console_errors"]
    browser.close()

print(json.dumps(results, indent=1))