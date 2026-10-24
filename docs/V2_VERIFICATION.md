# V2 Phase 1 — verification and critique

Verified 23 October 2026 against the production static export served locally at
`http://localhost:3002`. No remote push, merge, tag, or deployment was performed.

## Verdict: PARTIAL for full brief acceptance

All three signature sequences are implemented and browser-inspected. The focused
v2 suite passes, including exact numeric transform comparison in both directions,
all four requested viewport sizes, mobile input emulation, restored entry, and
five correct reduced-motion compositions. There is no missing signature sequence.

Full repository acceptance is not entirely green: the existing v1 responsive
test fails its 320px text-size assertion, and v2's 162 kB first-load JS exceeds
the existing specification's 160 kB release target. Physical phone/trackpad and
non-Chromium verification remain unperformed. These limits are not marked PASS.

## Repository protection and audit

- Dedicated local branch: `codex/v2-cinematic-foundation`.
- Starting commit: `d1f6271a4bc7b414ec8b12f5b83289d5118b344a`.
- The original `/`, `/about`, scene components, photograph assets, content,
  attention ledger, and global layout/styles are unchanged from the starting commit.
- V2 imports GSAP in its own client route. V1 retains Motion, its own session
  logic, and the hidden-tab task. V1 first-load JS remains 154 kB.
- The source audit covered README, CASESTUDY, design/spec/director/storyboard,
  VISUAL_SYSTEM, all scene implementations, photo data, and the existing tests.
- The rendered audit included the v1 opening and compact-geometry morph as well
  as all existing browser scripts.
- Generated browser scratch files and raw recordings are ignored. Selected
  screenshots and test results are retained under `docs/v2-evidence/`.

## Build and automated checks

| Check | Result |
| --- | --- |
| Production build and static export | PASS — all routes export |
| `npx tsc --noEmit` | PASS |
| `git diff --check` | PASS |
| Standalone lint | Not configured in the existing repository; no separate lint claim |
| V2 focused browser suite | PASS |
| V1 opening + terminal | PASS |
| V1 morph and copy | PASS |
| V1 anticipation and chrome | PASS |
| V1 entrusted task and return | PASS |
| V1 keyboard, About and 404 | PASS |
| V1 responsive | FAIL — minimum machine text is 8.4px at 320px; expected ≥10px |

The v1 responsive failure is explained by its unchanged compact stage fitting
304 available pixels into a 360px stage: 10px internal text becomes about 8.4px.
At 375px the same test reports 10px and passes its individual conditions. All
overflow, 44px entrust-target, and reduced-motion checks in that script pass.
Its source and the relevant v1 rendering code are byte-for-byte unchanged.
See [captured values](v2-evidence/v1-responsive-details.json).

Initial build attempts hit a Google Fonts URL-parser failure in the existing
Next font loader. Later clean builds passed with the original loader and font
source restored; no tracked font or framework patch was introduced.

`npm audit` reports five existing dependency findings: four high and one critical,
in Next and its dependency tree. The lockfile change adds only GSAP. Dependency
upgrades were not folded into this visual phase.

## Browser and motion matrix

Chromium **151.0.7922.34**, Windows, production export. The script is
`tests/e2e/test_v2_cinematic.py`; set `II_BASE_URL` to the local static server.

| Scenario | Evidence / result |
| --- | --- |
| Desktop 1440×900 | 18 sampled timeline states, no page overflow |
| Tablet 768×1024 | 18 states, centered opening, no page overflow |
| Mobile 390×844 | 18 states, separate compact geometry, no page overflow |
| Narrow mobile 375×844 | 18 states, no page overflow |
| Laptop 1366×768 | Additional rendered touch/ending inspection; stage clears nav |
| Forward / reverse | 18 states compare equal as numeric matrices, opacity, visibility and radius |
| Repeated fast scrubbing | Nonsequential seeks reproduce reference states |
| Persistent image | Same actual DOM node throughout |
| Wheel | Real browser wheel events advance the native scroll position |
| Touch | CDP touch-start/move/end in a mobile Chromium context advances native scroll |
| Entry | Direct and same-document chapter hashes resolve correctly |
| Refresh | Nonzero transition progress restores, including after a chapter jump |
| Resize | Compact rebuild and desktop return reconstruct expected geometry |
| Reduced motion | Five static states match their normal-motion reference compositions |
| Live preference changes | Correct reset, rebuild, and return to normal geometry |
| Keyboard | Chapter jumps, visible focus, skip link, and replay pass |
| Completion | Sticky stage releases into the reading room; no scroll trap |
| Page errors | None observed by the focused suite |

