import type { AssessmentDef } from "../types";

/**
 * Final assessment for Databases and APIs for Developers. Scenario questions on schemas,
 * constraints, parameters, transactions, indexes, migrations, REST design and API tests.
 */
export const DBA_ASSESSMENT: AssessmentDef = {
  id: "databases-and-apis-for-developers-final",
  courseId: "databases-and-apis-for-developers",
  title: "Databases and APIs for Developers: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "dbaq01",
      prompt: "Invoices store a copy of the customer's business name. The customer renames their business. What goes wrong?",
      options: ["Nothing", "Old invoices show the old name; copies disagree", "The database crashes", "Invoices are deleted"],
      answer: 1,
      explanation: "Store each fact once and link by key.",
    },
    {
      id: "dbaq02",
      prompt: "Which constraint refuses an invoice for a customer who doesn't exist?",
      options: ["NOT NULL", "A foreign key (REFERENCES customers)", "PRIMARY KEY", "An index"],
      answer: 1,
      explanation: "Foreign keys enforce relationships.",
    },
    {
      id: "dbaq03",
      prompt: "Why name CHECK constraints (CONSTRAINT discount_limit CHECK ...)?",
      options: ["It's faster", "Error messages say which rule was broken, so code can respond clearly", "It's required", "To hide them"],
      answer: 1,
      explanation: "Useful errors.",
    },
    {
      id: "dbaq04",
      prompt: "Which is the safe way to query by a user-supplied name?",
      options: ["f\"... WHERE name = '{name}'\"", "conn.execute(\"... WHERE name = ?\", (name,))", "\"... WHERE name = '\" + name + \"'\"", "Escape quotes by hand"],
      answer: 1,
      explanation: "Parameters keep values as data.",
    },
    {
      id: "dbaq05",
      prompt: "A batch import fails on its 4th of 6 rows. With a transaction, how many rows are saved?",
      options: ["3", "0", "5", "6"],
      answer: 1,
      explanation: "All or nothing.",
    },
    {
      id: "dbaq06",
      prompt: "What makes re-running a payment import safe?",
      options: ["Running it at night", "A unique bank reference per payment, with duplicates ignored", "Deleting payments first", "A bigger server"],
      answer: 1,
      explanation: "Idempotency.",
    },
    {
      id: "dbaq07",
      prompt: "A query plan says 'SCAN invoices' for WHERE customer_id = ?. What helps?",
      options: ["More memory", "An index on customer_id", "A bigger table", "Removing the WHERE"],
      answer: 1,
      explanation: "Search instead of scan.",
    },
    {
      id: "dbaq08",
      prompt: "A migration that already ran in production has a mistake. What do you do?",
      options: ["Edit it", "Add a new migration that corrects it", "Delete the database", "Run it again"],
      answer: 1,
      explanation: "Never rewrite history that has run.",
    },
    {
      id: "dbaq09",
      prompt: "How do you rename a column with no downtime?",
      options: ["Rename it in one step", "Add the new column, write both, backfill, switch reads, then drop the old one", "Stop the app", "Create a new database"],
      answer: 1,
      explanation: "Expand, migrate, contract.",
    },
    {
      id: "dbaq10",
      prompt: "A payment is valid but more than the invoice's balance. Which status code fits?",
      options: ["200", "409 Conflict", "500", "404"],
      answer: 1,
      explanation: "Valid request, conflicting state.",
    },
    {
      id: "dbaq11",
      prompt: "A successful POST creates a payment. What should the response include?",
      options: ["Status 200 only", "Status 201 and a Location header for the new or updated resource", "A redirect", "Nothing"],
      answer: 1,
      explanation: "Tell the client what was created and where.",
    },
    {
      id: "dbaq12",
      prompt: "Why give each API test its own fresh in-memory database?",
      options: ["It's required by Flask", "So tests are independent and give the same result in any order", "To test performance", "To save disk"],
      answer: 1,
      explanation: "Trustworthy tests.",
    },
  ],
};
