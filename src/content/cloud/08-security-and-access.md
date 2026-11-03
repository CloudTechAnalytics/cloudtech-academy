---
title: Security and access
minutes: 25
summary: Audit who can do what in a cloud account (multi-factor authentication, administrators, people who have left, old access keys, unused service accounts and public storage) and fix the riskiest findings first.
---

## The problem

Cloud breaches rarely involve clever attacks on the provider. They usually come through the customer's own doors: a password without multi-factor authentication, an access key copied into a script years ago, an account belonging to someone who left, or a storage bucket that was made public "for a moment".

Tallybook's account has 20 people and 8 service accounts (logins used by software, such as the deployment pipeline). Nobody has reviewed them since the company was founded. A customer has asked, as part of their own security checks, whether Tallybook follows basic cloud security practice.

## The concept

### Identity and access management (IAM)

Every person and program that can act in the account is a **principal** with permissions.

| Check | Why it matters |
| :-- | :-- |
| **MFA on every person** | a stolen password alone isn't enough to get in |
| **Few administrators** | each admin account is a full-power target |
| **Remove people who've left** | their access should end on their last day |
| **Rotate access keys** | old keys are more likely to have leaked; rotate every 90 days |
| **Remove unused service accounts** | software that no longer runs shouldn't hold keys |
| **No unintended public storage** | public buckets are readable by anyone on the internet |

### Least privilege

Give each principal only the permissions its job needs. Developers rarely need admin; a backup job needs to write backups, not delete databases.

### Fix by risk

An administrator without MFA, or an admin access key that's two years old, comes before a non-admin's stale key.

## Example

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/cloud/"
access = pd.read_csv(base + "access.csv")
resources = pd.read_csv(base + "resources.csv")

people = access[access["kind"] == "person"]
services = access[access["kind"] == "service account"]

findings = pd.concat([
    people[people["mfa_enabled"] == 0].assign(finding="person without MFA"),
    people[people["days_since_last_use"] > 90].assign(finding="person inactive over 90 days"),
    access[access["oldest_access_key_days"] > 90].assign(finding="access key over 90 days old"),
    services[services["days_since_last_use"] > 90].assign(finding="service account unused over 90 days"),
])
findings["risk"] = findings["admin"].map({1: "high", 0: "medium"})
print(findings.groupby(["finding", "risk"]).size().unstack(fill_value=0))
print("Administrators:", int(access["admin"].sum()), "of", len(access))
```

```text
risk                                 high  medium
finding
access key over 90 days old             4       5
person inactive over 90 days            1       2
person without MFA                      0       6
service account unused over 90 days     1       1
Administrators: 9 of 28
```

The high-risk column is where to start: administrator accounts with a weakness. Here they are:

```python
print(findings[findings["risk"] == "high"][["principal", "kind", "finding", "days_since_last_use", "oldest_access_key_days"]].sort_values("principal").to_string(index=False))
```

```text
principal            kind                             finding  days_since_last_use  oldest_access_key_days
 bisi@tallybook.example          person         access key over 90 days old                   11                   491.0
              ci-deploy service account         access key over 90 days old                    0                   540.0
             old-zapier service account         access key over 90 days old                  210                   900.0
             old-zapier service account service account unused over 90 days                  210                   900.0
yusuf@tallybook.example          person        person inactive over 90 days                  250                   692.0
yusuf@tallybook.example          person         access key over 90 days old                  250                   692.0
```

Now storage open to the internet:

```python
resources[(resources["type"] == "bucket") & (resources["public_access"] == "yes")][["name", "environment", "team", "storage_gb"]]
```

```text
name environment       team  storage_gb
122         website-assets  production  marketing        40.0
123  customer-uploads-2024  production        NaN       350.0
```

`website-assets` is meant to be public: it holds images for the marketing site. `customer-uploads-2024` has no owning team and holds customers' files. It must be made private today, and someone must check whether it has already been accessed.

## Walkthrough

1. Run the cells. Which principals appear in more than one finding?
2. For each high-risk finding, write the fix and who should do it.
3. List which of the 20 people actually need admin, based on their roles (assume only the platform lead and CTO do).
4. Write the security review summary (the task below).

## Practice

```answer
{
  "id": "cld-08-p1",
  "prompt": "How many **people** don't have MFA enabled?",
  "answer": 6,
  "format": "number",
  "dataset": "cloud",
  "files": ["access"],
  "pyVerify": "int((people['mfa_enabled'] == 0).sum())",
  "hint": "The 'person without MFA' row, both risk columns.",
  "required": true
}
```

```answer
{
  "id": "cld-08-p2",
  "prompt": "How many **high-risk** findings are there in total?",
  "answer": 6,
  "format": "number",
  "dataset": "cloud",
  "files": ["access"],
  "pyVerify": "int((findings['risk'] == 'high').sum())",
  "hint": "Sum the high column.",
  "required": true
}
```

```task
{
  "id": "cld-08-t1",
  "prompt": "Write the **security fixes in priority order**, one per numbered line: at least **five**, covering the **public bucket**, **MFA**, **people who have left**, **old keys**, and **too many admins**, each with **when** it will be done.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "1. Today: make customer-uploads-2024 private ...",
  "rules": [
    { "label": "At least five numbered fixes", "pattern": "^\\s*\\d+[.)]\\s+\\S", "min": 5 },
    { "label": "The public bucket first", "pattern": "^\\s*1[.)][^\\n]*(bucket|customer-uploads|public)" },
    { "label": "MFA", "pattern": "mfa|multi-factor" },
    { "label": "People who have left", "pattern": "left|leaver|former|inactive|disable" },
    { "label": "Old keys (rotate)", "pattern": "rotat|old key|replace[^\\n]*key" },
    { "label": "Fewer admins (least privilege)", "pattern": "admin" },
    { "label": "Timing (today, this week, by a date)", "pattern": "today|this week|within|by \\w+|days?", "min": 3 }
  ],
  "sample": "1. Today: make customer-uploads-2024 private, check its access logs for downloads, and tell the data protection officer.\n2. Today: disable the accounts of the three people who have left, and the unused service accounts old-zapier and legacy-ftp-sync.\n3. Within 2 days: require MFA for the six people without it; block sign-in without it from next week.\n4. This week: rotate every access key older than 90 days, starting with the admin keys used by ci-deploy and old-zapier, and move scripts to short-lived credentials where possible.\n5. Within 2 weeks: reduce administrators to the platform lead and CTO, giving everyone else only the permissions their work needs.\n6. Every quarter: repeat this review and report the findings to the CTO.",
  "note": "The order follows the damage each finding could do today: exposed customer data first, then doors anyone could walk through.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "An engineer left 6 months ago and their account still works. What's the risk?",
    "options": ["None", "Anyone with their old password or keys can still act in the account", "It costs money", "It slows the account"],
    "answer": 1,
    "explanation": "Access should end on the last day."
  },
  {
    "prompt": "Why rotate access keys?",
    "options": ["Keys expire anyway", "Old keys are more likely to have been copied or leaked over time", "It's faster", "Providers charge for old keys"],
    "answer": 1,
    "explanation": "Rotation limits how long a leaked key works."
  },
  {
    "prompt": "What does least privilege mean?",
    "options": ["Give everyone admin to avoid delays", "Give each person or program only the permissions its job needs", "Use the cheapest servers", "Remove all permissions"],
    "answer": 1,
    "explanation": "Fewer permissions mean less damage when something goes wrong."
  }
]
```
