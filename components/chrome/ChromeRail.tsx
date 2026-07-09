"use client";

import { m, useTransform, type MotionValue } from "motion/react";
import { sceneTitles } from "@/content/scenes";

const STOPS = sceneTitles.length + 1; // six scenes + epilogue

interface ChromeRailProps {
  progress: MotionValue<number>;
  activeScene: number;
}

/**
 * The only piece of chrome in the piece — and it exists to disappear.
 *
 * Fully present at the start (interaction is explicit), it decays with
 * journey progress in sub-threshold steps until, by the epilogue, the
 * visitor is alone with the page. Purely visual: document landmarks and
 * headings carry navigation for assistive tech at full strength always.
 */
export default function ChromeRail({ progress, activeScene }: ChromeRailProps) {
  // Absent during the opening void, full once the journey starts,
  // then a long imperceptible decay to nothing.
  const chrome = useTransform(progress, [0, 0.04, 0.1, 0.72, 0.9], [0, 0, 1, 0.14, 0]);

  return (
    <m.div
      aria-hidden
      style={{ opacity: chrome }}
      className="fixed left-5 top-1/2 z-10 hidden -translate-y-1/2 sm:block"
    >
      <div className="flex flex-col gap-4">
        {Array.from({ length: STOPS }, (_, i) => (
          <div
            key={i}
            className="h-px w-2.5 transition-colors duration-500"
            style={{
              background: i === activeScene ? "var(--ink-dim)" : "var(--ink-faint)",
              width: i === activeScene ? "16px" : "10px",
              transitionProperty: "background, width",
            }}
          />
        ))}
      </div>
    </m.div>
  );
}
