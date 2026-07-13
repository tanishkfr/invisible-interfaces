/**
 * A local, ephemeral attention ledger.
 *
 * The essay records only the interactions it later returns to the visitor:
 * opening patience, terminal effort, comparison, and navigation. Nothing is
 * transmitted, and sessionStorage makes closing the tab the deletion event.
 */

const started = typeof performance !== "undefined" ? performance.now() : 0;

let firstScrollAt: number | null = null;
let scrubBacks = 0;
let menuClicks = 0;
let lastMenuClickAt: number | null = null;
let menuFadedAt: number | null = null;

export interface AttentionSnapshot {
  voidWaitMs: number | null;
  solved: boolean;
  abandoned: boolean;
  commands: number | null;
  seconds: number | null;
  scrubBacks: number;
  menuClicks: number;
  lastMenuClickMs: number | null;
  menuFadedMs: number | null;
  totalMs: number;
}

export const attention = {
  markFirstScroll() {
    if (firstScrollAt === null) firstScrollAt = performance.now();
  },
  addScrubBack() {
    scrubBacks += 1;
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
      const commandCount = sessionStorage.getItem("ii.commands");
      if (commandCount) {
        commands = Number(commandCount);
        solved = true;
      }
      const elapsed = sessionStorage.getItem("ii.seconds");
      if (elapsed) seconds = Number(elapsed);
      abandoned = sessionStorage.getItem("ii.abandoned") === "1";
    } catch {}

    return {
      voidWaitMs: firstScrollAt !== null ? Math.max(0, firstScrollAt - started) : null,
      solved,
      abandoned,
      commands,
      seconds,
      scrubBacks,
      menuClicks,
      lastMenuClickMs: lastMenuClickAt !== null ? lastMenuClickAt - started : null,
      menuFadedMs: menuFadedAt !== null ? menuFadedAt - started : null,
      totalMs: now - started,
    };
  },
};

export function clockOf(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return minutes + ":" + String(seconds).padStart(2, "0");
}