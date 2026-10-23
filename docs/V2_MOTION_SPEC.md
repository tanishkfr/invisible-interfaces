# V2 Phase 1 — motion specification

## Architecture

`app/v2/page.tsx` loads route-scoped CSS and `CinematicExperience`. All visible copy
lives in `content/v2.ts`. The v1 experience and Motion-driven components have not
been edited. The only runtime dependency added is GSAP 3.15.

```text
Native document scroll
    ↓ section progress = (scrollY − start) / (end − start)
One ScrollTrigger, no JS pin, no scroll interception
    ↓ timeline.time(progress × 100)
CSS perspective camera
    └─ shared world
        ├─ one evolving shell
        ├─ 40 glyph → frame segments
        ├─ one persistent beach image
        ├─ window / touch dressing
        └─ context layers
    ↓ native sticky release
Semantic reading room
```

GSAP animates transforms and opacity, with limited border-radius, surface color,
and border-color interpolation. No width, height, top, left, margin, or font-size
is animated. Base dimensions are set once per responsive context. Scroll updates
do not set React state or read layout; chapter ARIA updates occur only on a
chapter change. All paths use explicit coordinates; there is no randomness.

## Timeline

| Time / percent | Built behavior |
| --- | --- |
| 0–11 | Opening poster yields; camera moves into terminal; first thought arrives |
| 12–20 | Terminal dressing and shell recede; stepped glyph separation; camera approaches |
| 20–30 | Glyph field assembles the window perimeter; image grows from file scale |
| 25–36 | Window chrome and pointer settle; GUI observation plateau |
| 37–45 | World arcs to the left; two actual archive planes pass through depth |
| 43–56 | GUI chrome withdraws; shell narrows; persistent image recenters; world faces forward |
| 55–62 | Touch ring, small image movement, restrained elastic return |
| 66–78 | Temporary bridge: surface opens around the photo; context layers organize |
| 81–94 | Context layers converge through depth and diminish; shell contracts; masthead withdraws |
| 94–100 | Still image and concluding thought |

## Handoffs

| Sequence | Outgoing | Persistent anchor | Transformation | Incoming | Reverse |
| --- | --- | --- | --- | --- | --- |
| A | File listing and amber marks | Same image container and command marks | Camera forward; stepped spread; perimeter assembly; image expansion | Graphical archive window | Geometry contracts into its original command field |
| B | Graphical window and selected image | Same shell and photograph | Leftward arc, rotation X/Y/Z, passing depth planes; shell X/Y scaling | Front-facing touch surface | Gesture unwinds; desktop geometry and archive planes reconstruct |
| C | Anticipatory context around image | Same photograph, always full opacity | Context translates into negative Z on converging paths; enclosure contracts | Photograph and reflection | Context returns to its exact spatial arrangement |

Camera easing changes within a single deterministic timeline: stepped command
motion, `power2`/`power3.inOut` geometry, a small `back.out(1.3)` touch settlement,
and slow convergent subtraction. No timed autoplay is needed to finish a scene.

## Responsive paths

- **Desktop >1100px:** lateral terminal opening, 740×430 window, 430px image,
  −38° maximum Y rotation, −145px shared lateral travel.
- **Tablet 701–1100px:** terminal begins centered below the poster; shared desktop
  window geometry fits the 768px study viewport. No side annotation.
- **Mobile ≤700px:** distinct 310×292 window and 258px image, horizontal file row,
  272px touch enclosure, −22° maximum Y rotation and −24px lateral travel.
  Context layers stack around the image. Satellite planes can leave the clipped
  stage; the photograph remains in view. This is not a scaled desktop canvas.
- Height-aware desktop CSS reduces caption and header density below 760px.

## Technology choices

CSS 3D proved sufficient in rendered transition captures: shared perspective,
`preserve-3d`, and transform-based archive planes create the camera arc while
preserving crisp text. Three.js would add a renderer and duplicate interface
surfaces without improving these planar moments. It was not introduced.

Flip was considered but not used. There are no actual DOM layout changes to
measure; explicit shared-space coordinates are easier to scrub bidirectionally.
The shell and photograph retain identity; their interiors can change fidelity.

GSAP's [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) and
[matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) provide the local
scroll mapping and responsive cleanup. `media.revert()` owns the timelines and
trigger. Custom chapter/hash listeners and the queued frame are explicitly
removed. A disposed guard prevents font-ready callbacks refreshing after unmount.

## Accessibility and navigation

- Native scrolling, no wheel/touch cancellation, no mandatory terminal puzzle.
- All five chapter links work with a keyboard and jump immediately to a useful
  state. Same-document hash changes also work. No animated keyboard travel.
- Direct chapter entry is resolved after the first refresh. Nonzero native
  restoration is retained rather than automatically jumping back to a hash.
- Reduced motion samples times 11, 32, 59, 77, 100, removing travel, rotation,
  and continuous morphs. Five essential compositions and all semantic text remain.
- Visual interface facsimiles are `aria-hidden`; the reading room describes
  each relationship without exposing decorative glyphs or fake controls.
- The first focusable link skips the animation to a focusable reading section.
- Amber focus rings remain inherited from the existing visual system.

## Performance and boundaries

Only the shared world and photo have persistent `will-change` hints. Most layers
are hidden outside their useful ranges. No full-screen filters, request loop,
React-per-frame updates, hosted assets, analytics, or runtime AI are added.

The reused full-color artifact is v1's authored SVG beach illustration, not a
newly generated photograph. Its texture is a small image-local SVG filter.
Image fidelity changes through an interior dissolve; the spatial anchor does not.

Phase 2 can extend the shared timeline and object ownership without replacing
this renderer. Its full narrative interactions, consequential system behavior,
and final editorial pacing remain to be designed and tested.
