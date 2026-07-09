# Invisible Interfaces — Visual System

The design language. Not pages — the rules pages are made from.

Governing test for every token: **does this return attention to the visitor, or take it?**
Anything that takes attention must be *spending* it on the thesis. Otherwise it is deleted.

---

## 1. Typography

Two voices. No third.

| Voice | Face | Why it exists |
|---|---|---|
| **Human** | Newsreader (variable, optical sizing, self-hosted) | The essay's voice. An editorial serif says "this is an argument, sit with it" — the register of print, the medium that never demanded operation, only attention freely given. Its italics carry the reflective register of Scenes 5 and the Epilogue. |
| **Machine** | IBM Plex Mono (400 only, self-hosted) | Everything the machine says or is. Terminals, artifacts, system logs, hints. Plex was literally designed by IBM as the voice of the machine-human relationship. One weight — machines don't emphasize. |

No sans-serif. A third face would exist only to look contemporary — decoration.
The serif/mono duality means human and machine speech **never need labels**. The font *is* the attribution.

### Scale

Sizes are few because each maps to a narrative function, not a layout slot:

| Token | Size | Role |
|---|---|---|
| `display` | clamp(2.5rem → 4.25rem), Newsreader 300, lh 1.15, tracking −0.01em | Scene statements. The only large text in the piece. Large because these lines *are* the scenes. |
| `statement` | clamp(1.375rem → 2rem), Newsreader 400, lh 1.4 | Secondary human thoughts; Scene 5 questions live between this and display. |
| `body` | 1.125rem / 1.7, max-measure 34rem | The little prose that survives the Golden Rule. |
| `machine` | 0.875rem, Plex Mono, lh 1.6 | Terminal, logs, hints. |
| `micro` | 0.6875rem, Plex Mono, tracking +0.02em | Artifact interiors (the OTP chip, the calendar nudge). Small because these things live at the periphery of real attention. |

Weight range: 300–500. Nothing bold. Bold shouts, and the piece never shouts.

---

## 2. Spacing & Silence

Two scales, because this project spaces two different things: elements and *time-on-scroll*.

**Element scale** (rem, 4px base): `4 · 8 · 12 · 16 · 24 · 40 · 64 · 104` (`--s-1 … --s-8`).
Loosely Fibonacci — gaps grow faster than content, so density can only fall.

**Silence scale** (viewport-relative — silence is measured in scroll effort, not pixels):

| Token | Value | Use |
|---|---|---|
| `--pause-s` | 30vh | A breath between related thoughts. |
| `--pause-m` | 60vh | The minimum distance between two ideas. |
| `--pause-l` | 100vh | Before and after a scene's one idea. A full empty viewport is the design system's way of saying *this mattered*. |

Silence is budgeted in the layout like content, because in this project it is content: empty scroll is where the visitor's own thinking happens, and the thesis is that their attention belongs to them.

---

## 3. Grid

**There is no column grid.** Column grids exist to organize competing content; nothing here competes. Two structures instead:

1. **The measure.** One centered column, max 34rem for prose, 44rem for display statements. Every human-voice element aligns to it. The essay is a single line of thought; the layout says so.
2. **The field.** A 12×8 positioning lattice covering the viewport, used only by ambient artifacts (Scene 0, Scene 5 reprise). Fragments snap to lattice cells with precomputed collision-free placements — organic-looking, deterministic in build. The field is where the periphery lives; the measure is where attention lives. The whole visual argument is the tension between those two zones.

---

## 4. Color

Dark-first is a narrative necessity: the piece begins and ends in a void, and interfaces must *emit* into it — light against dark reads as attention against rest.

| Token | Value | Justification |
|---|---|---|
| `--void` | `#000000` | Reserved for the opening and the Epilogue only. Pure black is the absence of interface; if it appeared mid-piece it would cheapen the bookends. |
| `--canvas` | `#0A0A0B` | The working dark. Two percent above black — the difference between "off" and "quiet." |
| `--surface` | `#111113` | Artifact and terminal bodies. Elevation by luminance (see §5). |
| `--ink` | `#E8E6E3` | Human-voice text. Warm off-white: paper, not pixel. |
| `--ink-dim` | `#918E88` | Machine voice at rest; secondary text. ≥4.5:1 on canvas — "dim" never means illegible. |
| `--ink-faint` | `#55534F` | Receded content — things leaving attention. Decorative-illegibility is banned; faint text is always also available somewhere legible or is aria-labeled. |
| `--line` | `rgba(232,230,227,0.10)` | Hairline borders. The thinnest possible claim on attention. |
| `--accent` | `#E8A33D` | **The one accent — amber phosphor.** The color of the terminals that demanded *everything*: undivided attention in amber light. It marks exactly one thing across the whole piece: *a moment where the machine is asking for your attention.* The terminal cursor, an error, a required input. As the paradigms evolve, the machine asks less, so the amber appears less — and by the Epilogue it is gone. The accent's disappearance across the scroll **is the thesis, measurable in one color.** |

