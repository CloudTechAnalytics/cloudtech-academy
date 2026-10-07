import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { Course } from "@/content/types";
import type { Pathway } from "@/content/pathways";
import { coursePrice, formatPrice, isPaid } from "@/lib/commerce";

/** A suggested route through related courses, in order. It is a guide only: nothing in it is locked behind the step before. */
export function PathwayStrip({ pathway, courses, current }: { pathway: Pathway; courses: Course[]; current?: string }) {
  const steps = pathway.courseIds.map((id) => courses.find((c) => c.id === id)).filter((c): c is Course => !!c);
  if (!steps.length) return null;
  return (
    <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <p className="font-serif text-[1.25rem]">{pathway.title}</p>
      <p className="mt-1 text-[0.9375rem] text-muted">{pathway.blurb}</p>
      <ol className="mt-5 flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-0">
        {steps.map((c, i) => {
          const price = isPaid(c) ? coursePrice(c) : null;
          const here = c.id === current;
          return (
            <li key={c.id} className="flex flex-1 flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:gap-0">
              <Link
                to={`/courses/${c.slug}`}
                aria-current={here ? "page" : undefined}
                className={`flex h-full flex-1 flex-col rounded-xl border p-4 transition-colors ${here ? "border-brass bg-brass-pale/50" : "border-line bg-ivory hover:border-brass/60"}`}
              >
                <span className="text-[0.75rem] font-semibold uppercase tracking-wide text-brass-dark">Step {i + 1}</span>
                <span className="mt-1 font-semibold leading-snug text-ink">{c.title}</span>
                <span className="mt-1 text-[0.8125rem] text-muted">{c.durationLabel ?? ""}</span>
                {price && <span className="mt-2 text-[0.875rem] font-semibold text-ink">{formatPrice(price.amount, price.currency)}</span>}
              </Link>
              {i < steps.length - 1 && <ArrowRight aria-hidden className="mx-2 hidden h-5 w-5 shrink-0 text-brass-dark lg:block" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
