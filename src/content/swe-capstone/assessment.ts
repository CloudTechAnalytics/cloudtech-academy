import type { AssessmentDef } from "../types";

/**
 * Final assessment for the Software Developer Capstone. Scenario questions across the whole
 * project: triage, reproduction, money, boundaries, security, integrity, APIs, review and release.
 */
export const SDC_ASSESSMENT: AssessmentDef = {
  id: "software-developer-capstone-final",
  courseId: "software-developer-capstone",
  title: "Software Developer Capstone: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "sdcq01",
      prompt: "Six bugs are reported: one exposes customer data, one gives a 500 error for a missing order. Which do you fix first?",
      options: ["The 500 error", "The data exposure", "Whichever is quickest", "Neither until all are understood"],
      answer: 1,
      explanation: "Triage by harm.",
    },
    {
      id: "sdcq02",
      prompt: "What should you do before fixing a reported bug?",
      options: ["Rewrite the module", "Write a failing test that reproduces it", "Close the ticket", "Deploy"],
      answer: 1,
      explanation: "Reproduce, then fix, then keep the test.",
    },
    {
      id: "sdcq03",
      prompt: "int(2499.99 * 100) gives 249998. Why?",
      options: ["A bug in Python", "Floats can't represent 2499.99 exactly, and int() cuts off the fraction", "The price is wrong", "Rounding to even"],
      answer: 1,
      explanation: "Keep money in whole kobo; round explicitly with Decimal.",
    },
    {
      id: "sdcq04",
      prompt: "The policy says returns are allowed \"within 14 days\". Which tests should you write?",
      options: ["Day 7 only", "Day 14 (allowed) and day 15 (refused)", "Day 0 only", "None: it's obvious"],
      answer: 1,
      explanation: "Test both sides of every boundary.",
    },
    {
      id: "sdcq05",
      prompt: "What reliably fixes SQL injection?",
      options: ["Escaping quotes", "Parameterised queries", "Checking email formats", "A firewall"],
      answer: 1,
      explanation: "Parameters are never treated as SQL.",
    },
    {
      id: "sdcq06",
      prompt: "A customer double-taps Submit. What prevents two refunds?",
      options: ["A sleep", "An idempotency key stored with a unique index, returning the original refund on a repeat", "A pop-up", "A daily report"],
      answer: 1,
      explanation: "Retries must be safe.",
    },
    {
      id: "sdcq07",
      prompt: "Why must \"check total refunded\" and \"insert refund\" be in one transaction?",
      options: ["Speed", "So concurrent requests can't both pass the check before either writes", "SQLite requires it", "For logging"],
      answer: 1,
      explanation: "Check-then-write must be atomic.",
    },
    {
      id: "sdcq08",
      prompt: "A refund request names a product that isn't in the order. Which status code?",
      options: ["201", "400", "404", "500"],
      answer: 1,
      explanation: "The request is invalid.",
    },
    {
      id: "sdcq09",
      prompt: "A well-formed refund request arrives 19 days after delivery. Which status code?",
      options: ["400", "404", "422", "500"],
      answer: 2,
      explanation: "Valid request, refused by a rule.",
    },
    {
      id: "sdcq10",
      prompt: "A pull request has `except: pass` around a refund write and returns \"ok\". What's the main harm?",
      options: ["Style", "Failures are hidden and reported as success", "It's slower", "It uses more memory"],
      answer: 1,
      explanation: "Silent failure misleads everyone.",
    },
    {
      id: "sdcq11",
      prompt: "Where should an admin token for a new endpoint live?",
      options: ["In the code", "In an environment variable or secrets manager, compared with hmac.compare_digest", "In the URL", "In the README"],
      answer: 1,
      explanation: "Secrets never belong in source code.",
    },
    {
      id: "sdcq12",
      prompt: "Why make the CI test job a required check on main?",
      options: ["For the badge", "So nothing can merge while tests fail", "To make merges slower", "It's free"],
      answer: 1,
      explanation: "CI only protects you if it can block.",
    },
  ],
};
