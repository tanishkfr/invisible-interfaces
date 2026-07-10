"use client";

import { useEffect, useRef, useState } from "react";
import {
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Photo from "@/components/artifacts/Photo";
import { simplification } from "@/content/scenes";

/**
 * Scene 2 — The Great Simplification.
 *
 * One task — find and open the photograph — performed by five
 * successive paradigms with no cuts. The frame and the three files are
 * persistent elements whose geometry interpolates between era
 * keyframes on scroll; their contents dissolve between
 * representations. The visitor scrubs history at their own pace, and
 * the attention ledger at the top counts what each era cost —
 * beginning, when known, with the visitor's own numbers from Scene 1.
 */

/** Era breakpoints: [t, t, g, g, tc, tc, s, s, p, p] */
const P = [0, 0.17, 0.22, 0.4, 0.5, 0.62, 0.72, 0.82, 0.92, 1];

/** The files arrive a breath behind the frame — objects renegotiating
 * their places, not one sheet stretching. */
const PE = P.map((v, i) => (i === 0 || i === P.length - 1 ? v : Math.min(1, v + 0.015)));

/** Where reduced motion snaps to — the five plateaus. */
const PLATEAUS = [0.08, 0.31, 0.56, 0.77, 0.96];

type Ten<T> = [T, T, T, T, T, T, T, T, T, T];
const spread = <T,>(t: T, g: T, tc: T, s: T, p: T): Ten<T> => [t, t, g, g, tc, tc, s, s, p, p];

interface EntityGeo {
  x: Ten<number>;
  y: Ten<number>;
  w: Ten<number>;
  h: Ten<number>;
}

interface Geo {
  sw: number;
  sh: number;
  frame: EntityGeo;
  term1: [number, number];
  term2: [number, number];
  colHeader: [number, number, number];
  guiStatus: [number, number];
  rowGlow: [number, number, number, number];
  preview: [number, number, number, number];
  ptrX: [number, number];
  ptrY: [number, number];
  tap: [number, number];
  search: [number, number, number];
  searchMeta: [number, number, number];
  predCapY: number;
  A: EntityGeo;
  B: EntityGeo;
  C: EntityGeo;
}

const DESKTOP: Geo = {
  sw: 680,
  sh: 560,
  frame: {
    x: spread(30, 60, 190, 30, 30),
    y: spread(70, 105, 30, 40, 40),
    w: spread(620, 560, 300, 620, 620),
    h: spread(380, 310, 480, 480, 480),
  },
  term1: [75, 136],
  term2: [75, 280],
  colHeader: [84, 140, 512],
  guiStatus: [84, 376],
  rowGlow: [84, 256, 512, 44],
  preview: [452, 288, 148, 112],
  ptrX: [470, 320],
  ptrY: [330, 278],
  tap: [318, 344],
  search: [140, 120, 400],
  searchMeta: [190, 410, 300],
  predCapY: 432,
  A: {
    x: spread(75, 84, 206, 206, 206),
    y: spread(192, 160, 130, 130, 130),
    w: spread(200, 512, 128, 128, 128),
    h: spread(20, 44, 128, 128, 128),
  },
  B: {
    x: spread(75, 84, 350, 350, 350),
    y: spread(214, 208, 130, 130, 130),
    w: spread(200, 512, 128, 128, 128),
    h: spread(20, 44, 128, 128, 128),
  },
  C: {
    x: spread(75, 84, 206, 190, 140),
    y: spread(236, 256, 278, 210, 140),
    w: spread(200, 512, 272, 300, 400),
    h: spread(20, 44, 172, 190, 270),
  },
};

/** Phones get their own geometry, not a scale transform — the morph
 * must stay legible at 375px. */
const COMPACT: Geo = {
  sw: 360,
  sh: 600,
  frame: {
    x: spread(10, 10, 40, 10, 10),
    y: spread(90, 95, 50, 70, 70),
    w: spread(340, 340, 280, 340, 340),
    h: spread(300, 300, 430, 430, 430),
  },
  term1: [34, 126],
  term2: [34, 270],
  colHeader: [26, 126, 308],
  guiStatus: [26, 360],
  rowGlow: [26, 226, 308, 40],
  preview: [180, 272, 130, 96],
  ptrX: [300, 190],
  ptrY: [330, 246],
  tap: [156, 307],
  search: [20, 110, 320],
  searchMeta: [40, 384, 280],
  predCapY: 384,
  A: {
    x: spread(34, 26, 56, 56, 56),
    y: spread(176, 146, 120, 120, 120),
    w: spread(200, 308, 120, 120, 120),
    h: spread(20, 40, 120, 120, 120),
  },
  B: {
    x: spread(34, 26, 184, 184, 184),
    y: spread(198, 186, 120, 120, 120),
    w: spread(200, 308, 120, 120, 120),
    h: spread(20, 40, 120, 120, 120),
  },
  C: {
    x: spread(34, 26, 56, 40, 20),
    y: spread(220, 226, 256, 180, 120),
    w: spread(200, 308, 248, 280, 320),
    h: spread(20, 40, 150, 190, 230),
  },
};

export default function Scene2Simplification() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const check = () => setCompact(innerWidth < 620);
    check();
    addEventListener("resize", check);
    return () => removeEventListener("resize", check);
  }, []);
  // Keyed remount: geometry lives in useTransform output arrays, which
  // don't react to identity changes — a fresh mount does.
  return <Stage key={compact ? "compact" : "desktop"} geo={compact ? COMPACT : DESKTOP} />;
}

