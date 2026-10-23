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

## Director's cut refinement

The owner identified softness in the boat image. A built-in OpenAI image-tool
edit refined photographic detail while preserving the red boat, framing,
shoreline and headland. The selected output is preserved separately at
`assets/v2/shore-directors-cut.png`; the original above remains unchanged.

- Native dimensions: 1536×1024; 2,840,001 bytes. This is not a 3K/4K source.
- SHA-256: `a96b86220d48266e65649dd1d8bc9ebe0502db41ea845833787a8fd71b6830f2`.
- Tool output basename: `exec-ff523e36-b22d-4e9d-8a48-461bab8bf5d3.png`.
- The added detail is generated, not recovered historical information.

`scripts/derive_v2_artifact.py` now derives all eras from this refined source:
native-resolution lossless WebP (1,903,006 bytes), 240×160 grayscale with one-bit
Floyd–Steinberg dithering (4,482 bytes), and 48×20 luminance ASCII in
`content/v2-artifact.json`. The WebGL sheet samples the same WebP. Regenerate from
the repository root with Python/Pillow; no generation service is needed for
these deterministic derivatives.

Browser quality comparisons additionally found that permanent `will-change:
transform` hints on the photograph/world magnified a cached smaller raster in
Chromium. Removing those hints restored fine detail during enlargement. The
small WebGL sheet has its own 2× drawing buffer. The source refinement and this
rendering correction are separate changes; lossless encoding alone did not
resolve the observed browser softness.

The verbatim built-in edit prompt was:

> Use case: precise-object-edit. Asset type: the persistent photograph in a cinematic portfolio website. Image 1 is the edit target. Improve this image's photographic fidelity and fine detail while preserving its exact scene and composition: one weathered red wooden rowing boat in the lower left on a wet beach, soft sun at upper left, cloudy muted slate sky, shoreline sweeping toward a rocky headland on the right. Preserve the boat's shape, position, scale, red paint, horizon and headland silhouette. Render as a crisp, high-resolution natural coastal photograph with optically credible wood grain and paint chips, fine rope fibres, wet sand and pebbles, delicate sea foam, convincing distant rock detail and natural tonal transitions. Highest available resolution, landscape 3:2, ideally 3072 by 2048 or larger. The original is too soft and painterly; improve genuine-looking material detail without oversharpening or halos. Restrained slate blue, weathered red, warm grey sand. No added objects, people, buildings, lettering, frames or watermark. Do not change the camera framing or create a different boat.

Only `public/v2/shore.webp` and `shore-dither.png` are fetched by the exhibition;
the original and refined PNGs are source evidence. The persistent photograph
container changes fidelity with an interior dissolve. It is never replaced by
a different photograph between eras. V1's original authored image is untouched.

The reading room explicitly discloses generation and the authored simulation.
This record documents origin and transformations; it does not assert exclusive
copyright or offer a legal opinion about generated-image ownership.
