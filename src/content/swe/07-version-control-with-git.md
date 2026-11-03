---
title: Version control with Git
minutes: 15
summary: Track every change to code with Git, make small commits with clear messages, work on a branch, read a diff, and merge, all with real commands in Colab.
---

## The problem

Before Git, Tallybook's code lived on one engineer's laptop and a shared folder, with files like `billing_final_v3_REAL.py`. Nobody could say what changed between versions, who changed it, or why. When the kobo bug was finally found, nobody could tell how long it had been there.

**Version control** records every change: what, who, when and why. **Git** is the standard tool, and GitHub (as in this course's Git course and the CI/CD course) is where teams share Git repositories.

## The concept

### The basic cycle

| Command | Does |
| :-- | :-- |
| `git init` | start tracking a folder |
| `git status` | what's changed since the last commit |
| `git add file` | choose changes for the next commit (stage them) |
| `git commit -m "message"` | record the staged changes, with a message |
| `git log` | the history of commits |
| `git diff` | what changed, line by line |

### Branches

A branch is a separate line of work. Make a branch for each change, commit to it, and **merge** it into `main` when it's reviewed and tested. `main` always works.

![Working folder to staging area with git add, then to history with git commit; below, a round-vat branch leaves main, gets three small commits, and is merged back into main after review](/images/courses/swe/git-branches.svg "The add–commit cycle, and a branch merged back into main.")

### Good commits

- **Small**: one change per commit, so each can be understood, reviewed and undone.
- **Clear messages**: say what and why, in the imperative ("Round VAT half up"), not "fixed stuff".
- Commit the tests with the code they test.

## Example

Create a repository with the invoice module from lesson 3, and make the first commit. (The `config` lines tell Git who you are; use your own name.)

```bash
%%bash
rm -rf billing && mkdir billing && cd billing
git init -q -b main
git config user.name "Ada Okafor"
git config user.email "ada@tallybook.example"

cat > invoicing.py <<'EOF'
VAT_RATE = 0.075


def invoice_total(lines, discount_pct=0, vat_exempt=False):
    subtotal = sum(quantity * unit_price for quantity, unit_price in lines)
    after_discount = subtotal - subtotal * discount_pct / 100
    vat = 0 if vat_exempt else after_discount * VAT_RATE
    return round(after_discount + vat, 2)
EOF
git status --short
git add invoicing.py
git commit -q -m "Add invoice total calculation"
git log --format="%s"
```

```text
?? invoicing.py
Add invoice total calculation
```

Now fix the money bug on a branch. `git diff` shows exactly what changed before you commit:

```bash
%%bash
cd billing
git switch -q -c fix-money-rounding
cat > invoicing.py <<'EOF'
from decimal import Decimal, ROUND_HALF_UP

VAT_RATE = Decimal("0.075")


def round_kobo(amount):
    return int(amount.quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def invoice_total(lines, discount_pct=0, vat_exempt=False):
    """Total in kobo. Lines are (quantity, unit price in kobo) pairs."""
    subtotal = sum(quantity * unit_price for quantity, unit_price in lines)
    after_discount = subtotal - round_kobo(Decimal(subtotal) * discount_pct / 100)
    vat = 0 if vat_exempt else round_kobo(after_discount * VAT_RATE)
    return after_discount + vat
EOF
git diff --stat
git add invoicing.py
git commit -q -m "Calculate in kobo and round VAT half up" -m "Float maths and banker's rounding left some totals a kobo out."
git log --format="%s" main..fix-money-rounding
```

```text
invoicing.py | 15 +++++++++++----
 1 file changed, 11 insertions(+), 4 deletions(-)
Calculate in kobo and round VAT half up
```

After review, merge the branch into `main`:

```bash
%%bash
cd billing
git switch -q main
git merge -q --no-ff fix-money-rounding -m "Merge fix-money-rounding"
git log --format="%s" --graph
```

```text
*   Merge fix-money-rounding
|\
| * Calculate in kobo and round VAT half up
|/
* Add invoice total calculation
```

The history now shows the original code, the fix on its own branch with a message explaining why, and the merge. A year from now, anyone can see when and why the rounding changed.

## Walkthrough

1. Run the cells in Colab. Run `git log` (without `--format`) to see the authors and dates.
2. Run `git diff main~1 main` to see the whole change the merge brought in.
3. Add the test file from lesson 3 in a new commit on a new branch, and merge it.
4. Write three commit messages (the task below).

## Practice

```task
{
  "id": "swe-07-t1",
  "prompt": "Write **commit messages** for three changes, one per line: (1) adding the late fee boundary tests from lesson 4, (2) fixing the off-by-one bug, (3) adding the import validator from lesson 6. Use the **imperative** mood and keep each **under 60 characters**.",
  "minutes": 4,
  "rows": 4,
  "placeholder": "Add ...",
  "rules": [
    { "label": "Three lines", "pattern": "^\\s*(\\d[.)]\\s*)?[A-Z]\\w+ [^\\n]+$", "min": 3 },
    { "label": "Imperative verbs (Add, Fix, Validate, Test...)", "pattern": "^\\s*(\\d[.)]\\s*)?(Add|Fix|Validate|Test|Count|Check|Correct|Reject|Handle|Use)\\b", "min": 3 },
    { "label": "No vague messages", "pattern": "fixed stuff|update|changes|misc|wip", "absent": true },
    { "label": "No line over 60 characters", "pattern": "^[^\\n]{61,}$", "absent": true }
  ],
  "sample": "Add boundary tests for late fee periods\nFix late fee at exact 30-day boundaries\nValidate invoice rows before import",
  "note": "Each message finishes the sentence 'If applied, this commit will...'.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does `git add` do?",
    "options": ["Commits changes", "Stages changes to include in the next commit", "Creates a branch", "Uploads to GitHub"],
    "answer": 1,
    "explanation": "Choose what goes into the commit."
  },
  {
    "prompt": "Why work on a branch?",
    "options": ["Branches are faster", "So main always works while a change is made, reviewed and tested separately", "Git requires it", "To hide changes"],
    "answer": 1,
    "explanation": "Merge only when it's ready."
  },
  {
    "prompt": "Which is the best commit message?",
    "options": ["fixed stuff", "Round VAT half up to the nearest kobo", "changes", "update billing.py"],
    "answer": 1,
    "explanation": "Say what and why."
  }
]
```
