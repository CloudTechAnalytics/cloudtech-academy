import { Link } from "react-router";
import { Award, BookOpen, CheckCircle2, Clock, FolderKanban, GraduationCap, Lock, MessageCircle, Target, Users, UserCheck } from "lucide-react";
import type { Course } from "@/content/types";
import { useProgrammes, type useLearner } from "@/lib/data";
import { categoryName } from "@/content";
import { badgeCount, publishedLessons } from "@/lib/certificates";
import { durationLabel } from "@/lib/format";
import { DELIVERY_LABEL, ENROLMENT_MESSAGE, coursePrice, enrolmentState, formatPrice, isPaid, programmeCourseIds } from "@/lib/commerce";
import { Badge } from "@/components/CourseCard";
import { ButtonLink } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";

/** What this course really includes. Only things CloudTech provides are listed; nothing is promised by default. */
export function whatsIncluded(course: Course): string[] {
  const lessons = publishedLessons(course).length;
  const items: string[] = [];
  if (lessons) items.push(`${course.modules.length} structured ${course.modules.length === 1 ? "module" : "modules"} with ${lessons} lessons`);
  if (course.deliveryType) items.push(DELIVERY_LABEL[course.deliveryType]);
  if (course.projectTitle) items.push(`Hands-on project: ${course.projectTitle}`);
  if (course.certificate.enabled) items.push(`Final assessment (${course.certificate.passingScore}% to pass)`);
  if (badgeCount(course)) items.push(`${badgeCount(course)} module ${badgeCount(course) === 1 ? "badge" : "badges"}`);
  if (course.certificate.enabled) items.push("Professional certificate once you meet the course requirements");
  if (course.instructorSupport) items.push("Instructor support");
  if (course.communityAccess) items.push("CloudTech WhatsApp community access");
  items.push(...(course.included ?? []));
  return [...new Set(items)];
}

function Heading({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="font-serif text-[1.9rem] leading-tight">
      {children}
    </h2>
  );
}

