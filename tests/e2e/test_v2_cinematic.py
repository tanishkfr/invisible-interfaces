"""Five-act beta: continuity, native input, restoration, accessibility and profiling.

II_BASE_URL chooses the production export. II_BROWSER=firefox selects a second
engine. II_RECORD_VIDEO=0 skips recording. Artifacts stay local.
"""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright
from helpers import BASE_URL

OUT = Path(__file__).resolve().parents[2] / os.environ.get("II_OUTPUT_DIR", "output/playwright/phase2")
OUT.mkdir(parents=True, exist_ok=True)
ENGINE = os.environ.get("II_BROWSER", "chromium")
RECORD = os.environ.get("II_RECORD_VIDEO", "1" if ENGINE == "chromium" else "0") == "1"
TIMES = [0, 8, 11.5, 14, 18, 24, 26, 27, 32, 36, 43, 47, 48, 50, 53, 54, 55, 59, 61, 64, 67, 70, 73, 76, 79, 80, 84, 86, 87, 88, 90, 93, 94, 96, 98, 99, 102, 104, 106, 112, 113, 116, 118, 124, 128, 132, 140]
RESTS = [(11.5,"0"),(32,"1"),(79,"2"),(106,"3"),(140,"4")]
PROFILE_INIT = """window.__v2Profile={longTasks:[],shifts:[]};
if(PerformanceObserver.supportedEntryTypes.includes('longtask'))new PerformanceObserver(list=>{
  for(const e of list.getEntries())window.__v2Profile.longTasks.push({start:e.startTime,duration:e.duration});
}).observe({type:'longtask',buffered:true});
if(PerformanceObserver.supportedEntryTypes.includes('layout-shift'))new PerformanceObserver(list=>{
  for(const e of list.getEntries())if(!e.hadRecentInput)window.__v2Profile.shifts.push(e.value);
}).observe({type:'layout-shift',buffered:true});"""
SNAPSHOT = """() => {
  const root=document.querySelector('main');
  return {act:root.dataset.act,progress:+root.dataset.progress,
    styles:['.v2-world','.v2-shell','.v2-photo','.v2-dither','.v2-color',
      '.v2-context-one','.v2-context-two','.v2-context-three','.v2-memory-query',
      '.v2-query-completion','.v2-final','.v2-header','.v2-terminal-copy',
      '.v2-window-bar','.v2-touch-ui','.v2-photo-focus'].map(s=>{
        const c=getComputedStyle(document.querySelector(s));
        const m=new DOMMatrixReadOnly(c.transform==='none'?undefined:c.transform);
        // The interiors inherit the tested photo radius. WebKit can cache that
        // computed inherited value while an interior is invisible; compare the
        // owning photo's actual radius rather than a second derived value.
        const radius=s==='.v2-dither'||s==='.v2-color'?'inherited':c.borderRadius;
        return [Array.from(m.toFloat64Array(),n=>Math.round(n*100000)/100000),c.opacity,c.visibility,radius,c.clipPath];
      })};
}"""


def scrub(page,time):
    page.evaluate("t=>scrollTo(0,(document.querySelector('.v2-scroll').offsetHeight-innerHeight)*t/140)",time)
    page.wait_for_function("t=>Math.abs(+document.querySelector('main').dataset.progress-t/140)<.0002",arg=time)
    # GSAP can batch CSS writes until the ticker after a media-context rebuild.
    page.wait_for_timeout(50)
    return page.evaluate(SNAPSHOT)


def load(page,suffix=""):
    page.goto(BASE_URL+"/v2"+suffix)
    page.locator('[data-ready="true"]').wait_for()
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(150)


