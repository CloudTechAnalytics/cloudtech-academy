---
title: Code review
minutes: 25
summary: Review code for correctness, clarity and risk, use simple automated checks to find common problems, and write review comments that are specific, kind and actionable, on Tallybook's original billing module.
---

## The problem

Tallybook's original billing module, `billing.py`, is still used by the month-end job. It was never reviewed. Most of the bugs in this course came from it: float money, Python's rounding, a late fee rule that compounds instead of adding up. Before it's replaced, the team wants a proper review, both to list what must change and to agree what good code looks like from now on.

## The concept

**What reviewers look for, in order**

1. **Correctness**: does it do what the rules say, including edge cases?
2. **Risk**: errors swallowed, data changed in place, shared state, security.
3. **Tests**: is the change tested, and would the tests catch a mistake?
4. **Clarity**: names, function size, comments that explain why.
5. **Style**: formatting and conventions (leave this to automatic tools).

**Common problems a tool can flag**

| Pattern | Why it's a problem |
| :-- | :-- |
| bare `except:` | hides every error, including bugs |
| mutable default argument (`log=[]`) | the same list is shared between calls |
| `== False` | `not x` is clearer, and `== False` can surprise |
| magic numbers | `1.02` and `0.075` scattered in code instead of named rules |
| global state | functions that change a module-level dictionary are hard to test |
| `print` instead of returning or logging | results can't be used or tested |

**Writing review comments**

Be specific (line and problem), explain why, suggest a fix, and separate must-fix from nice-to-have. Review the code, not the person.

## Example

Load the module and look at it:

```python
from urllib.request import urlopen

with urlopen("https://academy.cloudtechanalytics.com/datasets/invoicing/billing.py") as f:
    source = f.read().decode("utf-8")
for number, line in enumerate(source.splitlines(), start=1):
    print(f"{number:3}  {line}")
```

```text
1  # billing.py - Tallybook's original billing code (2024). Still used by the month-end job.
  2  import csv
  3
  4  totals = {}
  5  VAT = 0.075
  6
  7
  8  def calc(lines, d, ex, fee_days=0, log=[]):
  9      t = 0
 10      for l in lines:
 11          t = t + l["quantity"] * l["unit_price"]
 12      if d > 0:
 13          t = t - t * d / 100
 14      if ex == False:
 15          t = t + t * 0.075
 16      if fee_days > 30:
 17          t = t * 1.02
 18      if fee_days > 60:
 19          t = t * 1.02
 20      if fee_days > 90:
 21          t = t * 1.02
 22      log.append(t)
 23      return round(t, 2)
 24
 25
 26  def load(path):
 27      rows = []
 28      try:
 29          f = open(path)
 30          for r in csv.DictReader(f):
 31              rows.append(r)
 32      except:
 33          print("could not load")
 34      return rows
 35
 36
 37  def run(path, invoices):
 38      data = load(path)
 39      for inv in invoices:
 40          ls = [r for r in data if r["invoice_id"] == inv["invoice_id"]]
 41          for l in ls:
 42              l["quantity"] = int(l["quantity"])
 43              l["unit_price"] = float(l["unit_price"])
 44          totals[inv["invoice_id"]] = calc(ls, int(inv["discount_pct"]), inv["vat_exempt"] == "1")
 45          print(inv["invoice_id"], totals[inv["invoice_id"]])
```

Python can read its own code as a tree (`ast`), which is how linters work. A few checks of our own:

```python
import ast

tree = ast.parse(source)
findings = []
for node in ast.walk(tree):
    if isinstance(node, ast.ExceptHandler) and node.type is None:
        findings.append((node.lineno, "bare except: hides every error"))
    if isinstance(node, ast.FunctionDef):
        for default in node.args.defaults:
            if isinstance(default, (ast.List, ast.Dict, ast.Set)):
                findings.append((node.lineno, f"{node.name}: mutable default argument"))
        if len(node.args.args) > 4:
            findings.append((node.lineno, f"{node.name}: {len(node.args.args)} parameters"))
    if isinstance(node, ast.Compare) and any(isinstance(c, ast.Constant) and c.value is False for c in node.comparators):
        findings.append((node.lineno, "comparison with False"))
    if isinstance(node, ast.Constant) and isinstance(node.value, float) and node.value not in (0.0, 1.0):
        findings.append((node.lineno, f"magic number {node.value}"))
    if isinstance(node, ast.Call) and getattr(node.func, "id", "") == "print":
        findings.append((node.lineno, "print instead of returning or logging"))

for line, message in sorted(findings):
    print(f"line {line}: {message}")
```

