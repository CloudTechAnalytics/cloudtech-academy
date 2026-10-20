import { useMemo } from "react";
import { getBackend, type CourseVideoAdmin } from "@/lib/backend";
import { AdminVideoPanel, type VideoApi } from "./AdminVideoPanel";

/**
 * A lesson's (section's) instructional video, shown above its written lesson. It is separate from the course overview
 * video. Editing it never touches the lesson text, learner progress or any other lesson, and a lesson works the same
 * with or without one.
 */
export function AdminLessonVideo({ courseId, lessonId, lessonTitle, onChange }: { courseId: string; lessonId: string; lessonTitle: string; onChange?: (video: CourseVideoAdmin | null) => void }) {
  const api = useMemo<VideoApi>(
    () => ({
      courseId,
      heading: "Lesson video",
      intro: (
        <>
          An instructional video shown above this lesson's written text, following Watch, then understand, practise and check. It supports the lesson and does not replace it, and the lesson is complete under the usual rules whether or not a learner watches it. Learners see it only while it is <strong>published</strong>, and only if they may read the lesson.
        </>
      ),
      guidance: (
        <>
          <strong>Tips for the video:</strong> short ideas work best at about 2 to 5 minutes; demonstrations may need 5 to 10. Split a long topic into smaller videos rather than one long recording. Show examples and real workflows instead of reading the lesson aloud, and keep the written lesson as the revision copy for learners who prefer reading or have limited data. Use a descriptive title. YouTube and Vimeo supply captions where the video has them.
        </>
      ),
      defaultTitle: lessonTitle,
      removeNote: "This deletes the video's details and its uploaded files. The written lesson, learners' progress and every other lesson are not affected.",
      get: async () => (await getBackend()).admin.getLessonVideo(lessonId),
      save: async (draft) => (await getBackend()).admin.saveLessonVideo({ ...draft, courseId, lessonId }),
      remove: async () => (await getBackend()).admin.removeLessonVideo(lessonId),
      onChange,
    }),
    [courseId, lessonId, lessonTitle, onChange],
  );
  return <AdminVideoPanel api={api} />;
}
