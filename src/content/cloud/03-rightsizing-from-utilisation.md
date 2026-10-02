---
title: Rightsizing from utilisation
minutes: 25
summary: Use hourly CPU and memory data to find servers that are far bigger than they need to be, choose a safe smaller size with a rule based on peak use, and work out the saving.
---

## The problem

When Tallybook built its API, an engineer chose the "xlarge" server size: 8 processors and 32 GB of memory each, four of them. Nobody has looked since. Servers that are bigger than their work needs cost money every hour, and in the cloud, changing size takes minutes.

But shrinking servers carelessly is how outages happen. The decision needs data: how busy each server really is, including at its busiest.

## The concept

**Utilisation**

The share of a server's CPU and memory in use, measured every few minutes by the provider's monitoring. Tallybook has hourly averages for every running VM in August.

**Use peaks, not averages**

A server at 15% average CPU might hit 90% for an hour every day. Size for the **95th percentile** (p95): the level it stays under 95% of the time. For critical systems, check the true maximum too.

**A rightsizing rule**

For example: if p95 CPU is under 30% **and** p95 memory is under 40%, move down one size (which halves CPU and memory). After the change, p95 CPU would be roughly double, still under 60%, leaving headroom.

**Size isn't the only fix**

Servers that are busy only in office hours are better **scheduled** (lesson 5) than shrunk; servers doing nothing at all should be **removed** (lesson 4).

## Example

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/cloud/"
resources = pd.read_csv(base + "resources.csv")
util = pd.read_csv(base + "utilisation.csv")

stats = util.groupby("resource_id").agg(
    cpu_avg=("cpu_pct", "mean"),
    cpu_p95=("cpu_pct", lambda x: x.quantile(0.95)),
    mem_p95=("memory_pct", lambda x: x.quantile(0.95)),
).round(1)
vms = resources[resources["type"] == "vm"].merge(stats, on="resource_id")
print(vms[["name", "environment", "size", "hourly_usd", "cpu_avg", "cpu_p95", "mem_p95"]].sort_values("cpu_p95").to_string(index=False))
```

```text
name environment   size  hourly_usd  cpu_avg  cpu_p95  mem_p95
 test-old-migration development xlarge        0.20      0.6      0.9      7.9
      tmp-load-test         NaN  large        0.10      0.6      0.9      7.9
        poc-reports development  large        0.10      0.6      0.9      7.9
     staging-api-03     staging medium        0.05      5.0      6.8     21.8
  staging-worker-05     staging medium        0.05      5.0      6.8     21.8
staging-db-tools-06     staging medium        0.05      5.0      6.8     21.8
     staging-web-02     staging medium        0.05      5.0      6.8     21.8
     staging-web-01     staging medium        0.05      5.0      6.8     21.8
     staging-api-04     staging medium        0.05      5.0      6.8     21.8
        prod-api-02  production xlarge        0.20     15.9     28.6     34.8
        prod-api-03  production xlarge        0.20     16.0     28.6     34.8
        prod-api-01  production xlarge        0.20     16.1     28.8     34.8
        prod-api-04  production xlarge        0.20     15.9     29.0     34.8
          dev-tunde development medium        0.05      9.2     31.9     46.8
           dev-kemi development medium        0.05      8.8     32.2     46.5
           dev-femi development medium        0.05      8.9     32.5     47.5
            dev-obi development  large        0.10      8.9     32.6     46.0
         dev-zainab development  large        0.10      8.8     32.6     47.6
          dev-ngozi development  large        0.10      9.0     32.7     46.9
           dev-dapo development  large        0.10      8.9     32.8     46.2
           dev-musa development medium        0.05      9.1     32.9     46.6
         dev-ifeoma development medium        0.05      8.9     33.2     46.0
           dev-sade development medium        0.05      9.1     33.2     46.4
            dev-ada development medium        0.05      9.1     33.6     46.3
           dev-uche development medium        0.05      9.2     33.6     45.8
        prod-web-03  production  large        0.10     23.4     50.9     57.7
        prod-web-02  production  large        0.10     23.3     51.4     57.7
        prod-web-06  production  large        0.10     23.5     51.5     57.7
        prod-web-01  production  large        0.10     23.4     51.6     57.3
        prod-web-04  production  large        0.10     23.3     52.1     57.7
        prod-web-05  production  large        0.10     23.4     52.4     57.6
     prod-worker-03  production  large        0.10     33.7     56.1     61.2
     prod-worker-02  production  large        0.10     34.0     56.2     61.4
     prod-worker-01  production  large        0.10     33.9     56.6     61.7
```

Look at the groups: the web and worker servers are well used at their peaks; the API servers peak below 30% CPU; staging servers barely work at all; three servers are almost completely idle (lesson 4). Now apply the rule, leaving out idle servers:

```python
DOWN = {"xlarge": "large", "large": "medium", "medium": "small"}
PRICE = {"small": 0.025, "medium": 0.05, "large": 0.10, "xlarge": 0.20}   # illustrative, $ per hour
HOURS_PER_MONTH = 730

