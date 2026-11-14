/* SyntaxSec — authentication (Supabase Auth + public.profiles).
   Each page declares its access level on <body data-access="public|user|admin">.
   SS.auth.ready resolves once the session and profile are known. */
(function () {
  "use strict";
  var SS = (window.SS = window.SS || {});
  var sb = window._supabase;

  /* Set to false to let logged-out visitors browse the tools and Learn hub
     (dashboard progress and admin still need an account). */
  SS.REQUIRE_LOGIN = true;

  var HOME = "dashboard.html";
  var GATE = "index.html";
  var access = (document.body && document.body.getAttribute("data-access")) || "public";
  var page = (document.body && document.body.getAttribute("data-page")) || "";

  function reveal() { document.documentElement.classList.remove("auth-pending"); }
  /* Never leave the page hidden if the network stalls. */
  var failsafe = setTimeout(reveal, 6000);

  function flash(key) { try { sessionStorage.setItem("ss-flash", key); } catch (e) {} }

  function safeNext() {
    var next = new URLSearchParams(location.search).get("next");
    if (next && /^[a-z0-9-]+\.html([?#][^\s]*)?$/i.test(next)) return next;
    return HOME;
  }

  var auth = (SS.auth = {
    user: null,
    profile: null,
    isAdmin: function () { return !!(auth.profile && auth.profile.role === "admin"); },
    displayName: function () {
      if (auth.profile && auth.profile.username) return auth.profile.username;
      if (auth.user && auth.user.user_metadata && auth.user.user_metadata.username) return auth.user.user_metadata.username;
      return auth.user && auth.user.email ? auth.user.email.split("@")[0] : "";
    },

    loadProfile: async function () {
      if (!sb || !auth.user) { auth.profile = null; return null; }
      try {
        var res = await sb.from("profiles").select("id, username, email, role, created_at").eq("id", auth.user.id).maybeSingle();
        auth.profile = res.error ? null : res.data;
      } catch (e) { auth.profile = null; }
      return auth.profile;
    },

    signIn: async function (email, password) {
      if (!sb) throw new Error("offline");
      var res = await sb.auth.signInWithPassword({ email: email, password: password });
      if (res.error) throw res.error;
      auth.user = res.data.user;
      return res.data;
    },

    signUp: async function (username, email, password) {
      if (!sb) throw new Error("offline");
      /* Friendly pre-check; the database enforces uniqueness as well. */
      try {
        var free = await sb.rpc("username_available", { p_username: username });
        if (!free.error && free.data === false) { var taken = new Error("username_taken"); taken.code = "username_taken"; throw taken; }
      } catch (e) { if (e.code === "username_taken") throw e; }
      var redirect = location.origin + location.pathname.replace(/[^/]*$/, "") + GATE;
      var res = await sb.auth.signUp({
        email: email,
        password: password,
        options: { data: { username: username }, emailRedirectTo: redirect }
      });
      if (res.error) throw res.error;
      /* Supabase returns an empty identities array when the email is already registered. */
      if (res.data.user && Array.isArray(res.data.user.identities) && res.data.user.identities.length === 0) {
        var exists = new Error("User already registered"); throw exists;
      }
      return res.data; /* data.session is null when email confirmation is required */
    },

    signOut: async function () {
      try { if (sb) await sb.auth.signOut(); } catch (e) {}
      auth.user = null; auth.profile = null;
      flash("auth.loggedOut");
      location.href = GATE;
    },

    errorKey: function (err) {
      var msg = (err && (err.message || err.error_description)) || "";
      var code = (err && err.code) || "";
      if (msg === "offline" || /failed to fetch|networkerror|load failed/i.test(msg)) return ["auth.errOffline"];
      if (code === "username_taken" || /profiles_username|duplicate key/i.test(msg)) return ["auth.errUsernameTaken"];
      if (/invalid login credentials/i.test(msg)) return ["auth.errInvalid"];
      if (/email not confirmed/i.test(msg)) return ["auth.errNotConfirmed"];
      if (/already registered|already been registered|user_already_exists/i.test(msg + code)) return ["auth.errExists"];
      if (/password should be|weak_password/i.test(msg + code)) return ["auth.errWeak"];
      if (/rate limit|too many|security purposes/i.test(msg)) return ["auth.errRate"];
      if (/invalid.*email|email.*invalid|validate email/i.test(msg)) return ["auth.errEmail"];
      if (/database error saving new user/i.test(msg)) return ["auth.errUsernameTaken"];
      return ["auth.errGeneric", { msg: msg || "unknown" }];
    }
  });

  auth.ready = (async function () {
    try {
      if (sb) {
        var res = await sb.auth.getSession();
        auth.user = res.data && res.data.session ? res.data.session.user : null;
        if (auth.user) await auth.loadProfile();
      }
    } catch (e) { console.warn("[SyntaxSec] session check failed", e); }

    var here = location.pathname.split("/").pop() || GATE;
    if (page === "home" && auth.user) { location.replace(safeNext()); return auth; }
    if (access === "admin" && !auth.isAdmin()) {
      flash(auth.user ? "auth.adminOnly" : "auth.needLogin");
      location.replace(auth.user ? HOME : GATE + "?next=" + encodeURIComponent(here));
      return auth;
    }
    if (access === "user" && !auth.user && SS.REQUIRE_LOGIN) {
      flash("auth.needLogin");
      location.replace(GATE + "?next=" + encodeURIComponent(here + location.search + location.hash));
      return auth;
    }
    clearTimeout(failsafe);
    reveal();
    return auth;
  })();

  if (sb) {
    sb.auth.onAuthStateChange(function (event) {
      if (event === "SIGNED_OUT" && access !== "public") location.href = GATE;
    });
  }

  /* ---------- Login / Register modal (index.html) ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var modal = document.getElementById("auth-modal");
    if (!modal) return;
    var mode = "register";
    var form = document.getElementById("auth-form");
    var msg = document.getElementById("auth-msg");
    var userField = document.getElementById("auth-username-field");
    var submit = document.getElementById("auth-submit");

    function setMode(next) {
      mode = next === "login" ? "login" : "register";
      modal.querySelectorAll("[data-auth-tab]").forEach(function (t) {
        t.setAttribute("aria-selected", String(t.getAttribute("data-auth-tab") === mode));
      });
      userField.hidden = mode === "login";
      document.getElementById("auth-username").required = mode === "register";
      document.getElementById("auth-title").setAttribute("data-i18n", mode === "login" ? "auth.loginTitle" : "auth.registerTitle");
      document.getElementById("auth-sub").setAttribute("data-i18n", mode === "login" ? "auth.loginSub" : "auth.registerSub");
      submit.setAttribute("data-i18n", mode === "login" ? "auth.submitLogin" : "auth.submitRegister");
      document.getElementById("auth-password").setAttribute("autocomplete", mode === "login" ? "current-password" : "new-password");
      document.getElementById("auth-pw-hint").hidden = mode === "login";
      say("");
      SS.applyI18n(modal);
    }
    function say(text, kind) { msg.textContent = text; msg.className = "form-msg" + (kind ? " " + kind : ""); }

    SS.openAuth = function (next) {
      setMode(next || "register");
      modal.classList.add("open");
      setTimeout(function () { document.getElementById(mode === "login" ? "auth-email" : "auth-username").focus(); }, 60);
    };
    function close() { modal.classList.remove("open"); }

    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-close]")) close();
      var tab = e.target.closest("[data-auth-tab]");
      if (tab) setMode(tab.getAttribute("data-auth-tab"));
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    document.addEventListener("click", function (e) {
      var opener = e.target.closest("[data-open-auth]");
      if (opener) { e.preventDefault(); SS.openAuth(opener.getAttribute("data-open-auth")); }
    });

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var username = document.getElementById("auth-username").value.trim();
      var email = document.getElementById("auth-email").value.trim();
      var password = document.getElementById("auth-password").value;
      if (mode === "register" && !/^[A-Za-z0-9._\-ƏəÖöĞğŞşÇçÜüİı]{3,24}$/.test(username)) return say(SS.t("auth.errUsernameFormat"), "bad");
      if (mode === "register" && password.length < 8) return say(SS.t("auth.errWeak"), "bad");
      submit.disabled = true; say(SS.t("auth.working"));
      try {
        if (mode === "login") {
          await auth.signIn(email, password);
          location.href = safeNext();
        } else {
          var data = await auth.signUp(username, email, password);
          if (data.session) location.href = safeNext();
          else { say(SS.t("auth.confirmSent", { email: email }), "ok"); form.reset(); }
        }
      } catch (err) {
        var k = auth.errorKey(err);
        say(SS.t(k[0], k[1]), "bad");
        modal.querySelector(".modal-box").classList.remove("shake");
        void modal.offsetWidth;
        modal.querySelector(".modal-box").classList.add("shake");
      } finally { submit.disabled = false; }
    });

    var params = new URLSearchParams(location.search);
    if (params.get("next") || params.get("auth")) SS.openAuth(params.get("auth") === "register" ? "register" : "login");
  });
})();
