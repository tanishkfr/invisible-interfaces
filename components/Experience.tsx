"use client";

import { useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import ChromeRail from "@/components/chrome/ChromeRail";
import Header from "@/components/chrome/Header";
import Scene0Forgotten from "@/components/scenes/Scene0Forgotten";
import Scene1Terminal from "@/components/scenes/Scene1Terminal";
import Scene2Simplification from "@/components/scenes/Scene2Simplification";
import Scene3Remembering from "@/components/scenes/Scene3Remembering";
import EntrustedTask from "@/components/scenes/EntrustedTask";
import { attention } from "@/lib/attention";

/**
 * One task travels from demanded attention to entrusted absence. The historic
 * scenes are not a survey; they establish the attention relationship that the
 * final interaction reverses.
 */
export default function Experience() {
  const mainRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const journey = useTransform(scrollYProgress, (value) => value);
  const [activeScene, setActiveScene] = useState(0);
  const [journeyComplete, setJourneyComplete] = useState(false);

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
    console.log(
      "%cREADY.\n%c> YOU FOUND THE OTHER TERMINAL. IT CANNOT SEE WHEN YOU LEAVE.",
      "font-family:monospace;color:#E8A33D",
      "font-family:monospace;color:#918E88",
    );
  }, []);

  useEffect(() => {
    const sections = mainRef.current?.querySelectorAll<HTMLElement>("[data-scene]");
    if (!sections) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveScene(Number((entry.target as HTMLElement).dataset.scene));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <main ref={mainRef}>
        <h1 className="sr-only">Invisible Interfaces</h1>
        <Header progress={journey} />
        <ChromeRail progress={journey} activeScene={activeScene} />

        <Scene0Forgotten />
        <Scene1Terminal />
        <Scene2Simplification />
        <Scene3Remembering />
        <EntrustedTask onComplete={() => setJourneyComplete(true)} />

        {journeyComplete && (
          <div className="flex h-[65vh] flex-col items-center justify-center gap-5 bg-void">
            <p className="font-mono text-[0.625rem] tracking-[0.18em] text-ink-faint opacity-55">
              THE TASK ENDS. THE BACKGROUND DOES NOT.
            </p>
            <a
              href="/about"
              className="font-mono text-[0.625rem] tracking-[0.18em] text-ink-faint opacity-40 transition-opacity duration-500 hover:opacity-100 focus-visible:opacity-100"
            >
              ABOUT THIS ESSAY
            </a>
          </div>
        )}
      </main>
    </LazyMotion>
  );
}
