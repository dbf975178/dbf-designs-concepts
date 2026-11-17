/* Cedar County Democrats (concept): round 2 behavior. Runs after shared.js, data.js and site.js.
   Notification bar, timed email pop-up, events feed, lightbox, countdown, pledge counter, date formatting, error translation.
   Nothing is sent anywhere. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var KEY = "dbf:county-party:";
  var store = {
    get: function (k) { try { return localStorage.getItem(KEY + k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(KEY + k, v); } catch (e) {} },
    sget: function (k) { try { return sessionStorage.getItem(KEY + k); } catch (e) { return null; } },
    sset: function (k, v) { try { sessionStorage.setItem(KEY + k, v); } catch (e) {} }
  };
  var lang = function () { return root.getAttribute("lang") === "es" ? "es" : "en"; };
  var loc = function () { return lang() === "es" ? "es-US" : "en-US"; };
  var t = function (k, v) {
    var d = window.I18N || {}, s = (d[lang()] && d[lang()][k]) || (d.en && d.en[k]) || k;
    if (v) Object.keys(v).forEach(function (n) { s = s.split("{" + n + "}").join(v[n]); });
    return s;
  };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var mk = function (y, m, d, hh, mm) { return new Date(y, m - 1, d, hh || 0, mm || 0); };
  var parseISO = function (s) { var p = s.split(/[-T:]/).map(Number); return mk(p[0], p[1], p[2], p[3] || 0, p[4] || 0); };
  var renderers = [];
  var rerender = function () { renderers.forEach(function (f) { f(); }); };
  $$("[data-lang-btn]").forEach(function (b) { b.addEventListener("click", function () { setTimeout(rerender, 0); }); });
  if (lang() !== "en") setTimeout(rerender, 0);

  /* Dates: <time data-d="2026-11-12" [data-d-style="long"]> */
  function dates() {
    $$("time[data-d]").forEach(function (e) {
      var d = parseISO(e.getAttribute("data-d")), long = e.getAttribute("data-d-style") === "long";
      e.setAttribute("datetime", e.getAttribute("data-d"));
      e.textContent = d.toLocaleDateString(loc(), long ? { month: "long", day: "numeric", year: "numeric" } : { month: "short", day: "numeric" });
    });
  }
  dates(); renderers.push(dates);

  /* Notification bar */
  (function () {
    var bar = $("[data-notice]"); if (!bar) return;
    if (store.get("notice") === "closed") { bar.hidden = true; return; }
    var x = $("[data-notice-close]", bar);
    if (x) x.addEventListener("click", function () { bar.hidden = true; store.set("notice", "closed"); });
  })();

  /* Timed email pop-up: once after ~12 seconds or on exit intent. Never on donate pages. */
  (function () {
    var dlg = $("#pop-email"); if (!dlg) return;
    if (/donate-and-join/.test(location.pathname)) return;
    if (store.get("pop") === "closed" || store.sget("pop") === "shown") return;
    var done = false;
    var show = function () {
      if (done || store.get("pop") === "closed") return;
      if ($("dialog[open]")) { setTimeout(show, 6000); return; }
      var a = doc.activeElement;
      if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) { setTimeout(show, 6000); return; }
      done = true; store.sset("pop", "shown");
      if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    };
    dlg.addEventListener("close", function () { store.set("pop", "closed"); });
    dlg.addEventListener("demo:success", function () { store.set("pop", "closed"); });
    setTimeout(show, 12000);
    if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      doc.addEventListener("mouseout", function (e) { if (!e.relatedTarget && e.clientY <= 0) show(); });
    }
  })();

  /* Translate the shared form validation messages */
  (function () {
    var map = {}, en = (window.I18N && window.I18N.en) || {}, es = (window.I18N && window.I18N.es) || {};
    ["required", "email", "zip", "phone", "amount"].forEach(function (n) { var k = "err." + n; map[en[k]] = k; map[es[k]] = k; });
    var fix = function (el) {
      var k = map[el.textContent]; if (!k) return;
      var s = t(k); if (el.textContent !== s) el.textContent = s;
    };
    var mo = new MutationObserver(function (list) {
      list.forEach(function (m) { var el = m.target.nodeType === 3 ? m.target.parentNode : m.target; if (el && el.matches && el.matches(".field-error")) fix(el); });
    });
    $$(".field-error").forEach(function (e) { mo.observe(e, { childList: true, characterData: true, subtree: true }); });
    renderers.push(function () { $$(".field-error").forEach(fix); });
  })();

  /* Copy buttons: Spanish confirmation */
  $$("[data-copy]").forEach(function (b) {
    new MutationObserver(function () { if (b.textContent === "Copied" && lang() === "es") b.textContent = t("copied"); }).observe(b, { childList: true, characterData: true, subtree: true });
  });

  /* ICS and Google Calendar helpers */
  var icsEsc = function (s) { return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n"); };
  var stamp = function (d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00"; };
  var vevent = function (e) {
    var n = new Date();
    return ["BEGIN:VEVENT", "UID:" + e.id + "@cedar-county-concept.example",
      "DTSTAMP:" + n.getUTCFullYear() + pad(n.getUTCMonth() + 1) + pad(n.getUTCDate()) + "T" + pad(n.getUTCHours()) + pad(n.getUTCMinutes()) + "00Z",
      "DTSTART:" + stamp(parseISO(e.date + "T" + e.start)), "DTEND:" + stamp(parseISO(e.date + "T" + e.end)),
      "SUMMARY:" + icsEsc(e.title[lang()]), "LOCATION:" + icsEsc(e.place), "DESCRIPTION:" + icsEsc(e.desc[lang()]), "END:VEVENT"];
  };
  var download = function (name, events) {
    var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//DBF Designs//Cedar County Democrats concept//EN", "CALSCALE:GREGORIAN"];
    events.forEach(function (e) { lines = lines.concat(vevent(e)); });
    lines.push("END:VCALENDAR");
    var blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    var a = doc.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
    doc.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  };
  var gcal = function (e) {
    return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(e.title[lang()]) +
      "&dates=" + stamp(parseISO(e.date + "T" + e.start)) + "/" + stamp(parseISO(e.date + "T" + e.end)) +
      "&details=" + encodeURIComponent(e.desc[lang()]) + "&location=" + encodeURIComponent(e.place);
  };

  /* Events feed (calendar page) */
  (function () {
    var box = $("[data-feed]"), D = window.CP; if (!box || !D) return;
    var shown = 6, filter = "all", dlg = $("#feed-rsvp");
    var now = new Date(), td = mk(now.getFullYear(), now.getMonth() + 1, now.getDate());
    var all = D.events.filter(function (e) { return parseISO(e.date) >= td; });
    if (!all.length) all = D.events.slice();
    var list = function () { return all.filter(function (e) { return filter === "all" || e.cat === filter; }); };
    var spots = function (e) { var n = parseInt(e.id.slice(1), 10); return n % 6 === 0 ? 0 : (n * 7) % 23 + 3; };
    var fmtT = function (d) { return d.toLocaleTimeString(loc(), { hour: "numeric", minute: "2-digit" }); };
    function render() {
      var l = list(), part = l.slice(0, shown);
      box.innerHTML = part.map(function (e) {
        var s = parseISO(e.date + "T" + e.start), en = parseISO(e.date + "T" + e.end), sp = spots(e);
        return '<li class="fi" data-cat="' + e.cat + '"><div class="fi-d"><b>' + s.getDate() + "</b><span>" + esc(s.toLocaleDateString(loc(), { month: "short" }).replace(".", "")) + "</span></div>" +
          '<div class="fi-b"><h3>' + esc(e.title[lang()]) + '</h3><p class="fi-m">' + esc(t("fd.when", { date: s.toLocaleDateString(loc(), { weekday: "long", month: "long", day: "numeric" }), start: fmtT(s), end: fmtT(en) })) + " &middot; " + esc(e.place) + "</p>" +
          '<p class="fi-s">' + esc(sp ? t("fd.spots", { n: sp }) : t("fd.full")) + "</p></div>" +
          '<div class="fi-a"><button type="button" class="btn btn-primary btn-sm" data-rsvp="' + e.id + '">' + esc(t("fd.rsvp")) + "</button>" +
          '<div class="fi-links"><button type="button" class="lk" data-ics="' + e.id + '"><i class="ph ph-calendar-plus" aria-hidden="true"></i>' + esc(t("fd.cal")) + "</button>" +
          '<a class="lk" href="' + esc(gcal(e)) + '" target="_blank" rel="noopener"><i class="ph ph-arrow-square-out" aria-hidden="true"></i>' + esc(t("fd.gcal")) + "</a></div></div></li>";
      }).join("");
      var empty = $("[data-feed-empty]"), more = $("[data-feed-more]");
      if (empty) empty.hidden = l.length > 0;
      if (more) more.hidden = l.length <= shown;
    }
    render(); renderers.push(render);
    $$("[data-ff]").forEach(function (c) {
      c.addEventListener("click", function () {
        filter = c.getAttribute("data-ff"); shown = 6;
        $$("[data-ff]").forEach(function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
        render();
      });
    });
    var more = $("[data-feed-more]"); if (more) more.addEventListener("click", function () { shown += 6; render(); });
    var byId = function (id) { return D.events.filter(function (e) { return e.id === id; })[0]; };
    box.addEventListener("click", function (ev) {
      var r = ev.target.closest("[data-rsvp]"), i = ev.target.closest("[data-ics]");
      if (i) { var e1 = byId(i.getAttribute("data-ics")); download(e1.id + ".ics", [e1]); return; }
      if (!r || !dlg) return;
      var e = byId(r.getAttribute("data-rsvp")), s = parseISO(e.date + "T" + e.start), en = parseISO(e.date + "T" + e.end);
      $("[data-modal-title]", dlg).textContent = t("fd.rsvpfor") + " " + e.title[lang()];
      $("[data-fr-when]", dlg).textContent = t("fd.when", { date: s.toLocaleDateString(loc(), { weekday: "long", month: "long", day: "numeric" }), start: fmtT(s), end: fmtT(en) }) + ". " + e.place;
      var f = $("form", dlg); f.hidden = false; f.reset(); $("[data-success]", dlg).hidden = true;
      $$("[aria-invalid]", f).forEach(function (x) { x.removeAttribute("aria-invalid"); });
      $$("[data-error-for]", f).forEach(function (x) { x.hidden = true; });
      if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    });
    var sub = $("[data-sub-all]"); if (sub) sub.addEventListener("click", function () { download("cedar-county-democrats.ics", all); });
  })();

  /* Lightbox */
  (function () {
    var cells = $$("[data-lb]"), dlg = $("#lb"); if (!cells.length || !dlg) return;
    var fig = $("[data-lb-fig]", dlg), num = $("[data-lb-n]", dlg), cur = 0;
    function show(i) {
      cur = (i + cells.length) % cells.length;
      var c = cells[cur], img = $("img", c), art = $(".g-art", c), cap = $(".g-cap", c);
      fig.innerHTML = "";
      if (img) { var im = doc.createElement("img"); im.src = img.currentSrc || img.src; im.alt = img.alt; fig.appendChild(im); }
      else if (art) { fig.appendChild(art.cloneNode(true)); }
      var fc = doc.createElement("figcaption"); fc.textContent = cap ? cap.textContent : ""; fig.appendChild(fc);
      num.textContent = (cur + 1) + " / " + cells.length;
    }
    cells.forEach(function (c, i) {
      c.addEventListener("click", function () { show(i); if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", ""); });
    });
    $("[data-lb-prev]", dlg).addEventListener("click", function () { show(cur - 1); });
    $("[data-lb-next]", dlg).addEventListener("click", function () { show(cur + 1); });
    dlg.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") show(cur - 1); else if (e.key === "ArrowRight") show(cur + 1); });
    renderers.push(function () { if (dlg.open) show(cur); });
  })();

  /* Countdown */
  (function () {
    var box = $("[data-countdown]"); if (!box) return;
    var target = parseISO(box.getAttribute("data-countdown"));
    function tick() {
      var ms = Math.max(0, target - new Date()), m = Math.floor(ms / 60000);
      var d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mm = m % 60;
      $("[data-cd=d]", box).textContent = d; $("[data-cd=h]", box).textContent = pad(h); $("[data-cd=m]", box).textContent = pad(mm);
    }
    tick(); setInterval(tick, 20000);
  })();

  /* Pledge counter */
  (function () {
    var form = $("[data-pledge-form]"), n = $("[data-pledge-n]"), bar = $("[data-pledge-bar]"); if (!form || !n) return;
    var count = 3284, goal = 5000;
    var paint = function (v) { n.textContent = Math.round(v).toLocaleString("en-US"); };
    form.addEventListener("demo:success", function () {
      var from = count; count += 1;
      if (reduce) paint(count);
      else {
        var t0 = null, step = function (ts) { if (t0 === null) t0 = ts; var p = Math.min((ts - t0) / 700, 1); paint(from + (count - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }
      if (bar) { bar.setAttribute("aria-valuenow", count); $("span", bar).style.setProperty("--s", (count / goal).toFixed(4)); }
    });
  })();

  /* Surface the demo-success event from forms inside dialogs to the dialog (pop-up bookkeeping) */
  $$("dialog form[data-demo-form]").forEach(function (f) {
    f.addEventListener("demo:success", function () { var d = f.closest("dialog"); if (d) d.dispatchEvent(new CustomEvent("demo:success")); });
  });
})();
