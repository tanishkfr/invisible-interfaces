"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { m, useInView, useReducedMotion } from "motion/react";
import MachineText from "@/components/systems/MachineText";
import { terminal } from "@/content/scenes";

type Voice = "machine" | "error" | "hint" | "user" | "art";

interface Line {
  id: number;
  text: string;
  voice: Voice;
  /** Already fully printed (no teletype cadence on re-render). */
  committed: boolean;
}

const VOICE_CLASS: Record<Voice, string> = {
  machine: "text-ink-dim",
  error: "text-accent [text-shadow:0_0_12px_rgba(232,163,61,0.35)]",
  hint: "text-ink-faint",
  user: "text-ink",
  art: "text-ink-dim whitespace-pre",
};

/** ms of machine latency before it answers. The 1970s were not instant. */
const LATENCY = 450;
/** Idle ms before the machine offers a dim hint. Frustration is the
 * lesson; abandonment is failure — mercy arrives early. */
const IDLE_HINT = 8000;

/**
 * Scene 1 — Demanding Attention.
 *
 * A literal machine. The visitor must find the photograph; the machine
 * gives nothing away and answers exactly what was asked. Friction is
 * the lesson — the hints exist only to keep frustration from becoming
 * abandonment, and they speak in the machine's own voice.
 */
