---
title: Image vulnerabilities
minutes: 25
summary: Read container vulnerability scan reports, separate problems in the base image from problems in your own dependencies, and set a scanning rule the pipeline can enforce without blocking every release.
---

## The problem

Every image contains hundreds of software packages, and some of them have known security flaws. Scanners such as **Trivy** compare an image's packages with databases of known vulnerabilities and list every match.

The platform team scanned all four of Tallybook's candidate images. The current one has hundreds of findings. Nobody can fix hundreds of findings, and a pipeline that blocks on all of them would never release anything. The skill is knowing which findings matter and which choice removes most of them at once.

## The concept

### Reading a finding

| Field | Meaning |
| :-- | :-- |
| ID | the vulnerability's identifier (real scans show CVE numbers; this course's data uses fictional `EXAMPLE-` IDs) |
| Package and installed version | where it is |
| Fixed version | the version that fixes it; empty means no fix exists yet |
| Severity | CRITICAL, HIGH, MEDIUM, LOW |

### Two sources of findings

- **OS packages** come from the base image. You fix most of them by choosing a smaller, newer base image and rebuilding regularly.
- **Language packages** (npm, pip) are your app's dependencies. You fix them by upgrading in your own code.

### A practical rule

Block a release on **CRITICAL or HIGH findings that have a fix**, warn on the rest, and rebuild images regularly so fixes in the base image arrive without anyone asking.

## Example

Load each scan and count findings by severity and source:

```python
import json
from urllib.request import urlopen

import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/cicd/"

def load(name):
    with urlopen(base + name) as f:
        return json.load(f)

rows = []
for variant in ["current", "slim", "alpine", "distroless"]:
    scan = load(f"scan-{variant}.json")
    for result in scan["Results"]:
        for v in result["Vulnerabilities"]:
            rows.append({"image": variant, "source": result["Class"], "severity": v["Severity"],
                         "package": v["PkgName"], "fixable": v["FixedVersion"] != ""})
findings = pd.DataFrame(rows)
pd.crosstab([findings["image"], findings["source"]], findings["severity"])[["CRITICAL", "HIGH", "MEDIUM", "LOW"]]
```

```text
severity              CRITICAL  HIGH  MEDIUM  LOW
image      source
alpine     lang-pkgs         1     2       2    1
           os-pkgs           0     2       5    3
current    lang-pkgs         1     2       2    1
           os-pkgs           5    38     112  241
distroless lang-pkgs         1     2       2    1
           os-pkgs           0     1       3    2
slim       lang-pkgs         1     2       2    1
           os-pkgs           1     8      27   58
```

The base image accounts for almost all the findings in the current image; moving to a small base removes nearly all of them in one change. The app's own npm findings are identical in every image: no base image can fix them. Now the blocking rule:

```python
must_fix = findings[findings["severity"].isin(["CRITICAL", "HIGH"]) & findings["fixable"]]
print(must_fix.groupby("image").size().rename("blocking findings"))
print()
print(must_fix[(must_fix["image"] == "distroless")][["source", "severity", "package"]].to_string(index=False))
```

```text
image
alpine         5
current       30
distroless     3
slim           9
Name: blocking findings, dtype: int64

   source severity      package
lang-pkgs CRITICAL jsonwebtoken
lang-pkgs     HIGH        axios
lang-pkgs     HIGH       lodash
```

Even the smallest image would be blocked, but only by three findings, all in the app's own dependencies: `jsonwebtoken` (critical: tokens can be forged), `axios` and `lodash`. Those are fixed by upgrading three packages in `package.json`, which is a normal pull request, not a crisis.

## Walkthrough

1. Run the cells. What share of the current image's findings have a fix available?
2. Which OS packages appear most often in the current image's findings? Why might they be in a web app's image at all?
3. Count the blocking findings for each image after the three npm upgrades.
4. Write the scanning policy (the task below).

## Practice

```answer
{
  "id": "cicd-04-p1",
  "prompt": "How many findings (all severities, both sources) are in the **current** image's scan?",
  "answer": 402,
  "format": "number",
  "pyVerify": "int((findings['image'] == 'current').sum())",
  "hint": "Add up the current rows of the first table.",
  "required": true
}
```

```answer
{
  "id": "cicd-04-p2",
  "prompt": "How many **blocking** findings (CRITICAL or HIGH, with a fix) does the **distroless** image have?",
  "answer": 3,
  "format": "number",
  "pyVerify": "int(((findings['image'] == 'distroless') & findings['severity'].isin(['CRITICAL', 'HIGH']) & findings['fixable']).sum())",
  "hint": "The distroless count in the second output.",
  "required": true
}
```

```task
{
  "id": "cicd-04-t1",
  "prompt": "Write Tallybook's **image scanning policy**, one rule per line starting with a dash: at least **four** rules covering what **blocks** a release, what only **warns**, how often images are **rebuilt**, and how **exceptions** are handled.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "- Block: ...",
  "rules": [
    { "label": "At least four rules, each starting with -", "pattern": "^\\s*-\\s+\\S", "min": 4 },
    { "label": "Blocks on critical or high", "pattern": "block[^\\n]*(critical|high)|(critical|high)[^\\n]*block" },
    { "label": "Mentions a fix being available", "pattern": "fix" },
    { "label": "Warn level for the rest", "pattern": "warn" },
    { "label": "Regular rebuilds", "pattern": "rebuil|weekly|every (week|month|night)|nightly" },
    { "label": "Exceptions with an expiry or owner", "pattern": "exception[^\\n]*(expir|days|owner|approv|review)" }
  ],
  "sample": "- Block: any CRITICAL or HIGH finding that has a fixed version available, in OS or npm packages.\n- Warn: CRITICAL or HIGH findings with no fix yet, and all MEDIUM findings, listed on the pull request.\n- Rebuild: every image is rebuilt and rescanned weekly, even without code changes, so base image fixes arrive automatically.\n- Exceptions: a blocking finding may be accepted only with the platform lead's approval, a written reason, and an expiry of at most 30 days.\n- Base images: only the approved slim and distroless base images may be used in production.",
  "note": "Blocking only on fixable findings keeps the rule enforceable: the team can always act on what blocks them.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Most of an image's findings are in OS packages. What's usually the most effective fix?",
    "options": ["Fix each one by hand", "Use a smaller, newer base image and rebuild regularly", "Ignore them", "Disable the scanner"],
    "answer": 1,
    "explanation": "Fewer packages, fewer findings."
  },
  {
    "prompt": "A finding is in your app's npm dependency. Which fixes it?",
    "options": ["A different base image", "Upgrading the package in your own code", "Running as root", "Rebuilding without changes"],
    "answer": 1,
    "explanation": "Your dependencies are your responsibility."
  },
  {
    "prompt": "Why block only on CRITICAL and HIGH findings that have a fix?",
    "options": ["Others don't matter", "So the rule always asks for something the team can actually do, without blocking every release", "Scanners can't see others", "It's required by law"],
    "answer": 1,
    "explanation": "Enforceable rules get enforced."
  }
]
```
