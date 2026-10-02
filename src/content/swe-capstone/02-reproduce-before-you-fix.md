---
title: Reproduce before you fix
minutes: 25
summary: Turn bug reports into failing tests that state the right behaviour exactly, using the reporters' own examples, so you know the bug is real and will know when it's fixed.
---

## The problem

A bug report is a story: "the customer expected ₦3,999.99". Before you touch the code, turn each story into a **test** that fails today. If you can't make it fail, you don't understand the bug yet. And once it fails, the same test tells you when the fix works, and stops the bug coming back.

## The concept

**A good reproduction test**

- Uses the **reporter's own example**: the order, the amounts, the dates.
- States the **right** answer, worked out by hand in a comment, not copied from the code.
- Tests **one** thing, and is named after the rule ("a return on day 14 is allowed").

**Add the boundary next to the bug**

For an off-by-one bug, test both sides: day 14 (allowed) and day 15 (refused). For a rounding bug, test an amount that rounds up and one that rounds down.

**Running only the failures**

`python -m pytest --tb=no -rf` hides the tracebacks and lists each failure in one line, which is handy when you have several.

## Example

Get the code:

```bash
%%bash
base=https://academy.cloudtechanalytics.com/datasets/refunds
for f in refunds.py db.py app.py schema.sql customers.csv orders.csv order_items.csv test_refunds.py pytest.ini; do
  curl -sO "$base/$f"
done
```

Tests for ISSUE-101 (money), ISSUE-103 (the window) and ISSUE-104 (the search), from the reports:

```bash
%%bash
cat > test_issues.py <<'EOF'
from datetime import date

import db
from refunds import item_refund, refund_amount, within_window


# ISSUE-101: one T-shirt pack at N2,499.99 (249,999 kobo), damaged, delivery fee 150,000 kobo
def test_damaged_refund_is_exact_to_the_kobo():
    # 249,999 + 150,000 = 399,999 kobo
    assert refund_amount([(1, 249_999)], "damaged", 150_000) == 399_999


def test_restocking_fee_rounds_half_up():
    # 249,999 x 0.9 = 224,999.1 kobo, which rounds to 224,999
    assert item_refund(1, 249_999, "changed_mind") == 224_999
    # 333,333 x 0.9 = 299,999.7 kobo, which rounds to 300,000
    assert item_refund(1, 333_333, "changed_mind") == 300_000


# ISSUE-103: delivered 1 September; the policy allows returns within 14 days
def test_return_on_day_14_is_allowed():
    assert within_window(date(2026, 9, 1), date(2026, 9, 15))


def test_return_on_day_15_is_refused():
    assert not within_window(date(2026, 9, 1), date(2026, 9, 16))


# ISSUE-104: a search must only ever return the matching customer's orders
def test_email_search_cannot_be_tricked():
    conn = db.connect()
    db.init(conn)
    assert db.find_orders_by_email(conn, "' OR '1'='1") == []
EOF
python -m pytest --tb=no -rf
```

```text
FFF.F...
=========================== short test summary info ===========================
FAILED test_issues.py::test_damaged_refund_is_exact_to_the_kobo - AssertionEr...
FAILED test_issues.py::test_restocking_fee_rounds_half_up - AssertionError: a...
FAILED test_issues.py::test_return_on_day_14_is_allowed - assert False
FAILED test_issues.py::test_email_search_cannot_be_tricked - assert [<sqlite3...
4 failed, 4 passed in 0.01s
```

Four new tests fail, each for the reason in its report. The day-15 test passes already: the code refuses day 15 correctly, and wrongly refuses day 14 too. That's the signature of an off-by-one. The original three tests still pass, which is why nobody noticed.

ISSUE-102 and ISSUE-105 happen across **two** requests, so they need a database and the API. Reproduce one through the Flask test client:

