import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Invisible Interfaces",
  description:
    "What this essay is, how it argues, and the writing it stands on.",
};

const READING_ROOM = [
  {
    work: "Mark Weiser — “The Computer for the 21st Century” (1991)",
    note: "Weiser predicted computing that “weaves itself into the fabric of everyday life until it is indistinguishable from it.” This essay stages, in interaction, the argument he made in prose.",
  },
  {
    work: "Donald Norman — The Invisible Computer (1998)",
    note: "Norman argued the computer should disappear into the task. The essay's middle scenes — software acting before it is asked — are his forecast, now ordinary.",
  },
  {
    work: "Golden Krishna — The Best Interface Is No Interface (2015)",
    note: "Krishna made the case against screens for their own sake. Where his book argues by example, this essay tries to make the visitor feel the disappearance happen to them.",
  },
];

const MECHANISMS = [
  ["The chrome", "the header you arrive with decays in sub-threshold steps; by the end there is nothing left to navigate with — and nothing left to navigate."],
  ["The accent", "one amber — the phosphor of the terminals that demanded everything — marks each moment the machine requires your attention. It appears less and less, then never."],
  ["The motion", "early scenes move mechanically, stepped and instant; later scenes settle and breathe. Motion ages alongside the interfaces."],
  ["The photograph", "one image threads every era: a filename, a window row, a tile, a search result, a prediction, a memory. Its fidelity improves as the effort to reach it falls."],
  ["The memory", "the essay remembers how you solved — or abandoned — its terminal, and returns that cost to you two scenes later."],
  ["The dinner", "one evening threads the whole essay — the toast in the opening field, the message, the calendar entry, the booking. The machine drafts the intent because it read the conversation; you watched it learn to."],
];

export default function About() {
  return (
    <main className="mx-auto max-w-[38rem] px-6 py-24 font-serif font-light">
      <a
        href="/"
        className="font-mono text-[0.625rem] tracking-[0.18em] text-ink-faint transition-colors hover:text-ink-dim"
      >
        ← THE ESSAY
      </a>

      <h1 className="mt-14 text-[1.75rem] leading-snug text-ink">
        About this essay
      </h1>

      <p className="mt-8 leading-[1.7] text-ink">
        <em>Invisible Interfaces</em> is an interactive essay about how
        interaction design gave people their attention back. Its claim is not
        that interfaces disappeared — it is that they disappeared from our
        attention, and that this disappearance was designed, decision by
        decision. The essay does not explain this so much as stage it: the
        visitor operates a terminal, watches one task soften across forty
        years of paradigms, and is finally handled by software that never
        asks at all.
      </p>

      <h2 className="mt-16 font-mono text-[0.625rem] tracking-[0.22em] text-ink-faint">
        HOW IT ARGUES
      </h2>
      <ul className="mt-6 space-y-4">
        {MECHANISMS.map(([name, note]) => (
          <li key={name} className="leading-[1.65] text-ink-dim">
            <span className="text-ink">{name}.</span> {note}
          </li>
        ))}
      </ul>

      <h2 className="mt-16 font-mono text-[0.625rem] tracking-[0.22em] text-ink-faint">
        READING ROOM
      </h2>
      <p className="mt-6 leading-[1.65] text-ink">
        The argument is inherited; the staging is the contribution. It stands
        on three works in particular:
      </p>
      <ul className="mt-6 space-y-5">
        {READING_ROOM.map(({ work, note }) => (
          <li key={work} className="leading-[1.65] text-ink-dim">
            <span className="text-ink">{work}</span>
            <br />
            {note}
          </li>
        ))}
      </ul>

      <h2 className="mt-16 font-mono text-[0.625rem] tracking-[0.22em] text-ink-faint">
        A NOTE ON CHRONOLOGY
      </h2>
      <p className="mt-6 leading-[1.65] text-ink">
        The middle scene orders its eras terminal → windows → touch → search
        → prediction. As technology, search predates touch — desktop search
        shipped in the 1990s, the multi-touch phone in 2007. The essay's
        sequence follows each paradigm's turn as the <em>dominant</em> way a
        person found a thing, which is an argument about attention, not a
        timeline of releases. The era captions carry honest dates.
      </p>

      <h2 className="mt-16 font-mono text-[0.625rem] tracking-[0.22em] text-ink-faint">
        COLOPHON
      </h2>
      <p className="mt-6 leading-[1.65] text-ink">
        Designed and built by{" "}
        <a
          href="https://github.com/tanishkfr"
          className="text-ink underline decoration-[rgba(232,230,227,0.25)] underline-offset-4 transition-colors hover:decoration-[rgba(232,230,227,0.6)]"
        >
          Tanishk Salagame
        </a>
        . Next.js, TypeScript, and Framer Motion; two typefaces — Newsreader
        for the human voice, IBM Plex Mono for the machine's; one accent
        color, spent down to zero. No analytics, no tracking: the essay
        remembers you only in your own browser, and only what you did in its
        terminal.
      </p>
    </main>
  );
}
