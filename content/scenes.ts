/**
 * All visitor-facing language lives here.
 * Editing copy must never require touching a component.
 */

export const opening = {
  line1: "You probably used hundreds of interfaces today.",
  line2: "You probably remember almost none of them.",
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
    "LETTER.TXT": ["DEAR MARGARET,", "THE WEATHER HERE IS FINE.", "WISH YOU WERE HERE."],
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
  success: (n: number) => `DISPLAYED. THAT TOOK ${n} COMMAND${n === 1 ? "" : "S"}.`,
  takeaway: "It demanded your complete attention. It always did.",
};

/** Scene 2 — the morph. One task, five paradigms. */
export const simplification = {
  /** Machine-voice captions naming the act of each era. */
  captions: ["TYPE WHERE IT IS", "POINT AT IT", "TOUCH IT", "ASK FOR IT", ""],
  guiTitle: "PHOTOS",
  guiStatus: "3 items",
  searchQuery: "beach",
  /** The machine's first sentence in the human voice. */
  predictionCaption: "From this day, three years ago.",
  takeaway: "Each time, it asked a little less of you.",
  srNarrative:
    "The same task, five ways. First you type where the photograph is. " +
    "Then you point at it. Then you touch it. Then you ask for it. " +
    "Finally, the photograph simply appears before you ask. " +
    "Each paradigm asks a little less of you.",
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
    suggested: "Yes — see you at 7.",
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
  },
  takeaway: "You found the photograph once. Since then, it finds you.",
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
  hold: "HOLD TO SEE THE WORK",
  takeaway: "All of it was interface. You saw one sentence.",
};

/** Scene 5 — the questions that remain when the interface is gone. */
export const background = {
  opening: "Invisible still means designed.",
  questions: [
    { label: "TRUST", question: "How much should it do without asking?", example: "autofill" },
    { label: "CONTROL", question: "Who decided where you’re going?", example: "maps" },
    { label: "CONSENT", question: "When did you agree to this?", example: "otp" },
    { label: "TIMING", question: "Is now the right moment to interrupt?", example: "calendar" },
    { label: "TRANSPARENCY", question: "Should you have to see the work?", example: "syslog" },
    { label: "EXPLAINABILITY", question: "Could it tell you why?", example: "spotify" },
    { label: "REVERSIBILITY", question: "Can you take it back?", example: "reply" },
  ] as const,
  takeaway: "The interfaces got quieter. The questions got louder.",
};

export const epilogue = {
  line: "Interfaces haven’t disappeared.",
  line2: "They’ve disappeared from your attention.",
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
