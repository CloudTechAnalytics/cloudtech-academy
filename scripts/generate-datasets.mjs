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

/* ------------------------------------------------------------------ business datasets
 * Sales, HR, legal and the messy customer export each start from their own seed, so
 * changing one never shifts another (or the logistics database above).
 * Data is "as of" 31 August 2026.
 */
const SNAPSHOT = d("2026-08-31");
const reseed = (n) => {
  seed = n;
};
const round = (n, to) => Math.round(n / to) * to;

/* ---------- sales: Ọja Distribution, an FMCG distributor */
const REGION_CITIES = {
  Lagos: ["Ikeja", "Surulere", "Lekki", "Yaba", "Ikorodu", "Festac"],
  "South West": ["Ibadan", "Abeokuta", "Akure", "Osogbo", "Ilesa"],
  "South East": ["Enugu", "Onitsha", "Aba", "Owerri", "Nnewi"],
  "South South": ["Port Harcourt", "Benin City", "Warri", "Uyo", "Calabar"],
  "North Central": ["Abuja", "Jos", "Ilorin", "Makurdi", "Lokoja"],
  "North West": ["Kano", "Kaduna", "Zaria", "Sokoto", "Katsina"],
};
const REPS = {
  Lagos: ["Tolu Adeyemi", "Chidi Okonkwo"],
  "South West": ["Funke Alabi"],
  "South East": ["Ikenna Obi"],
  "South South": ["Ebi Tamuno"],
  "North Central": ["Sani Garba"],
  "North West": ["Sani Garba"],
};
// Price list for 2025. Prices rose on 1 January 2026 (see PRICE_RISE); products.csv holds
// the current (2026) list price, and each order line records the price actually charged.
const PRODUCTS = [
  ["Malt drink 330ml (24)", "Beverages", 13200],
  ["Bottled water 75cl (12)", "Beverages", 3600],
  ["Orange juice 1L (12)", "Beverages", 18600],
  ["Energy drink 250ml (24)", "Beverages", 16800],
  ["Plantain chips 150g (20)", "Snacks", 9000],
  ["Chin chin 200g (20)", "Snacks", 8400],
  ["Cabin biscuits (24)", "Snacks", 6000],
  ["Groundnuts 250g (30)", "Snacks", 10500],
  ["Detergent 900g (12)", "Household", 21600],
  ["Dishwashing liquid 1L (12)", "Household", 14400],
  ["Toilet roll (48)", "Household", 19200],
  ["Air freshener (12)", "Household", 15600],
  ["Body lotion 400ml (12)", "Personal care", 22800],
  ["Toothpaste 140g (24)", "Personal care", 19200],
  ["Bar soap (48)", "Personal care", 14400],
  ["Hair cream 250g (12)", "Personal care", 16800],
];
const PRICE_RISE = { Beverages: 0.12, Snacks: 0.1, Household: 0.08, "Personal care": 0.08 };
const MONTH_FACTOR = [0.85, 0.88, 1.0, 1.05, 0.95, 0.92, 0.9, 0.92, 1.0, 1.05, 1.12, 1.4];

