/* SyntaxSec — admin.html: content management for topics, terms and blog posts,
   plus a JSON / CSV bulk importer. The page is reachable only when
   profiles.role = 'admin' (js/auth.js redirects everyone else), and the database
   enforces the same rule through Row Level Security, so the UI is not the only guard. */
(function () {
  "use strict";
  var SS = window.SS;
  var sb = window._supabase;
  SS.addStrings({
    en: {
      "adm.title": "Admin", "adm.h1": "Content management",
      "adm.lead": "Add, edit and delete topics, terms and blog posts in English and Azerbaijani, or import many terms at once.",
      "adm.tabTopics": "Topics", "adm.tabTerms": "Terms", "adm.tabBlogs": "Blog posts", "adm.tabImport": "Bulk import", "adm.tabUsers": "Users",
      "adm.newTopic": "New topic", "adm.newTerm": "New term", "adm.newBlog": "New post",
      "adm.editTopic": "Edit topic", "adm.editTerm": "Edit term", "adm.editBlog": "Edit post",
      "adm.colTopic": "Topic", "adm.colTrack": "Roadmap", "adm.colOrder": "Order", "adm.colTerms": "Terms", "adm.colTerm": "Term", "adm.colLangs": "Languages",
      "adm.colTitle": "Title", "adm.colTag": "Tag", "adm.colDate": "Date", "adm.colStatus": "Status", "adm.colRole": "Role", "adm.colJoined": "Joined",
      "adm.searchTerms": "Search terms…", "adm.filterTopic": "Filter by topic", "adm.allTopics": "All topics",
      "adm.published": "Published", "adm.draft": "Draft", "adm.noTrack": "Not in a roadmap",
      "adm.emptyTopics": "No topics yet. Create the first one, or load the starter content from the Bulk import tab.",
      "adm.emptyTerms": "No terms match.", "adm.emptyBlogs": "No blog posts yet.", "adm.emptyUsers": "No users found.",
      "adm.f.slug": "Slug (URL id)", "adm.f.slugHint": "Leave empty to generate it from the English name.", "adm.f.icon": "Icon (emoji)", "adm.f.track": "Roadmap",
      "adm.f.order": "Sort order", "adm.f.topic": "Topic", "adm.f.published": "Published (visible to users)",
      "adm.f.name": "Name", "adm.f.description": "Short description", "adm.f.term": "Term", "adm.f.summary": "Short summary (shown on the Learn page)",
      "adm.f.content": "Full explanation (deep-dive page)", "adm.f.example": "Practical example", "adm.f.title": "Title", "adm.f.tag": "Tag / topic", "adm.f.blogSummary": "Summary (shown on the card)",
      "adm.f.blogContent": "Post content", "adm.mdHint": "Formatting: ## heading, - list item, **bold**, `code`, [link](https://…), ``` for code blocks.",
      "adm.english": "English", "adm.azerbaijani": "Azerbaijani",
      "adm.needName": "Fill in the name in at least one language.", "adm.needTopic": "Choose a topic first. Create one in the Topics tab if the list is empty.",
      "adm.saved": "Saved", "adm.deleted": "Deleted", "adm.saveFail": "Could not save: {msg}", "adm.deleteFail": "Could not delete: {msg}",
      "adm.slugTaken": "That slug is already used. Choose a different one.",
      "adm.confirmTopic": "Delete the topic “{name}”?", "adm.confirmTopicSub": "Its {n} terms and all saved progress for them will be deleted too.",
      "adm.confirmTerm": "Delete the term “{name}”?", "adm.confirmTermSub": "Bookmarks and mastered marks for this term will be removed.",
      "adm.confirmBlog": "Delete the post “{name}”?", "adm.confirmBlogSub": "Its comments and reactions will be deleted too.",
      "adm.importH": "Bulk import terms",
      "adm.importP": "Upload a JSON or CSV file, or paste its contents. Existing topics and terms with the same slug are updated, new ones are created, and missing topics are created automatically.",
      "adm.chooseFile": "Choose a .json or .csv file", "adm.importPh": "Paste JSON or CSV here…", "adm.preview": "Check the file", "adm.runImport": "Import",
      "adm.templatesH": "Templates", "adm.templatesP": "Download a sample, fill it in and upload it. Both formats carry the same fields.",
      "adm.tplJson": "Sample JSON template", "adm.tplCsv": "Sample CSV template", "adm.fieldsH": "Fields",
      "adm.fieldsP": "<strong>Topic:</strong> <code>slug</code>, <code>name_en</code>, <code>name_az</code>, <code>description_en</code>, <code>description_az</code>, <code>icon</code>, <code>track</code> (digital-hygiene, web-security, network-defense), <code>sort_order</code>.<br><strong>Term:</strong> <code>topic</code> (topic slug), <code>slug</code> (optional), <code>term_en</code>, <code>term_az</code>, <code>summary_en</code>, <code>summary_az</code>, <code>content_en</code>, <code>content_az</code>, <code>example_en</code>, <code>example_az</code>.<br><strong>CSV:</strong> one term per row with <code>topic_slug</code>, <code>topic_name_en</code>, <code>topic_name_az</code> and the term columns.",
      "adm.starterH": "Starter content", "adm.starterP": "Load the bundled bilingual library (6 topics, 27 terms and 4 blog posts) into your database. Safe to run again — matching slugs are updated, not duplicated.",
      "adm.starterRun": "Load starter content", "adm.starterFail": "Could not read the bundled data files.",
      "adm.usersP": "Read-only list of registered accounts. Roles are changed with SQL in the Supabase dashboard.",
      "adm.impEmpty": "Paste some JSON or CSV, or choose a file first.", "adm.impBadJson": "The JSON could not be read: {msg}",
      "adm.impBadCsv": "The CSV needs a header row containing at least term_en or term_az.", "adm.impNothing": "No terms or topics were found in the file.",
      "adm.impReady": "Ready to import: {topics} topics and {terms} terms ({newTopics} topics will be created automatically).",
      "adm.impSkipped": "{n} rows will be skipped:", "adm.impRowNoTerm": "row {row}: no term_en or term_az", "adm.impRowNoTopic": "row {row}: no topic", "adm.impRowDup": "row {row}: duplicate of “{slug}”",
      "adm.impWorking": "Importing…", "adm.impDone": "Imported {topics} topics and {terms} terms.", "adm.impBlogs": "Added {n} blog posts.", "adm.impFail": "Import stopped: {msg}",
      "adm.dbMissing": "The database tables are not set up yet. Run supabase-setup.sql in the Supabase SQL Editor, then reload this page."
    },
    az: {
      "adm.title": "Admin", "adm.h1": "Məzmunun idarə edilməsi",
      "adm.lead": "Mövzuları, terminləri və bloq yazılarını ingilis və Azərbaycan dillərində əlavə edin, redaktə edin və silin, yaxud çoxlu termini birdəfəyə idxal edin.",
      "adm.tabTopics": "Mövzular", "adm.tabTerms": "Terminlər", "adm.tabBlogs": "Bloq yazıları", "adm.tabImport": "Toplu idxal", "adm.tabUsers": "İstifadəçilər",
      "adm.newTopic": "Yeni mövzu", "adm.newTerm": "Yeni termin", "adm.newBlog": "Yeni yazı",
      "adm.editTopic": "Mövzunu redaktə et", "adm.editTerm": "Termini redaktə et", "adm.editBlog": "Yazını redaktə et",
      "adm.colTopic": "Mövzu", "adm.colTrack": "Yol xəritəsi", "adm.colOrder": "Sıra", "adm.colTerms": "Terminlər", "adm.colTerm": "Termin", "adm.colLangs": "Dillər",
      "adm.colTitle": "Başlıq", "adm.colTag": "Teq", "adm.colDate": "Tarix", "adm.colStatus": "Status", "adm.colRole": "Rol", "adm.colJoined": "Qoşulub",
      "adm.searchTerms": "Termin axtar…", "adm.filterTopic": "Mövzuya görə süz", "adm.allTopics": "Bütün mövzular",
      "adm.published": "Dərc olunub", "adm.draft": "Qaralama", "adm.noTrack": "Yol xəritəsində deyil",
      "adm.emptyTopics": "Hələ mövzu yoxdur. İlk mövzunu yaradın və ya Toplu idxal bölməsindən başlanğıc məzmunu yükləyin.",
      "adm.emptyTerms": "Uyğun termin yoxdur.", "adm.emptyBlogs": "Hələ bloq yazısı yoxdur.", "adm.emptyUsers": "İstifadəçi tapılmadı.",
      "adm.f.slug": "Slug (URL identifikatoru)", "adm.f.slugHint": "Boş saxlasanız, ingiliscə addan yaradılacaq.", "adm.f.icon": "İkon (emoji)", "adm.f.track": "Yol xəritəsi",
      "adm.f.order": "Sıra nömrəsi", "adm.f.topic": "Mövzu", "adm.f.published": "Dərc olunub (istifadəçilərə görünür)",
      "adm.f.name": "Ad", "adm.f.description": "Qısa təsvir", "adm.f.term": "Termin", "adm.f.summary": "Qısa xülasə (Öyrən səhifəsində göstərilir)",
      "adm.f.content": "Ətraflı izah (ətraflı səhifə)", "adm.f.example": "Praktik nümunə", "adm.f.title": "Başlıq", "adm.f.tag": "Teq / mövzu", "adm.f.blogSummary": "Xülasə (kartda göstərilir)",
      "adm.f.blogContent": "Yazının məzmunu", "adm.mdHint": "Formatlama: ## başlıq, - siyahı bəndi, **qalın**, `kod`, [keçid](https://…), kod blokları üçün ```.",
      "adm.english": "İngilis dili", "adm.azerbaijani": "Azərbaycan dili",
      "adm.needName": "Adı ən azı bir dildə doldurun.", "adm.needTopic": "Əvvəlcə mövzu seçin. Siyahı boşdursa, Mövzular bölməsində mövzu yaradın.",
      "adm.saved": "Yadda saxlanıldı", "adm.deleted": "Silindi", "adm.saveFail": "Yadda saxlamaq mümkün olmadı: {msg}", "adm.deleteFail": "Silmək mümkün olmadı: {msg}",
      "adm.slugTaken": "Bu slug artıq istifadə olunur. Başqasını seçin.",
      "adm.confirmTopic": "“{name}” mövzusu silinsin?", "adm.confirmTopicSub": "Onun {n} termini və onlar üzrə saxlanılmış bütün irəliləyiş də silinəcək.",
      "adm.confirmTerm": "“{name}” termini silinsin?", "adm.confirmTermSub": "Bu termin üçün əlfəcinlər və mənimsəmə işarələri silinəcək.",
      "adm.confirmBlog": "“{name}” yazısı silinsin?", "adm.confirmBlogSub": "Onun şərhləri və reaksiyaları da silinəcək.",
      "adm.importH": "Terminlərin toplu idxalı",
      "adm.importP": "JSON və ya CSV faylı yükləyin, yaxud məzmununu yapışdırın. Eyni slug-a malik mövcud mövzu və terminlər yenilənir, yeniləri yaradılır, çatışmayan mövzular isə avtomatik yaradılır.",
      "adm.chooseFile": ".json və ya .csv faylı seçin", "adm.importPh": "JSON və ya CSV-ni bura yapışdırın…", "adm.preview": "Faylı yoxla", "adm.runImport": "İdxal et",
      "adm.templatesH": "Şablonlar", "adm.templatesP": "Nümunəni yükləyin, doldurun və geri yükləyin. Hər iki formatda eyni sahələr var.",
      "adm.tplJson": "Nümunə JSON şablonu", "adm.tplCsv": "Nümunə CSV şablonu", "adm.fieldsH": "Sahələr",
      "adm.fieldsP": "<strong>Mövzu:</strong> <code>slug</code>, <code>name_en</code>, <code>name_az</code>, <code>description_en</code>, <code>description_az</code>, <code>icon</code>, <code>track</code> (digital-hygiene, web-security, network-defense), <code>sort_order</code>.<br><strong>Termin:</strong> <code>topic</code> (mövzunun slug-u), <code>slug</code> (istəyə bağlı), <code>term_en</code>, <code>term_az</code>, <code>summary_en</code>, <code>summary_az</code>, <code>content_en</code>, <code>content_az</code>, <code>example_en</code>, <code>example_az</code>.<br><strong>CSV:</strong> hər sətirdə bir termin; <code>topic_slug</code>, <code>topic_name_en</code>, <code>topic_name_az</code> və termin sütunları.",
      "adm.starterH": "Başlanğıc məzmun", "adm.starterP": "Hazır ikidilli kitabxananı (6 mövzu, 27 termin və 4 bloq yazısı) verilənlər bazanıza yükləyin. Təkrar işə salmaq təhlükəsizdir — uyğun slug-lar təkrarlanmır, yenilənir.",
      "adm.starterRun": "Başlanğıc məzmunu yüklə", "adm.starterFail": "Daxili məlumat fayllarını oxumaq mümkün olmadı.",
      "adm.usersP": "Qeydiyyatdan keçmiş hesabların yalnız oxunan siyahısı. Rollar Supabase panelində SQL ilə dəyişdirilir.",
      "adm.impEmpty": "Əvvəlcə JSON və ya CSV yapışdırın, yaxud fayl seçin.", "adm.impBadJson": "JSON oxunmadı: {msg}",
      "adm.impBadCsv": "CSV-də ən azı term_en və ya term_az sütunu olan başlıq sətri olmalıdır.", "adm.impNothing": "Faylda termin və ya mövzu tapılmadı.",
      "adm.impReady": "İdxala hazırdır: {topics} mövzu və {terms} termin ({newTopics} mövzu avtomatik yaradılacaq).",
      "adm.impSkipped": "{n} sətir ötürüləcək:", "adm.impRowNoTerm": "sətir {row}: term_en və ya term_az yoxdur", "adm.impRowNoTopic": "sətir {row}: mövzu yoxdur", "adm.impRowDup": "sətir {row}: “{slug}” təkrarıdır",
      "adm.impWorking": "İdxal olunur…", "adm.impDone": "{topics} mövzu və {terms} termin idxal olundu.", "adm.impBlogs": "{n} bloq yazısı əlavə olundu.", "adm.impFail": "İdxal dayandı: {msg}",
      "adm.dbMissing": "Verilənlər bazası cədvəlləri hələ qurulmayıb. Supabase SQL Editor-da supabase-setup.sql faylını işə salın, sonra bu səhifəni yeniləyin."
    }
  });

  var $ = function (id) { return document.getElementById(id); };
  var e = SS.esc;
  var data = { topics: [], terms: [], blogs: [], users: [] };
  var TRACK_IDS = SS.TRACKS.map(function (t) { return t.id; });

  /* ------------------------------------------------------------ entity definitions */
  var ENTITIES = {
    topics: {
      table: "topics", newKey: "adm.newTopic", editKey: "adm.editTopic", nameField: "name",
      common: [
        { name: "slug", label: "adm.f.slug", hint: "adm.f.slugHint" },
        { name: "icon", label: "adm.f.icon", placeholder: "📘" },
        { name: "track", label: "adm.f.track", type: "track" },
        { name: "sort_order", label: "adm.f.order", type: "number" }
      ],
      bilingual: [{ name: "name", label: "adm.f.name" }, { name: "description", label: "adm.f.description", type: "textarea", rows: 3 }]
    },
    terms: {
      table: "terms", newKey: "adm.newTerm", editKey: "adm.editTerm", nameField: "term",
      common: [{ name: "topic_id", label: "adm.f.topic", type: "topic" }, { name: "slug", label: "adm.f.slug", hint: "adm.f.slugHint" }],
      bilingual: [
        { name: "term", label: "adm.f.term" }, { name: "summary", label: "adm.f.summary", type: "textarea", rows: 3 },
        { name: "content", label: "adm.f.content", type: "textarea", rows: 10, hint: "adm.mdHint" }, { name: "example", label: "adm.f.example", type: "textarea", rows: 4 }
      ]
    },
    blogs: {
      table: "blogs", newKey: "adm.newBlog", editKey: "adm.editBlog", nameField: "title",
      common: [{ name: "published", label: "adm.f.published", type: "checkbox" }],
      bilingual: [
        { name: "title", label: "adm.f.title" }, { name: "tag", label: "adm.f.tag" }, { name: "summary", label: "adm.f.blogSummary", type: "textarea", rows: 3 },
        { name: "content", label: "adm.f.blogContent", type: "textarea", rows: 12, hint: "adm.mdHint" }
      ]
    }
  };

  /* ------------------------------------------------------------ loading */
  async function loadAll() {
    var res = await Promise.all([
      sb.from("topics").select("*").order("sort_order", { ascending: true }).order("name_en", { ascending: true }),
      sb.from("terms").select("*").order("term_en", { ascending: true }),
      sb.from("blogs").select("*").order("created_at", { ascending: false }),
      sb.from("profiles").select("id, username, email, role, created_at").order("created_at", { ascending: false })
    ]);
    var failed = res.find(function (r) { return r.error; });
    if (failed) {
      console.error(failed.error);
      var note = document.createElement("div");
      note.className = "notice bad"; note.style.margin = "18px 0";
      note.innerHTML = "<span>⚠️</span><span>" + e(SS.t("adm.dbMissing")) + " (" + e(failed.error.message) + ")</span>";
      $("adm-tabs").after(note);
    }
    data.topics = res[0].data || []; data.terms = res[1].data || []; data.blogs = res[2].data || []; data.users = res[3].data || [];
    SS.db.invalidate();
    renderAll();
  }

  /* ------------------------------------------------------------ tables */
  function emptyRow(cols, key) { return '<tr><td colspan="' + cols + '" class="dim center" style="padding:26px">' + e(SS.t(key)) + "</td></tr>"; }
  function actions(kind, id) {
    return '<td class="actions"><button type="button" class="btn sm ghost" data-edit="' + kind + '" data-id="' + e(id) + '">' + e(SS.t("common.edit")) +
      '</button> <button type="button" class="btn sm danger" data-delete="' + kind + '" data-id="' + e(id) + '">' + e(SS.t("common.delete")) + "</button></td>";
  }
  function langBadges(row, field) {
    var has = function (l) { return row[field + "_" + l] && String(row[field + "_" + l]).trim(); };
    return '<span class="badge ' + (has("en") ? "mint" : "coral") + '">EN</span> <span class="badge ' + (has("az") ? "mint" : "coral") + '">AZ</span>';
  }
  function renderTopics() {
    $("rows-topics").innerHTML = data.topics.length ? data.topics.map(function (t) {
      var n = data.terms.filter(function (x) { return x.topic_id === t.id; }).length;
      return "<tr><td><strong>" + e((t.icon || "📘") + " " + (t.name_en || "—")) + '</strong><div class="small dim">' + e(t.name_az || "—") + "</div></td><td><code>" + e(t.slug) + "</code></td><td>" +
        (t.track ? '<span class="badge">' + e(SS.t("track." + t.track)) + "</span>" : '<span class="dim small">' + e(SS.t("adm.noTrack")) + "</span>") + "</td><td>" + e(t.sort_order) + "</td><td>" + n + "</td>" + actions("topics", t.id) + "</tr>";
    }).join("") : emptyRow(6, "adm.emptyTopics");
    var filter = $("term-filter"), keep = filter.value;
    filter.innerHTML = '<option value="">' + e(SS.t("adm.allTopics")) + "</option>" + data.topics.map(function (t) { return '<option value="' + e(t.id) + '">' + e(SS.L(t, "name")) + "</option>"; }).join("");
    filter.value = keep;
  }
  function renderTerms() {
    var q = $("term-search").value.trim().toLocaleLowerCase("az"), topic = $("term-filter").value;
    var rows = data.terms.filter(function (t) {
      if (topic && t.topic_id !== topic) return false;
      return !q || String(t.term_en || "").toLocaleLowerCase("az").indexOf(q) !== -1 || String(t.term_az || "").toLocaleLowerCase("az").indexOf(q) !== -1;
    });
    $("rows-terms").innerHTML = rows.length ? rows.map(function (t) {
      var topicRow = data.topics.find(function (x) { return x.id === t.topic_id; });
      return "<tr><td><strong>" + e(t.term_en || "—") + '</strong><div class="small dim">' + e(t.term_az || "—") + "</div></td><td>" + e(topicRow ? SS.L(topicRow, "name") : "—") + "</td><td>" + langBadges(t, "content") + "</td>" + actions("terms", t.id) + "</tr>";
    }).join("") : emptyRow(4, "adm.emptyTerms");
  }
  function renderBlogs() {
    $("rows-blogs").innerHTML = data.blogs.length ? data.blogs.map(function (b) {
      return "<tr><td><strong>" + e(b.title_en || "—") + '</strong><div class="small dim">' + e(b.title_az || "—") + "</div></td><td>" + e(SS.L(b, "tag")) + "</td><td>" + e(SS.fmtDate(b.created_at)) + "</td><td>" +
        '<span class="badge ' + (b.published ? "mint" : "plain") + '">' + e(SS.t(b.published ? "adm.published" : "adm.draft")) + "</span></td>" + actions("blogs", b.id) + "</tr>";
    }).join("") : emptyRow(5, "adm.emptyBlogs");
  }
  function renderUsers() {
    $("rows-users").innerHTML = data.users.length ? data.users.map(function (u) {
      return "<tr><td><strong>" + e(u.username) + "</strong></td><td>" + e(u.email) + '</td><td><span class="badge ' + (u.role === "admin" ? "sun" : "plain") + '">' + e(u.role) + "</span></td><td>" + e(SS.fmtDate(u.created_at)) + "</td></tr>";
    }).join("") : emptyRow(4, "adm.emptyUsers");
  }
  function renderAll() { renderTopics(); renderTerms(); renderBlogs(); renderUsers(); }

  /* ------------------------------------------------------------ tabs */
  $("adm-tabs").addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-tab]"); if (!b) return;
    var name = b.getAttribute("data-tab");
    SS.$$("#adm-tabs .tab").forEach(function (t) { t.setAttribute("aria-selected", String(t === b)); });
    ["topics", "terms", "blogs", "import", "users"].forEach(function (t) { $("tab-" + t).hidden = t !== name; });
  });
  $("term-search").addEventListener("input", renderTerms);
  $("term-filter").addEventListener("change", renderTerms);

  /* ------------------------------------------------------------ edit modal */
  var modal = $("edit-modal"), form = $("edit-form"), editing = null;
  function fieldHtml(f, name, value, lang) {
    var id = "f-" + name, label = '<label for="' + id + '">' + e(SS.t(f.label)) + "</label>", hint = f.hint ? '<div class="hint">' + e(SS.t(f.hint)) + "</div>" : "";
    var v = value === null || value === undefined ? "" : value, langAttr = lang ? ' lang="' + lang + '"' : "";
    if (f.type === "textarea") return '<div class="field">' + label + '<textarea id="' + id + '" name="' + name + '" rows="' + (f.rows || 4) + '"' + langAttr + ' style="min-height:0">' + e(v) + "</textarea>" + hint + "</div>";
    if (f.type === "checkbox") return '<div class="field"><label class="check"><input type="checkbox" id="' + id + '" name="' + name + '"' + (v || v === "" ? " checked" : "") + "> " + e(SS.t(f.label)) + "</label></div>";
    if (f.type === "track") return '<div class="field">' + label + '<select id="' + id + '" name="' + name + '"><option value="">' + e(SS.t("adm.noTrack")) + "</option>" +
      SS.TRACKS.map(function (t) { return '<option value="' + t.id + '"' + (v === t.id ? " selected" : "") + ">" + e(SS.t("track." + t.id)) + "</option>"; }).join("") + "</select></div>";
    if (f.type === "topic") return '<div class="field">' + label + '<select id="' + id + '" name="' + name + '" required>' +
      data.topics.map(function (t) { return '<option value="' + e(t.id) + '"' + (v === t.id ? " selected" : "") + ">" + e(SS.L(t, "name")) + "</option>"; }).join("") + "</select></div>";
    return '<div class="field">' + label + '<input id="' + id + '" name="' + name + '" type="' + (f.type === "number" ? "number" : "text") + '" value="' + e(v) + '"' + (f.placeholder ? ' placeholder="' + e(f.placeholder) + '"' : "") + langAttr + ">" + hint + "</div>";
  }
  function openEditor(kind, id) {
    var def = ENTITIES[kind], row = id ? data[kind].find(function (r) { return r.id === id; }) : null;
    if (kind === "terms" && !data.topics.length) { SS.toast(SS.t("adm.needTopic"), "bad"); return; }
    editing = { kind: kind, id: id || null };
    var defaults = { sort_order: data.topics.length + 1, published: true, topic_id: $("term-filter").value || (data.topics[0] && data.topics[0].id) };
    var get = function (name) { return row ? row[name] : defaults[name]; };
    $("edit-title").textContent = SS.t(row ? def.editKey : def.newKey);
    $("edit-fields").innerHTML =
      '<div class="form-grid">' + def.common.map(function (f) { return fieldHtml(f, f.name, get(f.name)); }).join("") + "</div>" +
      '<div class="form-grid" style="margin-top:6px">' + ["en", "az"].map(function (lang) {
        return '<div class="lang-col"><h4><span class="badge">' + lang.toUpperCase() + "</span> " + e(SS.t(lang === "en" ? "adm.english" : "adm.azerbaijani")) + "</h4>" +
          def.bilingual.map(function (f) { return fieldHtml(f, f.name + "_" + lang, get(f.name + "_" + lang), lang); }).join("") + "</div>";
      }).join("") + "</div>";
    $("edit-msg").textContent = "";
    modal.classList.add("open");
    var first = form.querySelector("input, select, textarea"); if (first) setTimeout(function () { first.focus(); }, 60);
  }
  function closeEditor() { modal.classList.remove("open"); editing = null; }
  modal.addEventListener("click", function (ev) { if (ev.target === modal || ev.target.closest("[data-close]")) closeEditor(); });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") { closeEditor(); settle(false); } });

  function uniqueSlug(kind, base, selfId) {
    var slug = base || "item", n = 2;
    while (data[kind].some(function (r) { return r.slug === slug && r.id !== selfId; })) slug = base + "-" + n++;
    return slug;
  }

  form.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    if (!editing) return;
    var def = ENTITIES[editing.kind], row = {}, msg = $("edit-msg");
    def.common.concat(def.bilingual.reduce(function (all, f) { return all.concat([Object.assign({}, f, { name: f.name + "_en" }), Object.assign({}, f, { name: f.name + "_az" })]); }, [])).forEach(function (f) {
      var el = form.elements[f.name]; if (!el) return;
      if (f.type === "checkbox") row[f.name] = el.checked;
      else if (f.type === "number") row[f.name] = parseInt(el.value, 10) || 0;
      else row[f.name] = el.value.trim();
    });
    var nameEn = row[def.nameField + "_en"], nameAz = row[def.nameField + "_az"];
    if (!nameEn && !nameAz) { msg.textContent = SS.t("adm.needName"); msg.className = "form-msg bad"; return; }
    if (editing.kind === "terms" && !row.topic_id) { msg.textContent = SS.t("adm.needTopic"); msg.className = "form-msg bad"; return; }
    if ("slug" in row) {
      var wanted = SS.slug(row.slug || nameEn || nameAz);
      if (row.slug && data[editing.kind].some(function (r) { return r.slug === wanted && r.id !== editing.id; })) { msg.textContent = SS.t("adm.slugTaken"); msg.className = "form-msg bad"; return; }
      row.slug = row.slug ? wanted : uniqueSlug(editing.kind, wanted, editing.id);
    }
    if ("track" in row && !row.track) row.track = null;
    if (editing.kind === "terms") row.updated_at = new Date().toISOString();
    if (editing.kind === "blogs" && !editing.id) row.author_id = SS.auth.user.id;

    $("edit-save").disabled = true;
    var q = editing.id ? sb.from(def.table).update(row).eq("id", editing.id) : sb.from(def.table).insert(row);
    var res = await q;
    $("edit-save").disabled = false;
    if (res.error) { msg.textContent = SS.t("adm.saveFail", { msg: res.error.message }); msg.className = "form-msg bad"; return; }
    SS.toast(SS.t("adm.saved"), "ok");
    closeEditor();
    await loadAll();
  });

  /* ------------------------------------------------------------ confirm + delete */
  var confirmModal = $("confirm-modal"), settleFn = null;
  function settle(answer) { confirmModal.classList.remove("open"); if (settleFn) { var fn = settleFn; settleFn = null; fn(answer); } }
  function ask(text, sub) {
    $("confirm-text").textContent = text; $("confirm-sub").textContent = sub || "";
    confirmModal.classList.add("open");
    setTimeout(function () { $("confirm-no").focus(); }, 60);
    return new Promise(function (resolve) { settleFn = resolve; });
  }
  $("confirm-yes").addEventListener("click", function () { settle(true); });
  $("confirm-no").addEventListener("click", function () { settle(false); });
  confirmModal.addEventListener("click", function (ev) { if (ev.target === confirmModal) settle(false); });

  document.addEventListener("click", async function (ev) {
    var add = ev.target.closest("[data-new]"), edit = ev.target.closest("[data-edit]"), del = ev.target.closest("[data-delete]");
    if (add) return openEditor(add.getAttribute("data-new"));
    if (edit) return openEditor(edit.getAttribute("data-edit"), edit.getAttribute("data-id"));
    if (!del) return;
    var kind = del.getAttribute("data-delete"), id = del.getAttribute("data-id"), def = ENTITIES[kind];
    var row = data[kind].find(function (r) { return r.id === id; }); if (!row) return;
    var name = SS.L(row, def.nameField), text, sub;
    if (kind === "topics") { text = SS.t("adm.confirmTopic", { name: name }); sub = SS.t("adm.confirmTopicSub", { n: data.terms.filter(function (t) { return t.topic_id === id; }).length }); }
    else if (kind === "terms") { text = SS.t("adm.confirmTerm", { name: name }); sub = SS.t("adm.confirmTermSub"); }
    else { text = SS.t("adm.confirmBlog", { name: name }); sub = SS.t("adm.confirmBlogSub"); }
    if (!(await ask(text, sub))) return;
    var res = await sb.from(def.table).delete().eq("id", id);
    if (res.error) { SS.toast(SS.t("adm.deleteFail", { msg: res.error.message }), "bad"); return; }
    SS.toast(SS.t("adm.deleted"), "ok");
    await loadAll();
  });

  /* ------------------------------------------------------------ bulk import */
  var TOPIC_FIELDS = ["slug", "name_en", "name_az", "description_en", "description_az", "icon", "track", "sort_order"];
  var TERM_FIELDS = ["term_en", "term_az", "summary_en", "summary_az", "content_en", "content_az", "example_en", "example_az"];

  function parseCsv(text) {
    var first = text.split(/\r?\n/)[0] || "";
    var delim = (first.match(/;/g) || []).length > (first.match(/,/g) || []).length ? ";" : (first.match(/\t/g) || []).length > (first.match(/,/g) || []).length ? "\t" : ",";
    var rows = [], row = [], cell = "", quoted = false;
    for (var i = 0; i < text.length; i++) {
      var c = text.charAt(i);
      if (quoted) {
        if (c === '"') { if (text.charAt(i + 1) === '"') { cell += '"'; i++; } else quoted = false; }
        else cell += c;
      } else if (c === '"') quoted = true;
      else if (c === delim) { row.push(cell); cell = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text.charAt(i + 1) === "\n") i++;
        row.push(cell); cell = "";
        if (row.some(function (x) { return x.trim() !== ""; })) rows.push(row);
        row = [];
      } else cell += c;
    }
    row.push(cell);
    if (row.some(function (x) { return x.trim() !== ""; })) rows.push(row);
    if (!rows.length) return [];
    var head = rows.shift().map(function (h) { return h.replace(/^﻿/, "").trim().toLowerCase(); });
    return rows.map(function (r) { var o = {}; head.forEach(function (h, idx) { o[h] = (r[idx] || "").trim(); }); return o; });
  }

  /* Turn JSON or CSV text into { topics: [], terms: [] } with uniform keys. */
  function normalise(text) {
    var trimmed = text.replace(/^﻿/, "").trim(), topics = [], terms = [];
    if (!trimmed) throw new Error(SS.t("adm.impEmpty"));
    if (trimmed.charAt(0) === "{" || trimmed.charAt(0) === "[") {
      var json;
      try { json = JSON.parse(trimmed); } catch (err) { throw new Error(SS.t("adm.impBadJson", { msg: err.message })); }
      if (Array.isArray(json)) terms = json; else { topics = json.topics || []; terms = json.terms || []; }
    } else {
      terms = parseCsv(trimmed);
      if (!terms.length || !("term_en" in terms[0] || "term_az" in terms[0])) throw new Error(SS.t("adm.impBadCsv"));
    }
    if (!Array.isArray(topics) || !Array.isArray(terms) || (!topics.length && !terms.length)) throw new Error(SS.t("adm.impNothing"));
    return { topics: topics, terms: terms };
  }
  function titleCase(slug) { return String(slug).replace(/[-_]+/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }

  function plan(input) {
    var skipped = [], topicMap = {}, existing = {};
    data.topics.forEach(function (t) { existing[t.slug] = t; });
    input.topics.forEach(function (t, i) {
      var slug = SS.slug(t.slug || t.name_en || t.name_az);
      if (!slug) { skipped.push(SS.t("adm.impRowNoTopic", { row: "topics[" + (i + 1) + "]" })); return; }
      topicMap[slug] = {
        slug: slug, name_en: t.name_en || "", name_az: t.name_az || "", description_en: t.description_en || "", description_az: t.description_az || "",
        icon: t.icon || "📘", track: TRACK_IDS.indexOf(t.track) !== -1 ? t.track : null,
        sort_order: parseInt(t.sort_order, 10) || (existing[slug] ? existing[slug].sort_order : data.topics.length + Object.keys(topicMap).length + 1)
      };
    });
    var auto = 0, terms = [], seen = {};
    input.terms.forEach(function (t, i) {
      var row = i + 1;
      if (!t || (!t.term_en && !t.term_az)) { skipped.push(SS.t("adm.impRowNoTerm", { row: row })); return; }
      var topicSlug = SS.slug(t.topic || t.topic_slug || t.topic_name_en || t.topic_name_az || "");
      if (!topicSlug) { skipped.push(SS.t("adm.impRowNoTopic", { row: row })); return; }
      if (!topicMap[topicSlug] && !existing[topicSlug]) {
        auto++;
        topicMap[topicSlug] = {
          slug: topicSlug, name_en: t.topic_name_en || titleCase(topicSlug), name_az: t.topic_name_az || t.topic_name_en || titleCase(topicSlug), description_en: "", description_az: "",
          icon: t.topic_icon || "📘", track: TRACK_IDS.indexOf(t.topic_track) !== -1 ? t.topic_track : null, sort_order: data.topics.length + Object.keys(topicMap).length + 1
        };
      }
      var slug = SS.slug(t.slug || t.term_en || t.term_az);
      if (seen[slug]) { skipped.push(SS.t("adm.impRowDup", { row: row, slug: slug })); return; }
      seen[slug] = true;
      var out = { slug: slug, _topic: topicSlug };
      TERM_FIELDS.forEach(function (f) { out[f] = t[f] === undefined || t[f] === null ? "" : String(t[f]); });
      terms.push(out);
    });
    return { topics: Object.keys(topicMap).map(function (k) { return topicMap[k]; }), terms: terms, skipped: skipped, auto: auto };
  }

  var pending = null;
  function report(html) { $("imp-report").innerHTML = html; }
  function preview() {
    pending = null; $("imp-run").disabled = true;
    try {
      var p = plan(normalise($("imp-text").value));
      pending = p; $("imp-run").disabled = false;
      report('<div class="notice ok"><span>✅</span><span>' + e(SS.t("adm.impReady", { topics: p.topics.length, terms: p.terms.length, newTopics: p.auto })) + "</span></div>" +
        (p.skipped.length ? '<div class="notice"><span>⚠️</span><span>' + e(SS.t("adm.impSkipped", { n: p.skipped.length })) + "<br>" + p.skipped.slice(0, 12).map(e).join("<br>") + (p.skipped.length > 12 ? "<br>…" : "") + "</span></div>" : ""));
    } catch (err) { report('<div class="notice bad"><span>⚠️</span><span>' + e(err.message) + "</span></div>"); }
    return pending;
  }

  async function runImport(p) {
    report('<div class="notice info"><span class="spinner"></span><span>' + e(SS.t("adm.impWorking")) + "</span></div>");
    $("imp-run").disabled = true;
    try {
      if (p.topics.length) {
        var t = await sb.from("topics").upsert(p.topics, { onConflict: "slug" });
        if (t.error) throw t.error;
      }
      var fresh = await sb.from("topics").select("id, slug");
      if (fresh.error) throw fresh.error;
      var ids = {}; fresh.data.forEach(function (r) { ids[r.slug] = r.id; });
      var now = new Date().toISOString();
      var rows = p.terms.filter(function (r) { return ids[r._topic]; }).map(function (r) {
        var out = { slug: r.slug, topic_id: ids[r._topic], updated_at: now };
        TERM_FIELDS.forEach(function (f) { out[f] = r[f]; });
        return out;
      });
      for (var i = 0; i < rows.length; i += 200) {
        var res = await sb.from("terms").upsert(rows.slice(i, i + 200), { onConflict: "slug" });
        if (res.error) throw res.error;
      }
      pending = null;
      await loadAll();
      return { topics: p.topics.length, terms: rows.length };
    } catch (err) {
      console.error(err);
      report('<div class="notice bad"><span>⚠️</span><span>' + e(SS.t("adm.impFail", { msg: err.message || String(err) })) + "</span></div>");
      return null;
    }
  }

  $("imp-preview").addEventListener("click", preview);
  $("imp-text").addEventListener("input", function () { pending = null; $("imp-run").disabled = true; });
  $("imp-run").addEventListener("click", async function () {
    var p = pending || preview(); if (!p) return;
    var done = await runImport(p);
    if (done) { report('<div class="notice ok"><span>🎉</span><span>' + e(SS.t("adm.impDone", done)) + "</span></div>"); SS.toast(SS.t("adm.impDone", done), "ok"); }
  });
  $("imp-file-btn").addEventListener("click", function () { $("imp-file").click(); });
  $("imp-file").addEventListener("change", function () {
    var f = $("imp-file").files[0]; if (!f) return;
    var reader = new FileReader();
    reader.onload = function () { $("imp-text").value = String(reader.result); $("imp-file-name").textContent = f.name; preview(); };
    reader.readAsText(f, "utf-8");
    $("imp-file").value = "";
  });

  var SAMPLE = {
    topics: [
      { slug: "cloud-security", name_en: "Cloud Security", name_az: "Bulud Təhlükəsizliyi", description_en: "Protecting data and services that run in the cloud.", description_az: "Buludda işləyən məlumat və xidmətlərin qorunması.", icon: "☁️", track: "network-defense", sort_order: 10 }
    ],
    terms: [
      { topic: "cloud-security", term_en: "Shared responsibility model", term_az: "Paylaşılan məsuliyyət modeli",
        summary_en: "The cloud provider secures the infrastructure; the customer secures what they put on it.", summary_az: "Bulud provayderi infrastrukturu, müştəri isə ora yerləşdirdiyini qoruyur.",
        content_en: "## Who secures what\n\n- **Provider:** data centres, hardware, the virtualisation layer.\n- **Customer:** accounts, access rules, data, configuration.\n\nMost cloud breaches come from customer-side misconfiguration.",
        content_az: "## Kim nəyi qoruyur\n\n- **Provayder:** data mərkəzləri, avadanlıq, virtuallaşdırma qatı.\n- **Müştəri:** hesablar, giriş qaydaları, məlumatlar, konfiqurasiya.\n\nBulud sızmalarının çoxu müştəri tərəfindəki yanlış konfiqurasiyadan qaynaqlanır.",
        example_en: "A storage bucket left public exposes customer files even though the provider's platform was never breached.", example_az: "Açıq qalmış yaddaş qovluğu provayderin platforması sındırılmasa belə müştəri fayllarını ifşa edir." },
      { topic: "cloud-security", term_en: "IAM", term_az: "IAM",
        summary_en: "Identity and Access Management: deciding who can do what with which resource.", summary_az: "İdentiklik və girişin idarə edilməsi: kimin hansı resursla nə edə biləcəyini müəyyən edir.",
        content_en: "IAM combines **identities** (users, services), **roles** and **policies**. Follow the principle of least privilege: grant only the access a task needs.",
        content_az: "IAM **identikləri** (istifadəçilər, xidmətlər), **rolları** və **siyasətləri** birləşdirir. Ən az imtiyaz prinsipinə əməl edin: yalnız tapşırığın tələb etdiyi girişi verin.",
        example_en: "A backup script gets a role that can only write to one bucket, not read the whole account.", example_az: "Ehtiyat nüsxə skriptinə bütün hesabı oxumaq yox, yalnız bir qovluğa yazmaq icazəsi olan rol verilir." }
    ]
  };
  function csvCell(v) { v = String(v === undefined || v === null ? "" : v); return /[",\n\r;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  $("tpl-json").addEventListener("click", function () { SS.download("syntaxsec-terms-template.json", JSON.stringify(SAMPLE, null, 2), "application/json;charset=utf-8"); });
  $("tpl-csv").addEventListener("click", function () {
    var head = ["topic_slug", "topic_name_en", "topic_name_az"].concat(TERM_FIELDS), topic = SAMPLE.topics[0];
    var lines = [head.join(",")].concat(SAMPLE.terms.map(function (t) {
      return [topic.slug, topic.name_en, topic.name_az].concat(TERM_FIELDS.map(function (f) { return t[f]; })).map(csvCell).join(",");
    }));
    SS.download("syntaxsec-terms-template.csv", "﻿" + lines.join("\r\n"), "text/csv;charset=utf-8");
  });

  $("starter-run").addEventListener("click", async function () {
    var btn = $("starter-run"); btn.disabled = true;
    try {
      var files = await Promise.all([fetch("data/glossary.json").then(function (r) { return r.json(); }), fetch("data/articles.json").then(function (r) { return r.json(); })]);
      var done = await runImport(plan({ topics: files[0].topics || [], terms: files[0].terms || [] }));
      if (!done) return;
      var have = {}; data.blogs.forEach(function (b) { have[b.title_en] = true; });
      var posts = files[1].filter(function (p) { return !have[p.title_en]; }).map(function (p) {
        return { title_en: p.title_en, title_az: p.title_az, tag_en: p.tag_en, tag_az: p.tag_az, summary_en: p.summary_en, summary_az: p.summary_az,
          content_en: p.content_en, content_az: p.content_az, published: true, author_id: SS.auth.user.id, created_at: new Date(p.date).toISOString() };
      });
      if (posts.length) { var res = await sb.from("blogs").insert(posts); if (res.error) throw res.error; await loadAll(); }
      report('<div class="notice ok"><span>🎉</span><span>' + e(SS.t("adm.impDone", done)) + " " + e(SS.t("adm.impBlogs", { n: posts.length })) + "</span></div>");
      SS.toast(SS.t("adm.impDone", done), "ok");
    } catch (err) {
      console.error(err);
      report('<div class="notice bad"><span>⚠️</span><span>' + e(err && err.message ? SS.t("adm.impFail", { msg: err.message }) : SS.t("adm.starterFail")) + "</span></div>");
    } finally { btn.disabled = false; }
  });

  document.addEventListener("langchange", renderAll);
  SS._admin = { parseCsv: parseCsv, normalise: normalise, plan: plan, data: data };

  SS.auth.ready.then(function () { if (SS.auth.isAdmin() && sb) loadAll(); });
})();
