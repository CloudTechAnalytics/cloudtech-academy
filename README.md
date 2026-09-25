# CloudTech Academy

The learning platform of [CloudTech Analytics](https://cloudtech-analytics.vercel.app). It offers practical, self-paced courses in data, analytics and technology. The courses are text-first and free.

Every lesson follows the same steps: **read → understand → practise → apply → assess → earn**. The SQL course comes with a real SQLite database that runs in the browser. Learners can check each exercise answer immediately, and anyone can verify a certificate by its credential ID.

## What's in V1

| Area | Status |
| --- | --- |
| SQL for Data Analysis | Complete: 15 lessons, 36 exercises, a 15-question final assessment and a final project |
| Data Analytics Foundations, Excel for Data Analysis, Power BI Fundamentals | Their curricula are published and marked "coming soon" |
| Accounts, dashboard, progress tracking | ✓ |
| Final assessments (pass mark 70%, unlimited retakes, max 10 attempts an hour) | ✓ Graded in the database |
| Certificates: PNG download, print/PDF, LinkedIn, public `/verify/:id` | ✓ |
| Practice projects plus four downloadable datasets (logistics, sales, legal, HR) | ✓ |
| Admin (`/admin`): courses, modules, lessons (Markdown with preview), assessments, students, submissions, certificates | ✓ |
| SEO: every public page prerendered, sitemap, structured data | ✓ |

## Running it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # typecheck, build, then prerender public pages into dist/
npm run test:content # runs every lesson example and exercise solution against the database
```

Without Supabase keys the Academy runs in **demo mode**:
- A banner says so on every page.
- Accounts and progress are saved in the current browser only.
- The first account created becomes an admin, so the admin area can be tried out.

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
- `sql/NN-slug.md`: lessons. The front matter holds `title`, `minutes` and `summary`.
- `sql/assessment.ts` and `sql/project.ts`: the final assessment and the project.

Lesson Markdown supports three custom code fences:

- ```` ```sql run ````: a runnable example.
- ```` ```exercise ````: JSON with `id`, `prompt`, `starter`, `solution`, `hint`, `required` and `orderMatters`. An answer counts as correct when its result matches the result of `solution`.
- ```` ```quiz ````: JSON questions.

Callouts use `> [!TIP]`, `[!NOTE]`, `[!WARNING]` or `[!BUSINESS]`.

After editing content:

- Run `npm run test:content`.
- Then run `npm run seed` to regenerate `supabase/seed.sql`, and run it again in Supabase. It is safe to re-run because every statement is an upsert.

Lessons edited in `/admin` are stored in the database. The next seed run overwrites a lesson that exists in both places, so choose one place to edit each lesson.

The practice datasets are fictional and are generated with a fixed seed by `npm run datasets`.

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
