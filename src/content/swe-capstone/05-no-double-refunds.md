---
title: No double refunds
minutes: 30
summary: Fix ISSUE-102 and ISSUE-105 where they belong, in the database layer. Add an idempotency key with a unique index, refund the delivery fee once, cap refunds at what was paid, and do the check and the write in one transaction.
---

## The problem

Two money bugs remain, and both happen **between** requests:

- **ISSUE-102**: the app froze, the customer tapped Submit again, and two refunds were created for one return.
- **ISSUE-105**: a partial return, then another, and each one refunded the delivery fee, so the refunds came to more than the order cost.

Neither can be fixed inside `refund_amount`, which only ever sees one request. The fix needs the database: what's already been refunded, and a guarantee that the same request can't be recorded twice.

## The concept

**Idempotency keys**

The app sends a unique `request_id` with each refund request and reuses it when it retries. The service stores it, and a **unique index** makes a second insert with the same key impossible. A repeated request gets the **original** answer back, not a new refund. This is how payment APIs handle retries.

**Rules that span requests**

- The delivery fee is refunded **once** per order.
- The total refunded can never exceed what the customer **paid**.

**Check and write in one transaction**

Reading "how much has been refunded" and then writing a new refund must happen as one unit. Otherwise two requests can both read the old total, both pass the check, and both write. `BEGIN IMMEDIATE` takes SQLite's write lock before the check.

**A migration, not an edit**

The live database already has a `refunds` table. Add the new columns and index with a migration script that can run on it, rather than editing `schema.sql` and starting again.

## Example

Get the code, and write the migration and the service layer:

```bash
%%bash
base=https://academy.cloudtechanalytics.com/datasets/refunds
for f in refunds.py db.py app.py schema.sql customers.csv orders.csv order_items.csv test_refunds.py pytest.ini; do
  curl -sO "$base/$f"
done
cat > service.py <<'EOF'
"""Refund requests: the refund rules, applied safely to the database."""
import sqlite3

import refunds

FEE_REASONS = {"failed_delivery", "damaged", "wrong_item"}


class RefundError(Exception):
    """A refund that the rules don't allow."""


def migrate(conn):
    """Add idempotency keys and fee tracking to an existing refunds table."""
    conn.executescript("""
        ALTER TABLE refunds ADD COLUMN request_id TEXT;
        ALTER TABLE refunds ADD COLUMN delivery_fee_kobo INTEGER NOT NULL DEFAULT 0;
        CREATE UNIQUE INDEX refunds_request_id ON refunds (request_id);
    """)


def _existing(conn, request_id):
    row = conn.execute("SELECT * FROM refunds WHERE request_id = ?", (request_id,)).fetchone()
    return dict(row) if row else None


def request_refund(conn, order_id, request_id, reason, lines):
    """Record a refund once. Returns (refund, created). lines: list of (sku, quantity)."""
    earlier = _existing(conn, request_id)
    if earlier:
        return earlier, False
    conn.execute("BEGIN IMMEDIATE")
    try:
        order = conn.execute("SELECT * FROM orders WHERE order_id = ?", (order_id,)).fetchone()
        prices = {r["sku"]: r["unit_price_kobo"] for r in conn.execute("SELECT * FROM order_items WHERE order_id = ?", (order_id,))}
        paid = sum(r["quantity"] * r["unit_price_kobo"] for r in conn.execute("SELECT * FROM order_items WHERE order_id = ?", (order_id,)))
        paid += order["delivery_fee_kobo"]
        so_far = conn.execute(
            "SELECT COALESCE(SUM(amount_kobo), 0) AS amount, COALESCE(SUM(delivery_fee_kobo), 0) AS fee FROM refunds WHERE order_id = ?",
            (order_id,),
        ).fetchone()
        goods = sum(refunds.item_refund(quantity, prices[sku], reason) for sku, quantity in lines)
        fee = order["delivery_fee_kobo"] if reason in FEE_REASONS and so_far["fee"] == 0 else 0
        if so_far["amount"] + goods + fee > paid:
            raise RefundError(f"refunds would total {so_far['amount'] + goods + fee} kobo, more than the {paid} paid")
        conn.execute(
            "INSERT INTO refunds (order_id, request_id, reason, amount_kobo, delivery_fee_kobo, created_at) "
            "VALUES (?, ?, ?, ?, ?, datetime('now'))",
            (order_id, request_id, reason, goods + fee, fee),
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.rollback()  # another request with the same key got there first
        return _existing(conn, request_id), False
    except Exception:
        conn.rollback()
        raise
    return _existing(conn, request_id), True
EOF
echo "service.py written"
```

```text
service.py written
```

Now tests built from the two reports:

