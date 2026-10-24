# Phase 3 dependency review

Review date: 2026-10-23. Before/after audits and the resolved dependency tree are
retained in `docs/v2-phase3-evidence/`. This reviews the locally prepared tree;
it does not update or validate the existing public deployment.

## Findings and relevance

| Package | Audit severity before | Relevant attack surface | Repair |
| --- | --- | --- | --- |
| Next 15.5.20 | Critical | Advisory set includes server actions, rewrites/caches, Windows hosting and image optimization. This project exports static files, uses unoptimized images and defines no server actions, API endpoints, rewrites or user-upload path. Those runtime surfaces are absent from the inspected static architecture, an applicability assessment rather than a general exploitability proof. Development/build tooling still warrants a patched framework. | Next 15.5.28, retaining the current major. |
| PostCSS 8.4.31/8.5.16 | High | CSS stringify/source-map processing. Build-time parsing uses local authored CSS rather than uploaded styles, reducing the exposed input path. The toolchain still needed repair. | Focused override to patched 8.5.x; lock resolves 8.5.31. |
| sharp | High | Native image decoders including SVG/HEIF dependencies. No runtime optimizer is served by this static export; framework image/metadata generation can still invoke native tooling at build. | Focused override to 0.35.5; production image/metadata build verified. |
| nanoid 3.3.15 | High | Malformed size parameters can hang affected generators. The application does not call nanoid directly; it was transitive build tooling. | Lock resolves 3.3.20 through repaired PostCSS. |
| source-map-js 1.2.1 | High | Malformed indexed source-map offsets can block parsing; no user-supplied maps accepted by the app. | Lock resolves 1.2.2. |

The two overrides are deliberate security constraints, not added product
configuration. No forced Next16, React, Motion or TypeScript major upgrade was
introduced. `npm install`, production build and subsequent browser regression
checks exercise the repaired tree. `npm audit --json` reports **zero findings**
after repair; that is a registry-audit result, not proof the application has no
security defects. Use `npm ci` with the committed lockfile to reproduce it.

## Primary references

- [Next SVG optimizer advisory](https://github.com/advisories/GHSA-2464-fhr4-w9xw).
- [PostCSS source-map advisory](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp).
- [sharp librsvg advisory](https://github.com/advisories/GHSA-wq5f-xc86-pv6w).
- [nanoid size advisory](https://github.com/advisories/GHSA-28wg-ghj8-5hjv).
- [source-map-js indexed-map advisory](https://github.com/advisories/GHSA-68fv-2mgg-jv7q).

The raw audit includes the full Next advisory list, source IDs, ranges and
transitive relationships. Check the current registry again immediately before
any separately authorized publication, since advisories can change.
