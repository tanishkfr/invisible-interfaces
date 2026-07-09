"use client";

import { useEffect, useRef, useState } from "react";
import {
  m,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import BeachPhoto from "@/components/artifacts/BeachPhoto";
import { simplification } from "@/content/scenes";

/**
 * Scene 2 — The Great Simplification.
 *
 * One task — find and open the photograph — performed by five
 * successive paradigms with no cuts. The frame and the three files are
 * persistent elements whose geometry interpolates between era
 * keyframes on scroll; their contents dissolve between
 * representations. The visitor scrubs history at their own pace.
 *
 * Era timeline on scene progress:
 *   terminal ─ gui ─ touch ─ search ─ prediction
 * Transition bands shorten early (mechanical, abrupt) and lengthen
 * late (organic, soft) — motion itself evolves with the eras.
 */

/** Stage design space, scaled to fit small viewports. */
const SW = 680;
const SH = 560;

/** Era breakpoints: [t, t, g, g, tc, tc, s, s, p, p] */
const P = [0, 0.17, 0.22, 0.4, 0.5, 0.62, 0.72, 0.82, 0.92, 1];

/** Where reduced motion snaps to — the five plateaus. */
const PLATEAUS = [0.08, 0.31, 0.56, 0.77, 0.96];

type Ten<T> = [T, T, T, T, T, T, T, T, T, T];
const spread = <T,>(t: T, g: T, tc: T, s: T, p: T): Ten<T> => [t, t, g, g, tc, tc, s, s, p, p];

export default function Scene2Simplification() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Function-based transform, deliberately: Framer promotes direct
  // array transforms of scroll progress to WAAPI ViewTimeline
  // animations whose range differs from our offsets — silently
  // desynchronizing them. A function transform stays JS-driven.
  // It also snaps to era plateaus under reduced motion: history in
  // five discrete states instead of a morph.
  const progress = useTransform(scrollYProgress, (v) =>
    reduced
      ? PLATEAUS.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a))
      : v,
  );

  // Fit the fixed stage into any viewport (transform only — no reflow).
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () =>
      setScale(Math.min(1, (innerWidth - 16) / SW, (innerHeight - 32) / SH));
    fit();
    addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, []);

  // ——— The frame: one screen, forty years ———
  const fx = useTransform(progress, P, spread(30, 60, 190, 30, 30));
  const fy = useTransform(progress, P, spread(70, 60, 30, 40, 40));
  const fw = useTransform(progress, P, spread(620, 560, 300, 620, 620));
  const fh = useTransform(progress, P, spread(380, 400, 480, 480, 480));
  const fr = useTransform(progress, P, spread(0, 2, 14, 14, 14));
  const fbg = useTransform(progress, P, spread("#000000", "#111113", "#0d0d10", "#0d0d10", "#0d0d10"));
  const fo = useTransform(progress, P, spread(1, 1, 1, 0, 0));

  // Era dressing opacities.
  const termO = useTransform(progress, P, spread(1, 0, 0, 0, 0));
  const guiO = useTransform(progress, P, spread(0, 1, 0, 0, 0));
  const searchO = useTransform(progress, P, spread(0, 0, 0, 1, 0));
  const predCapO = useTransform(progress, P, spread(0, 0, 0, 0, 1));
  const takeawayO = useTransform(progress, [0.96, 1], [0, 1]);

  // GUI pointer: it travels to the photograph, then the row lights up.
  const ptrX = useTransform(progress, [0.26, 0.36], [470, 320]);
  const ptrY = useTransform(progress, [0.26, 0.36], [330, 232]);
  const rowGlow = useTransform(progress, [0.35, 0.37, 0.4, 0.42], [0, 1, 1, 0]);

  // Touch: the tap.
  const tapO = useTransform(progress, [0.53, 0.555, 0.59], [0, 0.9, 0]);
  const tapS = useTransform(progress, [0.53, 0.59], [0.6, 1.35]);

  // Search: the query types itself as the visitor scrolls.
  const typed = useTransform(progress, (v) =>
    simplification.searchQuery.slice(
      0,
      Math.round(Math.max(0, Math.min(1, (v - 0.7) / 0.06)) * simplification.searchQuery.length),
    ),
  );
  const caretO = useTransform(progress, P, spread(0, 0, 0, 1, 0));

  // Representation bands for the file objects.
  const tileO = useTransform(progress, P, spread(0, 0, 1, 0, 0));
  const photoO = useTransform(progress, P, spread(0, 0, 1, 1, 1));

  // Era captions — sequenced with dead zones so two never overlap.
  const cap0O = useTransform(progress, [0, 0.16, 0.19], [1, 1, 0]);
  const cap1O = useTransform(progress, [0.23, 0.26, 0.4, 0.43], [0, 1, 1, 0]);
  const cap2O = useTransform(progress, [0.48, 0.51, 0.62, 0.65], [0, 1, 1, 0]);
  const cap3O = useTransform(progress, [0.7, 0.73, 0.82, 0.85], [0, 1, 1, 0]);

  return (
    <section ref={ref} data-scene={2} aria-label="The Great Simplification" className="relative h-[500vh]">
      <h2 className="sr-only">The Great Simplification</h2>
      <p className="sr-only">{simplification.srNarrative}</p>

      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div
          aria-hidden
          className="relative"
          style={{ width: SW, height: SH, transform: `scale(${scale})` }}
        >
          {/* ——— The frame ——— */}
          <m.div
            className="absolute border border-line"
            style={{ x: fx, y: fy, width: fw, height: fh, borderRadius: fr, background: fbg, opacity: fo }}
          >
            {/* GUI title bar */}
            <m.div
              style={{ opacity: guiO }}
              className="flex h-6 items-center gap-2 border-b border-line px-2.5"
            >
              <span className="h-2 w-2 border border-line" />
              <span className="flex-1 text-center font-mono text-[0.6875rem] tracking-[0.08em] text-ink-dim">
                {simplification.guiTitle}
              </span>
              <span className="w-2" />
            </m.div>
          </m.div>

          {/* ——— Terminal dressing ——— */}
          <m.div
            style={{ opacity: termO }}
            className="absolute left-[75px] top-[136px] font-mono text-[0.8125rem] leading-none text-ink-dim"
          >
            <div>&gt; LIST</div>
            <div className="mt-[13px]">3 FILES.</div>
          </m.div>
          <m.div
            style={{ opacity: termO }}
            className="absolute left-[75px] top-[280px] font-mono text-[0.8125rem] leading-none text-ink"
          >
            <span className="text-accent">&gt; </span>OPEN BEACH.PIC
            <span className="cursor-blink ml-1 inline-block h-[0.9em] w-[0.5em] translate-y-[0.1em] bg-accent" />
          </m.div>

          {/* GUI status line */}
          <m.div
            style={{ opacity: guiO }}
            className="absolute left-[84px] top-[430px] font-mono text-[0.6875rem] text-ink-faint"
          >
            {simplification.guiStatus}
          </m.div>

          {/* GUI row glow behind the photograph's row */}
          <m.div
            style={{ opacity: rowGlow }}
            className="absolute left-[84px] top-[244px] h-11 w-[512px] bg-[rgba(232,230,227,0.07)]"
          />

          {/* ——— The three files: persistent objects ——— */}
          <Entity
            progress={progress}
            x={spread(75, 84, 206, 206, 206)}
            y={spread(192, 100, 130, 130, 130)}
            w={spread(200, 512, 128, 128, 128)}
            h={spread(20, 44, 128, 128, 128)}
            r={spread(0, 0, 8, 8, 8)}
            o={spread(1, 1, 1, 0, 0)}
            label="LETTER.TXT"
            progressBands={{ mono: termO, row: guiO, tile: tileO }}
          />
          <Entity
            progress={progress}
            x={spread(75, 84, 350, 350, 350)}
            y={spread(214, 148, 130, 130, 130)}
            w={spread(200, 512, 128, 128, 128)}
            h={spread(20, 44, 128, 128, 128)}
            r={spread(0, 0, 8, 8, 8)}
            o={spread(1, 1, 1, 0, 0)}
            label="NOTES.TXT"
            progressBands={{ mono: termO, row: guiO, tile: tileO }}
          />
          <Entity
            progress={progress}
            x={spread(75, 84, 206, 190, 140)}
            y={spread(236, 196, 278, 210, 140)}
            w={spread(200, 512, 272, 300, 400)}
            h={spread(20, 44, 172, 190, 270)}
            r={spread(0, 0, 8, 8, 8)}
            o={spread(1, 1, 1, 1, 1)}
            label="BEACH.PIC"
            isPhoto
            progressBands={{ mono: termO, row: guiO, tile: tileO, photo: photoO }}
          />

          {/* Touch: the tap ring on the photograph */}
          <m.div
            style={{ opacity: tapO, scale: tapS, x: 318, y: 344 }}
            className="absolute h-12 w-12 rounded-full border border-ink-dim"
          />

          {/* GUI: the pointer */}
          <m.svg
            width="14"
            height="20"
            viewBox="0 0 14 20"
            style={{ opacity: guiO, x: ptrX, y: ptrY }}
            className="absolute"
          >
            <path d="M1 1 L1 15.5 L4.8 12.2 L7.3 18.5 L9.8 17.4 L7.3 11.3 L12.4 11 Z" fill="#E8E6E3" stroke="#0A0A0B" strokeWidth="1" />
          </m.svg>

          {/* ——— Search field ——— */}
          <m.div
            style={{ opacity: searchO }}
            className="absolute left-[140px] top-[120px] flex h-11 w-[400px] items-center rounded-full border border-line bg-surface px-5 font-mono text-[0.8125rem] text-ink"
          >
            <m.span>{typed}</m.span>
            <m.span
              style={{ opacity: caretO }}
              className="cursor-blink ml-0.5 inline-block h-[1em] w-px bg-ink-dim"
            />
          </m.div>

          {/* ——— Prediction caption: the machine, speaking human ——— */}
          <m.p
            style={{ opacity: predCapO }}
            className="absolute left-0 top-[432px] w-full text-center font-serif text-[1.05rem] font-light italic text-ink-dim"
          >
            {simplification.predictionCaption}
          </m.p>

          {/* Era captions */}
          <Caption o={cap0O}>{simplification.captions[0]}</Caption>
          <Caption o={cap1O}>{simplification.captions[1]}</Caption>
          <Caption o={cap2O}>{simplification.captions[2]}</Caption>
          <Caption o={cap3O}>{simplification.captions[3]}</Caption>

          {/* The scene's one explanation, earned at the end */}
          <m.p
            style={{ opacity: takeawayO }}
            className="absolute bottom-0 left-0 w-full text-center font-serif text-[1.2rem] font-light italic text-ink-dim"
          >
            {simplification.takeaway}
          </m.p>
        </div>
      </div>
    </section>
  );
}

