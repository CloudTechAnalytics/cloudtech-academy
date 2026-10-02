import type { ProjectDef } from "../types";

export const SWE_PROJECT: ProjectDef = {
  id: "swe-tallybook-invoicing-service",
  courseId: "software-engineering-with-python",
  title: "Tallybook's invoicing service",
  required: true,
  summary: "A tested, version-controlled invoicing package and API that replaces an old billing module, with every rule tested at its boundaries, the messy export reconciled row by row, and old and new totals compared.",
  brief: `Tallybook wants to retire its old billing module, billing.py. Build its replacement and the evidence that it's right.

Work in Google Colab (or on your own computer) with the invoicing dataset (https://academy.cloudtechanalytics.com/datasets/invoicing/: customers.csv, invoices_raw.csv, invoice_lines.csv and billing.py). Put your code in a Git repository on GitHub. Submit the repository link, and paste your **test run output**, your **reconciliation table** and your **summary for the finance team** below, followed by a short note on where each part is in the repository.`,
  tasks: [
    "invoicing.py: totals in kobo with discount, VAT, half-up rounding and late fees, each rule in one named place.",
    "Tests: pytest tests for every rule, including boundaries, rejected inputs and the bugs found in the course.",
    "importer.py: validation and conversion of the raw export, with every row reconciled to one outcome.",
    "A comparison of old and new totals for every valid invoice, with the differences explained.",
    "api.py: a Flask API for invoice totals that rejects bad requests with clear 400 errors, tested with the test client.",
    "A Git history of small, well-described commits on branches, merged into main.",
    "A review of billing.py and a summary for the finance team.",
  ],
  datasets: ["invoicing"],
  rubric: [
    "Money is calculated exactly, in kobo, with the stated rounding rule.",
    "Every rule is tested, including boundaries and past bugs, and all tests pass.",
    "Bad input is validated and reported clearly, never silently dropped.",
    "Every row of the export is accounted for, and the counts add up.",
    "The API returns correct results and clear errors with the right status codes.",
    "The Git history shows small commits with clear messages.",
    "The summary tells the finance team exactly what changes and what they need to do.",
  ],
};
