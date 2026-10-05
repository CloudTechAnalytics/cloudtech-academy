---
title: The command line
minutes: 10
summary: What the Linux shell is, how to run commands in Google Colab, and the first commands every engineer uses to look at files on a server: downloading, listing, counting and reading the start and end of files.
---

## The problem

On the morning of 31 August 2026, Tallybook's app slowed to a crawl during month-end invoicing. Most of the internet runs on Linux servers, and when something goes wrong on one, there's no friendly dashboard on the server itself: there's a terminal, a shell prompt, and files. Logs, configuration and the state of the machine are all text, read and searched with commands.

In this course you investigate what happened on Tallybook's web server, prod-web-01, using its real-looking logs and command output. Along the way you learn the commands, file permissions, processes, networking, DNS and SSH that every cloud and DevOps engineer relies on, and you'll find more than a slow morning.

## The concept

### The shell

A program that reads commands you type and runs them. On most Linux servers it's **bash**. A command is a program name followed by **arguments**:

```bash norun
wc -l access.log
```

`wc` is the program (word count), `-l` is an **option** (count lines), and `access.log` is the file.

### Running commands in Google Colab

Colab notebooks run on a Linux machine. Start a cell with `%%bash` and the whole cell runs as shell commands. Files you download stay in the notebook's folder (`/content`) until the session ends. Every shell example in this course is written as a Colab cell, ready to paste.

### First commands

| Command | What it does |
| :-- | :-- |
| `pwd` | print the folder you're in |
| `ls -l` | list files, with sizes and permissions |
| `curl -sO URL` | download a file, keeping its name (`-s` silent, `-O` save) |
| `wc -l file` | count lines |
| `head -n 5 file` | show the first 5 lines |
| `tail -n 5 file` | show the last 5 lines |
| `cat file` | print a whole (small) file |

On a real server, `less file` lets you scroll through big files; `tail -f file` follows a log as new lines arrive.

## Example

Download the server's files into your Colab session:

```bash
%%bash
for f in access.log auth.log ps.txt df.txt du.txt ls.txt firewall.csv tallybook.example.zone; do
  curl -sO https://academy.cloudtechanalytics.com/datasets/linux/$f
done
ls
```

```text
access.log
auth.log
df.txt
du.txt
firewall.csv
ls.txt
ps.txt
tallybook.example.zone
```

How big is each log, in lines?

```bash
%%bash
wc -l access.log auth.log
```

```text
7141 access.log
   2618 auth.log
   9759 total
```

The access log records every web request the server answered on 31 August (a 1% sample, to keep it small). Each line is one request. Look at the first two:

```bash
%%bash
head -n 2 access.log
```

```text
10.0.1.5 - - [31/Aug/2026:00:00:02 +0000] "GET /health HTTP/1.1" 200 15 "-" "ELB-HealthChecker/2.0" 0.004
102.67.233.152 - - [31/Aug/2026:00:02:44 +0000] "GET /api/invoices HTTP/1.1" 200 6118 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/127.0" 0.235
```

Read the first line from left to right: the client's IP address, the time, the request (`GET /health`), the status code (200 means OK), the size of the response in bytes, the client's software, and, at the end, how long the server took, in seconds. That first request is the load balancer checking the server is alive. Now the end of the authentication log:

```bash
%%bash
tail -n 3 auth.log
```

```text
Aug 31 23:30:01 prod-web-01 CRON[23547]: (backup) CMD (/tmp/.x/kdevtmpfsi >/dev/null 2>&1)
Aug 31 23:40:01 prod-web-01 CRON[23548]: (backup) CMD (/tmp/.x/kdevtmpfsi >/dev/null 2>&1)
Aug 31 23:50:01 prod-web-01 CRON[23549]: (backup) CMD (/tmp/.x/kdevtmpfsi >/dev/null 2>&1)
```

Those lines say the scheduler, cron, is running a program called `kdevtmpfsi` from a hidden folder in `/tmp`, as the user `backup`, every ten minutes. Hold that thought: lesson 6 finds out how it got there.

## Walkthrough

1. Open a new Colab notebook and run the download cell. Run `ls -l` to see the file sizes.
2. Use `head` and `tail` on each `.txt` file. What does each one seem to contain?
3. Run `cat df.txt`. What do you think `97%` next to `/var` means?
4. Run `tail -n 20 access.log`. What time does the log end?

## Practice

```answer
{
  "id": "lnx-01-p1",
  "prompt": "How many lines are there in **auth.log**?",
  "answer": 2618,
  "format": "number",
  "pyVerify": "sum(1 for _ in open('https://academy.cloudtechanalytics.com/datasets/linux/auth.log', encoding='utf-8'))",
  "hint": "wc -l auth.log",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "In the command `head -n 5 access.log`, what is `-n 5`?",
    "options": ["The file name", "An option: show 5 lines", "The program", "A comment"],
    "answer": 1,
    "explanation": "Options change how a program behaves."
  },
  {
    "prompt": "How do you run shell commands in a Colab cell?",
    "options": ["Write them in a markdown cell", "Start the cell with %%bash", "Use Python print()", "You can't"],
    "answer": 1,
    "explanation": "%%bash runs the whole cell as shell commands."
  },
  {
    "prompt": "Which command shows the newest lines of a log, where the latest events are?",
    "options": ["head", "tail", "pwd", "ls"],
    "answer": 1,
    "explanation": "Logs grow at the end; tail shows the end."
  }
]
```
