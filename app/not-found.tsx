/**
 * The machine's voice, one last place: the page that isn't there.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-black px-6 font-mono text-[0.8125rem] leading-relaxed">
      <p className="text-accent [text-shadow:0_0_12px_rgba(232,163,61,0.35)]">
        ?PAGE NOT FOUND
      </p>
      <p className="text-ink-faint">
        TRY:{" "}
        <a
          href="/"
          className="text-ink-dim underline decoration-[rgba(232,230,227,0.25)] underline-offset-4 transition-colors hover:text-ink"
        >
          GOING BACK
        </a>
      </p>
    </main>
  );
}
