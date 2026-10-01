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

/* ------------------------------------------------------------------ agile (delivery) */
// Kolanut's kiosk ordering app: six two-week sprints of a Scrum team's backlog, as exported
// from its board on 22 May 2026, with the work still to do. Generated after everything else,
// from its own seed.
function agile() {
  seed = 20260801;
  const SPRINT_START = d("2026-03-02");
  const GOALS = {
    "Sign-up and login": "A kiosk owner can sign up and log in with a phone number",
    "Product catalogue": "Kiosks can browse the catalogue with current prices",
    "Basket and checkout": "A kiosk can build a basket and place an order",
    Payments: "Kiosks can pay by transfer or on delivery",
    "Order tracking": "Kiosks can see order status and delivery day",
    "Sales rep tools": "Sales reps can see and help their kiosks' orders",
    Reorder: "Reorder last week's basket in two taps",
  };
  const sprints = [];
  const goals = [
    "A kiosk owner can sign up and log in with a phone number",
    "Browse the product catalogue with current prices",
    "Build a basket and place an order",
    "Pay by transfer or on delivery",
    "See order status and delivery day",
    "Sales reps can see and help their kiosks' orders",
    "Reorder last week's basket in two taps",
    "Release candidate: fix, polish and pilot in Surulere",
  ];
  for (let k = 0; k < 8; k++) {
    const start = SPRINT_START + k * 14 * day;
    sprints.push({ sprint: k + 1, start_date: iso(start), end_date: iso(start + 11 * day), goal: goals[k], committed_points: k < 6 ? 0 : null, status: k < 6 ? "Closed" : k === 6 ? "Planned" : "Future" });
  }
  const EPICS = [
    ["Sign-up and login", "MVP", [["Register with phone number", 8], ["Verify phone by SMS code", 3], ["Log in with PIN", 3], ["Reset forgotten PIN", 2], ["Link kiosk to sales rep", 2]]],
    ["Product catalogue", "MVP", [["List products by category", 5], ["Show current price and pack size", 2], ["Search products", 3], ["Filter by category and brand", 3], ["Show out-of-stock items", 3], ["Product photos", 2]]],
    ["Basket and checkout", "MVP", [["Add and remove items in basket", 8], ["Minimum order value rule", 2], ["Delivery day selection", 3], ["Order confirmation screen", 2], ["Order confirmation SMS", 2], ["Apply volume discount", 5]]],
    ["Payments", "MVP", [["Pay on delivery", 3], ["Pay by bank transfer with reference", 8], ["Confirm transfer payments", 8], ["Credit limit check", 8], ["Payment receipt by SMS", 3]]],
    ["Order tracking", "MVP", [["Order status list", 3], ["Notify when order is dispatched", 3], ["Delivery day reminder SMS", 2], ["Cancel an order before dispatch", 3]]],
    ["Sales rep tools", "MVP", [["Rep sees kiosk orders", 5], ["Rep places order for a kiosk", 8], ["Rep sees kiosks that haven't ordered in 14 days", 3]]],
    ["Reorder", "MVP", [["Reorder last basket", 8], ["Favourite products list", 3]]],
    ["Loyalty", "Later", [["Points per order", 5], ["Redeem points", 8], ["Loyalty tiers", 5]]],
    ["Reporting", "Later", [["Kiosk monthly statement", 5], ["Rep performance dashboard", 8]]],
    ["Offline mode", "Later", [["Browse catalogue offline", 8], ["Queue orders offline", 13]]],
  ];
  // Stories added after planning started: scope creep, mostly into the MVP.
  const ADDED = [
    ["Basket and checkout", "Edit an order before dispatch", 5, 2],
    ["Payments", "Part-payment on delivery", 5, 3],
    ["Sign-up and login", "Yoruba, Hausa and Igbo language options", 8, 3],
    ["Order tracking", "Driver's phone number on the order", 2, 4],
    ["Product catalogue", "Promotions banner", 3, 4],
    ["Sales rep tools", "Rep visit notes", 3, 5],
    ["Basket and checkout", "Save basket for later", 3, 5],
    ["Payments", "Pay by card", 5, 6],
    ["Order tracking", "Delivery photo proof", 5, 6],
  ];
  const backlog = [];
  let id = 101;
  const add = (epic, release, title, points, type, createdSprint) =>
    backlog.push({ item_id: `KOA-${id++}`, type, title, epic, release, points, created_date: iso(SPRINT_START - (createdSprint === 0 ? int(5, 20) : -((createdSprint - 1) * 14 + int(0, 9))) * day), sprint: null, status: "To do", started_date: null, done_date: null });
  for (const [epic, release, stories] of EPICS) for (const [title, pts] of stories) add(epic, release, title, pts, "Story", 0);
  backlog.splice(2, 0, { item_id: "KOA-100", type: "Spike", title: "Choose SMS provider", epic: "Sign-up and login", release: "MVP", points: 2, created_date: "2026-02-16", sprint: null, status: "To do", started_date: null, done_date: null });
  for (const [epic, title, pts, s] of ADDED) add(epic, "MVP", title, pts, "Story", s);

  // Work the MVP backlog in order, sprint by sprint, at the team's capacity.
  const capacity = [14, 17, 19, 21, 20, 22];
  const mvpQueue = () => backlog.filter((b) => b.release === "MVP" && b.status === "To do" && b.type !== "Bug");
  for (let k = 0; k < 6; k++) {
    const s = sprints[k];
    const sStart = d(s.start_date);
    // Items created before this sprint can be planned into it.
    const ready = mvpQueue().filter((b) => d(b.created_date) < sStart);
    const carried = s.carried ?? 0;
    delete s.carried;
    let used = 0;
    const planned = [];
    for (const b of ready) {
      if (carried + used + b.points > capacity[k] + 2) continue;
      planned.push(b);
      used += b.points;
    }
    s.committed_points = carried + used;
    const byEpic = {};
    for (const p of planned) byEpic[p.epic] = (byEpic[p.epic] ?? 0) + p.points;
    const top = Object.entries(byEpic).sort((x, y) => y[1] - x[1])[0]?.[0];
    if (top) s.goal = GOALS[top];
    // Most planned work finishes; a slip carries the item over unfinished.
    planned.forEach((b, j) => {
      b.sprint = s.sprint;
      const slipped = j === planned.length - 1 && rand() < 0.5;
      const startOff = Math.min(9, Math.floor((j / planned.length) * 8) + int(0, 1));
      b.started_date = iso(sStart + startOff * day);
      if (slipped) {
        b.status = "To do"; // returns to the backlog, keeps its start date
        b.carried_over = true;
      } else {
        b.status = "Done";
        b.done_date = iso(sStart + Math.min(11, startOff + int(1, Math.max(2, Math.ceil(b.points / 2) + 1))) * day);
      }
    });
    // Bugs found during the sprint, fixed the same sprint or the next.
    const bugs = int(1, 3) + (k >= 3 ? 1 : 0);
    for (let n = 0; n < bugs; n++) {
      const found = sStart + int(2, 9) * day;
      const fixedNow = rand() < 0.6;
      backlog.push({ item_id: `KOA-${id++}`, type: "Bug", title: pick(["Price shows old value after refresh", "SMS code arrives late", "Basket total rounding", "Crash on older Android phones", "Delivery day list empty on Fridays", "Transfer reference not saved", "Search misses products with brackets", "Rep sees wrong kiosk list"]), epic: pick(["Basket and checkout", "Payments", "Product catalogue", "Sign-up and login", "Sales rep tools"]), release: "MVP", points: null, created_date: iso(found), sprint: fixedNow || k === 5 ? s.sprint : s.sprint + 1, status: fixedNow || k < 5 ? "Done" : "To do", started_date: iso(found + day), done_date: fixedNow ? iso(found + int(1, 2) * day) : k < 5 ? iso(found + 14 * day) : null });
    }
    // Carried-over items go first in the next sprint.
    for (const b of backlog.filter((x) => x.carried_over && x.status === "To do")) {
      delete b.carried_over;
      if (k < 5) {
        const ns = d(sprints[k + 1].start_date);
        b.sprint = s.sprint + 1;
        b.status = "Done";
        b.done_date = iso(ns + int(1, 3) * day);
        sprints[k + 1].carried = (sprints[k + 1].carried ?? 0) + b.points;
      } else {
        b.status = "In progress";
        b.sprint = s.sprint;
      }
    }
  }
  for (const b of backlog) delete b.carried_over;
  // Re-number bugs into id order and sort the export by id.
  backlog.sort((a, b) => Number(a.item_id.slice(4)) - Number(b.item_id.slice(4)));
  return { backlog, sprints };
}

