# Elevation Plan — Invisible Interfaces → 10/10

Source: jury review (2026-07-09). Each phase is self-contained and executable in a
fresh session. Execute in order; Phases 1–2 unblock the most value.

Repo root: `C:\Vibe Coding\Real Stuff\PORTFOLIO\Interaction Museum`
Live repo: https://github.com/tanishkfr/invisible-interfaces

---

## Phase 0 — Verified Facts, APIs, and Hazards (read before every phase)

### Allowed APIs (verified in this codebase — do not invent others)

From `motion/react` (v12, already in package.json):
- `m.<element>` components ONLY — the app is wrapped in
  `<LazyMotion features={domAnimation} strict>` (components/Experience.tsx).
  **Importing `motion.<el>` anywhere throws in strict mode.**
- `useScroll({ target: ref, offset: ["start start", "end end"] })` → `scrollYProgress`
- `useTransform(value, inputArr, outputArr)` and `useTransform(value, fn)`
- `useMotionValueEvent(value, "change", cb)` (pattern: Scene3Remembering.tsx)
- `useReducedMotion()`, `useInView(ref, { once, amount })`, `AnimatePresence mode="wait"`
- Motion values as children render live (pattern: `typed` in Scene2Simplification.tsx)

### Hazards discovered and fixed in this codebase (do not regress)

1. **WAAPI scroll-promotion desync**: any *direct array* `useTransform` of a
   scrollYProgress gets promoted to a hardware ViewTimeline animation whose range
   differs from our offsets → silently wrong values. EVERY scroll-driven scene pipes
   through a function transform first:
   `const progress = useTransform(scrollYProgress, (v) => ...)`.
   Pattern + explanatory comment: Scene2Simplification.tsx (`const progress =`).
   New scroll work MUST reuse this pattern. Verify with the WAAPI sweep (below).
2. **Never run `npm run build` while the dev server is running** — corrupts `.next`
   (dev serves 404s for its own chunks). Stop dev first.
3. **Impure state updaters double-fire under StrictMode** — never call a setState
   inside another updater (bug history: Scene1Terminal commitTyping).
4. **Scene 0 storyboard clock** starts on first visibility (`witnessed` state), not
   mount. Preserve when editing Scene0Forgotten.tsx.
5. `sessionStorage` key `ii.commands` is written by Scene1Terminal on solve and read
   by Scene3Remembering MemoryBeat *lazily* (when the beat is reached).

### Project structure (all paths repo-relative)

- Copy/content: `content/scenes.ts` (ALL visitor-facing text; typed exports:
  `opening`, `terminal`, `simplification`, `remembering`, `threshold`, `background`,
  `epilogue`, `sceneTitles`, `fragments`)
- Tokens: `app/globals.css` (CSS vars), spec in `VISUAL_SYSTEM.md`
- Scenes: `components/scenes/Scene{0..5}*.tsx`, `Epilogue.tsx`
- Systems: `components/systems/MachineText.tsx` (teletype primitive)
- Artifacts: `components/artifacts/Fragments.tsx` (8 miniatures), `BeachPhoto.tsx`
- Chrome: `components/chrome/ChromeRail.tsx` (tick rail, decays via journey progress)
- Shell: `components/Experience.tsx` (LazyMotion wrapper, IntersectionObserver
  active-scene tracking via `[data-scene]` sections, rootMargin "-50% 0px -50% 0px")
- Governance: `director.md` (unchangeable: thesis, scene order, tone),
  `spec.md` (scene definitions), `claude.md` (priorities)

### E2E test patterns (python + playwright, sync API)

Working scripts exist in the session scratchpad; Phase 1 commits them to `tests/e2e/`.
Canonical patterns to copy:
- Scroll-scrub a pinned section: compute
  `{top: rect.top + scrollY, span: rect.height - innerHeight}` then
  `scrollTo(0, top + span * p)` — see test_pins.py / test_morph.py.
- Drive the terminal: `locator('input').fill(cmd)` + `press("Enter")` — test_terminal.py.
- Effective-opacity check walks parent chain multiplying opacities (test_pins.py).
- **WAAPI sweep** (must stay 0):
  `[...document.querySelectorAll('main *')].reduce((n,e) => n + e.getAnimations()
  .filter(a => !a.animationName && a.timeline && a.timeline.constructor.name !==
  'DocumentTimeline').length, 0)`
