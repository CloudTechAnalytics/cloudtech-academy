"""Refund rules for Kasuwa."""
from datetime import date

RETURN_WINDOW_DAYS = 14
RESTOCKING_FEE = 0.10  # charged on 'changed_mind' returns
REASONS = {"failed_delivery", "damaged", "wrong_item", "changed_mind"}


def item_refund(quantity, unit_price_kobo, reason):
    """Refund for one order line, in kobo."""
    naira = quantity * (unit_price_kobo / 100)
    if reason == "changed_mind":
        naira = naira * (1 - RESTOCKING_FEE)
    return int(naira * 100)


def within_window(delivered_on, today):
    """True if a return is still allowed: within 14 days of delivery."""
    return (today - delivered_on).days < RETURN_WINDOW_DAYS


def refund_amount(items, reason, delivery_fee_kobo):
    """Total refund in kobo. items is a list of (quantity, unit_price_kobo) pairs."""
    total = sum(item_refund(quantity, price, reason) for quantity, price in items)
    if reason in ("failed_delivery", "damaged", "wrong_item"):
        total += delivery_fee_kobo
    return total
