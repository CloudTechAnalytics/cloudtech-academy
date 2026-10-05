---
title: "Conditions: if, elif and else"
minutes: 30
summary: Make your code decide. Comparison and logical operators, if, elif and else, indentation, nested decisions, the one-line form, and which values count as true.
---

## Comparisons give True or False

Every decision starts with a question that's either true or false. **Comparison operators** ask those questions:

| Operator | Asks | Example | Result |
| :-- | :-- | :-- | :-- |
| `==` | equal to? | `5 == 5` | `True` |
| `!=` | not equal to? | `5 != 3` | `True` |
| `>` | greater than? | `5 > 3` | `True` |
| `<` | less than? | `5 < 3` | `False` |
| `>=` | greater than or equal? | `5 >= 5` | `True` |
| `<=` | less than or equal? | `4 <= 3` | `False` |

```python
score = 67
print(score >= 50)
print(score == 70)
print("Lagos" == "lagos")
```

```text
True
False
False
```

Text comparisons are exact: capitals matter, so `"Lagos"` and `"lagos"` aren't equal.

> [!WARNING]
> `=` **stores** a value; `==` **compares** two values. `score = 70` sets score; `score == 70` asks whether it's 70. Mixing them up is the commonest beginner mistake.

## if: do something only when it's true

```python
balance = 4500
if balance < 5000:
    print("Low balance: top up soon")
print("Done")
```

```text
Low balance: top up soon
Done
```

The parts of an `if`:

1. `if`, then a condition, then a **colon** `:`.
2. The lines that belong to it are **indented** by four spaces. That's the **block**.
3. When the condition is true, the block runs. When it's false, Python skips it.
4. The first line back at the left edge (`print("Done")`) isn't part of the `if`: it always runs.

### Indentation is part of the code

In most languages, indentation is just for looks. In Python, it decides which lines belong to the `if`:

```python
balance = 8000
if balance < 5000:
    print("Low balance")
    print("Top up soon")
print("Balance checked")
```

```text
Balance checked
```

Both indented lines were skipped because the condition was false. Colab indents for you when you press Enter after a colon. Use four spaces, and keep it consistent.

## else: the alternative

`else` runs when the condition is false. Exactly one of the two blocks runs:

```python
score = 45
if score >= 50:
    print("Pass")
else:
    print("Fail: register for the resit")
```

```text
Fail: register for the resit
```

## elif: several choices

`elif` ("else if") adds more conditions. Python checks them **from the top** and runs the **first** block whose condition is true, then skips the rest:

![Ticket prices decided by if, elif and else: for an age of 34 the first two conditions are false, the third is true and the ticket is adult; and the combining words and, or and not](/images/courses/python/if-elif-else.svg "if / elif / else: the first true condition runs, and the rest are skipped.")

```python
score = 67

if score >= 70:
    grade = "A"
elif score >= 60:
    grade = "B"
elif score >= 50:
    grade = "C"
elif score >= 45:
    grade = "D"
else:
    grade = "F"

print(f"Score {score} is grade {grade}")
```

```text
Score 67 is grade B
```

67 isn't `>= 70`, so Python moves on; it **is** `>= 60`, so grade is `"B"` and the remaining checks are skipped. That's why the order matters: put the highest band first. If `score >= 50` came first, 67 would be graded C.

## Combining conditions: and, or, not

| Operator | True when | Example |
| :-- | :-- | :-- |
| `and` | **both** sides are true | `age >= 18 and has_id` |
| `or` | **at least one** side is true | `day == "Sat" or day == "Sun"` |
| `not` | the condition is **false** | `not is_paid` |

```python
cgpa = 4.1
attendance = 82

if cgpa >= 4.0 and attendance >= 75:
    print("Eligible for the scholarship")
else:
    print("Not eligible")
```

```text
Eligible for the scholarship
```

```python
day = "Sunday"
if day == "Saturday" or day == "Sunday":
    print("Weekend")
```

```text
Weekend
```

Note that each side of `or` is a complete comparison. `day == "Saturday" or "Sunday"` looks right but is always true, a classic bug; the `in` operator below is a neater way to write it.

### Ranges in one go

Python lets you chain comparisons the way you'd write them in maths:

```python
temperature = 31
if 25 <= temperature <= 35:
    print("Normal for Lagos")
```

```text
Normal for Lagos
```

### Checking membership with in

`in` checks whether a value is in a list (or a string):

```python
day = "Sunday"
if day in ["Saturday", "Sunday"]:
    print("Weekend")
```

```text
Weekend
```

## Nested decisions

A block can contain another `if`. Indent once more for each level:

```python
is_student = True
level = 100

if is_student:
    if level == 100:
        fee = 20000
    else:
        fee = 35000
else:
    fee = 50000

print(f"Fee: ₦{fee:,}")
```

