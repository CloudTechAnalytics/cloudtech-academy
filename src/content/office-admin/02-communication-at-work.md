---
title: Communication at Work
minutes: 30
summary: Write emails and letters, handle the telephone and front desk, prepare minutes, memos and reports and give and receive instructions clearly.
---

## Writing emails and letters

Written communication is a core administrative skill. It represents you and your organisation, and it creates a record.

**Professional email:**

- **Subject line:** short and specific: *"Board meeting, Tuesday 12 March, 10 am, Room 2"* (not "Meeting").
- **Greeting:** "Dear Mrs Eze," or "Good morning Mr Ade," (match the formality of the relationship).
- **Opening:** state the purpose in the first line.
- **Body:** short paragraphs; one idea each. Use bullet points or numbers for lists or steps. Include dates, times, amounts and names.
- **Action:** say clearly what you need and by when.
- **Closing:** "Kind regards," or "Yours sincerely," followed by your name, role and contact details.
- **Attachments:** mention them in the text and check that they are attached.
- **Check before sending:** recipient, spelling, tone, facts, attachments. Use **To** for people who must act, **Cc** for people who need to know, and **Bcc** only when you have a good reason.
- **Reply promptly,** and reply to the right people (use "Reply all" only when needed).
- **Tone:** polite, positive and clear. Never write in anger; never write something you would not want read aloud.

**Formal letters** follow a standard layout: sender's address and date, recipient's name and address, a salutation ("Dear Sir/Madam" or a name), a subject line, the body, a closing ("Yours faithfully" if you began "Dear Sir/Madam"; "Yours sincerely" if you used a name), your signature and name. Keep a copy.

**Rewrite example.**
*Weak:* "Hi, can u send the report asap"
*Better:* "Dear Mr Bello, Could you please send me the monthly sales report by 3 pm on Thursday? I need it for the management meeting on Friday. Thank you. Kind regards, Ada Okoro, Office Administrator."

## Telephone and front desk

Administrators often are the **first voice or face** of the business.

**On the phone:** answer promptly (within three rings), greet and give your name, listen, take accurate notes, handle transfers politely, take clear messages and close courteously. A good message records: caller's name, company, phone number, message, date and time, and who took it.

**At the front desk:**

- **Greet every visitor** within seconds, with a smile.
- **Find out who they are and who they want to see.**
- **Check the diary,** announce them to the host, and ask visitors to sign in.
- **Offer a seat and a drink** if appropriate, and tell them how long they may wait.
- **Provide visitor badges** and follow security procedures.
- **Handle difficult visitors** calmly and call security or a manager if necessary.
- **Keep reception tidy** with up-to-date brochures and clear signs.
- **Handle deliveries and mail** properly: record, sign, and pass on promptly.

Use the **customer service skills** for complaints and angry callers: listen, apologise, solve or escalate.

## Minutes, memos and reports

**Minutes** record a meeting's decisions and actions. A good set includes: the title, date, time, place; attendees and apologies; agenda items with a summary of discussion and **decisions**; **actions** with owner and deadline; the date of the next meeting. Write them clearly and send them within 24 to 48 hours. Keep to **facts, decisions and actions;** do not record every word.

**Memos** are short internal messages. Layout: **To, From, Date, Subject,** then a brief message. Use them for announcements, reminders and requests. Keep to one subject, and state any action needed.

**Reports** present information and findings, often with recommendations. A simple structure:

1. **Title and date.**
2. **Summary** (the main points and recommendation).
3. **Introduction/purpose.**
4. **Findings** (facts, figures, tables).
5. **Conclusions and recommendations.**
6. **Appendices.**

Write in plain language, use headings, bullets and tables to help scanning, check numbers carefully, and put the most important information first.

## Giving and receiving instructions

Many mistakes begin with unclear instructions.

**Receiving instructions:**

- **Listen fully,** and take notes.
- **Ask questions** if anything is unclear: what, by when, in what format, for whom.
- **Repeat back** the main points: "So you would like the draft letter to Mr Ade by 2 pm, on company letterhead, and copied to Mrs Eze. Is that right?"
- **Confirm priorities** if you have several tasks: "Which should I do first?"
- **Say early** if you cannot meet a deadline, and propose an alternative.
- **Report back** when done.

**Giving instructions** (to a junior colleague, a messenger or a vendor):

