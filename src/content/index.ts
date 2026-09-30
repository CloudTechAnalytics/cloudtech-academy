/**
 * Bundled course content: the catalogue plus lesson files, assembled into the runtime model.
 * Pages read content through the backend (src/lib/backend); this module is its starting point
 * and the source for prerendering and for `npm run seed`.
 */
import { COURSES } from "./catalog";
import type { AssessmentDef, Course, Lesson, Module, ProjectDef } from "./types";
import { SQL_ASSESSMENT } from "./sql/assessment";
import { SQL_PROJECT } from "./sql/project";
import { DAF_ASSESSMENT } from "./daf/assessment";
import { DAF_PROJECT } from "./daf/project";
import { XLS_ASSESSMENT } from "./excel/assessment";
import { XLS_PROJECT } from "./excel/project";
import { PBI_ASSESSMENT } from "./powerbi/assessment";
import { PBI_PROJECT } from "./powerbi/project";
import { DMO_ASSESSMENT } from "./modelling/assessment";
import { DMO_PROJECT } from "./modelling/project";
import { AIPF_ASSESSMENTS } from "./ai-productivity/assessment";
import { DCE_ASSESSMENTS } from "./design-content/assessment";
import { CAREER_ASSESSMENTS } from "./career/assessment";
import { parseFrontmatter, requiredExerciseIds } from "@/lib/lesson-format";

/** Lesson files live in one folder per course, named NN-slug.md. */
const COURSE_DIRS: Record<string, string> = {
  sql: "sql-for-data-analysis",
  daf: "data-analytics-foundations",
  excel: "excel-for-data-analysis",
  powerbi: "power-bi-fundamentals",
  modelling: "data-modelling",
  "ai-productivity": "ai-productivity-fundamentals",
  "design-content": "design-content-essentials",
  career: "career-essentials",
};

const lessonFiles = import.meta.glob("./*/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

const BODIES: Record<string, Record<string, string>> = {};
for (const [file, raw] of Object.entries(lessonFiles)) {
  const m = file.match(/^\.\/([^/]+)\/\d+-(.+)\.md$/);
  const courseId = m && COURSE_DIRS[m[1]];
  if (!courseId) continue;
  (BODIES[courseId] ??= {})[m[2]] = raw;
}

function buildCourse(def: (typeof COURSES)[number], position: number): Course {
  let lessonPos = 0;
  const modules: Module[] = def.modules.map((m, mi) => ({
    id: m.id,
    courseId: def.id,
    title: m.title,
    position: mi + 1,
    badge: m.badge ?? null,
    badgeCode: m.badgeCode ?? null,
    skills: m.skills ?? [],
    lessons: m.lessons.map((slug): Lesson => {
      const raw = BODIES[def.id]?.[slug];
      if (!raw) throw new Error(`Missing lesson file for ${def.id}/${slug}`);
      const { meta, body } = parseFrontmatter(raw);
      lessonPos += 1;
      return {
        id: `${def.id}:${slug}`,
        courseId: def.id,
        moduleId: m.id,
        slug,
        title: meta.title ?? slug,
        summary: meta.summary ?? "",
        minutes: Number(meta.minutes ?? 15),
        body,
        required: true,
        published: true,
        position: lessonPos,
        requiredExercises: requiredExerciseIds(body),
      };
    }),
  }));
  const { modules: _defModules, ...rest } = def;
  void _defModules;
  return { ...rest, published: true, position, modules };
}

export const BUNDLED_COURSES: Course[] = COURSES.map(buildCourse);
export const BUNDLED_ASSESSMENTS: AssessmentDef[] = [
  SQL_ASSESSMENT,
  DAF_ASSESSMENT,
  XLS_ASSESSMENT,
  PBI_ASSESSMENT,
  DMO_ASSESSMENT,
  ...AIPF_ASSESSMENTS,
  ...DCE_ASSESSMENTS,
  ...CAREER_ASSESSMENTS,
].map((a) => ({ ...a, kind: a.kind ?? "final" }));
export const BUNDLED_PROJECTS: ProjectDef[] = [SQL_PROJECT, DAF_PROJECT, XLS_PROJECT, PBI_PROJECT, DMO_PROJECT];

export { CATEGORIES, categoryName } from "./catalog";
