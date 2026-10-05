---
title: Securing the pipeline
minutes: 25
summary: Review a deployment pipeline for the mistakes that let untested or malicious code reach production (broad triggers, missing dependencies, excessive permissions, unpinned third-party actions and leaked secrets), and write the fixed workflow.
---

## The problem

A deployment pipeline holds the keys to production: it has the deploy key, it can reach the servers, and whatever it runs, runs with that power. That makes it one of the most valuable targets in a company, and one of the least reviewed.

Tallybook's old workflow has six security and safety problems in 28 lines. Each is common in real repositories.

## The concept

### What to check in every pipeline

| Check | Risk | Fix |
| :-- | :-- | :-- |
| Trigger | deploys from any branch | deploy only from `main` (and tags) |
| Job order | deploy runs even if tests fail | `needs: test` |
| Permissions | the automatic token can change anything in the repo | `permissions: contents: read`, widened per job only where needed |
| Third-party actions | `@main` runs whatever its author pushes next, with your secrets | pin to a full commit SHA, and prefer well-known actions |
| Secrets in logs | printing a secret exposes it to anyone who can read logs | never print secrets; GitHub masks them, but masking can miss multi-line values like SSH keys and any transformed copy |
| Approvals | production changes with no human gate | an `environment: production` with required reviewers |

### Deploy artifacts, not repositories

The old workflow ran `git pull` and `npm install` on the servers. The new one deploys the **image** that was built, tested and scanned in the pipeline.

## Example

A workflow checker, in the same spirit as the Dockerfile checker:

```python
import re
from urllib.request import urlopen

import yaml

with urlopen("https://academy.cloudtechanalytics.com/datasets/cicd/deploy.yml") as f:
    workflow = yaml.safe_load(f.read().decode("utf-8"))

def review(wf):
    problems = []
    trigger = wf.get("on", wf.get(True)) or {}
    branches = (trigger.get("push") or {}).get("branches", [])
    if any(b in ("**", "*") for b in branches):
        problems.append("trigger: a push to any branch runs the workflow")
    if wf.get("permissions") == "write-all":
        problems.append("permissions: write-all gives the token full write access")
    for name, job in wf["jobs"].items():
        steps = job.get("steps", [])
        if name.startswith("deploy"):
            if "needs" not in job:
                problems.append(f"{name}: doesn't need the test job, so it runs even if tests fail")
            if "environment" not in job:
                problems.append(f"{name}: no environment, so no approval before production")
        for step in steps:
            uses = step.get("uses", "")
            if uses and not uses.startswith("actions/") and not re.search(r"@[0-9a-f]{40}$", uses):
                problems.append(f"{name}: third-party action {uses} isn't pinned to a commit SHA")
            if "run" in step and "secrets." in step["run"] and re.search(r"\becho\b", step["run"]):
                problems.append(f"{name}: a step prints a secret")
    return problems

for p in review(workflow):
    print("-", p)
```

```text
- trigger: a push to any branch runs the workflow
- permissions: write-all gives the token full write access
- deploy: doesn't need the test job, so it runs even if tests fail
- deploy: no environment, so no approval before production
- deploy: third-party action quickship-dev/ssh-deploy-action@main isn't pinned to a commit SHA
- deploy: a step prints a secret
```

Six problems, as expected. The third-party action is the most dangerous kind: `quickship-dev/ssh-deploy-action@main` receives the production deploy key on every run, and its author (or anyone who takes over their account) can change what it does at any time. Pinning to a commit SHA means a change requires your own pull request.

## Walkthrough

1. Run the cells. Order the six problems from most to least dangerous.
2. Find the commit SHA format: why does `@v4` count as unpinned for a third-party action?
3. Run `review` on your fixed workflow (the task below). Does it pass?
4. List who at Tallybook should be required reviewers for the production environment.

## Practice

```answer
{
  "id": "cicd-06-p1",
  "prompt": "How many problems does `review` find in the old workflow?",
  "answer": 6,
  "format": "number",
  "pyVerify": "len(review(workflow))",
  "hint": "Count the lines printed.",
  "required": true
}
```

```task
{
  "id": "cicd-06-t1",
  "prompt": "Write the **fixed workflow** in YAML: deploy only from **main**, read-only default **permissions**, a `deploy` job that **needs** `test`, uses a production **environment**, and deploys a built **image** (no `git pull` on servers). Don't print any secret.",
  "minutes": 12,
  "rows": 24,
  "placeholder": "name: deploy\n\non:\n  push:\n    branches: [main]\n...",
  "rules": [
    { "label": "Triggers only on main", "pattern": "branches:\\s*\\[?\\s*\"?main\"?\\s*\\]?" },
    { "label": "Read-only default permissions", "pattern": "permissions:\\s*\\n\\s+contents:\\s*read" },
    { "label": "deploy needs test", "pattern": "needs:\\s*\\[?\\s*test" },
    { "label": "A production environment", "pattern": "environment:\\s*production" },
    { "label": "Builds or deploys an image (docker, image, registry)", "pattern": "docker|image|registry|ghcr" },
    { "label": "No git pull on the servers", "pattern": "git pull", "absent": true },
    { "label": "No echo of a secret", "pattern": "echo[^\\n]*secrets\\.", "absent": true }
  ],
  "sample": "name: deploy\n\non:\n  push:\n    branches: [main]\n\npermissions:\n  contents: read\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - run: npm ci\n      - run: npm test\n\n  deploy:\n    needs: test\n    runs-on: ubuntu-latest\n    environment: production\n    permissions:\n      contents: read\n      packages: write\n    steps:\n      - uses: actions/checkout@v4\n      - run: docker build -t ghcr.io/tallybook/web:${{ github.sha }} .\n      - run: docker login ghcr.io -u ${{ github.actor }} --password-stdin <<< \"${{ secrets.GITHUB_TOKEN }}\"\n      - run: docker push ghcr.io/tallybook/web:${{ github.sha }}\n      - run: ./scripts/deploy-canary.sh ghcr.io/tallybook/web:${{ github.sha }}",
  "note": "The login step passes the token on standard input, so it's never printed or placed on the command line, where it could appear in logs.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why pin a third-party action to a full commit SHA?",
    "options": ["It's faster", "So the code that runs with your secrets can't change without your own review", "SHAs are shorter", "GitHub requires it"],
    "answer": 1,
    "explanation": "@main runs whatever is pushed next."
  },
  {
    "prompt": "What does `permissions: contents: read` do?",
    "options": ["Hides the code", "Limits the workflow's token to reading the repository", "Blocks the workflow", "Encrypts secrets"],
    "answer": 1,
    "explanation": "Least privilege for the pipeline."
  },
  {
    "prompt": "GitHub masks secrets in logs. Is echoing a secret safe?",
    "options": ["Yes", "No: masking can miss multi-line values and transformed copies; never print secrets", "Only on main", "Only for SSH keys"],
    "answer": 1,
    "explanation": "Don't rely on masking."
  }
]
```
