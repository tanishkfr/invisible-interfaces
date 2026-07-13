import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The argument, interaction, sources, and limits of Invisible Interfaces.",
};

const READING_ROOM = [
  {
    work: "Mark Weiser — “The Computer for the 21st Century” (1991)",
    href: "https://www.ubiq.com/hypertext/weiser/SciAmDraft3.html",
    note: "Computing receding into ordinary life establishes the historical horizon. This essay asks what that recession does to attention and accountability.",
  },
  {
    work: "Donald Norman — The Invisible Computer (1998)",
    href: "https://mitpress.mit.edu/9780262640411/the-invisible-computer/",
    note: "Norman relocates value from the computer to the task. The exhibition makes that relocation experiential, then tests what must remain visible when work moves out of view.",
  },
  {
    work: "Golden Krishna — The Best Interface Is No Interface (2015)",
    href: "https://www.nointerface.com/book/",
    note: "Krishna argues against screens as default solutions. This project adds a return condition: invisible work still owes the person a bounded account of action and restraint.",
  },
];

const MOVEMENTS = [
  ["Demand", "A terminal requires syntax, patience, and continuous attention to find one photograph."],
  ["Reduction", "The same task moves through pointing, touching, search, and prediction; the sequence describes attentional distance, not invention order."],
  ["Anticipation", "Software begins remembering context and acting before an explicit request."],
  ["Entrustment", "The beach photograph returns as a task that refuses to run while the visitor watches."],
  ["Return", "Absence produces the restored comparison, a receipt of completed work, explicit limits, and a reversible decision."],
];

export default function About() {
  return (
    <main className="mx-auto max-w-[42rem] px-5 py-20 font-serif font-light sm:px-6 sm:py-24">
      <a
        href="/"
        className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-dim underline decoration-line underline-offset-4 transition-colors hover:text-ink"
      >
        ← THE ESSAY
      </a>
      <h1 className="mt-14 text-[clamp(2rem,5vw,2.75rem)] leading-tight text-ink">
        About this investigation
      </h1>
      <p className="mt-8 text-[1.125rem] leading-[1.75] text-ink">
        <em>Invisible Interfaces</em> is a research-through-design exhibition
        about attention becoming absence. One task travels from explicit command
        to entrusted work. The final interaction is causal: work advances only
        while this tab is hidden, making return—not supervision—the moment of
        accountability.
      </p>

      <SectionHeading>THE FIVE MOVEMENTS</SectionHeading>
      <ol className="mt-6 space-y-5">
        {MOVEMENTS.map(([name, note]) => (
          <li key={name} className="text-[1.0625rem] leading-[1.7] text-ink-dim">
            <span className="text-ink">{name}.</span> {note}
          </li>
        ))}
      </ol>

      <SectionHeading>WHAT THE INTERACTION CONTRIBUTES</SectionHeading>
      <p className="mt-6 text-[1.0625rem] leading-[1.75] text-ink">
        Most background interfaces represent absence as empty time or hide it
        behind a progress display. Here, absence is the input. Returning early
        pauses the task and reveals only the work earned while away. Returning
        after completion reveals the repaired image, its comparison with the
        source, and its authority boundary together.
      </p>
      <p className="mt-5 text-[1.0625rem] leading-[1.75] text-ink">
        The browser stages authored work rather than operating on a real archive.
        The artifact investigates the felt relationship between attention,
        delegation, and accountable return; it does not claim evidence about
        deployed autonomous systems or participants beyond the visitor
        experiencing it.
      </p>

      <SectionHeading>WHAT IS MEASURED</SectionHeading>
      <p className="mt-6 text-[1.0625rem] leading-[1.75] text-ink">
        The essay keeps a small attention ledger—opening patience, terminal
        effort, reverse scrubs, and scene-menu use—only so it can return those
        observations to the visitor. The ledger uses session storage, is never
        transmitted, and is deleted when the tab closes.
      </p>

      <SectionHeading>READING ROOM</SectionHeading>
      <ul className="mt-6 space-y-6">
        {READING_ROOM.map(({ work, href, note }) => (
          <li key={work} className="text-[1.0625rem] leading-[1.7] text-ink-dim">
            <a
              href={href}
              className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
            >
              {work}
            </a>
            <br />
            {note}
          </li>
        ))}
      </ul>

      <SectionHeading>COLOPHON</SectionHeading>
      <p className="mt-6 text-[1.0625rem] leading-[1.75] text-ink">
        Designed and built by{" "}
        <a
          href="https://github.com/tanishkfr"
          className="text-ink underline decoration-line underline-offset-4"
        >
          Tanishk Salagame
        </a>
        . Next.js, TypeScript, Motion, Newsreader, and IBM Plex Mono. Source:{" "}
        <a
          href="https://github.com/tanishkfr/invisible-interfaces"
          className="text-ink underline decoration-line underline-offset-4"
        >
          GitHub
        </a>
        .
      </p>
    </main>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-16 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-dim">
      {children}
    </h2>
  );
}