function sales() {
  reseed(424242);
  const products = PRODUCTS.map(([product_name, category, p2025], i) => ({
    product_id: i + 1,
    product_name,
    category,
    list_price: round(p2025 * (1 + PRICE_RISE[category]), 100),
  }));
  const price = (p, t) => (t >= d("2026-01-01") ? p.list_price : PRODUCTS[p.product_id - 1][2]);

  const OWNERS = ["Mama Nkechi", "Bola", "Chuks", "Alhaji Musa", "Madam Titi", "Emeka", "Iya Basira", "Brother Sunday", "Hajia Amina", "Uncle Ben", "Grace", "Kayode", "Ada", "Blessing", "Yakubu", "Divine", "Olumide", "Peace"];
  const KIND = { Wholesale: ["Wholesale", "Distributors", "Trading Co."], Supermarket: ["Supermarket", "Superstore", "Mart"], Kiosk: ["Stores", "Kiosk", "Provisions", "Mini Mart"] };
  const used = new Set();
  const customers = [];
  for (let i = 0; i < 90; i++) {
    const region = weighted(Object.keys(REGION_CITIES), [30, 18, 14, 14, 12, 12]);
    const city = pick(REGION_CITIES[region]);
    const channel = weighted(["Wholesale", "Supermarket", "Kiosk"], [22, 28, 50]);
    let name = `${pick(OWNERS)} ${pick(KIND[channel])}`;
    if (used.has(name)) name = `${name} ${city}`;
    while (used.has(name)) name = `${pick(OWNERS)} ${pick(KIND[channel])} ${city}`;
    used.add(name);
    const joined = i < 70 ? d("2022-01-01") + int(0, 1090) * day : d("2025-01-15") + int(0, 480) * day;
    const limit = channel === "Wholesale" ? int(2000000, 5000000) : channel === "Supermarket" ? int(800000, 2500000) : int(150000, 600000);
    customers.push({
      customer_id: i + 1,
      customer_name: name,
      channel,
      region,
      city,
      sales_rep: region === "Lagos" ? REPS.Lagos[i % 2] : REPS[region][0],
      joined_date: iso(joined),
      credit_limit: round(limit, 50000),
    });
  }
  // A few big accounts carry much of the volume.
  const weight = customers.map((c) => (c.channel === "Wholesale" ? 4 : c.channel === "Supermarket" ? 2 : 1) * (0.6 + rand() * 1.8));

  const orders = [];
  let oid = 10001;
  for (let t = d("2025-01-01"); t <= d("2026-06-30"); t += day) {
    const date = new Date(t);
    const dow = date.getUTCDay();
    const y2026 = date.getUTCFullYear() === 2026;
    let lines = 9 * MONTH_FACTOR[date.getUTCMonth()] * (dow === 0 ? 0.25 : dow === 6 ? 0.8 : 1) * (y2026 ? 1.1 : 1);
    lines = Math.floor(lines) + (rand() < lines % 1 ? 1 : 0) + int(-1, 1);
    for (let k = 0; k < Math.max(0, lines); k++) {
      const active = customers.filter((c) => d(c.joined_date) <= t);
      const c = weighted(active, active.map((x) => weight[x.customer_id - 1] * (y2026 && x.region === "North West" ? 0.55 : 1) * (y2026 && x.region === "Lagos" ? 1.25 : 1)));
      const month = date.getUTCMonth();
      const p = weighted(products, products.map((x) => (x.category === "Beverages" && (month <= 3 || month === 11) ? 1.4 : 1)));
      const qty = c.channel === "Wholesale" ? int(8, 30) : c.channel === "Supermarket" ? int(4, 18) : int(1, 6);
      const discount = c.channel === "Wholesale" ? weighted([0, 5, 10], [40, 40, 20]) : c.channel === "Supermarket" ? weighted([0, 5, 10], [70, 25, 5]) : weighted([0, 5], [95, 5]);
      orders.push({ order_id: oid++, order_date: iso(t), customer_id: c.customer_id, product_id: p.product_id, quantity: qty, unit_price: price(p, t), discount_pct: discount });
    }
  }
  return { customers, products, orders };
}

