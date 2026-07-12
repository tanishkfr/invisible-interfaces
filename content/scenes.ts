/**
 * All visitor-facing language lives here.
 * Editing copy must never require touching a component.
 */

export const opening = {
  line1: "You probably used hundreds of interfaces today.",
  line2: "You remember almost none of them.",
  scrollCue: "scroll",
};

export const sceneTitles = [
  "The Forgotten Interfaces",
  "Demanding Attention",
  "The Great Simplification",
  "When Software Started Remembering",
  "The Entrusted Task",
] as const;

/** Scene 1 â€” the terminal. All machine dialogue lives here. */
export const terminal = {
  task: "Find the photograph.",
  boot: ["READY."],
  files: {
    "LETTER.TXT": ["DEAR MARGARET,", "THE SEA WAS CALM TODAY.", "WISH YOU WERE HERE."],
    "NOTES.TXT": ["REMEMBER:", "PHOTOS END IN .PIC"],
    "BEACH.PIC": [
      "          .   \\  /",
      "         .--. (  )",
      "       ~(    )~`--'~",
      "     ~~~~`--'~~~~~~~~~",
      "  ~ ~~~ ~~~ ~~~~ ~~ ~~~",
      " .:.::.:.:::.::.:.::.:.:",
    ],
  } as Record<string, string[]>,
  listing: ["3 FILES.", "LETTER.TXT", "NOTES.TXT", "BEACH.PIC"],
  errors: {
    syntax: "?SYNTAX ERROR",
    noFile: (name: string) => `?FILE NOT FOUND: ${name}`,
    openWhat: "OPEN WHAT?",
    typeWhat: "TYPE WHAT?",
  },
  help: {
    first: "NO HELP AVAILABLE.",
    later: "COMMANDS: LIST, TYPE <FILE>, OPEN <FILE>, CLEAR",
  },
  hints: {
    list: "TRY: LIST",
    open: "TRY: OPEN <FILE>",
  },
  success: (n: number, s?: number) =>
    `DISPLAYED. THAT TOOK ${n} COMMAND${n === 1 ? "" : "S"}${s ? ` AND ${s} SECONDS` : ""}.`,
  stillWaiting: "STILL WAITING.",
  takeaway: "It demanded your complete attention. It always did.",
};

/** Scene 2 â€” the morph. One task, five paradigms. */
export const simplification = {
  /** Machine-voice captions naming the act of each era, dated honestly â€”
   * search predates touch as technology; the sequence is the order in
   * which each became the dominant way of finding things. */
  captions: [
    "TYPE WHERE IT IS Â· 1978",
    "POINT AT IT Â· 1984",
    "TOUCH IT Â· 2007",
    "ASK FOR IT Â· SINCE 1998",
    "",
  ],
  guiTitle: "PHOTOS",
  guiStatus: "3 items Â· 231K in disk Â· 168K available",
  /** The attention ledger â€” the cost of the same task, per era.
   * Terminal-era values are replaced by the visitor's own when known. */
  ledger: [
    "22 KEYSTROKES Â· 7 DECISIONS Â· ~90 SEC Â· TYPICAL",
    "6 CLICKS Â· 4 DECISIONS Â· ~20 SEC Â· TYPICAL",
    "1 TAP Â· 1 DECISION Â· ~5 SEC Â· TYPICAL",
    "5 KEYSTROKES Â· 1 DECISION Â· ~4 SEC Â· TYPICAL",
    "0 INPUT Â· 0 DECISIONS Â· ATTENTION: YOURS AGAIN.",
  ],
  personalLedger: (n: string, s: string | null) =>
    `${n} COMMANDS Â· ${s ? `${s} SEC` : "~90 SEC"} â€” YOURS`,
  searchQuery: "beach",
  /** The machine's first sentence in the human voice. */
  predictionCaption: "From this day, three years ago.",
  srNarrative:
    "The same task, five ways. First you type where the photograph is. " +
    "Then you point at it. Then you touch it. Then you ask for it. " +
    "Finally, the photograph simply appears before you ask. " +
    "Each paradigm asks a little less of you: the cost falls from " +
    "ninety seconds of typed commands to nothing at all.",
};

/** Scene 3 â€” software acting before being asked. */
export const remembering = {
  opening: "Then it stopped waiting to be asked.",
  login: {
    email: "j.appleseed@icloud.com",
    signedIn: "Signed in.",
  },
  reply: {
    incoming: "Are we still on for dinner?",
    // One evening threads the whole essay â€” the clocks must agree.
    suggested: "Yes â€” see you at 7:30.",
    label: "SUGGESTED",
  },
  calendar: {
    title: "Dinner",
    when: "Tomorrow Â· 7:30 PM",
    source: "ADDED FROM YOUR CONVERSATION",
  },
  memory: {
    caption: "A day at the shore â€” three years ago.",
    selfReference: (n: string) => `LAST TIME, THIS TOOK YOU ${n} COMMANDS.`,
    selfReferenceAbandoned: "YOU NEVER FOUND THE PHOTOGRAPH. IT FOUND YOU ANYWAY.",
  },
  /** The room's quiet ledger: what software did while you watched. */
  residue: ["SIGNED IN", "REPLIED", "ADDED TO CALENDAR"],
};

/** Scene 0 ambient fragments â€” everyday invisible interfaces. */
export type FragmentKind =
  | "faceid"
  | "otp"
  | "maps"
  | "spotify"
  | "package"
  | "calendar"
  | "airpods"
  | "autofill";

export interface FragmentSpec {
  kind: FragmentKind;
  /** Position on the field lattice, in percentages of the viewport. */
  x: number;
  y: number;
  /** Direction it drifts away when the visitor scrolls (recede vector). */
  vx: number;
  vy: number;
}

/**
 * Precomputed collision-free field placement (12Ã—8 lattice, see
 * VISUAL_SYSTEM.md Â§3). Center cells are left empty â€” the measure
 * belongs to the human voice.
 */
export const fragments: FragmentSpec[] = [
  { kind: "faceid", x: 16, y: 22, vx: -60, vy: -40 },
  { kind: "otp", x: 74, y: 18, vx: 70, vy: -50 },
  { kind: "maps", x: 12, y: 66, vx: -80, vy: 30 },
  { kind: "spotify", x: 78, y: 70, vx: 90, vy: 40 },
  { kind: "package", x: 30, y: 82, vx: -30, vy: 70 },
  { kind: "calendar", x: 66, y: 38, vx: 60, vy: -20 },
  { kind: "airpods", x: 26, y: 40, vx: -70, vy: -10 },
  { kind: "autofill", x: 60, y: 84, vx: 50, vy: 80 },
];
