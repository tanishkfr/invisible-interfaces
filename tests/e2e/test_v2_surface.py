"""Exercise the actual WebGL sheet, reversal, context fallback, and chapter menu."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright
from helpers import BASE_URL

OUT = Path(__file__).resolve().parents[2] / os.environ.get("II_OUTPUT_DIR", "output/playwright/directors-cut")
OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width":1440,"height":900}, device_scale_factor=2)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda e: errors.append(e.text) if e.type=="error" else None)
    page.goto(BASE_URL+"/v2")
    page.locator('.v2-photo-surface[data-surface-ready="true"]').wait_for(state="attached")
    page.evaluate("document.fonts.ready")
    def seek(t):
        page.evaluate("t=>scrollTo(0,(document.querySelector('.v2-scroll').offsetHeight-innerHeight)*t/140)",t)
        page.wait_for_function("t=>Math.abs(+document.querySelector('main').dataset.progress-t/140)<.0002",arg=t)
        page.wait_for_timeout(100)
    seek(87)
    assert page.locator('.v2-photo').evaluate("e=>e.hasAttribute('data-surface-active')")
    assert page.locator('.v2-color').evaluate("e=>getComputedStyle(e).visibility")=="hidden"
    first = page.screenshot(path=str(OUT/'surface-curled.png'))
    seek(100)
    assert not page.locator('.v2-photo').evaluate("e=>e.hasAttribute('data-surface-active')")
    seek(87)
    assert page.screenshot()==first, "WebGL reverse rendered pixels changed"
    # Losing the GPU must reveal the same crisp photograph immediately.
    page.evaluate("window.__lose = document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context'); window.__lose.loseContext()")
    page.wait_for_function("!document.querySelector('.v2-photo').hasAttribute('data-surface-active')")
    assert page.locator('.v2-color').evaluate("e=>getComputedStyle(e).visibility")=="visible"
    page.screenshot(path=str(OUT/'surface-context-fallback.png'))
    page.evaluate("window.__lose.restoreContext()")
    page.wait_for_function("document.querySelector('.v2-photo').hasAttribute('data-surface-active')")
    page.emulate_media(reduced_motion="reduce")
    page.wait_for_timeout(250)
    assert not page.locator('.v2-photo').evaluate("e=>e.hasAttribute('data-surface-active')")
    page.emulate_media(reduced_motion="no-preference")
    page.locator('.v2-photo-surface[data-surface-ready="true"]').wait_for(state="attached")
    seek(87)
    assert page.locator('.v2-photo').evaluate("e=>e.hasAttribute('data-surface-active')")
    for w,h in [(1440,900),(768,1024),(375,667),(320,568)]:
        page.set_viewport_size({"width":w,"height":h})
        page.wait_for_timeout(200)
        seek(87)
        page.screenshot(path=str(OUT/f'surface-{w}x{h}.png'))
        page.locator('.v2-chapters summary').click()
        nav=page.locator('.v2-navigation').bounding_box()
        assert nav['x']>=0 and nav['x']+nav['width']<=w and nav['y']+nav['height']<=h
        page.screenshot(path=str(OUT/f'chapters-{w}x{h}.png'))
        page.keyboard.press("Escape")
    assert not errors,errors
    result={"browser":browser.version,"webgl_rendered":True,"reverse_pixel_match":True,
      "context_loss_fallback_and_restore":True,"reduced_motion_rebuild":True,
      "chapters_menu_viewports":4,"console_errors":errors,"source_pixels":page.locator('.v2-artifact-color').evaluate("e=>[e.naturalWidth,e.naturalHeight]")}
    (OUT/'surface-acceptance.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result,indent=2))
    browser.close()