Accent budget is enforced per scene (§11). Accent is never used "for pop." If a screenshot of a late scene contains amber, something is wrong.

---

## 5. Elevation

**No shadows.** Drop shadows simulate objects floating over a page — a skeuomorphism of exactly the era this piece moves past, and they're nearly invisible on near-black anyway.

Elevation is **luminance**: things closer to the visitor's attention are slightly brighter.

| Level | Treatment | Meaning |
|---|---|---|
| 0 | `--canvas` | The world at rest. |
| 1 | `--surface` + `--line` border | An artifact present but peripheral. |
| 2 | `--surface` + border + text at `--ink-dim` → `--ink` | An artifact currently speaking. |
| focus | 1px `--accent` outline | The machine requires you. (Also the keyboard focus ring — accessibility and narrative use the same token, deliberately: focus *is* demanded attention.) |

Things gain light when they need you and lose it when they don't. Elevation is an attention diagram.

---

## 6. Radius

Radius is **era-indexed**, because corner geometry is one of the most legible fossils of interface history:

| Token | Value | Era |
|---|---|---|
| `--r-0` | 0 | Terminal. Character cells have no curves. |
| `--r-1` | 2px | Early GUI. The first softening. |
| `--r-2` | 8px | Touch. Corners made for fingers. |
| `--r-3` | 14px / pill | Ambient. Modern chips, toasts, suggestions — interfaces shaped to be glanced at, not operated. |

Every artifact wears the radius of its era, without exception. In Scene 2 the morph animates radius as a primary property — the visitor watches corners soften across forty years. Radius is not styling here; it is carbon dating.

---

## 7. Iconography

**There is no icon set.** Icon libraries are the visual language of product UI, and this is not a product.

Two categories of image exist:

1. **Artifact glyphs** — the Face ID mark, a map arrow, a battery pill — drawn as minimal inline SVG *inside* artifact miniatures, faithful to their sources (historical accuracy over stylization, per the handbook). They belong to the machines, not to us.
2. **Nothing else.** No decorative icons, no arrow-down scroll cues (the scroll affordance is a machine-voice *word*, because at chrome level 1 interaction is explicit — spoken, not symbolized).

If an icon is needed to explain our own content, the content is unclear — fix the content.

---

## 8. Motion Durations

| Token | Value | Use |
|---|---|---|
| `--t-instant` | 0ms | Machine-era state changes. Early computers didn't ease — they *were* or *weren't*. |
| `--t-step` | 120ms | Mechanical steps: cursor blink phases, stepped morph frames. |
| `--t-settle` | 400ms | Modern elements taking their place. |
| `--t-dissolve` | 900ms | Things leaving or entering attention softly. |
| `--t-dwell` | 1800ms | Scene statements arriving. Slow enough to be read *as they arrive* — arrival is part of the sentence. |
| `--t-breathe` | 6000ms+ | Ambient drift cycle. Below the threshold of "animation"; felt, not seen. |

The scale is bimodal — very fast or very slow, almost nothing at 200–300ms — because 250ms is the tempo of *product* UI transitions, the exact register of generic web motion this piece must never speak in.

---

## 9. Easing Curves

Four curves. Scenes may not invent their own — one hand, one vocabulary.

| Token | Curve | Character |
|---|---|---|
| `--e-machine` | `steps(n)` / `linear` | The machine does not accelerate. Terminal-era motion is quantized or constant. |
| `--e-settle` | `cubic-bezier(0.22, 1, 0.36, 1)` | Strong decel, no bounce. Things arrive like objects set down carefully. Never overshoots — overshoot is showmanship. |
| `--e-breathe` | `ease-in-out` sine | Ambient periodic drift only. |
| `--e-dissolve` | `ease` on opacity only | Attention fading. Position never animates during a dissolve — things don't *go* somewhere when you stop noticing them; they just stop being noticed. |

**Era mapping is the rule that makes motion the timeline:** Scenes 0–1 may only use `--e-machine`. Scene 2 *transitions the easing vocabulary itself* — its morph begins stepped and ends settled. Scenes 3–5 use `settle/breathe/dissolve`. Motion literally evolves from mechanical to organic across the scroll, so even a visitor who reads nothing feels computing soften.

---

## 10. Transition Taxonomy

Every transition in the piece is one of five verbs. If a proposed animation isn't one of these, it doesn't ship.

