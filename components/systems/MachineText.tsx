"use client";

import { useEffect, useRef, useState } from "react";

interface MachineTextProps {
  text: string;
  /** Skip the cadence entirely (reduced motion, or pre-committed lines). */
  instant?: boolean;
  onDone?: () => void;
  className?: string;
}

/**
 * The machine's voice. Text arrives character by character at teletype
 * cadence — quantized, unhurried, indifferent. Machine-era motion:
 * no easing, no fading; a character is or isn't.
 */
export default function MachineText({ text, instant, onDone, className }: MachineTextProps) {
  const [count, setCount] = useState(instant ? text.length : 0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (instant) {
      setCount(text.length);
      return;
    }
    setCount(0);
    doneRef.current = false;
    let n = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      // 1–2 chars per tick with slight jitter — a teletype, not a metronome.
      n = Math.min(text.length, n + (Math.random() < 0.3 ? 2 : 1));
      setCount(n);
      if (n < text.length) timer = setTimeout(tick, 14 + Math.random() * 22);
    };
    timer = setTimeout(tick, 20);
    return () => clearTimeout(timer);
  }, [text, instant]);

  useEffect(() => {
    if (count >= text.length && !doneRef.current) {
      doneRef.current = true;
      onDone?.();
    }
  }, [count, text.length, onDone]);

  return <span className={className}>{text.slice(0, count)}</span>;
}
