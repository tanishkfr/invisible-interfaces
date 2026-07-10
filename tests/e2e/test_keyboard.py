"""Keyboard-only walkthrough: menu, terminal, intent, hold, about door.
Plus the attention details: tab-blur title and the 404 page."""
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
    page.wait_for_timeout(4500)  # header fade-in gate

    # Tab reaches the scene menu first.
    page.keyboard.press("Tab")
    results["first_focus"] = page.evaluate(
        "() => document.activeElement.getAttribute('aria-label') || document.activeElement.tagName"
    )

    # Six menu stops, then the terminal input.
    for _ in range(6):
        page.keyboard.press("Tab")
    results["after_menu_focus"] = page.evaluate(
        "() => document.activeElement.tagName + ':' + (document.activeElement.getAttribute('aria-label') || '')"
    )

    # Solve the terminal by keyboard alone.
    page.locator('section[data-scene="1"]').scroll_into_view_if_needed()
    page.wait_for_timeout(2500)
    for cmd, wait in [("list", 3500), ("open beach.pic", 6000)]:
        page.keyboard.type(cmd)
        page.keyboard.press("Enter")
        page.wait_for_timeout(wait)
    results["solved_by_keyboard"] = "DISPLAYED" in page.locator('[role="log"]').inner_text()

    # Accept the intent with Enter; hold the stage with Space.
    s4 = page.locator('section[data-scene="4"]')
    s4.scroll_into_view_if_needed()
    page.wait_for_timeout(2400)
    s4.locator("button").first.focus()
    page.keyboard.press("Enter")
    page.wait_for_timeout(4500)
    stage = s4.locator('[role="button"]')
    stage.focus()
    page.keyboard.down(" ")
    page.wait_for_timeout(900)
    results["space_hold_opacity"] = stage.evaluate("el => getComputedStyle(el).opacity")
    page.keyboard.up(" ")

    # The about door, by keyboard.
    link = page.get_by_text("ABOUT THIS ESSAY")
    link.focus()
    page.keyboard.press("Enter")
    page.wait_for_url("**/about", timeout=10000)
    results["about_reached"] = "/about" in page.url

    # Tab-blur title: the machine notices attention leaving.
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1500)
    results["title_blurred"] = page.evaluate(
        """() => {
          Object.defineProperty(document, 'hidden', { value: true, configurable: true });
          document.dispatchEvent(new Event('visibilitychange'));
          const away = document.title;
          Object.defineProperty(document, 'hidden', { value: false, configurable: true });
          document.dispatchEvent(new Event('visibilitychange'));
          return [away, document.title];
        }"""
    )

    # The page that isn't there speaks in the machine's voice.
    page.goto(f"{BASE_URL}/definitely-not-a-page")
    page.wait_for_timeout(1200)
    results["notfound"] = page.get_by_text("?PAGE NOT FOUND").count()

    results["console_errors"] = [e for e in errors if "404" not in e][:4]
    browser.close()

print(json.dumps(results, indent=1))
