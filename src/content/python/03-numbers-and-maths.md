---
title: Numbers and Maths
minutes: 35
summary: Do arithmetic in Python: the operators, whole-number division and remainders, the order of operations, rounding, useful built-in functions, the math module and formatting money.
---

## Arithmetic operators

Python is a very good calculator. The operators:

| Operator | Does | Example | Result |
| :-- | :-- | :-- | :-- |
| `+` | add | `7 + 2` | `9` |
| `-` | subtract | `7 - 2` | `5` |
| `*` | multiply | `7 * 2` | `14` |
| `/` | divide | `7 / 2` | `3.5` |
| `//` | divide and drop the remainder | `7 // 2` | `3` |
| `%` | remainder after dividing | `7 % 2` | `1` |
| `**` | to the power of | `7 ** 2` | `49` |

```python
print(7 + 2)
print(7 - 2)
print(7 * 2)
print(7 / 2)
print(7 // 2)
print(7 % 2)
print(7 ** 2)
```

```text
9
5
14
3.5
3
1
49
```

### Division always gives a float

`/` always returns a decimal, even when the answer is whole:

```python
print(10 / 2)
```

```text
5.0
```

That's usually fine. When you need a whole number, use `//` or `int()`.

### Whole-number division and remainder

`//` and `%` answer two everyday questions. You have ₦25,000 and data bundles cost ₦3,500: how many can you buy, and what's left?

```python
money = 25000
bundle = 3500
print(money // bundle)   # how many bundles
print(money % bundle)    # change left over
```

```text
7
500
```

Seven bundles, ₦500 change. `%` is also how you check whether a number is even (`n % 2 == 0`) or turn 130 minutes into hours and minutes:

```python
minutes = 130
print(minutes // 60, "hours and", minutes % 60, "minutes")
```

```text
2 hours and 10 minutes
```

## The order of operations

Python follows the same order as maths: brackets first, then powers, then `*` `/` `//` `%`, then `+` `-`. When operators have the same rank, it works left to right.

```python
print(2 + 3 * 4)
print((2 + 3) * 4)
```

```text
14
20
```

In the first line, `3 * 4` happens first. Brackets change the order. When in doubt, add brackets: they cost nothing and make your intent clear.

A practical example. Your scores are 67, 81 and 54. The average needs brackets round the sum:

```python
print(67 + 81 + 54 / 3)
print((67 + 81 + 54) / 3)
```

```text
166.0
67.33333333333333
```

The first is wrong: only 54 was divided by 3.

## Rounding

`round(number, places)` rounds to a number of decimal places. With no places, it rounds to a whole number:

```python
average = (67 + 81 + 54) / 3
print(round(average, 2))
print(round(average))
```

```text
67.33
67
```

> [!NOTE]
> Python rounds exact halves to the nearest **even** number: `round(2.5)` is `2` and `round(3.5)` is `4`. This "banker's rounding" avoids bias when rounding many numbers. If you need halves always to round up, for money for example, the `decimal` module does that; you'll meet it in later courses.

### Why 0.1 + 0.2 isn't exactly 0.3

```python
print(0.1 + 0.2)
```

```text
0.30000000000000004
```

Computers store decimals in binary, and some decimals, like 0.1, can't be stored exactly, just as 1/3 can't be written exactly as a decimal. The error is tiny, but it shows up. Round when you display results, and never test decimals with `==`.

## Useful built-in functions

| Function | Returns | Example | Result |
| :-- | :-- | :-- | :-- |
| `abs(x)` | the value without its sign | `abs(-500)` | `500` |
| `min(a, b, ...)` | the smallest | `min(67, 81, 54)` | `54` |
| `max(a, b, ...)` | the largest | `max(67, 81, 54)` | `81` |
| `round(x, n)` | x rounded to n places | `round(3.14159, 2)` | `3.14` |
| `pow(x, y)` | x to the power y | `pow(2, 10)` | `1024` |

```python
print(abs(-500))
print(min(67, 81, 54), max(67, 81, 54))
```

```text
500
54 81
```

## The math module

More maths lives in the `math` **module**, a collection of extra tools you **import** before using:

```python
import math

print(math.sqrt(144))
print(math.ceil(4.1))
print(math.floor(4.9))
print(math.pi)
```

```text
12.0
5
4
3.141592653589793
```

`math.ceil` rounds **up** and `math.floor` rounds **down**, whatever the decimal. That's handy for "how many buses do we need?": 130 students at 18 seats a bus needs `math.ceil(130 / 18)`, which is 8, not 7.2.

```python
import math

students = 130
seats = 18
print(math.ceil(students / seats))
```

