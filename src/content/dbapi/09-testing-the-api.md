---
title: Testing the API
minutes: 15
summary: Test an API and its database together with pytest, using fixtures that give every test a fresh, small database, so tests are fast, independent and repeatable.
---

## The problem

Tallybook's first API tests ran against a shared development database. One test recorded a payment; another test, run afterwards, found the balance changed and failed. Tests passed or failed depending on the order they ran in, and on what someone had done to the database that morning. People stopped trusting them.

Good tests are **independent**: each starts from a known state, and nothing one test does affects another.

## The concept

**Fixtures**

A pytest **fixture** is a function that prepares something a test needs and hands it over. A test asks for it by naming it as a parameter:

```python norun
@pytest.fixture
def client():
    db = make_test_database()      # fresh for every test
    yield create_app(db).test_client()
```

**An app factory**

`create_app(db)` builds the app around whichever database it's given: the real one in production, a fresh in-memory one in tests.

**Small, known test data**

Tests use a few rows written into the fixture, chosen to make expected answers easy to work out by hand, not the full production data.

**What to test in an API**

Every endpoint's success case, each error status, and the rules that involve the database: totals, balances, uniqueness, and that a refused request changed nothing.

## Example

The API as a module with an app factory, and its tests. Write both files and run pytest:

```bash
%%bash
cat > pytest.ini <<'EOF'
[pytest]
addopts = -q -p no:cacheprovider --tb=short
console_output_style = classic
EOF
cat > billing_api.py <<'EOF'
import sqlite3

from flask import Flask, jsonify, request

SCHEMA = """
CREATE TABLE invoices (invoice_id TEXT PRIMARY KEY, total_kobo INTEGER NOT NULL);
CREATE TABLE payments (bank_reference TEXT PRIMARY KEY,
                       invoice_id TEXT NOT NULL REFERENCES invoices (invoice_id),
                       amount_kobo INTEGER NOT NULL CHECK (amount_kobo > 0));
"""


def balance(db, invoice_id):
    row = db.execute("SELECT total_kobo FROM invoices WHERE invoice_id = ?", (invoice_id,)).fetchone()
    if row is None:
        return None
    paid = db.execute("SELECT COALESCE(SUM(amount_kobo), 0) FROM payments WHERE invoice_id = ?", (invoice_id,)).fetchone()[0]
    return row[0] - paid


def create_app(db):
    app = Flask(__name__)

    @app.get("/invoices/<invoice_id>")
    def get_invoice(invoice_id):
        owed = balance(db, invoice_id)
        if owed is None:
            return jsonify(error="No such invoice"), 404
        return jsonify(invoice_id=invoice_id, balance_kobo=owed)

    @app.post("/invoices/<invoice_id>/payments")
    def add_payment(invoice_id):
        owed = balance(db, invoice_id)
        if owed is None:
            return jsonify(error="No such invoice"), 404
        body = request.get_json(silent=True) or {}
        amount, reference = body.get("amount_kobo"), body.get("bank_reference")
        if not isinstance(amount, int) or amount <= 0 or not reference:
            return jsonify(error="Send a positive amount_kobo and a bank_reference"), 400
        if amount > owed:
            return jsonify(error="Payment exceeds the balance"), 409
        try:
            with db:
                db.execute("INSERT INTO payments VALUES (?, ?, ?)", (reference, invoice_id, amount))
        except sqlite3.IntegrityError:
            return jsonify(error="Reference already recorded"), 409
        return jsonify(invoice_id=invoice_id, balance_kobo=balance(db, invoice_id)), 201
    return app
EOF
cat > test_billing_api.py <<'EOF'
import sqlite3

import pytest

from billing_api import SCHEMA, create_app


@pytest.fixture
def db():
    conn = sqlite3.connect(":memory:", check_same_thread=False)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.executescript(SCHEMA)
    conn.execute("INSERT INTO invoices VALUES ('INV-1', 215000)")   # N2,150.00 owed
    conn.commit()
    yield conn
    conn.close()


@pytest.fixture
def client(db):
    return create_app(db).test_client()


def test_new_invoice_shows_full_balance(client):
    assert client.get("/invoices/INV-1").get_json()["balance_kobo"] == 215000


def test_unknown_invoice_is_404(client):
    assert client.get("/invoices/NOPE").status_code == 404


def test_part_payment_reduces_balance(client):
    r = client.post("/invoices/INV-1/payments", json={"amount_kobo": 15000, "bank_reference": "B1"})
    assert r.status_code == 201
    assert r.get_json()["balance_kobo"] == 200000


def test_overpayment_is_refused_and_changes_nothing(client, db):
    r = client.post("/invoices/INV-1/payments", json={"amount_kobo": 215001, "bank_reference": "B2"})
    assert r.status_code == 409
    assert db.execute("SELECT COUNT(*) FROM payments").fetchone()[0] == 0


def test_reused_reference_is_refused(client):
    client.post("/invoices/INV-1/payments", json={"amount_kobo": 1000, "bank_reference": "B3"})
    r = client.post("/invoices/INV-1/payments", json={"amount_kobo": 1000, "bank_reference": "B3"})
    assert r.status_code == 409


@pytest.mark.parametrize("body", [{}, {"amount_kobo": 0, "bank_reference": "B4"}, {"amount_kobo": "100", "bank_reference": "B4"}, {"amount_kobo": 100}])
def test_invalid_payment_is_400(client, body):
    assert client.post("/invoices/INV-1/payments", json=body).status_code == 400
EOF
python -m pytest
```

