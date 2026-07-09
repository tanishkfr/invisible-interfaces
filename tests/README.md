# E2E tests

Python + Playwright scripts that drive the real experience: the terminal,
the scroll-scrubbed morph, the pinned stages, the choreography, mobile,
and reduced motion. Each script prints a JSON report; eyeball the values
(they are assertions by convention, not by framework — the piece is
verified by inspection, like the design is).

```bash
pip install playwright
playwright install chromium

# against a local dev server (npm run dev):
cd tests/e2e
python test_opening_terminal.py
python test_morph.py
python test_pinned_scenes.py
python test_threshold_ending.py
python test_responsive.py

# against a deployment:
II_BASE_URL=https://your-deployment.vercel.app python test_morph.py
```

Every script also runs the **WAAPI sweep** where relevant: Framer Motion
silently promotes direct array transforms of scroll progress to hardware
`ViewTimeline` animations whose range differs from our `useScroll` offsets.
The count must always be **0** — see the function-piped `progress` pattern
in `components/scenes/Scene2Simplification.tsx`.
