import { useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef, useState, type KeyboardEvent, type ReactNode, type Ref } from "react";
import { CheckCircle2, Circle, Clock, Lightbulb, Monitor, MonitorSmartphone, RotateCcw, Smartphone, Terminal, XCircle } from "lucide-react";
import type { LiveSpec, TaskRule, WebFiles, WebTaskSpec } from "@/content/types";
import { buildDoc } from "@/lib/web-doc";
import { checkWebTask, isRenderRule, type RenderReport } from "@/lib/task-check";
import { CopyButton } from "./sql/SqlParts";

type Tab = "html" | "css" | "js";
const TAB_NAMES: Record<Tab, string> = { html: "index.html", css: "style.css", js: "script.js" };
const ALL_TABS: Tab[] = ["html", "css", "js"];
/** The width the "Desktop" preview pretends the screen has. */
const DESKTOP_WIDTH = 1100;
/** The width a task's rendered-page checks use unless a rule says `at`. */
const DEFAULT_CHECK_WIDTH = 1000;

/** Loads the page in a hidden iframe `width` pixels wide and asks it about the rules; resolves when it answers. */
function probeAt(doc: string, width: number, rules: TaskRule[]): Promise<{ results: boolean[]; page: string; output: string }> {
  return new Promise((resolve) => {
    const f = document.createElement("iframe");
    f.setAttribute("sandbox", "allow-scripts allow-modals allow-forms");
    f.setAttribute("aria-hidden", "true");
    f.tabIndex = -1;
    f.style.cssText = `position:fixed;left:-10000px;top:0;width:${width}px;height:800px;border:0;opacity:0;pointer-events:none`;
    const lines: string[] = [];
    const id = Math.random().toString(36).slice(2);
    let done = false;
    const finish = (r: { results: boolean[]; page: string; output: string }) => {
      if (done) return;
      done = true;
      window.removeEventListener("message", on);
      f.remove();
      resolve(r);
    };
    const on = (e: MessageEvent) => {
      if (e.source !== f.contentWindow) return;
      const d = e.data as { __ct?: number; type?: string; text?: string; id?: string; results?: boolean[]; page?: string };
      if (!d || d.__ct !== 1) return;
      if (d.type === "console") lines.push(String(d.text ?? ""));
      else if (d.type === "ready") f.contentWindow?.postMessage({ __ct: "probe", id, rules }, "*");
      else if (d.type === "probe" && d.id === id) finish({ results: d.results ?? [], page: d.page ?? "", output: lines.join("\n") });
    };
    window.addEventListener("message", on);
    setTimeout(() => finish({ results: [], page: "", output: lines.join("\n") }), 6000);
    f.srcdoc = doc;
    document.body.appendChild(f);
  });
}

export type LabHandle = {
  getFiles: () => WebFiles;
  setFiles: (files: WebFiles) => void;
  /** Re-renders the preview now and resolves once the page has loaded. */
  refresh: () => Promise<void>;
  /** Asks the rendered page about the rules that need it. */
  probe: (rules: TaskRule[]) => Promise<RenderReport>;
};

type Line = { level: string; text: string };

/**
 * The editor and live preview shared by free examples (```live) and web tasks (```webtask).
 * The code runs in a sandboxed iframe that can't reach this site, and its console output is shown below it.
 */