/* ------------------------------------------------------------------ process (event log) */
// Harbourline's import clearance at Lagos port, January to June 2026: one row per case and an
// event log of every activity with start and end times. From 1 May a pre-arrival document
// checklist is piloted. Generated last, from its own seed.
function processLog() {
  seed = 20260901;
  const hrs = (h) => h * 3600000;
  const stamp = (t) => new Date(t).toISOString().slice(0, 16).replace("T", " ");
  const IMPORTERS = ["Manufacturer", "Retailer", "Pharmaceutical", "Construction", "Electronics"];
  const PILOT = d("2026-05-01");
  const FREE_DAYS = 3;
  const DEMURRAGE_PER_DAY = 45000; // per container, after the free days
  const cases = [];
  const events = [];
  let n = 0;
  for (let t = d("2026-01-05"); t <= d("2026-06-26"); t += day) {
    const arrivals = weighted([1, 2, 3, 4, 5], [12, 30, 30, 18, 10]) - (new Date(t).getUTCDay() === 0 ? 1 : 0);
    for (let k = 0; k < arrivals; k++) {
      n++;
      const id = `CLR-${String(n).padStart(4, "0")}`;
      const importer = weighted(IMPORTERS, [28, 24, 14, 18, 16]);
      const containers = weighted([1, 2, 3, 4], [45, 30, 15, 10]);
      const pilot = t >= PILOT;
      // Pharmaceutical imports need extra permits, so their documents are incomplete more often.
      const pIncomplete = (importer === "Pharmaceutical" ? 0.7 : 0.32) * (pilot ? 0.4 : 1);
      const complete = rand() >= pIncomplete;
      const channel = weighted(["Green", "Yellow", "Red"], importer === "Pharmaceutical" ? [15, 25, 60] : [35, 25, 40]);
      const arrival = t + hrs(int(5, 20));
      const ev = [];
      // Teams work 08:00 to 18:00: work that would start outside those hours waits.
      const work = (x) => {
        const h = new Date(x).getUTCHours();
        if (h < 8) return x - (x % day) + hrs(8) + hrs(int(0, 1));
        if (h >= 17) return x - (x % day) + day + hrs(8) + hrs(int(0, 1));
        return x;
      };
      const add = (activity, team, start, durH) => {
        start = work(start);
        const end = start + hrs(durH);
        ev.push({ case_id: id, activity, team, start_time: stamp(start), end_time: stamp(end) });
        return end;
      };
      // In the pilot, documents are checked before the vessel arrives.
      let cur = pilot ? arrival - hrs(int(24, 60)) : arrival + hrs(int(4, 30));
      cur = add("Check documents", "Documentation", cur, int(1, 3));
      let loops = complete ? 0 : rand() < 0.22 ? 2 : 1;
      for (let l = 0; l < loops; l++) {
        cur = add("Request corrected documents", "Documentation", cur + hrs(int(1, 6)), 0.5);
        cur = add("Re-check documents", "Documentation", cur + hrs(int(20, 96)), 1);
      }
      cur = Math.max(cur, arrival);
      cur = add("Submit customs declaration", "Customs broker", cur + hrs(int(2, 20)), int(1, 2));
      cur = add("Duty assessment", "Customs", cur + hrs(int(10, 40)), 1);
      cur = add("Confirm duty payment", "Finance", cur + hrs(int(12, 70)), 0.5);
      if (channel === "Yellow") cur = add("Document review by customs", "Customs", cur + hrs(int(8, 30)), 2);
      if (channel === "Red") {
        // The inspection queue is the bottleneck: it lengthens when many Red cases arrive together.
        const queued = cases.filter((c) => c.customs_channel === "Red" && Math.abs(d(c.arrival_datetime.slice(0, 10)) - t) <= 3 * day).length;
        cur = add("Physical inspection", "Customs", cur + hrs(int(12, 30) + queued * 4), int(2, 4));
      }
      const release = add("Release and gate-out", "Terminal", cur + hrs(int(10, 34)), int(1, 2));
      const delivered = add("Deliver to customer", "Haulage", release + hrs(int(1, 6)), int(4, 30));
      events.push(...ev);
      const daysAtPort = (release - arrival) / day;
      const chargeable = Math.max(0, Math.ceil(daysAtPort) - FREE_DAYS);
      cases.push({
        case_id: id,
        importer_type: importer,
        containers,
        arrival_datetime: stamp(arrival),
        docs_complete_on_arrival: complete ? "Yes" : "No",
        customs_channel: channel,
        checklist_pilot: pilot ? "Yes" : "No",
        released_datetime: stamp(release),
        delivered_datetime: stamp(delivered),
        demurrage_ngn: chargeable * containers * DEMURRAGE_PER_DAY,
      });
    }
  }
  events.sort((a, b) => (a.case_id < b.case_id ? -1 : a.case_id > b.case_id ? 1 : a.start_time < b.start_time ? -1 : 1));
  return { cases, events };
}

