"use client";

import { useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, useScroll, useTransform } from "motion/react";
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

        <Header progress={journey} />
        <ChromeRail progress={journey} activeScene={activeScene} />

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
