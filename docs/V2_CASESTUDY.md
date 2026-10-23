# Invisible Interfaces — v2

**A cinematic, scroll-driven exploration of how human-computer interaction evolved.**

Concept, interaction design, art direction and implementation: a self-directed
portfolio project by Tanishk Salagame. Built with Next.js, React, TypeScript,
GSAP/ScrollTrigger and CSS 3D. AI assisted implementation, critique and the
creation of its fictional photographic scene; no participant research or
measured learning outcome is claimed.

## The idea

The evolution of interaction, told through the disappearance of the interface.
One photograph of a red boat travels through five relationships with computing:
command, window, gesture, anticipation and absence. The destination stays
recognizable while the visible means of reaching it changes.

These are overlapping paradigms, not a definitive sequence of inventions or a
claim that each technology replaced the last. The closing question remains:
out of attention does not mean out of responsibility.

## Why scroll

Scroll makes the visitor the editor of a continuous film. They can approach a
transformation slowly, rush past, pause inside it or reverse to compare. No puzzle
or secondary task is required. Chapter links and a semantic reading room provide
direct access when continuous motion is inconvenient.

Native scrolling is retained. The experience does not intercept the wheel,
simulate momentum or make visitors wait for an animation to catch up.

## Five relationships, one artifact

| Act | Visual and motion idea |
| --- | --- |
| Command | A literal instruction locates a memory. ASCII image data breaks into a structured field and assembles the next window's perimeter. |
| Window | The image becomes a selected file in a spatial archive. A lateral camera arc reveals related windows at different depths. |
| Gesture | The same enclosure becomes a landscape touch surface. The photograph moves, rotates and returns with a restrained elastic release. |
| Anticipation | The frame opens; contextual connections and query completion surface the photograph without another file-navigation sequence. |
| Absence | Context converges into depth and chrome withdraws. The photograph stays, alongside a concise closing thought. |

The image's container persists through the timeline. Its ASCII, one-bit dither
and colour representations derive from one generated source, preserving the
boat, shoreline and headland. This gives the camera a visual anchor rather than
hiding disconnected scenes behind cuts. [Provenance](V2_ASSET_PROVENANCE.md)
records the original, hash and reproducible derivatives.

## Art direction and refinement

Near-black space, warm ink and amber machine attention preserve the project's
identity. Newsreader carries human statements; IBM Plex Mono carries commands
and evidence. The contrast is intentional, and actual loaded glyph fonts were
verified in the browser. No new decorative typeface was needed.

The Phase 3 review concentrated on composition at the moments between resting
states. It found tablet text entering outside the viewport, short-phone gesture
crowding, a scroll instruction crossing its terminal frame and a minimum stage
height that hid navigation on a 568px-high screen. Targeted camera fitting and
spacing repaired those problems. Removing anticipation's text-crossing connector
lines made its hierarchy quieter while preserving the context choreography.

The spatial window arc remains the strongest transition. Anticipation is still
the densest composition, and the meaning of its final two chapter verbs deserves
real first-time visitor observation. More effects would not resolve that question.

## Engineering choices

One paused 140-unit GSAP timeline is sampled from the native scroll range. A
shared perspective/world hierarchy owns transforms. There are no per-frame
React state updates, random paths or independent autoplay clocks. CSS 3D is
sufficient for the planar archive; adding Three.js would duplicate rendering
without solving a demonstrated visual limitation.

Responsive layouts change the composition, not just its scale: phones place
context below the image, reduce camera travel and fit shorter screens. Tablets
receive their own context entrance. Reduced motion selects five representative
states while preserving the whole narrative and usable chapter navigation.

The visual facsimiles are hidden from the accessibility tree. The reading room
describes the complete sequence and discloses the generated scene and authored
simulation. Skip, replay, focus rings and native anchors remain available. This
is tested behavior, not a declaration of full WCAG conformance.

## Acceptance and limits

See [the Phase 3 acceptance report](V2_PHASE3_ACCEPTANCE.md) for final measured
build, browser, layout, security and performance results. The local v2 candidate
does not replace or publish over v1. Existing v1 source and its distinct
hidden-tab experiment remain intact.

Independent agent review and automated traversal provide useful evidence, but
cannot establish real visitor comprehension, physical phone/trackpad quality or
actual Safari behavior. Those require the owner's release checklist and
[visitor-testing guide](V2_VISITOR_TESTING.md). No research participants or
quantitative user benefits have been invented.

## Portfolio presentation

Use the current exhibition screenshots and genuine browser showcase rather than
v1's receipt interface. Suggested card copy, media choices and migration
boundaries are in [the portfolio handoff](V2_PORTFOLIO_HANDOFF.md). The separate
portfolio repository is unchanged.
