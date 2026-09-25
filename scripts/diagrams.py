"""Generates the course diagrams (SVG) in public/images/courses.

    python scripts/diagrams.py

Diagrams are drawn from code so they stay consistent and easy to correct: entity boxes with
key markers, crow's-foot relationship lines, and simple labelled layouts. Colours match the site
(ivory paper, charcoal ink, brass accents); each SVG carries its own background so it reads
the same in light and dark mode.
"""
from pathlib import Path
from xml.sax.saxutils import escape

OUT = Path(__file__).resolve().parent.parent / "public" / "images" / "courses"

PAPER = "#FBF8F2"
INK = "#1F1F1F"
MUTED = "#6B665C"
LINE = "#D9CFBF"
BRASS = "#B38A3E"
BRASS_PALE = "#F3E9D2"
HEAD = "#2B2A28"
FACT = "#8C6A2C"
GREEN = "#2F7D55"
RED = "#B4452F"
FONT = "Inter, 'Segoe UI', Arial, sans-serif"
MONO = "'JetBrains Mono', Consolas, 'Courier New', monospace"


class Svg:
    def __init__(self, w, h, title):
        self.w, self.h, self.title = w, h, title
        self.parts = []

    def add(self, s):
        self.parts.append(s)

    def text(self, x, y, s, size=14, weight=400, fill=INK, anchor="start", font=FONT, italic=False):
        style = ' font-style="italic"' if italic else ""
        self.add(f'<text x="{x}" y="{y}" font-family="{font}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" xml:space="preserve"{style}>{escape(s)}</text>')

    def rect(self, x, y, w, h, fill="#fff", stroke=LINE, sw=1.5, r=10, dash=None):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        self.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>')

    def line(self, pts, stroke=INK, sw=1.8, dash=None):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        path = " ".join(f"{'M' if i == 0 else 'L'}{x},{y}" for i, (x, y) in enumerate(pts))
        self.add(f'<path d="{path}" fill="none" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"{d}/>')

    def save(self, rel):
        p = OUT / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        body = "\n".join(self.parts)
        p.write_text(
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" width="{self.w}" height="{self.h}" role="img" aria-label="{escape(self.title)}">\n'
            f'<title>{escape(self.title)}</title>\n<rect width="{self.w}" height="{self.h}" fill="{PAPER}"/>\n{body}\n</svg>\n',
            encoding="utf-8",
        )
        print("wrote", rel)


ROW = 26
HEADER = 38


def entity(svg, x, y, name, cols, w=230, header_fill=HEAD, note=None):
    """Draws a table box. cols: list of (name, key, type) where key is 'PK', 'FK', 'PK FK' or ''.
    Returns a dict of anchor points: row centres on the left and right edges, and box edges."""
    h = HEADER + ROW * len(cols) + 10
    svg.rect(x, y, w, h, fill="#FFFFFF", stroke="#CFC4B2", sw=1.5, r=10)
    svg.add(f'<path d="M{x},{y + 10} a10,10 0 0 1 10,-10 h{w - 20} a10,10 0 0 1 10,10 v{HEADER - 10} h-{w} z" fill="{header_fill}"/>')
    svg.text(x + 14, y + 25, name, size=16, weight=700, fill="#FFFFFF")
    if note:
        svg.text(x + w - 12, y + 25, note, size=11, weight=600, fill=BRASS_PALE, anchor="end")
    anchors = {"left": x, "right": x + w, "top": y, "bottom": y + h, "cx": x + w / 2, "rows": {}}
    for i, (c, key, typ) in enumerate(cols):
        cy = y + HEADER + 6 + ROW * i + ROW / 2
        if i % 2 == 1:
            svg.add(f'<rect x="{x + 1}" y="{cy - ROW / 2}" width="{w - 2}" height="{ROW}" fill="#FAF6EE"/>')
        if key:
            kfill = BRASS if "PK" in key else "#5B7C99"
            kw = 18 * len(key.split()) + 6 * (len(key.split()) - 1)
            svg.add(f'<rect x="{x + 10}" y="{cy - 9}" width="{kw}" height="18" rx="4" fill="{kfill}"/>')
            svg.text(x + 10 + kw / 2, cy + 4, key, size=9.5, weight=700, fill="#FFFFFF", anchor="middle")
        svg.text(x + 58, cy + 5, c, size=13.5, weight=600 if "PK" in key else 400, fill=INK)
        if typ:
            svg.text(x + w - 12, cy + 5, typ, size=11.5, fill=MUTED, anchor="end", font=MONO)
        anchors["rows"][c] = cy
    return anchors


