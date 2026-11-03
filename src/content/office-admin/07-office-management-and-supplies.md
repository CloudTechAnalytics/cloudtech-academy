---
title: Office Management and Supplies
minutes: 25
summary: Order and control supplies, work with vendors, handle petty cash and expenses and look after health, safety and equipment.
---

## Ordering and stock

An office that runs out of paper, toner or cleaning supplies loses time; an office that over-orders wastes money and space. Good supply management keeps **enough, not too much.**

**Know what you use:**

- **List the regular items:** paper, pens, toner, cleaning materials, kitchen supplies, first-aid items, light bulbs, batteries.
- **Track usage:** note how much is used each week or month.
- **Set minimum levels and reorder points.**

**Reorder level** = (average use per week × lead time in weeks) + safety stock. Example: the office uses **10 reams** of paper a week, delivery takes **2 weeks** and you want **1 week** of safety stock. Reorder level = 10 × 2 + 10 = **30 reams.** When stock falls to 30, order. Order quantity might be a month's supply (about 40 reams) to get a better price while avoiding overstock.

**Good practice:**

- **Keep a stock list** (spreadsheet or book) with item, location, quantity, minimum level, supplier and price.
- **Do a regular stock check** and update the list.
- **Store supplies in a tidy, locked cupboard,** with oldest stock used first, and control who can take them.
- **Get approval** for orders according to the spending limits.
- **Check deliveries** against the order and delivery note: quantity, items and condition. Report problems to the supplier at once, and keep the delivery note until you have matched it to the invoice.
- **Order in bulk** for items you use steadily, if storage and cash allow.
- **Avoid waste:** reuse, print only what you need and double-sided where suitable.
- **Plan ahead** for busy periods (year-end, events, new staff).

## Working with vendors

Vendors (suppliers) provide supplies and services: stationery, printing, cleaning, maintenance, courier, catering, IT support and utilities. A good vendor saves you time and money; a poor one causes problems.

**Choosing:**

- **Compare at least three quotations** for significant purchases: price, quality, delivery time, payment terms, warranty, reliability and references.
- **Check the vendor is genuine:** registered business, address and contact details, references.
- **Follow the organisation's purchasing policy** and approval limits.
- **Look at total cost,** not just the unit price: delivery, installation, service, warranties.

**Working with them:**

- **Agree in writing:** what, quantity, price, delivery date and payment terms. Use a **purchase order** for larger items.
- **Check what arrives** and pay only against correct invoices.
- **Keep a vendor list** with contacts, products, prices and performance notes.
- **Build good relationships:** be polite, pay on time, give clear instructions.
- **Handle problems early:** wrong items, late delivery or poor service, politely but firmly, and record them.
- **Review regularly:** are they still the best option?
- **Stay ethical:** do not accept gifts or kickbacks that influence your choice, and declare conflicts of interest.

**Comparing quotations example:**

| | Vendor A | Vendor B | Vendor C |
| :-- | :-- | :-- | :-- |
| Paper, 40 reams | ₦192,000 | ₦184,000 | ₦188,000 |
| Delivery | Free | ₦6,000 | Free |
| **Total** | **₦192,000** | **₦190,000** | **₦188,000** |
| Delivery time | 2 days | 5 days | 3 days |

Vendor C has the lowest total (₦188,000), and delivers in 3 days, so it looks best here, even though B has the lowest price before delivery.

## Petty cash and expenses

**Petty cash** is a small amount of cash kept for minor, urgent expenses (stamps, small repairs, refreshments, local transport). It must be controlled carefully, because cash is easy to misuse.

The **imprest system** is the standard method:

1. **Set a float:** a fixed amount, for example ₦50,000, kept in a locked box under the control of one named person (the petty cashier).
2. **Every payment needs a voucher** (a form with date, amount, purpose, the person paid, signature and approval) and **a receipt** where possible.
3. **Keep a petty cash book** recording the float, each payment and the running balance.
4. **At any time,** cash in the box plus the total of vouchers should equal the float.
5. **Top up (reimburse)** the float when it runs low, by the exact amount spent, with the vouchers as evidence.
6. **Count the cash regularly,** and have someone independent check it.

Example: float ₦50,000. Vouchers total **₦38,500.** The cash in the box should be 50,000 − 38,500 = **₦11,500.** If the actual count is ₦11,000, there is a **shortage of ₦500,** which must be investigated and reported. A shortage or surplus should never be hidden.

**Rules:** do not mix petty cash with personal money, do not lend from it, set a limit per payment (for example ₦5,000) and have larger items go through normal purchasing.

**Expenses and claims:** staff claim back money spent for the business (travel, meals, supplies). Good practice: use a standard **expense claim form,** attach receipts, state the purpose, get approval, and pay promptly. Check claims against the policy (rates, limits) and watch for duplicates and false claims.

## Health, safety and equipment

A safe, comfortable office protects people and the business.

**Health and safety:**

