---
title: Fix the money and the window
minutes: 25
summary: Fix ISSUE-101 and ISSUE-103 at their root by keeping money in whole kobo with Decimal and explicit rounding, and by writing the window rule the way the policy states it. Then prove the fix with the tests from lesson 2.
---

## The problem

You have failing tests for the kobo that goes missing and for customers refused on day 14. Now fix the code, without breaking anything that works. The tempting fix for the money bug is `round()` instead of `int()`. It makes the test pass, but it leaves floats in charge of money, and the next bug is waiting.

## The concept

### Money in whole kobo

Keep amounts as integers in the smallest unit (kobo) from end to end. When a calculation creates fractions, such as a 10% fee, use `Decimal` and round **once**, explicitly, with the rule the business uses: here, halves round up (`ROUND_HALF_UP`).

### Why floats fail

`2499.99 * 100` is `249998.99999999997` in floating point, and `int()` cuts it to 249,998. Floats can't represent most decimal fractions exactly.

### Write rules as the policy states them

The website says returns are allowed **within 14 days** of delivery, which includes day 14. Write `<= 14`, name the constant, and say it in the docstring.

### Small, focused changes

Change only what the bugs need. A diff that's easy to review is easier to trust.

![Why floats lose a unit of money, keeping amounts as whole smallest units, writing the rule as the policy states it, and keeping fixes small](/images/courses/swe-capstone/money-and-window.svg "Integers for money; round once; write the rule as the policy states it.")

## Example

Get the code, keep a copy of the original, and write the fix:

```bash
%%bash
base=https://academy.cloudtechanalytics.com/datasets/refunds
for f in refunds.py db.py app.py schema.sql customers.csv orders.csv order_items.csv test_refunds.py pytest.ini; do
  curl -sO "$base/$f"
done
cp refunds.py refunds_original.py
cat > refunds.py <<'EOF'
"""Refund rules for Kasuwa. Money is in whole kobo (integers)."""
from decimal import ROUND_HALF_UP, Decimal

RETURN_WINDOW_DAYS = 14
RESTOCKING_FEE = Decimal("0.10")  # charged on 'changed_mind' returns
REASONS = {"failed_delivery", "damaged", "wrong_item", "changed_mind"}


def round_kobo(amount):
    """Round a Decimal amount of kobo to a whole kobo, halves up."""
    return int(amount.quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def item_refund(quantity, unit_price_kobo, reason):
    """Refund for one order line, in kobo."""
    amount = Decimal(quantity * unit_price_kobo)
    if reason == "changed_mind":
        amount *= 1 - RESTOCKING_FEE
    return round_kobo(amount)


def within_window(delivered_on, today):
    """True if a return is allowed: on or before day 14 after delivery."""
    return (today - delivered_on).days <= RETURN_WINDOW_DAYS


def refund_amount(items, reason, delivery_fee_kobo):
    """Total refund in kobo. items is a list of (quantity, unit_price_kobo) pairs."""
    total = sum(item_refund(quantity, price, reason) for quantity, price in items)
    if reason in ("failed_delivery", "damaged", "wrong_item"):
        total += delivery_fee_kobo
    return total
EOF
diff -u refunds_original.py refunds.py | tail -n +3
```

```text
@@ -1,22 +1,27 @@
-"""Refund rules for Kasuwa."""
-from datetime import date
+"""Refund rules for Kasuwa. Money is in whole kobo (integers)."""
+from decimal import ROUND_HALF_UP, Decimal

 RETURN_WINDOW_DAYS = 14
-RESTOCKING_FEE = 0.10  # charged on 'changed_mind' returns
+RESTOCKING_FEE = Decimal("0.10")  # charged on 'changed_mind' returns
 REASONS = {"failed_delivery", "damaged", "wrong_item", "changed_mind"}


+def round_kobo(amount):
+    """Round a Decimal amount of kobo to a whole kobo, halves up."""
+    return int(amount.quantize(Decimal("1"), rounding=ROUND_HALF_UP))
+
+
 def item_refund(quantity, unit_price_kobo, reason):
     """Refund for one order line, in kobo."""
-    naira = quantity * (unit_price_kobo / 100)
+    amount = Decimal(quantity * unit_price_kobo)
     if reason == "changed_mind":
-        naira = naira * (1 - RESTOCKING_FEE)
-    return int(naira * 100)
+        amount *= 1 - RESTOCKING_FEE
+    return round_kobo(amount)


 def within_window(delivered_on, today):
-    """True if a return is still allowed: within 14 days of delivery."""
-    return (today - delivered_on).days < RETURN_WINDOW_DAYS
+    """True if a return is allowed: on or before day 14 after delivery."""
+    return (today - delivered_on).days <= RETURN_WINDOW_DAYS


 def refund_amount(items, reason, delivery_fee_kobo):
```