export default function Scene1Terminal() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.25 });
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const [booted, setBooted] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [queue, setQueue] = useState<Omit<Line, "id" | "committed">[]>([]);
  const [typing, setTyping] = useState<Line | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [touched, setTouched] = useState(false);
  const [invite, setInvite] = useState(false);

  // The machine's memory of this visitor — read again in Scene 3.
  const state = useRef({
    commands: 0,
    syntaxErrors: 0,
    helpAsked: false,
    listed: false,
    hinted: { list: false, open: false },
    lastActivity: Date.now(),
    startedAt: 0,
    warnedLeaving: false,
  });

  const print = useCallback((texts: Array<[string, Voice]>) => {
    setQueue((q) => [...q, ...texts.map(([text, voice]) => ({ text, voice }))]);
  }, []);

  // Feed the queue through the teletype, one line at a time.
  const typingRef = useRef<Line | null>(null);
  useEffect(() => {
    if (typing || queue.length === 0) return;
    const [next, ...rest] = queue;
    setQueue(rest);
    const line = { ...next, id: idRef.current++, committed: false };
    typingRef.current = line;
    setTyping(line);
  }, [queue, typing]);

  const commitTyping = useCallback(() => {
    const t = typingRef.current;
    typingRef.current = null;
    if (t) {
      setLines((ls) =>
        ls.some((l) => l.id === t.id) ? ls : [...ls, { ...t, committed: true }],
      );
    }
    setTyping(null);
  }, []);

  // Keep the latest line in view.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, typing, input]);

  // Power on when the room is entered.
  const boot = useCallback(() => {
    if (booted) return;
    setBooted(true);
    print(terminal.boot.map((t) => [t, "machine"] as [string, Voice]));
  }, [booted, print]);

  // The visitor scrolls away unsolved: the machine notes it, once, in
  // its own voice — and Scene 3 will remember the debt.
  useEffect(() => {
    const s = state.current;
    if (inView || !booted || done || s.warnedLeaving) return;
    s.warnedLeaving = true;
    print([[terminal.stillWaiting, "machine"]]);
    try {
      if (!localStorage.getItem("ii.commands")) {
        localStorage.setItem("ii.abandoned", "1");
      }
    } catch {}
  }, [inView, booted, done, print]);

  // A quiet invitation if the visitor arrives but never reaches for
  // the keyboard — not a rule, just the room asking to be entered.
  useEffect(() => {
    if (!booted || touched || done) return;
    const t = setTimeout(() => setInvite(true), 3000);
    return () => clearTimeout(t);
  }, [booted, touched, done]);

  // A dim hint when the visitor has been stuck in silence too long.
  useEffect(() => {
    if (!booted || done) return;
    const t = setInterval(() => {
      const s = state.current;
      if (Date.now() - s.lastActivity < IDLE_HINT) return;
      s.lastActivity = Date.now();
      if (!s.listed && !s.hinted.list) {
        s.hinted.list = true;
        print([[terminal.hints.list, "hint"]]);
      } else if (s.listed && !s.hinted.open) {
        s.hinted.open = true;
        print([[terminal.hints.open, "hint"]]);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [booted, done, print]);

  const respond = useCallback(
    (raw: string) => {
      const s = state.current;
      const cmd = raw.trim().toUpperCase();
      const out: Array<[string, Voice]> = [];
      const [verb, arg] = cmd.split(/\s+/, 2);

      if (cmd === "") {
        out.push(["READY.", "machine"]);
      } else if (verb === "HELP") {
        // The machine helps the way the era helped: eventually.
        out.push([s.helpAsked ? terminal.help.later : terminal.help.first, "machine"]);
        s.helpAsked = true;
      } else if (verb === "LIST" || verb === "DIR" || verb === "LS" || verb === "CATALOG") {
        s.listed = true;
        out.push(...terminal.listing.map((l) => [l, "machine"] as [string, Voice]));
      } else if (verb === "TYPE" || verb === "CAT" || verb === "READ") {
        if (!arg) out.push([terminal.errors.typeWhat, "error"]);
        else if (terminal.files[arg]) {
          out.push(...terminal.files[arg].map((l) => [l, "machine"] as [string, Voice]));
        } else out.push([terminal.errors.noFile(arg), "error"]);
      } else if (verb === "OPEN" || verb === "SHOW" || verb === "VIEW" || verb === "LOAD") {
        if (!arg) out.push([terminal.errors.openWhat, "error"]);
        else if (arg === "BEACH.PIC") {
          out.push(...terminal.files[arg].map((l) => [l, "art"] as [string, Voice]));
          const seconds = s.startedAt
            ? Math.max(1, Math.round((Date.now() - s.startedAt) / 1000))
            : undefined;
          out.push([terminal.success(s.commands, seconds), "machine"]);
        } else if (terminal.files[arg]) {
          out.push(...terminal.files[arg].map((l) => [l, "machine"] as [string, Voice]));
        } else out.push([terminal.errors.noFile(arg), "error"]);
      } else if (verb === "CLEAR" || verb === "CLS") {
        setLines([]);
        out.push(["READY.", "machine"]);
      } else {
        s.syntaxErrors += 1;
        out.push([terminal.errors.syntax, "error"]);
        // Two dead ends is friction; three is abandonment.
        if (s.syntaxErrors === 2 && !s.hinted.list && !s.listed) {
          s.hinted.list = true;
          out.push([terminal.hints.list, "hint"]);
        }
      }
      return { out, solved: verb.length > 0 && arg === "BEACH.PIC" && ["OPEN", "SHOW", "VIEW", "LOAD"].includes(verb) };
    },
    [],
  );

  const submit = useCallback(() => {
    // Turn-taking: the machine finishes speaking before it listens.
    if (busy || done || typing || queue.length > 0) return;
    const raw = input;
    setInput("");
    const s = state.current;
    s.lastActivity = Date.now();
    s.commands += raw.trim() === "" ? 0 : 1;
    setLines((ls) => [
      ...ls,
      { id: idRef.current++, text: `> ${raw.trim().toUpperCase()}`, voice: "user", committed: true },
    ]);
    setBusy(true);
    const { out, solved } = respond(raw);
    setTimeout(() => {
      print(out);
      setBusy(false);
      if (solved) {
        setDone(true);
        // The machine remembers across visits — that is the point.
        try {
          localStorage.setItem("ii.commands", String(s.commands));
          if (s.startedAt) {
            localStorage.setItem(
              "ii.seconds",
              String(Math.max(1, Math.round((Date.now() - s.startedAt) / 1000))),
            );
          }
          localStorage.removeItem("ii.abandoned");
        } catch {}
      }
    }, reduced ? 60 : LATENCY);
  }, [busy, done, typing, queue.length, input, print, reduced, respond]);

  return (
    <section
      ref={sectionRef}
      data-scene={1}
      aria-label="Demanding Attention"
      className="flex min-h-svh flex-col items-center justify-center px-6 py-[var(--pause-l)]"
    >
      <h2 className="sr-only">Demanding Attention</h2>

      {/* The human voice sets the task. The machine does the teaching. */}
      <m.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={boot}
        className="mb-10 text-balance font-serif text-[clamp(1.25rem,2.5vw,1.75rem)] font-light text-ink"
      >
        {terminal.task}
      </m.p>

      <m.div
        onClick={() => inputRef.current?.focus()}
        initial={{ opacity: 0 }}
        animate={{
          opacity: booted ? 1 : 0,
          boxShadow:
            booted && !touched && !done && !reduced
              ? [
                  "0 0 0px rgba(232,163,61,0)",
                  "0 0 14px rgba(232,163,61,0.16)",
                  "0 0 0px rgba(232,163,61,0)",
                ]
              : "0 0 0px rgba(232,163,61,0)",
        }}
        transition={{
          opacity: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
          boxShadow: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
        }}
        className="w-full max-w-2xl cursor-text border border-line bg-black p-5 focus-within:[outline:1px_solid_var(--accent)] focus-within:[outline-offset:4px] sm:p-7"
        style={{ borderRadius: "var(--r-0)" }}
      >
        {/* The faint bloom is the phosphor, not decoration: glyphs on
            this machine emit; they don't merely sit. */}
        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          className="h-[19rem] overflow-y-auto font-mono text-[0.8125rem] leading-[1.7] [text-shadow:0_0_10px_rgba(232,230,227,0.12)] sm:h-[21rem] sm:text-sm"
        >
          {lines.map((l) => (
            <div key={l.id} className={VOICE_CLASS[l.voice]}>
              {l.text || " "}
            </div>
          ))}
          {typing && (
            <div className={VOICE_CLASS[typing.voice]}>
              <MachineText text={typing.text} instant={!!reduced} onDone={commitTyping} />
            </div>
          )}

          {/* The prompt: the machine, waiting. Amber — it wants you. */}
          {booted && !typing && queue.length === 0 && !done && (
            <div className="text-ink">
              <span className="text-accent [text-shadow:0_0_12px_rgba(232,163,61,0.35)]">&gt; </span>
              {input.toUpperCase()}
              <span aria-hidden className="cursor-blink inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-accent [box-shadow:0_0_12px_rgba(232,163,61,0.45)]" />
            </div>
          )}

          {/* A quiet invitation — not an instruction, a room asking to
              be entered. Gone the instant the visitor reaches for it. */}
          {invite && !touched && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 text-ink-faint"
            >
              TYPE ANYTHING.
            </m.div>
          )}
        </div>

        {/* Real input, visually merged with the prompt line — the OS
            keyboard is a first-class instrument on touch. */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          disabled={done}
          onFocus={() => setTouched(true)}
          onChange={(e) => {
            state.current.lastActivity = Date.now();
            if (!state.current.startedAt) state.current.startedAt = Date.now();
            setTouched(true);
            setInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          aria-label="Terminal input. Type a command and press Enter."
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
          className="h-px w-px text-base opacity-0"
        />
      </m.div>

      {/* Release. Explanation only after the experience. */}
      <m.p
        initial={{ opacity: 0 }}
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
        aria-hidden={!done}
        className="mt-12 max-w-[34rem] text-balance text-center font-serif text-[clamp(1.1rem,2vw,1.35rem)] font-light italic text-ink-dim"
      >
        {terminal.takeaway}
      </m.p>
    </section>
  );
}
