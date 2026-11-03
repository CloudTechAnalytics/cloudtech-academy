---
title: Edge cases and boundaries
minutes: 15
summary: Design tests around boundaries, where most bugs live, use pytest's parametrize to check many cases at once, and find and fix an off-by-one bug in Tallybook's late fees.
---

## The problem

Tallybook charges a late fee on overdue invoices: **2% of what's outstanding for each full 30 days late, for at most 3 periods**. A customer who paid exactly 30 days late was charged nothing. Another, 120 days late, was charged 6%, as expected. Support couldn't tell whether the first case was a bug or a misreading of the rule.

Bugs cluster at **boundaries**: the exact point where a rule changes. Tests that only check comfortable middle values miss them.

## The concept

### Boundary value testing

For every rule with a threshold, test **just below**, **exactly at**, and **just above** each boundary, plus the extremes:

| Days late | Expected periods | Why |
| :-- | :-- | :-- |
| 0 | 0 | on time |
| 29 | 0 | just under one full period |
| 30 | 1 | exactly one full period |
| 31 | 1 | just over |
| 60 | 2 | exactly two |
| 90 | 3 | exactly three |
| 120 | 3 | capped at three |

![A step chart of late-fee periods against days late, rising at 30, 60 and 90 days and capped at 3; red dots mark the tests at 0, 29, 30, 31, 60, 90 and 120, with a zoom on 29, 30 and 31](/images/courses/swe/boundaries.svg "Test just below, at and just above each boundary.")

### Parametrize

`@pytest.mark.parametrize` runs one test with many inputs, so a table like this becomes one short test, and each row is reported separately.

### Fix with a failing test first

When you find a bug: first write a test that fails because of it, then fix the code, then watch the test pass. The test proves the bug existed and stays fixed.

## Example

The late fee function as it was written, with boundary tests:

```bash
%%bash
cat > pytest.ini <<'EOF'
[pytest]
addopts = -q -p no:cacheprovider --tb=no -rf
console_output_style = classic
EOF
cat > fees.py <<'EOF'
from decimal import Decimal, ROUND_HALF_UP

LATE_FEE_RATE = Decimal("0.02")
PERIOD_DAYS = 30
MAX_PERIODS = 3


def late_fee(outstanding, days_late):
    """Late fee in kobo: 2% of outstanding per full 30 days late, at most 3 periods."""
    periods = min((days_late - 1) // PERIOD_DAYS, MAX_PERIODS)
    periods = max(periods, 0)
    fee = Decimal(outstanding) * LATE_FEE_RATE * periods
    return int(fee.quantize(Decimal("1"), rounding=ROUND_HALF_UP))
EOF
cat > test_fees.py <<'EOF'
import pytest

from fees import late_fee


@pytest.mark.parametrize("days_late, periods", [
    (0, 0), (29, 0), (30, 1), (31, 1), (60, 2), (90, 3), (120, 3),
])
def test_late_fee_periods(days_late, periods):
    # 2% of N10,000 (1,000,000 kobo) is 20,000 kobo per period
    assert late_fee(1_000_000, days_late) == 20_000 * periods
EOF
python -m pytest
```

```text
..F.FF.
=========================== short test summary info ===========================
FAILED test_fees.py::test_late_fee_periods[30-1] - assert 0 == (20000 * 1)
FAILED test_fees.py::test_late_fee_periods[60-2] - assert 20000 == (20000 * 2)
FAILED test_fees.py::test_late_fee_periods[90-3] - assert 40000 == (20000 * 3)
3 failed, 4 passed in 0.01s
```

Three boundaries fail: exactly 30, 60 and 90 days. The cause is `days_late - 1`: someone "fixed" an earlier problem by subtracting one, which shifted every boundary by a day. The rule says a **full** 30 days, so 30 days late is one period. Fix it and rerun:

