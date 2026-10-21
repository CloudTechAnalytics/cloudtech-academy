"""Draws the diagrams for the Import, Export & Mini Importation course as SVG files.

    python scripts/import-diagrams.py

Reuses the drawing helper from lesson-diagrams.py. Output goes to public/images/courses/import-export/.
Run `npm run images` afterwards to refresh the image sizes.
"""
from pathlib import Path

_src = (Path(__file__).resolve().parent / "lesson-diagrams.py").read_text(encoding="utf-8")
exec(_src.split("# 1. How the words fit together")[0])
OUT = Path(__file__).resolve().parent.parent / "public" / "images" / "courses" / "import-export"

# 1. The whole journey ---------------------------------------------------------------------------------------
s = Svg(760, 400, "The ten steps of a mini importation, from choosing a product to selling it.",
        "Ten steps in two rows: choose a product, check the market, find suppliers, verify the supplier, negotiate and order samples, ship it, documents and customs, count the real cost, price it, then sell and reorder.")
steps = [
    ("Choose a product", "Find an item people already buy", "Lesson 2"),
    ("Check the market", "Demand, competition, margin", "Lesson 2"),
    ("Find suppliers", "Platforms, markets, agents", "Lesson 3"),
    ("Verify the supplier", "Scam checks, safe payment", "Lesson 4"),
    ("Negotiate and sample", "Price, MOQ, a sample first", "Lesson 5"),
    ("Ship it", "Air or sea, forwarder, insurance", "Lesson 6"),
    ("Documents and customs", "Invoice, B/L or AWB, HS code", "Lessons 7-8"),
    ("Count the real cost", "Landed cost per unit", "Lesson 9"),
    ("Price it", "Set price for your margin", "Lesson 9"),
    ("Sell and reorder", "Channels, stock, cash flow", "Lesson 10"),
]
s.text(16, 26, "The journey of one mini importation, in ten steps", 15, INK, 700)
for i, (h, d, l) in enumerate(steps):
    r, c = divmod(i, 5)
    x, y = 16 + c * 146, 46 + r * 168
    col = GOLD_DARK if i % 2 == 0 else GREEN
    s.rect(x, y, 134, 138, "#FFFFFF", col, 10, 1.6)
    s.circle(x + 24, y + 26, 15, col)
    s.text(x + 24, y + 31, str(i + 1), 14, "#FFFFFF", 700, "middle")
    s.text(x + 12, y + 62, h, 12.5, INK, 700, wrap=16, lead=15)
    s.text(x + 12, y + 98, d, 10.5, MUTED, 400, wrap=20, lead=12.5)
    s.text(x + 12, y + 130, l, 10, col, 700)
    if c < 4:
        s.line(x + 134, y + 69, x + 146, y + 69, MUTED, 1.4, True)
s.text(16, 388, "Do the numbers (steps 2 and 8) before you spend money, and test with a small order before a big one.", 11.5, MUTED)
s.save("journey-ten-steps.svg")

# 2. Reading a supplier listing ------------------------------------------------------------------------------
s = Svg(760, 500, "How to read a supplier listing: the parts to check before you message anyone.",
        "A sample product listing with six numbered parts to check: the product title and photos, the price tiers, the minimum order quantity, the supplier type and years on the platform, the sample and customisation options, and the payment protection offered.")
s.rect(16, 16, 440, 462, "#FFFFFF", MUTED, 12, 1.2)
s.rect(32, 32, 160, 130, GOLD_PALE, GOLD_DARK, 8, 1)
s.text(112, 102, "Product photos", 12, GOLD_DARK, 600, "middle")
s.text(208, 52, "Wireless earbuds, Bluetooth 5.3", 13, INK, 700)
s.text(208, 70, "Charging case, 20-hour battery", 11.5, MUTED)
s.rect(208, 84, 232, 78, "#F5F2EA", None, 6)
s.text(220, 104, "1-99 pcs", 11.5, INK)
s.text(432, 104, "$6.80", 11.5, INK, 700, "end")
s.text(220, 124, "100-499 pcs", 11.5, INK)
s.text(432, 124, "$5.90", 11.5, INK, 700, "end")
s.text(220, 144, "500+ pcs", 11.5, INK)
s.text(432, 144, "$5.20", 11.5, INK, 700, "end")
s.text(32, 192, "Minimum order: 100 pieces", 12.5, INK, 700)
s.text(32, 216, "Lead time: 7 days for 100-499 pieces", 11.5, MUTED)
s.line(32, 232, 440, 232, "#DDD6C6", 1)
s.text(32, 254, "Shenzhen Example Electronics Co., Ltd.", 12.5, INK, 700)
s.text(32, 273, "Manufacturer  |  8 years  |  Verified  |  Reply within 4 hours", 11, MUTED)
s.line(32, 290, 440, 290, "#DDD6C6", 1)
s.text(32, 312, "Samples available  |  Logo printing  |  Custom colours", 11.5, INK)
s.line(32, 328, 440, 328, "#DDD6C6", 1)
s.text(32, 350, "Order protection: payment held until delivery", 11.5, INK)
s.rect(32, 376, 408, 36, GREEN, None, 8)
s.text(236, 399, "Contact supplier", 13, "#FFFFFF", 700, "middle")
s.text(32, 440, "An illustration, not a real listing. Always check the supplier profile page.", 10.5, MUTED)
notes = [
    (60, "1", "Title and photos", "Do they match what you want? Ask for real photos."),
    (128, "2", "Price tiers", "The price falls as you buy more. Plan for the tier you can afford."),
    (196, "3", "Minimum order", "Your first order may need to be the minimum, so check it fits your budget."),
    (264, "4", "Who is selling", "Manufacturer or trader? Years active and verification help, but are not proof."),
    (332, "5", "Samples", "Order one before the bulk order, and ask what customising costs."),
    (400, "6", "Payment protection", "Pay through the platform so the money is held until delivery."),
]
for y, n, h, d in notes:
    s.circle(486, y, 13, GOLD_DARK)
    s.text(486, y + 5, n, 13, "#FFFFFF", 700, "middle")
    s.text(508, y - 2, h, 12.5, INK, 700)
    s.text(508, y + 14, d, 11, MUTED, 400, wrap=34, lead=13.5)
