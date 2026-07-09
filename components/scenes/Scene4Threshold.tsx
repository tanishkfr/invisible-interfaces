"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { m, useInView, useReducedMotion } from "motion/react";
import { threshold } from "@/content/scenes";

type Phase = "waiting" | "working" | "settled";

/**
 * Scene 4 — The Invisible Threshold.
 *
 * The visitor expresses one intent — or merely accepts it; even the
 * asking has been absorbed. Six systems coordinate in a log almost too
 * dim to read, and the visible result is a single sentence. The only
 * interaction left is transparency itself: hold, and the hidden work
 * illuminates. Release, and it recedes.
 */
export default function Scene4Threshold() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.55 });
  const reduced = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("waiting");
  const [linesShown, setLinesShown] = useState(0);
  const [held, setHeld] = useState(false);

  const accept = useCallback(() => {
    setPhase((p) => (p === "waiting" ? "working" : p));
  }, []);

  // The systems report in, fast and dim.
  useEffect(() => {
    if (phase !== "working") return;
    if (linesShown >= threshold.systems.length) {
      const t = setTimeout(() => setPhase("settled"), reduced ? 200 : 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLinesShown((n) => n + 1), reduced ? 60 : 180);
    return () => clearTimeout(t);
  }, [phase, linesShown, reduced]);

  // Holding is the one gesture: press anywhere on the block, or hold
  // space/enter on it. Luminance-only — the Illuminate verb.
  const holdHandlers = {
    onPointerDown: () => setHeld(true),
    onPointerUp: () => setHeld(false),
    onPointerLeave: () => setHeld(false),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setHeld(true);
      }
    },
    onKeyUp: () => setHeld(false),
  };

  return (
    <section
      ref={sectionRef}
      data-scene={4}
      aria-label="The Invisible Threshold"
      className="flex min-h-screen flex-col items-center justify-center px-6 py-[var(--pause-l)]"
    >
      <h2 className="sr-only">The Invisible Threshold</h2>

      {/* The intent. Even asking has become optional. */}
      <button
        type="button"
        onClick={accept}
        disabled={phase !== "waiting"}
        aria-label={`Express the intent: ${threshold.prompt}`}
        className="group cursor-pointer border-b border-line pb-2 text-left disabled:cursor-default"
      >
        <m.span
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="font-serif text-[clamp(1.4rem,3vw,2rem)] font-light text-ink"
        >
          <span className={phase === "waiting" ? "text-ink-dim" : "text-ink"}>
            {threshold.prompt}
          </span>
          {phase === "waiting" && (
            <span className="ml-4 align-middle font-mono text-[0.625rem] tracking-[0.14em] text-accent opacity-80 transition-opacity group-hover:opacity-100">
              {threshold.accept} ⏎
            </span>
          )}
        </m.span>
      </button>

      {/* The work, barely visible — then the sentence. */}
      <div className="mt-14 flex min-h-[16rem] w-full max-w-[26rem] flex-col items-center">
        {phase !== "waiting" && (
          <m.div
            {...holdHandlers}
            role="button"
            tabIndex={0}
            aria-label="Hold to reveal the systems that did the work"
            animate={{ opacity: held ? 0.95 : 0.28 }}
            transition={{ duration: reduced ? 0 : 0.5, ease: "easeOut" }}
            className="w-full cursor-pointer touch-none select-none outline-offset-8"
          >
            <ul className="space-y-2 font-mono text-[0.6875rem] tracking-[0.1em] text-ink-dim">
              {threshold.systems.slice(0, linesShown).map((s) => (
                <m.li
                  key={s}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: reduced ? 0 : 0.25 }}
                >
                  {s}
                </m.li>
              ))}
            </ul>
          </m.div>
        )}

        {phase === "settled" && (
          <>
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 0.4 }}
              aria-live="polite"
              className="mt-10 text-center font-serif text-[clamp(1.2rem,2.4vw,1.6rem)] font-light text-ink"
            >
              {threshold.outcome}
            </m.p>
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: held ? 0 : 1 }}
              transition={{ duration: 0.9, delay: held ? 0 : 1.6 }}
              aria-hidden
              className="mt-8 font-mono text-[0.625rem] tracking-[0.14em] text-ink-faint"
            >
              {threshold.hold}
            </m.p>
            <m.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: 2.6 }}
              className="mt-[var(--pause-s)] max-w-[34rem] text-center font-serif text-[clamp(1.1rem,2vw,1.35rem)] font-light italic text-ink-dim"
            >
              {threshold.takeaway}
            </m.p>
          </>
        )}
      </div>
    </section>
  );
}
