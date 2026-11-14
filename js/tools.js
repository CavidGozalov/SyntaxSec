/* SyntaxSec — tools.html: Link Inspector, Hash & Encoding Playground, TOTP simulator. */
(function () {
  "use strict";
  var SS = window.SS;
  SS.addStrings({
    en: {
      "tools.title": "Tools", "tools.h1": "Security lab tools",
      "tools.lead": "Hands-on utilities for students. Everything on this page runs in your browser — nothing you type is uploaded.",
      "tools.open": "Open tool", "tools.cPassword": "Realistic strength audit, breach check and generator.",
      "tools.cPhishing": "Analyse pasted email text or a screenshot for red flags.", "tools.cQuizH": "Spot the Fake quiz", "tools.cQuiz": "Ten messages to judge: phishing or legit?",
      "link.h": "URL & Link Inspector", "link.p": "Paste a link to see what it is really made of. The link is only parsed as text — it is never opened.",
      "link.ph": "Paste a URL, e.g. https://example.com/path?query=1", "link.run": "Inspect link", "link.try": "Try an example:",
      "link.invalid": "That does not look like a link. Paste a full address such as https://example.com/page.",
      "link.vBad": "High risk — do not open", "link.vWarn": "Be careful with this link", "link.vOk": "No structural warning signs",
      "link.vSub": "{bad} serious and {warn} minor findings. The real destination is {domain}.",
      "link.anatomy": "Anatomy of the link", "link.findings": "What we found", "link.details": "Parts",
      "link.scheme": "Scheme", "link.user": "User info", "link.sub": "Subdomains", "link.domain": "Registered domain", "link.port": "Port",
      "link.path": "Path", "link.query": "Query", "link.hash": "Fragment", "link.shown": "Shown as (Unicode)", "link.params": "Query parameters", "link.none": "—",
      "link.disclaimer": "This inspector reads the structure of a link. It cannot see the page behind it, so a clean result is not a guarantee.",
      "hash.h": "Hash & Encoding Playground", "hash.p": "Encoding is reversible and hides nothing. Hashing is one-way. Type below and watch both change live.",
      "hash.input": "Input text", "hash.ph": "Type or paste text…", "hash.op": "Operation", "hash.encode": "encode", "hash.decode": "decode",
      "hash.output": "Result", "hash.swap": "Use result as input", "hash.hashesH": "Hashes of the input",
      "hash.broken": "broken", "hash.weak": "weak", "hash.ok": "current",
      "hash.note": "Change one character and every hash changes completely — the avalanche effect. MD5 and SHA-1 are shown for study only; collisions are practical, so do not use them for security.",
      "hash.errB64": "This is not valid Base64.", "hash.errUrl": "This is not valid URL encoding.", "hash.errHex": "This is not valid hexadecimal (use pairs of 0–9, a–f).",
      "hash.errUtf8": "Decoded bytes are not readable text. Hex of the bytes: {hex}",
      "totp.h": "2FA / MFA visual guide", "totp.p": "A second factor means a stolen password is not enough. Not all second factors are equally strong.",
      "totp.smsBadge": "Weakest", "totp.smsH": "SMS codes",
      "totp.sms1": "SIM swapping: an attacker convinces the operator to move your number to their SIM.",
      "totp.sms2": "Messages can be intercepted on the phone network or read from a locked screen.",
      "totp.sms3": "Phishing pages can ask for the code and use it within seconds.",
      "totp.sms4": "Still far better than no second factor at all.",
      "totp.appBadge": "Recommended", "totp.appH": "Authenticator app (TOTP)",
      "totp.app1": "Codes are calculated on your phone — nothing is sent over the phone network.",
      "totp.app2": "Works offline and is not tied to your phone number.",
      "totp.app3": "Each code is valid for about 30 seconds.",
      "totp.app4": "A real-time phishing page can still relay a code, so check the address bar.",
      "totp.keyBadge": "Strongest", "totp.keyH": "Passkeys and security keys",
      "totp.key1": "The key checks the website address itself, so a fake site gets nothing.",
      "totp.key2": "Nothing to type and no shared secret to steal from the server.",
      "totp.key3": "Use them wherever a service offers them, and keep a backup method.",
      "totp.simH": "Live TOTP simulator", "totp.simP": "This is exactly what an authenticator app does: it mixes a shared secret with the current 30-second time window. No network is involved.",
      "totp.current": "Current code", "totp.seconds": "seconds until it changes", "totp.newSecret": "New random secret",
      "totp.secret": "Shared secret (Base32)", "totp.secretHint": "The server shows this once as a QR code. Your phone and the server both keep it.",
      "totp.rowTime": "Unix time", "totp.rowCounter": "Time step (time ÷ 30)", "totp.rowHmac": "HMAC-SHA1(secret, step)", "totp.rowTrunc": "Truncate → 6 digits", "totp.rowUri": "Setup link in the QR code",
      "totp.tryLabel": "Play the server: type a code to verify it", "totp.verify": "Verify code",
      "totp.okNow": "Accepted — this is the code for the current time step.", "totp.okPrev": "Accepted — this is the previous code. Servers usually allow one step of clock drift.",
      "totp.no": "Rejected — the code is wrong or has expired.", "totp.badSecret": "The secret must be Base32: letters A–Z and digits 2–7.",
      "totp.stepsH": "Turn on 2FA for an account",
      "totp.step1": "Open the account’s security settings and choose two-factor authentication.", "totp.step2": "Pick “Authenticator app” rather than SMS when both are offered.",
      "totp.step3": "Scan the QR code with an authenticator app. The app stores the shared secret.", "totp.step4": "Type the 6-digit code to prove the app and the server agree.",
      "totp.step5": "Save the backup codes somewhere offline. They are the way back in if you lose the phone."
    },
    az: {
      "tools.title": "Alətlər", "tools.h1": "Təhlükəsizlik laboratoriyası alətləri",
      "tools.lead": "Tələbələr üçün praktik alətlər. Bu səhifədəki hər şey brauzerinizdə işləyir — yazdığınız heç nə serverə göndərilmir.",
      "tools.open": "Aləti aç", "tools.cPassword": "Real güc auditi, sızma yoxlaması və generator.",
      "tools.cPhishing": "Yapışdırılmış məktub mətnini və ya ekran şəklini şübhəli əlamətlərə görə təhlil et.", "tools.cQuizH": "“Saxtanı tap” viktorinası", "tools.cQuiz": "Qiymətləndirmək üçün on mesaj: fişinqdir, yoxsa həqiqi?",
      "link.h": "URL və Keçid Müfəttişi", "link.p": "Keçidin əslində nədən ibarət olduğunu görmək üçün onu yapışdırın. Keçid yalnız mətn kimi təhlil olunur — heç vaxt açılmır.",
      "link.ph": "URL yapışdırın, məs. https://example.com/path?query=1", "link.run": "Keçidi yoxla", "link.try": "Nümunə yoxla:",
      "link.invalid": "Bu, keçidə bənzəmir. https://example.com/page kimi tam ünvan yapışdırın.",
      "link.vBad": "Yüksək risk — açmayın", "link.vWarn": "Bu keçidlə ehtiyatlı olun", "link.vOk": "Quruluşda xəbərdarlıq əlaməti yoxdur",
      "link.vSub": "{bad} ciddi və {warn} kiçik tapıntı. Əsl ünvan: {domain}.",
      "link.anatomy": "Keçidin anatomiyası", "link.findings": "Tapıntılar", "link.details": "Hissələr",
      "link.scheme": "Sxem", "link.user": "İstifadəçi məlumatı", "link.sub": "Subdomenlər", "link.domain": "Qeydiyyatdan keçmiş domen", "link.port": "Port",
      "link.path": "Yol", "link.query": "Sorğu", "link.hash": "Fraqment", "link.shown": "Göstərilən forma (Unicode)", "link.params": "Sorğu parametrləri", "link.none": "—",
      "link.disclaimer": "Bu alət keçidin quruluşunu oxuyur. Arxasındakı səhifəni görə bilmir, ona görə təmiz nəticə zəmanət deyil.",
      "hash.h": "Heş və Kodlaşdırma Laboratoriyası", "hash.p": "Kodlaşdırma geri qaytarıla bilir və heç nəyi gizlətmir. Heşləmə bir istiqamətlidir. Aşağıda yazın və hər ikisinin canlı dəyişməsinə baxın.",
      "hash.input": "Giriş mətni", "hash.ph": "Mətn yazın və ya yapışdırın…", "hash.op": "Əməliyyat", "hash.encode": "kodla", "hash.decode": "dekodla",
      "hash.output": "Nəticə", "hash.swap": "Nəticəni giriş kimi istifadə et", "hash.hashesH": "Giriş mətninin heşləri",
      "hash.broken": "sındırılıb", "hash.weak": "zəif", "hash.ok": "müasir",
      "hash.note": "Bir simvolu dəyişin — bütün heşlər tamamilə dəyişəcək. Buna uçqun effekti deyilir. MD5 və SHA-1 yalnız öyrənmək üçün göstərilir; kolliziyalar praktikdir, təhlükəsizlik üçün istifadə etməyin.",
      "hash.errB64": "Bu, düzgün Base64 deyil.", "hash.errUrl": "Bu, düzgün URL kodlaşdırması deyil.", "hash.errHex": "Bu, düzgün onaltılıq say deyil (0–9, a–f cütlərindən istifadə edin).",
      "hash.errUtf8": "Dekodlanmış baytlar oxunaqlı mətn deyil. Baytların onaltılıq forması: {hex}",
      "totp.h": "2FA / MFA vizual bələdçisi", "totp.p": "İkinci faktor o deməkdir ki, oğurlanmış parol təkbaşına kifayət etmir. Bütün ikinci faktorlar eyni dərəcədə güclü deyil.",
      "totp.smsBadge": "Ən zəif", "totp.smsH": "SMS kodları",
      "totp.sms1": "SIM dəyişdirmə: hücumçu operatoru nömrənizi öz SIM-inə keçirməyə inandırır.",
      "totp.sms2": "Mesajlar telefon şəbəkəsində ələ keçirilə və ya kilidli ekrandan oxuna bilər.",
      "totp.sms3": "Fişinq səhifələri kodu soruşub saniyələr ərzində istifadə edə bilər.",
      "totp.sms4": "Yenə də ikinci faktorun olmamasından qat-qat yaxşıdır.",
      "totp.appBadge": "Tövsiyə olunur", "totp.appH": "Autentifikator tətbiqi (TOTP)",
      "totp.app1": "Kodlar telefonunuzda hesablanır — telefon şəbəkəsi ilə heç nə göndərilmir.",
      "totp.app2": "Oflayn işləyir və telefon nömrənizə bağlı deyil.",
      "totp.app3": "Hər kod təxminən 30 saniyə etibarlıdır.",
      "totp.app4": "Real vaxtlı fişinq səhifəsi kodu yenə də ötürə bilər, ona görə ünvan sətrini yoxlayın.",
      "totp.keyBadge": "Ən güclü", "totp.keyH": "Passkey və təhlükəsizlik açarları",
      "totp.key1": "Açar sayt ünvanını özü yoxlayır, ona görə saxta sayt heç nə əldə etmir.",
      "totp.key2": "Yazmağa ehtiyac yoxdur və serverdən oğurlanacaq ortaq sirr yoxdur.",
      "totp.key3": "Xidmət təklif edən hər yerdə istifadə edin və ehtiyat üsul saxlayın.",
      "totp.simH": "Canlı TOTP simulyatoru", "totp.simP": "Autentifikator tətbiqi məhz bunu edir: ortaq sirri cari 30 saniyəlik zaman pəncərəsi ilə qarışdırır. Şəbəkədən istifadə olunmur.",
      "totp.current": "Cari kod", "totp.seconds": "saniyə sonra dəyişəcək", "totp.newSecret": "Yeni təsadüfi sirr",
      "totp.secret": "Ortaq sirr (Base32)", "totp.secretHint": "Server bunu bir dəfə QR kod kimi göstərir. Həm telefonunuz, həm də server onu saxlayır.",
      "totp.rowTime": "Unix vaxtı", "totp.rowCounter": "Zaman addımı (vaxt ÷ 30)", "totp.rowHmac": "HMAC-SHA1(sirr, addım)", "totp.rowTrunc": "Kəsmə → 6 rəqəm", "totp.rowUri": "QR koddakı quraşdırma keçidi",
      "totp.tryLabel": "Server rolunu oynayın: kodu yazıb yoxlayın", "totp.verify": "Kodu yoxla",
      "totp.okNow": "Qəbul edildi — bu, cari zaman addımının kodudur.", "totp.okPrev": "Qəbul edildi — bu, əvvəlki koddur. Serverlər adətən bir addımlıq saat fərqinə icazə verir.",
      "totp.no": "Rədd edildi — kod yanlışdır və ya vaxtı bitib.", "totp.badSecret": "Sirr Base32 olmalıdır: A–Z hərfləri və 2–7 rəqəmləri.",
      "totp.stepsH": "Hesab üçün 2FA-nı aktiv edin",
      "totp.step1": "Hesabın təhlükəsizlik parametrlərini açın və iki faktorlu autentifikasiyanı seçin.", "totp.step2": "Hər ikisi təklif olunursa, SMS əvəzinə “Autentifikator tətbiqi”ni seçin.",
      "totp.step3": "QR kodu autentifikator tətbiqi ilə skan edin. Tətbiq ortaq sirri yadda saxlayır.", "totp.step4": "Tətbiqlə serverin uyğun gəldiyini sübut etmək üçün 6 rəqəmli kodu yazın.",
      "totp.step5": "Ehtiyat kodları oflayn bir yerdə saxlayın. Telefonu itirsəniz, hesaba qayıtmağın yolu onlardır."
    }
  });

  var $ = function (id) { return document.getElementById(id); };

  /* ------------------------------------------------------------ tabs */
  var TABS = ["link", "hash", "totp"];
  function showTab(name, scroll) {
    if (TABS.indexOf(name) === -1) name = "link";
    TABS.forEach(function (t) { $("panel-" + t).hidden = t !== name; });
    SS.$$("#tool-tabs .tab").forEach(function (b) { b.setAttribute("aria-selected", String(b.getAttribute("data-tab") === name)); });
    if (scroll) $("tool-tabs").scrollIntoView({ block: "start" });
  }
  $("tool-tabs").addEventListener("click", function (e) {
    var b = e.target.closest("[data-tab]"); if (!b) return;
    history.replaceState(null, "", "#" + b.getAttribute("data-tab"));
    showTab(b.getAttribute("data-tab"));
  });
  window.addEventListener("hashchange", function () { showTab(location.hash.slice(1), true); });
  showTab(location.hash.slice(1), !!location.hash);

  /* ------------------------------------------------------------ Link Inspector */
  var lastLink = "";
  function renderLink() {
    var out = $("link-out"), raw = lastLink;
    if (!raw) { out.innerHTML = ""; return; }
    var r = SS.url.inspect(raw);
    if (!r.ok) { out.innerHTML = '<div class="notice bad"><span>⚠️</span><span>' + SS.esc(SS.t("link.invalid")) + "</span></div>"; return; }
    var p = r.parts, e = SS.esc;
    var bad = r.findings.filter(function (f) { return f.level === "bad"; }).length;
    var warn = r.findings.filter(function (f) { return f.level === "warn"; }).length;
    var level = bad ? "bad" : warn ? "warn" : "ok";
    var anatomy = '<span class="u-scheme">' + e(p.scheme) + "://</span>" +
      (p.user ? '<span class="u-user">' + e(p.user) + "@</span>" : "") +
      (p.sub ? '<span class="u-sub">' + e(p.sub) + ".</span>" : "") +
      '<span class="u-domain">' + e(p.domain) + "</span>" +
      (p.port ? '<span class="u-port">:' + e(p.port) + "</span>" : "") +
      (p.path ? '<span class="u-path">' + e(p.path) + "</span>" : "") +
      (p.query ? '<span class="u-query">' + e(p.query) + "</span>" : "") +
      (p.hash ? '<span class="u-hash">' + e(p.hash) + "</span>" : "");
    var none = SS.t("link.none");
    function row(key, value) { return "<tr><th>" + e(SS.t(key)) + "</th><td>" + (value ? e(value) : none) + "</td></tr>"; }
    out.innerHTML =
      '<div class="verdict ' + level + '"><span class="big">' + (bad ? "🚫" : warn ? "⚠️" : "✅") + "</span><div><h3>" + e(SS.t(bad ? "link.vBad" : warn ? "link.vWarn" : "link.vOk")) + "</h3><p>" +
        e(SS.t("link.vSub", { bad: bad, warn: warn, domain: p.domain || p.scheme + ":" })) + "</p></div></div>" +
      "<div><h3>" + e(SS.t("link.anatomy")) + '</h3><div class="url-view">' + anatomy + "</div>" +
        '<div class="legend"><span class="u-scheme">' + e(SS.t("link.scheme")) + '</span><span class="u-user">' + e(SS.t("link.user")) + '</span><span class="u-sub">' + e(SS.t("link.sub")) +
        '</span><span class="u-domain">' + e(SS.t("link.domain")) + '</span><span class="u-port">' + e(SS.t("link.port")) + '</span><span class="u-query">' + e(SS.t("link.query")) + "</span></div></div>" +
      "<div><h3>" + e(SS.t("link.findings")) + '</h3><ul class="flags">' + r.findings.map(function (f, i) {
        return '<li class="' + f.level + '" style="animation-delay:' + i * 50 + 'ms"><b>' + e(SS.t("url." + f.key)) + "</b><span>" + e(SS.t("url." + f.key + ".d", f.vars)) + "</span></li>";
      }).join("") + "</ul></div>" +
      "<div><h3>" + e(SS.t("link.details")) + '</h3><table class="kv">' +
        row("link.scheme", p.scheme) + row("link.user", p.user) + row("link.sub", p.sub) + row("link.domain", p.domain) +
        (p.hostUnicode && p.hostUnicode !== p.host ? row("link.shown", p.hostUnicode) : "") +
        row("link.port", p.port) + row("link.path", p.path) + row("link.hash", p.hash) +
        "<tr><th>" + e(SS.t("link.params")) + "</th><td>" + (p.params.length ? p.params.map(function (q) { return "<div><strong>" + e(q.key) + "</strong> = " + e(q.value) + "</div>"; }).join("") : none) + "</td></tr>" +
      "</table></div>" +
      '<p class="small dim">' + e(SS.t("link.disclaimer")) + "</p>";
  }
  function runLink() { lastLink = $("link-input").value.trim(); renderLink(); }
  $("link-run").addEventListener("click", runLink);
  $("link-input").addEventListener("keydown", function (e) { if (e.key === "Enter") runLink(); });
  $("link-input").addEventListener("input", SS.debounce(runLink, 350));
  document.addEventListener("click", function (e) {
    var ex = e.target.closest("[data-link-example]");
    if (ex) { $("link-input").value = ex.getAttribute("data-link-example"); runLink(); }
  });

  /* ------------------------------------------------------------ Hash & Encoding */
  var op = "b64e";
  function bytesToBin(bytes) { var s = ""; for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return s; }
  function binToBytes(bin) { var b = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i); return b; }
  function decodeUtf8(bytes) {
    try { return new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
    catch (e) { var err = new Error("utf8"); err.hex = SS.hash.hex(bytes); throw err; }
  }
  function convert(text) {
    switch (op) {
      case "b64e": return btoa(bytesToBin(SS.hash.utf8(text)));
      case "b64d": {
        var clean = text.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean)) throw new Error("b64");
        while (clean.length % 4) clean += "=";
        var bin; try { bin = atob(clean); } catch (e) { throw new Error("b64"); }
        return decodeUtf8(binToBytes(bin));
      }
      case "urle": return encodeURIComponent(text);
      case "urld": try { return decodeURIComponent(text.replace(/\+/g, " ")); } catch (e) { throw new Error("url"); }
      case "hexe": return SS.hash.hex(SS.hash.utf8(text)).replace(/(..)/g, "$1 ").trim();
      case "hexd": {
        var h = text.replace(/0x/gi, "").replace(/[\s,:]/g, "");
        if (!/^([0-9a-fA-F]{2})*$/.test(h)) throw new Error("hex");
        var out = new Uint8Array(h.length / 2);
        for (var i = 0; i < out.length; i++) out[i] = parseInt(h.substr(i * 2, 2), 16);
        return decodeUtf8(out);
      }
    }
    return "";
  }
  var hashRun = 0;
  async function renderHash() {
    var text = $("hash-input").value, out = $("hash-output");
    try { out.textContent = convert(text); out.style.color = ""; }
    catch (e) {
      out.style.color = "var(--bad)";
      out.textContent = e.message === "utf8" ? SS.t("hash.errUtf8", { hex: e.hex }) : SS.t(e.message === "b64" ? "hash.errB64" : e.message === "url" ? "hash.errUrl" : "hash.errHex");
    }
    var run = ++hashRun;
    $("h-md5").textContent = SS.hash.md5(text);
    var s1 = await SS.hash.sha1(text), s256 = await SS.hash.sha256(text);
    if (run !== hashRun) return;
    $("h-sha1").textContent = s1; $("h-sha256").textContent = s256;
  }
  $("hash-input").addEventListener("input", renderHash);
  $("hash-ops").addEventListener("click", function (e) {
    var b = e.target.closest("[data-op]"); if (!b) return;
    op = b.getAttribute("data-op");
    SS.$$("#hash-ops [data-op]").forEach(function (c) { c.setAttribute("aria-pressed", String(c === b)); });
    renderHash();
  });
  $("hash-copy").addEventListener("click", function () { SS.copy($("hash-output").textContent); });
  $("hash-swap").addEventListener("click", function () {
    if ($("hash-output").style.color) return;
    $("hash-input").value = $("hash-output").textContent;
    var flip = { b64e: "b64d", b64d: "b64e", urle: "urld", urld: "urle", hexe: "hexd", hexd: "hexe" }[op];
    var btn = SS.$('#hash-ops [data-op="' + flip + '"]'); if (btn) btn.click(); else renderHash();
  });
  renderHash();

  /* ------------------------------------------------------------ TOTP (RFC 6238) */
  var B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  function base32Decode(text) {
    var clean = String(text).toUpperCase().replace(/[\s=\-]/g, "");
    if (!clean || /[^A-Z2-7]/.test(clean)) return null;
    var bits = 0, value = 0, out = [];
    for (var i = 0; i < clean.length; i++) {
      value = (value << 5) | B32.indexOf(clean.charAt(i)); bits += 5;
      if (bits >= 8) { out.push((value >>> (bits - 8)) & 255); bits -= 8; }
    }
    return new Uint8Array(out);
  }
  async function totpAt(secretBytes, counter) {
    var msg = new Uint8Array(8), c = counter;
    for (var i = 7; i >= 0; i--) { msg[i] = c & 255; c = Math.floor(c / 256); }
    var mac = await SS.hash.hmacSha1(secretBytes, msg);
    var offset = mac[19] & 15;
    var bin = ((mac[offset] & 127) << 24) | (mac[offset + 1] << 16) | (mac[offset + 2] << 8) | mac[offset + 3];
    return { code: ("000000" + (bin % 1000000)).slice(-6), mac: SS.hash.hex(mac), offset: offset, bin: bin };
  }
  SS.totp = { at: totpAt, base32Decode: base32Decode };

  var lastCounter = -1, lastSecret = "", current = null, previous = null;
  async function tick() {
    if ($("panel-totp").hidden) return;
    var now = Math.floor(Date.now() / 1000), counter = Math.floor(now / 30), left = 30 - (now % 30);
    var secretText = $("totp-secret").value, key = base32Decode(secretText);
    $("totp-left").textContent = left;
    $("totp-ring").style.setProperty("--p", (left / 30 * 100).toFixed(1));
    $("totp-time").textContent = now;
    $("totp-counter").textContent = counter;
    if (!key || !key.length) {
      $("totp-code").textContent = "––– –––"; $("totp-hmac").textContent = SS.t("totp.badSecret"); $("totp-trunc").textContent = ""; $("totp-uri").textContent = "";
      current = previous = null; lastCounter = -1; return;
    }
    if (counter !== lastCounter || secretText !== lastSecret) {
      current = await totpAt(key, counter); previous = await totpAt(key, counter - 1);
      lastCounter = counter; lastSecret = secretText;
      var el = $("totp-code");
      el.textContent = current.code.slice(0, 3) + " " + current.code.slice(3);
      el.classList.remove("flip"); void el.offsetWidth; el.classList.add("flip");
      $("totp-hmac").textContent = current.mac;
      $("totp-trunc").textContent = "offset " + current.offset + " → " + current.bin + " mod 10⁶ = " + current.code;
      $("totp-uri").textContent = "otpauth://totp/SyntaxSec:student?secret=" + secretText.toUpperCase().replace(/[\s=\-]/g, "") + "&issuer=SyntaxSec&period=30&digits=6";
    }
  }
  setInterval(tick, 500); tick();
  $("totp-secret").addEventListener("input", tick);
  $("totp-new").addEventListener("click", function () {
    var rnd = new Uint8Array(16); crypto.getRandomValues(rnd);
    var s = ""; for (var i = 0; i < 16; i++) s += B32.charAt(rnd[i] & 31);
    $("totp-secret").value = s; tick();
  });
  $("totp-copy").addEventListener("click", function () { if (current) SS.copy(current.code); });
  function verify() {
    var typed = $("totp-try").value.replace(/\s/g, ""), msg = $("totp-result");
    if (!current) { msg.textContent = SS.t("totp.badSecret"); msg.className = "form-msg bad"; return; }
    if (typed === current.code) { msg.textContent = SS.t("totp.okNow"); msg.className = "form-msg ok"; }
    else if (typed === previous.code) { msg.textContent = SS.t("totp.okPrev"); msg.className = "form-msg ok"; }
    else { msg.textContent = SS.t("totp.no"); msg.className = "form-msg bad"; }
  }
  $("totp-verify").addEventListener("click", verify);
  $("totp-try").addEventListener("keydown", function (e) { if (e.key === "Enter") verify(); });

  document.addEventListener("langchange", function () { renderLink(); renderHash(); lastCounter = -1; tick(); $("totp-result").textContent = ""; });
})();
