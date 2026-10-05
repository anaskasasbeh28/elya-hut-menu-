#!/usr/bin/env python3
"""
Regenerate the table QR code for the Elya Hut menu.

    pip install qrcode pillow
    python tools/make_qr.py https://YOUR-USER.github.io/elya-hut-menu/

Writes:
    assets/img/qr.svg   (vector, for print shops)
    assets/img/qr.png   (1200 px, for Word/Canva/WhatsApp)

Colours are read from css/tokens.css (--ink on --paper), so the QR always
matches the brand. Error correction is "Q" (survives ~25% damage / stains).
Run it again any time the public URL changes, then reprint the table cards.
"""
import argparse
import pathlib
import re
import sys

try:
    import qrcode
    import qrcode.image.svg
except ImportError:
    sys.exit("Missing package. Run:  pip install qrcode pillow")

ROOT = pathlib.Path(__file__).resolve().parent.parent
DEFAULT_URL = "https://anaskasasbeh28.github.io/elya-hut-menu/"


def token(name: str, fallback: str) -> str:
    css = (ROOT / "css" / "tokens.css").read_text(encoding="utf-8")
    m = re.search(r"--" + re.escape(name) + r":\s*(#[0-9a-fA-F]{6})", css)
    return m.group(1) if m else fallback


def main() -> None:
    ap = argparse.ArgumentParser(description="Generate the menu QR code.")
    ap.add_argument("url", nargs="?", default=DEFAULT_URL, help="public URL of the menu")
    args = ap.parse_args()

    ink, paper = token("ink", "#000000"), token("paper", "#ffffff")
    out = ROOT / "assets" / "img"
    out.mkdir(parents=True, exist_ok=True)

    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_Q, border=4, box_size=10)
    qr.add_data(args.url)
    qr.make(fit=True)

    # PNG
    img = qr.make_image(fill_color=ink, back_color=paper).convert("RGB")
    img = img.resize((1200, 1200), resample=0)  # nearest-neighbour keeps edges crisp
    img.save(out / "qr.png")

    # SVG (single path, brand colours, scalable for print)
    matrix = qr.get_matrix()
    n = len(matrix)
    d = "".join(f"M{x} {y}h1v1h-1z" for y, row in enumerate(matrix) for x, on in enumerate(row) if on)
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n} {n}" shape-rendering="crispEdges">'
        f'<rect width="{n}" height="{n}" fill="{paper}"/><path fill="{ink}" d="{d}"/></svg>'
    )
    (out / "qr.svg").write_text(svg, encoding="utf-8")

    print(f"QR for {args.url}\n  -> {out / 'qr.svg'}\n  -> {out / 'qr.png'}")


if __name__ == "__main__":
    main()
