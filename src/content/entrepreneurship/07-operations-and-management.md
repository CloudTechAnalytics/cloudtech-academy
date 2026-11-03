---
title: Operations and Management
minutes: 25
summary: Turn an offer into a repeatable process, manage suppliers and quality, handle inventory and delivery, use tools that save time and keep simple systems and records.
---

## A repeatable process

At the start you do everything by hand and by memory. To grow, the work must become **repeatable**: done the same way, to the same standard, by you or by someone else.

**Map your process** from the customer's order to the money in your account. Write each step, who does it and how long it takes. Example for a lunch delivery business:

1. Customer orders by WhatsApp (by 10 am).
2. Order is recorded in the order sheet.
3. Ingredients are bought or checked.
4. Meals are cooked and packed (11:00 to 12:00).
5. Rider delivers (12:00 to 12:45).
6. Payment is confirmed and recorded.
7. Customer receives a follow-up message.

Then write a short **standard operating procedure (SOP)** for each important step: what to do, in what order, to what standard. A checklist is enough. SOPs reduce mistakes, make training quick and let the business run when you are not there.

**Capacity** matters. If one person can cook 20 meals an hour and you need 60 meals in two hours, you can just meet demand. At 30 meals an hour of demand over two hours (60) you cannot with one cook, so you would need a second person or longer cooking time. Check your capacity against orders before you promise delivery times.

## Suppliers and quality

Your suppliers are part of your business. A late or poor supplier makes you late and poor.

- **Choose suppliers** on quality, price, reliability, payment terms and how they treat you. Visit them if you can.
- **Keep two options** for important items so you are not stuck.
- **Agree the specification and the price** in writing, with delivery times.
- **Check every delivery** for quantity and quality before you pay.
- **Build relationships:** pay on time, give clear forecasts, give feedback. Good suppliers prioritise good customers.

**Quality** means doing what you promised, consistently. Set simple standards (size, taste, finish, timing), **check against them** before the product reaches the customer, record problems and fix the cause. Ask customers for feedback.

## Inventory and delivery

If you keep stock, money sits on your shelf, so manage it:

- **Know what you have.** Count regularly and record what comes in and goes out.
- **Order based on sales,** not guesswork. Keep a small buffer for your best sellers.
- **Use older stock first,** especially food and anything that spoils.
- **Avoid over-buying** for a discount if you cannot sell it.
- **Store safely:** dry, clean, secure.

For **delivery**: promise realistic times, pack so goods arrive in good condition, give customers a way to track or contact you, and measure on-time delivery. Plan routes to group nearby orders and keep delivery costs under control. Decide whether you do it yourself, use your own rider or use a courier.

## Tools that save time

You do not need expensive software. Useful, cheap tools:

- **WhatsApp Business:** catalogue, quick replies, labels, order messages.
- **A spreadsheet or Google Sheets:** orders, stock, sales, expenses.
- **A simple accounting or invoicing app:** invoices, receipts and reports.
- **Payment tools:** bank transfers, payment links and POS, with a clear way of confirming payments.
- **A calendar and task list:** deadlines and reminders.
- **Cloud storage:** to keep documents safe and shareable.

Pick a few, use them consistently, and **write down where things are kept**. A tool nobody uses is a waste.

## Systems and record keeping

Records are how you know whether you are making money, and they are required for tax and for loans. At minimum, keep:

- **Sales record:** date, customer, item, quantity, price, payment method.
- **Expense record:** date, item, amount, supplier, receipt kept.
- **Stock record:** items in, items out, balance.
- **Customer list** with contacts and order history (respecting privacy).
- **Banking record:** all business money through a business account.
- **Invoices and receipts** issued and received, filed by date.

Update records **daily** or at least weekly, never leave them for the end of the year. Back up digital records. A basic weekly review of sales, expenses and cash tells you almost everything you need to run a small business well.

## Try it

```task
{
  "id": "ent-m07-t1",
  "prompt": "Map your process from order to payment. Write **at least six steps** in order, one per line, with who does each and roughly how long it takes.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "1. Customer orders by WhatsApp by 10 am - me - 2 minutes",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "Starts with an order or enquiry", "pattern": "order|enquir|request" },
    { "label": "Includes making or preparing", "pattern": "make|cook|prepare|produce|pack|assemble|buy" },
    { "label": "Includes delivery or handover", "pattern": "deliver|hand|collect|dispatch|send" },
    { "label": "Includes payment", "pattern": "pay|invoice|receipt|confirm" },
    { "label": "Gives who and time on lines", "pattern": "\\d+\\s*(min|hour|hr|day|am|pm)|by \\d", "min": 4 }
  ],
  "sample": "1. Customer orders by WhatsApp by 10 am - me - 2 minutes\n2. Record the order in the order sheet - me - 1 minute\n3. Check ingredients and buy what is missing - me - 30 minutes\n4. Cook and pack the meals - two cooks - 11:00 to 12:00\n5. Deliver to the offices - rider - 12:00 to 12:45\n6. Confirm payment and record it - me - 5 minutes\n7. Send a follow-up message - me - 2 minutes",
  "required": true
}
```

```task
{
  "id": "ent-m07-t2",
  "prompt": "One person makes **20 items a day** and you receive **30 orders a day**. Work out the **shortfall** and give **three options** to solve it, with one drawback for each.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Shortfall = ...",
  "rules": [
    { "label": "Shortfall of 10 items a day", "pattern": "\\b10\\b" },
    { "label": "Option to hire or add a person", "pattern": "hire|add|second|another (person|worker|cook)|help|employ" },
    { "label": "Option about time, equipment or limiting orders", "pattern": "overtime|longer|equipment|machine|limit|cap|waiting list|raise (the )?price|outsourc|batch" },
    { "label": "Mentions drawbacks", "pattern": "drawback|cost|but|however|risk|expens|tired|quality|lose" }
  ],
  "sample": "Shortfall = 30 - 20 = 10 items a day.\nOption 1: hire a second person - drawback: extra wages before sales grow.\nOption 2: work longer hours or batch the work - drawback: tiredness and a risk of lower quality.\nOption 3: limit orders or raise the price slightly to reduce demand - drawback: some customers may go elsewhere.",
  "required": true
}
```

```task
{
  "id": "ent-m07-t3",
  "prompt": "Design your **record-keeping system**. List the records you will keep, how often you update each and the tool you will use. At least five lines.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Sales record - daily - spreadsheet",
  "rules": [
    { "label": "At least five lines", "minLines": 5 },
    { "label": "Includes sales and expenses", "pattern": "sales[\\s\\S]*expense|expense[\\s\\S]*sales" },
    { "label": "Includes stock or inventory", "pattern": "stock|inventory" },
    { "label": "States how often (daily, weekly)", "pattern": "daily|weekly|every|monthly" },
    { "label": "Names a tool (spreadsheet, app, notebook, WhatsApp)", "pattern": "spreadsheet|app|notebook|sheets|excel|whatsapp|software|bank" }
  ],
  "sample": "Sales record - updated daily - Google Sheet\nExpense record with receipts - updated daily - Google Sheet and a receipt folder\nStock record - updated weekly after a count - spreadsheet\nCustomer list and order history - updated after each order - WhatsApp Business labels and a sheet\nBank record - checked weekly - business bank app\nWeekly review of sales, expenses and cash - every Sunday evening",
  "required": false
}
```

Next lesson: money, pricing, budgeting and funding.
