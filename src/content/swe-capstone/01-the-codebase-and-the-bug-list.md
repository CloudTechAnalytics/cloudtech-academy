---
title: The codebase and the bug list
minutes: 25
summary: Join Kasuwa's refunds team, get the service running, read its code and its (passing) tests, and triage six bug reports by the harm each one does.
---

## The problem

This is the capstone of the Software Developer track. Instead of writing code from a blank page, you'll do what most developers spend most of their time doing: working on someone else's code, with real bugs reported by real people.

You've joined **Kasuwa**, the online shop from the other capstones, on the team that owns the **refunds service**. When a delivery fails or a customer returns something, this service works out the refund and records it. Its tests all pass, yet in the last week support, finance, the mobile team and a security review have between them reported six problems. Your lead says: "Sort these out properly. Tests first, no guessing, and nothing that makes it worse."

Every lesson starts from the original code in a **new Colab notebook**, so each one stands on its own. In the final project, you'll combine all the fixes in one repository.

## The concept

### Read before you change

Find the entry points (the API in `app.py`), the rules (`refunds.py`) and the data access (`db.py`, `schema.sql`). Run the tests. Passing tests only prove what they test.

### Triage by harm

| Priority | Kind of bug | Why |
| :-- | :-- | :-- |
| 1 | Security: data exposed or changed by the wrong person | Harms every customer, and the harm can't be undone |
| 2 | Money: paying out too much or too little | Real losses, and customers' trust |
| 3 | Customers wrongly refused or confused | Unfair, and generates complaints |
| 4 | Errors with no lasting harm | Fix, but after the above |

![Four things to read before changing someone else's code, bugs triaged by harm from security down to harmless errors, and the rule that every bug gets a test](/images/courses/swe-capstone/read-and-triage.svg "Read first, triage by harm, and give every bug a test.")

### Every bug gets a test

For each bug: reproduce it with a failing test, fix it, and keep the test so it can't come back.

## Example

Get the code and the sample data:

```bash
%%bash
base=https://academy.cloudtechanalytics.com/datasets/refunds
for f in refunds.py db.py app.py schema.sql customers.csv orders.csv order_items.csv issues.csv test_refunds.py pytest.ini pr-42.diff; do
  curl -sO "$base/$f"
done
ls
```

```text
app.py
customers.csv
db.py
issues.csv
order_items.csv
orders.csv
pr-42.diff
pytest.ini
refunds.py
schema.sql
test_refunds.py
```

Run the existing tests:

```bash
%%bash
python -m pytest
```

```text
...
3 passed in 0.01s
```

All three pass. Now the bug reports:

```bash
%%bash
python - <<'EOF'
import csv
for issue in csv.DictReader(open("issues.csv", encoding="utf-8")):
    print(f"{issue['issue_id']}  {issue['reported_by']:17} {issue['title']}")
EOF
```

```text
ISSUE-101  Customer support  Refund is a kobo short
ISSUE-102  Finance           Customer refunded twice
ISSUE-103  Customer support  Return on day 14 rejected
ISSUE-104  Security review   Order search shows other customers' orders
ISSUE-105  Finance           Refunds add up to more than the order
ISSUE-106  Mobile team       Server error for a missing order
```

And a look at the rules everyone depends on:

```bash
%%bash
sed -n '9,26p' refunds.py
```

```text
def item_refund(quantity, unit_price_kobo, reason):
    """Refund for one order line, in kobo."""
    naira = quantity * (unit_price_kobo / 100)
    if reason == "changed_mind":
        naira = naira * (1 - RESTOCKING_FEE)
    return int(naira * 100)


def within_window(delivered_on, today):
    """True if a return is still allowed: within 14 days of delivery."""
    return (today - delivered_on).days < RETURN_WINDOW_DAYS


def refund_amount(items, reason, delivery_fee_kobo):
    """Total refund in kobo. items is a list of (quantity, unit_price_kobo) pairs."""
    total = sum(item_refund(quantity, price, reason) for quantity, price in items)
    if reason in ("failed_delivery", "damaged", "wrong_item"):
        total += delivery_fee_kobo
```

Three things stand out before you even run anything: money passes through **floats** in naira, the window check uses `<` against 14 days, and `int()` **cuts off** fractions rather than rounding. The tests never exercise any of them.

## Walkthrough

1. Run the cells in a new Colab notebook.
2. Read `db.py` and `app.py`. Which line looks unsafe to you, before reading any bug report?
3. Read every issue's full description (`issues.csv`). For each, guess which file the bug is in.
4. Start the service in a Python cell with the Flask test client and post one refund, to see it working.
5. Write the triage (the task below).

## Practice

```dataset
{"dataset": "refunds", "files": ["issues", "orders", "order_items", "customers"]}
```

```answer
{
  "id": "sdc-01-p1",
  "prompt": "How many tests does the service have, and pass, before you change anything?",
  "answer": 3,
  "format": "number",
  "hint": "The pytest output.",
  "required": true
}
```

```task
{
  "id": "sdc-01-t1",
  "prompt": "Write the **triage**: all **six** issues in the order you'll fix them, each with a one-line **reason** (its kind of harm).",
  "minutes": 8,
  "rows": 8,
  "placeholder": "1. ISSUE-104 ...",
  "rules": [
    { "label": "Lists all six issues", "pattern": "ISSUE-10[1-6]", "min": 6 },
    { "label": "Security first (ISSUE-104 in first place)", "pattern": "^\\W*1\\W[^\\n]*104" },
    { "label": "Gives reasons (security, money, customers)", "pattern": "security|money|data|overpa|refund|customer", "min": 3 },
    { "label": "The 500 error comes last (ISSUE-106)", "pattern": "106[^\\n]*$(?![\\s\\S]*ISSUE-10[1-5])" }
  ],
  "sample": "1. ISSUE-104: security. Any support user can see every customer's orders, and the same hole could change data.\n2. ISSUE-105: money. Partial returns pay the delivery fee back twice, so refunds exceed what was paid.\n3. ISSUE-102: money. Double taps create two refunds for one return.\n4. ISSUE-101: money. Refunds lose a kobo because of floats; small, but it affects every refund and finance can't reconcile.\n5. ISSUE-103: customers wrongly refused returns on day 14.\n6. ISSUE-106: a 500 error for a missing order. Confusing, but no money moves and no data leaks.",
  "note": "Reasonable people order 101 to 103 differently. What matters is that the reasons are about harm.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "All the tests pass, yet six bugs have been reported. What does that tell you?",
    "options": ["The bug reports are wrong", "The tests don't cover the behaviour that's broken", "Tests are useless", "The code is fine"],
    "answer": 1,
    "explanation": "Tests prove only what they test."
  },
  {
    "prompt": "Why fix the security bug before the money bugs?",
    "options": ["It's easier", "Exposed data harms every customer and can't be undone", "Security bugs are always one line", "Finance can wait"],
    "answer": 1,
    "explanation": "Triage by harm."
  },
  {
    "prompt": "What should happen first for each bug?",
    "options": ["Fix it", "Reproduce it with a failing test", "Close it", "Ask the reporter again"],
    "answer": 1,
    "explanation": "A failing test proves the bug, then proves the fix."
  }
]
```
