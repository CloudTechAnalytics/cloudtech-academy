import type { AssessmentDef } from "../types";

/**
 * Final assessment for Power BI DAX. Scenario questions: each tests whether the learner can
 * predict what a measure returns or choose the right pattern, not recall syntax.
 */
export const DAX_ASSESSMENT: AssessmentDef = {
  id: "power-bi-dax-final",
  courseId: "power-bi-dax",
  title: "Power BI DAX: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "daxq01",
      prompt: "A calculated column on customers, Total = SUM(orders[amount]), shows the same number on every row. What's the fix?",
      options: ["Change the data type", "Use CALCULATE(SUM(orders[amount])) or a measure reference, so context transition filters each customer", "Mark the date table", "Make the relationship bidirectional"],
      answer: 1,
      explanation: "Row context doesn't filter; context transition does.",
    },
    {
      id: "daxq02",
      prompt: "Which measure gives the average revenue per customer who bought in the current period?",
      options: ["AVERAGE(orders[revenue])", "AVERAGEX(VALUES(orders[customer_id]), [Revenue])", "DIVIDE([Revenue], COUNTROWS(orders))", "SUMX(customers, [Revenue])"],
      answer: 1,
      explanation: "Iterate the customers; context transition gives each one's revenue.",
    },
    {
      id: "daxq03",
      prompt: "In a table by region, CALCULATE([Revenue], customers[region] = \"Lagos\") shows Lagos revenue on every row. Which change shows Lagos revenue on the Lagos row only?",
      options: ["Use ALL(customers)", "Wrap the condition in KEEPFILTERS", "Use REMOVEFILTERS", "Use RELATED"],
      answer: 1,
      explanation: "KEEPFILTERS intersects with the row's filter instead of replacing it.",
    },
    {
      id: "daxq04",
      prompt: "Which denominator gives each product's share of its own category, in a matrix of category then product?",
      options: ["CALCULATE([Revenue], ALL(products))", "CALCULATE([Revenue], ALLEXCEPT(products, products[category]))", "CALCULATE([Revenue], ALL(customers))", "CALCULATE([Revenue], ALLSELECTED(customers))"],
      answer: 1,
      explanation: "Remove the product filter, keep the category.",
    },
    {
      id: "daxq05",
      prompt: "VAR Sales = [Revenue] RETURN CALCULATE(Sales, 'Date'[Year] = 2025). In a 2026 card, what does it show?",
      options: ["2025 revenue", "2026 revenue: the variable was already calculated, so CALCULATE can't change it", "Blank", "An error"],
      answer: 1,
      explanation: "Variables are evaluated where they're defined.",
    },
    {
      id: "daxq06",
      prompt: "Data runs to 30 June 2026. At year level, CALCULATE([Revenue], SAMEPERIODLASTYEAR('Date'[Date])) for 2026 returns:",
      options: ["January to June 2025", "All of 2025, so six months are compared with twelve", "Blank", "All of 2024"],
      answer: 1,
      explanation: "Limit the current dates to those with sales before shifting them.",
    },
    {
      id: "daxq07",
      prompt: "Which filter returns the three months ending on the last date in the current context?",
      options: ["DATESYTD('Date'[Date])", "DATESINPERIOD('Date'[Date], MAX('Date'[Date]), -3, MONTH)", "DATEADD('Date'[Date], -3, MONTH)", "PREVIOUSMONTH('Date'[Date])"],
      answer: 1,
      explanation: "DATEADD shifts a period; DATESINPERIOD builds a window.",
    },
    {
      id: "daxq08",
      prompt: "CALCULATE(DISTINCTCOUNT(products[category])) inside FILTER over customers returns 4 for every customer. Why?",
      options: ["Every customer buys every category", "Filters flow from products to orders, not back, so the customer filter never reaches products", "DISTINCTCOUNT ignores CALCULATE", "The model has no relationships"],
      answer: 1,
      explanation: "Count through the fact table: COUNTROWS(SUMMARIZE(orders, products[category])).",
    },
    {
      id: "daxq09",
      prompt: "RANKX(customers, [Revenue]) gives every customer a rank of 1 in a table by customer name. What's wrong?",
      options: ["RANKX needs DENSE", "The table argument is filtered to the current customer; use ALL(customers[customer_name])", "Revenue is a column", "Ranks only work in matrices"],
      answer: 1,
      explanation: "Rank against all customers, not the one in the row's filter.",
    },
    {
      id: "daxq10",
      prompt: "A rank measure shows 1 on the total row. How do you blank it?",
      options: ["IF(ISINSCOPE(customers[customer_name]), RANKX(…))", "Use DENSE", "Format as blank", "Use ALLSELECTED"],
      answer: 0,
      explanation: "ISINSCOPE is true only when the visual groups by that column.",
    },
    {
      id: "daxq11",
      prompt: "A 'Customers to Date' measure uses CALCULATE(DISTINCTCOUNT(orders[customer_id]), 'Date'[Date] <= LastDay) and shows only this month's customers in a matrix by Year Month. What's missing?",
      options: ["A relationship", "REMOVEFILTERS('Date'), so the Year Month filter from the visual is removed", "KEEPFILTERS", "A calculated column"],
      answer: 1,
      explanation: "Remove all date filters, then add exactly the dates you want.",
    },
    {
      id: "daxq12",
      prompt: "Revenue grew ₦46.6m. Price Effect is ₦24.7m. If the measures are right, what must Volume Effect be?",
      options: ["₦46.6m", "₦21.9m", "₦24.7m", "₦71.3m"],
      answer: 1,
      explanation: "Price and volume effects add up to the total growth: 46.6 − 24.7 = 21.9.",
    },
    {
      id: "daxq13",
      prompt: "Which rewrite usually makes CALCULATE([Revenue], FILTER(orders, RELATED(customers[channel]) = \"Kiosk\")) faster?",
      options: ["Add IFERROR", "CALCULATE([Revenue], customers[channel] = \"Kiosk\")", "Make the relationship bidirectional", "Add + 0"],
      answer: 1,
      explanation: "Filter a column, not the whole fact table.",
    },
    {
      id: "daxq14",
      prompt: "Performance Analyzer shows a visual spending most of its time in 'DAX query'. What should you examine?",
      options: ["The visual's formatting", "The measures and model behind the visual", "The page background", "The report theme"],
      answer: 1,
      explanation: "DAX query time is calculation time.",
    },
    {
      id: "daxq15",
      prompt: "Data starts in January 2025. A New Customers measure (first ever order in the period) shows 81 for 2025. What should the report say?",
      options: ["We won 81 customers in 2025", "2025 can't be measured: orders before the data starts aren't visible, so every 2025 customer looks new", "The measure is broken", "We lost 81 customers"],
      answer: 1,
      explanation: "That's left-censoring. Only trust the measure after the start of the data.",
    },
  ],
};
