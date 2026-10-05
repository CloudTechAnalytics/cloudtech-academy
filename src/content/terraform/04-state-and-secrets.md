---
title: State and secrets
minutes: 25
summary: Understand what Terraform's state file contains, why it must be stored remotely with locking and encryption, and find the secrets sitting in plain text inside Tallybook's state.
---

## The problem

A Tallybook engineer once emailed the state file to a contractor "so they could see what we have". It seemed harmless: it's just a list of resources. But state records **every attribute** of every resource Terraform manages, and some attributes are secrets.

Terraform hides sensitive values when it prints them. It doesn't hide them in the file.

## The concept

### What state is for

Terraform compares three things on every plan: your code (what you want), the state (what it created last time), and the real infrastructure (what exists now). State is how it knows that `aws_instance.api[2]` is the server with ID `r-0017`.

![Three boxes, code, state and real cloud, feeding into terraform plan: the changes that make reality match the code. A server created by hand isn't in the state, so Terraform can't see it.](/images/courses/terraform/code-state-real.svg "Every plan compares code, state and the real cloud.")

### Where state should live

| Practice | Why |
| :-- | :-- |
| **Remote backend** (for example an encrypted storage bucket) | everyone and the pipeline use the same state; it isn't lost with a laptop |
| **Locking** | two people running `apply` at once can corrupt state |
| **Encryption and tight access** | state contains secrets |
| **Never in git, never emailed** | anyone who has it has the secrets |

### Secrets in state

Database passwords, generated keys and some API tokens end up in state. Mark variables and outputs `sensitive = true` so they're hidden in output, but treat the state file itself as a secret. Better still, let the database generate and keep its own password in a secrets manager, so it never passes through Terraform.

## Example

Terraform itself hides the output. Here's what `terraform output` shows for Tallybook's state (from a real run of Terraform 1.9.5 on this file):

```text nocheck
db_endpoint = "tallybook-prod.c9x2.af-south-1.rds.example:5432"
db_password = <sensitive>
```

Now read the file directly:

```python
import json
from urllib.request import urlopen

with urlopen("https://academy.cloudtechanalytics.com/datasets/terraform/terraform.tfstate") as f:
    state = json.load(f)

print("Output marked sensitive:", state["outputs"]["db_password"]["sensitive"])
print("Its value in the file:", state["outputs"]["db_password"]["value"])
```

```text
Output marked sensitive: True
Its value in the file: Tallyb00k-Prod-2025!
```

"Sensitive" only means "don't print it". Search the whole state for attributes that look secret:

```python
SECRET_WORDS = ("password", "secret", "token", "private_key")

def find_secrets(state):
    found = []
    for r in state["resources"]:
        for inst in r["instances"]:
            for key, value in inst["attributes"].items():
                if any(w in key for w in SECRET_WORDS) and value:
                    found.append((f"{r['type']}.{r['name']}", key, value[:4] + "..."))
    return found

for item in find_secrets(state):
    print(item)
```

```text
('aws_db_instance.prod', 'password', 'Tall...')
('aws_db_instance.staging', 'password', 'stag...')
```

Both database passwords are in the file, in full (shortened here). The production one is the password for a database that, per its own attributes, is publicly accessible. Anyone who received that email could have connected to Tallybook's production database.

## Walkthrough

1. Run the cells. Find the production database's `publicly_accessible` and `storage_encrypted` attributes. What do they mean together with the password finding?
2. List everyone who might have a copy of this state file (laptops, email, chat, CI logs).
3. Write the steps to secure the state and rotate the password (the task below).
4. Look up how your cloud provider's secrets manager could generate the database password instead.

## Practice

```answer
{
  "id": "iac-04-p1",
  "prompt": "How many secret-looking attributes does `find_secrets` find in the state's resources?",
  "answer": 2,
  "format": "number",
  "pyVerify": "len(find_secrets(state))",
  "hint": "Count the lines printed by the last cell.",
  "required": true
}
```

```task
{
  "id": "iac-04-t1",
  "prompt": "Write the steps to **secure Tallybook's state and secrets**, one numbered step per line: at least **five**, covering **rotating** the exposed password, a **remote backend** with **locking** and **encryption**, **access** to the state, keeping it out of **git**, and getting passwords out of state.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "1. Rotate the production database password ...",
  "rules": [
    { "label": "At least five numbered steps", "pattern": "^\\s*\\d+[.)]\\s+\\S", "min": 5 },
    { "label": "Rotate the password", "pattern": "rotat|change the (db |database )?password|new password" },
    { "label": "A remote backend", "pattern": "remote|backend|bucket" },
    { "label": "Locking", "pattern": "lock" },
    { "label": "Encryption", "pattern": "encrypt" },
    { "label": "Restricted access", "pattern": "access|permission|only the pipeline|least privilege" },
    { "label": "Out of git", "pattern": "git|\\.gitignore" },
    { "label": "Passwords out of state (secrets manager, generated, managed)", "pattern": "secrets? manager|vault|manage[ds]? (its own )?password|ssm|parameter store" }
  ],
  "sample": "1. Rotate the production and staging database passwords today, since the state file was shared by email.\n2. Move state to a remote backend: an encrypted storage bucket with versioning, plus a lock table so only one apply runs at a time.\n3. Restrict access to the state bucket to the deployment pipeline and two platform engineers; log every read.\n4. Add *.tfstate and *.tfstate.backup to .gitignore and check git history for old copies.\n5. Let the database's password be generated and kept in the secrets manager, with Terraform referencing it, so it no longer appears in state.\n6. Ask the contractor to delete their copy, and treat any future state sharing as a security incident.",
  "note": "Step 1 comes first because the exposure has already happened; everything else stops it happening again.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "An output is marked `sensitive = true`. Where is its value hidden?",
    "options": ["Everywhere", "In Terraform's printed output, but not in the state file", "Only in the state file", "Nowhere"],
    "answer": 1,
    "explanation": "Treat the state file itself as a secret."
  },
  {
    "prompt": "Why use state locking?",
    "options": ["To hide secrets", "So two applies can't run at once and corrupt the state", "To speed up plans", "For billing"],
    "answer": 1,
    "explanation": "Concurrent writes break state."
  },
  {
    "prompt": "Where should a team's state file live?",
    "options": ["In git", "In a remote, encrypted, access-controlled backend with locking", "On one engineer's laptop", "In email"],
    "answer": 1,
    "explanation": "Shared, safe and locked."
  }
]
```
