# Invisible Interfaces v2 — Phase 2 verification

## A. Verdict

**PASS for the complete local five-act beta.** Release approval, external visitor
testing and physical-device acceptance remain Phase 3 work. This is not a claim
of public release readiness or human validation.

## B. Repository boundary

- Derived local branch: `codex/v2-complete-experience`.
- Starting commit: `b8fc0b91e040ddddb10ddb9f9307852b6bb48cad`.
- Local implementation/evidence commit; see `git log -1` for the ending SHA.
- No push, merge, deployment, release or separate-portfolio change.
- V1 application code, global styles/layout, original image, dependency manifests
  and lockfile are unchanged. V1 remains at `/`; v2 remains isolated at `/v2`.

## C–F. Experience, cinematic implementation, art direction and decisions

The five relationships now form a complete journey: exact command → spatial
archive → tactile gesture → contextual anticipation → visible absence. There is
no terminal puzzle, entrusted background task or form required to finish.

A single photograph remains in the same DOM node. Forty command glyphs assemble
the graphical window perimeter. A shared CSS 3D world arcs sideways around that
window while archive planes pass through depth. Its frame becomes a landscape
touch surface, the image follows a controlled gesture and settles, then context
and a completed query gather around it. Finally, context contracts into negative
Z and chrome withdraws while the photograph grows into the closing composition.

The new generated red-boat coastal scene replaces v2's weak inherited
illustration. ASCII, one-bit dither and full colour come from one source. Origin,
hash and derivation are recorded in [provenance](V2_ASSET_PROVENANCE.md).
Dark/amber, Newsreader and IBM Plex Mono remain the established visual world.
See [creative direction](V2_CREATIVE_DIRECTION.md) and the implementation-derived
[route design system](v2/DESIGN.md).

The existing Next.js/React/TypeScript, GSAP/ScrollTrigger and CSS 3D architecture
is retained. No new runtime library, renderer or configuration system was added.
One paused 140-unit timeline owns transforms, driven directly by native scroll.
Responsive matchMedia contexts, explicit style seeds and cleanup prevent stale
transforms. A measured ResizeObserver refresh fixes Firefox's delayed
reduced-motion section-height change. See [motion spec](V2_MOTION_SPEC.md).

## G. Verification

Tested against the **production static export** at `http://localhost:3002`.
`npm run build` passed compilation, TypeScript checks and export. `git diff
--check` passed. There is no separate configured ESLint command; no lint pass is
invented. The Impeccable detector ran once and returned `[]`. The React quality
check covered hook ownership/cleanup, component boundaries, image delivery,
semantic equivalents and absence of per-frame React updates.

| Check | Evidence/result |
| --- | --- |
| Chromium | 151.0.7922.34; complete suite passed |
| Firefox | 157.0, installed Playwright firefox-1555 executable; complete suite passed |
| Forward/reverse | 34 actual transform/opacity/clip-path states matched in both directions in each engine |
| Fast repeated seeks | Deterministic snapshots matched; persistent artifact DOM identity retained |
| Native input | Wheel and repeated small-delta wheel input passed in both engines |
| Touch | Chromium CDP touch scrolling passed; emulated, not a physical phone |
| Navigation | Direct/same-page hashes, chapter keyboard activation, current-step state, replay and skip passed |
| Restoration | Nonzero refresh, refresh after chapter jump and transition-state restoration passed |
| Responsive rebuild | Mobile/desktop media rebuild and return to reference geometry passed |
| Reduced motion | All five compositions matched their authored references; live preference changes and return passed |
| Completion | Sticky stage released into document flow; no scroll trap |
| Runtime | No captured page errors in either full v2 suite |

Both engines tested all 34 states at 1440×900, 1366×768, 768×1024, 390×844,
375×844 and 375×667 without horizontal overflow. Separate visual captures cover
16 times per size: opening, resting states, major handoff midpoints and finale.
Bounding-box inspection at all resting states found **zero unintended clipping
or overlaps** across the six sizes after corrections. Spatial window occlusion
and the partial query mask during its reveal are intentional motion, not defects.

### Visual corrections

- Removed a redundant context annotation that crossed desktop navigation.
- Shortened anticipation's result hierarchy and moved it clear of laptop rail.
- Reduced tablet photo scale and repositioned side context away from the image.
- Reduced anticipation yaw/lateral travel to keep query text inside the field.
- Repositioned short-phone result, hiding only auxiliary context detail so it
  clears both context headings and the navigation rail.
- Corrected query separator spacing and seeded touch dressing on media rebuild.

### JavaScript and asset cost

