# Invisible Interfaces — immersion director's cut

## A. Verdict

**PASS for this local creative and engineering pass.** Agent-led browser review
found a stronger continuous journey with no material layout regression in the
tested range. This is not a claim of visitor validation or physical-device
release acceptance. Nothing was pushed, merged, deployed or published.

## B. Repository state

- Branch: `codex/v2-immersion-directors-cut`, derived directly from
  `c196d93508fc8c43f5c4c1eb85317fa6075566a9`.
- The final local commit identifier and clean-tree result accompany this report
  in the delivery message. Code, provenance, tests and selected evidence belong
  to that commit; ignored raw captures remain local.
- V1 scene/source files, shared visual identity and the production deployment
  were preserved. No separate portfolio checkout was modified.

## C. Creative assessment and Two Horizons study

The original Window arc already established a convincing spatial archive. The
later acts were weaker: the touch photograph stayed inside a flat panel,
Anticipation mainly introduced labels, and the ending mostly removed chrome.
Persistent bottom navigation also competed with the exhibition's disappearance.

The supplied 37.65-second Two Horizons recording was sampled across its full
visual sequence and more densely through the first environment switch. These
are observations of the recording, not a test of that site's implementation or
input events. Audio was not evaluated.

| Reference principle | Critical reading | Adaptation here |
| --- | --- | --- |
| Recognizable scale anchors | House/truck or astronaut stays recognizable as distance changes dramatically. Scale communicates presence more effectively than adding objects. | The same red boat survives extraction, curvature, close approach and retreat. |
| Different depth velocities | Near ground/flowers and distant horizon move differently, making camera travel legible. | Glyph depth, passing archive planes, a receding touch floor and forward-moving final enclosure establish distance. |
| Light and negative space | Strong light has a source; large quiet areas make the scene dominant. Bloom sometimes sacrifices detail. | Keep dark editorial space, warm machine accents and light inside the coastal image; preserve crisp type and photographic texture. |
| Minimal peripheral controls | The environment dominates despite small telemetry and an altitude control. Their precise interaction cannot be established from the video alone. | Remove the bottom timeline; retain chapter access through one native disclosure. Native scroll directly controls the authored transforms. |
| Environment changes | The recorded Aurum/Viola switch uses a short dark transition; it is not a continuous object morph. | Preserve our stronger conceptual continuity: one photograph and enclosure transform without a scene reset. |

Cosmic imagery, ambient particles, telemetry, heavy bloom, palette swaps and
free-flight controls were not imported. They would compete with the argument
about attention. No assets from the reference were copied into the exhibition.

## D. Implemented improvements

1. **From data to physical image.** Existing glyph nodes now separate in depth
   before assembling the window. The selected photograph pulls forward during
   the archive arc before the enclosure becomes a touch surface.
2. **Gesture becomes release.** The touch enclosure folds into a receding floor.
   A single Three.js photographic sheet bows, twists slightly and unfurls during
   the camera's counter-orbit. A small gesture ripple precedes it. It becomes
   flat before the contextual text needs attention.
3. **A physical ending.** The transparent frame passes the viewer while context
   recedes. The photograph approaches closely, then settles into a larger quiet
   composition. Final copy arrives after that settlement. Tablets and phones
   have deliberately smaller depth and scale excursions.
4. **Visibility can return.** The bottom timeline is removed. Chapters and About
   remain in a native disclosure. The ending's optional Bring the context back
   link immediately returns to Anticipation, exposing the authored context and
   result again, with visible keyboard focus restored to Chapters.

The boat source was detail-refined with the built-in image-generation tool and
retained at its native 1536×1024 resolution, with lossless WebP output. A controlled
browser comparison also identified a separate rendering defect: permanent
will-change hints magnified a cached smaller raster. Removing those hints made
the enlarged photograph visibly sharper. The small WebGL sheet uses a 2× buffer.
See [provenance and exact prompt](V2_ASSET_PROVENANCE.md).

## E. Strongest cinematic moments

- The archive arc and selected image lifting out of its plane, around 41–50.
- The enclosure falling away while the same photograph curves into space,
  around 81–93. This is the new signature passage.
- The close approach and final retreat, 118–134, followed by an optional return
  of context. The ending now connects spectacle, quiet and accountability.

## F. UI preservation

Five acts, original narrative copy, dark/amber identity, Newsreader and IBM Plex
Mono remain. Interface text stays in the DOM, outside the shader. Scroll remains
native, with no intercepted wheel/touch events or independent animation clock.
Chapter jumps, direct hashes, refresh restoration, resize, skip/replay, keyboard
focus and native pinned-section release passed available checks. Reduced motion
samples the same five resting states and skips WebGL initialization.