```text
.........
9 passed in 0.01s
```

Nine tests (the parametrized one counts four times), each with its own fresh database. Run them in any order, as often as you like: same result. Notice `test_overpayment_is_refused_and_changes_nothing` checks the database directly, not just the status code: a refused request must leave no trace.

## Walkthrough

1. Run the cell in Colab. Then break the code: change `amount > owed` to `amount >= owed`. Which test fails, and is that the behaviour you want?
2. Add a test that paying the exact balance leaves a balance of 0.
3. Why does the `client` fixture take `db` as a parameter?
4. Write a test for a new rule (the task below).

## Practice

```task
{
  "id": "dba-09-t1",
  "prompt": "Write a **pytest test** using the `client` and `db` fixtures that checks paying the **exact balance** returns **201**, leaves a balance of **0**, and that **one** payment row exists.",
  "minutes": 6,
  "rows": 8,
  "placeholder": "def test_paying_the_exact_balance_...(client, db):",
  "rules": [
    { "label": "A test function using client and db", "pattern": "def\\s+test_\\w+\\s*\\(\\s*(client\\s*,\\s*db|db\\s*,\\s*client)\\s*\\)" },
    { "label": "Posts a payment of 215000", "pattern": "post\\([^)]*215_?000" },
    { "label": "Asserts status 201", "pattern": "status_code\\s*==\\s*201" },
    { "label": "Asserts a balance of 0", "pattern": "balance_kobo[\"']\\]\\s*==\\s*0\\b" },
    { "label": "Checks one payment row in the database", "pattern": "db\\.execute\\([^)]*COUNT[\\s\\S]*==\\s*1\\b" }
  ],
  "sample": "def test_paying_the_exact_balance_clears_it(client, db):\n    r = client.post(\"/invoices/INV-1/payments\", json={\"amount_kobo\": 215000, \"bank_reference\": \"B9\"})\n    assert r.status_code == 201\n    assert r.get_json()[\"balance_kobo\"] == 0\n    assert db.execute(\"SELECT COUNT(*) FROM payments\").fetchone()[0] == 1",
  "note": "The boundary from the Software Engineering course again: paying exactly what's owed must be allowed.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why give each test a fresh database?",
    "options": ["It's faster", "So no test depends on what another test did, and results don't depend on order", "pytest requires it", "To save disk"],
    "answer": 1,
    "explanation": "Independent tests are trustworthy tests."
  },
  {
    "prompt": "What does an app factory like create_app(db) make possible?",
    "options": ["Faster requests", "Running the same app on a test database in tests and the real one in production", "Automatic deployment", "Encryption"],
    "answer": 1,
    "explanation": "Inject what the app depends on."
  },
  {
    "prompt": "A refused overpayment returns 409. What else should the test check?",
    "options": ["Nothing", "That no payment row was written", "The server's CPU", "The response time"],
    "answer": 1,
    "explanation": "Refusals must leave no trace."
  }
]
```
