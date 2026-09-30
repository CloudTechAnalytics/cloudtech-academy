---
title: Functions and a Mini Project
minutes: 30
summary: Write your own functions, use dictionaries, and put it all together in a small budget tracker you can show in your portfolio.
---

## Functions

A **function** is a named block of code you can reuse. Define it with `def`:

```python
def grade(score):
    if score >= 70:
        return "A"
    elif score >= 60:
        return "B"
    elif score >= 50:
        return "C"
    return "F"

print(grade(74))  # A
print(grade(48))  # F
```

- `score` is a **parameter**: the input the function works with.
- `return` sends a result back.
- Write a function once and call it as many times as you like.

## Dictionaries

A **dictionary** stores **key: value** pairs, like a label and its value:

```python
student = {
    "name": "Musa",
    "department": "Accounting",
    "level": 300,
}

print(student["name"])
student["cgpa"] = 3.9   # add a new key
```

Loop through one with `.items()`:

```python
for key, value in student.items():
    print(key, "→", value)
```

## Mini project: a monthly budget tracker

Put it all together. Copy this into Colab and run it:

```python
budget = 60000

spending = {
    "Food": 28000,
    "Transport": 12500,
    "Data": 6000,
    "Books": 4500,
    "Other": 5000,
}

def naira(amount):
    return f"₦{amount:,.0f}"

total = sum(spending.values())
left = budget - total

print("Monthly spending")
for item, amount in spending.items():
    share = amount / total * 100
    print(f"{item:<10} {naira(amount):>10}  {share:4.1f}%")

print("-" * 30)
print(f"{'Total':<10} {naira(total):>10}")

if left >= 0:
    print(f"You have {naira(left)} left.")
else:
    print(f"You are over budget by {naira(-left)}.")
```

Read it line by line. You've seen every piece: variables, a dictionary, a function, a loop, maths, f-strings and an if statement.

> [!TIP]
> `{item:<10}` pads text to 10 characters, aligned left; `>10` aligns right. It makes simple tables line up.

## Show it off

Save your notebook, then in Colab choose **File → Save a copy in GitHub** to put it in a repository (see the Git & GitHub course). It's a small but real project for your portfolio.

## Try it

1. Change the budget and spending to match your own month.
2. Add a function `biggest(spending)` that returns the item you spend most on. Hint: `max(spending, key=spending.get)`.
3. Print a warning for any item over 40% of your total.
4. Save the notebook to GitHub or Drive and add a short description at the top in a text cell.
