/**
 * The instrument.
 *
 * This essay argues that interfaces disappear from your attention. An
 * argument about attention is worthless without a subject — so the
 * essay takes the only one it has: you. As you move through it, this
 * quiet object records how you spent your attention. Not to grade you.
 * To prove the thesis on the single person it can reach.
 *
 * Every signal here is real and measured. Nothing is invented, and
 * nothing is transmitted — no network, no analytics, no server. It
 * lives in this tab, for this hour, and the closing tab is the only
 * delete. That restraint is not incidental; it is the piece doing what
 * it critiques (measuring you invisibly) and then doing the honorable
 * thing (keeping it yours). The reveal says so out loud.
 */

const started = typeof performance !== "undefined" ? performance.now() : 0;

let firstScrollAt: number | null = null;
let scrubBacks = 0;
let held = false;
let menuClicks = 0;
let lastMenuClickAt: number | null = null;
let menuFadedAt: number | null = null;

export interface AttentionSnapshot {
  /** ms from arrival to the first scroll — patience in the dark. */
  voidWaitMs: number | null;
  /** From the terminal (persisted across the journey). */
  solved: boolean;
  abandoned: boolean;
  commands: number | null;
  seconds: number | null;
  /** Times the visitor scrubbed backward through the forty-year morph. */
  scrubBacks: number;
  /** Did they hold the hidden coordination up to the light. */
  held: boolean;
  /** The navigation — the falsifiable spine. */
  menuClicks: number;
  lastMenuClickMs: number | null;
  menuFadedMs: number | null;
  /** Total time in the essay. */
  totalMs: number;
}

export const attention = {
  markFirstScroll() {
    if (firstScrollAt === null) firstScrollAt = performance.now();
  },
  addScrubBack() {
    scrubBacks += 1;
  },
  markHeld() {
    held = true;
  },
  markMenuClick() {
    menuClicks += 1;
    lastMenuClickAt = performance.now();
  },
  markMenuFaded() {
    if (menuFadedAt === null) menuFadedAt = performance.now();
  },

  snapshot(): AttentionSnapshot {
    const now = performance.now();
    let commands: number | null = null;
    let seconds: number | null = null;
    let abandoned = false;
    let solved = false;
    try {
      const c = localStorage.getItem("ii.commands");
      if (c) {
        commands = Number(c);
        solved = true;
      }
      const s = localStorage.getItem("ii.seconds");
      if (s) seconds = Number(s);
      if (localStorage.getItem("ii.abandoned")) abandoned = true;
    } catch {}

    return {
      voidWaitMs: firstScrollAt !== null ? Math.max(0, firstScrollAt - started) : null,
      solved,
      abandoned,
      commands,
      seconds,
      scrubBacks,
      held,
      menuClicks,
      lastMenuClickMs: lastMenuClickAt !== null ? lastMenuClickAt - started : null,
      menuFadedMs: menuFadedAt !== null ? menuFadedAt - started : null,
      totalMs: now - started,
    };
  },
};

/** M:SS since arrival — the essay's own clock. */
export function clockOf(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