The shader is progressive enhancement: DOM imagery remains visible while it
warms or if initialization is unavailable. Context loss immediately restores the
flat photograph; restoration resumes the current scroll pose. Completed enhanced
refresh restoration is tested after shader readiness, rather than treating the
temporary DOM fallback as the final curved pose.

## G. Engineering verification

| Check | Result |
| --- | --- |
| Production static build; TypeScript | PASS |
| Chromium 151.0.7922.34, Firefox 157.0, available Windows WebKit 26.5 | PASS: 41 deterministic states, reverse/rapid seeking, 11 viewports each, 320–1440px |
| Dedicated layout sweep | 275 screenshots; zero remaining flagged overlaps/clipping across 11 viewports; important resting/transition frames visually reviewed |
| Real WebGL surface in Chromium | PASS: rendered-pixel equality on reversal, context-loss fallback/restore, live reduced-motion rebuild, menu fit at four viewport sizes |
| Native input and navigation | PASS: wheel/small deltas, Chromium touch emulation, keyboard chapters, skip/replay, context return, refresh/resize and native release |
| Preserved V1 | Five functional suites passed. Its separate responsive assertion still fails at the known 320px machine-type baseline, 8.4px versus 10px. V1 was not changed. |
| Production dependency audit | Zero reported vulnerabilities |

An initial static-server 404 mismatch was resolved in the local verification
harness by serving the exported Next.js 404 page, then rerunning the V1 keyboard
suite. No application route was changed to accommodate the test.

The final isolated Chromium 12-second traversals measured median rAF intervals
of 16.7ms and p95 16.8ms on both 1440×900 and emulated 390×844. Worst intervals
were 33.4ms and 33.3ms, respectively; neither traversal recorded a long task.
Shader upload, compilation and a hidden first draw moved a previously observed
first-use cost out of the visible gesture. These are scheduling/CPU observations,
not proof of display-presented frame rate. Concurrent cross-browser suite profiles
are retained separately and include a Chromium 63ms task; they are not substituted
for or concealed by the isolated measurements.

Entry chunks total **155,969 gzip bytes**; separately loaded Three.js chunks add
**137,219**, making **293,188 bytes** for an enhanced visit. The former 160,000-byte
entry target still holds; the combined visit is substantially larger. The single
lossless photograph is **1,903,006 bytes**. This is the explicit fidelity/cost
tradeoff for the requested non-planar transformation and sharper image.

## H. Visual evidence

- [Before browser film](v2-directors-cut-evidence/before.mp4) and
  [after / uninterrupted final showcase](v2-directors-cut-evidence/after.mp4).
  Matching authored native-scroll journeys, approximately 49 seconds, 1440×900.
  They are genuine browser recordings, encoded at 25fps, not simulated scenes.
- Matched frames: [old handoff](v2-directors-cut-evidence/before-1440x900-088.png)
  / [curved handoff](v2-directors-cut-evidence/after-1440x900-088.png),
  [old ending](v2-directors-cut-evidence/before-1440x900-140.png)
  / [new ending](v2-directors-cut-evidence/after-1440x900-140.png), and
  [320px ending](v2-directors-cut-evidence/after-320x568-140.png).
- Same refined source, controlled rendering comparison:
  [cached raster](v2-directors-cut-evidence/raster-before.png) /
  [without persistent compositing hints](v2-directors-cut-evidence/raster-after.png).
- [Layout flags](v2-directors-cut-evidence/layout-flags.json),
  [surface acceptance](v2-directors-cut-evidence/surface-acceptance.json),
  [isolated profile](v2-directors-cut-evidence/isolated-profile.json),
  [bundle accounting](v2-directors-cut-evidence/bundle.json), and engine results
  in the same directory. Full raw frames, native recordings, reference samples
  and local harnesses remain in ignored `output/playwright/directors-cut/`.

Rendered review included native forward/reverse scrolling in the in-app browser,
intermediate pauses, chapter access, the ending, pinned release and the actual
return-to-context interaction. Recording frames were also inspected. No human
participant evaluation is claimed.

## I. Remaining weaknesses and limits

The contextual memory is still an authored demonstration, as disclosed; its
interpretation has not been validated with visitors. Physical phones, trackpads,
GPU diversity, network-constrained loading and actual Safari remain untested.
Windows WebKit's native Tab policy skips links; the skip link was explicitly
focused and activated, so native link tab order there remains unverified. The
optional renderer and lossless image increase payload, and a refresh during a
curved pose briefly uses a flat image while the shader initializes. The refined
source is generated detail, not a higher-resolution historical restoration.

## J. Recommendation

Creatively ready for owner review as a local director's cut. The reference's
useful principles strengthened this project's existing subject and spatial
argument without turning it into a cosmic scene. Before any separately
authorized public release, review the film and test real phones/Safari plus
network loading. Existing visitor-validation and release gates remain separate;
no deployment or public action is part of this delivery.
