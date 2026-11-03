---
title: Idle and forgotten resources
minutes: 25
summary: Find the resources that cost money while doing nothing (idle servers, unattached disks, unused IP addresses, old snapshots and the disks of stopped servers) and plan their removal safely.
---

## The problem

In the cloud, nothing is ever thrown away by accident. A server created for a load test in 2025 keeps running until someone deletes it. When a server is deleted, its disk can stay behind, still billed every hour. Backups (snapshots) pile up for years.

Nobody at Tallybook did anything wrong on any single day. Forgotten resources are what happens when creating things is easy and nobody's job is to clean up. They're also the easiest savings in any cloud bill, because removing them changes nothing that anyone uses.

## The concept

### Common kinds of waste

| Waste | How to spot it |
| :-- | :-- |
| **Idle servers** | running, but CPU near zero for weeks |
| **Unattached disks** | status "unattached": their server is gone |
| **Stopped servers** | no compute charge, but their disks are still billed |
| **Unused IP addresses** | reserved public IPs attached to nothing are charged |
| **Old snapshots** | backups kept far longer than any policy requires |

### Remove safely

1. Find an owner (tags, names, creation history), and ask.
2. If nobody claims it: **snapshot then delete** for disks; **stop, wait, then delete** for servers.
3. Set a **retention policy** (for example, keep snapshots 90 days), and apply it automatically.

## Example

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/cloud/"
resources = pd.read_csv(base + "resources.csv", parse_dates=["created_date"])
util = pd.read_csv(base + "utilisation.csv")
TODAY = pd.Timestamp("2026-09-01")
HOURS_PER_MONTH = 730

cpu_max = util.groupby("resource_id")["cpu_pct"].max()
resources["cpu_max"] = resources["resource_id"].map(cpu_max)
stopped_ids = resources.loc[(resources["type"] == "vm") & (resources["status"] == "stopped"), "resource_id"]

waste = pd.concat([
    resources[(resources["type"] == "vm") & (resources["cpu_max"] < 5)].assign(reason="idle server"),
    resources[(resources["type"] == "disk") & (resources["status"] == "unattached")].assign(reason="unattached disk"),
    resources[(resources["type"] == "disk") & resources["attached_to"].isin(stopped_ids)].assign(reason="disk of a stopped server"),
    resources[(resources["type"] == "public_ip") & (resources["status"] == "unattached")].assign(reason="unused IP address"),
    resources[(resources["type"] == "snapshot") & (resources["created_date"] < TODAY - pd.Timedelta(days=365))].assign(reason="snapshot over a year old"),
])
waste["monthly_usd"] = waste["hourly_usd"] * HOURS_PER_MONTH
summary = waste.groupby("reason").agg(items=("resource_id", "size"), monthly_usd=("monthly_usd", "sum")).round(2)
print(summary)
print("Total: $", round(waste["monthly_usd"].sum(), 2), "a month")
```

```text
items  monthly_usd
reason
disk of a stopped server      4        35.00
idle server                   3       292.00
snapshot over a year old     20       212.50
unattached disk               8       380.01
unused IP address             3        10.95
Total: $ 930.47 a month
```

The unattached disks cost the most in total, but the idle servers are the most expensive individual resources. Here they are, with what's known about them:

```python
waste.loc[waste["reason"] == "idle server", ["name", "size", "environment", "team", "created_date", "cpu_max", "monthly_usd"]].round(2)
```

```text
name    size  environment team created_date  cpu_max  monthly_usd
62  test-old-migration  xlarge  development  NaN   2025-03-10      0.9        146.0
64       tmp-load-test   large          NaN  NaN   2025-06-02      0.9         73.0
66         poc-reports   large  development  NaN   2025-08-19      0.9         73.0
```

None has a team, and their names suggest one-off projects from 2025. Their CPU never reached 1% in August. They're the clearest candidates for "stop, wait two weeks, delete".

## Walkthrough

1. Run the cells. How many of the wasteful resources have a team tag?
2. Change the snapshot rule to 90 days. How much more would a 90-day retention policy save?
3. Work out the annual saving from removing everything in the summary.
4. Write the clean-up plan (the task below).

## Practice

```answer
{
  "id": "cld-04-p1",
  "prompt": "What is the **total** monthly cost of the waste found, in dollars? Two decimal places.",
  "answer": 930.47,
  "tolerance": 0.01,
  "format": "number",
  "dataset": "cloud",
  "files": ["resources", "utilisation"],
  "pyVerify": "round(waste['monthly_usd'].sum(), 2)",
  "hint": "The Total line.",
  "required": true
}
```

```answer
{
  "id": "cld-04-p2",
  "prompt": "How many **unattached disks** are there?",
  "answer": 8,
  "format": "number",
  "dataset": "cloud",
  "files": ["resources"],
  "pyVerify": "int(summary.loc['unattached disk', 'items'])",
  "hint": "The items column for unattached disk.",
  "required": true
}
```

```task
{
  "id": "cld-04-t1",
  "prompt": "Write the **clean-up plan**, one line per kind of waste starting with a dash: at least **four** lines, each saying how you'll **find the owner** or check it's unused, the **safe removal** step, and at least one **policy** that stops the waste coming back.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "- Idle servers: ...",
  "rules": [
    { "label": "At least four lines, each starting with -", "pattern": "^\\s*-\\s+\\S", "min": 4 },
    { "label": "Covers servers, disks and snapshots", "pattern": "server|vm[\\s\\S]*disk[\\s\\S]*snapshot|snapshot", "min": 1 },
    { "label": "Finds owners (ask, owner, tag, team)", "pattern": "ask|owner|tag|team|announce" },
    { "label": "Safe removal (snapshot first, stop then delete, wait)", "pattern": "snapshot (first|before)|stop[^\\n]*(then|wait|before) delet|wait|two weeks|14 days" },
    { "label": "A policy (retention, required tags, automatic)", "pattern": "retention|policy|automatic|required tag|every (week|month)" }
  ],
  "sample": "- Idle servers: post the list in the engineering channel and ask owners to claim them within a week; stop unclaimed servers, wait two weeks, then delete them.\n- Unattached disks: check no server used them in the last 30 days, take a final snapshot, then delete the disk.\n- Disks of stopped servers: ask the team named in the tag whether the server is still needed; if not, snapshot the disk and delete both.\n- Unused IP addresses: release them the same day; they can't be holding anything.\n- Old snapshots: set a 90-day retention policy that deletes snapshots automatically, except monthly database backups kept for a year.\n- Prevention: require team and environment tags on every new resource, and send a monthly report of untagged and idle resources to each team lead.",
  "note": "The last line is what makes the clean-up permanent: without required tags and a monthly report, the waste grows back.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A server was stopped six months ago. Is it still costing money?",
    "options": ["No", "Yes: its disk is still billed even though the server isn't", "Only its IP", "Only in production"],
    "answer": 1,
    "explanation": "Stopping a server stops compute charges, not storage charges."
  },
  {
    "prompt": "What's the safe way to remove an unclaimed disk?",
    "options": ["Delete it immediately", "Take a final snapshot, then delete the disk", "Leave it forever", "Make it public"],
    "answer": 1,
    "explanation": "A cheap snapshot keeps an undo option."
  },
  {
    "prompt": "What stops forgotten resources coming back?",
    "options": ["A one-off clean-up", "Required ownership tags, retention policies and regular reports", "Bigger servers", "A new region"],
    "answer": 1,
    "explanation": "Prevention is a process, not an event."
  }
]
```