The diff is small. Apart from removing an import the old code never used, every changed line is about one of the two bugs. Now the tests from lesson 2 for these issues, plus the originals:

```bash
%%bash
cat > test_issues.py <<'EOF'
from datetime import date

from refunds import item_refund, refund_amount, within_window


def test_damaged_refund_is_exact_to_the_kobo():
    # ISSUE-101: 249,999 + 150,000 = 399,999 kobo
    assert refund_amount([(1, 249_999)], "damaged", 150_000) == 399_999


def test_restocking_fee_rounds_half_up():
    # 249,999 x 0.9 = 224,999.1 -> 224,999;  333,333 x 0.9 = 299,999.7 -> 300,000
    assert item_refund(1, 249_999, "changed_mind") == 224_999
    assert item_refund(1, 333_333, "changed_mind") == 300_000


def test_return_on_day_14_is_allowed():
    # ISSUE-103: delivered 1 September, returned 15 September
    assert within_window(date(2026, 9, 1), date(2026, 9, 15))


def test_return_on_day_15_is_refused():
    assert not within_window(date(2026, 9, 1), date(2026, 9, 16))
EOF
python -m pytest
python -c "from refunds import refund_amount; print('K-1001 refund:', refund_amount([(1, 249_999)], 'damaged', 150_000), 'kobo')"
```

```text
.......
7 passed in 0.01s
K-1001 refund: 399999 kobo
```

All seven pass, the originals included. K-1001's customer is owed one more kobo, and finance's reconciliation now balances.

## Walkthrough

1. Run the cells.
2. Try the "quick fix": put the original code back and change `int(naira * 100)` to `round(naira * 100)`. Do the tests pass? Find an amount where `round()` on a float still gives the wrong answer (hint: Python's `round` rounds halves to even).
3. Should the refund for K-1001 be corrected for the customer? Write the note to finance.
4. Check every order line in `order_items.csv` with the old and new code. How many would have been refunded wrongly?
5. Write the commit message (the task below).

## Practice

```answer
{
  "id": "sdc-03-p1",
  "prompt": "After the fix, what's K-1001's refund in kobo?",
  "answer": 399999,
  "format": "number",
  "hint": "The last line printed.",
  "required": true
}
```

```task
{
  "id": "sdc-03-t1",
  "prompt": "Write the **commit message** for this fix: a short **summary line** (under 72 characters), a blank line, then a body that says **what** was wrong, **why**, and how it's **tested**, and names both **issues**.",
  "minutes": 6,
  "rows": 8,
  "placeholder": "Fix refund rounding and the 14-day return window\n\n...",
  "rules": [
    { "label": "A summary line under 72 characters", "pattern": "^.{10,71}$" },
    { "label": "A blank line after the summary", "pattern": "^.+\\n\\s*\\n" },
    { "label": "Names both issues", "pattern": "ISSUE-10[13]", "min": 2 },
    { "label": "Explains the money cause (float, kobo, Decimal)", "pattern": "float|decimal|kobo" },
    { "label": "Explains the window (14, boundary, <=)", "pattern": "14|boundary|<=|inclusive" },
    { "label": "Mentions tests", "pattern": "test" }
  ],
  "sample": "Fix refund rounding and the 14-day return window\n\nRefunds were calculated in naira as floats and cut off with int(),\nso some amounts lost a kobo (ISSUE-101: 2,499.99 became 249,998\nkobo). Money now stays in whole kobo, and the restocking fee uses\nDecimal with ROUND_HALF_UP, as finance specifies.\n\nThe return window used < 14, refusing returns on day 14, which the\npolicy allows (ISSUE-103). It now uses <= RETURN_WINDOW_DAYS.\n\nTests: exact refund for the K-1001 example, half-up rounding of the\nrestocking fee, and both sides of the day-14 boundary.",
  "note": "A good commit message is for the developer who reads it in a year, wondering why this line changed.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why is changing int() to round() not a real fix?",
    "options": ["round() is slower", "Floats still carry the money, so other amounts can still come out wrong", "round() doesn't exist", "It changes the tests"],
    "answer": 1,
    "explanation": "Fix the cause: keep money exact."
  },
  {
    "prompt": "The policy says \"within 14 days\". Which comparison is right?",
    "options": ["days < 14", "days <= 14", "days > 14", "days == 14"],
    "answer": 1,
    "explanation": "Within 14 days includes day 14."
  },
  {
    "prompt": "Why keep the original tests passing after the fix?",
    "options": ["Habit", "They prove the fix didn't break behaviour that already worked", "They're required by Git", "To increase coverage numbers"],
    "answer": 1,
    "explanation": "A fix that breaks something else isn't a fix."
  }
]
```
