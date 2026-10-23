# Invisible Interfaces

A cinematic, scroll-driven exploration of how human-computer interaction evolved.
One red-boat photograph travels through command, window, gesture, anticipation
and absence. Native scrolling controls the continuous film in either direction.

The current local v2 release candidate is at `/v2`. The original exhibition
remains at `/`, with its distinct terminal and entrusted-task experiment intact.
No push, merge, deployment or homepage replacement is part of this phase.

## Experience and documentation

- [V2 case study](docs/V2_CASESTUDY.md)
- [Phase 3 critique and corrections](docs/V2_PHASE3_CRITIQUE.md)
- [Final acceptance and outstanding release gates](docs/V2_PHASE3_ACCEPTANCE.md)
- [Creative direction](docs/V2_CREATIVE_DIRECTION.md) and [motion system](docs/V2_MOTION_SPEC.md)
- [Route design system](docs/v2/DESIGN.md) and [shared visual system](VISUAL_SYSTEM.md)
- [Photographic provenance](docs/V2_ASSET_PROVENANCE.md)
- [Portfolio copy and media handoff](docs/V2_PORTFOLIO_HANDOFF.md)
- [Genuine visitor evaluation guide and capture template](docs/V2_VISITOR_TESTING.md)

Final showcase and representative desktop/mobile frames are in
`docs/v2-phase3-evidence/`. Full browser captures and raw recordings are generated
in `output/playwright/phase3/` (ignored). Phase 1/2 reports and media remain
historical evidence rather than current release claims.

## Run and build

```powershell
npm ci
npm run dev
# Production static export:
npm run build
npx tsc --noEmit
```

The project uses Next.js/React/TypeScript, GSAP/ScrollTrigger and CSS 3D for v2.
V1 retains Motion. Security overrides for PostCSS and sharp are intentional;
see the final acceptance report before changing them.

## Browser checks

Use Python Playwright with installed browser engines against a running export:

```powershell
$env:II_BASE_URL='http://localhost:3002'
$env:II_OUTPUT_DIR='output/playwright/phase3/final'
$env:II_RECORD_VIDEO='0'
python tests/e2e/test_v2_cinematic.py
python tests/e2e/inspect_v2_layout.py
```

`II_BROWSER=firefox` or `webkit` chooses another engine.
`II_BROWSER_EXECUTABLE` can select an installed executable. The suite covers
deterministic forward/reverse states, rapid seeking, wheel/touch emulation,
restoration, chapter/keyboard navigation, resize, reduced motion and native
release. Layout inspection includes intermediate tablet widths, 320px screens,
and transition states where resting-only tests miss clipping.

V1's existing scripts remain in `tests/e2e/`. Its preserved 320px machine-type
assertion fails at 8.4px against 10px; this is a confirmed baseline issue, separate
from v2's corrected narrow layouts.

## Privacy and disclosure

V2 uses authored demonstrations, with no inference, background work, analytics
or attention ledger. Its fictional photographic scene was generated for the
work, and every era representation derives from that one image. Fonts and images
are local exported assets. V1's separate attention ledger remains session-only,
is not transmitted and is removed when the tab closes.

The v1 case study is preserved in [CASESTUDY.md](CASESTUDY.md). For the current
portfolio presentation, use the v2 case study linked above.
