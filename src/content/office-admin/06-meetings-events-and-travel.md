---
title: Meetings, Events and Travel
minutes: 25
summary: Plan and run meetings, write agendas and minutes, organise events and book travel and accommodation.
---

## Planning and running meetings

Meetings are expensive: if ten people spend an hour, that is ten hours of work. Make every meeting **worth it.**

**Before the meeting:**

1. **Decide whether a meeting is needed.** An email or a call may do.
2. **Define the purpose:** to decide, to inform, to solve a problem, to plan. Write the desired outcome.
3. **Invite only the people needed,** and tell them why.
4. **Choose the time and place:** check diaries, avoid clashes and book a suitable room or online link. Allow time to arrive and set up.
5. **Send the agenda and papers in advance,** at least a day before for routine meetings and longer for big ones.
6. **Prepare the room:** seating, name cards if needed, projector, water, refreshments, notepads, copies of papers, and a sign on the door.
7. **Test technology** for online or hybrid meetings: link, camera, sound, screen sharing.

**During the meeting:**

- **Start on time,** welcome people, record attendance and apologies.
- **Follow the agenda;** the chair keeps discussion focused and fair.
- **Note decisions and actions** (what, who, by when).
- **Keep to time,** and summarise before moving on.
- **End on time** with a summary of decisions and actions, and the next meeting date.

**After the meeting:**

- **Send the minutes** within one or two days.
- **Follow up on actions** and remind owners before the deadlines.
- **Tidy the room** and return equipment.
- **Record costs** if needed.

**Online meetings:** send the link early, join a few minutes before, mute when not speaking, keep cameras on if the culture expects it, and manage who speaks. Record only with permission.

## Agendas and minutes

**An agenda** is the plan for the meeting. A good one includes:

- Title, date, time, place or link.
- Purpose or objective.
- **Items in a logical order,** with a lead person and a time for each.
- Apologies and minutes of the last meeting (in regular meetings).
- Any other business (AOB).
- Date of the next meeting.

Example for a one-hour team meeting:

| Time | Item | Lead |
| :-- | :-- | :-- |
| 10:00 | Welcome, apologies, last minutes | Chair |
| 10:05 | Progress on office move | Tunde |
| 10:25 | Budget for new equipment (decision) | Ada |
| 10:45 | Any other business | All |
| 10:55 | Summary of actions and next meeting | Chair |

**Minutes** record what was decided and who will do what. Take notes during the meeting, then write them up clearly. Include: the meeting title, date, time and place; who attended and who sent apologies; a short summary of each item with the **decision;** a list of **actions** with the owner and deadline; and the date of the next meeting. Use neutral language, past tense, and keep them short. Have the chair check the draft before circulating, and keep them in the right file.

## Organising events

Events include staff meetings, training days, conferences, client dinners, product launches, open days and celebrations. Treat them as small **projects.**

**Plan:**

1. **Purpose and audience:** why are we holding it, and who is coming?
2. **Date and time:** check for clashes with holidays, religious observances, exams or other key dates.
3. **Budget:** list all costs, get quotations and add a contingency of about 10%.
4. **Venue:** size, location, access, parking, facilities, cost, power backup and safety.
5. **Programme:** timings, speakers, activities.
6. **Catering and equipment:** food, drinks (including dietary and religious needs), sound, projector, chairs, decorations.
7. **Invitations and registration:** send early, track responses, send reminders.
8. **Roles:** who does what on the day (reception, speakers, technical, catering, photos).
9. **Safety and security:** emergency exits, first aid, security staff.
10. **Checklist and timeline:** work backwards from the event date.

**Example budget:** an event for **50 guests.** Catering at ₦8,000 a head = ₦400,000. Venue hire ₦150,000. Sound and projector ₦60,000. Decorations and printing ₦40,000. Subtotal = ₦650,000. Contingency at 10% = ₦65,000. **Total = ₦715,000,** so the cost per guest = 715,000 ÷ 50 = **₦14,300.**

**On the day:** arrive early, check everything, brief the team, greet guests, keep to the programme, handle problems calmly and record attendance.

**After:** thank guests and speakers, collect feedback, settle suppliers promptly, compare actual costs with the budget and note lessons.

## Booking travel and accommodation

Administrators often arrange business trips. Do it carefully, since mistakes cost money and embarrass people.

**Start with the facts:** who is travelling (full names as on their ID or passport), where, dates and times, purpose, budget, preferences (airline, seat, hotel area), special needs, and approvals.

**Transport:**

