import type { ProjectDef } from "../types";

export const BKP_PROJECT: ProjectDef = {
  id: "bkp-set-of-books",
  courseId: "bookkeeping-small-business-finance",
  title: "A set of books for a small business",
  required: true,
  summary: "Record a month of transactions for a small business, adjust and balance the books, prepare the three financial statements and report on the results.",
  brief: `Choose a simple business you understand, give it a name and invent a realistic month of at least 12 transactions in naira, including the owner's investment, equipment, stock on credit, cash and credit sales with cost of goods sold, rent, wages, a supplier payment and a customer receipt. Record it from start to finish.

Make the numbers tie together. Submit a link to your books (a spreadsheet, document or PDF) and paste your **net profit**, your **total assets** and your **closing cash** below, with a short note on where to find each part.

Write for the owner: show every working so a reader can check your figures, and add a reminder that tax rates and rules must be confirmed with the tax authority or an accountant.`,
  tasks: [
    "The business and the numbered list of at least 12 transactions with dates and amounts.",
    "The journal: a Dr and Cr entry for every transaction, including cost of goods sold.",
    "The ledger balances and a trial balance whose debits equal its credits.",
    "Adjustments: depreciation, an accrued expense, a prepayment or an allowance for doubtful debts, each with a journal entry.",
    "The profit and loss statement, balance sheet (balanced) and cash flow statement (agreeing with the cash balance).",
    "Analysis: gross margin, net margin, current ratio and break-even sales.",
    "A short report to the owner with three insights, three recommendations and a note on tax and records.",
  ],
  datasets: [],
  rubric: [
    "Every transaction is recorded correctly with equal debits and credits, and cost of goods sold is included.",
    "The trial balance balances and the adjustments are correct and explained.",
    "The profit and loss, balance sheet and cash flow statement are correct and agree with each other.",
    "Ratios and break-even are calculated correctly with the workings shown.",
    "The report explains the results in plain language, with realistic insights and recommendations.",
    "Records and tax points are sensible, and the report says current tax rules must be confirmed.",
  ],
};
