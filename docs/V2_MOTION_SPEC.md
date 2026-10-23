# V2 Phase 2 — motion specification

## Ownership

Next.js/React/TypeScript and the existing GSAP + ScrollTrigger renderer remain.
There are no new runtime dependencies. One native sticky stage and one paused
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
| 12–20 | Terminal surface recedes; stepped glyph separation and camera approach |
| 20–30 | Same glyphs assemble window perimeter; image grows into dither |
| 29–36 | Window and pointer observation plateau |
| 37–45 | Sideways camera arc; archive windows pass at different depth planes |
| 43–56 | Window chrome withdraws; enclosure becomes a landscape touch surface |
| 55–61 | Touch ring establishes proximity; colour representation arrives |
| 61–77 | Photograph follows a controlled gesture; surface tilts; elastic release |
| 77–81 | Gesture observation plateau |
| 81–100 | Touch dressing leaves; frame opens; context gathers; query completes through a stepped clip reveal |
| 100–112 | Anticipation observation composition with connected memory and provenance |
| 113–131 | Context converges into negative Z; enclosure and masthead withdraw; photograph grows |
| 132–140 | Closing thought arrives; photograph and stillness |

Chapter state boundaries are 27, 55, 86 and 118. Navigation targets are 11.5,
32, 79, 106 and 140. Reduced motion samples exactly those representative states.

## Handoffs

| Passage | Outgoing | Survives | Transformation | Incoming / reverse |
| --- | --- | --- | --- | --- |
| A | Exact instructions | Image data and glyph nodes | Stepped spread, approach, perimeter assembly, scale | Window / reconstructs command field |
| B | Spatial archive | Photograph and enclosure | Shared X/Y/Z rotation, lateral travel, passing planes, surface scaling | Touch surface / reconstructs archive |
| Touch → expectation | Tactile image | Same photograph | Gesture release, frame opens, query reveal, context settles from depth | Memory field / folds back into touch |
| C | Context around image | Full-strength photograph | Negative-Z convergence, enclosure contraction, masthead withdrawal | Quiet image / context returns to exact arrangement |

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
interface surface. Three.js and Flip would add complexity without a demonstrated
missing effect. Next's production First Load JS estimate is 154 kB gzip for `/v2`,
below the existing 160 kB target; images, CSS and fonts are measured separately.

See [verification](V2_PHASE2_VERIFICATION.md) for actual evidence and limits.
