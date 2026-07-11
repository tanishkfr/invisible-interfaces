"use client";

import { m, useTransform, type MotionValue } from "motion/react";
import { clockOf, type AttentionSnapshot } from "@/lib/attention";
import { reveal } from "@/content/scenes";

/**
 * "This is where your attention went."
 *
 * The essay's turn: it has been measuring you the whole time, and now
 * it reads your own hour back to you — line by line, from real signals,
 * ending on a claim it commits to and the ethical truth that none of
 * this ever left your browser. Then the closing statement lands with
 * the weight of having just been proven on you.
 *
 * Scroll-paced like every other room. The lines accumulate — a receipt
 * printing — then clear together, handing the void to the statement.
 */

type Voice = "serif" | "mono";
interface RLine {
  text: string;
  voice: Voice;
  dim?: boolean;
}

/** Build the trace from the frozen snapshot. Every branch is true. */
function buildLines(s: AttentionSnapshot): RLine[] {
  const lines: RLine[] = [
    { text: reveal.opener, voice: "serif" },
    { text: reveal.intro, voice: "serif", dim: true },
  ];

  // The dark.
  if (s.voidWaitMs !== null) {
    lines.push(
      s.voidWaitMs >= 2500
        ? { text: reveal.void.waited, voice: "mono" }
        : { text: reveal.void.skipped((s.voidWaitMs / 1000).toFixed(1)), voice: "mono" },
    );
  }

  // The machine.
  if (s.solved && s.commands !== null) {
    lines.push({ text: reveal.terminal.solved(s.commands, s.seconds), voice: "mono" });
  } else if (s.abandoned) {
    lines.push({ text: reveal.terminal.abandoned, voice: "mono" });
  } else {
    lines.push({ text: reveal.terminal.untouched, voice: "mono" });
  }

  // The forty years.
  if (s.scrubBacks >= 2) lines.push({ text: reveal.morph.many(s.scrubBacks), voice: "mono" });
  else if (s.scrubBacks === 1) lines.push({ text: reveal.morph.once, voice: "mono" });
  else lines.push({ text: reveal.morph.none, voice: "mono" });

  // The hidden work.
  lines.push(
    s.held
      ? { text: reveal.hold.held, voice: "mono" }
      : { text: reveal.hold.trusted, voice: "mono" },
  );

  // The falsifiable spine: navigation.
  lines.push({ text: reveal.navigation.framed, voice: "serif" });
  const faded = s.menuFadedMs !== null ? clockOf(s.menuFadedMs) : null;
  const lastClick = s.lastMenuClickMs !== null ? clockOf(s.lastMenuClickMs) : null;
  if (s.menuClicks === 0) {
    lines.push({ text: faded ? reveal.navigation.never(faded) : reveal.navigation.never("—"), voice: "mono" });
    lines.push({ text: reveal.navigation.neverClose, voice: "serif", dim: true });
  } else if (s.menuFadedMs !== null && s.lastMenuClickMs !== null && s.lastMenuClickMs > s.menuFadedMs) {
    // Caught: you reached for it after it was gone. The essay admits it.
    lines.push({ text: reveal.navigation.caught(lastClick!), voice: "mono" });
  } else {
    lines.push({ text: reveal.navigation.stopped(s.menuClicks, lastClick ?? "—"), voice: "mono" });
  }

  // The ethical turn — the contribution.
  lines.push({ text: reveal.ethicsFramed, voice: "serif" });
  lines.push({ text: reveal.ethics, voice: "serif", dim: true });

  return lines;
}

const APPEAR_START = 0.05;
const APPEAR_END = 0.5;
const CLEAR_START = 0.56;
const CLEAR_END = 0.62;

export default function Reveal({
  progress,
  snap,
}: {
  progress: MotionValue<number>;
  snap: AttentionSnapshot;
}) {
  const lines = buildLines(snap);
  const step = (APPEAR_END - APPEAR_START) / lines.length;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
      {/* Screen-reader prose: the whole trace at once, no scrubbing. */}
      <p className="sr-only">
        Your attention, this hour. {lines.map((l) => l.text).join(" ")}
      </p>

      <div aria-hidden className="flex w-full max-w-[38rem] flex-col items-center gap-[1.1rem] text-center">
        {lines.map((l, i) => (
          <RevealLine
            key={i}
            progress={progress}
            appear={APPEAR_START + i * step}
            line={l}
          />
        ))}

        {/* The thread: your hour, drawn once. The stretch between the
            moment navigation left and now is the thesis, made visible. */}
        <Timeline progress={progress} snap={snap} />
      </div>
    </div>
  );
}

function RevealLine({
  progress,
  appear,
  line,
}: {
  progress: MotionValue<number>;
  appear: number;
  line: RLine;
}) {
  const opacity = useTransform(
    progress,
    [appear, appear + 0.02, CLEAR_START, CLEAR_END],
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [appear, appear + 0.03], [8, 0]);

  const cls =
    line.voice === "serif"
      ? `font-serif text-[clamp(1.15rem,2.2vw,1.5rem)] font-light ${line.dim ? "italic text-ink-dim" : "text-ink"}`
      : `font-mono text-[0.75rem] tracking-[0.08em] ${line.dim ? "text-ink-faint" : "text-ink-dim"}`;

  return (
    <m.p style={{ opacity, y }} className={cls}>
      {line.text}
    </m.p>
  );
}

/** One thin stroke: arrival on the left, now on the right, with the
 * moment the navigation left marked. Not a chart — a portrait. */
function Timeline({
  progress,
  snap,
}: {
  progress: MotionValue<number>;
  snap: AttentionSnapshot;
}) {
  const opacity = useTransform(
    progress,
    [APPEAR_END - 0.06, APPEAR_END - 0.02, CLEAR_START, CLEAR_END],
    [0, 1, 1, 0],
  );
  const total = Math.max(snap.totalMs, 1);
  const pct = (ms: number) => `${Math.min(100, Math.max(0, (ms / total) * 100))}%`;
  const fadedX = snap.menuFadedMs !== null ? pct(snap.menuFadedMs) : null;
  const clickX = snap.lastMenuClickMs !== null ? pct(snap.lastMenuClickMs) : null;

  return (
    <m.div style={{ opacity }} className="relative mt-6 h-6 w-[min(30rem,80vw)]">
      <div className="absolute top-1/2 left-0 h-px w-full bg-line" />
      {/* Where the navigation left. */}
      {fadedX && (
        <div className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-ink-faint" style={{ left: fadedX }} />
      )}
      {/* Where you last reached for it, if you did. */}
      {clickX && (
        <div className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-ink-dim" style={{ left: clickX }} />
      )}
      {/* Now — the amber cursor, the machine's one held breath of attention. */}
      <div className="absolute top-1/2 right-0 h-2.5 w-[2px] -translate-y-1/2 bg-accent [box-shadow:0_0_10px_rgba(232,163,61,0.4)]" />
    </m.div>
  );
}
