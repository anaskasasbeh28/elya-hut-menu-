#!/usr/bin/env python3
"""
Add (or replace) a dish photo in one step.

    pip install pillow
    python tools/add_photo.py path/to/photo.jpg pie

Writes two files from one original:
    assets/img/items/pie.webp         square thumbnail (192 px) for the menu row
    assets/img/items/large/pie.webp   4:3 photo (up to 1200 px wide) for the tap-to-view popup

Then, in js/menu-data.js, give the dish   photo: "pie"   and an  alt  text.
Use a short English key with no spaces (pie, iced-latte, halloumi-sourdough...).
Both crops are centred; if the dish is off-centre, crop the original first.
"""
import pathlib
import sys

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Missing package. Run:  pip install pillow")

ROOT = pathlib.Path(__file__).resolve().parent.parent
THUMB = 192
LARGE_MAX_W = 1200


def centre_crop(im: Image.Image, ratio: float) -> Image.Image:
    w, h = im.size
    if w / h > ratio:  # too wide
        nw = round(h * ratio)
        x = (w - nw) // 2
        return im.crop((x, 0, x + nw, h))
    nh = round(w / ratio)
    y = (h - nh) // 2
    return im.crop((0, y, w, y + nh))


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, key = pathlib.Path(sys.argv[1]), sys.argv[2].strip()
    if not src.exists():
        sys.exit(f"Not found: {src}")
    if not key or any(c in key for c in " /\\."):
        sys.exit("The key must be one short word with no spaces, slashes or dots, e.g. pie")

    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")

    items = ROOT / "assets" / "img" / "items"
    (items / "large").mkdir(parents=True, exist_ok=True)

    large = centre_crop(im, 4 / 3)
    if large.width > LARGE_MAX_W:
        large = large.resize((LARGE_MAX_W, round(LARGE_MAX_W * 3 / 4)), Image.LANCZOS)
    large.save(items / "large" / f"{key}.webp", quality=82, method=6)

    thumb = centre_crop(im, 1).resize((THUMB, THUMB), Image.LANCZOS)
    thumb.save(items / f"{key}.webp", quality=82, method=6)

    print(f"OK  {key}: thumb {THUMB}x{THUMB}, large {large.width}x{large.height}")
    if large.width < 700:
        print("    note: the original is small; the popup will look soft. A bigger photo is better.")
    print(f'    now add to the dish in js/menu-data.js:  photo: "{key}", alt: {{ ar: "...", en: "..." }}')


if __name__ == "__main__":
    main()
