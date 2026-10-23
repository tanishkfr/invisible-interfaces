import artifact from "@/content/v2-artifact.json";

/** One source, three faithful representations; v1's photograph is untouched. */
export default function PhotoArtifact({ era }: { era: "terminal" | "dither" | "full" }) {
  if (era === "terminal") return <pre className="v2-terminal-art">{artifact.ascii}</pre>;
  return (
    <img
      src={era === "dither" ? "/v2/shore-dither.png" : "/v2/shore.webp"}
      width={era === "dither" ? 240 : artifact.web_dimensions[0]}
      height={era === "dither" ? 160 : artifact.web_dimensions[1]}
      alt=""
      aria-hidden="true"
      decoding="async"
      fetchPriority="high"
      className={era === "dither" ? "v2-artifact-dither" : "v2-artifact-color"}
    />
  );
}
