import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Download } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useCourse, useLearner } from "@/lib/data";
import { getBackend } from "@/lib/backend";
import { PageLoading, RequireAuth } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { DATASETS, datasetUrl } from "@/content/projects";
import { LessonContent } from "@/components/LessonContent";
import { SqlScratchpad } from "@/components/sql/SqlScratchpad";
import { Button } from "@/components/Button";
import { Alert, TextArea, TextField } from "@/components/Form";
import NotFound from "./NotFound";

const STATUS = {
  submitted: "Submitted. It counts towards your certificate.",
  accepted: "Reviewed and accepted.",
  needs_changes: "Changes requested. Update your answers and submit again.",
} as const;

function ProjectInner() {
  const { slug } = useParams();
  const { course, loading } = useCourse(slug);
  const learner = useLearner(course);
  const project = learner.project;
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  useSeo({ title: project ? `${project.title} | Final project` : "Final project", description: "Final project", noindex: true });

  // Start from the saved submission, or a template with one section per task.
  useEffect(() => {
    if (!project) return;
    if (learner.submission) {
      setContent(learner.submission.content);
      setUrl(learner.submission.url);
    } else setContent(project.tasks.map((t, i) => `Question ${i + 1}: ${t}\n\nSQL:\n\n\nWhat it means:\n\n`).join("\n"));
  }, [project, learner.submission]);

  if (!course) return loading ? <PageLoading /> : <NotFound />;
  if (learner.loading) return <PageLoading />;
  if (!project) return <NotFound />;

  const submit = async () => {
    if (content.trim().length < 50) {
      setMessage({ tone: "error", text: "Add your queries and explanations before submitting." });
      return;
    }
    if (url && !/^https?:\/\//i.test(url)) {
      setMessage({ tone: "error", text: "The link must start with http:// or https://." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await (await getBackend()).submitProject(project.id, { content, url });
      await learner.reload();
      setMessage({ tone: "success", text: "Your project has been submitted. You can update it at any time." });
    } catch (e) {
      setMessage({ tone: "error", text: e instanceof Error ? e.message : "Couldn't submit your project." });
    } finally {
      setSaving(false);
    }
  };

  const datasets = DATASETS.filter((d) => project.datasets.includes(d.id));

  return (
    <div className="container-page py-12 sm:py-16">
      <Link to={`/courses/${course.slug}`} className="text-[0.875rem] text-muted hover:text-ink">
        ← {course.title}
      </Link>
      <div className="mt-4 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="kicker">Final project</p>
          <h1 className="mt-3 font-serif text-[2.3rem] leading-tight sm:text-[2.8rem]">{project.title}</h1>
          <div className="mt-6 max-w-2xl">
            <LessonContent body={project.brief} />
          </div>
          <h2 className="mt-10 font-serif text-[1.6rem]">Questions</h2>
          <ol className="mt-4 space-y-3">
            {project.tasks.map((t, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-line bg-paper p-4 text-[0.9688rem]">
                <span className="font-serif text-brass-dark">{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>

          <h2 className="mt-10 font-serif text-[1.6rem]">Work on it here</h2>
          <p className="mt-2 text-[0.9375rem] text-muted">A SQL editor connected to the Harbourline database. Run anything; nothing you do here is graded.</p>
          <div className="mt-4">
            <SqlScratchpad />
          </div>
        </div>

        <aside className="space-y-8 lg:col-span-5">
          <section className="rounded-2xl border border-line-strong bg-paper p-6">
            <h2 className="font-serif text-[1.4rem]">Your submission</h2>
            {learner.submission && (
              <p className="mt-2 text-[0.875rem] text-muted">
                {STATUS[learner.submission.status]} Last updated {formatDate(learner.submission.submittedAt)}.
              </p>
            )}
            {learner.submission?.feedback && (
              <div className="mt-3">
                <Alert tone="info">
                  <strong className="font-semibold">Feedback:</strong> {learner.submission.feedback}
                </Alert>
              </div>
            )}
            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
            >
              <TextArea label="Your queries and explanations" value={content} onChange={(e) => setContent(e.target.value)} rows={18} className="font-mono text-[0.8125rem]" />
              <TextField
                label="Link to your work (optional)"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/…"
                hint="For example a GitHub repository or a shared document."
              />
              <div aria-live="polite">{message && <Alert tone={message.tone}>{message.text}</Alert>}</div>
              <Button type="submit" loading={saving} className="w-full">
                {learner.submission ? "Update submission" : "Submit project"}
              </Button>
            </form>
          </section>

          {datasets.length > 0 && (
            <section>
              <h2 className="font-serif text-[1.3rem]">Data</h2>
              {datasets.map((d) => (
                <div key={d.id} className="mt-3">
                  <p className="text-[0.9375rem] text-muted">{d.description} Download the tables for Excel or Power BI:</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {d.files.map((f) => (
                      <li key={f}>
                        <a href={datasetUrl(d.id, f)} download className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-3 py-1.5 text-[0.8125rem] font-medium hover:border-ink/40">
                          <Download aria-hidden className="h-3.5 w-3.5" /> {f}.csv
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

export default function Project() {
  return (
    <RequireAuth>
      <ProjectInner />
    </RequireAuth>
  );
}
