# V2 — cinematic refinement motion specification

## Ownership

Next.js/React/TypeScript and the existing GSAP + ScrollTrigger renderer remain.
Three.js adds one optional photographic sheet; it does not render interface text.
One native sticky stage and one paused
timeline own animated transforms. ScrollTrigger maps native section progress to
`timeline.time(progress * 140)`. No JavaScript pin or intercepted scrolling is used.
All copy lives in `content/v2.ts`; photographic representations are isolated in
`PhotoArtifact.tsx`. V1 scene code and its artifact are unchanged.

```text
Native scroll → section progress → paused 140-unit timeline
    CSS perspective camera
      shared world / one evolving enclosure
      forty glyph-to-perimeter segments
      one persistent photograph / dither and full-colour interiors
      window, touch and contextual dressing
    native sticky release → semantic reading room
```

## Timeline (units, not percentages or seconds)

| Time | Behavior |
| --- | --- |
| 0–11.5 | Opening poster yields; approach terminal; command thought |
| 12–20 | Terminal surface recedes; glyphs separate into foreground/background depth; stronger desktop approach |
| 20–30 | Same glyphs assemble window perimeter; image grows into dither |
| 29–36 | Window and pointer observation plateau |
| 37–45 | Sideways camera arc; archive windows pass at different depth planes |
| 41–56 | Selected photograph lifts out of the archive plane; chrome withdraws; enclosure becomes a landscape touch surface |
| 55–61 | Touch ring establishes proximity; colour representation arrives |
| 61–79 | Close photographic approach; opposing banks and material bend; caption yields; image and enclosure settle at larger scale |
| 79–81 | Gesture observation plateau |
| 81–94 | Touch plane folds away; photograph bows, then forms a connected concertina through a camera orbit |
| 94–102 | Photograph approaches and opens; index and query arrive after recall; material becomes flat by 101 |
| 102–105 | Query completion and contextual meaning resolve after the photograph has returned |
| 100–112 | Anticipation observation composition with connected memory and provenance |
| 113–128 | Context recedes into negative Z; transparent enclosure passes the viewer; masthead withdraws; photograph approaches closely |
| 128–134 | Photograph settles from the close approach to the final editorial composition |
| 134–140 | Closing thought and optional return-to-context link arrive; stillness |

Chapter state boundaries are 27, 55, 86 and 118. Navigation targets are 11.5,
32, 79, 106 and 140. Reduced motion samples exactly those representative states.

## Handoffs

| Passage | Outgoing | Survives | Transformation | Incoming / reverse |
| --- | --- | --- | --- | --- |
| A | Exact instructions | Image data and glyph nodes | Stepped spread, approach, perimeter assembly, scale | Window / reconstructs command field |
| B | Spatial archive | Photograph and enclosure | Shared X/Y/Z rotation, lateral travel, passing planes, surface scaling | Touch surface / reconstructs archive |
| Touch → expectation | Tactile enclosure | Same photograph | Floor fold, curved sheet, counter-rotation, unfolding index, context settles from depth | Memory field / sheet and touch plane reconstruct |
| C | Context around image | Full-strength photograph | Negative-Z context, forward frame passage, close approach and retreat, masthead withdrawal | Quiet image / context returns to exact arrangement |

Opacity supports the material changes; spatial movement supplies the handoffs.
Camera easing uses `power2`/`power3.inOut`; mechanical separation uses `steps(8)`;
query completion `steps(14)`; gesture release `back.out(1.15)`. Reversing native
scroll rewinds the same timeline, without an independent autoplay clock.

## Responsive and accessible behavior

- Desktop >1100px: 740×430 initial enclosure, 430px photograph, maximum −38°
  Y rotation and −145px lateral movement in the archive passage.
- Tablet 701–1100px: centered opening below editorial title, smaller anticipation
  photo and separately positioned context labels; reduced anticipation yaw/depth.
- Mobile ≤700px: 310×292 enclosure, 258px photograph, horizontal file row,
  −22° archive yaw, −24px lateral travel, context below the image.
- Height-aware CSS fits laptop and short-phone context/result/navigation spacing.
- Reduced motion uses static chapter compositions on a six-viewport path. A
  ResizeObserver refreshes ScrollTrigger after measured section-height changes;
  this fixes Firefox's stale range during live preference changes.
- Chapter links, direct and same-page hashes, skip, replay and native restoration
  are supported. Facsimile controls are decorative; the semantic reading room
  preserves all essential narrative text.

## Lifecycle and cost

GSAP matchMedia rebuilds from explicit initial styles. Its context owns timeline
and trigger cleanup. Custom chapter/hash listeners, observers and queued frames
are explicitly removed. A disposed guard protects the font-ready refresh.
No React state changes per frame, no per-scroll geometry reads and no animated
width/height/top/left/margin/font size. Limited radius, colour and clip interpolation
remain where they visibly change the interface material.

CSS 3D gives the required planar camera arc without duplicating a renderer or
interface text. Three.js supplies the non-planar photographic transformation that
CSS 3D cannot express as one continuous surface. Eight connected strips with
64×32 segments in aggregate, one texture and one shader live inside the existing
photograph's CSS camera frame. Shared edge positions keep the image continuous;
separate edge vertices permit creases. Triangle count remains 4,096; vertices
increase from 2,145 to 2,376. Uniforms follow the same paused timeline: tactile
bend/ripple 61–79; bow 81–98; connected recall folds 88–101.
The renderer draws only when a deformation is active, with no independent rAF
loop. Texture upload, shader compilation and one hidden warm-up draw occur before
visible use. A ResizeObserver updates the local drawing buffer without per-scroll
layout reads. Context loss reveals the DOM photograph immediately. Resize/media
cleanup disposes texture, geometry, material, renderer, observers and listeners;
pending imports/compilation are guarded against disposal. Reduced motion skips
initialization entirely. The small sheet uses a fixed 2× drawing buffer so the
outer CSS camera does not soften its texture on 1× displays.

Do not add permanent will-change hints to the photograph/world. Rendered
Chromium comparisons showed these magnifying a cached smaller raster; removing
them restored detail at the largest scale. The source is now native 1536×1024
with a lossless WebP export. See the director's cut report for measured combined
JavaScript and image cost, rather than treating the entry-chunk estimate as the
entire enhanced visit.

Navigation is a native top-right chapter disclosure, not a bottom timeline. The
final optional return-to-context link uses the existing chapter jump path and
restores visible keyboard focus to Chapters. No new mandatory journey is added.

See [current verification](V2_CINEMATIC_REFINEMENT.md) for evidence and limits.
The [director's cut](V2_DIRECTORS_CUT.md) and [Phase 2 verification](V2_PHASE2_VERIFICATION.md)
remain historical checkpoints.