- **Fire safety:** clear exits, working extinguishers, alarms, and regular drills. Know where the assembly point is.
- **First aid:** a stocked kit, and named first aiders.
- **Electrical safety:** do not overload sockets, report damaged cables, switch off equipment when not in use, and have installations checked by competent people.
- **Slips, trips and falls:** keep floors and walkways clear and dry; report spills and loose carpets.
- **Safe lifting:** use trolleys and ask for help with heavy items.
- **Security:** control visitor access, lock up at night, protect valuables and secure keys.
- **Report and record** accidents and near misses.
- **Hygiene and cleanliness:** clean kitchens and toilets, safe drinking water.

**Ergonomics** (comfort and posture): adjust chairs and screens, support the back and wrists, take regular breaks from the screen, and ensure good lighting.

**Equipment:**

- **Keep an equipment register:** item, serial number, location, user, purchase date, warranty and service records.
- **Maintain and service** printers, copiers, air conditioners, generators and computers according to schedule.
- **Report faults quickly** and keep vendor and repair contacts handy.
- **Train staff** to use equipment properly.
- **Control access and use,** and protect against theft.
- **Plan replacement** when equipment is old or costly to repair.
- **Dispose of old equipment responsibly,** wiping data from computers and phones first.

Good office management means noticing small problems before they become big ones, and keeping people safe and productive.

## Try it

```task
{
  "id": "poa-m07-t1",
  "prompt": "The office uses **10 reams** of paper a week. Delivery takes **2 weeks** and you want **1 week** of safety stock. Work out the **reorder level**. Stock now is **28 reams**: should you order? Then compare quotes for 40 reams: **A** ₦192,000 free delivery; **B** ₦184,000 plus ₦6,000 delivery; **C** ₦188,000 free delivery. Which is cheapest in total?",
  "minutes": 10,
  "rows": 9,
  "placeholder": "Reorder level = ...",
  "rules": [
    { "label": "Reorder level of 30 reams", "pattern": "\\b30\\b" },
    { "label": "Says to order now", "pattern": "order (now|today)|yes|should order|below" },
    { "label": "B total ₦190,000", "pattern": "190,?000" },
    { "label": "C is cheapest at ₦188,000", "pattern": "\\bc\\b[^\\n]*188,?000|188,?000[^\\n]*\\bc\\b|vendor c" }
  ],
  "sample": "Reorder level = 10 x 2 + 10 = 30 reams. Stock is 28, which is below 30, so I should order now.\nTotals: A = ₦192,000; B = 184,000 + 6,000 = ₦190,000; C = ₦188,000.\nVendor C is the cheapest in total at ₦188,000.",
  "required": true
}
```

```task
{
  "id": "poa-m07-t2",
  "prompt": "Petty cash float is **₦50,000**. Vouchers total **₦38,500** and the box holds **₦11,000**. Work out the cash that **should** be in the box, the **difference** and what you do next. Then list **four petty cash rules**.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "Cash should be ...",
  "rules": [
    { "label": "Cash should be ₦11,500", "pattern": "11,?500" },
    { "label": "Shortage of ₦500", "pattern": "\\b500\\b" },
    { "label": "Investigate and report", "pattern": "investigat|report|find out|check|tell" },
    { "label": "Rules (vouchers, receipts, limit, locked box, counted regularly)", "pattern": "voucher|receipt|limit|locked|count|float|approv", "min": 4 }
  ],
  "sample": "Cash should be 50,000 - 38,500 = ₦11,500. The box holds ₦11,000, so there is a shortage of ₦500.\nI would recount, check the vouchers and receipts for errors, investigate and report the shortage to my manager.\nRules: every payment needs a voucher and a receipt; keep the box locked with one named person; set a limit per payment; count the cash regularly with an independent check.",
  "required": true
}
```

```task
{
  "id": "poa-m07-t3",
  "prompt": "Write an **office safety walk-round checklist** with at least eight items, one per line, covering fire, electrical, first aid, floors, security, ergonomics, equipment and reporting.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "Check fire exits are clear",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Fire", "pattern": "fire|extinguisher|exit|alarm" },
    { "label": "Electrical", "pattern": "electric|socket|cable|plug" },
    { "label": "First aid", "pattern": "first aid|first-aid" },
    { "label": "Floors or walkways", "pattern": "floor|walkway|spill|trip|clutter" },
    { "label": "Security", "pattern": "lock|security|visitor|key" },
    { "label": "Ergonomics or equipment", "pattern": "chair|screen|ergonomic|equipment|printer|generator" },
    { "label": "Reporting", "pattern": "report|record|log" }
  ],
  "sample": "Check fire exits are clear and extinguishers are in date\nTest the fire alarm and confirm the assembly point is known\nCheck sockets are not overloaded and cables are not damaged\nCheck the first-aid kit is stocked and first aiders are named\nCheck floors and walkways are clear, dry and free of clutter\nCheck doors, windows and the cash and records cupboards are locked\nCheck chairs and screens are adjusted and equipment is working and serviced\nReport faults and record any accidents or near misses in the log",
  "required": false
}
```

Next lesson: your office administration toolkit.
