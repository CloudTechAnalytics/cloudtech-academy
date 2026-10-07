---
title: Supplier Verification
minutes: 25
summary: Spot scams and unreliable suppliers, check company details and certificates, use safe payment methods, understand factory audits and inspections, and apply a red flags checklist.
---

## Why verification matters

International supplier fraud is common, and most victims are first-time buyers sending money to a stranger. The pattern is usually the same: a convincing page, a low price, pressure to pay quickly by a method you cannot reverse, then silence. A day spent verifying costs nothing compared with a lost order.

Verification means proving **three things** before you pay anything meaningful:

1. **The company exists** and is what it says it is.
2. **It can make or supply** the product at the quality you need.
3. **It has a record** of delivering, ideally to buyers like you.

## Common scams

- **The fake supplier.** A page or website copied from a real factory, with a different bank account.
- **The changed bank details.** After weeks of normal emails, the "accountant" sends a new account number. The email has been hijacked.
- **The bait price.** A price far below every other supplier, "limited time", with payment required in full first.
- **The sample trap.** A good sample, followed by poor bulk goods that do not match.
- **The trader pretending to be a factory.** Not illegal, but you pay a margin and have no control of production.
- **The empty shipment.** A real shipment with the wrong goods, or a forged bill of lading.
- **The forged documents.** Fake business licences, test reports and certificates.

## Checking company details

Ask for, and check, these:

- **A business licence.** In China this carries a unified social credit code you can check against official listings or through a verification service. Ask for a clear copy and compare the company name, address and registered scope with the website and invoice.
- **A company website and email on its own domain.** A free email address (such as Gmail) for a large "factory" is a warning, not proof of fraud.
- **A phone number and a video call.** Ask to see the factory floor, the stock and the production line live, not on a recorded clip. A real supplier will accept this.
- **Platform status.** On Alibaba look for verified supplier status and years of trading, and check the reviews and transaction record, remembering that a badge is a start, not proof.
- **Name matches everywhere.** The account holder on the bank details must match the company on the licence and the invoice.
- **Certificates.** Ask for relevant quality certificates (for example CE for electronics, ISO 9001 for the factory), and where possible check them with the issuing body rather than trusting a PDF.
- **References.** Ask for the contact of a buyer in a similar market, or search for reviews of the company by name.
- **A reverse image search.** Search the supplier's photos. If they appear on other companies' pages, they are stolen.

## Safe payment methods

How you pay is your biggest protection.

| Method | Protection | Notes |
| :-- | :-- | :-- |
| **Alibaba Trade Assurance** | The platform holds protection against non-delivery or goods not matching the agreed terms | Only covers orders paid through the platform and agreed on the order page. Keep all talk on the platform. |
| **Escrow services** | A third party holds the money until you confirm | Use known services, never one the supplier invents |
| **Bank transfer (T/T)** | None once sent | The usual method. Pay a deposit (often 30%) and the balance after inspection or on documents. |
| **Letter of credit** | Strong; the bank pays only when the documents match | Costly and slower, suited to large orders |
| **Payment to a person's personal account** | None | A red flag for a company |
| **Gift cards, crypto or cash to an agent** | None | Do not |

Never pay the full amount first to a supplier you have not verified. Pay the deposit to the **company** account named on the invoice, and confirm any bank detail change by phone using a number you already trust.

## Factory audits and inspections

For larger orders, hire an independent **inspection company** (such as SGS, Bureau Veritas or Intertek, or a local inspection service) to visit the factory. There are two common services:

- **Factory audit.** Checks the factory's size, staff, machines, quality systems and capacity.
- **Pre-shipment inspection.** An inspector checks a sample of the finished goods against your specification **before** you pay the balance and before shipping. They report quantity, quality, packing and labelling, often with photos.

For a small first order you may skip the audit, but a pre-shipment check or even a friend in the supplier's city who can look is cheap protection.

## The red flags checklist

Stop and look harder if you see **any** of these:

- The price is far below everyone else's.
- They push you to pay quickly or in full, or to leave the platform.
- They refuse a live video call or a sample.
- The bank account is personal, or in a country or name that does not match.
- The business licence is blurred, missing, or the name does not match.
- The contact details keep changing, or the replies are vague and copy-pasted.
- Photos look stolen or too perfect.
- They say they have "no MOQ" for everything and a "special price just for you".

## Try it

```task
{
  "id": "iemi-m04-t1",
  "prompt": "Write a **verification checklist** of at least seven things you will check about a supplier before paying a deposit. One check per line, each beginning with a verb (for example \"Ask for ...\", \"Check ...\").",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Ask for the business licence ...\nCheck ...",
  "rules": [
    { "label": "At least seven checks", "minLines": 7 },
    { "label": "Mentions the business licence or registration", "pattern": "licen[cs]e|registration|registered" },
    { "label": "Mentions a video call or factory visit", "pattern": "video|call|visit|live" },
    { "label": "Mentions the bank account name matching", "pattern": "bank|account" },
    { "label": "Mentions samples or certificates or reviews", "pattern": "sample|certificate|review|reference" },
    { "label": "Mentions a safe payment method", "pattern": "trade assurance|escrow|letter of credit|deposit|protected" }
  ],
  "sample": "Ask for a copy of the business licence and compare its name and address with the website.\nCheck that the bank account name matches the company on the licence and invoice.\nRequest a live video call and ask them to show the factory floor.\nCheck the supplier's years on the platform, reviews and transaction history.\nAsk for quality certificates and check them with the issuing body.\nOrder a sample before any bulk order.\nPay only a deposit through Trade Assurance or another protected method, never the full amount first.\nRun a reverse image search on the supplier's photos.",
  "required": true
}
```

```task
{
  "id": "iemi-m04-t2",
  "prompt": "A supplier you have emailed for weeks suddenly sends new bank details and asks you to pay the $3,000 balance there \"because the old account has a problem\". In 40 to 100 words, say what you will do before paying.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Before I pay ...",
  "rules": [
    { "label": "Says to verify by phone or another trusted channel", "pattern": "phone|call|video|verify|confirm" },
    { "label": "Refers to a trusted or known contact (not just the email)", "pattern": "known|trusted|already|original|previous|official|other channel|platform" },
    { "label": "Does not pay straight away", "pattern": "not pay|won't pay|will not|hold|before (i )?pay|wait|do not pay|don't pay" },
    { "label": "Mentions that the email may be hacked or a scam", "pattern": "hack|scam|fraud|fake|compromis" },
    { "label": "Between 40 and 100 words", "minWords": 40, "maxWords": 105 }
  ],
  "sample": "I will not pay yet. A sudden change of bank details is a classic sign that the supplier's email has been hacked or that someone is committing fraud. I will phone the supplier on the number from their official business profile, not the one in the email, and confirm in a video call that the account is really theirs. I will also check that the account name matches the company on the licence and invoice. If they cannot confirm clearly, I will keep paying only to the original account.",
  "required": true
}
```

```task
{
  "id": "iemi-m04-t3",
  "prompt": "Explain in 30 to 80 words the difference between a **factory audit** and a **pre-shipment inspection**, and when you would pay for each.",
  "minutes": 6,
  "rows": 5,
  "placeholder": "A factory audit ...",
  "rules": [
    { "label": "Explains a factory audit (capacity, systems, the factory itself)", "pattern": "audit[^.]*(factory|capacity|systems?|machines|staff|quality)" },
    { "label": "Explains a pre-shipment inspection (finished goods, before shipping or balance)", "pattern": "(pre-?shipment|inspection)[^.]*(finished|goods|before|balance|quantity|sample)" },
    { "label": "Says when to use them", "pattern": "when|larger|big|before (i )?pay|before ship|new supplier" },
    { "label": "Between 30 and 80 words", "minWords": 30, "maxWords": 85 }
  ],
  "sample": "A factory audit checks the factory itself: its size, staff, machines, capacity and quality systems. I would pay for one before a large order with a new supplier. A pre-shipment inspection checks the finished goods against my specification, including quantity, quality and packing, before I pay the balance and before shipping. I would use it on almost every sizeable order.",
  "required": false
}
```

Next lesson: negotiating, MOQ, samples and writing a purchase order.