/* ---------- the same customers, as exported from the old system (for cleaning practice) */
function customerExport(customers) {
  reseed(515151);
  const REGION_VARIANTS = { "South West": ["South West", "South-West", "south west", "SW"], "South East": ["South East", "South-East", "south east", "SE"], "South South": ["South South", "South-South", "south south", "SS"], "North Central": ["North Central", "North-Central", "north central", "NC"], "North West": ["North West", "North-West", "north west", "NW"], Lagos: ["Lagos", "lagos", "LAGOS", "Lagos "] };
  const messyName = (n) => {
    const r = rand();
    const cased = r < 0.12 ? n.toUpperCase() : r < 0.22 ? n.toLowerCase() : n;
    return (rand() < 0.2 ? "  " : "") + cased + (rand() < 0.25 ? "   " : "");
  };
  const phone = () => {
    const n = `0${pick(["803", "806", "813", "816", "703", "706", "802", "808", "905", "915"])}${String(int(0, 9999999)).padStart(7, "0")}`;
    const f = rand();
    return f < 0.35 ? n : f < 0.6 ? `${n.slice(0, 4)} ${n.slice(4, 7)} ${n.slice(7)}` : f < 0.85 ? `+234 ${n.slice(1, 4)} ${n.slice(4, 7)} ${n.slice(7)}` : `234${n.slice(1)}`;
  };
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = (s) => {
    const [y, m, dd] = s.split("-");
    const f = rand();
    return f < 0.5 ? s : f < 0.8 ? `${dd}/${m}/${y}` : `${Number(dd)}-${MONTHS[Number(m) - 1]}-${y}`;
  };
  const money = (n) => {
    const f = rand();
    return f < 0.06 ? "" : f < 0.4 ? String(n) : f < 0.7 ? n.toLocaleString("en-US") : f < 0.9 ? `₦${n.toLocaleString("en-US")}` : `${n.toLocaleString("en-US")}.00`;
  };
  const rows = customers.map((c) => ({
    "Customer Name": messyName(c.customer_name),
    Region: pick(REGION_VARIANTS[c.region]),
    City: rand() < 0.15 ? c.city.toUpperCase() : c.city,
    Phone: phone(),
    "Date Joined": date(c.joined_date),
    "Credit Limit": money(c.credit_limit),
    Channel: c.channel,
  }));
  // The old system exported some customers twice. Copies come from `exported`, not `rows`:
  // inserting into `rows` shifts its positions, so rows[i] stops being customer i.
  const exported = [...rows];
  const dupes = [];
  for (let k = 0; k < 12; k++) {
    const i = int(0, customers.length - 1);
    if (dupes.includes(i)) continue;
    dupes.push(i);
    const copy = { ...exported[i], "Customer Name": messyName(customers[i].customer_name) };
    rows.splice(int(0, rows.length), 0, copy);
  }
  return { customer_list_raw: rows };
}

/* ---------- hr: the distributor's staff */
function hr() {
  reseed(636363);
  const DEPTS = ["Operations", "Sales", "Customer Service", "Finance", "IT", "Human Resources"];
  const LEVEL_PAY = { Junior: [180000, 380000], Mid: [380000, 700000], Senior: [700000, 1100000], Manager: [1100000, 1600000] };
  const employees = Array.from({ length: 80 }, (_, i) => {
    const department = weighted(DEPTS, [30, 20, 18, 12, 10, 10]);
    const job_level = weighted(["Junior", "Mid", "Senior", "Manager"], [42, 30, 18, 10]);
    const hired = d("2018-01-01") + int(0, 3000) * day;
    // Customer Service juniors leave most often.
    const risk = (department === "Customer Service" ? 0.32 : department === "Operations" ? 0.18 : 0.08) * (job_level === "Junior" ? 1.5 : job_level === "Manager" ? 0.4 : 1);
    const resigned = rand() < risk;
    const exit = resigned ? Math.min(SNAPSHOT - 30 * day, hired + int(120, 1400) * day) : null;
    return {
      employee_id: 1001 + i,
      full_name: person(),
      department,
      job_level,
      hire_date: iso(hired),
      exit_date: resigned && exit > hired ? iso(exit) : null,
      monthly_salary: round(int(...LEVEL_PAY[job_level]), 5000),
      status: resigned && exit > hired ? "Resigned" : "Active",
    };
  });
  const attendance = [];
  for (let t = d("2026-06-01"); t <= d("2026-06-30"); t += day) {
    const wd = new Date(t).getUTCDay();
    if (wd === 0 || wd === 6) continue;
    for (const e of employees.filter((x) => x.status === "Active")) {
      const late = e.department === "Operations" ? 0.1 : 0.04;
      const r = rand();
      const status = r < late ? "Late" : r < late + 0.025 ? "Absent" : r < late + 0.045 ? "On leave" : "Present";
      attendance.push({ date: iso(t), employee_id: e.employee_id, status, hours_worked: status === "Present" ? int(8, 9) : status === "Late" ? int(6, 8) : 0 });
    }
  }
  const leave = [];
  let lid = 1;
  for (const e of employees)
    for (let k = 0; k < int(0, 3); k++) {
      const s = d("2025-01-01") + int(0, 540) * day;
      if (e.exit_date && s > d(e.exit_date)) continue;
      const type = weighted(["Annual", "Sick", "Maternity/Paternity", "Compassionate"], [70, 20, 5, 5]);
      const days = type === "Maternity/Paternity" ? int(10, 60) : type === "Annual" ? int(3, 15) : int(1, 5);
      leave.push({ leave_id: lid++, employee_id: e.employee_id, leave_type: type, start_date: iso(s), end_date: iso(s + (days - 1) * day), days, approved: rand() < 0.92 ? "Yes" : "No" });
    }
  return { employees, attendance, leave };
}