function CodeLab({
  files: initial,
  bootstrap,
  height = 340,
  tabs,
  title,
  stack,
  storageKey,
  handle,
}: {
  files: WebFiles;
  bootstrap?: boolean;
  height?: number;
  tabs?: Tab[];
  title: string;
  /** Preview under the editor at full width. */
  stack?: boolean;
  /** Where to keep the learner's work in this browser. */
  storageKey?: string;
  handle?: Ref<LabHandle>;
}) {
  const uid = useId();
  const visible = useMemo(() => tabs ?? ALL_TABS.filter((t) => initial[t] !== undefined), [tabs, initial]);
  const [files, setFiles] = useState<WebFiles>(() => {
    if (storageKey) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) return { ...initial, ...(JSON.parse(saved) as WebFiles) };
      } catch {
        /* a private window just doesn't remember */
      }
    }
    return initial;
  });
  const [tab, setTab] = useState<Tab>(visible[0] ?? "html");
  const [doc, setDoc] = useState(() => buildDoc(files, { bootstrap, assetBase: window.location.origin }));
  const [mode, setMode] = useState<"fit" | "phone" | "desktop">("fit");
  const [paneWidth, setPaneWidth] = useState(0);
  const pane = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [note, setNote] = useState("");
  const frame = useRef<HTMLIFrameElement>(null);
  const filesRef = useRef(files);
  const docRef = useRef(doc);
  const readyRef = useRef(false);
  const linesRef = useRef<Line[]>([]);
  const waiters = useRef<(() => void)[]>([]);
  const skipTab = useRef(false);
  filesRef.current = files;

  const render = useCallback(
    (f: WebFiles) => {
      const next = buildDoc(f, { bootstrap, assetBase: window.location.origin });
      if (next === docRef.current) return next;
      docRef.current = next;
      readyRef.current = false;
      linesRef.current = [];
      setLines([]);
      setNote("");
      setDoc(next);
      return next;
    },
    [bootstrap],
  );

  // Update the preview shortly after the learner stops typing, and keep their work in this browser.
  useEffect(() => {
    const t = setTimeout(() => {
      render(files);
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(files));
        } catch {
          /* ignore */
        }
      }
    }, 450);
    return () => clearTimeout(t);
  }, [files, render, storageKey]);

  useEffect(() => {
    const el = pane.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setPaneWidth(el.clientWidth));
    ro.observe(el);
    setPaneWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow) return;
      const d = e.data as { __ct?: number; type?: string; level?: string; text?: string };
      if (!d || d.__ct !== 1) return;
      if (d.type === "console") {
        const line = { level: d.level ?? "log", text: String(d.text ?? "") };
        linesRef.current = [...linesRef.current, line].slice(-60);
        setLines(linesRef.current);
      } else if (d.type === "note") setNote(String(d.text ?? ""));
      else if (d.type === "ready") {
        readyRef.current = true;
        waiters.current.splice(0).forEach((w) => w());
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useImperativeHandle(
    handle,
    () => ({
      getFiles: () => filesRef.current,
      setFiles: (f) => setFiles((old) => ({ ...old, ...f })),
      refresh: () =>
        new Promise<void>((resolve) => {
          render(filesRef.current);
          if (readyRef.current) return resolve();
          waiters.current.push(resolve);
          setTimeout(resolve, 4000);
        }),
      probe: async (rules) => {
        // The checks run in a hidden copy of the page at fixed widths, so the result does not depend on the
        // preview size or on which Phone, Fit or Desktop button is pressed.
        const doc = buildDoc(filesRef.current, { bootstrap, assetBase: window.location.origin });
        const selector: Record<number, boolean> = {};
        let page = "";
        let output = "";
        const widths = new Set<number>(rules.flatMap((r) => (r.selector !== undefined ? [r.at ?? DEFAULT_CHECK_WIDTH] : [])));
        widths.add(DEFAULT_CHECK_WIDTH);
        for (const w of widths) {
          const idx = rules.flatMap((r, i) => (r.selector !== undefined && (r.at ?? DEFAULT_CHECK_WIDTH) === w ? [i] : []));
          const res = await probeAt(doc, w, idx.map((i) => rules[i]));
          idx.forEach((ruleIndex, k) => (selector[ruleIndex] = res.results[k] === true));
          if (w === DEFAULT_CHECK_WIDTH) {
            page = res.page;
            output = res.output;
          }
        }
        return { selector, output, page };
      },
    }),
    [render, bootstrap],
  );

  const edit = (ta: HTMLTextAreaElement, value: string, caret: number) => {
    setFiles((f) => ({ ...f, [tab]: value }));
    requestAnimationFrame(() => ta.setSelectionRange(caret, caret));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    const { selectionStart: a, selectionEnd: b, value } = ta;
    if (e.key === "Escape") {
      skipTab.current = true; // the next Tab moves focus on, so keyboard users are never trapped
      return;
    }
    if (e.key === "Tab" && !e.shiftKey && !skipTab.current) {
      e.preventDefault();
      edit(ta, value.slice(0, a) + "  " + value.slice(b), a + 2);
    } else if (e.key === "Tab") skipTab.current = false;
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const lineStart = value.lastIndexOf("\n", a - 1) + 1;
      const indent = value.slice(lineStart, a).match(/^\s*/)?.[0] ?? "";
      const extra = /[{([]$/.test(value.slice(0, a).trimEnd()) && /\S$/.test(value.slice(lineStart, a)) ? "  " : "";
      e.preventDefault();
      edit(ta, value.slice(0, a) + "\n" + indent + extra + value.slice(b), a + 1 + indent.length + extra.length);
    }
  };

  const reset = () => {
    setFiles(initial);
    if (storageKey) {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        /* ignore */
      }
    }
  };

  const code = files[tab] ?? "";
  const rows = Math.min(24, Math.max(7, code.split("\n").length + 1));
  const hasConsole = lines.length > 0;

  return (
    <div className="not-prose overflow-hidden rounded-xl border border-line-strong bg-paper">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2" style={{ background: "var(--color-code-bg)" }}>
        <span className="text-[0.8125rem] font-semibold text-brass-light">{title}</span>
        <div className="flex items-center gap-1.5">
          <CopyButton text={code} />
          <button type="button" onClick={reset} title="Put the starting code back" className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[0.75rem] font-medium text-cream/80 hover:bg-cream/10 hover:text-cream">
            <RotateCcw aria-hidden className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>
      <div className={`grid ${stack ? "" : "lg:grid-cols-2"}`}>
        <div className="min-w-0" style={{ background: "var(--color-code-bg)" }}>
          {visible.length > 1 && (
            <div role="tablist" aria-label="Files" className="flex gap-1 border-b border-cream/10 px-2">
              {visible.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  id={`${uid}-tab-${t}`}
                  aria-selected={tab === t}
                  aria-controls={`${uid}-panel`}
                  onClick={() => setTab(t)}
                  className={`-mb-px border-b-2 px-3 py-2 font-mono text-[0.78rem] ${tab === t ? "border-brass-light text-cream" : "border-transparent text-cream/60 hover:text-cream"}`}
                >
                  {TAB_NAMES[t]}
                </button>
              ))}
            </div>
          )}
          <textarea
            id={`${uid}-panel`}
            aria-label={`${TAB_NAMES[tab]} code. Press Escape then Tab to leave the box.`}
            value={code}
            onChange={(e) => setFiles((f) => ({ ...f, [tab]: e.target.value }))}
            onKeyDown={onKeyDown}
            rows={rows}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            wrap="soft"
            className="block w-full resize-y whitespace-pre-wrap break-words bg-transparent px-3.5 py-3 font-mono text-[0.84rem] leading-relaxed text-cream focus:outline-2 focus:-outline-offset-2 focus:outline-brass-light"
          />
        </div>
        <div className={`min-w-0 border-t border-line-strong bg-white ${stack ? "" : "lg:border-l lg:border-t-0"}`}>
          <div className="flex items-center justify-between border-b border-line px-3 py-1.5 text-[0.75rem] text-muted">
            <span className="font-semibold">Preview</span>
            <span className="flex gap-1">
              {(
                [
                  ["phone", "Phone", Smartphone],
                  ["fit", "Fit", Monitor],
                  ["desktop", "Desktop", MonitorSmartphone],
                ] as const
              ).map(([m, name, Icon]) => (
                <button key={m} type="button" onClick={() => {
                    setMode(m);
                    linesRef.current = [];
                    setLines([]);
                  }} aria-pressed={mode === m} className={`inline-flex items-center gap-1 rounded px-2 py-1 ${mode === m ? "bg-sand text-ink" : "hover:bg-sand"}`}>
                  <Icon aria-hidden className="h-3.5 w-3.5" /> {name}
                </button>
              ))}
            </span>
          </div>
          <div ref={pane} className="flex justify-center overflow-hidden bg-[#eceae4]" style={{ height }}>
            {mode === "desktop" && paneWidth > 0 ? (
              <div style={{ width: DESKTOP_WIDTH * Math.min(1, paneWidth / DESKTOP_WIDTH), height }}>
                <iframe
                  ref={frame}
                  title="Live preview of your page"
                  sandbox="allow-scripts allow-modals allow-forms"
                  srcDoc={doc}
                  className="border-0 bg-white"
                  style={{ width: DESKTOP_WIDTH, height: height / Math.min(1, paneWidth / DESKTOP_WIDTH), transform: `scale(${Math.min(1, paneWidth / DESKTOP_WIDTH)})`, transformOrigin: "top left" }}
                />
              </div>
            ) : (
              <iframe
                ref={frame}
                title="Live preview of your page"
                sandbox="allow-scripts allow-modals allow-forms"
                srcDoc={doc}
                className="h-full border-0 bg-white"
                style={{ width: mode === "phone" ? 390 : "100%", maxWidth: "100%", boxShadow: mode === "phone" ? "0 0 0 1px rgba(0,0,0,.12)" : undefined }}
              />
            )}
          </div>
          {note && <p className="border-t border-line px-3 py-1.5 text-[0.75rem] text-muted">{note}</p>}
        </div>
      </div>
      {hasConsole && (
        <div className="border-t border-line-strong" style={{ background: "var(--color-code-bg)" }}>
          <p className="flex items-center gap-1.5 border-b border-cream/10 px-3 py-1.5 text-[0.75rem] font-semibold text-brass-light">
            <Terminal aria-hidden className="h-3.5 w-3.5" /> Console output
          </p>
          <pre aria-live="polite" className="max-h-44 overflow-auto px-3.5 py-2 font-mono text-[0.8rem] leading-relaxed">
            {lines.map((l, i) => (
              <span key={i} className={`block ${l.level === "error" ? "text-[#ff9b8e]" : l.level === "warn" ? "text-[#f2d27b]" : "text-cream"}`}>
                {l.text}
              </span>
            ))}
          </pre>
        </div>
      )}
    </div>
  );
}

