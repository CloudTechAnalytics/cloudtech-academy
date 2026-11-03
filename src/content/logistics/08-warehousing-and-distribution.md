---
title: Warehousing and Distribution
minutes: 25
summary: Understand warehouse operations and inventory handling, how distribution networks are designed, and how to run reliable, cost-effective last-mile delivery.
---

## What a warehouse does

A warehouse is more than a store. It is a place where goods are **received, held, picked, packed and dispatched** efficiently. It buffers supply against demand, consolidates shipments, protects goods and can add value through labelling, kitting and light assembly.

## Warehouse operations

The main flow:

1. **Receiving.** Goods arrive by truck or container. Check them against the delivery note and purchase order: count, inspect, record any damage or shortage. Record the receipt in the system.
2. **Put-away.** Move goods to storage locations, by size, weight, turnover and handling needs. Fast-moving goods go near the dispatch area.
3. **Storage.** Keep goods safe, dry, organised and secure. Track each location.
4. **Order picking.** Collect the items for each customer order. Methods include picking one order at a time, batching several orders, or picking by zone.
5. **Packing.** Check and pack the order, add labels and documents.
6. **Dispatch.** Load the vehicle, record what left and when, and hand over documents.
7. **Returns.** Receive, inspect and decide to restock, repair, discard or return to the supplier.

**Layout and safety.** Plan clear aisles, loading bays and a logical flow so goods and people do not cross paths. Use safe lifting and equipment practices, protect from fire, theft and pests, and train staff.

## Inventory handling

Accurate stock records are the heart of a warehouse.

- **FIFO (first in, first out)** uses the oldest stock first. **FEFO (first expired, first out)** ships the earliest-expiring stock first, vital for food and medicine.
- **Location control:** every item has an address, so it can be found quickly.
- **Cycle counts:** counting a small part of the stock regularly, instead of one big annual count, finds errors early.
- **Stock accuracy** is measured as records that match the physical count. Good warehouses aim for very high accuracy, such as 98% or more.
- **Damaged, expired and slow-moving stock** should be separated, recorded and acted on.
- **Security:** controlled access, signed issues and receipts, and CCTV where appropriate.

Warehouse management can be done with simple tools (a spreadsheet and clear procedures) in a small business, or with a warehouse management system (WMS) in a larger one.

## Distribution networks

A **distribution network** is how goods get from the supplier or factory to customers. Key choices:

- **Number and location of warehouses.** More warehouses near customers give faster delivery but cost more to run and need more stock. One central warehouse is cheaper to run but slower to serve distant customers.
- **Direct delivery versus hub and spoke.** Goods may go straight to the customer, or to a regional hub and then onward to local points.
- **Cross-docking:** goods arriving are moved straight to outbound vehicles with little or no storage, saving time and space.
- **Own fleet versus outsourced transport.** Running trucks gives control but needs capital and management; hiring carriers is flexible but you depend on them.
- **Customer service level** you promise: next day, two days or a week.

The best network is the one that meets the service you promise at the lowest total cost. Review it as customers and volumes change.

## Last-mile delivery

The **last mile** is the final leg to the customer. It is often the most expensive and the most visible part of the journey, especially in busy cities with traffic and unclear addresses.

Ways to make it work:

- **Plan routes** to group nearby deliveries and avoid wasted trips.
- **Use clear delivery information:** accurate address, landmark, contact number and a delivery window.
- **Confirm before dispatch,** by call or message, to reduce failed deliveries.
- **Use the right vehicle** (motorbike, van, truck) for the load and the area.
- **Collect proof of delivery:** signature, photo or code.
- **Handle cash on delivery carefully** with clear records.
- **Measure and improve:** first-attempt success, cost per delivery and customer feedback.

Example: a firm makes 120 deliveries in a day at a total cost of ₦480,000. The **cost per delivery** is 480,000 ÷ 120 = **₦4,000**. If 108 are delivered on the first attempt, the **first-attempt success rate** is 108 ÷ 120 = **90%**. Each failed delivery costs a second trip, so raising that rate cuts cost.

## Try it

```task
{
  "id": "lff-m08-t1",
  "prompt": "A courier makes **120 deliveries** in a day at a total cost of **₦480,000**. **108** are delivered on the first attempt. Work out the **cost per delivery** and the **first-attempt success rate**, and say one way to improve it.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Cost per delivery = ...",
  "rules": [
    { "label": "Cost per delivery of ₦4,000", "pattern": "4,?000" },
    { "label": "Success rate of 90%", "pattern": "\\b90\\s?%|90 percent" },
    { "label": "Suggests an improvement (confirm before dispatch, clear addresses, route planning)", "pattern": "confirm|address|route|phone|call|message|window|plan" }
  ],
  "sample": "Cost per delivery = 480,000 / 120 = ₦4,000.\nFirst-attempt success rate = 108 / 120 = 90%.\nI would improve it by confirming the address and a delivery window with each customer before dispatch, so fewer deliveries fail.",
  "required": true
}
```

```task
{
  "id": "lff-m08-t2",
  "prompt": "Put the warehouse flow in order for a delivery of 200 cartons of canned food, **one step per line** (at least seven): receiving, checking, put-away, storage, picking, packing, dispatch. Add one line saying whether you use **FIFO or FEFO** for the food, and why.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "1. Receive ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Includes receiving and checking against the delivery note", "pattern": "receiv[\\s\\S]*(check|count|inspect)|(check|count|inspect)[\\s\\S]*receiv" },
    { "label": "Includes put-away and storage", "pattern": "put-?away|store|storage|location" },
    { "label": "Includes picking and packing", "pattern": "pick[\\s\\S]*pack|pack[\\s\\S]*pick" },
    { "label": "Includes dispatch", "pattern": "dispatch|load|ship" },
    { "label": "Chooses FEFO (or FIFO) with a reason about expiry", "pattern": "fefo|first expired|expir|best before" }
  ],
  "sample": "1. Receive the delivery at the bay and check it against the delivery note and purchase order.\n2. Count and inspect the cartons and note any damage or shortage.\n3. Record the receipt in the stock system.\n4. Put the cartons away to their storage locations.\n5. Keep them stored, dry and secure, with locations recorded.\n6. Pick the items for each customer order.\n7. Pack and label the orders.\n8. Dispatch the loaded vehicle and record what left.\nI would use FEFO, first expired first out, because canned food has an expiry date and the earliest-expiring stock must go out first.",
  "required": true
}
```

```task
{
  "id": "lff-m08-t3",
  "prompt": "A company with one warehouse in Lagos has many customers in Abuja and Kano who complain about slow delivery. In 50 to 100 words, suggest **two options** to improve this and the trade-off of each.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Option 1 ...",
  "rules": [
    { "label": "Suggests a second warehouse or hub nearer the customers", "pattern": "second warehouse|regional|hub|abuja|kano|closer|nearer|branch" },
    { "label": "Suggests another option (carrier, cross-docking, faster transport, local partner)", "pattern": "carrier|cross-?dock|partner|faster|courier|3pl|outsourc|rail|air" },
    { "label": "States a trade-off (cost, stock, complexity)", "pattern": "cost|stock|more|expens|complex|inventory|trade-?off" },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "Option 1 is to open a small regional warehouse or hub in Abuja to serve the north, which gives faster delivery, but it costs more to run and needs extra stock held there. Option 2 is to keep one warehouse but use a reliable carrier with a regional hub and cross-docking for the northern routes, which avoids new stock and rent, but the delivery is still slower than serving from a local warehouse and we depend on the carrier.",
  "required": false
}
```

Next lesson: technology and tracking.
