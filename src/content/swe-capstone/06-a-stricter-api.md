---
title: A stricter API
minutes: 30
summary: Fix ISSUE-106 and the API's other blind spots. Return the right status code with a clear message for every kind of bad request, validate every field before using it, and test each case through the Flask test client.
---

## The problem

The mobile team's report (ISSUE-106) is about one case: a missing order gives a 500 error. But the API trusts **everything** it's sent. It accepts an unknown reason, a negative quantity, more items than were ordered, or a product that isn't in the order. Some of these crash, and some quietly create wrong refunds. An API is a front door: check everything that comes through it.

## The concept

### Status codes that mean something

| Code | When |
| :-- | :-- |
| 201 Created | The refund was recorded |
| 400 Bad Request | The request itself is malformed: missing fields, wrong types, values out of range |
| 404 Not Found | The order doesn't exist |
| 422 Unprocessable | The request is well formed, but the rules refuse it, such as outside the return window |
| 500 | Only for bugs. A client should never be able to cause one |

![Validation in order (malformed, exists, allowed, do it) with the status code for each, a table of what each code means, and the Python boolean trap](/images/courses/swe-capstone/status-codes.svg "400, 404, 422, 201, and 500 only for bugs.")

### Validate before you use

Check each field's presence, type and range, and that it makes sense for **this** order, before doing any work. Return the first problem with a message the app can show or log.

### Booleans are integers in Python

`isinstance(True, int)` is `True`. A quantity check that only tests for `int` accepts `true`. Exclude `bool` explicitly.

### Test every path

One test per status code, and a parametrised test for the different ways a request can be bad.

## Example

Get the code, then rewrite the refund endpoint:

```bash
%%bash
base=https://academy.cloudtechanalytics.com/datasets/refunds
for f in refunds.py db.py app.py schema.sql customers.csv orders.csv order_items.csv test_refunds.py pytest.ini; do
  curl -sO "$base/$f"
done
cat > app.py <<'EOF'
"""The refunds API."""
from datetime import date

from flask import Flask, jsonify, request

import db
import refunds


def create_app(conn, today=None):
    app = Flask(__name__)

    def error(status, message):
        return jsonify(error=message), status

    @app.post("/orders/<order_id>/refunds")
    def create_refund(order_id):
        order = db.get_order(conn, order_id)
        if order is None:
            return error(404, f"order {order_id} not found")
        body = request.get_json(silent=True)
        if not isinstance(body, dict):
            return error(400, "send a JSON object")
        reason = body.get("reason")
        if reason not in refunds.REASONS:
            return error(400, f"reason must be one of {', '.join(sorted(refunds.REASONS))}")
        items = body.get("items")
        if not isinstance(items, list) or not items:
            return error(400, "items must be a non-empty list")
        ordered = {item["sku"]: item for item in db.order_items(conn, order_id)}
        lines = []
        for line in items:
            sku = line.get("sku") if isinstance(line, dict) else None
            quantity = line.get("quantity") if isinstance(line, dict) else None
            if sku not in ordered:
                return error(400, f"{sku!r} is not in order {order_id}")
            most = ordered[sku]["quantity"]
            if isinstance(quantity, bool) or not isinstance(quantity, int) or not 1 <= quantity <= most:
                return error(400, f"quantity for {sku} must be a whole number from 1 to {most}")
            lines.append((quantity, ordered[sku]["unit_price_kobo"]))
        if reason != "failed_delivery":
            if not order["delivered_on"]:
                return error(422, "this order was never delivered")
            if not refunds.within_window(date.fromisoformat(order["delivered_on"]), today or date.today()):
                return error(422, "outside the return window")
        amount = refunds.refund_amount(lines, reason, order["delivery_fee_kobo"])
        refund_id = db.record_refund(conn, order_id, reason, amount)
        return jsonify(refund_id=refund_id, order_id=order_id, amount_kobo=amount), 201

    @app.get("/orders/<order_id>/refunds")
    def list_refunds(order_id):
        if db.get_order(conn, order_id) is None:
            return error(404, f"order {order_id} not found")
        return jsonify([dict(r) for r in db.refunds_for(conn, order_id)])

    return app
EOF
echo "app.py rewritten"
```

```text
app.py rewritten
```

The tests, one per kind of answer:

