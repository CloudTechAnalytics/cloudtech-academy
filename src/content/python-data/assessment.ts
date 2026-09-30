import type { AssessmentDef } from "../types";

const C = "python-for-data-analysis";

/** Python for Data Analysis: a check for each module (it awards the module badge) and a final assessment. */
export const PYDA_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "pyda-m01-check",
    courseId: C,
    kind: "module",
    moduleId: "pyda-m01",
    title: "Load and Explore Data: module check",
    passingScore: 60,
    questions: [
      { id: "pyda-m01-q1", prompt: "Which function loads a CSV file into pandas?", options: ["pd.read_csv()", "pd.open()", "pd.load_excel()", "print()"], answer: 0, explanation: "read_csv reads a CSV from a file or web address." },
      { id: "pyda-m01-q2", prompt: "What does orders.shape return?", options: ["The number of rows and columns", "The first 5 rows", "The column types", "The total revenue"], answer: 0, explanation: "For this dataset it's (4266, 7)." },
      { id: "pyda-m01-q3", prompt: "Which method shows column types and missing values?", options: ["info()", "head()", "shape", "value_counts()"], answer: 0, explanation: "info() summarises each column." },
      { id: "pyda-m01-q4", prompt: "What does describe() give you?", options: ["Quick statistics for number columns", "A chart", "A merged table", "A list of files"], answer: 0, explanation: "Count, mean, min, max and quartiles." },
      { id: "pyda-m01-q5", prompt: "How do you select two columns?", options: ["orders[[\"order_date\", \"quantity\"]]", "orders[\"order_date\", \"quantity\"]", "orders.order_date.quantity", "orders(2)"], answer: 0, explanation: "Pass a list of names, hence the double brackets." },
    ],
  },
  {
    id: "pyda-m02-check",
    courseId: C,
    kind: "module",
    moduleId: "pyda-m02",
    title: "Clean, Filter and Calculate: module check",
    passingScore: 60,
    questions: [
      { id: "pyda-m02-q1", prompt: "Why convert order_date with pd.to_datetime()?", options: ["So you can sort and group by dates properly", "To make the file smaller", "To delete old orders", "To change the currency"], answer: 0, explanation: "Text dates can't be grouped by month or year reliably." },
      { id: "pyda-m02-q2", prompt: "How is revenue calculated in this dataset?", options: ["quantity × unit_price × (1 − discount_pct/100)", "quantity + unit_price", "unit_price − discount_pct", "quantity × discount_pct"], answer: 0, explanation: "Price times quantity, less the discount." },
      { id: "pyda-m02-q3", prompt: "Which keeps only rows where quantity is at least 20?", options: ["orders[orders[\"quantity\"] >= 20]", "orders[\"quantity\"] = 20", "orders.head(20)", "orders.sort_values(20)"], answer: 0, explanation: "A condition inside square brackets filters rows." },
      { id: "pyda-m02-q4", prompt: "How do you combine two filter conditions with 'and'?", options: ["(cond1) & (cond2)", "cond1 and cond2 without brackets", "cond1 + cond2", "cond1, cond2"], answer: 0, explanation: "Use & with brackets around each condition." },
      { id: "pyda-m02-q5", prompt: "What does orders.isna().sum() show?", options: ["Missing values in each column", "Total revenue", "Duplicate rows", "The number of columns"], answer: 0, explanation: "It counts missing values per column." },
    ],
  },
  {
    id: "pyda-m03-check",
    courseId: C,
    kind: "module",
    moduleId: "pyda-m03",
    title: "Group, Join and Chart: module check",
    passingScore: 60,
    questions: [
      { id: "pyda-m03-q1", prompt: "What is groupby most like in Excel?", options: ["A pivot table", "A chart title", "Conditional formatting", "Freeze panes"], answer: 0, explanation: "Both summarise values by group." },
      { id: "pyda-m03-q2", prompt: "Why do you need merge in this course?", options: ["To bring product and customer details into the orders table", "To delete columns", "To sort by date", "To make charts"], answer: 0, explanation: "Orders only store IDs; merge adds names, categories and regions." },
      { id: "pyda-m03-q3", prompt: "Which region brings in the most revenue?", options: ["Lagos", "South East", "North Central", "South South"], answer: 0, explanation: "Lagos brings in about half of all revenue." },
      { id: "pyda-m03-q4", prompt: "Which chart suits a trend over time?", options: ["A line chart", "A pie chart", "A table", "A horizontal bar chart"], answer: 0, explanation: "Lines show change over time." },
      { id: "pyda-m03-q5", prompt: "Why does 2026 revenue look smaller than 2025?", options: ["The data stops at the end of June 2026", "Sales collapsed", "A column is missing", "Revenue was calculated wrongly"], answer: 0, explanation: "Always check the date range before comparing periods." },
    ],
  },
  {
    id: "python-for-data-analysis-final",
    courseId: C,
    kind: "final",
    title: "Python for Data Analysis: final assessment",
    passingScore: 60,
    questions: [
      { id: "pyda-f01", prompt: "What is a pandas DataFrame?", options: ["A table with rows and named columns", "A chart", "A type of loop", "A Colab notebook"], answer: 0, explanation: "DataFrames are pandas' tables." },
      { id: "pyda-f02", prompt: "Which shows the first 5 rows?", options: ["orders.head()", "orders.tail()", "orders.shape", "orders.info()"], answer: 0, explanation: "head() shows the first rows; tail() the last." },
      { id: "pyda-f03", prompt: "Which counts how often each value appears in a column?", options: ["value_counts()", "sum()", "describe()", "merge()"], answer: 0, explanation: "Useful for categories like discount_pct." },
      { id: "pyda-f04", prompt: "How do you add a new column?", options: ["orders[\"revenue\"] = …", "orders.add(\"revenue\")", "new orders.revenue", "orders + revenue"], answer: 0, explanation: "Assign to a new column name." },
      { id: "pyda-f05", prompt: "Which sorts the biggest revenue first?", options: ["sort_values(\"revenue\", ascending=False)", "sort_values(\"revenue\")", "groupby(\"revenue\")", "head(\"revenue\")"], answer: 0, explanation: "ascending=False puts largest first." },
      { id: "pyda-f06", prompt: "What does sales.groupby(\"category\")[\"revenue\"].sum() give?", options: ["Total revenue for each category", "The number of categories", "Revenue for one order", "A merged table"], answer: 0, explanation: "Group, pick a column, then summarise." },
      { id: "pyda-f07", prompt: "Which category had the highest revenue?", options: ["Household", "Snacks", "Beverages", "Personal care"], answer: 0, explanation: "Household led with about ₦244.8 million." },
      { id: "pyda-f08", prompt: "What turns a notebook into a portfolio project?", options: ["Clear text explaining findings, shared via GitHub or a link", "More code with no comments", "Deleting the charts", "Keeping it private"], answer: 0, explanation: "Explain what you found in plain words and share it." },
    ],
  },
];
