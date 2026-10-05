/* Builds the printed menu from ../js/menu-data.js (same data as the digital menu).
   Theme comes from the URL hash: #1 paper · #2 motifs + signposts · #3 olive. */
(function () {
  "use strict";
  var D = window.ELYA_MENU;
  var theme = (location.hash || "#1").replace("#", "");
  if (["1", "2", "3"].indexOf(theme) < 0) theme = "1";
  document.body.className = "t" + theme;

  var SVGNS = "http://www.w3.org/2000/svg";
  function h(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }
  function use(id, cls, vb) {
    var svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("viewBox", vb); svg.setAttribute("class", cls); svg.setAttribute("aria-hidden", "true");
    var u = document.createElementNS(SVGNS, "use"); u.setAttribute("href", "#" + id); svg.appendChild(u);
    return svg;
  }
  function price(n) { return Number(n).toFixed(2); }
  function byId(id) { for (var i = 0; i < D.sections.length; i++) if (D.sections[i].id === id) return D.sections[i]; }

  function section(id) {
    var s = byId(id);
    var box = h("section", "ps");
    var title = h("h2", "ps__title");
    title.appendChild(use("sprig", "sprig sprig--start", "0 0 58 26"));
    var words = h("span", "ps__words");
    words.appendChild(h("span", "ps__ar", s.title.ar));
    words.appendChild(h("span", "ps__en", s.title.en));
    title.appendChild(words);
    title.appendChild(use("sprig", "sprig sprig--end", "0 0 58 26"));
    box.appendChild(title);
    var ul = h("ul", "pl");
    s.items.forEach(function (it) {
      var li = h("li", "pi");
      li.appendChild(h("span", "pi__ar", it.name.ar));
      li.appendChild(h("span", "pi__en", it.name.en));
      var p = h("span", "pi__price", price(it.price)); p.setAttribute("dir", "ltr");
      li.appendChild(p);
      ul.appendChild(li);
    });
    box.appendChild(ul);
    return box;
  }

  document.getElementById("col-a").appendChild(section("coffee"));
  document.getElementById("col-a").appendChild(section("iced-coffee"));
  document.getElementById("col-b").appendChild(section("drinks"));
  document.getElementById("col-b").appendChild(section("food"));

  // tea & ka'ak combos
  var tk = byId("tea-kaak");
  var combos = document.getElementById("combos");
  var ct = h("h2", "ps__title combos__title");
  ct.appendChild(use("sprig", "sprig sprig--start", "0 0 58 26"));
  var w = h("span", "ps__words"); w.appendChild(h("span", "ps__ar", tk.title.ar)); w.appendChild(h("span", "ps__en", tk.title.en));
  ct.appendChild(w);
  ct.appendChild(use("sprig", "sprig sprig--end", "0 0 58 26"));
  combos.appendChild(ct);
  var row = h("div", "combos__row");
  tk.items.forEach(function (it) {
    var card = h("div", "combo");
    var text = h("div", "combo__text");
    text.appendChild(h("p", "combo__ar", it.name.ar));
    if (it.sub) text.appendChild(h("p", "combo__sub", it.sub.ar));
    text.appendChild(h("p", "combo__en", it.name.en));
    card.appendChild(text);
    var pr = h("p", "combo__price");
    pr.appendChild(use("oval", "oval", "0 0 140 80"));
    var n = h("span", "combo__num", price(it.price)); n.setAttribute("dir", "ltr");
    pr.appendChild(n);
    pr.appendChild(h("span", "combo__cur", "دينار"));
    card.appendChild(pr);
    row.appendChild(card);
  });
  combos.appendChild(row);

  // footer
  var c = D.contact, pf = document.getElementById("pf");
  function line(cls, ar, en) {
    var p = h("p", cls);
    p.appendChild(h("span", "pf__ar", ar));
    if (en) { var e = h("span", "pf__en", en); e.setAttribute("dir", "ltr"); p.appendChild(e); }
    return p;
  }
  pf.appendChild(line("pf__line", c.address.ar, "Jabal Al‑Weibdeh, Amman"));
  pf.appendChild(line("pf__line", c.hours.ar, c.hours.en));
  var contact = h("p", "pf__line pf__contact");
  var tel = h("span", "pf__num", c.phoneDisplay); tel.setAttribute("dir", "ltr");
  var ig = h("span", "pf__num", "@kukhelia.jo"); ig.setAttribute("dir", "ltr");
  contact.appendChild(tel); contact.appendChild(h("span", "pf__dot", "·")); contact.appendChild(ig);
  pf.appendChild(contact);
  pf.appendChild(h("p", "pf__pets", D.brand.pets.ar));
})();