/** The premium sales page for a paid course. The lessons themselves stay locked until the learner has access. */
export function ProfessionalCourseView({ course, learner }: { course: Course; learner: ReturnType<typeof useLearner> }) {
  const lessons = publishedLessons(course);
  const programmes = useProgrammes();
  const parents = programmes.filter((t) => isPaid(t) && programmeCourseIds(t).includes(course.id));
  const enrolled = !!learner.enrollment;
  const resume = lessons.find((l) => l.id === learner.enrollment?.lastLessonId) ?? lessons.find((l) => !learner.progress.completedLessons.includes(l.id)) ?? lessons[0];
  const price = coursePrice(course);
  const state = enrolmentState(course);
  const included = whatsIncluded(course);
  const overview = course.overview?.trim() || course.description;
  const hours = course.durationLabel || durationLabel(undefined, course.estimatedHours);
  const enrollTo = learner.signedIn ? `/courses/${course.slug}/enroll` : `/sign-up?next=${encodeURIComponent(`/courses/${course.slug}/enroll`)}`;
  const priceText = price ? formatPrice(price.amount, price.currency) : "";

  // A course that is only sold inside a programme has no price of its own: point to the programmes that include it.
  const bundled = parents.length > 0 && (!price || state !== "open");
  const buy = bundled ? (
    <div className="space-y-3">
      <p className="text-[0.9375rem] text-muted">This professional course is part of {parents.length === 1 ? "a Professional Programme" : "these Professional Programmes"}. Enrolling in a programme opens every professional course in it.</p>
      {parents.map((t) => {
        const p = coursePrice(t);
        return (
          <ButtonLink key={t.id} to={`/programmes/${t.slug}`} className="w-full" arrow>
            {t.programmeName ?? t.title}
            {p ? ` · ${formatPrice(p.amount, p.currency)}` : ""}
          </ButtonLink>
        );
      })}
    </div>
  ) : (
    state === "open" ? (
      <ButtonLink to={enrollTo} className="w-full">
        {price ? `Enroll Now — ${priceText}` : "Enroll Now"}
      </ButtonLink>
    ) : (
      <p className="rounded-lg border border-line-strong bg-sand px-4 py-3 text-center text-[0.9375rem] text-muted">{ENROLMENT_MESSAGE[state]}</p>
    )
  );

  const facts = [
    { icon: Clock, label: hours },
    { icon: BookOpen, label: `${course.modules.length} ${course.modules.length === 1 ? "module" : "modules"}` },
    { icon: Users, label: DELIVERY_LABEL[course.deliveryType ?? "self_paced"] },
    ...(course.projectTitle ? [{ icon: FolderKanban, label: "Capstone project" }] : []),
    ...(course.certificate.enabled ? [{ icon: GraduationCap, label: "Professional certificate" }] : []),
  ];

  return (
    <>
      <section className="border-b border-line bg-ink text-ivory">
        <div className="container-page grid gap-10 py-14 sm:py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="text-[0.8125rem] text-ivory/70">
              <Link to="/programmes" className="hover:text-ivory">
                Professional Programmes
              </Link>{" "}
              / {categoryName(course.categoryId)}
            </nav>
            <p className="mt-5 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-brass-pale">Professional Programme · Build a career</p>
            <h1 className="mt-3 font-serif text-[2.5rem] leading-[1.06] tracking-[-0.02em] sm:text-[3.3rem]">{course.title}</h1>
            <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-ivory/80">{course.summary}</p>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[0.9rem] text-ivory/90">
              {facts.map((f) => (
                <li key={f.label} className="flex items-center gap-2">
                  <f.icon aria-hidden className="h-4 w-4 text-brass-pale" /> {f.label}
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-brass/40 bg-paper p-6 text-ink shadow-[0_30px_60px_-35px_rgba(0,0,0,0.6)]">
              {enrolled ? (
                <>
                  <p className="flex items-center gap-2 font-semibold text-success">
                    <CheckCircle2 aria-hidden className="h-5 w-5" /> You are enrolled
                  </p>
                  {learner.eligibility && (
                    <div className="mt-4">
                      <ProgressBar value={learner.eligibility.percent} label="Programme progress" />
                    </div>
                  )}
                  {resume && (
                    <ButtonLink to={`/learn/${course.slug}/${resume.slug}`} className="mt-5 w-full">
                      Continue learning
                    </ButtonLink>
                  )}
                </>
              ) : (
                <>
                  {price && !bundled ? (
                    <div>
                      <p className="flex flex-wrap items-baseline gap-3">
                        <span className="font-serif text-[2.4rem] leading-none">{priceText}</span>
                        {price.discounted && <s className="text-[1.1rem] text-subtle">{formatPrice(price.listAmount, price.currency)}</s>}
                      </p>
                      <p className="mt-1 text-[0.8125rem] text-muted">One-off payment. Lessons unlock the moment your payment is confirmed.</p>
                    </div>
                  ) : (
                    <p className="font-serif text-[1.4rem]">{bundled ? "Included in a Professional Programme" : "Professional Programme"}</p>
                  )}
                  <div className="mt-5">{buy}</div>
                  {!learner.signedIn && state === "open" && !bundled && <p className="mt-3 text-center text-[0.8125rem] text-muted">You'll create a free account first, then pay.</p>}
                </>
              )}
              {included.length > 0 && (
                <div className="mt-6 border-t border-line pt-5">
                  <p className="text-[0.875rem] font-semibold">What's included</p>
                  <ul className="mt-3 space-y-2">
                    {included.map((i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[0.875rem]">
                        <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brass-dark" /> {i}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <div className="container-page grid gap-14 py-14 sm:py-16 lg:grid-cols-12">
        <div className="space-y-14 lg:col-span-7">
          <section aria-labelledby="overview-title">
            <Heading id="overview-title">Programme overview</Heading>
            <p className="mt-4 whitespace-pre-line text-[1.0625rem] leading-relaxed text-ink/85">{overview}</p>
          </section>

          {!!course.audience?.length && (
            <section aria-labelledby="audience-title">
              <Heading id="audience-title">Who this is for</Heading>
              <ul className="mt-4 space-y-2.5">
                {course.audience.map((a) => (
                  <li key={a} className="flex items-start gap-2.5 text-[0.9375rem]">
                    <UserCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brass-dark" /> {a}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="curriculum-title">
            <Heading id="curriculum-title">Curriculum</Heading>
            <ol className="mt-6 border-t border-ink/80">
              {course.modules.map((m, i) => {
                const items = m.lessons.filter((l) => l.published);
                return (
                  <li key={m.id} className="border-b border-line">
                    <details className="group py-4 sm:px-2">
                      <summary className="flex cursor-pointer list-none items-start gap-4">
                        <span className="w-7 shrink-0 pt-0.5 font-serif text-[0.95rem] text-brass-dark">{String(i + 1).padStart(2, "0")}</span>
                        <span className="min-w-0 flex-1 font-medium">{m.title}</span>
                        <span className="shrink-0 pt-0.5 text-[0.8125rem] text-muted">{items.reduce((n, l) => n + l.minutes, 0)} min</span>
                        {!enrolled && <Lock aria-label="Unlocks when you enroll" className="mt-1 h-3.5 w-3.5 shrink-0 text-subtle" />}
                      </summary>
                      <ul className="ml-11 mt-3 space-y-2 text-[0.9rem] text-muted">
                        {items.map((l) => (
                          <li key={l.id}>
                            {enrolled ? (
                              <Link to={`/learn/${course.slug}/${l.slug}`} className="hover:text-brass-dark">
                                {l.title}
                              </Link>
                            ) : (
                              l.title
                            )}
                            {l.summary && <span className="block text-[0.8125rem] text-subtle">{l.summary}</span>}
                          </li>
                        ))}
                        {m.badge && (
                          <li className="flex items-center gap-1.5 text-brass-dark">
                            <Award aria-hidden className="h-3.5 w-3.5" /> Badge: {m.badge}
                          </li>
                        )}
                      </ul>
                    </details>
                  </li>
                );
              })}
            </ol>
          </section>

          {!!course.projectPreviews?.length && (
            <section aria-labelledby="projects-title">
              <Heading id="projects-title">Projects you'll build</Heading>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {course.projectPreviews.map((p) => (
                  <li key={p.title} className="rounded-xl border border-line bg-paper p-5">
                    <FolderKanban aria-hidden className="h-5 w-5 text-brass-dark" />
                    <p className="mt-3 font-serif text-[1.15rem]">{p.title}</p>
                    <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted">{p.summary}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {course.certificate.enabled && (
            <section aria-labelledby="assess-title">
              <Heading id="assess-title">Assessment and certificate</Heading>
              <p className="mt-4 text-[1rem] leading-relaxed text-ink/85">
                You are assessed with a final assessment (pass mark {course.certificate.passingScore}%){course.projectTitle ? " and a capstone project" : ""}. Your professional
                certificate is awarded when you meet those requirements. Paying for the programme does not award it on its own.
              </p>
            </section>
          )}

          {course.instructor?.name && (
            <section aria-labelledby="instructor-title">
              <Heading id="instructor-title">Your instructor</Heading>
              <div className="mt-4 rounded-xl border border-line bg-paper p-5">
                <p className="font-serif text-[1.2rem]">{course.instructor.name}</p>
                {course.instructor.title && <p className="text-[0.875rem] font-semibold text-brass-dark">{course.instructor.title}</p>}
                {course.instructor.bio && <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{course.instructor.bio}</p>}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
          {!!course.outcomes?.length && (
            <section aria-labelledby="learn-title">
              <h2 id="learn-title" className="font-serif text-[1.4rem]">
                What you'll learn
              </h2>
              <ul className="mt-4 space-y-2">
                {course.outcomes.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-[0.9375rem]">
                    <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brass" /> {s}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {course.skills.length > 0 && (
            <section aria-labelledby="skills-title">
              <h2 id="skills-title" className="font-serif text-[1.4rem]">
                Skills you'll practise
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {course.skills.map((s) => (
                  <li key={s}>
                    <Badge>{s}</Badge>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {course.professionalOutcome && (
            <section aria-labelledby="outcome-title" className="rounded-xl border border-brass/40 bg-brass-pale/40 p-5">
              <h2 id="outcome-title" className="flex items-center gap-2 font-serif text-[1.3rem]">
                <Target aria-hidden className="h-5 w-5 text-brass-dark" /> Professional outcome
              </h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink/85">{course.professionalOutcome}</p>
            </section>
          )}
          {course.communityAccess && (
            <section aria-labelledby="community-title">
              <h2 id="community-title" className="flex items-center gap-2 font-serif text-[1.3rem]">
                <MessageCircle aria-hidden className="h-5 w-5 text-brass-dark" /> Community
              </h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">Connect and grow with other learners in the CloudTech community.</p>
            </section>
          )}
          {course.prerequisites.length > 0 && (
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
          )}
          {!enrolled && (state === "open" || bundled) && (
            <div className="rounded-xl border border-line-strong bg-paper p-5">
              <p className="font-serif text-[1.2rem]">Ready to build your career?</p>
              <div className="mt-4">{buy}</div>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
