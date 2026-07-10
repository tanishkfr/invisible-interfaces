import type { FragmentKind } from "@/content/scenes";

/**
 * Miniature renderings of everyday invisible interfaces.
 *
 * These are faithful, not stylized (handbook: historical accuracy over
 * aesthetics). Machine voice throughout: mono type, surface luminance,
 * ambient-era radius. They are built as code, not screenshots — a few
 * hundred bytes each.
 */

/** Every artifact keeps the family voice (surface, hairline, mono) but
 * its own physique — the field should feel found, not manufactured. */
function Shell({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`w-max max-w-[13rem] rounded-[var(--r-3)] border border-line bg-surface px-3.5 py-2.5 font-mono text-[0.6875rem] leading-relaxed tracking-[0.02em] text-ink-dim select-none ${className}`}
    >
      {children}
    </div>
  );
}

function FaceId() {
  // The one square object on the field — a prompt, not a notification.
  return (
    <Shell className="flex flex-col items-center gap-1.5 rounded-[var(--r-2)] px-5 py-4">
      <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden>
        <path d="M1 4V2.5A1.5 1.5 0 0 1 2.5 1H4M10 1h1.5A1.5 1.5 0 0 1 13 2.5V4M13 10v1.5a1.5 1.5 0 0 1-1.5 1.5H10M4 13H2.5A1.5 1.5 0 0 1 1 11.5V10" />
        <path d="M4.5 5.2v1M9.5 5.2v1M7 5.5v2.2h-.7M4.8 9.3c.6.6 1.4.9 2.2.9s1.6-.3 2.2-.9" />
      </svg>
      <span className="text-[0.625rem]">Face ID</span>
    </Shell>
  );
}

function Otp() {
  return (
    <Shell>
      <span className="block text-ink-faint">From Messages</span>
      <span className="text-ink">829 114</span>
    </Shell>
  );
}

function Maps() {
  // A toast — wide and low, built to be glanced at while driving.
  return (
    <Shell className="w-[14rem] max-w-[14rem]">
      <span className="flex items-center gap-2.5">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
          <path d="M6 0.5 11 11 6 8.5 1 11Z" />
        </svg>
        Rerouting…
        <span className="ml-auto text-[0.625rem] text-ink-faint">2 MIN FASTER</span>
      </span>
    </Shell>
  );
}

function Spotify() {
  return (
    <Shell>
      <span className="block text-ink-faint">Up next</span>
      <span>Holocene — Bon Iver</span>
    </Shell>
  );
}

function Package() {
  return (
    <Shell>
      <span className="block">Out for delivery</span>
      <span className="text-ink-faint">Arriving by 9 PM</span>
    </Shell>
  );
}

function Calendar() {
  return (
    <Shell>
      <span className="block">Leave by 7:05</span>
      <span className="text-ink-faint">Light traffic to dinner</span>
    </Shell>
  );
}

function AirPods() {
  // A pill — the shape of things that connect and vanish.
  return (
    <Shell className="rounded-full px-4 py-1.5">
      <span className="flex items-center gap-2">
        AirPods Connected
        <span className="text-ink-faint">87%</span>
      </span>
    </Shell>
  );
}

function Autofill() {
  return (
    <Shell>
      <span className="block text-ink-faint">Email</span>
      <span className="rounded-[2px] bg-[rgba(232,163,61,0.08)] px-1 text-ink">
        j.appleseed@icloud.com
      </span>
    </Shell>
  );
}

const registry: Record<FragmentKind, () => React.ReactNode> = {
  faceid: FaceId,
  otp: Otp,
  maps: Maps,
  spotify: Spotify,
  package: Package,
  calendar: Calendar,
  airpods: AirPods,
  autofill: Autofill,
};

export default function Fragment({ kind }: { kind: FragmentKind }) {
  const Artifact = registry[kind];
  return <Artifact />;
}
