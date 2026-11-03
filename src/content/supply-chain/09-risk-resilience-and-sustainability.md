---
title: Risk, Resilience and Sustainability
minutes: 25
summary: Identify types of supply chain risk, plan contingencies and backups, weigh resilience against cost and build more sustainable chains.
---

## Types of supply chain risk

Supply chains are long and connected, so a problem in one link can spread. Recent years showed this clearly: pandemics, port congestion, conflict, currency shocks and fuel price spikes. Risks fall into groups:

| Group | Examples |
| :-- | :-- |
| **Supply** | Supplier failure, shortages, quality problems, late deliveries |
| **Demand** | Sudden drops or surges, forecast errors, a lost major customer |
| **Process / operations** | Breakdowns, strikes, errors, stockouts, fire, IT failure |
| **Transport / logistics** | Accidents, delays, theft, port or road closures |
| **External** | Floods, politics, regulation changes, exchange rate and fuel price moves |
| **Financial** | Supplier or customer insolvency, late payment |
| **Cyber and information** | System attacks, data loss |
| **Reputation and compliance** | Unethical suppliers, safety or environmental violations |

**Assessing risk** means asking for each: how **likely** is it, and how **bad** would it be? Multiply the two (for example 1 to 5 each) and focus on the highest scores. Another way is **expected loss**: probability × impact. If there is a 5% chance in a year of losing a key supplier, and the loss would cost ₦40,000,000, the expected loss is 0.05 × 40,000,000 = **₦2,000,000.**

## Contingency and backup plans

Once you know the major risks, decide how to respond:

- **Avoid:** do not do the risky thing (stop using a high-risk supplier).
- **Reduce:** lower the chance or impact (preventive maintenance, quality checks, safety stock).
- **Transfer:** share the risk (insurance, contract terms).
- **Accept:** if the cost of action is more than the likely loss.

A **contingency plan** is written in advance: *if X happens, we do Y*. A good one states the trigger, the actions, who does what, who to contact and how to communicate. Examples:

- **A key supplier fails:** switch to the pre-qualified backup, release safety stock, tell customers.
- **A port is closed:** reroute through another port, or switch to air for urgent items.
- **A warehouse fire:** use a second site or a 3PL, and recover records from backup.

Practise and update the plans, since an untested plan often fails.

## Resilience versus cost

**Resilience** is the ability to keep going and recover quickly when something goes wrong. It costs money: backup suppliers, extra stock, spare capacity, flexible transport and better information. **Lean** chains, which hold little stock and rely on few suppliers, are cheap in calm times and fragile in a crisis.

Decide how much resilience to buy by comparing cost with expected loss.

Example: you buy 30% of a ₦100,000,000 spend from a second supplier that charges a 10% premium. The extra cost is 0.10 × 30,000,000 = **₦3,000,000** a year. If that backup removes the chance of a loss with an expected value of ₦2,000,000 a year, the premium is not worth it on that number alone. If the loss would also lose customers, damage reputation or stop the business, the true impact is higher and the backup may well be justified. Use judgement as well as arithmetic, and protect the **critical** items first.

Cheaper ways to build resilience include pre-qualifying a backup without buying much from it, holding stock only of critical parts, cross-training staff, and sharing information with partners.

## Sustainable supply chains

Customers, regulators and investors increasingly expect supply chains to be **sustainable**: to reduce harm to the environment and people.

Main areas:

- **Emissions and energy:** transport is a large share of a supply chain's carbon footprint. Fuller loads, shorter routes, less air freight, efficient vehicles and better warehouse energy use all help.
- **Waste and packaging:** reduce, reuse and recycle. Right-size packaging and avoid overproduction.
- **Responsible sourcing:** fair labour, safe working conditions, no child or forced labour, and responsible materials.
- **Circular practices:** repair, refurbish, recycle and take back products at end of life.
- **Local and inclusive sourcing:** where it makes sense for cost and quality.

