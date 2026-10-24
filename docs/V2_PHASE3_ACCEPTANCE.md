# Invisible Interfaces v2 — Phase 3 acceptance

## A. Verdict

**Implementation and supplied-frame visual acceptance: PASS. Overall final
release readiness: PARTIAL.** The complete local exhibition, refinement,
engineering checks and portfolio assets are delivered. Genuine first-time
visitor testing, physical touch/trackpad devices, physical Safari and screen
reader review remain open owner validation gates. No publication is authorized
or performed. Do not present these unverified items as passed.

Agent-led browser interaction, screenshots, normal-speed scheduled traversal
and genuine recordings were inspected. The agents cannot visually perceive an
uninterrupted film like a human viewer; captured pauses and filmstrip inspection
do not settle that experiential acceptance question. The final showcase is ready
for that review rather than a claim it has already occurred.

## B. Repository

- Branch: `codex/v2-complete-experience`.
- Starting commit: `ad3869e5473b432e7dc0497b2e9bdb0815953699`.
- Phase 3 local commit records implementation, dependency repairs, documentation
  and selected evidence. See `git log -1` for its final SHA; final handoff states it.
- No push, merge, deployment, public release, v1 homepage replacement or separate
  portfolio change.
- V1 scene source, original image, global layout/styles, content and About remain
  unchanged. Shared framework/toolchain patches are intentional and regression-tested.

## C. Final experience

One red-boat photograph travels through exact commands, a spatial graphical
archive, a tactile gesture, contextual anticipation and visible absence. Native
scroll controls a continuous 140-unit GSAP timeline in both directions. Command
glyphs form a window perimeter; the camera arcs sideways around the selected
image; its enclosure becomes a landscape touch surface; context gathers around
it; then context converges into depth while the photograph remains.

No puzzle, hidden-tab task or form blocks the journey. Chapter links, skip and
replay remain direct. About now reaches v2's own reading room rather than v1's
different background-work explanation. V2 social metadata also describes its
actual exhibition. Canonical remains `/v2`, with noindex retained for this
unpublished candidate.

## D. Critique and corrections

Two independent assessments preceded visual edits; the design assessment did
not see detector output. A second critical review inspected nine final frames
and found no material remaining overlap, font anomaly or unintended subject crop.
It did not independently watch continuous motion or conduct human research.

| Problem | Severity | Correction |
| --- | --- | --- |
| 650px minimum stage hid navigation at 320×568 and caused result/rail collision at 320×650 | P1 | Viewport-height stage, fitted short-screen camera, tighter shortest-screen opening/finale |
| Tablet context clipped during t90–96 entrance | P2 | Inset entrance path, context positions and archive index |
| Gesture shell cropped/crowded short-phone headings | P2 | Short-height camera fit preserves corners and heading gap |
| Opening scroll cue crossed terminal border | P2 | Distinct cue strip and fitted opening pose |
| Intermediate tablet description crowded terminal edge | P2 | Refitted tablet opening pose and vertical spacing |
| Anticipation connectors struck through text | P2 | Removed connector field, retaining focus brackets and contextual depth |
| About explained v1 rather than v2 | P2 | Current-route reading-room anchor |

The [critique](V2_PHASE3_CRITIQUE.md) records the pre-edit observations and final
review. Before/after examples are in `v2-phase3-evidence/`: `before-320x667-067.png`
versus `320x667-067.0.png`; `before-768x1024-093.png` versus
`768x1024-093.0.png`; and the 932px opening pair.

## E. Motion and art direction

The photograph, five-act world, archive camera arc and dark/amber identity remain.
Actual custom-font glyphs were verified: Newsreader Light normal/italic and IBM
Plex Mono Regular, with no observed fallback substitution in sampled nodes.
WebKit corroborated the intended faces and near-identical desktop text measures.
No replacement font or decorative effect was justified.