candidates = vms[(vms["cpu_p95"] < 30) & (vms["mem_p95"] < 40) & (vms["cpu_p95"] >= 2)].copy()
candidates["new_size"] = candidates["size"].map(DOWN)
candidates["monthly_saving_usd"] = (candidates["hourly_usd"] - candidates["new_size"].map(PRICE)) * HOURS_PER_MONTH
print(candidates[["name", "size", "new_size", "cpu_p95", "mem_p95", "monthly_saving_usd"]].to_string(index=False))
print("Total monthly saving: $", round(candidates["monthly_saving_usd"].sum(), 2))
```

```text
name   size new_size  cpu_p95  mem_p95  monthly_saving_usd
        prod-api-01 xlarge    large     28.8     34.8               73.00
        prod-api-02 xlarge    large     28.6     34.8               73.00
        prod-api-03 xlarge    large     28.6     34.8               73.00
        prod-api-04 xlarge    large     29.0     34.8               73.00
     staging-web-01 medium    small      6.8     21.8               18.25
     staging-web-02 medium    small      6.8     21.8               18.25
     staging-api-03 medium    small      6.8     21.8               18.25
     staging-api-04 medium    small      6.8     21.8               18.25
  staging-worker-05 medium    small      6.8     21.8               18.25
staging-db-tools-06 medium    small      6.8     21.8               18.25
Total monthly saving: $ 401.5
```

Halving the API servers saves the most, because they're the largest. The development servers don't qualify: they're busy in office hours, and their problem is the nights and weekends.

## Walkthrough

1. Run the cells. Check the API servers' **maximum** CPU, not just p95. Is the new size still safe?
2. Plot one API server's CPU over a week. When is it busiest?
3. Why does the rule check memory as well as CPU? Find a case where only memory would prevent a downsizing.
4. Write the change plan (the task below).

## Practice

```answer
{
  "id": "cld-03-p1",
  "prompt": "What is the **total monthly saving** from the rightsizing rule, in dollars? Two decimal places.",
  "answer": 401.5,
  "tolerance": 0.01,
  "format": "number",
  "dataset": "cloud",
  "files": ["resources", "utilisation"],
  "pyVerify": "round(candidates['monthly_saving_usd'].sum(), 2)",
  "hint": "The last line printed.",
  "required": true
}
```

```task
{
  "id": "cld-03-t1",
  "prompt": "Write the **change plan** for downsizing the API servers, one step per numbered line: at least **five** steps covering **when** (time of day), doing it **gradually**, what to **monitor**, the **rollback** trigger, and when to **review**.",
  "minutes": 6,
  "rows": 7,
  "placeholder": "1. Change one API server first ...",
  "rules": [
    { "label": "At least five numbered steps", "pattern": "^\\s*\\d+[.)]\\s+\\S", "min": 5 },
    { "label": "When (night, quiet, off-peak, weekend)", "pattern": "night|quiet|off[- ]peak|weekend|low(est)? traffic|traffic is lowest|early morning|\\b[1-5] ?am\\b" },
    { "label": "Gradually (one server, one at a time)", "pattern": "one (server|at a time)|first server|gradual|one by one" },
    { "label": "What to monitor (CPU, latency, errors)", "pattern": "cpu|latency|error|response time" },
    { "label": "A rollback trigger", "pattern": "roll ?back|revert|change back|size back" },
    { "label": "A review", "pattern": "review|check again|after (a|one) (week|month)" }
  ],
  "sample": "1. Change one API server from xlarge to large at 2am on a weekday, when traffic is lowest.\n2. Watch its CPU, memory, API latency and error rate for 48 hours, comparing it with the three unchanged servers.\n3. If its p95 CPU goes above 70% or latency rises by more than 20%, roll back to xlarge straight away.\n4. If it's healthy, change the other three servers one at a time, a day apart.\n5. Review the API servers' utilisation after the next month-end, the busiest days, and again in three months.",
  "note": "Changing one server first means a mistake affects a quarter of the API, briefly, at the quietest hour.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why size servers on p95 CPU rather than average CPU?",
    "options": ["p95 is cheaper", "Averages hide daily peaks; p95 shows how busy the server gets at its busiest times", "Providers require it", "Averages are always higher"],
    "answer": 1,
    "explanation": "Size for the peak you actually reach."
  },
  {
    "prompt": "Development servers are busy 9 to 5 and idle at night. What's the best fix?",
    "options": ["Make them smaller", "Schedule them to stop outside working hours", "Make them bigger", "Delete them"],
    "answer": 1,
    "explanation": "The waste is the idle hours, not the size."
  },
  {
    "prompt": "Moving down one size usually does what to CPU and memory?",
    "options": ["Nothing", "Halves them, so utilisation roughly doubles", "Doubles them", "Removes memory"],
    "answer": 1,
    "explanation": "Check the doubled peak still leaves headroom."
  }
]
```