A rough way to estimate transport emissions is **tonne-km × an emission factor**. For illustration, using 0.1 kg of CO₂ per tonne-km (real factors vary by vehicle and fuel): moving 20 tonnes over 500 km is 10,000 tonne-km, so about **1,000 kg of CO₂**. If a fuller truck or better routing cuts the distance by 10%, the saving is about 100 kg for that trip.

Sustainability and cost often align: less waste and less fuel mean lower cost. Measure it, set targets and report honestly.

## Try it

```task
{
  "id": "scm-m09-t1",
  "prompt": "There is a **5% chance** a year of losing a key supplier, and the loss would cost **₦40,000,000**. A backup supplier would cost an extra **₦1,500,000** a year. Work out the **expected loss** and say whether the backup is worth buying, mentioning one non-financial factor.",
  "minutes": 10,
  "rows": 6,
  "placeholder": "Expected loss = ...",
  "rules": [
    { "label": "Expected loss of ₦2,000,000", "pattern": "2,?000,?000" },
    { "label": "Compares with the ₦1,500,000 cost", "pattern": "1,?500,?000" },
    { "label": "Concludes the backup is worth it (expected loss is higher than cost)", "pattern": "worth|justif|cheaper than|less than|yes|buy|reasonable" },
    { "label": "Mentions a non-financial factor (customers, reputation, continuity)", "pattern": "customers?|reputation|continuity|trust|production|stop" }
  ],
  "sample": "Expected loss = 0.05 x 40,000,000 = ₦2,000,000 a year.\nThe backup costs ₦1,500,000, which is less than the expected loss, so it is worth buying. Besides the money, losing the key supplier could stop production and damage customer trust, which makes the case stronger.",
  "required": true
}
```

```task
{
  "id": "scm-m09-t2",
  "prompt": "Write a **contingency plan** for this event: *\"Our main supplier of packaging cannot deliver for three weeks.\"* Give at least six lines: the trigger, who is told, immediate actions, the backup, how customers are updated and how you recover.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Trigger: ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "Names the trigger", "pattern": "trigger|if |when " },
    { "label": "Names who is told or who is responsible", "pattern": "tell|inform|notify|responsible|owner|manager|planner|team" },
    { "label": "Uses safety stock or a backup supplier", "pattern": "safety stock|backup|second supplier|alternative|other supplier" },
    { "label": "Updates customers", "pattern": "customer" },
    { "label": "Covers recovery or review", "pattern": "recover|review|restore|return|lesson|update the plan" }
  ],
  "sample": "Trigger: the supplier tells us it cannot deliver for three weeks, or a delivery is more than 5 days late.\nWho is told: the purchasing manager, production planner and sales manager the same day.\nImmediate actions: check how many days of packaging we hold and reduce non-urgent production.\nBackup: order from the pre-qualified second supplier and release safety stock.\nCustomers: sales tells affected customers about any change in delivery dates.\nRecovery: when the main supplier recovers, rebuild safety stock and review whether to keep a share with the backup.",
  "required": true
}
```

```task
{
  "id": "scm-m09-t3",
  "prompt": "A truck carries **20 tonnes over 500 km**. Using an illustrative factor of **0.1 kg CO₂ per tonne-km**, work out the emissions. Then suggest **two ways** to cut them.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Tonne-km = ...",
  "rules": [
    { "label": "10,000 tonne-km", "pattern": "10,?000" },
    { "label": "Emissions of 1,000 kg", "pattern": "1,?000\\s?kg|1 tonne|1,?000" },
    { "label": "Suggests two ways (fuller loads, shorter routes, rail, less air freight, efficient vehicles)", "pattern": "fuller|load|route|rail|air freight|efficien|consolidat|shorter|fuel" }
  ],
  "sample": "Tonne-km = 20 x 500 = 10,000. Emissions = 10,000 x 0.1 = 1,000 kg of CO2.\nI would cut them by filling trucks fully and consolidating loads, and by planning shorter routes with fewer empty return trips.",
  "required": false
}
```

Next lesson: measuring supply chain performance.
