---
title: Containers and images
minutes: 15
summary: What containers and images are and why pipelines build them, how a Dockerfile's instructions become image layers, and what the choice of base image does to size and build time.
---

## The problem

The old process ran `git pull` and `npm install` on each production server. So each server built its own copy of the app, at deploy time, from whatever versions of everything it happened to download that day. Two servers could end up running slightly different software, and a broken package release on the internet could break a deployment halfway through.

Containers fix this. The pipeline builds the app **once** into an **image**, tests and scans that exact image, and runs the same image everywhere.

## The concept

### Images and containers

- An **image** is a packaged app with everything it needs to run: the code, its libraries, and a minimal operating system. It doesn't change once built.
- A **container** is a running instance of an image, isolated from other containers on the same machine.
- A **registry** stores images, each identified by a name and tag (`tallybook-web:2026-09-01.3`).

Build once, run anywhere the same way: on a laptop, in testing, in production.

![A Dockerfile is built into an image of read-only layers (base OS, Node.js runtime, dependencies, app code), pushed to a registry with a tag, then pulled and run as three identical containers](/images/courses/cicd/image-registry.svg "Dockerfile → image → registry → containers.")

### Dockerfiles

A Dockerfile is the recipe for an image:

| Instruction | Does |
| :-- | :-- |
| `FROM` | start from a **base image** (for example Node.js on Debian) |
| `WORKDIR` | set the working folder |
| `COPY` | copy files from your project into the image |
| `RUN` | run a command while building (install packages) |
| `ENV` | set an environment variable |
| `USER` | choose which user the app runs as |
| `EXPOSE` | document the port the app listens on |
| `CMD` | the command that starts the app |

### Layers and caching

Each instruction creates a **layer**. When you rebuild, Docker reuses layers that haven't changed, **up to the first instruction whose input changed**; everything after it is rebuilt. Order matters: put what changes least (installing dependencies) before what changes most (your code).

## Example

Tallybook's original Dockerfile:

```python
from urllib.request import urlopen

base = "https://academy.cloudtechanalytics.com/datasets/cicd/"

def fetch(name):
    with urlopen(base + name) as f:
        return f.read().decode("utf-8")

print(fetch("Dockerfile"))
```

```text
FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
ENV NODE_ENV=production
ENV DATABASE_URL=postgres://tallybook_admin:Tallyb00k-Prod-2025!@tallybook-prod.c9x2.af-south-1.rds.example:5432/tallybook
EXPOSE 3000
CMD npm start
```

The platform team built the app four ways, from different base images, and recorded the results:

```python
import pandas as pd

images = pd.read_csv(base + "images.csv")
images
```

```text
image                           base_image  stages  size_mb  layers  build_seconds_cold  build_seconds_code_change  runs_as_root
0     tallybook-web:current                          node:latest       1     1184      13                 312                        298             1
1        tallybook-web:slim                         node:20-slim       1      412      11                 205                         41             0
2      tallybook-web:alpine                       node:20-alpine       1      236      11                 188                         38             0
3  tallybook-web:distroless  gcr.io/distroless/nodejs20-debian12       2      168       9                 226                         44             0
```

Two things stand out. The current image is over a gigabyte: `node:latest` includes compilers and tools the app never uses at runtime, and every one of them must be downloaded on every deploy. And look at `build_seconds_code_change`: when only the app's code changes, the current image takes almost as long to rebuild as from scratch, while the others take well under a minute. The reason is the order of two lines in the Dockerfile, which lesson 3 fixes.

## Walkthrough

1. Run the cells. Label each line of the Dockerfile with the instruction table above.
2. Which line's input changes every time a developer edits any file?
3. How much smaller is the distroless image than the current one, in per cent?
4. If 6 servers each pull the image on every deploy, how much data does each deploy move with the current image and with the alpine one?

## Practice

```answer
{
  "id": "cicd-02-p1",
  "prompt": "How many seconds does the **current** image take to rebuild after a code change?",
  "answer": 298,
  "format": "number",
  "dataset": "cicd",
  "files": ["images"],
  "pyVerify": "int(images.loc[images['image'] == 'tallybook-web:current', 'build_seconds_code_change'].iloc[0])",
  "hint": "The current row, build_seconds_code_change.",
  "required": true
}
```

```answer
{
  "id": "cicd-02-p2",
  "prompt": "By what percentage is the **distroless** image smaller than the **current** image? Rounded to the nearest whole number.",
  "answer": 86,
  "format": "percent",
  "dataset": "cicd",
  "files": ["images"],
  "pyVerify": "round((1 - images.set_index('image').loc['tallybook-web:distroless', 'size_mb'] / images.set_index('image').loc['tallybook-web:current', 'size_mb']) * 100)",
  "hint": "1 − distroless size ÷ current size.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What's the difference between an image and a container?",
    "options": ["None", "An image is the packaged app; a container is a running instance of it", "A container is bigger", "An image runs; a container is stored"],
    "answer": 1,
    "explanation": "Build the image once, run many containers."
  },
  {
    "prompt": "Why build once and run the same image everywhere?",
    "options": ["It's required", "So what you tested is exactly what runs in production", "Images are free", "It's faster to type"],
    "answer": 1,
    "explanation": "No more servers building their own slightly different copies."
  },
  {
    "prompt": "When does Docker rebuild a layer?",
    "options": ["Always", "When that instruction's input changed, or any instruction before it did", "Never", "Once a day"],
    "answer": 1,
    "explanation": "Cache is reused up to the first change."
  }
]
```
