# V2 photographic artifact provenance

Created on 2026-10-23 with the built-in OpenAI image generation tool for this
project. The scene is fictional and generated, not a historical archive or a
photograph supplied by a real participant. No stock service, external photo,
reference image, logo or identifiable person was used.

The art direction requested a restrained documentary image of a weathered,
faded-red rowing boat on wet sand, slate sea and a distant headland, with pale
overcast coastal light, natural grain and an unposed archival feeling. The red
boat, long shoreline and headland were chosen to remain recognizable at file
scale and in the final composition. This describes the generation direction,
not a verbatim prompt transcript or a claim of historical provenance.

The original generated file is preserved at `assets/v2/shore-original.png`:

- Dimensions: 1536×1024; 2,653,734 bytes.
- SHA-256: `c4be19972db30cca92741cb0b303ec7358b5e93ac3f58d7964c7587aa8f56a64`.
- Tool output basename: `exec-43f962b9-526e-47af-9554-3d960a8fe86f.png`.

`scripts/derive_v2_artifact.py` makes all representations from that one original
using Pillow. It resizes without changing the scene: WebP quality 86 at 1400×933,
240×160 grayscale with one-bit Floyd–Steinberg dithering, and 48×20 luminance
ASCII stored in `content/v2-artifact.json`. The script also records the source
hash and generated-scene disclosure. Regenerate from the repository root with
Python and Pillow; no generation service is needed for derivatives.

Only `public/v2/shore.webp` and `shore-dither.png` are fetched by the exhibition;
the high-resolution original is source evidence. The persistent photograph
container changes fidelity with an interior dissolve. It is never replaced by
a different photograph between eras. V1's original authored image is untouched.

The reading room explicitly discloses generation and the authored simulation.
This record documents origin and transformations; it does not assert exclusive
copyright or offer a legal opinion about generated-image ownership.