def end_marker(svg, x, y, direction, kind):
    """Crow's-foot end at (x, y). direction: unit vector pointing from the line INTO the entity
    ('r', 'l', 'u', 'd'). kind: 'one', 'many', 'zero-one', 'zero-many'."""
    dx, dy = {"r": (1, 0), "l": (-1, 0), "u": (0, -1), "d": (0, 1)}[direction]
    px, py = -dy, dx  # perpendicular
    def pt(a, b):
        return (x - dx * a + px * b, y - dy * a + py * b)
    if kind in ("many", "zero-many"):
        svg.line([pt(0, -9), pt(16, 0), pt(0, 9)], sw=1.8)
        svg.line([pt(0, 0), pt(16, 0)], sw=1.8)
        bar_at = 22
    else:
        svg.line([pt(8, -8), pt(8, 8)], sw=1.8)
        bar_at = 14
    if kind.startswith("zero"):
        cx, cy = pt(bar_at + 7, 0)
        svg.add(f'<circle cx="{cx}" cy="{cy}" r="6" fill="{PAPER}" stroke="{INK}" stroke-width="1.8"/>')
    else:
        svg.line([pt(bar_at, -8), pt(bar_at, 8)], sw=1.8)


def relate(svg, a, a_dir, a_kind, b, b_dir, b_kind, via=(), label=None, label_at=None):
    """Line from point a to point b (through optional waypoints) with end markers."""
    svg.line([a, *via, b], sw=1.8)
    end_marker(svg, *a, a_dir, a_kind)
    end_marker(svg, *b, b_dir, b_kind)
    if label and label_at:
        svg.text(*label_at, label, size=12, fill=MUTED, anchor="middle", italic=True)


def legend_crowsfoot(svg, x, y):
    svg.text(x, y, "How to read the lines", size=13, weight=700, fill=INK)
    items = [("one", "exactly one"), ("zero-one", "zero or one"), ("many", "one or many"), ("zero-many", "zero or many")]
    for i, (k, lab) in enumerate(items):
        yy = y + 26 + i * 26
        svg.line([(x, yy), (x + 60, yy)], sw=1.8)
        end_marker(svg, x + 60, yy, "r", k)
        svg.text(x + 74, yy + 4, lab, size=12.5, fill=MUTED)


# ---------------------------------------------------------------- Harbourline ERD
def harbourline_erd(rel="sql/harbourline-erd.svg"):
    s = Svg(1180, 700, "Entity-relationship diagram of the Harbourline Freight database: employees, customers, shipments, routes and payments, joined by keys.")
    emp = entity(s, 40, 40, "employees", [("employee_id", "PK", "int"), ("full_name", "", "text"), ("role", "", "text"), ("team", "", "text"), ("hire_date", "", "date"), ("manager_id", "FK", "int")])
    cus = entity(s, 40, 360, "customers", [("customer_id", "PK", "int"), ("company_name", "", "text"), ("industry", "", "text"), ("city", "", "text"), ("country", "", "text"), ("signup_date", "", "date"), ("account_manager_id", "FK", "int")], w=250)
    shp = entity(s, 450, 200, "shipments", [("shipment_id", "PK", "int"), ("customer_id", "FK", "int"), ("route_id", "FK", "int"), ("booking_date", "", "date"), ("ship_date", "", "date"), ("delivery_date", "", "date"), ("status", "", "text"), ("containers", "", "int"), ("weight_kg", "", "int"), ("freight_charge", "", "int")], w=250)
    rte = entity(s, 900, 40, "routes", [("route_id", "PK", "int"), ("origin", "", "text"), ("destination", "", "text"), ("mode", "", "text"), ("target_transit_days", "", "int")], w=250)
    pay = entity(s, 900, 400, "payments", [("payment_id", "PK", "int"), ("shipment_id", "FK", "int"), ("payment_date", "", "date"), ("amount", "", "int"), ("method", "", "text")], w=250)
    # employees 1 — 0..* customers (account manager)
    y1 = emp["rows"]["employee_id"]
    y2 = cus["rows"]["account_manager_id"]
    relate(s, (emp["left"], y1), "r", "zero-one", (cus["left"], y2), "r", "zero-many", via=[(18, y1), (18, y2)])
    s.text(26, 330, "manages", size=12, fill=MUTED, italic=True)
    # employees self-reference (manager)
    ym = emp["rows"]["manager_id"]
    relate(s, (emp["right"], ym), "l", "zero-many", (emp["right"], y1), "l", "zero-one", via=[(emp["right"] + 40, ym), (emp["right"] + 40, y1)])
    s.text(emp["right"] + 48, (ym + y1) / 2 + 4, "reports to", size=12, fill=MUTED, italic=True)
    # customers 1 — * shipments
    yc = cus["rows"]["customer_id"]
    ys = shp["rows"]["customer_id"]
    relate(s, (cus["right"], yc), "l", "one", (shp["left"], ys), "r", "zero-many", via=[(380, yc), (380, ys)])
    s.text(385, (yc + ys) / 2 + 20, "books", size=12, fill=MUTED, italic=True)
    # routes 1 — * shipments
    yr = rte["rows"]["route_id"]
    ysr = shp["rows"]["route_id"]
    relate(s, (rte["left"], yr), "r", "one", (shp["right"], ysr), "l", "zero-many", via=[(820, yr), (820, ysr)])
    s.text(826, (yr + ysr) / 2, "used by", size=12, fill=MUTED, italic=True)
    # shipments 1 — * payments
    ysp = shp["rows"]["shipment_id"]
    yp = pay["rows"]["shipment_id"]
    relate(s, (shp["right"], ysp), "l", "one", (pay["left"], yp), "r", "zero-many", via=[(780, ysp), (780, yp)])
    s.text(786, yp - 12, "paid by", size=12, fill=MUTED, italic=True)
    legend_crowsfoot(s, 470, 560)
    s.text(900, 600, "PK  primary key", size=12.5, fill=MUTED)
    s.add(f'<rect x="900" y="588" width="22" height="16" rx="3" fill="{BRASS}"/>')
    s.text(911, 600, "PK", size=9, weight=700, fill="#fff", anchor="middle")
    s.add(f'<rect x="900" y="614" width="22" height="16" rx="3" fill="#5B7C99"/>')
    s.text(911, 626, "FK", size=9, weight=700, fill="#fff", anchor="middle")
    s.text(930, 626, "foreign key (points to a PK)", size=12.5, fill=MUTED)
    s.parts = [p.replace('>PK  primary key<', '>primary key<').replace('x="900" y="600" font-family', 'x="930" y="600" font-family') for p in s.parts]
    s.save(rel)


