import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { CheckCircle2, Circle, Clock, FilePlus2, GitBranch, Lightbulb, RotateCcw, Save, XCircle } from "lucide-react";
import type { GitTaskSpec, GitTermSpec } from "@/content/types";
import { checkGitTask, commitCount, fileFlags, newRepo, prepare, run, type Repo } from "@/lib/git-sim";

type Entry = { cmd: string; out: string; error: boolean };

const FLAG_TITLE: Record<string, string> = { "?": "Untracked: Git does not know this file yet", M: "Changed since the last add or commit", A: "Staged: will be in the next commit", U: "Conflict: fix it, then git add" };

/**
 * A Git practice terminal built into the lesson. Learners type real Git commands against a simulated repository,
 * and edit its files in the editor beside the terminal. Used free (```gitterm) and for checked tasks (```gittask).
 */
function Lab({ files, setup, identity, height = 300, title, repoRef, onChange }: { files: Record<string, string>; setup: string[]; identity?: boolean; height?: number; title: string; repoRef: { current: Repo | null }; onChange?: () => void }) {
  const uid = useId();
  const make = () => prepare({ files, setup, identity });
  const [, setTick] = useState(0);
  if (!repoRef.current) repoRef.current = make();
  const repo = repoRef.current;
  const bump = () => {
    setTick((t) => t + 1);
    onChange?.();
  };
  const [log, setLog] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [recall, setRecall] = useState(-1);
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [log]);

  const names = Object.keys(repo.files).sort();
  const flags = fileFlags(repo);
  const current = selected && selected in repo.files ? selected : (names[0] ?? null);
  const text = draft ?? (current ? repo.files[current] : "");

  const submit = () => {
    const line = input.trim();
    if (!line) return;
    const r = run(repo, line);
    setInput("");
    setRecall(-1);
    setDraft(null);
    if (r.out === "\u0000clear") setLog([]);
    else setLog((l) => [...l, { cmd: line, out: r.out, error: r.error }].slice(-120));
    bump();
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const past = repo.history;
    if (e.key === "ArrowUp" && past.length) {
      e.preventDefault();
      const i = recall < 0 ? past.length - 1 : Math.max(0, recall - 1);
      setRecall(i);
      setInput(past[i]);
    } else if (e.key === "ArrowDown" && recall >= 0) {
      e.preventDefault();
      const i = recall + 1;
      setRecall(i >= past.length ? -1 : i);
      setInput(i >= past.length ? "" : past[i]);
    }
  };

  const save = () => {
    if (current === null || draft === null) return;
    repo.files[current] = draft;
    setDraft(null);
    bump();
  };

  const addFile = () => {
    const n = newName.trim();
    if (!n || /\s|\.\./.test(n)) return;
    if (!(n in repo.files)) repo.files[n] = "";
    setSelected(n);
    setDraft(null);
    setNewName("");
    bump();
  };

  const reset = () => {
    repoRef.current = make();
    setLog([]);
    setDraft(null);
    setSelected(null);
    setInput("");
    bump();
  };

  const prompt = `~/project${repo.initialized ? ` (${repo.head})` : ""}$`;

  return (
    <div className="not-prose overflow-hidden rounded-xl border border-line-strong bg-paper">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2" style={{ background: "var(--color-code-bg)" }}>
        <span className="text-[0.8125rem] font-semibold text-brass-light">{title}</span>
        <div className="flex items-center gap-2">
          {repo.initialized && (
            <span className="inline-flex items-center gap-1 rounded-md bg-cream/10 px-2 py-1 text-[0.75rem] font-medium text-cream/90">
              <GitBranch aria-hidden className="h-3.5 w-3.5" /> {repo.head} · {commitCount(repo)} commit{commitCount(repo) === 1 ? "" : "s"}
            </span>
          )}
          <button type="button" onClick={reset} title="Start this practice again" className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[0.75rem] font-medium text-cream/80 hover:bg-cream/10 hover:text-cream">
            <RotateCcw aria-hidden className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>
      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="min-w-0 border-b border-line-strong bg-white lg:border-b-0 lg:border-r">
          <p className="border-b border-line px-3 py-1.5 text-[0.75rem] font-semibold text-muted">Files in your project folder</p>
          <div className="flex flex-wrap gap-1 border-b border-line p-2">
            {names.length === 0 && <span className="px-1 text-[0.8125rem] text-muted">No files yet. Add one below.</span>}
            {names.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setSelected(n);
                  setDraft(null);
                }}
                aria-pressed={n === current}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[0.78rem] ${n === current ? "border-ink bg-sand" : "border-line hover:bg-sand"}`}
              >
                {n}
                {flags[n] && (
                  <span title={FLAG_TITLE[flags[n]]} className={`rounded px-1 text-[0.68rem] font-bold ${flags[n] === "U" ? "bg-danger/15 text-danger" : flags[n] === "A" ? "bg-success-bg text-success" : "bg-brass-pale text-brass-dark"}`}>
                    {flags[n]}
                  </span>
                )}
              </button>
            ))}
          </div>
          {current !== null && (
            <div>
              <label htmlFor={`${uid}-ed`} className="sr-only">
                Edit {current}
              </label>
              <textarea
                id={`${uid}-ed`}
                value={text}
                onChange={(e) => setDraft(e.target.value)}
                rows={7}
                spellCheck={false}
                className="block w-full resize-y whitespace-pre-wrap break-words bg-transparent px-3 py-2.5 font-mono text-[0.82rem] leading-relaxed text-ink focus:outline-2 focus:-outline-offset-2 focus:outline-brass-dark"
              />
              <div className="flex flex-wrap items-center gap-2 border-t border-line px-2 py-1.5">
                <button type="button" onClick={save} disabled={draft === null} className="inline-flex items-center gap-1 rounded-md bg-ink px-2.5 py-1.5 text-[0.78rem] font-semibold text-ivory disabled:opacity-40">
                  <Save aria-hidden className="h-3.5 w-3.5" /> Save file
                </button>
                {draft !== null && <span className="text-[0.75rem] text-muted">Unsaved changes</span>}
              </div>
            </div>
          )}
          <div className="flex items-center gap-1.5 border-t border-line p-2">
            <label htmlFor={`${uid}-new`} className="sr-only">
              New file name
            </label>
            <input id={`${uid}-new`} value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addFile()} placeholder="new-file.txt" className="min-w-0 flex-1 rounded-md border border-line-strong px-2 py-1.5 font-mono text-[0.8rem]" />
            <button type="button" onClick={addFile} className="inline-flex items-center gap-1 rounded-md border border-line-strong px-2 py-1.5 text-[0.78rem] font-medium hover:bg-sand">
              <FilePlus2 aria-hidden className="h-3.5 w-3.5" /> Add
            </button>
          </div>
        </div>
        <div className="min-w-0" style={{ background: "var(--color-code-bg)" }}>
          <div ref={scroller} role="log" aria-live="polite" aria-label="Terminal output" className="overflow-y-auto px-3.5 py-3 font-mono text-[0.8rem] leading-relaxed text-cream" style={{ height }}>
            {log.length === 0 && <p className="text-cream/55">Type a command below and press Enter. Type help for the commands you can use. Press the up arrow to bring back an earlier command.</p>}
            {log.map((e, i) => (
              <div key={i} className="mb-2">
                <p className="text-brass-light">
                  <span className="text-cream/50">$ </span>
                  {e.cmd}
                </p>
                {e.out && <pre className={`whitespace-pre-wrap break-words ${e.error ? "text-[#ff9b8e]" : "text-cream"}`}>{e.out}</pre>}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-cream/10 px-3.5 py-2.5 font-mono text-[0.8rem]">
            <span className="shrink-0 text-cream/60">{prompt}</span>
            <label htmlFor={`${uid}-cmd`} className="sr-only">
              Type a command
            </label>
            <input id={`${uid}-cmd`} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => (e.key === "Enter" ? submit() : onKey(e))} autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder="git status" className="min-w-0 flex-1 bg-transparent text-cream placeholder:text-cream/35 focus:outline-none" />
            <button type="button" onClick={submit} className="shrink-0 rounded-md bg-cream/10 px-2.5 py-1 text-[0.75rem] font-semibold text-cream hover:bg-cream/20">
              Run
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GitTerm({ spec }: { spec: GitTermSpec }) {
  const repoRef = useRef<Repo | null>(null);
  return <Lab files={spec.files} setup={spec.setup} identity={spec.identity} height={spec.height} title={spec.title ?? "Practice terminal: type real Git commands"} repoRef={repoRef} />;
}

/** A Git task: do the work in the terminal, then check the repository against the rules. */
export function GitTask({ spec, prompt, note, label, completed, onSolved }: { spec: GitTaskSpec; prompt: ReactNode; note?: ReactNode; label: string; completed: boolean; onSolved: (exerciseId: string) => void }) {
  const id = useId();
  const repoRef = useRef<Repo | null>(null);
  const [results, setResults] = useState<{ label: string; passed: boolean }[] | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [solved, setSolved] = useState(completed);
  useEffect(() => {
    if (completed) setSolved(true);
  }, [completed]);

  const check = () => {
    const r = repoRef.current ?? newRepo();
    const res = checkGitTask(r, spec.rules);
    setResults(res.results);
    if (res.passed && !solved) {
      setSolved(true);
      setShowSample(true);
      onSolved(spec.id);
    }
  };

  return (
    <section aria-labelledby={`${id}-title`} className="not-prose rounded-2xl border border-line-strong bg-paper p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p id={`${id}-title`} className="text-[0.8125rem] font-semibold text-brass-dark">
          {label}
          {spec.required ? "" : " · optional"}
        </p>
        <span className="flex items-center gap-3 text-[0.8125rem]">
          <span className="inline-flex items-center gap-1 text-muted">
            <Clock aria-hidden className="h-3.5 w-3.5" /> {spec.minutes} min
          </span>
          {solved && (
            <span className="inline-flex items-center gap-1.5 font-semibold text-success">
              <CheckCircle2 aria-hidden className="h-4 w-4" /> Completed
            </span>
          )}
        </span>
      </div>
      <div className="mt-2 space-y-2 text-[1rem] leading-relaxed text-ink [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-sand [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.88em]">{prompt}</div>

      <div className="mt-4 rounded-lg border border-line bg-ivory px-3.5 py-3">
        <p className="text-[0.8125rem] font-semibold text-muted">Your repository is checked for</p>
        <ul className="mt-2 space-y-1.5 text-[0.9rem]">
          {spec.rules.map((rule, i) => {
            const r = results?.[i];
            return (
              <li key={i} className="flex items-start gap-2">
                {!r ? <Circle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-subtle" /> : r.passed ? <CheckCircle2 aria-label="Met" className="mt-0.5 h-4 w-4 shrink-0 text-success" /> : <XCircle aria-label="Not met yet" className="mt-0.5 h-4 w-4 shrink-0 text-danger" />}
                <span>{rule.label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4">
        <Lab files={spec.files} setup={spec.setup} identity={spec.identity} height={spec.height} title="Your practice terminal" repoRef={repoRef} onChange={() => setResults(null)} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={check} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ink px-5 text-[0.9375rem] font-semibold text-ivory hover:bg-ink/85">
          Check my work
        </button>
        {spec.hint && (
          <button type="button" onClick={() => setShowHint((h) => !h)} aria-expanded={showHint} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.8125rem] font-medium text-ink hover:bg-sand">
            <Lightbulb aria-hidden className="h-4 w-4 text-brass-dark" /> {showHint ? "Hide hint" : "Show hint"}
          </button>
        )}
        {solved && (
          <button type="button" onClick={() => setShowSample((s) => !s)} aria-expanded={showSample} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.8125rem] font-medium text-ink hover:bg-sand">
            {showSample ? "Hide the model answer" : "Compare with a model answer"}
          </button>
        )}
      </div>

      {showHint && spec.hint && <p className="mt-3 rounded-lg bg-sand px-3.5 py-2.5 text-[0.9rem] text-ink">{spec.hint}</p>}
      <div aria-live="polite">
        {results && !results.every((r) => r.passed) && <p className="mt-3 rounded-lg border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-[0.9rem] text-ink">Not there yet. Look at the points marked with a cross, run more commands in the terminal, then check again. You can use Reset to start over.</p>}
        {results && results.every((r) => r.passed) && <p className="mt-3 rounded-lg border border-success/40 bg-success-bg px-3.5 py-2.5 text-[0.9rem] text-success">Done. Compare your commands with the model answer below.</p>}
      </div>
      {solved && showSample && (
        <div className="mt-3 rounded-lg border border-line bg-ivory px-3.5 py-3 text-[0.9375rem] leading-relaxed text-ink">
          <p className="mb-1.5 text-[0.8125rem] font-semibold text-muted">Model answer: one way to do it</p>
          <pre className="code-block overflow-x-auto text-[0.84rem]">
            <code>{spec.sample.join("\n")}</code>
          </pre>
          {note && <div className="mt-3 border-t border-line pt-3 text-muted">{note}</div>}
        </div>
      )}
    </section>
  );
}
