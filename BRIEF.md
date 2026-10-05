# BRIEF — Elya Hut (كوخ إيلياء) digital menu

Accumulating rulebook. Re-read before every change. Append, never silently drop.

## A. Client decisions (approved 2026-10-05)
1. Latin name is **Elya Hut** (as on the gate and the cups). Applied to English item names too ("Eliaa" on their boards is not used).
2. Call button → 07 9090 1669. WhatsApp button → 07 9090 1666 (as on their Facebook page).
3. Hours: every day, 07:00–24:00, evaluated in Asia/Amman.
4. **No bakery/desserts section.** Cakes and croissants seen in photos stay out until the client gives names and prices.
5. **No people in any image.** Food and place only. This includes hands where avoidable.
6. **Language:** Arabic page; one button at the top switches the *whole page* to an English version. No inline bilingual lines.
7. No search (27 items, about three phone screens).
8. The two tea combos form a permanent section named **"شاي وكعك"** (wording from the wooden signpost at their gate).
9. QR points to `https://anaskasasbeh28.github.io/elya-hut-menu/`. Regenerate with `tools/make_qr.py`.
10. Do not use any AI-generated imagery from their posts (bougainvillea, window scenes). Only their design devices are reused.
11. Printed in-store boards beat the Instagram highlight when they disagree.
12. Keep it restrained ("تراثي قديم + راقي"). Lace curtains and damask wallpaper are deliberately not used, to avoid kitsch.
13. (rev 2) The page background is not plain: a faint repeating motif tile (`--tex-motifs`) of olive sprig with fruit, tatreez star, coffee bean, Shami wrought-iron scroll and tatreez diamond, in olive-deep at 12% opacity. Keep it faint. Never put it behind the sticky nav or inside cards.
14. (rev 2) Tapping a dish that has a photo opens that photo in a popup (photo, name, price). Dishes without a photo stay plain rows, with no empty state. The owner will send photos for the rest; add them with `tools/add_photo.py`.
15. (rev 2) Prices are frozen as-is until Anas confirms them with the owner. Don't touch them.
16. (rev 3) A printed one-page A4 menu (single-sided) exists in `print/`, with three proposals for the owner to choose from (#1 paper, #2 motifs + frame + signpost titles, #3 olive). It must look hand-designed, not AI: no generated imagery, only their own devices. It reads from `js/menu-data.js`, the same single source as the digital menu. Never hard-code items in print.html.

## B. Engineering rules
1. `overflow-x: clip` on html/body, never `hidden`, which kills the sticky signpost nav.
2. Phone digit groups are joined with U+00A0 (no-break space) in `menu-data.js`, plus `dir="ltr"` on the number span.
3. Every colour lives in `css/tokens.css`, including textures (tatreez band, grain) as data URIs. `<meta name="theme-color">` is filled from `--paper` by JS. `tools/make_qr.py` reads `--ink` and `--paper` from tokens.css.
4. Use logical properties everywhere. **Sole exception:** the signpost arrow shape (`.sign` padding + `clip-path`) is physical and points right in both languages, like the real signs.
5. Western digits everywhere (as on all their boards). Arabic-Indic only in "منذ ٢٠٢٦", which copies the logo lockup.
6. No emoji as UI.
7. Menu content exists only in `js/menu-data.js`, loaded with `<script>`, not `fetch` (which fails on file://).
8. The SVG sprite is inline in `index.html` and sized 0×0, never `display:none`, because the `#chipped` filter needs to render.
9. `clip-path` goes on `.sign::after`, never on the focusable link, so the focus outline isn't clipped.
10. Centre the signpost strip with auto margins on the first and last `li`, never `justify-content:center`, which would make the scroll start unreachable on phones.
11. Centre the active sign with `scrollBy` using a rect delta (RTL-safe). Never `scrollIntoView`, which scrolls the page.
12. Sign text is olive-deep on wood at 3.4:1. That is only allowed because it is ≥19px bold (large text). Do not shrink it.
13. Fonts are self-hosted woff2, with no `<link rel=preload>` and no CDN.
14. Content never depends on animation. Motion is limited to smooth scroll and the popup fade-in, and both are disabled under `prefers-reduced-motion`.
15. Dish photos are a key, not a path: `photo: "pie"` → `assets/img/items/pie.webp` (192 square thumb) + `assets/img/items/large/pie.webp` (4:3). Always create both with `tools/add_photo.py`.
16. The photo popup is a native `<dialog>` with `showModal()`. A photo row is a `<button>` (thumb `alt=""`, visually hidden "عرض الصورة"); the large image carries the real alt. On close, focus returns to the row.
17. `html.is-locked { overflow: hidden }` applies only while the popup is open (scroll position verified unchanged). It is the only place `overflow: hidden` may touch html.
18. `::backdrop` gets its own copy of `--backdrop` in tokens.css, because older browsers don't inherit custom properties into it.
19. The motif tile was never drawn with a stem and base under the scroll: that read as a wine glass. Keep the scroll as a free-floating double curl.

## C. Sources (every visual decision is traceable)
| Element | Source in client material |
|---|---|
| `--olive #625e2c` | Logo coffee bean: 3 painted tones fill 79% of the bean box. Same family in aprons, painted signposts, sign plate |
| `--olive-deep #4a471e` | Solid panels on the "كعك مع شاي" post (86% of panel) |
| `--ink #3a2b14` | Headings and prices on their menu posts (#45340d / #362515 / #423008), logo wordmark |
| `--paper #e0d5c1`, `--paper-deep #d7c8b1` | Textured paper behind the logo |
| `--tatreez #721820`, `--tatreez-deep #560e13` | Framed cross-stitch embroidery in the hallway (video 5) |
| `--butter #f4e18e` | Printed "إبريق شاي" A-frame poster at the gate (87% of its background) |
| `--gold #bf993f` | Chipped gold edge of the "كُوخ إيلياء" sign plate inside |
| `--wood #c4924e`, `--wood-deep #845a3e` | Hand-painted arrow signposts and stained gate posts |
| `--gingham #265238` | Green check napkins under the pie (5+ shots), ka'ak basket lining |
| Body font Baloo Bhaijaan 2 | Matches the Arabic on their printed counter boards (tested side by side) |
| Calligraphic Amiri | Stand-in for the brush naskh on the sign plate and the vowelled "إِبْرِيقُ شَايٍ" poster |
| Signpost nav | Wooden arrows at the gate ("العائلة · قهوة · شاي وكعك · كوخ إيلياء"), including the nail hole |
| Sprigs around section titles | All three IG menu pages, plus leaf corners on the printed poster |
| Hairline rules between items | Both printed counter boards |
| Hand-drawn price oval with 3 sparks | Printed teapot poster |
| Olive panel + offset outline frame | "كعك مع شاي" post |
| Square logo stamp (footer) | Cups, sandwich flag, paper wraps |
| Tatreez band | Framed embroidery, plus the striped woven cushions outside |
| Olive plate with chipped gold edge | Interior sign above the counter |
| Paper grain | Logo paper |
| Background motifs | Olive sprig (their menu sprigs + olive-green brand), tatreez star (framed embroidery), coffee bean (logo), wrought-iron scroll (railings beside the gate, blue railing in the night story), tatreez diamond |
| Popup card | Same olive panel + butter price oval + gingham strip as the offer cards |

## D. Contrast (measured)
| Pair | Ratio |
|---|---|
| ink on paper | 9.4 |
| olive-deep on paper (titles, prices) | 6.5 |
| ink-soft (78%) on paper | 5.3 |
| paper on olive-deep (cards, active sign) | 6.5 |
| paper @82% on olive-deep (offer sub-line) | 5.0 |
| butter on olive-deep (price oval) | 7.2 |
| olive-deep on wood (signs, ≥19px bold only) | 3.4 |
| tatreez on paper (focus ring) | 7.7 |

## E. Change log
- 2026-10-05: v1 built. Phase-1 identity report approved with one change (rule A6: AR page + EN toggle).
- 2026-10-05 rev 3: device matrix (`tools/qa_devices.py`, 12 devices × 2 languages, all pass); printed menu, 3 proposals (`print/`, `tools/render_print.py`). Added tokens `--tex-tatreez-light`, `--rule-light`.
- 2026-10-05 rev 2: (1) heritage motif background; (2) tap a dish → photo popup. Added `tools/add_photo.py`. Photos now on 6 dishes (new: Iced Americano, Turkey & Cheese — the latter is an inferred match). Americano thumbnail now shows the hot cup only.