/* ---------- legal: a Lagos law firm */
function legal() {
  reseed(747474);
  const AREAS = {
    "Commercial litigation": { titles: ["Recovery of debt", "Breach of contract", "Enforcement of judgment"], courts: ["High Court, Lagos", "High Court, Lagos", "Court of Appeal, Lagos"], contentious: true },
    Corporate: { titles: ["Company incorporation", "Share transfer", "Contract review", "Due diligence"], courts: [], contentious: false },
    Property: { titles: ["Land title", "Lease dispute", "Tenancy recovery", "Property purchase"], courts: ["High Court, Lagos", "Magistrate Court, Ikeja"], contentious: true },
    Employment: { titles: ["Wrongful dismissal", "Unpaid wages claim", "Employment contract review"], courts: ["National Industrial Court"], contentious: true },
    Family: { titles: ["Divorce petition", "Custody application", "Probate and estate"], courts: ["High Court, Lagos"], contentious: true },
    "Intellectual property": { titles: ["Trademark registration", "Trademark opposition", "Copyright infringement"], courts: ["Federal High Court, Lagos"], contentious: true },
  };
  const NON_CONTENTIOUS = ["Company incorporation", "Share transfer", "Contract review", "Due diligence", "Property purchase", "Employment contract review", "Trademark registration", "Probate and estate"];
  const clients = Array.from({ length: 50 }, (_, i) => ({
    client_id: i + 1,
    client_name: rand() < 0.6 ? `${pick(["Sterling", "Beacon", "Pinnacle", "Crestview", "Majestic", "Summit", "Orchid", "Trident", "Harbour", "Cedar"])} ${pick(["Holdings", "Properties", "Industries", "Logistics", "Foods", "Partners", "Energy"])} Ltd` : person(),
    client_type: "",
    onboarded_date: iso(d("2022-01-01") + int(0, 1300) * day),
  }));
  for (const c of clients) c.client_type = / Ltd$/.test(c.client_name) ? "Company" : "Individual";
  const lawyers = Array.from({ length: 8 }, () => person());
  const matters = [];
  let mid = 2001;
  for (let k = 0; k < 150; k++) {
    const area = weighted(Object.keys(AREAS), [26, 20, 20, 12, 10, 12]);
    const title = pick(AREAS[area].titles);
    const client = pick(clients);
    const opened = Math.max(d(client.onboarded_date), d("2024-01-01") + int(0, 950) * day);
    const length = NON_CONTENTIOUS.includes(title) ? int(20, 120) : int(90, 700);
    const closeAt = opened + length * day;
    const onHold = rand() < 0.06;
    const closed = !onHold && closeAt <= SNAPSHOT;
    matters.push({ matter_id: mid++, client_id: client.client_id, matter_title: title, practice_area: area, responsible_lawyer: pick(lawyers), opened_date: iso(opened), closed_date: closed ? iso(closeAt) : null, status: closed ? "Closed" : onHold ? "On hold" : "Open" });
  }
  const hearings = [];
  let hid = 1;
  for (const m of matters) {
    if (NON_CONTENTIOUS.includes(m.matter_title)) continue;
    const end = m.closed_date ? d(m.closed_date) : SNAPSHOT + 90 * day;
    let t = d(m.opened_date) + int(30, 90) * day;
    while (t < end) {
      const future = t > SNAPSHOT;
      hearings.push({ hearing_id: hid++, matter_id: m.matter_id, hearing_date: iso(t), court: pick(AREAS[m.practice_area].courts), outcome: future ? "Scheduled" : weighted(["Adjourned", "Heard", "Struck out"], [58, 38, 4]) });
      if (future) break;
      t += int(30, 110) * day;
    }
    const last = hearings[hearings.length - 1];
    if (m.closed_date && last?.matter_id === m.matter_id && last.outcome !== "Scheduled") last.outcome = "Judgment delivered";
  }
  const invoices = [];
  let iid = 7001;
  for (const m of matters) {
    const end = Math.min(m.closed_date ? d(m.closed_date) + 30 * day : SNAPSHOT, SNAPSHOT);
    for (let t = d(m.opened_date) + int(7, 30) * day; t <= end; t += int(60, 150) * day) {
      const amount = round(NON_CONTENTIOUS.includes(m.matter_title) ? int(300000, 2500000) : int(800000, 6000000), 10000);
      const paidAfter = int(5, 90);
      const paid = t + paidAfter * day <= SNAPSHOT && rand() < 0.82;
      const age = (SNAPSHOT - t) / day;
      invoices.push({ invoice_id: iid++, matter_id: m.matter_id, issued_date: iso(t), amount_ngn: amount, status: paid ? "Paid" : age > 30 ? "Overdue" : "Outstanding", paid_date: paid ? iso(t + paidAfter * day) : null });
    }
  }
  return { clients, matters, hearings, invoices };
}

