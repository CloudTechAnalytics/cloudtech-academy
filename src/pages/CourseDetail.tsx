import { Link, useNavigate, useParams } from "react-router";
import { useState } from "react";
import { Award, BookOpen, CheckCircle2, Circle, Clock, FolderKanban, GraduationCap, Lock, Trophy } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useCourse, useLearner } from "@/lib/data";
import { categoryName } from "@/content";
import { durationLabel } from "@/lib/format";
import { badgeCount, courseMinutes, publishedLessons } from "@/lib/certificates";
import { breadcrumbs, courseJsonLd } from "@/lib/schema";
import { getBackend } from "@/lib/backend";
import { Badge } from "@/components/CourseCard";
import { Button, ButtonLink } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";
import { PageLoading } from "@/lib/auth";
import NotFound from "./NotFound";
import { LEVELS } from "@/content/tracks";
import { isPaid } from "@/lib/commerce";
import { ProfessionalCourseView } from "./ProfessionalCourse";
import { RecommendedNext } from "@/components/RecommendedNext";

export default function CourseDetail() {
  const { slug } = useParams();
  const { course, loading } = useCourse(slug);
  const learner = useLearner(course);
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);

  useSeo({
    title: course ? `${course.title} | ${isPaid(course) ? "Professional Programme" : "Free Course"} | CloudTech Academy` : "Course not found | CloudTech Academy",
    description: course ? course.summary : "This course doesn't exist.",
    noindex: !course,
    jsonLd: course ? [courseJsonLd(course), breadcrumbs([["Home", "/"], ["Courses", "/courses"], [course.title, `/courses/${course.slug}`]])] : undefined,
  });

  if (!course) return loading ? <PageLoading /> : <NotFound />;

  if (isPaid(course)) return <ProfessionalCourseView course={course} learner={learner} />;

  const short = course.format === "short";
  const lessons = publishedLessons(course);
  const available = course.status === "available" && lessons.length > 0;
  const first = lessons[0];
  const resume = lessons.find((l) => l.id === learner.enrollment?.lastLessonId) ?? lessons.find((l) => !learner.progress.completedLessons.includes(l.id)) ?? first;
  const enrolled = !!learner.enrollment;
  const badges = badgeCount(course);
  const eligible = !!learner.eligibility?.eligible;

  const start = async () => {
    if (!first) return;
    setStarting(true);
    try {
      if (learner.signedIn) await (await getBackend()).enroll(course.id);
      navigate(`/learn/${course.slug}/${(enrolled ? resume : first).slug}`);
    } finally {
      setStarting(false);
    }
  };

  const facts = [
    { icon: Clock, label: short ? durationLabel(courseMinutes(course)) : durationLabel(undefined, course.estimatedHours) },
    { icon: BookOpen, label: available ? `${course.modules.length} ${course.modules.length === 1 ? "module" : "modules"}` : `${course.modules.length} modules planned` },
    ...(badges ? [{ icon: Trophy, label: `${badges} ${badges === 1 ? "badge" : "badges"}` }] : []),
    ...(course.projectTitle ? [{ icon: FolderKanban, label: "Final project" }] : []),
    ...(course.certificate.enabled ? [{ icon: GraduationCap, label: "Optional verified certificate" }] : []),
  ];

  return (
    <>
      <section className="border-b border-line">
        <div className="container-page grid gap-10 py-14 sm:py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="text-[0.8125rem] text-muted">
              <Link to="/courses" className="hover:text-ink">
                Courses
              </Link>{" "}
              / {categoryName(course.categoryId)}
            </nav>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Badge tone={available ? "free" : "soon"}>{available ? "Free" : "Coming soon"}</Badge>
              {short && <Badge>Short course</Badge>}
              <Badge>{`Level ${course.level} · ${LEVELS[course.level].name}`}</Badge>
            </div>
            <h1 className="mt-4 font-serif text-[2.5rem] leading-[1.06] tracking-[-0.02em] sm:text-[3.3rem]">{course.title}</h1>
            <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-muted">{course.description}</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.9rem] text-ink/85">
              {facts.map((f) => (
                <li key={f.label} className="flex items-center gap-2">
                  <f.icon aria-hidden className="h-4 w-4 text-brass-dark" /> {f.label}
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-line-strong bg-paper p-6 shadow-[0_30px_60px_-45px_rgba(23,23,23,0.45)]">
              {available ? (
                <>
                  {enrolled && learner.eligibility && (
                    <div className="mb-5">
                      <ProgressBar value={learner.eligibility.percent} label="Course progress" />
                    </div>
                  )}
                  {learner.completion ? (
                    <>
                      <p className="flex items-center gap-2 font-semibold text-success">
                        <CheckCircle2 aria-hidden className="h-5 w-5" /> Course completed
                      </p>
                      <ButtonLink to={`/credentials/${learner.completion.credentialId}`} className="mt-4 w-full">
                        View your credential
                      </ButtonLink>
                      <Button variant="secondary" onClick={() => void start()} loading={starting} className="mt-2 w-full">
                        Review the course
                      </Button>
                      <RecommendedNext course={course} />
                    </>
                  ) : (
                    <Button onClick={() => void start()} loading={starting} className="w-full">
                      {enrolled ? "Continue learning" : "Start Learning Free"}
                    </Button>
                  )}
                  {!learner.signedIn && (
                    <p className="mt-3 text-center text-[0.8125rem] text-muted">
                      Free to read.{" "}
                      <Link to={`/sign-up?next=/courses/${course.slug}`} className="font-semibold text-brass-dark">
                        Create a free account
                      </Link>{" "}
                      to save progress and earn your badges.
                    </p>
                  )}
                  {learner.eligibility && learner.signedIn && !learner.completion && (
                    <div className="mt-6 border-t border-line pt-5">
                      <p className="text-[0.875rem] font-semibold">To complete the course</p>
                      <ul className="mt-3 space-y-2">
                        {learner.eligibility.requirements.map((r) => (
                          <li key={r.key} className="flex items-start gap-2.5 text-[0.875rem]">
                            {r.done ? (
                              <CheckCircle2 aria-label="Done" className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                            ) : (
                              <Circle aria-label="Not yet" className="mt-0.5 h-4 w-4 shrink-0 text-line-strong" />
                            )}
                            <span>
                              {r.label} <span className="text-muted">· {r.detail}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <ButtonLink to={`/courses/${course.slug}/assessment`} variant="secondary">
                          Final assessment
                        </ButtonLink>
                        {learner.project && (
                          <ButtonLink to={`/courses/${course.slug}/project`} variant="secondary">
                            Final project
                          </ButtonLink>
                        )}
                        {eligible && <ButtonLink to={`/courses/${course.slug}/complete`}>Claim your completion badge</ButtonLink>}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="font-serif text-[1.3rem]">In preparation</p>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                    This course is being written. The curriculum below shows what it will cover. In the meantime, the other courses are open now.
                  </p>
                  <ButtonLink to="/courses" variant="secondary" className="mt-5 w-full">
                    Browse open courses
                  </ButtonLink>
                </>
              )}
            </div>
          </aside>
        </div>
      </section>

      <div className="container-page grid gap-12 py-14 sm:py-16 lg:grid-cols-12">
        <section aria-labelledby="curriculum-title" className="lg:col-span-7">
          <h2 id="curriculum-title" className="font-serif text-[1.9rem]">
            {short ? "Modules" : "Curriculum"}
          </h2>
          <ol className="mt-6 border-t border-ink/80">
            {course.modules.map((m, i) => {
              const lesson = m.lessons.find((l) => l.published);
              const done = lesson && learner.progress.completedLessons.includes(lesson.id);
              const earned = learner.badgeModules.has(m.id);
              return (
                <li key={m.id} className="border-b border-line">
                  {lesson ? (
                    <div className="flex items-start gap-4 py-4 sm:px-2">
                      <span className="w-7 shrink-0 pt-0.5 font-serif text-[0.95rem] text-brass-dark">{String(i + 1).padStart(2, "0")}</span>
                      <span className="min-w-0 flex-1">
                        <Link to={`/learn/${course.slug}/${lesson.slug}`} className="block font-medium text-ink hover:text-brass-dark">
                          {m.title}
                        </Link>
                        {lesson.summary && <span className="mt-0.5 block text-[0.875rem] text-muted">{lesson.summary}</span>}
                        {m.badge && (
                          <span className={`mt-2 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium ${earned ? "text-success" : "text-brass-dark"}`}>
                            {earned ? <CheckCircle2 aria-hidden className="h-3.5 w-3.5" /> : <Award aria-hidden className="h-3.5 w-3.5" />}
                            {earned ? `Badge earned: ${m.badge}` : `Badge: ${m.badge}`}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 pt-0.5 text-[0.8125rem] text-muted">{lesson.minutes} min</span>
                      {!m.badge && done && <CheckCircle2 aria-label="Completed" className="mt-0.5 h-4 w-4 shrink-0 text-success" />}
                    </div>
                  ) : (
                    <div className="flex items-start gap-4 py-4 sm:px-2">
                      <span className="w-7 shrink-0 pt-0.5 font-serif text-[0.95rem] text-subtle">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1 text-ink/70">{m.title}</span>
                      <Lock aria-label="Coming soon" className="mt-1 h-3.5 w-3.5 text-subtle" />
                    </div>
                  )}
                </li>
              );
            })}
            {available && course.certificate.enabled && (
              <li className="flex items-start gap-4 border-b border-line py-4 sm:px-2">
                <span className="w-7 shrink-0 pt-0.5 text-brass-dark">
                  <GraduationCap aria-hidden className="h-4 w-4" />
                </span>
                <span className="flex-1">
                  <span className="block font-medium">Final assessment</span>
                  <span className="mt-0.5 block text-[0.875rem] text-muted">
                    Pass it ({course.certificate.passingScore}% or more) to earn the {course.completionBadge ?? course.title} course completion badge.
                  </span>
                </span>
                {learner.completion && <CheckCircle2 aria-label="Completed" className="mt-0.5 h-4 w-4 shrink-0 text-success" />}
              </li>
            )}
          </ol>
        </section>

        <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
          <section aria-labelledby="skills-title">
            <h2 id="skills-title" className="font-serif text-[1.4rem]">
              Skills you'll learn
            </h2>
            <ul className="mt-4 space-y-2">
              {course.skills.map((s) => (
                <li key={s} className="flex items-start gap-2.5 text-[0.9375rem]">
                  <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brass" /> {s}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="prereq-title">
            <h2 id="prereq-title" className="font-serif text-[1.4rem]">
              Before you start
            </h2>
            <ul className="mt-4 space-y-2 text-[0.9375rem] text-ink/85">
              {course.prerequisites.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>
          {course.projectTitle && (
            <section aria-labelledby="project-title">
              <h2 id="project-title" className="font-serif text-[1.4rem]">
                Final project
              </h2>
              <p className="mt-3 text-[0.9375rem] text-ink/85">{course.projectTitle}</p>
            </section>
          )}
          {course.certificate.enabled && (
            <section aria-labelledby="cred-title" className="rounded-xl border border-line bg-paper p-5">
              <h2 id="cred-title" className="font-serif text-[1.3rem]">
                Badges and certificate
              </h2>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">
                {short ? "Earn a free badge for each module you pass, and a" : "Earn a"} free course completion badge with its own credential ID and public page you can
                share. Learning and badges are always free.
              </p>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">
                After you finish, you can choose to get an official verified PDF certificate. It's optional.{" "}
                <Link to="/certificates" className="font-medium text-brass-dark hover:text-ink">
                  How it works
                </Link>
              </p>
            </section>
          )}
        </aside>
      </div>
    </>
  );
}