function Caption({ o, children }: { o: MotionValue<number>; children: React.ReactNode }) {
  return (
    <m.p
      style={{ opacity: o }}
      className="absolute bottom-0 left-0 w-full text-center font-mono text-[0.6875rem] tracking-[0.14em] text-ink-faint"
    >
      {children}
    </m.p>
  );
}

/* ————— Persistent file object ————— */

interface EntityProps {
  progress: MotionValue<number>;
  x: Ten<number>;
  y: Ten<number>;
  w: Ten<number>;
  h: Ten<number>;
  r: Ten<number>;
  o: Ten<number>;
  label: string;
  isPhoto?: boolean;
  progressBands: {
    mono: MotionValue<number>;
    row: MotionValue<number>;
    tile: MotionValue<number>;
    photo?: MotionValue<number>;
  };
}

/**
 * One file, forty years. The box is continuous — position and shape
 * interpolate across eras — while its interior dissolves between
 * representations: mono listing → window row → photograph.
 */
function Entity({ progress, x, y, w, h, r, o, label, isPhoto, progressBands }: EntityProps) {
  const mx = useTransform(progress, P, x);
  const my = useTransform(progress, P, y);
  const mw = useTransform(progress, P, w);
  const mh = useTransform(progress, P, h);
  const mr = useTransform(progress, P, r);
  const mo = useTransform(progress, P, o);
  // Tiles need a surface; text representations don't.
  const tileBg = useTransform(progressBands.tile, (v) =>
    isPhoto ? "transparent" : `rgba(17, 17, 19, ${v})`,
  );
  const tileBorder = useTransform(progressBands.tile, (v) =>
    isPhoto ? "transparent" : `rgba(232, 230, 227, ${0.1 * v})`,
  );
  const tileLabelO = useTransform(progressBands.tile, (v) => (isPhoto ? 0 : v));

  return (
    <m.div
      className="absolute overflow-hidden border"
      style={{
        x: mx,
        y: my,
        width: mw,
        height: mh,
        borderRadius: mr,
        opacity: mo,
        background: tileBg,
        borderColor: tileBorder,
      }}
    >
      {/* Terminal representation */}
      <m.span
        style={{ opacity: progressBands.mono }}
        className="absolute left-0 top-0 font-mono text-[0.8125rem] leading-[20px] text-ink-dim"
      >
        {label}
      </m.span>

      {/* GUI row representation */}
      <m.span
        style={{ opacity: progressBands.row }}
        className="absolute inset-0 flex items-center gap-3 border-b border-line px-3 font-mono text-[0.8125rem] text-ink"
      >
        {isPhoto ? <PicIcon /> : <DocIcon />}
        {label}
      </m.span>

      {/* Photograph (touch era onward) or touch-tile doc */}
      {isPhoto && progressBands.photo ? (
        <m.span style={{ opacity: progressBands.photo }} className="absolute inset-0">
          <BeachPhoto />
        </m.span>
      ) : (
        <m.span
          style={{ opacity: tileLabelO }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-faint"
        >
          <DocIcon />
          <span className="font-mono text-[0.625rem]">{label}</span>
        </m.span>
      )}
    </m.div>
  );
}

function DocIcon() {
  return (
    <svg width="13" height="16" viewBox="0 0 13 16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
      <path d="M1 1h7l4 4v10H1V1Z" />
      <path d="M8 1v4h4" />
    </svg>
  );
}

function PicIcon() {
  return (
    <svg width="15" height="13" viewBox="0 0 15 13" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
      <rect x="1" y="1" width="13" height="11" />
      <circle cx="4.5" cy="4.5" r="1.2" />
      <path d="M1 10l4-4 3 3 3-3 3 3" />
    </svg>
  );
}

