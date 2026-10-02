---
title: Better Dockerfiles
minutes: 25
summary: Check a Dockerfile against the rules that matter (pinned base images, cache-friendly order, no secrets, a non-root user, small runtime images) with a small linter you write yourself, then rewrite Tallybook's as a multi-stage build.
---

## The problem

Tallybook's original Dockerfile has eight lines and at least six problems. One of them is serious: the production database password is written into the image, so anyone who can pull the image can read it, and it stays in the image's history even if a later line removes it.

Tools such as **hadolint** check Dockerfiles automatically. You'll write a small checker of your own to understand what they look for, then fix the file.

## The concept

**Rules for a good Dockerfile**

| Rule | Why | Fix |
| :-- | :-- | :-- |
| Pin the base image | `latest` changes without warning | `FROM node:20.17-slim` (or by digest) |
| Install dependencies before copying code | keeps the slow install layer cached | `COPY package*.json ./` then `RUN npm ci`, then `COPY . .` |
| Reproducible installs | `npm install` can pick new versions | `npm ci --omit=dev` uses the lock file exactly |
| No secrets in the image | `ENV`, `ARG` and copied files are readable by anyone with the image | pass secrets at runtime from a secrets manager |
| Don't run as root | a break-in gets root inside the container | `USER node` |
| Exclude junk | `COPY . .` copies `.git`, `.env`, local `node_modules` | a `.dockerignore` file |
| Exec-form CMD | the app receives stop signals properly | `CMD ["node", "server.js"]` |

**Multi-stage builds**

Build in one stage with all the tools, then copy only the result into a small runtime image:

```dockerfile
FROM node:20.17-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM gcr.io/distroless/nodejs20-debian12:nonroot
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER nonroot
EXPOSE 3000
CMD ["dist/server.js"]
```

The runtime image has no shell, no package manager and no compilers: less to download, and less for an attacker to use.

## Example

A small Dockerfile checker. Each rule looks at the instructions and returns a message if it's broken:

```python
import re
from urllib.request import urlopen

with urlopen("https://academy.cloudtechanalytics.com/datasets/cicd/Dockerfile") as f:
    dockerfile = f.read().decode("utf-8")

lines = [l.strip() for l in dockerfile.splitlines() if l.strip() and not l.strip().startswith("#")]
instructions = [(l.split()[0].upper(), l[len(l.split()[0]):].strip()) for l in lines]

def check(instructions):
    problems = []
    names = [name for name, _ in instructions]
    for name, args in instructions:
        if name == "FROM" and (":" not in args or args.endswith(":latest")):
            problems.append(f"FROM {args}: pin a specific version")
        if name in ("ENV", "ARG") and re.search(r"(?i)password|secret|token|key|://[^:]+:[^@]+@", args):
            problems.append(f"{name}: looks like a secret is baked into the image")
        if name == "RUN" and re.search(r"\bnpm install\b", args):
            problems.append("RUN npm install: use npm ci for reproducible installs")
        if name == "CMD" and not args.startswith("["):
            problems.append("CMD: use the exec form, e.g. CMD [\"node\", \"server.js\"]")
    if "USER" not in names:
        problems.append("No USER: the app runs as root")
    copy_all = [i for i, (n, a) in enumerate(instructions) if n == "COPY" and a.startswith(". ")]
    installs = [i for i, (n, a) in enumerate(instructions) if n == "RUN" and "npm" in a]
    if copy_all and installs and copy_all[0] < installs[0]:
        problems.append("COPY . . comes before installing dependencies: every code change re-runs the install")
    return problems

for p in check(instructions):
    print("-", p)
```

```text
- FROM node:latest: pin a specific version
- RUN npm install: use npm ci for reproducible installs
- ENV: looks like a secret is baked into the image
- CMD: use the exec form, e.g. CMD ["node", "server.js"]
- No USER: the app runs as root
- COPY . . comes before installing dependencies: every code change re-runs the install
```

Six problems, and the checker is fifty lines. Real linters have hundreds of rules, but every one works like this. Now the most serious finding: what exactly would someone with the image learn?

```python
secret_line = next(args for name, args in instructions if name == "ENV" and "DATABASE_URL" in args)
user_and_password = re.search(r"://([^:]+):([^@]+)@", secret_line)
print("Database user:", user_and_password.group(1))
print("Password visible to anyone with the image:", user_and_password.group(2)[:4] + "...")
```

```text
Database user: tallybook_admin
Password visible to anyone with the image: Tall...
```

It's the same production password the Terraform course found in the state file. It has now leaked through two channels, so it must be rotated, and the new one must reach the app at runtime from a secrets manager, never through the image.

## Walkthrough

1. Run the cells. Run `check` on the multi-stage Dockerfile from "The concept". Does it pass?
2. Add a rule: warn if there's no `HEALTHCHECK` (or explain why your platform's health checks make it unnecessary).
3. Write a `.dockerignore` for Tallybook's repository.
4. Rewrite Tallybook's Dockerfile (the task below).

## Practice

```answer
{
  "id": "cicd-03-p1",
  "prompt": "How many problems does the checker find in Tallybook's Dockerfile?",
  "answer": 6,
  "format": "number",
  "pyVerify": "len(check(instructions))",
  "hint": "Count the lines printed.",
  "required": true
}
```

```task
{
  "id": "cicd-03-t1",
  "prompt": "Rewrite **Tallybook's Dockerfile**: a pinned base image, dependencies installed with `npm ci` **before** copying the code, **no secrets**, a **non-root user**, and an **exec-form** CMD. A multi-stage build is a bonus.",
  "minutes": 10,
  "rows": 14,
  "placeholder": "FROM node:20.17-slim\n...",
  "rules": [
    { "label": "A pinned FROM (not latest, has a version)", "pattern": "^FROM\\s+\\S+:(?!latest)\\d" },
    { "label": "Copies package files before the code", "pattern": "COPY\\s+package[\\s\\S]*npm ci[\\s\\S]*COPY\\s+\\.\\s" },
    { "label": "Uses npm ci", "pattern": "npm ci" },
    { "label": "A USER instruction", "pattern": "^USER\\s+\\S+" },
    { "label": "Exec-form CMD", "pattern": "^CMD\\s+\\[" },
    { "label": "No password or connection string", "pattern": "password|DATABASE_URL\\s*=?\\s*\\S*://", "absent": true }
  ],
  "sample": "FROM node:20.17-slim\nWORKDIR /app\nENV NODE_ENV=production\nCOPY package.json package-lock.json ./\nRUN npm ci --omit=dev\nCOPY . .\nUSER node\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]",
  "note": "DATABASE_URL is now supplied when the container starts, from the secrets manager, so the image itself contains no secrets.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why put `COPY package*.json` and `RUN npm ci` before `COPY . .`?",
    "options": ["It's alphabetical", "So code changes don't invalidate the cached dependency install", "npm requires it", "It makes the image smaller"],
    "answer": 1,
    "explanation": "Least-changing steps first."
  },
  {
    "prompt": "A password is set with ENV and later unset. Is it gone from the image?",
    "options": ["Yes", "No: it remains in the earlier layer and the image's history", "Only in production", "Only if the image is rebuilt"],
    "answer": 1,
    "explanation": "Never put secrets in images."
  },
  {
    "prompt": "What does a multi-stage build achieve?",
    "options": ["Two apps in one image", "Build with full tools, then ship only the result in a small runtime image", "Faster tests", "Automatic scanning"],
    "answer": 1,
    "explanation": "Smaller, safer runtime images."
  }
]
```
