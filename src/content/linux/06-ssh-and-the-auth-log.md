---
title: SSH and the auth log
minutes: 25
summary: How engineers log in to servers with SSH, why keys beat passwords, and how to read the authentication log to find brute-force attacks, a successful break-in and what the intruder did next.
---

## The problem

Lesson 5 found a cryptocurrency miner running as the user `backup`. Nobody at Tallybook logs in as `backup`: it's an old account for a backup script. So how did someone get in as that user?

Every login attempt to a Linux server is recorded in the **authentication log**. Tallybook's has a week of it.

## The concept

**SSH**

Secure Shell: how engineers log in to remote servers (`ssh deploy@server`). Two ways to prove who you are:

| Method | How | Risk |
| :-- | :-- | :-- |
| **Password** | type a secret | can be guessed by trying many passwords |
| **Key pair** | a private key on your laptop matches a public key on the server | practically impossible to guess |

**Brute-force attacks**

Internet-wide bots try common usernames (`root`, `admin`, `ubuntu`) and passwords on every server with SSH open to the world, all day long. With password login allowed, any account with a weak password is eventually found.

**Hardening SSH**

- Allow keys only (`PasswordAuthentication no`).
- Don't allow `root` to log in (`PermitRootLogin no`).
- Only allow SSH from known networks (a firewall rule, lesson 7).
- Use a tool like **fail2ban** to block addresses after repeated failures.
- Remove accounts that aren't needed.

**The auth log**

Lines like `Failed password for root from 45.155.205.233`, `Accepted publickey for deploy from 10.0.2.15`, plus `sudo` (commands run as root) and `CRON` (scheduled jobs).

## Example

How many failed login attempts, and from where?

```bash
%%bash
curl -sO https://academy.cloudtechanalytics.com/datasets/linux/auth.log
grep -c "Failed password" auth.log
grep "Failed password" auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn
```

```text
2252
    900 45.155.205.233
    600 218.92.0.112
    400 61.177.172.60
    352 194.26.29.120
```

(`$(NF-3)` is the fourth field from the end: the address, in lines ending `from IP port N ssh2`.) Four addresses, over two thousand attempts. Did any get in? List every successful login:

```bash
%%bash
grep "Accepted" auth.log | awk '{print $7, "for", $9, "from", $11}' | sort | uniq -c
```

```text
1 password for backup from 194.26.29.120
      3 publickey for ada from 102.89.34.5
     20 publickey for deploy from 10.0.2.15
```

The deploy system and Ada log in with keys from known addresses. One login is different: a **password** login for `backup`, from 194.26.29.120, one of the attacking addresses. Look at that address's history:

```bash
%%bash
grep "194.26.29.120" auth.log | grep -oE "(Failed|Accepted) password for (invalid user )?[a-z]+" | sed 's/invalid user [a-z]*/an invalid user/' | sort | uniq -c | sort -rn
grep -E "backup" auth.log | grep -v "Failed password" | head -n 5
```

```text
312 Failed password for backup
     40 Failed password for an invalid user
      1 Accepted password for backup
Aug 30 02:14:51 prod-web-01 sshd[23276]: Accepted password for backup from 194.26.29.120 port 50211 ssh2
Aug 30 02:14:51 prod-web-01 sshd[23276]: pam_unix(sshd:session): session opened for user backup(uid=1003) by (uid=0)
Aug 30 02:16:03 prod-web-01 sudo:   backup : user NOT in sudoers ; TTY=pts/0 ; PWD=/home/backup ; USER=root ; COMMAND=/bin/bash
Aug 30 02:21:44 prod-web-01 sshd[23276]: pam_unix(sshd:session): session closed for user backup
Aug 30 02:30:01 prod-web-01 CRON[23277]: (backup) CMD (/tmp/.x/kdevtmpfsi >/dev/null 2>&1)
```