```bash
%%bash
cat > test_service.py <<'EOF'
import pytest

import db
import service


@pytest.fixture
def conn():
    conn = db.connect()
    db.init(conn)
    service.migrate(conn)
    return conn


def test_retried_request_creates_one_refund(conn):
    # ISSUE-102: the same request twice
    first, created = service.request_refund(conn, "K-1002", "req-abc", "damaged", [("SHO-RN", 1)])
    again, created_again = service.request_refund(conn, "K-1002", "req-abc", "damaged", [("SHO-RN", 1)])
    assert created and not created_again
    assert again["refund_id"] == first["refund_id"]
    assert len(db.refunds_for(conn, "K-1002")) == 1


def test_partial_returns_refund_the_delivery_fee_once(conn):
    # ISSUE-105: K-1005 paid 2 x 2,750,000 + 4,500,000 + 300,000 fee = 10,300,000 kobo
    first, _ = service.request_refund(conn, "K-1005", "req-1", "damaged", [("POT-SET", 2)])
    second, _ = service.request_refund(conn, "K-1005", "req-2", "damaged", [("BLN-X1", 1)])
    assert first["amount_kobo"] == 5_800_000   # 5,500,000 + the fee
    assert second["amount_kobo"] == 4_500_000  # no fee the second time
    assert first["amount_kobo"] + second["amount_kobo"] == 10_300_000


def test_refunds_can_never_exceed_what_was_paid(conn):
    service.request_refund(conn, "K-1005", "req-1", "damaged", [("POT-SET", 2), ("BLN-X1", 1)])
    with pytest.raises(service.RefundError):
        service.request_refund(conn, "K-1005", "req-2", "damaged", [("BLN-X1", 1)])
    assert len(db.refunds_for(conn, "K-1005")) == 1


def test_database_refuses_a_duplicate_key_even_without_the_check(conn):
    conn.execute("INSERT INTO refunds (order_id, request_id, reason, amount_kobo, created_at) VALUES ('K-1002', 'req-x', 'damaged', 1, 'now')")
    with pytest.raises(Exception):
        conn.execute("INSERT INTO refunds (order_id, request_id, reason, amount_kobo, created_at) VALUES ('K-1002', 'req-x', 'damaged', 1, 'now')")
EOF
python -m pytest
```

```text
.......
7 passed in 0.01s
```

The last test checks the database itself: even if a future change skipped the service's check, the unique index still refuses a second refund with the same key. Rules that protect money belong as close to the data as possible.

## Walkthrough

1. Run the cells.
2. Add a rule that a customer can't return more units of a product than they ordered, across all their refunds, with a test.
3. Simulate two requests with the same key arriving together (two connections to one database file). Which one wins, and what does the other get back?
4. Write the migration's rollback plan: what would you do if the unique index failed to create on the live database because duplicates already exist?
5. Write the design note (the task below).

## Practice

```answer
{
  "id": "sdc-05-p1",
  "prompt": "With the fix, how many kobo is K-1005's **second** partial refund (the blender)?",
  "answer": 4500000,
  "format": "number",
  "hint": "Its price, with no delivery fee the second time.",
  "required": true
}
```

```task
{
  "id": "sdc-05-t1",
  "prompt": "Write the **design note** for this change (60 to 150 words): what an **idempotency key** is and how the app must use it, the two **rules** across requests, why the check and write share a **transaction**, and what the **unique index** adds.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Every refund request now carries ...",
  "rules": [
    { "label": "Explains the idempotency key and retries", "pattern": "idempoten|request_id|retr" },
    { "label": "Delivery fee once", "pattern": "fee[^.]*once|once[^.]*fee" },
    { "label": "Cap at what was paid", "pattern": "paid|exceed" },
    { "label": "Transaction", "pattern": "transaction|BEGIN|lock" },
    { "label": "Unique index or constraint", "pattern": "unique" },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "Every refund request now carries a request_id that the app generates once and reuses on every retry of the same request. If the service has already recorded that request_id, it returns the original refund instead of creating a new one, so double taps and network retries are safe (ISSUE-102). Across requests, the delivery fee is refunded once per order, and the total refunded can never exceed what the customer paid (ISSUE-105). The check and the insert run in one transaction, started with BEGIN IMMEDIATE, so two requests can't both read the old total and both pass. The unique index on request_id is the last line of defence: the database itself refuses a duplicate, even if a future code path skips the check.",
  "note": "The app team needs the first sentence most: without a stable request_id on retries, none of this works.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What should happen when the same request_id arrives twice?",
    "options": ["Create a second refund", "Return the original refund, creating nothing new", "Return an error and lose the first", "Delete both"],
    "answer": 1,
    "explanation": "Retries must be safe."
  },
  {
    "prompt": "Why put the check and the insert in one transaction?",
    "options": ["It's faster", "So two concurrent requests can't both pass the check before either writes", "SQLite requires it", "To log the refund"],
    "answer": 1,
    "explanation": "Check-then-write must be atomic."
  },
  {
    "prompt": "Why add a unique index when the code already checks for an existing request_id?",
    "options": ["Indexes are free", "The database enforces it even if code changes or races slip through", "For speed only", "To sort refunds"],
    "answer": 1,
    "explanation": "Defence in depth for money."
  }
]
```
