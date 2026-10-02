---
title: Ship it
minutes: 25
summary: Ship a fix the way a team does, with a branch, small commits, a pull request that CI must pass, a version tag and release notes. Then plan your final project, which brings every fix together in one repository.
---

## The problem

Fixes on your laptop help nobody. To reach customers, each fix goes through the team's process: a branch, a pull request, automated tests in CI that must pass, a review, a merge, a version number and release notes. That process is what lets six people change the same code safely, and what tells finance and support exactly what changed.

## The concept

**Branch, commit, merge**

Work on a branch named after the change (`fix/return-window`). Commit in small steps, each with a message saying why. Merge into `main` when CI and review pass.

**CI runs the tests on every push**

A workflow file in `.github/workflows/` tells GitHub Actions to install the dependencies and run `pytest` on every push and pull request. Make the tests a **required check**, so nothing merges red.

**Versions and release notes**

Tag each release (`v1.1.0`). With semantic versioning, fixes bump the last number, new features the middle one, and breaking changes the first. Release notes are for people outside the team: what changed for them, in their words.

## Example

A repository with the starter code, then one fix on a branch:

```bash
%%bash
base=https://academy.cloudtechanalytics.com/datasets/refunds
for f in refunds.py db.py app.py schema.sql customers.csv orders.csv order_items.csv test_refunds.py pytest.ini; do
  curl -sO "$base/$f"
done
printf "__pycache__/\n*.db\n" > .gitignore
git init -q
git config user.name "Ada Developer"
git config user.email "ada@example.com"
git add .
git commit -q -m "Import the refunds service"
git tag v1.0.0

git switch -q -c fix/return-window
sed -i 's/days < RETURN_WINDOW_DAYS/days <= RETURN_WINDOW_DAYS/' refunds.py
cat >> test_refunds.py <<'EOF'


def test_return_on_day_14_is_allowed():
    # ISSUE-103: delivered 1 September, returned 15 September
    assert within_window(date(2026, 9, 1), date(2026, 9, 15))
EOF
python -m pytest
git commit -q -am "Allow returns on day 14 (ISSUE-103)"
git switch -q main
git merge -q --no-ff fix/return-window -m "Merge fix/return-window"
git tag v1.0.1
git log --format="%s" --graph
git tag
```

```text
....
4 passed in 0.01s
*   Merge fix/return-window
|\
| * Allow returns on day 14 (ISSUE-103)
|/
* Import the refunds service
v1.0.0
v1.0.1
```

The CI workflow that would run those tests on every push:

```bash
%%bash
mkdir -p .github/workflows
cat > .github/workflows/test.yml <<'EOF'
name: tests
on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install pytest flask
      - run: python -m pytest
EOF
grep -c "run:" .github/workflows/test.yml | xargs echo "Steps that run commands:"
```

```text
Steps that run commands: 2
```

The workflow uses only read permission, a timeout, pinned major versions of the actions, and a fixed Python version, the habits from the CI/CD course. And the release notes for finance and support, once all six fixes are in:

```bash
%%bash
cat > CHANGELOG.md <<'EOF'
# Changelog

## v1.1.0 (2026-09-25)

### Fixed
- Refunds are now exact to the kobo (ISSUE-101).
- A refund request sent twice, such as after a double tap, creates one refund (ISSUE-102).
- Returns on day 14 after delivery are accepted, as the policy says (ISSUE-103).
- The support tool's email search only returns the matching customer's orders (ISSUE-104).
- Partial returns refund the delivery fee once, and refunds never exceed what was paid (ISSUE-105).
- A refund request for an order that doesn't exist returns a clear 404 error (ISSUE-106).

### Changed
- The refunds API returns a 400 error with a message for invalid requests.
- The mobile app must send a request_id with each refund request, and reuse it on retries.
EOF
grep -c "ISSUE-" CHANGELOG.md | xargs echo "Issues in the release notes:"
```

```text
Issues in the release notes: 6
```

The second "Changed" line matters most to another team. Without it, the mobile app wouldn't send the key that makes retries safe.

## Walkthrough

1. Run the cells.
2. Create a repository on GitHub, push this one, and add the workflow. Open a pull request with a deliberately failing test, and watch CI block it.
3. Turn on branch protection for `main`, so the tests are a required check.
4. Is the combined release `v1.1.0` or `v2.0.0`? The API now rejects requests it used to accept, and needs a new field. Argue it either way.
5. Open the project brief on the course page and plan your submission.

## Practice

```dataset
{"dataset": "refunds", "files": ["issues", "orders", "order_items", "customers"]}
```

```answer
{
  "id": "sdc-08-p1",
  "prompt": "How many tests pass on the fix branch, before the merge?",
  "answer": 4,
  "format": "number",
  "hint": "The pytest line in the first cell.",
  "required": true
}
```

```task
{
  "id": "sdc-08-t1",
  "prompt": "Write the **pull request description** for the combined fixes (80 to 200 words): a **summary**, the **issues** fixed, **how it was tested**, anything **other teams** must do, and the **risks** for reviewers to look at.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "## Summary\n...",
  "rules": [
    { "label": "A summary", "pattern": "summary|this pr|this change" },
    { "label": "Names the issues", "pattern": "ISSUE-10[1-6]", "min": 3 },
    { "label": "How it was tested", "pattern": "test" },
    { "label": "What other teams must do (mobile, request_id, migration)", "pattern": "mobile|request_id|migrat|app team" },
    { "label": "Risks for reviewers", "pattern": "risk|review|careful|watch|attention" },
    { "label": "Between 80 and 200 words", "minWords": 80, "maxWords": 200 }
  ],
  "sample": "## Summary\nFixes the six refund bugs reported last week: money is exact to the kobo, retries and partial returns can't over-refund, the email search can't be injected, and the API validates requests.\n\n## Issues\nISSUE-101, ISSUE-102, ISSUE-103, ISSUE-104, ISSUE-105, ISSUE-106.\n\n## Testing\nEach issue has a test that failed before the fix and passes now, using the reporter's example. The API has a test for every response code, and the search is tested with three attack strings. 27 tests in total, all passing in CI.\n\n## Other teams\nThe mobile app must send a request_id with each refund and reuse it on retries. The database migration adds two columns and a unique index; check for existing duplicate refunds before running it.\n\n## Risks\nPlease look closely at service.request_refund: the transaction and the over-refund cap are where a mistake would cost money.",
  "note": "A PR description is for the reviewer and for whoever investigates this change a year from now.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why make the test job a required check on main?",
    "options": ["For the badge", "So no change can merge while tests fail", "To slow merges down", "GitHub requires it"],
    "answer": 1,
    "explanation": "CI only protects you if it can block."
  },
  {
    "prompt": "With semantic versioning, which number does a bug-fix release change?",
    "options": ["The first", "The middle", "The last", "None"],
    "answer": 2,
    "explanation": "v1.0.0 to v1.0.1."
  },
  {
    "prompt": "Who are release notes for?",
    "options": ["Only developers", "People outside the team, who need to know what changed for them", "The CI system", "Nobody"],
    "answer": 1,
    "explanation": "Write them in your users' words."
  }
]
```
