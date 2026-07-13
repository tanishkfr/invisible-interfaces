"use client";

import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import Photo from "@/components/artifacts/Photo";
import { attention, clockOf, type AttentionSnapshot } from "@/lib/attention";

type Phase = "waiting" | "entrusted" | "complete";

const work = [
  {
    system: "ARCHIVE INDEX",
    action: "Located the beach scan from its date, place, and file lineage.",
    limit: "Read the local archive index; opened no unrelated folder.",
  },
  {
    system: "MEDIA REPAIR",
    action: "Removed dust and repaired one damaged edge without inventing new content.",
    limit: "Preserved the frame, colour cast, people, and original scan.",
  },
  {
    system: "PROVENANCE",
    action: "Compared the restored copy against the source and recorded each intervention.",
    limit: "Labeled repair as repair; made no claim about the memory.",
  },
  {
    system: "PRIVATE ALBUM",
    action: "Staged a reversible copy beside the untouched original.",
    limit: "Nothing overwritten. Nothing published. Nothing shared.",
  },
];

const STEP_MS = 2000;
const FALLBACK_DELAY_MS = 12000;

export default function EntrustedTask({ onComplete }: { onComplete?: () => void }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("waiting");
  const [completed, setCompleted] = useState(0);
  const [awayMs, setAwayMs] = useState(0);
  const [returns, setReturns] = useState(0);
  const [released, setReleased] = useState(false);
  const [fallbackAvailable, setFallbackAvailable] = useState(false);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [visibilitySupported, setVisibilitySupported] = useState(true);
  const [attentionReceipt, setAttentionReceipt] = useState<AttentionSnapshot | null>(null);
  const phaseRef = useRef<Phase>("waiting");
  const hiddenAt = useRef<number | null>(null);
  const awayTotal = useRef(0);
  const completionNotified = useRef(false);

  useEffect(() => {
    setVisibilitySupported(
      typeof document.hidden === "boolean" &&
        typeof document.addEventListener === "function",
    );
  }, []);

  function notifyCompletion() {
    if (completionNotified.current) return;
    completionNotified.current = true;
    setAttentionReceipt(attention.snapshot());
    onComplete?.();
  }

  function finishTask(usedFallback = false) {
    phaseRef.current = "complete";
    setCompleted(work.length);
    setPhase("complete");
    setFallbackUsed(usedFallback);
    if (usedFallback) {
      awayTotal.current = STEP_MS * work.length;
      setAwayMs(awayTotal.current);
    }
    notifyCompletion();
  }

  function entrust() {
    phaseRef.current = "entrusted";
    setPhase("entrusted");
  }

  useEffect(() => {
    if (phase !== "entrusted") {
      setFallbackAvailable(false);
      return;
    }
    const timer = setTimeout(() => setFallbackAvailable(true), FALLBACK_DELAY_MS);
    return () => clearTimeout(timer);
  }, [phase]);

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
      const nextCompleted = Math.min(
        work.length,
        Math.floor(awayTotal.current / STEP_MS),
      );
      setAwayMs(awayTotal.current);
      setCompleted(nextCompleted);
      setReturns((count) => count + 1);

      if (nextCompleted === work.length) finishTask();
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.title = "Invisible Interfaces";
    };
  });

  const secondsAway = Math.max(1, Math.round(awayMs / 1000));

  return (
    <section
      data-scene={4}
      aria-label="The Entrusted Task"
      className="relative flex min-h-[200svh] flex-col items-center bg-void px-5 sm:px-6"
    >
      <div className="sticky top-0 flex min-h-svh w-full max-w-[62rem] flex-col justify-center py-20">
        <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-accent">
          THE ENTRUSTED TASK
        </p>
        <h2 className="mt-5 max-w-[50rem] text-balance font-serif text-[clamp(2.25rem,5vw,4.75rem)] font-light leading-[1.06] tracking-[-0.02em] text-ink">
          This task will not run while you watch it.
        </h2>
        <p className="mt-7 max-w-[40rem] text-pretty font-serif text-[clamp(1.1rem,2vw,1.4rem)] font-light leading-relaxed text-ink-dim">
          Find the photograph from the beach, three years ago. Repair the damaged
          scan. Keep the original.
        </p>

        {phase === "waiting" && (
          <m.div
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : 0.3 }}
            className="mt-12 border-t border-line pt-8"
          >
            <p className="max-w-[38rem] font-mono text-[0.75rem] leading-relaxed tracking-[0.04em] text-ink-dim">
              The system can locate, repair, compare, and stage a private copy.
              It cannot begin until your attention leaves this tab. Return whenever
              you choose; returning early pauses what remains.
            </p>
            <button
              type="button"
              onClick={entrust}
              className="mt-7 min-h-11 border border-accent px-5 py-3 font-mono text-[0.75rem] tracking-[0.14em] text-accent transition-colors duration-500 hover:bg-accent hover:text-void"
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
              <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-accent">
                ATTENTION DETECTED · WORK PAUSED
              </p>
              <p className="mt-4 max-w-[26rem] font-serif text-xl font-light leading-relaxed text-ink">
                Leave this tab. The background begins where your attention ends.
              </p>
              {returns > 0 && (
                <p className="mt-5 font-mono text-[0.6875rem] leading-relaxed tracking-[0.06em] text-ink-dim">
                  RETURN {String(returns).padStart(2, "0")} · {completed}/{work.length}
                  {" "}MOVEMENTS COMPLETE · {secondsAway}S ENTRUSTED
                </p>
              )}
              {(!visibilitySupported || fallbackAvailable) && (
                <div className="mt-8 border-l border-line pl-4">
                  <p className="max-w-[28rem] font-mono text-[0.6875rem] leading-relaxed text-ink-dim">
                    If this browser cannot report tab visibility, use the disclosed
                    demonstration path. The receipt will label it clearly.
                  </p>
                  <button
                    type="button"
                    onClick={() => finishTask(true)}
                    className="mt-4 font-mono text-[0.6875rem] tracking-[0.1em] text-ink underline decoration-line underline-offset-4"
                  >
                    USE ACCESSIBLE DEMONSTRATION
                  </button>
                </div>
              )}
            </div>
            <WorkLedger completed={completed} />
          </m.div>
        )}

        {phase === "complete" && (
          <m.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 1 }}
            className="mt-10"
            aria-live="polite"
          >
            <div className="border-y border-line py-8">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-accent">
                  RETURN RECEIPT · {secondsAway}S OUT OF VIEW
                </p>
                <p className="font-mono text-[0.6875rem] tracking-[0.1em] text-ink-dim">
                  {fallbackUsed
                    ? "DEMONSTRATION MODE · NO VISIBILITY SIGNAL"
                    : "NOT TRANSMITTED · THIS TAB ONLY"}
                </p>
              </div>
              <p
                className={
                  "mt-6 max-w-[48rem] text-balance font-serif text-[clamp(1.9rem,4vw,3.6rem)] font-light leading-tight " +
                  (released ? "text-ink-dim line-through" : "text-ink")
                }
              >
                The beach photograph is restored. The original remains untouched.
                A private copy is waiting.
              </p>
            </div>

            <RestoredComparison discarded={released} />

            <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
              <WorkLedger completed={work.length} detailed />
              <aside className="border-l border-line pl-6">
                <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-dim">
                  AUTHORITY BOUNDARY
                </p>
                <p className="mt-4 font-serif text-lg font-light leading-relaxed text-ink-dim">
                  The task could narrow a search, repair pixels, compare copies,
                  and stage a result. It could not identify people, infer what the
                  memory meant, overwrite the source, publish, or share.
                </p>
                <button
                  type="button"
                  onClick={() => setReleased(true)}
                  disabled={released}
                  className="mt-6 min-h-11 font-mono text-[0.6875rem] tracking-[0.1em] text-ink-dim underline decoration-line underline-offset-4 transition-colors hover:text-ink disabled:cursor-default disabled:no-underline"
                >
                  {released ? "RESTORED COPY DISCARDED" : "DISCARD THE RESTORED COPY"}
                </button>
              </aside>
            </div>

            {attentionReceipt && <AttentionReceipt snapshot={attentionReceipt} />}

            <m.p
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduced ? 0 : 1.4, delay: reduced ? 0 : 0.8 }}
              className="mt-[14vh] max-w-[42rem] text-balance font-serif text-[clamp(1.5rem,3vw,2.5rem)] font-light italic leading-snug text-ink"
            >
              The final interface appeared because you left it.
            </m.p>
            <p className="mt-5 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-dim">
              INVISIBLE STILL MEANS DESIGNED.
            </p>
          </m.div>
        )}
      </div>
    </section>
  );
}

