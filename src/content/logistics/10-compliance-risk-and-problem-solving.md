---
title: Compliance, Risk and Problem Solving
minutes: 25
summary: Understand the regulations a logistics business must follow, handle delays, damage and disputes, manage risk with a simple scoring method and deliver good customer service when things go wrong.
---

> [!NOTE]
> Regulations change. This lesson teaches how to think about compliance. **Always check the current requirements with the relevant authority or a qualified adviser.**

## Regulations and compliance

Logistics is regulated because it moves goods across borders and through public spaces. Common areas:

- **Customs and trade rules:** declarations, classification, valuation, prohibited and restricted goods, licences and permits.
- **Product regulation:** food, drug, standards and safety rules (for example NAFDAC and SON in Nigeria).
- **Dangerous goods rules:** classification, packaging, labelling and documentation.
- **Transport rules:** vehicle roadworthiness, driver licences, axle loads, hours and permits.
- **Maritime and aviation rules:** carrier and port requirements, security screening.
- **Business and tax:** company registration, tax returns, employment law, insurance.
- **Safety and security:** safe handling, fire safety, protection from theft and illegal goods.
- **Anti-corruption and sanctions:** not paying bribes, and not dealing with banned parties or countries.

Non-compliance brings fines, seized cargo, delays, lost licences and a damaged reputation. A forwarder's best protection is **systems**: written procedures, trained staff, checklists, correct documents and records. Never take a shortcut because a customer is in a hurry.

## Delays, damage and disputes

Problems are normal in logistics. What matters is how you handle them.

**Common problems:**
- **Delays** from congestion, weather, documents, inspection or a missed connection.
- **Damage or loss** of cargo.
- **Shortages** or wrong goods.
- **Documentation errors** and customs holds.
- **Disputes** over price, liability or who is at fault.

**A sound response:**
1. **Find the facts quickly:** what happened, where, when and what the paperwork shows.
2. **Protect the cargo** and limit further loss.
3. **Tell the customer early,** with what you know, what you are doing and when you will update them.
4. **Act on the options:** re-route, re-book, repair, replace, claim.
5. **Check the contract and insurance** to see who is responsible and what is covered.
6. **Document everything:** photographs, dates, messages and receipts.
7. **Resolve the dispute** fairly through discussion; escalate to formal channels only if needed.
8. **Learn:** record the cause and change the process so it is less likely to happen again.

## Risk management

**Risk** is the chance that something goes wrong multiplied by how bad it would be. A simple way to manage it is a **risk register**:

1. **List** the risks to a shipment or operation.
2. **Score each for likelihood and impact,** for example from 1 (low) to 5 (high).
3. **Multiply** the two to get a risk score (1 to 25).
4. **Prioritise** the highest scores.
5. **Decide the response:** avoid, reduce, transfer (for example, insurance) or accept.
6. **Assign an owner** and review regularly.

Example: *Customs delay*: likelihood 4, impact 3, score **12**. *Cargo theft*: likelihood 2, impact 5, score **10**. *Wrong document*: likelihood 3, impact 4, score **12**. Customs delay and the wrong document are the top priorities, and the responses are early document checks and an experienced agent.

Typical logistics risks: delays, damage, theft, compliance failure, supplier or carrier failure, currency movement, fuel price rises, cyber attacks on systems, and safety incidents. Put controls and backup plans in place for the biggest.

## Customer service in logistics

When goods are late or damaged, your service decides whether the customer stays. A good response:

- **Acknowledges** the problem without blame or excuses.
- **Takes ownership:** "I will find out and come back to you by 3 pm."
- **Explains clearly** what happened, in plain language.
- **Offers a solution** and a realistic date.
- **Follows through** and confirms the outcome.
- **Apologises sincerely** when you are at fault, and fixes the cause.

Keep calm and polite, even with an angry customer. People remember how you handled the problem more than the problem itself.

## Try it

