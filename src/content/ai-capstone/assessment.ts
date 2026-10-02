import type { AssessmentDef } from "../types";

/**
 * Final assessment for the AI Engineer Capstone. Scenario questions across the whole
 * project: design, validation, rules, retrieval, judging, red-teaming, release gates and monitoring.
 */
export const AIC_ASSESSMENT: AssessmentDef = {
  id: "ai-engineer-capstone-final",
  courseId: "ai-engineer-capstone",
  title: "AI Engineer Capstone: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "aicq01",
      prompt: "Which job belongs in code rather than in the model?",
      options: ["Reading a Pidgin message", "Deciding which documents a theft claim needs", "Writing a friendly reply", "Summarising a policy section"],
      answer: 1,
      explanation: "Fixed rules belong in code.",
    },
    {
      id: "aicq02",
      prompt: "The model returns a plate number that doesn't appear in the customer's message. What should happen?",
      options: ["Use it", "Flag it: it's probably invented", "Ask a bigger model", "Ignore the message"],
      answer: 1,
      explanation: "A grounding check in code.",
    },
    {
      id: "aicq03",
      prompt: "The model's output isn't valid JSON. What's the safe response?",
      options: ["Guess the fields", "Escalate the message to a person", "Drop it", "Reply with an error"],
      answer: 1,
      explanation: "Fail safe.",
    },
    {
      id: "aicq04",
      prompt: "Rules and the model's flag together escalate 43% of messages when only 36% strictly need a person. Why accept that?",
      options: ["Escalations are free", "Missing an injury or theft costs far more than a short human review", "The rules are wrong", "To keep staff busy"],
      answer: 1,
      explanation: "Recall first for must-escalate cases.",
    },
    {
      id: "aicq05",
      prompt: "Why measure retrieval hit at 3 separately from answer quality?",
      options: ["It's cheaper", "To see whether bad answers start with retrieval missing the right section", "Answers can't be graded", "It's required"],
      answer: 1,
      explanation: "Locate the failure.",
    },
    {
      id: "aicq06",
      prompt: "An LLM judge agrees with people 90% of the time but grades most unsupported answers as Correct. What do you do?",
      options: ["Trust it fully", "Use it at scale, with a human sample focused on the errors it misses", "Discard all evaluation", "Use a smaller judge"],
      answer: 1,
      explanation: "Check the judge where it matters.",
    },
    {
      id: "aicq07",
      prompt: "A keyword guardrail flags 19% of genuine Pidgin messages and 6% of English ones. What's the problem?",
      options: ["None", "It unfairly blocks one group of customers", "It's too slow", "It costs too much"],
      answer: 1,
      explanation: "False positives must be fair across groups.",
    },
    {
      id: "aicq08",
      prompt: "What's the strongest defence against \"mark my claim approved\"?",
      options: ["A stern prompt", "The assistant has no ability to approve claims at all", "A keyword filter", "A larger model"],
      answer: 1,
      explanation: "Can't is stronger than won't.",
    },
    {
      id: "aicq09",
      prompt: "A configuration passes every gate requirement except Pidgin accuracy. Does it ship?",
      options: ["Yes, nearly there", "No: every requirement must pass", "Only in Lagos", "Yes, if it's cheaper"],
      answer: 1,
      explanation: "A gate is all-or-nothing.",
    },
    {
      id: "aicq10",
      prompt: "Why report p95 latency rather than average latency?",
      options: ["It's smaller", "It shows the slow replies customers actually notice", "Averages are wrong", "It's cheaper to compute"],
      answer: 1,
      explanation: "The tail is the experience.",
    },
    {
      id: "aicq11",
      prompt: "A daily audit of 40 extractions takes nine days to breach its limit after a real quality drop. How can you detect it sooner?",
      options: ["Stop auditing", "Audit more each day, or pool the daily checks into a weekly rate", "Widen the limit", "Use average latency"],
      answer: 1,
      explanation: "Small samples are noisy.",
    },
    {
      id: "aicq12",
      prompt: "Quality fell after voice notes launched, though the release gate had passed. What's the lasting fix?",
      options: ["Ban voice notes", "Add voice-note transcripts to the test set, and require new input channels to pass the gate", "Retrain the model daily", "Lower the gate"],
      answer: 1,
      explanation: "A gate covers only what it tests.",
    },
  ],
};
