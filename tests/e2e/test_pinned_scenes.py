"""Anticipation beats, terminal memory callback, and chrome decay."""
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
    page.evaluate("sessionStorage.setItem('ii.commands','8')")

    def header_opacities():
        return page.evaluate(
            """() => {
              const h = document.querySelector('header');
              const word = [...h.querySelectorAll('p')].find(
                e => e.textContent.includes('INVISIBLE')
              );
              const nav = h.querySelector('nav');
              return {
                wordmark: word ? getComputedStyle(word).opacity : null,
                menu: nav ? getComputedStyle(nav).opacity : null,
              };
            }"""
        )

    s1 = sect(page, 1)
    scrub(page, s1, 0.5, settle=2500)
    results["header_at_scene1"] = header_opacities()

    page.locator('header nav button', has_text="03").click()
    page.wait_for_timeout(2200)
    results["menu_scrolled_to_scene3"] = page.evaluate(
        """() => {
          const r = document.querySelector('section[data-scene="3"]')
            .getBoundingClientRect();
          return r.top <= 10 && r.bottom > innerHeight;
        }"""
    )

    s3 = sect(page, 3)
    labels = [
        "A sign-in form filling itself",
        "A message reply suggesting itself",
        "A calendar event created from a conversation",
        "A photo memory appearing on its own",
    ]
    eff = """(labels) => labels.map(l => {
      const el = document.querySelector('[aria-label="' + l + '"]');
      let node = el, opacity = 1;
      while (node && node.tagName !== 'SECTION') {
        opacity *= parseFloat(getComputedStyle(node).opacity);
        node = node.parentElement;
      }
      return Math.round(opacity * 100) / 100;
    })"""

    windows = {}
    for i, center in enumerate([0.25, 0.47, 0.69, 0.92]):
        scrub(page, s3, center, settle=3000)
        windows["beat" + str(i)] = page.evaluate(eff, labels)

    results["windows"] = windows
    results["memory"] = page.get_by_text(
        "LAST TIME, THIS TOOK YOU 8 COMMANDS."
    ).count()

    s4 = sect(page, 4)
    scrub(page, s4, 0.2, settle=900)
    results["header_at_entrustment"] = header_opacities()
    results["console_errors"] = errors[:5]

    assert results["menu_scrolled_to_scene3"]
    assert results["memory"] == 1
    assert all(
        values[index] > 0.5 and sum(v > 0.5 for v in values) == 1
        for index, values in enumerate(windows.values())
    )
    assert float(results["header_at_entrustment"]["menu"]) < 0.05
    browser.close()

print(json.dumps(results, indent=1))