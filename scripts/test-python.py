"""
Runs the Python examples in lesson files, so every code block a learner copies into
Google Colab is known to work.

A course's lessons run in order in one namespace, like one notebook a learner keeps
adding to, and each lesson's ```python blocks run in order. With --fresh every lesson
gets its own namespace instead, which checks that each lesson's setup stands alone.
Dataset URLs are pointed at the local copies in public/datasets, and charts are drawn
without a screen. Blocks fenced as ```python norun are skipped: use that for code that
is meant to fail, or that needs input from the learner.

When a ```text block comes straight after a ```python block, it's the output the
learner should see: the block runs like a Colab cell (printed output, then the value of
a last-line expression) and the output must match. Fence it ```text nocheck when it's
only an illustration.

After a lesson's code has run, every ```answer task with a "pyVerify" expression is
evaluated in the same namespace and must equal the task's answer, so the method the
lesson teaches is proved to give the answer the lesson expects.

Needs Python 3 with pandas and matplotlib.
Run: py scripts/test-python.py [--fresh] [--fix] [course-folder ...]   (default: every course with Python)
"""

import ast
import contextlib
import io
import json
import os
import re
import sys
import tempfile
import traceback

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import pandas as pd  # noqa: E402

# Show whole tables, the way Colab displays them, rather than fitting a terminal.
pd.set_option("display.width", 250)
pd.set_option("display.max_columns", 50)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "src", "content")
DATASETS = os.path.join(ROOT, "public", "datasets").replace("\\", "/") + "/"
URL = "https://academy.cloudtechanalytics.com/datasets/"
# Lessons that load JSON use urllib's urlopen(url); with the URL pointed at a local copy,
# open the file instead.
import urllib.request  # noqa: E402

_urlopen = urllib.request.urlopen


def _local_urlopen(url, *args, **kwargs):
    if isinstance(url, str) and url.startswith(DATASETS):
        return open(url, "rb")
    return _urlopen(url, *args, **kwargs)


urllib.request.urlopen = _local_urlopen

BLOCK = re.compile(r"```python([^\n]*)\n(.*?)\n```(?:\s*\n```text([^\n]*)\n(.*?)\n```)?", re.S)
ANSWER = re.compile(r"```answer\s*\n(.*?)\n```", re.S)


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def lesson_blocks(path):
    """(flags, code, expected output or None) for each python block."""
    out = []
    for m in BLOCK.finditer(read(path)):
        expected = m.group(4) if m.group(4) is not None and "nocheck" not in (m.group(3) or "") else None
        out.append((m.group(1).strip(), m.group(2), expected))
    return out


def run_cell(code, ns, name):
    """Runs code like a notebook cell: returns what it prints, then the last expression's value."""
    tree = ast.parse(code, name)
    last = tree.body.pop() if tree.body and isinstance(tree.body[-1], ast.Expr) else None
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(compile(tree, name, "exec"), ns)
        if last is not None:
            value = eval(compile(ast.Expression(last.value), name, "eval"), ns)
            if value is not None:
                print(repr(value))
    return buf.getvalue()


def same_output(got, want):
    def norm(text):
        return [line.rstrip() for line in text.strip().splitlines()]

    return norm(got) == norm(want)


def answers_match(spec, got):
    """The same leniency the site uses when it checks a learner's answer."""
    want = spec["answer"]
    if isinstance(want, str):
        return str(got).strip().lower() in [str(a).strip().lower() for a in [want, *spec.get("accept", [])]]
    try:
        got = float(got)
    except (TypeError, ValueError):
        return False
    tol = spec.get("tolerance", 0.5 if float(want).is_integer() else 0.051)
    if spec.get("format") == "naira":
        tol = max(tol, abs(want) * 0.005)
    if spec.get("format") == "percent":
        tol = max(tol, 0.5)
    return abs(got - want) <= tol


def check_answers(path, ns):
    problems = []
    for spec in (json.loads(m.group(1)) for m in ANSWER.finditer(read(path))):
        if "pyVerify" not in spec:
            continue
        try:
            got = eval(spec["pyVerify"].replace(URL, DATASETS), ns)
        except Exception as e:
            problems.append(f"{spec['id']}: pyVerify failed: {e!r}")
            continue
        if answers_match(spec, got):
            print(f"       {spec['id']}: {spec['answer']!r} ✓")
        else:
            problems.append(f"{spec['id']}: expected {spec['answer']!r}, pandas gives {got!r}")
    return "\n".join(problems) or None


def run_lesson(path, ns):
    plt.show = lambda *a, **k: None
    blocks = [(i, code.replace(URL, DATASETS), expected) for i, (flags, code, expected) in enumerate(lesson_blocks(path), 1) if "norun" not in flags]
    # Snippets in "The concept" often use data the Example loads further down. A block that
    # fails only because a name isn't defined yet is run again once the rest have run.
    for attempt in (1, 2):
        waiting = []
        for i, code, expected in blocks:
            try:
                got = run_cell(code, ns, f"{os.path.basename(path)} block {i}")
            except NameError:
                if attempt == 2:
                    return f"block {i}:\n{code}\n{traceback.format_exc(limit=2)}"
                waiting.append((i, code, expected))
                continue
            except Exception:
                return f"block {i}:\n{code}\n{traceback.format_exc(limit=2)}"
            finally:
                plt.close("all")
            if expected is not None and not same_output(got, expected):
                message = f"block {i}: the output shown in the lesson doesn't match.\n--- lesson says:\n{expected}\n--- the code prints:\n{got}"
                if "--fix" not in sys.argv:
                    return message
                # --fix: the code is the source of truth, so write its output into the lesson.
                # Prose that quotes these numbers still needs checking by hand.
                text = read(path)
                fixed = "\n".join(line.rstrip() for line in got.strip().splitlines())
                with open(path, "w", encoding="utf-8", newline="\n") as f:
                    f.write(text.replace("```text\n" + expected + "\n```", "```text\n" + fixed + "\n```", 1))
                print("FIXED " + message)
        if not waiting:
            break
        blocks = waiting
    return check_answers(path, ns)


def new_namespace():
    """A lesson's starting namespace. pandas, numpy and scipy.stats are there so pyVerify expressions
    in lessons without Python code (for example Excel-based statistics) can still check answers."""
    import numpy as np
    from scipy import stats

    def data(dataset, file):
        """One downloadable CSV, as the learner gets it: data("hr", "employees")."""
        return pd.read_csv(f"{DATASETS}{dataset}/{file}.csv")

    return {"__name__": "__lesson__", "pd": pd, "np": np, "stats": stats, "data": data}


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    # Lessons save files (plt.savefig, to_csv); keep them out of the project.
    os.chdir(tempfile.mkdtemp(prefix="lesson-run-"))
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    fresh = "--fresh" in sys.argv
    courses = args or [d for d in sorted(os.listdir(CONTENT)) if os.path.isdir(os.path.join(CONTENT, d))]
    failures = lessons = 0
    for course in courses:
        folder = os.path.join(CONTENT, course)
        ns = new_namespace()
        for name in sorted(f for f in os.listdir(folder) if f.endswith(".md")):
            path = os.path.join(folder, name)
            if not lesson_blocks(path) and '"pyVerify"' not in read(path):
                continue
            lessons += 1
            error = run_lesson(path, new_namespace() if fresh else ns)
            print(("FAIL " if error else "ok   ") + f"{course}/{name}")
            if error:
                failures += 1
                print(error)
    print(f"\n{lessons} lessons with Python run, {failures} failed")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
