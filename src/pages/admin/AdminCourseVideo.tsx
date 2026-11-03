import { useMemo } from "react";
import type { Course } from "@/content/types";
import { getBackend } from "@/lib/backend";
import { AdminVideoPanel, type VideoApi } from "./AdminVideoPanel";

/** The course overview video: shown on the course's public page. */
export function AdminCourseVideo({ course }: { course: Course }) {
  const api = useMemo<VideoApi>(
    () => ({
      courseId: course.id,
      heading: "Course overview video",
      intro: (
        <>
          An overview video shown on this course's page, for visitors deciding whether to join. Learners see it only while it is <strong>published</strong>; drafts and unpublished videos stay hidden. Courses without a video simply have no video section. Videos for individual lessons are added in each lesson's editor.
        </>
      ),
      defaultTitle: `${course.title}: overview`,
      removeNote: "This deletes the video's details and its uploaded files. The course, its lessons and learners' progress are not affected.",
      get: async () => (await getBackend()).admin.getCourseVideo(course.id),
      save: async (draft) => (await getBackend()).admin.saveCourseVideo({ ...draft, courseId: course.id }),
      remove: async () => (await getBackend()).admin.removeCourseVideo(course.id),
    }),
    [course.id, course.title],
  );
  return <AdminVideoPanel api={api} />;
}
