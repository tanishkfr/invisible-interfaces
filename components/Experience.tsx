"use client";

import { useEffect, useRef, useState } from "react";
import {
  LazyMotion,
  domAnimation,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import ChromeRail from "@/components/chrome/ChromeRail";
import Header from "@/components/chrome/Header";
import Scene0Forgotten from "@/components/scenes/Scene0Forgotten";
import Scene1Terminal from "@/components/scenes/Scene1Terminal";
import Scene2Simplification from "@/components/scenes/Scene2Simplification";
import Scene3Remembering from "@/components/scenes/Scene3Remembering";
import Scene4Threshold from "@/components/scenes/Scene4Threshold";
import Scene5Background from "@/components/scenes/Scene5Background";
import Epilogue from "@/components/scenes/Epilogue";
import { epilogue } from "@/content/scenes";
import { attention } from "@/lib/attention";

/**
 * The exhibition. One scroll, seven rooms.
 * Chrome (the rail) decays with journey progress — the interface
 * itself is part of the argument.
 */
export default function Experience() {
  const mainRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  // Function-based on purpose — see Scene 2: keeps the rail JS-driven.
  const journey = useTransform(scrollYProgress, (v) => v);
  const [activeScene, setActiveScene] = useState(0);

  // The chrome decays across scenes 0–5, not the ending. The epilogue
  // is deliberately tall (the reveal needs the scroll), which would
  // otherwise push every decay threshold late — so we normalize the
  // journey to reach 1.0 at the epilogue's start. Chrome decay stays
  // calibrated to the scenes regardless of how long the ending runs.
  const epilogueStart = useRef(0.8);
  useEffect(() => {
    const measure = () => {
      const epi = mainRef.current?.querySelector<HTMLElement>('[data-scene="6"]');
      const scrollable = document.body.scrollHeight - innerHeight;
      if (epi && scrollable > 0) {
        epilogueStart.current = Math.min(0.98, epi.offsetTop / scrollable);
      }
    };
    measure();
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, []);
  const chrome = useTransform(journey, (v) =>
    Math.min(1, Math.max(0, v / epilogueStart.current)),
  );

  // The navigation reaches zero opacity at chrome 0.56 (see Header).
  // The instrument marks the wall-clock of that crossing — the moment
  // the way to navigate left — so the ending can say exactly when.
  useMotionValueEvent(chrome, "change", (v) => {
    if (v >= 0.56) attention.markMenuFaded();
  });

  // The first time attention moves, the instrument marks it — patience
  // in the dark is the first thing the essay learns about you.
  useEffect(() => {
    const onFirstMove = () => attention.markFirstScroll();
    addEventListener("wheel", onFirstMove, { once: true, passive: true });
    addEventListener("touchmove", onFirstMove, { once: true, passive: true });
    addEventListener("keydown", onFirstMove, { once: true });
    return () => {
      removeEventListener("wheel", onFirstMove);
      removeEventListener("touchmove", onFirstMove);
      removeEventListener("keydown", onFirstMove);
    };
  }, []);

  // The tab notices your attention leaving — and says what the
  // terminal says. Restored the moment you return.
  useEffect(() => {
    const onVisibility = () => {
      document.title = document.hidden ? "STILL WAITING." : "Invisible Interfaces";
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // For the visitors who open the other terminal.
  useEffect(() => {
    console.log(
      "%cREADY.\n%c> YOU FOUND THE OTHER TERMINAL. IT HAS NO PHOTOGRAPHS.",
      "font-family:monospace;color:#E8A33D",
      "font-family:monospace;color:#918E88",
    );
  }, []);

  // Which room spans the center of the viewport.
  useEffect(() => {
    const sections = mainRef.current?.querySelectorAll<HTMLElement>("[data-scene]");
    if (!sections) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveScene(Number((entry.target as HTMLElement).dataset.scene));
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <main ref={mainRef}>
        <h1 className="sr-only">Invisible Interfaces</h1>

        <Header progress={chrome} />
        <ChromeRail progress={chrome} activeScene={activeScene} />

        <Scene0Forgotten />
        <Scene1Terminal />
        <Scene2Simplification />
        <Scene3Remembering />
        <Scene4Threshold />
        <Scene5Background />
        <Epilogue />

        {/* Past the end of the experience proper: the one door out.
            The essay still ends in nothing; this lives after the nothing. */}
        <div className="flex h-[50vh] items-center justify-center bg-void">
          <a
            href="/about"
            className="font-mono text-[0.625rem] tracking-[0.18em] text-ink-faint opacity-50 transition-opacity duration-500 hover:opacity-100 focus-visible:opacity-100"
          >
            {epilogue.aboutLink}
          </a>
        </div>
      </main>
    </LazyMotion>
  );
}
