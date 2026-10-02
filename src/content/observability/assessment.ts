import type { AssessmentDef } from "../types";

/**
 * Final assessment for Observability and Site Reliability. Scenario questions on telemetry,
 * percentiles, logs, traces, SLOs, burn rates, alert quality, capacity and toil.
 */
export const SRE_ASSESSMENT: AssessmentDef = {
  id: "observability-site-reliability-final",
  courseId: "observability-site-reliability",
  title: "Observability and Site Reliability: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "sreq01",
      prompt: "Which telemetry tells you when something changed and by how much?",
      options: ["Traces", "Metrics", "Postmortems", "Tickets"],
      answer: 1,
      explanation: "Metrics are numbers over time.",
    },
    {
      id: "sreq02",
      prompt: "Traffic is unchanged, errors jump, and the database pool is 100% used while web CPU is normal. Where's the bottleneck?",
      options: ["The web servers", "The database connection pool", "DNS", "The users"],
      answer: 1,
      explanation: "Saturation points at the constrained resource.",
    },
    {
      id: "sreq03",
      prompt: "Why report p95 latency rather than the average?",
      options: ["It's smaller", "It shows what a meaningful share of users actually experience; averages hide the tail", "It's required", "Averages can't be computed"],
      answer: 1,
      explanation: "Users experience percentiles.",
    },
    {
      id: "sreq04",
      prompt: "Why include a trace ID in every log line?",
      options: ["Logs need IDs", "To link the line to the request's full trace and its other logs", "To encrypt logs", "To count users"],
      answer: 1,
      explanation: "Correlation across telemetry.",
    },
    {
      id: "sreq05",
      prompt: "In a trace, a request spends 4.9 seconds in 'acquire connection' and 90 ms in the query. What's wrong?",
      options: ["The query is slow", "Requests are waiting for a free connection: the pool is exhausted", "The network", "Nothing"],
      answer: 1,
      explanation: "Waiting, not working.",
    },
    {
      id: "sreq06",
      prompt: "An SLO of 99.9% availability over 30 days means what?",
      options: ["The service never fails", "At most 0.1% of requests may fail over any 30 days", "99.9% of servers are up", "Uptime is checked daily"],
      answer: 1,
      explanation: "The 0.1% is the error budget.",
    },
    {
      id: "sreq07",
      prompt: "Under a 99.9% SLO, the error rate is 2%. What's the burn rate?",
      options: ["2×", "20×", "0.2×", "200×"],
      answer: 1,
      explanation: "2% ÷ 0.1%.",
    },
    {
      id: "sreq08",
      prompt: "Why require both a 1-hour and a 5-minute window to page?",
      options: ["To page twice", "So pages are for significant, still-happening problems, and clear soon after recovery", "Tools need it", "To reduce costs"],
      answer: 1,
      explanation: "Significant and current.",
    },
    {
      id: "sreq09",
      prompt: "An alert pages 40 times a month and needs action 10% of the time. What should happen?",
      options: ["Keep it", "Demote it to a dashboard or ticket, or delete it, and page on SLO burn instead", "Page more people", "Raise its priority"],
      answer: 1,
      explanation: "Noisy pages cause fatigue.",
    },
    {
      id: "sreq10",
      prompt: "150 requests per second each hold a database connection for 0.4 s. How many connections are needed on average?",
      options: ["40", "60", "150", "375"],
      answer: 1,
      explanation: "Little's law: 150 × 0.4.",
    },
    {
      id: "sreq11",
      prompt: "A batch job shares the API's connection pool and starves it at month-end. What's the most robust fix?",
      options: ["A bigger pool only", "Give the job its own small pool and schedule it off-peak", "Stop sending invoices", "More web servers"],
      answer: 1,
      explanation: "Isolation contains the damage.",
    },
    {
      id: "sreq12",
      prompt: "Which is toil?",
      options: ["Designing alerts", "Restarting a stuck worker by hand several times a week", "Writing a postmortem", "Reviewing a pull request"],
      answer: 1,
      explanation: "Manual, repetitive, automatable.",
    },
  ],
};