# ---------------------------------------------------------------- MySQL Workbench layout
def workbench_layout():
    s = Svg(1100, 640, "Simplified diagram of the MySQL Workbench window: toolbar with execute buttons, Navigator with schemas, SQL editor, result grid and output panel.")
    s.rect(20, 20, 1060, 600, fill="#FFFFFF", stroke="#BFB5A3", r=12)
    s.add(f'<path d="M20,32 a12,12 0 0 1 12,-12 h1036 a12,12 0 0 1 12,12 v22 h-1060 z" fill="#E9E3D8"/>')
    s.text(40, 42, "MySQL Workbench   ·   Local instance (harbourline)", size=13, fill=MUTED)
    # tabs/toolbar
    s.rect(30, 62, 1040, 40, fill="#F5F1EA", stroke=LINE, r=6)
    for i, lab in enumerate(["Open", "Save", "⚡ Run all", "⚡ Run line", "Stop"]):
        s.rect(250 + i * 96, 69, 86, 26, fill="#fff", stroke=LINE, r=5)
        s.text(250 + i * 96 + 43, 87, lab, size=12, anchor="middle", weight=600 if "Run" in lab else 400)
    # navigator
    s.rect(30, 112, 220, 498, fill="#FBFAF7", stroke=LINE, r=6)
    s.text(44, 136, "Navigator", size=13, weight=700)
    s.text(44, 162, "SCHEMAS", size=11, weight=700, fill=MUTED)
    tree = ["▾ harbourline", "   ▾ Tables", "      ▸ customers", "      ▸ employees", "      ▸ payments", "      ▸ routes", "      ▸ shipments", "   ▸ Views", "   ▸ Stored Procedures", "▸ sys"]
    for i, t in enumerate(tree):
        s.text(44, 188 + i * 22, t, size=12.5, font=MONO if "▸" in t or "▾" in t else FONT)
    # editor
    s.rect(262, 112, 808, 250, fill="#FFFFFF", stroke=LINE, r=6)
    s.rect(262, 112, 150, 28, fill="#F5F1EA", stroke=LINE, r=6)
    s.text(276, 131, "Query 1", size=12.5, weight=600)
    code = ["SELECT c.company_name, c.city,", "       SUM(s.containers) AS containers", "FROM shipments AS s", "JOIN customers AS c ON c.customer_id = s.customer_id", "GROUP BY c.company_name, c.city", "ORDER BY containers DESC", "LIMIT 10;"]
    for i, t in enumerate(code):
        s.text(300, 170 + i * 24, t, size=13.5, font=MONO, fill="#1F3F7A" if t.split()[0] in ("SELECT", "FROM", "JOIN", "GROUP", "ORDER", "LIMIT") else INK)
        s.text(282, 170 + i * 24, str(i + 1), size=12, font=MONO, fill=MUTED, anchor="end")
    # results
    s.rect(262, 372, 808, 150, fill="#FFFFFF", stroke=LINE, r=6)
    s.text(276, 394, "Result Grid", size=12.5, weight=600)
    hdr = ["company_name", "city", "containers"]
    for j, h in enumerate(hdr):
        s.text(280 + j * 220, 420, h, size=12.5, weight=700)
    rows = [("Oakridge Packaging Limited", "Lagos", "141"), ("Meridian Builders & Co", "Lagos", "138"), ("Greenfield Packaging Ltd", "Abuja", "136")]
    for i, r in enumerate(rows):
        for j, v in enumerate(r):
            s.text(280 + j * 220, 444 + i * 22, v, size=12.5)
    # output
    s.rect(262, 532, 808, 78, fill="#FBFAF7", stroke=LINE, r=6)
    s.text(276, 554, "Output", size=12.5, weight=600)
    s.text(276, 580, "✔  1   14:32:07   SELECT c.company_name, c.city, ...   10 row(s) returned   0.011 sec", size=12, font=MONO, fill=GREEN)
    # callouts
    def badge(n, x, y):
        s.add(f'<circle cx="{x}" cy="{y}" r="15" fill="{BRASS}" stroke="#fff" stroke-width="2.5"/>')
        s.text(x, y + 5.5, str(n), size=14, weight=700, fill="#fff", anchor="middle")
    for n, (x, y) in enumerate([(440, 58), (30, 112), (262, 112), (262, 372), (262, 532)], 1):
        badge(n, x, y)
    s.save("sql/mysql-workbench-layout.svg")


