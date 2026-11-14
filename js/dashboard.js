/* SyntaxSec — dashboard.html: daily term, quick tips, stats, roadmap progress, bookmarks. */
(function () {
  "use strict";
  var SS = window.SS;
  SS.addStrings({
    en: {
      "dash.title": "Home", "dash.hello": "Welcome back", "dash.helloName": "Welcome back, {name}",
      "dash.lead": "Pick up where you left off, or learn one new thing today.",
      "dash.termOfDay": "Term of the day", "dash.readDeep": "Read the deep dive", "dash.quickTip": "Quick security tip:",
      "dash.nextTip": "Show another tip", "dash.noTerm": "No terms yet", "dash.noTermP": "Once terms are added to the library, a new one appears here every day.",
      "dash.stMastered": "terms mastered", "dash.stBookmarks": "bookmarks", "dash.stTerms": "terms in the library", "dash.stQuiz": "best quiz score",
      "dash.roadmapsH": "Your roadmaps", "dash.openRoadmaps": "Open roadmaps", "dash.bookmarksH": "Bookmarked terms",
      "dash.noBookmarks": "No bookmarks yet. Open the Learn hub and tap the bookmark button on any term you want to revisit.",
      "dash.goLearn": "Go to Learn", "dash.toolsH": "Jump into a tool",
      "dash.t1": "Audit a password and generate a stronger one.", "dash.t2": "Check a suspicious email from text or a screenshot.",
      "dash.t3": "Take a URL apart before you click it.", "dash.t4h": "Spot the Fake", "dash.t4": "Ten messages. Phishing or legit?",
      "tip.0": "Use a different password for every account. One leaked password should never open a second door.",
      "tip.1": "Turn on two-factor authentication for your email first — it is the key to resetting every other account.",
      "tip.2": "Before you click a link, hover over it (or long-press on a phone) and read the real domain from right to left.",
      "tip.3": "Banks and delivery companies do not ask for card numbers, PINs or SMS codes through a link.",
      "tip.4": "Install updates when they arrive. Most attacks use holes that already have a patch.",
      "tip.5": "A password manager remembers long random passwords so you do not have to.",
      "tip.6": "Public Wi-Fi is fine for browsing over HTTPS, but avoid logging in to sensitive accounts without a VPN.",
      "tip.7": "Lock your screen every time you walk away, even for a minute.",
      "tip.8": "Back up important files in three copies, on two kinds of storage, with one copy somewhere else.",
      "tip.9": "Urgency is a warning sign. A message that says “act now or lose your account” deserves a slow, careful look.",
      "tip.10": "An authenticator app is safer than SMS codes, which can be stolen by SIM swapping.",
      "tip.11": "Check which apps can read your location, camera and contacts, and remove permissions you do not need."
    },
    az: {
      "dash.title": "Ana səhifə", "dash.hello": "Yenidən xoş gəldin", "dash.helloName": "Yenidən xoş gəldin, {name}",
      "dash.lead": "Qaldığın yerdən davam et və ya bu gün yeni bir şey öyrən.",
      "dash.termOfDay": "Günün termini", "dash.readDeep": "Ətraflı oxu", "dash.quickTip": "Qısa təhlükəsizlik məsləhəti:",
      "dash.nextTip": "Başqa məsləhət göstər", "dash.noTerm": "Hələ termin yoxdur", "dash.noTermP": "Kitabxanaya terminlər əlavə olunduqdan sonra burada hər gün yenisi görünəcək.",
      "dash.stMastered": "mənimsənilmiş termin", "dash.stBookmarks": "əlfəcin", "dash.stTerms": "kitabxanadakı termin", "dash.stQuiz": "ən yaxşı viktorina nəticəsi",
      "dash.roadmapsH": "Yol xəritələrin", "dash.openRoadmaps": "Yol xəritələrini aç", "dash.bookmarksH": "Əlfəcinlənmiş terminlər",
      "dash.noBookmarks": "Hələ əlfəcin yoxdur. Öyrən bölməsini aç və yenidən baxmaq istədiyin terminin əlfəcin düyməsinə toxun.",
      "dash.goLearn": "Öyrən bölməsinə keç", "dash.toolsH": "Alətə keç",
      "dash.t1": "Parolu yoxla və daha güclüsünü yarat.", "dash.t2": "Şübhəli məktubu mətn və ya ekran şəkli ilə yoxla.",
      "dash.t3": "Kliklədən əvvəl keçidi hissələrinə ayır.", "dash.t4h": "Saxtanı tap", "dash.t4": "On mesaj. Fişinqdir, yoxsa həqiqi?",
      "tip.0": "Hər hesab üçün fərqli parol istifadə et. Sızan bir parol heç vaxt ikinci qapını açmamalıdır.",
      "tip.1": "İki faktorlu autentifikasiyanı əvvəlcə e-poçtunda aktiv et — o, bütün digər hesabların bərpa açarıdır.",
      "tip.2": "Keçidə klikləməzdən əvvəl kursoru üzərinə gətir (telefonda basıb saxla) və əsl domeni sağdan sola oxu.",
      "tip.3": "Banklar və çatdırılma şirkətləri kart nömrəsini, PIN-i və ya SMS kodunu keçid vasitəsilə istəmir.",
      "tip.4": "Yeniləmələri gələn kimi quraşdır. Hücumların çoxu artıq düzəlişi olan boşluqlardan istifadə edir.",
      "tip.5": "Parol meneceri uzun təsadüfi parolları sənin yerinə yadda saxlayır.",
      "tip.6": "İctimai Wi-Fi-da HTTPS ilə gəzmək olar, amma VPN-siz vacib hesablara daxil olma.",
      "tip.7": "Bir dəqiqəlik olsa belə, kompüterdən uzaqlaşanda ekranı kilidlə.",
      "tip.8": "Vacib faylların üç nüsxəsini saxla: iki fərqli daşıyıcıda, biri isə başqa yerdə.",
      "tip.9": "Tələsdirmək xəbərdarlıq əlamətidir. “İndi et, yoxsa hesabın bağlanacaq” deyən mesaja yavaş və diqqətlə bax.",
      "tip.10": "Autentifikator tətbiqi SIM dəyişdirmə ilə oğurlana bilən SMS kodlarından daha təhlükəsizdir.",
      "tip.11": "Hansı tətbiqlərin məkanına, kamerana və kontaktlarına çıxışı olduğunu yoxla, lazımsız icazələri sil."
    }
  });

  var TIPS = 12;
  var day = Math.floor(Date.now() / 86400000);
  var tipIndex = day % TIPS;
  var state = { topics: [], terms: [], progress: new Map() };

  function paintTip() { document.getElementById("tip-text").textContent = SS.t("tip." + tipIndex); }

  function render() {
    var name = SS.auth.displayName();
    document.getElementById("hello").removeAttribute("data-i18n");
    document.getElementById("hello").textContent = name ? SS.t("dash.helloName", { name: name }) : SS.t("dash.hello");
    document.getElementById("offline-note").hidden = !SS.db.offline;
    paintTip();

    /* Term of the day: the same term for everyone on a given date. */
    var title = document.getElementById("daily-title"), summary = document.getElementById("daily-summary"), link = document.getElementById("daily-link");
    if (state.terms.length) {
      var sorted = state.terms.slice().sort(function (a, b) { return String(a.slug).localeCompare(String(b.slug)); });
      var term = sorted[day % sorted.length];
      title.textContent = SS.L(term, "term");
      summary.textContent = SS.L(term, "summary");
      link.href = "term-detail.html?id=" + encodeURIComponent(term.id);
      link.hidden = false;
    } else {
      title.textContent = SS.t("dash.noTerm"); summary.textContent = SS.t("dash.noTermP"); link.hidden = true;
    }

    var mastered = 0, bookmarks = [];
    var known = new Set(state.terms.map(function (t) { return t.id; }));
    state.progress.forEach(function (v, k) { if (!known.has(k)) return; if (v.mastered) mastered++; if (v.bookmarked) bookmarks.push(k); });
    document.getElementById("st-mastered").textContent = mastered;
    document.getElementById("st-bookmarks").textContent = bookmarks.length;
    document.getElementById("st-terms").textContent = state.terms.length;
    var best = null; try { best = localStorage.getItem("ss-quiz-best"); } catch (e) {}
    document.getElementById("st-quiz").textContent = best || "–";

    document.getElementById("dash-tracks").innerHTML = SS.TRACKS.map(function (tr) {
      var topicIds = state.topics.filter(function (t) { return t.track === tr.id; }).map(function (t) { return t.id; });
      var terms = state.terms.filter(function (t) { return topicIds.indexOf(t.topic_id) !== -1; });
      var done = terms.filter(function (t) { return (state.progress.get(t.id) || {}).mastered; }).length;
      var pct = terms.length ? Math.round(done / terms.length * 100) : 0;
      return '<a class="card track ' + tr.tint + '" href="roadmaps.html#' + tr.id + '">' +
        '<div class="row between"><span class="badge plain">' + SS.esc(SS.t("level." + tr.level)) + "</span><strong>" + pct + "%</strong></div>" +
        '<h3 style="margin-top:10px">' + tr.emoji + " " + SS.esc(SS.t("track." + tr.id)) + "</h3>" +
        '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><i data-w="' + pct + '"></i></div>' +
        '<p class="small dim" style="margin-top:8px">' + SS.esc(SS.t("common.masteredOf", { done: done, total: terms.length })) + "</p></a>";
    }).join("");
    requestAnimationFrame(function () { SS.$$("#dash-tracks .bar i").forEach(function (i) { i.style.width = i.getAttribute("data-w") + "%"; }); });

    var box = document.getElementById("dash-bookmarks");
    if (!bookmarks.length) {
      box.innerHTML = '<div class="empty"><span class="emoji">🔖</span><p>' + SS.esc(SS.t("dash.noBookmarks")) + '</p><a class="btn soft sm" href="modules.html">' + SS.esc(SS.t("dash.goLearn")) + "</a></div>";
    } else {
      box.innerHTML = '<div class="chips">' + state.terms.filter(function (t) { return bookmarks.indexOf(t.id) !== -1; }).map(function (t) {
        var m = (state.progress.get(t.id) || {}).mastered;
        return '<a class="chip' + (m ? " mastered" : "") + '" style="text-decoration:none" href="term-detail.html?id=' + encodeURIComponent(t.id) + '"><span class="mark">' + (m ? "✓" : "🔖") + "</span>" + SS.esc(SS.L(t, "term")) + "</a>";
      }).join("") + "</div>";
    }
  }

  document.getElementById("tip-next").addEventListener("click", function () {
    tipIndex = (tipIndex + 1) % TIPS; paintTip();
    var el = document.getElementById("tip-text"); el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); el.style.display = "inline-block";
  });
  document.addEventListener("langchange", render);

  SS.auth.ready.then(async function () {
    var content = await SS.db.content();
    state.topics = content.topics; state.terms = content.terms;
    state.progress = await SS.db.progress();
    render();
  });
})();
