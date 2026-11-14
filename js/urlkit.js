/* SyntaxSec — URL analysis shared by the Link Inspector and the Phishing Mail Checker.
   SS.url.inspect("https://example.com/…") → { ok, parts, findings[], risk }.
   Each finding is { level: "bad" | "warn" | "ok", key, vars } and is rendered with
   SS.t("url." + key) (title) and SS.t("url." + key + ".d", vars) (detail). */
(function () {
  "use strict";
  var SS = (window.SS = window.SS || {});

  var MULTI_SUFFIX = ["co.uk", "org.uk", "ac.uk", "gov.uk", "com.az", "edu.az", "gov.az", "org.az", "net.az", "info.az", "biz.az", "co.az", "pp.az",
    "com.tr", "org.tr", "edu.tr", "gov.tr", "com.au", "co.jp", "com.br", "co.in", "com.ru", "co.nz", "com.ua", "com.ge", "co.za", "com.cn", "com.mx", "co.kr"];
  var RISKY_TLDS = ["zip", "mov", "tk", "ml", "ga", "cf", "gq", "xyz", "top", "click", "link", "work", "country", "kim", "loan", "men", "icu", "cyou", "rest", "cam", "quest", "sbs", "buzz", "monster", "support", "live", "shop"];
  var SHORTENERS = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly", "cutt.ly", "rb.gy", "shorturl.at", "rebrand.ly", "t.ly", "tiny.cc", "clck.ru", "vk.cc", "s.id", "lnkd.in"];
  var BAIT_WORDS = ["login", "signin", "sign-in", "verify", "verification", "secure", "security", "account", "update", "confirm", "wallet", "support", "billing", "password", "unlock", "bonus", "prize", "giris", "tesdiq", "hesab", "odenis", "kart", "bank"];
  var EXEC_EXT = ["exe", "scr", "bat", "cmd", "com", "msi", "js", "jse", "vbs", "ps1", "jar", "apk", "iso", "img", "lnk", "hta", "dmg", "pkg", "docm", "xlsm"];
  var RISKY_PARAMS = ["redirect", "redirect_uri", "redirect_url", "url", "next", "continue", "return", "returnurl", "return_to", "goto", "dest", "destination", "target", "link", "out", "u", "r"];
  var SECRET_PARAMS = ["password", "passwd", "pwd", "pass", "token", "access_token", "session", "sessionid", "sid", "auth", "apikey", "api_key", "key", "otp", "pin", "cvv", "card", "email", "login", "user", "username"];
  /* brand token → domains it legitimately lives on */
  var BRANDS = {
    paypal: ["paypal.com", "paypal.me"], google: ["google.com", "google.az", "googleapis.com", "withgoogle.com", "googleusercontent.com", "google.co.uk"],
    gmail: ["gmail.com", "google.com"], apple: ["apple.com", "icloud.com"], icloud: ["icloud.com", "apple.com"],
    microsoft: ["microsoft.com", "microsoftonline.com", "live.com", "office.com"], outlook: ["outlook.com", "live.com", "office.com", "microsoft.com"],
    office365: ["office.com", "microsoft.com", "office365.com"], amazon: ["amazon.com", "amazon.co.uk", "amazon.de", "amazonaws.com"],
    facebook: ["facebook.com", "fb.com", "meta.com"], instagram: ["instagram.com"], whatsapp: ["whatsapp.com", "whatsapp.net"],
    telegram: ["telegram.org", "t.me", "telegram.me"], netflix: ["netflix.com"], linkedin: ["linkedin.com"], binance: ["binance.com"],
    steam: ["steampowered.com", "steamcommunity.com"], dhl: ["dhl.com", "dhl.de"], fedex: ["fedex.com"],
    kapitalbank: ["kapitalbank.az"], birbank: ["birbank.az", "kapitalbank.az"], "abb-bank": ["abb-bank.az"], leobank: ["leobank.az"],
    pashabank: ["pashabank.az"], unibank: ["unibank.az"], azercell: ["azercell.com"], bakcell: ["bakcell.com"],
    azerpost: ["azerpost.az"], azerpoct: ["azerpost.az"], asan: ["asan.gov.az", "asan.az", "my.gov.az"]
  };

  /* ---- Punycode decoder (RFC 3492) for xn-- labels ---- */
  function punyDecode(input) {
    var base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, n = 128, bias = 72, i = 0, out = [];
    var basic = input.lastIndexOf("-");
    for (var j = 0; j < Math.max(basic, 0); j++) out.push(input.charCodeAt(j));
    for (var idx = basic > 0 ? basic + 1 : 0; idx < input.length;) {
      var oldi = i, w = 1;
      for (var k = base; ; k += base) {
        if (idx >= input.length) throw new Error("bad punycode");
        var c = input.charCodeAt(idx++);
        var digit = c - 48 < 10 ? c - 22 : c - 65 < 26 ? c - 65 : c - 97 < 26 ? c - 97 : base;
        if (digit >= base) throw new Error("bad punycode");
        i += digit * w;
        var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
        if (digit < t) break;
        w *= base - t;
      }
      var len = out.length + 1, delta = i - oldi;
      delta = oldi === 0 ? Math.floor(delta / damp) : delta >> 1;
      delta += Math.floor(delta / len);
      var kk = 0;
      while (delta > ((base - tMin) * tMax) >> 1) { delta = Math.floor(delta / (base - tMin)); kk += base; }
      bias = kk + Math.floor(((base - tMin + 1) * delta) / (delta + skew));
      n += Math.floor(i / len); i %= len;
      out.splice(i++, 0, n);
    }
    return String.fromCodePoint.apply(null, out);
  }
  function toUnicode(host) {
    return host.split(".").map(function (label) {
      if (label.toLowerCase().indexOf("xn--") !== 0) return label;
      try { return punyDecode(label.slice(4)); } catch (e) { return label; }
    }).join(".");
  }

  function registrable(host) {
    var labels = host.split(".");
    if (labels.length <= 2) return { domain: host, sub: "", tld: labels[labels.length - 1] || "" };
    var last2 = labels.slice(-2).join("."), take = MULTI_SUFFIX.indexOf(last2) !== -1 ? 3 : 2;
    return { domain: labels.slice(-take).join("."), sub: labels.slice(0, -take).join("."), tld: labels[labels.length - 1] };
  }
  /* Undo common digit-for-letter swaps: paypa1 → paypal, g00gle → google, rnicrosoft → microsoft. */
  function deLook(s) {
    return s.replace(/0/g, "o").replace(/1/g, "l").replace(/3/g, "e").replace(/4/g, "a").replace(/5/g, "s").replace(/7/g, "t").replace(/8/g, "b")
      .replace(/rn/g, "m").replace(/vv/g, "w");
  }
  function isOfficial(domain, list) {
    return list.some(function (d) { return domain === d || domain.endsWith("." + d); });
  }

  function inspect(raw) {
    var input = String(raw || "").trim();
    var res = { ok: false, input: input, findings: [], parts: null, risk: 0, addedScheme: false };
    if (!input) return res;
    var text = input;
    if (!/^[a-z][a-z0-9+.\-]*:/i.test(text) || /^[^/:]+:\d+(\/|$)/.test(text)) { text = "http://" + text; res.addedScheme = true; }
    var url;
    try { url = new URL(text); } catch (e) { return res; }
    var scheme = url.protocol.replace(":", "").toLowerCase();
    var f = res.findings;
    function add(level, key, vars) { f.push({ level: level, key: key, vars: vars || {} }); }

    if (scheme !== "http" && scheme !== "https") {
      res.ok = true;
      res.parts = { scheme: scheme, user: "", host: "", hostUnicode: "", sub: "", domain: "", tld: "", port: "", path: url.pathname, query: url.search, hash: url.hash, params: [] };
      add(scheme === "javascript" || scheme === "data" || scheme === "vbscript" ? "bad" : "warn", "scheme", { scheme: scheme });
      res.risk = scheme === "javascript" || scheme === "data" ? 80 : 30;
      return res;
    }

    var host = url.hostname.toLowerCase().replace(/\.$/, "");
    var isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.charAt(0) === "[";
    var uni = toUnicode(host);
    var reg = isIp ? { domain: host, sub: "", tld: "" } : registrable(host);
    var params = [];
    url.searchParams.forEach(function (v, k) { params.push({ key: k, value: v }); });
    res.ok = true;
    res.parts = {
      scheme: scheme, user: url.username ? decodeURIComponent(url.username) + (url.password ? ":…" : "") : "",
      host: host, hostUnicode: uni, sub: reg.sub, domain: reg.domain, tld: reg.tld, port: url.port,
      path: url.pathname === "/" ? "" : url.pathname, query: url.search, hash: url.hash, params: params
    };

    if (res.addedScheme) add("warn", "noscheme");
    else if (scheme === "https") add("ok", "https");
    else add("bad", "http");

    if (url.username) add("bad", "userinfo", { fake: decodeURIComponent(url.username), host: host });
    if (isIp) add("bad", "ip", { host: host });

    if (uni !== host) {
      var mixed = /[Ͱ-ϿЀ-ӿԀ-ԯ]/.test(uni) && /[a-z]/i.test(uni.replace(/\.[a-z]+$/i, ""));
      var foreign = /[Ͱ-ϿЀ-ӿ]/.test(uni);
      add(mixed || foreign ? "bad" : "warn", mixed ? "mixed" : "puny", { unicode: uni, ascii: host });
    }

    if (!isIp) {
      var flat = host.replace(/^www\./, ""), flatLook = deLook(flat), brandHit = false;
      Object.keys(BRANDS).forEach(function (brand) {
        if (brandHit) return;
        var official = isOfficial(reg.domain, BRANDS[brand]);
        if (official) return;
        var plain = brand.replace(/-/g, "");
        var inRaw = flat.indexOf(brand) !== -1 || flat.replace(/-/g, "").indexOf(plain) !== -1;
        var inLook = flatLook.indexOf(brand) !== -1 || flatLook.replace(/-/g, "").indexOf(plain) !== -1;
        /* very short tokens only count as whole labels, to avoid false alarms */
        if (plain.length <= 4) {
          var labels = flat.split(/[.\-]/);
          inRaw = labels.indexOf(plain) !== -1; inLook = deLook(flat).split(/[.\-]/).indexOf(plain) !== -1;
        }
        if (!inRaw && inLook) { add("bad", "lookalike", { brand: brand, host: host }); brandHit = true; }
        else if (inRaw) { add("bad", "brand", { brand: brand, domain: reg.domain }); brandHit = true; }
      });
      var subCount = reg.sub ? reg.sub.split(".").filter(function (l) { return l !== "www"; }).length : 0;
      if (subCount >= 3) add("warn", "subdomains", { n: subCount, domain: reg.domain });
      else if (subCount >= 1 && /\.(com|net|org|az|ru|gov|edu)(\.|$)/.test(reg.sub + ".")) add("bad", "fakeTld", { sub: reg.sub, domain: reg.domain });
      if (RISKY_TLDS.indexOf(reg.tld) !== -1) add("warn", "tld", { tld: "." + reg.tld });
      if (SHORTENERS.indexOf(reg.domain) !== -1 || SHORTENERS.indexOf(host) !== -1) add("warn", "shortener", { domain: reg.domain });
      if (reg.domain.indexOf("xn--") === -1 && (reg.domain.match(/-/g) || []).length >= 2) add("warn", "hyphens", { domain: reg.domain });
      if (!brandHit) {
        var bait = BAIT_WORDS.filter(function (w) { return host.split(/[.\-]/).indexOf(w) !== -1; });
        if (bait.length) add("warn", "bait", { words: bait.join(", ") });
      }
    }

    if (url.port && ["80", "443"].indexOf(url.port) === -1) add("warn", "port", { port: url.port });

    var redirect = params.filter(function (p) { return /^(https?:)?\/\//i.test(p.value) || /^https?%3a/i.test(p.value); });
    if (redirect.length) add("bad", "redirect", { param: redirect[0].key, target: redirect[0].value.slice(0, 90) });
    var risky = params.filter(function (p) { return RISKY_PARAMS.indexOf(p.key.toLowerCase()) !== -1 && redirect.indexOf(p) === -1; }).map(function (p) { return p.key; });
    var secret = params.filter(function (p) { return SECRET_PARAMS.indexOf(p.key.toLowerCase()) !== -1; }).map(function (p) { return p.key; });
    if (risky.length) add("warn", "params", { names: risky.join(", ") });
    if (secret.length) add("warn", "secrets", { names: secret.join(", ") });
    var blob = params.filter(function (p) { return p.value.length >= 40 && /^[A-Za-z0-9+/=_\-]+$/.test(p.value); });
    if (blob.length) add("warn", "blob", { names: blob.map(function (p) { return p.key; }).join(", ") });

    var ext = (url.pathname.match(/\.([a-z0-9]{2,5})$/i) || [])[1];
    if (ext && EXEC_EXT.indexOf(ext.toLowerCase()) !== -1) add("bad", "file", { ext: "." + ext.toLowerCase() });
    if (/\.(pdf|docx?|xlsx?|jpg|png|txt)\.[a-z0-9]{2,4}$/i.test(url.pathname)) add("bad", "doubleExt");
    if ((input.match(/%[0-9a-f]{2}/gi) || []).length >= 6) add("warn", "encoded");
    if (input.length > 120) add("warn", "long", { n: input.length });

    var bad = f.filter(function (x) { return x.level === "bad"; }).length, warn = f.filter(function (x) { return x.level === "warn"; }).length;
    res.risk = Math.min(100, bad * 35 + warn * 12);
    if (!bad && !warn) add("ok", "clean", { domain: reg.domain });
    return res;
  }

  SS.url = {
    inspect: inspect, toUnicode: toUnicode, registrable: registrable, deLook: deLook, brands: BRANDS, isOfficial: isOfficial,
    /* Pull every link-looking string out of free text. */
    extract: function (text) {
      var found = String(text || "").replace(/[\w.+\-]+@[\w.\-]+/g, " ").match(/\b(?:https?:\/\/|www\.)[^\s<>"'`)\]]+|\b[a-z0-9][a-z0-9\-]*(?:\.[a-z0-9\-]+)+\.?(?:\/[^\s<>"'`)\]]*)?/gi) || [];
      var seen = {}, out = [];
      found.forEach(function (u) {
        u = u.replace(/[.,;:!?]+$/, "");
        if (u.indexOf("@") !== -1 && !/^https?:/i.test(u)) return;
        if (!/^(https?:\/\/|www\.)/i.test(u) && !/\.(com|net|org|az|ru|info|biz|io|co|me|xyz|top|click|link|ly|tk|site|online|shop|live|app|dev|gov|edu|uk|de|tr)(\/|$)/i.test(u)) return;
        var key = u.toLowerCase();
        if (!seen[key]) { seen[key] = 1; out.push(u); }
      });
      return out;
    }
  };

  SS.addStrings({
    en: {
      "url.https": "Encrypted connection (HTTPS)", "url.https.d": "Traffic is encrypted. This does not prove the site is honest — phishing sites use HTTPS too.",
      "url.http": "Unencrypted HTTP", "url.http.d": "Anything you type on this page can be read or changed on the way. Never enter a password or card number here.",
      "url.noscheme": "No scheme given", "url.noscheme.d": "The link has no https:// prefix, so the browser decides how to connect. Check that the site upgrades to HTTPS.",
      "url.scheme": "Unusual scheme", "url.scheme.d": "This is a “{scheme}:” link, not a normal web address. Such links can run code or open other apps.",
      "url.userinfo": "Hidden destination with “@”", "url.userinfo.d": "Everything before “@” ({fake}) is ignored by the browser. The real destination is {host}.",
      "url.ip": "IP address instead of a name", "url.ip.d": "Legitimate services use domain names. A bare address such as {host} hides who runs the site.",
      "url.puny": "Internationalised domain (punycode)", "url.puny.d": "The browser sends “{ascii}” but may display “{unicode}”. Compare each letter with the address you expect.",
      "url.mixed": "Lookalike characters (homograph attack)", "url.mixed.d": "“{unicode}” contains letters from another alphabet that look like Latin ones. The real name is {ascii}.",
      "url.lookalike": "Digits standing in for letters", "url.lookalike.d": "{host} imitates “{brand}” by swapping similar-looking characters.",
      "url.brand": "Brand name on someone else’s domain", "url.brand.d": "The link mentions “{brand}”, but the site actually belongs to {domain}.",
      "url.subdomains": "Many subdomains", "url.subdomains.d": "{n} subdomain levels sit in front of the real domain {domain}. Attackers pad links like this to push the real name out of view.",
      "url.fakeTld": "Subdomain pretending to be a domain", "url.fakeTld.d": "“{sub}” looks like a full address, but it is only a subdomain. The site belongs to {domain}.",
      "url.tld": "Top-level domain often used in abuse", "url.tld.d": "{tld} domains are cheap or free and appear in many phishing campaigns. Be extra careful.",
      "url.shortener": "Link shortener", "url.shortener.d": "{domain} hides the final destination. Expand the link with a preview service before opening it.",
      "url.hyphens": "Several hyphens in the domain", "url.hyphens.d": "{domain} strings words together with hyphens, a common pattern in fake login pages.",
      "url.bait": "Security-themed words in the address", "url.bait.d": "Words such as {words} in a hostname are used to make a link feel official.",
      "url.port": "Non-standard port", "url.port.d": "Port {port} is unusual for a public website.",
      "url.redirect": "Redirects to another address", "url.redirect.d": "The parameter “{param}” carries a second link ({target}). You may land somewhere other than the site shown.",
      "url.params": "Redirect-style parameters", "url.params.d": "Parameters such as {names} are often used to bounce visitors to another site.",
      "url.secrets": "Sensitive data in the address", "url.secrets.d": "Parameters such as {names} put personal data in the URL, where it is logged and shared.",
      "url.blob": "Long encoded value", "url.blob.d": "The value of {names} is a long encoded string, often a tracking ID or a hidden address.",
      "url.file": "Points to an executable file", "url.file.d": "The link downloads a {ext} file, which can run code on your device.",
      "url.doubleExt": "Double file extension", "url.doubleExt.d": "The file name pretends to be a document but ends with another extension.",
      "url.encoded": "Heavy percent-encoding", "url.encoded.d": "Many %XX sequences can hide the real text of the address.",
      "url.long": "Very long address", "url.long.d": "{n} characters. Long links can hide the important part off-screen.",
      "url.clean": "No warning signs found", "url.clean.d": "Nothing unusual in the structure. Still confirm that {domain} is the site you meant to visit."
    },
    az: {
      "url.https": "Şifrələnmiş bağlantı (HTTPS)", "url.https.d": "Trafik şifrələnir. Bu, saytın etibarlı olduğunu sübut etmir — fişinq saytları da HTTPS istifadə edir.",
      "url.http": "Şifrələnməmiş HTTP", "url.http.d": "Bu səhifədə yazdığınız hər şey yolda oxuna və ya dəyişdirilə bilər. Burada heç vaxt parol və ya kart nömrəsi daxil etməyin.",
      "url.noscheme": "Sxem göstərilməyib", "url.noscheme.d": "Keçiddə https:// prefiksi yoxdur, bağlantı növünü brauzer seçir. Saytın HTTPS-ə keçdiyini yoxlayın.",
      "url.scheme": "Qeyri-adi sxem", "url.scheme.d": "Bu, adi veb ünvan deyil, “{scheme}:” keçididir. Belə keçidlər kod işlədə və ya başqa tətbiqləri aça bilər.",
      "url.userinfo": "“@” ilə gizlədilmiş ünvan", "url.userinfo.d": "“@” işarəsindən əvvəlki hissə ({fake}) brauzer tərəfindən nəzərə alınmır. Əsl ünvan: {host}.",
      "url.ip": "Ad əvəzinə IP ünvan", "url.ip.d": "Rəsmi xidmətlər domen adlarından istifadə edir. {host} kimi çılpaq ünvan saytın sahibini gizlədir.",
      "url.puny": "Beynəlxalq domen (punycode)", "url.puny.d": "Brauzer “{ascii}” göndərir, amma “{unicode}” göstərə bilər. Hər hərfi gözlədiyiniz ünvanla müqayisə edin.",
      "url.mixed": "Oxşar simvollar (homoqraf hücumu)", "url.mixed.d": "“{unicode}” ünvanında latın hərflərinə bənzəyən başqa əlifba hərfləri var. Əsl ad: {ascii}.",
      "url.lookalike": "Hərflərin yerinə rəqəmlər", "url.lookalike.d": "{host} oxşar simvolları dəyişərək “{brand}” adını təqlid edir.",
      "url.brand": "Brend adı başqasının domenində", "url.brand.d": "Keçiddə “{brand}” adı var, amma sayt əslində {domain} domeninə məxsusdur.",
      "url.subdomains": "Çoxlu subdomen", "url.subdomains.d": "Əsl domen {domain} qarşısında {n} subdomen səviyyəsi var. Hücumçular əsl adı gözdən yayındırmaq üçün keçidi belə uzadır.",
      "url.fakeTld": "Domenə bənzədilmiş subdomen", "url.fakeTld.d": "“{sub}” tam ünvana bənzəyir, amma sadəcə subdomendir. Sayt {domain} domeninə məxsusdur.",
      "url.tld": "Sui-istifadədə tez-tez rast gəlinən domen zonası", "url.tld.d": "{tld} domenləri ucuz və ya pulsuzdur və çoxlu fişinq kampaniyalarında istifadə olunur. Xüsusilə diqqətli olun.",
      "url.shortener": "Keçid qısaldıcısı", "url.shortener.d": "{domain} son ünvanı gizlədir. Açmazdan əvvəl keçidi önbaxış xidməti ilə genişləndirin.",
      "url.hyphens": "Domendə bir neçə tire", "url.hyphens.d": "{domain} sözləri tire ilə birləşdirir — saxta giriş səhifələrində tez-tez rast gəlinən üsuldur.",
      "url.bait": "Ünvanda təhlükəsizlik mövzulu sözlər", "url.bait.d": "Host adındakı {words} kimi sözlər keçidi rəsmi göstərmək üçün istifadə olunur.",
      "url.port": "Qeyri-standart port", "url.port.d": "{port} portu açıq veb-sayt üçün qeyri-adidir.",
      "url.redirect": "Başqa ünvana yönləndirir", "url.redirect.d": "“{param}” parametri ikinci keçid daşıyır ({target}). Göstərilən saytdan fərqli yerə düşə bilərsiniz.",
      "url.params": "Yönləndirmə tipli parametrlər", "url.params.d": "{names} kimi parametrlər çox vaxt ziyarətçini başqa sayta ötürmək üçün istifadə olunur.",
      "url.secrets": "Ünvanda həssas məlumat", "url.secrets.d": "{names} kimi parametrlər şəxsi məlumatı URL-ə yazır; orada o, jurnallara düşür və paylaşılır.",
      "url.blob": "Uzun kodlaşdırılmış dəyər", "url.blob.d": "{names} parametrinin dəyəri uzun kodlaşdırılmış sətirdir — adətən izləmə identifikatoru və ya gizli ünvan.",
      "url.file": "İcra olunan fayla aparır", "url.file.d": "Keçid cihazınızda kod işlədə bilən {ext} faylı yükləyir.",
      "url.doubleExt": "İkiqat fayl uzantısı", "url.doubleExt.d": "Fayl adı sənədə bənzəyir, amma başqa uzantı ilə bitir.",
      "url.encoded": "Həddən artıq faiz-kodlaşdırma", "url.encoded.d": "Çoxlu %XX ardıcıllığı ünvanın əsl mətnini gizlədə bilər.",
      "url.long": "Çox uzun ünvan", "url.long.d": "{n} simvol. Uzun keçidlər vacib hissəni ekrandan kənarda gizlədə bilər.",
      "url.clean": "Xəbərdarlıq əlaməti tapılmadı", "url.clean.d": "Quruluşda qeyri-adi heç nə yoxdur. Yenə də {domain} ünvanının istədiyiniz sayt olduğunu yoxlayın."
    }
  });
})();
