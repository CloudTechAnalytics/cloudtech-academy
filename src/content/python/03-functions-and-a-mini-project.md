---
title: Functions and a Mini Project
minutes: 25
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

## When it goes wrong

```python norun
def total_cost(price, quantity):
    price * quantity

print(total_cost(500, 4))
```

```text nocheck
None
```

**Forgetting `return`.** The function calculated the value and then threw it away. Without `return`, a function gives back `None`. Add `return price * quantity`.

```python norun
print(student["Name"])
```

```text nocheck
KeyError: 'Name'
```

**A key that isn't there.** Dictionary keys must match exactly, capitals included: the key is `"name"`. Use `student.get("Name", "unknown")` when a key might be missing.

## Show it off

Save your notebook, then in Colab choose **File → Save a copy in GitHub** to put it in a repository (see the Git & GitHub course). It's a small but real project for your portfolio.

## Try it

Run the budget tracker as it is in the lesson, then answer these about **its** numbers.

```answer
{
  "id": "py-m03-a1",
  "prompt": "How much money is **left** from the ₦60,000 budget?",
  "answer": 4000,
  "format": "naira",
  "pyVerify": "budget - sum(spending.values())",
  "required": true
}
```

```answer
{
  "id": "py-m03-a2",
  "prompt": "What **percentage** of total spending goes on **Food**? One decimal place.",
  "answer": 50,
  "format": "percent",
  "pyVerify": "round(spending['Food'] / sum(spending.values()) * 100, 1)",
  "required": true
}
```

```task
{
  "id": "py-m03-t1",
  "prompt": "Extend the tracker with your own month's numbers. Add a function `biggest(spending)` that **returns** the item you spend most on, print it, and print a **warning** for any item over 40% of the total. Run it, then paste your code.",
  "minutes": 12,
  "rows": 16,
  "placeholder": "budget = ...\nspending = {...}\n\ndef biggest(spending):\n    ...",
  "rules": [
    { "label": "A spending dictionary with at least four items", "pattern": "[\"'][^\"'\\n]+[\"']\\s*:\\s*\\d", "min": 4 },
    { "label": "A function called biggest", "pattern": "^\\s*def\\s+biggest\\s*\\(" },
    { "label": "It returns a value", "pattern": "^\\s+return\\s+\\S" },
    { "label": "It finds the largest item (max with key=, or a loop)", "pattern": "max\\([^)]*key\\s*=|for\\s+\\w+(\\s*,\\s*\\w+)?\\s+in\\s+\\w+" },
    { "label": "Loops through items with .items()", "pattern": "\\.items\\(\\)" },
    { "label": "Checks for more than 40%", "pattern": "(>|>=)\\s*(40|0\\.4)\\b" },
    { "label": "Prints a warning", "pattern": "print\\([^\\n]*(warn|over|high|careful|too much|more than|above)" }
  ],
  "sample": "budget = 75000\nspending = {\n    \"Food\": 31000,\n    \"Transport\": 15000,\n    \"Data\": 7000,\n    \"Books\": 6000,\n    \"Other\": 9000,\n}\n\ndef biggest(spending):\n    return max(spending, key=spending.get)\n\ntotal = sum(spending.values())\nprint(f\"You spend most on {biggest(spending)}.\")\nfor item, amount in spending.items():\n    share = amount / total * 100\n    if share > 40:\n        print(f\"Warning: {item} is {share:.0f}% of your spending.\")",
  "required": true
}
```

Then save your notebook with **File → Save a copy in GitHub** (or to Drive), and add a short text cell at the top describing what it does.
