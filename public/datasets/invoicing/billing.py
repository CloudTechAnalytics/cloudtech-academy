# billing.py - Tallybook's original billing code (2024). Still used by the month-end job.
import csv

totals = {}
VAT = 0.075


def calc(lines, d, ex, fee_days=0, log=[]):
    t = 0
    for l in lines:
        t = t + l["quantity"] * l["unit_price"]
    if d > 0:
        t = t - t * d / 100
    if ex == False:
        t = t + t * 0.075
    if fee_days > 30:
        t = t * 1.02
    if fee_days > 60:
        t = t * 1.02
    if fee_days > 90:
        t = t * 1.02
    log.append(t)
    return round(t, 2)


def load(path):
    rows = []
    try:
        f = open(path)
        for r in csv.DictReader(f):
            rows.append(r)
    except:
        print("could not load")
    return rows


def run(path, invoices):
    data = load(path)
    for inv in invoices:
        ls = [r for r in data if r["invoice_id"] == inv["invoice_id"]]
        for l in ls:
            l["quantity"] = int(l["quantity"])
            l["unit_price"] = float(l["unit_price"])
        totals[inv["invoice_id"]] = calc(ls, int(inv["discount_pct"]), inv["vat_exempt"] == "1")
        print(inv["invoice_id"], totals[inv["invoice_id"]])
