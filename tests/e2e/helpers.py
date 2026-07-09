"""Shared helpers for the Invisible Interfaces E2E suite."""
import os

BASE_URL = os.environ.get("II_BASE_URL", "http://localhost:3000")

SECT = """(n) => {{
  const s = document.querySelector('section[data-scene="' + {n} + '"]');
  const r = s.getBoundingClientRect();
  return {{ top: r.top + scrollY, span: r.height - innerHeight, height: r.height }};
}}"""


def sect(page, n):
    """Scroll geometry for a scene section."""
    return page.evaluate(
        """(n) => { const s = document.querySelector(`section[data-scene="${n}"]`);
           const r = s.getBoundingClientRect();
           return { top: r.top + scrollY, span: r.height - innerHeight, height: r.height }; }""",
        n,
    )


def scrub(page, geo, p, settle=700):
    """Scroll a pinned section to progress p and wait."""
    page.evaluate(f"scrollTo(0, {geo['top'] + geo['span'] * p})")
    page.wait_for_timeout(settle)


EFF = """(el) => { let o = 1, n = el;
  while (n && n.tagName !== 'SECTION') { o *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; }
  return Math.round(o * 100) / 100; }"""

WAAPI_SWEEP = """() =>
  [...document.querySelectorAll('main *')].reduce((n, e) =>
    n + e.getAnimations().filter(a => !a.animationName && a.timeline &&
      a.timeline.constructor.name !== 'DocumentTimeline').length, 0)"""


def collect_errors(page):
    errors = []
    page.on("console", lambda m: errors.append(m.text[:200]) if m.type == "error" else None)
    return errors
