import type { AssessmentDef } from "../types";

/**
 * Final assessment for Software Engineering with Python. Scenario questions on functions,
 * money, testing, boundaries, debugging, validation, Git, code review and APIs.
 */
export const SWE_ASSESSMENT: AssessmentDef = {
  id: "software-engineering-with-python-final",
  courseId: "software-engineering-with-python",
  title: "Software Engineering with Python: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "sweq01",
      prompt: "Three services each calculate VAT with their own copy of the code. What's the main risk?",
      options: ["They're slow", "The copies drift apart and give different totals for the same invoice", "They use more memory", "None"],
      answer: 1,
      explanation: "One rule, one place.",
    },
    {
      id: "sweq02",
      prompt: "Why is `0.1 + 0.2` not exactly `0.3` in Python?",
      options: ["A Python bug", "Floats are binary and can't store most decimal fractions exactly", "Rounding is off by default", "It is exactly 0.3"],
      answer: 1,
      explanation: "Use integers or Decimal for money.",
    },
    {
      id: "sweq03",
      prompt: "An invoice rule says halves round up. What does Python's `round(16.5)` give?",
      options: ["17", "16", "16.5", "An error"],
      answer: 1,
      explanation: "round() rounds halves to even; use Decimal with ROUND_HALF_UP.",
    },
    {
      id: "sweq04",
      prompt: "Which is the best test name?",
      options: ["test1", "test_vat_exempt_customer_pays_no_vat", "test_stuff", "check"],
      answer: 1,
      explanation: "Name the behaviour being checked.",
    },
    {
      id: "sweq05",
      prompt: "A fee applies 'for each full 30 days late'. Which test inputs matter most?",
      options: ["15 and 45", "29, 30 and 31 (and the other boundaries)", "Only 30", "Random numbers"],
      answer: 1,
      explanation: "Bugs live at boundaries.",
    },
    {
      id: "sweq06",
      prompt: "You've found a bug. What do you do first?",
      options: ["Fix it", "Write a test that fails because of it", "Delete the tests", "Ignore it"],
      answer: 1,
      explanation: "Then fix it and watch the test pass.",
    },
    {
      id: "sweq07",
      prompt: "A job crashes on one malformed row. What's the best response?",
      options: ["Edit the row by hand", "Find every row with the same kind of problem and handle them all in code", "Catch and ignore all errors", "Delete the file"],
      answer: 1,
      explanation: "Fix the class of problem.",
    },
    {
      id: "sweq08",
      prompt: "What should happen to invoice rows with a discount above the allowed limit?",
      options: ["Silently drop them", "Quarantine them for review by someone who can decide the right value", "Change the discount to 20%", "Crash the import"],
      answer: 1,
      explanation: "Fix automatically only what's certain.",
    },
    {
      id: "sweq09",
      prompt: "What does `git add` do?",
      options: ["Creates a commit", "Stages changes for the next commit", "Uploads to GitHub", "Deletes files"],
      answer: 1,
      explanation: "Then commit them with a message.",
    },
    {
      id: "sweq10",
      prompt: "Why is `def calc(lines, log=[]):` a problem?",
      options: ["It's too short", "The same list is shared between every call and keeps growing", "Lists can't be parameters", "It isn't"],
      answer: 1,
      explanation: "Use None as the default instead.",
    },
    {
      id: "sweq11",
      prompt: "A client sends an API request with a negative quantity. What should the API return?",
      options: ["500", "400 with a message saying quantities must be positive", "200", "404"],
      answer: 1,
      explanation: "Bad input is the client's to fix; say how.",
    },
    {
      id: "sweq12",
      prompt: "Why use Flask's test client in tests?",
      options: ["It deploys the app", "It sends requests to the app without running a server, so tests are fast and reliable", "It writes tests", "It's required"],
      answer: 1,
      explanation: "Test APIs like any other code.",
    },
  ],
};
