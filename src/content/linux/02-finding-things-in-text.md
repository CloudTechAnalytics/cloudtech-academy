---
title: Finding things in text
minutes: 15
summary: Search logs with grep, combine commands with pipes, and count and rank with cut, sort, uniq and wc, to answer questions about a day of web traffic in one line each.
---

## The problem

The access log has over 7,000 lines. Opening it and reading isn't an option, and on a real server the full log for one day has hundreds of thousands. The questions are simple, though: how many requests failed? Which pages were requested most? Was anyone doing something they shouldn't?

Linux tools are built for exactly this. Each does one small job on text, and you join them together with **pipes**.

## The concept

**grep: find lines**

| Command | Finds |
| :-- | :-- |
| `grep "504" access.log` | lines containing 504 |
| `grep -c "504" access.log` | how many lines contain it |
| `grep -v "/health" access.log` | lines **not** containing /health |
| `grep -E "wp-login|phpmyadmin" access.log` | lines matching either (a regular expression) |
| `grep -i "error" file` | ignoring upper and lower case |

Be precise: `grep 504` also matches a response of 504 bytes. Searching for `" 504 "`, with the spaces, is safer.

**Pipes**

`command1 | command2` sends the output of the first into the second. Small tools chain into an answer.

**Counting and ranking**

| Command | Does |
| :-- | :-- |
| `cut -d' ' -f9` | take the 9th space-separated field |
| `sort` | sort lines (`-n` numerically, `-r` reversed) |
| `uniq -c` | count repeated adjacent lines (so `sort` first) |
| `head -n 5` | keep the top 5 |
| `wc -l` | count lines |

The pattern `... | sort | uniq -c | sort -rn | head` ("count and rank") is one of the most useful lines in all of Linux.

## Example

How many requests got each status code? The status is the 9th field when the line is split on spaces:

```bash
%%bash
curl -sO https://academy.cloudtechanalytics.com/datasets/linux/access.log
cut -d' ' -f9 access.log | sort | uniq -c | sort -rn
```

```text
4896 200
    753 201
    649 202
    362 304
    200 504
    132 404
     64 502
     48 403
     37 401
```

Mostly 200 (OK), 201 (created) and 202 (accepted), but also 504 and 502: errors from the server side. Count the 5xx errors exactly:

```bash
%%bash
grep -cE '" 50[0-9] ' access.log
```

```text
264
```

Which addresses sent the most requests?

```bash
%%bash
cut -d' ' -f1 access.log | sort | uniq -c | sort -rn | head -n 5
```

```text
288 10.0.1.5
    201 52.31.139.75
    180 185.220.101.47
    179 52.214.14.220
    162 52.49.173.169
```

10.0.1.5 is the load balancer's health check, and the three 52.x addresses are the payments provider sending notifications. 185.220.101.47 is different. Look at what it asked for:

```bash
%%bash
grep "^185.220.101.47 " access.log | cut -d' ' -f7 | sort | uniq -c | sort -rn
```

```text
40 /wp-login.php
     31 /.env
     25 /phpmyadmin/
     20 /admin
     17 /.git/config
     14 /xmlrpc.php
     12 /config.php
     10 /backup.zip
      7 /server-status
      4 /api/v1/../../etc/passwd
```

WordPress login pages, the `.env` secrets file, git configuration, backups: none of these exist in Tallybook's app. This is an automated **scanner** trying common mistakes on every server it can find. It got only 403 and 404 responses, but the attempt for `.env` is a reminder of why secrets files must never be in a web folder.

## Walkthrough

1. Run the cells. Count how many requests were for `/health`.
2. Find the 10 most requested paths, excluding `/health` and the scanner.
3. Count the 401 responses. Which path returns them?
4. Write a one-line command for "how many requests did the iOS app make?" (the user agent contains `iOS`).

## Practice

```answer
{
  "id": "lnx-02-p1",
  "prompt": "How many requests got a **5xx** status code?",
  "answer": 264,
  "format": "number",
  "pyVerify": "sum(1 for l in open('https://academy.cloudtechanalytics.com/datasets/linux/access.log', encoding='utf-8') if l.split()[8].startswith('5'))",
  "hint": "grep -cE '\" 50[0-9] ' access.log",
  "required": true
}
```

```answer
{
  "id": "lnx-02-p2",
  "prompt": "How many requests did the scanner (185.220.101.47) send?",
  "answer": 180,
  "format": "number",
  "pyVerify": "sum(1 for l in open('https://academy.cloudtechanalytics.com/datasets/linux/access.log', encoding='utf-8') if l.startswith('185.220.101.47 '))",
  "hint": "grep -c \"^185.220.101.47 \" access.log",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why does `sort` come before `uniq -c`?",
    "options": ["It's faster", "uniq only counts identical lines that are next to each other", "uniq needs numbers", "It doesn't matter"],
    "answer": 1,
    "explanation": "Sorting puts identical lines together."
  },
  {
    "prompt": "What does the `|` in `cut -f9 access.log | sort` do?",
    "options": ["Deletes the file", "Sends the output of cut into sort", "Runs both at once on the file", "Saves to a file"],
    "answer": 1,
    "explanation": "Pipes join small tools into one answer."
  },
  {
    "prompt": "Why search for `\" 504 \"` rather than `504`?",
    "options": ["Quotes are required", "504 can also appear in sizes, times or paths; the spaces and quote anchor it to the status field", "It's case-sensitive", "No reason"],
    "answer": 1,
    "explanation": "Be precise about what you match."
  }
]
```