function Stage({ geo }: { geo: Geo }) {
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

  // Fit the stage into the viewport (transform only — no reflow).
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () =>
      setScale(Math.min(1, (innerWidth - 16) / geo.sw, (innerHeight - 32) / geo.sh));
    fit();
    addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, [geo]);

  // The visitor's own Scene 1 numbers, read once the scene is entered.
  const [personal, setPersonal] = useState<{ n: string; s: string | null } | null>(null);
  const readRef = useRef(false);
  useMotionValueEvent(progress, "change", (v) => {
    if (v <= 0.005 || readRef.current) return;
    readRef.current = true;
    try {
      const n = localStorage.getItem("ii.commands");
      if (n) setPersonal({ n, s: localStorage.getItem("ii.seconds") });
    } catch {}
  });

  // ——— The frame: one screen, forty years ———
  const fx = useTransform(progress, P, geo.frame.x);
  const fy = useTransform(progress, P, geo.frame.y);
  const fw = useTransform(progress, P, geo.frame.w);
  const fh = useTransform(progress, P, geo.frame.h);
  const fr = useTransform(progress, P, spread(0, 2, 14, 14, 14));
  const fbg = useTransform(progress, P, spread("#000000", "#111113", "#0d0d10", "#0d0d10", "#0d0d10"));
  const fo = useTransform(progress, P, spread(1, 1, 1, 0, 0));

  // Era dressing opacities.
  const termO = useTransform(progress, P, spread(1, 0, 0, 0, 0));
  const guiO = useTransform(progress, P, spread(0, 1, 0, 0, 0));
  // The search field materializes a beat AFTER the frame has dissolved
  // — the first interface that arrives from nowhere.
  const searchO = useTransform(progress, [0.66, 0.74, 0.82, 0.92], [0, 1, 1, 0]);
  const predCapO = useTransform(progress, P, spread(0, 0, 0, 0, 1));

  // GUI pointer: it travels to the photograph, then the row lights up.
  const ptrX = useTransform(progress, [0.26, 0.36], geo.ptrX);
  const ptrY = useTransform(progress, [0.26, 0.36], geo.ptrY);
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
  const caretO = useTransform(progress, [0.66, 0.74, 0.82, 0.92], [0, 1, 1, 0]);

  // The GUI preview window: the photograph at 1-bit fidelity, opened
  // by the pointer's double-click.
  const previewO = useTransform(progress, [0.365, 0.385, 0.41, 0.44], [0, 1, 1, 0]);

  // Representation bands for the file objects.
  const tileO = useTransform(progress, P, spread(0, 0, 1, 0, 0));
  const photoO = useTransform(progress, P, spread(0, 0, 1, 1, 1));
  // The photograph sharpens into its full render as prediction arrives.
  const photoFullO = useTransform(progress, P, spread(0, 0, 0, 0, 1));

  // Era captions — sequenced with dead zones so two never overlap.
  const cap0O = useTransform(progress, [0, 0.16, 0.19], [1, 1, 0]);
  const cap1O = useTransform(progress, [0.23, 0.26, 0.4, 0.43], [0, 1, 1, 0]);
  const cap2O = useTransform(progress, [0.48, 0.51, 0.62, 0.65], [0, 1, 1, 0]);
  const cap3O = useTransform(progress, [0.7, 0.73, 0.82, 0.85], [0, 1, 1, 0]);

  // The attention ledger — same windows, top of the stage.
  const led0O = cap0O;
  const led1O = cap1O;
  const led2O = cap2O;
  const led3O = cap3O;
  const led4O = useTransform(progress, [0.88, 0.92], [0, 1]);

  const ledgerLines: Array<[MotionValue<number>, string]> = [
    [led0O, personal ? simplification.personalLedger(personal.n, personal.s) : simplification.ledger[0]],
    [led1O, simplification.ledger[1]],
    [led2O, simplification.ledger[2]],
    [led3O, simplification.ledger[3]],
    [led4O, simplification.ledger[4]],
  ];

  return (
    <section ref={ref} data-scene={2} aria-label="The Great Simplification" className="relative h-[500vh]">
      <h2 className="sr-only">The Great Simplification</h2>
      <p className="sr-only">{simplification.srNarrative}</p>

      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        <div
          aria-hidden
          className="relative"
          style={{ width: geo.sw, height: geo.sh, transform: `scale(${scale})` }}
        >
          {/* ——— The attention ledger ——— */}
          {ledgerLines.map(([o, text], i) => (
            <Ledger key={i} o={o}>
              {text}
            </Ledger>
          ))}

          {/* ——— The frame ——— */}
          <m.div
            className="absolute border border-line"
            style={{ x: fx, y: fy, width: fw, height: fh, borderRadius: fr, background: fbg, opacity: fo }}
          >
            {/* GUI title bar — System 1984: pinstripes, close box left */}
            <m.div
              style={{ opacity: guiO }}
              className="relative flex h-6 items-center border-b border-line px-2"
            >
              <div
                className="absolute inset-x-7 top-1/2 h-3 -translate-y-1/2"
                style={{
                  background:
                    "repeating-linear-gradient(to bottom, var(--line) 0px, var(--line) 1px, transparent 1px, transparent 3px)",
                }}
              />
              <span className="relative z-10 h-2.5 w-2.5 border border-ink-dim bg-[#111113]" />
              <span className="relative z-10 mx-auto bg-[#111113] px-2 font-mono text-[0.6875rem] tracking-[0.08em] text-ink-dim">
                {simplification.guiTitle}
              </span>
              <span className="relative z-10 w-2.5" />
            </m.div>
          </m.div>

          {/* ——— Terminal dressing ——— */}
          <m.div
            style={{ opacity: termO, left: geo.term1[0], top: geo.term1[1] }}
            className="absolute font-mono text-[0.8125rem] leading-none text-ink-dim"
          >
            <div>&gt; LIST</div>
            <div className="mt-[13px]">3 FILES.</div>
          </m.div>
          <m.div
            style={{ opacity: termO, left: geo.term2[0], top: geo.term2[1] }}
            className="absolute font-mono text-[0.8125rem] leading-none text-ink"
          >
            <span className="text-accent">&gt; </span>OPEN BEACH.PIC
            <span className="cursor-blink ml-1 inline-block h-[0.9em] w-[0.5em] translate-y-[0.1em] bg-accent" />
          </m.div>

          {/* GUI column header */}
          <m.div
            style={{ opacity: guiO, left: geo.colHeader[0], top: geo.colHeader[1], width: geo.colHeader[2] }}
            className="absolute flex justify-between border-b border-line pb-1 font-mono text-[0.625rem] tracking-[0.08em] text-ink-faint"
          >
            <span>NAME</span>
            <span>SIZE</span>
          </m.div>

          {/* GUI status line */}
          <m.div
            style={{ opacity: guiO, left: geo.guiStatus[0], top: geo.guiStatus[1] }}
            className="absolute font-mono text-[0.6875rem] text-ink-faint"
          >
            {simplification.guiStatus}
          </m.div>

          {/* The preview: the photograph, finally seen — at one bit. */}
          <m.div
            style={{
              opacity: previewO,
              left: geo.preview[0],
              top: geo.preview[1],
              width: geo.preview[2],
              height: geo.preview[3],
            }}
            className="absolute overflow-hidden border border-line bg-[#111113] p-1"
          >
            <div className="h-[calc(100%-16px)] w-full overflow-hidden">
              <Photo era="dither" />
            </div>
            <div className="pt-1 text-center font-mono text-[0.625rem] tracking-[0.08em] text-ink-faint">
              BEACH.PIC
            </div>
          </m.div>

          {/* GUI row glow behind the photograph's row */}
          <m.div
            style={{
              opacity: rowGlow,
              left: geo.rowGlow[0],
              top: geo.rowGlow[1],
              width: geo.rowGlow[2],
              height: geo.rowGlow[3],
            }}
            className="absolute bg-[rgba(232,230,227,0.07)]"
          />

          {/* ——— The three files: persistent objects ——— */}
          <Entity
            progress={progress}
            geo={geo.A}
            o={spread(1, 1, 1, 0, 0)}
            label="LETTER.TXT"
            progressBands={{ mono: termO, row: guiO, tile: tileO }}
          />
          <Entity
            progress={progress}
            geo={geo.B}
            o={spread(1, 1, 1, 0, 0)}
            label="NOTES.TXT"
            progressBands={{ mono: termO, row: guiO, tile: tileO }}
          />
          <Entity
            progress={progress}
            geo={geo.C}
            o={spread(1, 1, 1, 1, 1)}
            label="BEACH.PIC"
            isPhoto
            progressBands={{ mono: termO, row: guiO, tile: tileO, photo: photoO, photoFull: photoFullO }}
          />

          {/* Touch: the tap ring on the photograph */}
          <m.div
            style={{ opacity: tapO, scale: tapS, x: geo.tap[0], y: geo.tap[1] }}
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
            style={{ opacity: searchO, left: geo.search[0], top: geo.search[1], width: geo.search[2] }}
            className="absolute flex h-11 items-center rounded-full border border-line bg-surface px-5 font-mono text-[0.8125rem] text-ink"
          >
            <m.span>{typed}</m.span>
            <m.span
              style={{ opacity: caretO }}
              className="cursor-blink ml-0.5 inline-block h-[1em] w-px bg-ink-dim"
            />
          </m.div>

          {/* The search era gets a floor: proof the machine looked. */}
          <m.div
            style={{ opacity: searchO, left: geo.searchMeta[0], top: geo.searchMeta[1], width: geo.searchMeta[2] }}
            className="absolute text-center font-mono text-[0.625rem] tracking-[0.14em] text-ink-faint"
          >
            1 RESULT · 0.02 SEC
          </m.div>

          {/* ——— Prediction caption: the machine, speaking human ——— */}
          <m.p
            style={{ opacity: predCapO, top: geo.predCapY }}
            className="absolute left-0 w-full text-balance text-center font-serif text-[1.05rem] font-light italic text-ink-dim"
          >
            {simplification.predictionCaption}
          </m.p>

          {/* Era captions */}
          <Caption o={cap0O}>{simplification.captions[0]}</Caption>
          <Caption o={cap1O}>{simplification.captions[1]}</Caption>
          <Caption o={cap2O}>{simplification.captions[2]}</Caption>
          <Caption o={cap3O}>{simplification.captions[3]}</Caption>

          {/* No takeaway here — the ledger already said it. */}
        </div>
      </div>
    </section>
  );
}

