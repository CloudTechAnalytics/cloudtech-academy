import type { AssessmentDef } from "../types";

const C = "python-for-data-analysis";

/**
 * pandas Quick Start: a check for each module (it awards the module badge, and unlocks only
 * after the module's tasks are done) and a final assessment. Questions ask what code does,
 * with plausible wrong answers.
 */
export const PYDA_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "pyda-m01-check",
    courseId: C,
    kind: "module",
    moduleId: "pyda-m01",
    title: "Load and Explore Data: module check",
    passingScore: 60,
    questions: [
      { id: "pyda-m01-q1", prompt: "orders.shape returns (4266, 7). What does that mean?", options: ["4,266 columns and 7 rows", "4,266 rows and 7 columns", "4,266 customers", "7 files"], answer: 1, explanation: "shape is (rows, columns)." },
      { id: "pyda-m01-q2", prompt: "Which line selects two columns as a table?", options: ["orders[\"order_date\", \"quantity\"]", "orders[[\"order_date\", \"quantity\"]]", "orders.order_date.quantity", "orders(\"order_date\", \"quantity\")"], answer: 1, explanation: "Pass a list of names: double brackets." },
      { id: "pyda-m01-q3", prompt: "info() shows order_date as object. What does that tell you?", options: ["Dates are missing", "The dates are stored as text and need converting", "The column is numeric", "The file is corrupt"], answer: 1, explanation: "object usually means text; pd.to_datetime converts it." },
      { id: "pyda-m01-q4", prompt: "Which tells you how many times each discount level appears?", options: ["orders[\"discount_pct\"].sum()", "orders[\"discount_pct\"].value_counts()", "orders[\"discount_pct\"].max()", "len(orders)"], answer: 1, explanation: "value_counts counts each distinct value." },
      { id: "pyda-m01-q5", prompt: "orders[\"customer_id\"].count() gives 4,266 and .nunique() gives 90. What's the difference?", options: ["They're the same", "count counts filled-in values; nunique counts different values", "nunique counts rows", "count removes duplicates"], answer: 1, explanation: "90 customers placed 4,266 order lines." },
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
      { id: "pyda-m02-q1", prompt: "Which line adds a revenue column after discount?", options: ["orders[\"revenue\"] = orders[\"quantity\"] * orders[\"unit_price\"] * (1 - orders[\"discount_pct\"] / 100)", "orders[\"revenue\"] = orders.sum()", "for row in orders: revenue = quantity * price", "orders.revenue == quantity * unit_price"], answer: 0, explanation: "Column arithmetic works on every row at once." },
      { id: "pyda-m02-q2", prompt: "Which filter keeps 2026 lines with any discount?", options: ["orders[orders[\"discount_pct\"] > 0 and orders[\"year\"] == 2026]", "orders[(orders[\"discount_pct\"] > 0) & (orders[\"year\"] == 2026)]", "orders[orders[\"discount_pct\"] > 0 & orders[\"year\"] == 2026]", "orders[(orders[\"discount_pct\"] > 0) | (orders[\"year\"] == 2026)]"], answer: 1, explanation: "& with brackets around each condition; | would mean or." },
      { id: "pyda-m02-q3", prompt: "orders[\"order_date\"].dt.year raises 'Can only use .dt accessor with datetimelike values'. Why?", options: ["The dates are in the future", "The column is still text; convert with pd.to_datetime first", "Years can't be extracted", "You need numpy"], answer: 1, explanation: ".dt needs real dates." },
      { id: "pyda-m02-q4", prompt: "What does orders.isna().sum() show?", options: ["The total of every column", "How many missing values each column has", "The number of rows", "Duplicate rows"], answer: 1, explanation: "A quick check worth running on any dataset." },
      { id: "pyda-m02-q5", prompt: "How do you show the five biggest order lines by revenue?", options: ["orders.head(5)", "orders.sort_values(\"revenue\", ascending=False).head(5)", "orders.sort_values(\"revenue\").head(5)", "orders[\"revenue\"].max(5)"], answer: 1, explanation: "Sort largest first, then take five." },
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
      { id: "pyda-m03-q1", prompt: "What does sales.groupby(\"region\")[\"revenue\"].sum() return?", options: ["Total revenue as one number", "One row per region with its total revenue", "The first sale in each region", "Regions sorted alphabetically with no numbers"], answer: 1, explanation: "groupby splits, sums each group, combines." },
      { id: "pyda-m03-q2", prompt: "Why merge products into orders?", options: ["To delete duplicates", "To bring product names and categories onto each order line by matching product_id", "To sort the orders", "To make the file smaller"], answer: 1, explanation: "merge is a lookup on a shared key." },
      { id: "pyda-m03-q3", prompt: "Which chart suits revenue by region?", options: ["A line chart", "A horizontal bar chart, sorted", "A pie chart with 20 slices", "A scatter plot"], answer: 1, explanation: "Bars compare categories; lines show change over time." },
      { id: "pyda-m03-q4", prompt: "2026 revenue looks much lower than 2025. What should you check first?", options: ["Whether pandas is broken", "Whether both years cover the same months; the data ends in June 2026", "The chart colours", "Nothing, it's a fall"], answer: 1, explanation: "Compare like with like." },
      { id: "pyda-m03-q5", prompt: "What makes a notebook useful to a manager?", options: ["More code cells", "Text cells explaining in plain words what each result shows", "Bigger fonts", "No charts"], answer: 1, explanation: "Findings in words, not just code." },
    ],
  },
  {
    id: "python-for-data-analysis-final",
    courseId: C,
    kind: "final",
    title: "pandas Quick Start: final assessment",
    passingScore: 60,
    questions: [
      { id: "pyda-f01", prompt: "Which line loads a CSV from a web address into a DataFrame?", options: ["pd.open(url)", "pd.read_csv(url)", "import url", "pd.DataFrame.load(url)"], answer: 1, explanation: "read_csv reads from a path or URL." },
      { id: "pyda-f02", prompt: "What does orders.describe() give you?", options: ["Column names only", "Count, mean, min, quartiles and max for number columns", "The first five rows", "Missing values"], answer: 1, explanation: "A quick statistical summary." },
      { id: "pyda-f03", prompt: "How do you convert text dates to real dates?", options: ["orders[\"order_date\"].astype(int)", "pd.to_datetime(orders[\"order_date\"])", "orders[\"order_date\"].dt", "str(orders[\"order_date\"])"], answer: 1, explanation: "Then .dt gives the year, month and more." },
      { id: "pyda-f04", prompt: "Which keeps order lines with 20 or more cartons?", options: ["orders[orders[\"quantity\"] >= 20]", "orders[\"quantity\"] >= 20", "orders.filter(20)", "orders.quantity(20)"], answer: 0, explanation: "The condition inside orders[...] filters the rows." },
      { id: "pyda-f05", prompt: "Which gives total revenue per channel?", options: ["sales[\"channel\"].sum()", "sales.groupby(\"channel\")[\"revenue\"].sum()", "sales.sum(\"channel\")", "sales.channel.revenue"], answer: 1, explanation: "Group by channel, sum revenue." },
      { id: "pyda-f06", prompt: "What does merge(customers, on=\"customer_id\") do?", options: ["Adds customer details to each row with the same customer_id", "Deletes customers without orders", "Sorts by customer", "Counts customers"], answer: 0, explanation: "A lookup on a shared key." },
      { id: "pyda-f07", prompt: "Which chart shows monthly revenue over time best?", options: ["Bar chart of regions", "Line chart", "Pie chart", "Table only"], answer: 1, explanation: "Lines show trends over time." },
      { id: "pyda-f08", prompt: "Which line shows the three products with the highest revenue?", options: ["sales.groupby(\"product_name\")[\"revenue\"].sum().nlargest(3)", "sales.head(3)", "sales[\"product_name\"].value_counts().head(3)", "sales.max(3)"], answer: 0, explanation: "value_counts counts lines, not revenue." },
    ],
  },
];
