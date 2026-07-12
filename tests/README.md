# E2E tests

Python + Playwright scripts that drive the real experience: the terminal, the
scroll-scrubbed morph, the pinned stages, responsive behavior, and the entrusted
task. The entrusted-task test asserts that the ending and About doorway do not
exist until real visibility-state absence completes the work.

```bash
pip install playwright
playwright install chromium

# against a local dev server (npm run dev):
cd tests/e2e
python test_opening_terminal.py
python test_morph.py
python test_pinned_scenes.py
python test_entrusted_task.py
python test_responsive.py

# against a deployment:
II_BASE_URL=https://your-deployment.vercel.app python test_entrusted_task.py
```

The animation tests also run the WAAPI sweep where relevant. The count must
remain zero; see the function-piped progress pattern in
`components/scenes/Scene2Simplification.tsx`.
