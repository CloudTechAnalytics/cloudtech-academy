---
title: Serving Customers in Every Channel
minutes: 25
summary: Serve well in person, on the phone, on WhatsApp, email and social media and through live chat, and meet sensible response times.
---

## In person and at the front desk

Face-to-face service is the most personal. Customers notice everything: your greeting, your attention and the state of the place.

- **Prepare:** keep the area clean and tidy, with information and forms ready.
- **Greet quickly,** within seconds, even if you are busy (a nod and "I will be with you shortly" shows you have seen them).
- **Serve in order,** fairly. Be clear about queues.
- **Listen, confirm what they need and act.** Give full attention to the person in front of you.
- **Explain things simply,** and check they understand.
- **Do not make customers wait without telling them why** and for how long.
- **Handle money and documents carefully,** counting and confirming amounts aloud.
- **Close well:** summarise what was done, ask if they need anything else, thank them.
- **Manage queues and multitasking:** if the phone rings while you are serving someone, politely ask the customer to excuse you or let a colleague answer.
- **Look after safety:** know the emergency procedures and report hazards.

Front-desk staff also act as **gatekeepers and directors:** they welcome visitors, announce them, give directions and handle messages accurately.

## Phone etiquette

On the phone, the customer cannot see you, so voice and words carry everything.

- **Answer promptly,** ideally within three rings.
- **Use a standard greeting:** "Good morning, thank you for calling [Business], [Name] speaking. How may I help you?"
- **Speak clearly, smile, and use a calm, friendly tone.**
- **Get their name** and use it. Write down their number and details.
- **Listen and take notes.** Repeat key details back.
- **Do not leave callers on hold** without asking permission, and check back every 30 to 60 seconds. Offer to call back if the wait is long, and **always do it.**
- **Transfer properly:** explain who you are transferring them to and why, and give the number in case the call drops. Brief the colleague so the customer does not repeat everything.
- **Take accurate messages:** caller's name, number, the message, date, time and who took it, then pass it on promptly.
- **Handle angry callers calmly** (module 4).
- **End well:** summarise actions and times, ask "Is there anything else I can help you with?" and thank them. Let the customer hang up first.
- **Keep background noise low,** and do not eat or chat while on a call.

A short **phone script** for a common situation saves time and avoids errors, but keep your tone natural.

## WhatsApp, email and social media

Many Nigerian customers prefer messaging. It is fast and informal, but it still represents your business.

**WhatsApp (and other messaging):**

- Use a **business profile,** with a clear name, hours, address and catalogue.
- Set a **greeting message** and an **away message.**
- Use **quick replies** for common questions, and personalise them.
- Keep messages **short and clear,** one idea at a time, with correct spelling.
- **Reply within your stated time,** and say when you will respond fully if you need time.
- Use **voice notes** sparingly; many people prefer text for details like prices and addresses.
- **Confirm important details in writing** (order, price, delivery time).
- **Ask permission** before sending promotional messages, and respect "stop."
- **Protect privacy:** do not share customers' details or forward their messages.
- **Keep a professional tone,** even when the customer is casual. Limit emojis to friendly, appropriate ones.

**Email:**

- Clear **subject lines,** and a professional signature (name, role, phone).
- Follow the writing principles from module 2.
- **Reply within a set time** (for example 24 hours, or sooner for urgent matters), even if only to acknowledge and say when you will reply fully.
- Use "reply all" carefully, keep records, and attach the right files.

**Social media (Instagram, Facebook, X, TikTok):**

- **Monitor comments and messages** regularly.
- **Respond publicly and politely** to questions and complaints; move detailed or private matters to direct messages or a phone call.
- **Do not argue or delete** legitimate complaints; address them. Thank people for praise.
- **Use a consistent, friendly brand voice.**
- Never share customers' private information in public.

## Live chat and response times

**Live chat** on a website or app gives instant answers. Tips: greet within seconds, use a friendly human name, write short replies, avoid long silences ("let me check, one moment"), and offer to follow up by phone or email if the issue is complex. **Chatbots** can answer common questions at any hour, but always provide a clear way to reach a person.

**Response time** is part of the service. Set clear **targets** for each channel and tell customers what to expect. Example targets:

| Channel | First response | Resolution target |
| :-- | :-- | :-- |
| Walk-in | Greeting in 10 seconds | Same visit |
| Phone | Answer within 3 rings | At first call where possible |
| WhatsApp / chat | Within 15 minutes in hours | Same day |
| Email | Within 4 working hours | 24 hours |
| Social media | Within 1 hour | Same day |