```bash
%%bash
cat > pytest.ini <<'EOF'
[pytest]
addopts = -q -p no:cacheprovider --tb=no -rf
console_output_style = classic
EOF
cat > fees.py <<'EOF'
from decimal import Decimal, ROUND_HALF_UP

LATE_FEE_RATE = Decimal("0.02")
PERIOD_DAYS = 30
MAX_PERIODS = 3


def late_fee(outstanding, days_late):
    """Late fee in kobo: 2% of outstanding per full 30 days late, at most 3 periods."""
    if days_late < 0:
        raise ValueError("days_late can't be negative")
    periods = min(days_late // PERIOD_DAYS, MAX_PERIODS)
    fee = Decimal(outstanding) * LATE_FEE_RATE * periods
    return int(fee.quantize(Decimal("1"), rounding=ROUND_HALF_UP))
EOF
cat > test_fees.py <<'EOF'
import pytest

from fees import late_fee


@pytest.mark.parametrize("days_late, periods", [
    (0, 0), (29, 0), (30, 1), (31, 1), (60, 2), (90, 3), (120, 3),
])
def test_late_fee_periods(days_late, periods):
    # 2% of N10,000 (1,000,000 kobo) is 20,000 kobo per period
    assert late_fee(1_000_000, days_late) == 20_000 * periods


def test_negative_days_is_rejected():
    with pytest.raises(ValueError):
        late_fee(1_000_000, -1)
EOF
python -m pytest
```

```text
........
8 passed in 0.01s
```

All eight pass, and the negative-days case, which the old code quietly treated as zero, is now an explicit error.

## Walkthrough

1. Run the cells. In the fixed version, what fee does a ₦10,000 balance get at 89 days? At 91?
2. Add boundary cases for the discount limit in `invoice_total`: 0, 20 and 21 per cent.
3. Why does each parametrized case appear as a separate result?
4. Write boundary tests for a new rule (the task below).

## Practice

```task
{
  "id": "swe-04-t1",
  "prompt": "Tallybook adds a rule: **invoices of ₦500,000 or more need a manager's approval**. Write a **parametrized** pytest test for a function `needs_approval(total_kobo)` with cases **just below**, **exactly at**, and **just above** the boundary, plus **zero**.",
  "minutes": 8,
  "rows": 10,
  "placeholder": "@pytest.mark.parametrize(...)\ndef test_...",
  "rules": [
    { "label": "Uses pytest.mark.parametrize", "pattern": "@pytest\\.mark\\.parametrize" },
    { "label": "A test function using needs_approval", "pattern": "def\\s+test_\\w+[\\s\\S]*needs_approval\\(" },
    { "label": "The exact boundary in kobo (50,000,000)", "pattern": "50_?000_?000\\b" },
    { "label": "Just below the boundary (49,999,999)", "pattern": "49_?999_?999\\b" },
    { "label": "Just above the boundary (50,000,001)", "pattern": "50_?000_?001\\b" },
    { "label": "Zero", "pattern": "\\(\\s*0\\s*," }
  ],
  "sample": "import pytest\n\nfrom approvals import needs_approval\n\n\n@pytest.mark.parametrize(\"total_kobo, expected\", [\n    (0, False),\n    (49_999_999, False),   # N499,999.99\n    (50_000_000, True),    # exactly N500,000.00\n    (50_000_001, True),\n])\ndef test_needs_approval_at_five_hundred_thousand(total_kobo, expected):\n    assert needs_approval(total_kobo) is expected",
  "note": "Testing in kobo makes 'just below' exact: one kobo under the limit.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A rule applies 'from 30 days'. Which values should you test?",
    "options": ["Only 45", "29, 30 and 31, plus the extremes", "Only 30", "Random values"],
    "answer": 1,
    "explanation": "Below, at and above each boundary."
  },
  {
    "prompt": "What does @pytest.mark.parametrize do?",
    "options": ["Speeds tests up", "Runs one test function with many sets of inputs", "Skips tests", "Writes tests for you"],
    "answer": 1,
    "explanation": "One test, many cases."
  },
  {
    "prompt": "You find a bug. What's the first step?",
    "options": ["Fix the code", "Write a test that fails because of the bug", "Delete the old tests", "Tell the customer"],
    "answer": 1,
    "explanation": "The failing test proves the bug and guards the fix."
  }
]
```
