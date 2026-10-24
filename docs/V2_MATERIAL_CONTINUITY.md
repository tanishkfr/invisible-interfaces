# Material continuity

Implementation on `codex/material-continuity`, based on master `6904df1`.
The verification below covers the local build. Production deployment is a separate release step.

## Motion changes

- The photograph peels across the Window-to-Gesture transition (timeline 54–61), driven by native scroll. A reverse peel at 116–126 lets the final interface withdraw around the same material.
- A grip lifts the nearby part of the photograph, rather than rotating the whole image equally. Upper and lower grips produce different deformation. Release drains the pressure over 700ms, with a restrained travelling crease.
- One set of corners travels from the archive boundary into the photograph, disappears before the surface bends, and returns with contextual recognition. There is no duplicate photograph or frame layer.
- “Why this image?” expands those same corners around the explanation in 900ms. Closing contracts them in 550ms. Keyboard and reduced-motion operation update immediately.
- Resizing closes the explanation, preserves the ending and visit framing, and allows reopening at the new viewport size.

The narrative, native scrolling, chapter navigation, framing memory, reading room and still ending are preserved. No dependency, image, font, idle animation loop or per-frame React state was added. The optional Three.js surface remains one draw call with 2,376 vertices and 4,096 triangles; the DOM fallback and reduced-motion path remain available.

## Visual decisions

Flat corners looked detached when the image bent, so they withdraw before both peels. A strong early grip could overlap the illustrative Memories heading; that illustrative chrome now recedes during pressure and returns after release. The actual framing controls remain available.

An SVG path-morph prototype was rejected in favour of transforming an HTML wrapper around the original SVG. This keeps reconstruction reversible and avoids unnecessary geometry machinery. Keyboard reconstruction uses synchronous positioning instead of waiting for an animation tick.

## Verification

- Production build completed successfully.
- Chromium, Firefox and WebKit material checks passed: scroll/reverse pixel agreement, shared corner identity, distinct grip regions, pressure clearance, reconstruction/close restoration, keyboard/reduced motion, act changes and viewport resizing. Explanation bounds passed at 1440×900, 768×1024, 375×667 and 320×568.
- Existing cinematic and framing-memory journeys passed in all three engines. Cinematic coverage includes 47 poses at 11 viewport sizes, forward/reverse movement, fast seeking and restoration. Memory coverage includes native keyboard controls, focus, reset/reload and 11 viewport sizes. Chromium additionally exercised emulated touch dragging and native vertical scrolling.
- Direct-drag checks passed at five viewport sizes, including interrupted release, cancellation and unavailable-WebGL feedback. Surface lifecycle checks passed, including reverse poses, context loss/restoration and reduced-motion cleanup.
- The layout sweep captured 451 states across 11 viewport sizes; its overlap/overflow flags are empty. Selected final frames and recordings were also inspected visually.

The automated native-scroll recordings include real mouse input on desktop and CDP touch input at 375×667. They document authored choreography, not a physical-device performance test:

- [Desktop recording](v2-material-evidence/desktop.mp4)
- [Touch recording](v2-material-evidence/touch.mp4)
- [Before peel](v2-material-evidence/before-1440x900-58.png) / [after peel](v2-material-evidence/after-1440x900-58.png)
- [Before explanation](v2-material-evidence/before-1440x900-inspection.png) / [after explanation](v2-material-evidence/after-1440x900-inspection.png)
- [Short-phone explanation](v2-material-evidence/after-375x667-inspection.png)
- [Upper grip](v2-material-evidence/desktop-grip-upper.png) / [lower grip](v2-material-evidence/desktop-grip-lower.png)

JSON results are retained in [v2-material-evidence](v2-material-evidence/). Raw captures, debug probes and build logs remain in ignored `output/playwright/material`.

## Performance and limits

Serial Chromium measurements after surface initialization:

| Journey | Viewport | Median rAF | p95 rAF | Maximum | Long tasks |
| --- | --- | --- | --- | --- | --- |
| 12s full scroll | 1440×900 | 16.7ms | 16.8ms | 33.4ms | 0 |
| 12s full scroll | 390×844 | 16.7ms | 16.7ms | 16.8ms | 0 |
| Four drags/releases | 1440×900 | 16.7ms | 16.8ms | 33.4ms | 0 |
| Four drags/releases | 390×844 | 16.7ms | 16.8ms | 16.8ms | 0 |

The homepage entry is 159,328 gzip bytes against its 160,000-byte budget; optional Three.js chunks add 138,558 bytes (297,886 combined). This excludes CSS, fonts and images. The existing initialization warmup now exercises the new shader paths too; it moves first-use compilation work into optional setup rather than eliminating it.

rAF cadence is not proof of presented GPU frames. Physical phones, actual Safari and broader GPU hardware have not been tested. Automated WebKit is engine evidence, not a claim of device coverage. This local pass has not been verified on a new production deployment.
