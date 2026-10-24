"""Material continuity, local grips and reversible accountability reconstruction."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright
from helpers import BASE_URL

OUT = Path(__file__).resolve().parents[2] / os.environ.get("II_OUTPUT_DIR", "output/playwright/material")
OUT.mkdir(parents=True, exist_ok=True)
engine = os.environ.get("II_BROWSER", "chromium")
POSE = """e=>({matrix:Array.from(new DOMMatrixReadOnly(getComputedStyle(e).transform).toFloat64Array(),n=>Math.round(n*10000)/10000),opacity:getComputedStyle(e).opacity,d:e.querySelector('path').getAttribute('d')})"""
with sync_playwright() as p:
    opts = {"headless": True}
    if os.environ.get("II_BROWSER_EXECUTABLE"):
        opts["executable_path"] = os.environ["II_BROWSER_EXECUTABLE"]
    b = getattr(p, engine).launch(**opts)
    g = b.new_page(viewport={"width": 1440, "height": 900})
    errors = []
    g.on("pageerror", lambda e: errors.append(str(e)))
    g.on("console", lambda e: errors.append(e.text) if e.type == "error" else None)

    def load():
        g.goto(BASE_URL + "/")
        g.locator("canvas[data-surface-ready=true]").wait_for(state="attached")
        g.evaluate("document.fonts.ready")

    def seek(t):
        g.evaluate("t=>scrollTo(0,(document.querySelector('.v2-scroll').offsetHeight-innerHeight)*t/140)", t)
        g.wait_for_function("t=>Math.abs(+document.querySelector('main').dataset.progress-t/140)<.0002", arg=t)
        g.wait_for_timeout(100)

    def frame_bounds(w, h):
        # Use the SVG viewport and its one-unit path inset. Stroke-expanded path
        # boxes differ between browser APIs, especially with vector-effect.
        r = g.locator(".v2-photo-focus").evaluate("e=>{const r=e.getBoundingClientRect();return{x:r.x+r.width/430,y:r.y+r.height/287,width:r.width*428/430,height:r.height*285/287}}")
        detail = g.locator(".v2-photo-focus").evaluate("e=>({style:e.getAttribute('style'),d:e.querySelector('path').getAttribute('d'),photo:e.parentElement.getBoundingClientRect().toJSON()})")
        top = 72 if w <= 700 else 18
        assert abs(r["x"] - 18) < 2 and abs(r["y"] - top) < 2, (r, detail)
        assert abs(r["x"] + r["width"] - (w - 18)) < 2, r
        assert abs(r["y"] + r["height"] - (h - 18)) < 2, r

    load()
    anchor = g.locator(".v2-photo-focus").element_handle()
    # These two new material passages run from scroll alone, in both directions.
    pixels = {}
    for t in [32, 52, 55, 57, 59, 61, 79, 106, 118, 121, 124, 128, 140]:
        seek(t)
        pixels[t] = g.screenshot(path=str(OUT / f"{engine}-material-{t}.png"))
        assert anchor.evaluate("e=>e===document.querySelector('.v2-photo-focus')")
        if t in [55, 57, 59, 118, 121, 124]:
            assert g.locator(".v2-photo[data-surface-active]").count() == 1
            assert float(g.locator(".v2-photo-focus").evaluate("e=>getComputedStyle(e).opacity")) == 0
    for t in reversed(pixels):
        seek(t)
        assert g.screenshot() == pixels[t], f"Material reverse pixels changed at {t}"
    seek(32)
    f, s = [g.locator(selector).bounding_box() for selector in [".v2-photo-focus", ".v2-shell"]]
    assert all(abs(f[key] - s[key]) < 3 for key in ["x", "y", "width", "height"]), (f, s)
    # Different pick regions deform the enhanced surface while framing is the same.
    grips = []
    for name, yf in [("upper", .12), ("lower", .88)]:
        seek(79)
        g.get_by_role("button", name="Wide shore", exact=True).focus()
        g.keyboard.press("Enter")
        r = g.locator(".v2-photo").bounding_box()
        x, y = r["x"] + r["width"] * .15, r["y"] + r["height"] * yf
        g.mouse.move(x, y)
        g.mouse.down()
        for i in range(1, 13):
            g.mouse.move(x + 100 * i / 12, y)
            g.wait_for_timeout(25)
        assert g.locator(".v2-photo[data-surface-active]").count() == 1
        grips.append((g.locator(".v2-photo").get_attribute("data-framing"), g.screenshot(path=str(OUT / f"{engine}-grip-{name}.png"))))
        g.mouse.up()
        g.wait_for_timeout(800)
        assert g.locator(".v2-photo[data-surface-active]").count() == 0
    assert grips[0][0] == grips[1][0] and grips[0][1] != grips[1][1]
    # The strongest early grip must not push the image through its illustration.
    seek(57)
    r = g.locator(".v2-photo").bounding_box()
    x, y = r["x"] + r["width"] * .15, r["y"] + r["height"] * .12
    g.mouse.move(x, y)
    g.mouse.down()
    g.mouse.move(x + 260, y, steps=12)
    assert g.locator(".v2-photo[data-pressure]").count() == 1
    assert g.locator(".v2-touch-ui").evaluate("e=>getComputedStyle(e).opacity") == "0"
    g.mouse.up()
    g.wait_for_timeout(800)
    assert g.locator(".v2-photo[data-pressure]").count() == 0
    assert g.locator(".v2-touch-ui").evaluate("e=>getComputedStyle(e).opacity") == "1"

    layouts = {}
    for w, h in [(1440, 900), (768, 1024), (375, 667), (320, 568)]:
        g.set_viewport_size({"width": w, "height": h})
        load()
        seek(140)
        focus = g.locator(".v2-photo-focus")
        original = focus.evaluate(POSE)
        g.get_by_role("button", name="Why this image?", exact=True).click()
        g.wait_for_timeout(120)
        assert focus.evaluate(POSE)["matrix"] != original["matrix"]
        g.wait_for_timeout(900)
        frame_bounds(w, h)
        g.screenshot(path=str(OUT / f"{engine}-{w}x{h}-reconstructed.png"))
        g.get_by_role("button", name="Return to the photograph", exact=False).click()
        g.locator("dialog").wait_for(state="hidden")
        assert focus.evaluate(POSE) == original
        # Keyboard inspection and Escape are immediate and restore the scroll pose.
        g.get_by_role("button", name="Why this image?", exact=True).focus()
        g.keyboard.press("Enter")
        g.locator("dialog[open]").wait_for()
        frame_bounds(w, h)
        g.keyboard.press("Escape")
        g.locator("dialog").wait_for(state="hidden")
        assert focus.evaluate(POSE) == original
        # A programmatic/native scene change must not restore the old ending pose.
        g.get_by_role("button", name="Why this image?", exact=True).click()
        seek(106)
        assert not g.locator("dialog").evaluate("e=>e.open")
        assert float(focus.evaluate("e=>getComputedStyle(e).opacity")) > .7
        layouts[f"{w}x{h}"] = True
    # Resize returns to the photograph, retaining the ending; reopening fits.
    g.set_viewport_size({"width": 1440, "height": 900})
    load()
    seek(140)
    g.get_by_role("button", name="Why this image?", exact=True).click()
    g.wait_for_timeout(1000)
    g.set_viewport_size({"width": 1366, "height": 768})
    g.wait_for_timeout(350)
    assert not g.locator("dialog").evaluate("e=>e.open")
    assert abs(float(g.locator("main").get_attribute("data-progress")) - 1) < .001
    g.get_by_role("button", name="Why this image?", exact=True).focus()
    g.keyboard.press("Enter")
    g.locator("dialog[open]").wait_for()
    frame_bounds(1366, 768)
    r = g.locator(".v2-photo").bounding_box()
    assert r["y"] >= 0 and r["y"] + r["height"] <= 768
    g.set_viewport_size({"width": 1440, "height": 900})
    g.wait_for_timeout(350)
    assert not g.locator("dialog").evaluate("e=>e.open")
    g.get_by_role("button", name="Why this image?", exact=True).focus()
    g.keyboard.press("Enter")
    g.locator("dialog[open]").wait_for()
    frame_bounds(1440, 900)
    g.emulate_media(reduced_motion="reduce")
    g.wait_for_timeout(350)
    seek(140)
    g.get_by_role("button", name="Why this image?", exact=True).click()
    frame_bounds(1440, 900)
    g.keyboard.press("Escape")
    assert g.locator("canvas[data-surface-ready=true]").count() == 0
    assert not errors, errors
    result = {"engine": engine, "browser": b.version, "scroll_material_reverse_pixels": True,
              "shared_corner_node": True, "grip_region_changes_surface": True,
              "pressure_yields_illustrative_controls": True,
              "inspection_opens_and_reverses_geometry": True, "keyboard_and_reduced_motion": True,
              "act_change_restores_correct_pose": True, "resize_returns_to_photo_and_reopens_fitted": True,
              "inspection_viewports": layouts, "errors": errors}
    (OUT / f"{engine}-material.json").write_text(json.dumps(result, indent=2))
    print(json.dumps(result, indent=2))
    b.close()
