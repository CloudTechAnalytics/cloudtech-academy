import type { AssessmentDef } from "../types";

/**
 * Final assessment for Advanced SQL. Scenario questions: each tests whether the learner can
 * spot the trap or choose the right pattern, not recall syntax.
 */
export const ASQL_ASSESSMENT: AssessmentDef = {
  id: "advanced-sql-final",
  courseId: "advanced-sql",
  title: "Advanced SQL: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "asqlq01",
      prompt: "SELECT COUNT(*) FROM staff WHERE department <> 'Sales' returns 140. The table has 200 staff, 45 of them in Sales. What explains the gap?",
      options: ["COUNT(*) skips duplicates", "15 staff have a NULL department, and NULL <> 'Sales' is unknown, so WHERE drops them", "<> is case-sensitive", "The query needs GROUP BY"],
      answer: 1,
      explanation: "200 − 45 = 155 expected; the 15 NULLs are missing. Add OR department IS NULL.",
    },
    {
      id: "asqlq02",
      prompt: "WHERE customer_id NOT IN (SELECT customer_id FROM orders) returns no rows, but you know some customers have never ordered. Why?",
      options: ["NOT IN only works on numbers", "orders.customer_id contains a NULL, which makes every NOT IN comparison unknown", "The subquery is too large", "Customers must be sorted first"],
      answer: 1,
      explanation: "Use NOT EXISTS, which isn't affected by NULLs.",
    },
    {
      id: "asqlq03",
      prompt: "SUM(is_late) / COUNT(*) returns 0 in PostgreSQL, though 12% of orders are late. What's the fix?",
      options: ["Use AVG(COUNT(*))", "Multiply by 100.0 (or 1.0) before dividing, to avoid integer division", "Use ROUND", "Add GROUP BY"],
      answer: 1,
      explanation: "A whole number divided by a whole number is truncated to a whole number.",
    },
    {
      id: "asqlq04",
      prompt: "A monthly GROUP BY returns 10 rows for a 12-month report. The manager wants all 12, with zeros. What do you do?",
      options: ["Insert fake rows into the table", "Generate the 12 months (a calendar or recursive CTE), LEFT JOIN the totals and COALESCE to 0", "Use HAVING COUNT(*) >= 0", "Use ORDER BY month"],
      answer: 1,
      explanation: "GROUP BY can't create groups that don't exist in the data.",
    },
    {
      id: "asqlq05",
      prompt: "Which filter lets the database use an index on order_date?",
      options: ["WHERE YEAR(order_date) = 2026", "WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01'", "WHERE CAST(order_date AS TEXT) LIKE '2026%'", "WHERE DATEPART(year, order_date) = 2026"],
      answer: 1,
      explanation: "Keep the column bare (sargable) and filter a range.",
    },
    {
      id: "asqlq06",
      prompt: "SUM(amount) OVER (ORDER BY order_date) gives three orders on the same day the same running total. Why, and how do you get one step per order?",
      options: ["It's a bug; use GROUP BY", "The default frame is RANGE, which groups equal dates. Use ROWS UNBOUNDED PRECEDING and add order_id to ORDER BY", "Use LAG instead", "Use DISTINCT"],
      answer: 1,
      explanation: "RANGE treats peers (equal ORDER BY values) as one step.",
    },
    {
      id: "asqlq07",
      prompt: "You need each customer's most recent order, with all its columns, and exactly one row per customer. Which approach is right?",
      options: ["GROUP BY customer_id with MAX(order_date)", "ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC, order_id DESC) in a CTE, then keep rn = 1", "RANK() and keep rank 1", "SELECT DISTINCT customer_id"],
      answer: 1,
      explanation: "ROW_NUMBER with a tie-breaker gives exactly one row; RANK could return ties.",
    },
    {
      id: "asqlq08",
      prompt: "The top 3 products per category must include anyone tied for third place. Which function?",
      options: ["ROW_NUMBER()", "RANK()", "NTILE(3)", "LEAD()"],
      answer: 1,
      explanation: "RANK gives tied rows the same rank, so all of them pass rank <= 3.",
    },
    {
      id: "asqlq09",
      prompt: "In September, a draft says sales fell 30% this year, comparing January–August with all of last year. What's the right comparison?",
      options: ["The same: it's the data", "January–August against January–August last year", "August against July", "This year against the average of the last five years"],
      answer: 1,
      explanation: "Compare periods of the same length and season.",
    },
    {
      id: "asqlq10",
      prompt: "Your data starts in January 2024, but customers have been signing up since 2018. What's true of the 'January 2024 cohort'?",
      options: ["It's the best cohort of new customers", "It holds everyone already active when the data starts, so it isn't a cohort of new customers", "It has 100% retention", "It must be deleted"],
      answer: 1,
      explanation: "That's left-censoring. Analyse it as the existing base.",
    },
    {
      id: "asqlq11",
      prompt: "Joining orders (one row each) to payments (several rows per order) and then summing order_total overstates revenue. Why?",
      options: ["SUM is inaccurate", "Each order is repeated once per payment, so its total is counted several times. Aggregate payments per order first", "Payments have NULLs", "The join should be a CROSS JOIN"],
      answer: 1,
      explanation: "Aggregate the 'many' side before joining it to the 'one' side.",
    },
    {
      id: "asqlq12",
      prompt: "A duplicate check finds two shipments with the same customer, route, date and size, but different weights and ship dates. What should you do?",
      options: ["Delete the later one", "Treat them as two real shipments, and note the check and your decision", "Average them", "Delete both"],
      answer: 1,
      explanation: "A failed check is a question. The other columns show they're different shipments.",
    },
    {
      id: "asqlq13",
      prompt: "A query plan shows CORRELATED SCALAR SUBQUERY inside a scan of a 5-million-row table. What's the usual fix?",
      options: ["Add SELECT *", "Rewrite it as a join to a CTE that aggregates once", "Use UNION instead of UNION ALL", "Add ORDER BY"],
      answer: 1,
      explanation: "The subquery runs once per outer row; a pre-aggregated join runs once.",
    },
    {
      id: "asqlq14",
      prompt: "₦900m is outstanding. The aging report shows 85% of it is less than 30 days old. What's the best summary?",
      options: ["A collections crisis", "Mostly recent, normal invoices; watch the older 15%", "Customers have stopped paying", "The report is wrong"],
      answer: 1,
      explanation: "The aging profile, not the total, tells you how worried to be.",
    },
    {
      id: "asqlq15",
      prompt: "Which query lists employees with their manager's name, keeping employees who have no manager?",
      options: [
        "SELECT e.name, m.name FROM employees e JOIN employees m ON m.id = e.manager_id",
        "SELECT e.name, m.name FROM employees e LEFT JOIN employees m ON m.id = e.manager_id",
        "SELECT e.name, e.manager_id FROM employees e",
        "SELECT name FROM employees WHERE manager_id IS NULL",
      ],
      answer: 1,
      explanation: "A self join with LEFT JOIN keeps the people at the top of the tree.",
    },
  ],
};