function RestoredComparison({ discarded }: { discarded: boolean }) {
  const [comparison, setComparison] = useState(58);

  return (
    <figure className="mt-10" aria-label="Before and after restoration comparison">
      <div
        className={
          "relative aspect-[400/270] w-full max-w-[48rem] overflow-hidden rounded-[var(--r-2)] border border-line bg-surface " +
          (discarded ? "opacity-35" : "")
        }
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="h-full w-full [filter:sepia(.28)_saturate(.55)_contrast(.86)_brightness(.82)]">
            <Photo era="full" />
          </div>
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(circle at 24% 34%, rgba(10,10,11,.9) 0 1px, transparent 2px), radial-gradient(circle at 70% 62%, rgba(232,230,227,.42) 0 1px, transparent 2px), linear-gradient(92deg, transparent 0 82%, rgba(232,230,227,.22) 82.2%, transparent 82.6%)",
            }}
          />
        </div>
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: "inset(0 " + (100 - comparison) + "% 0 0)" }}
        >
          <Photo era="full" />
        </div>
        <div
          aria-hidden
          className="absolute inset-y-0 w-px bg-ink"
          style={{ left: comparison + "%" }}
        />
        <div className="absolute left-3 top-3 rounded-[2px] bg-void/80 px-2 py-1 font-mono text-[0.6875rem] tracking-[0.1em] text-ink">
          RESTORED
        </div>
        <div className="absolute right-3 top-3 rounded-[2px] bg-void/80 px-2 py-1 font-mono text-[0.6875rem] tracking-[0.1em] text-ink">
          ORIGINAL
        </div>
      </div>
      <label className="mt-4 block max-w-[48rem] font-mono text-[0.6875rem] tracking-[0.1em] text-ink-dim">
        COMPARE THE RESTORATION
        <input
          type="range"
          min="10"
          max="90"
          value={comparison}
          disabled={discarded}
          onChange={(event) => setComparison(Number(event.target.value))}
          className="mt-3 block h-8 w-full cursor-ew-resize accent-[var(--accent)] disabled:cursor-default"
          aria-label="Reveal restored image compared with the original scan"
        />
      </label>
      <figcaption className="mt-2 max-w-[48rem] font-serif text-base leading-relaxed text-ink-dim">
        Dust and one damaged edge were repaired. Framing, colour cast, subjects,
        and the source scan were preserved.
      </figcaption>
    </figure>
  );
}

