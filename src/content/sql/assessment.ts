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
      prompt: "Which WHERE clause keeps shipments whose status is neither 'Delivered' nor 'Cancelled'?",
      options: ["WHERE status = 'Delivered'", "WHERE status NOT IN ('Delivered', 'Cancelled')", "WHERE status IN ('Delivered', 'Cancelled')", "ORDER BY status"],
      answer: 1,
      explanation: "NOT IN excludes every value in the list.",
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
      prompt: "What does SELECT COUNT(*) FROM payments; return?",
      options: ["One row with the number of payments", "One row for each payment", "No rows", "An error"],
      answer: 0,
      explanation: "Without GROUP BY, an aggregate like COUNT(*) returns a single row.",
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
      prompt: "After GROUP BY customer_id, which keyword keeps only customers with more than 20 shipments?",
      options: ["WHERE", "HAVING", "ORDER BY", "LIMIT"],
      answer: 1,
      explanation: "WHERE filters rows before grouping; HAVING filters the groups, so it can use COUNT(*).",
    },
    {
      id: "sqlq08",
      prompt: "In which order do you write the clauses of a query?",
      options: ["SELECT … FROM … WHERE … GROUP BY … ORDER BY", "FROM … SELECT … ORDER BY … WHERE", "WHERE … SELECT … FROM … GROUP BY", "ORDER BY … GROUP BY … WHERE … SELECT"],
      answer: 0,
      explanation: "SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT.",
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
      prompt: "A join returns far more rows than either table has. What is the most likely cause?",
      options: ["The ON condition is missing or wrong", "The tables are too small", "ORDER BY is missing", "The column names are in capitals"],
      answer: 0,
      explanation: "Without a correct ON condition, every row is matched with every row of the other table.",
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
      prompt: "A shipment was paid in two instalments, so it has two rows in payments. You join shipments to payments and add up freight_charge. What happens to that shipment's charge?",
      options: ["It is counted once", "It is counted twice", "It disappears", "The query fails"],
      answer: 1,
      explanation: "The join repeats the shipment row for each payment, so its charge is added twice.",
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
