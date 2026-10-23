"""Capture transition boundaries and flag unintended overlap in resting scenes.

Flags are reviewed against actual screenshots; intended spatial occlusion during
camera travel is not treated as a text-layout defect.
"""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright
from helpers import BASE_URL

OUT = Path(__file__).resolve().parents[2] / os.environ.get("II_OUTPUT_DIR", "output/playwright/phase2") / "layout"
OUT.mkdir(parents=True, exist_ok=True)
TIMES = [0, 11.5, 18, 24, 26, 32, 43, 48, 50, 53, 59, 61, 64, 67, 70, 73, 76, 79, 84, 87, 88, 90, 93, 94, 96, 98, 99, 102, 104, 106, 116, 120, 124, 128, 140]
VIEWPORTS = [(1440,900),(1366,768),(1280,800),(932,908),(768,1024),(390,844),(375,844),(375,667),(320,667),(320,650),(320,568)]
BOUNDS = """() => {
  const selectors=['.v2-header','.v2-chapters','.v2-navigation','.v2-intro','.v2-thought-0',
    '.v2-thought-1','.v2-thought-2','.v2-thought-3','.v2-final','.v2-photo',
    '.v2-touch-heading','.v2-touch-caption','.v2-memory-index','.v2-memory-query',
    '.v2-context-one','.v2-context-two','.v2-context-three','.v2-shell','.v2-scroll-cue'];
  return selectors.map(selector=>{
    const e=document.querySelector(selector);
    let r=e.getBoundingClientRect();
    // Inspect the actual touch title/caption ink, not the empty full-width
    // flex box that deliberately surrounds a tilted moving photograph.
    if(selector==='.v2-touch-heading'||selector==='.v2-touch-caption'){
      const range=document.createRange();
      range.selectNodeContents(selector==='.v2-touch-heading'?e.querySelector('span'):e.firstChild);
      r=range.getBoundingClientRect();
    }
    let opacity=1,n=e;while(n && n!==document.querySelector('main')){
      const c=getComputedStyle(n);opacity*=+c.opacity;
      if(c.display==='none'||c.visibility==='hidden')opacity=0;n=n.parentElement;
    }
    if(selector==='.v2-photo')opacity*=Math.max(...[...e.querySelectorAll('div')].map(n=>+getComputedStyle(n).opacity));
    // Closed native details content can retain a layout box without being drawn.
    if(selector==='.v2-navigation'&&!e.closest('details').open)opacity=0;
    return {selector,opacity,x:r.x,y:r.y,width:r.width,height:r.height,
      right:r.right,bottom:r.bottom};
  });
}"""


def intersect(a,b):
    return min(a["right"],b["right"])-max(a["x"],b["x"])>2 and min(a["bottom"],b["bottom"])-max(a["y"],b["y"])>2


report = {}
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for width,height in VIEWPORTS:
        page=browser.new_page(viewport={"width":width,"height":height})
        page.goto(BASE_URL+"/v2")
        page.locator('[data-ready="true"]').wait_for()
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(200)
        flags=[]
        for time in TIMES:
            page.evaluate("t=>scrollTo(0,(document.querySelector('.v2-scroll').offsetHeight-innerHeight)*t/140)",time)
            page.wait_for_function("t=>Math.abs(+document.querySelector('main').dataset.progress-t/140)<.0002",arg=time)
            page.wait_for_timeout(40)
            page.screenshot(path=str(OUT/f"{width}x{height}-{time:05.1f}.png"))
            if time not in [0,11.5,32,48,53,59,61,64,67,70,73,76,79,87,88,90,93,94,96,98,99,102,104,106,128,140]:continue
            bounds=[b for b in page.evaluate(BOUNDS) if b['opacity']>.8 and b['width']>0 and b['height']>0]
            for i,a in enumerate(bounds):
                if a['selector']=='.v2-shell' and time not in [0,11.5,32,59,67,72,79]:continue
                if a['x'] < -2 or a['right'] > width+2 or a['y'] < -2 or a['bottom']>height+2:
                    flags.append({"time":time,"kind":"clipped","selector":a['selector'],"bounds":a})
                for b in bounds[i+1:]:
                    # The chapter disclosure intentionally occupies the header.
                    if set([a['selector'],b['selector']])==set(['.v2-header','.v2-chapters']):continue
                    if '.v2-shell' in [a['selector'],b['selector']]:
                        other=b if a['selector']=='.v2-shell' else a
                        if other['selector'] not in ['.v2-intro','.v2-header','.v2-navigation','.v2-scroll-cue'] and not other['selector'].startswith('.v2-thought'):continue
                    if intersect(a,b):flags.append({"time":time,"kind":"overlap","a":a['selector'],"b":b['selector']})
        report[f"{width}x{height}"]=flags
        page.close()
    browser.close()
(OUT/"layout-flags.json").write_text(json.dumps(report,indent=2),encoding="utf-8")
print(json.dumps(report,indent=2))
