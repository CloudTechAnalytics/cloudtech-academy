---
title: Close the security hole
minutes: 25
summary: Show exactly what the SQL injection in the order search can do, fix it with a parameterised query, prove the fix with tests that attack it, and see why input checks are a second layer, not the fix.
---

## The problem

ISSUE-104: typing `' OR '1'='1` into the support tool's email search returns every order in the system. It sounds like a curiosity. It isn't. The same hole lets anyone who can reach the search read **any** data the database user can read, such as every customer's email address, and on many databases, change or delete it.

## The concept

**SQL injection**

The query is built by pasting the user's text into SQL:

```python norun
sql = f"SELECT o.* FROM orders o JOIN customers c USING (customer_id) WHERE c.email = '{email}'"
```

If the text contains a quote, it ends the string early, and whatever follows becomes **SQL**. `' OR '1'='1` turns the condition into one that is always true.

**The fix: parameters**

Pass values separately from the SQL, with placeholders (`?` in SQLite). The database treats a parameter as a value, never as SQL, whatever it contains. This is the only reliable fix.

**Defence in depth**

Checking that an email looks like an email, giving the service a database user with only the permissions it needs, and logging odd searches are all useful **extra** layers. None of them replaces parameters.

## Example

Get the code, then show what the search does with normal and hostile input:

```bash
%%bash
base=https://academy.cloudtechanalytics.com/datasets/refunds
for f in refunds.py db.py app.py schema.sql customers.csv orders.csv order_items.csv test_refunds.py pytest.ini; do
  curl -sO "$base/$f"
done
python - <<'EOF'
import db

conn = db.connect()
db.init(conn)
print("Normal search:", len(db.find_orders_by_email(conn, "aisha.lawal@example.com")), "orders")
print("Always-true search:", len(db.find_orders_by_email(conn, "' OR '1'='1")), "orders")
leak = db.find_orders_by_email(conn, "x' UNION SELECT customer_id, email, name, '', 0 FROM customers --")
print("UNION search:", len(leak), "rows, for example:", tuple(leak[0]))
EOF
```

```text
Normal search: 3 orders
Always-true search: 150 orders
UNION search: 60 rows, for example: ('C001', 'aisha.lawal@example.com', 'Aisha Lawal', '', 0)
```

The last search returns every customer's email address and name, through a box meant to find one customer's orders. Now the fix, and tests that attack it:

```bash
%%bash
python - <<'EOF'
import re

source = open("db.py").read()
old = '''    sql = f"SELECT o.* FROM orders o JOIN customers c USING (customer_id) WHERE c.email = '{email}'"
    return conn.execute(sql).fetchall()'''
new = '''    sql = "SELECT o.* FROM orders o JOIN customers c USING (customer_id) WHERE c.email = ?"
    return conn.execute(sql, (email,)).fetchall()'''
assert old in source
open("db.py", "w").write(source.replace(old, new))
EOF
cat > test_security.py <<'EOF'
import pytest

import db


@pytest.fixture
def conn():
    conn = db.connect()
    db.init(conn)
    return conn


def test_search_finds_the_customers_orders(conn):
    orders = db.find_orders_by_email(conn, "aisha.lawal@example.com")
    assert orders and all(o["customer_id"] == "C001" for o in orders)


@pytest.mark.parametrize("attack", [
    "' OR '1'='1",
    "x' UNION SELECT customer_id, email, name, '', 0 FROM customers --",
    "aisha.lawal@example.com' --",
])
def test_search_treats_attacks_as_plain_text(conn, attack):
    assert db.find_orders_by_email(conn, attack) == []
EOF
python -m pytest
grep -n "f\"SELECT\|f'SELECT\|format(" db.py || echo "No SELECT queries built from strings left in db.py"
```

```text
.......
7 passed in 0.01s
No SELECT queries built from strings left in db.py
```

The attacks now find nothing, the normal search still works, and the last check confirms no other SELECT in `db.py` is built from strings. (`init` does build its INSERT statements from **table and column names in the code**, not from user input, which is safe; values still go in as parameters.)

## Walkthrough

1. Run the cells.
2. Before the fix, try an attack that changes data: what would `x'; DELETE FROM refunds; --` do? (SQLite's `execute` refuses to run two statements, which is luck, not design.)
3. Add an email format check in `app.py` for when the search is exposed through the API. Why is it still not enough on its own?
4. Search the rest of the code for any other place where user input reaches SQL, a shell command or a file path.
5. Write the security note (the task below).

## Practice

```answer
{
  "id": "sdc-04-p1",
  "prompt": "Before the fix, how many orders did the always-true search return?",
  "answer": 150,
  "format": "number",
  "hint": "The second line printed.",
  "required": true
}
```

```task
{
  "id": "sdc-04-t1",
  "prompt": "Write the **security note** for the incident log (50 to 130 words): what the **flaw** was, what an attacker **could** have done, the **fix**, how it's **tested**, and one **extra layer** you'd add.",
  "minutes": 7,
  "rows": 6,
  "placeholder": "The order search built SQL ...",
  "rules": [
    { "label": "Names the flaw (SQL injection)", "pattern": "sql injection|injection" },
    { "label": "Says what an attacker could do (read, every customer, email)", "pattern": "every|all|read|email|leak" },
    { "label": "The fix (parameter, placeholder)", "pattern": "parameter|placeholder" },
    { "label": "Tests", "pattern": "test" },
    { "label": "An extra layer (validation, permissions, logging)", "pattern": "validat|permission|privilege|log|monitor" },
    { "label": "Between 50 and 130 words", "minWords": 50, "maxWords": 130 }
  ],
  "sample": "The support tool's order search built its SQL by pasting the typed email into the query, a SQL injection flaw (ISSUE-104). Anyone using the search could read every order and, with a UNION query, every customer's name and email address. We've replaced it with a parameterised query, so input is always treated as a value. Tests now run three attack strings against the search and check they return nothing, alongside a normal search. As an extra layer, we'll give the service a database user that can only read and write the tables it needs, and log searches that contain quotes.",
  "note": "Say plainly what was exposed. Incident notes that minimise lose trust when the details come out.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What is the reliable fix for SQL injection?",
    "options": ["Escaping quotes by hand", "Parameterised queries", "Checking the email format", "Hiding the search box"],
    "answer": 1,
    "explanation": "Parameters are never treated as SQL."
  },
  {
    "prompt": "Why isn't input validation enough on its own?",
    "options": ["It's slow", "Valid-looking input can still contain SQL, and every new input path needs its own check", "It's illegal", "It breaks tests"],
    "answer": 1,
    "explanation": "Validation is a layer, not the fix."
  },
  {
    "prompt": "What's the value of a test that sends attack strings?",
    "options": ["None", "It fails if anyone reintroduces string-built SQL in future", "It speeds up the search", "It replaces code review"],
    "answer": 1,
    "explanation": "Security fixes need regression tests too."
  }
]
```
