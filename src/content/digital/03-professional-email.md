---
title: Professional Email
minutes: 20
summary: Write clear, polite emails to lecturers, employers and organisations, with a professional address, a good subject line and the right tone.
---

## Start with the right address

Your email address is the first thing people see. Use a simple, professional one for school and job applications:

| Avoid | Use |
| :-- | :-- |
| `sweetgirl2004@…` | `amaka.obi@gmail.com` |
| `bigboss_king@…` | `tunde.bakare.dev@gmail.com` |

If your school gives you a student email, use it for anything to do with school.

## The parts of a good email

1. **Subject:** specific, so they know what it's about before opening it.
2. **Greeting:** "Dear Dr Adewale," or "Good morning, Mrs Okon," for formal emails.
3. **Opening line:** who you are, if they may not know you.
4. **The point:** what you need, in one or two short paragraphs.
5. **Closing:** thank them and say what happens next.
6. **Sign-off and signature:** "Kind regards," then your full name and details.

![A professional email with six numbered parts: subject, greeting, who you are, the point, closing, and sign-off](/images/courses/digital/email-anatomy.svg "The six parts of a professional email.")

## An example

```text
Subject: ECO 201 – Request for extension on Assignment 2 (Matric 21/0453)

Dear Dr Adewale,

I'm Amaka Obi, a 200 level Economics student in your ECO 201 class.

I was admitted to the health centre on Monday and could not complete
Assignment 2, due on Friday. I have attached my medical note.

Could I please submit it by next Wednesday? I have already finished
the first half.

Thank you for considering my request.

Kind regards,
Amaka Obi
200 Level, Economics
21/0453 · 0803 000 0000
```

## Tone tips

- **Be brief.** Busy people read short emails first.
- **One email, one topic.**
- **Be polite, not over the top.** "Please" and "thank you" are enough.
- **No text-speak:** write "please", not "pls"; "you", not "u".
- **Check attachments.** Say "I have attached…" and make sure you did.
- **Read it once before sending**, especially names and dates.

> [!TIP]
> If you don't get a reply, wait three to five working days, then reply to your own email with a short, polite follow-up.

## A simple signature

Set one up once (in Gmail: **Settings → See all settings → Signature**):

```text
Amaka Obi
Economics student, University of Lagos
linkedin.com/in/amaka-obi · 0803 000 0000
```

## Try it

You need to ask the course adviser whether you can register a fifth elective. Which subject line is best?

- **A.** `Hello`
- **B.** `URGENT!!! Please read`
- **C.** `Request to register a fifth elective - 300 Level, Matric 21/0453`
- **D.** `Question`

```answer
{
  "id": "digi-m03-a1",
  "prompt": "Type the letter.",
  "answer": "C",
  "format": "text",
  "accept": ["c.", "(c)"],
  "explanation": "It says what the email is about and who you are before it's even opened.",
  "required": true
}
```

```task
{
  "id": "digi-m03-t1",
  "prompt": "Write a complete email to a lecturer, course adviser or organisation asking **one clear question** (real or realistic). Include all six parts: a specific `Subject:` line, a greeting, who you are, the point, a thank-you, and a sign-off with your name.",
  "minutes": 10,
  "rows": 14,
  "placeholder": "Subject: ...\n\nDear Dr ...,\n\nI'm ...\n\n...\n\nKind regards,\n...",
  "rules": [
    { "label": "A specific Subject: line (at least 4 words)", "pattern": "^\\s*subject\\s*:\\s*(\\S+\\s+){3,}\\S+" },
    { "label": "A formal greeting (Dear…, Good morning…)", "pattern": "^\\s*(dear|good (morning|afternoon|evening))\\b" },
    { "label": "Says who you are (I'm, I am, my name is…)", "pattern": "\\b(i'm|i am|my name is)\\b" },
    { "label": "Asks clearly (could, would, may, please…)", "pattern": "\\b(could|would|may|please|can i|is it possible)\\b" },
    { "label": "Thanks them", "pattern": "thank" },
    { "label": "A professional sign-off (Kind regards, Best regards, Yours sincerely…)", "pattern": "^\\s*(kind regards|best regards|regards|yours sincerely|yours faithfully|best wishes|many thanks)\\s*,?\\s*$" },
    { "label": "No text-speak (pls, u, ur, thx) or shouting (!!!)", "pattern": "\\b(pls|plz|thx|ur)\\b|\\bu\\b|!!", "absent": true },
    { "label": "Brief: under 180 words", "minWords": 40, "maxWords": 180 }
  ],
  "sample": "Subject: Request to register a fifth elective - 300 Level, Matric 21/0453\n\nDear Dr Okoro,\n\nI'm Amaka Obi, a 300 level Economics student and one of your advisees.\n\nI would like to take GST 311 (Entrepreneurship) as a fifth elective this semester, which would bring me to 24 units. Could you please confirm whether this is allowed, and whether I need your signature on the registration form?\n\nThank you for your time.\n\nKind regards,\nAmaka Obi\n300 Level, Economics\n21/0453",
  "required": true
}
```

Then set up your email signature, and send your email if it's a real question.