Next reports `/v2` **154 kB First Load JS**, against the existing 160 kB target.
This is its gzip JavaScript estimate including route and shared chunks, not
total page transfer. A reproducible union of layout + route JS chunks totals
**154,894 gzip bytes**. Images, fonts and CSS are excluded. The photographic
WebP is 190,784 bytes; one-bit PNG is 4,454 bytes. Original source PNG is not
served by the route. Phase 1's approximately 162 kB overage is resolved without
removing an essential cinematic sequence or adding lazy-load measurement tricks.

### Performance sample

Headless Chromium, same Windows host (Ryzen 7 7840HS; available Radeon 780M,
RTX 4060 Laptop and Parsec display). Actual rendering adapter was not established.
A ten-second continuous native scroll across the complete journey recorded:

- 601 rAF intervals; median and p95 16.7 ms; maximum 16.8 ms.
- No intervals above 33.4 ms; zero estimated missed vsyncs in this sample.
- No observed long tasks; layout-shift score 0.
- CDP: 16 layout events, 687 style recalculations; layout 2.34 ms, style 85.62 ms,
  script 186.78 ms, task time 655.35 ms across the measurement window.
- JS heap at sample end: 54,885,992 bytes; not a leak or retained-heap analysis.

These are browser scheduling/trace observations, not actual presented-frame
counts or proof of low-end/physical-device smoothness. Firefox's scheduling is
different (median 8.78 ms, p95 15.34 ms); its estimated missed-vsync count is not
comparable to Chromium and unsupported observer APIs cannot prove absence of
long tasks/CLS. Raw results are retained rather than treating cadence as a
universal FPS claim.

### Preserved v1

The opening/terminal, morph, pinned scenes, entrusted task and keyboard suites
all passed when rerun. The responsive suite carries its **confirmed baseline** 320px
minimum-machine-type failure: 8.4px against a 10px assertion (375px gives 10px).
The compact v1 stage is 360px wide and its fit transform becomes
`(320 - 16) / 360 ≈ .844`, shrinking 10px machine type to 8.4px. This was captured
before Phase 2 edits and left unchanged. Its overflow, 44px target and
reduced-motion checks were clear on the baseline. It is a carried v1 limitation,
not a v2 regression or silently repaired adjacent issue.

## H. Independent critique

A fresh Impeccable finish reviewer inspected 13 actual screenshots, including the
corrected short-phone composition. **Disposition: ship**, with no material fixes
identified. It found that deliberate archive occlusion communicates depth and
the partially revealed query communicates completion. Its evidence was static;
it did not independently assess continuous timing or substitute for human testing.

The implementing agent inspected transition captures and frames from the real
forward/reverse walkthrough. The spatial archive arc is the strongest passage:
the camera travels with a clear anchor and destination. Anticipation is the
weakest/densest chapter, especially on short phones. Its revised hierarchy is
legible, but first-time visitor comprehension and whether the gesture hold feels
too long need external observation. No additional effects were added to conceal
that question. The finale is intentionally quiet.

## I–J. Outstanding issues and Phase 3 readiness

No known critical v2 implementation blocker remains. The creative direction is
realized in a complete beta that can be refined without an architectural rebuild.

Before public release: observe real first-time visitors, inspect physical touch
and trackpad input, test Safari/WebKit and representative lower-end devices,
review screen-reader experience, tune pacing from that evidence and obtain
release approval. The dependency audit still reports **4 high and 1 critical**
findings in unchanged dependencies; dependency remediation belongs in the
dedicated release pass. The v1 320px type defect remains disclosed above.
No human-validation, physical-device or Safari pass is claimed.

## Evidence

Selected portable evidence: [screenshots and JSON](v2-phase2-evidence/).
Full local captures: `output/playwright/phase2/layout/` (96 screenshots).
Real-time VP8 walkthrough: `output/playwright/phase2/chromium-five-act-walkthrough.webm`
(1440×900, 57.28 seconds, 25fps recording, forward and reverse with held opening/finale).
Its encoding rate is separate from the performance sample.

Reproduce against a local static server:

```powershell
$env:II_BASE_URL='http://localhost:3002'
python tests/e2e/test_v2_cinematic.py
$env:II_BROWSER='firefox'
# Optional: II_BROWSER_EXECUTABLE selects an installed Firefox build.
python tests/e2e/test_v2_cinematic.py
python tests/e2e/inspect_v2_layout.py
```

Raw JSON includes the browser versions, executable selection, viewports and
profiling values. Original [Phase 1 verification](V2_VERIFICATION.md) is retained
as historical evidence; its unfinished-chapter and budget statements no longer
describe the Phase 2 implementation.