function Ledger({ o, children }: { o: MotionValue<number>; children: React.ReactNode }) {
  return (
    <m.p
      style={{ opacity: o }}
      className="absolute top-0 left-0 w-full text-center font-mono text-[0.625rem] tracking-[0.14em] text-ink-faint"
    >
      {children}
    </m.p>
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
  geo: EntityGeo;
  o: Ten<number>;
  label: string;
  isPhoto?: boolean;
  progressBands: {
    mono: MotionValue<number>;
    row: MotionValue<number>;
    tile: MotionValue<number>;
    photo?: MotionValue<number>;
    photoFull?: MotionValue<number>;
  };
}

/**
 * One file, forty years. The box is continuous — position and shape
 * interpolate across eras — while its interior dissolves between
 * representations: mono listing → window row → photograph, whose own
 * fidelity improves era by era.
 */
function Entity({ progress, geo, o, label, isPhoto, progressBands }: EntityProps) {
  const mx = useTransform(progress, PE, geo.x);
  const my = useTransform(progress, PE, geo.y);
  const mw = useTransform(progress, PE, geo.w);
  const mh = useTransform(progress, PE, geo.h);
  const mr = useTransform(progress, PE, spread(0, 0, 8, 8, 8));
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

      {/* Photograph (touch era onward, sharpening) or touch-tile doc */}
      {isPhoto && progressBands.photo ? (
        <>
          <m.span style={{ opacity: progressBands.photo }} className="absolute inset-0">
            <Photo era="indexed" />
          </m.span>
          {progressBands.photoFull && (
            <m.span style={{ opacity: progressBands.photoFull }} className="absolute inset-0">
              <Photo era="full" />
            </m.span>
          )}
        </>
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
