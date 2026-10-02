---
title: "Final project: what happened on prod-web-01"
minutes: 20
summary: Plan your final project, a full investigation of Tallybook's web server from its logs and command output, with a timeline, findings, fixes and the scripts that would have caught each problem.
---

## The problem

Tallybook's CTO has asked for a written investigation of prod-web-01, the server you've been examining. Investors and an enterprise customer will read the summary. It must say what happened, when, how you know, how serious it is, and what has been and will be done, with every claim backed by a command and its output.

## The concept

**An investigation report**

| Section | Contents | From |
| :-- | :-- | :-- |
| **Timeline** | every event with its time, from the first attack to the outage's end | auth.log, access.log |
| **Findings** | the outage, the break-in, the miner, the disk, permissions, firewall, DNS | lessons 3 to 8 |
| **Evidence** | the command and output behind each finding | every lesson |
| **Severity** | how serious each finding is, and why | your judgement |
| **Fixes** | done now, and to do, with owners | lessons 4 to 8 |
| **Detection** | the check that would have caught each problem | lesson 9 |

**Separate facts from conclusions**

"The log shows a password login for `backup` from 194.26.29.120 at 02:14:51 on 30 August" is a fact. "The attacker installed the miner" is a conclusion, supported by the facts that the miner runs as `backup` and started after that login. Good reports make the difference clear.

## Example

The start of the timeline, built with one command from both logs. Each `awk` prints a sortable timestamp and a short description:

```bash
%%bash
curl -sO https://academy.cloudtechanalytics.com/datasets/linux/auth.log
curl -sO https://academy.cloudtechanalytics.com/datasets/linux/access.log
{
  grep "Failed password" auth.log | awk '!seen[$(NF-3)]++ {print "08-" $2, substr($3, 1, 5), "first ssh failure from", $(NF-3)}'
  grep -E "Accepted password|NOT in sudoers" auth.log | awk '{print "08-" $2, substr($3, 1, 5), $6, $7, $8, $9, $10, $11}'
  grep "kdevtmpfsi" auth.log | head -n 1 | awk '{print "08-" $2, substr($3, 1, 5), "first cron run of the miner"}'
  awk '$9 >= 500 {print "08-31", substr($4, 14, 5), "first server error of the outage"; exit}' access.log
} | sort
```

```text
08-26 01:00 first ssh failure from 45.155.205.233
08-27 14:00 first ssh failure from 218.92.0.112
08-29 23:30 first ssh failure from 194.26.29.120
08-30 02:14 Accepted password for backup from 194.26.29.120
08-30 02:16 backup : user NOT in sudoers
08-30 02:30 first cron run of the miner
08-31 04:00 first ssh failure from 61.177.172.60
08-31 09:40 first server error of the outage
```

Each line is a fact with a time. Add the outage's end, the snapshot times and your conclusions, and the timeline tells the whole story.

## Walkthrough

1. Complete the timeline with the outage's last error and the ps and df snapshots.
2. Write each finding with its evidence (command and output) and severity.
3. Write the list of fixes with owners, and the detection script for each problem.
4. Open the project brief on the course page and plan the write-up.

## Practice

```answer
{
  "id": "lnx-10-p1",
  "prompt": "How many **minutes** passed between the successful break-in (02:14 on 30 August) and the first cron run of the miner (02:30)?",
  "answer": 16,
  "format": "number",
  "pyVerify": "(lambda lines: (lambda a, c: (int(c[:2]) * 60 + int(c[3:5])) - (int(a[:2]) * 60 + int(a[3:5])))([l.split()[2] for l in lines if 'Accepted password' in l][0], [l.split()[2] for l in lines if 'kdevtmpfsi' in l][0]))(open('https://academy.cloudtechanalytics.com/datasets/linux/auth.log', encoding='utf-8').read().splitlines())",
  "hint": "Compare the two times in the timeline.",
  "required": true
}
```

```task
{
  "id": "lnx-10-t1",
  "prompt": "Write the **executive summary** of your investigation (100 to 200 words): **what happened** (the outage and the break-in), **when**, **how serious** it is, what has been **fixed**, what is **still to do**, and how such problems will be **detected** in future. Keep facts and conclusions distinct.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "On 31 August 2026, ...",
  "rules": [
    { "label": "Mentions the outage with times", "pattern": "09:40|10:3[45]|outage" },
    { "label": "Mentions the break-in and the miner", "pattern": "(break-in|broke in|intru|compromis|attacker)[\\s\\S]*(miner|mining|kdevtmpfsi)|(miner|mining|kdevtmpfsi)[\\s\\S]*(break-in|broke in|intru|compromis|attacker)" },
    { "label": "Gives dates", "pattern": "30 august|31 august|august 30|august 31|30 aug|31 aug" },
    { "label": "Severity", "pattern": "serious|severity|high|critical" },
    { "label": "Fixed and still to do", "pattern": "(fixed|done|have|completed)[\\s\\S]*(still|next|will|remaining|to do)" },
    { "label": "Detection in future", "pattern": "detect|alert|monitor|check" },
    { "label": "Between 100 and 200 words", "minWords": 100, "maxWords": 200 }
  ],
  "sample": "On 31 August 2026, Tallybook's app returned errors from 09:40 to 10:34 as month-end traffic overloaded the web servers. Investigating prod-web-01, we found a second, more serious problem. Its log shows over 2,000 failed SSH password attempts from four internet addresses that week, then, at 02:14 on 30 August, a successful password login for an old account called backup. We conclude that an attacker guessed that password: from 02:30 a scheduled job ran a cryptocurrency miner as backup, using nearly half the server's CPU during the outage. We found no evidence they gained administrator access; their attempt was refused. We rate this high severity because the server's secrets were readable by any user. We have isolated the server, removed the account and miner, closed SSH to the internet and rotated every secret; the server will be rebuilt from a clean image this week, and log rotation will be added before /var fills. From now on, automated checks will alert on password logins, unknown busy processes, server errors and disk space within five minutes.",
  "note": "'We conclude' and 'we found no evidence' mark where the summary moves from what the logs show to what you infer.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which is a fact rather than a conclusion?",
    "options": ["The attacker wanted money", "auth.log shows a password login for backup from 194.26.29.120 at 02:14:51 on 30 August", "The attacker was a professional", "The miner caused the outage"],
    "answer": 1,
    "explanation": "Facts come straight from the evidence."
  },
  {
    "prompt": "Why include the command behind each finding?",
    "options": ["To fill space", "So anyone can rerun it and check the finding", "Commands are required by law", "To show off"],
    "answer": 1,
    "explanation": "Reproducible evidence is trustworthy evidence."
  },
  {
    "prompt": "What should a good investigation end with?",
    "options": ["Blame", "Fixes with owners, and checks that would detect the same problems sooner", "A list of tools", "Nothing"],
    "answer": 1,
    "explanation": "Turn the incident into lasting improvements."
  }
]
```