s.save("listing-anatomy.svg")

# 3. Who passes the documents on ------------------------------------------------------------------------------
s = Svg(760, 330, "The path of a shipment and the documents that travel with it.",
        "Five parties in order: the supplier, the freight forwarder, the shipping line or airline, customs and the clearing agent, and the importer. Under each is the document it handles, such as the commercial invoice, packing list, bill of lading or air waybill, Form M and the duty receipt.")
parties = [
    ("Supplier", "Packs and sells", "Commercial invoice, packing list", GOLD_DARK),
    ("Freight forwarder", "Books the transport", "Booking, bill of lading or air waybill", GREEN),
    ("Ship or airline", "Carries the goods", "Bill of lading or air waybill", GOLD_DARK),
    ("Customs and agent", "Checks, values, taxes", "Form M, PAAR, duty receipt", GREEN),
    ("You, the importer", "Receives and sells", "Release order, delivery note", GOLD_DARK),
]
s.text(16, 26, "Documents follow the goods, and they must all agree", 15, INK, 700)
for i, (h, d, doc, col) in enumerate(parties):
    x = 16 + i * 146
    pale = GOLD_PALE if col == GOLD_DARK else GREEN_PALE
    s.rect(x, 52, 134, 92, "#FFFFFF", col, 10, 1.6)
    s.text(x + 12, 80, h, 12.5, col, 700, wrap=16, lead=15)
    s.text(x + 12, 124, d, 10.5, MUTED)
    s.line(x + 67, 144, x + 67, 176, col, 1.4)
    s.rect(x, 176, 134, 98, pale, None, 10)
    s.text(x + 12, 198, "Documents", 10, col, 700)
    s.text(x + 12, 216, doc, 11.5, INK, 500, wrap=18, lead=14)
    if i < 4:
        s.line(x + 134, 98, x + 146, 98, MUTED, 1.4, True)
s.text(16, 304, "A name, quantity, weight or value that differs between documents is the most common cause of delay.", 11.5, MUTED)
s.save("shipment-documents.svg")

# 4. Landed cost: Tunde's 300 power banks ---------------------------------------------------------------------
s = Svg(760, 430, "Where the money goes: the landed cost of 300 power banks, item by item.",
        "A bar chart of the landed cost items in naira: product 1,350,000, freight and insurance 240,000, duty 318,000, VAT 143,100, clearing and port charges 120,000, local transport 30,000 and bank charges 25,000. The total is 2,226,100 naira, which is 7,420 naira a unit.")
items = [
    ("Product (300 x $3)", 1350000, GOLD),
    ("Freight and insurance", 240000, GOLD),
    ("Duty (20%)", 318000, RED),
    ("VAT (7.5%)", 143100, RED),
    ("Clearing and port", 120000, BLUE),
    ("Local transport", 30000, BLUE),
    ("Bank charges", 25000, BLUE),
]
s.text(16, 26, "Landed cost of 300 power banks: ₦2,226,100, or ₦7,420 each", 15, INK, 700)
maxv = 1350000
for i, (h, v, col) in enumerate(items):
    y = 50 + i * 44
    w = max(6, v / maxv * 400)
    s.text(16, y + 21, h, 12.5, INK, 500)
    s.rect(190, y, w, 30, col, None, 6)
    s.text(190 + w + 8, y + 21, f"₦{v:,}", 12, INK, 700)
s.rect(16, 366, 12, 12, GOLD)
s.text(34, 377, "Goods and freight", 11, MUTED)
s.rect(166, 366, 12, 12, RED)
s.text(184, 377, "Government duty and tax", 11, MUTED)
s.rect(340, 366, 12, 12, BLUE)
s.text(358, 377, "Local costs", 11, MUTED)
s.text(16, 410, "The supplier price looked like ₦4,500 a unit. Everything else adds up to about 65% more.", 11.5, MUTED)
s.save("landed-cost-bars.svg")
