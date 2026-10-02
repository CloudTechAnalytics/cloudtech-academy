# CloudTech Academy

The learning platform of [CloudTech Analytics](https://www.cloudtechanalytics.com). It offers practical, self-paced courses in data, analytics and technology, text-first.

**Learn free. Earn badges free. The official certificate is optional.**

- Every course, lesson and assessment is free.
- Short courses are made of 15–30 minute modules. Passing a module's check earns its badge.
- Passing the final assessment earns the free course completion badge.
- Every badge is a credential with an ID (`CTA-PROMPT-8F72K`) and a public page at `/credentials/:id`.
- After completing a course, a learner can optionally buy the official PDF certificate (₦3,000 or $7, set by admins). It has a certificate number (`CTA-CERT-2026-000124`) and a QR code that opens `/verify/:id`.

## What's in V1

| Short course | Modules (each with a check and a badge) |
| --- | --- |
| AI Productivity Fundamentals | Prompting Essentials, Using Claude, Using ChatGPT, Presentations with AI |
| Design & Content Essentials | Social Media Content with AI, Design with Canva, Video Editing with CapCut |
| Career Essentials | Build a CV with AI, A Professional LinkedIn Profile, Quick Excel Analysis |
| ChatGPT & AI for Students | AI Fundamentals for Students, Study Smarter with AI, Research with AI, Writing with AI Honestly |
| Research Skills for Students | Search Like a Pro, Judge Your Sources, Cite and Organise Your Sources |
| Build Your Student Portfolio | Plan Your Portfolio, Show Your Work, Build Your Portfolio Page, Share Your Work on LinkedIn |
| Git & GitHub for Beginners | What Git and GitHub Are, Your First Repository, Show Your Projects on GitHub |
| Web Development for Beginners | HTML, CSS, JavaScript, Publish Your First Website |
| Python for Beginners | First Steps in Python, Decisions Lists and Loops, Functions and a Mini Project |
| Python for Data Analysis | Load and Explore Data, Clean Filter and Calculate, Group Join and Chart |
| Digital Skills for Students | Files and Cloud Storage, Google Workspace for Students, Professional Email, Stay Safe Online |
| Get Your First Internship | Get Ready, Find Opportunities (Including Remote), Apply and Stand Out, Ace the Interview |
| Freelancing for Beginners | Choose Your Skill and Offer, Find Clients and Get Paid, Price and Pitch, Deliver and Get Reviews |

Each short course ends with an 8-question final assessment.

**Student Starter** (`/students`) lists 25 skills for students, grouped by theme. Each links to a whole course or to a single module of one (for example, AI prompting is the first module of AI Productivity Fundamentals). The list is in `src/pages/Students.tsx`.

| Full course | Lessons | Practice | Final project |
| --- | --: | --- | --- |
| Data Analytics Foundations | 10 | Answer tasks on real datasets, one SQL taster | Kolanut people review (HR data) |
| Excel for Data Analysis | 11 | Answer tasks: formulas, XLOOKUP, cleaning, pivots | Kolanut sales performance review |
| SQL for Data Analysis | 16 | 36 SQL exercises checked in the browser | Harbourline Freight operations review |
| Power BI Fundamentals | 14 | Answer tasks: Power Query, modelling, DAX, visuals | Ashgrove Chambers practice dashboard |
| Data Modelling | 9 | SQL checks and answer tasks, built around diagrams | Ashgrove Chambers data model |

Each full course has a 15-question final assessment. Every assessment has a pass mark of 60%, shuffled options, and is graded on the server.

| Platform | Status |
| --- | --- |
| Accounts, dashboard, progress tracking | ✓ |
| Module badges and course completion badges with public credential pages and sharing (LinkedIn, WhatsApp, Facebook, X, copy link, image) | ✓ |
| Optional official certificate: order, payment (simulated in demo mode; bank transfer + admin grant until a provider is connected), PDF with QR code, `/verify/:id` | ✓ |
| Practice projects (`/projects`, one page each at `/projects/:id`): brief, questions, data dictionary with column types and previews, starter code, ZIP downloads; five datasets (logistics, sales, messy customer export, HR, legal) | ✓ |
| Project badges: learners submit a link to their work, a summary and 4–5 key numbers, graded on the server; all right earns a project badge with the work linked on their credential page and profile. Admins can mark work "Reviewed by CloudTech" (`/admin/practice`) | ✓ |
| Admin (`/admin`): courses, modules and module badges, lessons, module checks and final assessments, students, submissions, credentials (search, revoke), certificate purchases (grant, email, CSV), pricing per currency | ✓ |
| Public skills profile (`/learners/:slug`): off by default; the learner picks the address and a headline in their profile, and the page lists their valid badges and certificates, never their email | ✓ |
| SEO: every public page prerendered, sitemap, structured data | ✓ |

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
2. In **SQL Editor**, run [`supabase/migrations/0001_academy.sql`](supabase/migrations/0001_academy.sql), then [`0002_public_profiles.sql`](supabase/migrations/0002_public_profiles.sql) and [`0003_project_badges.sql`](supabase/migrations/0003_project_badges.sql).
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
- Module badges are only created by `claim_module_badge()`, after a passed module check.
- Course completion credentials are only created by `issue_course_credential()`. It re-checks every requirement the course sets: module badges, lessons, required exercises, a passed final assessment, the project, and a full name on the profile.
- A learner can only start an order (`start_certificate_order()`) for a course they've completed, at the price stored in `certificate_prices`.
- Official certificates are only issued for an order that is paid or granted: by `complete_certificate_order()`, which only the payment server (service role) can call, or by an admin with `admin_grant_certificate()`.
- `verify_credential()` and `verify_certificate()` return only what is printed on the badge or certificate, never an email.
- SQL exercises run in the learner's browser, so exercise completion is recorded on trust. The server-graded assessment is the real gate for a certificate.

## Content

The course content lives in `src/content/`:

- `catalog.ts`: courses, modules and completion rules. A short course has `format: "short"`; each of its modules has a `badge` name, a `badgeCode` (used in credential IDs) and `skills` (shown on the credential page).
- `<course>/NN-slug.md`: lessons. The front matter holds `title`, `minutes` and `summary`. Full-course lessons have six sections (The problem … Check your understanding); short-course lessons have a few `##` steps including `## Try it`.
- `<course>/assessment.ts`: the final assessment and, for short courses, a module check (`kind: "module"`, `moduleId`) for each badge module. `<course>/project.ts`: the project, for full courses.

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

### Adding a practice project

Projects live in [`src/content/projects.ts`](src/content/projects.ts). Each entry in `PRACTICE_PROJECTS` becomes a page at `/projects/<id>` with its own cover pattern and colours.

- **New project on an existing dataset:** add an entry with the business context, brief, questions, deliverables, approach, starter code, a `badge` and 3–5 `checks` (questions with one right answer). Put each check's answer and a `verify` SQL query in [`src/content/project-answers.ts`](src/content/project-answers.ts); the pages never import that file, and the database grades submissions. `npm run test:content` runs every SQL starter and every `verify` query against the CSV files, so wrong answers can't ship. Then `npm run seed` and run `supabase/seed.sql` so the database has the new answer key.
- **New dataset:** put its CSV files in `public/datasets/<id>/`, add it to `DATASETS`, describe every file and column in `DATA_DICTIONARY`, then run `npm run datasets:meta`. That writes the rows, column types, missing values and previews to `src/content/dataset-meta.json` and builds `public/datasets/<id>.zip`. `npm run test:content` fails if a column isn't described or the metadata is out of date.

### Payments (Paystack)

Certificates are paid by card, bank transfer or USSD through Paystack. Three Supabase Edge Functions in `supabase/functions/` handle it:

- `certificate-checkout`: for the signed-in learner's own pending order, starts a Paystack transaction with the amount and currency from the database and returns the payment page. Return addresses are limited to the Academy.
- `certificate-verify`: when the learner comes back, asks Paystack whether the payment succeeded, checks the amount and currency match the order, and calls `complete_certificate_order()` to issue the certificate.
- `paystack-webhook`: the same, triggered by Paystack itself (so a closed tab doesn't lose a payment). Requests are accepted only with a valid `x-paystack-signature`, and the transaction is re-checked with Paystack.

Setup:

1. Secret: `PAYSTACK_SECRET_KEY` in Supabase → Edge Functions → Secrets (`sk_test_…` while testing, `sk_live_…` for real payments). It is never in the site's code.
2. Deploy: `supabase functions deploy certificate-checkout certificate-verify` and `supabase functions deploy paystack-webhook --no-verify-jwt`.
3. Webhook URL in Paystack → Settings → API Keys & Webhooks: `https://<project>.supabase.co/functions/v1/paystack-webhook`.
4. A currency is only payable online if Paystack has enabled it for the business (USD needs approval). Otherwise the learner is offered the naira price by card, or bank transfer with an admin grant.

In demo mode the payment is simulated.

## Structure

```
src/
  content/        courses, lessons, assessment, project, datasets
  lib/backend/    Backend interface with Supabase and demo (localStorage) implementations
  lib/sql/        sql.js worker, sandbox, and result comparison for exercises
  pages/          public pages, learner pages, auth/, admin/
  components/     layout, lesson renderer, SQL editor parts, certificate artwork
scripts/          prerender, seed builder, content tests, dataset and brand asset generators
supabase/         migrations, Edge Functions and generated seed
```

Public pages are prerendered to static HTML. Signed-in pages (dashboard, admin, assessment, certificate, verification, sign-in) are served from `app.html` via the rewrites in `vercel.json`.