# ---------------------------------------------------------------- Data modelling diagrams
def model_levels():
    s = Svg(1180, 470, "Three levels of a data model: conceptual (things and how they relate), logical (attributes and keys), physical (tables, data types and constraints in a real database).")
    cols = [("Conceptual", "What the business talks about"), ("Logical", "Attributes, keys and relationships"), ("Physical", "Tables in a specific database")]
    for i, (t, sub) in enumerate(cols):
        x = 30 + i * 385
        s.rect(x, 20, 360, 430, fill="#FFFFFF", stroke=LINE, r=14)
        s.text(x + 20, 56, t, size=22, weight=700)
        s.text(x + 20, 80, sub, size=13.5, fill=MUTED)
    # conceptual: two ovals joined
    for (cx, cy, lab) in ((120, 190, "Customer"), (300, 190, "Order")):
        s.add(f'<rect x="{cx - 70}" y="{cy - 28}" width="140" height="56" rx="28" fill="{BRASS_PALE}" stroke="{BRASS}" stroke-width="1.8"/>')
        s.text(cx, cy + 6, lab, size=16, weight=600, anchor="middle")
    s.line([(190, 190), (230, 190)], sw=1.8)
    s.text(210, 176, "places", size=12.5, fill=MUTED, anchor="middle", italic=True)
    s.add(f'<rect x="80" y="280" width="140" height="56" rx="28" fill="{BRASS_PALE}" stroke="{BRASS}" stroke-width="1.8"/>')
    s.text(150, 314, "Product", size=16, weight=600, anchor="middle")
    s.line([(300, 218), (300, 308), (220, 308)], sw=1.8)
    s.text(306, 270, "contains", size=12.5, fill=MUTED, italic=True)
    s.text(50, 400, "No columns, no data types.", size=13, fill=MUTED)
    s.text(50, 422, "Agreed with managers.", size=13, fill=MUTED)
    # logical
    a = entity(s, 440, 100, "Customer", [("Customer ID", "PK", ""), ("Name", "", ""), ("Region", "", "")], w=160)
    b = entity(s, 590, 230, "Order", [("Order ID", "PK", ""), ("Customer ID", "FK", ""), ("Order date", "", "")], w=160)
    ya = a["rows"]["Customer ID"]
    relate(s, (a["right"], ya), "l", "one", (b["left"] + 110, b["top"]), "d", "many", via=[(b["left"] + 110, ya)])
    s.text(435, 400, "Attributes and keys, but not tied", size=13, fill=MUTED)
    s.text(435, 422, "to any database product.", size=13, fill=MUTED)
    # physical
    code = ["CREATE TABLE orders (", "  order_id    INT PRIMARY KEY,", "  customer_id INT NOT NULL", "    REFERENCES customers(customer_id),", "  order_date  DATE NOT NULL,", "  quantity    INT CHECK (quantity > 0)", ");"]
    s.rect(820, 110, 335, 200, fill="#1E1E1E", stroke="#1E1E1E", r=10)
    for i, t in enumerate(code):
        s.text(836, 140 + i * 24, t, size=12.5, font=MONO, fill="#F2EEE6")
    s.text(820, 400, "Exact names, data types and", size=13, fill=MUTED)
    s.text(820, 422, "rules for one database (SQL Server…)", size=13, fill=MUTED)
    s.save("modelling/model-levels.svg")


