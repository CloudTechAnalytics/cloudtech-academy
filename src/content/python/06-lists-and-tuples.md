---
title: Lists and Tuples
minutes: 30
summary: Store many values in one variable. Create lists, read items by index and slice, add, change and remove items, sort, search and summarise, copy safely, and when to use a tuple instead.
---

## What a list is

A **list** stores many values, in order, in one variable. Write the items inside **square brackets**, separated by commas:

```python
courses = ["ECO 201", "STA 211", "GST 201"]
scores = [67, 81, 54]
print(courses)
print(scores)
```

```text
['ECO 201', 'STA 211', 'GST 201']
[67, 81, 54]
```

A list can hold any type, even a mix, and can be empty: `[]`. It keeps items in the order you put them in, and can contain the same value more than once.

## Reading items: indexing

Like the characters in a string, list items are numbered from **0**:

```python
courses = ["ECO 201", "STA 211", "GST 201", "CSC 201"]
print(courses[0])
print(courses[1])
print(courses[-1])
print(len(courses))
```

```text
ECO 201
STA 211
CSC 201
4
```

- `[0]` is the first item, `[1]` the second.
- `[-1]` is the last item, `[-2]` the one before.
- `len()` counts the items. The last index is always `len(list) - 1`.

## Reading several items: slicing

`list[start:stop]` gives a new list from `start` up to, but not including, `stop`:

```python
scores = [67, 81, 54, 72, 45, 90]
print(scores[0:3])
print(scores[3:])
print(scores[-2:])
print(scores[::2])
```

```text
[67, 81, 54]
[72, 45, 90]
[45, 90]
[67, 54, 45]
```

The third number in `[::2]` is a **step**: every second item. `[::-1]` reverses a list.

## Changing a list

Unlike strings, lists can be changed after they're made.

### Changing an item

```python
scores = [67, 81, 54]
scores[2] = 58   # a remark raised the third score
print(scores)
```

```text
[67, 81, 58]
```

### Adding items

| Method | Does | Example |
| :-- | :-- | :-- |
| `append(x)` | adds one item to the **end** | `courses.append("MTH 201")` |
| `insert(i, x)` | adds an item **at position i** | `courses.insert(0, "GST 101")` |
| `extend(list)` | adds **every item** of another list | `courses.extend(["A", "B"])` |

```python
courses = ["ECO 201", "STA 211"]
courses.append("CSC 201")
courses.insert(0, "GST 201")
courses.extend(["MTH 201", "ACC 201"])
print(courses)
```

```text
['GST 201', 'ECO 201', 'STA 211', 'CSC 201', 'MTH 201', 'ACC 201']
```

### Removing items

| Method | Removes | Example |
| :-- | :-- | :-- |
| `remove(x)` | the **first item equal to** x | `courses.remove("STA 211")` |
| `pop()` | the **last** item, and gives it back | `last = courses.pop()` |
| `pop(i)` | the item **at position i** | `first = courses.pop(0)` |
| `clear()` | everything | `courses.clear()` |

```python
courses = ["GST 201", "ECO 201", "STA 211", "CSC 201"]
courses.remove("STA 211")
dropped = courses.pop()
print(courses)
print("Dropped:", dropped)
```

```text
['GST 201', 'ECO 201']
Dropped: CSC 201
```

## Searching

```python
courses = ["GST 201", "ECO 201", "STA 211"]
print("ECO 201" in courses)
print("MTH 201" in courses)
print(courses.index("STA 211"))
```

```text
True
False
2
```

`in` answers yes or no; `index()` tells you where. `index()` raises an error if the item isn't there, so check with `in` first when you're not sure. `count(x)` tells you how many times x appears.

## Summarising numbers

Python's built-in functions work on whole lists:

```python
scores = [67, 81, 54, 72, 45]
print(len(scores))
print(sum(scores))
print(min(scores), max(scores))
print(round(sum(scores) / len(scores), 1))
```

```text
5
319
45 81
63.8
```

That last line is the average: total divided by the number of scores.

## Sorting

`sort()` puts a list in order, **changing the list itself**. `sorted()` gives a **new** sorted list and leaves the original alone:

```python
scores = [67, 81, 54, 72, 45]
ranked = sorted(scores, reverse=True)
print(ranked)
print(scores)

scores.sort()
print(scores)
```

```text
[81, 72, 67, 54, 45]
[67, 81, 54, 72, 45]
[45, 54, 67, 72, 81]
```

Text sorts alphabetically, with capitals before lowercase letters. `reverse=True` sorts from largest to smallest, or Z to A.

## Copying a list safely

This catches almost everyone once:

```python
original = [67, 81, 54]
copy = original
copy.append(90)
print(original)
```

```text
[67, 81, 54, 90]
```

`copy = original` doesn't copy the list: it gives the **same list** a second name. Changing it through one name changes it for both. To make a real copy, use `.copy()` or a full slice:

```python
original = [67, 81, 54]
copy = original.copy()
copy.append(90)
print(original)
print(copy)
```

