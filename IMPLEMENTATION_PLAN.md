# Invisible Interfaces — Implementation Plan

Lead Experience Engineer working document.
Version 1.0 — pre-code.

---

## 1. Understanding of the Thesis

The history of interaction design is the history of giving people their attention back. Interfaces have not disappeared — they have disappeared *from our attention*. The project must make a skeptical, experienced design professional feel this shift rather than read about it.

Three consequences drive every technical decision:

1. **The site is the argument.** The interface chrome itself must visibly decay across the experience — explicit at Scene 0/1, nearly absent by the Epilogue. This is a first-class engineering requirement, not a styling detail.
2. **Experience precedes explanation.** Any scene where a paragraph does the teaching is a failed scene. Interactions carry the meaning; text confirms it afterward, briefly, or not at all.
3. **The ending is quiet.** No CTA, no replay, no portfolio plug. Success is a visitor unlocking their phone that evening and pausing.

The emotional arc — Curiosity → Recognition → Friction → Relief → Realization → Reflection → Perspective — maps 1:1 onto Scenes 0–5 plus Epilogue. Each scene's implementation is judged against its single emotion.

---

## 2. Documentation Gap (flagged, not resolved unilaterally)

**DESIGN.md is currently a byte-for-byte duplicate of DIRECTOR.md.** There is no defined type system, color palette, accent color, or spacing scale. The spec constrains but does not specify: dark-first, editorial typography, one accent color, large whitespace, minimal chrome.

Proposed visual system (requires director sign-off; I will build Milestone 1 against it and it is trivially swappable via design tokens):

- **Canvas:** near-black, not pure black — `#0A0A0B` — so pure black remains available for the opening and closing voids.
- **Text:** warm off-white `#E8E6E3` at ~90% for body, full for display. Muted tier `#8A8782` for secondary.
- **Accent (one):** a single warm amber `#D97706`-family tone. Rationale: it reads as "attention" — the accent literally marks where the machine demands your attention, and it appears less and less as scenes progress. The accent color usage curve *is* the thesis.
- **Type:** one serif for editorial voice (e.g., *Newsreader* or *Source Serif 4* — variable, self-hosted) + one monospace for machine voice (*JetBrains Mono* or *IBM Plex Mono*). The serif/mono duality gives us the human/machine dialogue for free. No sans-serif third font — restraint.
- **Spacing:** an 8px base scale but with deliberately oversized section rhythm (min 60vh dead space between ideas). Silence budgeted as layout.
- **Typography scale:** display sizes large but not "oversized hero" — the handbook explicitly bans that pattern. Editorial scale: ~clamp(2.5rem → 4.5rem) for scene statements.

All tokens live in one file. If the director wants a different accent or typeface, it is a one-line change.

---

## 3. Technical Architecture

### Stack (per spec)

- **Next.js 15 (App Router), static export.** No server. This is an installation; it should load from anywhere, fast, forever. `output: 'export'`.
- **TypeScript, strict.**
- **Tailwind CSS 4** for layout/spacing/typography via design tokens (CSS variables so the interface-decay system can animate tokens).
- **Framer Motion (motion/react)** as the only animation dependency. It covers everything the storyboard needs: layout animations for the Scene 2 morph, scroll-linked values, `AnimatePresence` for scene text, spring physics.
- **No GSAP unless Scene 2 proves it necessary.** The continuous terminal→GUI→touch→search→prediction morph is the only candidate. Plan A is Framer Motion layout animation + shared layout IDs; GSAP Flip is the fallback. Decision deferred until the Scene 2 spike (see Risks).
- **No other dependencies.** No lenis/smooth-scroll libraries, no icon packs, no UI kits. Historical interface renderings are hand-built DOM/SVG, which also satisfies the historical-accuracy requirement better than stylized illustrations.

### Page structure

Single page, one scroll container, six scenes + epilogue as full-viewport-or-taller `<section>` elements with semantic landmarks:

```
app/
  layout.tsx          — fonts, metadata, reduced-motion detection
  page.tsx            — scene sequence
components/
  scenes/
    Scene0Forgotten.tsx
    Scene1Terminal.tsx
    Scene2Simplification.tsx
    Scene3Remembering.tsx
    Scene4Threshold.tsx
    Scene5Background.tsx
    Epilogue.tsx
  systems/            — reusable interaction systems (below)
  chrome/             — the decaying interface chrome
lib/
  tokens.ts / globals.css  — design tokens
  useSceneProgress.ts      — scroll orchestration
  useReducedMotion.ts
content/
  scenes.ts           — all copy in one typed file (editing text ≠ touching components)
```

Scroll is native. No scroll hijacking — the visitor's scroll wheel is the one interface we never take away, because taking it away would be spectacle. Scenes respond to scroll position; a few moments (terminal, intent input) pause the narrative until interacted with, but never trap scroll.

---

## 4. Reusable Interaction Systems

Four systems get built once and reused, keeping scene code thin:

1. **`SceneProgress`** — a context provider per scene exposing a 0–1 scroll progress motion value. Every scene animation derives from this single value, which makes motion deterministic, scrubbing-friendly, and trivially disabled for reduced motion (snap to keyframes instead of tweening).

2. **`ChromeController`** — the interface-decay system. A global store (React context + motion values) holding `chromeLevel: 1 → 0`. Scene index drives it. Consumers: progress indicator, scene labels, focus outlines styling weight, even scrollbar styling. At level 1 (Scene 0–1): visible progress rail, scene titles, a "scroll" affordance. By Scene 4: only text remains. Epilogue: nothing. **This is the project's most important system — Signature Moment 5 ("noticing navigation has quietly disappeared") is entirely this controller.** It must decay so gradually that no single step is noticeable.

3. **`MachineText`** — typewriter/system-voice text primitive (mono font, cursor, variable cadence, error states). Used by Scene 1 terminal, Scene 2 early phases, Scene 3 notifications, Scene 4 background-system log. One primitive, consistent machine voice across the whole piece.

4. **`AmbientField`** — the Scene 0 system: fragments that appear on a cadence, drift almost imperceptibly, and rearrange in response to scroll. Built with absolute-positioned motion divs on a collision-avoided layout grid (precomputed positions, no physics engine).

---

## 5. Scene Implementation Strategy

### Scene 0 — The Forgotten Interfaces *(Curiosity)*

Follows the storyboard exactly: black void, 3s of nothing, two sentences with a held pause, then interface fragments appearing one per second — Face ID prompt, an OTP autofill chip, a Maps "rerouting…" toast, a Spotify "up next", a package status, a calendar nudge, an AirPods connection pill. Each fragment is a faithful miniature of the real UI (recognition, not illustration). Scroll causes the field to rearrange and recede.

- Fragments are non-interactive at first — they happen *to* the visitor, like real life.
- The two opening lines are the only text. No title, no logo, no header. The `<title>` tag and an accessible `<h1>` (visually integrated into the first statement) carry SEO/a11y.
- Timing gate: the 3-second silence must not feel broken. `prefers-reduced-motion` shortens to a simple fade sequence.

### Scene 1 — Demanding Attention *(Friction)*

A real, working terminal. The visitor must type. The machine is literal, unforgiving, and slightly slow.

- Small command set (`help` is deliberately unhelpful at first — "SYNTAX ERROR" teaches more than a tutorial). 6–10 recognized commands, everything else fails honestly with period-accurate error voice.
- The learning path: fail → fail differently → discover `LIST` or similar → succeed at one tiny task (e.g., opening a file) → the machine acknowledges, and the scene releases.
- **Escape hatch:** after ~2 failed commands or ~20 seconds idle, a single dim hint line appears in the machine's own voice (not a UI tooltip). Frustration is the lesson; abandonment is failure. Mobile: the terminal focuses a real input so the OS keyboard works; the scene is fully completable by touch.
- Fully keyboard-native by definition — this is the most accessible scene for keyboard users and needs care for screen readers (`role="log"`, `aria-live="polite"` for output).

### Scene 2 — The Great Simplification *(Relief)*

The riskiest and most valuable scene. The terminal from Scene 1 **does not cut away — it transforms**: the same task the visitor struggled with is re-performed by each successive paradigm.

