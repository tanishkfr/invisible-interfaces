"use client";

import { useEffect, useRef, useState } from "react";
import {
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Fragment from "@/components/artifacts/Fragments";
import type { FragmentKind } from "@/content/scenes";
import { background, remembering, threshold } from "@/content/scenes";

/**
 * Scene 5 — Designing the Background.
 *
 * A pinned stage, quieter than any before it: the visitor holds still
 * and the seven questions pass through — label, question, then one
 * artifact they have already lived with, returning as a decision
 * someone made. Scroll is the only instrument left.
 */

/** Question windows on scene progress — derived from the corpus. */
const N = background.questions.length;
const Q_START = 0.13;
const Q_END = 0.93;
const QW = (Q_END - Q_START) / N;
const windowOf = (i: number): [number, number] => [Q_START + i * QW, Q_START + (i + 1) * QW];

const OPEN_W = [0.015, 0.05, 0.095, 0.13];
const TAKEAWAY_W = [0.945, 0.985];

/** Reduced-motion snap points: opening, each question, takeaway. */
const CENTERS = [
  0.07,
  ...Array.from({ length: N }, (_, i) => Q_START + (i + 0.5) * QW),
  0.97,
];

export default function Scene5Background() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Function-based on purpose — see Scene 2: stays JS-driven, and
  // snaps to one fully-present question under reduced motion.
  const progress = useTransform(scrollYProgress, (v) =>
    reduced ? CENTERS.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a)) : v,
  );

  const openingO = useTransform(progress, OPEN_W, [0, 1, 1, 0]);
  const takeawayO = useTransform(progress, TAKEAWAY_W, [0, 1]);

  // Which questions have been reached — the pattern break latches on.
  const [reached, setReached] = useState(-1);
  useMotionValueEvent(progress, "change", (v) => {
    const idx = Math.floor((v - Q_START) / QW);
    if (idx >= 0 && idx < N) setReached((r) => Math.max(r, idx));
  });

  return (
    <section
      ref={ref}
      data-scene={5}
      aria-label="Designing the Background"
      className="relative h-[520vh]"
    >
      <h2 className="sr-only">Designing the Background</h2>

      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        <m.p
          style={{ opacity: openingO }}
          className="absolute max-w-[34rem] text-center font-serif text-[clamp(1.6rem,4.5vw,2.6rem)] font-light leading-[1.3] tracking-[-0.01em] text-ink"
        >
          {background.opening}
        </m.p>

        <div className="grid w-full place-items-center">
          {background.questions.map((q, i) => (
            <Question
              key={q.label}
              progress={progress}
              window={windowOf(i)}
              q={q}
              active={reached >= i}
            />
          ))}
        </div>

        <m.p
          style={{ opacity: takeawayO }}
          className="absolute max-w-[34rem] text-center font-serif text-[clamp(1.1rem,2vw,1.35rem)] font-light italic text-ink-dim"
        >
          {background.takeaway}
        </m.p>
      </div>
    </section>
  );
}

/* ————— One question passing through the stage ————— */

function Question({
  progress,
  window: [a, b],
  q,
  active,
}: {
  progress: MotionValue<number>;
  window: [number, number];
  q: { label: string; question: string; example: string };
  active: boolean;
}) {
  // The pattern break: for the live artifact, the example acts FIRST
  // and the question arrives only after it has finished.
  const live = q.example === "maps-live";
  const qDelay = live ? 0.028 : 0;

  // A quiet cascade tied to scroll: label, then question, then the
  // artifact — each a beat behind the last. All leave together.
  const labelO = useTransform(progress, [a, a + 0.02, b - 0.02, b], [0, 1, 1, 0]);
  const questionO = useTransform(
    progress,
    [a + 0.012 + qDelay, a + 0.034 + qDelay, b - 0.02, b],
    [0, 1, 1, 0],
  );
  const exampleO = useTransform(
    progress,
    live
      ? [a, a + 0.018, b - 0.02, b]
      : [a + 0.026, a + 0.05, b - 0.02, b],
    live ? [0, 0.85, 0.85, 0] : [0, 0.6, 0.6, 0],
  );
  const y = useTransform(progress, [a, a + 0.045], [10, 0]);

  return (
    <m.div
      style={{ y }}
      className="flex flex-col items-center text-center [grid-area:1/1]"
    >
      <m.p
        style={{ opacity: labelO }}
        className="font-mono text-[0.625rem] tracking-[0.22em] text-ink-faint"
      >
        {q.label}
      </m.p>
      <m.p
        style={{ opacity: questionO }}
        className="mt-6 max-w-[36rem] font-serif text-[clamp(1.5rem,3.4vw,2.3rem)] font-light leading-[1.35] text-ink"
      >
        {q.question}
      </m.p>
      <m.div style={{ opacity: exampleO }} className="mt-12">
        {live ? <MapsLive active={active} /> : <Example kind={q.example} />}
      </m.div>
    </m.div>
  );
}

/**
 * The one artifact that acts in this room: the reroute happens to the
 * visitor — again — and only then is the question asked.
 */
function MapsLive({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const [rerouted, setRerouted] = useState(false);
  useEffect(() => {
    if (!active || rerouted) return;
    const t = setTimeout(() => setRerouted(true), reduced ? 100 : 1200);
    return () => clearTimeout(t);
  }, [active, rerouted, reduced]);
  return (
    <div className="flex w-max items-center gap-2 rounded-[var(--r-3)] border border-line bg-surface px-3.5 py-2.5 font-mono text-[0.6875rem] tracking-[0.02em] text-ink-dim">
      <m.svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="currentColor"
        aria-hidden
        animate={{ rotate: rerouted ? 32 : 0 }}
        transition={{ duration: reduced ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <path d="M6 0.5 11 11 6 8.5 1 11Z" />
      </m.svg>
      {rerouted ? "Rerouted." : "Rerouting…"}
    </div>
  );
}

/** The artifacts return — small, dim, and finally legible as decisions. */
function Example({ kind }: { kind: string }) {
  if (kind === "syslog") {
    return (
      <div className="space-y-1.5 text-left font-mono text-[0.625rem] tracking-[0.1em] text-ink-faint">
        {threshold.systems.slice(0, 3).map((s) => (
          <div key={s}>{s}</div>
        ))}
      </div>
    );
  }
  if (kind === "reply") {
    return (
      <div className="rounded-[var(--r-3)] border border-line bg-surface px-3.5 py-2.5 text-left font-mono text-[0.6875rem] text-ink-dim">
        {remembering.reply.suggested}
        <span className="ml-3 text-[0.575rem] tracking-[0.14em] text-ink-faint">SENT</span>
      </div>
    );
  }
  return <Fragment kind={kind as FragmentKind} />;
}
