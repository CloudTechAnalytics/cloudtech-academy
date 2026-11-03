---
title: Arrays, objects and formatting
minutes: 10
summary: Work with lists of records the way web pages do (objects, arrays, map, filter, reduce and sort), find a customer's overdue invoices, and format money and dates for Nigerian users with Intl.
---

## The problem

When a customer opens the portal, the page receives their invoices from the API as **JSON**: a list of objects. It has to show the unpaid ones, most urgent first, mark which are overdue, total what's owed, and format every amount and date the way Nigerian users expect. That's most of what front-end code does: reshape data for people.

## The concept

### Objects and arrays

```js norun
const invoice = { id: "INV-100357", dueDate: "2026-08-03", totalKobo: 4250458, paidKobo: 0 };
const invoices = [invoice, /* ... */];
invoice.totalKobo;                 // read a property
```

### Array methods

| Method | Returns |
| :-- | :-- |
| `filter(fn)` | the items where `fn` is true |
| `map(fn)` | a new array with `fn` applied to each item |
| `reduce(fn, start)` | one value built from all items (a sum) |
| `toSorted(fn)` | a sorted copy (`sort` sorts in place) |
| `find(fn)` | the first matching item |

![Four example invoices: filter drops the two fully paid ones, map turns the other two into balances of 100,000 and 80,000 kobo, reduce adds them to 180,000 kobo, and Intl formats it as ₦1,800.00](/images/courses/webjs/filter-map-reduce.svg "filter, map, reduce, then format: four invoices to one amount owed.")

### Intl

`Intl.NumberFormat` and `Intl.DateTimeFormat` format numbers, currencies and dates for a locale, such as `en-NG`.

### JSON

`JSON.parse(text)` turns API text into objects; `JSON.stringify(value)` turns objects into text.

## Example

A customer's invoices, as the API might send them:

```js
const json = `[
  {"id": "INV-100357", "dueDate": "2026-08-03", "totalKobo": 4250458, "paidKobo": 0},
  {"id": "INV-100760", "dueDate": "2026-08-27", "totalKobo": 1161518, "paidKobo": 1161518},
  {"id": "INV-100832", "dueDate": "2026-09-12", "totalKobo": 2783050, "paidKobo": 1000000},
  {"id": "INV-101104", "dueDate": "2026-09-30", "totalKobo": 645000, "paidKobo": 0}
]`;
const invoices = JSON.parse(json);
const today = "2026-09-15";

const unpaid = invoices
  .map((inv) => ({ ...inv, balanceKobo: inv.totalKobo - inv.paidKobo, overdue: inv.dueDate < today }))
  .filter((inv) => inv.balanceKobo > 0)
  .toSorted((a, b) => a.dueDate.localeCompare(b.dueDate));

const owed = unpaid.reduce((sum, inv) => sum + inv.balanceKobo, 0);
console.log(unpaid.map((inv) => `${inv.id} ${inv.overdue ? "OVERDUE" : "due"} ${inv.balanceKobo}`).join("\n"));
console.log("Total owed (kobo):", owed);
```

```text
INV-100357 OVERDUE 4250458
INV-100832 OVERDUE 1783050
INV-101104 due 645000
Total owed (kobo): 6678508
```

ISO dates (`YYYY-MM-DD`) compare correctly as text, which is why `inv.dueDate < today` works. Now format for people:

```js
const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" });
const longDate = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

for (const inv of unpaid) {
  const due = longDate.format(new Date(inv.dueDate + "T00:00:00Z"));
  console.log(`${inv.id}: ${naira.format(inv.balanceKobo / 100)} ${inv.overdue ? "overdue since" : "due"} ${due}`);
}
console.log("You owe", naira.format(owed / 100));
```

```text
INV-100357: ₦42,504.58 overdue since 3 August 2026
INV-100832: ₦17,830.50 overdue since 12 September 2026
INV-101104: ₦6,450.00 due 30 September 2026
You owe ₦66,785.08
```

Dividing by 100 only at the moment of display is fine: the money arithmetic was already done exactly in kobo.

## Walkthrough

1. Run the blocks in your console. Change `today` to `"2026-09-20"`. Which invoices become overdue?
2. Use `find` to get INV-100832, and print how much has been paid on it.
3. Why does the code use `toSorted` rather than `sort`?
4. Count the overdue invoices with `filter(...).length`.

## Practice

```answer
{
  "id": "web-03-p1",
  "prompt": "How much does the customer owe in total, in kobo?",
  "answer": 6678508,
  "format": "number",
  "jsVerify": "owed",
  "hint": "The 'Total owed' line.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which array method keeps only the items that match a condition?",
    "options": ["map", "filter", "reduce", "join"],
    "answer": 1,
    "explanation": "map transforms; reduce combines."
  },
  {
    "prompt": "Why can ISO dates like 2026-09-15 be compared as text?",
    "options": ["They can't", "Year, month and day are in order with fixed widths, so text order is date order", "JavaScript converts them", "Only in Chrome"],
    "answer": 1,
    "explanation": "One reason to keep dates in ISO format."
  },
  {
    "prompt": "What does Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }) do?",
    "options": ["Converts currencies", "Formats numbers as naira the way Nigerian users expect", "Rounds money", "Validates input"],
    "answer": 1,
    "explanation": "Formatting, not calculation."
  }
]
```
