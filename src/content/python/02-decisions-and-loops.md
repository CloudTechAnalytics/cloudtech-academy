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

## Try it

1. Make a list of your scores in five courses (real or made up).
2. Loop through them and print a grade for each using if, elif and else.
3. Print the average score: `sum(scores) / len(scores)`.
4. Count how many scores are 70 or above. Hint: start with `count = 0` and add 1 inside the loop.