```task
{
  "id": "lff-m10-t1",
  "prompt": "Score these risks for a sea shipment using **likelihood × impact** (1 to 5 each): (a) customs delay, likelihood 4, impact 3; (b) cargo theft, likelihood 2, impact 5; (c) wrong document, likelihood 3, impact 4. Give each **risk score**, say which are the top priorities and suggest one response for each of the top two.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "(a) 4 x 3 = ...",
  "rules": [
    { "label": "Score of 12 for customs delay", "pattern": "4\\s?[x×*]\\s?3\\s?=\\s?12|customs[^.]*12" },
    { "label": "Score of 10 for theft", "pattern": "2\\s?[x×*]\\s?5\\s?=\\s?10|theft[^.]*10" },
    { "label": "Score of 12 for the wrong document", "pattern": "3\\s?[x×*]\\s?4\\s?=\\s?12|document[^.]*12" },
    { "label": "Names the top priorities (customs delay and wrong document)", "pattern": "top|priorit|highest" },
    { "label": "Gives a response (check documents, experienced agent, early clearance)", "pattern": "check|agent|early|prepare|verify|review|insur" }
  ],
  "sample": "(a) Customs delay: 4 x 3 = 12.\n(b) Cargo theft: 2 x 5 = 10.\n(c) Wrong document: 3 x 4 = 12.\nThe top priorities are the customs delay and the wrong document, both scoring 12. For the customs delay I would prepare clearance early with an experienced agent, and for the wrong document I would check every document against the others before the vessel sails.",
  "required": true
}
```

```task
{
  "id": "lff-m10-t2",
  "prompt": "A customer's container is held by customs for two extra days because of a **document error** on your side. Write your **message to the customer** (60 to 120 words): acknowledge the problem, own it, say what you are doing, give the next update time and apologise.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Dear ...,",
  "rules": [
    { "label": "Acknowledges the problem", "pattern": "held|delay|error|mistake|problem" },
    { "label": "Takes ownership", "pattern": "our (error|mistake|side)|we made|i made|responsib|my mistake|we are at fault" },
    { "label": "Says what is being done", "pattern": "correct|amend|resubmit|fix|working|clear|arrange" },
    { "label": "Gives the next update time", "pattern": "by \\d|today|tomorrow|update you|will (call|message|update)|within" },
    { "label": "Apologises", "pattern": "sorry|apolog|regret" },
    { "label": "Between 60 and 120 words", "minWords": 60, "maxWords": 125 }
  ],
  "sample": "Dear Mr Eze, I am sorry to tell you that your container is being held at customs for two more days because of an error in a document we prepared. This was our mistake and we take full responsibility. We have corrected the document, resubmitted it today and our agent is following it up with customs in person. I will update you by 4 pm today and again as soon as the container is released. I sincerely apologise for the delay and the inconvenience, and I will check every document twice from now on.",
  "required": true
}
```

```task
{
  "id": "lff-m10-t3",
  "prompt": "List **five compliance habits** a forwarding company should build into everyday work. One per line, each with a short reason.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Check documents ... because ...",
  "rules": [
    { "label": "Five lines", "minLines": 5 },
    { "label": "Mentions checking documents or classification", "pattern": "document|classif|hs code|declar" },
    { "label": "Mentions training or procedures", "pattern": "train|procedure|checklist|written|policy" },
    { "label": "Mentions keeping records", "pattern": "record|file|copy|audit" },
    { "label": "Mentions refusing bribes or false declarations", "pattern": "brib|false|truthful|honest|corrupt|never" }
  ],
  "sample": "Check every document and the HS code against the goods before shipment, because errors cause delays and fines.\nTrain staff on current customs and dangerous goods rules, because the rules change.\nUse written procedures and checklists, so no step is missed when we are busy.\nKeep full records of every shipment, because they protect us in a dispute or audit.\nNever pay bribes or make false declarations, because they risk prosecution and our licence.",
  "required": false
}
```

Next lesson: building a forwarding business.
