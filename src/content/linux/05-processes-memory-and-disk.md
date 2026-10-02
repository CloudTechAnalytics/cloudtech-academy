---
title: Processes, memory and disk
minutes: 15
summary: Read process lists to see what a server is busy doing, check disk space with df and du, find what's filling a disk, and know what to do about a process that shouldn't be there.
---

## The problem

During the outage, an engineer logged in to prod-web-01 and saved three snapshots: the running processes (`ps aux --sort=-%cpu`), disk space (`df -h`), and the size of each log folder (`du -sh /var/log/*`). Nobody read them carefully at the time; they were too busy restarting things.

Read them now, and you'll find two problems that had nothing to do with month-end traffic.

## The concept

**Processes**

Every running program is a **process** with an ID (PID), an owner, and a share of CPU and memory. `ps aux` lists them all; `top` (or `htop`) shows them live.

| Column | Meaning |
| :-- | :-- |
| USER | who it runs as |
| PID | process ID, used to stop it |
| %CPU | share of **one** CPU core; on a 4-core server, up to 400% |
| %MEM | share of memory |
| COMMAND | the program and its arguments |

`kill PID` asks a process to stop; `kill -9 PID` forces it. Services are usually managed with `systemctl` (`systemctl restart nginx`).

**Disk**

- `df -h` shows each filesystem's size, used and available space, in human units.
- `du -sh folder/*` shows how big each item in a folder is. `sort -h` sorts human sizes (`48K` < `640M` < `2.9G`).

When a disk fills up, programs can't write logs, databases stop, and uploads fail. Logs that are never **rotated** (compressed and deleted after a while, by `logrotate`) are the classic cause.

## Example

The busiest processes:

```bash
%%bash
curl -sO https://academy.cloudtechanalytics.com/datasets/linux/ps.txt
head -n 6 ps.txt
```

```text
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
backup     48211 187.4  2.1 2459712 345120 ?     Ssl  Aug30 2981:07 /tmp/.x/kdevtmpfsi
tallyb+     1187 61.3 14.2 11834512 2329600 ?    Ssl  Aug28 1873:22 node /srv/tallybook/server.js --port 3000
tallyb+     1188 58.9 13.8 11790336 2263552 ?    Ssl  Aug28 1790:41 node /srv/tallybook/server.js --port 3001
www-data     902  6.2  0.4 156804 68112 ?        S    Aug28 188:12 nginx: worker process
www-data     903  5.8  0.4 156804 67904 ?        S    Aug28 176:55 nginx: worker process
```

The two `node` processes are Tallybook's app, working hard during the outage, as expected. But the top line isn't Tallybook's: a program in a hidden folder in `/tmp`, run by the `backup` user, using 187% CPU, nearly two of the server's four cores, and it's been running since 30 August. `kdevtmpfsi` is the name of a well-known **cryptocurrency miner** that attackers install on servers they break into. On the day traffic doubled, it was taking nearly half the server's processing power.

Total CPU by user:

```bash
%%bash
awk 'NR > 1 {cpu[$1] += $3} END {for (u in cpu) printf "%-10s %6.1f\n", u, cpu[u]}' ps.txt | sort -k2 -rn
```

```text
backup      187.4
tallyb+     120.2
www-data     22.6
root          1.6
syslog        0.3
deploy        0.0
```

Now the disk:

```bash
%%bash
curl -sO https://academy.cloudtechanalytics.com/datasets/linux/df.txt
curl -sO https://academy.cloudtechanalytics.com/datasets/linux/du.txt
cat df.txt
sort -h -r du.txt | head -n 4
```

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/root        30G   18G   12G  61% /
tmpfs           7.8G     0  7.8G   0% /dev/shm
tmpfs           3.1G  1.2M  3.1G   1% /run
/dev/nvme1n1     50G   48G  1.6G  97% /var
/dev/nvme0n1p15 105M  6.1M   99M   6% /boot/efi
36G	/var/log/nginx
2.9G	/var/log/journal
1.1G	/var/log/tallybook
640M	/var/log/node_exporter
```

`/var` is 97% full with 1.6 GB left, and 36 GB of it is nginx's logs. With traffic doubling at month-end, logs grow faster: a few more days and the disk would be full, nginx would fail to write its logs, and the app could stop. The fix is log rotation, which keeps, say, 14 days compressed and deletes the rest.

## Walkthrough

1. Run the cells. How much memory (`%MEM`) do the two node processes use together?
2. Which processes run as `root`? Do any look unexpected?
3. Write the commands you'd run on the real server to stop the miner (`kill`) and to find how it restarts (hint: lesson 1's last lines).
4. Write a `logrotate` rule in words: what to keep, for how long, compressed or not.

## Practice

```answer
{
  "id": "lnx-05-p1",
  "prompt": "What **%CPU** is the miner process using?",
  "answer": 187.4,
  "format": "number",
  "pyVerify": "float([l.split()[2] for l in open('https://academy.cloudtechanalytics.com/datasets/linux/ps.txt', encoding='utf-8') if 'kdevtmpfsi' in l][0])",
  "hint": "The first line after the header in ps.txt.",
  "required": true
}
```

```answer
{
  "id": "lnx-05-p2",
  "prompt": "What **Use%** is the `/var` filesystem at? Give the number.",
  "answer": 97,
  "format": "number",
  "pyVerify": "int([l.split()[4].rstrip('%') for l in open('https://academy.cloudtechanalytics.com/datasets/linux/df.txt', encoding='utf-8') if l.rstrip().endswith('/var')][0])",
  "hint": "The /var line in df.txt.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "On a 4-core server, a process shows 187% CPU. What does that mean?",
    "options": ["An error", "It's using nearly two cores' worth of CPU", "It's using 187% of memory", "It's idle"],
    "answer": 1,
    "explanation": "%CPU is per core, so it can exceed 100%."
  },
  {
    "prompt": "What usually fills a server's disk without anyone noticing?",
    "options": ["The operating system", "Logs that are never rotated", "Processes", "DNS"],
    "answer": 1,
    "explanation": "Rotate and compress logs, and delete old ones."
  },
  {
    "prompt": "You find a miner running. Is killing the process enough?",
    "options": ["Yes", "No: find how it got there and how it restarts, remove that, and treat the server as compromised", "Yes, then reboot", "Only if it comes back"],
    "answer": 1,
    "explanation": "The process is a symptom; the break-in is the problem."
  }
]
```
