---
title: Find Opportunities (Including Remote)
minutes: 25
handsOn: 6
summary: Find internships through job boards, LinkedIn, direct approaches and your network, find remote roles, and spot fake offers before they cost you.
---

## Where to look

| Source | How to use it |
| :-- | :-- |
| **LinkedIn Jobs** | Search "intern", "internship" or "graduate trainee" and filter by location or **Remote** |
| **Job boards** | Jobberman, MyJobMag and HotNigerianJobs list Nigerian internships |
| **Company career pages** | Many banks, consulting firms, tech companies and FMCGs run internship programmes |
| **Your school** | Career services, SIWES coordinator, departmental notice boards and WhatsApp groups |
| **Your network** | Lecturers, alumni, family friends, older students who've done placements |

![Five places to find internships: LinkedIn Jobs, job boards, company career pages, your school and your network, plus asking directly by email](/images/courses/internship/where-to-look.svg "Five places to look, plus asking directly.")

## Ask directly

Many small and medium businesses never advertise internships but will take a keen student. A short, polite email works:

```text
Subject: Internship enquiry – Accounting student (UNILAG)

Dear Mrs Adeyemi,

I'm a 300 level Accounting student at the University of Lagos looking
for a 6-month industrial training placement from February 2027.

I use Excel confidently (see my portfolio: [link]) and I'm keen to
learn how an accounting firm like yours works day to day.

Could your firm take an intern next year? My CV is attached.

Kind regards,
Chinedu Okeke
```

## Remote opportunities

Remote internships let you work for organisations anywhere, from home. Find them on:

- **LinkedIn** with the **Remote** filter.
- **Remote-friendly platforms** such as Wellfound (startups), Internshala, and remote job boards.
- **Programmes for African students and graduates**, such as fellowship and training programmes run by tech companies and NGOs.

For remote work you'll need: a laptop, reliable internet or a data plan, a quiet place for video calls, and good written communication.

## Spot fake internships

Scammers target students. Walk away if:

- They ask **you to pay**: for "training", "registration", "equipment" or "processing". Genuine employers pay you, not the other way round.
- The offer arrives **without an interview**.
- The email is from a **free address** (e.g. `hr.bigbank.recruitment@gmail.com`) claiming to be a big company.
- They want your **BVN, bank PIN or OTP**.
- The pay is **far too high** for a student role, or the job is vague ("data entry, ₦300,000 weekly").

Check the company: look it up on its official website and LinkedIn, and search its name plus "scam".

![Six warning signs of a fake internship offer, and how to check a company before replying](/images/courses/internship/fake-offers.svg "Six signs an internship offer is fake.")

> [!WARNING]
> Never pay money to get an internship or job, and never share your BVN, PIN or OTP.

## Try it

This message arrived in a student's inbox:

```text
From: hr.crestlinebank.recruitment2026@gmail.com
Subject: CONGRATULATIONS! Remote Internship Offer

Dear Candidate, you have been selected for a remote data entry internship
with Crestline Bank, paying ₦250,000 weekly. No interview needed. To secure
your place, pay ₦12,500 for training materials to the account below
within 48 hours, and reply with your BVN for payroll set-up.
```

```task
{
  "id": "intern-m02-t1",
  "prompt": "List the **warning signs** that this is a fake internship, one per line.",
  "minutes": 5,
  "rows": 7,
  "placeholder": "- ...\n- ...",
  "rules": [
    { "label": "Spots the request for money", "pattern": "pay|fee|₦12,500|12,500|training materials|money" },
    { "label": "Spots the free email address for a big company", "pattern": "gmail|free (email|address)|not (the|an) official|personal email" },
    { "label": "Spots the missing interview", "pattern": "interview" },
    { "label": "Spots the BVN request", "pattern": "bvn" },
    { "label": "Spots the unrealistic pay or urgency", "pattern": "250,000|too (high|good)|unrealistic|48 hours|urgen|pressure" },
    { "label": "At least four signs", "minLines": 4 }
  ],
  "sample": "- They want me to pay ₦12,500: genuine employers pay you, not the other way round.\n- It's from a Gmail address, not the bank's official email.\n- There was no interview.\n- They want my BVN, which no employer needs before I've even started.\n- ₦250,000 a week for student data entry is far too high, and the 48-hour deadline is pressure.",
  "required": true
}
```

```task
{
  "id": "intern-m02-t2",
  "prompt": "Write a **direct enquiry email** to a real small business or organisation in your field that doesn't advertise internships. Include a `Subject:` line, who you are, when you're available, one thing you can already do (with a link if you have one), a clear question, and a sign-off.",
  "minutes": 10,
  "rows": 12,
  "placeholder": "Subject: Internship enquiry - ...\n\nDear ...,\n\nI'm ...",
  "rules": [
    { "label": "A Subject: line that says it's an internship enquiry", "pattern": "^\\s*subject\\s*:[^\\n]*(intern|siwes|placement|industrial training|it )" },
    { "label": "A greeting", "pattern": "^\\s*(dear|good (morning|afternoon))\\b" },
    { "label": "Says who you are and what you study", "pattern": "\\b(i'm|i am)\\b[^\\n]*(student|level|graduate|studying)" },
    { "label": "Says when you're available (months or dates)", "pattern": "20\\d\\d|january|february|march|april|may|june|july|august|september|october|november|december|months?" },
    { "label": "Asks a clear question", "pattern": "\\?" },
    { "label": "A sign-off", "pattern": "regards|sincerely|best wishes|thank you" },
    { "label": "Short: under 160 words", "minWords": 40, "maxWords": 160 }
  ],
  "sample": "Subject: Internship enquiry - 300 Level Accounting student (UNILAG)\n\nDear Mrs Adeyemi,\n\nI'm a 300 level Accounting student at the University of Lagos looking for a 6-month industrial training placement from February 2027.\n\nI use Excel confidently, including pivot tables and XLOOKUP (portfolio: sites.google.com/view/chinedu-okeke), and I'm keen to learn how an accounting practice like yours works day to day.\n\nCould your firm take an intern next year? My CV is attached.\n\nKind regards,\nChinedu Okeke",
  "required": true
}
```
