# Anticipation and continuity refinement

## A. Verdict

PASS for the local implementation and browser acceptance. The creative judgment is that this deserves to replace `95dd5a9`: the same photograph now finds its subject before the query appears, and its closer scale survives the handoff. This is an authored demonstration, not live inference or evidence of visitor comprehension. Physical-device and visitor validation remain outstanding.

## B. Repository state

- Dedicated local branch: `codex/v2-anticipation-continuity`.
- Starting commit: `95dd5a9d7f91c634fafb868602d2fa2ca34f4d67`.
- Completed changes are committed locally; the final handoff records the resulting SHA and working-tree check.
- No push, merge, deployment, publication, separate portfolio changes, dependency changes or v1 source changes.

## C. Creative diagnosis

The previous version performed a compelling material fold, then reduced the image and revealed the contextual composition almost together. The image arrived first technically, but the viewer mostly saw a new screen of explanatory labels. The choreography did not clearly change who initiated the interaction.

Two approaches were considered: bring all the context toward the viewer, or let the photographic result lead and allow context to catch up. The first would intensify the existing label entrance and compete with the photograph. The second uses the recognizable boat as the initiator and needs no additional interface.

## D. Chosen solution: the result leads

The folded photograph opens toward the viewer and retains its close scale. The existing focus corners move onto the red boat before the query appears. They then open from that detail to the whole photograph while the image lowers and settles and the existing contextual information gathers around it. The query completes after recognition has already occurred.

The machine appears to recognize and organize a useful memory, rather than waiting for a completed instruction. Amber identifies machine attention using the established visual language. No notification, card, connector, extra label, new copy, duplicate photograph or independent animation was added.

## E. Actual changes

- Gesture through time 94 keeps the established camera, banking and material motion.
- Connected recall opens over 94-100 instead of 94-101. Geometry, texture, renderer and drawing buffer are unchanged.
- Camera leveling ends at 101. The photo opens to scale 1.48 on wide screens, 0.98 on tablets and 1.04 on phones at 100; it settles to the original chapter pose over 100-106.
- Photo lowering protects the reading lane while retaining the larger desktop image. Compact lowering is deliberately smaller.
- Focus corners identify the boat over 97-100, then expand to the whole image over 100-106. A centered transform origin and non-scaling SVG stroke keep the corners legible.
- The archive index rises clear of the photograph, then settles. Query appears over 100-102, completion stays at 102-105. Context entrances are staggered over 100-105.
- Five act boundaries, chapter targets, 140-unit duration, native scroll, reading room and reduced-motion state selection remain intact.

## F. Continuity

The same DOM photograph and one existing shader sheet carry Gesture into recognition. No cut, replacement image or autonomous clock interrupts reverse scrolling. Absence retains its established negative-Z context withdrawal, enclosure flyby, photographic approach and quiet settlement. Anticipation reaches the original photograph pose at 106 before that withdrawal starts at 113.

Fifteen matched desktop PNGs are byte-identical before/after, including the opening, Command/Window transitions, archive arc, Gesture approach/banks/settlement and final time 140. See `v2-continuity-evidence/preserved-poses.json`. Anticipation's resting brackets intentionally change to amber; the remaining layout and copy are retained.

## G. Visual evidence

All films are genuine Chromium recordings at 25 fps, encoded as H.264 without synthesized animation or speed changes. Desktop passages are approximately 36 seconds; the full walkthrough is 49.12 seconds. The phone viewport is 375 x 667; its browser video is encoded at 374 x 666 because the recorder uses even dimensions.

- [Before handoff, anticipation and exit](v2-continuity-evidence/before-handoff.mp4).
- [After matched passage](v2-continuity-evidence/after-handoff.mp4).
- [Complete final walkthrough](v2-continuity-evidence/showcase.mp4).
- [375 x 667 final passage](v2-continuity-evidence/mobile-handoff.mp4).
- Matched desktop and phone PNGs, including recognition at 99 and context at 102, are alongside those films.

