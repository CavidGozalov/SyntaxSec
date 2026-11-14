/* SyntaxSec — password-checker.html: realistic Password Audit + generator.
   • zxcvbn (CDN) for pattern-aware guess estimation, with a built-in fallback if it cannot load
   • Shannon entropy and crack-time estimates for four attack scenarios
   • weak-pattern detection: dictionary words, keyboard walks, sequences, repeats, dates, leetspeak
   • breach check: local data/breach-list.json + Have I Been Pwned k-anonymity range API
     (SHA-1 is computed in the browser; only the first 5 hex characters are sent). */
(function () {
  "use strict";
  var SS = window.SS;
  SS.addStrings({
    en: {
      "pw.title": "Password Audit", "pw.h1": "Password Audit",
      "pw.lead": "A realistic look at how an attacker would guess your password: pattern detection with zxcvbn, entropy, crack-time estimates and a private breach lookup.",
      "pw.label": "Password to audit", "pw.ph": "Type a password…", "pw.private": "Your password never leaves this device. Analysis runs in this tab.",
      "pw.strength": "Password strength", "pw.idle": "Type to start the audit.",
      "pw.v0": "Very weak", "pw.v1": "Weak", "pw.v2": "Fair", "pw.v3": "Strong", "pw.v4": "Excellent", "pw.vBreached": "Compromised — found in breach data",
      "pw.sLen": "characters", "pw.sEnt": "bits of Shannon entropy", "pw.sPool": "bits if fully random", "pw.sGuess": "guesses needed (estimate)",
      "pw.crackH": "Estimated time to crack", "pw.c1": "Online, rate-limited (100 / hour)", "pw.c2": "Online, no limit (10 / second)",
      "pw.c3": "Offline, slow hash (10 thousand / second)", "pw.c4": "Offline, fast hash (10 billion / second)",
      "pw.crackNote": "Estimates, not guarantees. Offline attacks happen after a site’s password database leaks, which is why the last two rows matter most.",
      "pw.patternsH": "Weak patterns detected", "pw.noPatterns": "No weak patterns detected.", "pw.patternsIdle": "Patterns will appear here as you type.",
      "pw.checkH": "Security checklist", "pw.recoH": "Recommendations",
      "pw.hibpToggle": "Check Have I Been Pwned (only the first 5 characters of the SHA-1 hash are sent)",
      "pw.k.len": "At least 12 characters", "pw.k.case": "Upper- and lower-case letters", "pw.k.digit": "Contains a number", "pw.k.symbol": "Contains a symbol",
      "pw.k.dict": "No dictionary words or names", "pw.k.leet": "No simple letter swaps (p@ssw0rd)", "pw.k.walk": "No keyboard walks or sequences (qwerty, 12345)",
      "pw.k.repeat": "No repeated characters or blocks", "pw.k.date": "No dates or years", "pw.k.local": "Not in the local common-password list",
      "pw.k.hibp": "Not found in Have I Been Pwned", "pw.k.hibpWait": "Checking Have I Been Pwned…", "pw.k.hibpBad": "Found in Have I Been Pwned {n} times",
      "pw.k.hibpErr": "Have I Been Pwned could not be reached", "pw.k.hibpOff": "Have I Been Pwned check is switched off",
      "pw.k.score": "Resists offline guessing (zxcvbn score 3 or higher)",
      "pw.p.dict": "Dictionary word", "pw.p.dictD": "“{t}” appears in common word and password lists.",
      "pw.p.name": "Name", "pw.p.nameD": "“{t}” is a common first name or surname.",
      "pw.p.leet": "Leetspeak substitution", "pw.p.leetD": "“{t}” is a known word with letters swapped for symbols. Cracking tools try these swaps automatically.",
      "pw.p.reversed": "Reversed word", "pw.p.reversedD": "“{t}” is a common word written backwards.",
      "pw.p.walk": "Keyboard walk", "pw.p.walkD": "“{t}” follows neighbouring keys on the keyboard.",
      "pw.p.seq": "Sequence", "pw.p.seqD": "“{t}” is a run of consecutive characters.",
      "pw.p.repeat": "Repetition", "pw.p.repeatD": "“{t}” repeats the same character or block.",
      "pw.p.date": "Date or year", "pw.p.dateD": "“{t}” looks like a date. Birthdays and recent years are guessed early.",
      "pw.p.local": "Common password", "pw.p.localD": "“{t}” is in the local list of very common passwords.",
      "pw.p.contains": "Contains a common password", "pw.p.containsD": "“{t}” is one of the most used passwords, and attackers try it as a building block.",
      "pw.r.breached": "Stop using this password everywhere. It appears in breach data, so attackers already have it in their lists.",
      "pw.r.length": "Make it longer. Each extra character multiplies the work for an attacker; aim for 14 or more.",
      "pw.r.words": "Replace dictionary words and names with a passphrase of 4–6 unrelated words.",
      "pw.r.leet": "Swapping letters for symbols (a → @, o → 0) adds almost nothing. Add length instead.",
      "pw.r.walk": "Avoid keyboard runs and sequences such as qwerty or 12345.",
      "pw.r.repeat": "Remove repeated characters and repeated blocks.",
      "pw.r.date": "Leave out birthdays and years — they are easy to find and quick to guess.",
      "pw.r.variety": "Mix in another character type, or better, add more words.",
      "pw.r.manager": "Use a password manager so every account gets its own long random password.",
      "pw.r.mfa": "Turn on two-factor authentication so one stolen password is not enough.",
      "pw.r.good": "This password holds up well. Keep it unique to one account and store it in a password manager.",
      "pw.r.idle": "Recommendations appear once you type a password.",
      "pw.noZx": "The zxcvbn library could not be loaded, so a simpler built-in estimate is used.",
      "time.sec1": "1 second", "time.min1": "1 minute", "time.hour1": "1 hour", "time.day1": "1 day", "time.month1": "1 month", "time.year1": "1 year", "time.century1": "1 century",
      "time.instant": "instantly", "time.sec": "{n} seconds", "time.min": "{n} minutes", "time.hour": "{n} hours", "time.day": "{n} days",
      "time.month": "{n} months", "time.year": "{n} years", "time.century": "{n} centuries", "time.forever": "millions of years or more",
      "gen.h": "Strong password and passphrase generator", "gen.p": "Generated on your device with the browser’s cryptographic random source. Nothing is stored or sent.",
      "gen.tabPw": "Random password", "gen.tabPhrase": "Memorable passphrase", "gen.new": "Generate another", "gen.audit": "Audit this one",
      "gen.length": "Length", "gen.clear": "Skip look-alikes (O 0 I l 1)", "gen.words": "Words", "gen.sep": "Separator", "gen.space": "space",
      "gen.cap": "Capitalise words", "gen.num": "Add a number", "gen.entropy": "About {bits} bits of entropy — {label}.",
      "gen.pick": "Select at least one character type."
    },
    az: {
      "pw.title": "Parol Auditi", "pw.h1": "Parol Auditi",
      "pw.lead": "Hücumçunun parolunuzu necə təxmin edəcəyinə real baxış: zxcvbn ilə nümunə aşkarlaması, entropiya, sındırılma müddəti və məxfi sızma yoxlaması.",
      "pw.label": "Yoxlanılacaq parol", "pw.ph": "Parol yazın…", "pw.private": "Parolunuz bu cihazı tərk etmir. Təhlil bu vərəqdə aparılır.",
      "pw.strength": "Parolun gücü", "pw.idle": "Auditə başlamaq üçün yazın.",
      "pw.v0": "Çox zəif", "pw.v1": "Zəif", "pw.v2": "Orta", "pw.v3": "Güclü", "pw.v4": "Əla", "pw.vBreached": "Təhlükədədir — sızma məlumatlarında tapıldı",
      "pw.sLen": "simvol", "pw.sEnt": "bit Şennon entropiyası", "pw.sPool": "bit (tam təsadüfi olsaydı)", "pw.sGuess": "lazım olan təxmin sayı (qiymətləndirmə)",
      "pw.crackH": "Təxmini sındırılma müddəti", "pw.c1": "Onlayn, məhdudiyyətli (saatda 100)", "pw.c2": "Onlayn, məhdudiyyətsiz (saniyədə 10)",
      "pw.c3": "Oflayn, yavaş heş (saniyədə 10 min)", "pw.c4": "Oflayn, sürətli heş (saniyədə 10 milyard)",
      "pw.crackNote": "Bunlar zəmanət deyil, qiymətləndirmədir. Oflayn hücumlar saytın parol bazası sızdıqdan sonra baş verir, ona görə son iki sətir ən vacibdir.",
      "pw.patternsH": "Aşkarlanan zəif nümunələr", "pw.noPatterns": "Zəif nümunə aşkarlanmadı.", "pw.patternsIdle": "Yazdıqca nümunələr burada görünəcək.",
      "pw.checkH": "Təhlükəsizlik yoxlama siyahısı", "pw.recoH": "Tövsiyələr",
      "pw.hibpToggle": "Have I Been Pwned ilə yoxla (SHA-1 heşinin yalnız ilk 5 simvolu göndərilir)",
      "pw.k.len": "Ən azı 12 simvol", "pw.k.case": "Böyük və kiçik hərflər", "pw.k.digit": "Rəqəm var", "pw.k.symbol": "Xüsusi simvol var",
      "pw.k.dict": "Lüğət sözü və ya ad yoxdur", "pw.k.leet": "Sadə hərf əvəzləmələri yoxdur (p@ssw0rd)", "pw.k.walk": "Klaviatura ardıcıllığı və ya sıra yoxdur (qwerty, 12345)",
      "pw.k.repeat": "Təkrarlanan simvol və ya blok yoxdur", "pw.k.date": "Tarix və ya il yoxdur", "pw.k.local": "Yerli geniş yayılmış parollar siyahısında yoxdur",
      "pw.k.hibp": "Have I Been Pwned bazasında tapılmadı", "pw.k.hibpWait": "Have I Been Pwned yoxlanılır…", "pw.k.hibpBad": "Have I Been Pwned bazasında {n} dəfə tapıldı",
      "pw.k.hibpErr": "Have I Been Pwned ilə əlaqə qurulmadı", "pw.k.hibpOff": "Have I Been Pwned yoxlaması söndürülüb",
      "pw.k.score": "Oflayn təxminlərə davamlıdır (zxcvbn balı 3 və ya daha yüksək)",
      "pw.p.dict": "Lüğət sözü", "pw.p.dictD": "“{t}” geniş yayılmış söz və parol siyahılarında var.",
      "pw.p.name": "Ad", "pw.p.nameD": "“{t}” geniş yayılmış ad və ya soyaddır.",
      "pw.p.leet": "Litspik əvəzləməsi", "pw.p.leetD": "“{t}” hərfləri simvollarla əvəz edilmiş məlum sözdür. Sındırma alətləri bu əvəzləmələri avtomatik yoxlayır.",
      "pw.p.reversed": "Tərsinə yazılmış söz", "pw.p.reversedD": "“{t}” tərsinə yazılmış geniş yayılmış sözdür.",
      "pw.p.walk": "Klaviatura ardıcıllığı", "pw.p.walkD": "“{t}” klaviaturada qonşu düymələri izləyir.",
      "pw.p.seq": "Ardıcıllıq", "pw.p.seqD": "“{t}” ardıcıl simvollar sırasıdır.",
      "pw.p.repeat": "Təkrar", "pw.p.repeatD": "“{t}” eyni simvolu və ya bloku təkrarlayır.",
      "pw.p.date": "Tarix və ya il", "pw.p.dateD": "“{t}” tarixə bənzəyir. Ad günləri və son illər ilk növbədə yoxlanılır.",
      "pw.p.local": "Geniş yayılmış parol", "pw.p.localD": "“{t}” çox geniş yayılmış parolların yerli siyahısındadır.",
      "pw.p.contains": "Tərkibində geniş yayılmış parol var", "pw.p.containsD": "“{t}” ən çox istifadə olunan parollardandır və hücumçular onu tərkib hissəsi kimi yoxlayır.",
      "pw.r.breached": "Bu paroldan heç yerdə istifadə etməyin. O, sızma məlumatlarında var, yəni hücumçuların siyahılarında artıq mövcuddur.",
      "pw.r.length": "Parolu uzadın. Hər əlavə simvol hücumçunun işini qat-qat artırır; 14 və daha çox simvol hədəfləyin.",
      "pw.r.words": "Lüğət sözlərini və adları 4–6 əlaqəsiz sözdən ibarət parol-ifadə ilə əvəz edin.",
      "pw.r.leet": "Hərfləri simvollarla əvəz etmək (a → @, o → 0) demək olar ki, heç nə vermir. Əvəzində uzunluq əlavə edin.",
      "pw.r.walk": "qwerty və ya 12345 kimi klaviatura ardıcıllıqlarından və sıralardan qaçın.",
      "pw.r.repeat": "Təkrarlanan simvolları və blokları çıxarın.",
      "pw.r.date": "Ad günlərini və illəri yazmayın — onları tapmaq asan, təxmin etmək tezdir.",
      "pw.r.variety": "Başqa simvol növü əlavə edin, daha yaxşısı isə daha çox söz əlavə edin.",
      "pw.r.manager": "Parol menecerindən istifadə edin ki, hər hesabın öz uzun təsadüfi parolu olsun.",
      "pw.r.mfa": "İki faktorlu autentifikasiyanı aktiv edin ki, oğurlanmış bir parol kifayət etməsin.",
      "pw.r.good": "Bu parol yaxşı müqavimət göstərir. Onu yalnız bir hesabda istifadə edin və parol menecerində saxlayın.",
      "pw.r.idle": "Parol yazdıqdan sonra tövsiyələr burada görünəcək.",
      "pw.noZx": "zxcvbn kitabxanası yüklənmədi, ona görə daha sadə daxili qiymətləndirmə istifadə olunur.",
      "time.instant": "dərhal", "time.sec": "{n} saniyə", "time.min": "{n} dəqiqə", "time.hour": "{n} saat", "time.day": "{n} gün",
      "time.month": "{n} ay", "time.year": "{n} il", "time.century": "{n} əsr", "time.forever": "milyonlarla il və ya daha çox",
      "gen.h": "Güclü parol və parol-ifadə generatoru", "gen.p": "Brauzerin kriptoqrafik təsadüfi mənbəyi ilə cihazınızda yaradılır. Heç nə saxlanılmır və göndərilmir.",
      "gen.tabPw": "Təsadüfi parol", "gen.tabPhrase": "Yadda qalan parol-ifadə", "gen.new": "Başqasını yarat", "gen.audit": "Bunu yoxla",
      "gen.length": "Uzunluq", "gen.clear": "Oxşar simvolları atla (O 0 I l 1)", "gen.words": "Söz sayı", "gen.sep": "Ayırıcı", "gen.space": "boşluq",
      "gen.cap": "Sözləri böyük hərflə başla", "gen.num": "Rəqəm əlavə et", "gen.entropy": "Təxminən {bits} bit entropiya — {label}.",
      "gen.pick": "Ən azı bir simvol növü seçin."
    }
  });

  var $ = function (id) { return document.getElementById(id); };
  var pw = $("pw");
  if (!pw) return;

  var COLORS = ["var(--coral)", "var(--coral)", "var(--sun)", "var(--mint)", "var(--mint)"];
  var WALKS = ["qwerty", "qwertz", "azerty", "asdfgh", "asdf", "zxcvbn", "zxcv", "qazwsx", "1qaz2wsx", "1q2w3e", "q1w2e3", "poiuy", "lkjhg", "mnbvc", "!@#$%", "!@#$"];
  var local = new Set(["password", "123456", "12345678", "qwerty", "letmein", "admin", "welcome", "iloveyou"]);
  fetch("data/breach-list.json").then(function (r) { return r.json(); })
    .then(function (list) { local = new Set(list.map(function (x) { return String(x).toLowerCase(); })); render(); })
    .catch(function () {});

  /* ------------------------------------------------------------ analysis */
  function deLeet(s) {
    return s.toLowerCase().replace(/[@4]/g, "a").replace(/[8]/g, "b").replace(/[3€]/g, "e").replace(/[1!|]/g, "i").replace(/0/g, "o").replace(/[5$]/g, "s").replace(/[7+]/g, "t").replace(/9/g, "g");
  }
  function shannon(s) {
    var freq = {}, chars = Array.from(s), h = 0;
    chars.forEach(function (c) { freq[c] = (freq[c] || 0) + 1; });
    Object.keys(freq).forEach(function (c) { var p = freq[c] / chars.length; h -= p * Math.log2(p); });
    return h * chars.length;
  }
  function poolBits(s) {
    var pool = (/[a-z]/.test(s) ? 26 : 0) + (/[A-Z]/.test(s) ? 26 : 0) + (/\d/.test(s) ? 10 : 0) + (/[^A-Za-z0-9\s]/.test(s) ? 33 : 0) + (/\s/.test(s) ? 1 : 0) + (/[^\x00-\x7f]/.test(s) ? 60 : 0);
    return Array.from(s).length * Math.log2(pool || 1);
  }
  function findSequence(s) {
    var l = s.toLowerCase(), best = "";
    for (var i = 0; i < l.length - 2; i++) {
      var d = l.charCodeAt(i + 1) - l.charCodeAt(i);
      if (Math.abs(d) !== 1 || !/[a-z0-9]/.test(l.charAt(i))) continue;
      var j = i + 1;
      while (j + 1 < l.length && l.charCodeAt(j + 1) - l.charCodeAt(j) === d) j++;
      if (j - i >= 2 && j - i + 1 > best.length) best = s.slice(i, j + 1);
    }
    return best;
  }

  function analyze(s) {
    var lower = s.toLowerCase(), plain = deLeet(s), found = [], seen = {};
    function add(type, token) { var k = type + ":" + token.toLowerCase(); if (!seen[k] && token) { seen[k] = 1; found.push({ type: type, token: token }); } }

    var zx = null;
    if (typeof window.zxcvbn === "function") { try { zx = window.zxcvbn(s.slice(0, 100)); } catch (e) { zx = null; } }
    if (zx) {
      zx.sequence.forEach(function (m) {
        if (m.pattern === "dictionary") {
          if (m.l33t) add("leet", m.token);
          else if (m.reversed) add("reversed", m.token);
          else if (/names|surnames/.test(m.dictionary_name) && m.token.length >= 3) add("name", m.token);
          else if (m.token.length >= 3) add("dict", m.token);
        } else if (m.pattern === "spatial") add("walk", m.token);
        else if (m.pattern === "sequence") add("seq", m.token);
        else if (m.pattern === "repeat") add("repeat", m.token);
        else if (m.pattern === "date" || (m.pattern === "regex" && m.regex_name === "recent_year")) add("date", m.token);
      });
    }
    /* Built-in detectors: these also cover what zxcvbn's English lists miss. */
    WALKS.forEach(function (w) { var i = lower.indexOf(w); if (i !== -1 && !found.some(function (f) { return f.type === "walk" && f.token.toLowerCase().indexOf(w) !== -1; })) add("walk", s.substr(i, w.length)); });
    var seq = findSequence(s); if (seq && !found.some(function (f) { return f.type === "seq" || (f.type === "walk" && f.token.indexOf(seq) !== -1); })) add("seq", seq);
    var rep = s.match(/(.)\1{2,}/) || s.match(/(.{2,})\1+/); if (rep && !found.some(function (f) { return f.type === "repeat"; })) add("repeat", rep[0]);
    var date = s.match(/(?:0?[1-9]|[12]\d|3[01])[.\/\-](?:0?[1-9]|1[0-2])[.\/\-](?:19|20)?\d{2}/) || s.match(/(?:19[4-9]\d|20[0-3]\d)/);
    if (date && !found.some(function (f) { return f.type === "date"; })) add("date", date[0]);

    /* Exact (or leetspeak-exact) match = compromised. A common password inside a longer one is a weak pattern. */
    var localHit = "", localPart = "";
    if (local.has(lower)) localHit = s;
    else if (plain !== lower && local.has(plain)) { localHit = s; add("leet", s); }
    else local.forEach(function (w) {
      if (localPart || w.length < 5) return;
      if (lower.indexOf(w) !== -1) localPart = w;
      else if (plain.indexOf(w) !== -1) { localPart = w; add("leet", s); }
    });
    if (localHit) add("local", localHit);
    else if (localPart) add("contains", localPart);
    if (!zx && plain !== lower && /[a-z]{4,}/.test(plain) && /[@$!|€0-9]/.test(s) && local.has(plain.replace(/[^a-z]/g, ""))) add("leet", s);

    var has = function (t) { return found.some(function (f) { return f.type === t; }); };
    var len = Array.from(s).length, pool = poolBits(s), guesses, times, score;
    if (zx) {
      guesses = zx.guesses; score = zx.score;
      var c = zx.crack_times_seconds;
      times = [c.online_throttling_100_per_hour, c.online_no_throttling_10_per_second, c.offline_slow_hashing_1e4_per_second, c.offline_fast_hashing_1e10_per_second];
    } else {
      var bits = pool;
      if (has("repeat")) bits *= 0.75;
      if (has("seq") || has("walk")) bits *= 0.7;
      if (has("date")) bits *= 0.85;
      if (has("leet")) bits *= 0.6;
      if (localHit) bits = Math.min(bits, 8);
      else if (localPart) bits = Math.max(8, bits - localPart.length * Math.log2(26) + 10);
      guesses = Math.pow(2, bits) / 2 + 1;
      times = [guesses / (100 / 3600), guesses / 10, guesses / 1e4, guesses / 1e10];
      score = guesses < 1e3 ? 0 : guesses < 1e6 ? 1 : guesses < 1e8 ? 2 : guesses < 1e10 ? 3 : 4;
    }
    return {
      len: len, shannon: shannon(s), pool: pool, guesses: guesses, times: times, score: score, zx: !!zx, patterns: found, local: !!localHit,
      upper: /[A-ZƏÖĞŞÇÜİ]/.test(s), lower: /[a-zəöğşçüı]/.test(s), digit: /\d/.test(s), symbol: /[^A-Za-z0-9ƏəÖöĞğŞşÇçÜüİı]/.test(s),
      dict: has("dict") || has("name") || has("reversed") || has("contains"), leet: has("leet"), walk: has("walk") || has("seq"), repeat: has("repeat"), date: has("date")
    };
  }

  function fmtTime(sec) {
    var n = function (x) { return Math.round(x).toLocaleString(SS.locale()); };
    var unit = function (key, x) { return SS.t(SS.lang === "en" && Math.round(x) === 1 ? key + "1" : key, { n: n(x) }); };
    if (!isFinite(sec) || sec > 3.15e13 * 100) return SS.t("time.forever");
    if (sec < 1) return SS.t("time.instant");
    if (sec < 60) return unit("time.sec", sec);
    if (sec < 3600) return unit("time.min", sec / 60);
    if (sec < 86400) return unit("time.hour", sec / 3600);
    if (sec < 2592000) return unit("time.day", sec / 86400);
    if (sec < 31557600) return unit("time.month", sec / 2592000);
    if (sec < 3155760000) return unit("time.year", sec / 31557600);
    return unit("time.century", sec / 3155760000);
  }
  function fmtGuesses(g) {
    if (g < 1e6) return Math.round(g).toLocaleString(SS.locale());
    var exp = Math.floor(Math.log10(g));
    return (g / Math.pow(10, exp)).toFixed(1) + " × 10" + String(exp).replace(/\d/g, function (d) { return "⁰¹²³⁴⁵⁶⁷⁸⁹".charAt(d); });
  }

  /* ------------------------------------------------------------ Have I Been Pwned (k-anonymity) */
  var hibp = { status: "idle", count: 0, key: "" };
  var hibpCache = {};
  async function checkHibp(password) {
    var sha = (await SS.hash.sha1(password)).toUpperCase();
    var prefix = sha.slice(0, 5), suffix = sha.slice(5);
    if (!hibpCache[prefix]) {
      var res = await fetch("https://api.pwnedpasswords.com/range/" + prefix, { cache: "force-cache" });
      if (!res.ok) throw new Error("HIBP " + res.status);
      hibpCache[prefix] = await res.text();
    }
    var line = hibpCache[prefix].split("\n").find(function (l) { return l.split(":")[0].trim() === suffix; });
    return line ? parseInt(line.split(":")[1], 10) || 0 : 0;
  }
  var queueHibp = SS.debounce(async function () {
    var value = pw.value;
    if (!value || !$("hibp-on").checked) return;
    try {
      var count = await checkHibp(value);
      if (pw.value !== value) return;
      hibp = { status: count > 0 ? "pwned" : "safe", count: count, key: value };
    } catch (e) {
      if (pw.value !== value) return;
      hibp = { status: "error", count: 0, key: value };
    }
    render();
  }, 650);

  /* ------------------------------------------------------------ render */
  function set(id, text) { var e = $(id); if (e) e.textContent = text; }
  function render() {
    var s = pw.value, segs = SS.$$("#segs i"), checks = $("checks"), patterns = $("patterns"), recos = $("recos");
    var hibpOn = $("hibp-on").checked;
    var labels = [["len", "pw.k.len"], ["case", "pw.k.case"], ["digit", "pw.k.digit"], ["symbol", "pw.k.symbol"], ["dict", "pw.k.dict"], ["leet", "pw.k.leet"],
      ["walk", "pw.k.walk"], ["repeat", "pw.k.repeat"], ["date", "pw.k.date"], ["local", "pw.k.local"], ["hibp", "pw.k.hibp"], ["score", "pw.k.score"]];
    if (!s) {
      segs.forEach(function (i) { i.className = ""; i.style.background = ""; });
      $("fill").style.width = "0"; $("bar").setAttribute("aria-valuenow", 0);
      set("verdict", SS.t("pw.idle")); $("verdict").style.color = "";
      set("s-len", "0"); set("s-ent", "0"); set("s-pool", "0"); set("s-guess", "–");
      ["c-1", "c-2", "c-3", "c-4"].forEach(function (id) { set(id, "–"); });
      checks.innerHTML = labels.map(function (l) { return "<li>" + SS.esc(SS.t(l[1])) + "</li>"; }).join("");
      patterns.innerHTML = "<li>" + SS.esc(SS.t("pw.patternsIdle")) + "</li>";
      recos.innerHTML = "<li>" + SS.esc(SS.t("pw.r.idle")) + "</li>";
      return;
    }
    var a = analyze(s);
    var hState = !hibpOn ? "off" : hibp.key === s ? hibp.status : "checking";
    var breached = a.local || hState === "pwned";
    var score = breached ? 0 : a.score;
    var pct = [10, 30, 55, 80, 100][score];
    segs.forEach(function (el, i) { var on = i <= score; el.className = on ? "on" : ""; el.style.background = on ? COLORS[score] : ""; });
    $("fill").style.width = pct + "%"; $("fill").style.background = COLORS[score]; $("bar").setAttribute("aria-valuenow", pct);
    set("verdict", breached ? SS.t("pw.vBreached") : SS.t("pw.v" + score)); $("verdict").style.color = COLORS[score];
    set("s-len", a.len); set("s-ent", a.shannon.toFixed(1)); set("s-pool", a.pool.toFixed(1)); set("s-guess", fmtGuesses(a.guesses));
    a.times.forEach(function (t, i) { set("c-" + (i + 1), breached ? SS.t("time.instant") : fmtTime(t)); });

    var state = {
      len: a.len >= 12, case: a.upper && a.lower, digit: a.digit, symbol: a.symbol, dict: !a.dict, leet: !a.leet, walk: !a.walk,
      repeat: !a.repeat, date: !a.date, local: !a.local, score: !breached && a.score >= 3
    };
    checks.innerHTML = labels.map(function (l) {
      if (l[0] === "hibp") {
        if (hState === "off") return "<li>" + SS.esc(SS.t("pw.k.hibpOff")) + "</li>";
        if (hState === "checking" || hState === "idle") return '<li class="wait">' + SS.esc(SS.t("pw.k.hibpWait")) + "</li>";
        if (hState === "error") return "<li>" + SS.esc(SS.t("pw.k.hibpErr")) + "</li>";
        if (hState === "pwned") return '<li class="bad">' + SS.esc(SS.t("pw.k.hibpBad", { n: hibp.count.toLocaleString(SS.locale()) })) + "</li>";
        return '<li class="ok">' + SS.esc(SS.t("pw.k.hibp")) + "</li>";
      }
      return '<li class="' + (state[l[0]] ? "ok" : "bad") + '">' + SS.esc(SS.t(l[1])) + "</li>";
    }).join("");

    var typeKey = { dict: "dict", name: "name", leet: "leet", reversed: "reversed", walk: "walk", seq: "seq", repeat: "repeat", date: "date", local: "local", contains: "contains" };
    patterns.innerHTML = (a.patterns.length ? a.patterns.map(function (p, i) {
      return '<li class="' + (p.type === "local" || p.type === "leet" ? "bad" : "warn") + '" style="animation-delay:' + i * 40 + 'ms"><b>' + SS.esc(SS.t("pw.p." + typeKey[p.type])) + "</b><span>" + SS.esc(SS.t("pw.p." + typeKey[p.type] + "D", { t: p.token })) + "</span></li>";
    }).join("") : '<li class="ok">' + SS.esc(SS.t("pw.noPatterns")) + "</li>") +
      (a.zx ? "" : '<li class="warn">' + SS.esc(SS.t("pw.noZx")) + "</li>");

    var tips = [];
    if (breached) tips.push(["bad", "pw.r.breached"]);
    if (a.len < 14) tips.push(["warn", "pw.r.length"]);
    if (a.dict) tips.push(["warn", "pw.r.words"]);
    if (a.leet) tips.push(["warn", "pw.r.leet"]);
    if (a.walk) tips.push(["warn", "pw.r.walk"]);
    if (a.repeat) tips.push(["warn", "pw.r.repeat"]);
    if (a.date) tips.push(["warn", "pw.r.date"]);
    if (!breached && score < 3 && [a.upper, a.lower, a.digit, a.symbol].filter(Boolean).length < 3 && a.len < 20) tips.push(["warn", "pw.r.variety"]);
    if (!tips.length) tips.push(["ok", "pw.r.good"]);
    tips.push(["", "pw.r.manager"], ["", "pw.r.mfa"]);
    recos.innerHTML = tips.map(function (t) { return '<li class="' + t[0] + '">' + SS.esc(SS.t(t[1])) + "</li>"; }).join("");
  }

  pw.addEventListener("input", function () { hibp = { status: "idle", count: 0, key: "" }; render(); queueHibp(); });
  $("hibp-on").addEventListener("change", function () { render(); queueHibp(); });
  var show = $("show");
  function setShown(shown) {
    pw.type = shown ? "text" : "password";
    show.setAttribute("data-i18n", shown ? "common.hide" : "common.show");
    show.textContent = SS.t(shown ? "common.hide" : "common.show");
  }
  show.addEventListener("click", function () { setShown(pw.type === "password"); });
  $("verdict").removeAttribute("data-i18n");

  /* ------------------------------------------------------------ generator */
  function randInt(max) {
    /* Unbiased random integer in [0, max) using rejection sampling. */
    var limit = Math.floor(4294967296 / max) * max, buf = new Uint32Array(1);
    do { crypto.getRandomValues(buf); } while (buf[0] >= limit);
    return buf[0] % max;
  }
  function shuffle(arr) { for (var i = arr.length - 1; i > 0; i--) { var j = randInt(i + 1), t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
  var mode = "password", lastGen = { value: "", bits: 0 };

  function genPassword() {
    var clear = $("g-clear").checked;
    var sets = [];
    if ($("g-lower").checked) sets.push(clear ? "abcdefghijkmnpqrstuvwxyz" : "abcdefghijklmnopqrstuvwxyz");
    if ($("g-upper").checked) sets.push(clear ? "ABCDEFGHJKLMNPQRSTUVWXYZ" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    if ($("g-digit").checked) sets.push(clear ? "23456789" : "0123456789");
    if ($("g-symbol").checked) sets.push("!@#$%^&*()-_=+[]{};:,.?");
    if (!sets.length) return { value: "", bits: 0 };
    var len = parseInt($("g-len").value, 10), all = sets.join(""), chars = [];
    sets.forEach(function (set) { chars.push(set.charAt(randInt(set.length))); });
    while (chars.length < len) chars.push(all.charAt(randInt(all.length)));
    return { value: shuffle(chars).slice(0, len).join(""), bits: len * Math.log2(all.length) };
  }
  function genPhrase() {
    var words = SS.WORDS || [], count = parseInt($("g-words").value, 10), sep = $("g-sep").value, parts = [];
    for (var i = 0; i < count; i++) {
      var w = words[randInt(words.length)];
      parts.push($("g-cap").checked ? w.charAt(0).toUpperCase() + w.slice(1) : w);
    }
    var bits = count * Math.log2(words.length);
    if ($("g-num").checked) { parts.splice(randInt(parts.length + 1), 0, String(10 + randInt(90))); bits += Math.log2(90) + Math.log2(count + 1); }
    return { value: parts.join(sep), bits: bits };
  }
  function paintGen() {
    var out = $("gen-out");
    out.textContent = lastGen.value || SS.t("gen.pick");
    var label = lastGen.bits < 50 ? "pw.v2" : lastGen.bits < 75 ? "pw.v3" : "pw.v4";
    $("gen-entropy").textContent = lastGen.value ? SS.t("gen.entropy", { bits: Math.round(lastGen.bits), label: SS.t(label).toLocaleLowerCase(SS.lang) }) : "";
  }
  function generate() {
    lastGen = mode === "password" ? genPassword() : genPhrase();
    paintGen();
    var out = $("gen-out"); out.classList.remove("pop"); void out.offsetWidth; out.classList.add("pop");
  }
  $("gen-tabs").addEventListener("click", function (e) {
    var b = e.target.closest("[data-gen]"); if (!b) return;
    mode = b.getAttribute("data-gen");
    SS.$$("#gen-tabs .tab").forEach(function (t) { t.setAttribute("aria-selected", String(t === b)); });
    $("gen-opts-password").hidden = mode !== "password"; $("gen-opts-phrase").hidden = mode !== "phrase";
    generate();
  });
  ["g-len", "g-words"].forEach(function (id) { $(id).addEventListener("input", function () { $(id + "-v").textContent = $(id).value; generate(); }); });
  ["g-lower", "g-upper", "g-digit", "g-symbol", "g-clear", "g-cap", "g-num", "g-sep"].forEach(function (id) { $(id).addEventListener("change", generate); });
  $("gen-new").addEventListener("click", generate);
  $("gen-copy").addEventListener("click", function () { if (lastGen.value) SS.copy(lastGen.value); });
  $("gen-audit").addEventListener("click", function () {
    if (!lastGen.value) return;
    pw.value = lastGen.value; setShown(true);
    pw.dispatchEvent(new Event("input"));
    pw.scrollIntoView({ block: "center" });
  });

  document.addEventListener("langchange", function () { render(); paintGen(); });
  render(); generate();
  SS._pwAnalyze = analyze;
})();
