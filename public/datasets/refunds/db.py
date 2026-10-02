"""Database access for the refunds service (SQLite)."""
import csv
import sqlite3
from pathlib import Path


def connect(path=":memory:"):
    conn = sqlite3.connect(path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init(conn, folder="."):
    """Create the tables and load the sample customers, orders and items."""
    conn.executescript(Path(folder, "schema.sql").read_text())
    for table in ["customers", "orders", "order_items"]:
        with open(Path(folder, f"{table}.csv"), newline="", encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
        cols = list(rows[0])
        placeholders = ", ".join("?" for _ in cols)
        conn.executemany(f"INSERT INTO {table} ({', '.join(cols)}) VALUES ({placeholders})", [tuple(r[c] for c in cols) for r in rows])
    conn.commit()


def find_orders_by_email(conn, email):
    sql = f"SELECT o.* FROM orders o JOIN customers c USING (customer_id) WHERE c.email = '{email}'"
    return conn.execute(sql).fetchall()


def get_order(conn, order_id):
    return conn.execute("SELECT * FROM orders WHERE order_id = ?", (order_id,)).fetchone()


def order_items(conn, order_id):
    return conn.execute("SELECT * FROM order_items WHERE order_id = ?", (order_id,)).fetchall()


def refunds_for(conn, order_id):
    return conn.execute("SELECT * FROM refunds WHERE order_id = ? ORDER BY refund_id", (order_id,)).fetchall()


def record_refund(conn, order_id, reason, amount_kobo):
    cur = conn.execute(
        "INSERT INTO refunds (order_id, reason, amount_kobo, created_at) VALUES (?, ?, ?, datetime('now'))",
        (order_id, reason, amount_kobo),
    )
    conn.commit()
    return cur.lastrowid
