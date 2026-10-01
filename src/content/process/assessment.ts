import type { AssessmentDef } from "../types";

/**
 * Final assessment for Process Improvement with BPMN and Lean. Scenario questions on
 * judgement: each has a tempting answer that pushes people instead of fixing the process.
 */
export const PIL_ASSESSMENT: AssessmentDef = {
  id: "process-improvement-bpmn-lean-final",
  courseId: "process-improvement-bpmn-lean",
  title: "Process Improvement with BPMN and Lean: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "pilq01",
      prompt: "Containers spend 8 days at port and the clearing team is busy all day. What does Lean suggest first?",
      options: ["Make the team work faster", "Measure where the time goes; most of it is probably waiting between steps", "Hire more staff", "Buy new software"],
      answer: 1,
      explanation: "Waiting usually dwarfs working time.",
    },
    {
      id: "pilq02",
      prompt: "In BPMN, how should communication between Harbourline and the customs service be drawn?",
      options: ["Sequence flow between lanes", "Message flow between separate pools", "A parallel gateway", "A sub-process"],
      answer: 1,
      explanation: "Separate organisations are separate pools, joined by message flows.",
    },
    {
      id: "pilq03",
      prompt: "Which BPMN gateway means exactly one path is taken?",
      options: ["Parallel (+)", "Exclusive (✕)", "Inclusive (○)", "Event-based"],
      answer: 1,
      explanation: "Label it with a question and each path with an answer.",
    },
    {
      id: "pilq04",
      prompt: "How do you calculate the waiting time before an activity from an event log?",
      options: ["End minus start of that activity", "Its start minus the end of the previous activity in the same case", "Lead time divided by the number of steps", "It can't be calculated"],
      answer: 1,
      explanation: "Sort by case and time, then compare with the previous row.",
    },
    {
      id: "pilq05",
      prompt: "Lead time is 200 hours and total process time is 8 hours. What is the flow efficiency?",
      options: ["96%", "4%", "25%", "8%"],
      answer: 1,
      explanation: "8 ÷ 200 = 4%.",
    },
    {
      id: "pilq06",
      prompt: "Documents are checked, rejected and checked again. Which waste is the second check?",
      options: ["Motion", "Defects (rework)", "Inventory", "Value-adding work"],
      answer: 1,
      explanation: "Work done again because it was wrong first time.",
    },
    {
      id: "pilq07",
      prompt: "You halve the time of a step that isn't the bottleneck. What happens to the lead time?",
      options: ["It halves", "Very little: items reach the bottleneck sooner and wait there", "It doubles", "It becomes unpredictable"],
      answer: 1,
      explanation: "Only improvements at the constraint speed up the whole flow.",
    },
    {
      id: "pilq08",
      prompt: "Throughput is 3 cases a day and lead time is 8 days. Roughly how many cases are in progress?",
      options: ["2.7", "24", "11", "0.4"],
      answer: 1,
      explanation: "Little's law: WIP = throughput × lead time.",
    },
    {
      id: "pilq09",
      prompt: "Group A has a 70% error rate on 30 files; group B has 30% on 100 files. Which causes more errors in total?",
      options: ["Group A", "Group B", "They're equal", "You can't tell"],
      answer: 1,
      explanation: "21 against 30. Check both rate and count.",
    },
    {
      id: "pilq10",
      prompt: "A booking can't be confirmed until the permit checklist is complete. Which Lean idea is this?",
      options: ["Kanban", "Poka-yoke (error-proofing)", "Takt time", "Overproduction"],
      answer: 1,
      explanation: "It makes the mistake impossible rather than catching it later.",
    },
    {
      id: "pilq11",
      prompt: "Every pilot week is below every week before the pilot, the case mix is similar, and an unrelated wait didn't change. What can you conclude?",
      options: ["Nothing", "Strong evidence the change caused the improvement", "The data is wrong", "The pilot should stop"],
      answer: 1,
      explanation: "A sustained shift plus fair comparisons is good evidence.",
    },
    {
      id: "pilq12",
      prompt: "What most often makes an improvement fade within a year?",
      options: ["It never worked", "No owner, no standard work and no regular review", "Too much measurement", "Customers complain"],
      answer: 1,
      explanation: "A control plan makes the new way the normal way.",
    },
    {
      id: "pilq13",
      prompt: "After one successful PDCA cycle, what baseline should the next cycle use?",
      options: ["The original baseline", "The new normal from the last cycle", "An industry benchmark", "None"],
      answer: 1,
      explanation: "Each cycle starts from where the last one left off.",
    },
  ],
};
