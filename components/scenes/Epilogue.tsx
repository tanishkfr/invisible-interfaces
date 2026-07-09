"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { epilogue } from "@/content/scenes";

/**
 * Epilogue — the structural rhyme with 00:00.
 *
 * The canvas returns to the void it opened with. One statement, in two
 * breaths, then nothing. No CTA, no replay, no byline. The page simply
 * ends, and the visitor performs the most invisible interface action
 * there is: closing a tab.
 */
export default function Epilogue() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Function-based on purpose — see Scene 2: keeps these JS-driven.
  const progress = useTransform(scrollYProgress, (v) => v);
  const background = useTransform(progress, [0, 0.22], ["#0a0a0b", "#000000"]);
  const line1Opacity = useTransform(progress, [0.18, 0.32, 0.7, 0.8], [0, 1, 1, 0]);
  const line2Opacity = useTransform(progress, [0.36, 0.5, 0.7, 0.8], [0, 1, 1, 0]);
  // The machine's only address to the visitor's future — then void.
  const turnOpacity = useTransform(progress, [0.85, 0.91, 0.965, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} data-scene={6} aria-label="Epilogue" className="relative h-[260vh]">
      <m.div
        style={{ background }}
        className="sticky top-0 flex h-screen items-center justify-center px-6"
      >
        <h2 className="max-w-[44rem] text-center font-serif text-[clamp(1.6rem,4.5vw,2.6rem)] font-light leading-[1.3] tracking-[-0.01em]">
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
