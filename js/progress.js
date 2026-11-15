/* SyntaxSec — Phase 2 shared layer: Question of the Day, streaks, inventory, titles.
   Used by daily.html, dashboard.html and profile.html (load it after app.js and script.js).
   Every table, column and function name comes from SS.DAILY_DB in js/auth.js, which
   mirrors sql/phase2_daily_progression.sql. All writes go through database functions;
   the browser never learns the correct answer and never rolls a reward. */
(function () {
  "use strict";
  var SS = window.SS;
  var sb = window._supabase;
  var DB = SS.DAILY_DB;

  SS.addStrings({
    en: {
      "daily.title": "Question of the Day", "daily.h1": "Question of the Day",
      "daily.lead": "One security question a day. Answer it to keep your streak going and collect items.",
      "daily.signinH": "Log in to play", "daily.signinP": "The question of the day, your streak and your rewards are saved to your account.",
      "daily.badgeToday": "Question of the day", "daily.badgeArchive": "Archive question",
      "daily.submit": "Submit answer", "daily.submitting": "Checking…",
      "daily.correct": "Correct!", "daily.wrong": "Not quite.", "daily.explain": "Explanation",
      "daily.answeredToday": "You have answered today's question. A new one appears at 00:00 Baku time.",
      "daily.answeredPast": "You have answered this question.",
      "daily.rewardH": "You received", "daily.rewardDaily": "Daily reward", "daily.rewardBonus": "Streak bonus", "daily.rewardArchive": "Archive reward",
      "daily.newTitle": "New title unlocked: {name}",
      "daily.archiveNote": "Archive answers do not change your streak and give one common item.",
      "daily.retry": "Try again",
      "daily.errNetwork": "Cannot reach the server. Check your connection and try again.",
      "daily.errNeedSql": "The Question of the Day is not enabled in the database yet. The site administrator needs to run sql/phase2_daily_progression.sql in Supabase.",
      "daily.errSignIn": "Your session has ended. Log in again.",
      "daily.errAlready": "You have already answered this question.",
      "daily.errChanged": "A new day has started in Baku. Here is the new question.",
      "daily.errChoice": "Choose one of the answers.",
      "daily.errNotPast": "Only past dates can be opened in the archive.",
      "daily.errRange": "That date is before the start of the archive.",
      "daily.errDate": "Pick a valid date.",
      "daily.errNoQuestions": "No questions are available yet.",
      "daily.errRestoreYesterday": "Only yesterday can be restored.",
      "daily.errRestoreNotNeeded": "Yesterday is already completed.",
      "daily.errRestoreGap": "The streak was broken more than one day ago, so it cannot be restored.",
      "daily.errRestoreNone": "You have no restores left this month.",
      "daily.errTitleLocked": "That title is still locked.",
      "daily.errGeneric": "Something went wrong. Try again.",
      "daily.cardTodo": "Not answered yet", "daily.cardDone": "Answered today",
      "daily.cardCta": "Answer today's question", "daily.cardView": "View today's result",
      "daily.cardP": "Answer one question a day to build your streak and collect items.",
      "daily.cardRestore": "You missed yesterday. You can still restore your streak.",
      "daily.cardMore": "Archive and inventory",

      "streak.h": "Your streak", "streak.current": "current streak (days)", "streak.longest": "longest streak (days)",
      "streak.restores": "restores left this month",
      "streak.restoreMissed": "You missed {date}. Restore it to keep your streak going.",
      "streak.restoreBtn": "Restore streak", "streak.restoring": "Restoring…", "streak.restored": "Streak restored.",
      "streak.confirmH": "Restore your streak?",
      "streak.confirmP": "{date} will count as completed. This uses 1 of your {n} remaining restores for this month. A restored day gives no item.",
      "streak.rules": "Streak {a}+: one extra item every day. Streak {b}+: the daily item is at least {rarity}.",
      "streak.rulesRestore": "Restores: {n} per month, for yesterday only.",

      "arch.h": "Archive", "arch.p": "Missed a day? Open a past question.", "arch.pick": "Pick a date", "arch.open": "Open",
      "arch.empty": "No past questions yet. Come back tomorrow.",
      "arch.right": "Answered correctly", "arch.wrongA": "Answered incorrectly", "arch.todo": "Not answered",

      "inv.h": "Inventory", "inv.total": "{n} items", "inv.one": "1 item", "inv.empty": "No items yet. Answer today's question to earn your first one.",
      "rarity.common": "Common", "rarity.uncommon": "Uncommon", "rarity.rare": "Rare", "rarity.epic": "Epic", "rarity.legendary": "Legendary",

      "title.h": "Title", "title.p": "Titles unlock as you answer questions and keep streaks. Choose one to show next to your name.",
      "title.none": "No title", "title.locked": "Locked", "title.saved": "Title saved.", "title.saving": "Saving…",
      "title.req.streak": "{n}-day streak", "title.req.completed": "{n} questions answered", "title.req.items": "{n} items collected",
      "title.req.start": "Unlocked from the start",

      "cat.passwords": "Passwords", "cat.phishing": "Phishing", "cat.web": "Web security", "cat.network": "Networks",
      "cat.malware": "Malware", "cat.crypto": "Cryptography", "cat.it-basics": "IT basics",
      "cat.social-engineering": "Social engineering", "cat.privacy": "Privacy", "cat.general": "General",
      "diff.easy": "Easy", "diff.medium": "Medium", "diff.hard": "Hard",
      "month.short": "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec"
    },
    az: {
      "daily.title": "Günün sualı", "daily.h1": "Günün sualı",
      "daily.lead": "Gündə bir təhlükəsizlik sualı. Seriyanı davam etdirmək və əşya toplamaq üçün cavab ver.",
      "daily.signinH": "Oynamaq üçün daxil ol", "daily.signinP": "Günün sualı, seriyan və mükafatların hesabında saxlanılır.",
      "daily.badgeToday": "Günün sualı", "daily.badgeArchive": "Arxiv sualı",
      "daily.submit": "Cavabı göndər", "daily.submitting": "Yoxlanılır…",
      "daily.correct": "Düzdür!", "daily.wrong": "Tam belə deyil.", "daily.explain": "İzah",
      "daily.answeredToday": "Bugünkü suala cavab vermisən. Yeni sual Bakı vaxtı ilə 00:00-da görünəcək.",
      "daily.answeredPast": "Bu suala cavab vermisən.",
      "daily.rewardH": "Qazandın", "daily.rewardDaily": "Gündəlik mükafat", "daily.rewardBonus": "Seriya bonusu", "daily.rewardArchive": "Arxiv mükafatı",
      "daily.newTitle": "Yeni titul açıldı: {name}",
      "daily.archiveNote": "Arxiv cavabları seriyanı dəyişmir və bir adi əşya verir.",
      "daily.retry": "Yenidən cəhd et",
      "daily.errNetwork": "Serverlə əlaqə yoxdur. Bağlantını yoxlayıb yenidən cəhd et.",
      "daily.errNeedSql": "Günün sualı verilənlər bazasında hələ aktiv deyil. Sayt administratoru Supabase-də sql/phase2_daily_progression.sql skriptini işə salmalıdır.",
      "daily.errSignIn": "Sessiyan bitib. Yenidən daxil ol.",
      "daily.errAlready": "Bu suala artıq cavab vermisən.",
      "daily.errChanged": "Bakıda yeni gün başlayıb. Budur yeni sual.",
      "daily.errChoice": "Cavablardan birini seç.",
      "daily.errNotPast": "Arxivdə yalnız keçmiş tarixləri açmaq olar.",
      "daily.errRange": "Bu tarix arxivin başlanğıcından əvvəldir.",
      "daily.errDate": "Düzgün tarix seç.",
      "daily.errNoQuestions": "Hələ sual yoxdur.",
      "daily.errRestoreYesterday": "Yalnız dünənki günü bərpa etmək olar.",
      "daily.errRestoreNotNeeded": "Dünənki gün artıq tamamlanıb.",
      "daily.errRestoreGap": "Seriya bir gündən çox əvvəl qırılıb, ona görə bərpa edilə bilməz.",
      "daily.errRestoreNone": "Bu ay üçün bərpa haqqın qalmayıb.",
      "daily.errTitleLocked": "Bu titul hələ kilidlidir.",
      "daily.errGeneric": "Xəta baş verdi. Yenidən cəhd et.",
      "daily.cardTodo": "Hələ cavablanmayıb", "daily.cardDone": "Bu gün cavablanıb",
      "daily.cardCta": "Bugünkü suala cavab ver", "daily.cardView": "Bugünkü nəticəyə bax",
      "daily.cardP": "Seriya yığmaq və əşya toplamaq üçün gündə bir suala cavab ver.",
      "daily.cardRestore": "Dünənki günü buraxmısan. Seriyanı hələ bərpa edə bilərsən.",
      "daily.cardMore": "Arxiv və inventar",

      "streak.h": "Seriyan", "streak.current": "cari seriya (gün)", "streak.longest": "ən uzun seriya (gün)",
      "streak.restores": "bu ay qalan bərpa",
      "streak.restoreMissed": "{date} tarixini buraxmısan. Seriyanı davam etdirmək üçün onu bərpa et.",
      "streak.restoreBtn": "Seriyanı bərpa et", "streak.restoring": "Bərpa edilir…", "streak.restored": "Seriya bərpa edildi.",
      "streak.confirmH": "Seriya bərpa edilsin?",
      "streak.confirmP": "{date} tamamlanmış sayılacaq. Bu ay üçün qalan {n} bərpadan 1-i istifadə olunacaq. Bərpa edilən gün üçün əşya verilmir.",
      "streak.rules": "Seriya {a}+: hər gün bir əlavə əşya. Seriya {b}+: gündəlik əşya ən azı “{rarity}” olur.",
      "streak.rulesRestore": "Bərpa: ayda {n} dəfə, yalnız dünənki gün üçün.",

      "arch.h": "Arxiv", "arch.p": "Bir günü buraxmısan? Keçmiş sualı aç.", "arch.pick": "Tarix seç", "arch.open": "Aç",
      "arch.empty": "Hələ keçmiş sual yoxdur. Sabah yenidən bax.",
      "arch.right": "Düzgün cavablanıb", "arch.wrongA": "Səhv cavablanıb", "arch.todo": "Cavablanmayıb",

      "inv.h": "İnventar", "inv.total": "{n} əşya", "inv.one": "1 əşya", "inv.empty": "Hələ əşya yoxdur. İlk əşyanı qazanmaq üçün bugünkü suala cavab ver.",
      "rarity.common": "Adi", "rarity.uncommon": "Qeyri-adi", "rarity.rare": "Nadir", "rarity.epic": "Epik", "rarity.legendary": "Əfsanəvi",

      "title.h": "Titul", "title.p": "Titullar suallara cavab verdikcə və seriya saxladıqca açılır. Adının yanında göstərmək üçün birini seç.",
      "title.none": "Titulsuz", "title.locked": "Kilidli", "title.saved": "Titul yadda saxlanıldı.", "title.saving": "Yadda saxlanılır…",
      "title.req.streak": "{n} günlük seriya", "title.req.completed": "{n} suala cavab", "title.req.items": "{n} əşya toplamaq",
      "title.req.start": "Əvvəldən açıqdır",

      "cat.passwords": "Parollar", "cat.phishing": "Fişinq", "cat.web": "Veb təhlükəsizliyi", "cat.network": "Şəbəkələr",
      "cat.malware": "Zərərli proqramlar", "cat.crypto": "Kriptoqrafiya", "cat.it-basics": "İT əsasları",
      "cat.social-engineering": "Sosial mühəndislik", "cat.privacy": "Məxfilik", "cat.general": "Ümumi",
      "diff.easy": "Asan", "diff.medium": "Orta", "diff.hard": "Çətin",
      "month.short": "yan,fev,mar,apr,may,iyn,iyl,avq,sen,okt,noy,dek"
    }
  });

  /* Error codes raised by the database functions → translation keys. */
  var ERROR_KEYS = {
    not_authenticated: "daily.errSignIn",
    already_answered: "daily.errAlready",
    question_changed: "daily.errChanged",
    invalid_choice: "daily.errChoice",
    date_not_past: "daily.errNotPast",
    date_out_of_range: "daily.errRange",
    invalid_date: "daily.errDate",
    no_questions: "daily.errNoQuestions",
    restore_only_yesterday: "daily.errRestoreYesterday",
    restore_not_needed: "daily.errRestoreNotNeeded",
    restore_not_consecutive: "daily.errRestoreGap",
    restore_none_left: "daily.errRestoreNone",
    title_locked: "daily.errTitleLocked"
  };

  async function rpc(fn, args) {
    if (!sb) throw new Error("offline");
    var res = await sb.rpc(fn, args || {});
    if (res.error) throw res.error;
    return res.data;
  }

  var daily = (SS.daily = {
    RARITIES: ["legendary", "epic", "rare", "uncommon", "common"],

    /* The database error code ("already_answered", …) or "" for anything else. */
    code: function (err) {
      var msg = String((err && err.message) || "");
      return Object.prototype.hasOwnProperty.call(ERROR_KEYS, msg) ? msg : "";
    },

    /* Translation key for any error thrown by the calls below. */
    errorKey: function (err) {
      var msg = String((err && (err.message || err.error_description)) || "");
      var code = String((err && err.code) || "");
      if (ERROR_KEYS[daily.code(err)]) return ERROR_KEYS[daily.code(err)];
      if (msg === "offline" || /failed to fetch|networkerror|load failed|network request failed/i.test(msg)) return "daily.errNetwork";
      /* Unknown function / table / column: the Phase 2 script has not been run. */
      if (/PGRST20[0-9]|42883|42P01|42703/.test(code) || /could not find the (function|table)|schema cache|does not exist/i.test(msg)) return "daily.errNeedSql";
      /* Execute is granted to signed-in users only; an expired session becomes "anon". */
      if (code === "42501" || /permission denied|jwt/i.test(msg)) return "daily.errSignIn";
      return "daily.errGeneric";
    },

    progress: function () { return rpc(DB.fn.progress); },
    question: function () { return rpc(DB.fn.question); },
    submit: function (choice, questionId) {
      var args = {}; args[DB.arg.choice] = choice; args[DB.arg.questionId] = questionId;
      return rpc(DB.fn.submit, args);
    },
    pastQuestion: function (date) {
      var args = {}; args[DB.arg.date] = date;
      return rpc(DB.fn.past, args);
    },
    submitPast: function (date, choice) {
      var args = {}; args[DB.arg.date] = date; args[DB.arg.choice] = choice;
      return rpc(DB.fn.submitPast, args);
    },
    archive: function () { return rpc(DB.fn.archive); },
    restore: function (date) {
      var args = {}; args[DB.arg.date] = date;
      return rpc(DB.fn.restore, args);
    },
    setTitle: async function (titleId) {
      var args = {}; args[DB.arg.titleId] = titleId;
      var data = await rpc(DB.fn.setTitle, args);
      SS.auth.setSelectedTitle(titleId);
      return data;
    },

    /* The user's items grouped by rarity: [{ rarity, total, items: [{ item, count }] }]. */
    inventory: async function () {
      if (!sb) throw new Error("offline");
      var res = await Promise.all([
        sb.from(DB.table.inventory).select(DB.col.inventory).eq(DB.col.inventoryUser, SS.auth.user.id),
        sb.from(DB.table.items).select(DB.col.items)
      ]);
      if (res[0].error) throw res[0].error;
      if (res[1].error) throw res[1].error;
      var counts = {};
      (res[0].data || []).forEach(function (row) { var id = row[DB.col.inventoryItem]; counts[id] = (counts[id] || 0) + 1; });
      var groups = daily.RARITIES.map(function (rarity) { return { rarity: rarity, total: 0, items: [] }; });
      (res[1].data || []).forEach(function (item) {
        var n = counts[item.id]; if (!n) return;
        var group = groups[daily.RARITIES.indexOf(item.rarity)]; if (!group) return;
        group.items.push({ item: item, count: n }); group.total += n;
      });
      groups.forEach(function (g) { g.items.sort(function (a, b) { return a.item.id - b.item.id; }); });
      return { total: (res[0].data || []).length, groups: groups.filter(function (g) { return g.total; }) };
    },

    /* Keep the cached profile (and so the navbar) in step with a progress object. */
    applyProgress: function (progress) {
      if (!progress) return;
      if (SS.auth.profile && SS.auth.profile[DB.col.selectedTitle] !== progress.selected_title_id) {
        SS.auth.setSelectedTitle(progress.selected_title_id);
        SS.renderNav();
      }
      (progress.new_titles || []).forEach(function (t) {
        if (!t.is_default) SS.toast(SS.t("daily.newTitle", { name: SS.L(t, "name") }), "ok");
      });
    },

    /* "2026-11-15" → "15 Nov 2026" / "15 noy 2026". Built from the parts, so there is
       no timezone shift, and Azerbaijani month names do not depend on the browser
       (some browsers have no az locale data and print "M11"). */
    fmtDay: function (iso) {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
      if (!m) return "";
      var month = SS.t("month.short").split(",")[+m[2] - 1] || m[2];
      return +m[3] + " " + month + " " + m[1];
    },

    /* "1 item" / "3 items" */
    countLabel: function (n) { return n === 1 ? SS.t("inv.one") : SS.t("inv.total", { n: n }); },

    category: function (key) { var k = "cat." + key, s = SS.t(k); return s === k ? SS.t("cat.general") : s; },

    titleRequirement: function (t) {
      if (!t.requirement_value) return SS.t("title.req.start");
      return SS.t("title.req." + t.requirement_type, { n: t.requirement_value });
    },

    /* One reward item as markup (used by the reveal and the inventory). */
    itemHtml: function (item, extra, attrs) {
      return '<div class="item r-' + SS.esc(item.rarity) + '"' + (attrs || "") + ">" +
        '<span class="item-icon" aria-hidden="true">' + SS.esc(item.icon || "🎁") + "</span>" +
        '<span class="item-body"><b>' + SS.esc(SS.L(item, "name")) + "</b>" +
        '<span class="item-rarity">' + SS.esc(SS.t("rarity." + item.rarity)) + "</span></span>" +
        (extra || "") + "</div>";
    }
  });
})();
