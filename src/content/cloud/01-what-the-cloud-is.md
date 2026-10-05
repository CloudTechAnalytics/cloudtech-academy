---
title: What the cloud is
minutes: 15
summary: What cloud computing actually is (renting computers, storage and services by the hour), the service models and regions, who is responsible for what, and a first look at a real company's cloud estate.
---

## The problem

Tallybook is a Lagos start-up whose app lets small businesses send invoices and get paid. It has no server room. Everything runs on a public cloud provider: the servers, the database, the file storage, the network.

The finance director has two worries. The cloud bill, paid in dollars, has grown every month, and nobody can explain exactly why. And at the end of August, on the busiest invoicing days of the month, the app slowed to a crawl for nearly an hour, twice. This course is the review Tallybook needs: what it's running, what it's paying for, what it's wasting, and what it would take to make it reliable.

## The concept

**Cloud computing** means renting computing resources from a provider, paying for what you use, usually by the hour or second, instead of buying hardware.

### Service models

| Model | You rent | You manage | Example at Tallybook |
| :-- | :-- | :-- | :-- |
| **IaaS** (infrastructure) | virtual machines, disks, networks | operating system, software, data | the web and API servers |
| **PaaS** (platform) | a managed service | your data and settings | the managed database |
| **SaaS** (software) | finished software | your users and data | email, accounting software |

### Regions and zones

A **region** is a geographic area (Tallybook uses Cape Town, the closest to Lagos). Each region has several **availability zones**: separate data centres with their own power and networking. Spreading across zones protects against one failing (lesson 7).

### Shared responsibility

The provider secures the buildings, hardware and its own services. **You** are responsible for what you put on them: who has access, which data is public, software updates on your servers, and your settings. Most cloud breaches are customer misconfigurations, not provider failures.

![A grid of seven layers, from buildings and power up to your data and users, against four models. On your own servers you manage every layer; with IaaS the provider manages the virtual machines and below; with PaaS also the operating system and runtime; with SaaS everything except your data and users.](/images/courses/cloud/service-models.svg "Who manages what: the provider takes on more as you move from IaaS to SaaS.")

### Elasticity

The big promise: resources can grow and shrink with demand, and you stop paying when you stop using them. That only helps if you actually use it (lessons 4 to 6).

## Example

Tallybook's inventory of cloud resources:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/cloud/"
resources = pd.read_csv(base + "resources.csv")

print(len(resources), "resources")
pd.crosstab(resources["type"], resources["status"], margins=True)
```

```text
133 resources
status         attached  available  running  stopped  unattached  All
type
bucket                0          6        0        0           0    6
database              0          0        2        0           0    2
disk                 38          0        0        0           8   46
load_balancer         0          0        2        0           0    2
public_ip             0          0        0        0           3    3
snapshot              0         36        0        0           0   36
vm                    0          0       34        4           0   38
All                  38         42       38        4          11  133
```

Virtual machines (VMs) are servers; each has a disk attached. Snapshots are point-in-time copies of disks; buckets are file storage. Notice the statuses: some VMs are stopped, and some disks and public IP addresses are attached to nothing. Now look at the VMs by environment and size:

```python
vms = resources[resources["type"] == "vm"]
vms.pivot_table(index="environment", columns="size", values="resource_id", aggfunc="count", fill_value=0)
```

```text
size         large  medium  xlarge
environment
development      5      12       1
production       9       0       4
staging          0       6       0
```

Production is what customers use. Staging is a copy for testing releases; development machines are for engineers. Some VMs have no environment at all, which means nobody recorded what they're for.

## Walkthrough

1. Run the cells. List the VMs with no environment or no team. What do their names suggest?
2. For each resource type, decide which service model it belongs to.
3. Find the region of every resource. Why might Tallybook not use a region in Europe?
4. Read the shared responsibility table and list three things Tallybook is responsible for.

## Practice

```dataset
{"dataset": "cloud", "files": ["resources", "billing", "utilisation", "web_traffic", "outages", "access"]}
```

```answer
{
  "id": "cld-01-p1",
  "prompt": "How many VMs are **running**?",
  "answer": 34,
  "format": "number",
  "dataset": "cloud",
  "files": ["resources"],
  "pyVerify": "int(((resources['type'] == 'vm') & (resources['status'] == 'running')).sum())",
  "hint": "The vm row, running column.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A customer data bucket is accidentally made public. Under shared responsibility, whose problem is it?",
    "options": ["The provider's", "The customer's: settings and access are the customer's responsibility", "Nobody's", "The internet's"],
    "answer": 1,
    "explanation": "The provider secures the platform; you secure what you configure on it."
  },
  {
    "prompt": "Tallybook's managed database is which service model?",
    "options": ["IaaS", "PaaS: the provider runs the database software; Tallybook manages data and settings", "SaaS", "On-premises"],
    "answer": 1,
    "explanation": "Managed services are platform services."
  },
  {
    "prompt": "What is an availability zone?",
    "options": ["A country", "A separate data centre within a region, with its own power and networking", "A price plan", "A type of disk"],
    "answer": 1,
    "explanation": "Using several zones protects against one failing."
  }
]
```