- Reduced motion: `browser.new_page(reduced_motion="reduce")`.

### Governance constraints (from director.md — require explicit approval to change)

- Scene ORDER may not change → the era-order critique (search vs touch) is resolved
  with overlapping year markers + honest framing, NOT by reordering (Phase 2).
- No CTA/replay/newsletter at the end → colophon must be quiet and *after* the
  experience proper (Phase 6 spec).
- Accent (#E8A33D) budget: monotonically non-increasing after Scene 1; zero by
  Epilogue. New work may not add amber outside existing budget rules.

### Director inputs needed (collect once, before Phase 6)

- [ ] Deploy target (default: Vercel; GitHub Pages needs `basePath` — avoid)
- [ ] Byline name + links for the About page/colophon
- [ ] Approval of the Scene 5 question fold (7 → 5) — it edits scene *content*,
      not order/thesis

---

## Phase 1 — Exist & Survive (foundation + robustness quick wins)

**Goal:** the piece is deployed, its tests live in the repo, its best moment survives
a return visit, and the first 30 seconds can't break or lose a reviewer.

1. **Commit the E2E suite.** Create `tests/e2e/` and copy the five scratchpad scripts
   (terminal, morph, quiet, reflection/pins, m6 mobile+reduced-motion), parameterized
   by `BASE_URL` env var. Add `tests/README.md` with run instructions
   (`python -m pytest` not required — plain scripts are fine).
2. **Deploy to Vercel.** Static export already works (`out/`). `vercel` CLI or GitHub
   integration; no config beyond framework=Next.js. Verify the live URL renders
   Scene 0 and the terminal. Add the URL to the GitHub repo description + README.
3. **Memory survives return visits.** In Scene1Terminal.tsx (solve handler) and
   Scene3Remembering.tsx (MemoryBeat read): `sessionStorage` → `localStorage`, same
   key. A page that remembers you across visits is more on-thesis, not less.
4. **Scene 0 scroll-forward.** In Scene0Forgotten.tsx: while `phase !== "field"`, any
   scroll (progress > ~0.01) fast-forwards the storyboard — advance `setPhase` to the
   next TIMELINE beat and reveal remaining fragments on a compressed cadence (reuse
   the `reduced` fast path: it already implements "same sequence, less waiting").
   This simultaneously fixes the broken mid-opening scroll states and gives impatient
   reviewers a skip that stays in-fiction (the machine yields to your impatience).
   Also compress default choreography: line1 at 2500ms, gap 6500, line2 8300, field
   12000 (from 3000/8000/10000/15000) — total reveal ≤ ~19s untouched, ~6s if scrolled.
5. **Terminal mercy + abandonment path.** Scene1Terminal.tsx:
   - `IDLE_HINT` 18000 → 8000.
   - New: IntersectionObserver/useInView on the section; if the visitor scrolls past
     with `!done && booted`, print one line `STILL WAITING.` (voice: "machine") and
     set `localStorage["ii.abandoned"]="1"`.
   - content/scenes.ts additions: `terminal.stillWaiting`, and in `remembering.memory`
     an alternate self-reference: `selfReferenceAbandoned: "YOU NEVER FOUND THE
     PHOTOGRAPH. IT FOUND YOU ANYWAY."` MemoryBeat renders it when abandoned-flag set
     and no command count exists.

**Verification checklist**
- [ ] `tests/e2e/` runs green against the DEPLOYED URL (set BASE_URL).
- [ ] Reload mid-piece, revisit next session: Scene 3 callback still fires (localStorage).
- [ ] New test: load page, scroll immediately at t≈1s → within 8s all 8 fragments
      visible, no orphaned line1/line2 state, no console errors.
- [ ] New test: skip terminal without solving → `STILL WAITING.` printed; Scene 3
      shows abandoned variant.
- [ ] WAAPI sweep = 0. Lighthouse a11y still 100 on deployed URL.

**Anti-pattern guards:** no `motion.` imports; no new scroll transform without the
function-pipe; don't touch TIMELINE semantics for reduced-motion users (they already
get the compressed path — skip logic must not double-compress into 0ms).

---

## Phase 2 — The Evidence Layer (Scene 2 attention ledger + period accuracy)

**Goal:** the piece stops portraying simplification and starts *measuring* it.

