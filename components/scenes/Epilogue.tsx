"use client";

import { useRef, useState } from "react";
import { m, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { epilogue } from "@/content/scenes";
import { attention, type AttentionSnapshot } from "@/lib/attention";
import Reveal from "@/components/scenes/Reveal";

/**
 * The ending, in two movements.
 *
 * First the essay reads your own attention back to you (the reveal) —
 * everything it measured, ending on a claim and the truth that none of
 * it left your browser. Then, only then, the closing statement: the
 * structural rhyme with 00:00, landing now with the weight of having
 * just been demonstrated on you. Then nothing.
 */
export default function Epilogue() {
  const ref = useRef<HTMLElement>(null);
  const [snap, setSnap] = useState<AttentionSnapshot | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Function-based on purpose — see Scene 2: keeps these JS-driven.
  const progress = useTransform(scrollYProgress, (v) => v);

  // Freeze the trace once, as the visitor enters the ending — by now
  // every signal is in. It never changes after; the hour is over.
  useMotionValueEvent(progress, "change", (v) => {
    if (v > 0.005 && !snap) setSnap(attention.snapshot());
  });
  const background = useTransform(progress, [0, 0.08], ["#0a0a0b", "#000000"]);
  const line1Opacity = useTransform(progress, [0.66, 0.73, 0.9, 0.95], [0, 1, 1, 0]);
  const line2Opacity = useTransform(progress, [0.75, 0.82, 0.9, 0.95], [0, 1, 1, 0]);
  // The machine's only address to the visitor's future — then void.
  const turnOpacity = useTransform(progress, [0.96, 0.98, 1, 1], [0, 1, 1, 1]);

  return (
    <section ref={ref} data-scene={6} aria-label="Epilogue" className="relative h-[720vh]">
      <m.div
        style={{ background }}
        className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-6"
      >
        {snap && <Reveal progress={progress} snap={snap} />}

        <h2 className="max-w-[44rem] text-balance text-center font-serif text-[clamp(1.6rem,4.5vw,2.6rem)] font-light leading-[1.3] tracking-[-0.01em]">
          <m.span style={{ opacity: line1Opacity }} className="block text-ink">
            {epilogue.line}
          </m.span>
          <m.span
            style={{ opacity: line2Opacity }}
            className="mt-4 block italic text-ink-dim"
          >
            {epilogue.line2}
          </m.span>
        </h2>

        <m.p
          style={{ opacity: turnOpacity }}
          className="absolute bottom-[22vh] left-0 w-full text-center font-mono text-[0.625rem] tracking-[0.18em] text-ink-faint"
        >
          {epilogue.turn}
        </m.p>
      </m.div>
    </section>
  );
}
