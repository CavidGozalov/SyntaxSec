(() => {
  "use strict";
  const feed = document.getElementById("feed"), filters = document.getElementById("filters");
  let all = [], tag = "All";
  function draw() {
    feed.innerHTML = "";
    all.filter(a => tag === "All" || a.tag === tag).forEach(a => {
      const c = document.createElement("article"), h = document.createElement("h3"), m = document.createElement("div"), p = document.createElement("p");
      c.className = "card"; m.className = "tag";
      h.textContent = a.title; m.textContent = a.date + " | " + a.tag; p.textContent = a.summary;
      c.append(h, m, p); feed.append(c);
    });
  }
  fetch("data/articles.json").then(r => r.json()).then(list => {
    all = list;
    ["All", ...new Set(list.map(a => a.tag))].forEach(t => {
      const b = document.createElement("button");
      b.className = "alt"; b.type = "button"; b.textContent = t; b.setAttribute("aria-pressed", t === tag);
      b.onclick = () => { tag = t; filters.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); };
      filters.append(b);
    });
    draw();
  }).catch(() => { feed.textContent = "Could not load articles. Serve the folder over HTTP, e.g. python -m http.server."; });
})();
