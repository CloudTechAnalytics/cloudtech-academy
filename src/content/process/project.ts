import type { ProjectDef } from "../types";

export const PIL_PROJECT: ProjectDef = {
  id: "pil-harbourline-next-cycle",
  courseId: "process-improvement-bpmn-lean",
  title: "Harbourline clearance: the next improvement cycle",
  required: true,
  summary: "A full Lean improvement case for the next cycle of Harbourline's import clearance process, from BPMN model and value stream to pilot and control plan, with a one-page A3.",
  brief: `The pre-arrival checklist cut days at port by about two and a quarter. Harbourline's operations director wants the next improvement cycle, aimed at the waits that are left: duty payment confirmation and, for Red-channel files, the inspection queue.

Use the process dataset, with the pilot period (May and June 2026) as your baseline. Submit a link to your work (a document, workbook or folder with your BPMN model, analysis and A3) and paste your **A3** below, followed by a short note on where to find each task.`,
  tasks: [
    "A BPMN model of the current (post-pilot) clearance process, with pools, lanes, gateways and the waits shown as events.",
    "A value stream of the pilot period: process and wait times per step, lead time and flow efficiency.",
    "Waste and bottleneck analysis: at least five of the eight wastes with evidence, and the constraints ranked.",
    "Root cause analysis for your chosen focus: a fishbone, five whys and a Pareto or rate-versus-count comparison.",
    "A future state: at most three countermeasures, each tied to a root cause, with a target and an estimated benefit in naira.",
    "A pilot and control plan: PDCA steps, how the pilot will be judged (run chart, mix checks, unaffected measures) and the controls that keep it working.",
    "A one-page A3 summarising the whole case.",
  ],
  datasets: ["process"],
  rubric: [
    "The BPMN model is correct and readable: pools and lanes, labelled gateways, message flows between organisations, and the waits made visible.",
    "Measures come from the event log, with the pilot period as the baseline, and are calculated consistently.",
    "Waste, bottlenecks and root causes are supported by evidence, not opinion, and distinguish rate from count.",
    "Countermeasures target root causes at the constraints, using recognisable Lean patterns.",
    "The benefit estimate states its assumptions and survives a 'half the improvement' test.",
    "The pilot plan would show fairly whether the change worked, and the control plan would keep it working.",
    "The A3 tells the whole story on one page, clearly enough for a director to decide from it.",
  ],
};
