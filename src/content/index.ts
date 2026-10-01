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
import { AISTU_ASSESSMENTS } from "./ai-students/assessment";
import { RSRCH_ASSESSMENTS } from "./research/assessment";
import { PORTF_ASSESSMENTS } from "./portfolio/assessment";
import { GIT_ASSESSMENTS } from "./git/assessment";
import { WEB_ASSESSMENTS } from "./web/assessment";
import { PY_ASSESSMENTS } from "./python/assessment";
import { PYDA_ASSESSMENTS } from "./python-data/assessment";
import { DIGI_ASSESSMENTS } from "./digital/assessment";
import { INTERN_ASSESSMENTS } from "./internship/assessment";
import { FREEL_ASSESSMENTS } from "./freelancing/assessment";
import { PYAN_ASSESSMENT } from "./python-analytics/assessment";
import { PYAN_PROJECT } from "./python-analytics/project";
import { STAT_ASSESSMENT } from "./statistics/assessment";
import { STAT_PROJECT } from "./statistics/project";
import { ASQL_ASSESSMENT } from "./advanced-sql/assessment";
import { ASQL_PROJECT } from "./advanced-sql/project";
import { DAX_ASSESSMENT } from "./dax/assessment";
import { DAX_PROJECT } from "./dax/project";
import { CAP_ASSESSMENT } from "./capstone/assessment";
import { CAP_PROJECT } from "./capstone/project";
import { BA_ASSESSMENT } from "./ba/assessment";
import { BA_PROJECT } from "./ba/project";
import { ABA_ASSESSMENT } from "./agile-ba/assessment";
import { ABA_PROJECT } from "./agile-ba/project";
import { PIL_ASSESSMENT } from "./process/assessment";
import { PIL_PROJECT } from "./process/project";
import { ML_ASSESSMENT } from "./ml/assessment";
import { ML_PROJECT } from "./ml/project";
import { FEM_ASSESSMENT } from "./features/assessment";
import { FEM_PROJECT } from "./features/project";
import { ABT_ASSESSMENT } from "./experiments/assessment";
import { ABT_PROJECT } from "./experiments/project";
import { TSF_ASSESSMENT } from "./forecasting/assessment";
import { TSF_PROJECT } from "./forecasting/project";
import { parseFrontmatter, requiredExerciseIds } from "@/lib/lesson-format";

/** Lesson files live in one folder per course, named NN-slug.md. */
const COURSE_DIRS: Record<string, string> = {
  sql: "sql-for-data-analysis",
  daf: "data-analytics-foundations",
  excel: "excel-for-data-analysis",
  powerbi: "power-bi-fundamentals",
  modelling: "data-modelling",
  "python-analytics": "python-for-data-analytics",
  statistics: "statistics-for-data-analysis",
  "advanced-sql": "advanced-sql",
  dax: "power-bi-dax",
  capstone: "data-analyst-capstone",
  ba: "business-analysis-fundamentals",
  "agile-ba": "agile-business-analysis",
  process: "process-improvement-bpmn-lean",
  ml: "machine-learning-fundamentals",
  features: "feature-engineering-model-evaluation",
  experiments: "experimentation-ab-testing",
  forecasting: "time-series-forecasting",
  "ai-productivity": "ai-productivity-fundamentals",
  "design-content": "design-content-essentials",
  career: "career-essentials",
  "ai-students": "chatgpt-for-students",
  research: "research-skills-for-students",
  portfolio: "build-your-student-portfolio",
  git: "git-and-github-for-beginners",
  web: "web-development-for-beginners",
  python: "python-for-beginners",
  "python-data": "python-for-data-analysis",
  digital: "digital-skills-for-students",
  internship: "get-your-first-internship",
  freelancing: "freelancing-for-beginners",
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
  PYAN_ASSESSMENT,
  STAT_ASSESSMENT,
  ASQL_ASSESSMENT,
  DAX_ASSESSMENT,
  CAP_ASSESSMENT,
  BA_ASSESSMENT,
  ABA_ASSESSMENT,
  PIL_ASSESSMENT,
  ML_ASSESSMENT,
  FEM_ASSESSMENT,
  ABT_ASSESSMENT,
  TSF_ASSESSMENT,
  ...AIPF_ASSESSMENTS,
  ...DCE_ASSESSMENTS,
  ...CAREER_ASSESSMENTS,
  ...AISTU_ASSESSMENTS,
  ...RSRCH_ASSESSMENTS,
  ...PORTF_ASSESSMENTS,
  ...GIT_ASSESSMENTS,
  ...WEB_ASSESSMENTS,
  ...PY_ASSESSMENTS,
  ...PYDA_ASSESSMENTS,
  ...DIGI_ASSESSMENTS,
  ...INTERN_ASSESSMENTS,
  ...FREEL_ASSESSMENTS,
].map((a) => ({ ...a, kind: a.kind ?? "final" }));
export const BUNDLED_PROJECTS: ProjectDef[] = [SQL_PROJECT, DAF_PROJECT, XLS_PROJECT, PBI_PROJECT, DMO_PROJECT, PYAN_PROJECT, STAT_PROJECT, ASQL_PROJECT, DAX_PROJECT, CAP_PROJECT, BA_PROJECT, ABA_PROJECT, PIL_PROJECT, ML_PROJECT, FEM_PROJECT, ABT_PROJECT, TSF_PROJECT];

export { CATEGORIES, categoryName } from "./catalog";