- Anchor idea: **one task, five paradigms.** E.g., "find and open a photo." Terminal: typed path. GUI: double-click through folders. Touch: tap a thumbnail. Search: type "beach" into a box. Prediction: the photo simply appears ("From this day, 3 years ago").
- The same on-screen elements morph: the terminal's text lines become window list rows, become desktop icons, become touch tiles, become a single search field, become nothing. Shared element continuity is the whole point — no cuts.
- Scroll-scrubbed via `SceneProgress` so visitors control the pace of history and can scrub back and forth (comparison teaches).
- An attention meter is tempting here (visualizing declining effort) but is probably decoration — the visitor just *did* the hard version by hand in Scene 1; their memory is the meter. Decide during build; default is no meter.
- **Technical spike scheduled first** (see Risks) to choose Framer layout-morph vs. crossfade-with-shared-anchors vs. GSAP Flip.

### Scene 3 — When Software Started Remembering *(Recognition/Realization begins)*

Software acts *before* the visitor. Passive demonstrations that trigger from natural behavior:

- Scrolling into the scene, a password field autofills itself. A "smart reply" drafts itself. A photo memory assembles. A calendar suggestion slides in — each triggered by scroll position or dwell time, not clicks.
- One quiet inversion: something on this page itself behaves preemptively — e.g., as the visitor's cursor drifts toward the scene's one link, it underlines *before* hover contact; or the page remembers how they solved the terminal and references it ("You typed 7 commands to open one file."). Self-referential memory is the strongest available version of "software remembers" — it happened to *you*, here. Kept to exactly one instance; more would be a gimmick.
- No interaction required — the visitor's only job is to notice.

### Scene 4 — The Invisible Threshold *(Realization)*

The visitor expresses one intent — "Book dinner tomorrow" — and watches six systems coordinate.

- Input is a single quiet text line with the intent pre-suggested (typing optional — accepting the suggestion IS the lesson: even expressing intent is being absorbed).
- Then: a restrained choreography of Calendar / Maps / Traffic / Weather / Reservation / Reminder — shown as a system log or thin thread-lines, in machine voice, fast, mostly *dimmed*. Visible UI outcome: one line — "Dinner tomorrow, 7:30. Table booked. Leave by 7:05."
- The reveal mechanic: the coordination is shown *small and dim*, and then the visitor is offered a single gesture (scroll pause or one keypress) to briefly illuminate what just happened underneath. Seeing the hidden machinery on request — transparency as an interaction — foreshadows Scene 5's themes.

### Scene 5 — Designing the Background *(Reflection)*

Deliberately the least interactive scene. Large set questions — Trust. Control. Consent. Timing. Transparency. Explainability. Reversibility. — presented one at a time with generous dwell, each paired with at most one everyday example rendered as a tiny artifact from earlier scenes' vocabulary (the fragments return, now legible as design decisions).

- No frameworks-as-diagrams unless one genuinely clarifies; the spec allows frameworks, the director demands restraint. Default: typography only.
- Chrome level approaches zero here. Scrollbar is effectively the only UI left.

### Epilogue — Invisible Interfaces *(Perspective)*

One final statement on the void the experience opened with. Structural rhyme with 00:00.

- Candidate closing move (execution-level, preserves the scripted quiet ending): after the final line fades, the page is simply… over. No footer. The last thing the visitor does is close a tab — the most invisible interface action there is. Nothing marks it.
- No CTA, no replay, no attribution beyond an `<meta>` tag and a single dim byline if the director wants one (default: none).

---

## 6. Motion Architecture

- **One easing vocabulary:** a small set of named springs/curves in `tokens.ts` — `settle` (gentle spring, most UI), `breathe` (slow sine, ambient drift), `machine` (linear/stepped, terminal-era motion), `dissolve` (opacity-only). Scenes may not invent bespoke curves; the vocabulary keeps the piece feeling like one hand made it.
- **Era-appropriate motion:** early scenes move mechanically (stepped, instant, CRT-flavored); later scenes move organically (springs, fades). Motion literally evolves with the interfaces — motion *is* the timeline. This costs nothing and reinforces the thesis every second.
- **Scroll-derived, not time-derived,** wherever possible: deterministic, scrubbable, pausable, reduced-motion-friendly. Time-based animation only where the scene *is* about time (Scene 0 opening, terminal response latency).
- **Banned patterns enforced in review:** no fade-up-on-scroll defaults, no parallax, no floating gradients, no glassmorphism, no decorative easing flourishes.
- **Reduced motion:** every scene defines a static or crossfade-only variant up front, not as an afterthought. Scene 2 under reduced motion becomes a stepped sequence (paradigm A, then B) — the idea survives without the morph.