results={"base_url":BASE_URL,"engine":ENGINE,"viewports":{},"limitations":["Physical phones and trackpads were not tested.","rAF cadence and trace metrics do not prove display-presented smoothness."]}
with sync_playwright() as p:
    executable=os.environ.get("II_BROWSER_EXECUTABLE")
    browser=getattr(p,ENGINE).launch(headless=True,**({"executable_path":executable} if executable else {}))
    results["browser"]=browser.version
    if executable:results["browser_executable"]=executable
    errors=[]
    page=browser.new_page(viewport={"width":1440,"height":900})
    page.add_init_script(PROFILE_INIT)
    page.on("pageerror",lambda error:errors.append(str(error)))
    load(page)
    anchor=page.locator('[data-persistent-artifact="beach"]').element_handle()
    baseline={str(t):scrub(page,t) for t in TIMES}
    for t in reversed(TIMES):
        state=scrub(page,t)
        assert state["styles"]==baseline[str(t)]["styles"],f"Reverse mismatch at {t}"
        assert anchor.evaluate("e=>e===document.querySelector('[data-persistent-artifact]')")
    for t in [106,18,140,43,24,79,0,116,32,90,67]:
        assert scrub(page,t)["styles"]==baseline[str(t)]["styles"],f"Fast scrub mismatch at {t}"
    results.update(deterministic_states=len(TIMES),persistent_dom_anchor=True,repeated_fast_scrub=True)
    assert baseline["61"]["styles"][2][0]!=baseline["67"]["styles"][2][0]
    assert baseline["106"]["styles"][5][1]=="1" and baseline["106"]["styles"][6][1]=="1"
    assert baseline["140"]["styles"][3][1]=="1" and baseline["140"]["styles"][4][1]=="1"
    assert baseline["140"]["styles"][11][2]=="hidden"
    results["gesture_context_and_absence"]=True
    assert baseline['102']['styles'][4][2]=='visible'
    assert '100%' in baseline['102']['styles'][9][4]
    results['photograph_settles_before_query_completion']=True
    # The photograph identifies its subject before the authored query appears.
    assert float(baseline['99']['styles'][-1][1]) > .7
    assert baseline['99']['styles'][8][1] == '0'
    assert baseline['99']['styles'][2][0][0] > baseline['106']['styles'][2][0][0]
    results['subject_recognition_precedes_query']=True

    scrub(page,0)
    for _ in range(8):page.mouse.wheel(0,120);page.wait_for_timeout(35)
    assert page.evaluate("scrollY>400")
    for _ in range(20):page.mouse.wheel(0,12);page.wait_for_timeout(16)
    results["wheel_and_small_delta_input"]=True
    scrub(page,96);before=page.evaluate(SNAPSHOT)
    # Let native scroll history settle after the preceding wheel transaction.
    # WebKit otherwise reloads the old (zero) entry despite the new visual pose.
    page.wait_for_timeout(300)
    page.reload();page.locator('[data-ready="true"]').wait_for()
    page.wait_for_function("Math.abs(+document.querySelector('main').dataset.progress-96/140)<.001")
    # The DOM image is the immediate fallback while the optional shader warms.
    # Compare completed enhanced restoration when the pre-reload pose used it.
    if before['styles'][3][2]=='hidden':
        page.locator('canvas[data-surface-ready="true"]').wait_for(state='attached')
        page.wait_for_timeout(50)
    restored=page.evaluate(SNAPSHOT)
    refresh_mismatches=[{"index":i,"before":b,"after":a} for i,(a,b) in enumerate(zip(restored['styles'],before['styles'])) if a!=b]
    assert not refresh_mismatches,f"Refresh mismatch: {json.dumps(refresh_mismatches)}"
    results["refresh_in_transition"]=True
    load(page,"#touch");page.wait_for_function("document.querySelector('main').dataset.act==='2'")
    results["direct_hash_entry"]=True
    page.set_viewport_size({"width":390,"height":844});page.wait_for_timeout(250);scrub(page,79)
    page.set_viewport_size({"width":1440,"height":900});page.wait_for_timeout(250)
    assert scrub(page,79)["styles"]==baseline["79"]["styles"]
    results["resize_rebuild"]=True
    for width,height in [(1440,900),(1366,768),(1280,800),(932,908),(768,1024),(390,844),(375,844),(375,667),(320,667),(320,650),(320,568)]:
        page.set_viewport_size({"width":width,"height":height});load(page)
        for t in TIMES:
            scrub(page,t)
            assert page.evaluate("document.documentElement.scrollWidth<=innerWidth"),f"Overflow: {width}/{height}/{t}"
        results["viewports"][f"{width}x{height}"]={"no_overflow":True,"states":len(TIMES)}

    page.set_viewport_size({"width":1440,"height":900});load(page)
    page.locator('.v2-chapters summary').click()
    page.get_by_role("link",name="03 The Gesture Touch").focus();page.keyboard.press("Enter")
    page.wait_for_function("Math.abs(+document.querySelector('main').dataset.progress-79/140)<.001")
    assert page.locator('[aria-current="step"]').get_attribute("data-act-link")=="2"
    assert not page.locator('.v2-chapters').evaluate("e=>e.open")
    page.locator('.v2-chapters summary').click();page.keyboard.press("Escape")
    assert not page.locator('.v2-chapters').evaluate("e=>e.open")
    assert page.locator('.v2-chapters summary').evaluate("e=>e===document.activeElement")
    assert page.locator('.v2-progress').count()==0
    results["keyboard_chapters"]=True
    scrub(page,140)
    page.get_by_role("link",name="Bring the context back").focus();page.keyboard.press("Enter")
    page.wait_for_function("Math.abs(+document.querySelector('main').dataset.progress-106/140)<.001")
    assert page.locator('.v2-context-three').evaluate("e=>+getComputedStyle(e).opacity")==1
    assert page.get_by_role("link",name="Bring the context back").is_hidden()
    results["accountability_return"]=True
    page.emulate_media(reduced_motion="reduce");page.wait_for_timeout(250)
    for t,act in RESTS:
        state=scrub(page,t)
        assert state["act"]==act
        page.screenshot(path=str(OUT/f"{ENGINE}-reduced-{act}.png"))
        mismatches=[{"index":i,"expected":b,"actual":a} for i,(a,b) in enumerate(zip(state['styles'],baseline[str(t)]['styles'])) if a!=b]
        assert not mismatches,f"Reduced composition mismatch: {act}: {json.dumps(mismatches)}"
    assert scrub(page,33)["styles"]==scrub(page,40)["styles"]
    page.emulate_media(reduced_motion="no-preference");page.wait_for_timeout(250)
    assert scrub(page,79)["styles"]==baseline["79"]["styles"]
    results["reduced_motion_and_cleanup"]=True
    scrub(page,140);page.mouse.wheel(0,1000);page.wait_for_timeout(200)
    assert page.locator('.v2-viewport').evaluate("e=>e.getBoundingClientRect().top < -500")
    results["native_scroll_release"]=True
    load(page);page.keyboard.press("Tab")
    if ENGINE=="webkit" and page.evaluate("document.activeElement.textContent")!="Skip animation and read the story":
        results["limitations"].append("Windows WebKit native Tab policy skipped links; skip was explicitly focused, then activated with Enter. Native link tab order remains unverified.")
        page.get_by_role("link",name="Skip animation and read the story").focus()
    assert page.evaluate("document.activeElement.textContent")=="Skip animation and read the story"
    page.keyboard.press("Enter")
    assert page.evaluate("document.activeElement.id")=="v2-reading"
    page.get_by_role("link",name="Experience again").click()
    page.wait_for_function("Math.abs(+document.querySelector('main').dataset.progress-11.5/140)<.001")
    scrub(page,96);page.wait_for_timeout(300);page.reload();page.locator('[data-ready="true"]').wait_for()
    page.wait_for_function("Math.abs(+document.querySelector('main').dataset.progress-96/140)<.001")
    results["skip_replay_and_restoration_after_chapter_jump"]=True

    if ENGINE=="chromium":
        mobile=browser.new_context(viewport={"width":390,"height":844},is_mobile=True,has_touch=True,device_scale_factor=1)
        phone=mobile.new_page();load(phone);touch=mobile.new_cdp_session(phone)
        touch.send("Input.dispatchTouchEvent",{"type":"touchStart","touchPoints":[{"x":195,"y":670}]})
        for y in [620,540,460,380,280]:
            touch.send("Input.dispatchTouchEvent",{"type":"touchMove","touchPoints":[{"x":195,"y":y}]});phone.wait_for_timeout(35)
        touch.send("Input.dispatchTouchEvent",{"type":"touchEnd","touchPoints":[]});phone.wait_for_timeout(250)
        assert phone.evaluate("scrollY>150")
        results["emulated_touch_scroll"]=True;mobile.close()

    load(page)
    cdp=page.context.new_cdp_session(page) if ENGINE=="chromium" else None
    if cdp:
        cdp.send("Performance.enable")
        before_metrics={m["name"]:m["value"] for m in cdp.send("Performance.getMetrics")["metrics"]}
    results["scroll_profile"]=page.evaluate("""() => new Promise(resolve=>{
      const intervals=[];let previous,start;const span=document.querySelector('.v2-scroll').offsetHeight-innerHeight;
      const profileStart=performance.now();
      function tick(now){if(!start)start=now;if(previous)intervals.push(now-previous);previous=now;
        const p=Math.min(1,(now-start)/10000);scrollTo(0,span*p);
        if(p<1)requestAnimationFrame(tick);else{
          intervals.sort((a,b)=>a-b);const median=intervals[Math.floor(intervals.length/2)];
          const tasks=window.__v2Profile.longTasks.filter(t=>t.start>=profileStart);
          resolve({samples:intervals.length,median_ms:median,p95_ms:intervals[Math.floor(intervals.length*.95)],
            max_ms:intervals.at(-1),over_33ms:intervals.filter(t=>t>33.4).length,
            estimated_missed_vsyncs:intervals.reduce((n,t)=>n+Math.max(0,Math.round(t/median)-1),0),
            long_tasks:tasks,layout_shift_score:window.__v2Profile.shifts.reduce((a,b)=>a+b,0)});
        }}requestAnimationFrame(tick);
    })""")
    if cdp:
        after_metrics={m["name"]:m["value"] for m in cdp.send("Performance.getMetrics")["metrics"]}
        results["scroll_trace_metrics"]={name:after_metrics[name]-before_metrics[name] for name in ["LayoutCount","RecalcStyleCount","LayoutDuration","RecalcStyleDuration","ScriptDuration","TaskDuration"]}
        results["js_heap_bytes"]=after_metrics["JSHeapUsedSize"]
    if RECORD:
        film_context=browser.new_context(viewport={"width":1440,"height":900},record_video_dir=str(OUT/"video"),record_video_size={"width":1440,"height":900})
        film=film_context.new_page();load(film)
        film.evaluate("""() => new Promise(resolve=>{let start;
          const span=document.querySelector('.v2-scroll').offsetHeight-innerHeight;
          function frame(now){if(!start)start=now;const elapsed=(now-start)/1000;
            const p=elapsed<2?0:elapsed<34?(elapsed-2)/32:elapsed<37?1:Math.max(0,1-(elapsed-37)/18);
            scrollTo(0,span*p);if(elapsed<57)requestAnimationFrame(frame);else resolve();
          }requestAnimationFrame(frame);
        })""")
        video=film.video;film_context.close();video.save_as(str(OUT/f"{ENGINE}-five-act-walkthrough.webm"))
        results["video"]=f"output/playwright/phase2/{ENGINE}-five-act-walkthrough.webm"
    results["page_errors"]=errors
    assert not errors
    browser.close()
(OUT/f"{ENGINE}-verification.json").write_text(json.dumps(results,indent=2),encoding="utf-8")
print(json.dumps(results,indent=2))
