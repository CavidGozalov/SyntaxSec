(() => {
  "use strict";
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem("gn-theme"); } catch (e) {}
  root.dataset.theme = saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  const page = location.pathname.split("/").pop() || "index.html";
  const links = [["index.html","Home"],["password-checker.html","Password audit"],["modules.html","Learn"],["blog.html","News"]];
  const nav = document.createElement("header");
  nav.className = "nav";
  nav.innerHTML = '<div class="wrap"><a class="brand" href="index.html"><img src="assets/icons/logo.svg" alt="">GuardNode</a>' +
    links.map(([h, t]) => `<a class="l" href="${h}"${h === page ? ' aria-current="page"' : ""}>${t}</a>`).join("") +
    '<button class="alt" id="theme" type="button">Theme</button></div>';
  document.body.prepend(nav);

  const foot = document.createElement("footer");
  foot.innerHTML = '<div class="wrap">GuardNode is a university PBL project. Audits run in your browser; nothing is uploaded or stored.</div>';
  document.body.append(foot);

  document.getElementById("theme").addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("gn-theme", next); } catch (e) {}
  });
})();
