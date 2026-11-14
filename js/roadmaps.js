/* SyntaxSec — roadmaps.html: study tracks with per-user progress (user_progress.mastered). */
(function () {
  "use strict";
  var SS = window.SS;
  SS.addStrings({
    en: {
      "road.title": "Roadmaps", "road.h1": "Cybersecurity learning roadmaps",
      "road.lead": "Three study tracks from beginner to advanced. Open a term, read it, mark it as mastered — your progress bar fills as you go.",
      "road.empty": "No topics are assigned to this roadmap yet. The administrator can assign a topic to a roadmap in Admin → Topics.",
      "road.complete": "Track complete — well done!", "road.toggle": "Tick to mark as mastered", "road.open": "Open"
    },
    az: {
      "road.title": "Yol xəritələri", "road.h1": "Kibertəhlükəsizlik üzrə yol xəritələri",
      "road.lead": "Başlanğıcdan irəli səviyyəyə üç təlim treki. Termini aç, oxu, mənimsənilmiş kimi işarələ — irəliləyiş zolağın getdikcə dolur.",
      "road.empty": "Bu yol xəritəsinə hələ mövzu təyin edilməyib. Administrator mövzunu Admin → Mövzular bölməsində yol xəritəsinə təyin edə bilər.",
      "road.complete": "Trek tamamlandı — əla!", "road.toggle": "Mənimsənilmiş kimi işarələmək üçün seç", "road.open": "Aç"
    }
  });

  var state = { topics: [], terms: [], progress: new Map() };
  var host = document.getElementById("tracks");

  function render() {
    document.getElementById("offline-note").hidden = !SS.db.offline;
    host.innerHTML = SS.TRACKS.map(function (tr) {
      var topics = state.topics.filter(function (t) { return t.track === tr.id; });
      var ids = topics.map(function (t) { return t.id; });
      var terms = state.terms.filter(function (t) { return ids.indexOf(t.topic_id) !== -1; });
      var done = terms.filter(function (t) { return (state.progress.get(t.id) || {}).mastered; }).length;
      var pct = terms.length ? Math.round(done / terms.length * 100) : 0;
      var body = topics.length ? topics.map(function (topic) {
        var tt = state.terms.filter(function (t) { return t.topic_id === topic.id; });
        var td = tt.filter(function (t) { return (state.progress.get(t.id) || {}).mastered; }).length;
        return '<div class="track-topic"><h4><span>' + SS.esc((topic.icon || "📘") + " " + SS.L(topic, "name")) + '</span><span class="badge ' + (tt.length && td === tt.length ? "mint" : "plain") + '">' + td + "/" + tt.length + "</span></h4>" +
          '<div class="chips">' + tt.map(function (t) {
            var m = (state.progress.get(t.id) || {}).mastered;
            return '<span class="chip' + (m ? " mastered" : "") + '" style="cursor:default;padding:4px 6px 4px 10px">' +
              '<label class="check" title="' + SS.esc(SS.t("road.toggle")) + '"><input type="checkbox" data-master="' + SS.esc(t.id) + '"' + (m ? " checked" : "") + ">" +
              "<span>" + SS.esc(SS.L(t, "term")) + "</span></label>" +
              '<a class="btn sm soft" style="padding:3px 9px;margin-left:4px" href="term-detail.html?id=' + encodeURIComponent(t.id) + '">' + SS.esc(SS.t("road.open")) + "</a></span>";
          }).join("") + "</div></div>";
      }).join("") : '<p class="dim small" style="margin:0">' + SS.esc(SS.t("road.empty")) + "</p>";
      return '<section class="card track ' + tr.tint + '" id="' + tr.id + '">' +
        '<div class="row between"><span class="badge plain">' + SS.esc(SS.t("level." + tr.level)) + "</span><strong>" + pct + "%</strong></div>" +
        '<h2 style="margin-top:10px">' + tr.emoji + " " + SS.esc(SS.t("track." + tr.id)) + "</h2>" +
        '<p class="dim">' + SS.esc(SS.t("track." + tr.id + ".d")) + "</p>" +
        '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><i style="width:' + pct + '%"></i></div>' +
        '<p class="small dim" style="margin:8px 0 0">' + SS.esc(pct === 100 && terms.length ? SS.t("road.complete") : SS.t("common.masteredOf", { done: done, total: terms.length })) + "</p>" +
        '<div class="track-topics">' + body + "</div></section>";
    }).join("");
  }

  host.addEventListener("change", async function (e) {
    var box = e.target.closest("[data-master]");
    if (!box) return;
    box.disabled = true;
    var ok = await SS.toggleProgress(box.getAttribute("data-master"), "mastered");
    if (ok) state.progress = await SS.db.progress();
    var y = window.scrollY; render(); window.scrollTo(0, y);
  });
  document.addEventListener("langchange", render);

  SS.auth.ready.then(async function () {
    var content = await SS.db.content();
    state.topics = content.topics; state.terms = content.terms;
    state.progress = await SS.db.progress();
    render();
    if (location.hash) { var el = document.getElementById(location.hash.slice(1)); if (el) el.scrollIntoView(); }
  });
})();