def entity_anatomy():
    s = Svg(1060, 470, "Anatomy of a table: the table is an entity, each column an attribute with a data type, each row one instance; the primary key identifies each row and the foreign key points to another table.")
    x0, y0 = 250, 90
    cols = ["customer_id", "customer_name", "channel", "region", "sales_rep_id"]
    widths = [120, 210, 120, 120, 120]
    s.rect(x0, y0, sum(widths), 40 + 4 * 34, fill="#FFFFFF", stroke="#CFC4B2", r=8)
    s.add(f'<rect x="{x0}" y="{y0}" width="{sum(widths)}" height="40" rx="8" fill="{HEAD}"/>')
    xx = x0
    rows = [("12", "Hajia Amina Supermarket", "Supermarket", "North West", "7"), ("13", "Peace Provisions", "Kiosk", "North West", "7"), ("14", "Divine Kiosk", "Kiosk", "Lagos", "2"), ("15", "Kayode Distributors", "Wholesale", "Lagos", "3")]
    for j, (c, w) in enumerate(zip(cols, widths)):
        s.text(xx + 12, y0 + 25, c, size=13.5, weight=700, fill="#fff")
        for i, r in enumerate(rows):
            s.text(xx + 12, y0 + 64 + i * 34, r[j], size=13.5, font=MONO if j in (0, 4) else FONT)
        xx += w
    for i in range(1, 4):
        s.line([(x0, y0 + 40 + i * 34), (x0 + sum(widths), y0 + 40 + i * 34)], stroke=LINE, sw=1)
    # highlight a row and a column
    s.rect(x0 - 4, y0 + 40 + 34 - 2, sum(widths) + 8, 34 + 4, fill="none", stroke=BRASS, sw=2.5, r=6)
    s.rect(x0 + 120 + 210 + 120 - 3, y0 - 4, 126, 40 + 4 * 34 + 8, fill="none", stroke="#5B7C99", sw=2.5, r=6, dash="6 5")
    def callout(text, sub, tx, ty, px, py, anchor="start", color=INK):
        width = max(len(text) * 8.6, len(sub) * 6.9) + 10
        sx = tx + width if anchor == "start" else tx - width
        s.line([(sx, ty - 3), (px, py)], stroke=MUTED, sw=1.2)
        s.add(f'<circle cx="{px}" cy="{py}" r="3.5" fill="{MUTED}"/>')
        s.text(tx, ty - 10, text, size=14.5, weight=700, anchor=anchor, fill=color)
        s.text(tx, ty + 8, sub, size=12.5, fill=MUTED, anchor=anchor)
    callout("Table = entity", "one kind of thing: customers", 30, 60, x0, y0 + 10)
    callout("Primary key", "unique, never empty", 30, 330, x0 + 40, y0 + 175)
    callout("Row = one instance", "one customer", 30, 190, x0 - 4, y0 + 92)
    callout("Column = attribute", "with one data type (text)", 870, 60, x0 + 510, y0, anchor="end")
    callout("Foreign key", "points to a sales rep's ID", 1030, 330, x0 + 640, y0 + 175, anchor="end")
    s.text(530, 400, "Grain: one row per customer", size=15, weight=700, anchor="middle", fill=FACT)
    s.save("modelling/entity-anatomy.svg")


def cardinality():
    s = Svg(1180, 560, "Relationship types: one-to-one (employee and staff ID card), one-to-many (customer and orders), and many-to-many (students and courses) resolved with a bridge table of enrolments.")
    def small(x, y, name, rows, w=170):
        return entity(s, x, y, name, rows, w=w)
    s.text(30, 44, "One-to-one", size=18, weight=700)
    a = small(30, 60, "employees", [("employee_id", "PK", "")])
    b = small(330, 60, "id_cards", [("card_id", "PK", ""), ("employee_id", "FK", "")])
    relate(s, (a["right"], a["rows"]["employee_id"]), "l", "one", (b["left"], b["rows"]["employee_id"]), "r", "zero-one", via=[(265, a["rows"]["employee_id"]), (265, b["rows"]["employee_id"])])
    s.text(560, 100, "Each employee has at most one ID card;", size=13, fill=MUTED)
    s.text(560, 120, "each card belongs to one employee.", size=13, fill=MUTED)
    s.text(30, 214, "One-to-many", size=18, weight=700)
    c = small(30, 230, "customers", [("customer_id", "PK", "")])
    d = small(330, 230, "orders", [("order_id", "PK", ""), ("customer_id", "FK", "")])
    relate(s, (c["right"], c["rows"]["customer_id"]), "l", "one", (d["left"], d["rows"]["customer_id"]), "r", "zero-many", via=[(265, c["rows"]["customer_id"]), (265, d["rows"]["customer_id"])])
    s.text(560, 270, "The most common kind. The foreign key", size=13, fill=MUTED)
    s.text(560, 290, "always sits on the many side.", size=13, fill=MUTED)
    s.text(30, 384, "Many-to-many, resolved with a bridge table", size=18, weight=700)
    e = small(30, 400, "students", [("student_id", "PK", "")], w=160)
    f = small(300, 400, "enrolments", [("student_id", "PK FK", ""), ("course_id", "PK FK", ""), ("enrolled_on", "", "")], w=190)
    g = small(610, 400, "courses", [("course_id", "PK", "")], w=160)
    relate(s, (e["right"], e["rows"]["student_id"]), "l", "one", (f["left"], f["rows"]["student_id"]), "r", "zero-many", via=[(245, e["rows"]["student_id"]), (245, f["rows"]["student_id"])])
    relate(s, (g["left"], g["rows"]["course_id"]), "r", "one", (f["right"], f["rows"]["course_id"]), "l", "zero-many", via=[(550, g["rows"]["course_id"]), (550, f["rows"]["course_id"])])
    s.text(800, 430, "A student takes many courses and a course", size=13, fill=MUTED)
    s.text(800, 450, "has many students. The bridge table holds", size=13, fill=MUTED)
    s.text(800, 470, "one row per student per course.", size=13, fill=MUTED)
    legend_crowsfoot(s, 940, 60)
    s.save("modelling/cardinality.svg")


