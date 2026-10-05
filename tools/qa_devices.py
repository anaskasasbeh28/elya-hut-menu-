#!/usr/bin/env python3
"""
Responsive check across real device sizes (phones, tablets, laptops).

    pip install playwright
    python -m playwright install chromium      # once
    python tools/qa_devices.py                 # tests index.html from disk
    python tools/qa_devices.py https://anaskasasbeh28.github.io/elya-hut-menu/

For every device and both languages it checks:
  - no horizontal scroll
  - sticky signpost nav stays at the top after scrolling
  - every tap target (signs, rows with photos, buttons) is at least 44 px tall
  - body text is never smaller than 12 px
  - the dish photo popup fits inside the screen and closes again
  - no console errors, no broken images
Screenshots go to qa-shots/. Exit code 1 if anything fails.
"""
import pathlib
import sys

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = sys.argv[1] if len(sys.argv) > 1 else (ROOT / "index.html").as_uri()
OUT = ROOT / "qa-shots"
OUT.mkdir(exist_ok=True)

DEVICES = [
    # name,                      w,    h,   touch
    ("Small Android 320",        320,  640, True),
    ("iPhone SE",                375,  667, True),
    ("iPhone 14",                390,  844, True),
    ("Pixel 7",                  412,  915, True),
    ("iPhone 14 Pro Max",        430,  932, True),
    ("iPhone 14 landscape",      844,  390, True),
    ("iPad mini portrait",       768, 1024, True),
    ("iPad Air portrait",        820, 1180, True),
    ("iPad Pro 11 landscape",   1194,  834, True),
    ("Laptop 1280",             1280,  800, False),
    ("Laptop 1366",             1366,  768, False),
    ("Desktop 1920",            1920, 1080, False),
]

CHECKS_JS = """() => {
  const de = document.documentElement;
  const tooSmallTaps = [...document.querySelectorAll('.sign, .item__row--btn, .btn, .lang, .dish__close')]
    .filter(e => e.offsetParent !== null || e.closest('dialog') === null)
    .map(e => [e, e.getBoundingClientRect()])
    .filter(([e, r]) => r.height > 0 && r.height < 43.5)
    .map(([e, r]) => (e.className + ' ' + Math.round(r.height) + 'px'));
  const tinyText = [...document.querySelectorAll('p, span, a, dd, dt, h1, h2, h3, button')]
    .filter(e => e.childElementCount === 0 && e.textContent.trim() && e.getClientRects().length)
    .filter(e => parseFloat(getComputedStyle(e).fontSize) < 12)
    .map(e => e.textContent.trim().slice(0, 20));
  const broken = [...document.images].filter(i => i.getAttribute('src') && i.complete && i.naturalWidth === 0).map(i => i.src);
  return { hScroll: de.scrollWidth > de.clientWidth, tooSmallTaps, tinyText, broken };
}"""

failures = []
with sync_playwright() as p:
    browser = p.chromium.launch()
    for name, w, h, touch in DEVICES:
        for lang in ("ar", "en"):
            ctx = browser.new_context(viewport={"width": w, "height": h}, device_scale_factor=2,
                                      has_touch=touch, is_mobile=touch and w < 700)
            page = ctx.new_page()
            errors = []
            page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.goto(URL + ("#en" if lang == "en" else "#ar"))
            page.wait_for_timeout(500)
            page.evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager')")
            page.wait_for_timeout(300)
            tag = f"{name} [{lang}]"
            res = page.evaluate(CHECKS_JS)
            problems = []
            if res["hScroll"]: problems.append("horizontal scroll")
            if res["tooSmallTaps"]: problems.append("small tap targets: " + ", ".join(res["tooSmallTaps"][:4]))
            if res["tinyText"]: problems.append("text < 12px: " + ", ".join(res["tinyText"][:4]))
            if res["broken"]: problems.append("broken images: " + ", ".join(res["broken"]))
            page.screenshot(path=str(OUT / f"{name.replace(' ', '_')}_{lang}_top.png"))

            # sticky nav after scrolling
            page.mouse.wheel(0, 1500); page.wait_for_timeout(500)
            nav_top = page.evaluate("document.getElementById('signposts').getBoundingClientRect().top")
            if abs(nav_top) > 1: problems.append(f"nav not sticky (top={nav_top})")

            # popup fits and closes
            btn = page.locator(".item__row--btn").first
            btn.scroll_into_view_if_needed(); btn.click(); page.wait_for_timeout(400)
            box = page.evaluate("(() => { const r = document.getElementById('dish').getBoundingClientRect();"
                                " return [r.top, r.bottom, r.left, r.right, innerHeight, innerWidth]; })()")
            top, bottom, left, right, vh, vw = box
            if top < 0 or bottom > vh + 0.5 or left < 0 or right > vw + 0.5:
                problems.append(f"popup off-screen {[round(v) for v in box]}")
            page.screenshot(path=str(OUT / f"{name.replace(' ', '_')}_{lang}_popup.png"))
            page.keyboard.press("Escape"); page.wait_for_timeout(200)
            if page.evaluate("document.getElementById('dish').open"): problems.append("popup did not close")
            if errors: problems.append("console: " + "; ".join(errors[:3]))

            print(("FAIL " if problems else "ok   ") + tag + ("" if not problems else "  -> " + " | ".join(problems)))
            if problems: failures.append(tag)
            ctx.close()
    browser.close()

print(f"\n{len(DEVICES) * 2 - len(failures)}/{len(DEVICES) * 2} passed. Screenshots in {OUT}")
sys.exit(1 if failures else 0)
