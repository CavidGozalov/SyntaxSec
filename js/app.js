/* SyntaxSec — shared shell: navigation, footer, helpers and the data layer.
   Load order on every page: supabase.js → i18n.js → auth.js → app.js → script.js → page script. */
(function () {
  "use strict";
  var SS = (window.SS = window.SS || {});
  var sb = window._supabase;
  var page = document.body.getAttribute("data-page") || "";

  /* ------------------------------------------------------------------ helpers */
  SS.$ = function (sel, root) { return (root || document).querySelector(sel); };
  SS.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  SS.esc = function (value) {
    return String(value === null || value === undefined ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  SS.slug = function (text) {
    var map = { "ə": "e", "ö": "o", "ğ": "g", "ş": "s", "ç": "c", "ü": "u", "ı": "i", "i̇": "i" };
    return String(text || "").toLocaleLowerCase("az")
      .replace(/[əöğşçüı]|i̇/g, function (c) { return map[c] || c; })
      .normalize("NFKD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  };
  SS.isUuid = function (s) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(s)); };
  SS.debounce = function (fn, ms) {
    var timer; return function () { var a = arguments, self = this; clearTimeout(timer); timer = setTimeout(function () { fn.apply(self, a); }, ms); };
  };

  SS.toast = function (message, kind) {
    var host = document.getElementById("toasts");
    if (!host) { host = document.createElement("div"); host.id = "toasts"; host.setAttribute("aria-live", "polite"); document.body.appendChild(host); }
    var el = document.createElement("div");
    el.className = "toast" + (kind ? " " + kind : "");
    el.textContent = message;
    host.appendChild(el);
    setTimeout(function () { el.classList.add("out"); setTimeout(function () { el.remove(); }, 320); }, 3200);
  };

  SS.copy = async function (text) {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else {
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
      }
      SS.toast(SS.t("common.copied"), "ok");
    } catch (e) { SS.toast(SS.t("common.copyFail"), "bad"); }
  };

  SS.download = function (filename, text, mime) {
    var blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
  };

  /* Small, safe Markdown renderer for term and blog content.
     Supports: # / ## / ### headings, - and 1. lists, > quotes, ``` code fences,
     **bold**, *italic*, `code` and [links](https://…). Everything is escaped first. */
  SS.md = function (source) {
    var lines = String(source || "").replace(/\r\n?/g, "\n").split("\n");
    var html = [], para = [], list = null, quote = [], code = null;
    function inline(text) {
      var s = SS.esc(text);
      s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
      s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
      s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
      return s;
    }
    function flush() {
      if (para.length) { html.push("<p>" + inline(para.join(" ")) + "</p>"); para = []; }
      if (list) { html.push("<" + list.tag + ">" + list.items.map(function (i) { return "<li>" + inline(i) + "</li>"; }).join("") + "</" + list.tag + ">"); list = null; }
      if (quote.length) { html.push("<blockquote>" + inline(quote.join(" ")) + "</blockquote>"); quote = []; }
    }
    lines.forEach(function (line) {
      if (code !== null) {
        if (/^```/.test(line)) { html.push("<pre><code>" + SS.esc(code.join("\n")) + "</code></pre>"); code = null; }
        else code.push(line);
        return;
      }
      var m;
      if (/^```/.test(line)) { flush(); code = []; }
      else if (!line.trim()) flush();
      else if ((m = line.match(/^(#{1,3})\s+(.*)$/))) { flush(); var level = m[1].length + 1; html.push("<h" + level + ">" + inline(m[2]) + "</h" + level + ">"); }
      else if ((m = line.match(/^\s*[-*]\s+(.*)$/))) { if (!list || list.tag !== "ul") { flush(); list = { tag: "ul", items: [] }; } list.items.push(m[1]); }
      else if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) { if (!list || list.tag !== "ol") { flush(); list = { tag: "ol", items: [] }; } list.items.push(m[1]); }
      else if ((m = line.match(/^>\s?(.*)$/))) { if (!quote.length) flush(); quote.push(m[1]); }
      else { if (list || quote.length) flush(); para.push(line.trim()); }
    });
    if (code !== null) html.push("<pre><code>" + SS.esc(code.join("\n")) + "</code></pre>");
    flush();
    return html.join("\n");
  };

  /* ------------------------------------------------------------------ data layer */
  var LOCAL_PROGRESS = "ss-progress";
  SS.db = {
    offline: false,
    _content: null,
    _progress: null,
    _seed: null,

    seed: function () {
      if (!this._seed) {
        this._seed = fetch("data/glossary.json").then(function (r) { return r.json(); }).then(function (seed) {
          return {
            topics: (seed.topics || []).map(function (t, i) { return Object.assign({ sort_order: i }, t, { id: t.slug }); }),
            terms: (seed.terms || []).map(function (x) { return Object.assign({}, x, { id: x.slug, topic_id: x.topic }); })
          };
        });
      }
      return this._seed;
    },

    /* Topics plus lightweight term rows (no long content). */
    content: function () {
      var self = this;
      if (!this._content) {
        this._content = (async function () {
          try {
            if (!sb) throw new Error("no client");
            var res = await Promise.all([
              sb.from("topics").select("*").order("sort_order", { ascending: true }).order("name_en", { ascending: true }),
              sb.from("terms").select("id, slug, topic_id, term_en, term_az, summary_en, summary_az").order("term_en", { ascending: true })
            ]);
            if (res[0].error) throw res[0].error;
            if (res[1].error) throw res[1].error;
            return { topics: res[0].data || [], terms: res[1].data || [] };
          } catch (err) {
            console.warn("[SyntaxSec] Using bundled sample content:", err && err.message);
            self.offline = true;
            try {
              var seed = await self.seed();
              return { topics: seed.topics, terms: seed.terms };
            } catch (e) { return { topics: [], terms: [] }; }
          }
        })();
      }
      return this._content;
    },
    invalidate: function () { this._content = null; this._progress = null; },

    /* Full term row by uuid or slug. */
    term: async function (idOrSlug) {
      await this.content();
      if (this.offline) {
        var seed = await this.seed();
        return seed.terms.find(function (t) { return t.id === idOrSlug || t.slug === idOrSlug; }) || null;
      }
      var q = sb.from("terms").select("*");
      q = SS.isUuid(idOrSlug) ? q.eq("id", idOrSlug) : q.eq("slug", idOrSlug);
      var res = await q.maybeSingle();
      if (res.error) throw res.error;
      return res.data;
    },

    useLocalProgress: function () { return this.offline || !sb || !SS.auth.user; },

    /* Map: term_id → { bookmarked, mastered } */
    progress: function () {
      var self = this;
      if (!this._progress) {
        this._progress = (async function () {
          await SS.auth.ready; await self.content();
          var map = new Map();
          if (self.useLocalProgress()) {
            try {
              var raw = JSON.parse(localStorage.getItem(LOCAL_PROGRESS) || "{}");
              Object.keys(raw).forEach(function (k) { map.set(k, raw[k]); });
            } catch (e) {}
            return map;
          }
          var res = await sb.from("user_progress").select("term_id, bookmarked, mastered").eq("user_id", SS.auth.user.id);
          if (!res.error) (res.data || []).forEach(function (r) { map.set(r.term_id, { bookmarked: !!r.bookmarked, mastered: !!r.mastered }); });
          return map;
        })();
      }
      return this._progress;
    },

    setProgress: async function (termId, patch) {
      var map = await this.progress();
      var current = Object.assign({ bookmarked: false, mastered: false }, map.get(termId) || {}, patch);
      if (this.useLocalProgress()) {
        map.set(termId, current);
        var plain = {}; map.forEach(function (v, k) { if (v.bookmarked || v.mastered) plain[k] = v; });
        try { localStorage.setItem(LOCAL_PROGRESS, JSON.stringify(plain)); } catch (e) {}
        return current;
      }
      var res = await sb.from("user_progress").upsert({
        user_id: SS.auth.user.id, term_id: termId,
        bookmarked: current.bookmarked, mastered: current.mastered, updated_at: new Date().toISOString()
      }, { onConflict: "user_id,term_id" });
      if (res.error) throw res.error;
      map.set(termId, current);
      return current;
    }
  };

  /* Toggle bookmark / mastered with feedback; returns the new state or null on failure. */
  SS.toggleProgress = async function (termId, field) {
    try {
      var map = await SS.db.progress();
      var now = !((map.get(termId) || {})[field]);
      var patch = {}; patch[field] = now;
      var state = await SS.db.setProgress(termId, patch);
      var key = field === "bookmarked" ? (now ? "common.savedBookmark" : "common.removedBookmark") : (now ? "common.savedMastered" : "common.removedMastered");
      SS.toast(SS.t(key), "ok");
      return state;
    } catch (e) {
      console.error(e); SS.toast(SS.t("common.saveFail"), "bad"); return null;
    }
  };

  /* Learning roadmaps: topics join a track through topics.track. */
  SS.TRACKS = [
    { id: "digital-hygiene", emoji: "🧼", tint: "", level: "beginner" },
    { id: "web-security", emoji: "🌐", tint: "t-mint", level: "intermediate" },
    { id: "network-defense", emoji: "🛡️", tint: "t-sun", level: "advanced" }
  ];
  SS.addStrings({
    en: {
      "track.digital-hygiene": "Digital Hygiene 101", "track.digital-hygiene.d": "Passwords, multi-factor authentication, phishing and everyday habits that stop most attacks.",
      "track.web-security": "Web Security Basics", "track.web-security.d": "How websites get attacked — injection, scripting, forged requests — and the cryptography that protects them.",
      "track.network-defense": "Network Defense", "track.network-defense.d": "Firewalls, VPNs, traffic interception and denial-of-service: how networks are attacked and defended.",
      "level.beginner": "Beginner", "level.intermediate": "Intermediate", "level.advanced": "Advanced"
    },
    az: {
      "track.digital-hygiene": "Rəqəmsal Gigiyena 101", "track.digital-hygiene.d": "Parollar, çoxfaktorlu autentifikasiya, fişinq və əksər hücumların qarşısını alan gündəlik vərdişlər.",
      "track.web-security": "Veb Təhlükəsizliyinin Əsasları", "track.web-security.d": "Saytlara necə hücum edilir — inyeksiya, skriptlər, saxta sorğular — və onları qoruyan kriptoqrafiya.",
      "track.network-defense": "Şəbəkə Müdafiəsi", "track.network-defense.d": "Faervollar, VPN, trafikin ələ keçirilməsi və xidmətdən imtina hücumları: şəbəkələrə necə hücum edilir və necə qorunur.",
      "level.beginner": "Başlanğıc", "level.intermediate": "Orta", "level.advanced": "İrəli səviyyə"
    }
  });

  /* Avatar markup: the chosen preset (assets/avatars/<key>.svg) or the name's initial. */
  SS.avatarHtml = function (key, name, extraClass) {
    var cls = "avatar" + (extraClass ? " " + extraClass : "");
    if (key && SS.AVATAR_KEYS.indexOf(key) !== -1) {
      return '<span class="' + cls + ' has-img" aria-hidden="true"><img src="assets/avatars/' + key + '.svg" alt="" width="64" height="64"></span>';
    }
    return '<span class="' + cls + '" aria-hidden="true">' + SS.esc(String(name || "?").charAt(0).toLocaleUpperCase()) + "</span>";
  };

  /* ------------------------------------------------------------------ shell */
  var LINKS = [
    { href: "dashboard.html", key: "nav.home", page: "dashboard" },
    { href: "modules.html", key: "nav.learn", page: "learn", also: ["term"] },
    { href: "roadmaps.html", key: "nav.roadmaps", page: "roadmaps" },
    { key: "nav.tools", pages: ["password", "phishing", "tools"], menu: [
      { href: "password-checker.html", key: "nav.password", ico: "🔑", page: "password" },
      { href: "phishing-checker.html", key: "nav.phishing", ico: "🎣", page: "phishing" },
      { href: "tools.html#link", key: "nav.link", ico: "🔗" },
      { href: "tools.html#hash", key: "nav.hash", ico: "🧪" },
      { href: "tools.html#totp", key: "nav.totp", ico: "📱" },
      { href: "tools.html", key: "nav.alltools", ico: "🧰", page: "tools" }
    ] },
    { href: "daily.html", key: "nav.daily", page: "daily" },
    { href: "quiz.html", key: "nav.quiz", page: "quiz" },
    { href: "blog.html", key: "nav.blog", page: "blog" }
  ];

  function linkHtml(l) {
    if (l.menu) {
      var current = l.pages.indexOf(page) !== -1;
      return '<div class="nav-drop' + (current ? " current" : "") + '"><button type="button" aria-haspopup="true" aria-expanded="false"><span data-i18n="' + l.key + '"></span></button>' +
        '<div class="nav-menu" role="menu">' + l.menu.map(function (m) {
          return '<a role="menuitem" href="' + m.href + '"' + (m.page === page ? ' aria-current="page"' : "") + '><span class="ico" aria-hidden="true">' + m.ico + '</span><span data-i18n="' + m.key + '"></span></a>';
        }).join("") + "</div></div>";
    }
    var on = l.page === page || (l.also && l.also.indexOf(page) !== -1);
    return '<a class="nav-link" href="' + l.href + '"' + (on ? ' aria-current="page"' : "") + ' data-i18n="' + l.key + '"></a>';
  }

  var nav = document.createElement("header");
  nav.className = "nav no-print";
  function renderNav() {
    var user = SS.auth.user;
    var inner = page !== "home" && (user || !SS.REQUIRE_LOGIN);
    var links = inner ? LINKS.map(linkHtml).join("") : "";
    /* On phones the account chip is hidden, so the menu carries the profile link. */
    if (inner && user) links += '<a class="nav-link show-xs" href="profile.html"' + (page === "profile" ? ' aria-current="page"' : "") + ' data-i18n="nav.profile"></a>';
    if (inner && SS.auth.isAdmin()) links += '<a class="nav-link" href="admin.html"' + (page === "admin" ? ' aria-current="page"' : "") + ' data-i18n="nav.admin"></a>';
    var account;
    if (user) {
      var name = SS.auth.displayName(), title = SS.auth.title();
      account = '<a class="user-chip" href="profile.html"' + (page === "profile" ? ' aria-current="page"' : "") + ' title="' + SS.esc(SS.t("nav.account", { name: name })) + '" aria-label="' + SS.esc(SS.t("nav.profileOf", { name: name })) + '">' +
        SS.avatarHtml(SS.auth.avatarKey(), name) + '<span class="who"><span class="name">' + SS.esc(name) + "</span>" +
        (title ? '<span class="title">' + SS.esc(SS.L(title, "name")) + "</span>" : "") + "</span></a>" +
        '<button class="btn ghost sm" type="button" id="logout-btn" data-i18n="nav.logout"></button>';
    } else if (page === "home") {
      account = '<button class="btn ghost sm hide-xs" type="button" data-open-auth="login" data-i18n="nav.login"></button>' +
        '<button class="btn sm" type="button" data-open-auth="register" data-i18n="nav.start"></button>';
    } else {
      account = '<a class="btn sm" href="index.html?auth=login" data-i18n="nav.login"></a>';
    }
    nav.innerHTML = '<div class="wrap">' +
      '<a class="brand" href="' + (user ? "dashboard.html" : "index.html") + '"><img src="assets/icons/logo.svg" alt="" width="30" height="30">SyntaxSec</a>' +
      '<nav class="nav-links" aria-label="Main">' + links + "</nav>" +
      '<div class="nav-tools">' +
        '<button class="icon-btn" id="lang-toggle" type="button" data-i18n-aria="nav.lang"></button>' +
        '<button class="icon-btn" id="theme-toggle" type="button" data-i18n-aria="nav.theme"><span class="glyph" aria-hidden="true"></span></button>' +
        account +
        (links ? '<button class="icon-btn nav-burger" id="nav-burger" type="button" data-i18n-aria="nav.menu" aria-expanded="false">☰</button>' : "") +
      "</div></div>";
    SS.applyI18n(nav);
    paintLang();
    if (SS.paintTheme) SS.paintTheme();
  }
  /* Only one label is visible: the language you would switch TO. */
  function paintLang() {
    var b = document.getElementById("lang-toggle");
    if (b) b.textContent = SS.lang === "az" ? "ENG" : "AZ";
  }
  document.body.prepend(nav);
  renderNav();
  SS.renderNav = renderNav;

  var foot = document.createElement("footer");
  foot.className = "foot no-print";
  foot.innerHTML = '<div class="wrap"><span data-i18n="foot.note"></span><span><span data-i18n="foot.made"></span> · © ' + new Date().getFullYear() + " SyntaxSec</span></div>";
  document.body.appendChild(foot);

  nav.addEventListener("click", function (e) {
    if (e.target.closest("#lang-toggle")) { SS.toggleLang(); return; }
    if (e.target.closest("#logout-btn")) { SS.auth.signOut(); return; }
    var burger = e.target.closest("#nav-burger");
    if (burger) { var open = nav.classList.toggle("menu-open"); burger.setAttribute("aria-expanded", String(open)); return; }
    var dropBtn = e.target.closest(".nav-drop > button");
    if (dropBtn) {
      var drop = dropBtn.parentElement, isOpen = drop.classList.toggle("open");
      dropBtn.setAttribute("aria-expanded", String(isOpen));
      return;
    }
    if (e.target.closest(".nav-menu a, .nav-link")) nav.classList.remove("menu-open");
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-drop")) SS.$$(".nav-drop.open", nav).forEach(function (d) { d.classList.remove("open"); d.firstElementChild.setAttribute("aria-expanded", "false"); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") SS.$$(".nav-drop.open", nav).forEach(function (d) { d.classList.remove("open"); });
  });
  document.addEventListener("langchange", function () { renderNav(); });

  SS.auth.ready.then(function () {
    renderNav();
    try {
      var flash = sessionStorage.getItem("ss-flash");
      if (flash) { sessionStorage.removeItem("ss-flash"); SS.toast(SS.t(flash), flash === "auth.loggedOut" ? "ok" : "bad"); }
    } catch (e) {}
  });

  /* Print buttons */
  document.addEventListener("click", function (e) { if (e.target.closest("[data-print]")) window.print(); });

  /* Translate the static page once every script has registered its strings. */
  document.addEventListener("DOMContentLoaded", function () { SS.applyI18n(); paintLang(); });
})();