function AttentionReceipt({ snapshot }: { snapshot: AttentionSnapshot }) {
  const terminalLine = snapshot.solved
    ? String(snapshot.commands) + " commands · " + String(snapshot.seconds ?? "—") + " seconds"
    : snapshot.abandoned
      ? "passed unresolved"
      : "not entered";

  return (
    <aside className="mt-12 max-w-[48rem] border-t border-line pt-8">
      <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-dim">
        YOUR ATTENTION RECEIPT
      </p>
      <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        <ReceiptDatum label="OPENING" value={snapshot.voidWaitMs === null ? "not measured" : clockOf(snapshot.voidWaitMs)} />
        <ReceiptDatum label="TERMINAL" value={terminalLine} />
        <ReceiptDatum label="COMPARISONS" value={String(snapshot.scrubBacks) + " reverse scrubs"} />
        <ReceiptDatum label="NAVIGATION" value={String(snapshot.menuClicks) + " scene-menu uses"} />
        <ReceiptDatum label="TIME HERE" value={clockOf(snapshot.totalMs)} />
        <ReceiptDatum label="RETENTION" value="this tab, until it closes" />
      </dl>
      <p className="mt-5 font-mono text-[0.6875rem] leading-relaxed text-ink-dim">
        These measurements never left your browser. Closing this tab deletes them.
      </p>
    </aside>
  );
}

function ReceiptDatum({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[0.6875rem] tracking-[0.12em] text-ink-dim">{label}</dt>
      <dd className="mt-1 font-serif text-lg text-ink">{value}</dd>
    </div>
  );
}

function WorkLedger({ completed, detailed = false }: { completed: number; detailed?: boolean }) {
  return (
    <section aria-labelledby={detailed ? "work-receipt-heading" : undefined}>
      {detailed && (
        <p id="work-receipt-heading" className="mb-5 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-dim">
          WORK RECEIPT
        </p>
      )}
      <ol className="space-y-5" aria-label="Entrusted work receipt">
        {work.map((item, index) => {
          const done = index < completed;
          return (
            <li key={item.system} className="grid grid-cols-[2.2rem_1fr] gap-3">
              <span className="font-mono text-[0.6875rem] tracking-[0.08em] text-ink-dim">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-ink-dim">
                    {item.system}
                  </p>
                  <p className="font-mono text-[0.625rem] tracking-[0.08em] text-ink-dim">
                    {done ? "COMPLETED WHILE ABSENT" : "WAITING"}
                  </p>
                </div>
                <p className={"mt-1 font-serif text-base font-light leading-relaxed " + (done ? "text-ink" : "text-ink-dim")}>
                  {item.action}
                </p>
                {detailed && (
                  <p className="mt-1 font-mono text-[0.6875rem] leading-relaxed tracking-[0.02em] text-ink-dim">
                    LIMIT / {item.limit}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}