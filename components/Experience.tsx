"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { attention } from "@/lib/attention";

const Scene1Terminal = dynamic(() => import("@/components/scenes/Scene1Terminal"));
const Scene2Simplification = dynamic(
  () => import("@/components/scenes/Scene2Simplification"),
);
const Scene3Remembering = dynamic(
  () => import("@/components/scenes/Scene3Remembering"),
);
const EntrustedTask = dynamic(() => import("@/components/scenes/EntrustedTask"));

/**
 * One task travels from demanded attention to entrusted absence.
 */
export default function Experience() {
  const mainRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const journey = useTransform(scrollYProgress, (value) => value);
  const [activeScene, setActiveScene] = useState(0);
  const [journeyComplete, setJourneyComplete] = useState(false);
  const completeJourney = useCallback(() => setJourneyComplete(true), []);

  useMotionValueEvent(journey, "change", (value) => {
    if (value >= 0.56) attention.markMenuFaded();
  });

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
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <a href="#essay" className="skip-link">Skip to the essay</a>
      <main id="essay" ref={mainRef}>
        <h1 className="sr-only">Invisible Interfaces</h1>
        <Header progress={journey} />
        <ChromeRail progress={journey} activeScene={activeScene} />

        <Scene0Forgotten />
        <Scene1Terminal />
        <Scene2Simplification />
        <Scene3Remembering />
        <EntrustedTask onComplete={completeJourney} />

        {journeyComplete && (
          <div className="flex h-[65vh] flex-col items-center justify-center gap-5 bg-void px-6 text-center">
            <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-dim">
              THE TASK ENDS. YOUR AUTHORITY DOES NOT.
            </p>
            <a
              href="/about"
              className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-dim underline decoration-line underline-offset-4 transition-colors duration-500 hover:text-ink focus-visible:text-ink"
            >
              ABOUT THIS INVESTIGATION
            </a>
          </div>
        )}
      </main>
    </LazyMotion>
  );
}