"""Entrusted absence, early return, tangible result, receipts, reversal, and fallback."""
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

    results["ending_before"] = page.get_by_text(
        "THE TASK ENDS. YOUR AUTHORITY DOES NOT."
    ).count()
    page.get_by_role("button", name="ENTRUST THIS TASK").click()

    def visibility(hidden, wait):
        page.evaluate(
            """(hidden) => {
              Object.defineProperty(document, 'hidden', {
                configurable: true, get: () => hidden
              });
              document.dispatchEvent(new Event('visibilitychange'));
            }""",
            hidden,
        )
        page.wait_for_timeout(wait)

    visibility(True, 2600)
    visibility(False, 700)
    results["early_return"] = task.get_by_text("1/4 MOVEMENTS COMPLETE", exact=False).count()
    results["not_complete_early"] = page.get_by_text(
        "The beach photograph is restored.", exact=False
    ).count()

    visibility(True, 5700)
    visibility(False, 1000)

    results["restored"] = page.get_by_text(
        "The beach photograph is restored.", exact=False
    ).count()
    results["comparison"] = page.get_by_role(
        "slider", name="Reveal restored image compared with the original scan"
    ).count()
    results["return_receipt"] = task.get_by_text("RETURN RECEIPT", exact=False).count()
    results["work_receipt"] = task.get_by_text("WORK RECEIPT", exact=True).count()
    results["authority"] = task.get_by_text("AUTHORITY BOUNDARY", exact=True).count()
    results["attention_receipt"] = task.get_by_text(
        "YOUR ATTENTION RECEIPT", exact=True
    ).count()
    results["about_after"] = page.get_by_text(
        "ABOUT THIS INVESTIGATION", exact=True
    ).count()

    page.get_by_role("button", name="DISCARD THE RESTORED COPY").click()
    results["discarded"] = page.get_by_role(
        "button", name="RESTORED COPY DISCARDED"
    ).count()
    body = page.locator("body").inner_text()
    results["mojibake"] = any(token in body for token in ["Â", "â", "Ã"])
    results["console_errors"] = errors[:5]

    assert results["ending_before"] == 0
    assert results["early_return"] == 1
    assert results["not_complete_early"] == 0
    assert results["restored"] == 1
    assert results["comparison"] == 1
    assert results["return_receipt"] == 1
    assert results["work_receipt"] == 1
    assert results["authority"] == 1
    assert results["attention_receipt"] == 1
    assert results["about_after"] == 1
    assert results["discarded"] == 1
    assert not results["mojibake"]

    fallback = browser.new_page(viewport={"width": 1280, "height": 800})
    fallback.add_init_script(
        """Object.defineProperty(Document.prototype, 'hidden', {
          configurable: true, get: () => undefined
        });"""
    )
    fallback.goto(BASE_URL)
    fallback.wait_for_load_state("networkidle")
    fallback_task = fallback.locator('section[data-scene="4"]')
    fallback_task.scroll_into_view_if_needed()
    fallback.get_by_role("button", name="ENTRUST THIS TASK").click()
    fallback.get_by_role("button", name="USE ACCESSIBLE DEMONSTRATION").click()
    fallback.wait_for_timeout(700)
    results["fallback_labeled"] = fallback.get_by_text(
        "DEMONSTRATION MODE · NO VISIBILITY SIGNAL", exact=True
    ).count()
    assert results["fallback_labeled"] == 1

    browser.close()

print(json.dumps(results, indent=1))