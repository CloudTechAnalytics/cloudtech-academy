---
title: Modules and tests
minutes: 15
summary: Move the invoice rules into a module, write automated tests for them with pytest, and run the tests in Colab, so every change is checked in seconds instead of by hand.
---

## The problem

Every time someone touched the invoice code, someone else checked a few invoices by hand. That's slow, it's skipped when people are busy, and it only checks the cases people remember. The kobo bug from lesson 2 survived for two years that way.

**Automated tests** are code that checks code. They run in seconds, every time, and they check exactly the cases you wrote down, including the awkward ones.

## The concept

**Modules**

A `.py` file is a **module**. Put the invoice rules in `invoicing.py`, and any other code can `import` them. One file, one source of truth.

**pytest**

pytest finds files named `test_*.py`, runs every function named `test_*` in them, and reports which passed and which failed. A test is a function with an `assert`:

```python norun
def test_vat_exempt_customer_pays_no_vat():
    assert invoice_total([(2, 100_000)], vat_exempt=True) == 200_000
```

`pytest.raises` checks that something **fails** the way it should.

**What makes a good test**

- One behaviour per test, named after that behaviour.
- Small, readable inputs, with the expected answer worked out by hand (and a comment showing how).
- Include the cases that went wrong before (half-kobo rounding) and the rules that must hold (no discount above 20%).

**Running it in Colab**

The cells in this course start with `%%bash` and use `cat > file <<'EOF'` to write files, then run `python -m pytest`. A `pytest.ini` file keeps the output compact.

## Example

Write the module. It's the code from lesson 2, plus input checks and conversion from naira:

```bash
%%bash
cat > invoicing.py <<'EOF'
"""Invoice calculations for Tallybook. Money is in whole kobo (integers)."""
from decimal import Decimal, ROUND_HALF_UP

VAT_RATE = Decimal("0.075")
MAX_DISCOUNT_PCT = 20


def round_kobo(amount):
    """Round a Decimal amount of kobo to a whole kobo, halves up."""
    return int(amount.quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def to_kobo(naira):
    """Convert '12500.50' or '₦12,500.50' to kobo."""
    cleaned = naira.replace("₦", "").replace(",", "").strip()
    return round_kobo(Decimal(cleaned) * 100)


def invoice_total(lines, discount_pct=0, vat_exempt=False):
    """Total in kobo. Lines are (quantity, unit price in kobo) pairs."""
    if not 0 <= discount_pct <= MAX_DISCOUNT_PCT:
        raise ValueError(f"discount_pct must be between 0 and {MAX_DISCOUNT_PCT}, got {discount_pct}")
    subtotal = sum(quantity * unit_price for quantity, unit_price in lines)
    after_discount = subtotal - round_kobo(Decimal(subtotal) * discount_pct / 100)
    vat = 0 if vat_exempt else round_kobo(after_discount * VAT_RATE)
    return after_discount + vat
EOF
python -c "from invoicing import invoice_total; print(invoice_total([(2, 100_000)], discount_pct=10))"
```

```text
193500
```

Now the tests, each with its expected answer worked out in a comment:

```bash
%%bash
cat > pytest.ini <<'EOF'
[pytest]
addopts = -q -p no:cacheprovider --tb=short
console_output_style = classic
EOF
cat > test_invoicing.py <<'EOF'
import pytest

from invoicing import invoice_total, to_kobo


def test_single_line_with_vat():
    # 2 x N1,000.00 = N2,000.00, plus 7.5% VAT = N2,150.00
    assert invoice_total([(2, 100_000)]) == 215_000


def test_vat_exempt_customer_pays_no_vat():
    assert invoice_total([(2, 100_000)], vat_exempt=True) == 200_000


def test_discount_applies_before_vat():
    # N2,000 less 10% = N1,800, plus VAT of N135 = N1,935
    assert invoice_total([(2, 100_000)], discount_pct=10) == 193_500


def test_vat_rounds_half_up():
    # 220 kobo: VAT is 16.5 kobo, which rounds up to 17
    assert invoice_total([(1, 220)]) == 237


def test_discount_above_limit_is_rejected():
    with pytest.raises(ValueError):
        invoice_total([(1, 100_000)], discount_pct=25)


def test_to_kobo_handles_formatted_amounts():
    assert to_kobo("₦12,500.50") == 1_250_050
EOF
python -m pytest
```

```text
......
6 passed in 0.01s
```

Six dots, six passing tests. From now on, any change to `invoicing.py` is checked against all six rules in a fraction of a second.

## Walkthrough

1. Run the cells in a Colab notebook. Change `VAT_RATE` to `Decimal("0.07")` and run the tests again. Which fail?
2. Change `ROUND_HALF_UP` to `ROUND_HALF_EVEN`. Which test catches it?
3. Add a test for an invoice with three lines and a 15% discount (the task below).
4. Why does each test have a comment working out the answer?

## Practice

```task
{
  "id": "swe-03-t1",
  "prompt": "Write a **pytest test** for an invoice with **three lines** and a **15% discount**, for a customer who **pays VAT**. Work out the expected total in kobo in a **comment**, and name the test after what it checks.",
  "minutes": 8,
  "rows": 10,
  "placeholder": "def test_...():\n    # ...\n    assert invoice_total(...) == ...",
  "rules": [
    { "label": "A test function", "pattern": "def\\s+test_\\w+\\s*\\(\\s*\\)\\s*:" },
    { "label": "Three lines in the call", "pattern": "invoice_total\\(\\s*\\[\\s*\\(\\s*\\d[^)]*\\)\\s*,\\s*\\(\\s*\\d[^)]*\\)\\s*,\\s*\\(\\s*\\d[^)]*\\)\\s*\\]" },
    { "label": "discount_pct=15", "pattern": "discount_pct\\s*=\\s*15" },
    { "label": "An assert comparing with a number", "pattern": "assert\\s+invoice_total[\\s\\S]*==\\s*[\\d_]+" },
    { "label": "A comment working out the answer", "pattern": "#[^\\n]*\\d" }
  ],
  "sample": "def test_three_lines_with_fifteen_percent_discount():\n    # 1 x 10,000 + 2 x 5,000 + 4 x 2,500 = 30,000 kobo\n    # less 15% (4,500) = 25,500; VAT 7.5% = 1,912.5, rounds up to 1,913\n    # total 27,413 kobo\n    assert invoice_total([(1, 10_000), (2, 5_000), (4, 2_500)], discount_pct=15) == 27_413",
  "note": "The worked comment is what lets a reviewer trust the expected value: it shows the half-kobo VAT rounding up.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "How does pytest find tests?",
    "options": ["You list them", "Files named test_*.py and functions named test_*", "Any function", "Only classes"],
    "answer": 1,
    "explanation": "Naming conventions."
  },
  {
    "prompt": "How do you test that a function rejects bad input?",
    "options": ["Print the error", "with pytest.raises(ValueError):", "Wrap it in try/except and ignore it", "You can't"],
    "answer": 1,
    "explanation": "Failing correctly is behaviour worth testing."
  },
  {
    "prompt": "Why add a test for the half-kobo rounding case?",
    "options": ["It's random", "It's a case that went wrong before, so it must never go wrong again unnoticed", "It's the easiest", "pytest requires it"],
    "answer": 1,
    "explanation": "Every fixed bug deserves a test."
  }
]
```