def normalisation():
    s = Svg(1180, 640, "Normalising a flat invoice sheet: repeated customer and product details are moved into their own tables, linked by keys.")
    s.text(30, 44, "Before: one flat sheet", size=18, weight=700)
    hdr = ["invoice", "date", "customer", "customer_city", "product", "category", "qty", "price"]
    w = [80, 100, 170, 130, 190, 110, 50, 80]
    data = [("501", "2026-03-02", "Peace Provisions", "Kano", "Malt drink 330ml (24)", "Beverages", "4", "14,800"), ("501", "2026-03-02", "Peace Provisions", "Kano", "Cabin biscuits (24)", "Snacks", "6", "6,600"), ("502", "2026-03-02", "Divine Kiosk", "Ikeja", "Malt drink 330ml (24)", "Beverages", "2", "14,800"), ("503", "2026-03-03", "Peace Provisions", "Kano", "Toothpaste 140g (24)", "Personal care", "3", "20,700")]
    x0, y0 = 30, 60
    s.rect(x0, y0, sum(w), 36 + 4 * 30, fill="#fff", stroke="#CFC4B2", r=8)
    s.add(f'<rect x="{x0}" y="{y0}" width="{sum(w)}" height="36" rx="8" fill="{HEAD}"/>')
    xx = x0
    for j, (h, ww) in enumerate(zip(hdr, w)):
        s.text(xx + 8, y0 + 23, h, size=12.5, weight=700, fill="#fff")
        for i, r in enumerate(data):
            repeat = j in (2, 3, 4, 5) and i > 0 and (r[j] in [d[j] for d in data[:i]])
            if repeat:
                s.add(f'<rect x="{xx + 3}" y="{y0 + 38 + i * 30}" width="{ww - 6}" height="26" rx="4" fill="#F6DCD5"/>')
            s.text(xx + 8, y0 + 57 + i * 30, r[j], size=12, fill=RED if repeat else INK)
        xx += ww
    s.text(x0 + sum(w) + 20, 110, "Shaded cells repeat", size=13, weight=700, fill=RED)
    s.text(x0 + sum(w) + 20, 130, "facts already stored", size=13, fill=MUTED)
    s.text(x0 + sum(w) + 20, 150, "on another row.", size=13, fill=MUTED)
    s.text(30, 272, "After: third normal form", size=18, weight=700)
    cus = entity(s, 30, 290, "customers", [("customer_id", "PK", ""), ("customer_name", "", ""), ("city", "", "")], w=200)
    inv = entity(s, 300, 290, "invoices", [("invoice_id", "PK", ""), ("customer_id", "FK", ""), ("invoice_date", "", "")], w=200)
    lin = entity(s, 570, 290, "invoice_lines", [("invoice_id", "PK FK", ""), ("product_id", "PK FK", ""), ("quantity", "", ""), ("unit_price", "", "")], w=230)
    prd = entity(s, 870, 290, "products", [("product_id", "PK", ""), ("product_name", "", ""), ("category", "", "")], w=210)
    relate(s, (cus["right"], cus["rows"]["customer_id"]), "l", "one", (inv["left"], inv["rows"]["customer_id"]), "r", "zero-many", via=[(265, cus["rows"]["customer_id"]), (265, inv["rows"]["customer_id"])])
    relate(s, (inv["right"], inv["rows"]["invoice_id"]), "l", "one", (lin["left"], lin["rows"]["invoice_id"]), "r", "many", via=[(535, inv["rows"]["invoice_id"]), (535, lin["rows"]["invoice_id"])])
    relate(s, (prd["left"], prd["rows"]["product_id"]), "r", "one", (lin["right"], lin["rows"]["product_id"]), "l", "zero-many", via=[(835, prd["rows"]["product_id"]), (835, lin["rows"]["product_id"])])
    s.text(30, 520, "Each fact now lives in one place: a customer's city is stored once, a product's category once.", size=13.5, fill=MUTED)
    s.text(30, 544, "unit_price stays on the line because it is the price charged on that invoice, which can differ from today's list price.", size=13.5, fill=MUTED)
    s.save("modelling/normalisation.svg")