Window→Gesture remains the strongest transition; desktop Absence is the strongest
resting composition. Gesture→Anticipation requires the most conceptual inference.
Its320×568 state is clear but least spacious, with small secondary annotation.
The semantic reading room contains the full narrative. Mobile “Expect”/“Be” and
pacing should be evaluated with genuine first-time visitors before further edits.

## F. Verification

Production static export, Next 15.5.28. `npm run build`, standalone
`npx tsc --noEmit` and `git diff --check` pass. There is no configured standalone
ESLint command. Detector ran exactly once during independent Assessment B:
zero findings; it missed the real geometry issues, so it is not visual acceptance.

| Browser | Final v2 results |
| --- | --- |
| Chromium 151.0.7922.34 | Full suite passes, including native Tab, keyboard activation and emulated touch |
| Firefox157.0 | Full suite passes on installed firefox-1555 |
| Playwright WebKit26.5 | Full suite passes with explicitly focused skip fallback under Windows native Tab policy; native link tab order remains unverified |

Every engine traversed 34 reference states at eleven viewport sizes:
1440×900,1366×768,1280×800,932×908,768×1024,390×844,375×844,
375×667,320×667,320×650 and 320×568. Exact forward/reverse transform,
opacity and clip states match; rapid repeated seeks retain the same DOM anchor.
Wheel and small-delta input, chapter hashes, intermediate refresh, resize,
reduced-motion reference compositions/live preference changes, replay and native
release pass. No captured v2 page errors.

The expanded visual diagnostic captures 18 times ×11 sizes: 198 final screenshots.
It checks resting states plus gesture 67/72 and anticipation 90/93/96. Shell bounds
are checked where enclosure containment is intended; archive travel occlusion is
deliberate. Actual touch text ranges replace empty flex-box envelopes to avoid
false overlap reports around the tilted image. Final flags are empty at all 11
sizes. Representative frames were visually inspected, not merely accepted from
bounding boxes.

Essential ink/support/navigation/amber palette checks against both grounds give
a minimum contrast of 6.17:1 in the sampled pairs. Visible 44px skip link, two-pixel
amber focus, semantic language/headings/five-act reading equivalent, About/replay
and narrow reading reflow pass. The 640×400 reading check models a 200%-equivalent
layout viewport; it does not claim physical browser zoom or cinematic fit at
that height. No full WCAG2.2AA or screen-reader conformance is asserted.

### Browser/test limitations investigated

An initial Firefox failure was the local server exposing the `/v2` image folder
as a directory listing instead of serving `v2.html`; the corrected export handler
and explicit IPv4 origin resolved it. Final results replace that setup failure.
WebKit's scroll-history journal loses the position when reload immediately
interrupts the synthetic wheel transaction. Both refresh checks allow 300ms of
settlement; a targeted reproduction confirms stable restoration. Immediate
inertial-refresh behavior remains an engine-level observation, not a hidden app
storage workaround. WebKit native Tab policy is disclosed in its raw result.

V1 opening/terminal, morph/copy, pinned scenes, entrusted task and keyboard/About/
404 suites all pass. Its responsive script retains the verified baseline320px
machine-type failure: a 360px compact stage fits 304px, scaling 10px text to 8.4px.
V1 source is preserved; v2's independently fitted320px compositions pass.

## G. Performance and security

Unique layout + v2 route JavaScript chunks total **155,170 gzip bytes**, against
160,000. Next's build display rounds `/v2` First Load JS to 154 kB. The union method
is reproducible with `node scripts/measure_v2_bundle.cjs`; it excludes images,
CSS, fonts and prefetches. The 276-byte increase from Phase2 includes the framework
patch and refinements. V1's build estimate is 155 kB after the shared security patch.

The final ten-second Chromium 151 scheduled-scroll sample records 601 callbacks,
p95/max 16.7/16.8ms, no intervals above 33.4ms, no observed long tasks or CLS.
CDP layout time 2.92ms, style 96.75ms and script 226.20ms across the window.

