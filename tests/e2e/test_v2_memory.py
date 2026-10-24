"""Visitor framing, connected release, accountable ending and mobile input."""
import json,os
from pathlib import Path
from playwright.sync_api import sync_playwright
from helpers import BASE_URL
OUT=Path(__file__).resolve().parents[2]/os.environ.get('II_OUTPUT_DIR','output/playwright/lived-memory')
OUT.mkdir(parents=True,exist_ok=True)
engine=os.environ.get('II_BROWSER','chromium')
views=[(1440,900),(1366,768),(1280,800),(932,908),(768,1024),(390,844),(375,844),(375,667),(320,667),(320,650),(320,568)]
with sync_playwright() as p:
 opts={'headless':True}
 if os.environ.get('II_BROWSER_EXECUTABLE'):opts['executable_path']=os.environ['II_BROWSER_EXECUTABLE']
 b=getattr(p,engine).launch(**opts);g=b.new_page(viewport={'width':1440,'height':900});errors=[]
 g.on('pageerror',lambda e:errors.append(str(e)))
 g.on('console',lambda e:errors.append(e.text) if e.type=='error' else None)
 def load():
  g.goto(BASE_URL+'/v2');g.locator('main[data-ready=true]').wait_for();g.evaluate('document.fonts.ready');g.wait_for_timeout(200)
 def seek(t):
  g.evaluate('t=>scrollTo(0,(document.querySelector(".v2-scroll").offsetHeight-innerHeight)*t/140)',t)
  g.wait_for_function('t=>Math.abs(+document.querySelector("main").dataset.progress-t/140)<.0002',arg=t);g.wait_for_timeout(100)
 def zoom():return float(g.locator('.v2-photo').get_attribute('data-framing'))
 def inspect():
  g.get_by_role('button',name='Why this image?',exact=True).click();g.locator('dialog[open]').wait_for();g.wait_for_timeout(950)
 def close():
  g.keyboard.press('Escape');g.locator('dialog').wait_for(state='hidden');assert g.get_by_role('button',name='Why this image?',exact=True).evaluate('e=>e===document.activeElement')
 load();seek(140);inspect();assert g.locator('.v2-inspection-reset').is_disabled();assert g.locator('.v2-inspection-framing').inner_text()=='The original shore.';close()
 seek(79);g.get_by_role('button',name='Closer to the boat',exact=True).focus();g.keyboard.press('Enter');assert zoom()>1.47
 assert 'pinch-zoom' in g.locator('.v2-photo').evaluate('e=>getComputedStyle(e).touchAction')
 assert g.get_by_role('button',name='Closer to the boat',exact=True).get_attribute('aria-pressed')=='true'
 states={}
 for t in [79,87,94,96,98,99,102,106,140]:seek(t);states[t]=zoom()
 assert states[87]<1.03 and states[99]>1.3 and states[106]>1.47 and states[140]==1
 for t in reversed(states):seek(t);assert abs(zoom()-states[t])<.001
 seek(96);pixels=g.screenshot();seek(106);seek(96);assert pixels==g.screenshot()
 seek(106);assert g.locator('.v2-context-three p').inner_text()=='Your framing, resurfaced.'
 seek(140);inspect();y=g.evaluate('scrollY');g.mouse.wheel(0,800);g.wait_for_timeout(200);assert abs(g.evaluate('scrollY')-y)<2
 for _ in range(5):g.keyboard.press('Tab');assert g.locator('dialog').evaluate('e=>e.contains(document.activeElement)')
 close();assert abs(g.evaluate('scrollY')-y)<2
 # A real mouse drag changes the same state as the keyboard controls.
 seek(79);g.get_by_role('button',name='Wide shore',exact=True).focus();g.keyboard.press('Enter');r=g.locator('.v2-photo').bounding_box();x=r['x']+r['width']*.35;y=r['y']+r['height']*.5
 g.mouse.move(x,y);g.mouse.down();g.mouse.move(x+150,y,steps=10);g.mouse.up();assert zoom()>1.2
 # Framing survives responsive and preference rebuilds.
 g.set_viewport_size({'width':375,'height':667});g.wait_for_timeout(300);seek(106);assert zoom()>1.2
 g.emulate_media(reduced_motion='reduce');g.wait_for_timeout(500);seek(106);assert zoom()>1.2;assert g.locator('canvas[data-surface-ready=true]').count()==0
 seek(140);inspect();g.locator('.v2-inspection-reset').click();assert g.locator('.v2-inspection-reset').is_disabled();assert g.locator('.v2-inspection-close').evaluate('e=>e===document.activeElement');close();seek(106);assert zoom()==1
 g.emulate_media(reduced_motion='no-preference');g.wait_for_timeout(350)
 # Both selected and original inspection compositions must fit all viewports.
 layout={}
 for w,h in views:
  g.set_viewport_size({'width':w,'height':h});load();seek(79);g.get_by_role('button',name='Closer to the boat',exact=True).focus();g.keyboard.press('Enter');seek(140);inspect()
  boxes=g.locator('dialog header, dialog section, dialog footer, .v2-photo').evaluate_all('es=>es.map(e=>{const r=e.getBoundingClientRect();return {name:e.className||e.tagName,x:r.x,y:r.y,right:r.right,bottom:r.bottom}})')
  for i,a in enumerate(boxes):
   assert a['x']>=-2 and a['y']>=-2 and a['right']<=w+2 and a['bottom']<=h+2,(w,h,a)
   for z in boxes[i+1:]:assert min(a['right'],z['right'])-max(a['x'],z['x'])<=2 or min(a['bottom'],z['bottom'])-max(a['y'],z['y'])<=2,(w,h,a,z)
  assert g.locator('dialog').evaluate('e=>e.scrollHeight')<=h+2
  g.screenshot(path=str(OUT/f'{engine}-{w}x{h}-inspection.png'));layout[f'{w}x{h}']=True
  g.get_by_role('button',name='Return to the photograph',exact=False).click();g.locator('dialog').wait_for(state='hidden');seek(106);assert zoom()>1.47
  g.reload();g.locator('main[data-ready=true]').wait_for();seek(106);assert zoom()==1
 # Chromium touch: horizontal manipulation and vertical native scrolling coexist.
 touch=False
 if engine=='chromium':
  c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);m=c.new_page();m.goto(BASE_URL+'/v2');m.locator('main[data-ready=true]').wait_for();m.evaluate('scrollTo(0,(document.querySelector(".v2-scroll").offsetHeight-innerHeight)*79/140)');m.wait_for_timeout(250)
  r=m.locator('.v2-photo').bounding_box();x=r['x']+r['width']*.3;y=r['y']+r['height']*.5;cdp=c.new_cdp_session(m)
  cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
  for i in range(1,9):cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+i*12,'y':y}]});m.wait_for_timeout(20)
  cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});assert float(m.locator('.v2-photo').get_attribute('data-framing'))>1.15
  before=m.evaluate('scrollY');cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
  for i in range(1,8):cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y-i*15}]});m.wait_for_timeout(25)
  cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});m.wait_for_timeout(300);assert m.evaluate('scrollY')>before+20;touch=True;c.close()
 assert not errors,errors
 result={'browser':b.version,'engine':engine,'keyboard_framing':True,'real_mouse_drag':True,'remembered_reverse_states':states,'remembered_reverse_pixels':True,'inspection_focus_trap_escape_and_scroll_restore':True,'resize_and_reduced_motion_memory':True,'reset_and_reload_clear_memory':True,'inspection_layouts':layout,'emulated_touch_drag_and_native_scroll':touch,'page_and_console_errors':errors}
 b.close();(OUT/f'{engine}-memory.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
