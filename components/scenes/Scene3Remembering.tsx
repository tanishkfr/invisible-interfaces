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
import Photo from "@/components/artifacts/Photo";
import MachineText from "@/components/systems/MachineText";
import { remembering } from "@/content/scenes";

/**
 * Scene 3 — When Software Started Remembering.
 *
 * A pinned stage: the page holds still while scroll carries four
 * demonstrations through it — a login fills itself, a reply drafts
 * itself, a calendar entry appears from a conversation, and the
 * photograph returns as a memory, unasked. Each acts on its own the
 * first time its moment arrives; scrubbing back doesn't rewind them —
 * what software remembers stays remembered.
 */

/** Opening statement window, then four beat windows on scene progress. */
const OPEN_W = [0.02, 0.06, 0.1, 0.14];
const BEATS: Array<[number, number]> = [
  [0.14, 0.36],
  [0.36, 0.58],
  [0.58, 0.8],
  [0.8, 1.0],
];
/** Reduced-motion snap points: statement + one per beat. */
const CENTERS = [0.08, 0.25, 0.47, 0.69, 0.92];

export default function Scene3Remembering() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Function-based on purpose — see Scene 2: keeps every downstream
  // transform JS-driven (no WAAPI promotion) and snaps to discrete
  // moments under reduced motion.
  const progress = useTransform(scrollYProgress, (v) =>
    reduced ? CENTERS.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a)) : v,
  );

  // Beats latch on when their window is reached and never un-play.
  const [reached, setReached] = useState(-1);
  useMotionValueEvent(progress, "change", (v) => {
    const idx = BEATS.findIndex(([a, b]) => v >= a + 0.03 && v < b);
    if (idx >= 0) setReached((r) => Math.max(r, idx));
  });

  const openingO = useTransform(progress, OPEN_W, [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      data-scene={3}
      aria-label="When Software Started Remembering"
      className="relative h-[450vh]"
    >
      <h2 className="sr-only">When Software Started Remembering</h2>

      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-6">
        {/* The human thought that opens the room */}
        <m.p
          style={{ opacity: openingO }}
          className="absolute max-w-[34rem] text-balance text-center font-serif text-[clamp(1.6rem,4.5vw,2.6rem)] font-light leading-[1.3] tracking-[-0.01em] text-ink"
        >
          {remembering.opening}
        </m.p>

        {/* The four demonstrations, swapped in place by scroll */}
        <div className="grid place-items-center">
          <BeatShell progress={progress} window={BEATS[0]}>
            <AutofillBeat active={reached >= 0} />
          </BeatShell>
          <BeatShell progress={progress} window={BEATS[1]}>
            <ReplyBeat active={reached >= 1} />
          </BeatShell>
          <BeatShell progress={progress} window={BEATS[2]}>
            <CalendarBeat active={reached >= 2} />
          </BeatShell>
          {/* The memory recedes at the very end — handing the room to
              the intent waiting below. No takeaway: the receipt already
              said it. */}
          <BeatShell progress={progress} window={BEATS[3]}>
            <MemoryBeat active={reached >= 3} />
          </BeatShell>
        </div>

        {/* The residue: what software did while you only watched,
            accumulating at the foot of the room. */}
        <p
          aria-hidden
          className="absolute bottom-[10vh] left-0 w-full text-center font-mono text-[0.625rem] tracking-[0.14em] text-ink-faint"
        >
          {remembering.residue.slice(0, Math.max(0, reached)).map((token, i) => (
            <m.span
              key={token}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {i > 0 && <span className="mx-2 text-ink-faint">·</span>}
              {token}
            </m.span>
          ))}
        </p>
      </div>
    </section>
  );
}

/* ————— Pinned-stage plumbing ————— */

function BeatShell({
  progress,
  window: [a, b],
  holdToEnd,
  children,
}: {
  progress: MotionValue<number>;
  window: [number, number];
  holdToEnd?: boolean;
  children: React.ReactNode;
}) {
  // A short crossfade window: long enough to settle, short enough
  // that a card is never lingering half-visible with its text too
  // dim to read — a ghost box reads as an unexplained line, not a
  // fading photograph.
  const opacity = useTransform(
    progress,
    [a, a + 0.018, b - 0.018, b],
    [0, 1, 1, holdToEnd ? 1 : 0],
  );
  // Appear verb: opacity plus a settle of a few pixels — never a slide.
  const y = useTransform(progress, [a, a + 0.022], [10, 0]);
  return (
    <m.div style={{ opacity, y }} className="[grid-area:1/1]">
      {children}
    </m.div>
  );
}

/** Staged timeline that begins the first time its beat is reached. */
function useStagedTimeline(active: boolean, count: number, stepMs: number) {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (!active || stage >= count) return;
    const t = setTimeout(
      () => setStage((s) => s + 1),
      stage === 0 ? 550 : reduced ? 150 : stepMs,
    );
    return () => clearTimeout(t);
  }, [active, stage, count, stepMs, reduced]);
  return stage;
}

const CARD =
  "w-[19rem] rounded-[var(--r-3)] border border-line bg-surface p-5 font-mono text-[0.8125rem] leading-relaxed";

