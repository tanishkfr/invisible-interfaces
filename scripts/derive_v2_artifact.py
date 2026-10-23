"""Derive web, one-bit and terminal representations from the same authored image.

This changes encoding and fidelity only; it does not invent a second scene.
Run with Python Pillow from the repository root.
"""
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / "assets/v2/shore-directors-cut.png"
destination = ROOT / "public/v2"
destination.mkdir(parents=True, exist_ok=True)
image = Image.open(source).convert("RGB")
web = image.copy()
web.save(destination / "shore.webp", lossless=True, method=6)
small = ImageOps.grayscale(image.resize((240, 160), Image.Resampling.LANCZOS))
small.convert("1", dither=Image.Dither.FLOYDSTEINBERG).save(destination / "shore-dither.png", optimize=True)
chars = "@%#*+=-:. "
pixels = list(ImageOps.grayscale(image.resize((48, 20), Image.Resampling.LANCZOS)).getdata())
ascii_image = "\n".join("".join(chars[min(9, value * 10 // 256)] for value in pixels[row*48:(row+1)*48]) for row in range(20))
metadata = {
    "ascii": ascii_image,
    "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
    "source_dimensions": list(image.size),
    "web_dimensions": list(web.size),
    "provenance": "Generated photographic scene, detail-refined from the original v2 source with the built-in OpenAI image generation tool on 2026-10-23. Fictional scene; generated detail, not recovered historical information. Original retained in assets/v2/shore-original.png.",
}
(ROOT / "content/v2-artifact.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
print(json.dumps({"source": str(source), "source_sha256": metadata["source_sha256"], "files": {path.name: path.stat().st_size for path in destination.iterdir()}}, indent=2))
