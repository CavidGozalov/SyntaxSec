/* SyntaxSec — blog.html: bilingual posts from Supabase (public.blogs), tag filters,
   a single-post view with reactions, comments and a print / PDF layout. */
(function () {
  "use strict";
  var SS = window.SS;
  var sb = window._supabase;
  SS.addStrings({
    en: {
      "blog.title": "Blog", "blog.h1": "Security blog", "blog.lead": "Short reads for students. Filter by topic, open a post, print it as a study sheet.",
      "blog.filter": "Filter by topic", "blog.read": "Read the post", "blog.empty": "No posts yet. The administrator can publish posts from the Admin page.",
      "blog.back": "All posts", "blog.notFound": "This post could not be found.", "blog.general": "General",
      "blog.like": "Helpful", "blog.dislike": "Not helpful", "blog.comments": "Comments", "blog.noComments": "No comments yet. Be the first to add one.",
      "blog.commentPh": "Write a comment…", "blog.post": "Post comment", "blog.posted": "Comment posted", "blog.commentFail": "Could not post the comment.",
      "blog.deleteComment": "Delete comment", "blog.commentDeleted": "Comment deleted", "blog.reactFail": "Could not save your reaction.",
      "blog.offlineSocial": "Comments and reactions are available once the database is connected.", "blog.by": "By {name}"
    },
    az: {
      "blog.title": "Bloq", "blog.h1": "Təhlükəsizlik bloqu", "blog.lead": "Tələbələr üçün qısa yazılar. Mövzuya görə süz, yazını aç və dərs vərəqi kimi çap et.",
      "blog.filter": "Mövzuya görə süz", "blog.read": "Yazını oxu", "blog.empty": "Hələ yazı yoxdur. Administrator yazıları Admin səhifəsindən dərc edə bilər.",
      "blog.back": "Bütün yazılar", "blog.notFound": "Bu yazı tapılmadı.", "blog.general": "Ümumi",
      "blog.like": "Faydalıdır", "blog.dislike": "Faydalı deyil", "blog.comments": "Şərhlər", "blog.noComments": "Hələ şərh yoxdur. İlk şərhi siz yazın.",
      "blog.commentPh": "Şərh yazın…", "blog.post": "Şərhi göndər", "blog.posted": "Şərh göndərildi", "blog.commentFail": "Şərhi göndərmək mümkün olmadı.",
      "blog.deleteComment": "Şərhi sil", "blog.commentDeleted": "Şərh silindi", "blog.reactFail": "Reaksiyanı saxlamaq mümkün olmadı.",
      "blog.offlineSocial": "Şərhlər və reaksiyalar verilənlər bazası qoşulduqdan sonra əlçatan olacaq.", "blog.by": "Müəllif: {name}"
    }
  });

  var listEl = document.getElementById("blog-list"), postEl = document.getElementById("blog-post");
  var feed = document.getElementById("feed"), filters = document.getElementById("filters");
  var state = { posts: [], offline: false, tag: "", post: null, comments: [], reactions: [], missing: false };
  var postId = new URLSearchParams(location.search).get("id");

  function tagOf(p) { return SS.L(p, "tag") || SS.t("blog.general"); }
  function tagKey(p) { return (p.tag_en || p.tag_az || "general").toLowerCase(); }

  async function loadPosts() {
    try {
      if (!sb) throw new Error("no client");
      var res = await sb.from("blogs").select("id, title_en, title_az, tag_en, tag_az, summary_en, summary_az, created_at").eq("published", true).order("created_at", { ascending: false });
      if (res.error) throw res.error;
      state.posts = res.data || [];
    } catch (err) {
      console.warn("[SyntaxSec] Using bundled sample posts:", err && err.message);
      state.offline = true;
      try {
        var seed = await fetch("data/articles.json").then(function (r) { return r.json(); });
        state.posts = seed.map(function (p) { return Object.assign({}, p, { id: SS.slug(p.title_en), created_at: p.date }); });
      } catch (e) { state.posts = []; }
    }
  }
  async function loadPost(id) {
    if (state.offline) { state.post = state.posts.find(function (p) { return p.id === id; }) || null; return; }
    var res = await sb.from("blogs").select("*").eq("id", id).maybeSingle();
    state.post = res.error ? null : res.data;
    if (state.post) await loadSocial();
  }
  async function loadSocial() {
    var res = await Promise.all([
      sb.from("blog_comments").select("id, user_id, author_name, content, created_at").eq("blog_id", state.post.id).order("created_at", { ascending: true }),
      sb.from("blog_reactions").select("user_id, value").eq("blog_id", state.post.id)
    ]);
    state.comments = res[0].error ? [] : res[0].data || [];
    state.reactions = res[1].error ? [] : res[1].data || [];
  }

  /* ------------------------------------------------------------ list */
  function renderList() {
    document.getElementById("offline-note").hidden = !state.offline;
    var tags = [], seen = {};
    state.posts.forEach(function (p) { var k = tagKey(p); if (!seen[k]) { seen[k] = 1; tags.push({ key: k, label: tagOf(p) }); } });
    filters.innerHTML = '<button type="button" class="chip" data-tag="" aria-pressed="' + (state.tag === "") + '">' + SS.esc(SS.t("common.all")) + "</button>" +
      tags.map(function (t) { return '<button type="button" class="chip" data-tag="' + SS.esc(t.key) + '" aria-pressed="' + (state.tag === t.key) + '">' + SS.esc(t.label) + "</button>"; }).join("");
    var shown = state.posts.filter(function (p) { return !state.tag || tagKey(p) === state.tag; });
    feed.innerHTML = shown.length ? shown.map(function (p) {
      return '<a class="card post-card" href="blog.html?id=' + encodeURIComponent(p.id) + '"><span class="badge">' + SS.esc(tagOf(p)) + "</span><h3>" + SS.esc(SS.L(p, "title")) +
        '</h3><p class="dim">' + SS.esc(SS.L(p, "summary")) + '</p><div class="meta"><span>' + SS.esc(SS.fmtDate(p.created_at)) + '</span><span class="go" style="margin:0">' + SS.esc(SS.t("blog.read")) + " →</span></div></a>";
    }).join("") : '<div class="empty" style="grid-column:1/-1"><span class="emoji">📰</span>' + SS.esc(SS.t("blog.empty")) + "</div>";
  }
  filters.addEventListener("click", function (e) {
    var b = e.target.closest("[data-tag]"); if (!b) return;
    state.tag = b.getAttribute("data-tag"); renderList();
  });

  /* ------------------------------------------------------------ single post */
  function renderPost() {
    var e = SS.esc, p = state.post;
    if (!p) {
      postEl.innerHTML = '<div class="empty"><span class="emoji">🧭</span><h2>' + e(SS.t("blog.notFound")) + '</h2><a class="btn" href="blog.html">' + e(SS.t("blog.back")) + "</a></div>";
      return;
    }
    document.title = SS.L(p, "title") + " | SyntaxSec";
    var uid = SS.auth.user && SS.auth.user.id;
    var likes = state.reactions.filter(function (r) { return r.value === 1; }).length, dislikes = state.reactions.filter(function (r) { return r.value === -1; }).length;
    var mine = (state.reactions.find(function (r) { return r.user_id === uid; }) || {}).value || 0;
    var social;
    if (state.offline || !uid) {
      social = '<p class="small dim">' + e(SS.t("blog.offlineSocial")) + "</p>";
    } else {
      social = '<div class="row" style="margin-bottom:26px">' +
        '<button type="button" class="btn sm ghost' + (mine === 1 ? " on" : "") + '" data-react="1" aria-pressed="' + (mine === 1) + '">👍 ' + e(SS.t("blog.like")) + " · " + likes + "</button>" +
        '<button type="button" class="btn sm ghost' + (mine === -1 ? " on" : "") + '" data-react="-1" aria-pressed="' + (mine === -1) + '">👎 ' + e(SS.t("blog.dislike")) + " · " + dislikes + "</button></div>" +
        "<h2>" + e(SS.t("blog.comments")) + " (" + state.comments.length + ")</h2>" +
        (state.comments.length ? state.comments.map(function (c) {
          var can = c.user_id === uid || SS.auth.isAdmin();
          return '<div class="comment"><span class="who">' + e(c.author_name || "user") + '</span><span class="when">' + e(SS.fmtDate(c.created_at)) + "</span>" +
            (can ? '<button type="button" class="btn sm danger" style="float:right;padding:3px 9px" data-del-comment="' + e(c.id) + '" title="' + e(SS.t("blog.deleteComment")) + '">✕</button>' : "") +
            "<p>" + e(c.content) + "</p></div>";
        }).join("") : '<p class="dim">' + e(SS.t("blog.noComments")) + "</p>") +
        '<form id="comment-form" style="margin-top:16px;max-width:72ch"><textarea id="comment-text" maxlength="2000" required style="min-height:90px" placeholder="' + e(SS.t("blog.commentPh")) + '" aria-label="' + e(SS.t("blog.commentPh")) + '"></textarea>' +
        '<div class="row" style="margin-top:10px"><button class="btn sm" type="submit">' + e(SS.t("blog.post")) + "</button></div></form>";
    }
    postEl.innerHTML =
      '<p class="crumbs no-print"><a href="blog.html">← ' + e(SS.t("blog.back")) + "</a></p>" +
      '<span class="badge">' + e(tagOf(p)) + '</span> <span class="small dim" style="margin-left:6px">' + e(SS.fmtDate(p.created_at)) + "</span>" +
      '<h1 style="margin-top:12px">' + e(SS.L(p, "title")) + "</h1>" +
      (SS.L(p, "summary") ? '<p class="lead dim" style="max-width:68ch;font-size:1.1rem">' + e(SS.L(p, "summary")) + "</p>" : "") +
      '<div class="row no-print" style="margin:18px 0 26px"><button type="button" class="btn sm soft" data-print>🖨️ ' + e(SS.t("common.print")) + "</button></div>" +
      '<div class="prose">' + SS.md(SS.L(p, "content") || SS.L(p, "summary")) + "</div>" +
      '<hr class="no-print"><section class="no-print">' + social + "</section>";
  }

  postEl.addEventListener("click", async function (e) {
    var react = e.target.closest("[data-react]"), del = e.target.closest("[data-del-comment]");
    var uid = SS.auth.user && SS.auth.user.id;
    if (react && uid) {
      var value = parseInt(react.getAttribute("data-react"), 10);
      var mine = state.reactions.find(function (r) { return r.user_id === uid; });
      react.disabled = true;
      var res = mine && mine.value === value
        ? await sb.from("blog_reactions").delete().eq("blog_id", state.post.id).eq("user_id", uid)
        : await sb.from("blog_reactions").upsert({ blog_id: state.post.id, user_id: uid, value: value }, { onConflict: "blog_id,user_id" });
      if (res.error) SS.toast(SS.t("blog.reactFail"), "bad");
      await loadSocial(); renderPost();
    }
    if (del) {
      del.disabled = true;
      var out = await sb.from("blog_comments").delete().eq("id", del.getAttribute("data-del-comment"));
      if (out.error) SS.toast(SS.t("common.error"), "bad"); else SS.toast(SS.t("blog.commentDeleted"), "ok");
      await loadSocial(); renderPost();
    }
  });
  postEl.addEventListener("submit", async function (e) {
    if (e.target.id !== "comment-form") return;
    e.preventDefault();
    var text = document.getElementById("comment-text").value.trim();
    if (!text) return;
    var btn = e.target.querySelector("button"); btn.disabled = true;
    var res = await sb.from("blog_comments").insert({ blog_id: state.post.id, user_id: SS.auth.user.id, content: text });
    if (res.error) { console.error(res.error); SS.toast(SS.t("blog.commentFail"), "bad"); btn.disabled = false; return; }
    SS.toast(SS.t("blog.posted"), "ok");
    await loadSocial(); renderPost();
  });

  function render() { if (postId) renderPost(); else renderList(); }
  document.addEventListener("langchange", render);

  SS.auth.ready.then(async function () {
    await loadPosts();
    if (postId) {
      listEl.hidden = true; postEl.hidden = false;
      try { await loadPost(postId); } catch (err) { console.error(err); state.post = null; }
    }
    render();
  });
})();
