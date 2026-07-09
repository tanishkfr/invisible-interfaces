"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  m,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Fragment from "@/components/artifacts/Fragments";
import { fragments, opening, type FragmentSpec } from "@/content/scenes";

type Phase = "void" | "line1" | "gap" | "line2" | "field";

/** Storyboard timeline, in ms from arrival. */
const TIMELINE: Array<[number, Phase]> = [
  [3000, "line1"],
  [8000, "gap"],
  [10000, "line2"],
  [15000, "field"],
];

/**
 * Scene 0 — The Forgotten Interfaces.
 *
 * Black void, two sentences, then the periphery fills with the
 * interfaces the visitor used today and forgot. Scrolling makes the
 * field acknowledge them — rearrange, recede — and carries them out
 * of the void into the exhibition.
 */
export default function Scene0Forgotten() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("void");
  const [shown, setShown] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Function-based on purpose — see Scene 2: prevents Framer from
  // promoting downstream transforms to WAAPI ViewTimeline animations
  // whose range differs from these offsets.
  const progress = useTransform(scrollYProgress, (v) => v);

  // The storyboard clock starts when the visitor can actually see the
  // void — not at document load. A tab opened in the background waits.
  const [witnessed, setWitnessed] = useState(false);
  useEffect(() => {
    if (!document.hidden) {
      setWitnessed(true);
      return;
    }
    const onVisible = () => {
      if (!document.hidden) setWitnessed(true);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  // Reduced motion compresses the timeline; the sequence (and the idea)
  // survive, the waiting doesn't.
  useEffect(() => {
    if (!witnessed) return;
    const scale = reduced ? 0.15 : 1;
    const timers = TIMELINE.map(([ms, p]) =>
      setTimeout(() => setPhase(p), ms * scale),
    );
    return () => timers.forEach(clearTimeout);
  }, [reduced, witnessed]);

  // One fragment per second — the cadence of a day's interruptions.
  useEffect(() => {
    if (phase !== "field" || shown >= fragments.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), reduced ? 100 : 1000);
    return () => clearTimeout(t);
  }, [phase, shown, reduced]);

  useEffect(() => progress.on("change", (v) => {
    if (v > 0.01) setHasScrolled(true);
  }), [scrollYProgress]);

  // The void releases into the working dark as the visitor leaves.
  const background = useTransform(progress, [0.45, 0.85], ["#000000", "#0a0a0b"]);
  // The statement is the first thing to recede once the visitor moves.
  const statementOpacity = useTransform(progress, [0.06, 0.26], [1, 0]);

  const fieldStarted = phase === "field";

  return (
    <section ref={ref} data-scene={0} aria-label="The Forgotten Interfaces" className="relative h-[220vh]">
      <m.div
        style={{ background }}
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
      >
        {/* The field — periphery */}
        <div aria-hidden className="absolute inset-0 hidden sm:block">
          {fragments.map((spec, i) => (
            <FieldItem
              key={spec.kind}
              spec={spec}
              index={i}
              visible={i < shown}
              progress={progress}
              reduced={!!reduced}
            />
          ))}
        </div>

        {/* The measure — where the human voice speaks */}
        <m.div
          style={{ opacity: statementOpacity }}
          className="relative max-w-[44rem] px-6 text-center"
        >
          <AnimatePresence mode="wait">
            {phase === "line1" && (
              <Statement key="line1">{opening.line1}</Statement>
            )}
            {(phase === "line2" || phase === "field") && (
              <Statement key="line2">
                {opening.line2}
                {/* The one amber in this room: the machine, waiting. */}
                <span
                  aria-hidden
                  className="cursor-blink ml-3 inline-block h-[0.85em] w-[0.45em] translate-y-[0.12em] bg-accent"
                />
              </Statement>
            )}
          </AnimatePresence>
        </m.div>

        {/* Chrome level 1: the scroll affordance is spoken, not symbolized. */}
        <m.p
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{
            opacity: fieldStarted && shown >= fragments.length && !hasScrolled ? 1 : 0,
          }}
          transition={{ duration: 0.9 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[0.6875rem] tracking-[0.02em] text-ink-faint"
        >
          {opening.scrollCue}
        </m.p>

        {/* On phones the field lives beneath the statement, sparser. */}
        <div aria-hidden className="absolute inset-0 sm:hidden">
          {fragments.slice(0, 4).map((spec, i) => (
            <FieldItem
              key={spec.kind}
              spec={{ ...spec, x: 12 + (i % 2) * 42, y: 12 + Math.floor(i / 2) * 62 }}
              index={i}
              visible={i < shown}
              progress={progress}
              reduced={!!reduced}
            />
          ))}
        </div>
      </m.div>
    </section>
  );
}

function Statement({ children }: { children: React.ReactNode }) {
  return (
    <m.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1.8, ease: "easeOut" } }}
      exit={{ opacity: 0, transition: { duration: 0.9, ease: "easeIn" } }}
      className="font-serif text-[clamp(1.6rem,4.5vw,2.6rem)] font-light leading-[1.3] tracking-[-0.01em] text-ink"
    >
      {children}
    </m.p>
  );
}

interface FieldItemProps {
  spec: FragmentSpec;
  index: number;
  visible: boolean;
  progress: MotionValue<number>;
  reduced: boolean;
}

/** One artifact on the field: appears, breathes, then recedes on scroll. */
function FieldItem({ spec, index, visible, progress, reduced }: FieldItemProps) {
  const x = useTransform(progress, [0.06, 0.42], [0, reduced ? 0 : spec.vx]);
  const y = useTransform(progress, [0.06, 0.42], [0, reduced ? 0 : spec.vy]);
  const opacity = useTransform(progress, [0.16, 0.38], [1, 0]);

  return (
    <m.div
      style={{ left: `${spec.x}%`, top: `${spec.y}%`, x, y, opacity }}
      className="absolute"
    >
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: reduced ? 0.4 : 0.9, ease: "easeOut" }}
      >
        <m.div
          animate={
            reduced
              ? undefined
              : { y: [0, -4, 0], transition: { duration: 7 + index * 0.9, repeat: Infinity, ease: "easeInOut" } }
          }
        >
          <Fragment kind={spec.kind} />
        </m.div>
      </m.div>
    </m.div>
  );
}