```bash
%%bash
python - <<'EOF'
from datetime import date

import db
from app import create_app

conn = db.connect()
db.init(conn)
client = create_app(conn, today=date(2026, 9, 20)).test_client()
for part in [{"sku": "POT-SET", "quantity": 2}, {"sku": "BLN-X1", "quantity": 1}]:
    r = client.post("/orders/K-1005/refunds", json={"reason": "damaged", "items": [part]})
    print(r.status_code, r.get_json()["amount_kobo"])
paid = sum(i["quantity"] * i["unit_price_kobo"] for i in db.order_items(conn, "K-1005")) + db.get_order(conn, "K-1005")["delivery_fee_kobo"]
refunded = sum(r["amount_kobo"] for r in db.refunds_for(conn, "K-1005"))
print(f"paid {paid}, refunded {refunded}, over by {refunded - paid}")
EOF
```

```text
201 5800000
201 4800000
paid 10300000, refunded 10600000, over by 300000
```

Refunded more than was paid, by exactly one delivery fee. Lesson 5 turns this into a test and fixes it.

## Walkthrough

1. Run the cells.
2. Reproduce ISSUE-102 the same way: post the same refund for K-1002 twice. What comes back?
3. Reproduce ISSUE-106: post a refund for order K-9999. What status code do you get?
4. For each reproduction, write down the **right** behaviour in one sentence. That's the rule your fix must meet.
5. Write a test for ISSUE-106 (the task below).

## Practice

```answer
{
  "id": "sdc-02-p1",
  "prompt": "How many tests **fail** when you run the suite with `test_issues.py` added?",
  "answer": 4,
  "format": "number",
  "hint": "Count the FAILED lines.",
  "required": true
}
```

```answer
{
  "id": "sdc-02-p2",
  "prompt": "By how many kobo do K-1005's two refunds exceed what the customer paid?",
  "answer": 300000,
  "format": "number",
  "hint": "The last line of the second cell.",
  "required": true
}
```

```task
{
  "id": "sdc-02-t1",
  "prompt": "Write a **pytest test** that reproduces **ISSUE-106**: a refund request for an order that doesn't exist must return **404** with an error message, not a 500. Use the Flask test client.",
  "minutes": 8,
  "rows": 12,
  "placeholder": "def test_unknown_order_returns_404():\n    ...",
  "rules": [
    { "label": "A test function", "pattern": "def test_\\w+\\(" },
    { "label": "Sets up the database", "pattern": "db\\.(connect|init)" },
    { "label": "Uses the test client", "pattern": "test_client\\(\\)" },
    { "label": "Posts to a missing order", "pattern": "post\\([^)]*K-9999|post\\([^)]*missing|post\\([^)]*nope" },
    { "label": "Asserts 404", "pattern": "assert[^\\n]*404" },
    { "label": "Checks the error message", "pattern": "assert[^\\n]*(error|message)" }
  ],
  "sample": "from datetime import date\n\nimport db\nfrom app import create_app\n\n\ndef test_unknown_order_returns_404():\n    conn = db.connect()\n    db.init(conn)\n    client = create_app(conn, today=date(2026, 9, 20)).test_client()\n    r = client.post(\"/orders/K-9999/refunds\", json={\"reason\": \"damaged\", \"items\": []})\n    assert r.status_code == 404\n    assert \"error\" in r.get_json()",
  "note": "Today this test fails with a 500. In lesson 6 it passes.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why use the reporter's own example in the test?",
    "options": ["It's quicker", "It proves you've reproduced the bug they actually saw", "Reporters insist", "It's always the edge case"],
    "answer": 1,
    "explanation": "Reproduce the real failure first."
  },
  {
    "prompt": "The day-15 test passes but the day-14 test fails. What kind of bug is that?",
    "options": ["A rounding bug", "An off-by-one at the boundary", "A security bug", "A race condition"],
    "answer": 1,
    "explanation": "Test both sides of every boundary."
  },
  {
    "prompt": "Where should the expected answer in a test come from?",
    "options": ["Running the current code", "Working it out by hand from the rules", "The bug reporter's guess", "A random number"],
    "answer": 1,
    "explanation": "Copying the code's answer would test the bug, not the rule."
  }
]
```
