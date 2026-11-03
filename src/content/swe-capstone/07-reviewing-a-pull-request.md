---
title: Reviewing a pull request
minutes: 25
summary: Review a teammate's pull request that adds "express refunds". Run a small automated scan of the added lines, then read for what no scanner catches, and write a review that's specific, kind and blocks what must be blocked.
---

## The problem

While you were fixing bugs, a teammate opened **PR 42**: an "express refund" endpoint so support staff can refund a customer straight away. Support has wanted this for months, and the teammate is keen to merge. You're the reviewer.

A review is the last point where a problem is cheap to fix. It's also a conversation with a colleague, so it needs to be both firm and kind.

## The concept

### Two passes

1. **Automated**: patterns a script can spot in the added lines, such as secrets in code, bare `except`, floats for money, and changes with no tests.
2. **Reading**: what the change does and whether it should, including the rules it skips, how it fails, and who can use it.

### What a good review comment says

- **Where**: the line.
- **What's wrong**, and **why it matters**, in terms of harm.
- **A suggestion**: what to do instead.
- **How serious**: must fix before merging, or a suggestion.

### Review the change, not the person

"This swallows every error, so a failed refund reports success" is useful. "Did you even test this?" isn't.

![Two review passes, automated and reading, and the parts of a good review comment with an example](/images/courses/swe-capstone/pr-review.svg "Two passes, and a comment with where, what, why, fix, severity.")

## Example

Get the pull request and read it:

```bash
%%bash
curl -sO https://academy.cloudtechanalytics.com/datasets/refunds/pr-42.diff
grep -c "^+[^+]" pr-42.diff | xargs echo "Lines added:"
grep "^+[^+]" pr-42.diff
```

```text
Lines added: 13
+ADMIN_TOKEN = "kasuwa-admin-2026"
+    # Express refunds: support staff can refund any amount straight away
+    @app.post("/admin/express-refund")
+    def express_refund():
+        if request.headers.get("X-Token") != ADMIN_TOKEN:
+            return "forbidden", 403
+        try:
+            body = request.get_json()
+            amount = float(body["amount_naira"])
+            db.record_refund(conn, body["order_id"], "express", int(amount * 100))
+        except:
+            pass
+        return "ok", 200
```

A small automated scan of the added lines:

```bash
%%bash
python - <<'EOF'
import re

CHECKS = [
    (r"(TOKEN|SECRET|PASSWORD|API_KEY)\s*=\s*[\"']", "secret written in the code"),
    (r"except\s*:", "bare except catches every error, including bugs"),
    (r"^\s*pass\s*$", "error silently ignored"),
    (r"float\(", "float used for money"),
    (r"int\([^)]*\*\s*100\)", "int() cuts off kobo instead of rounding"),
]
added, files = [], set()
for line in open("pr-42.diff", encoding="utf-8"):
    if line.startswith("+++ "):
        files.add(line[6:].strip())
    elif line.startswith("+"):
        added.append(line[1:].rstrip("\n"))
findings = [(n, text.strip(), problem) for n, text in enumerate(added, 1) for pattern, problem in CHECKS if re.search(pattern, text)]
for n, text, problem in findings:
    print(f"added line {n:2}: {problem:45} | {text}")
if not any(f.split("/")[-1].startswith("test_") for f in files):
    findings.append((None, "", "no tests changed"))
    print("whole PR:      no tests added or changed")
print(f"\n{len(findings)} automated findings")
EOF
```

```text
added line  1: secret written in the code                    | ADMIN_TOKEN = "kasuwa-admin-2026"
added line 10: float used for money                          | amount = float(body["amount_naira"])
added line 11: int() cuts off kobo instead of rounding       | db.record_refund(conn, body["order_id"], "express", int(amount * 100))
added line 12: bare except catches every error, including bugs | except:
added line 13: error silently ignored                        | pass
whole PR:      no tests added or changed

6 automated findings
```

The scan finds the mechanical problems. Reading finds the bigger ones:

