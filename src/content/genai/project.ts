import type { ProjectDef } from "../types";

export const GAI_PROJECT: ProjectDef = {
  id: "gai-support-assistant",
  courseId: "generative-ai-engineering",
  title: "Paystream support assistant: prototype and evaluation",
  required: true,
  summary: "A support assistant prototype with ticket triage and grounded answers, evaluated against human labels, made safe, costed, and backed by a launch recommendation.",
  brief: `Paystream's head of support wants to know whether to launch an AI support assistant, and in what form. Build the prototype and, above all, the evidence.

Work in Google Colab with the genai dataset. Live model calls are optional: if you use an API, keep your key in Colab's Secrets and never in the notebook. Submit a link to your notebook (shared so anyone with the link can view it), and paste your **evaluation table**, your **safety rules** and your **launch recommendation** below, followed by a short note on where each task is answered.`,
  tasks: [
    "Prompts: a versioned triage prompt and a grounded-answer prompt, with untrusted text delimited and the output format specified.",
    "Validation: a schema for each output, with the handling for invalid responses and a measured failure rate.",
    "Triage evaluation: accuracy and per-category recall for the small model, the large model and a classic baseline on the same test tickets.",
    "Retrieval: hit@1 and hit@3 on the labelled questions, and a chosen threshold for questions the help centre can't answer, with its trade-off.",
    "Answer evaluation: correct and refusal rates for v1 and v2, the LLM judge checked against human grades, and an automatic citation check.",
    "Safety and cost: personal data redaction, injection flags, a fraud safety net, and a monthly cost estimate with labelled price assumptions.",
    "A launch recommendation for the head of support, with the evidence, the main risk, the safeguards and the condition for the next step.",
  ],
  datasets: ["genai"],
  rubric: [
    "Prompts are clear specifications, versioned, and keep instructions separate from untrusted text.",
    "Every model output is validated, and failures are routed to people rather than guessed.",
    "Models are compared on the same labelled data, with attention to the high-stakes categories, not only overall accuracy.",
    "Retrieval is measured, and the refusal threshold is chosen with its errors stated.",
    "The automated judge is checked against human grades before it is trusted, including the direction of its errors.",
    "Privacy, prompt injection and cost are handled with concrete controls and labelled assumptions.",
    "The recommendation matches the system's autonomy to its measured reliability.",
  ],
};
