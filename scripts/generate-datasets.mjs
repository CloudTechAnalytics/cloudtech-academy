// Generates CloudTech Academy's fictional practice datasets.
//
// - public/datasets/logistics.sqlite  (used by the in-browser SQL sandbox)
// - public/datasets/<dataset>/*.csv   (downloadable for Excel / Power BI / SQL practice)
//
// All names and figures are invented. A fixed random seed keeps the output identical
// between runs, so lesson answers never change.  Run: npm run datasets
import initSqlJs from "sql.js";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("public/datasets");
fs.mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------------ helpers */
let seed = 20260101;
function rand() {
  // mulberry32
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const int = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
function weighted(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}
const day = 86400000;
const iso = (t) => new Date(t).toISOString().slice(0, 10);
const d = (s) => Date.parse(s + "T00:00:00Z");

const FIRST = ["Adaeze", "Tunde", "Chiamaka", "Ibrahim", "Folake", "Emeka", "Zainab", "Segun", "Ngozi", "Musa", "Temitope", "Obinna", "Aisha", "Kelechi", "Funmilayo", "Yusuf", "Amaka", "Babatunde", "Hauwa", "Chinedu", "Bisi", "Uche", "Halima", "Dapo", "Ifeoma", "Kunle", "Maryam", "Nnamdi", "Sade", "Tobi"];
const LAST = ["Okafor", "Adebayo", "Bello", "Nwosu", "Ogunleye", "Eze", "Abdullahi", "Olawale", "Chukwu", "Danjuma", "Afolabi", "Okeke", "Lawal", "Obi", "Adeyemi", "Suleiman", "Ibe", "Oyelaran", "Umar", "Ndukwe"];
const person = () => `${pick(FIRST)} ${pick(LAST)}`;

function csv(rows, columns) {
  const esc = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [columns.join(","), ...rows.map((r) => columns.map((c) => esc(r[c])).join(","))].join("\n") + "\n";
}
function writeCsv(dataset, name, rows) {
  const dir = path.join(OUT, dataset);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${name}.csv`), csv(rows, Object.keys(rows[0])));
}

/* ------------------------------------------------------------------ logistics */
function logistics() {
  const employees = [];
  const teams = [
    ["Account Manager", "Sales", 8],
    ["Operations Officer", "Operations", 7],
    ["Customs Specialist", "Customs", 4],
    ["Finance Officer", "Finance", 3],
    ["Team Lead", "Operations", 2],
  ];
  let eid = 1;
  for (const [role, team, n] of teams)
    for (let i = 0; i < n; i++)
      employees.push({ employee_id: eid++, full_name: person(), role, team, hire_date: iso(d("2016-01-01") + int(0, 3300) * day), manager_id: null });
  const leads = employees.filter((e) => e.role === "Team Lead").map((e) => e.employee_id);
  for (const e of employees) if (e.role !== "Team Lead") e.manager_id = pick(leads);
  const managers = employees.filter((e) => e.role === "Account Manager").map((e) => e.employee_id);

  const PREFIX = ["Apex", "Coastal", "Crescent", "Delta", "Eastgate", "Everline", "Greenfield", "Harmattan", "Keystone", "Lagoon", "Meridian", "Northstar", "Oakridge", "Palmline", "Riverbend", "Savanna", "Silverleaf", "Sunrise", "Tidewater", "Unity", "Westbridge", "Zenith", "Brightway", "Cedar", "Goldcoast", "Horizon", "Ironwood", "Kingsway", "Lighthouse", "Mainland"];
  const SECTOR = [
    ["Foods", "Food & Beverage"],
    ["Agro", "Agriculture"],
    ["Pharma", "Pharmaceuticals"],
    ["Motors", "Automotive"],
    ["Textiles", "Textiles"],
    ["Electronics", "Electronics"],
    ["Builders", "Construction"],
    ["Packaging", "Manufacturing"],
    ["Energy", "Energy"],
    ["Retail", "Retail"],
  ];
  const CITIES = [["Lagos", "Nigeria", 10], ["Abuja", "Nigeria", 3], ["Port Harcourt", "Nigeria", 3], ["Kano", "Nigeria", 2], ["Ibadan", "Nigeria", 2], ["Onitsha", "Nigeria", 2], ["Accra", "Ghana", 2], ["Cotonou", "Benin", 1]];
  const customers = [];
  const used = new Set();
  for (let id = 1; id <= 120; id++) {
    let name, sector;
    do {
      sector = pick(SECTOR);
      name = `${pick(PREFIX)} ${sector[0]} ${pick(["Ltd", "Limited", "Ltd", "Plc", "& Co"])}`;
    } while (used.has(name));
    used.add(name);
    const city = weighted(CITIES, CITIES.map((c) => c[2]));
    customers.push({
      customer_id: id,
      company_name: name,
      industry: sector[1],
      city: city[0],
      country: city[1],
      signup_date: iso(d("2021-01-01") + int(0, 1500) * day),
      account_manager_id: rand() < 0.1 ? null : pick(managers),
    });
  }

  const ROUTES = [
    ["Shanghai", "Lagos (Apapa)", "Sea", 38, 14],
    ["Ningbo", "Lagos (Apapa)", "Sea", 40, 9],
    ["Shanghai", "Lagos (Tin Can)", "Sea", 39, 8],
    ["Rotterdam", "Lagos (Apapa)", "Sea", 21, 9],
    ["Antwerp", "Lagos (Tin Can)", "Sea", 22, 7],
    ["Hamburg", "Lagos (Apapa)", "Sea", 23, 4],
    ["Valencia", "Lagos (Tin Can)", "Sea", 18, 4],
    ["Jebel Ali (Dubai)", "Lagos (Apapa)", "Sea", 26, 6],
    ["Nhava Sheva (Mumbai)", "Lagos (Apapa)", "Sea", 28, 5],
    ["Singapore", "Onne", "Sea", 32, 3],
    ["Shanghai", "Onne", "Sea", 42, 3],
    ["Durban", "Lagos (Apapa)", "Sea", 16, 2],
    ["Tema", "Lagos (Apapa)", "Sea", 5, 4],
    ["Lagos (Apapa)", "Tema", "Sea", 5, 3],
    ["Lagos (Apapa)", "Abidjan", "Sea", 7, 2],
    ["Lagos (Tin Can)", "Lomé", "Sea", 4, 2],
    ["Rotterdam", "Port Harcourt", "Sea", 24, 2],
    ["Antwerp", "Calabar", "Sea", 25, 1],
    ["Dubai", "Lagos", "Air", 2, 4],
    ["London Heathrow", "Lagos", "Air", 1, 3],
    ["Frankfurt", "Lagos", "Air", 2, 2],
    ["Guangzhou", "Lagos", "Air", 3, 3],
    ["Lagos", "Abuja", "Air", 1, 2],
    ["Lagos", "Kano", "Road", 3, 5],
    ["Lagos", "Abuja", "Road", 2, 5],
    ["Lagos", "Cotonou", "Road", 2, 3],
    ["Lagos", "Accra", "Road", 4, 3],
    ["Port Harcourt", "Onitsha", "Road", 2, 2],
    ["Lagos", "Ibadan", "Road", 1, 3],
    ["Onne", "Port Harcourt", "Road", 1, 2],
  ];
  const routes = ROUTES.map(([o, dest, mode, days], i) => ({ route_id: i + 1, origin: o, destination: dest, mode, target_transit_days: days }));
  const routeWeights = ROUTES.map((r) => r[4]);

  // Customer activity: a long tail, a few inactive customers, and 6 who never shipped.
  const customerWeight = customers.map((c, i) => (i < 6 ? 0 : Math.pow(rand(), 3) * 40 + 0.4));
  const lastActive = customers.map((c, i) => (i >= 6 && i < 20 ? d("2025-06-01") + int(0, 240) * day : Infinity));

  const shipments = [];
  const start = d("2025-01-02");
  const end = d("2026-08-31");
  let sid = 100001;
  for (let t = start; t <= end; t += day) {
    const date = new Date(t);
    const weekday = date.getUTCDay();
    const perDay = weekday === 0 ? int(0, 2) : weekday === 6 ? int(1, 4) : int(3, 8);
    for (let k = 0; k < perDay; k++) {
      let c;
      do {
        c = weighted(customers, customerWeight);
      } while (t > lastActive[c.customer_id - 1]);
      const r = weighted(routes, routeWeights);
      const containers = r.mode === "Sea" ? weighted([1, 2, 3, 4, 6, 8], [30, 28, 16, 12, 8, 6]) : r.mode === "Road" ? weighted([1, 2], [80, 20]) : 1;
      const weight = r.mode === "Air" ? int(80, 2400) : containers * int(9000, 24000);
      const base = r.mode === "Sea" ? 1850000 : r.mode === "Air" ? 380000 : 520000;
      const distance = r.mode === "Air" ? 1 + weight / 900 : 1 + r.target_transit_days / 30;
      const charge = Math.round((base * (r.mode === "Air" ? 1 : containers) * distance * (0.85 + rand() * 0.3)) / 1000) * 1000;

      const age = (end - t) / day;
      let status;
      if (age < 6) status = "Booked";
      else if (age < 6 + r.target_transit_days + 6) status = rand() < 0.5 ? "In transit" : "Delivered";
      else status = rand() < 0.06 ? "Cancelled" : "Delivered";

      const shipT = status === "Booked" || status === "Cancelled" ? null : t + int(2, 9) * day;
      const late = rand() < 0.22 ? int(1, Math.max(2, Math.round(r.target_transit_days * 0.4))) : -int(0, Math.min(3, r.target_transit_days - 1));
      const delivT = status === "Delivered" ? shipT + (r.target_transit_days + late) * day : null;
      if (delivT && delivT > end) status = "In transit";

      shipments.push({
        shipment_id: sid++,
        customer_id: c.customer_id,
        route_id: r.route_id,
        booking_date: iso(t),
        ship_date: shipT ? iso(shipT) : null,
        delivery_date: status === "Delivered" ? iso(delivT) : null,
        status,
        containers,
        weight_kg: weight,
        freight_charge: charge,
      });
    }
  }

  const payments = [];
  let pid = 1;
  for (const s of shipments) {
    if (s.status !== "Delivered") continue;
    const due = d(s.delivery_date);
    const roll = rand();
    const method = weighted(["Bank transfer", "Card", "Cheque"], [78, 15, 7]);
    if (roll < 0.83) {
      payments.push({ payment_id: pid++, shipment_id: s.shipment_id, payment_date: iso(due + int(-5, 30) * day), amount: s.freight_charge, method });
    } else if (roll < 0.93) {
      const first = Math.round((s.freight_charge * 0.5) / 1000) * 1000;
      payments.push({ payment_id: pid++, shipment_id: s.shipment_id, payment_date: iso(due + int(0, 10) * day), amount: first, method });
      if (rand() < 0.7)
        payments.push({ payment_id: pid++, shipment_id: s.shipment_id, payment_date: iso(due + int(20, 60) * day), amount: s.freight_charge - first, method });
    }
    // otherwise unpaid
  }
  for (const p of payments) if (d(p.payment_date) > end) p.payment_date = iso(end);

  return { employees, customers, routes, shipments, payments };
}

/* ------------------------------------------------------------------ sales */
function sales() {
  const CATEGORIES = { Beverages: ["Malt drink 330ml (24)", "Bottled water 75cl (12)", "Orange juice 1L (12)", "Energy drink 250ml (24)"], Snacks: ["Plantain chips 150g (20)", "Chin chin 200g (20)", "Cabin biscuits (24)", "Groundnuts 250g (30)"], Household: ["Detergent 900g (12)", "Dishwashing liquid 1L (12)", "Toilet roll (48)", "Air freshener (12)"], "Personal care": ["Body lotion 400ml (12)", "Toothpaste 140g (24)", "Bar soap (48)", "Hair cream 250g (12)"] };
  const products = [];
  let pid = 1;
  for (const [cat, items] of Object.entries(CATEGORIES))
    for (const name of items) products.push({ product_id: pid++, product_name: name, category: cat, unit_price: Math.round((int(4500, 42000)) / 100) * 100 });
  const REGIONS = ["Lagos", "South West", "South East", "South South", "North Central", "North West"];
  const customers = Array.from({ length: 80 }, (_, i) => ({
    customer_id: i + 1,
    customer_name: `${pick(["Mama", "Bola", "Chuks", "Aunty", "Alhaji", "Brother", "Madam", "Emeka"])} ${pick(["Stores", "Supermarket", "Ventures", "Mini Mart", "Enterprises", "Wholesale"])} ${i + 1}`,
    channel: weighted(["Wholesale", "Supermarket", "Kiosk"], [30, 25, 45]),
    region: pick(REGIONS),
  }));
  const orders = [];
  let oid = 5001;
  for (let t = d("2025-01-01"); t <= d("2026-06-30"); t += day) {
    for (let k = 0; k < int(4, 12); k++) {
      const p = pick(products);
      const qty = int(1, 25);
      orders.push({ order_id: oid++, order_date: iso(t), customer_id: pick(customers).customer_id, product_id: p.product_id, quantity: qty, unit_price: p.unit_price, discount_pct: weighted([0, 5, 10], [75, 18, 7]) });
    }
  }
  return { customers, products, orders };
}

/* ------------------------------------------------------------------ hr */
function hr() {
  const DEPTS = ["Operations", "Finance", "Sales", "Customer Service", "IT", "Human Resources"];
  const employees = Array.from({ length: 60 }, (_, i) => ({
    employee_id: 1001 + i,
    full_name: person(),
    department: pick(DEPTS),
    job_level: weighted(["Junior", "Mid", "Senior", "Manager"], [40, 30, 20, 10]),
    hire_date: iso(d("2017-01-01") + int(0, 3000) * day),
    monthly_salary: Math.round(int(180000, 1450000) / 5000) * 5000,
    status: weighted(["Active", "Resigned"], [88, 12]),
  }));
  const attendance = [];
  for (let t = d("2026-06-01"); t <= d("2026-06-30"); t += day) {
    const wd = new Date(t).getUTCDay();
    if (wd === 0 || wd === 6) continue;
    for (const e of employees.filter((x) => x.status === "Active")) {
      const r = rand();
      const status = r < 0.9 ? "Present" : r < 0.95 ? "Late" : r < 0.98 ? "Absent" : "On leave";
      attendance.push({ date: iso(t), employee_id: e.employee_id, status, hours_worked: status === "Present" ? int(7, 10) : status === "Late" ? int(5, 8) : 0 });
    }
  }
  const leave = [];
  let lid = 1;
  for (const e of employees)
    for (let k = 0; k < int(0, 3); k++) {
      const s = d("2025-01-01") + int(0, 540) * day;
      const days = int(1, 10);
      leave.push({ leave_id: lid++, employee_id: e.employee_id, leave_type: weighted(["Annual", "Sick", "Maternity/Paternity", "Compassionate"], [70, 20, 5, 5]), start_date: iso(s), end_date: iso(s + (days - 1) * day), days, approved: rand() < 0.92 ? "Yes" : "No" });
    }
  return { employees, attendance, leave };
}

/* ------------------------------------------------------------------ legal operations */
function legal() {
  const PRACTICE = ["Commercial litigation", "Corporate", "Property", "Employment", "Family", "Intellectual property"];
  const COURTS = ["High Court, Lagos", "Federal High Court, Lagos", "National Industrial Court", "Court of Appeal, Lagos", "Magistrate Court, Ikeja"];
  const clients = Array.from({ length: 45 }, (_, i) => ({
    client_id: i + 1,
    client_name: rand() < 0.55 ? `${pick(["Sterling", "Beacon", "Pinnacle", "Crestview", "Majestic", "Summit", "Orchid", "Trident"])} ${pick(["Holdings", "Properties", "Industries", "Logistics", "Foods", "Partners"])} Ltd` : person(),
    client_type: "",
    onboarded_date: iso(d("2022-01-01") + int(0, 1300) * day),
  }));
  for (const c of clients) c.client_type = / Ltd$/.test(c.client_name) ? "Company" : "Individual";
  const lawyers = Array.from({ length: 9 }, () => person());
  const matters = [];
  let mid = 2001;
  for (let k = 0; k < 140; k++) {
    const opened = d("2024-01-01") + int(0, 900) * day;
    const status = weighted(["Open", "Closed", "On hold"], [55, 38, 7]);
    matters.push({ matter_id: mid++, client_id: pick(clients).client_id, matter_title: `${pick(["Recovery of debt", "Lease dispute", "Share transfer", "Wrongful dismissal", "Trademark registration", "Contract review", "Land title", "Custody application"])}`, practice_area: pick(PRACTICE), responsible_lawyer: pick(lawyers), opened_date: iso(opened), closed_date: status === "Closed" ? iso(opened + int(40, 500) * day) : null, status });
  }
  const hearings = [];
  let hid = 1;
  for (const m of matters) {
    if (!/litigation|Employment|Family|Property/.test(m.practice_area)) continue;
    for (let k = 0; k < int(1, 6); k++) {
      const date = d(m.opened_date) + int(20, 600) * day;
      hearings.push({ hearing_id: hid++, matter_id: m.matter_id, hearing_date: iso(date), court: pick(COURTS), outcome: date > d("2026-09-01") ? "Scheduled" : weighted(["Adjourned", "Heard", "Struck out", "Judgment delivered"], [55, 30, 5, 10]) });
    }
  }
  const invoices = [];
  let iid = 7001;
  for (const m of matters)
    for (let k = 0; k < int(1, 4); k++) {
      const issued = d(m.opened_date) + int(10, 400) * day;
      const amount = Math.round(int(250000, 6500000) / 10000) * 10000;
      const paid = rand() < 0.72;
      invoices.push({ invoice_id: iid++, matter_id: m.matter_id, issued_date: iso(issued), amount_ngn: amount, status: paid ? "Paid" : weighted(["Outstanding", "Overdue"], [55, 45]), paid_date: paid ? iso(issued + int(3, 75) * day) : null });
    }
  return { clients, matters, hearings, invoices };
}

/* ------------------------------------------------------------------ write */
const SQL = await initSqlJs();
const L = logistics();
const db = new SQL.Database();
db.run(`
CREATE TABLE employees (employee_id INTEGER PRIMARY KEY, full_name TEXT NOT NULL, role TEXT NOT NULL, team TEXT NOT NULL, hire_date TEXT NOT NULL, manager_id INTEGER REFERENCES employees(employee_id));
CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, company_name TEXT NOT NULL, industry TEXT NOT NULL, city TEXT NOT NULL, country TEXT NOT NULL, signup_date TEXT NOT NULL, account_manager_id INTEGER REFERENCES employees(employee_id));
CREATE TABLE routes (route_id INTEGER PRIMARY KEY, origin TEXT NOT NULL, destination TEXT NOT NULL, mode TEXT NOT NULL, target_transit_days INTEGER NOT NULL);
CREATE TABLE shipments (shipment_id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES customers(customer_id), route_id INTEGER NOT NULL REFERENCES routes(route_id), booking_date TEXT NOT NULL, ship_date TEXT, delivery_date TEXT, status TEXT NOT NULL, containers INTEGER NOT NULL, weight_kg INTEGER NOT NULL, freight_charge INTEGER NOT NULL);
CREATE TABLE payments (payment_id INTEGER PRIMARY KEY, shipment_id INTEGER NOT NULL REFERENCES shipments(shipment_id), payment_date TEXT NOT NULL, amount INTEGER NOT NULL, method TEXT NOT NULL);
`);
function insert(table, rows) {
  const cols = Object.keys(rows[0]);
  const stmt = db.prepare(`INSERT INTO ${table} (${cols.join(",")}) VALUES (${cols.map(() => "?").join(",")})`);
  db.run("BEGIN");
  for (const r of rows) stmt.run(cols.map((c) => r[c]));
  db.run("COMMIT");
  stmt.free();
}
for (const t of ["employees", "customers", "routes", "shipments", "payments"]) {
  insert(t, L[t]);
  writeCsv("logistics", t, L[t]);
}
fs.writeFileSync(path.join(OUT, "logistics.sqlite"), Buffer.from(db.export()));

for (const [name, data] of [["sales", sales()], ["hr", hr()], ["legal", legal()]])
  for (const [table, rows] of Object.entries(data)) writeCsv(name, table, rows);

// Summary for the build log
const counts = db.exec("SELECT (SELECT COUNT(*) FROM customers), (SELECT COUNT(*) FROM shipments), (SELECT COUNT(*) FROM payments), (SELECT COUNT(*) FROM routes), (SELECT COUNT(*) FROM employees)")[0].values[0];
console.log(`logistics.sqlite: ${counts[0]} customers, ${counts[1]} shipments, ${counts[2]} payments, ${counts[3]} routes, ${counts[4]} employees`);
for (const dir of fs.readdirSync(OUT).filter((f) => fs.statSync(path.join(OUT, f)).isDirectory()))
  console.log(`${dir}/: ${fs.readdirSync(path.join(OUT, dir)).map((f) => `${f} (${fs.readFileSync(path.join(OUT, dir, f), "utf8").split("\n").length - 2} rows)`).join(", ")}`);