---

## 7. Component Architecture

- Scenes are thin orchestrators; systems (§4) do the work.
- All copy in `content/scenes.ts`, typed. The director can edit language without touching components.
- Historical UI miniatures (`components/artifacts/`) are pure presentational components — `FaceIdPrompt`, `OtpChip`, `MapsReroute`, `TerminalFrame`, `Win95Window`, etc. — built to be reused across Scene 0, 2, 3, and 5 (fragments recur deliberately; the visitor should recognize them returning).
- No global state library. One context for chrome level, one per-scene progress context. That's all the state this project has.

---

## 8. Performance Strategy

- Static export; zero runtime data fetching.
- Fonts: two variable font files, self-hosted, `font-display: swap` with metric-compatible fallbacks tuned so the opening statements don't reflow (the 3-second black opening also conveniently masks font loading — the storyboard accidentally solved FOUT).
- Everything is DOM/SVG/CSS — no canvas, no WebGL, no images heavier than a few KB. The artifacts are code, not screenshots.
- Scene-level code splitting via `next/dynamic` for below-fold scenes; Scene 0 + chrome in the initial bundle.
- Animation discipline: `transform`/`opacity` only on animated properties; `will-change` applied transiently; ambient drift capped at low frequency; everything paused when its scene is off-screen (IntersectionObserver).
- Budget: <120KB JS gzipped initial, Lighthouse ≥95/100/100/≥95, 60fps in Scene 2 on a mid-tier phone (the morph gets profiled on real hardware, not just desktop DevTools).

---

## 9. Accessibility Strategy

- Semantic structure: `<main>`, one `<h1>` (Scene 0 statement), `<h2>` per scene (visually quiet, structurally present), landmarks throughout.
- **The decaying chrome must not decay for assistive tech.** Chrome level affects *visual* weight only; the accessibility tree keeps full landmarks, headings, and skip-links throughout. Invisible ≠ hidden — this is the handbook's line and it's the a11y architecture in one sentence.
- Terminal: `role="log"` + polite live region; all interactions keyboard-first by nature.
- Scene 3's preemptive behaviors get `aria-live` announcements so the "software acted on its own" moment reaches screen reader users as an event, not silence.
- Focus visible always; no pointer-precision interactions anywhere (spec requirement — already satisfied by design).
- `prefers-reduced-motion` honored globally via one hook; per-scene static variants (§6).
- Contrast: muted text tier stays ≥4.5:1 against canvas; "dim" never means "illegible."

---

## 10. Technical Risks

1. **Scene 2 morph continuity (highest risk).** A convincing no-cut transformation across five paradigms is hard. *Mitigation:* it's the first spike of Milestone 3 — build a two-paradigm proof (terminal→GUI) before committing to a technique. Fallback ladder: full shared-element morph → morph key elements + dissolve context → stepped crossfade with one persistent anchor element. Even the lowest rung preserves the idea.
2. **Scene 1 frustration tuning.** Too easy = no friction = no relief in Scene 2. Too hard = abandonment. *Mitigation:* escape-hatch hint system with tested thresholds; watch 2–3 real people use it before calling it done.
3. **Chrome decay noticeability.** If visitors notice the navigation disappearing *while it happens*, the moment is spent early; if it's too subtle, Signature Moment 5 never lands. *Mitigation:* decay in many sub-threshold steps; the *realization* is engineered into Scene 4/5 where the visitor happens to look for navigation and finds it gone.
4. **Scroll-position fragility across devices** (mobile URL bars, zoom, resize mid-scene). *Mitigation:* progress derived from element intersection ratios, not absolute pixel offsets; scenes tolerate reflow.
5. **The 3-second opening vs. impatient visitors.** A skeptical reviewer may bounce in a black screen. *Mitigation:* the first sentence begins at 3s sharp; subtle cursor-style indicator considered only if testing shows bounce. Default: trust the silence.
6. **Mobile terminal keyboard behavior** (iOS focus/viewport jumps). *Mitigation:* real `<input>` visually merged with the terminal line; `visualViewport` API for layout compensation; test early on real iOS.