- **It bypasses every rule** you've just fixed: no check against what was paid, no return window, no idempotency key, and a reason (`express`) that isn't one of the allowed reasons.
- **It reports success when it fails**: the bare `except` returns `"ok"` even if the order doesn't exist or the database refuses the row.
- **One shared token** gives anyone who has it the power to refund any amount, with no record of **who** did it. And it's compared with `!=`, which leaks timing information; use `hmac.compare_digest`.
- **Plain-text responses** (`"ok"`, `"forbidden"`) unlike the rest of the API's JSON.

The verdict: **request changes**. The goal is good, and the review should say so. But this would let anyone with one leaked string pay out unlimited money, silently.

## Walkthrough

1. Run the cells.
2. Add a check to the scanner of your own: for example, `print(` in application code, or a TODO.
3. Sketch the safer design: express refunds as a normal refund request with a `requested_by` staff ID, the same rules, a per-staff limit, and an audit record.
4. Decide what you'd accept in a first version, so the teammate can ship something useful soon.
5. Write the review (the task below).

## Practice

```answer
{
  "id": "sdc-07-p1",
  "prompt": "How many **automated findings** does the scan report, including the whole-PR check?",
  "answer": 6,
  "format": "number",
  "hint": "The last line printed.",
  "required": true
}
```

```task
{
  "id": "sdc-07-t1",
  "prompt": "Write the **review** of PR 42 (100 to 220 words): a **verdict**, something **positive**, and at least **four** specific comments, each saying what's wrong, why it **matters**, and what to do **instead**.",
  "minutes": 12,
  "rows": 12,
  "placeholder": "Request changes. ...",
  "rules": [
    { "label": "A verdict (request changes, approve, block)", "pattern": "request changes|block|approve|not ready" },
    { "label": "Something positive", "pattern": "thanks|thank you|good|great|useful|like|nice|appreciate" },
    { "label": "The hard-coded token", "pattern": "token|secret" },
    { "label": "The bare except / swallowed errors", "pattern": "except|swallow|silent|ok even" },
    { "label": "Money handling (float, kobo, rounding)", "pattern": "float|kobo|round" },
    { "label": "The skipped rules (paid, limit, window, idempotency)", "pattern": "paid|limit|window|idempoten|rule" },
    { "label": "Tests", "pattern": "test" },
    { "label": "Suggestions (instead, use, could, suggest)", "pattern": "instead|use |could|suggest|how about|let's", "min": 2 },
    { "label": "Between 100 and 220 words", "minWords": 100, "maxWords": 220 }
  ],
  "sample": "Request changes. Thanks for picking this up; support has needed fast refunds for a while, and the endpoint is easy to follow.\n\n1. ADMIN_TOKEN is written in the code, so it's in Git history for anyone with repo access. Please load it from an environment variable, and compare with hmac.compare_digest.\n2. The bare except with pass returns \"ok\" even when the refund fails, so support will think a customer was paid when they weren't. Let errors return a JSON error with a proper status code.\n3. float(amount_naira) and int(amount * 100) bring back the kobo bug from ISSUE-101. Could it take amount_kobo as an integer instead?\n4. It skips every refund rule: no cap at what was paid, no idempotency key, and \"express\" isn't an allowed reason. How about calling service.request_refund, with a requested_by staff ID and a per-staff limit, so we keep an audit trail?\n5. There are no tests. Please add tests for success, a bad token, an over-limit amount and a missing order.\n\nHappy to pair on the service integration if that helps.",
  "note": "Firm on the blockers, specific about fixes, and generous to the person.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why is a bare except with pass dangerous here?",
    "options": ["It's slow", "Failures are hidden and reported as success, so support believes a refund happened", "It's a style issue only", "It breaks Flask"],
    "answer": 1,
    "explanation": "Silent failure is worse than a visible error."
  },
  {
    "prompt": "What should replace the hard-coded token?",
    "options": ["A longer token in the code", "A secret loaded from the environment or a secrets manager, compared safely, ideally per staff member", "No authentication", "A token in the URL"],
    "answer": 1,
    "explanation": "Secrets don't belong in source code."
  },
  {
    "prompt": "What makes a review comment useful?",
    "options": ["It's short", "It names the line, the harm and a concrete alternative", "It's critical of the author", "It uses many emoji"],
    "answer": 1,
    "explanation": "Specific, reasoned and actionable."
  }
]
```
