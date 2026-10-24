# Lived memory: interactive motion refinement

**Verdict: PASS** for the local creative implementation and browser acceptance; physical-device and visitor validation remain outstanding.

This local experiment makes the exhibition respond to a visitor's framing, then lets its quiet ending be questioned. The opening, archive arc, native-scroll model, five acts, photographic source and visual identity remain intact.

## What changed

### Gesture leaves a real memory

During Gesture, horizontal dragging changes how closely the photograph frames the boat. Two native wide/closer buttons provide equivalent keyboard and touch access. Vertical touch movement continues to scroll the exhibition. The change is direct while dragging; pointer button choices settle over 650 ms, while keyboard and reduced-motion changes are immediate.

The crop is retained in a component-local ref. Its magnification and origin match between the DOM photograph and Three.js texture. It survives responsive and preference rebuilds; it is cleared by reload or explicit reset. There is no storage, inference, background task or new network service.

The remembered crop withdraws as the image enters the fold, returns over timeline 95-101 before the query completes, and holds through the contextual composition. The result identifies a visitor framing when one was chosen. The ending gradually releases the crop and leaves the full photograph.

### Material releases toward the boat

The original eight creases now open progressively from the distant shore toward the foreground boat. Eight CPU-computed hinge vectors are integrated in the vertex shader. Shared boundary positions stay connected, including during reverse scrolling; the texture is never split into detached images.

The existing 2,376 vertices, 4,096 triangles, one texture, one draw call and 2x drawing buffer are retained. No independent idle loop, particle field, added asset or dependency was introduced. Recognition corners accommodate both wide and closer views.

### The ending can explain itself

Why this image opens a native modal around the existing photograph. Context travels outward into the surrounding space and an amber perimeter returns. The view identifies either the visitor's framing or the authored default, explains when it returned, discloses image generation/authored recall, and offers a reset.

Closing withdraws the information without jumping chapters. Escape and keyboard actions are immediate. Focus wraps, reset transfers focus to the close action, close explicitly restores focus to the opener, and body overflow/gutter styles are restored. The existing Bring the context back link remains available.

## Visual review

The first inspector title crossed the photograph, and the shortest phone crowded context into its footer. Those layouts were rejected. The selected layout places the heading in clear space, keeps context beside the image on wide screens and below it on narrower screens, and uses concise copy. Inspection geometry is checked at all 11 established viewport sizes in every engine.

The closer crop was moved to a 10% / 78% origin so the entire boat remains visible. No typography family, palette, chapter rail or unrelated interface was added. The final still photograph remains the visual endpoint; inspection is optional.

- [Full recorded journey, real drag and inspection](v2-memory-evidence/showcase.mp4)
- [Remembered passage and inspection](v2-memory-evidence/remembered-passage.mp4)
- [Mobile passage and inspection](v2-memory-evidence/mobile-passage.mp4)
- [Prior passage at 5c8dd78](v2-memory-evidence/before-passage.mp4)

These are genuine browser videos at normal speed, not reconstructed scenes. The full film includes actual mouse input. The focused films begin with a selected framing and use the prior passage's scroll keyframes before inspecting the ending. They demonstrate different visitor state rather than a strict pixel comparison. Selected intermediate PNGs and short-phone inspection frames are alongside the films.

## Verification

The production export and TypeScript pass. The established cinematic suite retains its 47-state forward/reverse, rapid-seek, restoration, chapter, keyboard, reduced-motion, viewport and native-release assertions. The new memory suite tests actual mouse drag, keyboard choices, remembered-state and pixel reversal, focus wrapping/return, background scroll lock, reset, reload clearing, responsive/reduced-motion retention, and inspection geometry at 11 sizes. Chromium additionally tests real emulated touch drag and vertical scrolling.

The layout sweep now includes the optional framing controls. The surface suite extends actual pixel reversal to 96 and 98 during the progressive release, and retains context-loss/restoration, unavailable-WebGL and live preference cleanup checks. V1 opening/terminal, pinned scenes, keyboard/404, morph and entrusted-task regressions are retained.

WebKit revealed that a reused canvas retained texture upload flags after renderer disposal. Resetting renderer state before disposal resolved the 3D-placeholder upload errors; console errors are still asserted rather than filtered. Explicit focus restoration also handles WebKit's native dialog-close behavior.

The longer WebKit suite exposed an additional native scroll shift during a live reduced-motion change. The layout-refresh path now preserves the actual native scroll position rather than relying on a recorded library position. The original act and pose criteria remain in place, with more diagnostic detail on failure. All three engines passed both complete suites after this correction.

Final engine results, bundle measurements and performance counters are saved alongside the evidence. Physical phones, actual Safari, GPU diversity and visitor interpretation remain unverified. Windows WebKit's native link-Tab policy still requires explicit skip-link focus in the established suite. rAF cadence is not proof of presented GPU frames.

## Performance and limits

Serial 12-second Chromium traversals were measured after browser acceptance, compilation, recording and encoding finished. These are local browser counters, not physical-device or GPU-presented-frame benchmarks.

| Journey | Viewport | p95 rAF | Task seconds | Script seconds | Long tasks |
| --- | --- | --- | --- | --- | --- |
| Default | 1440x900 | 16.8 ms | 3.814 | 0.343 | 0 |
| Default | 390x844 | 16.8 ms | 2.362 | 0.303 | 0 |
| Remembered crop | 1440x900 | 16.8 ms | 3.756 | 0.339 | 0 |
| Remembered crop | 390x844 | 16.8 ms | 2.459 | 0.325 | 0 |

The preceding continuity pass recorded 3.414 desktop / 2.090 phone task seconds. The added interaction and hinge work cost more CPU; cadence remains comparable. Earlier profiling caught a 54-69 ms first-visible-bend task. Optional initialization now renders a representative curved pose and waits for that GPU work before restoring the real pose in the same task, before paint. This shifts the one-time cost into optional initialization; it does not make that work free. The four final traversals recorded no long tasks. No per-scroll geometry reads, per-frame React state, extra image, geometry, draw call, permanent photo/world compositor hint or idle rendering loop was added.

Entry JavaScript: 158,374 gzip bytes, below the existing 160,000-byte entry target. Optional shader/Three.js: 137,951; combined 296,325. Images, fonts and dependencies are unchanged.

The final scroll safeguard preserved all 60 selected-framing PNGs byte-for-byte against the recordings (`final-render-parity.json`). The last changes only warm the hidden shader path and retain native pinch zoom; new interaction/lifecycle checks were rerun in all three engines afterward. Raw diagnostic failures, rejected layouts and the trace remain in ignored `output/playwright/lived-memory/`.

## Repository

Work is isolated on `codex/v2-lived-memory`, starting at `5c8dd78037806e2d45d9c4cb9ccb11bb4c7f28a8`. Completed changes are committed locally; the final handoff records the ending SHA and working tree. Nothing is pushed, merged, deployed or published. V1 source, global styling, dependencies and photographic assets are unchanged.