```text
line 5: magic number 0.075
line 8: calc: 5 parameters
line 8: calc: mutable default argument
line 14: comparison with False
line 15: magic number 0.075
line 17: magic number 1.02
line 19: magic number 1.02
line 21: magic number 1.02
line 32: bare except: hides every error
line 33: print instead of returning or logging
line 45: print instead of returning or logging
```

The tool finds the patterns; a person finds the rules that are wrong. Read lines 16 to 21 against Tallybook's late fee rule: the code **multiplies** by 1.02 up to three times (compounding), uses `> 30` (so exactly 30 days charges nothing, the bug from lesson 4), and applies the fee to the whole total rather than what's outstanding. No linter can know that.

## Walkthrough

1. Run the cells. What's wrong with `log=[]` on line 8? Call a function with a mutable default twice and see.
2. `VAT = 0.075` is defined on line 5. Why is `0.075` still flagged on line 15?
3. What happens to `run()` if the file doesn't exist? Follow the code from `load()`.
4. Write your review comments (the task below).

## Practice

```answer
{
  "id": "swe-08-p1",
  "prompt": "How many findings does the checker report?",
  "answer": 11,
  "format": "number",
  "pyVerify": "len(findings)",
  "hint": "Count the lines printed by the second cell.",
  "required": true
}
```

```task
{
  "id": "swe-08-t1",
  "prompt": "Write **review comments** on `billing.py`, one per line starting with **MUST:** or **SHOULD:** and a **line number**: at least **five** comments, each saying the **problem**, **why** it matters and the **fix**. Include at least one rule that's wrong, not just a style issue.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "MUST: line 26 ...",
  "rules": [
    { "label": "At least five MUST or SHOULD lines", "pattern": "^\\s*(MUST|SHOULD)\\s*:", "min": 5 },
    { "label": "Line numbers on each", "pattern": "^\\s*(MUST|SHOULD)\\s*:[^\\n]*line \\d+", "min": 5 },
    { "label": "At least two MUST comments", "pattern": "^\\s*MUST\\s*:", "min": 2 },
    { "label": "A wrong business rule (late fee, compounding, 30 days, rounding, float money)", "pattern": "compound|1\\.02|30 days|late fee|round|float" },
    { "label": "The bare except", "pattern": "except" },
    { "label": "Suggests fixes", "pattern": "use|replace|move|raise|return|test", "min": 3 }
  ],
  "sample": "MUST: line 16-21: the late fee compounds 2% up to three times, charges nothing at exactly 30 days and applies to the whole total; use the late_fee function from lesson 4 on the outstanding amount.\nMUST: line 9-15 and 23: money is calculated in floats and rounded with round(); use kobo integers and ROUND_HALF_UP as in invoicing.py.\nMUST: line 32: the bare except hides every error, so a missing file silently produces no totals; catch FileNotFoundError and raise a clear error.\nSHOULD: line 8: the mutable default log=[] is shared between calls and grows forever; remove it or default to None.\nSHOULD: line 4: the global totals dictionary makes run() hard to test; return the totals instead.\nSHOULD: line 45: print the results from the caller, not inside run(), so the function can be tested.",
  "note": "The two MUSTs about rules matter more than all the style points together: they change what customers pay.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What should a reviewer check first?",
    "options": ["Formatting", "Correctness against the rules, including edge cases", "Variable name length", "Comment spelling"],
    "answer": 1,
    "explanation": "Style can be automated; correctness needs a person."
  },
  {
    "prompt": "Why is `except:` with no exception type risky?",
    "options": ["It's slow", "It catches every error, including bugs, and hides them", "It's deprecated", "It only catches some errors"],
    "answer": 1,
    "explanation": "Catch the specific errors you can handle."
  },
  {
    "prompt": "Which review comment is most useful?",
    "options": ["This is bad", "Line 32: the bare except hides a missing file; catch FileNotFoundError and raise a clear error", "Rewrite this", "Why?"],
    "answer": 1,
    "explanation": "Specific, explained, with a fix."
  }
]
```
