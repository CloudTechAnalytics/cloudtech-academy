# CloudTech Academy

The learning platform of [CloudTech Analytics](https://www.cloudtechanalytics.com). It offers practical, self-paced courses in data, analytics and technology. The courses are text-first and free.

Every lesson follows the same steps: **read → understand → practise → apply → assess → earn**. The SQL course comes with a real SQLite database that runs in the browser. Learners can check each exercise answer immediately, and anyone can verify a certificate by its credential ID.

## What's in V1

| Course | Lessons | Practice | Final project |
| --- | --: | --- | --- |
| Data Analytics Foundations | 10 | Answer tasks on real datasets, one SQL taster | Kolanut people review (HR data) |
| Excel for Data Analysis | 11 | Answer tasks: formulas, XLOOKUP, cleaning, pivots | Kolanut sales performance review |
| SQL for Data Analysis | 16 | 36 SQL exercises checked in the browser | Harbourline Freight operations review |
| Power BI Fundamentals | 14 | Answer tasks: Power Query, modelling, DAX, visuals | Ashgrove Chambers practice dashboard |
| Data Modelling | 9 | SQL checks and answer tasks, built around diagrams | Ashgrove Chambers data model |

Each course has a 15-question final assessment (pass mark 70%, options shuffled, graded on the server) and a verifiable certificate.

| Platform | Status |
| --- | --- |
| Accounts, dashboard, progress tracking | ✓ |
| Certificates: PNG download, print/PDF, LinkedIn, public `/verify/:id` | ✓ |
| Practice projects + five downloadable datasets (logistics, sales, messy customer export, HR, legal) | ✓ |
| Admin (`/admin`): courses, modules, lessons (Markdown with preview), assessments, students, submissions, certificates | ✓ |
| SEO: every public page prerendered (60 pages), sitemap, structured data | ✓ |

## Running it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # typecheck, build, then prerender public pages into dist/
npm run test:content # checks every lesson; recomputes every answer from the CSV files
```

Without Supabase keys the Academy runs in **demo mode**:
- A banner says so on every page.
- Accounts and progress are saved in the current browser only.
- When running locally (`npm run dev`), the first account created becomes an admin, so the admin area can be tried out. On the live site nobody becomes an admin this way.

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run [`supabase/migrations/0001_academy.sql`](supabase/migrations/0001_academy.sql).
3. Then run [`supabase/seed.sql`](supabase/seed.sql). It loads the courses, lessons, assessment and project.
4. In **Authentication → URL Configuration**:
   - Set the Site URL to the Academy's address.
   - Add `<address>/update-password` to the redirect URLs. Password reset links use it.
5. Copy `.env.example` to `.env.local` and fill in:
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Project Settings → API.
   - `VITE_SITE_URL`: the public address. It's used in certificate verification links.
6. Sign up on the site, then make yourself an admin in the SQL editor:

   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```

On Vercel, add the same variables under Project Settings → Environment Variables and redeploy.

### Security model

- Row-level security is on for every table.
- Learners can read and write only their own progress.
- Assessment answer keys are readable by admins only. `submit_assessment()` grades attempts on the server.
- Certificates can only be created by `issue_certificate()`. It re-checks every requirement: lessons, required exercises, a passed assessment, the project, and a full name on the profile.
- `verify_certificate()` returns only what is printed on the certificate.
- SQL exercises run in the learner's browser, so exercise completion is recorded on trust. The server-graded assessment is the real gate for a certificate.

## Content

The course content lives in `src/content/`:

- `catalog.ts`: courses, modules, certificate rules.
- `<course>/NN-slug.md` (folders `daf`, `excel`, `sql`, `powerbi`): lessons. The front matter holds `title`, `minutes` and `summary`.
- `<course>/assessment.ts` and `<course>/project.ts`: the final assessment and the project.

Lesson Markdown supports three custom code fences:

- ```` ```sql run ````: a runnable example.
- ```` ```exercise ````: JSON with `id`, `prompt`, `starter`, `solution`, `hint`, `required` and `orderMatters`. An answer counts as correct when its result matches the result of `solution`.
- ```` ```answer ````: a task done in Excel, Sheets or Power BI, checked by its result. JSON with `id`, `prompt`, `answer` (number or text), optional `accept`, `tolerance`, `format` (`naira`, `percent`, `number`, `text`), `hint`, `explanation`, `required`, and `dataset` + `files` for download links. Tasks that use a dataset must include `verify`, a SQL query over the CSV files that reproduces the answer; `npm run test:content` runs it.
- ```` ```dataset ````: a download card, `{ "dataset": "sales", "files": ["orders"] }`.
- ```` ```quiz ````: JSON questions.

Callouts use `> [!TIP]`, `[!NOTE]`, `[!WARNING]` or `[!BUSINESS]`.

After editing content:

- Run `npm run test:content`.
- Then run `npm run seed` to regenerate `supabase/seed.sql`, and run it again in Supabase. It is safe to re-run because every statement is an upsert.

Lessons edited in `/admin` are stored in the database. The next seed run overwrites a lesson that exists in both places, so choose one place to edit each lesson.

**Images.** Lessons use real screenshots of Excel, SQL Server Management Studio and Power BI Desktop (in `public/images/courses/`, annotated with numbered callouts, account names blurred) and diagrams generated by `python scripts/diagrams.py` (SVG). Put an image on its own line, `![Alt text](/images/courses/x.webp "Caption")`, and it renders as a captioned figure. After adding or changing images, run `npm run images` to update their sizes; `npm run test:content` fails if an image is missing, lacks alt text or isn't sized.

The practice datasets are fictional and are generated with fixed seeds by `npm run datasets`. Each dataset has its own seed, so changing one never changes another. Explore them with `node scripts/sql.mjs --data sales "SELECT ..."`.

## Structure

```
src/
  content/        courses, lessons, assessment, project, datasets
  lib/backend/    Backend interface with Supabase and demo (localStorage) implementations
  lib/sql/        sql.js worker, sandbox, and result comparison for exercises
  pages/          public pages, learner pages, auth/, admin/
  components/     layout, lesson renderer, SQL editor parts, certificate artwork
scripts/          prerender, seed builder, content tests, dataset and brand asset generators
supabase/         migration and generated seed
```

Public pages are prerendered to static HTML. Signed-in pages (dashboard, admin, assessment, certificate, verification, sign-in) are served from `app.html` via the rewrites in `vercel.json`.