The attacker tried common usernames, then focused on `backup` and kept guessing its password until, on 30 August at 02:14, it worked. They tried to become root with `sudo` and were refused (`backup` isn't allowed). So they settled for what `backup` could do: start a miner, and add a **cron job** that restarts it every ten minutes, which is what you saw at the end of the log in lesson 1.

## Walkthrough

1. Run the cells. On which day did the most failed attempts happen?
2. Count the cron entries for the miner. Since when has it been running?
3. Which accounts did attackers try that actually exist on the server (`Failed password for root` versus `for invalid user`)?
4. Write the response plan (the task below).

## Practice

```answer
{
  "id": "lnx-06-p1",
  "prompt": "How many **failed password** attempts are in the log?",
  "answer": 2252,
  "format": "number",
  "pyVerify": "sum(1 for l in open('https://academy.cloudtechanalytics.com/datasets/linux/auth.log', encoding='utf-8') if 'Failed password' in l)",
  "hint": "The first number printed.",
  "required": true
}
```

```answer
{
  "id": "lnx-06-p2",
  "prompt": "How many times did the attacker at 194.26.29.120 fail before getting in?",
  "answer": 352,
  "format": "number",
  "pyVerify": "sum(1 for l in open('https://academy.cloudtechanalytics.com/datasets/linux/auth.log', encoding='utf-8') if 'Failed password' in l and '194.26.29.120' in l)",
  "hint": "The 194.26.29.120 line in the first output.",
  "required": true
}
```

```task
{
  "id": "lnx-06-t1",
  "prompt": "Write the **response plan** for the break-in on prod-web-01, one numbered step per line: at least **six** steps covering **containing** it, **removing** the miner and its cron job, **closing** the way in, **checking** what else was touched, **rotating** secrets, and **preventing** it happening again.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "1. Take prod-web-01 out of the load balancer ...",
  "rules": [
    { "label": "At least six numbered steps", "pattern": "^\\s*\\d+[.)]\\s+\\S", "min": 6 },
    { "label": "Containment (isolate, take out, block the IP)", "pattern": "isolat|take[^\\n]*out|load balancer|block[^\\n]*194\\.26|firewall" },
    { "label": "Removes the miner and the cron job", "pattern": "cron" },
    { "label": "Closes the way in (disable password login, lock backup)", "pattern": "passwordauthentication|password login|keys only|lock[^\\n]*backup|disable[^\\n]*backup|delete[^\\n]*backup" },
    { "label": "Checks for other changes", "pattern": "check|review|look for|investigat|audit" },
    { "label": "Rotates secrets or keys", "pattern": "rotat|replace[^\\n]*(key|secret|password)|new (key|secret|password)" },
    { "label": "Prevention (SSH only from known networks, fail2ban, rebuild)", "pattern": "fail2ban|known (network|address)|office|rebuild|new server|image" }
  ],
  "sample": "1. Take prod-web-01 out of the load balancer and block 194.26.29.120 and the other attacking addresses in the firewall.\n2. Lock the backup account, kill the kdevtmpfsi process, delete /tmp/.x and remove backup's cron job.\n3. Turn off password login for SSH (PasswordAuthentication no) and allow SSH only from the office and deployment networks.\n4. Check for anything else the intruder changed: other cron jobs, new users, authorized_keys files, and files modified since 30 August 02:14.\n5. Rotate every secret the server could read (.env, the deploy key, database passwords), since backup could read the world-readable files.\n6. Rebuild prod-web-01 from a clean image rather than trusting the cleaned one, then put it back in service.\n7. Add fail2ban, an alert on any password login, and an alert on unknown processes using high CPU.",
  "note": "Step 6 matters most: once someone has run code on a server, you can't be sure you've found everything they changed.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why are SSH keys safer than passwords?",
    "options": ["They're shorter", "A private key is practically impossible to guess, while passwords can be brute-forced", "Keys never expire", "They're free"],
    "answer": 1,
    "explanation": "Brute force only works against guessable secrets."
  },
  {
    "prompt": "The log shows `Accepted password for backup from` an address that failed hundreds of times. What does it mean?",
    "options": ["A normal login", "A successful brute-force attack", "A failed attack", "A cron job"],
    "answer": 1,
    "explanation": "Hundreds of failures then a success is the signature of a guessed password."
  },
  {
    "prompt": "Why rebuild a compromised server instead of cleaning it?",
    "options": ["It's faster", "You can't be sure you've found every change the intruder made", "Cleaning is illegal", "Rebuilding is free"],
    "answer": 1,
    "explanation": "Treat compromised machines as untrustworthy."
  }
]
```
