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
import { IEMI_ASSESSMENTS } from "./import-export/assessment";
import { PROC_ASSESSMENTS } from "./procurement/assessment";
import { LFF_ASSESSMENTS } from "./logistics/assessment";
import { SCM_ASSESSMENTS } from "./supply-chain/assessment";
import { ENT_ASSESSMENTS } from "./entrepreneurship/assessment";
import { BDS_ASSESSMENTS } from "./sales/assessment";
import { DMS_ASSESSMENTS } from "./digital-marketing/assessment";
import { ECOM_ASSESSMENTS } from "./ecommerce/assessment";
import { PMGT_ASSESSMENTS } from "./project-management-practice/assessment";
import { HRPM_ASSESSMENTS } from "./hr/assessment";
import { HRPM_PROJECT } from "./hr/project";
import { PMGT_PROJECT } from "./project-management-practice/project";
import { ECOM_PROJECT } from "./ecommerce/project";
import { DMS_PROJECT } from "./digital-marketing/project";
import { BDS_PROJECT } from "./sales/project";
import { ENT_PROJECT } from "./entrepreneurship/project";
import { SCM_PROJECT } from "./supply-chain/project";
import { LFF_PROJECT } from "./logistics/project";
import { PROC_PROJECT } from "./procurement/project";
import { IEMI_PROJECT } from "./import-export/project";
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
import { PMC_ASSESSMENT } from "./pm-capstone/assessment";
import { PMC_PROJECT } from "./pm-capstone/project";
import { BAC_ASSESSMENT } from "./ba-capstone/assessment";
import { BAC_PROJECT } from "./ba-capstone/project";
import { DSC_ASSESSMENT } from "./ds-capstone/assessment";
import { DSC_PROJECT } from "./ds-capstone/project";
import { AIC_ASSESSMENT } from "./ai-capstone/assessment";
import { AIC_PROJECT } from "./ai-capstone/project";
import { CDC_ASSESSMENT } from "./devops-capstone/assessment";
import { CDC_PROJECT } from "./devops-capstone/project";
import { SDC_ASSESSMENT } from "./swe-capstone/assessment";
import { SDC_PROJECT } from "./swe-capstone/project";
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
import { GAI_ASSESSMENT } from "./genai/assessment";
import { GAI_PROJECT } from "./genai/project";
import { AGT_ASSESSMENT } from "./agents/assessment";
import { AGT_PROJECT } from "./agents/project";
import { OPS_ASSESSMENT } from "./llmops/assessment";
import { OPS_PROJECT } from "./llmops/project";
import { CLD_ASSESSMENT } from "./cloud/assessment";
import { CLD_PROJECT } from "./cloud/project";
import { LNX_ASSESSMENT } from "./linux/assessment";
import { LNX_PROJECT } from "./linux/project";
import { IAC_ASSESSMENT } from "./terraform/assessment";
import { IAC_PROJECT } from "./terraform/project";
import { CICD_ASSESSMENT } from "./cicd/assessment";
import { CICD_PROJECT } from "./cicd/project";
import { SRE_ASSESSMENT } from "./observability/assessment";
import { SRE_PROJECT } from "./observability/project";
import { SWE_ASSESSMENT } from "./swe/assessment";
import { SWE_PROJECT } from "./swe/project";
import { DBA_ASSESSMENT } from "./dbapi/assessment";
import { DBA_PROJECT } from "./dbapi/project";
import { WJS_ASSESSMENT } from "./webjs/assessment";
import { WJS_PROJECT } from "./webjs/project";
import { PMF_ASSESSMENT } from "./pm/assessment";
import { PMF_PROJECT } from "./pm/project";
import { PDM_ASSESSMENT } from "./product/assessment";
import { PDM_PROJECT } from "./product/project";
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
  "ba-capstone": "business-analyst-capstone",
  "pm-capstone": "project-manager-capstone",
  "ds-capstone": "data-scientist-capstone",
  "ai-capstone": "ai-engineer-capstone",
  "devops-capstone": "cloud-devops-capstone",
  "swe-capstone": "software-developer-capstone",
  ba: "business-analysis-fundamentals",
  "agile-ba": "agile-business-analysis",
  process: "process-improvement-bpmn-lean",
  ml: "machine-learning-fundamentals",
  features: "feature-engineering-model-evaluation",
  experiments: "experimentation-ab-testing",
  forecasting: "time-series-forecasting",
  genai: "generative-ai-engineering",
  agents: "ai-agents-tool-use",
  llmops: "llm-evaluation-safety-production",
  cloud: "cloud-fundamentals-cost-reliability",
  linux: "linux-networking-basics",
  terraform: "terraform-infrastructure-as-code",
  cicd: "cicd-and-containers",
  observability: "observability-site-reliability",
  swe: "software-engineering-with-python",
  dbapi: "databases-and-apis-for-developers",
  webjs: "web-development-with-javascript",
  pm: "project-management-fundamentals",
  product: "product-management-fundamentals",
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
  "import-export": "import-export-mini-importation",
  procurement: "procurement-sourcing",
  logistics: "logistics-freight-forwarding",
  "supply-chain": "supply-chain-management",
  entrepreneurship: "entrepreneurship-business-management",
  sales: "business-development-sales",
  "digital-marketing": "digital-marketing-sales",
  ecommerce: "ecommerce-online-business",
  "project-management-practice": "project-management",
  hr: "human-resources-people-management",
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
    topics: m.topics ?? [],
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
  BAC_ASSESSMENT,
  PMC_ASSESSMENT,
  DSC_ASSESSMENT,
  AIC_ASSESSMENT,
  CDC_ASSESSMENT,
  SDC_ASSESSMENT,
  BA_ASSESSMENT,
  ABA_ASSESSMENT,
  PIL_ASSESSMENT,
  ML_ASSESSMENT,
  FEM_ASSESSMENT,
  ABT_ASSESSMENT,
  TSF_ASSESSMENT,
  GAI_ASSESSMENT,
  AGT_ASSESSMENT,
  OPS_ASSESSMENT,
  CLD_ASSESSMENT,
  LNX_ASSESSMENT,
  IAC_ASSESSMENT,
  CICD_ASSESSMENT,
  SRE_ASSESSMENT,
  SWE_ASSESSMENT,
  DBA_ASSESSMENT,
  WJS_ASSESSMENT,
  PMF_ASSESSMENT,
  PDM_ASSESSMENT,
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
  ...IEMI_ASSESSMENTS,
  ...PROC_ASSESSMENTS,
  ...LFF_ASSESSMENTS,
  ...SCM_ASSESSMENTS,
  ...ENT_ASSESSMENTS,
  ...BDS_ASSESSMENTS,
  ...DMS_ASSESSMENTS,
  ...ECOM_ASSESSMENTS,
  ...PMGT_ASSESSMENTS,
  ...HRPM_ASSESSMENTS,
].map((a) => ({ ...a, kind: a.kind ?? "final" }));
export const BUNDLED_PROJECTS: ProjectDef[] = [SQL_PROJECT, DAF_PROJECT, XLS_PROJECT, PBI_PROJECT, DMO_PROJECT, PYAN_PROJECT, STAT_PROJECT, ASQL_PROJECT, DAX_PROJECT, CAP_PROJECT, BA_PROJECT, ABA_PROJECT, PIL_PROJECT, ML_PROJECT, FEM_PROJECT, ABT_PROJECT, TSF_PROJECT, GAI_PROJECT, AGT_PROJECT, OPS_PROJECT, CLD_PROJECT, LNX_PROJECT, IAC_PROJECT, CICD_PROJECT, SRE_PROJECT, SWE_PROJECT, DBA_PROJECT, WJS_PROJECT, PMF_PROJECT, PDM_PROJECT, BAC_PROJECT, PMC_PROJECT, DSC_PROJECT, AIC_PROJECT, CDC_PROJECT, SDC_PROJECT, IEMI_PROJECT, PROC_PROJECT, LFF_PROJECT, SCM_PROJECT, ENT_PROJECT, BDS_PROJECT, DMS_PROJECT, ECOM_PROJECT, PMGT_PROJECT, HRPM_PROJECT];

export { CATEGORIES, categoryName } from "./catalog";
