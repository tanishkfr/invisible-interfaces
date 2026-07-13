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
  progress: MotionValue<number>;
}

/**
 * The explicit interface the piece opens with and gradually relinquishes.
 * Its landmark remains available while its visual controls leave the tab
 * order only after they have fully disappeared.
 */
export default function Header({ progress }: HeaderProps) {
  const reduced = useReducedMotion();
  const borderO = useTransform(progress, [0.1, 0.2], [1, 0]);
  const wordmarkO = useTransform(progress, [0.28, 0.38], [1, 0]);
  const menuO = useTransform(progress, [0.44, 0.56], [1, 0]);
  const lineO = useTransform(progress, [0.58, 0.7], [1, 0]);
  const lineScale = useTransform(progress, (value) =>
    Math.max(0.001, Math.min(1, value)),
  );

  const [menuInert, setMenuInert] = useState(false);
  useMotionValueEvent(menuO, "change", (value) => setMenuInert(value < 0.05));

  const goTo = (index: number) => {
    attention.markMenuClick();
    document
      .querySelector('[data-scene="' + index + '"]')
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <m.header
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: reduced ? 0 : 2.5,
        duration: reduced ? 0 : 1.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed inset-x-0 top-0 z-20"
    >
      <div className="flex h-12 items-center justify-between gap-3 px-4 sm:px-5">
        <m.p
          style={{ opacity: wordmarkO }}
          className="shrink-0 font-mono text-[0.625rem] tracking-[0.14em] text-ink-dim sm:text-[0.625rem] sm:tracking-[0.3em]"
        >
          INVISIBLE INTERFACES
        </m.p>

        <m.nav
          aria-label="Essay navigation"
          style={{ opacity: menuO }}
          className={menuInert ? "pointer-events-none" : ""}
        >
          <ul className="flex items-center gap-2 sm:gap-4">
            {sceneTitles.map((title, index) => (
              <li key={title}>
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  tabIndex={menuInert ? -1 : 0}
                  aria-label={"Scene " + index + ": " + title}
                  className="cursor-pointer font-mono text-[0.625rem] tracking-[0.1em] text-ink-faint transition-colors duration-500 hover:text-ink focus-visible:text-ink sm:text-[0.6875rem] sm:tracking-[0.14em]"
                >
                  {String(index).padStart(2, "0")}
                </button>
              </li>
            ))}
            <li>
              <a
                href="/about"
                tabIndex={menuInert ? -1 : 0}
                className="font-mono text-[0.625rem] tracking-[0.08em] text-ink-faint transition-colors duration-500 hover:text-ink focus-visible:text-ink sm:text-[0.625rem]"
              >
                ABOUT
              </a>
            </li>
          </ul>
        </m.nav>
      </div>

      <m.div aria-hidden style={{ opacity: borderO }} className="h-px bg-line" />
      <m.div
        aria-hidden
        style={{ opacity: lineO, scaleX: lineScale }}
        className="-mt-px h-px origin-left bg-ink-faint"
      />
    </m.header>
  );
}