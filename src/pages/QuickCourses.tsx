import { useEffect, useState } from "react";
import { BookOpen, ClipboardCheck, Award, Hammer } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { breadcrumbs } from "@/lib/schema";
import { useAuth } from "@/lib/auth";
import { getBackend } from "@/lib/backend";
import { QUICK_CATEGORIES, QUICK_COURSES } from "@/content/quick";
import { QuickCard } from "@/components/QuickCard";

const HOW = [
  { icon: BookOpen, title: "Read", body: "A few short steps, with examples you can copy." },
  { icon: Hammer, title: "Try it", body: "One small task to do yourself, straight away." },
  { icon: ClipboardCheck, title: "Pass the quiz", body: "Five questions. Get three right." },
  { icon: Award, title: "Share your badge", body: "Download it and post it on LinkedIn." },
];

export default function QuickCourses() {
  useSeo({
    title: "Quick Skills: free 15–30 minute courses with badges | CloudTech Academy",
    description:
      "Learn one useful skill in 15 to 30 minutes: AI prompting, Claude, ChatGPT, Canva, CapCut, CVs, LinkedIn and Excel. Pass a five-question quiz and earn a badge to share.",
    jsonLd: breadcrumbs([["Home", "/"], ["Quick skills", "/quick"]]),
  });
  const auth = useAuth();
  const [earned, setEarned] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (auth.status !== "signed-in") return;
    void getBackend()
      .then((b) => b.listQuickCompletions())
      .then((list) => setEarned(new Set(list.map((q) => q.slug))))
      .catch(() => {});
  }, [auth.status]);

  return (
    <>
      <section className="border-b border-line">
        <div className="container-page py-14 sm:py-20">
          <p className="kicker">Quick skills</p>
          <h1 className="mt-4 max-w-3xl font-serif text-[2.6rem] leading-[1.05] tracking-[-0.015em] sm:text-[3.4rem]">
            Learn one useful skill. <span className="text-brass-accent">Earn a badge in 20 minutes.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[1.125rem] leading-relaxed text-muted">
            Short, practical courses you can finish in one sitting. No account needed to start, and they're free.
          </p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="rounded-2xl border border-line bg-paper p-5">
                <p className="flex items-center justify-between">
                  <Icon aria-hidden className="h-5 w-5 text-brass-dark" />
                  <span className="font-serif text-[1.05rem] text-subtle">{i + 1}</span>
                </p>
                <h2 className="mt-3 text-[1rem] font-semibold">{title}</h2>
                <p className="mt-1 text-[0.9375rem] text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="container-page space-y-14 py-14 sm:py-16">
        {QUICK_CATEGORIES.map((cat) => {
          const list = QUICK_COURSES.filter((c) => c.category === cat);
          if (!list.length) return null;
          return (
            <section key={cat} aria-labelledby={`cat-${cat}`}>
              <h2 id={`cat-${cat}`} className="font-serif text-[1.7rem]">
                {cat}
              </h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((c) => (
                  <li key={c.slug}>
                    <QuickCard course={c} earned={earned.has(c.slug)} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