- **Compare options and prices** across airlines, bus, rail or car hire; allow for airport transfers and travel time.
- **Check requirements:** passport validity, visas, health requirements, travel advice and insurance for international trips.
- **Book early** for better prices, and check change and cancellation rules.
- **Allow time:** do not schedule meetings too tightly after arrival.
- **Send the itinerary:** flight details, booking references, hotel address, phone numbers, transport and meeting schedule.

**Accommodation:**

- **Location** near the meeting venue, **safety,** facilities (Wi-Fi, breakfast, power backup), price and reviews.
- **Confirm in writing** the dates, room type, payment and cancellation terms.

**Costs and expenses:** prepare a trip budget. Example: for **2 people,** return flights ₦120,000 each = ₦240,000; hotel **3 nights** at ₦45,000 each person per night = 3 × 45,000 × 2 = ₦270,000; daily allowance ₦20,000 for 3 days each = 3 × 20,000 × 2 = ₦120,000. **Total = ₦630,000.** Keep receipts and complete the expense claim promptly.

**Safety and care:** share emergency contacts, check local conditions, keep copies of documents, and have a plan for delays or cancellations. After the trip, collect the receipts, reconcile costs and file the records.

## Try it

```task
{
  "id": "poa-m06-t1",
  "prompt": "Write an **agenda for a one-hour team meeting** with at least five items, each with a time and a lead, plus the purpose at the top and the next meeting date at the end.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "Purpose: ...\n10:00 - ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "States the purpose", "pattern": "purpose|objective" },
    { "label": "Times for items", "pattern": "\\d{1,2}[:.]\\d{2}", "min": 5 },
    { "label": "Leads named", "pattern": "lead|chair|led by|\\(\\w+\\)", "min": 4 },
    { "label": "Includes any other business", "pattern": "any other business|aob" },
    { "label": "Next meeting", "pattern": "next meeting" }
  ],
  "sample": "Purpose: agree the office move plan and the equipment budget\n10:00 - Welcome, apologies and last minutes - Chair\n10:05 - Progress on the office move - Tunde\n10:25 - Budget for new equipment (decision) - Ada\n10:45 - Any other business (AOB) - All\n10:55 - Summary of actions - Chair\nNext meeting: Tuesday 2 April, 10 am",
  "required": true
}
```

```task
{
  "id": "poa-m06-t2",
  "prompt": "Plan the **budget for an event for 50 guests**: catering ₦8,000 a head, venue ₦150,000, sound and projector ₦60,000, decorations and printing ₦40,000, and a **10% contingency**. Work out each cost, the subtotal, the contingency, the total and the cost per guest.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "Catering = ...",
  "rules": [
    { "label": "Catering ₦400,000", "pattern": "400,?000" },
    { "label": "Subtotal ₦650,000", "pattern": "650,?000" },
    { "label": "Contingency ₦65,000", "pattern": "65,?000" },
    { "label": "Total ₦715,000", "pattern": "715,?000" },
    { "label": "Cost per guest ₦14,300", "pattern": "14,?300" }
  ],
  "sample": "Catering = 50 x 8,000 = ₦400,000.\nSubtotal = 400,000 + 150,000 + 60,000 + 40,000 = ₦650,000.\nContingency at 10% = ₦65,000.\nTotal = 650,000 + 65,000 = ₦715,000.\nCost per guest = 715,000 / 50 = ₦14,300.",
  "required": true
}
```

```task
{
  "id": "poa-m06-t3",
  "prompt": "Prepare a **trip budget** for **2 people**: return flights ₦120,000 each, **3 nights** at ₦45,000 per person per night, and a daily allowance of ₦20,000 per person for **3 days**. Work out each cost and the total, and list **five details** you must check before booking.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "Flights = ...",
  "rules": [
    { "label": "Flights ₦240,000", "pattern": "240,?000" },
    { "label": "Hotel ₦270,000", "pattern": "270,?000" },
    { "label": "Allowance ₦120,000", "pattern": "120,?000" },
    { "label": "Total ₦630,000", "pattern": "630,?000" },
    { "label": "Checks (names as on ID, passport, dates, cancellation, approval, visa)", "pattern": "name|passport|id|visa|dates|cancellation|approval|budget|insurance", "min": 4 }
  ],
  "sample": "Flights = 2 x 120,000 = ₦240,000. Hotel = 3 nights x 45,000 x 2 people = ₦270,000. Allowance = 3 days x 20,000 x 2 = ₦120,000.\nTotal = 240,000 + 270,000 + 120,000 = ₦630,000.\nBefore booking I check: the travellers' full names as on their ID or passport, passport validity and any visa, the exact dates and times, the cancellation and change rules, and the approval and budget.",
  "required": false
}
```

Next lesson: office management and supplies.