def star_schema():
    s = Svg(1100, 640, "Star schema for Kolanut sales: a fact table of order lines in the middle, joined to date, customer, product and sales rep dimension tables.")
    fact = entity(s, 400, 220, "fact_order_lines", [("date_key", "FK", "int"), ("customer_key", "FK", "int"), ("product_key", "FK", "int"), ("rep_key", "FK", "int"), ("quantity", "", "int"), ("unit_price", "", "money"), ("discount_pct", "", "int"), ("revenue", "", "money")], w=280, header_fill=FACT, note="FACT")
    dd = entity(s, 40, 40, "dim_date", [("date_key", "PK", "int"), ("date", "", "date"), ("month", "", "text"), ("quarter", "", "text"), ("year", "", "int")], w=230, note="DIMENSION")
    dc = entity(s, 820, 40, "dim_customer", [("customer_key", "PK", "int"), ("customer_name", "", "text"), ("channel", "", "text"), ("region", "", "text"), ("city", "", "text")], w=240, note="DIMENSION")
    dp = entity(s, 40, 420, "dim_product", [("product_key", "PK", "int"), ("product_name", "", "text"), ("category", "", "text"), ("list_price", "", "money")], w=230, note="DIMENSION")
    dr = entity(s, 820, 420, "dim_sales_rep", [("rep_key", "PK", "int"), ("rep_name", "", "text"), ("region", "", "text")], w=240, note="DIMENSION")
    relate(s, (dd["right"], dd["rows"]["date_key"]), "l", "one", (fact["left"], fact["rows"]["date_key"]), "r", "many", via=[(330, dd["rows"]["date_key"]), (330, fact["rows"]["date_key"])])
    relate(s, (dc["left"], dc["rows"]["customer_key"]), "r", "one", (fact["right"], fact["rows"]["customer_key"]), "l", "many", via=[(750, dc["rows"]["customer_key"]), (750, fact["rows"]["customer_key"])])
    relate(s, (dp["right"], dp["rows"]["product_key"]), "l", "one", (fact["left"], fact["rows"]["product_key"]), "r", "many", via=[(350, dp["rows"]["product_key"]), (350, fact["rows"]["product_key"])])
    relate(s, (dr["left"], dr["rows"]["rep_key"]), "r", "one", (fact["right"], fact["rows"]["rep_key"]), "l", "many", via=[(770, dr["rows"]["rep_key"]), (770, fact["rows"]["rep_key"])])
    s.text(540, 560, "Grain of the fact table: one row per product on one order", size=14, weight=700, fill=FACT, anchor="middle")
    s.text(540, 584, "Numbers you add up live in the fact; the words you filter and group by live in dimensions.", size=13, fill=MUTED, anchor="middle")
    s.save("modelling/star-schema.svg")


def snowflake():
    s = Svg(1100, 400, "Star versus snowflake: in a snowflake, a dimension is split further, here products point to a separate categories table.")
    s.text(30, 40, "Star: category is a column on the product dimension", size=16, weight=700)
    f1 = entity(s, 30, 60, "fact_order_lines", [("product_key", "FK", ""), ("revenue", "", "")], w=200, header_fill=FACT)
    p1 = entity(s, 300, 60, "dim_product", [("product_key", "PK", ""), ("product_name", "", ""), ("category", "", "")], w=210)
    relate(s, (p1["left"], p1["rows"]["product_key"]), "r", "one", (f1["right"], f1["rows"]["product_key"]), "l", "many")
    s.text(30, 240, "Snowflake: category moved to its own table", size=16, weight=700)
    f2 = entity(s, 30, 260, "fact_order_lines", [("product_key", "FK", ""), ("revenue", "", "")], w=200, header_fill=FACT)
    p2 = entity(s, 300, 260, "dim_product", [("product_key", "PK", ""), ("product_name", "", ""), ("category_key", "FK", "")], w=210)
    c2 = entity(s, 580, 260, "dim_category", [("category_key", "PK", ""), ("category", "", "")], w=200)
    relate(s, (p2["left"], p2["rows"]["product_key"]), "r", "one", (f2["right"], f2["rows"]["product_key"]), "l", "many")
    yc, yk = c2["rows"]["category_key"], p2["rows"]["category_key"]
    relate(s, (c2["left"], yc), "r", "one", (p2["right"], yk), "l", "many", via=[(545, yc), (545, yk)])
    s.text(820, 90, "Fewer tables, simpler", size=14, weight=700, fill=GREEN)
    s.text(820, 110, "filters, faster reports.", size=13, fill=MUTED)
    s.text(820, 130, "Preferred in Power BI.", size=13, fill=MUTED)
    s.text(820, 300, "Less repetition, but an", size=14, weight=700, fill=FACT)
    s.text(820, 320, "extra join for every", size=13, fill=MUTED)
    s.text(820, 340, "category filter.", size=13, fill=MUTED)
    s.save("modelling/star-vs-snowflake.svg")


