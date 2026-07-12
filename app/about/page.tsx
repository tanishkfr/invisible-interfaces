import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Invisible Interfaces",
  description: "The argument, interaction, sources, and limits of Invisible Interfaces.",
};

const READING_ROOM = [
  {
    work: "Mark Weiser — “The Computer for the 21st Century” (1991)",
    note: "Computing receding into ordinary life establishes the historical horizon. This essay asks what that recession does to attention and accountability.",
  },
  {
    work: "Donald Norman — The Invisible Computer (1998)",
    note: "Norman relocates value from the computer to the task. The exhibition makes that relocation experiential, then tests what must remain visible when work moves out of view.",
  },
  {
    work: "Golden Krishna — The Best Interface Is No Interface (2015)",
    note: "Krishna argues against screens as default solutions. This project adds a return condition: invisible work still owes the person a bounded account of action and restraint.",
  },
];

const MOVEMENTS = [
  ["Demand", "A terminal requires syntax, patience, and continuous attention to find one photograph."],
  ["Reduction", "The same task moves through pointing, touching, search, and prediction; the visitor spends progressively less attention."],
  ["Anticipation", "Software begins remembering context and acting before an explicit request."],
  ["Entrustment", "The beach photograph returns as a task that refuses to run while the visitor watches."],
  ["Return", "Absence produces the outcome, a receipt of completed work, explicit limits, and a reversible decision."],
];

export default function About() {
  return (
    <main className="mx-auto max-w-[40rem] px-6 py-24 font-serif font-light">
      <a href="/" className="font-mono text-[0.625rem] tracking-[0.18em] text-ink-faint transition-colors hover:text-ink-dim">← THE ESSAY</a>
      <h1 className="mt-14 text-[1.75rem] leading-snug text-ink">About this investigation</h1>
      <p className="mt-8 leading-[1.7] text-ink">
        <em>Invisible Interfaces</em> is a research-through-design exhibition about attention becoming absence. One task travels from explicit command to entrusted work. The last interaction is not a simulation of background computing: it advances only while this tab is hidden, then makes return—not supervision—the moment of accountability.
      </p>

      <h2 className="mt-16 font-mono text-[0.625rem] tracking-[0.22em] text-ink-faint">THE FIVE MOVEMENTS</h2>
      <ol className="mt-6 space-y-5">
        {MOVEMENTS.map(([name, note]) => <li key={name} className="leading-[1.65] text-ink-dim"><span className="text-ink">{name}.</span> {note}</li>)}
      </ol>

      <h2 className="mt-16 font-mono text-[0.625rem] tracking-[0.22em] text-ink-faint">WHAT THE INTERACTION CONTRIBUTES</h2>
      <p className="mt-6 leading-[1.65] text-ink">
        Most background interfaces represent absence as empty time or hide it behind a progress display. Here, absence is the input. Returning early pauses the task and reveals only the work earned while away. Returning after completion reveals the repaired copy and its authority boundary together: what changed, what remained untouched, what was not transmitted, and what the system refused to infer.
      </p>
      <p className="mt-5 leading-[1.65] text-ink">
        Visibility state and the task ledger remain local to this browser. There is no analytics endpoint, account, or remote agent. The browser stages authored work rather than operating on a real archive. That limit is deliberate: the artifact investigates the felt relationship between attention, delegation, and accountable return; it does not claim evidence about deployed autonomous systems or participants beyond the visitor experiencing it.
      </p>

      <h2 className="mt-16 font-mono text-[0.625rem] tracking-[0.22em] text-ink-faint">READING ROOM</h2>
      <ul className="mt-6 space-y-5">
        {READING_ROOM.map(({ work, note }) => <li key={work} className="leading-[1.65] text-ink-dim"><span className="text-ink">{work}</span><br />{note}</li>)}
      </ul>

      <h2 className="mt-16 font-mono text-[0.625rem] tracking-[0.22em] text-ink-faint">COLOPHON</h2>
      <p className="mt-6 leading-[1.65] text-ink">
        Designed and built by <a href="https://github.com/tanishkfr" className="text-ink underline decoration-[rgba(232,230,227,0.25)] underline-offset-4">Tanishk Salagame</a>. Next.js, TypeScript, Motion, Newsreader, and IBM Plex Mono. Source: <a href="https://github.com/tanishkfr/invisible-interfaces" className="text-ink underline decoration-[rgba(232,230,227,0.25)] underline-offset-4">GitHub</a>.
      </p>
    </main>
  );
}
