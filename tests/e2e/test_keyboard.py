"""Keyboard-only journey, comparison control, reversal, About, and 404."""
import json
from playwright.sync_api import sync_playwright
from helpers import BASE_URL, collect_errors

results = {}
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    errors = collect_errors(page)
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(3500)

    page.keyboard.press("Tab")
    results["first_focus"] = page.evaluate(
        "() => document.activeElement.textContent.trim()"
    )

    for _ in range(7):
        page.keyboard.press("Tab")
    results["terminal_focus"] = page.evaluate(
        "() => document.activeElement.getAttribute('aria-label')"
    )

    terminal = page.locator('section[data-scene="1"]')
    terminal.scroll_into_view_if_needed()
    page.wait_for_timeout(2200)
    inp = terminal.locator("input")
    for command, wait in [("list", 2500), ("open beach.pic", 4500)]:
        inp.fill(command)
        inp.press("Enter")
        page.wait_for_timeout(wait)
    results["solved"] = "DISPLAYED" in page.locator('[role="log"]').inner_text()

    task = page.locator('section[data-scene="4"]')
    task.scroll_into_view_if_needed()
    page.wait_for_timeout(900)
    entrust = page.get_by_role("button", name="ENTRUST THIS TASK")
    entrust.focus()
    page.keyboard.press("Enter")

    page.evaluate(
        """() => {
          Object.defineProperty(document, 'hidden', {
            configurable: true, get: () => true
          });
          document.dispatchEvent(new Event('visibilitychange'));
        }"""
    )
    page.wait_for_timeout(8300)
    page.evaluate(
        """() => {
          Object.defineProperty(document, 'hidden', {
            configurable: true, get: () => false
          });
          document.dispatchEvent(new Event('visibilitychange'));
        }"""
    )
    page.wait_for_timeout(800)

    slider = page.get_by_role(
        "slider", name="Reveal restored image compared with the original scan"
    )
    slider.focus()
    before = slider.input_value()
    page.keyboard.press("ArrowRight")
    after = slider.input_value()
    results["slider_keyboard"] = int(after) > int(before)

    discard = page.get_by_role("button", name="DISCARD THE RESTORED COPY")
    discard.focus()
    page.keyboard.press("Enter")
    results["discarded"] = page.get_by_role(
        "button", name="RESTORED COPY DISCARDED"
    ).count()

    link = page.get_by_text("ABOUT THIS INVESTIGATION", exact=True)
    link.focus()
    page.keyboard.press("Enter")
    page.wait_for_url("**/about", timeout=10000)
    results["about_reached"] = "/about" in page.url

    page.goto(BASE_URL + "/definitely-not-a-page")
    page.wait_for_timeout(900)
    results["notfound"] = page.get_by_text("?PAGE NOT FOUND").count()
    results["console_errors"] = [e for e in errors if "404" not in e][:4]

    assert results["first_focus"] == "Skip to the essay"
    assert results["terminal_focus"].startswith("Terminal input")
    assert results["solved"]
    assert results["slider_keyboard"]
    assert results["discarded"] == 1
    assert results["about_reached"]
    assert results["notfound"] == 1
    browser.close()

print(json.dumps(results, indent=1))