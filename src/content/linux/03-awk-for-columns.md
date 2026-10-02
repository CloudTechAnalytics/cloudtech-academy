---
title: awk for columns
minutes: 15
summary: Use awk to filter rows by a column's value, add up and average columns, and count by time, and rebuild the timeline of the month-end outage from the access log.
---

## The problem

Tallybook's status page said the app was down for 55 minutes on the morning of 31 August. The engineering lead wants to confirm it from the server's own log: when did errors start, when did they stop, how slow were requests during the outage compared with normal, and which parts of the app were hit?

`grep` finds lines; it can't compare numbers or add them up. **awk** can.

## The concept

**awk** reads a file line by line, splits each line into fields (`$1`, `$2`, ... and `$NF` for the last), and runs a small program on each.

| Program | Does |
| :-- | :-- |
| `awk '{print $1, $9}' file` | print fields 1 and 9 |
| `awk '$9 >= 500' file` | print lines where field 9 is at least 500 |
| `awk '{s += $NF} END {print s/NR}' file` | average of the last field (`NR` is the number of lines) |
| `awk '$9 >= 500 {n++} END {print n}' file` | count matching lines |
| `awk '{c[$9]++} END {for (k in c) print k, c[k]}' file` | count by value (pipe to `sort` for a stable order) |

`substr(s, start, length)` takes part of a field. In the access log, `$4` looks like `[31/Aug/2026:09:41:07`, so `substr($4, 14, 5)` is the hour and minute, `09:41`.

## Example

When were the first and last server errors?

```bash
%%bash
curl -sO https://academy.cloudtechanalytics.com/datasets/linux/access.log
awk '$9 >= 500 {print substr($4, 14, 5)}' access.log | sort -u | sed -n '1p;$p'
```

```text
09:40
10:34
```

(`sort -u` sorts and removes duplicates; `sed -n '1p;$p'` prints the first and last lines.) Errors per 10 minutes through the morning, using the first four characters of the time (`09:4` covers 09:40 to 09:49):

```bash
%%bash
awk '$9 >= 500 {print substr($4, 14, 4) "0"}' access.log | sort | uniq -c
```

```text
39 09:40
     58 09:50
     38 10:00
     54 10:10
     45 10:20
     30 10:30
```

The errors are confined to 09:40 to 10:34: the log confirms the status page. How slow were requests during that window, compared with the rest of the day? The last field is the response time in seconds:

```bash
%%bash
awk '{t = substr($4, 14, 5)
      if (t >= "09:40" && t < "10:35") {o += $NF; on++} else {n += $NF; nn++}}
     END {printf "outage: %d requests, average %.2f s\nrest of day: %d requests, average %.2f s\n", on, o/on, nn, n/nn}' access.log
```

```text
outage: 558 requests, average 12.90 s
rest of day: 6583 requests, average 0.23 s
```

Averages hide a lot here: many requests during the outage waited the full 30 seconds before nginx gave up with a 504 (gateway timeout), while others failed instantly with a 502 (bad gateway). Finally, which parts of the app were hit?

```bash
%%bash
awk '$9 >= 500 {print $7}' access.log | sed 's/INV-[0-9]*/INV-.../' | sort | uniq -c | sort -rn
```

```text
68 /api/invoices
     35 /api/invoices/send
     33 /api/dashboard
     28 /pay/INV-...
     28 /api/login
     27 /api/payments/webhook
     25 /api/customers
     17 /
      3 /health
```

Every part of the API failed, and so did some of the load balancer's health checks, which is why it marked servers unhealthy. Static files (the JavaScript and stylesheet) don't appear: nginx serves them itself without asking the overloaded app.

## Walkthrough

1. Run the cells. Count 504s and 502s separately during the outage.
2. Find the slowest 5 requests of the day: `sort -k` on the last field, or `awk '{print $NF, $7}' | sort -rn | head -5`.
3. Count requests per hour for the whole day. When was traffic highest?
4. Calculate the share of `POST /api/invoices/send` requests that failed during the outage.

## Practice

```answer
{
  "id": "lnx-03-p1",
  "prompt": "How many requests got a **504** status in the whole log?",
  "answer": 200,
  "format": "number",
  "pyVerify": "sum(1 for l in open('https://academy.cloudtechanalytics.com/datasets/linux/access.log', encoding='utf-8') if l.split()[8] == '504')",
  "hint": "awk '$9 == 504' access.log | wc -l",
  "required": true
}
```

```answer
{
  "id": "lnx-03-p2",
  "prompt": "What was the **average response time**, in seconds, for requests **outside** the outage window? Two decimal places.",
  "answer": 0.23,
  "tolerance": 0.006,
  "format": "number",
  "pyVerify": "(lambda rows: round(sum(rows) / len(rows), 2))([float(l.split()[-1]) for l in open('https://academy.cloudtechanalytics.com/datasets/linux/access.log', encoding='utf-8') if not ('09:40' <= l.split()[3][13:18] < '10:35')])",
  "hint": "The rest of day line.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "In awk, what is `$NF`?",
    "options": ["The first field", "The last field on the line", "The number of lines", "The file name"],
    "answer": 1,
    "explanation": "NF is the number of fields, so $NF is the last one."
  },
  {
    "prompt": "What does `awk '$9 >= 500' access.log` print?",
    "options": ["Lines 500 onwards", "Lines whose 9th field is at least 500", "The first 500 lines", "Field 500"],
    "answer": 1,
    "explanation": "A condition with no action prints matching lines."
  },
  {
    "prompt": "Why didn't static files fail during the outage?",
    "options": ["They're cached by customers", "nginx serves them directly, without the overloaded app", "They weren't requested", "They're on another server"],
    "answer": 1,
    "explanation": "Only requests passed to the app timed out or failed."
  }
]
```
