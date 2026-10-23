"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PhotoArtifact from "@/components/v2/PhotoArtifact";
import { ACT_BOUNDARIES, EXHIBITION_DURATION, acts, v2Copy } from "@/content/v2";

gsap.registerPlugin(ScrollTrigger);

// The glyphs are image data becoming window geometry, never ambient particles.
const GLYPHS = [".", ":", "+", "*", "#", "=", "~", "/"];

export default function CinematicExperience() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const media = gsap.matchMedia();
    let disposed = false;
    let refreshFrame = 0;
    // Firefox can apply the reduced-motion height after matchMedia rebuilds.
    // Refresh from the measured section resize, once its new layout exists.
    const section = el.querySelector(".v2-scroll");
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    if (section) observer.observe(section);
    media.add({ compact: "(max-width: 700px)", tablet: "(min-width: 701px) and (max-width: 1100px)", reduce: "(prefers-reduced-motion: reduce)", wide: "(min-width: 1101px)" }, (context) => {
      const compact = Boolean(context.conditions?.compact);
      const tablet = Boolean(context.conditions?.tablet);
      const reduced = Boolean(context.conditions?.reduce);
      const q = gsap.utils.selector(el);
      const select = (s: string) => q(s);
      // Seed every responsive rebuild from CSS, including when the preference
      // changes while a lazily initialized timeline is in the middle of an act.
      gsap.set(select(".v2-world, .v2-world *, .v2-intro, .v2-header, .v2-side-note, .v2-thought, .v2-final, .v2-progress-fill, .v2-scroll-cue"), { clearProps: "all" });
      const shellW = compact ? 310 : 740;
      const shellH = compact ? 292 : 430;
      const photoW = compact ? 258 : 430;
      const photoH = photoW * 2 / 3;
      const touchScaleX = compact ? 0.98 : 0.68;
      const touchScaleY = compact ? 1.12 : 1;
      gsap.set(select(".v2-shell"), { width: shellW, height: shellH, xPercent: -50, yPercent: -50, scaleX: 1, scaleY: 1, borderRadius: 0, backgroundColor: "#0e0e0e", borderColor: "#49443a", opacity: 1 });
      gsap.set(select(".v2-photo"), { width: photoW, height: photoH, xPercent: -50, yPercent: -50, x: compact ? 0 : 110, y: compact ? 30 : 12, scale: 0.28, rotationZ: 0, borderRadius: 0 });
      gsap.set(select(".v2-world"), { x: compact || tablet ? 0 : 245, y: compact ? 100 : tablet ? 160 : 35, scale: compact ? 0.94 : 0.82, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0 });
      gsap.set(select(".v2-terminal-copy, .v2-terminal-art, .v2-intro"), { opacity: 1, x: 0, y: 0 });
      gsap.set(select(".v2-header, .v2-side-note"), { autoAlpha: 1 });
      gsap.set(select(".v2-context"), { x: 0, y: 0, z: 40, scale: 1 });
      gsap.set(select(".v2-context-one"), { x: compact ? 24 : -100, y: -25, z: -180 });
      gsap.set(select(".v2-context-two"), { x: compact ? -24 : 120, y: 30, z: -260 });
      gsap.set(select(".v2-orbits"), { scale: 1 });
      gsap.set(select(".v2-memory-query, .v2-memory-index"), { opacity: 0, x: 0, y: 0 });
      gsap.set(select(".v2-touch-ui"), { x: 0, y: 0, z: 6 });
      gsap.set(select(".v2-query-completion"), { clipPath: "inset(0 100% 0 0)" });
      gsap.set(select(".v2-gesture-trace"), { opacity: 0, strokeDashoffset: 360 });
      gsap.set(select(".v2-photo-focus"), { opacity: 0, scale: 1.15 });
      gsap.set(select(".v2-window-bar, .v2-files, .v2-dither, .v2-color, .v2-touch-ui, .v2-context, .v2-pointer, .v2-thought, .v2-final, .v2-orbits"), { opacity: 0 });
      gsap.set(select(".v2-satellite"), { opacity: 0, transformPerspective: 1200 });
      gsap.set(select(".v2-glyph"), { xPercent: -50, yPercent: -50, scale: 1, opacity: 0 });
      gsap.set(select(".v2-glyph-letter"), { opacity: 1 });

      const timeline = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      // A. Move into the terminal; its image data builds the window perimeter.
      timeline.to(select(".v2-intro"), { opacity: 0, x: compact ? 0 : -70, y: -24, duration: 5 }, 2)
        .to(select(".v2-scroll-cue"), { opacity: 0, duration: 2 }, 7)
        .to(select(".v2-world"), { x: 0, y: 20, scale: 1, duration: 8, ease: "power2.inOut" }, 3)
        .to(select(".v2-thought-0"), { opacity: 1, duration: 2 }, 8)
        .to(select(".v2-terminal-copy"), { opacity: 0, y: -20, duration: 5 }, 12)
        .to(select(".v2-terminal-art"), { opacity: 0, duration: 3 }, 12)
        .to(select(".v2-glyph"), { opacity: 1, duration: 2 }, 13)
        .to(select(".v2-shell"), { opacity: 0, duration: 4 }, 13)
        .to(select(".v2-thought-0"), { opacity: 0, duration: 2 }, 14)
        .to(select(".v2-world"), { z: compact ? 60 : 180, rotationX: -5, duration: 6, ease: "power2.inOut" }, 14);

      select(".v2-glyph").forEach((glyph: Element, i: number) => {
        const col = i % 8;
        const row = Math.floor(i / 8);
        const targetX = i < 16 ? ((i % 8) + 0.5) / 8 * shellW - shellW / 2 : (i < 28 ? -shellW / 2 : shellW / 2);
        const targetY = i < 16 ? (i < 8 ? -shellH / 2 : shellH / 2) : (((i - 16) % 12) + 0.5) / 12 * shellH - shellH / 2;
        gsap.set(glyph, { x: (col - 3.5) * (compact ? 11 : 22) + (compact ? 74 : 150), y: row * 15 - 26 });
        timeline.to(glyph, { x: (col - 3.5) * (compact ? 39 : 83), y: (row - 2) * (compact ? 37 : 62), scale: 1.5, duration: 5, ease: "steps(8)" }, 14 + row * 0.16)
          .to(glyph, { x: targetX, y: targetY, scale: 0.65, duration: 6, ease: "power2.inOut" }, 20)
          .to(glyph.querySelector(".v2-glyph-letter"), { opacity: 0, duration: 2 }, 24)
          .fromTo(glyph.querySelector(".v2-glyph-piece"), { opacity: 0, scaleX: 0.2, scaleY: 0.2 }, { opacity: 1, scaleX: i < 16 ? shellW / 8 / 6.5 : 0.16, scaleY: i < 16 ? 0.16 : shellH / 12 / 6.5, duration: 3, ease: "power2.inOut" }, 23)
          .to(glyph, { opacity: 0, duration: 2 }, 28);
      });
      timeline.to(select(".v2-photo"), { scale: 1, duration: 9, ease: "power3.inOut" }, 19)
        .to(select(".v2-dither"), { opacity: 1, duration: 5 }, 20)
        .to(select(".v2-shell"), { backgroundColor: "#141414", borderColor: "#68645c", duration: 5 }, 22)
        .to(select(".v2-shell"), { opacity: 1, duration: 3 }, 26)
        .to(select(".v2-window-bar, .v2-files"), { opacity: 1, duration: 4 }, 25)
        .to(select(".v2-world"), { z: 0, rotationX: 0, duration: 6, ease: "power2.inOut" }, 24)
        .to(select(".v2-pointer"), { opacity: 1, duration: 1 }, 28)
        .fromTo(select(".v2-pointer"), { x: compact ? 95 : 270, y: 120 }, { x: compact ? 45 : 150, y: 50, duration: 3, ease: "power2.inOut" }, 28)
        .to(select(".v2-thought-1"), { opacity: 1, duration: 2 }, 29);

      // B. A camera arc shares the same world and selected photograph.
      timeline.to(select(".v2-thought-1"), { opacity: 0, duration: 2 }, 36)
        .to(select(".v2-world"), { rotationY: compact ? -22 : -38, rotationX: 9, rotationZ: -5, x: compact ? -24 : -145, z: compact ? 50 : 135, duration: 8, ease: "power2.inOut" }, 37)
        .to(select(".v2-satellite"), { opacity: 1, duration: 3, stagger: 0.7 }, 37)
        .fromTo(select(".v2-satellite-one"), { x: compact ? -100 : -360, y: -90, z: -300 }, { x: compact ? -220 : -540, y: -20, z: 140, duration: 12, ease: "power1.inOut" }, 37)
        .fromTo(select(".v2-satellite-two"), { x: compact ? 100 : 350, y: 100, z: -220 }, { x: compact ? 240 : 580, y: 30, z: 220, duration: 12, ease: "power1.inOut" }, 38)
        .to(select(".v2-files, .v2-window-bar, .v2-pointer"), { opacity: 0, duration: 4 }, 43)
        .to(select(".v2-shell"), { scaleX: touchScaleX, scaleY: touchScaleY, borderRadius: 14, backgroundColor: "#111113", borderColor: "#5e5a53", duration: 9, ease: "power3.inOut" }, 45)
        .to(select(".v2-photo"), { x: 0, y: compact ? 0 : -8, scale: compact ? 0.96 : 0.94, borderRadius: 6, duration: 9, ease: "power3.inOut" }, 45)
        .to(select(".v2-world"), { rotationY: 0, rotationX: 0, rotationZ: 0, x: 0, y: compact ? 24 : 35, z: 0, duration: 10, ease: "power3.inOut" }, 46)
        .to(select(".v2-satellite"), { opacity: 0, duration: 3 }, 49)
        .to(select(".v2-color"), { opacity: 1, duration: 6 }, 48)
        .to(select(".v2-touch-ui"), { opacity: 1, duration: 3 }, 53)
        .fromTo(select(".v2-touch-ring"), { scale: 0.8, opacity: 0 }, { scale: 1.35, opacity: 0.8, duration: 2, ease: "power2.out" }, 55)
        .to(select(".v2-touch-ring"), { scale: 1.7, opacity: 0, duration: 2 }, 57)
        .to(select(".v2-thought-2"), { opacity: 1, duration: 2 }, 57);

      // III. A controlled gesture carries the image; the surface follows it.
      timeline.to(select(".v2-photo"), { x: compact ? 15 : 48, y: 10, rotationZ: 3, scale: compact ? 1.01 : 1.02, duration: 6, ease: "power2.inOut" }, 61)
        .to(select(".v2-world"), { rotationZ: -1.5, rotationY: compact ? -3 : -7, duration: 6, ease: "power2.inOut" }, 61)
        .to(select(".v2-gesture-trace"), { opacity: 0.7, strokeDashoffset: 0, duration: 6 }, 61)
        .to(select(".v2-shell"), { scaleX: compact ? 1.04 : 0.76, scaleY: compact ? 1.16 : 1.06, duration: 6, ease: "power2.inOut" }, 61)
        .to(select(".v2-photo"), { x: compact ? -8 : -25, y: -2, rotationZ: -1.5, scale: compact ? 0.98 : 0.96, duration: 5, ease: "power2.inOut" }, 67)
        .to(select(".v2-photo"), { x: 0, y: 0, rotationZ: 0, scale: compact ? 0.96 : 1, duration: 5, ease: "back.out(1.15)" }, 72)
        .to(select(".v2-world"), { rotationZ: 0, rotationY: 0, duration: 6, ease: "power2.inOut" }, 70)
        .to(select(".v2-gesture-trace"), { opacity: 0, duration: 3 }, 73);

      // IV. The tactile frame opens into a context field, not notification cards.
      timeline.to(select(".v2-thought-2"), { opacity: 0, duration: 2 }, 80)
        .to(select(".v2-touch-ui"), { opacity: 0, y: 8, duration: 4 }, 81)
        .to(select(".v2-shell"), { scaleX: compact ? 1 : 0.96, scaleY: compact ? 0.88 : 0.91, opacity: 0.2, borderRadius: 4, duration: 9, ease: "power3.inOut" }, 81)
        .to(select(".v2-world"), { x: compact ? 0 : tablet ? -20 : -55, z: compact ? 20 : tablet ? 30 : 60, rotationY: compact || tablet ? 4 : 8, duration: 8, ease: "power2.inOut" }, 82)
        .to(select(".v2-photo"), { scale: compact ? 0.96 : tablet ? 0.9 : 1.08, y: compact ? 10 : 38, duration: 8, ease: "power2.inOut" }, 82)
        .to(select(".v2-memory-index"), { opacity: 1, duration: 3 }, 85)
        .to(select(".v2-context-one"), { x: 0, y: 0, z: 20, opacity: 1, duration: 7, ease: "power2.inOut" }, 86)
        .to(select(".v2-memory-query"), { opacity: 1, duration: 3 }, 87)
        .to(select(".v2-orbits"), { opacity: 0.65, duration: 4 }, 88)
        .to(select(".v2-query-completion"), { clipPath: "inset(0 0% 0 0)", duration: 7, ease: "steps(14)" }, 90)
        .to(select(".v2-context-two"), { x: 0, y: 0, z: 20, opacity: 1, duration: 7, ease: "power2.inOut" }, 91)
        .to(select(".v2-photo-focus"), { opacity: 0.8, scale: 1, duration: 5, ease: "power2.inOut" }, 93)
        .to(select(".v2-world"), { x: 0, z: 0, rotationY: 0, duration: 9, ease: "power2.inOut" }, 95)
        .to(select(".v2-context-three"), { opacity: 1, duration: 4 }, 98)
        .to(select(".v2-thought-3"), { opacity: 1, duration: 3 }, 100);

      // C. Controls withdraw along converging depth paths. The image stays.
      timeline.to(select(".v2-thought-3"), { opacity: 0, duration: 2 }, 113)
        .to(select(".v2-context-one"), { x: compact ? 35 : 240, y: 40, z: -650, scale: 0.45, duration: 12, ease: "power2.inOut" }, 113)
        .to(select(".v2-context-two"), { x: compact ? -35 : -240, y: -35, z: -900, scale: 0.4, duration: 12, ease: "power2.inOut" }, 114)
        .to(select(".v2-context-three"), { y: -60, z: -1100, scale: 0.4, duration: 12, ease: "power2.inOut" }, 115)
        .to(select(".v2-memory-query"), { y: 35, opacity: 0, duration: 7 }, 113)
        .to(select(".v2-context, .v2-memory-index"), { opacity: 0, duration: 5, stagger: 0.4 }, 119)
        .to(select(".v2-shell"), { scaleX: compact ? 0.7 : 0.55, scaleY: 0.55, opacity: 0, duration: 10, ease: "power2.inOut" }, 115)
        .to(select(".v2-orbits, .v2-photo-focus"), { scale: 0.75, opacity: 0, duration: 10 }, 115)
        .to(select(".v2-photo"), { scale: compact ? 1.12 : 1.32, y: compact ? -70 : -85, borderRadius: 1, duration: 13, ease: "power2.inOut" }, 118)
        .to(select(".v2-header, .v2-side-note"), { autoAlpha: 0, duration: 7 }, 120)
        .to(select(".v2-final"), { opacity: 1, duration: 5 }, 132)
        .to(select(".v2-progress-fill"), { scaleX: 1, duration: EXHIBITION_DURATION }, 0);

      const links = Array.from(el.querySelectorAll<HTMLAnchorElement>("[data-act-link]"));
      let active = -1;
      const render = (progress: number) => {
        const time = progress * EXHIBITION_DURATION;
        const boundary = ACT_BOUNDARIES.findIndex((at) => time < at);
        const index = boundary < 0 ? 4 : boundary;
        timeline.time(reduced ? acts[index].rest : time, false);
        el.dataset.act = String(index);
        el.dataset.progress = progress.toFixed(4);
        if (index !== active) {
          active = index;
          links.forEach((link) => {
            if (Number(link.dataset.actLink) === index && link.closest("nav")) link.setAttribute("aria-current", "step");
            else link.removeAttribute("aria-current");
          });
        }
      };
      const trigger = ScrollTrigger.create({
        id: "v2-exhibition",
        trigger: el.querySelector(".v2-scroll"),
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => render(self.progress),
        onRefresh: (self) => render(self.progress),
        invalidateOnRefresh: true,
      });
      const jump = (event: Event) => {
        const link = event.currentTarget as HTMLAnchorElement;
        event.preventDefault();
        const index = Number(link.dataset.actLink);
        const target = trigger.start + acts[index].at * (trigger.end - trigger.start);
        history.replaceState(null, "", `#${acts[index].verb.toLowerCase()}`);
        window.scrollTo({ top: target, behavior: "instant" });
        render(acts[index].at);
      };
      links.forEach((link) => link.addEventListener("click", jump));
      const followHash = () => {
        const index = acts.findIndex((act) => `#${act.verb.toLowerCase()}` === location.hash);
        if (index < 0) return;
        window.scrollTo(0, trigger.start + acts[index].at * (trigger.end - trigger.start));
        render(acts[index].at);
      };
      window.addEventListener("hashchange", followHash);
      render(trigger.progress);
      el.dataset.ready = "true";
      const hashIndex = acts.findIndex((act) => `#${act.verb.toLowerCase()}` === location.hash);
      const frame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        if (hashIndex >= 0 && window.scrollY < 1) {
          window.scrollTo(0, trigger.start + acts[hashIndex].at * (trigger.end - trigger.start));
          render(acts[hashIndex].at);
        }
      });
      return () => {
        cancelAnimationFrame(frame);
        links.forEach((link) => link.removeEventListener("click", jump));
        window.removeEventListener("hashchange", followHash);
        delete el.dataset.ready;
      };
    }, el);
    // Fonts can change layout after restoration; refresh without changing scroll.
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => { disposed = true; observer.disconnect(); cancelAnimationFrame(refreshFrame); media.revert(); };
  }, []);

  return (
    <main ref={root} className="v2-exhibition" data-act="0">
      <a href="#v2-reading" className="skip-link">{v2Copy.skip}</a>
      <section className="v2-scroll" aria-label="Invisible Interfaces cinematic exhibition">
        <div className="v2-viewport">
          <header className="v2-header">
            <a className="v2-wordmark" href="/v2">{v2Copy.wordmark}<span aria-hidden>↘</span></a>
            <span className="v2-edition">{v2Copy.edition} <span>/ 02</span></span>
            <a href="/about" className="v2-about">{v2Copy.about}</a>
          </header>

          <div className="v2-intro">
            <p className="v2-eyebrow">{v2Copy.eyebrow}</p>
            <h1>{v2Copy.title[0]}<br /><em>{v2Copy.title[1]}</em><span className="v2-period">.</span></h1>
            <p className="v2-description">{v2Copy.description}</p>
          </div>

          <div className="v2-thoughts" aria-hidden="true">
            {acts.slice(0, 4).map((act, i) => <div className={`v2-thought v2-thought-${i}`} key={act.name}><p className="v2-eyebrow">0{i + 1} / {act.name.toUpperCase()}</p><p className="v2-statement">{act.title}</p></div>)}
          </div>

          <div className="v2-camera" aria-hidden="true">
            <div className="v2-world">
              <div className="v2-shell" />
              <PhotoArtifact era="terminal" />
              <div className="v2-terminal-copy">
                <p className="v2-terminal-heading">{v2Copy.terminal.heading} <span>{v2Copy.terminal.location}</span></p>
                <p>{v2Copy.terminal.ready}</p><p><span>&gt;</span> {v2Copy.terminal.list}</p>
                <div className="v2-terminal-files">{v2Copy.terminal.files.map((name, i) => <p key={name}>{name}{i === 2 && <span>←</span>}</p>)}</div>
                <p className="v2-command"><span>&gt;</span> {v2Copy.terminal.open}<span className="v2-cursor" /></p>
                <p className="v2-terminal-bottom">{v2Copy.terminal.footnote}</p>
              </div>
              <div className="v2-window-bar"><span className="v2-close" /><span>{v2Copy.gui.title}</span><span>− &nbsp; □</span></div>
              <div className="v2-files"><span>{v2Copy.gui.archive}</span>{v2Copy.gui.files.map((name, i) => <p className={i === 2 ? "v2-file-selected" : undefined} key={name}>{i === 2 ? "▧" : "▤"} {name}</p>)}<small>{v2Copy.gui.count}<br />{v2Copy.gui.selected}</small></div>
              <div className="v2-photo" data-persistent-artifact="beach">
                <div className="v2-dither"><PhotoArtifact era="dither" /></div>
                <div className="v2-color"><PhotoArtifact era="full" /></div>
                <svg className="v2-photo-focus" viewBox="0 0 430 287" preserveAspectRatio="none"><path d="M1 23V1H23M407 1H429V23M429 264V286H407M23 286H1V264" /></svg>
              </div>
              <div className="v2-data-field">{Array.from({ length: 40 }, (_, i) => <span className="v2-glyph" key={i}><span className="v2-glyph-letter">{GLYPHS[(i * 3 + Math.floor(i / 8)) % GLYPHS.length]}</span><i className="v2-glyph-piece" /></span>)}</div>
              <svg className="v2-pointer" width="24" height="30" viewBox="0 0 24 30"><path d="M2 2v23l6-6 5 10 4-2-5-10h9Z" fill="#e8e6e3" stroke="#111" strokeWidth="1.5" /></svg>
              <div className="v2-satellite v2-satellite-one"><div>{v2Copy.terminal.files[1]} <span>− □</span></div><p>{v2Copy.gui.note}<br />{v2Copy.gui.letter}</p><i /><i /><i /></div>
              <div className="v2-satellite v2-satellite-two"><div>{v2Copy.gui.archive} <span>− □</span></div>{[2, 0, 1].map((i) => <p key={i}>{i === 2 ? "▧" : "▤"} {v2Copy.terminal.files[i]}</p>)}</div>
              <div className="v2-touch-ui">
                <p className="v2-touch-heading"><span>{v2Copy.touch.title}</span><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor"><path d="M9 3v12M3 9h12" /></svg></p>
                <p className="v2-touch-caption">{v2Copy.touch.caption}<small>{v2Copy.touch.detail}</small></p>
              </div>
              <div className="v2-touch-ring" />
              <svg className="v2-gesture-trace" viewBox="0 0 600 400"><path d="M130 260C180 285 300 285 350 240S410 140 470 160" /></svg>
              <div className="v2-memory-index"><span>{v2Copy.memory.index}</span><div>{v2Copy.memory.sequence.map((word) => <span key={word}>{word}</span>)}</div></div>
              <p className="v2-memory-query"><span>{v2Copy.memory.query}</span><span className="v2-query-completion">{v2Copy.memory.completion}</span></p>
              <svg className="v2-orbits" viewBox="0 0 1100 600" preserveAspectRatio="none"><path d="M40 250H250L320 300M1060 390H850L780 330M550 540V470" /><circle cx="40" cy="250" r="2" /><circle cx="1060" cy="390" r="2" /><circle cx="550" cy="540" r="2" /></svg>
              <div className="v2-context v2-context-one"><span>{v2Copy.contexts[0].label}</span><p>{v2Copy.contexts[0].title}</p><small>{v2Copy.contexts[0].detail}</small></div>
              <div className="v2-context v2-context-two"><span>{v2Copy.contexts[1].label}</span><p>{v2Copy.contexts[1].title}</p><small>{v2Copy.contexts[1].detail}</small></div>
              <div className="v2-context v2-context-three"><p>{v2Copy.contexts[2].title}</p><small>{v2Copy.contexts[2].detail}</small></div>
            </div>
          </div>

          <div className="v2-final" aria-hidden="true"><p className="v2-eyebrow">05 / THE ABSENCE</p><p className="v2-statement">{acts[4].title}</p><p>{acts[4].detail}</p></div>
          <div className="v2-scroll-cue" aria-hidden="true">{v2Copy.scroll}<span>↓</span></div>

          <nav className="v2-navigation" aria-label="Exhibition acts">
            <div className="v2-progress"><i className="v2-progress-fill" /></div>
            {acts.map((act, i) => <a href={`#${act.verb.toLowerCase()}`} data-act-link={i} key={act.name}><span>0{i + 1}</span><span>{act.name}</span><em>{act.verb}</em></a>)}
          </nav>
          <span className="v2-side-note" aria-hidden="true">{v2Copy.sideNote}</span>
        </div>
      </section>

      <section id="v2-reading" className="v2-reading" tabIndex={-1}>
        <p className="v2-eyebrow">{v2Copy.reading.eyebrow}</p>
        <h2>{v2Copy.reading.title}<br /><em>{v2Copy.reading.question}</em></h2>
        <p>{v2Copy.narrative}</p>
        <ol>{acts.map((act) => <li key={act.name}><strong>{act.name}</strong><span>{act.detail}</span></li>)}</ol>
        <p className="v2-disclosure">{v2Copy.disclosure}</p>
        <div className="v2-reading-links"><a href="#instruct" data-act-link={0}>{v2Copy.reading.replay}</a><a href="/">{v2Copy.reading.original}</a></div>
        <footer><span>{v2Copy.reading.brand}</span><span>{v2Copy.reading.author}</span><span>{v2Copy.reading.phase}</span></footer>
      </section>
    </main>
  );
}
