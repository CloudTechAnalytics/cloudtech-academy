---
title: Why infrastructure as code
minutes: 15
summary: What infrastructure as code is and the problems it solves, how Terraform records what it manages, and how much of Tallybook's cloud was created by hand and forgotten.
---

## The problem

In the cloud course, Tallybook found idle servers, disks attached to nothing and firewall rules nobody could explain. In the Linux course, one of those rules (SSH open to the whole internet, "temporary, for the 2025 migration") let attackers in. Every one of these was created by someone clicking in the cloud console. There was no record of who made it, why, or whether it was still needed.

Part of Tallybook's infrastructure is managed differently: written as code with **Terraform**, reviewed in pull requests, and applied by a pipeline. This course teaches you to work that way, and to review infrastructure changes safely, using Tallybook's real Terraform files.

## The concept

**ClickOps and its problems**

Changing infrastructure by hand in a console ("ClickOps") is quick once, and costly forever:

- no record of who changed what, or why;
- no review before a change;
- environments drift apart (staging stops matching production);
- rebuilding after a disaster depends on memory.

**Infrastructure as code (IaC)**

Infrastructure is described in text files, kept in git, changed through reviewed pull requests, and applied by a tool. **Terraform** is the most widely used. You write what you want, for example "four API servers of this size", and Terraform works out what to create, change or delete to get there.

**State**

Terraform keeps a **state file** recording every resource it manages and its last known settings. Anything that isn't in the state is invisible to Terraform: it won't change it, review it, or delete it.

## Example

Tallybook's state file is JSON. Load it, and list what Terraform manages:

```python
import json
from urllib.request import urlopen

import pandas as pd

def load(url):
    with urlopen(url) as f:
        return json.load(f)

state = load("https://academy.cloudtechanalytics.com/datasets/terraform/terraform.tfstate")
managed = pd.DataFrame([
    {"address": f"{r['type']}.{r['name']}", "type": r["type"], "id": inst["attributes"]["id"]}
    for r in state["resources"] for inst in r["instances"]
])
print("Terraform manages", len(managed), "resources")
managed["type"].value_counts()
```

```text
Terraform manages 37 resources
type
aws_instance               19
aws_security_group_rule    10
aws_s3_bucket               4
aws_lb                      2
aws_db_instance             2
Name: count, dtype: int64
```

Now compare with everything that's really in the cloud account, from the cloud course's inventory. Resource IDs link the two:

```python
inventory = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/cloud/resources.csv")
main_types = inventory[inventory["type"].isin(["vm", "database", "load_balancer", "bucket"])].copy()
main_types["in_terraform"] = main_types["resource_id"].isin(managed["id"])
print(pd.crosstab(main_types["type"], main_types["in_terraform"]))

unmanaged = main_types[~main_types["in_terraform"]]
print("Monthly cost of running servers Terraform doesn't know about: $",
      round(unmanaged.loc[unmanaged["status"] == "running", "hourly_usd"].sum() * 730, 2))
```

```text
in_terraform   False  True
type
bucket             2      4
database           0      2
load_balancer      0      2
vm                19     19
Monthly cost of running servers Terraform doesn't know about: $ 876.0
```

Every database and load balancer is in Terraform. But half the servers aren't, and among them are the development machines, the idle "test" servers and the stopped ones from the cloud course. The public bucket of customer files isn't either. The resources nobody manages as code are exactly the ones that were forgotten.

## Walkthrough

1. Run the cells. List the names of the unmanaged servers and buckets. Which teams made them?
2. Find the ID of `prod-db` in the inventory and check it's in the state.
3. Open the state file in a text editor (download it from the URL). What else is in it besides resources?
4. Write down three changes from the cloud and Linux courses that would have been caught by a pull request review.

## Practice

```answer
{
  "id": "iac-01-p1",
  "prompt": "How many resources does Terraform manage (resource instances in the state)?",
  "answer": 37,
  "format": "number",
  "pyVerify": "len(managed)",
  "hint": "The first line printed.",
  "required": true
}
```

```answer
{
  "id": "iac-01-p2",
  "prompt": "How many **servers (VMs)** in the cloud account are **not** in Terraform?",
  "answer": 19,
  "format": "number",
  "pyVerify": "int(((main_types['type'] == 'vm') & ~main_types['in_terraform']).sum())",
  "hint": "The vm row, False column.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does Terraform's state file record?",
    "options": ["Every resource in the cloud account", "The resources Terraform manages and their last known settings", "Only passwords", "The bill"],
    "answer": 1,
    "explanation": "Anything outside the state is invisible to Terraform."
  },
  {
    "prompt": "A server created by hand in the console. What does Terraform do with it?",
    "options": ["Deletes it", "Nothing: it doesn't know it exists", "Adds it automatically", "Resizes it"],
    "answer": 1,
    "explanation": "Unmanaged resources are outside Terraform's view."
  },
  {
    "prompt": "What's the main benefit of changing infrastructure through reviewed pull requests?",
    "options": ["It's faster", "Every change is recorded, reviewed and repeatable", "It's free", "No one needs access"],
    "answer": 1,
    "explanation": "Review and history are what ClickOps lacks."
  }
]
```
