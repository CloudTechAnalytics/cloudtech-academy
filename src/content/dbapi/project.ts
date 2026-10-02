import type { ProjectDef } from "../types";

export const DBA_PROJECT: ProjectDef = {
  id: "dba-tallybook-database-and-api",
  courseId: "databases-and-apis-for-developers",
  title: "Tallybook's invoicing database and API",
  required: true,
  summary: "A migrated, constrained database and a tested REST API for customers, invoices and payments, loaded from a messy export with every refused row explained and every balance reconciled.",
  brief: `Tallybook is retiring its CSV exports. Build the database and API that replace them, and prove they're right.

Work in Google Colab (or on your own computer) with the invoicing dataset (https://academy.cloudtechanalytics.com/datasets/invoicing/: customers.csv, invoices_raw.csv and invoice_lines.csv). Put your code in a Git repository on GitHub. Submit the repository link, and paste your **schema**, your **test run output** and your **reconciliation** below, followed by a short note on where each part is in the repository.`,
  tasks: [
    "Schema: customers, invoices, invoice lines, payments and credit notes, with keys and named constraints, built by numbered migrations.",
    "Loader: loads the export, refusing bad rows through the database's constraints and reporting every refusal with its reason.",
    "Payments import: transactional and idempotent, keyed on the bank reference.",
    "Indexes: one for each important query, justified with query plans.",
    "API: customers, invoices with balances, paginated lists and payments, with clear status codes.",
    "Tests: pytest with fixtures giving every test a fresh database, covering every endpoint and rule.",
    "A reconciliation of API balances against an independent SQL calculation, and a README.",
  ],
  datasets: ["invoicing"],
  rubric: [
    "The schema stores each fact once, with keys and constraints that make bad states impossible.",
    "Migrations are numbered, transactional and safe to re-run.",
    "Every query uses parameters; none is built from text.",
    "Imports are atomic and idempotent.",
    "The API uses resource-style routes, correct status codes and pagination.",
    "Tests are independent and cover success, every error and refused requests leaving no trace.",
    "Balances reconcile exactly, and the README lets someone else run everything.",
  ],
};
