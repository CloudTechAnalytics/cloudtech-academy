/**
 * Bundled course content: the catalogue plus lesson files, assembled into the runtime model.
 * Pages read content through the backend (src/lib/backend); this module is its starting point
 * and the source for prerendering and for `npm run seed`.
 */
import { COURSES } from "./catalog";
import type { AssessmentDef, Course, Lesson, Module, ProjectDef } from "./types";
import { SQL_ASSESSMENT } from "./sql/assessment";
import { SQL_PROJECT } from "./sql/project";
import { parseFrontmatter, extractExercises } from "@/lib/lesson-format";

const lessonFiles = import.meta.glob("./sql/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

/** Lesson files are named NN-slug.md inside a folder per course. */
const BODIES: Record<string, Record<string, string>> = { "sql-for-data-analysis": {} };
for (const [file, raw] of Object.entries(lessonFiles)) {
  const slug = file.replace(/^.*\/\d+-/, "").replace(/\.md$/, "");
  BODIES["sql-for-data-analysis"][slug] = raw;
}

function buildCourse(def: (typeof COURSES)[number], position: number): Course {
  let lessonPos = 0;
  const modules: Module[] = def.modules.map((m, mi) => ({
    id: m.id,
    courseId: def.id,
    title: m.title,
    position: mi + 1,
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
        requiredExercises: extractExercises(body).filter((e) => e.required).map((e) => e.id),
      };
    }),
  }));
  const { modules: _defModules, ...rest } = def;
  void _defModules;
  return { ...rest, published: true, position, modules };
}

export const BUNDLED_COURSES: Course[] = COURSES.map(buildCourse);
export const BUNDLED_ASSESSMENTS: AssessmentDef[] = [SQL_ASSESSMENT];
export const BUNDLED_PROJECTS: ProjectDef[] = [SQL_PROJECT];

export { CATEGORIES, categoryName } from "./catalog";