- **Be specific:** the task, the outcome, the deadline and the standard.
- **Explain why** it matters.
- **Check understanding** by asking them to say it back.
- **Provide what they need:** information, access, examples.
- **Follow up politely** at the agreed time.
- **Say thank you.**

Use **writing** to confirm important instructions, so there is a record and fewer disputes.

## Try it

```task
{
  "id": "poa-m02-t1",
  "prompt": "Write an **email** (60 to 120 words) to your manager, Mr Bello, asking him to approve a budget of ₦150,000 for new office chairs by Thursday. Include a subject line, a greeting, the reason, the action and deadline, and a closing.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Subject: ...\nDear Mr Bello,",
  "rules": [
    { "label": "Has a subject line", "pattern": "subject" },
    { "label": "Greets by name", "pattern": "dear mr bello|good (morning|afternoon) mr bello|mr bello," },
    { "label": "States the amount", "pattern": "150,?000" },
    { "label": "Gives a reason", "pattern": "because|since|so that|reason|chairs (are|have)|backache|broken|replace" },
    { "label": "States the action and deadline", "pattern": "approve|approval[\\s\\S]*(thursday|by)|thursday" },
    { "label": "Courteous closing", "pattern": "regards|sincerely|thank you" },
    { "label": "Between 60 and 120 words", "minWords": 60, "maxWords": 125 }
  ],
  "sample": "Subject: Approval requested: ₦150,000 for office chairs\nDear Mr Bello,\nI am writing to ask for your approval of ₦150,000 to replace six office chairs. Four of the current chairs are broken, and two staff have complained of back pain, which is affecting their work. I have attached three quotations; the lowest is from Neat Furniture at ₦148,000, with delivery included. Could you please approve this by Thursday, so that the chairs arrive before the new staff start on Monday? Please let me know if you need any further information.\nKind regards,\nAda Okoro, Office Administrator",
  "required": true
}
```

```task
{
  "id": "poa-m02-t2",
  "prompt": "Write the **minutes of a short meeting** in at least eight lines: title, date and place, attendees and apologies, three decisions and two actions with owners and deadlines, and the next meeting date.",
  "minutes": 12,
  "rows": 11,
  "placeholder": "Minutes of ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Title, date and place", "pattern": "minutes[\\s\\S]*(date|\\d{1,2}\\s*(march|april|may|june|july|august|september|october|november|december|january|february))" },
    { "label": "Attendees and apologies", "pattern": "present|attendees|attended[\\s\\S]*apolog|apolog" },
    { "label": "Decisions", "pattern": "decision|agreed|resolved", "min": 3 },
    { "label": "Actions with owners and deadlines", "pattern": "action[^\\n]*(by|owner)[^\\n]*\\d|action[^\\n]*\\d", "min": 2 },
    { "label": "Next meeting", "pattern": "next meeting" }
  ],
  "sample": "Minutes of the Admin Team Meeting, 12 March, 10 am, Conference Room\nPresent: Ada Okoro (chair), Tunde Ade, Ngozi Bello. Apologies: Chidi Eze.\nDecision 1: the team agreed to move to a new supplier for printer paper.\nDecision 2: it was agreed that all visitors must sign in and wear a badge from 1 April.\nDecision 3: the monthly meeting will move to the first Tuesday.\nAction 1: Tunde to get three quotations for printer paper by 19 March.\nAction 2: Ngozi to order visitor badges by 22 March.\nNext meeting: Tuesday 2 April, 10 am.",
  "required": true
}
```

```task
{
  "id": "poa-m02-t3",
  "prompt": "Your manager says quickly: *\"Send the report to the client and copy Mrs Eze, sometime today.\"* Write **three clarifying questions** and then the **repeat-back sentence** you would use. One per line.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Which report ...?",
  "rules": [
    { "label": "At least four lines", "minLines": 4 },
    { "label": "Questions end with a question mark (at least three)", "pattern": "\\?", "min": 3 },
    { "label": "Asks which report, which client or deadline time", "pattern": "which|what time|by when|format|deadline|attach" },
    { "label": "Repeats back the instruction", "pattern": "so (you|i)|to confirm|let me confirm|just to confirm|if i understand" }
  ],
  "sample": "Which version of the report should I send, the draft or the final one?\nShould it go to Mr Bello at the client, and in what format, PDF or Word?\nWhat time today do you need it to reach him by?\nSo to confirm: I will send the final PDF report to Mr Bello at the client by 3 pm today, copying Mrs Eze. Is that right?",
  "required": false
}
```

Next lesson: time, tasks and diary management.
