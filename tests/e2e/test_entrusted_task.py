"""The ending exists only after the entrusted task completes while the tab is hidden."""
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
    task = page.locator('section[data-scene="4"]')
    task.scroll_into_view_if_needed()
    page.wait_for_timeout(700)
    results["ending_before_entrustment"] = page.get_by_text("THE TASK ENDS. THE BACKGROUND DOES NOT.").count()
    page.get_by_role("button", name="ENTRUST THIS TASK").click()

    page.evaluate("""() => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
      document.dispatchEvent(new Event('visibilitychange'));
    }""")
    page.wait_for_timeout(3900)
    page.evaluate("""() => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
      document.dispatchEvent(new Event('visibilitychange'));
    }""")
    page.wait_for_timeout(1000)

    results["restored"] = page.get_by_text("The beach photograph is restored.", exact=False).count()
    results["receipt"] = page.get_by_text("RETURN RECEIPT", exact=False).count()
    results["ending_after_completion"] = page.get_by_text("THE TASK ENDS. THE BACKGROUND DOES NOT.").count()
    results["about_after_completion"] = page.get_by_text("ABOUT THIS ESSAY", exact=True).count()
    results["console_errors"] = errors[:5]
    assert results["ending_before_entrustment"] == 0
    assert results["restored"] == 1
    assert results["receipt"] == 1
    assert results["ending_after_completion"] == 1
    assert results["about_after_completion"] == 1
    browser.close()
print(json.dumps(results, indent=1))
