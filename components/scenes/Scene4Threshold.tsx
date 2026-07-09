"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { m, useInView, useReducedMotion } from "motion/react";
import { threshold } from "@/content/scenes";

type Phase = "waiting" | "working" | "settled";

/**
 * Scene 4 — The Invisible Threshold.
 *
 * The visitor expresses one intent — or merely accepts it; even the
 * asking has been absorbed. Six systems wake around the space where
 * the answer will stand, thread their dependencies, and send their
 * conclusions into a single sentence. Then the whole apparatus dims
 * to near-nothing. The one interaction left is transparency itself:
 * hold, and the hidden structure illuminates. Release, and it recedes.
 */
export default function Scene4Threshold() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.55 });
  const reduced = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("waiting");
  const [awake, setAwake] = useState(0);
  const [held, setHeld] = useState(false);

  const accept = useCallback(() => {
    setPhase((p) => (p === "waiting" ? "working" : p));
  }, []);

  // The systems wake in sequence, fast and dim.
  useEffect(() => {
    if (phase !== "working") return;
    if (awake >= threshold.nodes.length) {
      const t = setTimeout(() => setPhase("settled"), reduced ? 200 : 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setAwake((n) => n + 1), reduced ? 60 : 260);
    return () => clearTimeout(t);
  }, [phase, awake, reduced]);

  // Holding is the one gesture. Luminance-only — the Illuminate verb.
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

  const settled = phase === "settled";
  const stageOpacity =
    phase === "waiting" ? 0 : settled ? (held ? 0.95 : 0.16) : 0.65;

  const nodeIndex = (label: string) => threshold.nodes.findIndex((n) => n.label === label);

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

      {/* What screen readers get: the coordination, as sentences. */}
      <ul className="sr-only" aria-hidden={phase === "waiting"}>
        {threshold.systems.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      {/* ——— The choreography stage ——— */}
      <div className="relative mt-10 h-[19rem] w-full max-w-[30rem]">
        {phase !== "waiting" && (
          <m.div
            {...holdHandlers}
            role="button"
            tabIndex={0}
            aria-label="Hold to reveal the systems that did the work"
            animate={{ opacity: stageOpacity }}
            transition={{ duration: reduced ? 0 : 0.6, ease: "easeOut" }}
            className="absolute inset-0 cursor-pointer touch-none select-none outline-offset-8"
          >
            {/* Dependency threads */}
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
            >
              {threshold.edges.map(([from, to]) => {
                const a = threshold.nodes[nodeIndex(from)];
                const b = threshold.nodes[nodeIndex(to)];
                const drawn = awake > Math.max(nodeIndex(from), nodeIndex(to));
                return (
                  <m.line
                    key={`${from}-${to}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="var(--line)"
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: drawn ? 1 : 0 }}
                    transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                );
              })}
            </svg>

            {/* System nodes and their conclusions */}
            {threshold.nodes.map((node, i) => (
              <div key={node.label}>
                <m.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: awake > i ? 1 : 0 }}
                  transition={{ duration: reduced ? 0 : 0.4 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[0.5625rem] tracking-[0.18em] text-ink-dim"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  {node.label}
                </m.span>
                {/* The conclusion travels into the sentence. */}
                <m.span
                  initial={{ opacity: 0, left: `${node.x}%`, top: `${node.y + 7}%` }}
                  animate={
                    settled
                      ? {
                          opacity: [0.9, 0.9, 0],
                          left: "50%",
                          top: "47%",
                        }
                      : { opacity: awake > i ? 0.9 : 0 }
                  }
                  transition={
                    settled
                      ? {
                          duration: reduced ? 0 : 0.9,
                          delay: reduced ? 0 : i * 0.1,
                          ease: [0.22, 1, 0.36, 1],
                        }
                      : { duration: reduced ? 0 : 0.4 }
                  }
                  className="absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[0.625rem] tracking-[0.1em] text-ink"
                  style={{ left: `${node.x}%`, top: `${node.y + 7}%` }}
                >
                  {node.conclusion}
                </m.span>
              </div>
            ))}
          </m.div>
        )}

        {/* The sentence the systems assembled — the only thing you see. */}
        {settled && (
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8, ease: "easeOut", delay: reduced ? 0 : 0.8 }}
            aria-live="polite"
            className="pointer-events-none absolute left-1/2 top-[47%] w-full -translate-x-1/2 -translate-y-1/2 text-center font-serif text-[clamp(1.2rem,2.4vw,1.6rem)] font-light text-ink"
          >
            {threshold.outcome}
          </m.p>
        )}
      </div>

      {settled && (
        <>
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: held ? 0 : 1 }}
            transition={{ duration: 0.9, delay: held ? 0 : 1.6 }}
            aria-hidden
            className="mt-4 font-mono text-[0.625rem] tracking-[0.14em] text-ink-faint"
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
    </section>
  );
}
