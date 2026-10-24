# Cinematic experience refinement — 24 October 2026

## A. Verdict

**PASS for the local refinement.** Agent-led live browser review and matched
motion captures show substantially stronger Gesture and recall passages. This
does not claim participant validation or physical-device release acceptance.

## B. Repository

Branch `codex/v2-cinematic-refinement`, directly from
`39d562ee6e5a7643218b292bac5b06acaffbf75d`. The delivery message supplies the ending
commit and clean-tree result. One local commit includes the implementation,
tests and selected evidence. No push, merge, deployment or publication occurred.
V1 source, dependencies, photographic assets and the separate portfolio were untouched.

## C. Creative diagnosis

The director's cut repeatedly kept the viewer at a similar distance from a small
image. Gesture's displacement was too slight to feel tactile; Anticipation relied
on its completed labels. The archive arc and quiet ending already worked well.
Live forward/reverse review confirmed this distinction before editing.

## D. Changes

- Gesture now approaches the photograph, banks with its material bend, catches
  an opposing movement, then settles at a larger scale. Its caption yields before
  the close movement; the chapter statement returns for the resting composition.
- Anticipation turns the same continuous photograph into a close folded surface,
  then opens it before the query completes. Context follows the result.
- The early glyph field has more pronounced foreground/background depth before
  it assembles the existing window. No new objects, panels or text were added.
- The old gesture trace was removed because the surface itself now communicates motion.

## E. Gesture → Anticipation

The tactile approach carries into the preserved bow/unfurl. The enclosure falls
away; the camera orbits a connected concertina rather than introducing a new
scene. The photograph returns flat by 101, before query completion at 102–105.
The motion presents the remembered image ahead of the completed request.
A first prototype separated the image into strips; it was rejected because its
gaps read as a generic transition and weakened photographic continuity.

## F. Continuity and art direction

One texture, one mesh, the existing camera hierarchy and the same paused timeline
carry the journey. No independent animation clock or input smoothing was added.
Phones/tablets use smaller excursions. Intentional resting intervals remain.
Matched desktop PNGs at 0, 32, 43, 48 and 140 are **byte-identical** to the starting
build, protecting the opening poster, archive compositions and quiet ending.
Photography, fonts, colours and the optional return-to-context interaction are unchanged.

## G. UI protection

The 385-frame layout sweep across 11 viewports found no flagged overlaps or
clipping, including 320px phones. Native scrolling, chapter/keyboard navigation,
skip/replay, restoration, resize, pinned release and reduced-motion resting
states passed. The DOM photograph remains the fallback while WebGL initializes,
when it is unavailable, or after context loss. No mandatory interaction was added.

## H. Verification and cost

| Check | Observed result |
| --- | --- |
| Production build and TypeScript | PASS |
| Chromium 151.0.7922.34 / Firefox 157.0 / Windows WebKit 26.5 | PASS: 47 states, 11 viewports each; forward/reverse, rapid scrubbing, restoration and input checks |
| WebGL surface | Pixel-identical reversal at 67, 87 and 94; context loss/restoration; reduced-motion rebuild; simulated unavailable-WebGL fallback at 320px |
| V1 | Source parity; opening/terminal and pinned-scene smoke suites passed. Its previously established 320px 8.4px machine-type baseline was not changed. |
| Isolated 12-second Chromium traversals | Desktop/mobile median 16.7ms; p95 16.8/16.7ms; worst 33.3ms; no long tasks |

The mesh retains **4,096 triangles**; crease vertices increase from 2,145 to 2,376.
The 2× drawing buffer, texture and dependencies are unchanged. Enhanced-visit JS
is **293,714 gzip bytes**, up **526 bytes**; entry chunks are **156,151**, below the
unchanged 160,000-byte entry target. Deformation stays active for more of the
journey. Compared with the saved director's-cut profile, desktop TaskDuration
rose from 2.61s to 3.30s per 12-second traversal; mobile rose from 1.83s to 1.91s.
These separate runs are indicative, not a controlled hardware benchmark. Frame
cadence remained comparable; rAF scheduling does not prove display-presented FPS.

Physical phones, trackpads, GPU diversity and actual Safari remain untested.
Windows WebKit's native Tab policy still skips links; explicit skip-link focus
was tested, so native link tab order there remains unverified.

## I. Evidence

All films are genuine browser captures with matched native-scroll control paths,
encoded at 25fps. The focused films omit a one-second setup prefix.

| Passage | Before | After |
| --- | --- | --- |
| Gesture → Anticipation | [before-gesture.mp4](v2-refinement-evidence/before-gesture.mp4) | [after-gesture.mp4](v2-refinement-evidence/after-gesture.mp4) |
| Opening/data field | [before-opening.mp4](v2-refinement-evidence/before-opening.mp4) | [after-opening.mp4](v2-refinement-evidence/after-opening.mp4) |

[Uninterrupted final showcase](v2-refinement-evidence/showcase.mp4) ·
[Mobile motion](v2-refinement-evidence/mobile-gesture.mp4) ·
[Gesture](v2-refinement-evidence/after-1440x900-067.png) ·
[Recall](v2-refinement-evidence/after-1440x900-093.png) ·
[320px recall](v2-refinement-evidence/after-320x568-093.png).

Engine results, layout flags, surface checks, preserved-frame hashes, bundle
accounting and isolated profiles are in `docs/v2-refinement-evidence/`.
Full captures, rejected prototypes and local harnesses remain in ignored
`output/playwright/refinement/`. Review included live native scrolling,
intermediate pauses, direction changes, recordings and sampled movie frames.

## J. Critical assessment

The improvement is substantial enough to keep: Gesture has an intimate physical
rhythm, recall becomes visible behavior, and scale varies while the successful
archive and ending remain intact. The connected fold is more coherent than the
rejected strips. Anticipation still uses an authored metaphor and short labels;
whether visitors interpret it as anticipatory computing needs actual visitor
evaluation. Owner review of the matched films and real-phone/Safari testing are
the next release checks. No public action is authorized by this report.