| Verb | Definition | Rules |
|---|---|---|
| **Appear** | Something enters the visitor's attention. | Opacity + ≤8px settle. Never slides in from off-screen — attention doesn't have wings. |
| **Recede** | Something stops claiming attention. | Dissolve to `--ink-faint` or 0. Never exits with motion; receding things are *forgotten in place*. |
| **Transform** | One thing becomes its successor. | Reserved for Scene 2 and chrome decay. Shared-element continuity mandatory — a cut would break the historical argument. |
| **Rearrange** | The field responds to the visitor. | Scroll-derived, position-only, `--e-settle`. The world acknowledging you without addressing you. |
| **Illuminate** | Hidden machinery briefly made visible. | Luminance-only (elevation shift), on explicit visitor request. The transparency gesture of Scene 4. |

Taxonomy doubles as the code review checklist for motion.

---

## 11. Scene Density Progression

The master curve. Each scene's budget — chrome, accent, motion era, text — is fixed here so the interface's disappearance is engineered, not vibes:

| Scene | Chrome level | Accent budget | Motion era | Radius era | Text density | Silence |
|---|---|---|---|---|---|---|
| 0 Forgotten | 1.0 — rail, scene label, spoken scroll cue | 1 use (cursor) | machine | r-3 artifacts on void | 2 sentences | opens with 3s void |
| 1 Demanding | 1.0 | **peak** — cursor, errors | machine | r-0 | machine dialogue | low — friction fills it |
| 2 Simplification | 0.8 → 0.6 | declining with each paradigm | machine → settle *(the crossing)* | r-0 → r-3 animated | near zero | scroll-paced |
| 3 Remembering | 0.5 | ≤2 (preempt moments) | settle | r-2/r-3 | short captions after the fact | pause-m rhythm |
| 4 Threshold | 0.3 | 1 (the intent line) | settle + illuminate | r-3 | one input, one outcome line | high |
| 5 Background | 0.1 | 0 | breathe/dissolve | typography only | 7 questions | pause-l rhythm |
| Epilogue | 0.0 — nothing | 0 | dissolve only | — | 1 statement | returns to void |

Rules derived from the table:
- **Chrome decays in sub-threshold steps** across scene boundaries — no single step noticeable; the *absence* is discovered around Scene 4–5 (Signature Moment 5).
- **Accent count is monotonically non-increasing after Scene 1.** Auditable by grepping rendered scenes for the token.
- **Text density falls as interaction literacy rises** — early scenes may explain because the visitor hasn't experienced anything yet; late scenes may not, because they have.

---

## 12. Responsive Philosophy

**One experience, two distances.** Desktop is a gallery wall; the phone is a private reading. Never a "mobile version" — a nearer viewing of the same installation.

- **Nothing is removed on small screens.** If a moment can't survive at 375px it isn't a strong enough moment — redesign it, don't hide it. (The thesis concerns phones more than desktops; the phone rendering is arguably the primary one.)
- The measure and silence scales are viewport-relative already; the field lattice re-solves to fewer cells with the same artifacts.
- Touch is not a degraded pointer — Scene 1's terminal treats the OS keyboard as a first-class instrument (a real input, `visualViewport`-compensated), and hover-dependent meaning is banned piece-wide (hover may *enrich*, never *carry*).
- Breakpoints are few and content-derived: one at ~640px (field density, type clamp floor), one at ~1200px (measure ceiling). No 5-breakpoint grid system for a piece with no grid.
- `prefers-reduced-motion` is a first-class rendering, specified per scene at design time: timelines become sequences of dissolves, the Scene 2 morph becomes a stepped comparison. The idea must survive with zero movement — if it can't, the idea was in the motion, and that violates the Golden Rule anyway.

---

## 13. Token Sheet (implementation reference)

```css
:root {
  /* color */
  --void: #000000;
  --canvas: #0A0A0B;
  --surface: #111113;
  --ink: #E8E6E3;
  --ink-dim: #918E88;
  --ink-faint: #55534F;
  --line: rgba(232, 230, 227, 0.10);
  --accent: #E8A33D;

  /* space */
  --s-1: 0.25rem; --s-2: 0.5rem; --s-3: 0.75rem; --s-4: 1rem;
  --s-5: 1.5rem; --s-6: 2.5rem; --s-7: 4rem; --s-8: 6.5rem;
  --pause-s: 30vh; --pause-m: 60vh; --pause-l: 100vh;

  /* radius (era-indexed) */
  --r-0: 0; --r-1: 2px; --r-2: 8px; --r-3: 14px;

  /* motion */
  --t-instant: 0ms; --t-step: 120ms; --t-settle: 400ms;
  --t-dissolve: 900ms; --t-dwell: 1800ms; --t-breathe: 6000ms;
  --e-settle: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Every future visual decision must trace to a token in this sheet, and every token here traces to the thesis. When those two chains meet, the piece will feel like one idea — because it will be one.
