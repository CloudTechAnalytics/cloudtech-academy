/** Harbourline Freight practice database, as shown in the SQL sandbox's "Tables" panel. */
export const HARBOURLINE_SCHEMA: { table: string; description: string; columns: [name: string, type: string, note?: string][] }[] = [
  {
    table: "customers",
    description: "Companies that ship with Harbourline",
    columns: [
      ["customer_id", "INTEGER", "primary key"],
      ["company_name", "TEXT"],
      ["industry", "TEXT"],
      ["city", "TEXT"],
      ["country", "TEXT"],
      ["signup_date", "TEXT", "YYYY-MM-DD"],
      ["account_manager_id", "INTEGER", "→ employees.employee_id, can be NULL"],
    ],
  },
  {
    table: "shipments",
    description: "One row per booking",
    columns: [
      ["shipment_id", "INTEGER", "primary key"],
      ["customer_id", "INTEGER", "→ customers.customer_id"],
      ["route_id", "INTEGER", "→ routes.route_id"],
      ["booking_date", "TEXT", "YYYY-MM-DD"],
      ["ship_date", "TEXT", "NULL until shipped"],
      ["delivery_date", "TEXT", "NULL until delivered"],
      ["status", "TEXT", "Booked, In transit, Delivered, Cancelled"],
      ["containers", "INTEGER"],
      ["weight_kg", "INTEGER"],
      ["freight_charge", "INTEGER", "naira"],
    ],
  },
  {
    table: "routes",
    description: "Lanes Harbourline operates",
    columns: [
      ["route_id", "INTEGER", "primary key"],
      ["origin", "TEXT"],
      ["destination", "TEXT"],
      ["mode", "TEXT", "Sea, Air, Road"],
      ["target_transit_days", "INTEGER"],
    ],
  },
  {
    table: "payments",
    description: "Money received for shipments",
    columns: [
      ["payment_id", "INTEGER", "primary key"],
      ["shipment_id", "INTEGER", "→ shipments.shipment_id"],
      ["payment_date", "TEXT", "YYYY-MM-DD"],
      ["amount", "INTEGER", "naira"],
      ["method", "TEXT", "Bank transfer, Card, Cheque"],
    ],
  },
  {
    table: "employees",
    description: "Harbourline staff",
    columns: [
      ["employee_id", "INTEGER", "primary key"],
      ["full_name", "TEXT"],
      ["role", "TEXT"],
      ["team", "TEXT"],
      ["hire_date", "TEXT", "YYYY-MM-DD"],
      ["manager_id", "INTEGER", "→ employees.employee_id"],
    ],
  },
];
