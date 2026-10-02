import type { ProjectDef } from "../types";

export const WJS_PROJECT: ProjectDef = {
  id: "wjs-tallybook-pay-invoice-page",
  courseId: "web-development-with-javascript",
  title: "Tallybook's pay-an-invoice page",
  required: true,
  summary: "An accessible, responsive payment page that calculates in kobo, shows the balance live, validates clearly, handles every API outcome and is backed by tests and a checklist of real-device checks.",
  brief: `Tallybook wants a new pay-an-invoice page before the next month-end. Build it, and show that it works for every customer: on a small phone, with a keyboard, with a screen reader and on a bad connection.

Build the page as an HTML file with its CSS and JavaScript (in one file or separate files), and publish it free with GitHub Pages, as in Web Development for Beginners. Submit the link to the live page and to its GitHub repository, and paste your **test results** and your **checklist with results** below, followed by a short note on where each part is in the code.`,
  tasks: [
    "Semantic, accessible HTML: landmarks, headings in order, a captioned table and a labelled form with hints.",
    "Mobile-first CSS that works from 320px wide, with a wider layout from a breakpoint you choose.",
    "Exact money: totals and formatting in kobo, matching the API's rules.",
    "A live balance as the customer types, announced to screen readers.",
    "Validation with clear messages linked to their fields, and focus moved to the first problem.",
    "Payment through fetch, handling 201, 400, 404, 409 and network failure, with a loading state that prevents double submission.",
    "Automated tests for the logic, and a checklist of keyboard, screen reader, zoom, small-screen and slow-network checks with results.",
  ],
  datasets: [],
  rubric: [
    "The HTML uses the right elements, and every input has a linked label.",
    "The page is usable at 320px and at 200% zoom without horizontal scrolling.",
    "Money is calculated in whole kobo and matches the API's rules.",
    "The live balance and errors are announced to screen readers.",
    "Every API outcome gives the customer a clear, true message about their payment.",
    "The logic is in testable functions, and the tests pass.",
    "The checklist was done on real devices and reported honestly.",
  ],
};
