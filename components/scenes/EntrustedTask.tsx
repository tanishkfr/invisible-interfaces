"use client";

import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "motion/react";

type Phase = "waiting" | "entrusted" | "complete";

const work = [
  {
    system: "ARCHIVE INDEX",
    action: "Located the beach scan from its date, place, and file lineage.",
    limit: "Read the local archive index; opened no unrelated folder.",
  },
  {
    system: "MEDIA REPAIR",
    action: "Repaired dust and one damaged edge without inventing missing subjects.",
    limit: "Preserved the frame, colour cast, and original scan.",
  },
  {
    system: "PROVENANCE",
    action: "Compared the restored copy against the source and recorded every change.",
    limit: "Labeled repair as repair; made no claim about the memory.",
  },
  {
    system: "PRIVATE ALBUM",
    action: "Staged a reversible copy beside the untouched original.",
    limit: "Nothing overwritten. Nothing shared.",
  },
];

const STEP_MS = 900;

/**
 * The final room. Its interaction only becomes possible when the visitor
 * withdraws attention. The return is the reveal: outcome and receipt arrive
 * together, including what the system refused to infer or do.
 */
export default function EntrustedTask() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("waiting");
  const [completed, setCompleted] = useState(0);
  const [awayMs, setAwayMs] = useState(0);
  const [returns, setReturns] = useState(0);
  const [released, setReleased] = useState(false);
  const phaseRef = useRef<Phase>("waiting");
  const hiddenAt = useRef<number | null>(null);
  const awayTotal = useRef(0);

  function entrust() {
    phaseRef.current = "entrusted";
    setPhase("entrusted");
  }

  useEffect(() => {
    const onVisibility = () => {
      if (phaseRef.current !== "entrusted") return;

      if (document.hidden) {
        hiddenAt.current = performance.now();
        document.title = "WORKING WITHOUT YOU.";
        return;
      }

      document.title = "Invisible Interfaces";
      if (hiddenAt.current === null) return;

      const interval = Math.max(0, performance.now() - hiddenAt.current);
      hiddenAt.current = null;
      awayTotal.current += interval;
      const nextCompleted = Math.min(work.length, Math.floor(awayTotal.current / STEP_MS));
      setAwayMs(awayTotal.current);
      setCompleted(nextCompleted);
      setReturns((count) => count + 1);

      if (nextCompleted === work.length) {
        phaseRef.current = "complete";
        setPhase("complete");
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.title = "Invisible Interfaces";
    };
  }, []);

  const secondsAway = Math.max(1, Math.round(awayMs / 1000));

  return (
    <section
      data-scene={4}
      aria-label="The Entrusted Task"
      className="relative flex min-h-[190svh] flex-col items-center bg-void px-6"
    >
      <div className="sticky top-0 flex min-h-svh w-full max-w-[58rem] flex-col justify-center py-20">
        <p className="font-mono text-[0.625rem] tracking-[0.2em] text-accent">THE ENTRUSTED TASK</p>
        <h2 className="mt-5 max-w-[48rem] text-balance font-serif text-[clamp(2rem,5vw,4.5rem)] font-light leading-[1.08] tracking-[-0.02em] text-ink">
          This task will not run while you watch it.
        </h2>
        <p className="mt-7 max-w-[38rem] text-pretty font-serif text-[clamp(1.05rem,2vw,1.35rem)] font-light leading-relaxed text-ink-dim">
          Find the photograph from the beach, three years ago. Repair the damaged scan. Keep the original.
        </p>

        {phase === "waiting" && (
          <m.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="mt-12 border-t border-line pt-8"
          >
            <p className="max-w-[34rem] font-mono text-[0.6875rem] leading-relaxed tracking-[0.06em] text-ink-faint">
              The system can locate, repair, compare, and stage a private copy. It cannot begin until your attention leaves this tab. Return whenever you choose.
            </p>
            <button
              type="button"
              onClick={entrust}
              className="mt-7 border border-accent px-5 py-3 font-mono text-[0.6875rem] tracking-[0.16em] text-accent transition-colors duration-500 hover:bg-accent hover:text-void"
            >
              ENTRUST THIS TASK ↗
            </button>
          </m.div>
        )}

        {phase === "entrusted" && (
          <m.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 grid gap-9 border-t border-line pt-8 sm:grid-cols-[1fr_1.2fr]"
          >
            <div>
              <p className="font-mono text-[0.625rem] tracking-[0.18em] text-accent">
                ATTENTION DETECTED · WORK PAUSED
              </p>
              <p className="mt-4 max-w-[24rem] font-serif text-xl font-light leading-relaxed text-ink">
                Leave this tab. The background begins where your attention ends.
              </p>
              {returns > 0 && (
                <p className="mt-5 font-mono text-[0.625rem] leading-relaxed tracking-[0.08em] text-ink-faint">
                  RETURN {String(returns).padStart(2, "0")} · {completed}/{work.length} MOVEMENTS COMPLETE · {secondsAway}S ENTRUSTED
                </p>
              )}
            </div>
            <WorkLedger completed={completed} />
          </m.div>
        )}

        {phase === "complete" && (
          <m.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4 }}
            className="mt-10"
            aria-live="polite"
          >
            <div className="border-y border-line py-8">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <p className="font-mono text-[0.625rem] tracking-[0.18em] text-accent">RETURN RECEIPT · {secondsAway}S OUT OF VIEW</p>
                <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-faint">NOT TRANSMITTED · THIS TAB ONLY</p>
              </div>
              <p className={`mt-6 max-w-[44rem] text-balance font-serif text-[clamp(1.8rem,4vw,3.4rem)] font-light leading-tight ${released ? "text-ink-dim line-through" : "text-ink"}`}>
                The beach photograph is restored. The original remains untouched. A private copy is waiting.
              </p>
              {released && (
                <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 font-mono text-[0.6875rem] tracking-[0.12em] text-accent">
                  HOLD RELEASED · NOTHING BOOKED
                </m.p>
              )}
            </div>

            <div className="mt-8 grid gap-9 lg:grid-cols-[1.15fr_.85fr]">
              <WorkLedger completed={work.length} detailed />
              <aside className="border-l border-line pl-6">
                <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint">AUTHORITY BOUNDARY</p>
                <p className="mt-4 font-serif text-lg font-light leading-relaxed text-ink-dim">
                  The task could narrow, compare, and hold. It could not pay, invite, or convert “quiet” into a guess about who you are.
                </p>
                <button
                  type="button"
                  onClick={() => setReleased(true)}
                  disabled={released}
                  className="mt-6 font-mono text-[0.625rem] tracking-[0.14em] text-ink-faint underline decoration-line underline-offset-4 transition-colors hover:text-ink disabled:cursor-default disabled:no-underline"
                >
                  {released ? "THE DECISION IS YOURS AGAIN" : "DISCARD THE RESTORED COPY"}
                </button>
              </aside>
            </div>

            <m.p
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.8, delay: 1.2 }}
              className="mt-[14vh] max-w-[40rem] text-balance font-serif text-[clamp(1.4rem,3vw,2.3rem)] font-light italic leading-snug text-ink"
            >
              The final interface appeared because you left it.
            </m.p>
            <p className="mt-5 font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint">
              INVISIBLE STILL MEANS DESIGNED.
            </p>
          </m.div>
        )}
      </div>
    </section>
  );
}

function WorkLedger({ completed, detailed = false }: { completed: number; detailed?: boolean }) {
  return (
    <ol className="space-y-4" aria-label="Entrusted work receipt">
      {work.map((item, index) => {
        const done = index < completed;
        return (
          <li key={item.system} className={`grid grid-cols-[2.2rem_1fr] gap-3 ${done ? "opacity-100" : "opacity-25"}`}>
            <span className="font-mono text-[0.625rem] tracking-[0.1em] text-ink-faint">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-dim">{item.system}</p>
                <p className="font-mono text-[0.5625rem] tracking-[0.12em] text-ink-faint">{done ? "COMPLETED WHILE ABSENT" : "WAITING"}</p>
              </div>
              <p className="mt-1 font-serif text-base font-light leading-relaxed text-ink">{item.action}</p>
              {detailed && <p className="mt-1 font-mono text-[0.625rem] leading-relaxed tracking-[0.03em] text-ink-faint">LIMIT · {item.limit}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
