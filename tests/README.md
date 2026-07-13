# End-to-end tests

The Python and Playwright scripts drive the canonical five-scene experience:

- witnessed and hurried opening;
- terminal solve and abandonment;
- simplification plateaus and copy integrity;
- anticipation beats and memory callback;
- entrusted early return, full return, fallback, comparison, discard, and ending gate;
- keyboard navigation;
- 375-pixel layout and reduced motion;
- About and 404 routes.

Run against a local development server:

    cd tests/e2e
    python test_opening_terminal.py
    python test_morph.py
    python test_pinned_scenes.py
    python test_entrusted_task.py
    python test_keyboard.py
    python test_responsive.py

Set II_BASE_URL to run the same suite against a deployment.