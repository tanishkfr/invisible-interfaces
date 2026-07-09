"""Mobile (375×812): compact morph geometry, legible text, no horizontal
scroll. Reduced motion: discrete era states."""
import json

from playwright.sync_api import sync_playwright

from helpers import BASE_URL, sect, scrub

results = {}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # ——— Mobile ———
    mob = browser.new_page(viewport={"width": 375, "height": 812})
    mob.goto(BASE_URL)
    mob.wait_for_load_state("networkidle")
    mob.mouse.wheel(0, 120)  # hurry the opening
    mob.wait_for_timeout(4000)
    results["mobile_no_hscroll"] = mob.evaluate("document.documentElement.scrollWidth <= innerWidth")

    s2 = sect(mob, 2)
    scrub(mob, s2, 0.56, settle=900)
    results["mobile_morph"] = mob.evaluate(
        """() => {
          const stage = document.querySelector('section[data-scene="2"] .sticky > div');
          const label = [...stage.querySelectorAll('span')].find(e => e.textContent.trim() === 'LETTER.TXT');
          const scale = new DOMMatrix(getComputedStyle(stage).transform).a || 1;
          return {
            stageWidth: stage.getBoundingClientRect().width,
            effectiveFont: label ? Math.round(parseFloat(getComputedStyle(label).fontSize) * scale * 10) / 10 : null,
          };
        }"""
    )
    results["mobile_no_hscroll_after"] = mob.evaluate("document.documentElement.scrollWidth <= innerWidth")
    mob.close()

    # ——— Reduced motion: the morph snaps to plateaus ———
    rm = browser.new_page(viewport={"width": 1280, "height": 800}, reduced_motion="reduce")
    rm.goto(BASE_URL)
    rm.wait_for_load_state("networkidle")
    rm.wait_for_timeout(4000)
    s2 = sect(rm, 2)
    scrub(rm, s2, 0.45, settle=900)  # mid transition band → must snap
    results["rm_snapped_frame_w"] = rm.evaluate(
        """() => { const stage = document.querySelector('section[data-scene="2"] .sticky > div');
           return Math.round(stage.querySelector(':scope > div.border, :scope > div[class*="border"]')
             ?.getBoundingClientRect().width ?? -1); }"""
    )
    rm.close()
    browser.close()

print(json.dumps(results, indent=1))
