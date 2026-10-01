import { Link } from "react-router";
import { ArrowRight, BadgeCheck, Clock, UserRound } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { breadcrumbs } from "@/lib/schema";
import { useCourses } from "@/lib/data";
import { durationLabel, plural } from "@/lib/format";
import { courseMinutes } from "@/lib/certificates";
import type { Course } from "@/content/types";
import { badgeIcon } from "@/components/BadgeIcon";
import { ButtonLink } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

/** One Student Starter item: a whole course, or a single module of a course when that covers the skill. */
type Item = { title: string; why: string; course: string; module?: string };

const GROUPS: { title: string; intro: string; items: Item[] }[] = [
  {
    title: "Study smarter with AI",
    intro: "Use AI to understand, revise, research and present, within your school's rules.",
    items: [
      {
        title: "ChatGPT for school and study",
        why: "Explain hard topics, make revision questions and write honestly with AI.",
        course: "chatgpt-for-students",
      },
      {
        title: "AI prompting",
        why: "Write prompts that get useful answers the first time.",
        course: "ai-productivity-fundamentals",
        module: "aipf-m01",
      },
      {
        title: "Research online",
        why: "Search like a pro, judge sources and cite them properly.",
        course: "research-skills-for-students",
      },
      {
        title: "Presentations with AI",
        why: "Go from topic to a clear slide deck and speaker notes, fast.",
        course: "ai-productivity-fundamentals",
        module: "aipf-m04",
      },
    ],
  },
  {
    title: "Get career-ready",
    intro: "Stand out for internships, jobs and scholarships.",
    items: [
      {
        title: "Build your CV",
        why: "A clear, one-page CV with achievement bullet points, drafted with AI.",
        course: "career-essentials",
        module: "career-m01",
      },
      {
        title: "LinkedIn profile",
        why: "A photo, headline and About section recruiters can find.",
        course: "career-essentials",
        module: "career-m02",
      },
      {
        title: "Student portfolio",
        why: "Pick your best work and publish a one-link portfolio page.",
        course: "build-your-student-portfolio",
      },
      {
        title: "Write a LinkedIn post",
        why: "Share a project or badge in a post people actually read.",
        course: "build-your-student-portfolio",
        module: "portf-m04",
      },
      {
        title: "Get your first internship",
        why: "SIWES, finding placements, applications and interviews.",
        course: "get-your-first-internship",
      },
      {
        title: "Remote opportunities",
        why: "Find remote internships and spot fake offers.",
        course: "get-your-first-internship",
        module: "intern-m02",
      },
      {
        title: "Freelancing for beginners",
        why: "Turn one skill into paid work, safely.",
        course: "freelancing-for-beginners",
      },
    ],
  },
  {
    title: "Data skills",
    intro: "The spreadsheet and data tools employers ask for most.",
    items: [
      {
        title: "Excel for students",
        why: "Tables, sorting, SUM, SUMIF and COUNTIF, and a PivotTable in 30 minutes.",
        course: "career-essentials",
        module: "career-m03",
      },
      {
        title: "Excel for data analysis",
        why: "The full course: cleaning, lookups, PivotTables and a mini project.",
        course: "excel-for-data-analysis",
      },
      {
        title: "Intro to SQL",
        why: "Ask a database questions, right in your browser.",
        course: "sql-for-data-analysis",
      },
      { title: "Intro to Power BI", why: "Build an interactive sales dashboard.", course: "power-bi-fundamentals" },
      {
        title: "pandas quick start",
        why: "Load, clean, summarise and chart data with pandas.",
        course: "python-for-data-analysis",
      },
    ],
  },
  {
    title: "Create content",
    intro: "Design and video skills for clubs, events, small businesses and your own brand.",
    items: [
      {
        title: "Canva design",
        why: "Clean posters and social graphics using four simple rules.",
        course: "design-content-essentials",
        module: "dce-m02",
      },
      {
        title: "CapCut video editing",
        why: "Edit a short vertical video with captions and music.",
        course: "design-content-essentials",
        module: "dce-m03",
      },
    ],
  },
  {
    title: "Code and build",
    intro: "Your first steps in programming and the web, with nothing expensive to install.",
    items: [
      {
        title: "Git and GitHub",
        why: "Track your work and show projects on GitHub.",
        course: "git-and-github-for-beginners",
      },
      {
        title: "Intro to web development",
        why: "HTML, CSS and JavaScript, one short module each.",
        course: "web-development-for-beginners",
      },
      {
        title: "Build your first website",
        why: "Publish your own site free with GitHub Pages.",
        course: "web-development-for-beginners",
        module: "web-m04",
      },
      {
        title: "Intro to Python",
        why: "Variables, loops and functions in Google Colab.",
        course: "python-for-beginners",
      },
    ],
  },
  {
    title: "Everyday digital skills",
    intro: "The basics every student is expected to know.",
    items: [
      {
        title: "Google Workspace",
        why: "Docs, Sheets, Forms and Calendar for group work and planning.",
        course: "digital-skills-for-students",
        module: "digi-m02",
      },
      {
        title: "Digital skills for students",
        why: "Files and cloud storage, professional email and staying safe online.",
        course: "digital-skills-for-students",
      },
      {
        title: "Professional email",
        why: "Emails lecturers and employers take seriously.",
        course: "digital-skills-for-students",
        module: "digi-m03",
      },
    ],
  },
];