Track whether you meet them. Example: of **200 messages** in a week, **180** received a first response within the target. Compliance = 180 ÷ 200 = **90%.** If the target is 95%, you are below it, so find out when and why replies are slow (peak hours? one person on duty?).

Match staffing to peak times, use quick replies and templates, route messages clearly and do not promise what you cannot do. **Silence is the worst response.**

## Try it

```task
{
  "id": "cscm-m03-t1",
  "prompt": "Write a **phone script** for answering a call and taking a message for a colleague who is unavailable. At least eight lines, including the greeting, asking for the caller's details, repeating them back and closing.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "Good morning, thank you for calling ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Standard greeting with business and name", "pattern": "thank you for calling|good (morning|afternoon)" },
    { "label": "Says the colleague is unavailable politely", "pattern": "unavailable|not available|in a meeting|away from|cannot come to the phone|stepped out" },
    { "label": "Asks for name and number", "pattern": "name[\\s\\S]*number|number[\\s\\S]*name" },
    { "label": "Repeats details back", "pattern": "repeat|read (that )?back|confirm|let me (check|confirm)|so that is" },
    { "label": "Promises to pass on the message", "pattern": "pass|give him|give her|will ensure|will make sure|message" },
    { "label": "Closes by asking if anything else and thanking", "pattern": "anything else|thank you" }
  ],
  "sample": "Good morning, thank you for calling Fresh Mart. This is Ada speaking. How may I help you?\nI am sorry, Mr Bello is in a meeting at the moment. May I take a message for him?\nMay I have your name, please?\nAnd your phone number?\nWhat is the message you would like me to give him?\nLet me read that back to make sure I have it right: you are Mrs Eze, your number is 0803 000 0000, and you would like a call back about your order today.\nI will pass the message to Mr Bello as soon as he is free, and he should call you before 3 pm.\nIs there anything else I can help you with? Thank you for calling, Mrs Eze, have a lovely day.",
  "required": true
}
```

```task
{
  "id": "cscm-m03-t2",
  "prompt": "Of **200 messages** in a week, **180** got a first response within your target. Work out the **compliance rate**. If the target is **95%**, say whether it is met, and give **two actions** to improve.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Compliance = ...",
  "rules": [
    { "label": "Compliance of 90%", "pattern": "\\b90\\s?%" },
    { "label": "Says the 95% target is not met", "pattern": "not met|below|miss|short of|under|fails|not reached" },
    { "label": "Gives two actions (peak staffing, quick replies, routing, check delays)", "pattern": "peak|quick repl|template|route|staff|rota|more people|automat|delay" }
  ],
  "sample": "Compliance = 180 / 200 = 90%.\nThe 95% target is not met, because 90% is below it.\nI would check when the slow replies happen and add a second person at peak hours, and set up quick replies for common questions to speed up answers.",
  "required": true
}
```

```task
{
  "id": "cscm-m03-t3",
  "prompt": "Write **three quick reply templates** for WhatsApp: a greeting, an away message and a reply to a price enquiry. Each should be friendly and clear. Label each.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Greeting: ...\nAway message: ...\nPrice reply: ...",
  "rules": [
    { "label": "Has all three labelled templates", "pattern": "greeting[\\s\\S]*away[\\s\\S]*price" },
    { "label": "Greeting welcomes the customer", "pattern": "welcome|thank you for (contacting|messaging)|hello" },
    { "label": "Away message gives hours or a time to reply", "pattern": "hours|back|reply (by|within)|monday|tomorrow|\\d+\\s*(am|pm)" },
    { "label": "Price reply gives a price and a next step", "pattern": "₦\\s?\\d[\\s\\S]*(order|reply|send|visit|book)" },
    { "label": "At least 50 words", "minWords": 50, "maxWords": 140 }
  ],
  "sample": "Greeting: Hello and welcome to Fresh Mart! Thank you for messaging us. How can we help you today?\nAway message: Thank you for your message. We are closed now and open again from 8 am tomorrow. We will reply as soon as we open. For urgent matters please call 0803 000 0000.\nPrice reply: Thank you for asking. The 5 kg bag of rice is ₦12,500 and we deliver within Ikeja for ₦1,500. Reply with your address and we will confirm your order today.",
  "required": false
}
```

Next lesson: handling complaints and difficult people.
