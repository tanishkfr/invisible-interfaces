"use client";

import { useState } from "react";
import {
  m,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { sceneTitles } from "@/content/scenes";
import { attention } from "@/lib/attention";

interface HeaderProps {
  /** Whole-journey scroll progress (function-piped — see Scene 2). */
  progress: MotionValue<number>;
}

/**
 * The explicit interface the piece opens with — and spends the rest of
 * the journey dismantling. A wordmark, a working scene menu, a
 * progress line, a border: real chrome, really used. Its parts decay
 * at staggered depths, each step sub-threshold, so the visitor
 * discovers the absence rather than watching the departure:
 *
 *   border → gone during the simplification (scene 2)
 *   wordmark → gone as software starts remembering (scene 3)
 *   menu → gone by the threshold (scene 4)
 *   progress line → gone entering the background (scene 5)
 *
 * Fades in with the first statement — the void is never dressed.
 * Accessibility: heading/landmark structure never decays; interactive
 * elements leave the tab order only once fully invisible.
 */
export default function Header({ progress }: HeaderProps) {
  const reduced = useReducedMotion();

  const borderO = useTransform(progress, [0.1, 0.2], [1, 0]);
  const wordmarkO = useTransform(progress, [0.28, 0.38], [1, 0]);
  const menuO = useTransform(progress, [0.44, 0.56], [1, 0]);
  const lineO = useTransform(progress, [0.58, 0.7], [1, 0]);
  const lineScale = useTransform(progress, (v) => Math.max(0.001, Math.min(1, v)));

  // Invisible controls leave the tab order — but never the tree.
  const [menuInert, setMenuInert] = useState(false);
  useMotionValueEvent(menuO, "change", (v) => setMenuInert(v < 0.05));

  const goTo = (index: number) => {
    attention.markMenuClick();
    document
      .querySelector(`[data-scene="${index}"]`)
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <m.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-20"
    >
      <div className="flex h-12 items-center justify-between px-5">
        <m.p
          style={{ opacity: wordmarkO }}
          className="font-mono text-[0.625rem] tracking-[0.3em] text-ink-dim"
        >
          INVISIBLE INTERFACES
        </m.p>

        <m.nav
          aria-label="Scenes"
          style={{ opacity: menuO }}
          className={menuInert ? "pointer-events-none" : ""}
        >
          <ul className="flex gap-4">
            {sceneTitles.map((title, i) => (
              <li key={title}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  tabIndex={menuInert ? -1 : 0}
                  aria-label={`Scene ${i}: ${title}`}
                  className="cursor-pointer font-mono text-[0.625rem] tracking-[0.14em] text-ink-faint transition-colors duration-500 hover:text-ink-dim"
                >
                  {String(i).padStart(2, "0")}
                </button>
              </li>
            ))}
          </ul>
        </m.nav>
      </div>

      {/* The border: the first thing to go. */}
      <m.div aria-hidden style={{ opacity: borderO }} className="h-px bg-line" />
      {/* The progress line: the last. */}
      <m.div
        aria-hidden
        style={{ opacity: lineO, scaleX: lineScale }}
        className="-mt-px h-px origin-left bg-ink-faint"
      />
    </m.header>
  );
}
