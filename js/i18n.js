/* SyntaxSec — bilingual engine (English / Azerbaijani).
   Usage in HTML:  data-i18n="key"            → textContent
                   data-i18n-html="key"       → innerHTML (trusted strings only)
                   data-i18n-ph="key"         → placeholder
                   data-i18n-aria="key"       → aria-label
                   data-i18n-title="key"      → title
   Usage in JS:    SS.t("key", {n: 3})  ·  SS.L(row, "name") → row.name_az / row.name_en
   Page scripts register their own strings with SS.addStrings({en:{}, az:{}}). */
(function () {
  "use strict";
  var SS = (window.SS = window.SS || {});
  var dict = { en: {}, az: {} };

  function stored() {
    try { return localStorage.getItem("lang") === "az" ? "az" : "en"; } catch (e) { return "en"; }
  }
  SS.lang = stored();
  document.documentElement.lang = SS.lang;

  SS.addStrings = function (pack) {
    Object.keys(pack).forEach(function (lang) {
      dict[lang] = dict[lang] || {};
      Object.assign(dict[lang], pack[lang]);
    });
  };
  SS._dict = dict;

  SS.t = function (key, vars) {
    var s = dict[SS.lang] && dict[SS.lang][key];
    if (s === undefined) s = dict.en[key];
    if (s === undefined) return key;
    if (vars) {
      s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined ? vars[k] : m; });
    }
    return s;
  };

  /* Localised database field: SS.L(topic, "name") */
  SS.L = function (row, field) {
    if (!row) return "";
    var primary = row[field + "_" + SS.lang];
    if (primary !== undefined && primary !== null && String(primary).trim() !== "") return primary;
    var other = row[field + "_" + (SS.lang === "az" ? "en" : "az")];
    return other === undefined || other === null ? "" : other;
  };

  SS.applyI18n = function (root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = SS.t(el.getAttribute("data-i18n")); });
    root.querySelectorAll("[data-i18n-html]").forEach(function (el) { el.innerHTML = SS.t(el.getAttribute("data-i18n-html")); });
    root.querySelectorAll("[data-i18n-ph]").forEach(function (el) { el.setAttribute("placeholder", SS.t(el.getAttribute("data-i18n-ph"))); });
    root.querySelectorAll("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", SS.t(el.getAttribute("data-i18n-aria"))); });
    root.querySelectorAll("[data-i18n-title]").forEach(function (el) { el.setAttribute("title", SS.t(el.getAttribute("data-i18n-title"))); });
    var titleKey = document.body && document.body.getAttribute("data-title");
    if (titleKey) document.title = SS.t(titleKey) + " | SyntaxSec";
  };

  SS.setLang = function (lang) {
    SS.lang = lang === "az" ? "az" : "en";
    try { localStorage.setItem("lang", SS.lang); } catch (e) {}
    /* The lang attribute makes CSS text-transform use Azerbaijani casing (i → İ, ı → I). */
    document.documentElement.lang = SS.lang;
    SS.applyI18n();
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: SS.lang } }));
  };
  SS.toggleLang = function () { SS.setLang(SS.lang === "az" ? "en" : "az"); };

  /* Locale-aware helpers */
  SS.locale = function () { return SS.lang === "az" ? "az-Latn-AZ" : "en-GB"; };
  SS.fmtDate = function (value) {
    var d = new Date(value);
    if (isNaN(d)) return "";
    try { return d.toLocaleDateString(SS.locale(), { day: "numeric", month: "short", year: "numeric" }); }
    catch (e) { return d.toISOString().slice(0, 10); }
  };
  SS.upper = function (s) { return String(s).toLocaleUpperCase(SS.lang === "az" ? "az" : "en"); };

  SS.addStrings({
    en: {
      "nav.home": "Home", "nav.learn": "Learn", "nav.roadmaps": "Roadmaps", "nav.tools": "Tools",
      "nav.password": "Password Audit", "nav.phishing": "Phishing Mail Checker", "nav.link": "Link Inspector",
      "nav.hash": "Hash & Encoding Playground", "nav.totp": "2FA Guide & TOTP Simulator", "nav.alltools": "All tools",
      "nav.quiz": "Quiz", "nav.blog": "Blog", "nav.admin": "Admin", "nav.login": "Log in", "nav.logout": "Log out",
      "nav.start": "Get started", "nav.menu": "Menu", "nav.theme": "Switch between light and dark theme",
      "nav.lang": "Switch language", "nav.account": "Signed in as {name}",
      "nav.profile": "Profile", "nav.profileOf": "Open profile ({name})",
      "foot.note": "SyntaxSec — an interactive cybersecurity and IT learning platform. Password, link and email checks run in your browser.",
      "foot.made": "University PBL project",

      "auth.login": "Log in", "auth.register": "Register",
      "auth.loginTitle": "Welcome back", "auth.registerTitle": "Create your account",
      "auth.loginSub": "Log in to continue your learning path.",
      "auth.registerSub": "Free for students. Your progress is saved to your account.",
      "auth.username": "Username", "auth.email": "Email", "auth.password": "Password",
      "auth.userHint": "3–24 characters: letters, numbers, dot, dash or underscore.",
      "auth.pwHint": "At least 8 characters.",
      "auth.confirm": "Confirm password", "auth.showPw": "Show password", "auth.hidePw": "Hide password",
      "auth.errMismatch": "The passwords do not match.",
      "auth.submitLogin": "Log in", "auth.submitRegister": "Create account",
      "auth.working": "One moment…",
      "auth.confirmSent": "Account created. Open the confirmation link we emailed to {email}, then log in.",
      "auth.errInvalid": "Email or password is incorrect.",
      "auth.errNotConfirmed": "Confirm your email first — check your inbox for the link.",
      "auth.errExists": "An account with this email already exists. Log in instead.",
      "auth.errUsernameTaken": "That username is taken. Pick another one.",
      "auth.errUsernameFormat": "Use 3–24 letters, numbers, dots, dashes or underscores for the username.",
      "auth.errWeak": "Password must be at least 8 characters.",
      "auth.errEmail": "Enter a valid email address.",
      "auth.errRate": "Too many attempts. Wait a minute and try again.",
      "auth.errOffline": "Cannot reach the account service. Check your connection and reload.",
      "auth.errGeneric": "Something went wrong: {msg}",
      "auth.loggedOut": "Logged out.", "auth.needLogin": "Log in to open that page.",
      "auth.adminOnly": "That page is for the administrator only.",

      "common.loading": "Loading…", "common.save": "Save", "common.cancel": "Cancel", "common.delete": "Delete",
      "common.edit": "Edit", "common.add": "Add", "common.close": "Close", "common.copy": "Copy",
      "common.copied": "Copied to clipboard", "common.copyFail": "Could not copy — select the text manually.",
      "common.back": "Back", "common.print": "Download / Print Cheat Sheet", "common.all": "All",
      "common.error": "Something went wrong. Try again.", "common.none": "Nothing here yet.",
      "common.offline": "The database is unreachable or not set up yet, so sample content is shown and progress is kept on this device only.",
      "common.bookmark": "Bookmark", "common.bookmarked": "Bookmarked", "common.master": "Mark as mastered",
      "common.mastered": "Mastered", "common.moreInfo": "More information about this →",
      "common.savedBookmark": "Bookmark saved", "common.removedBookmark": "Bookmark removed",
      "common.savedMastered": "Marked as mastered", "common.removedMastered": "Mastered mark removed",
      "common.saveFail": "Could not save your progress.", "common.show": "Show", "common.hide": "Hide",
      "common.clear": "Clear", "common.cheatsheet": "SyntaxSec cheat sheet", "common.terms": "{n} terms",
      "common.masteredOf": "{done}/{total} mastered"
    },
    az: {
      "nav.home": "Ana səhifə", "nav.learn": "Öyrən", "nav.roadmaps": "Yol xəritələri", "nav.tools": "Alətlər",
      "nav.password": "Parol Auditi", "nav.phishing": "Fişinq Məktub Yoxlayıcısı", "nav.link": "Keçid Müfəttişi",
      "nav.hash": "Heş və Kodlaşdırma Laboratoriyası", "nav.totp": "2FA Bələdçisi və TOTP Simulyatoru", "nav.alltools": "Bütün alətlər",
      "nav.quiz": "Viktorina", "nav.blog": "Bloq", "nav.admin": "Admin", "nav.login": "Daxil ol", "nav.logout": "Çıxış",
      "nav.start": "Başla", "nav.menu": "Menyu", "nav.theme": "İşıqlı və qaranlıq mövzu arasında keç",
      "nav.lang": "Dili dəyiş", "nav.account": "{name} kimi daxil olmusunuz",
      "nav.profile": "Profil", "nav.profileOf": "Profili aç ({name})",
      "foot.note": "SyntaxSec — kibertəhlükəsizlik və İT üzrə interaktiv öyrənmə platforması. Parol, keçid və məktub yoxlamaları brauzerinizdə işləyir.",
      "foot.made": "Universitet PBL layihəsi",

      "auth.login": "Daxil ol", "auth.register": "Qeydiyyat",
      "auth.loginTitle": "Yenidən xoş gəldiniz", "auth.registerTitle": "Hesabınızı yaradın",
      "auth.loginSub": "Öyrənməyə davam etmək üçün daxil olun.",
      "auth.registerSub": "Tələbələr üçün pulsuzdur. İrəliləyişiniz hesabınızda saxlanılır.",
      "auth.username": "İstifadəçi adı", "auth.email": "E-poçt", "auth.password": "Parol",
      "auth.userHint": "3–24 simvol: hərf, rəqəm, nöqtə, tire və ya alt xətt.",
      "auth.pwHint": "Ən azı 8 simvol.",
      "auth.confirm": "Parolu təsdiqləyin", "auth.showPw": "Parolu göstər", "auth.hidePw": "Parolu gizlət",
      "auth.errMismatch": "Parollar uyğun gəlmir.",
      "auth.submitLogin": "Daxil ol", "auth.submitRegister": "Hesab yarat",
      "auth.working": "Bir an…",
      "auth.confirmSent": "Hesab yaradıldı. {email} ünvanına göndərdiyimiz təsdiq keçidini açın, sonra daxil olun.",
      "auth.errInvalid": "E-poçt və ya parol yanlışdır.",
      "auth.errNotConfirmed": "Əvvəlcə e-poçtunuzu təsdiqləyin — keçid gələnlər qutunuzdadır.",
      "auth.errExists": "Bu e-poçt ilə hesab artıq mövcuddur. Daxil olun.",
      "auth.errUsernameTaken": "Bu istifadəçi adı tutulub. Başqasını seçin.",
      "auth.errUsernameFormat": "İstifadəçi adı üçün 3–24 hərf, rəqəm, nöqtə, tire və ya alt xətt istifadə edin.",
      "auth.errWeak": "Parol ən azı 8 simvol olmalıdır.",
      "auth.errEmail": "Düzgün e-poçt ünvanı daxil edin.",
      "auth.errRate": "Həddən çox cəhd. Bir dəqiqə gözləyib yenidən yoxlayın.",
      "auth.errOffline": "Hesab xidməti ilə əlaqə yoxdur. İnternet bağlantınızı yoxlayıb səhifəni yeniləyin.",
      "auth.errGeneric": "Xəta baş verdi: {msg}",
      "auth.loggedOut": "Hesabdan çıxdınız.", "auth.needLogin": "Həmin səhifəni açmaq üçün daxil olun.",
      "auth.adminOnly": "Həmin səhifə yalnız administrator üçündür.",

      "common.loading": "Yüklənir…", "common.save": "Yadda saxla", "common.cancel": "Ləğv et", "common.delete": "Sil",
      "common.edit": "Redaktə et", "common.add": "Əlavə et", "common.close": "Bağla", "common.copy": "Kopyala",
      "common.copied": "Mübadilə buferinə kopyalandı", "common.copyFail": "Kopyalamaq alınmadı — mətni əl ilə seçin.",
      "common.back": "Geri", "common.print": "Yaddaş vərəqini yüklə / çap et", "common.all": "Hamısı",
      "common.error": "Xəta baş verdi. Yenidən cəhd edin.", "common.none": "Hələ heç nə yoxdur.",
      "common.offline": "Verilənlər bazası əlçatan deyil və ya hələ qurulmayıb, ona görə nümunə məzmun göstərilir və irəliləyiş yalnız bu cihazda saxlanılır.",
      "common.bookmark": "Əlfəcin əlavə et", "common.bookmarked": "Əlfəcindədir", "common.master": "Mənimsənildi kimi işarələ",
      "common.mastered": "Mənimsənilib", "common.moreInfo": "Bu barədə ətraflı məlumat →",
      "common.savedBookmark": "Əlfəcin saxlanıldı", "common.removedBookmark": "Əlfəcin silindi",
      "common.savedMastered": "Mənimsənildi kimi işarələndi", "common.removedMastered": "Mənimsənildi işarəsi götürüldü",
      "common.saveFail": "İrəliləyişi saxlamaq mümkün olmadı.", "common.show": "Göstər", "common.hide": "Gizlət",
      "common.clear": "Təmizlə", "common.cheatsheet": "SyntaxSec yaddaş vərəqi", "common.terms": "{n} termin",
      "common.masteredOf": "{done}/{total} mənimsənilib"
    }
  });
})();
