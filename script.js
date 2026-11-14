/* SyntaxSec — theme switching and interaction polish.
   The theme lives on <html data-theme="light|dark"> and in localStorage("theme").
   Every colour in style.css reads from CSS variables scoped to that attribute,
   so flipping it restyles the whole page instantly, with no reload. */
(function () {
  "use strict";
  var SS = (window.SS = window.SS || {});
  var root = document.documentElement;

  function current() { return root.getAttribute("data-theme") === "dark" ? "dark" : "light"; }

  /* The button shows only an icon: the sun while dark (tap for light), the moon while light. */
  SS.paintTheme = function () {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    var glyph = btn.querySelector(".glyph") || btn;
    glyph.textContent = current() === "dark" ? "☀️" : "🌙";
    btn.setAttribute("aria-pressed", String(current() === "dark"));
  };

  SS.setTheme = function (theme) {
    var next = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    SS.paintTheme();
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
  };

  if (!root.getAttribute("data-theme")) {
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) {}
    root.setAttribute("data-theme", saved === "dark" ? "dark" : "light");
  }
  SS.paintTheme();

  /* Delegated, so it keeps working when the navbar is re-rendered. */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("#theme-toggle");
    if (!btn) return;
    e.preventDefault();
    SS.setTheme(current() === "dark" ? "light" : "dark");
    btn.classList.remove("spin"); void btn.offsetWidth; btn.classList.add("spin");
  });

  /* Keep other open tabs in sync. */
  window.addEventListener("storage", function (e) {
    if (e.key === "theme" && e.newValue) { root.setAttribute("data-theme", e.newValue === "dark" ? "dark" : "light"); SS.paintTheme(); }
  });

  /* Ripple feedback on buttons. */
  document.addEventListener("pointerdown", function (e) {
    var btn = e.target.closest(".btn");
    if (!btn || btn.disabled) return;
    var rect = btn.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    var dot = document.createElement("span");
    dot.className = "ripple";
    dot.style.width = dot.style.height = size + "px";
    dot.style.left = e.clientX - rect.left - size / 2 + "px";
    dot.style.top = e.clientY - rect.top - size / 2 + "px";
    btn.appendChild(dot);
    setTimeout(function () { dot.remove(); }, 600);
  });
})();
