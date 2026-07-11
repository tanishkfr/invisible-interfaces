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
  "The Invisible Threshold",
  "Designing the Background",
] as const;

/** Scene 1 — the terminal. All machine dialogue lives here. */
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

/** Scene 2 — the morph. One task, five paradigms. */
export const simplification = {
  /** Machine-voice captions naming the act of each era, dated honestly —
   * search predates touch as technology; the sequence is the order in
   * which each became the dominant way of finding things. */
  captions: [
    "TYPE WHERE IT IS · 1978",
    "POINT AT IT · 1984",
    "TOUCH IT · 2007",
    "ASK FOR IT · SINCE 1998",
    "",
  ],
  guiTitle: "PHOTOS",
  guiStatus: "3 items · 231K in disk · 168K available",
  /** The attention ledger — the cost of the same task, per era.
   * Terminal-era values are replaced by the visitor's own when known. */
  ledger: [
    "22 KEYSTROKES · 7 DECISIONS · ~90 SEC · TYPICAL",
    "6 CLICKS · 4 DECISIONS · ~20 SEC · TYPICAL",
    "1 TAP · 1 DECISION · ~5 SEC · TYPICAL",
    "5 KEYSTROKES · 1 DECISION · ~4 SEC · TYPICAL",
    "0 INPUT · 0 DECISIONS · ATTENTION: YOURS AGAIN.",
  ],
  personalLedger: (n: string, s: string | null) =>
    `${n} COMMANDS · ${s ? `${s} SEC` : "~90 SEC"} — YOURS`,
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

/** Scene 3 — software acting before being asked. */
export const remembering = {
  opening: "Then it stopped waiting to be asked.",
  login: {
    email: "j.appleseed@icloud.com",
    signedIn: "Signed in.",
  },
  reply: {
    incoming: "Are we still on for dinner?",
    // One evening threads the whole essay — the clocks must agree.
    suggested: "Yes — see you at 7:30.",
    label: "SUGGESTED",
  },
  calendar: {
    title: "Dinner",
    when: "Tomorrow · 7:30 PM",
    source: "ADDED FROM YOUR CONVERSATION",
  },
  memory: {
    caption: "A day at the shore — three years ago.",
    selfReference: (n: string) => `LAST TIME, THIS TOOK YOU ${n} COMMANDS.`,
    selfReferenceAbandoned: "YOU NEVER FOUND THE PHOTOGRAPH. IT FOUND YOU ANYWAY.",
  },
  /** The room's quiet ledger: what software did while you watched. */
  residue: ["SIGNED IN", "REPLIED", "ADDED TO CALENDAR"],
};

/** Scene 4 — one intent, six invisible systems. */
export const threshold = {
  prompt: "Book dinner tomorrow",
  accept: "ENTER",
  systems: [
    "CALENDAR: THURSDAY FREE AFTER 7PM",
    "MAPS: 25 MINUTES AWAY",
    "TRAFFIC: LIGHT AT 7PM",
    "WEATHER: CLEAR EVENING",
    "RESERVATION: TABLE FOR TWO, 7:30",
    "REMINDER: SET FOR 7:05",
  ],
  outcome: "Dinner tomorrow, 7:30. You’ll need to leave by 7:05.",
  /** The choreography stage: the systems hang above the sentence's
   * baseline, never on it. Positions in % of the stage. */
  nodes: [
    { label: "CALENDAR", conclusion: "THU 7:30", x: 16, y: 12 },
    { label: "MAPS", conclusion: "25 MIN", x: 80, y: 10 },
    { label: "TRAFFIC", conclusion: "LIGHT", x: 87, y: 40 },
    { label: "WEATHER", conclusion: "CLEAR", x: 11, y: 42 },
    { label: "RESERVATION", conclusion: "TABLE FOR 2", x: 34, y: 60 },
    { label: "REMINDER", conclusion: "LEAVE 7:05", x: 66, y: 62 },
  ],
  /** Which systems feed which — the threads. */
  edges: [
    ["CALENDAR", "RESERVATION"],
    ["MAPS", "TRAFFIC"],
    ["TRAFFIC", "REMINDER"],
    ["WEATHER", "RESERVATION"],
  ] as Array<[string, string]>,
  hold: "HOLD TO SEE THE WORK",
  takeaway: "All of it was interface. You saw one sentence.",
};

/** Scene 5 — the questions that remain when the interface is gone. */
export const background = {
  opening: "Invisible still means designed.",
  questions: [
    { label: "TRUST", question: "How much should it do without asking?", example: "autofill" },
    { label: "CONTROL", question: "Who decided where you’re going?", example: "maps-live" },
    { label: "CONSENT", question: "When did you agree to this?", example: "otp" },
    { label: "TRANSPARENCY", question: "Should you have to see the work?", example: "redacted" },
    { label: "REVERSIBILITY", question: "Can you take it back?", example: "reply" },
  ] as const,
  takeaway: "The interfaces got quieter. The questions got louder.",
};

/**
 * The reveal — the essay reading your attention back to you. Every
 * template here is filled with a real, measured value (see
 * lib/attention.ts); nothing is invented. The branches are honest:
 * whatever you did, there is a true line for it.
 */
export const reveal = {
  opener: "Before you go —",
  intro: "this is where your attention went.",

  void: {
    waited: "YOU WAITED OUT THE DARK. FEW DO.",
    skipped: (s: string) => `YOU GAVE THE DARK ${s} SECONDS BEFORE YOU REACHED PAST IT.`,
  },
  terminal: {
    solved: (n: number, s: number | null) =>
      s
        ? `THE MACHINE TOOK ${n} COMMAND${n === 1 ? "" : "S"} AND ${s} SECONDS OF YOUR WHOLE ATTENTION.`
        : `THE MACHINE TOOK ${n} COMMAND${n === 1 ? "" : "S"} OF YOUR WHOLE ATTENTION.`,
    abandoned: "YOU LEFT THE MACHINE BEFORE IT ANSWERED. IT WAITED ANYWAY.",
    untouched: "YOU PASSED THE MACHINE WITHOUT TOUCHING IT.",
  },
  morph: {
    many: (n: number) => `YOU SCROLLED BACK THROUGH THE YEARS ${n} TIMES. YOU WANTED TO BE SURE.`,
    once: "YOU LOOKED BACK ONCE, TO BE SURE.",
    none: "THEN EACH INTERFACE ASKED FOR LESS. YOU DID NOT LOOK BACK.",
  },
  hold: {
    held: "YOU HELD THE HIDDEN WORK UP TO THE LIGHT.",
    trusted: "YOU LET THE SIX SYSTEMS STAY HIDDEN. YOU TRUSTED THE ONE SENTENCE.",
  },
  // The falsifiable claim. The essay commits to reading you — and
  // admits it when you proved it wrong.
  navigation: {
    framed: "There was a way to navigate when you arrived.",
    never: (faded: string) => `YOU NEVER USED IT. IT LEFT AT ${faded}.`,
    neverClose: "you are reading this without it.",
    stopped: (n: number, last: string) =>
      `YOU USED IT ${n === 1 ? "ONCE" : `${n} TIMES`}, LAST AT ${last} — THEN NEVER AGAIN.`,
    caught: (last: string) =>
      `YOU REACHED FOR IT AT ${last}. IT WAS ALREADY GONE. YOU WERE RIGHT TO STOP LOOKING.`,
  },
  ethicsFramed: "None of this left your browser.",
  ethics: "no server saw it. the closing tab is the only delete.",
};

export const epilogue = {
  line: "Interfaces haven’t disappeared.",
  line2: "They’ve disappeared from your attention.",
  /** The machine's only address to the visitor's future. */
  turn: "YOU’LL NOTICE ONE TONIGHT.",
  aboutLink: "ABOUT THIS ESSAY",
};

/** Scene 0 ambient fragments — everyday invisible interfaces. */
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
 * Precomputed collision-free field placement (12×8 lattice, see
 * VISUAL_SYSTEM.md §3). Center cells are left empty — the measure
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
