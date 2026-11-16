/* DBF Designs concept sites: shared interaction layer.
   Vanilla JS, no dependencies. Every behavior is opt-in through data attributes.
   Sites may define window.I18N = { en:{key:"text"}, es:{key:"texto"} } before loading this file. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var siteKey = "dbf:" + location.pathname.split("/").filter(Boolean).slice(-2, -1).join("");
  root.classList.add("js");
  if (reduce) root.classList.add("reduce-motion");

  /* Scroll reveal: [data-reveal] (optional data-delay in ms). Parent [data-stagger] staggers children. */
  function initReveal() {
    var els = $$("[data-reveal]");
    $$("[data-stagger]").forEach(function (p) {
      $$(":scope > *", p).forEach(function (c, i) { c.setAttribute("data-reveal", c.getAttribute("data-reveal") || ""); c.style.setProperty("--i", i); });
    });
    els = $$("[data-reveal]");
    if (reduce || !("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  /* Count up: <span data-count="2400" data-prefix="$" data-suffix="">2,400</span> */
  function initCount() {
    var els = $$("[data-count]");
    if (!els.length) return;
    var fmt = function (n) { return n.toLocaleString("en-US"); };
    var run = function (el) {
      var to = parseFloat(el.getAttribute("data-count")), pre = el.getAttribute("data-prefix") || "", suf = el.getAttribute("data-suffix") || "";
      if (reduce) { el.textContent = pre + fmt(to) + suf; return; }
      var start = null, dur = 1400;
      var tick = function (t) {
        if (start === null) start = t;
        var p = Math.min((t - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + fmt(Math.round(to * e)) + suf;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { run(x.target); io.unobserve(x.target); } });
    }, { threshold: 0.6 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* Mobile nav: <button data-nav-toggle aria-controls="nav" aria-expanded="false"> + <nav id="nav" data-nav> */
  function initNav() {
    $$("[data-nav-toggle]").forEach(function (btn) {
      var nav = doc.getElementById(btn.getAttribute("aria-controls")) || $("[data-nav]");
      if (!nav) return;
      var set = function (open) {
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        nav.classList.toggle("is-open", open);
        root.classList.toggle("nav-open", open);
      };
      btn.addEventListener("click", function () { set(btn.getAttribute("aria-expanded") !== "true"); });
      doc.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
      $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
    });
    var header = $("[data-header]");
    if (header && "IntersectionObserver" in window) {
      var sentinel = doc.createElement("div");
      sentinel.setAttribute("aria-hidden", "true");
      sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:80px;pointer-events:none";
      doc.body.prepend(sentinel);
      new IntersectionObserver(function (en) { header.classList.toggle("is-stuck", !en[0].isIntersecting); }).observe(sentinel);
    }
    var here = location.pathname.replace(/index\.html$/, "");
    $$("[data-nav] a").forEach(function (a) {
      try { if (new URL(a.href).pathname.replace(/index\.html$/, "") === here) a.setAttribute("aria-current", "page"); } catch (e) {}
    });
  }

  /* Theme: <button data-theme-toggle>. Respects prefers-color-scheme until the user chooses. */
  function initTheme() {
    var saved = store.get(siteKey + ":theme");
    if (saved) root.setAttribute("data-theme", saved);
    $$("[data-theme-toggle]").forEach(function (b) {
      var sync = function () {
        var dark = root.getAttribute("data-theme") === "dark" || (!root.getAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
        b.setAttribute("aria-pressed", dark ? "true" : "false");
      };
      sync();
      b.addEventListener("click", function () {
        var dark = b.getAttribute("aria-pressed") === "true";
        var next = dark ? "light" : "dark";
        root.setAttribute("data-theme", next); store.set(siteKey + ":theme", next); sync();
      });
    });
  }

  /* i18n: elements with data-i18n="key" (text) or data-i18n-attr="placeholder:key,aria-label:key2". Buttons data-lang-btn="es". */
  function initI18n() {
    var dict = window.I18N; if (!dict) return;
    var apply = function (lang) {
      root.setAttribute("lang", lang);
      $$("[data-i18n]").forEach(function (el) {
        var k = el.getAttribute("data-i18n");
        if (dict[lang] && dict[lang][k] != null) el.textContent = dict[lang][k];
        else if (dict.en && dict.en[k] != null) el.textContent = dict.en[k];
      });
      $$("[data-i18n-attr]").forEach(function (el) {
        el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
          var p = pair.split(":"), a = p[0].trim(), k = p[1].trim();
          var v = (dict[lang] && dict[lang][k] != null) ? dict[lang][k] : (dict.en && dict.en[k]);
          if (v != null) el.setAttribute(a, v);
        });
      });
      $$("[data-lang-btn]").forEach(function (b) {
        var on = b.getAttribute("data-lang-btn") === lang;
        b.setAttribute("aria-pressed", on ? "true" : "false");
        b.classList.toggle("is-on", on);
      });
      store.set(siteKey + ":lang", lang);
    };
    var initial = store.get(siteKey + ":lang") || "en";
    if (!dict[initial]) initial = "en";
    $$("[data-lang-btn]").forEach(function (b) { b.addEventListener("click", function () { apply(b.getAttribute("data-lang-btn")); }); });
    if (initial !== "en") apply(initial); else $$("[data-lang-btn]").forEach(function (b) { var on = b.getAttribute("data-lang-btn") === "en"; b.setAttribute("aria-pressed", on ? "true" : "false"); b.classList.toggle("is-on", on); });
  }

  /* Donate / amount picker.
     <div data-amounts> <button type="button" data-amount="25">$25</button> ... <input data-custom-amount> </div>
     <div data-freq> <button type="button" data-frequency="once"> <button data-frequency="monthly"> </div>
     <output data-amount-out></output>  <span data-freq-out></span>  */
  function initDonate() {
    $$("[data-amounts]").forEach(function (g) {
      var scope = g.closest("[data-donate]") || doc;
      var out = $$("[data-amount-out]", scope), fout = $$("[data-freq-out]", scope);
      var amount = 0, freq = "once";
      var paint = function () {
        out.forEach(function (o) { o.textContent = amount > 0 ? "$" + amount.toLocaleString("en-US") : "$0"; });
        fout.forEach(function (o) { o.textContent = freq === "monthly" ? "per month" : "one time"; });
        var hid = $("[name=amount]", scope); if (hid) hid.value = amount;
        var hf = $("[name=frequency]", scope); if (hf) hf.value = freq;
      };
      $$("[data-amount]", g).forEach(function (b) {
        b.setAttribute("aria-pressed", "false");
        b.addEventListener("click", function () {
          amount = parseInt(b.getAttribute("data-amount"), 10);
          $$("[data-amount]", g).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); x.classList.toggle("is-on", x === b); });
          var c = $("[data-custom-amount]", g); if (c) c.value = "";
          paint();
        });
      });
      var c = $("[data-custom-amount]", g);
      if (c) c.addEventListener("input", function () {
        var v = parseInt(c.value.replace(/[^0-9]/g, ""), 10) || 0; amount = v;
        $$("[data-amount]", g).forEach(function (x) { x.setAttribute("aria-pressed", "false"); x.classList.remove("is-on"); });
        paint();
      });
      $$("[data-frequency]", scope).forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-frequency") === "once" ? "true" : "false");
        b.addEventListener("click", function () {
          freq = b.getAttribute("data-frequency");
          $$("[data-frequency]", scope).forEach(function (x) { var on = x === b; x.setAttribute("aria-pressed", on ? "true" : "false"); x.classList.toggle("is-on", on); });
          paint();
        });
      });
      var pre = $("[data-amount].is-default", g) || $("[data-amount]", g);
      if (pre) pre.click(); else paint();
    });
  }

  /* Demo forms: <form data-demo-form novalidate> fields with required/type/pattern and a sibling
     <p class="field-error" data-error-for="email" hidden>. A [data-success] element (hidden) is revealed on success.
     Nothing is sent anywhere. */
  function initForms() {
    var msgs = { required: "This field is required.", email: "Enter a valid email address.", zip: "Enter a 5-digit ZIP code.", phone: "Enter a valid phone number.", amount: "Choose or enter an amount." };
    var validOne = function (f) {
      var v = (f.value || "").trim(), t = f.getAttribute("type"), n = f.name;
      if (f.hasAttribute("required") && f.type === "checkbox") return f.checked ? "" : msgs.required;
      if (f.hasAttribute("required") && !v) return msgs.required;
      if (!v) return "";
      if (t === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return msgs.email;
      if (n === "zip" && !/^\d{5}$/.test(v)) return msgs.zip;
      if (t === "tel" && v.replace(/\D/g, "").length < 10) return msgs.phone;
      if (n === "amount" && !(parseInt(v, 10) > 0)) return msgs.amount;
      return "";
    };
    $$("form[data-demo-form]").forEach(function (form) {
      var show = function (f, m) {
        var err = $("[data-error-for='" + f.name + "']", form);
        if (err) { err.textContent = m; err.hidden = !m; }
        f.setAttribute("aria-invalid", m ? "true" : "false");
        if (err) f.setAttribute("aria-describedby", err.id || (err.id = "err-" + f.name + "-" + Math.random().toString(36).slice(2, 6)));
      };
      $$("input,select,textarea", form).forEach(function (f) {
        if (!f.name) return;
        f.addEventListener("blur", function () { if (f.value || f.getAttribute("aria-invalid") === "true") show(f, validOne(f)); });
        f.addEventListener("input", function () { if (f.getAttribute("aria-invalid") === "true") show(f, validOne(f)); });
      });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var bad = null;
        $$("input,select,textarea", form).forEach(function (f) {
          if (!f.name || f.type === "hidden" && f.name !== "amount") return;
          var m = validOne(f); show(f, m); if (m && !bad) bad = f;
        });
        if (bad) { bad.focus(); return; }
        var btn = $("[type=submit]", form);
        if (btn) { btn.disabled = true; btn.setAttribute("data-loading", "true"); }
        setTimeout(function () {
          if (btn) { btn.disabled = false; btn.removeAttribute("data-loading"); }
          var ok = $("[data-success]", form.parentElement) || $("[data-success]", form);
          form.hidden = true;
          if (ok) { ok.hidden = false; ok.setAttribute("tabindex", "-1"); ok.focus({ preventScroll: false }); }
          form.dispatchEvent(new CustomEvent("demo:success", { bubbles: true }));
        }, reduce ? 0 : 700);
      });
      var reset = $("[data-reset-form]", form.parentElement);
      if (reset) reset.addEventListener("click", function () {
        form.reset(); form.hidden = false;
        var ok = $("[data-success]", form.parentElement); if (ok) ok.hidden = true;
        $$("[aria-invalid]", form).forEach(function (f) { f.removeAttribute("aria-invalid"); });
        $$("[data-error-for]", form).forEach(function (er) { er.hidden = true; });
      });
    });
  }

  /* Filter: <div data-filter-group="events"><button data-filter="all"> <button data-filter="canvass">  items: <li data-cat="canvass" data-filter-item="events"> */
  function initFilter() {
    $$("[data-filter-group]").forEach(function (g) {
      var name = g.getAttribute("data-filter-group");
      var items = $$("[data-filter-item='" + name + "']");
      var empty = $("[data-filter-empty='" + name + "']");
      $$("[data-filter]", g).forEach(function (b) {
        b.addEventListener("click", function () {
          var f = b.getAttribute("data-filter"), n = 0;
          $$("[data-filter]", g).forEach(function (x) { var on = x === b; x.setAttribute("aria-pressed", on ? "true" : "false"); x.classList.toggle("is-on", on); });
          items.forEach(function (it) {
            var cats = (it.getAttribute("data-cat") || "").split(/\s+/);
            var show = f === "all" || cats.indexOf(f) > -1;
            it.hidden = !show; if (show) n++;
          });
          if (empty) empty.hidden = n > 0;
        });
        b.setAttribute("aria-pressed", b.getAttribute("data-filter") === "all" ? "true" : "false");
      });
    });
  }

  /* Dialog: <button data-open-modal="rsvp"> + <dialog id="rsvp"> with <button data-close-modal>. Optional data-fill on opener fills [data-modal-title]. */
  function initModal() {
    $$("[data-open-modal]").forEach(function (b) {
      b.addEventListener("click", function () {
        var d = doc.getElementById(b.getAttribute("data-open-modal")); if (!d) return;
        var t = b.getAttribute("data-fill"); var slot = $("[data-modal-title]", d); if (t && slot) slot.textContent = t;
        var ok = $("[data-success]", d); var f = $("form", d); if (ok) ok.hidden = true; if (f) f.hidden = false;
        if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
      });
    });
    $$("dialog").forEach(function (d) {
      $$("[data-close-modal]", d).forEach(function (c) { c.addEventListener("click", function () { d.close ? d.close() : d.removeAttribute("open"); }); });
      d.addEventListener("click", function (e) { if (e.target === d && d.close) d.close(); });
    });
  }

  /* Tabs: [data-tabs] > [role=tablist] button[role=tab][aria-controls] + [role=tabpanel] */
  function initTabs() {
    $$("[data-tabs]").forEach(function (t) {
      var tabs = $$("[role=tab]", t), panels = $$("[role=tabpanel]", t);
      var pick = function (tab) {
        tabs.forEach(function (x) { var on = x === tab; x.setAttribute("aria-selected", on ? "true" : "false"); x.tabIndex = on ? 0 : -1; });
        panels.forEach(function (p) { p.hidden = p.id !== tab.getAttribute("aria-controls"); });
      };
      tabs.forEach(function (tab, i) {
        tab.addEventListener("click", function () { pick(tab); });
        tab.addEventListener("keydown", function (e) {
          var j = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : -1;
          if (j < 0) return; var n = tabs[(j + tabs.length) % tabs.length]; n.focus(); pick(n);
        });
      });
      pick(tabs.filter(function (x) { return x.getAttribute("aria-selected") === "true"; })[0] || tabs[0]);
    });
  }

  /* Accordion helper: <details data-accordion-group> children close siblings. */
  function initAccordion() {
    $$("[data-accordion-group]").forEach(function (g) {
      $$("details", g).forEach(function (d) {
        d.addEventListener("toggle", function () { if (d.open) $$("details", g).forEach(function (o) { if (o !== d) o.open = false; }); });
      });
    });
  }

  /* Pointer physics (no React, no scroll listeners): data-tilt (cards), data-magnetic (buttons). Disabled for reduced motion and touch. */
  function initPointer() {
    if (reduce || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    $$("[data-tilt]").forEach(function (el) {
      var max = parseFloat(el.getAttribute("data-tilt")) || 6, raf = 0;
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () { el.style.transform = "perspective(900px) rotateY(" + (x * max) + "deg) rotateX(" + (-y * max) + "deg) translateZ(0)"; });
      });
      el.addEventListener("pointerleave", function () { cancelAnimationFrame(raf); el.style.transform = ""; });
    });
    $$("[data-magnetic]").forEach(function (el) {
      var raf = 0;
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect(), x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () { el.style.transform = "translate(" + (x * 0.18) + "px," + (y * 0.25) + "px)"; });
      });
      el.addEventListener("pointerleave", function () { cancelAnimationFrame(raf); el.style.transform = ""; });
    });
  }

  /* Copy to clipboard: <button data-copy="text"> */
  function initCopy() {
    $$("[data-copy]").forEach(function (b) {
      b.addEventListener("click", function () {
        var t = b.getAttribute("data-copy"), label = b.textContent;
        var done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = label; }, 1600); };
        if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, done); else done();
      });
    });
  }

  function init() { initReveal(); initCount(); initNav(); initTheme(); initI18n(); initDonate(); initForms(); initFilter(); initModal(); initTabs(); initAccordion(); initPointer(); initCopy(); }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init); else init();
})();