---

## 11. Opportunities to Elevate (execution-level, direction preserved)

Already woven into scene strategies above; the headliners:

1. **Motion evolves with the eras** (§6) — mechanical → organic. Free thesis reinforcement.
2. **One task, five paradigms** in Scene 2 — continuity of *task*, not just of pixels, is what makes the evolution legible without a single caption.
3. **Self-referential memory in Scene 3** — the page remembers the visitor's own terminal struggle. One instance only.
4. **Accent color as attention meter** — the single accent marks machine-demands-attention moments and appears progressively less. By the Epilogue it is gone. Nobody will consciously notice; everybody will feel it.
5. **The serif/mono voice duality** — human voice vs. machine voice needs no labels, ever.
6. **Transparency-on-request in Scene 4** — briefly illuminating the hidden coordination is both the scene's reveal and a quiet argument for Scene 5's themes.

---

## 12. Implementation Roadmap

Vertical slices; every milestone ends with a working experience.

### Milestone 1 — The Spine *(foundation + Scene 0 + Epilogue)*
Project scaffold, design tokens, fonts, ChromeController skeleton, SceneProgress, reduced-motion infrastructure. Scene 0 built to storyboard timing, Epilogue built (it's small), placeholder scenes between. **Exit:** you can experience the opening and ending as intended, full a11y pass on the shell, Lighthouse baseline recorded.
*Why Scene 0 + Epilogue first: they are the emotional bookends and the cheapest scenes; the void-to-void structural rhyme gets validated immediately.*

### Milestone 2 — Friction *(Scene 1)*
MachineText system + working terminal, command set, failure/hint tuning, mobile keyboard handling, screen reader pass. **Exit:** a first-time visitor fails, learns, succeeds, and feels it; tested with at least two real humans.

### Milestone 3 — The Morph *(Scene 2)*
Starts with the morph technical spike (2 paradigms) → technique decision (Framer vs. GSAP Flip) → full five-paradigm build, scroll-scrubbed, reduced-motion stepped variant. **Exit:** terminal-to-prediction plays continuously at 60fps on mid-tier mobile; the progression is legible with all captions removed.

### Milestone 4 — The Quiet Half *(Scenes 3 + 4)*
Artifact library grows; preemptive-behavior triggers; self-referential memory beat; Scene 4 intent input + coordination choreography + illumination gesture. Chrome decay now spans real content and gets its first end-to-end tuning pass. **Exit:** Scenes 0–4 flow as one experience; Signature Moments 3 and 4 land.

### Milestone 5 — Reflection & Disappearance *(Scene 5 + chrome decay finale)*
Scene 5 typographic build; final chrome-decay curve tuning across the entire piece; accent-color usage audit (must trend to zero). **Exit:** full 8–12 minute experience, start to finish, nothing placeholder.

### Milestone 6 — The Polish That Removes *(hardening)*
Not a feature milestone — a subtraction milestone. Self-critique checklist per scene (does it teach? can UI be removed? is anything decorative?), performance profiling on real devices, Lighthouse targets, cross-browser, full keyboard + screen reader walkthrough, copy proofing, meta/OG. **Exit:** completion criteria in SPEC.md all check; the piece feels calmer than it did at Milestone 5.

---

## 13. Open Items for the Director

1. **DESIGN.md is a duplicate of DIRECTOR.md** — confirm the proposed visual system in §2 (canvas, amber accent, serif+mono pairing) or supply the intended one. Building Milestone 1 against §2 defaults; all swappable via tokens.
2. Scene 2 anchor task ("find and open a photo") — confirm or propose alternative everyday task.
3. Epilogue byline: none by default — confirm.
4. Storyboard exists only for Scene 0's first 30 seconds — I will treat SPEC.md scene definitions as the storyboard for the rest unless more boards are coming.