1. **Instrument Scene 1 for time.** Scene1Terminal.tsx already tracks
   `state.current.commands`; add `startedAt` (first keystroke) and on solve write
   `localStorage["ii.seconds"]` alongside commands. Update the success line to spend
   it: `terminal.success` → `DISPLAYED. THAT TOOK ${n} COMMANDS AND ${s} SECONDS.`
2. **Attention ledger in Scene 2.** New in-stage element (Scene2Simplification.tsx,
   sibling of the era captions, mono `micro` type, positioned top-right of stage
   at ~(stage x 460–650, y 8), machine voice):
   - Per-era values (constants in content/scenes.ts `simplification.ledger`):
     terminal `{keys: "22", decisions: "7", time: "~90 SEC"}` — sourced from the
     visitor's OWN stored values when present (`ii.commands`/`ii.seconds`),
     else the defaults; GUI `{6 clicks, 4, ~20 SEC}`; touch `{1 tap, 1, ~5 SEC}`;
     search `{5 keys, 1, ~4 SEC}`; prediction `{0, 0, —}`.
   - Render as three stacked mono lines crossfading per era using the existing
     caption dead-zone pattern (`cap0O..cap3O` keys in Scene2Simplification.tsx) —
     copy that sequencing exactly; add a fifth window for prediction ending
     `ATTENTION: YOURS AGAIN.` (this line replaces the need for any editorial text).
   - All transforms derive from the existing `progress` value (already function-piped).
3. **Year markers.** Small mono year under each era caption, honest about overlap:
   `1978` / `1984` / `2007` / `1998 →` / `2010s →`. The search-era marker `1998 →`
   with caption unchanged acknowledges search predates touch as technology while the
   *sequence* stays the spec's interaction-paradigm order. One-line footnote goes on
   the About page (Phase 6), not in-scene.
4. **Period-accurate GUI era.** Rework the GUI dressing in Scene2Simplification.tsx
   (title bar + rows) toward Macintosh System ~1984 semantics: title bar with
   horizontal pinstripes flanking centered title, close box square left, list rows
   with underline-style column header ("Name  Size  Kind"), Chicago-adjacent feel
   approximated with existing Plex Mono (no new font — VISUAL_SYSTEM allows two faces
   only). Keep monochrome (color arrives with touch — preserved).
5. **Mobile morph stage.** Replace scale-to-fit-below-0.75 with a dedicated compact
   layout: when `scale < 0.75`, switch stage constants to a 360×560 coordinate table
   (second `P`-indexed geometry set for frame + entities; same code path, alternate
   constants) so mono text never renders below ~11px effective.

**Verification checklist**
- [ ] Solve terminal with 8 commands → scroll Scene 2 → terminal-era ledger shows
      YOUR 8 and YOUR seconds; fresh-profile run shows defaults.
- [ ] Ledger lines never overlap (copy the caption dead-zone assertions from
      tests/e2e/test_pins.py style: one ledger block visible per era plateau).
- [ ] Prediction era shows `ATTENTION: YOURS AGAIN.` and zero amber present.
- [ ] 375×812 viewport: morph text ≥11px computed; no horizontal scroll (extend m6 test).
- [ ] WAAPI sweep = 0; build clean.

