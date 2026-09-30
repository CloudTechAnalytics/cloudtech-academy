/**
 * Quick courses: one useful skill in 15–30 minutes. Each is a single Markdown file in
 * src/content/quick/ (NN-slug.md): a few short steps, a "Try it" task, and a final ```quiz
 * of five questions. Pass it (3 of 5) and the learner gets a shareable badge.
 */
import type { QuizQuestion } from "./types";
import { parseFrontmatter, parseQuiz } from "@/lib/lesson-format";

export type QuickCourse = {
  slug: string;
  position: number;
  title: string;
  /** Name printed on the badge, e.g. "Claude AI Essentials". */
  badge: string;
  minutes: number;
  category: string;
  /** Icon key, see QUICK_ICONS in components/QuickIcon. */
  icon: string;
  summary: string;
  skills: string[];
  /** The steps and the Try it task, without the badge quiz. */
  body: string;
  quiz: QuizQuestion[];
};

export const QUICK_PASS = 3;

export const QUICK_CATEGORIES = ["AI & Productivity", "Design & Content", "Career", "Data"] as const;

const files = import.meta.glob("./quick/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

const QUIZ = /```quiz\s*\n([\s\S]*?)\n```\s*$/;

export const QUICK_COURSES: QuickCourse[] = Object.entries(files)
  .map(([file, raw]) => {
    const m = file.match(/\/(\d+)-(.+)\.md$/);
    if (!m) throw new Error(`Quick course file name should be NN-slug.md: ${file}`);
    const { meta, body } = parseFrontmatter(raw);
    const quiz = body.trimEnd().match(QUIZ);
    if (!quiz) throw new Error(`${file}: the badge quiz must be the last block`);
    return {
      slug: m[2],
      position: Number(m[1]),
      title: meta.title,
      badge: meta.badge,
      minutes: Number(meta.minutes),
      category: meta.category,
      icon: meta.icon,
      summary: meta.summary,
      skills: (meta.skills ?? "").split(";").map((s) => s.trim()).filter(Boolean),
      body: body.trimEnd().replace(QUIZ, "").trimEnd(),
      quiz: parseQuiz(quiz[1]),
    };
  })
  .sort((a, b) => a.position - b.position);

export const quickCourse = (slug: string) => QUICK_COURSES.find((c) => c.slug === slug);