```text
8
```

## Working with money

### Percentages

A percentage is just multiplication by a fraction. 7.5% VAT on ₦40,000:

```python
price = 40000
vat_rate = 7.5
vat = price * vat_rate / 100
print(vat)
print(price + vat)
```

```text
3000.0
43000.0
```

A 15% discount, and what share one amount is of another:

```python
print(40000 * (1 - 15 / 100))
print(round(12500 / 60000 * 100, 1))
```

```text
34000.0
20.8
```

So ₦12,500 is 20.8% of ₦60,000.

### Formatting numbers for people

Long numbers are hard to read. Inside an f-string, add a **format** after a colon:

| Format | Does | Example | Shows |
| :-- | :-- | :-- | :-- |
| `:,` | thousands separators | `f"{1234567:,}"` | `1,234,567` |
| `:.2f` | two decimal places | `f"{3.14159:.2f}"` | `3.14` |
| `:,.0f` | separators, no decimals | `f"{43000.0:,.0f}"` | `43,000` |
| `:.1%` | as a percentage | `f"{0.208:.1%}"` | `20.8%` |

```python
total = 43000.0
print(f"Total: ₦{total:,.0f}")
print(f"Share: {12500 / 60000:.1%}")
```

```text
Total: ₦43,000
Share: 20.8%
```

## When it goes wrong

```python norun
print(100 / 0)
```

```text nocheck
ZeroDivisionError: division by zero
```

Dividing by zero is impossible, and Python stops. Check the divisor first, for example `if count > 0:`, when it could be zero.

```python norun
print("100" * 2 + 50)
```

```text nocheck
TypeError: can only concatenate str (not "int") to str
```

`"100"` is text, so `"100" * 2` is `"100100"`, and text plus a number fails. Convert first: `int("100") * 2 + 50`.

## Summary

| You want... | Write |
| :-- | :-- |
| a division with decimals | `a / b` |
| how many whole times | `a // b` |
| what's left over | `a % b` |
| a power | `a ** b` |
| a rounded result | `round(x, 2)` |
| round up / down | `math.ceil(x)` / `math.floor(x)` |
| a percentage of a value | `value * rate / 100` |
| money for people | `f"₦{amount:,.0f}"` |

## Try it

```answer
{
  "id": "py-m05-a1",
  "prompt": "You have **₦25,000**. Data bundles cost **₦3,500** each. Using `%`, how much **change** is left after buying as many bundles as you can?",
  "answer": 500,
  "format": "naira",
  "pyVerify": "25000 % 3500",
  "required": true
}
```

```answer
{
  "id": "py-m05-a2",
  "prompt": "What does `2 + 3 * 4 ** 2` give? Work it out, then check in Colab.",
  "answer": 50,
  "format": "number",
  "hint": "Powers first, then multiplication, then addition.",
  "pyVerify": "2 + 3 * 4 ** 2",
  "required": true
}
```

```answer
{
  "id": "py-m05-a3",
  "prompt": "A trip needs seats for **130** students. Each bus holds **18**. How many buses do you need? Use `math.ceil`.",
  "answer": 8,
  "format": "number",
  "pyVerify": "math.ceil(130 / 18)",
  "required": true
}
```

```task
{
  "id": "py-m05-t1",
  "prompt": "Write a small **shopping calculator**: store a price and a quantity, work out the subtotal, add **7.5% VAT**, and print the subtotal, VAT and total as naira with **thousands separators** using f-strings. Run it, then paste your code.",
  "minutes": 8,
  "rows": 10,
  "placeholder": "price = ...\nquantity = ...",
  "rules": [
    { "label": "A price and a quantity in variables", "pattern": "^\\s*\\w+\\s*=\\s*\\d", "min": 2 },
    { "label": "Multiplies them", "pattern": "\\w+\\s*\\*\\s*\\w+" },
    { "label": "Works out 7.5% VAT", "pattern": "7\\.5|0\\.075" },
    { "label": "Prints with f-strings", "pattern": "print\\(\\s*f[\"']", "min": 2 },
    { "label": "Formats with thousands separators", "pattern": "\\{[^}]*:,[^}]*\\}" }
  ],
  "sample": "price = 8500\nquantity = 3\nsubtotal = price * quantity\nvat = subtotal * 7.5 / 100\ntotal = subtotal + vat\nprint(f\"Subtotal: ₦{subtotal:,.0f}\")\nprint(f\"VAT (7.5%): ₦{vat:,.0f}\")\nprint(f\"Total: ₦{total:,.0f}\")",
  "required": true
}
```
