/**
 * Expected answers to the practice projects' checks, keyed by check ID.
 *
 * Only the database seed (graded on the server) and the demo backend import this file; the project
 * pages never do. Each answer has a `verify` query over the project's CSV files, which
 * `npm run test:content` runs to prove the answer is right.
 */
export type ProjectAnswer = {
  answer: number | string;
  /** Other text answers that also count. */
  accept?: string[];
  tolerance?: number;
  verify: string;
};

export const PROJECT_ANSWERS: Record<string, ProjectAnswer> = {
  // Logistics Operations Analysis
  "lo-top-customer": {
    answer: "Oakridge Packaging Limited",
    accept: ["Oakridge Packaging", "Oakridge", "Oakridge Packaging Ltd"],
    verify: "SELECT c.company_name FROM shipments s JOIN customers c USING (customer_id) WHERE s.status <> 'Cancelled' GROUP BY 1 ORDER BY COUNT(*) DESC LIMIT 1",
  },
  "lo-delivered": { answer: 2411, verify: "SELECT COUNT(*) FROM shipments WHERE status = 'Delivered'" },
  "lo-late-rate": {
    answer: 23.4,
    verify:
      "SELECT ROUND(100.0 * AVG(julianday(delivery_date) - julianday(ship_date) > target_transit_days), 1) FROM shipments JOIN routes USING (route_id) WHERE status = 'Delivered'",
  },
  "lo-unpaid": {
    answer: 1411777000,
    verify:
      "SELECT SUM(s.freight_charge - COALESCE(p.paid, 0)) FROM shipments s LEFT JOIN (SELECT shipment_id, SUM(amount) AS paid FROM payments GROUP BY 1) p USING (shipment_id) WHERE s.status = 'Delivered'",
  },

  // Sales Performance Analysis
  "sp-revenue": { answer: 830541245, verify: "SELECT ROUND(SUM(quantity * unit_price * (1 - discount_pct / 100.0))) FROM orders" },
  "sp-top-category": {
    answer: "Household",
    verify: "SELECT p.category FROM orders o JOIN products p USING (product_id) GROUP BY 1 ORDER BY SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) DESC LIMIT 1",
  },
  "sp-top-channel": {
    answer: "Wholesale",
    verify: "SELECT c.channel FROM orders o JOIN customers c USING (customer_id) GROUP BY 1 ORDER BY SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) DESC LIMIT 1",
  },
  "sp-discounts": { answer: 29087055, verify: "SELECT ROUND(SUM(quantity * unit_price * discount_pct / 100.0)) FROM orders" },
  "sp-best-month": {
    answer: "December 2025",
    accept: ["Dec 2025", "2025-12", "12/2025", "12-2025", "Dec-2025", "Dec-25", "December, 2025"],
    verify:
      "SELECT CASE substr(order_date, 1, 7) WHEN '2025-12' THEN 'December 2025' ELSE substr(order_date, 1, 7) END FROM orders GROUP BY substr(order_date, 1, 7) ORDER BY SUM(quantity * unit_price * (1 - discount_pct / 100.0)) DESC LIMIT 1",
  },

  // Price Rise Impact
  "pr-cartons-2026": {
    answer: 19630,
    verify: "SELECT SUM(quantity) FROM orders WHERE order_date BETWEEN '2026-01-01' AND '2026-06-30'",
  },
  "pr-price-change": {
    answer: 8.65,
    verify: `SELECT ROUND(100.0 * (
        (SELECT 1.0 * SUM(quantity * unit_price) / SUM(quantity) FROM orders WHERE order_date BETWEEN '2026-01-01' AND '2026-06-30') /
        (SELECT 1.0 * SUM(quantity * unit_price) / SUM(quantity) FROM orders WHERE order_date BETWEEN '2025-01-01' AND '2025-06-30') - 1), 2)`,
  },
  "pr-revenue-change": {
    answer: 19.07,
    verify: `SELECT ROUND(100.0 * (
        (SELECT SUM(quantity * unit_price * (1 - discount_pct / 100.0)) FROM orders WHERE order_date BETWEEN '2026-01-01' AND '2026-06-30') /
        (SELECT SUM(quantity * unit_price * (1 - discount_pct / 100.0)) FROM orders WHERE order_date BETWEEN '2025-01-01' AND '2025-06-30') - 1), 2)`,
  },
  "pr-fewer-cartons": {
    answer: "Kiosk",
    accept: ["Kiosks"],
    verify: `SELECT c.channel FROM orders o JOIN customers c USING (customer_id) WHERE CAST(substr(o.order_date, 6, 2) AS INTEGER) <= 6
      GROUP BY 1 HAVING SUM(CASE WHEN o.order_date >= '2026' THEN o.quantity END) < SUM(CASE WHEN o.order_date < '2026' THEN o.quantity END)`,
  },

  // Customer Data Clean-up
  "cd-customers": {
    answer: 90,
    verify: `SELECT COUNT(DISTINCT lower(trim(replace(replace("Customer Name", '   ', ' '), '  ', ' ')))) FROM customer_list_raw`,
  },
  "cd-duplicates": {
    answer: 12,
    verify: `SELECT COUNT(*) - COUNT(DISTINCT lower(trim(replace(replace("Customer Name", '   ', ' '), '  ', ' ')))) FROM customer_list_raw`,
  },
  "cd-region-spellings": { answer: 23, tolerance: 1, verify: "SELECT COUNT(DISTINCT Region) FROM customer_list_raw" },
  "cd-blank-credit": { answer: 3, verify: `SELECT COUNT(*) FROM customer_list_raw WHERE "Credit Limit" IS NULL OR trim("Credit Limit") = ''` },
  "cd-day-first": { answer: 28, verify: `SELECT COUNT(*) FROM customer_list_raw WHERE "Date Joined" LIKE '__/__/____'` },

  // Law Firm Operations Analysis
  "lf-open": { answer: 34, verify: "SELECT COUNT(*) FROM matters WHERE status = 'Open'" },
  "lf-adjourned": { answer: 52.4, verify: "SELECT ROUND(100.0 * AVG(outcome = 'Adjourned'), 1) FROM hearings WHERE outcome <> 'Scheduled'" },
  "lf-busiest-area": {
    answer: "Commercial litigation",
    accept: ["Commercial"],
    verify: "SELECT practice_area FROM matters WHERE status = 'Open' GROUP BY 1 ORDER BY COUNT(*) DESC LIMIT 1",
  },
  "lf-overdue": { answer: 188070000, verify: "SELECT SUM(amount_ngn) FROM invoices WHERE status = 'Overdue'" },
  "lf-top-debtor": {
    answer: "Chinedu Nwosu",
    verify: `SELECT c.client_name FROM invoices i JOIN matters m USING (matter_id) JOIN clients c USING (client_id)
      WHERE i.status IN ('Overdue', 'Outstanding') GROUP BY 1 ORDER BY SUM(i.amount_ngn) DESC LIMIT 1`,
  },

  // Employee Analytics
  "ea-late-dept": {
    answer: "Operations",
    verify: "SELECT e.department FROM attendance a JOIN employees e USING (employee_id) GROUP BY 1 ORDER BY AVG(a.status = 'Late') DESC LIMIT 1",
  },
  "ea-resignation": { answer: 13.8, verify: "SELECT ROUND(100.0 * AVG(status = 'Resigned'), 1) FROM employees" },
  "ea-leave-days": { answer: 570, verify: "SELECT SUM(days) FROM leave WHERE approved = 'Yes'" },
  "ea-manager-pay": { answer: 1403000, verify: "SELECT ROUND(AVG(monthly_salary)) FROM employees WHERE job_level = 'Manager' AND status = 'Active'" },
  "ea-resign-dept": {
    answer: "Customer Service",
    verify: "SELECT department FROM employees GROUP BY 1 ORDER BY AVG(status = 'Resigned') DESC LIMIT 1",
  },
};
