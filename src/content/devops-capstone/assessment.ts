import type { AssessmentDef } from "../types";

/**
 * Final assessment for the Cloud & DevOps Engineer Capstone. Scenario questions across the
 * whole review: inventory, incidents, Terraform plans, delivery, capacity, SLOs, cost and game days.
 */
export const CDC_ASSESSMENT: AssessmentDef = {
  id: "cloud-devops-capstone-final",
  courseId: "cloud-devops-capstone",
  title: "Cloud & DevOps Engineer Capstone: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "cdcq01",
      prompt: "A production database replica was created by hand during an incident. What should happen to it?",
      options: ["Delete it", "Import it into Terraform so changes are reviewed and reproducible", "Leave it", "Rename it"],
      answer: 1,
      explanation: "Production belongs in code.",
    },
    {
      id: "cdcq02",
      prompt: "Errors start the moment instances × pool size exceeds the database's connection limit. What's the cause of the outage?",
      options: ["High traffic", "The database connection limit, with each instance opening its own pool", "The payment gateway", "Slow servers"],
      answer: 1,
      explanation: "Traffic was the trigger; connections were the cause.",
    },
    {
      id: "cdcq03",
      prompt: "Why did autoscaling make last year's outage worse?",
      options: ["It was too slow", "Each new instance asked for more database connections than the database allowed", "It removed instances", "It cost too much"],
      answer: 1,
      explanation: "Scaling one tier overloaded the next.",
    },
    {
      id: "cdcq04",
      prompt: "A Terraform plan shows [\"delete\", \"create\"] for the orders database. What does that mean?",
      options: ["An in-place update", "The database will be destroyed and recreated", "A backup will be taken", "Nothing"],
      answer: 1,
      explanation: "Replacement means data loss without a restore.",
    },
    {
      id: "cdcq05",
      prompt: "Which policy check would have caught the database replacement automatically?",
      options: ["Check for owner tags", "Fail any plan that deletes or replaces a production database", "Check instance sizes", "Count resources"],
      answer: 1,
      explanation: "Encode the rule once; run it on every plan.",
    },
    {
      id: "cdcq06",
      prompt: "Deploys without tests fail 21% of the time; with tests, 12%. What rule follows?",
      options: ["Deploy less", "Require automated tests for checkout changes", "Ban deploys", "Deploy only on Fridays"],
      answer: 1,
      explanation: "Rules should follow the evidence.",
    },
    {
      id: "cdcq07",
      prompt: "Last year's peak was 160 requests a second; growth 1.6×; headroom 30%. What's the target?",
      options: ["About 256", "About 333", "About 208", "About 160"],
      answer: 1,
      explanation: "160 × 1.6 × 1.3.",
    },
    {
      id: "cdcq08",
      prompt: "Each request uses the database for 60 ms. At 333 requests a second, about how many connections are busy?",
      options: ["About 20", "About 333", "About 600", "About 6"],
      answer: 0,
      explanation: "Little's law: 333 × 0.06.",
    },
    {
      id: "cdcq09",
      prompt: "A 1-hour/5-minute burn-rate alert would have fired 26 minutes into last year's outage. What should you add for the sale?",
      options: ["Nothing", "A fast page on a short window, routed to on-call phones", "A CPU alert", "A longer window"],
      answer: 1,
      explanation: "Replay alerts against real incidents and tune them.",
    },
    {
      id: "cdcq10",
      prompt: "An alert fired 450 times in 90 days and needed action 4% of the time. What do you do?",
      options: ["Keep it", "Remove or fix it", "Page more people", "Raise its severity"],
      answer: 1,
      explanation: "Noise trains people to ignore alerts.",
    },
    {
      id: "cdcq11",
      prompt: "A standby replica runs at 12% CPU. Is it waste?",
      options: ["Yes, delete it", "No: it's the failover target, so low use is expected", "Only on weekends", "Only in staging"],
      answer: 1,
      explanation: "Don't cut resilience to save cost.",
    },
    {
      id: "cdcq12",
      prompt: "The database restore drill took 155 minutes against a 60-minute target. What's the right readiness call?",
      options: ["Go anyway", "Go with conditions: fix, document and re-test the restore by a set date", "Cancel the sale", "Ignore it: backups run nightly"],
      answer: 1,
      explanation: "Open risks need owners, dates and re-tests.",
    },
  ],
};
