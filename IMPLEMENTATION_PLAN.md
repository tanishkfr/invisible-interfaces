# Invisible Interfaces — release architecture

This document describes the implemented five-scene release. It replaces the pre-code six-scene proposal.

## Runtime

- Next.js App Router with static export.
- TypeScript strict mode.
- Tailwind CSS tokens in app/globals.css.
- Motion loaded through LazyMotion.
- Below-fold scenes split into separate route chunks.
- No analytics, server, account, remote agent, or runtime data request.

## State

- Scene state is local React state.
- Terminal memory uses sessionStorage so it survives the journey but is deleted with the tab.
- The attention ledger records only values returned in the final receipt.
- Entrusted progress is calculated from measured hidden-tab intervals.
- The original scan is never mutated; discard affects only the staged restored copy.

## Interaction architecture

- Experience.tsx owns global progress, active-scene observation, code splitting, and the completion doorway.
- Header.tsx owns explicit navigation and its decay.
- Scene0Forgotten.tsx owns the witnessed opening sequence and accessible artifact equivalent.
- Scene1Terminal.tsx owns the literal command interaction and tab-scoped memory.
- Scene2Simplification.tsx owns the continuous task transformation and comparison instrumentation.
- Scene3Remembering.tsx owns the four latched anticipatory beats.
- EntrustedTask.tsx owns absence, return, fallback, visual comparison, work receipt, authority boundary, attention receipt, and reversal.

## Release gates

1. Production export compiles and type-checks.
2. No mojibake sequences exist in source or rendered text.
3. The committed end-to-end suite describes only scenes 0–4.
4. Desktop, mobile, keyboard, reduced-motion, early-return, full-return, fallback, About, and 404 paths are verified.
5. Screenshots are captured from the canonical release, not retained from removed concepts.
6. The repository is clean after verification.