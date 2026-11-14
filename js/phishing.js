/* SyntaxSec — phishing-checker.html.
   Input: pasted email text/headers, or an image that Tesseract.js reads in the browser.
   Output: a verdict plus the specific red flags and trust signals that produced it.
   This is a rule-based indicator, not a guarantee — the page says so at all times. */
(function () {
  "use strict";
  var SS = window.SS;
  SS.addStrings({
    en: {
      "ph.title": "Phishing Mail Checker", "ph.h1": "Phishing Mail Checker",
      "ph.lead": "Paste the text of a suspicious email — with headers if you have them — or upload a screenshot. You get a plain-language list of what looks wrong and what looks right.",
      "ph.disclaimer": "This is an automated indicator, not a guarantee. It can miss well-made phishing emails and can flag genuine ones. When in doubt, do not click: contact the sender through a phone number or website you already trust.",
      "ph.tabText": "Paste text", "ph.tabImage": "Upload screenshot",
      "ph.dropTitle": "Drop a screenshot or photo here, or click to choose",
      "ph.dropHint": "PNG, JPG or WebP. You can also paste an image with Ctrl+V. Text is read on your device with Tesseract.js — the image is not uploaded.",
      "ph.ocrEdit": "Extracted text appears below. Fix any reading mistakes, then analyse.",
      "ph.label": "Email text", "ph.ph": "From: …\nSubject: …\n\nPaste the full message here", "ph.run": "Analyse email",
      "ph.examples": "Load an example:", "ph.exBad": "Phishing email", "ph.exGood": "Legitimate email", "ph.idle": "The analysis will appear here.",
      "ph.short": "There is not enough text to analyse. Paste the whole message, including the sender line and any links.",
      "ph.ocrLoading": "Loading the text reader…", "ph.ocrReading": "Reading text from the image…", "ph.ocrDone": "Text extracted. Check it, then analyse.",
      "ph.ocrNone": "No readable text was found in this image. Try a sharper, larger screenshot.",
      "ph.ocrFail": "The image could not be read. Check your connection (the reader downloads on first use) or paste the text instead.",
      "ph.ocrType": "Choose an image file (PNG, JPG or WebP).",
      "ph.vBad": "Likely phishing", "ph.vWarn": "Suspicious — treat with care", "ph.vOk": "Looks legitimate",
      "ph.vBadP": "Several strong phishing indicators were found. Do not click links, open attachments or reply.",
      "ph.vWarnP": "Some warning signs were found. Verify the message through an official channel before acting on it.",
      "ph.vOkP": "No strong phishing indicators were found. Stay alert if it asks for anything unexpected.",
      "ph.becauseBad": "This might be a phishing email because…", "ph.becauseOk": "This looks like a legitimate email because…",
      "ph.alsoOk": "Signals in its favour", "ph.alsoBad": "Still worth a second look", "ph.score": "Risk score: {n}/100",
      "ph.next": "What to do next", "ph.n1": "Do not click links or open attachments in the message.", "ph.n2": "Open the organisation’s website by typing its address yourself, or call a number you already know.",
      "ph.n3": "Report the message to your email provider or your university’s IT team, then delete it.", "ph.n4": "If you already entered a password, change it now and turn on two-factor authentication.",
      "ph.found": "Found: {list}",
      "ph.f.urgency": "Urgency or fear tactics", "ph.f.urgency.d": "The message pressures you to act quickly or threatens a consequence.",
      "ph.f.cred": "Asks for credentials or to “verify” an account", "ph.f.cred.d": "Genuine services do not ask you to confirm passwords, card data or codes through an email link.",
      "ph.f.pay": "Payment or money request", "ph.f.pay.d": "Unexpected fees, refunds or transfers are a common hook.",
      "ph.f.prize": "Prize or reward bait", "ph.f.prize.d": "Unexpected winnings and bonuses are used to lower your guard.",
      "ph.f.greeting": "Generic greeting", "ph.f.greeting.d": "The sender does not use your name, which suggests a mass mailing.",
      "ph.f.attachRisky": "Risky attachment type", "ph.f.attachRisky.d": "These file types can run code or hide a fake login page.",
      "ph.f.attach": "Mentions an attachment", "ph.f.attach.d": "Open attachments only when you were expecting them from this sender.",
      "ph.f.urlBad": "Suspicious link", "ph.f.urlWarn": "Link needs a closer look",
      "ph.f.display": "Sender name does not match the address", "ph.f.display.d": "The name claims to be “{brand}”, but the address is at {domain}.",
      "ph.f.senderBad": "Suspicious sender domain", "ph.f.senderBad.d": "{domain}: {why}",
      "ph.f.free": "Organisation writing from a free mailbox", "ph.f.free.d": "The sender presents itself as an organisation but uses a personal {domain} address.",
      "ph.f.reply": "Reply-To goes somewhere else", "ph.f.reply.d": "Replies would go to {reply}, not to the sender’s domain {from}.",
      "ph.f.return": "Return-Path differs from the sender", "ph.f.return.d": "The message was actually sent through {ret}, not {from}.",
      "ph.f.auth": "Failed email authentication", "ph.f.auth.d": "The headers show a failed check: {list}. The sender address may be forged.",
      "ph.f.linksOther": "Links lead away from the sender’s domain", "ph.f.linksOther.d": "The sender is at {from}, but links go to {list}.",
      "ph.f.style": "Shouting style", "ph.f.style.d": "Heavy use of capital letters or exclamation marks is typical of scam messages.",
      "ph.t.noLinks": "It contains no links.", "ph.t.cleanLinks": "Its links use HTTPS and show no structural warning signs ({list}).",
      "ph.t.linksMatch": "Its links point to the sender’s own domain ({domain}).", "ph.t.noUrgency": "It does not pressure you to act quickly.",
      "ph.t.noCred": "It does not ask for passwords, card data or verification codes.", "ph.t.named": "It greets you by name.",
      "ph.t.auth": "The headers show SPF, DKIM or DMARC passing.", "ph.t.noAttach": "It has no risky attachments.",
      "ph.t.sender": "The sender address is on an ordinary-looking domain ({domain})."
    },
    az: {
      "ph.title": "Fişinq Məktub Yoxlayıcısı", "ph.h1": "Fişinq Məktub Yoxlayıcısı",
      "ph.lead": "Şübhəli məktubun mətnini — varsa başlıqları ilə birlikdə — yapışdırın və ya ekran şəklini yükləyin. Nəyin şübhəli, nəyin normal göründüyünü sadə dildə siyahı şəklində alacaqsınız.",
      "ph.disclaimer": "Bu, avtomatik göstəricidir, zəmanət deyil. Yaxşı hazırlanmış fişinq məktublarını ötürə və həqiqi məktubları şübhəli saya bilər. Şübhə edirsinizsə, klikləməyin: göndərənlə artıq etibar etdiyiniz telefon nömrəsi və ya sayt vasitəsilə əlaqə saxlayın.",
      "ph.tabText": "Mətni yapışdır", "ph.tabImage": "Ekran şəkli yüklə",
      "ph.dropTitle": "Ekran şəklini və ya fotonu bura atın, yaxud seçmək üçün klikləyin",
      "ph.dropHint": "PNG, JPG və ya WebP. Şəkli Ctrl+V ilə də yapışdıra bilərsiniz. Mətn cihazınızda Tesseract.js ilə oxunur — şəkil heç yerə yüklənmir.",
      "ph.ocrEdit": "Çıxarılan mətn aşağıda görünəcək. Oxunma səhvlərini düzəldin, sonra təhlil edin.",
      "ph.label": "Məktubun mətni", "ph.ph": "Kimdən: …\nMövzu: …\n\nMesajı tam şəkildə bura yapışdırın", "ph.run": "Məktubu təhlil et",
      "ph.examples": "Nümunə yüklə:", "ph.exBad": "Fişinq məktubu", "ph.exGood": "Həqiqi məktub", "ph.idle": "Təhlil burada görünəcək.",
      "ph.short": "Təhlil üçün mətn kifayət deyil. Göndərən sətri və keçidlər daxil olmaqla bütün mesajı yapışdırın.",
      "ph.ocrLoading": "Mətn oxuyucu yüklənir…", "ph.ocrReading": "Şəkildən mətn oxunur…", "ph.ocrDone": "Mətn çıxarıldı. Yoxlayın, sonra təhlil edin.",
      "ph.ocrNone": "Bu şəkildə oxunaqlı mətn tapılmadı. Daha aydın və böyük ekran şəkli yoxlayın.",
      "ph.ocrFail": "Şəkli oxumaq mümkün olmadı. İnternet bağlantınızı yoxlayın (oxuyucu ilk istifadədə yüklənir) və ya mətni yapışdırın.",
      "ph.ocrType": "Şəkil faylı seçin (PNG, JPG və ya WebP).",
      "ph.vBad": "Çox güman ki, fişinqdir", "ph.vWarn": "Şübhəlidir — ehtiyatlı olun", "ph.vOk": "Həqiqi məktuba bənzəyir",
      "ph.vBadP": "Bir neçə güclü fişinq əlaməti tapıldı. Keçidlərə klikləməyin, qoşmaları açmayın və cavab yazmayın.",
      "ph.vWarnP": "Bəzi xəbərdarlıq əlamətləri tapıldı. Hərəkət etməzdən əvvəl mesajı rəsmi kanal vasitəsilə yoxlayın.",
      "ph.vOkP": "Güclü fişinq əlaməti tapılmadı. Gözlənilməz bir şey tələb edirsə, yenə də diqqətli olun.",
      "ph.becauseBad": "Bu, fişinq məktubu ola bilər, çünki…", "ph.becauseOk": "Bu, həqiqi məktuba bənzəyir, çünki…",
      "ph.alsoOk": "Lehinə olan əlamətlər", "ph.alsoBad": "Yenə də bir daha baxmağa dəyər", "ph.score": "Risk balı: {n}/100",
      "ph.next": "Bundan sonra nə etməli", "ph.n1": "Mesajdakı keçidlərə klikləməyin və qoşmaları açmayın.", "ph.n2": "Təşkilatın saytını ünvanı özünüz yazaraq açın və ya artıq tanıdığınız nömrəyə zəng edin.",
      "ph.n3": "Mesaj barədə e-poçt xidmətinizə və ya universitetin İT komandasına məlumat verin, sonra silin.", "ph.n4": "Əgər artıq parol daxil etmisinizsə, onu indi dəyişin və iki faktorlu autentifikasiyanı aktiv edin.",
      "ph.found": "Tapıldı: {list}",
      "ph.f.urgency": "Tələsdirmə və ya qorxutma taktikası", "ph.f.urgency.d": "Mesaj sizi tez hərəkət etməyə məcbur edir və ya nəticə ilə hədələyir.",
      "ph.f.cred": "Giriş məlumatlarını və ya hesabın “təsdiqini” istəyir", "ph.f.cred.d": "Həqiqi xidmətlər parolu, kart məlumatını və ya kodu məktubdakı keçid vasitəsilə təsdiqləməyi istəmir.",
      "ph.f.pay": "Ödəniş və ya pul tələbi", "ph.f.pay.d": "Gözlənilməz rüsumlar, geri ödəmələr və köçürmələr geniş yayılmış tələdir.",
      "ph.f.prize": "Uduş və ya mükafat yemi", "ph.f.prize.d": "Gözlənilməz uduşlar və bonuslar sayıqlığınızı azaltmaq üçün istifadə olunur.",
      "ph.f.greeting": "Ümumi müraciət", "ph.f.greeting.d": "Göndərən adınızı çəkmir — bu, kütləvi göndərişə işarədir.",
      "ph.f.attachRisky": "Riskli qoşma növü", "ph.f.attachRisky.d": "Bu fayl növləri kod işlədə və ya saxta giriş səhifəsini gizlədə bilər.",
      "ph.f.attach": "Qoşmadan bəhs edir", "ph.f.attach.d": "Qoşmaları yalnız bu göndərəndən gözlədiyiniz halda açın.",
      "ph.f.urlBad": "Şübhəli keçid", "ph.f.urlWarn": "Keçidə diqqətlə baxmaq lazımdır",
      "ph.f.display": "Göndərənin adı ünvanla uyğun gəlmir", "ph.f.display.d": "Ad “{brand}” olduğunu iddia edir, amma ünvan {domain} domenindədir.",
      "ph.f.senderBad": "Şübhəli göndərən domeni", "ph.f.senderBad.d": "{domain}: {why}",
      "ph.f.free": "Təşkilat pulsuz poçt qutusundan yazır", "ph.f.free.d": "Göndərən özünü təşkilat kimi təqdim edir, amma şəxsi {domain} ünvanından istifadə edir.",
      "ph.f.reply": "Reply-To başqa ünvana gedir", "ph.f.reply.d": "Cavablar göndərənin {from} domeninə yox, {reply} ünvanına gedəcək.",
      "ph.f.return": "Return-Path göndərəndən fərqlidir", "ph.f.return.d": "Mesaj əslində {from} yox, {ret} vasitəsilə göndərilib.",
      "ph.f.auth": "E-poçt autentifikasiyası uğursuz olub", "ph.f.auth.d": "Başlıqlarda uğursuz yoxlama var: {list}. Göndərən ünvanı saxtalaşdırılmış ola bilər.",
      "ph.f.linksOther": "Keçidlər göndərənin domenindən kənara aparır", "ph.f.linksOther.d": "Göndərən {from} domenindədir, amma keçidlər bura aparır: {list}.",
      "ph.f.style": "Qışqıran üslub", "ph.f.style.d": "Böyük hərflərin və nida işarələrinin həddən artıq istifadəsi fırıldaq mesajları üçün səciyyəvidir.",
      "ph.t.noLinks": "Məktubda keçid yoxdur.", "ph.t.cleanLinks": "Keçidlər HTTPS istifadə edir və quruluşunda xəbərdarlıq əlaməti yoxdur ({list}).",
      "ph.t.linksMatch": "Keçidlər göndərənin öz domeninə aparır ({domain}).", "ph.t.noUrgency": "Sizi tez hərəkət etməyə məcbur etmir.",
      "ph.t.noCred": "Parol, kart məlumatı və ya təsdiq kodu istəmir.", "ph.t.named": "Sizə adınızla müraciət edir.",
      "ph.t.auth": "Başlıqlarda SPF, DKIM və ya DMARC yoxlamasının keçdiyi görünür.", "ph.t.noAttach": "Riskli qoşması yoxdur.",
      "ph.t.sender": "Göndərən ünvanı adi görünən domendədir ({domain})."
    }
  });

  /* ------------------------------------------------------------ indicator dictionaries (EN + AZ) */
  var WORDS = {
    urgency: ["urgent", "immediately", "right away", "within 24 hours", "within 48 hours", "act now", "final notice", "last warning", "final warning", "suspended", "suspension",
      "will be closed", "will be blocked", "will be deleted", "will be terminated", "will be locked", "has been locked", "has been limited", "has been blocked", "expires today", "expire", "limited time", "as soon as possible",
      "unusual activity", "suspicious activity", "unauthorized", "unauthorised", "security alert", "failure to", "avoid suspension", "action required", "important notice",
      "təcili", "dərhal", "24 saat ərzində", "48 saat ərzində", "son xəbərdarlıq", "bloklanacaq", "bloklanıb", "bloklandı", "bloklanmışdır", "dayandırılacaq", "dayandırılıb", "bağlanacaq", "silinəcək",
      "məhdudlaşdırılıb", "vaxtı bitir", "müddəti bitir", "müddəti bitib", "şübhəli fəaliyyət", "icazəsiz", "təhlükəsizlik xəbərdarlığı", "əks halda", "vacib bildiriş", "tələsin", "son gün"],
    cred: ["verify your account", "verify your identity", "confirm your account", "confirm your identity", "confirm your password", "confirm your details", "update your account", "update your payment",
      "update your billing", "validate your account", "enter your password", "enter your pin", "enter your card", "card number", "card details", "cvv", "pin code", "sms code", "one-time code", "one-time password", "otp",
      "verification code", "login to your account", "log in to your account", "sign in to your account", "reset your password", "click here", "click the link", "click below", "click the button", "follow the link", "social security",
      "hesabınızı təsdiqləyin", "hesabınızı təsdiq edin", "şəxsiyyətinizi təsdiq", "məlumatlarınızı yeniləyin", "məlumatlarınızı təsdiq", "kart nömrə", "kart məlumat", "kartın arxasındakı", "pin kod", "pin-kod", "sms kod", "sms-kod",
      "təsdiq kodu", "birdəfəlik kod", "birdəfəlik şifrə", "şifrənizi", "parolunuzu", "hesabınıza daxil olun", "keçidə daxil olun", "keçidə klikləyin", "linkə daxil olun", "linkə keçid", "linkə klik", "buraya klik", "aşağıdakı keçid", "aşağıdakı link"],
    pay: ["payment failed", "payment declined", "outstanding invoice", "overdue invoice", "unpaid invoice", "refund", "wire transfer", "gift card", "bitcoin", "crypto wallet", "customs fee", "delivery fee", "shipping fee",
      "redelivery fee", "pay now", "processing fee", "transfer the amount", "bank transfer",
      "ödəniş uğursuz", "ödəniş edin", "ödənişi tamamlayın", "gömrük rüsumu", "çatdırılma haqqı", "geri ödəmə", "pul köçürməsi", "köçürmə edin", "borcunuz", "cərimə", "xidmət haqqı", "rüsum ödə"],
    prize: ["you have won", "you've won", "you won", "winner", "lottery", "jackpot", "claim your prize", "claim your reward", "free gift", "congratulations", "cash prize", "exclusive reward", "bonus",
      "qazandınız", "uduş", "lotereya", "hədiyyə qazan", "hədiyyəniz", "təbriklər", "təbrik edirik", "mükafat", "bonus", "keşbek qazan", "pul mükafatı"],
    greeting: ["dear customer", "dear user", "dear client", "dear member", "dear account holder", "dear valued", "dear sir", "dear madam", "dear sir/madam", "dear student", "dear email user", "hello user", "dear friend",
      "hörmətli müştəri", "hörmətli istifadəçi", "hörmətli abunəçi", "hörmətli vətəndaş", "hörmətli kart sahibi", "əziz müştəri", "əziz istifadəçi", "dəyərli müştəri"],
    attach: ["attached", "attachment", "see the enclosed", "open the file", "download the file", "əlavədə", "əlavə fayl", "əlavə olunmuş", "qoşma", "faylı açın", "faylı yükləyin"]
  };
  var RISKY_EXT = /[\w\-.()\u0080-\uffff]+\.(exe|scr|zip|rar|7z|iso|img|js|jse|vbs|bat|cmd|lnk|html?|docm|xlsm|pptm|apk|jar|hta|msi)\b/gi;
  var FREE_MAIL = ["gmail.com", "mail.ru", "yahoo.com", "outlook.com", "hotmail.com", "live.com", "yandex.ru", "yandex.com", "proton.me", "protonmail.com", "bk.ru", "list.ru", "inbox.ru", "rambler.ru", "icloud.com", "aol.com", "gmx.com", "box.az"];
  var ORG_WORDS = ["bank", "support", "security", "service", "team", "admin", "helpdesk", "billing", "customer", "official", "department", "delivery", "post", "dəstək", "təhlükəsizlik", "xidmət", "komanda", "çatdırılma", "poçt", "rəsmi", "şöbə"];

  /* Case folding that works for both English and Azerbaijani text (İ/I/ı all become i). */
  function fold(s) { return String(s || "").toLowerCase().replace(/\u0307/g, "").replace(/ı/g, "i"); }
  var FOLDED = {};
  Object.keys(WORDS).forEach(function (k) { FOLDED[k] = WORDS[k].map(function (w) { return [w, fold(w)]; }); });
  function hits(kind, text) {
    var out = [];
    FOLDED[kind].forEach(function (pair) {
      var i = text.indexOf(pair[1]);
      if (i === -1) return;
      /* short tokens must stand alone ("otp", "cvv", "bonus") */
      if (pair[1].length <= 5) { var re = new RegExp("(^|[^a-zəöğşçü0-9])" + pair[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "($|[^a-zəöğşçü0-9])"); if (!re.test(text)) return; }
      if (out.indexOf(pair[0]) === -1) out.push(pair[0]);
    });
    return out;
  }
  function header(text, names) {
    var re = new RegExp("^\\s*(?:" + names.join("|") + ")\\s*:\\s*(.+)$", "im");
    var m = text.match(re); return m ? m[1].trim() : "";
  }
  function parseAddress(line) {
    var m = line.match(/([A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,})/i);
    if (!m) return null;
    var email = m[1].toLowerCase();
    var name = line.replace(m[0], "").replace(/[<>"'()]/g, "").trim();
    return { email: email, domain: email.split("@")[1], name: name };
  }
  function quoted(list, max) { return list.slice(0, max || 4).map(function (x) { return "“" + x + "”"; }).join(", "); }

  function analyze(raw) {
    var text = fold(raw), flags = [], trust = [], score = 0;
    function flag(level, key, weight, detail) { flags.push({ level: level, key: key, detail: detail }); score += weight; }

    var from = parseAddress(header(raw, ["from", "kimdən", "kimden", "göndərən", "gonderen", "от"]));
    var replyTo = parseAddress(header(raw, ["reply-to", "reply to"]));
    var returnPath = parseAddress(header(raw, ["return-path", "return path"]));
    var authLine = header(raw, ["authentication-results"]) + " " + header(raw, ["received-spf"]);
    if (!from) {
      /* no header line: fall back to the first address that appears in the text */
      var any = raw.match(/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i);
      if (any) from = parseAddress(any[0]);
    }

    var urg = hits("urgency", text), cred = hits("cred", text), pay = hits("pay", text), prize = hits("prize", text), greet = hits("greeting", text), att = hits("attach", text);
    if (urg.length) flag(urg.length >= 3 ? "bad" : "warn", "urgency", urg.length >= 3 ? 3 : 2, SS.t("ph.f.urgency.d") + " " + SS.t("ph.found", { list: quoted(urg) }));
    if (cred.length) flag("bad", "cred", cred.length >= 2 ? 4 : 3, SS.t("ph.f.cred.d") + " " + SS.t("ph.found", { list: quoted(cred) }));
    if (pay.length) flag("warn", "pay", 2, SS.t("ph.f.pay.d") + " " + SS.t("ph.found", { list: quoted(pay) }));
    if (prize.length) flag("warn", "prize", 2, SS.t("ph.f.prize.d") + " " + SS.t("ph.found", { list: quoted(prize) }));
    if (greet.length) flag("warn", "greeting", 1, SS.t("ph.f.greeting.d") + " " + SS.t("ph.found", { list: quoted(greet) }));

    var urlsFirst = SS.url.extract(raw), rawNoUrls = raw;
    urlsFirst.forEach(function (u) { rawNoUrls = rawNoUrls.split(u).join(" "); });
    var files = (rawNoUrls.match(RISKY_EXT) || []).filter(function (f) { return !/^(www\.|https?:)/i.test(f) && f.indexOf("/") === -1; });
    files = files.filter(function (f, i) { return files.indexOf(f) === i; });
    if (files.length) flag("bad", "attachRisky", 3, SS.t("ph.f.attachRisky.d") + " " + SS.t("ph.found", { list: quoted(files) }));
    else if (att.length) flag("warn", "attach", 1, SS.t("ph.f.attach.d"));

    /* links */
    var urls = SS.url.extract(raw).filter(function (u) { return !files.some(function (f) { return u.toLowerCase() === f.toLowerCase(); }); });
    var inspected = urls.map(function (u) { return SS.url.inspect(u); }).filter(function (r) { return r.ok && r.parts.host; });
    var cleanDomains = [], otherDomains = [], credAndBadUrl = false;
    inspected.slice(0, 8).forEach(function (r) {
      var bad = r.findings.filter(function (f) { return f.level === "bad" && f.key !== "http"; });
      var plainHttp = r.findings.some(function (f) { return f.key === "http"; });
      var warn = r.findings.filter(function (f) { return f.level === "warn" && f.key !== "noscheme"; });
      if (bad.length) {
        flag("bad", "urlBad", 3, r.input + " — " + bad.slice(0, 2).map(function (f) { return SS.t("url." + f.key + ".d", f.vars); }).join(" "));
        if (cred.length) credAndBadUrl = true;
      } else if (warn.length || plainHttp) {
        var list = warn.slice(0, 2).map(function (f) { return SS.t("url." + f.key + ".d", f.vars); });
        if (plainHttp) list.unshift(SS.t("url.http.d"));
        flag("warn", "urlWarn", plainHttp ? 2 : 1, r.input + " — " + list.slice(0, 2).join(" "));
      } else if (cleanDomains.indexOf(r.parts.domain) === -1) cleanDomains.push(r.parts.domain);
      if (from && r.parts.domain !== SS.url.registrable(from.domain).domain && otherDomains.indexOf(r.parts.domain) === -1) otherDomains.push(r.parts.domain);
    });

    /* sender */
    if (from) {
      var fromReg = SS.url.registrable(from.domain).domain;
      var senderCheck = SS.url.inspect("https://" + from.domain);
      var senderBad = senderCheck.ok ? senderCheck.findings.filter(function (f) { return f.level === "bad"; }) : [];
      var isFree = FREE_MAIL.indexOf(from.domain) !== -1;
      var nameFold = fold(from.name), nameFlat = nameFold.replace(/[\s\-_.]/g, "");
      var claimed = "";
      Object.keys(SS.url.brands).forEach(function (b) {
        if (claimed) return;
        var plain = b.replace(/-/g, "");
        var inName = plain.length <= 4 ? nameFold.split(/[^a-zəöğşçü0-9]+/).indexOf(plain) !== -1 : nameFlat.indexOf(plain) !== -1;
        if (inName && !SS.url.isOfficial(fromReg, SS.url.brands[b])) claimed = b;
      });
      if (senderBad.length) flag("bad", "senderBad", 3, SS.t("ph.f.senderBad.d", { domain: from.domain, why: SS.t("url." + senderBad[0].key + ".d", senderBad[0].vars) }));
      else if (claimed) flag("bad", "display", 3, SS.t("ph.f.display.d", { brand: claimed, domain: from.domain }));
      else if (isFree && (ORG_WORDS.some(function (w) { return nameFold.indexOf(fold(w)) !== -1; }) || cred.length || pay.length)) flag("warn", "free", 2, SS.t("ph.f.free.d", { domain: from.domain }));
      else if (!isFree) trust.push(SS.t("ph.t.sender", { domain: from.domain }));

      if (replyTo && SS.url.registrable(replyTo.domain).domain !== fromReg) flag("bad", "reply", 3, SS.t("ph.f.reply.d", { reply: replyTo.email, from: from.domain }));
      if (returnPath && SS.url.registrable(returnPath.domain).domain !== fromReg) flag("warn", "return", 1, SS.t("ph.f.return.d", { ret: returnPath.domain, from: from.domain }));
      if (inspected.length && !isFree) {
        if (otherDomains.length && otherDomains.length === inspected.map(function (r) { return r.parts.domain; }).filter(function (d, i, a) { return a.indexOf(d) === i; }).length)
          flag("warn", "linksOther", 1, SS.t("ph.f.linksOther.d", { from: fromReg, list: otherDomains.slice(0, 3).join(", ") }));
        else if (!otherDomains.length) trust.push(SS.t("ph.t.linksMatch", { domain: fromReg }));
      }
    }

    /* authentication headers */
    var authFold = fold(authLine), failed = [];
    ["spf", "dkim", "dmarc"].forEach(function (k) { if (new RegExp(k + "\\s*=\\s*(fail|softfail|none|permerror|temperror)").test(authFold)) failed.push(k.toUpperCase()); });
    if (/^\s*(soft)?fail/.test(fold(header(raw, ["received-spf"]))) && failed.indexOf("SPF") === -1) failed.push("SPF");
    if (failed.length) flag("bad", "auth", 3, SS.t("ph.f.auth.d", { list: failed.join(", ") }));
    else if (/(spf|dkim|dmarc)\s*=\s*pass/.test(authFold)) trust.push(SS.t("ph.t.auth"));

    /* style */
    var caps = (raw.match(/\b[A-ZƏÖĞŞÇÜİ]{4,}\b/g) || []).length;
    if (/!{3,}/.test(raw) || (raw.match(/!/g) || []).length >= 5 || caps >= 5) flag("warn", "style", 1, SS.t("ph.f.style.d"));

    /* trust signals */
    if (!inspected.length) trust.push(SS.t("ph.t.noLinks"));
    else if (cleanDomains.length && !flags.some(function (f) { return f.key === "urlBad" || f.key === "urlWarn"; })) trust.push(SS.t("ph.t.cleanLinks", { list: cleanDomains.slice(0, 3).join(", ") }));
    if (!urg.length) trust.push(SS.t("ph.t.noUrgency"));
    if (!cred.length) trust.push(SS.t("ph.t.noCred"));
    var named = raw.match(/^\s*(?:dear|hi|hello|salam|hörmətli|əziz)\s+([A-ZƏÖĞŞÇÜİ][a-zəöğşçüı]+)/m);
    if (named && !greet.length && ["Customer", "User", "Client", "Member", "Sir", "Madam", "Student", "Friend", "Müştəri", "İstifadəçi"].indexOf(named[1]) === -1) trust.push(SS.t("ph.t.named"));
    if (!files.length) trust.push(SS.t("ph.t.noAttach"));

    var strong = flags.filter(function (f) { return f.level === "bad"; }).length;
    var verdict = score >= 7 || credAndBadUrl || strong >= 2 ? "bad" : score >= 3 || strong ? "warn" : "ok";
    return { verdict: verdict, score: Math.min(100, Math.round(score * 7.5)), flags: flags, trust: trust };
  }
  SS._phish = analyze;

  /* ------------------------------------------------------------ UI */
  var $ = function (id) { return document.getElementById(id); };
  var mail = $("mail"), result = $("ph-result"), lastText = null;

  function renderResult() {
    if (lastText === null) { result.innerHTML = '<div class="empty"><span class="emoji">📬</span>' + SS.esc(SS.t("ph.idle")) + "</div>"; return; }
    if (lastText.replace(/\s/g, "").length < 20) { result.innerHTML = '<div class="notice bad"><span>⚠️</span><span>' + SS.esc(SS.t("ph.short")) + "</span></div>"; return; }
    var r = analyze(lastText), e = SS.esc, v = r.verdict;
    var flagsHtml = '<ul class="flags">' + r.flags.map(function (f, i) {
      return '<li class="' + f.level + '" style="animation-delay:' + i * 50 + 'ms"><b>' + e(SS.t("ph.f." + f.key)) + "</b><span>" + e(f.detail) + "</span></li>";
    }).join("") + "</ul>";
    var trustHtml = '<ul class="flags">' + r.trust.map(function (t, i) { return '<li class="ok" style="animation-delay:' + i * 50 + 'ms">' + e(t) + "</li>"; }).join("") + "</ul>";
    var body;
    if (v === "ok") {
      body = "<h3>" + e(SS.t("ph.becauseOk")) + "</h3>" + trustHtml + (r.flags.length ? '<h3 style="margin-top:20px">' + e(SS.t("ph.alsoBad")) + "</h3>" + flagsHtml : "");
    } else {
      body = "<h3>" + e(SS.t("ph.becauseBad")) + "</h3>" + flagsHtml + (r.trust.length ? '<h3 style="margin-top:20px">' + e(SS.t("ph.alsoOk")) + "</h3>" + trustHtml : "") +
        '<h3 style="margin-top:20px">' + e(SS.t("ph.next")) + '</h3><ol class="small" style="padding-left:20px;margin:0"><li>' + [1, 2, 3, 4].map(function (n) { return e(SS.t("ph.n" + n)); }).join("</li><li>") + "</li></ol>";
    }
    result.innerHTML =
      '<div class="verdict ' + v + '"><span class="big">' + (v === "bad" ? "🚨" : v === "warn" ? "⚠️" : "✅") + "</span><div><h3>" + e(SS.t(v === "bad" ? "ph.vBad" : v === "warn" ? "ph.vWarn" : "ph.vOk")) + "</h3><p>" +
        e(SS.t(v === "bad" ? "ph.vBadP" : v === "warn" ? "ph.vWarnP" : "ph.vOkP")) + "</p></div></div>" +
      '<div style="margin:14px 0 18px"><div class="row between small"><span class="dim">' + e(SS.t("ph.score", { n: r.score })) + '</span></div><div class="meter" style="margin-top:6px"><div style="width:' + Math.max(r.score, 4) +
        "%;background:var(--" + (v === "bad" ? "coral" : v === "warn" ? "sun" : "mint") + ')"></div></div></div>' +
      '<div class="notice" style="margin-bottom:18px"><span>ℹ️</span><span>' + e(SS.t("ph.disclaimer")) + "</span></div>" + body;
  }
  function run() { lastText = mail.value; renderResult(); if (window.innerWidth < 880) result.scrollIntoView({ block: "start" }); }
  $("ph-run").addEventListener("click", run);
  $("ph-clear").addEventListener("click", function () { mail.value = ""; lastText = null; renderResult(); $("preview").hidden = true; $("ocr-status").hidden = true; });

  var SAMPLES = {
    bad: {
      en: "From: Kapital Bank Security <security-alert@kapitalbank.az.card-verify.top>\nReply-To: helpdesk.verify@mail.ru\nSubject: URGENT: your card has been blocked\n\nDear customer,\n\nWe detected unusual activity on your account. Your card has been blocked and will be closed within 24 hours unless you verify your account immediately.\n\nClick here to confirm your identity and enter your card number and SMS code:\nhttp://kapitalbank.az.card-verify.top/login?next=https://secure-pay.example/collect\n\nFailure to act will result in permanent suspension!!!\n\nSecurity Department",
      az: "Kimdən: Kapital Bank Təhlükəsizlik <security-alert@kapitalbank.az.card-verify.top>\nReply-To: helpdesk.verify@mail.ru\nMövzu: TƏCİLİ: kartınız bloklanıb\n\nHörmətli müştəri,\n\nHesabınızda şübhəli fəaliyyət aşkar edildi. Kartınız bloklanıb və hesabınızı dərhal təsdiqləməsəniz, 24 saat ərzində bağlanacaq.\n\nŞəxsiyyətinizi təsdiq etmək üçün keçidə daxil olun, kart nömrənizi və SMS kodunu yazın:\nhttp://kapitalbank.az.card-verify.top/login?next=https://secure-pay.example/collect\n\nƏks halda hesabınız həmişəlik dayandırılacaq!!!\n\nTəhlükəsizlik şöbəsi"
    },
    good: {
      en: "From: University Library <library@university-example.edu.az>\nSubject: Your reserved book is ready for pickup\n\nHello Leyla,\n\nThe book you reserved, \"Computer Networking: A Top-Down Approach\", is now available at the main desk. We will hold it for you until Friday.\n\nOpening hours are listed at https://library.university-example.edu.az/hours\n\nYou do not need to reply to this message.\n\nKind regards,\nLibrary Services",
      az: "Kimdən: Universitet Kitabxanası <library@university-example.edu.az>\nMövzu: Sifariş etdiyiniz kitab hazırdır\n\nSalam Leyla,\n\nSifariş etdiyiniz \"Computer Networking: A Top-Down Approach\" kitabı artıq əsas masada sizi gözləyir. Kitabı cümə gününə qədər sizin üçün saxlayacağıq.\n\nİş saatları burada göstərilib: https://library.university-example.edu.az/hours\n\nBu mesaja cavab yazmağa ehtiyac yoxdur.\n\nHörmətlə,\nKitabxana xidməti"
    }
  };
  document.addEventListener("click", function (e) {
    var s = e.target.closest("[data-sample]");
    if (s) { mail.value = SAMPLES[s.getAttribute("data-sample")][SS.lang]; setSource("text"); run(); }
  });

  /* ---- source tabs ---- */
  function setSource(src) {
    SS.$$("#ph-tabs .tab").forEach(function (t) { t.setAttribute("aria-selected", String(t.getAttribute("data-src") === src)); });
    $("src-image").hidden = src !== "image";
  }
  $("ph-tabs").addEventListener("click", function (e) { var b = e.target.closest("[data-src]"); if (b) setSource(b.getAttribute("data-src")); });

  /* ---- OCR with Tesseract.js (runs in the browser) ---- */
  var drop = $("drop"), file = $("file"), busy = false;
  function status(key, pct) {
    $("ocr-status").hidden = false;
    $("ocr-label").textContent = SS.t(key);
    $("ocr-pct").textContent = pct === undefined ? "" : Math.round(pct) + "%";
    $("ocr-bar").style.width = (pct === undefined ? 0 : pct) + "%";
  }
  async function readImage(blob) {
    if (busy) return;
    if (!blob || !/^image\//.test(blob.type)) { SS.toast(SS.t("ph.ocrType"), "bad"); return; }
    setSource("image");
    var img = $("preview");
    img.src = URL.createObjectURL(blob); img.hidden = false;
    if (!window.Tesseract) { status("ph.ocrFail"); SS.toast(SS.t("ph.ocrFail"), "bad"); return; }
    busy = true; status("ph.ocrLoading", 2);
    var worker = null;
    function logger(m) {
      if (m.status === "recognizing text") status("ph.ocrReading", 20 + m.progress * 80);
      else if (typeof m.progress === "number") status("ph.ocrLoading", 2 + m.progress * 18);
    }
    try {
      try { worker = await window.Tesseract.createWorker(["eng", "aze"], 1, { logger: logger }); }
      catch (langErr) { worker = await window.Tesseract.createWorker("eng", 1, { logger: logger }); }
      var out = await worker.recognize(blob);
      var text = (out.data.text || "").trim();
      if (!text) { status("ph.ocrNone"); SS.toast(SS.t("ph.ocrNone"), "bad"); }
      else { mail.value = text; status("ph.ocrDone", 100); run(); }
    } catch (err) {
      console.error(err); status("ph.ocrFail"); SS.toast(SS.t("ph.ocrFail"), "bad");
    } finally {
      busy = false;
      if (worker) { try { await worker.terminate(); } catch (e) {} }
    }
  }
  drop.addEventListener("click", function () { file.click(); });
  drop.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); file.click(); } });
  file.addEventListener("change", function () { if (file.files[0]) readImage(file.files[0]); file.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
  ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("over"); }); });
  drop.addEventListener("drop", function (e) { if (e.dataTransfer.files[0]) readImage(e.dataTransfer.files[0]); });
  document.addEventListener("paste", function (e) {
    var items = (e.clipboardData && e.clipboardData.items) || [];
    for (var i = 0; i < items.length; i++) if (/^image\//.test(items[i].type)) { e.preventDefault(); readImage(items[i].getAsFile()); return; }
  });

  document.addEventListener("langchange", renderResult);
})();