/* ------------------------------------------------------------------ machine learning */
// Two datasets with real, learnable structure plus the noise and mess real data has.
// Generated last, each from its own seed, so nothing above changes.
const normal = () => {
  // Box-Muller from the seeded generator.
  const u = Math.max(rand(), 1e-9);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

function rentals() {
  seed = 20261001;
  // [area, city, base annual rent for a 2-bedroom flat in naira, share of listings]
  const AREAS = [
    ["Ikoyi", "Lagos", 14000000, 5], ["Victoria Island", "Lagos", 11000000, 5], ["Lekki Phase 1", "Lagos", 8500000, 9],
    ["Ikeja GRA", "Lagos", 6000000, 6], ["Yaba", "Lagos", 3200000, 9], ["Surulere", "Lagos", 2600000, 9],
    ["Gbagada", "Lagos", 2800000, 7], ["Ajah", "Lagos", 2200000, 10], ["Ikorodu", "Lagos", 1100000, 6],
    ["Maitama", "Abuja", 10000000, 4], ["Wuse 2", "Abuja", 6500000, 6], ["Gwarinpa", "Abuja", 3000000, 8],
    ["Kubwa", "Abuja", 1400000, 8], ["Lugbe", "Abuja", 1200000, 8],
  ];
  const TYPES = [["Self-contain", 0, 0.32], ["Mini flat", 1, 0.55], ["Flat", null, 1], ["Terrace", null, 1.35], ["Duplex", null, 1.7]];
  const listings = [];
  for (let k = 1; k <= 2400; k++) {
    const [area, city, base] = weighted(AREAS, AREAS.map((a) => a[3]));
    const [type, fixedBeds, typeFactor] = weighted(TYPES, [14, 16, 42, 14, 14]);
    const bedrooms = fixedBeds !== null ? Math.max(1, fixedBeds) : type === "Flat" ? weighted([1, 2, 3, 4], [10, 40, 38, 12]) : weighted([3, 4, 5], [35, 45, 20]);
    const bathrooms = type === "Self-contain" || type === "Mini flat" ? 1 : Math.max(1, bedrooms + weighted([-1, 0, 1], [30, 55, 15]));
    const size = Math.round((type === "Self-contain" ? 28 : type === "Mini flat" ? 45 : 35 + bedrooms * 38 * (type === "Flat" ? 1 : 1.25)) * Math.exp(normal() * 0.15));
    const serviced = rand() < (base > 5000000 ? 0.55 : 0.18);
    const furnished = rand() < (serviced ? 0.35 : 0.08);
    const power = weighted(["Prepaid meter", "Prepaid meter and generator", "24-hour power"], serviced ? [10, 40, 50] : [55, 35, 10]);
    const yearBuilt = int(1985, 2025);
    const parking = type === "Self-contain" ? 0 : Math.min(4, Math.max(0, Math.round(bedrooms / 2 + normal() * 0.7)));
    let rent =
      base *
      typeFactor *
      (type === "Flat" ? [0, 0.72, 1, 1.32, 1.65][bedrooms] : type === "Self-contain" || type === "Mini flat" ? 1 : 0.8 + bedrooms * 0.12) *
      Math.pow(size / (type === "Flat" ? 35 + bedrooms * 38 : size), 0.35) *
      (serviced ? 1.28 : 1) *
      (furnished ? 1.18 : 1) *
      (power === "24-hour power" ? 1.12 : power === "Prepaid meter and generator" ? 1.05 : 1) *
      (1 - Math.min(0.25, (2025 - yearBuilt) * 0.006)) *
      Math.exp(normal() * 0.18);
    rent = round(rent, 50000);
    listings.push({
      listing_id: `RL-${String(k).padStart(5, "0")}`,
      city,
      area,
      property_type: type,
      bedrooms,
      bathrooms,
      size_sqm: rand() < 0.06 ? null : size, // agents often leave the size out
      serviced: serviced ? "Yes" : "No",
      furnished: furnished ? "Yes" : "No",
      power,
      parking_spaces: parking,
      year_built: yearBuilt,
      listed_date: iso(d("2025-07-01") + int(0, 364) * day),
      annual_rent_ngn: rent,
    });
  }
  // A few listings typed with an extra zero.
  for (const i of [57, 412, 903, 1388, 1940, 2207]) listings[i].annual_rent_ngn *= 10;
  return { listings };
}

function loans() {
  seed = 20261101;
  const REGIONS = ["Lagos", "Ogun", "Oyo", "Kano", "Kaduna", "Enugu", "Anambra", "Rivers", "FCT"];
  const BUSINESS = [["Retail shop", 1], ["Food vendor", 1.15], ["Tailoring", 0.9], ["Transport", 1.25], ["Farming", 1.35], ["Hair and beauty", 0.95], ["Phone and accessories", 1.0]];
  const loans = [];
  for (let k = 1; k <= 5000; k++) {
    const region = weighted(REGIONS, [22, 9, 10, 12, 8, 10, 9, 10, 10]);
    const [business, bizRisk] = weighted(BUSINESS, [26, 18, 10, 12, 10, 12, 12]);
    const age = Math.min(65, Math.max(19, Math.round(36 + normal() * 9)));
    const years = Math.max(0, Math.round(Math.exp(1.3 + normal() * 0.7) - 1));
    const revenue = round(Math.exp(Math.log(380000) + normal() * 0.6) * (1 + years * 0.03), 1000);
    const previous = weighted([0, 1, 2, 3, 4, 5], [35, 22, 16, 12, 9, 6]);
    const lates = previous === 0 ? 0 : Math.min(previous * 3, Math.max(0, Math.round(Math.exp(normal() * 0.9) - 1 + (rand() < 0.15 ? 2 : 0))));
    const amount = round(Math.max(50000, revenue * (0.6 + rand() * 1.4) * (1 + previous * 0.15)), 5000);
    const term = weighted([3, 6, 9, 12], [20, 40, 20, 20]);
    const group = rand() < 0.4;
    const guarantor = !group && rand() < 0.45;
    const momo = Math.max(0, Math.round(Math.exp(Math.log(25) + normal() * 0.8)));
    const rate = round(3.5 + (lates > 0 ? 0.5 : 0) + (group ? -0.5 : 0) + rand(), 0.1); // % per month
    const ratio = amount / revenue;
    const logit =
      -1.55 + 1.0 * (ratio - 1.3) + 0.65 * Math.min(lates, 4) - 0.22 * Math.min(years, 8) + Math.log(bizRisk) * 2.5 -
      0.8 * (group ? 1 : 0) - 0.7 * (guarantor ? 1 : 0) - 0.6 * Math.log1p(momo / 10) + 0.07 * (term - 6) + 0.35 * (previous === 0 ? 1 : 0) + normal() * 0.35;
    const defaulted = rand() < 1 / (1 + Math.exp(-logit)) ? 1 : 0;
    loans.push({
      loan_id: `LN-${String(k).padStart(5, "0")}`,
      disbursed_date: iso(d("2024-01-01") + int(0, 729) * day),
      region,
      business_type: business,
      borrower_age: age,
      years_in_business: years,
      monthly_revenue_ngn: revenue,
      loan_amount_ngn: amount,
      term_months: term,
      interest_rate_monthly_pct: Number(rate.toFixed(1)),
      previous_loans: previous,
      previous_late_payments: lates,
      group_loan: group ? "Yes" : "No",
      has_guarantor: guarantor ? "Yes" : "No",
      mobile_money_txns_per_month: momo,
      defaulted,
    });
  }
  return { loans };
}

/* ------------------------------------------------------------------ wallet (churn, time-based) */
// Paystream, a mobile wallet: customers and every transaction from January 2025 to June 2026.
// Customers who leave fade out first (fewer transactions, more failures). A competitor's
// launch in March 2026 raises churn among customers acquired through social ads. Generated
// last, from its own seed.
function wallet() {
  seed = 20261201;
  const START = d("2025-01-01");
  const END = d("2026-06-30");
  const STATES = ["Lagos", "Oyo", "Ogun", "Kano", "Kaduna", "Rivers", "Enugu", "Anambra", "FCT", "Delta"];
  const TYPES = [["Transfer", 30, 18000], ["Airtime", 30, 1500], ["Bill payment", 15, 9000], ["Card payment", 15, 7000], ["Cash out", 10, 15000]];
  const customers = [];
  const transactions = [];
  let tid = 0;
  for (let k = 1; k <= 1500; k++) {
    const signup = d("2024-06-01") + int(0, 637) * day; // to 2026-02-28
    const channel = weighted(["Referral", "Agent", "Social ads", "Organic"], [25, 30, 25, 20]);
    const kyc = weighted([1, 2, 3], [35, 45, 20]);
    const engagement = Math.exp(normal() * 0.6);
    const failProne = rand() < 0.2;
    const pFail = failProne ? 0.09 : 0.025;
    // Monthly churn hazard, then a churn date (or none).
    let churnAt = null;
    for (let m = Math.max(START, signup + 30 * day); m <= END; m += 30 * day) {
      let h = 0.022;
      if (kyc === 1) h *= 1.6;
      if (channel === "Social ads") h *= 1.3;
      if (channel === "Referral") h *= 0.7;
      if (engagement < 0.6) h *= 1.6;
      if (failProne) h *= 1.6;
      if (channel === "Social ads" && m >= d("2026-03-01")) h *= 2.2; // competitor launch
      if (rand() < h) {
        churnAt = m + int(0, 29) * day;
        break;
      }
    }
    customers.push({
      customer_id: `PS-${String(k).padStart(5, "0")}`,
      signup_date: iso(signup),
      state: weighted(STATES, [26, 9, 7, 10, 7, 9, 7, 7, 10, 8]),
      age_band: weighted(["18-24", "25-34", "35-44", "45-54", "55+"], [24, 38, 22, 11, 5]),
      acquisition_channel: channel,
      kyc_tier: kyc,
    });
    const id = customers[customers.length - 1].customer_id;
    const lambda = 3.2 * engagement; // transactions per month when fully active
    const first = Math.max(START, signup);
    const last = churnAt === null ? END : Math.min(END, churnAt);
    for (let t = first; t <= last; t += day) {
      let rate = lambda / 30;
      // Fade-out: activity falls over the 45 days before leaving, and failures rise.
      let fail = pFail;
      if (churnAt !== null && churnAt - t < 45 * day) {
        rate *= 0.25 + (0.75 * (churnAt - t)) / (45 * day);
        fail *= 2.2;
      }
      // Salary week and December bumps.
      const dt = new Date(t);
      if (dt.getUTCDate() >= 25) rate *= 1.3;
      if (dt.getUTCMonth() === 11) rate *= 1.25;
      if (rand() < rate) {
        const [type, , avg] = weighted(TYPES, TYPES.map((x) => x[1]));
        transactions.push({
          transaction_id: `T${String(++tid).padStart(7, "0")}`,
          customer_id: id,
          transaction_date: iso(t),
          type,
          amount_ngn: round(Math.max(100, avg * Math.exp(normal() * 0.7)), 50),
          status: rand() < fail ? "Failed" : "Success",
        });
      }
    }
  }
  transactions.sort((a, b) => (a.transaction_date < b.transaction_date ? -1 : a.transaction_date > b.transaction_date ? 1 : a.transaction_id < b.transaction_id ? -1 : 1));
  transactions.forEach((x, i) => (x.transaction_id = `T${String(i + 1).padStart(7, "0")}`));
  return { customers, transactions };
}

/* ------------------------------------------------------------------ experiments */
// Paystream's experiments: an onboarding A/B test (user level), a homepage banner test
// (daily, with a broken randomiser and a novelty effect), a transfer-fee test with guardrail
// metrics, and a state-by-state rollout of cash-out agents for difference-in-differences.
// Generated last, from its own seed.
function experiments() {
  seed = 20270101;
  const poisson = (lam) => {
    let L = Math.exp(-lam), k = 0, p = 1;
    do { k++; p *= rand(); } while (p > L);
    return k - 1;
  };
  // 1. Onboarding: new signup flow (B) against the old one (A), 4 weeks of new users.
  const REGIONS = ["Lagos", "Oyo", "Ogun", "Kano", "Kaduna", "Rivers", "Enugu", "Anambra", "FCT", "Delta"];
  const onboarding = [];
  for (let k = 1; k <= 12000; k++) {
    const variant = rand() < 0.5 ? "A" : "B";
    const platform = rand() < 0.78 ? "Android" : "iOS";
    const channel = weighted(["Referral", "Agent", "Social ads", "Organic"], [25, 30, 25, 20]);
    const region = weighted(REGIONS, [26, 9, 7, 10, 7, 9, 7, 7, 10, 8]);
    let pKyc = 0.38 + (channel === "Referral" ? 0.06 : channel === "Social ads" ? -0.06 : 0) + (platform === "iOS" ? 0.04 : 0);
    if (variant === "B" && platform === "Android") pKyc += 0.045; // the new flow fixes an Android camera step
    const kyc = rand() < pKyc ? 1 : 0;
    const engagement = Math.exp(normal() * 0.9);
    const txns = kyc ? poisson(2.2 * engagement * (variant === "B" ? 1.06 : 1)) : poisson(0.4 * engagement);
    let value = 0;
    for (let n = 0; n < txns; n++) value += Math.max(100, 9000 * Math.exp(normal() * 1.0));
    onboarding.push({
      user_id: `U${String(k).padStart(6, "0")}`,
      signup_date: iso(d("2026-05-04") + int(0, 27) * day),
      variant,
      platform,
      acquisition_channel: channel,
      region,
      completed_kyc_7d: kyc,
      txns_first_14d: txns,
      value_first_14d_ngn: round(value, 50),
    });
  }
  // 2. Homepage banner: daily counts. Variant B's randomiser dropped some users (sample ratio
  //    mismatch), and its click rate starts high and fades (novelty).
  const banner_daily = [];
  for (let k = 0; k < 28; k++) {
    const date = iso(d("2026-06-01") + k * day);
    for (const variant of ["A", "B"]) {
      const users = Math.round((variant === "A" ? 4000 : 3720) * (1 + normal() * 0.03));
      const ctr = variant === "A" ? 0.031 : 0.031 + 0.022 * Math.exp(-k / 5) + 0.002;
      let clicks = 0;
      for (let u = 0; u < users; u++) if (rand() < ctr) clicks++;
      banner_daily.push({ date, variant, users, clicks });
    }
  }
  // 3. Transfer fee: ₦10 (control) against ₦25 (test) per transfer, existing users, 4 weeks.
  const fee_test = [];
  for (let k = 1; k <= 8000; k++) {
    const variant = rand() < 0.5 ? "Control" : "Higher fee";
    const engagement = Math.exp(normal() * 0.8);
    const leaves = rand() < (variant === "Control" ? 0.06 : 0.095);
    const weeks = leaves ? int(1, 3) : 4;
    const transfers = poisson(1.6 * engagement * weeks * (variant === "Control" ? 1 : 0.88));
    fee_test.push({
      user_id: `F${String(k).padStart(6, "0")}`,
      variant,
      transfers_28d: transfers,
      fee_revenue_28d_ngn: transfers * (variant === "Control" ? 10 : 25),
      active_on_day_28: leaves ? 0 : 1,
    });
  }
  // 4. Cash-out agents rolled out in three states from week 14 of 2026; weekly active users
  //    per state, with a shared seasonal pattern.
  const rollout = [];
  const AGENT_STATES = ["Kano", "Kaduna", "Enugu"];
  const sizes = { Lagos: 5200, Oyo: 1800, Ogun: 1500, Kano: 2100, Kaduna: 1500, Rivers: 1700, Enugu: 1300, Anambra: 1400, FCT: 2000, Delta: 1200 };
  for (const [state, size] of Object.entries(sizes)) {
    for (let w = 1; w <= 26; w++) {
      const season = 1 + 0.05 * Math.sin(w / 4) + (w >= 10 && w <= 13 ? 0.04 : 0);
      const treated = AGENT_STATES.includes(state) && w >= 14;
      const active = Math.round(size * season * (1 + 0.004 * w) * (treated ? 1.08 : 1) * (1 + normal() * 0.012));
      rollout.push({ state, week: w, week_start: iso(d("2025-12-29") + (w - 1) * 7 * day), agents_launched: treated ? 1 : 0, weekly_active_users: active });
    }
  }
  return { onboarding, banner_daily, fee_test, rollout };
}

/* ------------------------------------------------------------------ demand (time series) */
// Kolanut's Lagos depot: daily units for six products, July 2022 to June 2026, with a
// holiday calendar. Weekly and yearly seasonality, payday and pre-Eid peaks, closures,
// promotions with a post-promotion dip, and a price rise in January 2026 that lowers
// volume. Generated last, from its own seed.
function demand() {
  seed = 20270201;
  const START = d("2022-07-01");
  const END = d("2026-06-30");
  const holidays = [];
  const addHol = (date, name, closed) => holidays.push({ date, holiday: name, depot_closed: closed ? 1 : 0 });
  for (const y of [2022, 2023, 2024, 2025, 2026]) {
    addHol(`${y}-01-01`, "New Year's Day", true);
    addHol(`${y}-05-01`, "Workers' Day", false);
    addHol(`${y}-06-12`, "Democracy Day", false);
    addHol(`${y}-10-01`, "Independence Day", false);
    addHol(`${y}-12-25`, "Christmas Day", true);
    addHol(`${y}-12-26`, "Boxing Day", false);
  }
  const EID_FITR = ["2023-04-21", "2024-04-10", "2025-03-30", "2026-03-20"];
  const EID_ADHA = ["2022-07-09", "2023-06-28", "2024-06-16", "2025-06-06"];
  const EASTER = ["2023-04-09", "2024-03-31", "2025-04-20", "2026-04-05"];
  for (const e of EID_FITR) addHol(e, "Eid al-Fitr", true);
  for (const e of EID_ADHA) addHol(e, "Eid al-Adha", true);
  for (const e of EASTER) {
    addHol(iso(d(e) - 2 * day), "Good Friday", false);
    addHol(iso(d(e) + day), "Easter Monday", false);
  }
  const hol = Object.fromEntries(holidays.map((h) => [h.date, h]));
  const eids = [...EID_FITR, ...EID_ADHA].map(d);
  // [product, category, base units/day, December lift, Eid lift, rainy-season effect, price]
  const P = [
    ["Malt drink 330ml (24)", "Beverages", 120, 1.55, 1.5, 0.95, 13200],
    ["Bottled water 75cl (12)", "Beverages", 210, 1.25, 1.35, 0.85, 3600],
    ["Orange juice 1L (12)", "Beverages", 55, 1.6, 1.4, 0.95, 18600],
    ["Plantain chips 150g (20)", "Snacks", 70, 1.35, 1.2, 1.0, 9200],
    ["Detergent 900g (12)", "Household", 45, 1.15, 1.05, 1.05, 21500],
    ["Bar soap (48)", "Personal care", 60, 1.1, 1.05, 1.0, 14400],
  ];
  const DOW = [0.55, 1.0, 0.97, 0.98, 1.02, 1.1, 1.25]; // Sunday to Saturday
  const rows = [];
  for (const [product, category, base, decLift, eidLift, rainy, price0] of P) {
    // About six week-long promotions a year per product, not in December.
    const promos = new Set();
    for (let t = START; t <= END; t += day) {
      const m = new Date(t).getUTCMonth();
      if (m !== 11 && rand() < 6 / 365) for (let k = 0; k < 7; k++) promos.add(t + k * day);
    }
    for (let t = START; t <= END; t += day) {
      const date = iso(t);
      const dt = new Date(t);
      const years = (t - START) / (365.25 * day);
      let level = base * (1 + 0.06 * years); // 6% a year growth
      level *= DOW[dt.getUTCDay()];
      const dom = dt.getUTCDate();
      const dim = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth() + 1, 0)).getUTCDate();
      if (dom >= dim - 2 || dom <= 2) level *= 1.12; // payday
      const month = dt.getUTCMonth();
      if (month === 11) level *= 1 + (decLift - 1) * Math.min(1, dom / 20);
      if (month === 0) level *= 0.88;
      if (month >= 5 && month <= 8) level *= rainy;
      const toEid = eids.map((e) => (e - t) / day).filter((x) => x > 0 && x <= 5);
      if (toEid.length) level *= eidLift;
      const promo = promos.has(t);
      if (promo) level *= 1.45;
      else if (promos.has(t - 7 * day) || promos.has(t - 3 * day)) level *= 0.88; // post-promotion dip
      const priceRise = t >= d("2026-01-01");
      if (priceRise) level *= 0.92;
      const closed = hol[date]?.depot_closed === 1;
      const units = closed ? 0 : Math.max(0, Math.round(level * Math.exp(normal() * 0.11)));
      const price = Math.round((priceRise ? price0 * 1.12 : price0) * (promo ? 0.9 : 1) / 50) * 50;
      rows.push({ date, product, category, units, on_promotion: promo ? 1 : 0, price_ngn: price });
    }
  }
  rows.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.product < b.product ? -1 : 1));
  holidays.sort((a, b) => (a.date < b.date ? -1 : 1));
  return { daily_sales: rows, holidays };
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
for (const [table, rows] of Object.entries(agile())) writeCsv("agile", table, rows);
for (const [table, rows] of Object.entries(processLog())) writeCsv("process", table, rows);
for (const [table, rows] of Object.entries(rentals())) writeCsv("rentals", table, rows);
for (const [table, rows] of Object.entries(loans())) writeCsv("loans", table, rows);
for (const [table, rows] of Object.entries(wallet())) writeCsv("wallet", table, rows);
for (const [table, rows] of Object.entries(experiments())) writeCsv("experiments", table, rows);
for (const [table, rows] of Object.entries(demand())) writeCsv("demand", table, rows);

// Summary for the build log
const counts = db.exec("SELECT (SELECT COUNT(*) FROM customers), (SELECT COUNT(*) FROM shipments), (SELECT COUNT(*) FROM payments), (SELECT COUNT(*) FROM routes), (SELECT COUNT(*) FROM employees)")[0].values[0];
console.log(`logistics.sqlite: ${counts[0]} customers, ${counts[1]} shipments, ${counts[2]} payments, ${counts[3]} routes, ${counts[4]} employees`);
for (const dir of fs.readdirSync(OUT).filter((f) => fs.statSync(path.join(OUT, f)).isDirectory()))
  console.log(`${dir}/: ${fs.readdirSync(path.join(OUT, dir)).map((f) => `${f} (${fs.readFileSync(path.join(OUT, dir, f), "utf8").split("\n").length - 2} rows)`).join(", ")}`);
