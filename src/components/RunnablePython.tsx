import { useState } from "react";
import { Play, RotateCcw, Loader2 } from "lucide-react";
import { runBlock, resetSession, type RunResult } from "@/lib/python/runtime";
import { CopyButton } from "./sql/SqlParts";

/**
 * A Python example learners can edit and run in the page ("Try it yourself"). Examples in one
 * lesson share their variables, like notebook cells; running one runs any earlier ones first.
 */
export function RunnablePython({ code, index, blocks, lessonKey }: { code: string; index: number; blocks: string[]; lessonKey: string }) {
  const [source, setSource] = useState(code);
  const [result, setResult] = useState<RunResult | null>(null);
  const [live, setLive] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "running">("idle");

  const run = async () => {
    setState(window.loadPyodide ? "running" : "loading");
    setResult(null);
    setLive("");
    try {
      const r = await runBlock(lessonKey, blocks, index, source, (text) => {
        setState("running");
        setLive(text);
      });
      setResult(r);
    } catch (e) {
      setResult({ output: "", images: [], error: e instanceof Error ? e.message : String(e) });
    } finally {
      setState("idle");
    }
  };

  const restart = () => {
    resetSession(lessonKey);
    setSource(code);
    setResult(null);
    setLive("");
  };

  const rows = Math.min(28, source.split("\n").length + 1);
  const output = result?.output ?? live;

  return (
    <div className="not-prose">
      <div className="overflow-hidden rounded-xl" style={{ background: "var(--color-code-bg)" }}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cream/10 px-3 py-2">
          <span className="text-[0.8125rem] font-semibold text-brass-light">Python · try it yourself</span>
          <div className="flex items-center gap-1.5">
            <CopyButton text={source} />
            <button
              type="button"
              onClick={restart}
              title="Restore the original code and clear this lesson's variables"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[0.75rem] font-medium text-cream/80 hover:bg-cream/10 hover:text-cream"
            >
              <RotateCcw aria-hidden className="h-3.5 w-3.5" /> Reset
            </button>
            <button
              type="button"
              onClick={run}
              disabled={state !== "idle"}
              className="inline-flex items-center gap-1.5 rounded-md bg-brass-button px-3 py-1 text-[0.8125rem] font-semibold text-on-brass hover:bg-brass-button-hover disabled:opacity-70"
            >
              {state === "idle" ? <Play aria-hidden className="h-3.5 w-3.5" /> : <Loader2 aria-hidden className="h-3.5 w-3.5 animate-spin" />}
              Run
            </button>
          </div>
        </div>
        <textarea
          aria-label="Python code"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              void run();
            } else if (e.key === "Tab" && !e.shiftKey) {
              e.preventDefault();
              const t = e.currentTarget;
              const { selectionStart: a, selectionEnd: b } = t;
              const next = source.slice(0, a) + "    " + source.slice(b);
              setSource(next);
              requestAnimationFrame(() => t.setSelectionRange(a + 4, a + 4));
            }
          }}
          rows={rows}
          wrap="off"
          spellCheck={false}
          className="block w-full resize-y overflow-x-auto whitespace-pre border-0 bg-transparent p-4 font-mono text-[0.875rem] leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-brass-light/60"
          style={{ color: "var(--color-code-ink)", tabSize: 4 }}
        />
      </div>
      {state === "loading" && (
        <p className="mt-2 text-[0.8125rem] text-muted" aria-live="polite">
          Starting Python in your browser. The first run downloads it (and libraries like pandas), which can take a few seconds.
        </p>
      )}
      {(output || result?.error || (result?.images.length ?? 0) > 0) && (
        <div className="mt-2 rounded-xl border border-line bg-paper" aria-live="polite">
          <p className="border-b border-line px-3 py-1.5 text-[0.75rem] font-semibold text-muted">Output</p>
          {output && <pre className="overflow-x-auto px-3 py-2.5 font-mono text-[0.8125rem] leading-relaxed text-ink">{output.replace(/\n$/, "")}</pre>}
          {result?.images.map((b64, i) => (
            <div key={i} className="px-3 py-2">
              <img src={`data:image/png;base64,${b64}`} alt={`Chart ${i + 1} produced by the code`} className="max-w-full rounded-lg border border-line bg-white" />
            </div>
          ))}
          {result?.error && <pre className="overflow-x-auto border-t border-line bg-danger/10 px-3 py-2.5 font-mono text-[0.8125rem] leading-relaxed text-danger">{result.error}</pre>}
        </div>
      )}
      <p className="mt-1.5 text-[0.75rem] text-subtle">Edit the code and press Run (Ctrl + Enter). Examples on this page share their variables, like cells in a notebook.</p>
    </div>
  );
}

declare global {
  interface Window {
    loadPyodide?: unknown;
  }
}
