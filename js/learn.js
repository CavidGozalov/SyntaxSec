/* SyntaxSec — modules.html: real-time search, topics from Supabase, term explanations. */
(function () {
  "use strict";
  var SS = window.SS;
  SS.addStrings({
    en: {
      "learn.title": "Learn", "learn.h1": "Learn the vocabulary of security",
      "learn.lead": "Search any term, or open a topic and tap a term for a short explanation. Every term has a full deep-dive page.",
      "learn.searchPh": "Search terms, e.g. phishing, hash, VPN…", "learn.resultsH": "Search results", "learn.topicsH": "Topics",
      "learn.noResults": "No term matches “{q}”. Try a shorter word or check the spelling.",
      "learn.noTopics": "No topics yet. The administrator can add topics and terms from the Admin page.",
      "learn.noTerms": "This topic has no terms yet.", "learn.pick": "Tap a term above to read its short explanation.",
      "learn.meta": "{topics} topics · {terms} terms", "learn.found": "{n} found", "learn.noSummary": "No short explanation has been written for this term yet."
    },
    az: {
      "learn.title": "Öyrən", "learn.h1": "Təhlükəsizliyin lüğətini öyrən",
      "learn.lead": "İstənilən termini axtar və ya mövzunu açıb qısa izah üçün terminə toxun. Hər terminin ətraflı səhifəsi var.",
      "learn.searchPh": "Termin axtar, məs. fişinq, heş, VPN…", "learn.resultsH": "Axtarış nəticələri", "learn.topicsH": "Mövzular",
      "learn.noResults": "“{q}” sorğusuna uyğun termin tapılmadı. Daha qısa söz yoxla və ya yazılışı yoxla.",
      "learn.noTopics": "Hələ mövzu yoxdur. Administrator mövzu və terminləri Admin səhifəsindən əlavə edə bilər.",
      "learn.noTerms": "Bu mövzuda hələ termin yoxdur.", "learn.pick": "Qısa izahı oxumaq üçün yuxarıdakı terminə toxun.",
      "learn.meta": "{topics} mövzu · {terms} termin", "learn.found": "{n} nəticə", "learn.noSummary": "Bu termin üçün hələ qısa izah yazılmayıb."
    }
  });

  var state = { topics: [], terms: [], progress: new Map(), open: new Set(), active: {}, q: "" };
  var elTopics = document.getElementById("topics"), elResults = document.getElementById("results");
  var input = document.getElementById("q");

  function prog(id) { return state.progress.get(id) || {}; }
  function fold(s) { return String(s || "").toLocaleLowerCase("az"); }
  function termsOf(topicId) { return state.terms.filter(function (t) { return t.topic_id === topicId; }); }
  function topicOf(term) { return state.topics.find(function (t) { return t.id === term.topic_id; }); }

  /* The concise explanation card (used under a topic and in search results). */
  function explainHtml(term, withTopic) {
    var p = prog(term.id), topic = topicOf(term);
    var summary = SS.L(term, "summary");
    return '<div class="explain" data-term="' + SS.esc(term.id) + '">' +
      (withTopic && topic ? '<span class="badge plain" style="margin-bottom:8px">' + SS.esc((topic.icon || "📘") + " " + SS.L(topic, "name")) + "</span>" : "") +
      "<h4>" + SS.esc(SS.L(term, "term")) + "</h4>" +
      '<p style="margin:0">' + (summary ? SS.esc(summary) : '<span class="dim">' + SS.esc(SS.t("learn.noSummary")) + "</span>") + "</p>" +
      '<div class="actions">' +
        '<a class="btn sm" href="term-detail.html?id=' + encodeURIComponent(term.id) + '">' + SS.esc(SS.t("common.moreInfo")) + "</a>" +
        '<button type="button" class="btn sm ghost' + (p.bookmarked ? " on" : "") + '" data-act="bookmarked" aria-pressed="' + !!p.bookmarked + '">🔖 ' + SS.esc(SS.t(p.bookmarked ? "common.bookmarked" : "common.bookmark")) + "</button>" +
        '<button type="button" class="btn sm ghost' + (p.mastered ? " on" : "") + '" data-act="mastered" aria-pressed="' + !!p.mastered + '">✓ ' + SS.esc(SS.t(p.mastered ? "common.mastered" : "common.master")) + "</button>" +
      "</div></div>";
  }

  function chipHtml(term, topicId) {
    var p = prog(term.id), on = state.active[topicId] === term.id;
    return '<button type="button" class="chip' + (p.mastered ? " mastered" : "") + '" data-term-chip="' + SS.esc(term.id) + '" aria-pressed="' + on + '">' +
      (p.mastered ? '<span class="mark">✓</span>' : p.bookmarked ? '<span class="mark">🔖</span>' : "") + SS.esc(SS.L(term, "term")) + "</button>";
  }

  function topicHtml(topic) {
    var terms = termsOf(topic.id), open = state.open.has(topic.id);
    var done = terms.filter(function (t) { return prog(t.id).mastered; }).length;
    var active = terms.find(function (t) { return t.id === state.active[topic.id]; });
    var desc = SS.L(topic, "description");
    return '<div class="topic' + (open ? " open" : "") + '" data-topic="' + SS.esc(topic.id) + '" id="topic-' + SS.esc(topic.slug || topic.id) + '">' +
      '<button type="button" class="topic-head" aria-expanded="' + open + '">' +
        '<span class="emoji" aria-hidden="true">' + SS.esc(topic.icon || "📘") + "</span>" +
        "<span><h3>" + SS.esc(SS.L(topic, "name")) + "</h3>" + (desc ? "<p>" + SS.esc(desc) + "</p>" : "") + "</span>" +
        '<span class="mini-progress" style="margin-left:auto">' + SS.esc(SS.t("common.terms", { n: terms.length })) + (done ? " · ✓ " + done : "") + "</span>" +
        '<span class="chev" style="margin-left:0" aria-hidden="true">▾</span>' +
      "</button>" +
      '<div class="topic-body"><div><div class="topic-inner">' +
        (terms.length
          ? '<div class="chips">' + terms.map(function (t) { return chipHtml(t, topic.id); }).join("") + "</div>" +
            '<div class="explain-slot">' + (active ? explainHtml(active, false) : '<p class="dim small" style="margin:14px 0 0">' + SS.esc(SS.t("learn.pick")) + "</p>") + "</div>"
          : '<p class="dim" style="margin:0">' + SS.esc(SS.t("learn.noTerms")) + "</p>") +
      "</div></div></div></div>";
  }

  function renderTopics() {
    document.getElementById("topics-meta").textContent = SS.t("learn.meta", { topics: state.topics.length, terms: state.terms.length });
    if (!state.topics.length) {
      elTopics.innerHTML = '<div class="empty"><span class="emoji">📭</span>' + SS.esc(SS.t("learn.noTopics")) + "</div>";
      return;
    }
    elTopics.innerHTML = state.topics.map(topicHtml).join("");
  }

  function renderResults() {
    var q = fold(state.q.trim());
    var searching = q.length > 0;
    document.getElementById("results-section").hidden = !searching;
    document.getElementById("topics-section").hidden = searching;
    var count = document.getElementById("q-count");
    count.hidden = !searching;
    if (!searching) return;
    var hits = state.terms.filter(function (t) {
      return fold(t.term_en).indexOf(q) !== -1 || fold(t.term_az).indexOf(q) !== -1 ||
             fold(t.summary_en).indexOf(q) !== -1 || fold(t.summary_az).indexOf(q) !== -1;
    });
    /* Title matches first. */
    hits.sort(function (a, b) {
      var ai = Math.min.apply(null, [fold(a.term_en).indexOf(q), fold(a.term_az).indexOf(q)].map(function (i) { return i < 0 ? 999 : i; }));
      var bi = Math.min.apply(null, [fold(b.term_en).indexOf(q), fold(b.term_az).indexOf(q)].map(function (i) { return i < 0 ? 999 : i; }));
      return ai - bi;
    });
    count.textContent = SS.t("learn.found", { n: hits.length });
    elResults.innerHTML = hits.length
      ? hits.map(function (t) { return explainHtml(t, true); }).join("")
      : '<div class="empty"><span class="emoji">🔍</span>' + SS.esc(SS.t("learn.noResults", { q: state.q.trim() })) + "</div>";
  }

  function render() { renderTopics(); renderResults(); document.getElementById("offline-note").hidden = !SS.db.offline; }

  /* --- interactions --- */
  elTopics.addEventListener("click", function (e) {
    var head = e.target.closest(".topic-head");
    if (head) {
      var box = head.parentElement, id = box.getAttribute("data-topic");
      var open = box.classList.toggle("open");
      head.setAttribute("aria-expanded", String(open));
      if (open) state.open.add(id); else state.open.delete(id);
      return;
    }
    var chip = e.target.closest("[data-term-chip]");
    if (chip) {
      var topicBox = chip.closest(".topic"), topicId = topicBox.getAttribute("data-topic"), termId = chip.getAttribute("data-term-chip");
      var same = state.active[topicId] === termId;
      state.active[topicId] = same ? null : termId;
      SS.$$("[data-term-chip]", topicBox).forEach(function (c) { c.setAttribute("aria-pressed", String(!same && c === chip)); });
      var term = state.terms.find(function (t) { return t.id === termId; });
      SS.$(".explain-slot", topicBox).innerHTML = same ? '<p class="dim small" style="margin:14px 0 0">' + SS.esc(SS.t("learn.pick")) + "</p>" : explainHtml(term, false);
    }
  });

  async function onAction(e) {
    var btn = e.target.closest("[data-act]");
    if (!btn) return;
    var card = btn.closest(".explain"), termId = card.getAttribute("data-term"), field = btn.getAttribute("data-act");
    btn.disabled = true;
    var result = await SS.toggleProgress(termId, field);
    btn.disabled = false;
    if (!result) return;
    state.progress = await SS.db.progress();
    var scrollY = window.scrollY;
    render();
    window.scrollTo(0, scrollY);
  }
  elTopics.addEventListener("click", onAction);
  elResults.addEventListener("click", onAction);

  input.addEventListener("input", function () { state.q = input.value; renderResults(); });
  document.addEventListener("langchange", render);

  SS.auth.ready.then(async function () {
    var content = await SS.db.content();
    state.topics = content.topics; state.terms = content.terms;
    state.progress = await SS.db.progress();
    var hash = decodeURIComponent(location.hash.slice(1));
    if (hash) {
      var wanted = state.topics.find(function (t) { return t.slug === hash || t.id === hash; });
      if (wanted) state.open.add(wanted.id);
    }
    var q = new URLSearchParams(location.search).get("q");
    if (q) { input.value = q; state.q = q; }
    render();
    if (hash) { var el = document.getElementById("topic-" + hash); if (el) el.scrollIntoView({ block: "center" }); }
  });
})();
