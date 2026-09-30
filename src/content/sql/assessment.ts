import type { AssessmentDef } from "../types";

/**
 * Final assessment for SQL for Data Analysis. In Supabase mode the answers are stored
 * in a table students cannot read, and grading happens in the database.
 */
export const SQL_ASSESSMENT: AssessmentDef = {
  id: "sql-for-data-analysis-final",
  courseId: "sql-for-data-analysis",
  title: "SQL for Data Analysis: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "sqlq01",
      prompt: "You need the name and city of every customer. Which query is best?",
      options: ["SELECT * FROM customers;", "SELECT company_name, city FROM customers;", "SELECT customers FROM company_name, city;", "GET company_name, city FROM customers;"],
      answer: 1,
      explanation: "List only the columns you need after SELECT.",
    },
    {
      id: "sqlq02",
      prompt: "Which WHERE clause finds shipments that have not been delivered yet and were not cancelled?",
      options: [
        "WHERE status <> 'Delivered' OR status <> 'Cancelled'",
        "WHERE status NOT IN ('Delivered', 'Cancelled')",
        "WHERE status = 'Delivered' AND status = 'Cancelled'",
        "WHERE status IS NULL",
      ],
      answer: 1,
      explanation: "NOT IN excludes both values. The OR version is true for every row, because no status can equal both.",
    },
    {
      id: "sqlq03",
      prompt: "A customer's account_manager_id is empty. Which condition finds them?",
      options: ["account_manager_id = NULL", "account_manager_id = ''", "account_manager_id IS NULL", "NOT account_manager_id"],
      answer: 2,
      explanation: "Missing values are NULL, and NULL is only matched with IS NULL.",
    },
    {
      id: "sqlq04",
      prompt: "What does this return? SELECT shipment_id FROM shipments ORDER BY freight_charge DESC LIMIT 3;",
      options: ["The three cheapest shipments", "The three most expensive shipments", "Any three shipments", "The third most expensive shipment only"],
      answer: 1,
      explanation: "Sort highest charge first, then keep three rows.",
    },
    {
      id: "sqlq05",
      prompt: "payments has 2,409 rows, all with an amount. What does SELECT COUNT(*), SUM(amount) FROM payments; return?",
      options: ["2,409 rows", "One row", "One row per method", "An error, because of mixing functions"],
      answer: 1,
      explanation: "Aggregates without GROUP BY collapse everything into one row.",
    },
    {
      id: "sqlq06",
      prompt: "You want the number of shipments for each status. Which clause is essential?",
      options: ["ORDER BY status", "GROUP BY status", "WHERE status IS NOT NULL", "DISTINCT status"],
      answer: 1,
      explanation: "GROUP BY status makes one group, and one count, per status.",
    },
    {
      id: "sqlq07",
      prompt: "Which query keeps only customers with more than 20 shipments?",
      options: [
        "SELECT customer_id FROM shipments WHERE COUNT(*) > 20 GROUP BY customer_id;",
        "SELECT customer_id FROM shipments GROUP BY customer_id HAVING COUNT(*) > 20;",
        "SELECT customer_id FROM shipments HAVING customer_id > 20;",
        "SELECT customer_id FROM shipments GROUP BY customer_id WHERE COUNT(*) > 20;",
      ],
      answer: 1,
      explanation: "Conditions on aggregates go in HAVING, after GROUP BY.",
    },
    {
      id: "sqlq08",
      prompt: "In what order does the database process these clauses?",
      options: ["SELECT, FROM, WHERE, GROUP BY", "FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY", "WHERE, FROM, HAVING, GROUP BY", "ORDER BY, GROUP BY, WHERE, FROM"],
      answer: 1,
      explanation: "Rows are read and filtered, then grouped and filtered as groups, then selected and sorted. That's why WHERE can't use aggregates.",
    },
    {
      id: "sqlq09",
      prompt: "You need every customer, including those with no shipments, next to their shipment count. Which join?",
      options: ["INNER JOIN from customers to shipments", "LEFT JOIN from customers to shipments", "LEFT JOIN from shipments to customers", "No join is needed"],
      answer: 1,
      explanation: "A LEFT JOIN keeps every row of the left table, here customers, even without a match.",
    },
    {
      id: "sqlq10",
      prompt: "A join between shipments (2,683 rows) and customers (120 rows) returns 321,960 rows. What went wrong?",
      options: ["Nothing, that's expected", "The ON condition is missing or wrong", "LIMIT is missing", "There are duplicate customers"],
      answer: 1,
      explanation: "2,683 × 120 = 321,960: every shipment was paired with every customer.",
    },
    {
      id: "sqlq11",
      prompt: "What does SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) calculate in a query grouped by route?",
      options: ["Total charge per route", "Number of cancelled shipments per route", "Percentage cancelled", "The first cancelled shipment"],
      answer: 1,
      explanation: "Each cancelled row adds 1, so the sum per group is a count.",
    },
    {
      id: "sqlq12",
      prompt: "Which query finds shipments more expensive than the average shipment and stays correct as data changes?",
      options: [
        "WHERE freight_charge > 5000000",
        "WHERE freight_charge > AVG(freight_charge)",
        "WHERE freight_charge > (SELECT AVG(freight_charge) FROM shipments)",
        "HAVING freight_charge > AVG(*)",
      ],
      answer: 2,
      explanation: "A subquery recalculates the average each time. An aggregate can't be used directly in WHERE.",
    },
    {
      id: "sqlq13",
      prompt: "You join shipments to payments and then SUM(freight_charge) per customer. Some shipments were paid in two instalments. What's the risk?",
      options: ["No risk", "Those charges are counted twice", "Those shipments disappear", "The query fails"],
      answer: 1,
      explanation: "The join makes one row per payment, so the charge repeats. Aggregate each table separately, for example in CTEs, then join the totals.",
    },
    {
      id: "sqlq14",
      prompt: "Which calculates a running total of monthly revenue while keeping one row per month?",
      options: ["SUM(revenue) with GROUP BY month", "SUM(revenue) OVER (ORDER BY month)", "COUNT(revenue) OVER ()", "MAX(revenue) OVER (PARTITION BY month)"],
      answer: 1,
      explanation: "A window SUM ordered by month adds up every month so far, without collapsing rows.",
    },
    {
      id: "sqlq15",
      prompt: "Your manager asks for 'revenue last year'. What should you do before writing the query?",
      options: [
        "Use whatever column looks closest",
        "Agree the definition: charged or received, and whether cancelled shipments count",
        "Include every shipment to be safe",
        "Ask for a different question",
      ],
      answer: 1,
      explanation: "Different definitions give different numbers. Agree one and state it with your answer.",
    },
  ],
};
