/* SyntaxSec — term-detail.html: full explanation, example, related terms, print. */
(function () {
  "use strict";
  var SS = window.SS;
  SS.addStrings({
    en: {
      "term.title": "Term", "term.relatedH": "Related terms in this topic", "term.exampleH": "Practical example",
      "term.fullH": "Full explanation", "term.notFound": "This term could not be found.", "term.notFoundP": "It may have been removed or the link is incomplete.",
      "term.backLearn": "Back to Learn", "term.noContent": "A full explanation has not been written for this term yet.",
      "term.inBrief": "In brief"
    },
    az: {
      "term.title": "Termin", "term.relatedH": "Bu mövzudakı əlaqəli terminlər", "term.exampleH": "Praktik nümunə",
      "term.fullH": "Ətraflı izah", "term.notFound": "Bu termin tapılmadı.", "term.notFoundP": "Ola bilsin silinib və ya keçid natamamdır.",
      "term.backLearn": "Öyrən bölməsinə qayıt", "term.noContent": "Bu termin üçün hələ ətraflı izah yazılmayıb.",
      "term.inBrief": "Qısaca"
    }
  });

  var root = document.getElementById("term-root");
  var id = new URLSearchParams(location.search).get("id") || "";
  var state = { term: null, topic: null, related: [], progress: new Map(), missing: false };

  function render() {
    if (state.missing || !state.term) {
      root.innerHTML = '<div class="empty" style="margin-top:20px"><span class="emoji">🧭</span><h2>' + SS.esc(SS.t("term.notFound")) + "</h2><p>" + SS.esc(SS.t("term.notFoundP")) +
        '</p><a class="btn" href="modules.html">' + SS.esc(SS.t("term.backLearn")) + "</a></div>";
      document.getElementById("related-section").hidden = true;
      return;
    }
    var t = state.term, topic = state.topic, p = state.progress.get(t.id) || {};
    var name = SS.L(t, "term"), content = SS.L(t, "content"), example = SS.L(t, "example"), summary = SS.L(t, "summary");
    document.title = name + " | SyntaxSec";
    root.innerHTML =
      '<p class="crumbs no-print"><a href="modules.html">' + SS.esc(SS.t("nav.learn")) + "</a>" +
        (topic ? ' / <a href="modules.html#' + encodeURIComponent(topic.slug || topic.id) + '">' + SS.esc(SS.L(topic, "name")) + "</a>" : "") + "</p>" +
      (topic ? '<span class="badge">' + SS.esc((topic.icon || "📘") + " " + SS.L(topic, "name")) + "</span>" : "") +
      '<h1 style="margin-top:12px">' + SS.esc(name) + "</h1>" +
      (summary ? '<div class="explain" style="max-width:72ch;margin:0 0 20px"><h4>' + SS.esc(SS.t("term.inBrief")) + '</h4><p style="margin:0">' + SS.esc(summary) + "</p></div>" : "") +
      '<div class="row no-print" style="margin-bottom:26px">' +
        '<button type="button" class="btn sm ghost' + (p.bookmarked ? " on" : "") + '" data-act="bookmarked" aria-pressed="' + !!p.bookmarked + '">🔖 ' + SS.esc(SS.t(p.bookmarked ? "common.bookmarked" : "common.bookmark")) + "</button>" +
        '<button type="button" class="btn sm ghost' + (p.mastered ? " on" : "") + '" data-act="mastered" aria-pressed="' + !!p.mastered + '">✓ ' + SS.esc(SS.t(p.mastered ? "common.mastered" : "common.master")) + "</button>" +
        '<button type="button" class="btn sm soft" data-print>🖨️ ' + SS.esc(SS.t("common.print")) + "</button>" +
      "</div>" +
      "<h2>" + SS.esc(SS.t("term.fullH")) + "</h2>" +
      '<div class="prose">' + (content ? SS.md(content) : '<p class="dim">' + SS.esc(SS.t("term.noContent")) + "</p>") + "</div>" +
      (example ? '<div class="example-box" style="max-width:72ch;margin-top:26px"><h3>🧪 ' + SS.esc(SS.t("term.exampleH")) + '</h3><div class="prose">' + SS.md(example) + "</div></div>" : "");

    var rel = document.getElementById("related-section");
    rel.hidden = !state.related.length;
    document.getElementById("related").innerHTML = state.related.map(function (r) {
      var done = (state.progress.get(r.id) || {}).mastered;
      return '<a class="card" href="term-detail.html?id=' + encodeURIComponent(r.id) + '"><h3>' + SS.esc(SS.L(r, "term")) + (done ? ' <span class="badge mint">✓</span>' : "") +
        '</h3><p class="dim small">' + SS.esc(SS.L(r, "summary")) + '</p><span class="go">' + SS.esc(SS.t("common.moreInfo")) + "</span></a>";
    }).join("");
  }

  root.addEventListener("click", async function (e) {
    var btn = e.target.closest("[data-act]");
    if (!btn || !state.term) return;
    btn.disabled = true;
    var ok = await SS.toggleProgress(state.term.id, btn.getAttribute("data-act"));
    if (ok) state.progress = await SS.db.progress();
    render();
  });
  document.addEventListener("langchange", render);

  SS.auth.ready.then(async function () {
    try {
      var content = await SS.db.content();
      state.term = id ? await SS.db.term(id) : null;
      if (!state.term) { state.missing = true; render(); return; }
      state.topic = content.topics.find(function (t) { return t.id === state.term.topic_id; }) || null;
      state.related = content.terms.filter(function (t) { return t.topic_id === state.term.topic_id && t.id !== state.term.id; }).slice(0, 6);
      state.progress = await SS.db.progress();
    } catch (err) { console.error(err); state.missing = true; }
    render();
  });
})();