/* ------------------------------------------------------------------ retail (capstone) */
// Voltline Electronics: 8 stores, a raw till export with real-world problems, cost prices
// that change in 2026, monthly targets and stock-out records. Generated last, from its own
// seed, so adding it doesn't change any other dataset.
function retail() {
  seed = 20260701;
  const STORES = [
    { store_id: 1, store_code: "IKJ", store_name: "Ikeja", city: "Lagos", opened_date: "2018-03-10", floor_area_sqm: 240, manager: "Bisi Adeyemi", base: 7.2, attach: 0.45 },
    { store_id: 2, store_code: "LKI", store_name: "Lekki", city: "Lagos", opened_date: "2025-07-01", floor_area_sqm: 260, manager: "Tobi Okafor", base: 6.4, attach: 0.4 },
    { store_id: 3, store_code: "SRL", store_name: "Surulere", city: "Lagos", opened_date: "2016-11-02", floor_area_sqm: 180, manager: "Kunle Bello", base: 5.6, attach: 0.3 },
    { store_id: 4, store_code: "YAB", store_name: "Yaba", city: "Lagos", opened_date: "2021-05-15", floor_area_sqm: 150, manager: "Amaka Nwosu", base: 5.0, attach: 0.35 },
    { store_id: 5, store_code: "WSE", store_name: "Wuse", city: "Abuja", opened_date: "2019-09-01", floor_area_sqm: 210, manager: "Musa Danjuma", base: 6.0, attach: 0.3 },
    { store_id: 6, store_code: "GRK", store_name: "Garki", city: "Abuja", opened_date: "2022-02-20", floor_area_sqm: 140, manager: "Hauwa Suleiman", base: 3.8, attach: 0.15 },
    { store_id: 7, store_code: "PHC", store_name: "Port Harcourt", city: "Port Harcourt", opened_date: "2017-06-12", floor_area_sqm: 200, manager: "Ifeoma Eze", base: 5.4, attach: 0.25 },
    { store_id: 8, store_code: "IBD", store_name: "Ibadan", city: "Ibadan", opened_date: "2023-04-08", floor_area_sqm: 160, manager: "Segun Olawale", base: 3.6, attach: 0.2 },
  ];
  // [code, name, category, brand, 2025 price, margin]
  const P = [
    ["VP-101", "Zentro Z5 64GB", "Phones", "Zentro", 89000, 0.09],
    ["VP-102", "Zentro Z9 128GB", "Phones", "Zentro", 168000, 0.1],
    ["VP-103", "Kora A15 128GB", "Phones", "Kora", 215000, 0.11],
    ["VP-104", "Kora A35 256GB", "Phones", "Kora", 365000, 0.1],
    ["VP-105", "Lumio X Pro 256GB", "Phones", "Lumio", 640000, 0.08],
    ["VP-201", "Kora Book 14", "Laptops", "Kora", 455000, 0.1],
    ["VP-202", "Lumio Air 13", "Laptops", "Lumio", 980000, 0.08],
    ["VP-203", "Nexa Student 11", "Laptops", "Nexa", 285000, 0.12],
    ["VP-301", "Fast charger 25W", "Accessories", "Voltline", 9500, 0.48],
    ["VP-302", "Phone case and screen guard", "Accessories", "Voltline", 6500, 0.55],
    ["VP-303", "Power bank 20,000mAh", "Accessories", "Volt+", 24000, 0.4],
    ["VP-304", "Wireless earbuds", "Accessories", "Volt+", 32000, 0.42],
    ["VP-305", "USB-C cable 2m", "Accessories", "Voltline", 4500, 0.6],
    ["VP-401", "Solar panel 300W", "Solar & power", "SunCore", 118000, 0.2],
    ["VP-402", "Inverter 3.5kVA", "Solar & power", "SunCore", 520000, 0.18],
    ["VP-403", "Inverter 5kVA", "Solar & power", "SunCore", 790000, 0.17],
    ["VP-404", "Lithium battery 2.5kWh", "Solar & power", "SunCore", 640000, 0.19],
    ["VP-405", "Solar generator 1kW", "Solar & power", "Volt+", 410000, 0.22],
    ["VP-501", "Chest freezer 200L", "Home appliances", "Coolmax", 385000, 0.14],
    ["VP-502", "Smart TV 43-inch", "Home appliances", "Nexa", 335000, 0.13],
    ["VP-503", "Air conditioner 1.5HP", "Home appliances", "Coolmax", 545000, 0.12],
    ["VP-504", "Blender 1.5L", "Home appliances", "Coolmax", 42000, 0.25],
  ];
  const RISE = 1.18; // prices and costs from 1 January 2026, after the naira fell
  const products = P.map(([product_code, product_name, category, brand, price]) => ({ product_code, product_name, category, brand, list_price: round(price * RISE, 500) }));
  const cost_prices = [];
  for (const [code, , , , price, margin] of P) {
    cost_prices.push({ product_code: code, effective_from: "2025-01-01", unit_cost: round(price * (1 - margin), 100) });
    cost_prices.push({ product_code: code, effective_from: "2026-01-01", unit_cost: round(price * RISE * (1 - margin), 100) });
  }
  const byCat = {};
  for (const row of P) (byCat[row[2]] ??= []).push(row);
  // Category mix shifts towards solar during 2025-26 as grid power gets worse.
  const catWeights = (t) => {
    const months = (t - d("2025-01-01")) / (30.4 * day);
    return { Phones: 40, Laptops: 10, Accessories: 14, "Solar & power": 9 + months * 0.75, "Home appliances": 12 };
  };
  const itemWeights = { "VP-101": 30, "VP-102": 26, "VP-103": 22, "VP-104": 14, "VP-105": 8, "VP-201": 40, "VP-202": 15, "VP-203": 45, "VP-401": 34, "VP-402": 24, "VP-403": 14, "VP-404": 16, "VP-405": 12, "VP-501": 30, "VP-502": 34, "VP-503": 16, "VP-504": 20 };
  const accessories = byCat.Accessories;

  // Stock-outs: no sales of the product at the store while it's out.
  const stockouts = [
    { store_id: 5, product_code: "VP-403", out_from: "2026-03-02", back_in: "2026-04-24" },
    { store_id: 5, product_code: "VP-402", out_from: "2026-03-09", back_in: "2026-04-03" },
    { store_id: 1, product_code: "VP-105", out_from: "2025-10-06", back_in: "2025-10-27" },
    { store_id: 3, product_code: "VP-404", out_from: "2026-01-12", back_in: "2026-02-02" },
    { store_id: 7, product_code: "VP-202", out_from: "2025-05-05", back_in: "2025-06-09" },
    { store_id: 4, product_code: "VP-304", out_from: "2026-05-18", back_in: "2026-06-08" },
    { store_id: 8, product_code: "VP-401", out_from: "2025-08-11", back_in: "2025-08-29" },
    { store_id: 6, product_code: "VP-503", out_from: "2026-04-06", back_in: "2026-05-11" },
  ];
  const isOut = (store, code, t) => stockouts.some((s) => s.store_id === store && s.product_code === code && t >= d(s.out_from) && t < d(s.back_in));

  const pickProduct = (t) => {
    const w = catWeights(t);
    const cat = weighted(Object.keys(w), Object.values(w));
    const items = byCat[cat];
    return cat === "Accessories" ? pick(items) : weighted(items, items.map((r) => itemWeights[r[0]] ?? 10));
  };
  const priceOn = (row, t) => (t >= d("2026-01-01") ? round(row[4] * RISE, 500) : row[4]);

  const lines = [];
  const seq = {};
  const START = d("2025-01-01");
  const END = d("2026-06-30");
  for (let t = START; t <= END; t += day) {
    const date = new Date(t);
    const dow = date.getUTCDay();
    const month = date.getUTCMonth();
    const ymd = iso(t);
    let season = [0.9, 0.85, 0.95, 0.95, 1, 1, 1, 1, 1.05, 1, 1.35, 1.3][month];
    const blackFriday = ymd >= "2025-11-24" && ymd <= "2025-11-30";
    if (blackFriday) season *= 2.2;
    for (const s of STORES) {
      if (ymd < s.opened_date) continue;
      let level = s.base * season * (dow === 0 ? 0.45 : dow === 6 ? 1.25 : 1);
      if (s.store_id === 2) level *= Math.min(1, 0.25 + ((t - d("2025-07-01")) / day / 300) * 0.75); // Lekki ramps up
      if (s.store_id === 7 && ymd >= "2026-02-01") level *= 0.72; // competitor opens next door
      const n = Math.max(0, Math.round(level + (rand() - 0.5) * 3));
      for (let k = 0; k < n; k++) {
        seq[s.store_code] = (seq[s.store_code] ?? 0) + 1;
        const txn = `${s.store_code}-${String(seq[s.store_code]).padStart(6, "0")}`;
        const time = `${String(int(9, 19)).padStart(2, "0")}:${String(int(0, 59)).padStart(2, "0")}`;
        const basket = [];
        const first = pickProduct(t);
        if (!isOut(s.store_id, first[0], t)) basket.push(first);
        if (first[2] === "Phones" && rand() < s.attach) basket.push(pick(accessories));
        if (rand() < 0.15) basket.push(pick(accessories));
        if (!basket.length) continue;
        const big = basket.some((r) => r[4] >= 150000);
        const payment = weighted(["Cash", "Card", "Transfer", "Instalment"], big ? [8, 27, 45, 20] : [30, 35, 35, 0]);
        basket.forEach((row, i) => {
          const discPct = blackFriday ? 0.1 : rand() < 0.07 ? 0.05 : 0;
          const unit_price = priceOn(row, t);
          const qty = row[2] === "Accessories" && rand() < 0.15 ? 2 : 1;
          lines.push({ txn_id: txn, line_no: i + 1, store: s, t, txn_time: time, product_code: row[0], qty, unit_price, discount: round(unit_price * qty * discPct, 50), payment_method: payment });
          // Returns come back within 14 days as a negative line on a new transaction.
          const returnRate = row[0] === "VP-101" ? 0.09 : 0.015;
          if (rand() < returnRate) {
            const rt = t + int(2, 14) * day;
            if (rt <= END) lines.push({ txn_id: null, line_no: 1, store: s, t: rt, txn_time: time, product_code: row[0], qty: -qty, unit_price, discount: -round(unit_price * qty * discPct, 50), payment_method: payment });
          }
        });
      }
    }
  }
  // Give return lines their own transaction ids, in date order.
  lines.sort((a, b) => a.t - b.t || a.store.store_id - b.store.store_id || String(a.txn_id).localeCompare(String(b.txn_id)));
  for (const l of lines)
    if (!l.txn_id) {
      seq[l.store.store_code] += 1;
      l.txn_id = `${l.store.store_code}-${String(seq[l.store.store_code]).padStart(6, "0")}`;
    }

  // The till export, with the problems a real one has.
  const branchText = (s, ymd) => {
    if (s.store_id === 1) return ymd >= "2025-09-01" ? "Ikeja Store" : "IKEJA";
    if (s.store_id === 7) return ymd >= "2026-01-01" ? "P/Harcourt" : "Port Harcourt";
    if (s.store_id === 5) return "Wuse 2";
    if (s.store_id === 4) return "Yaba ";
    if (s.store_id === 8) return "ibadan";
    return s.store_name;
  };
  const sales_raw = [];
  for (const l of lines) {
    const ymd = iso(l.t);
    // Port Harcourt's till exports dates as DD/MM/YYYY.
    const txn_date = l.store.store_id === 7 ? `${ymd.slice(8, 10)}/${ymd.slice(5, 7)}/${ymd.slice(0, 4)}` : ymd;
    sales_raw.push({ txn_id: l.txn_id, line_no: l.line_no, txn_date, txn_time: l.txn_time, branch: branchText(l.store, ymd), product_code: l.product_code, qty: l.qty, unit_price: l.unit_price, discount: l.discount, payment_method: l.payment_method });
  }
  // Lekki's staff training week: test sales that were never real.
  for (let k = 1; k <= 14; k++)
    sales_raw.push({ txn_id: `LKI-T${String(k).padStart(3, "0")}`, line_no: 1, txn_date: `2025-06-${String(23 + (k % 7)).padStart(2, "0")}`, txn_time: "10:00", branch: "Lekki", product_code: "TEST", qty: 1, unit_price: 1, discount: 0, payment_method: "Cash" });
  // Surulere's November 2025 file was uploaded twice.
  const dup = sales_raw.filter((r) => r.branch === "Surulere" && r.txn_date.startsWith("2025-11"));
  sales_raw.push(...dup.map((r) => ({ ...r })));
  // Sort as an export would: by date then id (PH's text dates sort oddly, as they would).
  sales_raw.sort((a, b) => (a.txn_date < b.txn_date ? -1 : a.txn_date > b.txn_date ? 1 : a.txn_id < b.txn_id ? -1 : a.txn_id > b.txn_id ? 1 : a.line_no - b.line_no));

  // Monthly net-sales targets, set at the start of each year.
  const targets = [];
  const netBy = {};
  for (const l of lines) {
    const k = `${l.store.store_id}|${iso(l.t).slice(0, 7)}`;
    netBy[k] = (netBy[k] ?? 0) + l.unit_price * l.qty - l.discount;
  }
  for (const s of STORES)
    for (let m = 0; m < 18; m++) {
      const y = 2025 + Math.floor(m / 12);
      const mm = String((m % 12) + 1).padStart(2, "0");
      const month = `${y}-${mm}`;
      if (`${month}-01` < s.opened_date.slice(0, 8) + "01") continue;
      let target;
      if (s.store_id === 2) target = 52000000; // set at a mature store's level from day one
      else {
        const ly = netBy[`${s.store_id}|2025-${mm}`] ?? 0;
        target = y === 2025 ? ly * (0.94 + rand() * 0.1) : ly * (s.store_id === 7 ? 1.2 : 1.12 + rand() * 0.06);
      }
      targets.push({ store_id: s.store_id, month, net_sales_target: round(target, 100000) });
    }

  const stores = STORES.map(({ base, attach, ...rest }) => rest);
  return { stores, products, cost_prices, sales_raw, targets, stockouts };
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

const S = sales();
for (const [name, data] of [["sales", S], ["cleaning", customerExport(S.customers)], ["hr", hr()], ["legal", legal()]])
  for (const [table, rows] of Object.entries(data)) writeCsv(name, table, rows);
// Generated last, from its own seed, so it never changes the datasets above.
for (const [table, rows] of Object.entries(retail())) writeCsv("retail", table, rows);

// Summary for the build log
const counts = db.exec("SELECT (SELECT COUNT(*) FROM customers), (SELECT COUNT(*) FROM shipments), (SELECT COUNT(*) FROM payments), (SELECT COUNT(*) FROM routes), (SELECT COUNT(*) FROM employees)")[0].values[0];
console.log(`logistics.sqlite: ${counts[0]} customers, ${counts[1]} shipments, ${counts[2]} payments, ${counts[3]} routes, ${counts[4]} employees`);
for (const dir of fs.readdirSync(OUT).filter((f) => fs.statSync(path.join(OUT, f)).isDirectory()))
  console.log(`${dir}/: ${fs.readdirSync(path.join(OUT, dir)).map((f) => `${f} (${fs.readFileSync(path.join(OUT, dir, f), "utf8").split("\n").length - 2} rows)`).join(", ")}`);
