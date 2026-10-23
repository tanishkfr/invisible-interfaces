---
name: Invisible Interfaces V2
description: A five-act photographic exhibition about the visible work of operating an interface.
colors:
  canvas: "#0a0a0b"
  surface: "#111113"
  ink: "#e8e6e3"
  accent: "#e8a33d"
  line: "rgba(232, 230, 227, 0.1)"
  supporting-copy: "#aaa69e"
  reading-copy: "#b0aba2"
  navigation-muted: "#97938b"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(84px, 9.4vw, 160px)"
    fontWeight: 300
    lineHeight: 0.84
    letterSpacing: "-0.065em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(32px, 3.5vw, 58px)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "20px"
    fontWeight: 300
    lineHeight: 1.6
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.1em"
spacing:
  s-2: "8px"
  s-3: "12px"
  s-4: "16px"
  s-5: "24px"
  s-6: "40px"
  s-7: "64px"
components:
  chapter-link:
    textColor: "{colors.navigation-muted}"
    padding: "16px 0"
  chapter-link-current:
    textColor: "{colors.ink}"
  about-link:
    textColor: "{colors.ink}"
    padding: "12px 0 12px 12px"
  about-link-hover:
    textColor: "{colors.accent}"
---

# Design System: Invisible Interfaces V2

## Overview

**Creative North Star: "One photograph / five relationships"**

This document records the implemented `/v2` route. It supplements the shared `design.md` and `VISUAL_SYSTEM.md`; it does not replace their authority or prescribe a new identity for other routes. The implementation is a five-act local release candidate, with an editorial title, an authored mechanical world, and a semantic reading room.

One photograph remains recognizable as its representation changes from terminal data to a spatial archive, a touch surface, contextual memory, and a final image without surrounding controls. Near-black space, warm machine light, and two typographic voices connect the acts. Native scrolling advances the exhibition; a compact native Chapters disclosure offers direct access to resting states. The bottom timeline has been removed at the owner's request.

**Key Characteristics:**

- A persistent photographic subject across three fidelity representations.
- Newsreader for human statements; IBM Plex Mono for machine evidence and navigation.
- A pinned composition with deliberate CSS 3D travel and receding chrome.
- A separate reading room containing the story and disclosure of authored behavior.

## Colors

The inherited dark palette separates human reading, machine attention, and quiet boundaries without adding another accent family.

### Primary

- **Amber attention** (`accent`): terminal prompts, cursor, transforming image-data glyphs, the current chapter index, and keyboard focus. The opening title also carries an amber period.

### Neutral

- **Canvas** (`canvas`): continuous exhibition ground.
- **Surface** (`surface`): the touch-era shell during its transformation.
- **Warm ink** (`ink`): principal statements, selected content, and active navigation.
- **Supporting copy** (`supporting-copy`): introduction copy, scene identification, context details, and footer text.
- **Reading copy** (`reading-copy`): longer reading-room prose and chapter explanations.
- **Navigation muted** (`navigation-muted`): inactive chapter links and peripheral notation.
- **Boundary line** (`line`): header and reading-room dividers.

Additional dark surfaces and grey strokes describe individual machine artifacts. They are local treatments, not an expanded semantic palette.

### Named Rules

**The Attention Rule.** Preserve amber as the established machine and focus signal; do not introduce a competing accent family.

## Typography

**Display Font:** Newsreader, with Georgia and serif fallbacks.

**Body Font:** Newsreader, with Georgia and serif fallbacks.

**Label/Mono Font:** IBM Plex Mono, with monospace fallback.

**Character:** Light, tightly set editorial statements coexist with measured machine text. The loaded Newsreader weights are 300, 400, and 500 in normal and italic styles; IBM Plex Mono is loaded at 400.

### Hierarchy

- **Display:** the opening two-line title uses the frontmatter display role, with an italic second line. Mobile changes its size to a viewport clamp; the short-phone override reduces it further.
- **Headline:** act statements use the frontmatter headline role. The concluding statement uses a smaller clamp and preserves its authored line break.
- **Reading headline:** the reading-room heading uses a separate responsive scale (`clamp(48px, 7vw, 100px)`), light weight, tight tracking, and near-solid leading.
- **Body:** reading-room prose uses the frontmatter body role and a maximum width of 650px. The introduction uses the same size with tighter leading; mobile prose is smaller.
- **Label:** scene indices and exhibition identification use the machine voice. Chapter controls use 11px text on desktop and phones; their smaller index is subordinate to the readable chapter verb.

### Named Rules

**The Two Voices Rule.** Human statements and outcomes use Newsreader; commands, chapter identification, archive evidence, and controls use IBM Plex Mono.

## Layout

Phase 3 fit refinement: the sticky viewport follows actual viewport height,
without a forced 650px phone minimum. Phone heights up to 740px fit the camera
at 0.9; up to 620px use 0.75 and tighter opening/final spacing. The scroll cue
occupies its own lower-left strip. Tablet context entrances move
inward, and their archive index retains a deliberate side inset. These local
fits are not new reusable typography or spacing tokens.

The route uses a sticky, viewport-height exhibition inside a long native-scroll section. The desktop header and chapter disclosure share 40px side insets. On phones they compress to 20px, while the title and statements use 25px side insets. The recurring spacing steps above match the existing shared rhythm; they are not a mandate to normalize every scene coordinate.

The opening title occupies the left side and the terminal the right on wide screens. Phones stack the title above the mechanical world. A top-right Chapters disclosure opens five stacked chapter links plus About. It retains indices, names and verbs on phones; the menu fits within a 20px inset and each link has at least a 48px height. The closed control has a 44px hit area. Escape closes the menu and restores focus. The bottom of the exhibition is clear.

