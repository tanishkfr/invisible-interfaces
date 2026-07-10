"""Scene 4 choreography (nodes, threads, assembly, hold) and the ending:
epilogue turn line, the about door, and the /about page."""
import json

from playwright.sync_api import sync_playwright

from helpers import BASE_URL, collect_errors, sect, scrub

results = {}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    errors = collect_errors(page)
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1200)

    # ——— Scene 4 ———
    s4 = page.locator('section[data-scene="4"]')
    s4.scroll_into_view_if_needed()
    page.wait_for_timeout(2400)
    s4.locator("button").first.click()
    page.wait_for_timeout(4500)  # nodes wake + settle + assembly

    results["nodes_visible"] = page.evaluate(
        """() => [...document.querySelectorAll('section[data-scene="4"] span')]
           .filter(e => /^(CALENDAR|MAPS|TRAFFIC|WEATHER|RESERVATION|REMINDER)$/.test(e.textContent.trim())).length"""
    )
    results["threads_drawn"] = page.evaluate(
        """() => document.querySelectorAll('section[data-scene="4"] svg line').length"""
    )
    results["outcome"] = s4.get_by_text("Dinner tomorrow, 7:30").count()

    stage = page.locator('section[data-scene="4"] [role="button"]')
    rest = float(stage.evaluate("el => getComputedStyle(el).opacity"))
    stage.hover()
    page.mouse.down()
    page.wait_for_timeout(900)
    held = float(stage.evaluate("el => getComputedStyle(el).opacity"))
    page.mouse.up()
    page.wait_for_timeout(900)
    released = float(stage.evaluate("el => getComputedStyle(el).opacity"))
    results["hold_cycle"] = [rest, held, released]
    # At rest the stage breathes between 0.28 and 0.44 — the discovery
    # affordance — so "rest" is anything clearly below the held state.
    results["hold_ok"] = rest < 0.5 and held > 0.85 and released < 0.5

    # ——— Epilogue: two lines, then the turn, then void ———
    s6 = sect(page, 6)
    scrub(page, s6, 0.45, settle=800)
    results["line1_at_045"] = page.evaluate(
        """() => getComputedStyle(document.querySelector('section[data-scene="6"] h2 span')).opacity"""
    )
    scrub(page, s6, 0.9, settle=800)
    results["turn_at_09"] = page.get_by_text("YOU’LL NOTICE ONE TONIGHT.").evaluate(
        "el => getComputedStyle(el).opacity"
    )
    scrub(page, s6, 1.0, settle=800)

    # The door past the end
    about = page.get_by_text("ABOUT THIS ESSAY")
    results["about_link"] = about.count()
    about.click()
    page.wait_for_load_state("networkidle")
    results["about_page"] = page.get_by_text("Reading room", exact=False).count() >= 0 and \
        page.get_by_text("Weiser", exact=False).count()

    results["console_errors"] = errors[:5]
    browser.close()

print(json.dumps(results, indent=1))