A separate final-build Chromium 156 trace corroborates desktop 1440×900 and
mobile-emulated 390×844 (DPR 3). The JSON verifies the exact loaded v2 chunk.
Desktop forward/reverse: 30 layouts/4.90ms layout,183.29ms style,325.32ms script;
trace Paint inclusive duration51.65 ms and RasterTask45.33 ms. Mobile: 27 layouts/
3.81ms layout,135.36ms style,206.76ms script. Both observed zero long tasks and
CLS. rAF p95 was6.2ms in that protocol-scheduled run, illustrating why callback
cadence must not be equated with actual presented FPS. Trace durations can
overlap across threads; they are not additive CPU totals.

Immediately preceding production build: six repeated forward/reverse traversals
after GC kept 585 nodes and 361 desktop/363 mobile listeners stable. Desktop heap
cycle 1→6:5,218,480→5,226,964 bytes; mobile:5,230,956→5,255,584 bytes.
The bounded sample shows no accumulating DOM/listener trend, not a general leak
proof. Desktop 4×CPU stress recorded p95 17.9ms/max41ms and no long tasks.
Those memory/stress results predate the last tablet/short-height pose adjustment;
they are not mislabeled as final-build measurements. The first desktop trace
collection timed out; a final-build trace succeeded. Hard-navigation cycles do
not establish SPA unmount cleanup; listener/observer cleanup was also inspected
in source. No per-scroll React state or animated layout dimensions were added.

Host: Windows, Ryzen7 7840HS; actual renderer adapter, GPU memory pressure and
physical display delivery were not established. Local resources decoded and
intended fonts loaded; local-server timings do not model public-network latency.
No physical phone, dropped-presented-frame count or low-end performance pass is
claimed. Detailed desktop/mobile/stress/trace evidence is retained separately.

Security audit: previous 4 high / 1 critical package findings are repaired.
Next 15.5.28 and targeted PostCSS/sharp overrides resolve to PostCSS 8.5.31,
sharp 0.35.5, nanoid 3.3.20 and source-map-js 1.2.2. Fresh audit: **zero findings**.
[Security review](V2_SECURITY_REVIEW.md) classifies severity, static-export/build
applicability and primary advisories. This does not validate the unchanged public
deployment or guarantee absence of all security defects.

## H. External validation

No genuine participants, physical devices, physical Safari or screen-reader
users were available through authorized means. None were recruited or invented.
Playwright WebKit evidence is useful but is not physical Safari validation.
The [visitor guide](V2_VISITOR_TESTING.md) supplies a five-person protocol,
observation-versus-interpretation template and owner release checklist.

## I. Portfolio deliverables

- [V2 case study](V2_CASESTUDY.md), [portfolio copy/media/migration handoff](V2_PORTFOLIO_HANDOFF.md).
- [Photographic provenance](V2_ASSET_PROVENANCE.md), README and visual-system update.
- `docs/v2-phase3-evidence/showcase.mp4`: actual browser recording encoded H.264,
  1440×900,49.2seconds,25fps, silent, clean viewport; opening/all five acts/held
  finale. Encoding rate is not a performance metric.
- Raw VP8: `output/playwright/phase3/showcase/invisible-interfaces-v2.webm`.
- Selected high-resolution PNGs, mobile evidence, before/after pairs, filmstrip,
  audit/engine/accessibility/layout/bundle/performance JSON in `v2-phase3-evidence/`.
- Full screenshots: `output/playwright/phase3/final/layout/`; trace events:
  `output/playwright/phase3/performance/`. These raw working files are ignored.

## J. Release decision

No known major v2 visual/functional blocker remains within the tested local
scope. Do not invent further polish to erase the distinction between a complete
implementation and final release validation. Owner gates remain: genuine visitor
comprehension and natural-speed review, physical touch/trackpad, physical Safari,
screen reader and representative lower-end hardware. Confirm deployment-origin
routing, metadata and current security status when publication is separately
authorized. V2 remains noindex and local; v1 and its public deployment are intact.