**Anti-pattern guards:** ledger is machine voice — mono, dim, no color; do NOT add a
graph/meter visual (the review's "no meter" reasoning still holds — numbers only).
Do not reorder scenes. Don't introduce a pixel font dependency.

---

## Phase 3 — The Staged Disappearance (explicit chrome that actually dies)

**Goal:** make the meta-thesis experiencable: real chrome at the start, gone by the end.

1. **New `components/chrome/Header.tsx`**, rendered in Experience.tsx above scenes:
   a real, honest header at chrome level 1 — left: wordmark "INVISIBLE INTERFACES"
   (mono, micro, tracking wide); right: scene index menu "00 01 02 03 04 05" (real
   anchor buttons, keyboard focusable, scroll-to-section on click) + a thin progress
   underline. Fixed top, hairline bottom border (`--line`).
2. **Decay choreography** (drive from the existing function-piped `journey` value in
   Experience.tsx — copy the ChromeRail opacity pattern):
   - Scene 0–1: fully present (opacity 1) — visitors USE it (menu works).
   - Scene 2 (the simplification): border dissolves, menu numbers thin to ticks —
     the header simplifies in sympathy with the morph.
   - Scene 3: wordmark fades; only ticks + progress remain (≈ current ChromeRail).
   - Scene 4: ticks fade; hairline progress only.
   - Scene 5→Epilogue: nothing.
   Decay steps must be sub-threshold (many small keyframes, copy ChromeRail's key
   style) — discovered, never watched.
3. **Retire ChromeRail** (its role is absorbed; delete component + import) — or keep
   as the Scene-3+ residue of the header (preferred: the header's ticks ARE the rail,
   same DOM element throughout, so the disappearance is one continuous object).
4. **Accessibility invariant:** the nav REMAINS in the accessibility tree at full
   strength forever (visual opacity only; never `display:none`, never `aria-hidden`
   on the nav, `pointer-events` disabled only when fully invisible). This is the
   "invisible ≠ hidden" clause made structural.
5. Scene 0 nuance: header fades IN with the first statement (not present during the
   void — the void stays absolute), reaching full by the field phase.

**Verification checklist**
- [ ] t=0: no header (void). t≈4s: header visible. Menu click "03" scrolls to Scene 3.
- [ ] Screenshots at scene centers 0/2/4/Epilogue show monotonically less header;
      Epilogue shows zero chrome pixels (diff a 40px top strip against pure void).
- [ ] Keyboard: Tab reaches menu buttons at Scene 5 depth even though invisible is
      FALSE — buttons must be pointer-disabled + `tabIndex={-1}` once opacity < 0.05,
      BUT the landmark/heading structure stays (screen readers keep document nav via
      headings; the *visual* menu may leave the tab order when gone — this is the
      accessible-and-honest compromise; document it in code comment).
- [ ] axe/Lighthouse a11y 100 maintained.

**Anti-pattern guards:** header must never overlap the terminal or morph stage
(z-index below Scene-4 hold overlay; test at 800px height). No new fonts, no logo
glyph — the wordmark is set in Plex Mono. Do not animate `display`/layout — opacity
and letter-spacing only (Transform verb is reserved for Scene 2).

---

## Phase 4 — The Climax (Scene 4 coordination choreography)

**Goal:** the thesis's peak becomes a spatial, screenshot-able moment.

1. **Replace the log list** in Scene4Threshold.tsx with a choreography stage
   (~560×360, reuse the Scene 2 stage-scaling approach):
   - Six **system nodes**: small mono labels (CALENDAR, MAPS, TRAFFIC, WEATHER,
     RESERVATION, REMINDER) at fixed positions ringing the center (positions table
     like Scene 2's geometry constants). Each wakes in sequence (opacity 0.15 → 0.5,
     `--t-settle`) per the existing `linesShown` timeline (keep the state machine —
     phases `waiting/working/settled` are already correct).
   - **Threads**: SVG hairlines (stroke `--line`, 1px) connecting dependencies:
     CALENDAR→RESERVATION, MAPS→TRAFFIC→REMINDER, WEATHER→RESERVATION. Each thread
     draws via `pathLength` (0→1, `--t-settle`) when its downstream node wakes.
   - **Assembly**: each node emits its conclusion as a small mono fragment ("7:30",
     "25 MIN", "LEAVE 7:05") that travels (x/y transform, `--e-settle`) into the
     center and dissolves as the outcome sentence fades in — the sentence visually
     receives the system outputs.
   - At `settled`: nodes+threads dim to 0.12 (the current rest opacity), sentence at
     full. Hold-to-illuminate raises the whole stage to 0.95 — now re-exposing
     *structure*, not just brighter text. Keep existing hold handlers verbatim
     (pointer + space/enter, they're accessibility-correct).
2. All timeline animation here is TIME-based (m component `animate` props) — this is
   an event choreography, not scroll-scrub; no useScroll in this scene. Reduced
   motion: nodes/threads appear instantly at each step (duration 0), same sequence.
3. Content: node conclusions to `content/scenes.ts` (`threshold.nodes` with
   label/conclusion/position/dependencies), replacing the flat `systems` array;
   keep sr-friendly full sentences in a `<ul className="sr-only">` mirroring the old
   list so screen readers get the coordination as text.

**Verification checklist**
- [ ] Click intent → nodes wake in order → threads draw → fragments converge →
      sentence appears; total ≤ 6s; reduced-motion path ≤ 1.5s.
- [ ] Hold (mouse AND space) raises stage opacity to ~0.95 with thread structure
      visible; release returns to ~0.12 (extend test_quiet.py hold assertions).
- [ ] Screenshot at held state — this is the new portfolio screenshot; eyeball it.
- [ ] sr-only list present; aria-live outcome unchanged; no console errors.

**Anti-pattern guards:** no glow/blur/particles — luminance and hairlines only
(Illuminate verb is luminance-only per VISUAL_SYSTEM §10). No amber (Scene 4 budget:
the ⏎ chip already spends it). Threads are straight lines, not bezier flourishes.

---

## Phase 5 — The Photograph (fidelity system + Scene 3 staging)

**Goal:** the protagonist becomes a craft object; its fidelity becomes a second
thesis-carrier.

1. **New `components/artifacts/Photo.tsx`** with `era` prop, four renderings of the
   SAME composition (sun upper-left, sea band, shore) so recognition compounds:
   - `ascii`: the existing terminal art (from `terminal.files["BEACH.PIC"]`) — reuse.
   - `dither1bit`: 1-bit Atkinson-style dither look. Implementation: precompute once
     offline (small script) into an inline `<image>` data-URI PNG (~2–4KB) at 2×;
     no runtime canvas work. Monochrome — belongs to the GUI era.
   - `indexed`: 256-color posterized version (same pipeline, palette-quantized) —
     touch era's arrival-of-color, now with texture instead of flat vectors.
   - `full`: a refined SVG (keep vector, add gradient sky, softened wave forms,
     grain via feTurbulence at very low opacity) — prediction/memory eras.
   All ≤ ~6KB each; static-export-safe (data URIs, no next/image).
2. **Wire eras:** Scene 2 entity C photo layer: GUI row icon unchanged; touch tile →
   `indexed`; search result → `indexed`; prediction → `full`. Scene 3 MemoryBeat →
   `full`. Scene 5 example (if photo used) → `full`. Delete BeachPhoto.tsx after
   migration (grep for imports).
3. **Scene 3 staging:** MemoryBeat card grows to w-[24rem] (still fits 375px at
   grid-center), photo height 16rem; beats 1–3 keep 19rem — the homecoming reads
   larger than the forms. Give each beat its one compositional signature (cheap,
   type-level only): login card gets a fill-flash (existing amber-tint span already
   does this — keep); reply bubble tail + SUGGESTED label stagger (exists — keep);
   calendar slides 8px from left instead of bottom (one-line change) with source
   line letter-spacing settling from 0.2em → 0.14em.

**Verification checklist**
- [ ] Scrub Scene 2: photo texture visibly changes GUI→touch→prediction eras;
      screenshot each plateau.
- [ ] Total added asset weight ≤ 15KB gzipped (check build output delta).
- [ ] Scene 3 memory card larger than beat cards; mobile 375px: card fits, no h-scroll.
- [ ] No `BeachPhoto` imports remain (grep).

**Anti-pattern guards:** no runtime canvas/dither computation (perf + static export);
no photographic stock imagery (the piece's images are code); dither/posterize assets
must be generated from the SAME master composition, not redrawn variants.

---

## Phase 6 — Scholarship & The Ending (About page, colophon, Scene 5 cut, epilogue turn)

**Goal:** the argument gets its lineage; the reviewer gets a door; the ending gets
its turn. Requires the three Director inputs from Phase 0.

1. **Scene 5 fold (7 → 5).** In `content/scenes.ts` `background.questions`: fold
   TIMING into CONSENT (question: "When did you agree to this — and to when?") and
   EXPLAINABILITY into TRANSPARENCY ("Should you see the work? Could it explain
   itself?"). Scene5Background.tsx derives windows from `questions.length` already
   via `QW` — verify no hardcoded 7 remains (CENTERS uses `length` too). Section
   height 650vh → 520vh.
2. **One pattern break** (CONTROL): the Maps artifact *acts in-room* — "Rerouting…"
   toast plays a 1.2s re-route beat (arrow rotates 30°, label swaps to "Rerouted.")
   when its window activates (copy the latch pattern from Scene3 `reached` +
   useMotionValueEvent), and the question fades in only AFTER it settles (delay its
   opacity window start by +0.02).
3. **Epilogue turn.** After line2 fades (progress ≥ 0.97 window), one machine-voice
   line, dim, brief: `YOU'LL NOTICE ONE TONIGHT.` (content/scenes.ts
   `epilogue.turn`). It must also FADE OUT by the very end — the page still ends in
   nothing. Reuse the existing line1/line2 window pattern in Epilogue.tsx.
4. **Colophon + About page.**
   - `app/about/page.tsx` (static route): ~500 words max, canvas background, measure
     width. Sections: What this is (3 sentences) · How it argues (the mechanisms:
     decaying chrome, accent budget, motion eras, the photograph — 1 line each) ·
     Reading room: Weiser, "The Computer for the 21st Century" (1991); Norman,
     *The Invisible Computer* (1998); Krishna, *The Best Interface Is No Interface*
     (2015) — each with one honest sentence positioning this piece relative to it
     ("this project stages in interaction an argument Weiser made in prose") ·
     the search/touch chronology footnote (Phase 2) · byline + links (Director
     input) · tech colophon (Next.js, Framer Motion, two typefaces, 158KB).
   - Discoverability without violating the quiet ending: a single dim mono link
     `ABOUT THIS ESSAY` that appears BELOW the epilogue's final void — i.e., after
     the experience has fully ended, one more `--pause-m` of black, then the link
     alone (opacity ≤ 0.5, focusable, real `<a href="/about">`). No other footer
     content. The experience still ends in nothing; the door exists past the end.
5. **README rewrite** for the repo: thesis paragraph, live URL, three screenshots
   (terminal solved / morph touch era / Scene 4 held), the reading room links,
   run instructions, test instructions.

**Verification checklist**
- [ ] Scene 5: five questions, windows still exclusive (rerun pins test — update
      label list), CONTROL beat plays before its question.
- [ ] Epilogue: line1 → line2 → turn → all faded → void → ABOUT THIS ESSAY link
      reachable by keyboard; `/about` renders statically (check `out/about/index.html`).
- [ ] Grep: no scene renders any question copy removed by the fold.
- [ ] README screenshots committed; live URL correct.

**Anti-pattern guards:** About page gets NO nav back into the experience mid-scene
(one link home, top). The turn line is the LAST amber-free machine utterance — do
not set it in accent. No analytics, no share buttons, nothing SaaS (portfolio rules).

---

## Phase 7 — Final Verification & Human Pass

1. Full E2E suite (tests/e2e/) against the deployed URL, desktop + 375×812 +
   `reduced_motion="reduce"`.
2. WAAPI sweep = 0 at six scroll depths. Console errors = 0 across full journey.
3. Lighthouse on deployed URL: A11y 100, BP 100, SEO ≥95; record Performance from a
   real Chrome (target ≥95 — first number we'll have outside the sandbox).
4. Accent audit: screenshot every scene plateau; amber count per scene must be
   monotonically non-increasing after Scene 1 and zero from Scene 5 on.
5. Grep guards: `motion\.` (0 outside comments), `sessionStorage` (0 — all migrated),
   `BeachPhoto` (0), `SUGGESTED`-era leftovers per fold.
6. **Two real humans, silent observation** (Director task): first-10-seconds bounce,
   terminal time-to-solve, whether they notice the header's absence when asked
   afterward "how did you navigate?" — the Signature-Moment-5 litmus. Tune Scene 0
   compressed timing and hint threshold from what's observed, nothing else.
7. Cut a `v1.0` tag; update claude-mem with outcomes.

---

## Sequencing & effort

| Phase | Content | Est. effort |
|---|---|---|
| 1 | Deploy, tests, memory, skip, mercy | 0.5–1 day |
| 2 | Ledger, years, period GUI, mobile stage | 1.5–2 days |
| 3 | Decaying header | 1 day |
| 4 | Scene 4 choreography | 1–2 days |
| 5 | Photograph fidelity | 1 day |
| 6 | About/colophon, Scene 5 fold, epilogue turn | 1 day |
| 7 | Verification + human pass | 0.5 day + observation |

Phases 1→2→3 are the score-movers (evidence + staged disappearance). 4→5 are the
craft peaks. 6 converts the piece from artifact to scholarship. Nothing here touches
thesis, scene order, or tone.
