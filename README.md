# Invisible Interfaces

A measured interactive essay about attention leaving the interface—and what an invisible system owes us when we return.

One photograph travels through five relationships with computing:

1. attention is demanded;
2. operation becomes pointing, touching, asking, and prediction;
3. software begins acting before it is asked;
4. the task is entrusted;
5. absence returns as a tangible result, an authority boundary, and a reversible decision.

The signature interaction is causal. After the visitor entrusts the restoration, work advances only while the tab is hidden. Returning early pauses the remaining work. Returning after completion reveals an original/restored comparison, a bounded work receipt, the system’s limits, and the visitor’s own local attention receipt.

## Release frames

![The solved terminal](docs/screenshots/terminal.png)

![The interface morph](docs/screenshots/morph.png)

![The return receipt and restored comparison](docs/screenshots/return.png)

## Privacy

No analytics or remote agent is used. The attention ledger is stored only in session storage, returned to the visitor at the end, never transmitted, and deleted when the tab closes.

## Run

    npm install
    npm run dev

Production verification:

    npm run build

## Test

The browser walkthroughs live in tests/e2e and cover the opening, terminal, morph, anticipation scene, entrusted absence, keyboard navigation, mobile layout, reduced motion, copy integrity, and the About/404 routes.

See CASESTUDY.md for the design argument and VISUAL_SYSTEM.md for the current exhibition system.

## V2 five-act beta

The complete Phase 2 beta lives at `/v2`. One generated red-boat photograph
travels from exact commands into a spatial archive, a tactile surface, an
anticipatory memory field, and a quiet finale. Native scrolling controls the
whole film in either direction. No secondary task blocks the exhibition.
The original exhibition remains at `/`.

See [creative direction](docs/V2_CREATIVE_DIRECTION.md),
[motion specification](docs/V2_MOTION_SPEC.md), and
[Phase 2 verification](docs/V2_PHASE2_VERIFICATION.md),
[asset provenance](docs/V2_ASSET_PROVENANCE.md), and
[route design system](docs/v2/DESIGN.md). Phase 1 documentation and evidence remain
historical. New selected evidence is in `docs/v2-phase2-evidence/`; full captures
and the real-browser recording are in `output/playwright/phase2/`.

Run the focused browser suite against a local server with Python Playwright:

    python tests/e2e/test_v2_cinematic.py

Set `II_BASE_URL` when using a different port; `II_BROWSER=firefox` selects the
second engine and `II_BROWSER_EXECUTABLE` can select an installed build.
`II_RECORD_VIDEO=0` skips recording. Run `tests/e2e/inspect_v2_layout.py` for the
responsive overlap captures. The beta is local only; Phase 3 visitor testing,
physical-device review and release approval remain separate.
