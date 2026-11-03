import type { AssessmentDef } from "../types";

const C = "bookkeeping-small-business-finance";

type Q = AssessmentDef["questions"][number];
const q = (id: string, prompt: string, options: string[], answer: number, explanation: string): Q => ({ id, prompt, options, answer, explanation });

const check = (n: number, title: string, questions: Q[]): AssessmentDef => ({
  id: `bkp-m${String(n).padStart(2, "0")}-check`,
  courseId: C,
  kind: "module",
  moduleId: `bkp-m${String(n).padStart(2, "0")}`,
  title: `${title}: module check`,
  passingScore: 60,
  questions,
});

/** Bookkeeping & Small Business Finance: a check for each module (it awards the module badge) and a final assessment. */
export const BKP_ASSESSMENTS: AssessmentDef[] = [
  check(1, "Why Books Matter: Accounting Basics", [
    q("bkp-m01-q1", "Which equation must always balance?", ["Income = Expenses", "Assets = Liabilities + Equity", "Cash = Profit", "Sales = Costs"], 1, "The accounting equation."),
    q("bkp-m01-q2", "Assets ₦1,200,000 and liabilities ₦450,000. What is equity?", ["₦450,000", "₦750,000", "₦1,200,000", "₦1,650,000"], 1, "1,200,000 − 450,000."),
    q("bkp-m01-q3", "Money owed to a supplier is a:", ["Asset", "Liability", "Income", "Equity"], 1, "A payable is a liability."),
    q("bkp-m01-q4", "A sale of ₦80,000 on credit in March, paid in April, is income in March under:", ["Cash basis", "Accrual basis", "Neither", "Both"], 1, "Accrual records income when earned."),
    q("bkp-m01-q5", "Buying shelves for the shop is recorded as:", ["An expense", "An asset", "Income", "A liability"], 1, "Equipment is an asset, not an expense."),
  ]),
  check(2, "Double-Entry Bookkeeping", [
    q("bkp-m02-q1", "The owner invests ₦500,000 cash. What is the entry?", ["Dr Capital / Cr Cash", "Dr Cash / Cr Capital", "Dr Sales / Cr Cash", "Dr Cash / Cr Sales"], 1, "Cash up (debit), capital up (credit)."),
    q("bkp-m02-q2", "Which accounts increase with a debit?", ["Assets and expenses", "Liabilities and income", "Equity only", "Income only"], 0, "Assets and expenses are debit accounts."),
    q("bkp-m02-q3", "A credit sale of ₦80,000 is recorded as:", ["Dr Cash / Cr Sales", "Dr Receivables / Cr Sales", "Dr Sales / Cr Receivables", "Dr Payables / Cr Sales"], 1, "Receivable up, sales up."),
    q("bkp-m02-q4", "Debits to Cash total ₦700,000 and credits ₦290,000. What is the balance?", ["₦290,000 Cr", "₦410,000 Dr", "₦990,000 Dr", "₦410,000 Cr"], 1, "700,000 − 290,000 = 410,000 debit."),
    q("bkp-m02-q5", "A balanced trial balance proves:", ["There are no errors", "Debits equal credits, but some errors can remain", "Profit is correct", "Cash is correct"], 1, "Omissions and wrong-account errors do not show."),
  ]),
  check(3, "Recording Daily Transactions", [
    q("bkp-m03-q1", "Opening cash ₦410,000, receipts ₦150,000, payments ₦170,000. What is the closing balance?", ["₦390,000", "₦410,000", "₦430,000", "₦730,000"], 0, "410,000 + 150,000 − 170,000."),
    q("bkp-m03-q2", "Float ₦20,000 and vouchers ₦14,300. Cash remaining should be:", ["₦5,700", "₦14,300", "₦20,000", "₦34,300"], 0, "20,000 − 14,300."),
    q("bkp-m03-q3", "Which document is the evidence that payment was received?", ["Quotation", "Receipt", "Purchase order", "Delivery note"], 1, "A receipt."),
    q("bkp-m03-q4", "Before paying a supplier you should match:", ["Only the invoice", "Purchase order, delivery note and invoice", "The bank statement only", "Nothing"], 1, "Three-way match."),
    q("bkp-m03-q5", "A credit sale is later paid. The entry is:", ["Dr Cash / Cr Sales", "Dr Cash / Cr Receivables", "Dr Receivables / Cr Cash", "Dr Sales / Cr Cash"], 1, "Cash up, receivable down."),
  ]),
  check(4, "Bank and Account Reconciliation", [
    q("bkp-m04-q1", "Statement ₦421,500, deposit in transit ₦12,000, unpresented cheque ₦25,000. What is the adjusted bank balance?", ["₦384,500", "₦408,500", "₦434,500", "₦458,500"], 1, "421,500 + 12,000 − 25,000."),
    q("bkp-m04-q2", "Cashbook ₦410,000 and bank charges ₦1,500 not yet recorded. Adjusted cashbook?", ["₦408,500", "₦411,500", "₦410,000", "₦425,000"], 0, "410,000 − 1,500."),
    q("bkp-m04-q3", "A difference of 90 that is divisible by 9 suggests:", ["A missing entry", "A transposition error", "A reversal", "Fraud"], 1, "Swapped digits."),
    q("bkp-m04-q4", "How should you correct a wrong posting?", ["Use correction fluid", "Make a correcting journal entry with a narration", "Delete the entry", "Ignore it"], 1, "Keep the audit trail."),
    q("bkp-m04-q5", "An unpresented cheque is one that has been:", ["Recorded but not yet cleared by the bank", "Cleared but not recorded", "Lost", "Cancelled"], 0, "Timing difference."),
  ]),
  check(5, "Inventory, Assets and Adjustments", [
    q("bkp-m05-q1", "100 units at ₦1,000 then 100 at ₦1,200; 150 sold. FIFO cost of goods sold?", ["₦150,000", "₦160,000", "₦165,000", "₦180,000"], 1, "100,000 + 60,000."),
    q("bkp-m05-q2", "The weighted average cost per unit is:", ["₦1,000", "₦1,100", "₦1,200", "₦2,200"], 1, "220,000 ÷ 200."),
    q("bkp-m05-q3", "Equipment ₦120,000, 5 years, no residual. Monthly depreciation?", ["₦1,000", "₦2,000", "₦2,400", "₦24,000"], 1, "24,000 ÷ 12."),
    q("bkp-m05-q4", "Wages earned but unpaid at month-end are:", ["Ignored", "An accrued expense and a liability", "A prepayment", "Income"], 1, "Accrual."),
    q("bkp-m05-q5", "10% allowance on ₦30,000 receivables is:", ["₦300", "₦3,000", "₦30,000", "₦27,000"], 1, "0.10 × 30,000."),
  ]),
  check(6, "Financial Statements", [
    q("bkp-m06-q1", "Sales ₦230,000 and cost of goods sold ₦138,000. Gross profit?", ["₦68,000", "₦92,000", "₦138,000", "₦230,000"], 1, "230,000 − 138,000."),
    q("bkp-m06-q2", "Gross profit ₦92,000 and expenses ₦85,000. Net profit?", ["₦7,000", "₦15,000", "₦85,000", "₦177,000"], 0, "92,000 − 85,000."),
    q("bkp-m06-q3", "Total assets ₦617,000; liabilities ₦110,000. Equity must be:", ["₦507,000", "₦617,000", "₦727,000", "₦110,000"], 0, "617,000 − 110,000."),
    q("bkp-m06-q4", "The cash flow statement groups cash into:", ["Sales, costs, profit", "Operating, investing and financing", "Assets, liabilities, equity", "Debits and credits"], 1, "Three activity groups."),
    q("bkp-m06-q5", "Current assets ₦499,000 and current liabilities ₦110,000. Current ratio?", ["About 0.2", "About 2.2", "About 4.5", "About 5.5"], 2, "499 ÷ 110."),
  ]),
  check(7, "Budgeting, Cash Flow and Decisions", [
    q("bkp-m07-q1", "Budgeted sales ₦280,000; actual ₦260,000. The variance is:", ["+₦20,000", "−₦20,000 (adverse)", "−₦260,000", "+₦280,000"], 1, "Below budget is adverse."),
    q("bkp-m07-q2", "Opening ₦410,000, receipts ₦230,000, payments ₦300,000. Closing cash?", ["₦340,000", "₦410,000", "₦480,000", "₦940,000"], 0, "410 + 230 − 300."),
    q("bkp-m07-q3", "Fixed costs ₦82,000 and a 40% margin. Break-even sales?", ["₦32,800", "₦164,000", "₦205,000", "₦328,000"], 2, "82,000 ÷ 0.4."),
    q("bkp-m07-q4", "Item cost ₦6,000 sold at ₦10,000. The margin is:", ["40%", "50%", "60%", "66.7%"], 0, "4,000 ÷ 10,000."),
    q("bkp-m07-q5", "A ₦300,000 machine saves ₦100,000 a year. Payback?", ["1 year", "2 years", "3 years", "4 years"], 2, "300,000 ÷ 100,000."),
  ]),
  check(8, "Tax and Compliance in Nigeria", [
    q("bkp-m08-q1", "Output VAT ₦150,000 and input VAT ₦90,000 (practice figures). VAT payable?", ["₦60,000", "₦90,000", "₦150,000", "₦240,000"], 0, "150,000 − 90,000."),
    q("bkp-m08-q2", "Why should rates in this lesson be confirmed?", ["They never change", "Tax laws and rates change and apply differently", "They are secret", "They are the same for everyone"], 1, "Always confirm."),
    q("bkp-m08-q3", "VAT collected from customers is:", ["The business's profit", "A liability owed to the tax authority", "Income", "An expense"], 1, "It must be remitted."),
    q("bkp-m08-q4", "What is PAYE?", ["Tax on company profit", "Income tax employers deduct from pay and remit", "A bank charge", "A type of VAT"], 1, "Pay As You Earn."),
    q("bkp-m08-q5", "A supplier offers a discount for no invoice. You should:", ["Accept", "Refuse and insist on an invoice", "Hide it", "Pay in cash"], 1, "No evidence, no deduction, and a risk of penalties."),
  ]),
  check(9, "Tools: Spreadsheets and Accounting Software", [
    q("bkp-m09-q1", "Which formula totals amounts in E where column C says Sales?", ["=SUM(C:E)", "=SUMIF(C:C,\"Sales\",E:E)", "=COUNT(E:E)", "=IF(C1,E1)"], 1, "SUMIF."),
    q("bkp-m09-q2", "The 3-2-1 backup rule means:", ["3 copies, 2 types of storage, 1 off-site", "3 days, 2 weeks, 1 month", "3 passwords, 2 keys, 1 lock", "3 users, 2 roles, 1 admin"], 0, "A resilient approach."),
    q("bkp-m09-q3", "Why separate duties in the books?", ["To slow down", "So one person cannot record, approve and hide mistakes or fraud", "It is required for software", "To save paper"], 1, "Internal control."),
    q("bkp-m09-q4", "What does 'garbage in, garbage out' mean for software?", ["Software cleans bad data", "Wrong data entered gives wrong reports", "Old files are deleted", "Trash must be emptied"], 1, "Data quality matters."),
    q("bkp-m09-q5", "When should a backup be tested?", ["Never", "By restoring from it", "Only when lost", "By printing"], 1, "Test the restore."),
  ]),
  check(10, "Final Project: A Set of Books", [
    q("bkp-m10-q1", "Which check shows the balance sheet is right?", ["Assets equal liabilities plus equity", "It has many lines", "It has the logo", "Profit is large"], 0, "It must balance."),
    q("bkp-m10-q2", "Closing cash on the cash flow statement must equal:", ["Net profit", "The cash balance in the ledger and balance sheet", "Sales", "Capital"], 1, "Cash must agree."),
    q("bkp-m10-q3", "Net profit on the profit and loss is added to equity:", ["On the balance sheet", "Never", "Only in tax", "Only in the cashbook"], 0, "Retained profit."),
    q("bkp-m10-q4", "Sales ₦300,000 and cost of goods ₦180,000. Gross margin?", ["30%", "40%", "50%", "60%"], 1, "120 ÷ 300."),
    q("bkp-m10-q5", "What should the report note about tax?", ["Nothing", "That current rules and rates must be confirmed", "That tax is optional", "A fixed rate"], 1, "Confirm current rules."),
  ]),
  {
    id: `${C}-final`,
    courseId: C,
    kind: "final",
    title: "Bookkeeping & Small Business Finance: final assessment",
    passingScore: 60,
    questions: [
      q("bkp-f01", "Assets of ₦700,000 and liabilities of ₦200,000 give equity of:", ["₦200,000", "₦500,000", "₦700,000", "₦900,000"], 1, "700,000 − 200,000."),
      q("bkp-f02", "Which accounts are increased by a credit?", ["Assets and expenses", "Liabilities, equity and income", "Only cash", "Only expenses"], 1, "Credit accounts."),
      q("bkp-f03", "The entry for a cash sale of ₦150,000 is:", ["Dr Sales / Cr Cash", "Dr Cash / Cr Sales", "Dr Receivables / Cr Sales", "Dr Cash / Cr Capital"], 1, "Cash up, sales up."),
      q("bkp-f04", "A trial balance with debits of ₦830,000 and credits of ₦830,000:", ["Proves no errors", "Balances, but some errors may remain", "Is wrong", "Shows profit"], 1, "It balances only arithmetically."),
      q("bkp-f05", "Statement ₦421,500 + ₦12,000 − ₦25,000 equals:", ["₦384,500", "₦408,500", "₦434,500", "₦458,500"], 1, "Adjusted bank balance."),
      q("bkp-f06", "Equipment ₦120,000, 5 years. Net book value after 1 month:", ["₦96,000", "₦118,000", "₦120,000", "₦122,000"], 1, "120,000 − 2,000."),
      q("bkp-f07", "A prepayment of ₦90,000 rent for 3 months: after one month, the prepayment is:", ["₦30,000", "₦60,000", "₦90,000", "₦0"], 1, "90,000 − 30,000."),
      q("bkp-f08", "Sales ₦230,000, cost of goods ₦138,000, expenses ₦85,000. Net profit?", ["₦7,000", "₦15,000", "₦92,000", "₦170,000"], 0, "230 − 138 − 85."),
      q("bkp-f09", "Gross margin on those figures is:", ["30%", "40%", "50%", "60%"], 1, "92 ÷ 230."),
      q("bkp-f10", "Fixed costs ₦82,000 and a 40% margin. Break-even sales?", ["₦164,000", "₦205,000", "₦246,000", "₦328,000"], 1, "82,000 ÷ 0.4."),
      q("bkp-f11", "Profit differs from cash flow mainly because of:", ["Timing: stock, receivables, payables and accruals", "Luck", "Tax only", "Capital only"], 0, "Timing differences."),
      q("bkp-f12", "VAT collected from customers should be:", ["Spent freely", "Kept aside and remitted as a liability", "Treated as profit", "Ignored"], 1, "It is owed to the tax authority."),
      q("bkp-f13", "Which is the best backup rule?", ["One copy on the laptop", "3-2-1", "A paper copy only", "Email it to yourself"], 1, "Three copies, two types, one off-site."),
      q("bkp-f14", "Before relying on any tax figure in your books you should:", ["Guess", "Confirm current rules with the tax authority or an accountant", "Copy a friend", "Ignore it"], 1, "Rules change."),
      q("bkp-f15", "Opening cash ₦410,000, receipts ₦230,000, payments ₦300,000. Closing cash?", ["₦340,000", "₦410,000", "₦480,000", "₦940,000"], 0, "410 + 230 − 300."),
    ],
  },
];
