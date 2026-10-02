---
title: Decisions, Lists and Loops
minutes: 25
summary: Make your code decide with if statements, store many values in lists, and repeat work with for loops.
---

## Making decisions with if

```python
score = 67

if score >= 70:
    grade = "A"
elif score >= 60:
    grade = "B"
elif score >= 50:
    grade = "C"
else:
    grade = "F"

print(f"Score {score} is grade {grade}")
```

Two rules that catch every beginner:

- The line before a block ends with a **colon** `:`.
- The block is **indented** (4 spaces). Indentation is how Python knows what belongs inside the `if`.

Comparison operators: `==` equal, `!=` not equal, `>`, `<`, `>=`, `<=`. Combine conditions with `and`, `or` and `not`.

> [!WARNING]
> `=` assigns a value; `==` compares two values. `if score = 70:` is an error.

## Lists

A **list** stores many values in order, inside square brackets:

```python
courses = ["ECO 201", "STA 211", "GST 201"]
scores = [67, 81, 54]

print(courses[0])      # first item: ECO 201 (counting starts at 0)
print(len(scores))     # how many items: 3
courses.append("CSC 201")  # add one to the end
print(max(scores), min(scores), sum(scores))
```

## Loops

A **for loop** runs the same code for every item in a list:

```python
for course in courses:
    print("Registered:", course)
```

Loop over two lists together with `zip`:

```python
for course, score in zip(courses, scores):
    if score >= 50:
        print(f"{course}: {score} - pass")
    else:
        print(f"{course}: {score} - fail")
```

Repeat something a set number of times with `range`:

```python
for week in range(1, 5):
    print("Week", week)
```

This prints weeks 1 to 4. `range` stops **before** the second number.

## When it goes wrong

Four mistakes cause most beginner errors with `if` and loops:

```python norun
if score >= 50
    print("Pass")
```

```text nocheck
SyntaxError: expected ':'
```

**Missing colon.** Every `if`, `elif`, `else` and `for` line ends with `:`.

```python norun
for course in courses:
print(course)
```

```text nocheck
IndentationError: expected an indented block after 'for' statement on line 1
```

**Missing indentation.** The lines inside a block must be indented (Colab adds 4 spaces when you press Enter after a colon).

```python norun
if score = 70:
    print("Exactly 70")
```

**`=` instead of `==`.** One `=` stores a value; `==` compares. Python stops with a SyntaxError and usually suggests `==`.

```python norun
scores = [67, 81, 54]
print(scores[3])
```

```text nocheck
IndexError: list index out of range
```

**Off by one.** Three items have positions 0, 1 and 2. The last item is `scores[-1]` or `scores[len(scores) - 1]`.

## Try it

Use these scores in Colab for the first three questions:

```python
my_scores = [67, 81, 54, 72, 45]
```

```answer
{
  "id": "py-m02-a1",
  "prompt": "What is the **average** of `my_scores`? One decimal place.",
  "answer": 63.8,
  "format": "number",
  "hint": "sum(my_scores) / len(my_scores)",
  "pyVerify": "round(sum(my_scores) / len(my_scores), 1)",
  "required": true
}
```

```answer
{
  "id": "py-m02-a2",
  "prompt": "Using a loop and a counter, how many scores are **70 or above**?",
  "answer": 2,
  "format": "number",
  "hint": "Start with count = 0, loop over my_scores, and add 1 when score >= 70.",
  "pyVerify": "sum(1 for s in my_scores if s >= 70)",
  "required": true
}
```

```answer
{
  "id": "py-m02-a3",
  "prompt": "With the grading rules in the lesson (70+ A, 60+ B, 50+ C, otherwise F), what grade does **54** get?",
  "answer": "C",
  "format": "text",
  "pyVerify": "'A' if 54 >= 70 else 'B' if 54 >= 60 else 'C' if 54 >= 50 else 'F'",
  "required": true
}
```

```task
{
  "id": "py-m02-t1",
  "prompt": "Write a program that **loops through a list of five scores** (yours or `my_scores`) and prints each score with its grade using `if`, `elif` and `else`, then prints how many are 70 or above. Run it, then paste your code.",
  "minutes": 10,
  "rows": 14,
  "placeholder": "scores = [...]\ncount = 0\nfor score in scores:\n    ...",
  "rules": [
    { "label": "A list of scores in square brackets", "pattern": "=\\s*\\[\\s*\\d+(\\s*,\\s*\\d+){4,}\\s*\\]" },
    { "label": "A for loop over the list, ending with a colon", "pattern": "^\\s*for\\s+\\w+\\s+in\\s+\\w+.*:\\s*$" },
    { "label": "if, elif and else, each ending with a colon", "pattern": "^\\s*(if|elif|else)\\b[^\\n]*:\\s*$", "min": 3 },
    { "label": "Lines inside blocks are indented", "pattern": "^( {4}|\\t)\\S", "min": 3 },
    { "label": "A counter that goes up (count += 1 or count = count + 1)", "pattern": "\\w+\\s*\\+=\\s*1|(\\w+)\\s*=\\s*\\1\\s*\\+\\s*1" },
    { "label": "Compares with == or >= / <=, not a single =", "pattern": "if\\s+[^\\n:]*[^=!<>]=[^=][^\\n]*:", "absent": true }
  ],
  "sample": "scores = [67, 81, 54, 72, 45]\ncount = 0\nfor score in scores:\n    if score >= 70:\n        grade = \"A\"\n        count += 1\n    elif score >= 60:\n        grade = \"B\"\n    elif score >= 50:\n        grade = \"C\"\n    else:\n        grade = \"F\"\n    print(f\"{score}: {grade}\")\nprint(f\"{count} scores are 70 or above\")",
  "required": true
}
```