Some interface facsimiles intentionally contain fine machine annotation; they
are not interactive controls. Essential narrative copy and chapter controls
remain separate semantic content. No screen-reader-device walkthrough was done.

## Performance sample

Host: AMD Ryzen 7 7840HS. Available adapters: AMD Radeon 780M, NVIDIA RTX 4060
Laptop GPU, and Parsec virtual display. The specific adapter used by headless
Chromium was not established; its generic WebGL renderer string is insufficient
to identify one.

During a six-second continuous browser scroll across all sequences:

- 361 measured requestAnimationFrame intervals;
- median 16.7ms, p95 16.7ms, maximum 16.8ms;
- zero measured intervals above 33.4ms.

This is a browser update-cadence measurement on this host, not proof of
display-presented 60fps, low-end hardware smoothness, or physical mobile behavior.
The separate 1440×900 walkthrough is a 28.16-second VP8 recording at 25fps; that
recording rate must not be confused with the update-interval sample.

The application's fonts are emitted as local build assets and its scenes add no
remote runtime fetches. The installed Chrome used for manual inspection injected
antivirus network requests; those are outside the application's source.

## Independent design critique

This is a separate first-visitor / interaction-design pass over actual rendered
states and the recorded frame sequence, not a separate human reviewer.

| Sequence | Assessment | Correction made |
| --- | --- | --- |
| A | Structured material visibly becomes the window. The terminal field is the most abstract moment; the beach is recognized once dither appears. | Removed the competing terminal shell during separation; stretched the same glyph nodes into actual perimeter segments before the window settles. |
| B | Strongest moment: the selected photograph stays readable while the world turns and the window becomes a touch surface. The lateral travel has a clear destination. | Kept the photo in the shared world; reduced the compact arc; added a height-aware laptop stage fit. |
| C | Strongest resting composition: the image remains when enclosure and controls surrender space. The ending keeps the accountability question. | Removed the masthead at the end; separated overlapping mobile context layers; retained full image strength. |

Additional corrections: moved command marks away from file text, changed the
tablet opening position, repaired same-page hashes and replay, and fixed stale
geometry when reduced-motion preference changes mid-scene. The strengthened
test compares actual reference compositions rather than merely checking that
five different states exist.

The weakest remaining visual ingredient is the inherited authored beach
illustration: recognizable and continuous, but less emotionally specific than a
real archival photograph. Some fine annotation is small inside the deliberately
illustrative interface surfaces. Neither is hidden by added effects.

## Evidence

- [Opening](v2-evidence/v2-1440-000.png)
- [Pixel-to-frame handoff](v2-evidence/v2-frame-assembly-26.png)
- [Camera passage](v2-evidence/v2-1440-043.png)
- [Touch resting composition](v2-evidence/v2-1440-059.png)
- [Controls withdrawing](v2-evidence/v2-1440-088.png)
- [Final composition](v2-evidence/v2-1440-100.png)
- [375px anticipation](v2-evidence/v2-375-077.png)
- [Reduced-motion command](v2-evidence/v2-reduced-0.png)
- [Recorded filmstrip](v2-evidence/v2-filmstrip.png)
- [Machine-readable results](v2-evidence/v2-verification.json)

Full local evidence, all responsive captures, v1 logs, and the real-browser
recording live in `output/playwright/`. The video is
`output/playwright/v2-walkthrough.webm`; regenerate with the focused browser script.

## Remaining limitations and Phase 2 readiness

**Acceptance gaps:** the existing v1 320px assertion, v2's 2 kB overage against
the legacy release budget, physical touch/trackpad and non-Chromium verification,
and the pre-existing dependency audit findings. No new public release is approved.

**Deferred by scope:** full anticipation behavior, complete five-act narrative
content and pacing, and any v2 equivalent of the consequential entrusted return.
These are not claimed as completed.

The shared-space timeline, persistent artifact, native scroll mapping, responsive
contexts and static-state reduced-motion path can support the complete exhibition
without a renderer rewrite. The current normalized times should be treated as
Phase 1 choreography, not frozen final pacing.