```bash
%%bash
cat > test_api.py <<'EOF'
from datetime import date

import pytest

import db
from app import create_app


@pytest.fixture
def client():
    conn = db.connect()
    db.init(conn)
    return create_app(conn, today=date(2026, 9, 20)).test_client()


def post(client, order_id, body):
    return client.post(f"/orders/{order_id}/refunds", json=body)


def test_valid_refund_is_created(client):
    r = post(client, "K-1002", {"reason": "damaged", "items": [{"sku": "SHO-RN", "quantity": 1}]})
    assert r.status_code == 201
    assert r.get_json()["amount_kobo"] == 3_450_000


def test_unknown_order_is_404(client):
    # ISSUE-106
    r = post(client, "K-9999", {"reason": "damaged", "items": [{"sku": "SHO-RN", "quantity": 1}]})
    assert r.status_code == 404
    assert "not found" in r.get_json()["error"]


@pytest.mark.parametrize("body", [
    None,
    {"items": [{"sku": "SHO-RN", "quantity": 1}]},
    {"reason": "bored", "items": [{"sku": "SHO-RN", "quantity": 1}]},
    {"reason": "damaged", "items": []},
    {"reason": "damaged", "items": [{"sku": "PHN-Z5", "quantity": 1}]},
    {"reason": "damaged", "items": [{"sku": "SHO-RN", "quantity": 2}]},
    {"reason": "damaged", "items": [{"sku": "SHO-RN", "quantity": -1}]},
    {"reason": "damaged", "items": [{"sku": "SHO-RN", "quantity": True}]},
    {"reason": "damaged", "items": ["SHO-RN"]},
])
def test_bad_requests_are_400(client, body):
    r = post(client, "K-1002", body)
    assert r.status_code == 400
    assert r.get_json()["error"]


def test_outside_the_window_is_422(client):
    # K-1003 was delivered on 1 September; today is 20 September
    r = post(client, "K-1003", {"reason": "changed_mind", "items": [{"sku": "DRS-AK", "quantity": 1}]})
    assert r.status_code == 422
EOF
python -m pytest
```

```text
...............
15 passed in 0.01s
```

Every bad request now gets a 400 with a message, a missing order gets a 404, and the rule refusal is a 422. The client can no longer cause a 500.

## Walkthrough

1. Run the cells.
2. Send a request with no body at all, and one with `Content-Type: text/plain`. What do you get?
3. A **failed delivery** refund for an order whose status is "Delivered" should be refused. Add the check and a test.
4. Combine this with lesson 5: the endpoint should take a `request_id` and call `service.request_refund`, returning 200 with the original refund for a retry. Sketch the change.
5. Write the API documentation for the endpoint (the task below).

## Practice

```answer
{
  "id": "sdc-06-p1",
  "prompt": "How many tests pass in total, counting each parametrised case?",
  "answer": 15,
  "format": "number",
  "hint": "The pytest summary line.",
  "required": true
}
```

```task
{
  "id": "sdc-06-t1",
  "prompt": "Write the **API documentation** for `POST /orders/{order_id}/refunds`: the **request body** with each field, an **example**, and every **response code** with when it's returned.",
  "minutes": 8,
  "rows": 12,
  "placeholder": "POST /orders/{order_id}/refunds\n\nRequest body: ...",
  "rules": [
    { "label": "Documents reason and its values", "pattern": "reason[\\s\\S]{0,200}(damaged|failed_delivery|changed_mind)" },
    { "label": "Documents items with sku and quantity", "pattern": "sku[\\s\\S]{0,200}quantity|quantity[\\s\\S]{0,200}sku" },
    { "label": "An example body", "pattern": "\\{[^}]*\"reason\"" },
    { "label": "201", "pattern": "201" },
    { "label": "400", "pattern": "400" },
    { "label": "404", "pattern": "404" },
    { "label": "422", "pattern": "422" }
  ],
  "sample": "POST /orders/{order_id}/refunds\n\nRequest body (JSON):\n- reason: one of failed_delivery, damaged, wrong_item, changed_mind\n- items: list of {sku, quantity}; each sku must be in the order, quantity a whole number from 1 to the quantity ordered\n\nExample:\n{\"reason\": \"damaged\", \"items\": [{\"sku\": \"SHO-RN\", \"quantity\": 1}]}\n\nResponses:\n- 201: refund recorded; body has refund_id, order_id and amount_kobo\n- 400: the body is malformed or a field is invalid; body has error\n- 404: the order doesn't exist\n- 422: valid request refused by the rules (outside the 14-day window, or never delivered)\n\nAmounts are in kobo. changed_mind returns carry a 10% restocking fee; the delivery fee is refunded for failed_delivery, damaged and wrong_item.",
  "note": "Good documentation answers the questions the mobile team would otherwise ask you.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A request names a product that isn't in the order. Which status code?",
    "options": ["201", "400", "404", "500"],
    "answer": 1,
    "explanation": "The request is invalid for this order."
  },
  {
    "prompt": "A valid request arrives 19 days after delivery. Which code?",
    "options": ["400", "404", "422", "500"],
    "answer": 2,
    "explanation": "Well formed, but refused by a rule."
  },
  {
    "prompt": "Why exclude bool when checking that quantity is an int?",
    "options": ["Style", "In Python, True and False are ints, so true would pass as 1", "JSON has no booleans", "Speed"],
    "answer": 1,
    "explanation": "isinstance(True, int) is True."
  }
]
```
