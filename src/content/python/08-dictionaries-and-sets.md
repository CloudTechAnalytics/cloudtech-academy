---
title: Dictionaries and Sets
minutes: 30
summary: Store values by name with dictionaries: create, read safely with get, add, change and remove, loop through keys, values and items, count things, and nest data. Then sets for unique values.
---

## What a dictionary is

A list finds values by **position**: `scores[0]`. That's awkward when the values have names. Is the student's department `student[1]` or `student[2]`? A **dictionary** stores **key: value** pairs, so you look values up by name, like a word in a real dictionary.

Write it with **curly brackets**, a colon between each key and its value, and commas between pairs:

```python
student = {
    "name": "Musa",
    "department": "Accounting",
    "level": 300,
    "cgpa": 3.9,
}
print(student)
```

```text
{'name': 'Musa', 'department': 'Accounting', 'level': 300, 'cgpa': 3.9}
```

- **Keys** are usually text, and each key appears only once.
- **Values** can be anything: text, numbers, lists, even other dictionaries.
- Dictionaries keep the order you added things in.

## Reading values

Put the key in square brackets:

```python
print(student["name"])
print(student["level"])
```

```text
Musa
300
```

If the key doesn't exist, that's an error. `get()` is the safe way: it returns `None`, or a default you choose, instead:

```python
print(student.get("cgpa"))
print(student.get("hall"))
print(student.get("hall", "Not assigned"))
```

```text
3.9
None
Not assigned
```

Check whether a key exists with `in`:

```python
print("level" in student)
print("hall" in student)
```

```text
True
False
```

## Adding, changing and removing

Assigning to a key **adds** it if it's new and **changes** it if it exists:

```python
student["hall"] = "Jaja"       # new key: added
student["level"] = 400         # existing key: changed
print(student)
```

```text
{'name': 'Musa', 'department': 'Accounting', 'level': 400, 'cgpa': 3.9, 'hall': 'Jaja'}
```

| You want to... | Write |
| :-- | :-- |
| add or change one | `d["key"] = value` |
| add or change several | `d.update({"a": 1, "b": 2})` |
| remove one and get its value | `value = d.pop("key")` |
| remove one | `del d["key"]` |
| empty it | `d.clear()` |

```python
student.update({"cgpa": 4.0, "phone": "0803 000 0000"})
removed = student.pop("phone")
print(student)
print("Removed:", removed)
```

```text
{'name': 'Musa', 'department': 'Accounting', 'level': 400, 'cgpa': 4.0, 'hall': 'Jaja'}
Removed: 0803 000 0000
```

## Looping through a dictionary

Three methods give you the parts:

| Method | Gives |
| :-- | :-- |
| `.keys()` | the keys |
| `.values()` | the values |
| `.items()` | key and value pairs |

```python
spending = {"Food": 28000, "Transport": 12500, "Data": 6000}

for item in spending.keys():
    print(item)

print(sum(spending.values()))

for item, amount in spending.items():
    print(f"{item}: ₦{amount:,}")
```

```text
Food
Transport
Data
46500
Food: ₦28,000
Transport: ₦12,500
Data: ₦6,000
```

`.items()` is the one you'll use most: each round gives you the key and its value, unpacked into two variables. (Looping over the dictionary itself, `for item in spending:`, gives the keys.)

## Finding the largest

`max` on a dictionary compares **keys** by default. To find the key with the largest **value**, tell it to compare using `spending.get`:

```python
print(max(spending, key=spending.get))
print(max(spending.values()))
```

```text
Food
28000
```

## Counting with a dictionary

A very common job: count how often each value appears. Start with an empty dictionary and add 1 for each item, using `get` with a default of 0 for keys you haven't seen yet:

```python
departments = ["Accounting", "Economics", "Accounting", "Law", "Economics", "Accounting"]
counts = {}
for dept in departments:
    counts[dept] = counts.get(dept, 0) + 1
print(counts)
```

```text
{'Accounting': 3, 'Economics': 2, 'Law': 1}
```

The first time Python sees "Accounting", `counts.get("Accounting", 0)` gives 0, so it becomes 1. Next time it gives 1, so it becomes 2, and so on.

## Nested data

Values can be lists or other dictionaries. That's how real data is often shaped, for example data from websites and apps:

```python
student = {
    "name": "Adaeze",
    "courses": ["ECO 201", "STA 211"],
    "address": {"city": "Ibadan", "state": "Oyo"},
}
print(student["courses"][0])
print(student["address"]["city"])
```

```text
ECO 201
Ibadan
```

Read it from left to right: `student["address"]` is the inner dictionary, and `["city"]` looks inside that.

A **list of dictionaries** is a natural way to store a table, one dictionary per row:

```python
students = [
    {"name": "Adaeze", "level": 200},
    {"name": "Musa", "level": 300},
    {"name": "Tobi", "level": 200},
]
for s in students:
    if s["level"] == 200:
        print(s["name"])
```

```text
Adaeze
Tobi
```

## Sets: unique values

A **set** is a collection with **no duplicates** and no particular order. Write it with curly brackets (but no colons), or make one from a list with `set()`:

```python
cities = ["Lagos", "Abuja", "Lagos", "Kano", "Abuja"]
unique = set(cities)
print(len(unique))
print("Kano" in unique)
```

```text
3
True
```

Duplicates disappear, so `len(set(items))` counts distinct values. Sets also compare groups. Students taking each of two courses:

```python
eco = {"Adaeze", "Musa", "Tobi"}
sta = {"Musa", "Tobi", "Chidi"}
print(sorted(eco & sta))   # in both
print(sorted(eco | sta))   # in either
print(sorted(eco - sta))   # in ECO but not STA
```

```text
['Musa', 'Tobi']
['Adaeze', 'Chidi', 'Musa', 'Tobi']
['Adaeze']
```

(`sorted` turns each set into an ordered list, so the output is always the same.)

| Collection | Brackets | Ordered | Duplicates | Look up by |
| :-- | :-- | :-- | :-- | :-- |
| list | `[ ]` | yes | allowed | position |
| tuple | `( )` | yes | allowed | position (can't change) |
| dictionary | `{key: value}` | yes | keys unique | key |
| set | `{ }` | no | not allowed | membership (`in`) |

## When it goes wrong

```python norun
print(student["Name"])
```

```text nocheck
KeyError: 'Name'
```

**A key that isn't there.** Keys must match exactly, capitals included. Use `student.get("Name", "unknown")` when a key might be missing.

```python norun
empty = {}
print(type(empty))
```

```text nocheck
<class 'dict'>
```

**`{}` is an empty dictionary, not a set.** Make an empty set with `set()`.

```python norun
for item, amount in spending:
    print(item, amount)
```

```text nocheck
ValueError: too many values to unpack (expected 2)
```

**Forgetting `.items()`.** Looping over a dictionary gives only the keys; add `.items()` to get pairs.

## Summary

| You want to... | Write |
| :-- | :-- |
| make a dictionary | `d = {"key": value, ...}` |
| read a value | `d["key"]` |
| read safely | `d.get("key", default)` |
| add or change | `d["key"] = value` |
| remove | `d.pop("key")` |
| loop through pairs | `for k, v in d.items():` |
| total of values | `sum(d.values())` |
| key with the largest value | `max(d, key=d.get)` |
| count things | `counts[x] = counts.get(x, 0) + 1` |
| distinct values | `set(items)` |

## Try it

```answer
{
  "id": "py-m09-a1",
  "prompt": "`prices = {\"rice\": 52000, \"beans\": 38000, \"garri\": 15000}`. What is `sum(prices.values())`?",
  "answer": 105000,
  "format": "number",
  "pyVerify": "sum({'rice': 52000, 'beans': 38000, 'garri': 15000}.values())",
  "required": true
}
```

```answer
{
  "id": "py-m09-a2",
  "prompt": "Using the `prices` dictionary above, what does `prices.get(\"yam\", 0)` give?",
  "answer": 0,
  "format": "number",
  "pyVerify": "{'rice': 52000, 'beans': 38000, 'garri': 15000}.get('yam', 0)",
  "required": true
}
```

```answer
{
  "id": "py-m09-a3",
  "prompt": "How many distinct cities are in `[\"Lagos\", \"Abuja\", \"Lagos\", \"Kano\", \"Ibadan\", \"Abuja\"]`?",
  "answer": 4,
  "format": "number",
  "pyVerify": "len(set(['Lagos', 'Abuja', 'Lagos', 'Kano', 'Ibadan', 'Abuja']))",
  "required": true
}
```

```task
{
  "id": "py-m09-t1",
  "prompt": "Write a **vote counter**: start with a list of at least eight votes for three candidates (names as text), count them into a dictionary with a loop and `get`, print each candidate's votes with `.items()`, and print the **winner** using `max` with `key=`. Paste your code.",
  "minutes": 10,
  "rows": 12,
  "placeholder": "votes = [\"Ada\", \"Musa\", ...]\ncounts = {}",
  "rules": [
    { "label": "A list of at least eight votes", "pattern": "=\\s*\\[\\s*[\"'][^\"'\\n]+[\"'](\\s*,\\s*[\"'][^\"'\\n]+[\"']){7,}" },
    { "label": "Starts an empty dictionary", "pattern": "=\\s*\\{\\s*\\}" },
    { "label": "A for loop over the votes", "pattern": "^\\s*for\\s+\\w+\\s+in\\s+\\w+\\s*:" },
    { "label": "Counts with get(..., 0) + 1", "pattern": "\\.get\\([^)]*,\\s*0\\s*\\)\\s*\\+\\s*1" },
    { "label": "Loops through .items()", "pattern": "\\.items\\(\\)" },
    { "label": "Finds the winner with max(..., key=...)", "pattern": "max\\([^)]*key\\s*=" }
  ],
  "sample": "votes = [\"Ada\", \"Musa\", \"Ada\", \"Tobi\", \"Ada\", \"Musa\", \"Tobi\", \"Ada\"]\ncounts = {}\nfor vote in votes:\n    counts[vote] = counts.get(vote, 0) + 1\n\nfor name, total in counts.items():\n    print(f\"{name}: {total}\")\n\nwinner = max(counts, key=counts.get)\nprint(f\"Winner: {winner}\")",
  "required": true
}
```
