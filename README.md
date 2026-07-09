# Invisible Interfaces

An interactive essay about how interaction design gave people their attention
back.

**Live:** https://invisible-interfaces.vercel.app <!-- update if your Vercel URL differs -->

The claim is not that interfaces disappeared — it is that they disappeared
*from our attention*, and that this disappearance was designed, decision by
decision. The essay stages the argument rather than explaining it:

- You operate a **real terminal** that demands everything and counts what it
  cost you ("DISPLAYED. THAT TOOK 8 COMMANDS AND 94 SECONDS.")
- You scrub one task — *find the photograph* — through **five paradigms with
  no cuts**, while an attention ledger tallies each era's price, starting
  with your own numbers.
- Software starts acting **before you ask** — and the essay itself remembers
  how you solved (or abandoned) its terminal, and hands the memory back.
- One intent, six systems, one sentence. **Hold to see the work.**
- The header you arrived with is gone. You will not remember when it left.

## The system

| Mechanism | Role |
|---|---|
| Decaying chrome | The site practices its thesis: explicit → nothing |
| One accent (amber phosphor) | Marks machine-demands-attention; spent to zero |
| Two voices | Newsreader = human, IBM Plex Mono = machine — never labeled |
| Era-indexed motion | Stepped/mechanical early, settled/organic late |
| The photograph | One image through every era, sharpening as effort falls |

Full design language: [VISUAL_SYSTEM.md](VISUAL_SYSTEM.md) ·
Creative direction: [director.md](director.md) ·
Lineage and citations: [/about](https://invisible-interfaces.vercel.app/about)

## Reading room

The argument is inherited; the staging is the contribution.

- Mark Weiser, *The Computer for the 21st Century* (1991)
- Donald Norman, *The Invisible Computer* (1998)
- Golden Krishna, *The Best Interface Is No Interface* (2015)

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → out/
```

## Test

End-to-end tests (Python + Playwright) drive the real experience — the
terminal, the scroll-scrubbed morph, the pinned stages, reduced motion,
and a WAAPI-desync regression sweep:

```bash
pip install playwright && playwright install chromium
cd tests/e2e
python test_terminal.py     # set II_BASE_URL to test a deployment
```

Built with Next.js 15 (static export), TypeScript, Tailwind 4, and Framer
Motion. 8–11 minutes, dark, quiet. No analytics; the essay remembers you
only in your own browser.