Responsive behavior is explicit: compact layouts end at 700px; tablet adjustments cover 701–1100px. Desktop heights up to 820px reduce the camera scale and statement sizes. Phones up to 740px high apply a further compact composition, including revised context placement and smaller closing copy. These are authored route layouts, not reusable scene geometry.

The reading room returns to document flow. Its two-column act list becomes a single column on phones, and its footer stacks vertically. The skip link reaches this section directly.

## Elevation & Depth

Anticipation's old connector arms/stem were removed because they crossed context
and result text. The photographic focus brackets and contextual depth movement
retain the visual relationship without that clutter.

There are no decorative drop shadows in this route. Depth comes from perspective, rotations, translated layers, luminance, thin boundaries, and intentional window occlusion during travel. A single camera/world hierarchy carries the photograph and its surrounding machine artifacts. Its desktop perspective is 1250px, with a tablet adjustment to 1550px.

### Named Rules

**The Shared World Rule.** Keep the photograph and its transforming frame in the same spatial continuity; depth expresses a change in operation rather than a new page or disconnected spectacle.

Native scroll maps to a GSAP timeline with linear default easing and authored eased transformations. Reduced motion selects each act's resting time instead of continuously scrubbing transformations, shortens the scroll section, and removes the scroll cue. The global reduced-motion rule collapses CSS transition durations.

## Shapes

The terminal and early archive use rectangular shells and thin strokes. The shell rounds during the touch transformation, then recedes; the photograph also changes its corner treatment with the act. Touch rings are circular, and image-focus brackets remain open corners. These shapes carry the depicted interaction era. They do not establish a global card, chip, or radius library.

## Components

### Chapter navigation

A native details/summary disclosure replaces the former bottom rail and progress line. Its panel contains five chapter links and About. Inactive links use muted navigation ink. Hover and the current chapter use warm ink, with the current index in amber. The color transition lasts 180ms. Summary and links have visible amber keyboard focus. Links update the hash, jump immediately to the associated resting state, close the panel and return focus to the summary. The control stays available when the masthead withdraws.

### Header and reading links

The v2 About link now reaches its own reading room via a native anchor. The
preserved v1 About page remains separate and unchanged.

The wordmark, About link, and reading-room links remain native anchors. About lives inside Chapters. Reading links become amber on hover and carry a visible underline with a five-pixel offset. The masthead withdraws near the final act; Chapters remains available. The ending's optional Bring the context back anchor returns to Anticipation and exposes the authored context again. It is hidden and unfocusable until the final composition arrives.

### Skip link

A fixed machine-text link appears on focus. It uses the shared black ground, warm ink, amber border and focus outline, and routes directly to the reading section. Its settlement transition is removed under reduced motion.

### Persistent photograph

Terminal ASCII, dithered image, full-color image and WebGL texture derive from one photographic source. The current source is a detail-refined generated version of the original, retained at its native 1536×1024 resolution and exported losslessly. The dither representation alone uses pixelated rendering. The photograph is cropped with `object-fit: cover`; the camera layer is hidden from the accessibility tree because the reading room supplies the semantic story. Avoid permanent will-change hints on the scaled photograph/world: actual Chromium comparisons showed those caching a smaller raster and softening the image during enlargement.

### Director's cut spatial motion

The image pulls forward from the archive. Later the touch enclosure folds into a receding floor while a Three.js sheet curves and unfurls the same photograph. A small diagonal ripple follows the gesture; no independent idle animation runs. The shader changes material shape rather than moving the depicted sea or adding decoration. It returns to a flat image before context becomes readable. The last transparent frame passes the viewer; the photograph approaches closely, then settles into the quiet ending before the final text arrives.

The supplied Two Horizons recording informed the use of recognizable scale anchors, differing depth velocities and approach/retreat. Its cosmic imagery, particles, palette changes and telemetry were deliberately not imported. The interface's own history supplies the spatial environment. Three.js is an optional, separately loaded enhancement; reduced motion and unavailable/lost WebGL retain the complete CSS/DOM exhibition.

The cinematic refinement brings Gesture closer: the photograph bends and banks
with the camera while its caption yields, then settles at a larger scale. During
Anticipation the same continuous sheet forms eight connected creases, approaches
through an orbit, and opens toward the viewer. Its existing focus corners find
the red boat before the query appears. The close image lowers and settles while
context catches up; the focus expands from the subject to the whole memory.
Amber here identifies machine attention. The desktop close scale is retained
longer; phones and tablets use smaller travel to protect surrounding text.
There are no gaps, duplicate photographs or new panels.
The early data field has stronger foreground/background separation. The archive
arc, Gesture camera and final composition remain unchanged. See [continuity acceptance](../V2_ANTICIPATION_CONTINUITY.md).

### Machine artifacts and context

Terminal commands, archive rows, window bars, selected files, glyphs, pointer, gesture trace, context labels, and focus brackets are authored representations of operation. The glyphs transform image data into window geometry. They are not ambient decoration or a generic icon system. Context text is arranged around the image without a notification-card pattern. These authored demonstrations are disclosed in the reading room.

## Do's and Don'ts

### Do:

- **Do** preserve the dark/amber palette and the two established typographic voices.
- **Do** keep the same photographic subject recognizable across fidelity changes and transformations.
- **Do** preserve scene indices, chapter identification, native anchor access, and visible keyboard focus.
- **Do** retain the semantic reading room and disclosure of generated imagery and authored behavior.
- **Do** use the compact and reduced-motion layouts when extending the route.

### Don't:

- **Don't** replace the pinned cinematic composition with a generic card grid.
- **Don't** turn the terminal's machine glyphs into unrelated decorative particles.
- **Don't** treat per-scene coordinates, camera poses, or terminal illustration text sizes as global reusable tokens.
- **Don't** invent live inference, background tasks, or interactive controls for the authored demonstrations.
