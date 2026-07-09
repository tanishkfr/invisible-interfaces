"""Scenes 3 and 5 (pinned stages): exclusive windows, self-acting beats,
the memory callback, the five folded questions, and the CONTROL pattern
break. Also the header decay curve across the whole journey."""
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
    page.evaluate("localStorage.setItem('ii.commands','8')")

    # ——— Header decay across the journey ———
    def header_opacities():
        return page.evaluate(
            """() => {
              const h = document.querySelector('header');
              const word = [...h.querySelectorAll('p')].find(e => e.textContent.includes('INVISIBLE'));
              const nav = h.querySelector('nav');
              return {
                wordmark: word ? getComputedStyle(word).opacity : null,
                menu: nav ? getComputedStyle(nav).opacity : null,
              };
            }"""
        )

    s1geo = sect(page, 1)
    scrub(page, s1geo, 0.5, settle=3500)  # deep enough for the fade-in gate
    results["header_at_scene1"] = header_opacities()

    # Menu works: click 03 → lands in scene 3.
    page.locator('header nav button', has_text="03").click()
    page.wait_for_timeout(2200)
    results["menu_scrolled_to_scene3"] = page.evaluate(
        """() => { const r = document.querySelector('section[data-scene="3"]').getBoundingClientRect();
           return r.top <= 10 && r.bottom > innerHeight; }"""
    )

    # ——— Scene 3 beats ———
    s3 = sect(page, 3)
    labels = [
        "A sign-in form filling itself",
        "A message reply suggesting itself",
        "A calendar event created from a conversation",
        "A photo memory appearing on its own",
    ]
    eff = """(labels) => labels.map(l => {
      const el = document.querySelector(`[aria-label="${l}"]`);
      let node = el, o = 1;
      while (node && node.tagName !== 'SECTION') { o *= parseFloat(getComputedStyle(node).opacity); node = node.parentElement; }
      return Math.round(o * 100) / 100;
    })"""
    windows = {}
    for i, c in enumerate([0.25, 0.47, 0.69, 0.92]):
        scrub(page, s3, c, settle=3600)
        windows[f"beat{i}"] = page.evaluate(eff, labels)
    results["s3_windows"] = windows
    results["s3_memory_line"] = page.get_by_text("LAST TIME, THIS TOOK YOU 8 COMMANDS.").count()

    # ——— Scene 5: five questions, exclusive, live reroute ———
    s5 = sect(page, 5)
    qlabels = ["TRUST", "CONTROL", "CONSENT", "TRANSPARENCY", "REVERSIBILITY"]
    QS, QE = 0.13, 0.93
    qw = (QE - QS) / len(qlabels)
    seen = {}
    for i, name in enumerate(qlabels):
        scrub(page, s5, QS + (i + 0.5) * qw, settle=1800)
        vis = page.evaluate(
            """(labels) => labels.filter(l => {
              const el = [...document.querySelectorAll('section[data-scene="5"] p')].find(e => e.textContent.trim() === l);
              return el && parseFloat(getComputedStyle(el).opacity) > 0.5;
            })""",
            qlabels,
        )
        seen[name] = vis
        if name == "CONTROL":
            results["control_rerouted"] = page.get_by_text("Rerouted.", exact=True).count()
    results["s5_exclusive"] = all(v == [k] for k, v in seen.items())
    results["s5_detail"] = {k: v for k, v in seen.items() if v != [k]}

    # The four decaying parts: wordmark, nav, border, progress line.
    header_end = page.evaluate(
        """() => {
          const h = document.querySelector('header');
          const parts = [
            [...h.querySelectorAll('p')].find(e => e.textContent.includes('INVISIBLE')),
            h.querySelector('nav'),
            ...h.querySelectorAll('div[aria-hidden]'),
          ].filter(Boolean);
          return parts.map(e => parseFloat(getComputedStyle(e).opacity));
        }"""
    )
    results["header_part_opacities_at_scene5"] = header_end
    results["header_fully_decayed_by_scene5"] = all(v < 0.05 for v in header_end)

    results["console_errors"] = errors[:5]
    browser.close()

print(json.dumps(results, indent=1))
