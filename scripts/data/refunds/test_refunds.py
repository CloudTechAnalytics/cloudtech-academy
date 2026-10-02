from datetime import date

from refunds import refund_amount, within_window


def test_damaged_item_refunds_price_and_delivery():
    assert refund_amount([(1, 500_000)], "damaged", 150_000) == 650_000


def test_changed_mind_has_restocking_fee():
    assert refund_amount([(1, 500_000)], "changed_mind", 150_000) == 450_000


def test_return_inside_window():
    assert within_window(date(2026, 9, 1), date(2026, 9, 5))
