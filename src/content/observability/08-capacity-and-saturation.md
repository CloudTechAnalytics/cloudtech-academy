---
title: Capacity and saturation
minutes: 25
summary: Use Little's law to work out how many database connections a workload needs, see exactly when Tallybook's pool ran out, and size the pool and the bulk job so month-end can't do it again.
---

## The problem

Ada fixed the incident by doubling the database connection pool and slowing the bulk job. It worked, but was it the right fix, or a lucky guess? Next month-end, traffic will be higher. Before then, Tallybook needs to know how many connections the work really needs, and how much headroom is enough.

## The concept

**Little's law**

For any system that work flows through:

> average items in the system = arrival rate × average time each item spends there

For a connection pool: **connections in use = requests per second × seconds each request holds a connection**. 133 API requests a second, each holding a connection for 0.3 seconds, need about 40 connections at once.

**Saturation**

When demand exceeds what a resource can serve, work queues. Waiting time doesn't grow gently: it grows without limit until something times out. That's why the incident went from fine to failing within a minute.

**Headroom and isolation**

- Size for the peak plus headroom (for example, peak demand at most 70% of capacity).
- **Isolate** batch work from user traffic: give background jobs their own, smaller pool, so they can only slow themselves down.
- Remember the other end: a bigger pool means more connections at the database, which has its own limit.

## Example

Demand for connections, minute by minute, from Little's law:

```python
import pandas as pd

pool = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/observability/db_pool.csv", parse_dates=["minute"]).set_index("minute")
pool["demand"] = pool["api_requests"] / 60 * pool["db_ms_per_request"] / 1000
pool["saturated"] = pool["demand"] > pool["pool_size"]

print("Peak demand before 09:40:", round(pool.loc[:"2026-08-31 09:39", "demand"].max(), 1), "connections (pool 40)")
print("Peak demand during the incident:", round(pool.loc["2026-08-31 09:40":"2026-08-31 10:33", "demand"].max(), 1))
print("Minutes saturated:", int(pool["saturated"].sum()))
pool.loc["2026-08-31 09:36":"2026-08-31 09:44", ["api_requests", "db_ms_per_request", "demand", "pool_size", "connections_in_use", "wait_p95_ms"]].round(1)
```

```text
Peak demand before 09:40: 34.9 connections (pool 40)
Peak demand during the incident: 56.9
Minutes saturated: 54
                     api_requests  db_ms_per_request  demand  pool_size  connections_in_use  wait_p95_ms
minute
2026-08-31 09:36:00          8490                243    34.4         40                  34            7
2026-08-31 09:37:00          8305                240    33.2         40                  33            3
2026-08-31 09:38:00          8090                235    31.7         40                  32            3
2026-08-31 09:39:00          8053                234    31.4         40                  31            4
2026-08-31 09:40:00          8514                393    55.8         40                  40        16112
2026-08-31 09:41:00          8280                385    53.1         40                  40        14192
2026-08-31 09:42:00          8752                390    56.9         40                  40        16646
2026-08-31 09:43:00          8272                391    53.9         40                  40        15140
2026-08-31 09:44:00          8032                392    52.5         40                  40        13572
```

Before the job started, peak demand was already close to 90% of the pool: running hot every month-end morning. The bulk job added about 150 ms to every request's database time (its own queries compete for the same database), and demand jumped past 40 in the very minute it started. Now size the pool for next month-end, assuming traffic grows 20% and keeping demand under 70% of the pool:

```python
GROWTH, MAX_USE = 1.2, 0.7
without_job = pool.loc[:"2026-08-31 09:39", "demand"].max() * GROWTH
with_job = pool.loc["2026-08-31 09:40":"2026-08-31 10:33", "demand"].max() * GROWTH
print(f"Pool needed, bulk job isolated: {without_job / MAX_USE:.0f} connections")
print(f"Pool needed, bulk job sharing the pool: {with_job / MAX_USE:.0f} connections")
```

```text
Pool needed, bulk job isolated: 60 connections
Pool needed, bulk job sharing the pool: 98 connections
```

Isolating the job keeps the API's pool moderate. Letting the job share the pool would need far more connections, and the database itself might not accept that many.

## Walkthrough

1. Run the cells. Use Little's law by hand for one minute at 10:00 and check it against the table.
2. After the fix at 10:34, what's the pool's utilisation? Is 80 too many?
3. How many invoices per minute could the bulk job send with 4 concurrent workers, if each send takes 0.6 seconds?
4. Write the capacity plan (the task below).

## Practice

```answer
{
  "id": "obs-08-p1",
  "prompt": "What was the **peak connection demand during the incident**? One decimal place.",
  "answer": 56.9,
  "format": "number",
  "dataset": "observability",
  "files": ["db_pool"],
  "pyVerify": "round(pool.loc['2026-08-31 09:40':'2026-08-31 10:33', 'demand'].max(), 1)",
  "hint": "The second line printed.",
  "required": true
}
```

```task
{
  "id": "obs-08-t1",
  "prompt": "Write the **month-end capacity plan**, one numbered step per line: at least **four** steps covering the **API pool size** (with a number and how you got it), **isolating** the bulk job, the job's **schedule or rate**, and a **saturation alert**.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "1. Set the API pool to ...",
  "rules": [
    { "label": "At least four numbered steps", "pattern": "^\\s*\\d+[.)]\\s+\\S", "min": 4 },
    { "label": "A pool size number", "pattern": "pool[^\\n]*\\b\\d{2,3}\\b" },
    { "label": "Explains the sizing (Little's law, demand, headroom, 70%)", "pattern": "little|demand|headroom|70\\s*%" },
    { "label": "Isolates the bulk job (own pool, separate)", "pattern": "own pool|separate pool|isolat|dedicated" },
    { "label": "Schedules or limits the job (night, rate, concurrency)", "pattern": "night|off-peak|overnight|rate|concurren|limit" },
    { "label": "A saturation alert or dashboard", "pattern": "alert|ticket|dashboard" }
  ],
  "sample": "1. Set the API's pool to 60 connections: peak demand before the job was about 35, so with 20% growth (about 42) at no more than 70% use we need about 60.\n2. Give the bulk send job its own pool of 8 connections, so it can only ever slow itself down.\n3. Run the bulk job from 01:00 on month-end days with 4 concurrent sends, finishing before the morning rush.\n4. Add a ticket when pool utilisation passes 70% for 10 minutes, and show it on the API dashboard.\n5. Check the database's own connection limit can take both pools plus the admin connections.",
  "note": "Step 2 is the real fix: isolation turns a shared failure into a slow batch job.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "200 requests per second, each holding a connection for 0.1 s. How many connections are in use on average?",
    "options": ["2", "20", "200", "2,000"],
    "answer": 1,
    "explanation": "Little's law: 200 × 0.1."
  },
  {
    "prompt": "What happens to waiting time when demand exceeds a pool's size?",
    "options": ["It grows slowly", "It grows without limit until requests time out", "It stays the same", "It falls"],
    "answer": 1,
    "explanation": "Saturation turns into queues and timeouts."
  },
  {
    "prompt": "Why give a background job its own connection pool?",
    "options": ["It's faster", "So it can't starve user requests of connections", "Jobs need more", "To save money"],
    "answer": 1,
    "explanation": "Isolation contains the damage."
  }
]
```
