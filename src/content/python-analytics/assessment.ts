import type { AssessmentDef } from "../types";

/**
 * Final assessment for Python for Data Analytics. Questions are scenarios with plausible
 * wrong answers: each tests whether the learner can apply a lesson, not recognise its words.
 */
export const PYAN_ASSESSMENT: AssessmentDef = {
  id: "python-for-data-analytics-final",
  courseId: "python-for-data-analytics",
  title: "Python for Data Analytics: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "pyanq01",
      prompt: "A CSV's phone column shows numbers like 8031234567 after loading: the leading 0 is gone. What should you have done?",
      options: ["Used pd.read_csv(..., dtype=str) and converted columns deliberately", "Used pd.to_numeric on the column", "Sorted the column first", "Opened the file in Excel first"],
      answer: 0,
      explanation: "pandas guessed the column was a number. Loading as text keeps it exactly as written.",
    },
    {
      id: "pyanq02",
      prompt: "Which line keeps order lines from 2026 with 20 or more cartons?",
      options: [
        'orders[orders["order_date"] >= "2026-01-01" and orders["quantity"] >= 20]',
        'orders[(orders["order_date"] >= "2026-01-01") & (orders["quantity"] >= 20)]',
        'orders[orders["order_date"] >= "2026-01-01" & orders["quantity"] >= 20]',
        'orders[(orders["order_date"] >= "2026-01-01") | (orders["quantity"] >= 20)]',
      ],
      answer: 1,
      explanation: "& with each condition in brackets. 'and' fails on Series, missing brackets give the wrong precedence, and | means 'or'.",
    },
    {
      id: "pyanq03",
      prompt: 'orders["order_date"].dt.month raises "Can only use .dt accessor with datetimelike values". What is the fix?',
      options: ['orders["order_date"].astype(int)', 'orders["order_date"] = pd.to_datetime(orders["order_date"])', 'orders["order_date"].str.month', "Restart the session"],
      answer: 1,
      explanation: "The dates are still text; .dt needs real dates.",
    },
    {
      id: "pyanq04",
      prompt: "A customer export has dates like 03/01/2023, meaning 3 January. Which conversion is right?",
      options: ['pd.to_datetime(col)', 'pd.to_datetime(col, dayfirst=True)', 'pd.to_datetime(col, format="%m/%d/%Y")', "col.str.replace('/', '-')"],
      answer: 1,
      explanation: "Without dayfirst=True the value can be read as 1 March. The explicit month-first format is wrong for this data.",
    },
    {
      id: "pyanq05",
      prompt: "Three customers have a blank credit limit. A colleague runs fillna(0) and reports the average limit. What's wrong?",
      options: ["Nothing: blanks must be filled", "The average is pulled down by zeros that aren't real limits; the limits are unknown, not zero", "fillna only works on text", "The average should be a median"],
      answer: 1,
      explanation: "Leave unknown values as NaN (mean skips them) and report them.",
    },
    {
      id: "pyanq06",
      prompt: "After merging customers onto 4,266 orders you have 4,301 rows. What most likely happened?",
      options: ["35 orders had no customer", "Some customer_ids appear twice in customers, so their orders were duplicated", "The merge added the header", "how=\"left\" always adds rows"],
      answer: 1,
      explanation: "Duplicate keys in the lookup table multiply rows. validate=\"many_to_one\" would have stopped the merge.",
    },
    {
      id: "pyanq07",
      prompt: "You want each order line to keep its row even if its product is missing from products.csv. Which merge?",
      options: ['orders.merge(products, on="product_id", how="inner")', 'orders.merge(products, on="product_id", how="left")', 'products.merge(orders, on="product_id", how="left")', 'pd.concat([orders, products])'],
      answer: 1,
      explanation: "A left merge from orders keeps every order; a missing product shows as a blank you can find.",
    },
    {
      id: "pyanq08",
      prompt: 'What does orders.groupby("customer_id")["revenue"].sum().idxmax() return?',
      options: ["The largest revenue figure", "The customer_id with the highest total revenue", "The row number of the biggest order", "A table of customers sorted by revenue"],
      answer: 1,
      explanation: "idxmax gives the label (here the customer_id) of the largest value; max would give the figure.",
    },
    {
      id: "pyanq09",
      prompt: "Operations lost 5 of 27 staff; Customer Service lost 3 of 8. What should the report say?",
      options: ["Operations has the bigger attrition problem: 5 is more than 3", "Customer Service has the higher resignation rate (38% against 19%)", "They're the same", "You can't compare departments"],
      answer: 1,
      explanation: "Compare rates when groups differ in size.",
    },
    {
      id: "pyanq10",
      prompt: "Monthly data runs from January 2025 to June 2026. Which comparison shows growth fairly?",
      options: ["Total 2026 against total 2025", "H1 2026 against H1 2025", "June 2026 against January 2025", "The best month against the worst month"],
      answer: 1,
      explanation: "Same months, same length, so seasonality and period length cancel out.",
    },
    {
      id: "pyanq11",
      prompt: "monthly is a Series of monthly revenue. What does monthly.pct_change(12) give for June 2026?",
      options: ["The change from May 2026", "The change from June 2025", "The average of the last 12 months", "The change from January 2025"],
      answer: 1,
      explanation: "12 periods back on monthly data is the same month last year.",
    },
    {
      id: "pyanq12",
      prompt: "Leavers earn less than stayers overall, but at each job level their pay is about the same. What do you conclude?",
      options: ["People leave over pay", "The overall gap comes from juniors leaving more and earning less; pay doesn't explain who leaves", "The data is wrong", "Seniors are overpaid"],
      answer: 1,
      explanation: "Compare within levels to remove the effect of level itself.",
    },
    {
      id: "pyanq13",
      prompt: "Which chart title is best for a manager?",
      options: ["Revenue by region (H1)", "Figure 2: regional analysis", "North West revenue fell 47% in H1 2026 while South West grew 79%", "Regional revenue growth chart"],
      answer: 2,
      explanation: "An action title states the finding so the reader can't miss it.",
    },
    {
      id: "pyanq14",
      prompt: "A region fell ₦14.5m and two of its customers fell ₦12.9m between them. What's the best recommendation?",
      options: ["A regional marketing campaign", "Contact those two customers to find out what changed", "Close the region", "Wait for another quarter of data"],
      answer: 1,
      explanation: "When a few customers explain a total, act on the customers.",
    },
    {
      id: "pyanq15",
      prompt: "Your notebook works, but only when you run cell 7 before cell 4. Is it ready to share?",
      options: ["Yes, if you tell people the order", "No: it should run top to bottom with Run all, so anyone can reproduce it", "Yes, Colab remembers the order", "Only if it has charts"],
      answer: 1,
      explanation: "Reproducibility is the main reason to do analysis in code.",
    },
  ],
};