```text
[67, 81, 54]
[67, 81, 54, 90]
```

## Lists inside lists

A list can contain other lists, which is a simple way to store a table:

```python
results = [
    ["Adaeze", 67],
    ["Musa", 81],
    ["Tobi", 54],
]
print(results[1])
print(results[1][0], results[1][1])
```

```text
['Musa', 81]
Musa 81
```

`results[1]` is the second row; `results[1][0]` is the first item in that row.

## Tuples: lists that can't change

A **tuple** is like a list that can't be changed after it's made. Write it with **round brackets**:

```python
location = (6.5244, 3.3792)   # Lagos: latitude, longitude
print(location[0])
print(len(location))
```

```text
6.5244
2
```

Use a tuple for values that belong together and shouldn't change, such as coordinates, or a date as `(year, month, day)`. Trying to change one fails:

```python norun
location[0] = 9.0
```

```text nocheck
TypeError: 'tuple' object does not support item assignment
```

You can **unpack** a tuple (or list) into separate variables:

```python
latitude, longitude = location
print(latitude, longitude)
```

```text
6.5244 3.3792
```

| | List `[ ]` | Tuple `( )` |
| :-- | :-- | :-- |
| Can change after creation | yes | no |
| Typical use | a collection that grows or changes | a fixed group of values |
| Example | the courses you're taking | a GPS location |

## When it goes wrong

```python norun
scores = [67, 81, 54]
print(scores[3])
```

```text nocheck
IndexError: list index out of range
```

**Off by one.** Three items have positions 0, 1 and 2. Use `scores[-1]` for the last one.

```python norun
courses = ["ECO 201", "STA 211"]
courses.remove("MTH 201")
```

```text nocheck
ValueError: list.remove(x): x not in list
```

**Removing something that isn't there.** Check first: `if "MTH 201" in courses: courses.remove("MTH 201")`.

```python norun
scores = [67, 81, 54]
scores = scores.sort()
print(scores)
```

```text nocheck
None
```

**Storing the result of `sort()`.** `sort()` changes the list and returns `None`. Either call `scores.sort()` on its own line, or use `scores = sorted(scores)`.

## Summary

| You want to... | Write |
| :-- | :-- |
| make a list | `items = [a, b, c]` |
| the first / last item | `items[0]` / `items[-1]` |
| part of a list | `items[1:3]` |
| how many | `len(items)` |
| add to the end | `items.append(x)` |
| remove a value | `items.remove(x)` |
| check if it's there | `x in items` |
| total, smallest, largest | `sum(items)`, `min(items)`, `max(items)` |
| a sorted copy | `sorted(items)` (or `reverse=True`) |
| a real copy | `items.copy()` |
| a fixed group | `point = (x, y)` |

## Try it

Use this list in Colab:

```python
my_scores = [67, 81, 54, 72, 45]
```

```answer
{
  "id": "py-m08-a1",
  "prompt": "What is `my_scores[-2]`?",
  "answer": 72,
  "format": "number",
  "pyVerify": "my_scores[-2]",
  "required": true
}
```

```answer
{
  "id": "py-m08-a2",
  "prompt": "What is `sorted(my_scores, reverse=True)[0:3]`? Type the list as Python shows it.",
  "answer": "[81, 72, 67]",
  "format": "text",
  "accept": ["81, 72, 67"],
  "pyVerify": "str(sorted(my_scores, reverse=True)[0:3])",
  "required": true
}
```

```answer
{
  "id": "py-m08-a3",
  "prompt": "If you run `my_scores.append(90)` and then `print(len(my_scores))`, what number is printed?",
  "answer": 6,
  "format": "number",
  "pyVerify": "len(my_scores + [90])",
  "required": true
}
```

```task
{
  "id": "py-m08-t1",
  "prompt": "Make a **shopping list** of at least four items. **Add** two items (one with `append`, one with `insert`), **remove** one you no longer need, **sort** the list, then print how many items there are and the list itself. Paste your code.",
  "minutes": 8,
  "rows": 10,
  "placeholder": "shopping = [\"rice\", ...]",
  "rules": [
    { "label": "A list of at least four text items", "pattern": "=\\s*\\[\\s*[\"'][^\"'\\n]+[\"'](\\s*,\\s*[\"'][^\"'\\n]+[\"']){3,}" },
    { "label": "Uses append", "pattern": "\\.append\\(" },
    { "label": "Uses insert", "pattern": "\\.insert\\(" },
    { "label": "Removes an item (remove or pop)", "pattern": "\\.(remove|pop)\\(" },
    { "label": "Sorts (sort or sorted)", "pattern": "\\.sort\\(|sorted\\(" },
    { "label": "Prints the count with len", "pattern": "len\\(" }
  ],
  "sample": "shopping = [\"rice\", \"beans\", \"plantain\", \"bread\"]\nshopping.append(\"eggs\")\nshopping.insert(0, \"tomatoes\")\nshopping.remove(\"bread\")\nshopping.sort()\nprint(len(shopping), \"items\")\nprint(shopping)",
  "required": true
}
```
