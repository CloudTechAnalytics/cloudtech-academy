"""The refunds API."""
from datetime import date

from flask import Flask, jsonify, request

import db
import refunds


def create_app(conn, today=None):
    app = Flask(__name__)

    @app.post("/orders/<order_id>/refunds")
    def create_refund(order_id):
        body = request.get_json()
        reason = body["reason"]
        order = db.get_order(conn, order_id)
        prices = {item["sku"]: item["unit_price_kobo"] for item in db.order_items(conn, order_id)}
        if reason != "failed_delivery":
            if not refunds.within_window(date.fromisoformat(order["delivered_on"]), today or date.today()):
                return jsonify(error="outside the return window"), 422
        lines = [(line["quantity"], prices[line["sku"]]) for line in body["items"]]
        amount = refunds.refund_amount(lines, reason, order["delivery_fee_kobo"])
        refund_id = db.record_refund(conn, order_id, reason, amount)
        return jsonify(refund_id=refund_id, order_id=order_id, amount_kobo=amount), 201

    @app.get("/orders/<order_id>/refunds")
    def list_refunds(order_id):
        return jsonify([dict(r) for r in db.refunds_for(conn, order_id)])

    return app
