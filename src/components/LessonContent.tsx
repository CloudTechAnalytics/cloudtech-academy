import { Fragment, useMemo, type ReactNode } from "react";
import { marked, type Token, type Tokens } from "marked";
import { AlertTriangle, Briefcase, Info, Lightbulb } from "lucide-react";
import { parseExercise, parseQuiz } from "@/lib/lesson-format";
import { RunnableSql } from "./sql/RunnableSql";
import { SqlExercise } from "./sql/SqlExercise";
import { LessonQuiz } from "./LessonQuiz";
import { CopyButton } from "./sql/SqlParts";

/**
 * Renders lesson Markdown as React elements. Raw HTML in lesson files is shown as text,
 * never injected, so lesson content (including admin edits) can't run scripts.
 */

const SECTIONS = ["The problem", "The concept", "Example", "Walkthrough", "Practice", "Challenge", "Check your understanding"];

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const safeHref = (href: string) => (/^(https?:|mailto:|\/|#)/i.test(href) ? href : "#");

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function Inline({ tokens }: { tokens?: Token[] }): ReactNode {
  if (!tokens) return null;
  return tokens.map((t, i) => {
    switch (t.type) {
      case "text":
        return (t as Tokens.Text).tokens ? <Inline key={i} tokens={(t as Tokens.Text).tokens} /> : <Fragment key={i}>{decode(t.text)}</Fragment>;
      case "strong":
        return (
          <strong key={i}>
            <Inline tokens={(t as Tokens.Strong).tokens} />
          </strong>
        );
      case "em":
        return (
          <em key={i}>
            <Inline tokens={(t as Tokens.Em).tokens} />
          </em>
        );
      case "del":
        return (
          <del key={i}>
            <Inline tokens={(t as Tokens.Del).tokens} />
          </del>
        );
      case "codespan":
        return <code key={i}>{decode((t as Tokens.Codespan).text)}</code>;
      case "link": {
        const l = t as Tokens.Link;
        const external = /^https?:/i.test(l.href);
        return (
          <a key={i} href={safeHref(l.href)} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            <Inline tokens={l.tokens} />
          </a>
        );
      }
      case "image": {
        const img = t as Tokens.Image;
        return <img key={i} src={safeHref(img.href)} alt={img.text} className="rounded-lg border border-line" loading="lazy" />;
      }
      case "br":
        return <br key={i} />;
      case "escape":
        return <Fragment key={i}>{decode(t.text)}</Fragment>;
      default:
        return <Fragment key={i}>{decode(t.raw)}</Fragment>;
    }
  });
}

const CALLOUTS = {
  TIP: { icon: Lightbulb, label: "Tip", cls: "border-brass/40 bg-brass-pale/35" },
  NOTE: { icon: Info, label: "Note", cls: "border-line-strong bg-sand" },
  WARNING: { icon: AlertTriangle, label: "Watch out", cls: "border-danger/40 bg-danger/10" },
  BUSINESS: { icon: Briefcase, label: "In the business", cls: "border-ink/20 bg-paper" },
} as const;

type Ctx = {
  completedExercises: string[];
  onExerciseSolved: (id: string) => void;
  sectionIndex: { n: number };
  exerciseLabel: { current: string };
};

function Block({ token, ctx }: { token: Token; ctx: Ctx }): ReactNode {
  switch (token.type) {
    case "heading": {
      const h = token as Tokens.Heading;
      const text = h.text.trim();
      if (h.depth === 2) {
        const known = SECTIONS.includes(text);
        if (known) {
          ctx.sectionIndex.n += 1;
          ctx.exerciseLabel.current = text === "Challenge" ? "Challenge" : "Practice";
        }
        return (
          <h2 id={slugify(text)} className="!mt-14 flex items-baseline gap-3 border-t border-line pt-8 first:!mt-0 first:border-t-0 first:pt-0">
            {known && (
              <span aria-hidden className="font-serif text-[1rem] font-medium text-brass-dark">
                {String(ctx.sectionIndex.n).padStart(2, "0")}
              </span>
            )}
            <span>
              <Inline tokens={h.tokens} />
            </span>
          </h2>
        );
      }
      return (
        <h3 id={slugify(text)}>
          <Inline tokens={h.tokens} />
        </h3>
      );
    }
    case "paragraph":
      return (
        <p>
          <Inline tokens={(token as Tokens.Paragraph).tokens} />
        </p>
      );
    case "list": {
      const l = token as Tokens.List;
      const Tag = l.ordered ? "ol" : "ul";
      return (
        <Tag>
          {l.items.map((item, i) => (
            <li key={i}>
              {item.tokens.map((t, j) =>
                t.type === "text" ? <Inline key={j} tokens={(t as Tokens.Text).tokens ?? [t]} /> : <Block key={j} token={t} ctx={ctx} />,
              )}
            </li>
          ))}
        </Tag>
      );
    }
    case "table": {
      const t = token as Tokens.Table;
      return (
        <div className="table-scroll not-prose">
          <table>
            <thead>
              <tr>
                {t.header.map((c, i) => (
                  <th key={i} scope="col">
                    <Inline tokens={c.tokens} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>
                      <Inline tokens={c.tokens} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case "blockquote": {
      const q = token as Tokens.Blockquote;
      const m = q.text.match(/^\[!(TIP|NOTE|WARNING|BUSINESS)\]\s*/);
      const inner = marked.lexer(m ? q.text.slice(m[0].length) : q.text);
      if (!m)
        return (
          <blockquote className="border-l-2 border-brass pl-4 font-serif text-[1.15rem] italic text-ink/90">
            {inner.map((t, i) => (
              <Block key={i} token={t} ctx={ctx} />
            ))}
          </blockquote>
        );
      const c = CALLOUTS[m[1] as keyof typeof CALLOUTS];
      return (
        <aside className={`not-prose rounded-xl border px-4 py-3.5 text-[0.9688rem] leading-relaxed ${c.cls}`}>
          <p className="mb-1 flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink/80">
            <c.icon aria-hidden className="h-4 w-4 text-brass-dark" /> {c.label}
          </p>
          <div className="space-y-2 [&_code]:rounded [&_code]:bg-ivory/70 [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.88em]">
            {inner.map((t, i) => (
              <Block key={i} token={t} ctx={ctx} />
            ))}
          </div>
        </aside>
      );
    }
    case "code": {
      const c = token as Tokens.Code;
      const lang = (c.lang ?? "").trim();
      try {
        if (lang === "exercise") {
          const spec = parseExercise(c.text);
          return (
            <SqlExercise
              spec={spec}
              label={ctx.exerciseLabel.current === "Challenge" ? "Challenge" : "Practice"}
              completed={ctx.completedExercises.includes(spec.id)}
              onSolved={ctx.onExerciseSolved}
            />
          );
        }
        if (lang === "quiz") return <LessonQuiz questions={parseQuiz(c.text)} />;
      } catch (e) {
        return <p className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-[0.875rem]">This block couldn't be read: {e instanceof Error ? e.message : String(e)}</p>;
      }
      if (/^sql\b/.test(lang) && /\brun\b/.test(lang)) return <RunnableSql sql={c.text} />;
      return (
        <div className="not-prose relative">
          <pre className="code-block pr-20">
            <code>{c.text}</code>
          </pre>
          <div className="absolute right-2 top-2">
            <CopyButton text={c.text} />
          </div>
        </div>
      );
    }
    case "hr":
      return <hr />;
    case "space":
      return null;
    case "html":
      return <p>{token.raw}</p>;
    default:
      return "text" in token ? <p>{decode(String(token.text))}</p> : null;
  }
}

export function LessonContent({
  body,
  completedExercises = [],
  onExerciseSolved = () => {},
}: {
  body: string;
  completedExercises?: string[];
  onExerciseSolved?: (id: string) => void;
}) {
  const tokens = useMemo(() => marked.lexer(body), [body]);
  const ctx: Ctx = { completedExercises, onExerciseSolved, sectionIndex: { n: 0 }, exerciseLabel: { current: "Practice" } };
  return (
    <div className="lesson">
      {tokens.map((t, i) => (
        <Block key={i} token={t} ctx={ctx} />
      ))}
    </div>
  );
}

/** Section headings in a lesson body, for the "On this page" list. */
export function lessonSections(body: string) {
  return [...body.matchAll(/^## (.+)$/gm)].map((m) => ({ id: slugify(m[1].trim()), title: m[1].trim() }));
}
