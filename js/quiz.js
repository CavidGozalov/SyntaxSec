/* SyntaxSec — quiz.html: "Spot the Fake" phishing quiz (10 bilingual questions). */
(function () {
  "use strict";
  var SS = window.SS;
  SS.addStrings({
    en: {
      "quiz.title": "Spot the Fake", "quiz.h1": "Spot the Fake",
      "quiz.lead": "Ten emails and SMS messages. Some are genuine, some are scams. Decide for each one, then see what gave it away.",
      "quiz.note": "Company names, addresses and people in this quiz are invented for training.",
      "quiz.start": "Start the quiz", "quiz.intro": "Read each message the way you would on your own phone. Look at the sender, the link and what it asks you to do.",
      "quiz.best": "Your best score: {s}", "quiz.q": "Message {n} of {total}", "quiz.email": "Email", "quiz.sms": "SMS",
      "quiz.from": "From", "quiz.subject": "Subject", "quiz.context": "Situation",
      "quiz.phish": "🎣 Phishing", "quiz.legit": "✅ Legit", "quiz.right": "Correct", "quiz.wrong": "Not quite",
      "quiz.wasPhish": "This one is phishing.", "quiz.wasLegit": "This one is legitimate.",
      "quiz.next": "Next message", "quiz.finish": "See my score", "quiz.doneH": "You scored {s} out of {total}",
      "quiz.r0": "Scammers would have a good day. Review the explanations below and try again.",
      "quiz.r1": "A solid start. A few tells slipped past — check the ones marked in red.",
      "quiz.r2": "Sharp eyes. You caught almost everything.", "quiz.r3": "Perfect score. You read the sender and the link before the message.",
      "quiz.again": "Play again", "quiz.review": "Review", "quiz.learn": "Read about phishing", "quiz.checker": "Open the Phishing Mail Checker",
      "quiz.yourAnswer": "Your answer: {a}"
    },
    az: {
      "quiz.title": "Saxtanı tap", "quiz.h1": "Saxtanı tap",
      "quiz.lead": "On e-poçt və SMS mesajı. Bəziləri həqiqidir, bəziləri fırıldaq. Hər biri üçün qərar ver, sonra onu nəyin ələ verdiyinə bax.",
      "quiz.note": "Bu viktorinadakı şirkət adları, ünvanlar və şəxslər təlim məqsədilə uydurulub.",
      "quiz.start": "Viktorinaya başla", "quiz.intro": "Hər mesajı öz telefonunda oxuduğun kimi oxu. Göndərənə, keçidə və səndən nə tələb olunduğuna bax.",
      "quiz.best": "Ən yaxşı nəticən: {s}", "quiz.q": "Mesaj {n} / {total}", "quiz.email": "E-poçt", "quiz.sms": "SMS",
      "quiz.from": "Kimdən", "quiz.subject": "Mövzu", "quiz.context": "Vəziyyət",
      "quiz.phish": "🎣 Fişinq", "quiz.legit": "✅ Həqiqi", "quiz.right": "Düzdür", "quiz.wrong": "Tam yox",
      "quiz.wasPhish": "Bu, fişinqdir.", "quiz.wasLegit": "Bu, həqiqi mesajdır.",
      "quiz.next": "Növbəti mesaj", "quiz.finish": "Nəticəmə bax", "quiz.doneH": "{total} sualdan {s} düzgün cavab",
      "quiz.r0": "Fırıldaqçılar üçün yaxşı gün olardı. Aşağıdakı izahları oxu və yenidən cəhd et.",
      "quiz.r1": "Yaxşı başlanğıcdır. Bir neçə əlamət gözdən qaçıb — qırmızı ilə işarələnənlərə bax.",
      "quiz.r2": "Diqqətlisən. Demək olar ki, hamısını tutdun.", "quiz.r3": "Mükəmməl nəticə. Mesajdan əvvəl göndərəni və keçidi oxuyursan.",
      "quiz.again": "Yenidən oyna", "quiz.review": "İcmal", "quiz.learn": "Fişinq haqqında oxu", "quiz.checker": "Fişinq Məktub Yoxlayıcısını aç",
      "quiz.yourAnswer": "Sənin cavabın: {a}"
    }
  });

  var QUESTIONS = [
    { type: "email", phishing: true,
      en: { from: "Sama Bank Security <security@sama-bank-az.com>", subject: "Your card has been blocked", body: "Dear customer,\n\nWe noticed suspicious activity and blocked your card. Confirm your identity within 24 hours or the card will be closed permanently.\n\nRestore access: http://sama-bank.verify-kart.top/login", why: "The bank’s real site would be on its own .az domain, not “sama-bank-az.com” or “verify-kart.top”. Add the 24-hour threat, the generic greeting and the plain-HTTP link, and it is a classic card-blocking scam." },
      az: { from: "Səma Bank Təhlükəsizlik <security@sama-bank-az.com>", subject: "Kartınız bloklanıb", body: "Hörmətli müştəri,\n\nŞübhəli fəaliyyət aşkar etdik və kartınızı blokladıq. 24 saat ərzində şəxsiyyətinizi təsdiqləməsəniz, kart həmişəlik bağlanacaq.\n\nGirişi bərpa edin: http://sama-bank.verify-kart.top/login", why: "Bankın əsl saytı “sama-bank-az.com” və ya “verify-kart.top” yox, öz .az domenində olardı. 24 saatlıq hədə, ümumi müraciət və şifrələnməmiş HTTP keçidi də əlavə olunanda bu, klassik “kart bloklanıb” fırıldağıdır." } },
    { type: "sms", phishing: true,
      en: { from: "SuretPost", body: "SuretPost: your parcel is held at the warehouse. Pay the 1.20 AZN customs fee today or it will be returned: suretpost-az.delivery-pay.xyz", why: "Delivery scams ask for a tiny fee so that you type in your card details. The link is on “delivery-pay.xyz”, not the courier’s own site, and the deadline is there to rush you." },
      az: { from: "SuretPost", body: "SuretPost: bağlamanız anbarda saxlanılır. Bu gün 1.20 AZN gömrük rüsumunu ödəyin, əks halda geri göndəriləcək: suretpost-az.delivery-pay.xyz", why: "Çatdırılma fırıldaqları kiçik məbləğ istəyir ki, kart məlumatlarınızı yazasınız. Keçid kuryerin öz saytında yox, “delivery-pay.xyz” domenindədir, vaxt məhdudiyyəti isə sizi tələsdirmək üçündür." } },
    { type: "email", phishing: false,
      en: { context: "You study at this university and use its portal every day.", from: "IT Services <it-services@university.edu.az>", subject: "Planned maintenance on Saturday", body: "Hello,\n\nThe student portal will be unavailable on Saturday from 02:00 to 05:00 while we install updates. You do not need to do anything.\n\nIf you have questions, visit the IT desk in the main building.", why: "It comes from the university’s own domain, asks for nothing, contains no link and sets no deadline. Informational notices like this are normal." },
      az: { context: "Bu universitetdə oxuyursunuz və onun portalından hər gün istifadə edirsiniz.", from: "İT Xidməti <it-services@university.edu.az>", subject: "Şənbə günü planlı texniki işlər", body: "Salam,\n\nYeniləmələr quraşdırıldığı üçün tələbə portalı şənbə günü saat 02:00-dan 05:00-dək işləməyəcək. Sizdən heç bir hərəkət tələb olunmur.\n\nSualınız varsa, əsas binadakı İT masasına yaxınlaşın.", why: "Mesaj universitetin öz domenindən gəlir, heç nə istəmir, keçid yoxdur və vaxt məhdudiyyəti qoymur. Belə məlumat xarakterli bildirişlər normaldır." } },
    { type: "sms", phishing: false,
      en: { context: "Ten seconds ago you pressed “Pay” in an online shop and your bank’s page asked for a code.", from: "SamaBank", body: "SamaBank: code 482913 to confirm 25.00 AZN at BAZAR24. Never share this code with anyone.", why: "You started the payment yourself, the amount and shop match, and the message has no link. One-time codes are safe to type into the page you opened — never to read out to a caller." },
      az: { context: "On saniyə əvvəl onlayn mağazada “Ödə” düyməsini basmısınız və bankınızın səhifəsi kod istəyib.", from: "SamaBank", body: "SamaBank: BAZAR24-də 25.00 AZN ödənişi təsdiqləmək üçün kod 482913. Bu kodu heç kimə deməyin.", why: "Ödənişi özünüz başlatmısınız, məbləğ və mağaza uyğundur, mesajda keçid yoxdur. Birdəfəlik kodu özünüz açdığınız səhifəyə yazmaq təhlükəsizdir — amma onu zəng edən şəxsə heç vaxt deməyin." } },
    { type: "email", phishing: true,
      en: { from: "IT Helpdesk <helpdesk@univercity-portal.com>", subject: "Mailbox 98% full — action required", body: "Dear user,\n\nYour mailbox is almost full and incoming mail will be rejected. Sign in below to add free storage.\n\nKEEP MY MAILBOX: https://univercity-portal.com/owa/signin", why: "“univercity” is misspelled and the domain is not the university’s. A fake storage warning that leads to a sign-in page is one of the most common ways student passwords are stolen." },
      az: { from: "İT Yardım Masası <helpdesk@univercity-portal.com>", subject: "Poçt qutusu 98% doludur — tədbir görün", body: "Hörmətli istifadəçi,\n\nPoçt qutunuz demək olar ki, dolub və gələn məktublar rədd ediləcək. Pulsuz yaddaş əlavə etmək üçün aşağıdan daxil olun.\n\nPOÇT QUTUMU SAXLA: https://univercity-portal.com/owa/signin", why: "“univercity” səhv yazılıb və domen universitetə məxsus deyil. Giriş səhifəsinə aparan saxta yaddaş xəbərdarlığı tələbə parollarının oğurlanmasının ən geniş yayılmış üsullarındandır." } },
    { type: "sms", phishing: true,
      en: { from: "+994 55 000 00 00", body: "Congratulations! Your number won 500 AZN in the BAZAR24 lottery. To receive the prize enter your card number and the 3 digits on the back: bit.ly/b24-prize", why: "You cannot win a lottery you never entered. Receiving money never requires the CVV code, and the shortened link hides where it really goes." },
      az: { from: "+994 55 000 00 00", body: "Təbriklər! Nömrəniz BAZAR24 lotereyasında 500 AZN qazandı. Mükafatı almaq üçün kart nömrənizi və kartın arxasındakı 3 rəqəmi daxil edin: bit.ly/b24-prize", why: "İştirak etmədiyiniz lotereyada qazana bilməzsiniz. Pul almaq üçün heç vaxt CVV kodu tələb olunmur, qısaldılmış keçid isə əsl ünvanı gizlədir." } },
    { type: "email", phishing: false,
      en: { context: "Yesterday you ordered headphones from this shop.", from: "Bazar24 Orders <orders@bazar24.az>", subject: "Order #48213 has shipped", body: "Hello Kamran,\n\nYour order #48213 (wireless headphones, 1 pc) left our warehouse today. Delivery is expected within 2 working days.\n\nTrack it in your account: https://bazar24.az/orders/48213\n\nThank you for shopping with us.", why: "It matches an order you really made, uses your name, links to the shop’s own HTTPS domain and does not ask for payment or a password." },
      az: { context: "Dünən bu mağazadan qulaqlıq sifariş etmisiniz.", from: "Bazar24 Sifarişlər <orders@bazar24.az>", subject: "#48213 nömrəli sifariş yola salındı", body: "Salam Kamran,\n\n#48213 nömrəli sifarişiniz (simsiz qulaqlıq, 1 ədəd) bu gün anbarımızdan çıxdı. Çatdırılma 2 iş günü ərzində gözlənilir.\n\nHesabınızda izləyin: https://bazar24.az/orders/48213\n\nBizi seçdiyiniz üçün təşəkkür edirik.", why: "Mesaj həqiqətən verdiyiniz sifarişə uyğundur, adınızla müraciət edir, mağazanın öz HTTPS domeninə aparır və ödəniş, yaxud parol istəmir." } },
    { type: "email", phishing: true,
      en: { from: "Prof. R. Aliyev <prof.aliyev.office@gmail.com>", subject: "Quick favour — are you available?", body: "Hi,\n\nI am in a meeting and cannot talk. I need you to buy 4 gift cards of 50 AZN each for a guest speaker right now and send me photos of the codes. I will pay you back this evening. Please keep this between us.", why: "A request for gift cards, sent from a free mailbox, with urgency and secrecy, is an impersonation scam. Check with the person through a channel you already use." },
      az: { from: "Prof. R. Əliyev <prof.aliyev.office@gmail.com>", subject: "Kiçik xahiş — müsaitsən?", body: "Salam,\n\nİclasdayam, danışa bilmirəm. Qonaq məruzəçi üçün dərhal hərəsi 50 AZN olan 4 hədiyyə kartı almağın və kodların şəklini mənə göndərməyin lazımdır. Axşam pulunu qaytaracağam. Xahiş edirəm, bu, aramızda qalsın.", why: "Pulsuz poçt qutusundan göndərilən, tələsdirən və gizli saxlamağı xahiş edən hədiyyə kartı tələbi başqasının adından yazılmış fırıldaqdır. Həmin şəxslə artıq istifadə etdiyiniz kanal vasitəsilə yoxlayın." } },
    { type: "sms", phishing: true,
      en: { from: "E-PORTAL", body: "A one-time social payment of 250 AZN has been assigned to you. To receive it, register your card within today: sosial-odenis.info/kart", why: "Government payments are not handed out through an SMS link on a “.info” site, and they do not require you to “register” a card the same day. The goal is your card data." },
      az: { from: "E-PORTAL", body: "Sizə 250 AZN birdəfəlik sosial ödəniş təyin olunub. Almaq üçün bu gün ərzində kartınızı qeydiyyatdan keçirin: sosial-odenis.info/kart", why: "Dövlət ödənişləri “.info” saytındakı SMS keçidi ilə paylanmır və kartı həmin gün “qeydiyyatdan keçirməyi” tələb etmir. Məqsəd kart məlumatlarınızı əldə etməkdir." } },
    { type: "email", phishing: false,
      en: { context: "Two minutes ago you changed your password in the app’s settings.", from: "Notely Accounts <accounts@notely.app>", subject: "Your password was changed", body: "Hi Aysel,\n\nThe password for your Notely account was changed today at 14:02 from a device in Baku.\n\nIf this was you, no action is needed. If it was not, open the app, go to Settings › Security and choose “Sign out of all devices”.\n\nWe will never ask for your password by email.", why: "It confirms something you just did, contains no link, and tells you to go to the app yourself. Security notices that ask for nothing are a good sign." },
      az: { context: "İki dəqiqə əvvəl tətbiqin parametrlərində parolunuzu dəyişmisiniz.", from: "Notely Hesablar <accounts@notely.app>", subject: "Parolunuz dəyişdirildi", body: "Salam Aysel,\n\nNotely hesabınızın parolu bu gün saat 14:02-də Bakıdakı cihazdan dəyişdirildi.\n\nBunu siz etmisinizsə, heç nə etməyə ehtiyac yoxdur. Siz etməmisinizsə, tətbiqi açın, Parametrlər › Təhlükəsizlik bölməsinə keçin və “Bütün cihazlardan çıx” seçin.\n\nBiz heç vaxt e-poçt vasitəsilə parolunuzu istəmirik.", why: "Mesaj indicə etdiyiniz hərəkəti təsdiqləyir, keçid yoxdur və tətbiqə özünüzün daxil olmağınızı deyir. Heç nə istəməyən təhlükəsizlik bildirişləri yaxşı əlamətdir." } }
  ];

  var root = document.getElementById("quiz-root");
  var state = { stage: "intro", order: [], index: 0, answers: [] };

  function shuffle(arr) { for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
  function best() { try { return localStorage.getItem("ss-quiz-best"); } catch (e) { return null; } }
  function saveBest(score) {
    try {
      var prev = parseInt((best() || "0").split("/")[0], 10) || 0;
      if (score >= prev) localStorage.setItem("ss-quiz-best", score + "/" + QUESTIONS.length);
    } catch (e) {}
  }

  function messageHtml(q) {
    var d = q[SS.lang], e = SS.esc;
    return (d.context ? '<div class="notice info" style="margin-bottom:12px"><span>🧭</span><span><strong>' + e(SS.t("quiz.context")) + ":</strong> " + e(d.context) + "</span></div>" : "") +
      '<div class="msg ' + q.type + '"><div class="msg-head"><span class="badge plain">' + (q.type === "sms" ? "💬 " : "✉️ ") + e(SS.t("quiz." + q.type)) + "</span>" +
      '<div class="from" style="margin-top:8px">' + e(SS.t("quiz.from")) + ": " + e(d.from) + "</div>" + (d.subject ? "<b>" + e(d.subject) + "</b>" : "") + "</div>" +
      '<div class="msg-body">' + e(d.body) + "</div></div>";
  }

  function render() {
    var e = SS.esc, total = QUESTIONS.length;
    if (state.stage === "intro") {
      var b = best();
      root.innerHTML = '<div class="panel center"><div style="font-size:3rem">🕵️</div><p style="max-width:48ch;margin:10px auto 18px">' + e(SS.t("quiz.intro")) + "</p>" +
        (b ? '<p class="badge mint" style="margin-bottom:16px">' + e(SS.t("quiz.best", { s: b })) + "</p><br>" : "") +
        '<button class="btn lg" type="button" data-quiz="start">' + e(SS.t("quiz.start")) + "</button></div>";
      return;
    }
    if (state.stage === "play") {
      var q = QUESTIONS[state.order[state.index]], answered = state.answers[state.index] !== undefined;
      var steps = state.order.map(function (_, i) {
        var a = state.answers[i]; return '<i class="' + (a === undefined ? (i === state.index ? "now" : "") : a ? "ok" : "bad") + '"></i>';
      }).join("");
      var html = '<div class="row between small dim" style="margin-bottom:8px"><span>' + e(SS.t("quiz.q", { n: state.index + 1, total: total })) + '</span></div><div class="steps" style="margin-bottom:18px">' + steps + "</div>" + messageHtml(q);
      if (!answered) {
        html += '<div class="quiz-opts"><button class="btn danger" type="button" data-answer="1">' + e(SS.t("quiz.phish")) + '</button><button class="btn on" type="button" data-answer="0">' + e(SS.t("quiz.legit")) + "</button></div>";
      } else {
        var ok = state.answers[state.index], last = state.index === total - 1;
        html += '<div class="verdict ' + (ok ? "ok" : "bad") + '" style="margin-top:16px;align-items:flex-start"><span class="big">' + (ok ? "🎯" : "🤔") + "</span><div><h3>" + e(SS.t(ok ? "quiz.right" : "quiz.wrong")) + " — " +
          e(SS.t(q.phishing ? "quiz.wasPhish" : "quiz.wasLegit")) + '</h3><p style="color:var(--ink)">' + e(q[SS.lang].why) + "</p></div></div>" +
          '<div class="row" style="margin-top:16px;justify-content:flex-end"><button class="btn" type="button" data-quiz="next">' + e(SS.t(last ? "quiz.finish" : "quiz.next")) + "</button></div>";
      }
      root.innerHTML = html;
      return;
    }
    var score = state.answers.filter(Boolean).length, pct = Math.round(score / total * 100);
    var remark = score === total ? "quiz.r3" : score >= total * 0.8 ? "quiz.r2" : score >= total * 0.5 ? "quiz.r1" : "quiz.r0";
    root.innerHTML = '<div class="panel center"><div class="score-ring" style="--p:' + pct + '"><span>' + score + "/" + total + "</span></div><h2>" + e(SS.t("quiz.doneH", { s: score, total: total })) + '</h2><p class="dim">' + e(SS.t(remark)) + "</p>" +
      '<div class="row" style="justify-content:center"><button class="btn" type="button" data-quiz="start">' + e(SS.t("quiz.again")) + '</button><a class="btn ghost" href="modules.html?q=phishing">' + e(SS.t("quiz.learn")) +
      '</a><a class="btn ghost" href="phishing-checker.html">' + e(SS.t("quiz.checker")) + "</a></div></div>" +
      '<h2 style="margin-top:30px">' + e(SS.t("quiz.review")) + '</h2><ul class="flags">' + state.order.map(function (qi, i) {
        var q = QUESTIONS[qi], d = q[SS.lang];
        return '<li class="' + (state.answers[i] ? "ok" : "bad") + '"><b>' + (i + 1) + ". " + e(d.subject || d.from) + " — " + e(SS.t(q.phishing ? "quiz.wasPhish" : "quiz.wasLegit")) + "</b><span>" + e(d.why) + "</span></li>";
      }).join("") + "</ul>";
  }

  root.addEventListener("click", function (ev) {
    var a = ev.target.closest("[data-answer]"), c = ev.target.closest("[data-quiz]");
    if (a && state.stage === "play" && state.answers[state.index] === undefined) {
      var q = QUESTIONS[state.order[state.index]];
      var ok = (a.getAttribute("data-answer") === "1") === q.phishing;
      state.answers[state.index] = ok;
      render();
      var v = root.querySelector(".verdict"); if (v) { v.classList.add(ok ? "pop" : "shake"); v.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
      return;
    }
    if (!c) return;
    if (c.getAttribute("data-quiz") === "start") {
      state = { stage: "play", order: shuffle(QUESTIONS.map(function (_, i) { return i; })), index: 0, answers: [] };
    } else if (state.index < QUESTIONS.length - 1) state.index++;
    else { state.stage = "done"; saveBest(state.answers.filter(Boolean).length); }
    render();
    root.scrollIntoView({ block: "start", behavior: "smooth" });
  });
  document.addEventListener("langchange", render);
  render();
})();
