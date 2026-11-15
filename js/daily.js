/* SyntaxSec — daily.html: Question of the Day, streak + restore, archive, inventory.
   Data access lives in js/progress.js (SS.daily); the database decides what is
   correct, what today's date is (Asia/Baku) and which items are rolled. */
(function () {
  "use strict";
  var SS = window.SS, D = SS.daily;
  var $ = function (id) { return document.getElementById(id); };
  var t = SS.t, esc = SS.esc;
  var LETTERS = ["A", "B", "C", "D", "E", "F"];
  var SOURCE_KEYS = { daily: "daily.rewardDaily", streak_bonus: "daily.rewardBonus", archive: "daily.rewardArchive" };

  function view(kind) {
    return { kind: kind, date: null, data: null, errorKey: null, selected: null, busy: false, msgKey: null, items: null };
  }
  var state = {
    progress: null,
    today: view("today"),
    past: view("archive"),
    archive: null, archiveErr: null,
    inventory: null, inventoryErr: null
  };
  var boxes = { today: $("qotd"), archive: $("arch-q") };

  /* ------------------------------------------------------------------ question card */
  function renderQuestion(v) {
    var box = boxes[v.kind];
    if (!v.data) {
      box.innerHTML = v.errorKey
        ? '<div class="notice bad"><span aria-hidden="true">⚠️</span><span class="grow">' + esc(t(v.errorKey)) + "</span>" +
          '<button class="btn ghost sm" type="button" data-retry>' + esc(t("daily.retry")) + "</button></div>"
        : '<div class="skeleton" style="min-height:260px"></div>';
      return;
    }
    var q = v.data.question, ans = v.data.answer, answered = !!(v.data.answered && ans);
    var choices = q["choices_" + SS.lang];
    if (!choices || !choices.length) choices = q.choices_en || [];
    var tone = { easy: "mint", medium: "sun", hard: "coral" }[q.difficulty] || "plain";
    var promptId = "qotd-prompt-" + v.kind;

    var html = '<div class="row qotd-meta">' +
      '<span class="badge">' + esc(t(v.kind === "today" ? "daily.badgeToday" : "daily.badgeArchive")) + " · " + esc(D.fmtDay(v.data.date)) + "</span>" +
      '<span class="badge plain">' + esc(D.category(q.category)) + "</span>" +
      '<span class="badge ' + tone + '">' + esc(t("diff." + q.difficulty)) + "</span></div>" +
      '<h2 class="qotd-prompt" id="' + promptId + '">' + esc(SS.L(q, "prompt")) + "</h2>" +
      '<div class="qotd-opts" role="radiogroup" aria-labelledby="' + promptId + '">';
    choices.forEach(function (text, i) {
      var picked = answered ? ans.choice_index === i : v.selected === i;
      var cls = "qotd-opt" + (answered && picked ? (ans.is_correct ? " right" : " wrong") : "");
      var focusable = !answered && (picked || (v.selected === null && i === 0));
      html += '<button class="' + cls + '" type="button" role="radio" aria-checked="' + picked + '" data-choice="' + i + '"' +
        (answered || v.busy ? " disabled" : "") + ' tabindex="' + (focusable ? "0" : "-1") + '">' +
        '<span class="key" aria-hidden="true">' + (LETTERS[i] || i + 1) + "</span><span class=\"grow\">" + esc(text) + "</span>" +
        (answered && picked ? '<span class="mark" aria-hidden="true">' + (ans.is_correct ? "✓" : "✕") + "</span>" : "") + "</button>";
    });
    html += "</div>";

    if (!answered) {
      html += '<div class="row" style="margin-top:16px"><button class="btn" type="button" data-submit' +
        (v.selected === null || v.busy ? " disabled" : "") + ">" + esc(t(v.busy ? "daily.submitting" : "daily.submit")) + "</button></div>" +
        '<p class="form-msg bad" role="status">' + esc(v.msgKey ? t(v.msgKey) : "") + "</p>";
      if (v.kind === "archive") html += '<p class="small dim" style="margin:6px 0 0">' + esc(t("daily.archiveNote")) + "</p>";
    } else {
      html += '<div class="verdict ' + (ans.is_correct ? "ok" : "bad") + '" style="margin-top:16px">' +
        '<span class="big" aria-hidden="true">' + (ans.is_correct ? "✅" : "❌") + "</span>" +
        "<div><h3>" + esc(t(ans.is_correct ? "daily.correct" : "daily.wrong")) + "</h3>" +
        "<p><strong>" + esc(t("daily.explain")) + ":</strong> " + esc(SS.L(ans, "explanation")) + "</p></div></div>";
      if (v.items && v.items.length) {
        html += '<div class="rewards"><h4>' + esc(t("daily.rewardH")) + '</h4><div class="item-grid">' +
          v.items.map(function (item, i) {
            return D.itemHtml(item, '<span class="badge plain item-src">' + esc(t(SOURCE_KEYS[item.source] || "daily.rewardDaily")) + "</span>", ' style="--i:' + i + '"');
          }).join("") + "</div></div>";
      }
      html += '<p class="small dim" style="margin:14px 0 0">' + esc(t(v.kind === "today" ? "daily.answeredToday" : "daily.answeredPast")) + "</p>";
    }
    box.innerHTML = html;
  }

  async function loadToday() {
    var v = state.today;
    v.errorKey = null; renderQuestion(v);
    try {
      var data = await D.question();
      if (!v.data || v.data.date !== data.date) { v.selected = null; v.items = null; v.msgKey = null; }
      v.data = data; v.date = data.date;
    } catch (err) { console.error(err); v.data = null; v.errorKey = D.errorKey(err); }
    renderQuestion(v);
  }

  async function openPast(date) {
    var v = state.past;
    v.date = date; v.data = null; v.errorKey = null; v.selected = null; v.items = null; v.msgKey = null;
    boxes.archive.hidden = false;
    paintArchive();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date || ""))) { v.errorKey = "daily.errDate"; renderQuestion(v); return; }
    /* Friendly pre-check; get_past_question() enforces the same rule in the database. */
    if (state.archive && date >= state.archive.today) { v.errorKey = "daily.errNotPast"; renderQuestion(v); return; }
    renderQuestion(v);
    try { v.data = await D.pastQuestion(date); }
    catch (err) { console.error(err); v.errorKey = D.errorKey(err); }
    if (v.date !== date) return;   /* another date was opened meanwhile */
    renderQuestion(v);
    boxes.archive.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  async function submit(v) {
    if (v.selected === null || v.busy || !v.data || v.data.answered) return;
    v.busy = true; v.msgKey = null; renderQuestion(v);
    try {
      var res = v.kind === "today" ? await D.submit(v.selected, v.data.question.id) : await D.submitPast(v.data.date, v.selected);
      v.data.answered = true;
      v.data.answer = { choice_index: res.choice_index, is_correct: res.correct, explanation_en: res.explanation_en, explanation_az: res.explanation_az };
      v.items = res.items || [];
      setProgress(res.progress);
      loadInventory();
      if (v.kind === "archive") loadArchive();
    } catch (err) {
      console.error(err);
      var code = D.code(err);
      v.busy = false;
      if (code === "already_answered" || code === "question_changed") {
        /* Answered in another tab, or Baku midnight passed: show the current state. */
        SS.toast(t(D.errorKey(err)), code === "already_answered" ? "bad" : "");
        if (v.kind === "today") { v.data = null; await loadToday(); loadProgress(); } else await openPast(v.date);
        return;
      }
      v.msgKey = D.errorKey(err);
    }
    v.busy = false; renderQuestion(v);
  }

  function bindQuestion(v, reload) {
    var box = boxes[v.kind];
    function choose(i, focus) {
      v.selected = i; v.msgKey = null; renderQuestion(v);
      if (focus) { var el = box.querySelector('[aria-checked="true"]'); if (el) el.focus(); }
    }
    box.addEventListener("click", function (e) {
      if (e.target.closest("[data-retry]")) { reload(); return; }
      var opt = e.target.closest("[data-choice]");
      if (opt && !opt.disabled) { choose(+opt.getAttribute("data-choice"), true); return; }
      if (e.target.closest("[data-submit]")) submit(v);
    });
    /* Arrow keys move the selection, as in a native radio group. */
    box.addEventListener("keydown", function (e) {
      var step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!step || !e.target.closest("[data-choice]") || !v.data || v.data.answered || v.busy) return;
      e.preventDefault();
      var n = (v.data.question.choices_en || []).length; if (!n) return;
      choose(((v.selected === null ? (step > 0 ? -1 : 0) : v.selected) + step + n) % n, true);
    });
  }
  bindQuestion(state.today, loadToday);
  bindQuestion(state.past, function () { openPast(state.past.date); });

  /* ------------------------------------------------------------------ streak + restore */
  function paintStreak() {
    var p = state.progress; if (!p) return;
    $("st-current").textContent = p.current_streak + (p.current_streak > 0 ? " 🔥" : "");
    $("st-longest").textContent = p.longest_streak;
    $("st-restores").textContent = p.restores_remaining + " / " + p.restores_per_month;
    $("restore-box").hidden = !p.can_restore;
    $("restore-text").textContent = t("streak.restoreMissed", { date: D.fmtDay(p.restore_date) });
    $("streak-rules").textContent = t("streak.rules", { a: p.bonus_roll_streak, b: p.guarantee_streak, rarity: t("rarity." + p.guarantee_min_rarity) });
    $("streak-rules-restore").textContent = t("streak.rulesRestore", { n: p.restores_per_month });
    $("restore-confirm-p").textContent = t("streak.confirmP", { date: D.fmtDay(p.restore_date), n: p.restores_remaining });
  }
  function setProgress(p) { state.progress = p; D.applyProgress(p); paintStreak(); }
  async function loadProgress() {
    try { setProgress(await D.progress()); } catch (err) { console.error(err); }
  }

  var modal = $("restore-modal"), yes = $("restore-yes"), no = $("restore-no");
  function closeModal() { modal.classList.remove("open"); }
  $("restore-btn").addEventListener("click", function () {
    paintStreak();
    modal.classList.add("open");
    setTimeout(function () { no.focus(); }, 60);
  });
  no.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  yes.addEventListener("click", async function () {
    if (!state.progress || yes.disabled) return;
    yes.disabled = no.disabled = true; yes.textContent = t("streak.restoring");
    try {
      setProgress(await D.restore(state.progress.restore_date));
      SS.toast(t("streak.restored"), "ok");
    } catch (err) {
      console.error(err);
      SS.toast(t(D.errorKey(err)), "bad");
      loadProgress();   /* the offer may be out of date (new day, used elsewhere) */
    }
    yes.disabled = no.disabled = false; yes.textContent = t("streak.restoreBtn");
    closeModal();
  });

  /* ------------------------------------------------------------------ archive */
  function paintArchive() {
    var list = $("arch-list"), form = $("arch-form"), a = state.archive;
    if (!a) {
      form.hidden = true;
      list.innerHTML = state.archiveErr
        ? '<div class="notice bad grow"><span aria-hidden="true">⚠️</span><span class="grow">' + esc(t(state.archiveErr)) + "</span>" +
          '<button class="btn ghost sm" type="button" data-arch-retry>' + esc(t("daily.retry")) + "</button></div>"
        : '<div class="skeleton grow"></div>';
      return;
    }
    form.hidden = !a.days.length;
    if (!a.days.length) { list.innerHTML = '<div class="empty grow"><span class="emoji">🗓️</span><p style="margin:0">' + esc(t("arch.empty")) + "</p></div>"; return; }
    var input = $("arch-date");
    input.min = a.archive_start; input.max = a.days[0].date;   /* only past dates are selectable */
    list.innerHTML = a.days.map(function (d) {
      var status = d.answered ? (d.is_correct ? "right" : "wrong") : "todo";
      var label = t(status === "right" ? "arch.right" : status === "wrong" ? "arch.wrongA" : "arch.todo");
      return '<button class="chip arch-' + status + '" type="button" data-date="' + esc(d.date) + '" aria-pressed="' + (state.past.date === d.date) +
        '" title="' + esc(label) + '"><span class="mark" aria-hidden="true">' + (status === "right" ? "✓" : status === "wrong" ? "✕" : "•") + "</span>" +
        esc(D.fmtDay(d.date)) + '<span class="sr-only"> — ' + esc(label) + "</span></button>";
    }).join("");
  }
  async function loadArchive() {
    try { state.archive = await D.archive(); state.archiveErr = null; }
    catch (err) { console.error(err); state.archive = null; state.archiveErr = D.errorKey(err); }
    paintArchive();
  }
  $("arch-list").addEventListener("click", function (e) {
    if (e.target.closest("[data-arch-retry]")) { state.archiveErr = null; paintArchive(); loadArchive(); return; }
    var chip = e.target.closest("[data-date]");
    if (chip) { $("arch-date").value = chip.getAttribute("data-date"); openPast(chip.getAttribute("data-date")); }
  });
  $("arch-form").addEventListener("submit", function (e) {
    e.preventDefault();
    openPast($("arch-date").value);
  });

  /* ------------------------------------------------------------------ inventory */
  function paintInventory() {
    var list = $("inv-list"), inv = state.inventory;
    $("inv-total").textContent = inv ? D.countLabel(inv.total) : "";
    if (!inv) {
      list.innerHTML = state.inventoryErr
        ? '<div class="notice bad"><span aria-hidden="true">⚠️</span><span class="grow">' + esc(t(state.inventoryErr)) + "</span>" +
          '<button class="btn ghost sm" type="button" data-inv-retry>' + esc(t("daily.retry")) + "</button></div>"
        : '<div class="skeleton"></div>';
      return;
    }
    if (!inv.total) { list.innerHTML = '<div class="empty"><span class="emoji">🎒</span><p style="margin:0">' + esc(t("inv.empty")) + "</p></div>"; return; }
    list.innerHTML = inv.groups.map(function (g) {
      return '<div class="inv-group"><div class="row"><span class="badge rarity r-' + g.rarity + '">' + esc(t("rarity." + g.rarity)) + "</span>" +
        '<span class="small dim">' + esc(D.countLabel(g.total)) + '</span></div><div class="item-grid">' +
        g.items.map(function (x) { return D.itemHtml(x.item, '<span class="item-count" aria-label="' + esc(D.countLabel(x.count)) + '">×' + x.count + "</span>"); }).join("") +
        "</div></div>";
    }).join("");
  }
  async function loadInventory() {
    try { state.inventory = await D.inventory(); state.inventoryErr = null; }
    catch (err) { console.error(err); state.inventory = null; state.inventoryErr = D.errorKey(err); }
    paintInventory();
  }
  $("inv-list").addEventListener("click", function (e) {
    if (e.target.closest("[data-inv-retry]")) { state.inventoryErr = null; paintInventory(); loadInventory(); }
  });

  /* ------------------------------------------------------------------ boot */
  var alertKey = null;
  function paintAlert() {
    $("daily-alert").hidden = !alertKey;
    $("daily-alert-text").textContent = alertKey ? t(alertKey) : "";
  }
  /* Progress loads first: if it fails (offline, or the Phase 2 SQL has not been
     run) one clear message with a retry button is shown instead of four. */
  async function boot() {
    alertKey = null; paintAlert();
    $("daily-loading").hidden = false; $("daily-content").hidden = true;
    try { setProgress(await D.progress()); }
    catch (err) {
      console.error(err);
      alertKey = D.errorKey(err); paintAlert();
      $("daily-loading").hidden = true;
      return;
    }
    $("daily-loading").hidden = true; $("daily-content").hidden = false;
    paintArchive(); paintInventory();
    await Promise.all([loadToday(), loadArchive(), loadInventory()]);
    if (location.hash) { var target = document.getElementById(location.hash.slice(1)); if (target) target.scrollIntoView(); }
  }
  $("daily-retry").addEventListener("click", boot);

  document.addEventListener("langchange", function () {
    paintAlert(); paintStreak(); paintArchive(); paintInventory();
    renderQuestion(state.today);
    if (!boxes.archive.hidden) renderQuestion(state.past);
  });

  SS.auth.ready.then(function () {
    if (!SS.auth.user) { $("daily-signin").hidden = false; return; }
    $("daily-app").hidden = false;
    boot();
  });
})();
