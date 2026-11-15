/* SyntaxSec — profile.html: account details, the preset avatar picker and the title picker.
   The avatar is stored in profiles.avatar_key (see sql/phase1_account_basics.sql);
   the list of valid keys is SS.AVATAR_KEYS in js/auth.js.
   The title is stored in profiles.selected_title_id and can only be changed through the
   set_selected_title database function, which rejects locked titles (js/progress.js). */
(function () {
  "use strict";
  var SS = window.SS;
  SS.addStrings({
    en: {
      "profile.title": "Profile", "profile.h1": "Your profile",
      "profile.lead": "Your account details and the avatar shown next to your name.",
      "profile.avatarH": "Choose an avatar",
      "profile.avatarP": "Pick one of the presets, or keep the first letter of your username.",
      "profile.save": "Save avatar", "profile.saving": "Saving…", "profile.saved": "Avatar saved.",
      "profile.saveFail": "Could not save the avatar. Try again.",
      "profile.needSql": "Avatars are not enabled in the database yet. The site administrator needs to run sql/phase1_account_basics.sql in Supabase.",
      "avatar.none": "My initial", "avatar.shield": "Shield", "avatar.lock": "Padlock", "avatar.key": "Key",
      "avatar.terminal": "Terminal", "avatar.fingerprint": "Fingerprint", "avatar.robot": "Robot", "avatar.bug": "Bug",
      "avatar.eye": "Eye", "avatar.firewall": "Firewall", "avatar.chip": "Chip", "avatar.radar": "Radar", "avatar.wifi": "Wi-Fi"
    },
    az: {
      "profile.title": "Profil", "profile.h1": "Profiliniz",
      "profile.lead": "Hesab məlumatlarınız və adınızın yanında göstərilən avatar.",
      "profile.avatarH": "Avatar seçin",
      "profile.avatarP": "Hazır avatarlardan birini seçin və ya istifadəçi adınızın ilk hərfini saxlayın.",
      "profile.save": "Avatarı yadda saxla", "profile.saving": "Yadda saxlanılır…", "profile.saved": "Avatar yadda saxlanıldı.",
      "profile.saveFail": "Avatarı yadda saxlamaq mümkün olmadı. Yenidən cəhd edin.",
      "profile.needSql": "Avatarlar verilənlər bazasında hələ aktiv deyil. Sayt administratoru Supabase-də sql/phase1_account_basics.sql skriptini işə salmalıdır.",
      "avatar.none": "Baş hərfim", "avatar.shield": "Qalxan", "avatar.lock": "Qıfıl", "avatar.key": "Açar",
      "avatar.terminal": "Terminal", "avatar.fingerprint": "Barmaq izi", "avatar.robot": "Robot", "avatar.bug": "Böcək",
      "avatar.eye": "Göz", "avatar.firewall": "Faervol", "avatar.chip": "Çip", "avatar.radar": "Radar", "avatar.wifi": "Wi-Fi"
    }
  });

  var grid = document.getElementById("avatar-grid");
  var save = document.getElementById("avatar-save");
  var msg = document.getElementById("avatar-msg");
  var selected = null;   /* key picked in the grid; null means "use my initial" */
  var msgState = null;   /* { key, kind } so the message follows a language switch */

  function say(key, kind) {
    msgState = key ? { key: key, kind: kind } : null;
    msg.textContent = key ? SS.t(key) : "";
    msg.className = "form-msg" + (kind ? " " + kind : "");
  }

  function render() {
    var name = SS.auth.displayName();
    document.getElementById("profile-avatar").innerHTML = SS.avatarHtml(selected, name, "xl");
    document.getElementById("profile-name").textContent = name;
    document.getElementById("profile-email").textContent = (SS.auth.user && SS.auth.user.email) || "";
    grid.innerHTML = [null].concat(SS.AVATAR_KEYS).map(function (key) {
      var on = key === selected;
      var label = SS.t("avatar." + (key || "none"));
      return '<button class="avatar-opt" type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on ? "0" : "-1") +
        '" data-avatar="' + (key || "") + '" aria-label="' + SS.esc(label) + '" title="' + SS.esc(label) + '">' + SS.avatarHtml(key, name) + "</button>";
    }).join("");
    save.disabled = selected === SS.auth.avatarKey();
    if (msgState) msg.textContent = SS.t(msgState.key);
    renderTitles();
  }

  /* ---------- title picker ---------- */
  var titleList = document.getElementById("title-list");
  var titleMsg = document.getElementById("title-msg");
  var titles = { rows: null, errorKey: null, busy: false, msg: null };   /* msg: { key, kind } */

  function renderTitles() {
    var current = SS.auth.title(), shown = document.getElementById("profile-title");
    shown.hidden = !current;
    shown.firstElementChild.textContent = current ? SS.L(current, "name") : "";
    titleMsg.textContent = titles.msg ? SS.t(titles.msg.key) : "";
    titleMsg.className = "form-msg" + (titles.msg && titles.msg.kind ? " " + titles.msg.kind : "");
    if (!titles.rows) {
      titleList.innerHTML = titles.errorKey
        ? '<div class="notice bad"><span aria-hidden="true">⚠️</span><span class="grow">' + SS.esc(SS.t(titles.errorKey)) + "</span>" +
          '<button class="btn ghost sm" type="button" data-title-retry>' + SS.esc(SS.t("daily.retry")) + "</button></div>"
        : '<div class="skeleton"></div>';
      return;
    }
    var selectedId = current ? current.id : null;
    var rows = [{ id: null, unlocked: true }].concat(titles.rows);
    titleList.innerHTML = rows.map(function (row) {
      var on = row.id === selectedId;
      var name = row.id === null ? SS.t("title.none") : SS.L(row, "name");
      var sub = row.id === null ? "" : SS.daily.titleRequirement(row) + (row.unlocked ? "" : " · " + SS.t("title.locked"));
      return '<button class="title-opt" type="button" role="radio" aria-checked="' + on + '" data-title="' + (row.id === null ? "" : row.id) + '"' +
        (row.unlocked && !titles.busy ? "" : " disabled") + '><span class="grow"><b>' + SS.esc(name) + "</b>" +
        (sub ? "<span>" + SS.esc(sub) + "</span>" : "") + '</span><span class="state" aria-hidden="true">' + (on ? "✓" : row.unlocked ? "" : "🔒") + "</span></button>";
    }).join("");
  }

  async function loadTitles() {
    titles.errorKey = null;
    try {
      var progress = await SS.daily.progress();
      titles.rows = progress.titles || [];
      SS.daily.applyProgress(progress);
    } catch (err) { console.error(err); titles.rows = null; titles.errorKey = SS.daily.errorKey(err); }
    renderTitles();
  }

  titleList.addEventListener("click", async function (e) {
    if (e.target.closest("[data-title-retry]")) { titles.errorKey = null; renderTitles(); loadTitles(); return; }
    var opt = e.target.closest("[data-title]");
    if (!opt || opt.disabled || titles.busy || opt.getAttribute("aria-checked") === "true") return;
    var raw = opt.getAttribute("data-title"), id = raw === "" ? null : Number(raw);
    titles.busy = true; titles.msg = { key: "title.saving" }; renderTitles();
    try {
      await SS.daily.setTitle(id);
      SS.renderNav();
      titles.msg = { key: "title.saved", kind: "ok" };
    } catch (err) {
      console.error(err);
      titles.msg = { key: SS.daily.errorKey(err), kind: "bad" };
    }
    titles.busy = false; renderTitles();
    var checked = titleList.querySelector('[aria-checked="true"]'); if (checked) checked.focus();
  });

  function pick(key, focus) {
    selected = key || null;
    say("");
    render();
    if (focus) { var el = grid.querySelector('[aria-checked="true"]'); if (el) el.focus(); }
  }

  grid.addEventListener("click", function (e) {
    var opt = e.target.closest("[data-avatar]");
    if (opt) pick(opt.getAttribute("data-avatar"), true);
  });
  /* Arrow keys move the selection, as in a native radio group. */
  grid.addEventListener("keydown", function (e) {
    var step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    var keys = [null].concat(SS.AVATAR_KEYS);
    pick(keys[(keys.indexOf(selected) + step + keys.length) % keys.length], true);
  });

  save.addEventListener("click", async function () {
    save.disabled = true; say("profile.saving");
    try {
      await SS.auth.saveAvatar(selected);
      SS.renderNav();
      say("profile.saved", "ok");
    } catch (err) {
      console.error(err);
      var text = String((err && (err.message || err.code)) || "");
      /* Missing column or missing column grant: the upgrade script has not been run. */
      var needSql = /avatar_key|schema cache|permission denied|42703|42501|PGRST204/i.test(text + " " + ((err && err.code) || ""));
      say(needSql ? "profile.needSql" : "profile.saveFail", "bad");
    }
    render();
  });

  document.addEventListener("langchange", render);

  SS.auth.ready.then(function () {
    if (!SS.auth.user) return;
    selected = SS.auth.avatarKey();
    render();
    loadTitles();
  });
})();
