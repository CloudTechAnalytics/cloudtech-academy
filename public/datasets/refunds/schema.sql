CREATE TABLE customers (
  customer_id TEXT PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL
);

CREATE TABLE orders (
  order_id          TEXT PRIMARY KEY,
  customer_id       TEXT NOT NULL REFERENCES customers (customer_id),
  status            TEXT NOT NULL,
  delivered_on      TEXT,
  delivery_fee_kobo INTEGER NOT NULL
);

CREATE TABLE order_items (
  order_id        TEXT NOT NULL REFERENCES orders (order_id),
  sku             TEXT NOT NULL,
  quantity        INTEGER NOT NULL,
  unit_price_kobo INTEGER NOT NULL,
  PRIMARY KEY (order_id, sku)
);

CREATE TABLE refunds (
  refund_id   INTEGER PRIMARY KEY,
  order_id    TEXT NOT NULL REFERENCES orders (order_id),
  reason      TEXT NOT NULL,
  amount_kobo INTEGER NOT NULL,
  created_at  TEXT NOT NULL
);