/** A live example: the learner edits the code and watches the page change. Not checked, not required. */
export function LiveCode({ spec }: { spec: LiveSpec }) {
  return <CodeLab files={spec.files} bootstrap={spec.bootstrap} height={spec.height} tabs={spec.tabs} title={spec.title ?? "Try it yourself: edit the code and watch the page change"} stack={spec.stack} />;
}

const readOnlyName = (t: Tab) => TAB_NAMES[t];

/**
 * A web task: the learner builds something in the live editor, it is checked against the task's rules
 * (some read the code, some look at the rendered page), and once it passes they can see a model answer.
 */
export function WebTask({
  spec,
  prompt,
  note,
  label,
  completed,
  onSolved,
}: {
  spec: WebTaskSpec;
  prompt: ReactNode;
  note?: ReactNode;
  label: string;
  completed: boolean;
  onSolved: (exerciseId: string) => void;
}) {
  const id = useId();
  const lab = useRef<LabHandle>(null);
  const [results, setResults] = useState<{ label: string; passed: boolean }[] | null>(null);
  const [checking, setChecking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [solved, setSolved] = useState(completed);
  useEffect(() => {
    if (completed) setSolved(true);
  }, [completed]);

  const check = async () => {
    const l = lab.current;
    if (!l) return;
    setChecking(true);
    try {
      await l.refresh();
      const files = l.getFiles();
      const render = spec.rules.some(isRenderRule) ? await l.probe(spec.rules) : null;
      const r = checkWebTask(spec.rules, files, render);
      setResults(r.results);
      if (r.passed && !solved) {
        setSolved(true);
        setShowSample(true);
        onSolved(spec.id);
      }
    } finally {
      setChecking(false);
    }
  };

  const sampleTabs = ALL_TABS.filter((t) => spec.sample[t] !== undefined);

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
        <p className="text-[0.8125rem] font-semibold text-muted">Your work is checked for</p>
        <ul className="mt-2 space-y-1.5 text-[0.9rem]">
          {spec.rules.map((rule, i) => {
            const r = results?.[i];
            return (
              <li key={i} className="flex items-start gap-2">
                {!r ? (
                  <Circle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-subtle" />
                ) : r.passed ? (
                  <CheckCircle2 aria-label="Met" className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                ) : (
                  <XCircle aria-label="Not met yet" className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                )}
                <span>{rule.label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4">
        <CodeLab handle={lab} files={spec.files} bootstrap={spec.bootstrap} height={spec.height} tabs={spec.tabs} stack={spec.stack} title="Your editor and live preview" storageKey={`cta-web:${spec.id}`} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={check} disabled={checking} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ink px-5 text-[0.9375rem] font-semibold text-ivory hover:bg-ink/85 disabled:opacity-60">
          {checking ? "Checking…" : "Check my work"}
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
        {results && !results.every((r) => r.passed) && (
          <p className="mt-3 rounded-lg border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-[0.9rem] text-ink">Not there yet. Fix the points marked with a cross, then check again. The preview shows what your page looks like right now.</p>
        )}
        {results && results.every((r) => r.passed) && <p className="mt-3 rounded-lg border border-success/40 bg-success-bg px-3.5 py-2.5 text-[0.9rem] text-success">Done. Compare yours with the model answer below.</p>}
      </div>
      {solved && showSample && (
        <div className="mt-3 rounded-lg border border-line bg-ivory px-3.5 py-3 text-[0.9375rem] leading-relaxed text-ink">
          <p className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-[0.8125rem] font-semibold text-muted">
            <span>Model answer</span>
            <button type="button" onClick={() => lab.current?.setFiles(spec.sample)} className="rounded-md px-2 py-1 text-[0.75rem] font-medium text-ink hover:bg-sand">
              Show it in the editor above
            </button>
          </p>
          {sampleTabs.map((t) => (
            <div key={t} className="mt-2">
              <p className="mb-1 font-mono text-[0.75rem] text-muted">{readOnlyName(t)}</p>
              <pre className="code-block overflow-x-auto text-[0.84rem]">
                <code>{spec.sample[t]}</code>
              </pre>
            </div>
          ))}
          {note && <div className="mt-3 border-t border-line pt-3 text-muted">{note}</div>}
        </div>
      )}
    </section>
  );
}
