export const EXHIBITION_DURATION = 140;
export const ACT_BOUNDARIES = [27, 55, 86, 118];
export const acts = [
  { name: "The Command", verb: "Instruct", at: 11.5 / 140, rest: 11.5, title: "First, we learned its language.", detail: "A photograph was a path to remember and an instruction to get right." },
  { name: "The Window", verb: "Point", at: 32 / 140, rest: 32, title: "Then, a place for everything.", detail: "Files became visible objects. A pointer could travel to what a person wanted." },
  { name: "The Gesture", verb: "Touch", at: 79 / 140, rest: 79, title: "The image followed our hands.", detail: "The same photograph moved with a gesture. Operation felt closer to the object itself." },
  { name: "The Anticipation", verb: "Expect", at: 106 / 140, rest: 106, title: "Before we asked.", detail: "A remembered context brought the photograph forward without navigating the archive again." },
  { name: "The Absence", verb: "Be", at: 1, rest: 140, title: "The interface leaves.\nThe memory stays.", detail: "Out of attention does not mean out of responsibility." },
] as const;

export const v2Copy = {
  title: ["Invisible", "Interfaces"],
  eyebrow: "A STUDY IN HUMAN ATTENTION",
  description: "The task stays the same.\nEverything between us changes.",
  scroll: "SCROLL TO TRANSFORM",
  disclosure: "An illustrative exhibition, not a chronology of replacement. The photographic scene was generated for this work. Every representation comes from that same image. The archive, gestures, and contextual memory are authored demonstrations; no inference or background task is running.",
  narrative: "One photograph of a red boat travels from an exact command into a spatial archive. The window turns, its frame becomes a touch surface, and the image follows a gesture. Later, context gathers before an explicit request. Finally, the controls withdraw and leave the photograph. Less visible operation can also move judgment out of sight.",
  wordmark: "invisible interfaces",
  edition: "AN INTERACTIVE EXHIBITION",
  about: "About ↗",
  skip: "Skip animation and read the story",
  sideNote: "ONE PHOTOGRAPH / FIVE RELATIONSHIPS",
  terminal: {
    heading: "MEMORY ARCHIVE",
    location: "LOCAL / 001",
    ready: "READY.",
    list: "LIST /MEMORIES",
    files: ["LETTER.TXT", "NOTES.TXT", "BEACH.PIC"],
    open: "OPEN BEACH.PIC",
    footnote: "ONE MEMORY. EXACT INSTRUCTIONS.",
  },
  gui: { title: "MEMORIES", archive: "ARCHIVE", files: ["Letter", "Notes", "Beach.pic"], count: "3 items", selected: "1 selected", note: "The sea was calm today.", letter: "Wish you were here." },
  touch: { title: "Memories", caption: "A day at the shore.", detail: "MOVE · RELEASE · REMEMBER" },
  contexts: [
    { label: "THE CONTEXT", title: "At the shore.", detail: "A place, held in memory" },
    { label: "THE CONNECTION", title: "The red boat.", detail: "A detail becomes a way back" },
    { label: "THE RESULT", title: "A moment, resurfaced.", detail: "Original preserved · nothing shared" },
  ],
  memory: { query: "the shore", completion: "/ the red boat", index: "PRIVATE ARCHIVE", sequence: ["KEPT", "OUT OF SIGHT", "REMEMBERED"] },
  reading: { eyebrow: "THE INTERFACE CHANGES. THE QUESTION REMAINS.", title: "What does the invisible", question: "owe us?", replay: "Experience again ↑", original: "Visit the original exhibition ↗", brand: "INVISIBLE INTERFACES", author: "A study by Tanishk Salagame", phase: "V2 / FIVE-ACT BETA" },
};
