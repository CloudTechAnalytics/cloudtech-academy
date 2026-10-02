import type { ProjectDef } from "../types";

export const SDC_PROJECT: ProjectDef = {
  id: "sdc-kasuwa-refunds-service",
  courseId: "software-developer-capstone",
  title: "Kasuwa's refunds service, fixed and shipped",
  required: true,
  summary: "Take a real (small) codebase with six reported bugs to a tested, secure release: reproductions, fixes for money, security and integrity bugs, a stricter API, a code review and a CI-checked release.",
  brief: `Kasuwa's refunds service has six open bug reports and a pull request waiting for review. Fix the bugs properly, review the pull request, and ship a release your team could trust.

Start from the starter code (https://academy.cloudtechanalytics.com/datasets/refunds/) in a GitHub repository. Submit a link to the repository: it should contain all your fixes, the tests, the GitHub Actions workflow (passing), a CHANGELOG and your review of PR 42 (as REVIEW.md). In the text box, paste your **pull request description** for the combined fixes, followed by a short note on where each task is.`,
  tasks: [
    "Triage: the six issues in order of harm, with reasons.",
    "Reproductions: a failing test for each issue, from the reporter's example.",
    "Money and boundaries: whole kobo with Decimal and half-up rounding, and the 14-day window as the policy states it.",
    "Security: parameterised queries everywhere, with tests that attack the search.",
    "Integrity: an idempotency key with a unique index, the delivery fee refunded once, refunds capped at what was paid, in one transaction, with a migration.",
    "API: validation with 400, 404 and 422 responses, a request_id for retries, tests for every path, and API documentation.",
    "Review and release: your review of PR 42, a CI workflow that blocks failing tests, a version tag and release notes.",
  ],
  datasets: ["refunds"],
  rubric: [
    "Every fix is preceded by a failing test that uses the reported example, and every test still passes at the end.",
    "Money stays exact: whole kobo, Decimal, one explicit rounding rule.",
    "No SQL is built from user input; the security tests attack the fix.",
    "Rules that protect money are enforced in a transaction and backed by a database constraint.",
    "The API returns the right status code with a clear message for every bad request, and can't be made to return a 500.",
    "The code review is specific, kind and blocks what must be blocked.",
    "The release is shipped through CI with clear commits, a tag and release notes other teams can act on.",
  ],
};
