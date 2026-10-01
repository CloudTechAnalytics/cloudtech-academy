import type { ProjectDef } from "../types";

export const DMO_PROJECT: ProjectDef = {
  id: "dmo-ashgrove-model",
  courseId: "data-modelling",
  title: "Ashgrove Chambers data model",
  required: true,
  summary: "Design the data model for a fictional Lagos law firm: an ERD of its operational data and a star schema for its billing and court reporting.",
  brief: `Ashgrove Chambers keeps its practice data in four files: clients, matters, hearings and invoices. The managing partner wants a reliable model before any dashboard is built.

Design it using the process from *Modelling in practice*. Draw your diagrams with any tool you like: draw.io (diagrams.net), dbdiagram.io, Lucidchart, Power BI's Model view, or neatly on paper and photographed.

In the text box, answer each task below. Put your diagrams in a shared folder (Google Drive, OneDrive or GitHub) and paste the link. Diagrams are the heart of this project, so the link is expected.`,
  tasks: [
    "List five questions the managing partner will want answered (for example: overdue amount per client).",
    "Draw the ERD of the four tables: every table's primary key, foreign keys, and each relationship with crow's-foot cardinality. State each table's grain in one sentence.",
    "Run key checks on the data: are the primary keys unique? Are there any orphan matters, hearings or invoices? Report the numbers and the queries or steps you used.",
    "Identify one normalisation issue or risk in the data as given (for example a column that repeats facts), and say how you'd fix it.",
    "Design a star schema for billing: the fact table with its grain, measures and foreign keys, and each dimension with its attributes. Include a date dimension.",
    "Choose which dimension attributes should be slowly changing type 1 and which type 2, with one sentence of reasoning each.",
    "Explain how your model answers two of the questions from task 1: which tables and joins each one uses.",
  ],
  datasets: ["legal"],
  rubric: [
    "The ERD shows every primary and foreign key, and correct crow's-foot cardinality for each relationship.",
    "Each table's grain is stated precisely in one sentence.",
    "Key checks are run and reported with numbers: unique primary keys and no orphan rows (or the orphans are listed).",
    "The normalisation issue identified is real, and the fix removes the repetition without losing information.",
    "The star schema has a single, clearly stated fact grain, sensible measures, a date dimension and dimension attributes that answer the questions.",
    "Slowly changing dimension choices are justified, and the model is shown to answer two of the stated questions.",
  ],
};
