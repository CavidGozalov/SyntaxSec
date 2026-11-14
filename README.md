# SyntaxSec

Interactive cybersecurity & IT learning platform — HTML, CSS, vanilla JavaScript and Supabase. English / Azerbaijani.

## Setup (once)

1. **Database** — open Supabase → SQL Editor, paste `supabase-setup.sql`, run it.
2. **Auth** — Supabase → Authentication → URL Configuration: set *Site URL* to the address where the site is served
   (for example `http://localhost:5500`). For classroom use you can switch off *Confirm email* under
   Authentication → Sign In / Providers → Email, so new accounts can log in immediately.
3. **Serve the folder over HTTP** (the pages load JSON files, which does not work from `file://`):
   `python -m http.server 5500` or the VS Code *Live Server* extension.
4. **Register** on `index.html`, then make yourself the admin in the SQL Editor:
   `update public.profiles set role = 'admin' where email = 'YOUR_EMAIL_HERE';`
5. Log in, open **Admin → Bulk import → Load starter content** to fill the library (6 topics, 27 terms, 4 posts).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Welcome page with Login / Register |
| `dashboard.html` | Signed-in home: term of the day, tips, progress, bookmarks |
| `modules.html`, `term-detail.html` | Learn hub and deep-dive term pages |
| `roadmaps.html` | Learning roadmaps with saved progress |
| `password-checker.html` | Password Audit + generator |
| `phishing-checker.html` | Phishing Mail Checker (text or screenshot OCR) |
| `tools.html` | Link Inspector, Hash & Encoding Playground, 2FA guide + TOTP simulator |
| `quiz.html` | "Spot the Fake" quiz |
| `blog.html` | Blog list and posts |
| `admin.html` | Admin-only content management and bulk import |
| `js/i18n.js` | Translations engine (`SS.t`, `SS.L`); each page script registers its own strings |
| `js/auth.js` | Session, profile, page guards. `SS.REQUIRE_LOGIN = false` opens the tools to visitors |
| `js/app.js` | Navbar, footer, helpers, data layer (`SS.db`) |
| `script.js` | Theme toggle and button feedback |
| `data/*.json` | Starter content and offline fallback; `breach-list.json` is the local common-password list |

## Notes

- Roadmaps: a topic joins a roadmap through its **Roadmap** field in Admin → Topics.
- Term and blog content supports light Markdown: `## heading`, `- list`, `**bold**`, `` `code` ``, `[link](https://…)`.
- If the database is unreachable or the tables do not exist yet, the Learn hub and Blog show the bundled sample
  content and keep progress in the browser, with a notice on the page.
