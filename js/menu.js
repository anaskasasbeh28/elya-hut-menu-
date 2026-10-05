/* =========================================================================
   Elya Hut — menu page behaviour
   - renders every section + item from js/menu-data.js (one source of truth)
   - Arabic / English toggle (whole page flips: lang, dir, text)
   - sticky signpost nav that knows which section you are in
   - live open/closed badge (js/hours.js, Amman time)
   ========================================================================= */
(function () {
  "use strict";

  var D = window.ELYA_MENU;
  var HOURS = window.ELYA_HOURS;
  var root = document.documentElement;
  var STORE_KEY = "elya-menu-lang";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var lang = pickInitialLang();
  var spy = null;
  var activeId = null;

  /* ---------- helpers ---------------------------------------------------- */
  function t(obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] != null ? obj[lang] : (obj.ar || "");
  }
  function lookup(path) {
    var o = D, keys = path.split(".");
    for (var i = 0; i < keys.length; i++) { if (o == null) return ""; o = o[keys[i]]; }
    return t(o);
  }
  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k) || attrs[k] == null) continue;
        if (k === "text") el.textContent = attrs[k];
        else if (k === "className") el.className = attrs[k];
        else el.setAttribute(k, attrs[k]);
      }
    }
    (kids || []).forEach(function (c) { if (c) el.appendChild(c); });
    return el;
  }
  var SVGNS = "http://www.w3.org/2000/svg";
  function icon(id, cls, viewBox) {
    var svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    if (viewBox) svg.setAttribute("viewBox", viewBox);
    if (cls) svg.setAttribute("class", cls);
    var use = document.createElementNS(SVGNS, "use");
    use.setAttribute("href", "#" + id);
    svg.appendChild(use);
    return svg;
  }
  function price(n) { return Number(n).toFixed(2); }

  function pickInitialLang() {
    var hash = (location.hash || "").replace("#", "");
    if (hash === "en" || hash === "ar") return hash;
    try {
      var saved = window.localStorage.getItem(STORE_KEY);
      if (saved === "en" || saved === "ar") return saved;
    } catch (e) { /* storage blocked: default */ }
    return "ar";
  }
  function saveLang() {
    try { window.localStorage.setItem(STORE_KEY, lang); } catch (e) { /* ignore */ }
    try { history.replaceState(null, "", location.pathname + location.search + "#" + lang); } catch (e) { /* file:// on some browsers */ }
  }

  /* ---------- static text ------------------------------------------------ */
  function renderText() {
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = t(D.ui.pageTitle);

    var nodes = document.querySelectorAll("[data-t]");
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = lookup(nodes[i].getAttribute("data-t"));

    var btn = document.getElementById("lang-toggle");
    btn.textContent = t(D.ui.langSwitch);
    btn.setAttribute("lang", lang === "ar" ? "en" : "ar");
    btn.setAttribute("aria-label", t(D.ui.langSwitchAria));

    document.getElementById("signposts").setAttribute("aria-label", t(D.ui.navLabel));
    document.getElementById("dish-close").setAttribute("aria-label", t(D.ui.close));

    var c = D.contact;
    document.getElementById("a-map").href = c.mapHref;
    document.getElementById("a-call").href = c.phoneHref;
    document.getElementById("a-wa").href = c.whatsappHref;
    document.getElementById("a-ig").href = c.instagramHref;
    document.getElementById("a-fb").href = c.facebookHref;
    document.getElementById("n-call").textContent = c.phoneDisplay;
    document.getElementById("n-wa").textContent = c.whatsappDisplay;
  }

  /* ---------- nav + sections --------------------------------------------- */
  function renderNav() {
    var list = document.getElementById("signposts-list");
    list.textContent = "";
    D.sections.forEach(function (s) {
      var a = h("a", { className: "sign", href: "#" + s.id, "data-id": s.id }, [h("span", { text: t(s.title) })]);
      a.addEventListener("click", onNavClick);
      list.appendChild(h("li", null, [a]));
    });
  }

  function renderSections() {
    var host = document.getElementById("sections");
    host.textContent = "";
    D.sections.forEach(function (s, si) {
      var title = h("h2", { className: "section__title", id: "h-" + s.id, tabindex: "-1" }, [
        icon("sprig", "sprig sprig--start", "0 0 58 26"),
        h("span", { text: t(s.title) }),
        icon("sprig", "sprig sprig--end", "0 0 58 26")
      ]);
      var body = s.kind === "offers" ? renderOffers(s, si) : renderItems(s);
      host.appendChild(h("section", { className: "section", id: s.id, "aria-labelledby": "h-" + s.id }, [title, body]));
    });
  }

  function renderOffers(s, si) {
    var wrap = h("div", { className: "offers" });
    s.items.forEach(function (it) {
      var img = h("img", {
        className: "offer__img", src: it.img, width: it.w, height: it.h, alt: t(it.alt),
        loading: si === 0 ? "eager" : "lazy", decoding: "async"
      });
      var priceEl = h("p", { className: "offer__price" }, [
        icon("oval", "oval", "0 0 140 80"),
        h("span", { className: "offer__num", dir: "ltr", text: price(it.price) }),
        h("span", { className: "offer__cur", text: t(D.ui.currency) })
      ]);
      var bodyKids = [h("h3", { className: "offer__name", text: t(it.name) })];
      if (it.sub) bodyKids.push(h("p", { className: "offer__sub", text: t(it.sub) }));
      bodyKids.push(priceEl);
      wrap.appendChild(h("article", { className: "offer" }, [
        img,
        h("div", { className: "offer__body" + (it.sub ? "" : " offer__body--solo") }, bodyKids),
        h("div", { className: "offer__gingham", "aria-hidden": "true" })
      ]));
    });
    return wrap;
  }

  function photoPaths(key) {
    return { thumb: "assets/img/items/" + key + ".webp", large: "assets/img/items/large/" + key + ".webp" };
  }

  function renderItems(s) {
    var ul = h("ul", { className: "items" });
    s.items.forEach(function (it) {
      var name = h("span", { className: "item__name", text: t(it.name) });
      var cost = h("span", { className: "item__price", dir: "ltr", text: price(it.price) });
      var row;
      if (it.photo) {
        // dishes with a photo: the whole row is a button that opens the photo
        var thumb = h("span", { className: "item__photo" }, [
          h("img", { className: "item__thumb", src: photoPaths(it.photo).thumb, width: 192, height: 192,
                     alt: "", loading: "lazy", decoding: "async" }),
          h("span", { className: "item__zoom" }, [icon("i-expand", null, "0 0 24 24")])
        ]);
        row = h("button", { type: "button", className: "item__row item__row--btn", "aria-haspopup": "dialog" },
          [thumb, name, cost, h("span", { className: "sr-only", text: t(D.ui.viewPhoto) })]);
        row.addEventListener("click", function () { openDish(it, row); });
      } else {
        row = h("div", { className: "item__row" }, [name, cost]);
      }
      ul.appendChild(h("li", { className: "item" + (it.photo ? " item--photo" : "") }, [row]));
    });
    return ul;
  }

  /* ---------- dish photo popup ------------------------------------------- */
  var dish = document.getElementById("dish");
  var dishImg = document.getElementById("dish-img");
  var lastTrigger = null;

  function openDish(it, trigger) {
    lastTrigger = trigger;
    dishImg.src = photoPaths(it.photo).large;
    dishImg.alt = t(it.alt) || t(it.name);
    document.getElementById("dish-name").textContent = t(it.name);
    document.getElementById("dish-num").textContent = price(it.price);
    root.classList.add("is-locked");
    if (typeof dish.showModal === "function") dish.showModal();
    else dish.setAttribute("open", "");
  }

  function closeDish() {
    if (typeof dish.close === "function") dish.close();
    else { dish.removeAttribute("open"); onDishClosed(); }
  }

  function onDishClosed() {
    root.classList.remove("is-locked");
    if (lastTrigger) { try { lastTrigger.focus({ preventScroll: true }); } catch (e) { lastTrigger.focus(); } }
  }

  document.getElementById("dish-close").addEventListener("click", closeDish);
  dish.addEventListener("close", onDishClosed);
  dish.addEventListener("click", function (e) { if (e.target === dish) closeDish(); }); // tap outside the card

  function onNavClick(e) {
    var id = this.getAttribute("data-id");
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    var heading = document.getElementById("h-" + id);
    if (heading && heading.focus) {
      try { heading.focus({ preventScroll: true }); } catch (err) { /* old browsers */ }
    }
    setActive(id);
  }

  /* ---------- scroll spy -------------------------------------------------- */
  function setActive(id) {
    if (id === activeId) return;
    activeId = id;
    var signs = document.querySelectorAll(".sign");
    for (var i = 0; i < signs.length; i++) {
      var on = signs[i].getAttribute("data-id") === id;
      if (on) {
        signs[i].setAttribute("aria-current", "true");
        var list = document.getElementById("signposts-list");
        // centre the active sign inside the horizontal strip only (never scroll the page)
        // (scrollBy with a rect delta works the same in RTL and LTR scroll containers)
        var r = signs[i].parentNode.getBoundingClientRect();
        var lr = list.getBoundingClientRect();
        var delta = (r.left + r.width / 2) - (lr.left + lr.width / 2);
        if (Math.abs(delta) > 4) {
          try { list.scrollBy({ left: delta, behavior: reduceMotion ? "auto" : "smooth" }); }
          catch (err) { list.scrollLeft += delta; }
        }
      } else {
        signs[i].removeAttribute("aria-current");
      }
    }
  }

  function setupSpy() {
    if (spy) spy.disconnect();
    if (!("IntersectionObserver" in window)) return;
    var visible = {};
    spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      for (var i = 0; i < D.sections.length; i++) {
        if (visible[D.sections[i].id]) { setActive(D.sections[i].id); break; }
      }
    }, { rootMargin: "-80px 0px -55% 0px", threshold: 0 });
    D.sections.forEach(function (s) { var el = document.getElementById(s.id); if (el) spy.observe(el); });
  }

  /* ---------- open / closed badge ---------------------------------------- */
  function updateStatus() {
    var el = document.getElementById("status");
    if (!el || !HOURS) return;
    var open = HOURS.isOpen(new Date());
    el.setAttribute("data-state", open ? "open" : "closed");
    el.querySelector(".status__text").textContent = t(open ? D.ui.open : D.ui.closed);
    el.hidden = false;
  }

  /* ---------- language toggle -------------------------------------------- */
  function render() {
    renderText();
    renderNav();
    renderSections();
    activeId = null;
    updateStatus();
    setupSpy();
  }

  function toggleLang() {
    var keep = activeId;
    var scrolled = window.scrollY > 200;
    lang = lang === "ar" ? "en" : "ar";
    saveLang();
    render();
    if (keep && scrolled) {
      var el = document.getElementById(keep);
      if (el) el.scrollIntoView({ block: "start" });
      setActive(keep);
    }
  }

  /* ---------- boot -------------------------------------------------------- */
  try {
    var themeColor = getComputedStyle(root).getPropertyValue("--paper").trim();
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta && themeColor) meta.setAttribute("content", themeColor);
  } catch (e) { /* cosmetic only */ }

  render();
  document.getElementById("lang-toggle").addEventListener("click", toggleLang);
  window.setInterval(updateStatus, 60 * 1000);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) updateStatus(); });
})();
