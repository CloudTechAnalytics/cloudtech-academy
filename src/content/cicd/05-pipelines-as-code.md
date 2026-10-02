---
title: Pipelines as code
minutes: 15
summary: Read a CI/CD pipeline defined in YAML (triggers, jobs, steps, dependencies and secrets), load it as data, and map how Tallybook's old GitHub Actions workflow actually ran.
---

## The problem

Tallybook's old deployment process was defined in one file, `.github/workflows/deploy.yml`. Pipelines defined as code have the same advantages as infrastructure as code: they're versioned, reviewed, and can be read by people and programs. They also have the same risk: a few wrong lines can deploy untested code to production.

Before you can review a pipeline, you need to read its YAML fluently, and know a couple of traps.

## The concept

**YAML**

A text format of keys, values and nested blocks, where **indentation is structure**. Lists start with `-`.

**A GitHub Actions workflow**

| Key | Meaning |
| :-- | :-- |
| `on` | the **trigger**: which events start the workflow (a push, a pull request, a schedule) |
| `permissions` | what the workflow's automatic token may do in the repository |
| `jobs` | named jobs; each runs on a fresh machine (`runs-on`) |
| `needs` | job dependencies: `deploy` with `needs: test` waits for `test` to pass |
| `steps` | each step either `uses` a published action or `run`s a command |
| `${{ secrets.NAME }}` | a secret stored in the repository settings |
| `environment` | a deployment target that can require approval |

Without `needs`, jobs run **in parallel**.

**A YAML trap**

In YAML 1.1, which many libraries (including Python's PyYAML) follow, the bare word `on` means **true**. So loading a workflow in Python gives a key `True`, not `"on"`. GitHub reads it correctly; your scripts must handle it.

## Example

The old workflow:

```python
from urllib.request import urlopen

import yaml

with urlopen("https://academy.cloudtechanalytics.com/datasets/cicd/deploy.yml") as f:
    text = f.read().decode("utf-8")
print(text)
```

```text
name: deploy

on:
  push:
    branches: ["**"]

permissions: write-all

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm test

  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: quickship-dev/ssh-deploy-action@main
        with:
          host: ${{ secrets.PROD_HOST }}
          key: ${{ secrets.DEPLOY_KEY }}
      - run: echo "Deploying ${{ github.ref_name }} with key ${{ secrets.DEPLOY_KEY }}"
      - run: ssh deploy@${{ secrets.PROD_HOST }} "cd /srv/tallybook && git pull && npm install && sudo systemctl restart tallybook-web"
```

Load it as data. Notice the trigger key:

```python
workflow = yaml.safe_load(text)
print("Top-level keys:", list(workflow))
trigger = workflow.get("on", workflow.get(True))
print("Trigger:", trigger)
print("Permissions:", workflow["permissions"])
```

```text
Top-level keys: ['name', True, 'permissions', 'jobs']
Trigger: {'push': {'branches': ['**']}}
Permissions: write-all
```

Now map the jobs: what each depends on, and what each step does.

```python
for name, job in workflow["jobs"].items():
    print(f"job {name}: needs={job.get('needs', 'nothing')}, environment={job.get('environment', 'none')}")
    for step in job["steps"]:
        kind, value = ("uses", step["uses"]) if "uses" in step else ("run", step["run"])
        print(f"    {kind}: {value[:75]}")
```

```text
job test: needs=nothing, environment=none
    uses: actions/checkout@v4
    uses: actions/setup-node@v4
    run: npm install
    run: npm test
job deploy: needs=nothing, environment=none
    uses: actions/checkout@v4
    uses: quickship-dev/ssh-deploy-action@main
    run: echo "Deploying ${{ github.ref_name }} with key ${{ secrets.DEPLOY_KEY }}"
    run: ssh deploy@${{ secrets.PROD_HOST }} "cd /srv/tallybook && git pull && npm i
```

The `deploy` job needs nothing, so it starts at the same time as `test`, not after it. Tests could fail and the deployment would still go ahead. Combined with the trigger (a push to **any** branch), any engineer's experimental branch was deployed straight to production. Lesson 6 reviews this file line by line.

## Walkthrough

1. Run the cells. Draw the order the jobs run in.
2. What would `branches: [main]` change? What would `needs: test` change?
3. Count how many times a secret is used in the workflow, and in which steps.
4. Write the YAML for a `test` job that also runs a linter before the tests.

## Practice

```answer
{
  "id": "cicd-05-p1",
  "prompt": "How many **steps** are in the `deploy` job?",
  "answer": 4,
  "format": "number",
  "pyVerify": "len(workflow['jobs']['deploy']['steps'])",
  "hint": "Count the steps listed under job deploy.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Two jobs have no `needs`. How do they run?",
    "options": ["One after the other", "At the same time, in parallel", "Only if both pass", "Never"],
    "answer": 1,
    "explanation": "needs creates the order."
  },
  {
    "prompt": "Why does PyYAML load a workflow's `on:` key as `True`?",
    "options": ["A bug in GitHub", "YAML 1.1 treats the bare word on as a boolean", "It's encrypted", "The file is broken"],
    "answer": 1,
    "explanation": "A classic YAML trap; handle both keys."
  },
  {
    "prompt": "What does `branches: [\"**\"]` under `push` mean?",
    "options": ["Only main", "A push to any branch triggers the workflow", "No branches", "Only tags"],
    "answer": 1,
    "explanation": "** matches every branch name."
  }
]
```