Before/after desktop passages use the same 1440 x 900 viewport and scroll keyframes. The passage includes Gesture, recognition, context and the complete exit into Absence. Normal-rate browser playback and selected intermediate frames were reviewed, alongside native scrolling in the in-app preview. Raw footage, initial trials and the capture harness remain in ignored `output/playwright/continuity/`.

## H. Verification

- Production static export and TypeScript passed.
- Chromium 151.0.7922.34, Firefox 157.0 and available Windows WebKit 26.5 passed the established suite: 47 timeline states, forward/reverse and rapid seeks, persistent photograph, restoration, chapter/hash navigation, resizing, keyboard, reduced motion, native release and 11 viewports from 320 x 568 to 1440 x 900. The suite now also compares focus-corner transforms on reversal and asserts recognition before the query.
- Expanded layout sweep: 41 poses x 11 viewports, zero overlap/clipping flags. Additional quarter-unit sweep at 97-107: 451 checks, zero flags. Checks were expanded rather than relaxed.
- Real WebGL pixels reverse identically at 67, 87 and 94. Context loss/restoration, live reduced-motion cleanup, responsive menus and simulated unavailable WebGL at 320 x 568 passed without page/console errors.
- V1 opening/terminal, pinned scenes, keyboard/404, morph and entrusted-task suites passed against the final static export with the production 404 harness. V1 source, global styles, assets and dependencies are unchanged. The unrelated historical v1 320px type-size criterion was not changed or claimed fixed.
- Entry JavaScript: 156,256 gzip bytes, +105 bytes from the starting commit and below the 160,000-byte entry target. Optional Three.js remains 137,563 bytes; combined 293,819 bytes. No additional image/font payload, geometry, draw call, render loop or dependency.
- Separate 12-second Chromium traversals after recording and other test jobs finished:

| Viewport | Prior p95 / current p95 | Prior task / current task seconds | Current script / layout seconds | Long tasks |
| --- | --- | --- | --- | --- |
| 1440 x 900 | 16.8 / 16.7 ms | 3.301 / 3.414 | 0.299 / 0.00234 | 0 |
| 390 x 844 | 16.7 / 16.8 ms | 1.907 / 2.090 | 0.301 / 0.00245 | 0 |

Cadence remains comparable; recorded task work is modestly higher, especially on the emulated phone. These are separate local runs, not a controlled hardware benchmark. Desktop sampled 718 rAF intervals and phone 720; both maxima were approximately 33.4 ms. Full counters are in `v2-continuity-evidence/isolated-profile.json`; prior counters remain in `v2-refinement-evidence/isolated-profile.json`.

One parallel WebKit run failed a reduced-motion pose settlement assertion. The unchanged final build passed the complete rerun; the failure is retained in ignored `webkit.log`, with passing output in `webkit-retest.log`. This is not presented as proof that timing variability cannot recur. Windows WebKit also required explicit skip-link focus because its native Tab policy skips links; actual Safari link tab order remains unverified.

Physical phones, physical trackpads, actual Safari, GPU diversity and visitor interpretation are not proven by browser emulation. rAF cadence is not a measurement of presented GPU frames.

## I. Critical assessment

The strongest improvement is temporal: recognition is now a visible action before language explains it. The photograph has room to remain physically present while the information reorganizes. The ending remains quieter and larger than the contextual resting composition.

The first enlarged-image trials collided with the archive/query lane; a later short-phone overlap existed only between regular capture times. Those trials were rejected. Lowering the photograph, simplifying the query entrance and restricting phone travel resolved the collisions without adding interface or changing text.

The boat-recognition cue is intentionally restrained and briefer during fast scrolling; the exhibition remains scroll-authored, so it cannot guarantee every viewer notices that distinction. On small phones, continuity and legibility take priority over desktop scale. This remains an interpretive cinematic argument, with the authored-behavior disclosure and optional accountable return preserved.
