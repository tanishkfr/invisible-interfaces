export const acts = [
  { name: "The Command", verb: "Instruct", at: 0.08, title: "First, we learned its language.", detail: "Every action began with an instruction." },
  { name: "The Window", verb: "Point", at: 0.32, title: "Then, a place for everything.", detail: "What we had to remember, we could now see." },
  { name: "The Gesture", verb: "Touch", at: 0.59, title: "The distance became a touch.", detail: "The photograph stayed. The abstraction changed." },
  { name: "The Anticipation", verb: "Expect", at: 0.77, title: "It began to remember for us.", detail: "The same photograph, before we asked." },
  { name: "The Absence", verb: "Be", at: 1, title: "Less interface. Still a memory.", detail: "Out of attention does not mean out of responsibility." },
] as const;

export const v2Copy = {
  title: ["Invisible", "Interfaces"],
  eyebrow: "A STUDY IN HUMAN ATTENTION",
  description: "The task stays the same.\nEverything between us changes.",
  scroll: "SCROLL TO TRANSFORM",
  disclosure: "An illustrative exhibition. These relationships overlap; they are not a chronology of replacement. All interactions are staged locally.",
  narrative: "One beach photograph moves from typed instructions into a graphical window. The window turns through space and becomes a touch surface. Contextual suggestions gather around the photograph, then withdraw until the image remains by itself. Less visible operation can also move judgment out of sight.",
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
  touch: { title: "Memories", caption: "A day at the shore.", detail: "One photograph. Closer now." },
  contexts: [
    { label: "PHOTO LIBRARY / MEMORY", title: "A day at the shore.", detail: "Surfaced from your archive" },
    { label: "CONTEXT / RECOGNIZED", title: "Already here.", detail: "No search needed" },
    { label: "PRIVATE ARCHIVE", title: "Original preserved" },
  ],
  reading: { eyebrow: "THE INTERFACE CHANGES. THE QUESTION REMAINS.", title: "What does the invisible", question: "owe us?", replay: "Experience again ↑", original: "Visit the original exhibition ↗", brand: "INVISIBLE INTERFACES", author: "A study by Tanishk Salagame", phase: "PHASE 01 / CINEMATIC STUDY" },
};