/* ————— Beat 1: the login that fills itself ————— */

function AutofillBeat({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const stage = useStagedTimeline(active, 3, 900);
  return (
    <div className={CARD} role="group" aria-label="A sign-in form filling itself">
      <p aria-live="polite" className="sr-only">
        {stage >= 3 ? "The form filled itself and signed in." : ""}
      </p>
      <div className="mb-4 flex items-center gap-2 border-b border-line pb-3 text-[0.625rem] tracking-[0.14em] text-ink-faint">
        <svg width="9" height="11" viewBox="0 0 9 11" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
          <rect x="1" y="4.5" width="7" height="5.5" />
          <path d="M2.5 4.5V3a2 2 0 0 1 4 0v1.5" />
        </svg>
        CLOUD ACCOUNT
      </div>
      <div className="text-[0.6875rem] text-ink-faint">EMAIL</div>
      <div className="mt-1 border-b border-line pb-1 text-ink">
        <m.span
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= 1 ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.15 }}
          className="rounded-[2px] bg-[rgba(232,163,61,0.08)] px-1"
        >
          {remembering.login.email}
        </m.span>
      </div>
      <div className="mt-4 text-[0.6875rem] text-ink-faint">PASSWORD</div>
      <div className="mt-1 border-b border-line pb-1 tracking-[0.2em] text-ink">
        <m.span
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= 2 ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.15 }}
          className="rounded-[2px] bg-[rgba(232,163,61,0.08)] px-1"
        >
          ••••••••••
        </m.span>
      </div>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 3 ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.9 }}
        className="mt-4 text-ink-dim"
      >
        {remembering.login.signedIn}
      </m.div>
    </div>
  );
}

/* ————— Beat 2: the reply that drafts itself ————— */

function ReplyBeat({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const stage = useStagedTimeline(active, 2, 1100);
  return (
    <div className={CARD} role="group" aria-label="A message reply suggesting itself">
      <div className="mb-3 text-[0.625rem] tracking-[0.14em] text-ink-faint">
        SAM · 6:42 PM
      </div>
      <div className="w-max max-w-[85%] rounded-[var(--r-3)] rounded-bl-[4px] border border-line px-3 py-2 text-ink-dim">
        {remembering.reply.incoming}
      </div>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 2 ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.6 }}
        className="mt-5"
      >
        <div className="text-[0.625rem] tracking-[0.14em] text-ink-faint">
          {remembering.reply.label}
        </div>
        <div className="mt-1.5 border-b border-line pb-1 text-ink">
          {stage >= 2 ? (
            <MachineText text={remembering.reply.suggested} instant={!!reduced} />
          ) : (
            " "
          )}
        </div>
      </m.div>
    </div>
  );
}

/* ————— Beat 3: the calendar that heard you ————— */

function CalendarBeat({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const stage = useStagedTimeline(active, 1, 900);
  return (
    // Slides in from the side — from the conversation it was taken from.
    <m.div
      initial={reduced ? false : { opacity: 0, x: -8 }}
      animate={{ opacity: stage >= 1 ? 1 : 0, x: stage >= 1 ? 0 : -8 }}
      transition={{ duration: reduced ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={CARD}
      role="group"
      aria-label="A calendar event created from a conversation"
    >
      <div className="flex items-baseline justify-between">
        <span className="font-serif text-[1.05rem] not-italic text-ink">
          {remembering.calendar.title}
        </span>
        <span className="text-[0.6875rem] text-ink-dim">{remembering.calendar.when}</span>
      </div>
      <div className="mt-3 text-[0.625rem] tracking-[0.14em] text-ink-faint">
        {remembering.calendar.source}
      </div>
    </m.div>
  );
}

/* ————— Beat 4: the memory — and the page remembering you ————— */

function MemoryBeat({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const stage = useStagedTimeline(active, 2, 1600);
  // Read lazily — the visitor writes this memory in Scene 1, long
  // after this component has mounted. Solvers get their cost back;
  // deserters get the gentler, sharper truth.
  const [memoryLine, setMemoryLine] = useState<string | null>(null);
  useEffect(() => {
    if (stage < 1) return;
    try {
      const commands = sessionStorage.getItem("ii.commands");
      if (commands) setMemoryLine(remembering.memory.selfReference(commands));
      else if (sessionStorage.getItem("ii.abandoned"))
        setMemoryLine(remembering.memory.selfReferenceAbandoned);
    } catch {}
  }, [stage]);

  return (
    // The photograph's homecoming stands larger than the forms before it.
    <div className="flex w-[min(24rem,88vw)] flex-col">
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 1 ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-[var(--r-3)] border border-line"
        role="group"
        aria-label="A photo memory appearing on its own"
      >
        <div className="h-[min(16rem,58vw)]">
          <Photo era="full" />
        </div>
        <div className="bg-surface px-4 py-3 font-serif text-[0.95rem] italic text-ink-dim">
          {remembering.memory.caption}
        </div>
      </m.div>

      {memoryLine && (
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= 2 ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.9 }}
          className="mt-5 text-center font-mono text-[0.6875rem] tracking-[0.14em] text-ink-faint"
        >
          {memoryLine}
        </m.p>
      )}
    </div>
  );
}