```text
Fee: ₦20,000
```

More than two or three levels deep gets hard to read. Often `and` or `elif` does the same job more simply.

## The one-line form

For a simple either-or **value**, there's a short form: `value_if_true if condition else value_if_false`:

```python
score = 58
result = "Pass" if score >= 50 else "Fail"
print(result)
```

```text
Pass
```

Use it only when it's easy to read. For anything longer, write a full `if`/`else`.

## Truthy and falsy values

`if` doesn't need a comparison. Any value can be tested, and Python treats some as false:

| Treated as false | Everything else is true |
| :-- | :-- |
| `False`, `None`, `0`, `0.0`, `""` (empty text), `[]` (empty list) | `True`, any non-zero number, any non-empty text or list |

```python
name = ""
if name:
    print(f"Hello {name}")
else:
    print("Please enter your name")
```

```text
Please enter your name
```

That's a common way to check that someone actually typed something.

## When it goes wrong

```python norun
if score >= 50
    print("Pass")
```

```text nocheck
SyntaxError: expected ':'
```

**Missing colon.** Every `if`, `elif` and `else` line ends with `:`.

```python norun
if score >= 50:
print("Pass")
```

```text nocheck
IndentationError: expected an indented block after 'if' statement on line 1
```

**Missing indentation.** The block must be indented.

```python norun
if score = 70:
    print("Exactly 70")
```

```text nocheck
SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?
```

**`=` instead of `==`.** Python even suggests the fix.

## Summary

| You want to... | Write |
| :-- | :-- |
| run code only if true | `if cond:` + indented block |
| choose between two | `if cond: ... else: ...` |
| choose between several | `if ... elif ... elif ... else ...` (highest band first) |
| require both | `a and b` |
| accept either | `a or b` (full comparisons on both sides) |
| reverse a condition | `not a` |
| check a range | `low <= x <= high` |
| check a list | `x in [...]` |
| pick a value in one line | `a if cond else b` |

## Try it

```answer
{
  "id": "py-m07-a1",
  "prompt": "Using the grading rules in the lesson (70+ A, 60+ B, 50+ C, 45+ D, otherwise F), what grade does a score of **46** get?",
  "answer": "D",
  "format": "text",
  "pyVerify": "'A' if 46 >= 70 else 'B' if 46 >= 60 else 'C' if 46 >= 50 else 'D' if 46 >= 45 else 'F'",
  "required": true
}
```

```answer
{
  "id": "py-m07-a2",
  "prompt": "`cgpa = 3.9` and `attendance = 90`. Is `cgpa >= 4.0 and attendance >= 75` True or False?",
  "answer": "False",
  "format": "text",
  "accept": ["false"],
  "pyVerify": "str(3.9 >= 4.0 and 90 >= 75)",
  "required": true
}
```

```answer
{
  "id": "py-m07-a3",
  "prompt": "What does `\"Pass\" if 49 >= 50 else \"Fail\"` give? Type it without quotes.",
  "answer": "Fail",
  "format": "text",
  "pyVerify": "'Pass' if 49 >= 50 else 'Fail'",
  "required": true
}
```

```task
{
  "id": "py-m07-t1",
  "prompt": "Write a **data plan advisor**: store how many GB someone used last month in a variable, then use `if`, `elif` and `else` to recommend a plan (for example under 2 GB: Basic; 2 to 10 GB: Standard; over 10 GB: Premium), and print the recommendation with an f-string. Add one extra condition using `and` or `or` (for example, students get a discount). Paste your code.",
  "minutes": 8,
  "rows": 14,
  "placeholder": "used_gb = 6.5\nis_student = True\n\nif ...",
  "rules": [
    { "label": "if, elif and else, each ending with a colon", "pattern": "^\\s*(if|elif|else)\\b[^\\n]*:\\s*$", "min": 3 },
    { "label": "Blocks are indented", "pattern": "^( {4}|\\t)\\S", "min": 3 },
    { "label": "Uses comparisons like < or >=", "pattern": "(<|>|<=|>=)\\s*\\d", "min": 2 },
    { "label": "Uses and or or", "pattern": "\\b(and|or)\\b" },
    { "label": "Prints with an f-string", "pattern": "print\\(\\s*f[\"']" },
    { "label": "Compares with == or >= / <=, not a single =", "pattern": "if\\s+[^\\n:]*[^=!<>]=[^=][^\\n]*:", "absent": true }
  ],
  "sample": "used_gb = 6.5\nis_student = True\n\nif used_gb < 2:\n    plan = \"Basic\"\nelif used_gb <= 10:\n    plan = \"Standard\"\nelse:\n    plan = \"Premium\"\n\nif is_student and plan != \"Basic\":\n    print(f\"We recommend {plan}, with the student discount.\")\nelse:\n    print(f\"We recommend {plan}.\")",
  "required": true
}
```
