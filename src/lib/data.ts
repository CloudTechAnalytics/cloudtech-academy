import { useCallback, useEffect, useState } from "react";
import { BUNDLED_COURSES } from "@/content";
import type { AssessmentPublic, Course, ProjectDef } from "@/content/types";
import { getBackend, type AttemptResult, type Enrollment, type Progress, type ProjectSubmission } from "./backend";
import { useAuth } from "./auth";
import { eligibility } from "./certificates";

const publishedBundled = () => BUNDLED_COURSES.filter((c) => c.published);

/**
 * Courses start from the bundled content (so the first render matches the prerendered HTML)
 * and are then refreshed from the backend, which may hold newer admin edits.
 */
export function useCourses() {
  const [courses, setCourses] = useState<Course[]>(publishedBundled);
  useEffect(() => {
    let alive = true;
    void getBackend()
      .then((b) => b.listCourses())
      .then((c) => alive && setCourses(c))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return courses;
}

export function useCourse(slug: string | undefined) {
  const initial = publishedBundled().find((c) => c.slug === slug) ?? null;
  const [state, setState] = useState<{ course: Course | null; loading: boolean }>({ course: initial, loading: !initial });
  useEffect(() => {
    if (!slug) return;
    let alive = true;
    void getBackend()
      .then((b) => b.getCourse(slug))
      .then((course) => alive && setState({ course, loading: false }))
      .catch(() => alive && setState((s) => ({ ...s, loading: false })));
    return () => {
      alive = false;
    };
  }, [slug]);
  return state;
}

export type LearnerState = {
  loading: boolean;
  enrollment: Enrollment | null;
  progress: Progress;
  attempts: AttemptResult[];
  submission: ProjectSubmission | null;
  project: ProjectDef | null;
  assessment: AssessmentPublic | null;
};

const EMPTY: LearnerState = {
  loading: true,
  enrollment: null,
  progress: { completedLessons: [], completedExercises: [] },
  attempts: [],
  submission: null,
  project: null,
  assessment: null,
};

/** Everything about the signed-in learner's relationship with one course. */
export function useLearner(course: Course | null) {
  const auth = useAuth();
  const [state, setState] = useState<LearnerState>(EMPTY);
  const courseId = course?.id;

  const reload = useCallback(async () => {
    if (!courseId || auth.status === "loading") return;
    const b = await getBackend();
    const [assessment, project] = await Promise.all([
      auth.status === "signed-in" ? b.getAssessment(courseId) : Promise.resolve(null),
      b.getProject(courseId),
    ]);
    if (auth.status !== "signed-in") {
      setState({ ...EMPTY, loading: false, project, assessment });
      return;
    }
    const [enrollments, progress, attempts, submission] = await Promise.all([
      b.listEnrollments(),
      b.getProgress(courseId),
      assessment ? b.listAttempts(assessment.id) : Promise.resolve([]),
      project ? b.getSubmission(project.id) : Promise.resolve(null),
    ]);
    setState({
      loading: false,
      enrollment: enrollments.find((e) => e.courseId === courseId) ?? null,
      progress,
      attempts,
      submission,
      project,
      assessment,
    });
  }, [courseId, auth.status]);

  useEffect(() => {
    void reload().catch(() => setState((s) => ({ ...s, loading: false })));
  }, [reload]);

  const status = course ? eligibility(course, state.progress, state.attempts, state.submission, state.project) : null;
  return { ...state, eligibility: status, reload, signedIn: auth.status === "signed-in" };
}