const TOTAL = GROUPS.reduce((n, g) => n + g.items.length, 0);

function resolve(item: Item, courses: Course[]) {
  const course = courses.find((c) => c.slug === item.course);
  if (!course) return null;
  const module = item.module ? course.modules.find((m) => m.id === item.module) : undefined;
  if (item.module && !module) return null;
  if (module) {
    const first = module.lessons[0];
    return {
      to: first ? `/learn/${course.slug}/${first.slug}` : `/courses/${course.slug}`,
      kind: `Module of ${course.title}`,
      minutes: module.lessons.reduce((n, l) => n + l.minutes, 0),
      badge: module.badge ? `Badge: ${module.badge}` : null,
      Icon: badgeIcon({ code: module.badgeCode, categoryId: course.categoryId }),
    };
  }
  const badges = course.modules.filter((m) => m.badge).length;
  return {
    to: `/courses/${course.slug}`,
    kind: course.format === "short" ? `Short course · ${plural(course.modules.length, "module")}` : "Full course",
    minutes: course.format === "short" ? courseMinutes(course) : undefined,
    hours: course.estimatedHours,
    badge: badges ? `${plural(badges, "badge")} + completion badge` : "Completion credential",
    Icon: badgeIcon({ code: course.modules[0]?.badgeCode, categoryId: course.categoryId }),
  };
}

export default function Students() {
  useSeo({
    title: "Student Starter: Free Practical Skills for Students | CloudTech Academy",
    description:
      "Free short courses for students: ChatGPT for study, research, CVs, LinkedIn, Excel, SQL, Power BI, Canva, CapCut, Git, web development, Python, internships and freelancing. Earn a badge for each module.",
    jsonLd: breadcrumbs([["Student Starter", "/students"]]),
  });
  const courses = useCourses();

  return (
    <>
      <section className="border-b border-line">
        <div className="container-page max-w-5xl py-16 sm:py-20">
          <p className="kicker">Student Starter</p>
          <h1 className="mt-4 max-w-3xl font-serif text-[2.6rem] leading-[1.05] tracking-[-0.015em] sm:text-[3.4rem]">
            Free practical skills for students who want to <span className="text-brass-accent">get ahead.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[1.125rem] leading-relaxed text-muted">
            {TOTAL} skills for school, internships and your first job. Most take 15 to 40 minutes. Do the module's tasks and pass its check
            to earn a free badge, then show them all on your own public skills profile.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/sign-up" arrow>
              Start free
            </ButtonLink>
            <ButtonLink to="#skills" variant="secondary">
              See the {TOTAL} skills
            </ButtonLink>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                Icon: Clock,
                title: "Short and practical",
                body: "Modules of 15 to 40 minutes, with tasks you do yourself, checked as you go.",
              },
              {
                Icon: BadgeCheck,
                title: "A badge for every module",
                body: "Each badge has its own credential ID anyone can check, and shares to LinkedIn.",
              },
              {
                Icon: UserRound,
                title: "Your skills profile",
                body: "Switch on a public page that shows every badge you've earned, in one link.",
              },
            ].map(({ Icon, title, body }) => (
              <li key={title} className="rounded-xl border border-line bg-paper p-5">
                <Icon aria-hidden className="h-5 w-5 text-brass-dark" />
                <p className="mt-3 font-semibold">{title}</p>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="skills" className="container-page max-w-5xl scroll-mt-24 py-14">
        <div className="space-y-14">
          {GROUPS.map((g) => (
            <Reveal key={g.title}>
              <h2 className="font-serif text-[1.8rem] leading-tight sm:text-[2rem]">{g.title}</h2>
              <p className="mt-1.5 text-muted">{g.intro}</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {g.items.map((item) => {
                  const r = resolve(item, courses);
                  if (!r) return null;
                  const { Icon } = r;
                  return (
                    <li key={item.title}>
                      <Link
                        to={r.to}
                        className="group flex h-full gap-4 rounded-xl border border-line bg-paper p-4 transition-colors hover:border-brass sm:p-5"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brass-pale text-brass-dark">
                          <Icon aria-hidden className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-2">
                            <span className="font-semibold leading-snug text-ink group-hover:text-brass-dark">
                              {item.title}
                            </span>
                            <ArrowRight
                              aria-hidden
                              className="mt-0.5 h-4 w-4 shrink-0 text-line-strong group-hover:text-brass-dark"
                            />
                          </span>
                          <span className="mt-1 block text-[0.9375rem] leading-relaxed text-muted">{item.why}</span>
                          <span className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[0.8125rem] text-subtle">
                            <span>{r.kind}</span>
                            <span>{durationLabel(r.minutes, "hours" in r ? r.hours : undefined)}</span>
                            {r.badge && <span className="font-medium text-brass-dark">{r.badge}</span>}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-6 rounded-2xl border border-line bg-sand/50 p-6 sm:p-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <h2 className="font-serif text-[1.6rem] leading-tight">Collect your badges in one place</h2>
            <p className="mt-2 text-muted">
              Every badge you earn goes on your dashboard. Switch on your public skills profile in your account settings
              to get one link for your CV, LinkedIn or portfolio. It's off until you choose to share it.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <ButtonLink to="/sign-up" arrow>
              Create a free account
            </ButtonLink>
            <ButtonLink to="/profile" variant="secondary">
              Set up my skills profile
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
