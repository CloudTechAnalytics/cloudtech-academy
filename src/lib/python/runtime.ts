/**
 * Python in the browser, for "Run" buttons in lessons. Pyodide (CPython compiled to
 * WebAssembly) loads from the jsDelivr CDN the first time a learner runs some Python, then
 * stays loaded. Each lesson gets its own namespace, so examples build on each other the way
 * cells in a notebook do.
 *
 * Lessons read datasets from https://academy.cloudtechanalytics.com/datasets/...; the browser
 * can't open sockets, so pandas.read_csv, pandas.read_json and urllib's urlopen are wrapped to
 * fetch those files from this site instead.
 */

const VERSION = "0.27.7";
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${VERSION}/full/`;

/* eslint-disable @typescript-eslint/no-explicit-any */
type Pyodide = any;

const SETUP = String.raw`
import io, os, sys, urllib.request
os.environ["MPLBACKEND"] = "AGG"

_SITE = "https://academy.cloudtechanalytics.com/"

def _local(url):
    return "/" + url[len(_SITE):] if isinstance(url, str) and url.startswith(_SITE) else url

def _fetch_text(url):
    from pyodide.http import open_url
    return open_url(_local(url))

_orig_urlopen = urllib.request.urlopen
def _urlopen(url, *args, **kwargs):
    if isinstance(url, str) and url.startswith(_SITE):
        return io.BytesIO(_fetch_text(url).getvalue().encode("utf-8"))
    return _orig_urlopen(url, *args, **kwargs)
urllib.request.urlopen = _urlopen

def _patch_pandas():
    import pandas as pd
    if getattr(pd, "_academy_patched", False):
        return
    pd.set_option("display.width", 120)
    pd.set_option("display.max_columns", 30)
    def wrap(original):
        def reader(source, *args, **kwargs):
            if isinstance(source, str) and source.startswith("http"):
                source = _fetch_text(source)
            return original(source, *args, **kwargs)
        return reader
    pd.read_csv = wrap(pd.read_csv)
    pd.read_json = wrap(pd.read_json)
    pd._academy_patched = True

def _patch_matplotlib():
    import matplotlib
    matplotlib.use("AGG")
    import matplotlib.pyplot as plt
    plt.show = lambda *args, **kwargs: None

def _figures():
    if "matplotlib.pyplot" not in sys.modules:
        return []
    import base64
    import matplotlib.pyplot as plt
    images = []
    for number in plt.get_fignums():
        buffer = io.BytesIO()
        plt.figure(number).savefig(buffer, format="png", bbox_inches="tight", dpi=100)
        images.append(base64.b64encode(buffer.getvalue()).decode("ascii"))
    plt.close("all")
    return images

async def _academy_run(code, namespace):
    from pyodide.code import eval_code_async
    result = await eval_code_async(code, namespace)
    if result is not None:
        print(repr(result))
    return _figures()
`;

let loading: Promise<Pyodide> | null = null;

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Couldn't download Python. Check your internet connection and try again."));
    document.head.appendChild(s);
  });
}

/** Load Pyodide once; later calls reuse it. */
export function loadPython(): Promise<Pyodide> {
  loading ??= (async () => {
    const w = window as unknown as { loadPyodide?: (o: { indexURL: string }) => Promise<Pyodide> };
    if (!w.loadPyodide) await loadScript(`${INDEX_URL}pyodide.js`);
    const py = await w.loadPyodide!({ indexURL: INDEX_URL });
    py.setStdin({ stdin: () => window.prompt("Python is asking for input:") ?? "" });
    await py.runPythonAsync(SETUP);
    return py;
  })().catch((e) => {
    loading = null;
    throw e;
  });
  return loading;
}

type Session = { ns: Pyodide; ran: Set<number> };
const sessions = new Map<string, Session>();

async function session(key: string): Promise<Session> {
  const py = await loadPython();
  let s = sessions.get(key);
  if (!s) {
    s = { ns: py.globals.get("dict")(), ran: new Set() };
    sessions.set(key, s);
  }
  return s;
}

/** Forget everything a lesson's code has created, like restarting a notebook. */
export function resetSession(key: string) {
  const s = sessions.get(key);
  s?.ns.destroy?.();
  sessions.delete(key);
}

export type RunResult = { output: string; images: string[]; error: string | null };

/** Keep the parts of a Python traceback that refer to the learner's code. */
function tidyError(message: string) {
  const lines = message.trim().split("\n");
  const start = lines.findIndex((l) => l.includes('File "<exec>"'));
  return (start >= 0 ? ["Traceback (most recent call last):", ...lines.slice(start)] : lines.slice(-1)).join("\n");
}

async function execute(py: Pyodide, code: string, ns: Pyodide, onOutput?: (text: string) => void): Promise<RunResult> {
  let output = "";
  const write = (text: string) => {
    output += text + "\n";
    onOutput?.(output);
  };
  py.setStdout({ batched: write });
  py.setStderr({ batched: write });
  try {
    const quiet = { messageCallback: () => {} };
    await py.loadPackagesFromImports(code, quiet);
    if (/\bpandas\b|\bpd\./.test(code)) await py.runPythonAsync("_patch_pandas()");
    if (/matplotlib|\.plot\(|\bplt\./.test(code)) {
      await py.loadPackage("matplotlib", quiet);
      await py.runPythonAsync("_patch_matplotlib()");
    }
    const figures = await py.globals.get("_academy_run")(code, ns);
    const images: string[] = figures.toJs();
    figures.destroy?.();
    return { output, images, error: null };
  } catch (e) {
    return { output, images: [], error: tidyError(e instanceof Error ? e.message : String(e)) };
  }
}

/**
 * Run block `index` of a lesson. Earlier blocks that haven't run yet are run first, quietly,
 * so a learner can start with any example. `blocks` is every runnable block in the lesson.
 */
export async function runBlock(key: string, blocks: string[], index: number, code: string, onOutput?: (text: string) => void): Promise<RunResult> {
  const py = await loadPython();
  const s = await session(key);
  for (let i = 0; i < index; i++) {
    if (s.ran.has(i)) continue;
    const r = await execute(py, blocks[i], s.ns);
    if (r.error) return { output: "", images: [], error: `An earlier example in this lesson didn't run, so this one can't either:\n\n${r.error}` };
    s.ran.add(i);
  }
  const result = await execute(py, code, s.ns, onOutput);
  if (!result.error) s.ran.add(index);
  return result;
}
