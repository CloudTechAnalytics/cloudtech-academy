import type { ProjectDef } from "../types";

export const DMS_PROJECT: ProjectDef = {
  id: "dms-full-campaign",
  courseId: "digital-marketing-sales",
  title: "A complete marketing campaign",
  required: true,
  summary: "Plan a full digital marketing campaign for a real or realistic business: goal, channels, assets, funnel, tracking and a report plan.",
  brief: `Choose a business you know and a specific goal, such as launching a product, filling quiet days or winning new customers in a month. Plan the full campaign: strategy, channels and budget, the assets you would use, the funnel and offer, tracking and measurement, and a timeline.

Use real prices and information where you can, and state your assumptions. Submit a link to your campaign plan (a shared document, PDF or folder) and paste your **goal and budget maths** and your **core message** below, with a short note on where to find each part.

Write for the owner or client who must approve the budget: lead with a one-page summary, then show the evidence and the numbers.`,
  tasks: [
    "Goal, audience and strategy: a SMART goal worked back to leads, customers and budget, a customer persona and the core message.",
    "Channels and budget: two or three channels with reasons, a budget split and expected results.",
    "Creative assets: an ad (headline, text, call to action), a landing page plan and an email or WhatsApp message.",
    "A four-week content calendar with channels, formats and calls to action.",
    "Funnel and conversion: the customer journey, the offer and a planned A/B test.",
    "Tracking and measurement: metrics, UTM links, pixels or codes, how leads and sales are recorded, and scale or stop rules.",
    "Timeline, risks and the report you will deliver at the end.",
  ],
  datasets: [],
  rubric: [
    "The goal is specific and the budget and lead numbers are calculated correctly from it.",
    "The audience, message and positioning are clear and consistent across all assets.",
    "Channels are justified by where the customer is, and the budget split is realistic.",
    "Creative assets are clear, benefit-led and ethical, with one call to action each.",
    "The funnel and landing page plan remove friction and include a sensible test.",
    "Tracking is set up so results can be traced to channels, with clear scale or stop rules.",
    "The plan complies with consent and advertising rules, and risks are acknowledged honestly.",
  ],
};
