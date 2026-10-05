---
title: "Loops: for and while"
minutes: 40
summary: Repeat work without repeating code. for loops over lists, text and range, running totals and counters, enumerate and zip, while loops, break and continue, and a first look at list comprehensions.
---

## Why loops

Suppose you want to print a grade for each of 40 students. Writing 40 `print` lines is slow, error-prone and has to change every time the class changes. A **loop** runs the same code once for each item, however many there are.

Python has two kinds:

| Loop | Repeats | Use when |
| :-- | :-- | :-- |
| `for` | once for **each item** in a collection | you have a list, a string or a range |
| `while` | **as long as** a condition is true | you don't know in advance how many times |

## for loops

```python
courses = ["ECO 201", "STA 211", "GST 201"]

for course in courses:
    print("Registered:", course)

print("All done")
```

```text
Registered: ECO 201
Registered: STA 211
Registered: GST 201
All done
```

How to read it:

1. `for course in courses:` takes the first item and calls it `course`.
2. The indented block runs with that value.
3. Python takes the next item, and runs the block again, until the list runs out.
4. Then it carries on with the first unindented line.

`course` is a variable name you choose. Pick one that describes a single item: `for score in scores`, `for name in names`.

### Looping over text

A string is a sequence of characters, so a `for` loop goes through it one character at a time:

```python
for letter in "Lagos":
    print(letter)
```

```text
L
a
g
o
s
```

### range: counting

`range()` produces a series of numbers, perfect for repeating something a set number of times:

| Write | Gives |
| :-- | :-- |
| `range(5)` | 0, 1, 2, 3, 4 |
| `range(1, 5)` | 1, 2, 3, 4 |
| `range(0, 20, 5)` | 0, 5, 10, 15 |
| `range(10, 0, -2)` | 10, 8, 6, 4, 2 |

`range` always stops **before** the stop number. The third number is the step.

```python
for week in range(1, 5):
    print("Week", week)
```

```text
Week 1
Week 2
Week 3
Week 4
```

## Building up a result

![A for loop adding a list of prices into a running total of 525 round by round; a while loop doubling x until it passes 100; and break, continue, enumerate and zip](/images/courses/python/loops.svg "A for loop takes each item in turn; a while loop repeats while a condition holds.")

Most useful loops **accumulate** something: a total, a count or a new list. The pattern is always the same: start with an empty value **before** the loop, update it **inside**, use it **after**.

### A running total

```python
spending = [2500, 1200, 6000, 800]
total = 0
for amount in spending:
    total = total + amount
print(f"Total spent: ₦{total:,}")
```

```text
Total spent: ₦10,500
```

