# Invisible Interfaces

A cinematic, scroll-driven exploration of how human-computer interaction evolved.
One red-boat photograph travels through command, window, gesture, anticipation
and absence. Native scrolling controls the continuous film in either direction.

The cinematic V2 experience is the homepage at `/`. Existing `/v2` links remain
available with the homepage as their canonical URL. The original exhibition is
preserved at `/v1`, including its terminal and entrusted-task experiment.

## Experience and documentation

- [Lived memory: interactive motion and accountable ending](docs/V2_LIVED_MEMORY.md)
- [Anticipation continuity: preceding checkpoint](docs/V2_ANTICIPATION_CONTINUITY.md)
- [Cinematic refinement: preceding checkpoint](docs/V2_CINEMATIC_REFINEMENT.md)
- [Director's cut: reference study, changes and acceptance](docs/V2_DIRECTORS_CUT.md)
- [V2 case study](docs/V2_CASESTUDY.md)
- [Phase 3 critique and corrections](docs/V2_PHASE3_CRITIQUE.md)
- [Final acceptance and outstanding release gates](docs/V2_PHASE3_ACCEPTANCE.md)
- [Creative direction](docs/V2_CREATIVE_DIRECTION.md) and [motion system](docs/V2_MOTION_SPEC.md)
- [Route design system](docs/v2/DESIGN.md) and [shared visual system](VISUAL_SYSTEM.md)
- [Photographic provenance](docs/V2_ASSET_PROVENANCE.md)
- [Portfolio copy and media handoff](docs/V2_PORTFOLIO_HANDOFF.md)
- [Genuine visitor evaluation guide and capture template](docs/V2_VISITOR_TESTING.md)

Current matched before/after films, desktop/mobile frames and verification are in
`docs/v2-memory-evidence/`. The Lived memory report is the current
creative/engineering checkpoint. Earlier phase reports and media remain historical
checkpoints. Full captures and trial comparisons are in
`output/playwright/lived-memory/` (ignored).

## Run and build

```powershell
npm ci
npm run dev
# Production static export:
npm run build
npx tsc --noEmit
```

The project uses Next.js/React/TypeScript, GSAP/ScrollTrigger and CSS 3D for v2,
with one optional Three.js photographic sheet. The bottom timeline is replaced
by a native Chapters disclosure. The ending can bring context back on request.
V1 retains Motion. Security overrides for PostCSS and sharp are intentional;
see the final acceptance report before changing them.

## Browser checks

Use Python Playwright with installed browser engines against a running export:

```powershell
$env:II_BASE_URL='http://localhost:3002'
$env:II_OUTPUT_DIR='output/playwright/lived-memory'
$env:II_RECORD_VIDEO='0'
python tests/e2e/test_v2_cinematic.py
python tests/e2e/test_v2_memory.py
python tests/e2e/inspect_v2_layout.py
python tests/e2e/test_v2_surface.py
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

V2 uses authored contextual recall and an optional visit-local framing choice,
with no inference, background work, analytics
or attention ledger. Its fictional photographic scene was generated for the
work, and every era representation derives from that one image. Fonts and images
are local exported assets. V1's separate attention ledger remains session-only,
is not transmitted and is removed when the tab closes.

The v1 case study is preserved in [CASESTUDY.md](CASESTUDY.md). For the current
portfolio presentation, use the v2 case study linked above.
