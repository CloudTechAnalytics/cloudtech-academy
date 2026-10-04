/**
 * "Open in Colab" links. scripts/build-notebooks.mjs writes a notebook for every lesson with
 * Python or Colab shell code, to notebooks/<course-id>/<lesson-slug>.ipynb in the public
 * repository, and Colab opens it from GitHub. Keep hasNotebook in step with that script.
 */
const REPO = "CloudTechAnalytics/cloudtech-academy";

/** True when the lesson has Python, or shell commands written for Colab (%%bash). */
export const hasNotebook = (body: string) => /```python\b/.test(body) || /```bash[^\n]*\n%%bash/.test(body);

export const colabUrl = (courseId: string, lessonSlug: string) =>
  `https://colab.research.google.com/github/${REPO}/blob/main/notebooks/${courseId}/${lessonSlug}.ipynb`;