def scd():
    s = Svg(1100, 470, "Slowly changing dimensions: type 1 overwrites a customer's region, losing history; type 2 adds a new row with valid-from and valid-to dates, keeping history.")
    s.text(30, 40, "Peace Provisions moves from Kano (North West) to Abuja (North Central) on 1 April 2026", size=16, weight=700)
    def table(x, y, title, hdr, rows, w, color):
        s.text(x, y - 12, title, size=15, weight=700, fill=color)
        tw = sum(w)
        s.rect(x, y, tw, 34 + 30 * len(rows), fill="#fff", stroke="#CFC4B2", r=8)
        s.add(f'<rect x="{x}" y="{y}" width="{tw}" height="34" rx="8" fill="{HEAD}"/>')
        xx = x
        for j, (h, ww) in enumerate(zip(hdr, w)):
            s.text(xx + 8, y + 22, h, size=12, weight=700, fill="#fff")
            for i, r in enumerate(rows):
                s.text(xx + 8, y + 55 + i * 30, r[j], size=12.5, font=MONO if j in (0, 1) else FONT)
            xx += ww
    table(30, 100, "Type 1: overwrite (history lost)", ["key", "customer_id", "name", "region"], [("13", "13", "Peace Provisions", "North Central")], [60, 100, 160, 130], RED)
    s.text(30, 190, "Every past order now reports as North Central.", size=13, fill=MUTED)
    table(30, 260, "Type 2: add a row (history kept)", ["key", "customer_id", "name", "region", "valid_from", "valid_to", "current"], [("13", "13", "Peace Provisions", "North West", "2022-11-17", "2026-03-31", "No"), ("91", "13", "Peace Provisions", "North Central", "2026-04-01", "", "Yes")], [60, 100, 160, 130, 110, 110, 80], GREEN)
    s.text(30, 400, "Orders before April point to key 13 (North West); orders after point to key 91 (North Central).", size=13, fill=MUTED)
    s.text(30, 422, "customer_id is the business key; key is the surrogate key the fact table uses.", size=13, fill=MUTED)
    s.save("modelling/slowly-changing-dimensions.svg")


def modelling_steps():
    s = Svg(1100, 250, "Five steps of designing a data model: list the questions, identify entities, define attributes and keys, connect relationships, then check the grain and test with data.")
    steps = [("1", "Questions", "What must the data answer?"), ("2", "Entities", "Which things are involved?"), ("3", "Attributes & keys", "What do we store; what identifies each row?"), ("4", "Relationships", "How do entities connect, and how many?"), ("5", "Test", "Check the grain and query real data")]
    for i, (n, t, sub) in enumerate(steps):
        x = 20 + i * 216
        s.rect(x, 40, 196, 170, fill="#fff", stroke=LINE, r=14)
        s.add(f'<circle cx="{x + 34}" cy="{76}" r="18" fill="{BRASS}"/>')
        s.text(x + 34, 82, n, size=16, weight=700, fill="#fff", anchor="middle")
        s.text(x + 18, 124, t, size=16, weight=700)
        words = sub.split()
        lines, cur = [], ""
        for w in words:
            if len(cur + " " + w) > 24:
                lines.append(cur)
                cur = w
            else:
                cur = (cur + " " + w).strip()
        lines.append(cur)
        for j, l in enumerate(lines):
            s.text(x + 18, 150 + j * 19, l, size=12.5, fill=MUTED)
        if i < 4:
            s.line([(x + 198, 125), (x + 214, 125)], stroke=BRASS, sw=2)
    s.save("modelling/design-steps.svg")


if __name__ == "__main__":
    harbourline_erd()
    workbench_layout()
    model_levels()
    entity_anatomy()
    cardinality()
    normalisation()
    star_schema()
    snowflake()
    scd()
    modelling_steps()
