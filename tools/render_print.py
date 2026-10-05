#!/usr/bin/env python3
"""
Render the printed menu (print/print.html) to images and print-ready PDFs.
Content comes from js/menu-data.js, so after a price change just run this again.

    pip install playwright && python -m playwright install chromium   # once
    python tools/render_print.py            # 1080 px previews of all 3 proposals (for WhatsApp)
    python tools/render_print.py 2 --print  # proposal 2: A4 PDF (vector) + 300 dpi PNG for the print shop

Outputs go to print/out/.
"""
import pathlib
import sys

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGE = (ROOT / "print" / "print.html").as_uri()
OUT = ROOT / "print" / "out"
OUT.mkdir(parents=True, exist_ok=True)

A4_W_PX, A4_H_PX = 793.7, 1122.5          # A4 at 96 css px per inch
args = [a for a in sys.argv[1:] if not a.startswith("--")]
themes = args or ["1", "2", "3"]
for_print = "--print" in sys.argv

with sync_playwright() as p:
    browser = p.chromium.launch()
    for t in themes:
        scale = 2480 / A4_W_PX if for_print else 1080 / A4_W_PX   # 300 dpi or 1080 px wide
        ctx = browser.new_context(viewport={"width": 794, "height": 1123}, device_scale_factor=scale)
        page = ctx.new_page()
        page.goto(f"{PAGE}#{t}")
        page.wait_for_load_state("load")
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(400)
        overflow = page.evaluate("(() => { const s = document.getElementById('sheet');"
                                 " return s.scrollHeight - s.clientHeight; })()")
        if overflow > 1:
            print(f"WARNING proposal {t}: content is {overflow}px taller than A4, something is cut off")
        suffix = "print-300dpi" if for_print else "1080"
        png = OUT / f"menu-proposal-{t}-{suffix}.png"
        page.locator("#sheet").screenshot(path=str(png))
        print("wrote", png.relative_to(ROOT))
        if for_print:
            pdf = OUT / f"menu-proposal-{t}-A4.pdf"
            page.pdf(path=str(pdf), format="A4", print_background=True,
                     margin={"top": "0", "right": "0", "bottom": "0", "left": "0"})
            print("wrote", pdf.relative_to(ROOT))
        ctx.close()
    browser.close()
