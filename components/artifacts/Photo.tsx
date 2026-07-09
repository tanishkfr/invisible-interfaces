import { dither1bit, indexed } from "./photoData";

export type PhotoEra = "dither" | "indexed" | "full";

/**
 * The photograph, at the fidelity of its era. One composition — sun
 * upper-left, sea, shore — so recognition compounds as its rendering
 * improves: 1-bit dither (GUI era) → indexed color (touch/search) →
 * full render (prediction, memory). The terminal era's ASCII version
 * lives in content/scenes.ts as text, where it belongs.
 */
export default function Photo({ era }: { era: PhotoEra }) {
  if (era === "dither") {
    return (
      <img
        src={dither1bit}
        alt=""
        aria-hidden
        className="h-full w-full object-cover [image-rendering:pixelated]"
      />
    );
  }
  if (era === "indexed") {
    return (
      <img
        src={indexed}
        alt=""
        aria-hidden
        className="h-full w-full object-cover [image-rendering:pixelated]"
      />
    );
  }
  return <FullPhoto />;
}

/** The prediction-era render: the same scene, finally seen clearly. */
function FullPhoto() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 270" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="ph-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8DA2B6" />
          <stop offset="1" stopColor="#75899D" />
        </linearGradient>
        <radialGradient id="ph-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" stopColor="#E9DCB6" />
          <stop offset="1" stopColor="#E9DCB6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ph-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5D7488" />
          <stop offset="1" stopColor="#48596B" />
        </linearGradient>
        <filter id="ph-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.4 0.4 0.4 0 0" />
          <feComposite operator="over" in2="SourceGraphic" />
        </filter>
      </defs>
      <rect width="400" height="152" fill="url(#ph-sky)" />
      <circle cx="96" cy="52" r="46" fill="url(#ph-sun)" />
      <circle cx="96" cy="52" r="24" fill="#E9DCB6" />
      <rect y="150" width="400" height="64" fill="url(#ph-sea)" />
      <path d="M0 150 Q50 144 100 150 T200 150 T300 150 T400 150 V160 Q350 166 300 160 T200 160 T100 160 T0 160 Z" fill="#66809A" opacity="0.8" />
      <path d="M0 176 Q60 171 120 176 T240 176 T360 176 L400 176 V183 Q340 188 280 183 T160 183 T40 183 L0 183 Z" fill="#54687C" opacity="0.7" />
      <rect y="212" width="400" height="58" fill="#C3B398" />
      <path d="M0 212 Q80 206 160 212 T400 210 V220 H0 Z" fill="#D0C2A6" />
      <path d="M0 236 Q100 232 200 236 T400 234 V240 H0 Z" fill="#BBA98D" opacity="0.6" />
      <rect width="400" height="270" fill="transparent" filter="url(#ph-grain)" opacity="0.05" />
    </svg>
  );
}
