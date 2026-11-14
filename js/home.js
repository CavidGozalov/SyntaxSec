/* SyntaxSec — landing page (index.html): copy + the quick password probe. */
(function () {
  "use strict";
  var SS = window.SS;
  SS.addStrings({
    en: {
      "home.title": "Welcome",
      "home.badge": "Free for students · English and Azerbaijani",
      "home.h1": "Learn to spot the attack before it lands.",
      "home.lead": "SyntaxSec is an interactive cybersecurity and IT learning platform. Look up any term, follow a guided roadmap, and practise with tools that audit passwords, inspect links and flag phishing emails — right in your browser.",
      "home.haveAccount": "I already have an account",
      "home.f1": "Searchable glossary with deep dives", "home.f2": "Progress saved to your account", "home.f3": "Passwords never leave your device",
      "home.probeLabel": "Try it: type a password. It stays in this tab.", "home.probePh": "e.g. Baku2024!",
      "home.probeIdle": "Start typing to see a quick estimate.",
      "home.probeMore": "The full Password Audit inside adds zxcvbn pattern detection, crack-time estimates and a private breach check.",
      "home.v0": "Very weak", "home.v1": "Weak", "home.v2": "Fair", "home.v3": "Strong", "home.v4": "Excellent",
      "home.whyCommon": "This is one of the first passwords attackers try.",
      "home.whyShort": "Short passwords fall quickly. Aim for 12 characters or more.",
      "home.whyPattern": "It contains a keyboard run, a sequence or a year — attackers test those early.",
      "home.whyVariety": "Longer is better: adding a few unrelated words helps more than one extra symbol.",
      "home.whyGood": "Long and varied. Check it against breach data in the full audit.",
      "home.insideH": "What you get inside",
      "home.insideP": "One account opens the learning hub and every tool. Pick a card to create your account and start there.",
      "home.c1h": "Learn hub", "home.c1p": "Topics, short explanations and full deep-dive pages for every term, with bookmarks and a mastered tracker.",
      "home.c2h": "Roadmaps", "home.c2p": "Beginner-to-advanced study tracks with progress bars: Digital Hygiene 101, Web Security Basics, Network Defense.",
      "home.c3h": "Password Audit", "home.c3p": "Realistic strength analysis, breach lookup with k-anonymity, and a password and passphrase generator.",
      "home.c4h": "Phishing Mail Checker", "home.c4p": "Paste an email or upload a screenshot and get the red flags explained one by one.",
      "home.c5h": "Spot the Fake quiz", "home.c5p": "Ten real-looking emails and SMS messages, including local bank and delivery scams. Phishing or legit?",
      "home.c6h": "Student lab tools", "home.c6p": "Link Inspector, Hash and Encoding Playground, and a live TOTP simulator that shows how 2FA codes work.",
      "home.howH": "How it works",
      "home.s1h": "Create a free account", "home.s1p": "Pick a username, enter your email and a password. That is all we ask for.",
      "home.s2h": "Follow a roadmap", "home.s2p": "Open topics, read the short explanation, then the deep dive. Mark terms as mastered as you go.",
      "home.s3h": "Practise on real cases", "home.s3p": "Audit a password, take a link apart, check a suspicious email and test yourself with the quiz."
    },
    az: {
      "home.title": "Xoş gəldiniz",
      "home.badge": "Tələbələr üçün pulsuz · İngilis və Azərbaycan dillərində",
      "home.h1": "Hücumu baş verməmişdən əvvəl tanımağı öyrən.",
      "home.lead": "SyntaxSec kibertəhlükəsizlik və İT üzrə interaktiv öyrənmə platformasıdır. İstənilən termini axtar, hazır yol xəritəsi ilə irəlilə və parolları yoxlayan, keçidləri təhlil edən, fişinq məktublarını aşkarlayan alətlərlə birbaşa brauzerində məşq et.",
      "home.haveAccount": "Artıq hesabım var",
      "home.f1": "Ətraflı izahlı axtarışlı lüğət", "home.f2": "İrəliləyiş hesabında saxlanılır", "home.f3": "Parollar cihazını tərk etmir",
      "home.probeLabel": "Yoxla: bir parol yaz. O, bu vərəqdən kənara çıxmır.", "home.probePh": "məs. Baku2024!",
      "home.probeIdle": "Sürətli qiymətləndirmə üçün yazmağa başla.",
      "home.probeMore": "İçəridəki tam Parol Auditi zxcvbn nümunə aşkarlaması, sındırılma müddəti və məxfi sızma yoxlaması əlavə edir.",
      "home.v0": "Çox zəif", "home.v1": "Zəif", "home.v2": "Orta", "home.v3": "Güclü", "home.v4": "Əla",
      "home.whyCommon": "Bu, hücumçuların ilk yoxladığı parollardan biridir.",
      "home.whyShort": "Qısa parollar tez sındırılır. Ən azı 12 simvol hədəflə.",
      "home.whyPattern": "Klaviatura ardıcıllığı, sıra və ya il var — hücumçular bunları erkən yoxlayır.",
      "home.whyVariety": "Uzun olması daha yaxşıdır: bir əlavə simvoldan çox, bir neçə əlaqəsiz söz kömək edir.",
      "home.whyGood": "Uzun və müxtəlifdir. Tam auditdə sızma məlumatları ilə də yoxla.",
      "home.insideH": "İçəridə nələr var",
      "home.insideP": "Bir hesab həm öyrənmə mərkəzini, həm də bütün alətləri açır. Hesab yaradıb başlamaq üçün kart seç.",
      "home.c1h": "Öyrənmə mərkəzi", "home.c1p": "Mövzular, qısa izahlar və hər termin üçün ətraflı səhifə; əlfəcinlər və mənimsəmə izləyicisi ilə.",
      "home.c2h": "Yol xəritələri", "home.c2p": "Başlanğıcdan irəli səviyyəyə qədər irəliləyiş zolaqlı təlim trekləri: Rəqəmsal Gigiyena 101, Veb Təhlükəsizliyinin Əsasları, Şəbəkə Müdafiəsi.",
      "home.c3h": "Parol Auditi", "home.c3p": "Real güc təhlili, k-anonimlik ilə sızma yoxlaması, parol və parol-ifadə generatoru.",
      "home.c4h": "Fişinq Məktub Yoxlayıcısı", "home.c4p": "Məktubun mətnini yapışdır və ya ekran şəklini yüklə — şübhəli əlamətlər bir-bir izah olunur.",
      "home.c5h": "“Saxtanı tap” viktorinası", "home.c5p": "Yerli bank və çatdırılma fırıldaqları daxil, real görünən on e-poçt və SMS. Fişinqdir, yoxsa həqiqi?",
      "home.c6h": "Tələbə laboratoriya alətləri", "home.c6p": "Keçid Müfəttişi, Heş və Kodlaşdırma Laboratoriyası və 2FA kodlarının necə işlədiyini göstərən canlı TOTP simulyatoru.",
      "home.howH": "Necə işləyir",
      "home.s1h": "Pulsuz hesab yarat", "home.s1p": "İstifadəçi adı seç, e-poçtunu və parolunu daxil et. Başqa heç nə tələb olunmur.",
      "home.s2h": "Yol xəritəsi ilə irəlilə", "home.s2p": "Mövzuları aç, qısa izahı, sonra ətraflı səhifəni oxu. Öyrəndikcə terminləri mənimsənilmiş kimi işarələ.",
      "home.s3h": "Real nümunələrdə məşq et", "home.s3p": "Parolu yoxla, keçidi hissələrinə ayır, şübhəli məktubu təhlil et və viktorina ilə özünü sına."
    }
  });

  var input = document.getElementById("probe");
  if (!input) return;
  var segs = SS.$$("#probe-seg i"), verdict = document.getElementById("probe-verdict"), why = document.getElementById("probe-why");
  var COMMON = ["password", "123456", "12345678", "123456789", "qwerty", "abc123", "letmein", "admin", "welcome", "iloveyou", "111111", "azerbaijan", "baku1234", "password1", "qwertyuiop", "1q2w3e4r", "000000"];
  var COLORS = ["var(--coral)", "var(--coral)", "var(--sun)", "var(--mint)", "var(--mint)"];

  function estimate(pw) {
    var lower = pw.toLowerCase();
    var pool = (/[a-z]/.test(pw) ? 26 : 0) + (/[A-Z]/.test(pw) ? 26 : 0) + (/\d/.test(pw) ? 10 : 0) + (/[^A-Za-z0-9]/.test(pw) ? 33 : 0);
    var bits = pw.length * Math.log2(pool || 1);
    var common = COMMON.some(function (w) { return lower === w || (w.length > 5 && lower.indexOf(w) !== -1); });
    var pattern = /(.)\1{2,}/.test(pw) || /(?:19|20)\d{2}/.test(pw) || /qwert|asdf|zxcv|1234|abcd/i.test(pw);
    if (pattern) bits *= 0.65;
    if (common) bits = Math.min(bits, 12);
    var score = bits < 28 ? 0 : bits < 40 ? 1 : bits < 60 ? 2 : bits < 80 ? 3 : 4;
    var reason = common ? "home.whyCommon" : pw.length < 10 ? "home.whyShort" : pattern ? "home.whyPattern" : score < 3 ? "home.whyVariety" : "home.whyGood";
    return { score: score, reason: reason };
  }
  function paint() {
    var pw = input.value;
    if (!pw) {
      segs.forEach(function (s) { s.className = ""; s.style.background = ""; });
      verdict.textContent = SS.t("home.probeIdle"); why.textContent = ""; return;
    }
    var r = estimate(pw);
    segs.forEach(function (s, i) { var on = i <= r.score; s.className = on ? "on" : ""; s.style.background = on ? COLORS[r.score] : ""; });
    verdict.textContent = SS.t("home.v" + r.score);
    verdict.style.color = COLORS[r.score];
    why.textContent = SS.t(r.reason);
  }
  verdict.removeAttribute("data-i18n");
  input.addEventListener("input", paint);
  document.addEventListener("langchange", paint);
  paint();
})();