(Python's `sum(spending)` does this in one step, but the pattern works for anything, not just adding.)

### A counter

How many scores are 70 or above? Start at 0 and add 1 each time the condition is true:

```python
scores = [67, 81, 54, 72, 45]
count = 0
for score in scores:
    if score >= 70:
        count += 1
print(count, "scores are 70 or above")
```

```text
2 scores are 70 or above
```

`count += 1` is short for `count = count + 1`.

### Building a new list

Start with an empty list and `append` to it:

```python
scores = [67, 81, 54, 72, 45]
passed = []
for score in scores:
    if score >= 50:
        passed.append(score)
print(passed)
```

```text
[67, 81, 54, 72]
```

## Loops with decisions

Put an `if` inside the loop to treat items differently. The `if` block is indented one more level:

```python
scores = [67, 81, 54, 72, 45]
for score in scores:
    if score >= 70:
        grade = "A"
    elif score >= 60:
        grade = "B"
    elif score >= 50:
        grade = "C"
    else:
        grade = "F"
    print(f"{score}: {grade}")
```

```text
67: B
81: A
54: C
72: A
45: F
```

## enumerate: the position as well as the item

Sometimes you need each item's position too. `enumerate()` gives both:

```python
courses = ["ECO 201", "STA 211", "GST 201"]
for number, course in enumerate(courses, start=1):
    print(f"{number}. {course}")
```

```text
1. ECO 201
2. STA 211
3. GST 201
```

## zip: two lists side by side

`zip()` pairs up items from two lists, first with first, second with second:

```python
courses = ["ECO 201", "STA 211", "GST 201"]
scores = [67, 81, 54]
for course, score in zip(courses, scores):
    result = "pass" if score >= 50 else "fail"
    print(f"{course}: {score} ({result})")
```

```text
ECO 201: 67 (pass)
STA 211: 81 (pass)
GST 201: 54 (pass)
```

## while loops

A `while` loop keeps going **as long as** its condition is true. Use it when you don't know how many repeats you'll need.

You save ₦4,500 a week towards a ₦40,000 phone. How many weeks?

```python
saved = 0
weeks = 0
while saved < 40000:
    saved += 4500
    weeks += 1
print(f"{weeks} weeks: you'll have ₦{saved:,}")
```

```text
9 weeks: you'll have ₦40,500
```

Each time round, Python checks `saved < 40000`. While it's true, it runs the block. After week 9, `saved` is 40,500, the condition is false, and the loop stops.

> [!WARNING]
> Something inside a `while` loop must eventually make the condition false. If you forgot `saved += 4500`, `saved` would stay 0 and the loop would never end. In Colab, stop a runaway cell with the ■ button next to it.

## break and continue

`break` stops a loop immediately. `continue` skips the rest of this round and moves on to the next item.

The first score below 50:

```python
scores = [67, 81, 44, 72, 45]
for score in scores:
    if score < 50:
        print("First fail:", score)
        break
```

```text
First fail: 44
```

The loop stops at 44 and never looks at 72 or 45.

Skip blank entries:

```python
names = ["Adaeze", "", "Musa", "", "Tobi"]
for name in names:
    if name == "":
        continue
    print("Hello", name)
```

```text
Hello Adaeze
Hello Musa
Hello Tobi
```

## Loops inside loops

A loop can contain another loop. The inner one runs completely for each round of the outer one:

```python
for day in ["Mon", "Tue"]:
    for period in [1, 2, 3]:
        print(day, period)
```

```text
Mon 1
Mon 2
Mon 3
Tue 1
Tue 2
Tue 3
```

## List comprehensions: a loop in one line

Building a new list from an old one is so common that Python has a short form, a **list comprehension**:

```python
scores = [67, 81, 54, 72, 45]
passed = [score for score in scores if score >= 50]
curved = [score + 5 for score in scores]
print(passed)
print(curved)
```

```text
[67, 81, 54, 72]
[72, 86, 59, 77, 50]
```

Read `[score + 5 for score in scores]` as "score + 5, for each score in scores". It does exactly what the append loop does. Use it for simple cases; write the full loop when the logic gets longer.

## When it goes wrong

```python norun
for course in courses
    print(course)
```

```text nocheck
SyntaxError: expected ':'
```

**Missing colon** after the `for` line.

```python norun
for course in courses:
print(course)
```

```text nocheck
IndentationError: expected an indented block after 'for' statement on line 1
```

**Missing indentation** inside the loop.

```python norun
total = 0
for amount in [100, 200, 300]:
    total = 0
    total += amount
print(total)
```

```text nocheck
300
```

**Resetting inside the loop.** `total = 0` belongs **before** the loop. Inside, it wipes the total each time, so only the last amount survives.

## Summary

| You want to... | Write |
| :-- | :-- |
| do something for each item | `for item in items:` |
| repeat n times | `for i in range(n):` |
| a running total | `total = 0` before, `total += x` inside |
| a count | `count = 0` before, `count += 1` inside an `if` |
| the position too | `for i, item in enumerate(items, start=1):` |
| two lists together | `for a, b in zip(list_a, list_b):` |
| repeat until a condition changes | `while condition:` (and change it inside) |
| stop early / skip one | `break` / `continue` |
| a new list in one line | `[x * 2 for x in items if x > 0]` |

## Try it

Use these scores in Colab:

```python
my_scores = [67, 81, 54, 72, 45]
```

```answer
{
  "id": "py-m02-a1",
  "prompt": "Using a loop and a running total (or `sum`), what is the **average** of `my_scores`? One decimal place.",
  "answer": 63.8,
  "format": "number",
  "hint": "total ÷ len(my_scores)",
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
  "prompt": "You save **₦3,000** a week towards **₦25,000**. Using a `while` loop, how many **weeks** until you reach it?",
  "answer": 9,
  "format": "number",
  "hint": "Keep adding 3000 to saved and 1 to weeks while saved < 25000.",
  "pyVerify": "math.ceil(25000 / 3000)",
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
