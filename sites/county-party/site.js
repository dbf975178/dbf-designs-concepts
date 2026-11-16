/* Cedar County Democrats (concept): site behavior. Runs after shared.js and data.js. Nothing is sent anywhere. */
(function () {
  "use strict";
  var D = window.CP, doc = document, root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var renderers = [];
  var lang = function () { return root.getAttribute("lang") === "es" ? "es" : "en"; };
  var t = function (k, v) {
    var d = window.I18N || {}, s = (d[lang()] && d[lang()][k]) || (d.en && d.en[k]) || k;
    if (v) Object.keys(v).forEach(function (n) { s = s.split("{" + n + "}").join(v[n]); });
    return s;
  };
  var loc = function () { return lang() === "es" ? "es-US" : "en-US"; };
  var mk = function (y, m, d, hh, mm) { return new Date(y, m - 1, d, hh || 0, mm || 0); };
  var parseISO = function (s) { var p = s.split(/[-T:]/).map(Number); return mk(p[0], p[1], p[2], p[3] || 0, p[4] || 0); };
  var fmtDate = function (d, o) { return d.toLocaleDateString(loc(), o); };
  var fmtTime = function (d) { return d.toLocaleTimeString(loc(), { hour: "numeric", minute: "2-digit" }); };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var el = function (tag, cls, html) { var e = doc.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var icon = function (n) { return '<i class="ph ph-' + n + '" aria-hidden="true"></i>'; };
  var evTitle = function (e) { return e.title[lang()]; };
  var prec = function (id) { return D.precincts.filter(function (p) { return p.id === +id; })[0]; };

  /* Keep theme and language in step across pages (shared.js keys differ by folder depth). */
  (function sync() {
    var loc2 = location.pathname.split("/").filter(Boolean).slice(-2, -1).join(""), pk = "dbf:" + loc2, ck = "dbf:county-party";
    var copy = function () { try { ["theme", "lang"].forEach(function (s) { var v = localStorage.getItem(pk + ":" + s); if (v) localStorage.setItem(ck + ":" + s, v); }); } catch (e) {} };
    $$("[data-lang-btn],[data-theme-toggle]").forEach(function (b) { b.addEventListener("click", copy); });
    $$("[data-lang-btn]").forEach(function (b) { b.addEventListener("click", function () { renderers.forEach(function (f) { f(); }); }); });
  })();

  /* ICS download */
  var icsEsc = function (s) { return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n"); };
  var icsStamp = function (d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00"; };
  function downloadICS(id, title, start, end, place, desc) {
    var n = new Date();
    var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//DBF Designs//Cedar County Democrats concept//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
      "UID:" + id + "@cedar-county-concept.example", "DTSTAMP:" + n.getUTCFullYear() + pad(n.getUTCMonth() + 1) + pad(n.getUTCDate()) + "T" + pad(n.getUTCHours()) + pad(n.getUTCMinutes()) + "00Z",
      "DTSTART:" + icsStamp(start), "DTEND:" + icsStamp(end), "SUMMARY:" + icsEsc(title), "LOCATION:" + icsEsc(place), "DESCRIPTION:" + icsEsc(desc), "END:VEVENT", "END:VCALENDAR"];
    var blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    var a = doc.createElement("a"); a.href = URL.createObjectURL(blob); a.download = id + ".ics";
    doc.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }
  var evStart = function (e) { return parseISO(e.date + "T" + e.start); };
  var evEnd = function (e) { return parseISO(e.date + "T" + e.end); };
  var icsEvent = function (e) { downloadICS(e.id, evTitle(e), evStart(e), evEnd(e), e.place, e.desc[lang()]); };

  /* County map: 18 precinct polygons on a jittered lattice (6 columns x 3 rows). */
  var cells = [];
  (function geometry() {
    var s = 7, rnd = function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t2 = Math.imul(s ^ s >>> 15, 1 | s); t2 = t2 + Math.imul(t2 ^ t2 >>> 7, 61 | t2) ^ t2; return ((t2 ^ t2 >>> 14) >>> 0) / 4294967296; };
    var P = [];
    for (var j = 0; j <= 3; j++) { P[j] = []; for (var i = 0; i <= 6; i++) {
      var edge = i === 0 || i === 6 || j === 0 || j === 3, k = edge ? 26 : 16;
      var x = 60 + i * 100 + (rnd() - .5) * 2 * k, y = 50 + j * 140 + (rnd() - .5) * 2 * k;
      if (i === 0) x -= 10; if (i === 6) x += 10; if (j === 0) y -= 10; if (j === 3) y += 10;
      P[j][i] = [x, y];
    } }
    for (var r = 0; r < 3; r++) for (var c = 0; c < 6; c++) {
      var q = [P[r][c], P[r][c + 1], P[r + 1][c + 1], P[r + 1][c]];
      cells.push({ id: r * 6 + c + 1, pts: q.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "),
        cx: q.reduce(function (a, p) { return a + p[0]; }, 0) / 4, cy: q.reduce(function (a, p) { return a + p[1]; }, 0) / 4, grp: Math.floor((r * 6 + c) / 3) });
    }
  })();
  var NS = "http://www.w3.org/2000/svg";
  function svgEl(tag, attrs) { var e = doc.createElementNS(NS, tag); Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); }); return e; }
  function drawMap(svg, interactive, onPick) {
    var g = svgEl("g");
    cells.forEach(function (c, i) {
      var cell = svgEl("g", { "class": "cell" + (c.grp % 2 ? " alt" : ""), "data-id": c.id, style: "--i:" + i });
      cell.appendChild(svgEl("polygon", { "class": "base", points: c.pts }));
      cell.appendChild(svgEl("polygon", { "class": "ov", points: c.pts }));
      var tx = svgEl("text", { x: c.cx, y: c.cy }); tx.textContent = c.id; cell.appendChild(tx);
      if (interactive) {
        cell.setAttribute("tabindex", "0"); cell.setAttribute("role", "button");
        var p = prec(c.id); cell.setAttribute("aria-label", t("js.mapsel", { n: c.id, name: p.name }));
        cell.addEventListener("click", function () { onPick(c.id); });
        cell.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(c.id); } });
      }
      g.appendChild(cell);
    });
    svg.appendChild(g);
    svg.appendChild(svgEl("path", { "class": "river", d: "M 150 36 C 240 150, 330 120, 390 250 S 520 350, 610 496" }));
    var pins = svgEl("g"); svg.appendChild(pins);
    return {
      select: function (id, zipIds) {
        $$(".cell", svg).forEach(function (c) { var n = +c.getAttribute("data-id"); c.classList.toggle("is-hit", n === id); c.classList.toggle("is-zip", !!zipIds && zipIds.indexOf(n) > -1 && n !== id); });
        svg.classList.toggle("has-sel", !!id || !!(zipIds && zipIds.length));
        pins.innerHTML = "";
        if (id) {
          var c = cells[id - 1], pg = svgEl("g", { transform: "translate(" + c.cx.toFixed(1) + "," + (c.cy - 30).toFixed(1) + ")" });
          var ring = svgEl("circle", { "class": "pin-ring", r: 12, cx: 0, cy: 0, fill: "none", stroke: "#10285C", "stroke-width": 3 });
          var inner = svgEl("g", { "class": "pin-drop" });
          inner.appendChild(svgEl("circle", { r: 13, fill: "#10285C", stroke: "#FBFCFF", "stroke-width": 3 }));
          inner.appendChild(svgEl("circle", { r: 5, fill: "#F6B51E" }));
          pg.appendChild(ring); pg.appendChild(inner); pins.appendChild(pg);
        }
      },
      relabel: function () { $$(".cell", svg).forEach(function (c) { var p = prec(c.getAttribute("data-id")); c.setAttribute("aria-label", t("js.mapsel", { n: p.id, name: p.name })); }); }
    };
  }

  /* HOME */
  var mapHome = $("[data-county-map]:not(.interactive)");
  if (mapHome) drawMap(mapHome, false);

  var hz = $("[data-home-zip]");
  if (hz) hz.addEventListener("submit", function (e) {
    e.preventDefault();
    var z = hz.zip.value.trim(), er = $("[data-zip-err]", hz);
    if (!/^\d{5}$/.test(z)) { er.textContent = t("js.zipbad"); er.hidden = false; hz.zip.setAttribute("aria-invalid", "true"); hz.zip.focus(); return; }
    location.href = "find-your-precinct/?zip=" + z;
  });
  function today() { var n = new Date(); return mk(n.getFullYear(), n.getMonth() + 1, n.getDate()); }
  function upcoming() {
    var td = today(), fut = D.events.filter(function (e) { return parseISO(e.date) >= td; });
    return fut.length >= 1 ? fut : D.events.slice();
  }
  var upBox = $("[data-upcoming]");
  function renderHome() {
    if (!upBox) return;
    var list = upcoming();
    var dayN = $("[data-nm-day]");
    var m = list.filter(function (e) { return e.cat === "meeting"; })[0];
    if (m && dayN) {
      var s = evStart(m);
      dayN.textContent = s.getDate(); $("[data-nm-title]").textContent = evTitle(m);
      $("[data-nm-when]").textContent = t("js.nmwhen", { date: fmtDate(s, { weekday: "long", month: "long", day: "numeric" }), time: fmtTime(s), place: m.place });
      var lk = $("[data-nm-link]"); lk.href = "calendar/?event=" + m.id; lk.textContent = t("js.rsvp");
    }
    upBox.innerHTML = list.slice(0, 4).map(function (e) {
      var s = evStart(e);
      return '<div class="ev-row"><div class="ev-d">' + s.getDate() + "<small>" + esc(fmtDate(s, { weekday: "short" }).toUpperCase().replace(".", "")) + "</small></div><div><b>" + esc(evTitle(e)) + "</b><span>" + esc(fmtTime(s) + ", " + e.place) + '</span></div><a class="btn btn-primary btn-sm" href="calendar/?event=' + e.id + '">' + esc(t("js.rsvp")) + "</a></div>";
    }).join("");
  }
  if (upBox) { renderHome(); renderers.push(renderHome); }

  /* FIND */
  var ff = $("[data-finder]");
  if (ff) (function () {
    var svg = $(".map-svg.interactive"), out = $("#result"), state = null, map;
    var q = new URLSearchParams(location.search);
    map = drawMap(svg, true, function (id) { var p = prec(id); ff.zip.value = p.zip; ff.num.value = ""; clearErr(); show({ type: "hit", id: id, noscroll: false }); });
    var clearErr = function () { $$("[data-err]", ff).forEach(function (e) { e.hidden = true; }); ["zip", "num"].forEach(function (n) { ff[n].removeAttribute("aria-invalid"); }); };
    var err = function (n, m) { var e = $("[data-err=" + n + "]", ff); e.textContent = m; e.hidden = false; ff[n].setAttribute("aria-invalid", "true"); };
    function card() {
      if (!state) { out.innerHTML = ""; return; }
      var h = "", p;
      if (state.type === "hit") {
        p = prec(state.id); var ms = parseISO(p.meet);
        h = '<div class="result slide-in" tabindex="-1" id="rc"><span class="pid">' + esc(t("js.found")) + " " + p.id + "</span><h2>" + esc(p.name) + "</h2><dl>" +
          "<div><dt>" + esc(t("js.place")) + "</dt><dd>" + esc(p.place) + "<br>" + esc(p.addr) + ", " + p.zip + "</dd></div>" +
          "<div><dt>" + esc(t("js.hours")) + "</dt><dd>" + esc(t("js.hoursv")) + "</dd></div>" +
          "<div><dt>" + esc(t("js.captain")) + "</dt><dd>" + (p.captain ? esc(p.captain) : esc(t("js.nocap"))) + "</dd></div>" +
          "<div><dt>" + esc(t("js.meet")) + "</dt><dd>" + esc(fmtDate(ms, { weekday: "long", month: "long", day: "numeric" }) + ", " + fmtTime(ms) + ". " + p.place) + "</dd></div></dl>" +
          '<div class="acts"><button type="button" class="btn btn-primary btn-sm" data-ics>' + icon("download-simple") + esc(t("js.addcal")) + "</button>" +
          (p.captain ? "" : '<a class="btn btn-gold btn-sm" href="../get-involved/#captain">' + esc(t("js.volcap")) + "</a>") + "</div></div>";
      } else if (state.type === "zip") {
        var ps = D.precincts.filter(function (x) { return x.zip === state.zip; });
        h = '<div class="result slide-in" tabindex="-1" id="rc"><h2>' + esc(t("js.zipmany.h", { n: ps.length, zip: state.zip })) + "</h2><p>" + esc(t("js.zipmany")) + '</p><ul class="zip-list">' +
          ps.map(function (x) { return '<li><button type="button" data-pick="' + x.id + '">' + x.id + ". " + esc(x.name) + " &middot; " + esc(t("js.range", { lo: x.lo, hi: x.hi })) + "</button></li>"; }).join("") + "</ul></div>";
      } else {
        h = '<div class="result err slide-in" tabindex="-1" id="rc"><h2>' + esc(t(state.h)) + "</h2><p>" + esc(t(state.m, state.v)) + "</p></div>";
      }
      out.innerHTML = h;
      var rc = $("#rc", out);
      $$("[data-pick]", out).forEach(function (b) { b.addEventListener("click", function () { var id = +b.getAttribute("data-pick"); ff.num.value = ""; show({ type: "hit", id: id }); }); });
      var ib = $("[data-ics]", out);
      if (ib) ib.addEventListener("click", function () { var pp = prec(state.id), s = parseISO(pp.meet); downloadICS("precinct-" + pp.id, "Precinct " + pp.id + " meeting: " + pp.name, s, new Date(s.getTime() + 3600000), pp.place, "Monthly meeting of the " + pp.name + " precinct team."); });
      if (rc && !state.quiet) { rc.focus({ preventScroll: true }); if (window.innerWidth < 900) rc.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" }); }
    }
    function show(s) {
      state = s;
      if (s.type === "hit") { var p = prec(s.id); map.select(p.id, null); }
      else if (s.type === "zip") map.select(0, D.precincts.filter(function (x) { return x.zip === s.zip; }).map(function (x) { return x.id; }));
      else map.select(0, null);
      card();
    }
    ff.addEventListener("submit", function (e) {
      e.preventDefault(); clearErr();
      var z = ff.zip.value.trim(), n = ff.num.value.trim(), bad = false;
      if (!/^\d{5}$/.test(z)) { err("zip", t("js.zipbad")); bad = true; }
      if (n && !/^\d{1,5}$/.test(n)) { err("num", t("js.numbad")); bad = true; }
      if (bad) { ff[$("[data-err]:not([hidden])", ff).getAttribute("data-err")].focus(); return; }
      var inZip = D.precincts.filter(function (x) { return x.zip === z; });
      if (!inZip.length) return show({ type: "err", h: "js.zipunk.h", m: "js.zipunk", v: { zip: z } });
      if (!n) return show({ type: "zip", zip: z });
      var num = parseInt(n, 10), hit = inZip.filter(function (x) { return num >= x.lo && num <= x.hi; })[0];
      if (!hit) return show({ type: "err", h: "js.numunk.h", m: "js.numunk", v: { zip: z, num: n, lo: inZip[0].lo, hi: inZip[inZip.length - 1].hi } });
      show({ type: "hit", id: hit.id });
    });
    $$("input", ff).forEach(function (i) { i.addEventListener("input", function () { i.removeAttribute("aria-invalid"); var e2 = $("[data-err=" + i.name + "]", ff); if (e2) e2.hidden = true; }); });
    $$("[data-pid]").forEach(function (b) { b.addEventListener("click", function () { var id = +b.getAttribute("data-pid"); ff.zip.value = prec(id).zip; ff.num.value = ""; show({ type: "hit", id: id }); $(".finder").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); }); });
    renderers.push(function () { map.relabel(); card(); });
    if (q.get("p") && prec(q.get("p"))) { var pp = prec(q.get("p")); ff.zip.value = pp.zip; show({ type: "hit", id: pp.id, quiet: true }); }
    else if (q.get("zip")) { ff.zip.value = q.get("zip"); if (q.get("num")) ff.num.value = q.get("num"); ff.dispatchEvent(new Event("submit", { cancelable: true })); }
  })();

  /* CANDIDATES */
  var cdlg = $("#cand-dlg");
  if (cdlg) (function () {
    var cur = null;
    function fill() {
      if (!cur) return;
      var c = cur, L = lang();
      $("#cd-ini").textContent = c.ini; $("#cd-name").textContent = c.name;
      $("#cd-office").textContent = D.offices[c.office][L] + ", " + c.seat; $("#cd-bio").textContent = c.bio[L];
      $("#cd-pri").innerHTML = c.pri[L].map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
      $("#cd-end").innerHTML = c.end.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    }
    function open(id) {
      cur = D.candidates.filter(function (c) { return c.id === id; })[0]; if (!cur) return;
      fill(); if (cdlg.showModal) cdlg.showModal(); else cdlg.setAttribute("open", "");
    }
    $$(".cand").forEach(function (b) { b.addEventListener("click", function () { open(b.getAttribute("data-cand")); }); });
    renderers.push(fill);
    var h = location.hash.slice(1); if (h) open(h);
  })();

  /* CALENDAR */
  var cm = $("#cal-month");
  if (cm) (function () {
    var list = $("#cal-list"), label = $("[data-month-label]"), empty = $("[data-cal-empty]"), dlg = $("#ev-dlg"), body = $("#ev-body");
    var st = { y: 2026, m: 11, view: "month", f: "all" };
    var evId = new URLSearchParams(location.search).get("event");
    var first = D.events.filter(function (e) { return e.id === evId; })[0];
    var td = today(), hasMonth = function (y, m) { return D.events.some(function (e) { return e.date.slice(0, 7) === y + "-" + pad(m); }); };
    if (first) { st.y = +first.date.slice(0, 4); st.m = +first.date.slice(5, 7); }
    else if (hasMonth(td.getFullYear(), td.getMonth() + 1)) { st.y = td.getFullYear(); st.m = td.getMonth() + 1; }
    var narrow = window.matchMedia("(max-width:760px)");
    var monthEvents = function () { return D.events.filter(function (e) { return e.date.slice(0, 7) === st.y + "-" + pad(st.m) && (st.f === "all" || e.cat === st.f); }); };
    function render() {
      var d1 = mk(st.y, st.m, 1), L = lang();
      label.textContent = fmtDate(d1, { month: "long", year: "numeric" });
      var evs = monthEvents(); empty.hidden = evs.length > 0;
      var dows = ""; for (var i = 0; i < 7; i++) dows += '<div class="cal-dow" role="columnheader">' + esc(fmtDate(mk(2021, 1, 3 + i), { weekday: "short" })) + "</div>";
      var lead = d1.getDay(), dim = new Date(st.y, st.m, 0).getDate(), html = dows, cellsN = Math.ceil((lead + dim) / 7) * 7;
      for (var k = 0; k < cellsN; k++) {
        var dn = k - lead + 1, inM = dn >= 1 && dn <= dim;
        var dd = mk(st.y, st.m, dn), iso = dd.getFullYear() + "-" + pad(dd.getMonth() + 1) + "-" + pad(dd.getDate());
        var de = inM ? evs.filter(function (e) { return e.date === iso; }) : [];
        var isT = iso === td.getFullYear() + "-" + pad(td.getMonth() + 1) + "-" + pad(td.getDate());
        var a11y = narrow.matches && de.length ? ' tabindex="0" role="button" aria-label="' + esc(fmtDate(dd, { month: "long", day: "numeric" }) + ": " + de.map(evTitle).join(", ")) + '"' : "";
        html += '<div class="cal-day' + (inM ? "" : " out") + (isT ? " today" : "") + (de.length ? " has-ev" : "") + '" data-date="' + iso + '"' + a11y + '><span class="n">' + dd.getDate() + "</span>" +
          de.map(function (e) { return '<button type="button" class="cal-ev" data-cat="' + e.cat + '" data-id="' + e.id + '" title="' + esc(evTitle(e)) + '"' + (narrow.matches ? ' tabindex="-1" aria-hidden="true"' : "") + ">" + esc(fmtTime(evStart(e)).replace(":00", "").replace(" ", "").toLowerCase() + " " + evTitle(e)) + "</button>"; }).join("") + "</div>";
      }
      cm.innerHTML = '<div class="cal-grid" role="grid" aria-label="' + esc(label.textContent) + '">' + html + "</div>";
      list.innerHTML = evs.map(function (e) {
        var s = evStart(e);
        return '<div class="ev-row"><div class="ev-d">' + s.getDate() + "<small>" + esc(fmtDate(s, { weekday: "short" }).toUpperCase().replace(".", "")) + "</small></div><div><b>" + esc(evTitle(e)) + "</b><span>" + esc(fmtTime(s) + " to " + fmtTime(evEnd(e)) + ", " + e.place) + '</span></div><button type="button" class="btn btn-primary btn-sm" data-id="' + e.id + '">' + esc(t("js.rsvp")) + "</button></div>";
      }).join("");
      cm.hidden = st.view !== "month"; list.hidden = st.view !== "list";
    }
    function openEvents(arr) {
      body.innerHTML = arr.map(function (e) {
        var s = evStart(e);
        return '<section class="ev-sec" data-ev="' + e.id + '"><h2>' + esc(evTitle(e)) + '</h2><div class="ev-meta"><span>' + icon("calendar-blank") + esc(fmtDate(s, { weekday: "long", month: "long", day: "numeric", year: "numeric" })) + "</span><span>" + icon("clock") + esc(fmtTime(s) + " to " + fmtTime(evEnd(e))) + "</span><span>" + icon("map-pin") + esc(e.place) + "</span></div><p>" + esc(e.desc[lang()]) + "</p>" +
          '<div class="ev-acts"><button type="button" class="btn btn-primary btn-sm" data-act="rsvp">' + esc(t("js.rsvp")) + '</button><button type="button" class="btn btn-ghost btn-sm" data-act="ics">' + icon("download-simple") + esc(t("js.share")) + "</button></div>" +
          '<form class="rsvp" hidden novalidate><h3>' + esc(t("js.rsvph")) + '</h3><div class="field"><label for="rn-' + e.id + '">' + esc(window.I18N[lang()]["f.name"]) + '</label><input id="rn-' + e.id + '" name="name" autocomplete="name"><p class="field-error" data-e="name" hidden></p></div>' +
          '<div class="field"><label for="rm-' + e.id + '">' + esc(window.I18N[lang()]["f.email"]) + '</label><input id="rm-' + e.id + '" name="email" type="email" autocomplete="email"><p class="field-error" data-e="email" hidden></p></div>' +
          '<div class="field"><label for="rg-' + e.id + '">' + esc(t("js.guests")) + '</label><select id="rg-' + e.id + '" name="guests"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div>' +
          '<button class="btn btn-primary btn-sm" type="submit">' + esc(t("js.send")) + '</button></form><div class="success" data-ok hidden tabindex="-1"><p></p></div></section>';
      }).join("");
      dlg.setAttribute("aria-label", arr.map(evTitle).join(", "));
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    }
    body.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-act]"); if (!b) return;
      var sec = b.closest("[data-ev]"), e = D.events.filter(function (x) { return x.id === sec.getAttribute("data-ev"); })[0];
      if (b.getAttribute("data-act") === "ics") icsEvent(e);
      else { var f = $("form.rsvp", sec); f.hidden = !f.hidden; if (!f.hidden) $("input", f).focus(); }
    });
    body.addEventListener("submit", function (ev) {
      ev.preventDefault(); var f = ev.target, bad = null;
      var chk = function (n, m) { var er = $("[data-e=" + n + "]", f), v = f.elements[n].value.trim(); var msg = !v ? t("js.req") : (n === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? t("js.emailbad") : ""); er.textContent = msg; er.hidden = !msg; f.elements[n].setAttribute("aria-invalid", msg ? "true" : "false"); if (msg && !bad) bad = f.elements[n]; };
      chk("name"); chk("email"); if (bad) { bad.focus(); return; }
      var sec = f.closest("[data-ev]"), ok = $("[data-ok]", sec);
      $("p", ok).textContent = t("js.rsvpok", { name: f.elements.name.value.trim() }); f.hidden = true; ok.hidden = false; ok.focus();
    });
    cm.addEventListener("click", function (ev) {
      var chip = ev.target.closest(".cal-ev"), day = ev.target.closest(".cal-day.has-ev");
      if (chip && !narrow.matches) { openEvents(D.events.filter(function (e) { return e.id === chip.getAttribute("data-id"); })); }
      else if (day && narrow.matches) { openEvents(monthEvents().filter(function (e) { return e.date === day.getAttribute("data-date"); })); }
    });
    cm.addEventListener("keydown", function (ev) { var day = ev.target.closest(".cal-day.has-ev"); if (day && narrow.matches && (ev.key === "Enter" || ev.key === " ")) { ev.preventDefault(); day.click(); } });
    list.addEventListener("click", function (ev) { var b = ev.target.closest("button[data-id]"); if (b) openEvents(D.events.filter(function (e) { return e.id === b.getAttribute("data-id"); })); });
    $("[data-prev]").addEventListener("click", function () { st.m--; if (st.m < 1) { st.m = 12; st.y--; } render(); });
    $("[data-next-m]").addEventListener("click", function () { st.m++; if (st.m > 12) { st.m = 1; st.y++; } render(); });
    $("[data-today]").addEventListener("click", function () { st.y = td.getFullYear(); st.m = td.getMonth() + 1; render(); });
    $$("[data-view]").forEach(function (b) { b.addEventListener("click", function () { st.view = b.getAttribute("data-view"); $$("[data-view]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); x.classList.toggle("is-on", x === b); }); render(); }); });
    $$("[data-f]").forEach(function (b) { b.addEventListener("click", function () { st.f = b.getAttribute("data-f"); $$("[data-f]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); render(); }); });
    $("[data-view=month]").classList.add("is-on");
    narrow.addEventListener ? narrow.addEventListener("change", render) : narrow.addListener(render);
    renderers.push(render);
    render();
    if (first) openEvents([first]);
  })();

  /* GET INVOLVED: show which precinct a ZIP maps to after a demo form succeeds. */
  doc.addEventListener("demo:success", function (e) {
    var f = e.target, z = f.querySelector("[name=zip]"); if (!z) return;
    var ids = D.precincts.filter(function (p) { return p.zip === z.value.trim(); }).map(function (p) { return p.id + " " + p.name; });
    var ok = f.parentElement.querySelector("[data-success]"); if (!ok || !ids.length) return;
    var n = ok.querySelector(".zm") || ok.appendChild(el("p", "zm")); n.textContent = t("js.zipmatch", { list: ids.join(", ") });
  });

  /* DONATE / JOIN FLOWS */
  $$("[data-donate]").forEach(function (fl) {
    var form = $("[data-flow-form]", fl), steps = $$("[data-step]", fl), prog = $$(".prog li", fl), done = $("[data-flow-success]", fl), cur = 1, member = fl.getAttribute("data-flow") === "member";
    var go = function (n) { cur = n; steps.forEach(function (s) { s.hidden = +s.getAttribute("data-step") !== n; }); prog.forEach(function (p, i) { p.classList.toggle("on", i < n); }); if (n === 3) recap($("[data-recap]", fl)); var f = $("input:not([type=hidden]),button", steps[n - 1]); };
    var err = function (n, m) { var e = $("[data-err=" + n + "]", fl); if (!e) return; e.textContent = m; e.hidden = !m; var f = form.elements[n]; if (f && f.setAttribute) f.setAttribute("aria-invalid", m ? "true" : "false"); };
    var freqText = function () { return member ? t("js.yearly") : (form.elements.frequency.value === "monthly" ? t("js.monthly") : t("js.once")); };
    var amt = function () { return "$" + (parseInt(form.elements.amount.value, 10) || 0).toLocaleString("en-US"); };
    function recap(ul) {
      var rows = [["js.rc.amount", amt()], ["js.rc.freq", freqText()], ["js.rc.name", form.elements.name.value.trim()], ["js.rc.email", form.elements.email.value.trim()], ["js.rc.zip", form.elements.zip.value.trim()]];
      ul.innerHTML = rows.map(function (r) { return "<li><span>" + esc(t(r[0])) + "</span><b>" + esc(r[1]) + "</b></li>"; }).join("");
    }
    function check(n) {
      var bad = null;
      if (n === 1) { var a = parseInt(form.elements.amount.value, 10) || 0; err("amount", a >= 1 ? "" : t("js.amtbad")); if (a < 1) bad = $("[data-amount],[data-custom-amount]", fl); }
      if (n === 2) {
        var nm = form.elements.name, em = form.elements.email, zp = form.elements.zip, ag = form.elements.agree;
        var c = function (f, key, msg) { err(key, msg); if (msg && !bad) bad = f; };
        c(nm, "name", nm.value.trim() ? "" : t("js.req"));
        c(em, "email", !em.value.trim() ? t("js.req") : (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim()) ? "" : t("js.emailbad")));
        c(zp, "zip", /^\d{5}$/.test(zp.value.trim()) ? "" : t("js.zipbad"));
        c(ag, "agree", ag.checked ? "" : t("js.agreebad"));
      }
      if (bad) { bad.focus(); return false; } return true;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (cur < 3) { if (check(cur)) go(cur + 1); return; }
      var btn = $("[data-final]", fl); btn.disabled = true;
      setTimeout(function () {
        btn.disabled = false; form.hidden = true; done.hidden = false;
        var nm = form.elements.name.value.trim();
        $("[data-ok-text]", done).textContent = t(member ? "js.okm" : "js.okd", { name: nm, amt: amt() });
        recap($("[data-recap-done]", done)); done.focus();
      }, reduce ? 0 : 700);
    });
    $$("[data-back]", fl).forEach(function (b) { b.addEventListener("click", function () { go(cur - 1); }); });
    $$("input", form).forEach(function (i) { i.addEventListener("input", function () { if (i.name) err(i.name, ""); }); });
    $$("[data-amount],[data-custom-amount]", fl).forEach(function (b) { b.addEventListener("click", function () { err("amount", ""); }); });
    renderers.push(function () { $$("[data-err]", fl).forEach(function (x) { x.hidden = true; }); if (cur === 3) recap($("[data-recap]", fl)); });
  });
})();
