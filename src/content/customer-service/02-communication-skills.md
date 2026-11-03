---
title: Communication Skills
minutes: 25
summary: Listen and question well, write clearly and politely, use tone and body language and be aware of cultural differences.
---

## Listening and questioning

Most service problems begin with misunderstanding. Good listening and good questions prevent it.

**Active listening** means giving full attention and showing that you understand.

- **Stop and focus.** Put down what you are doing; look at the person.
- **Do not interrupt,** even if you think you know what they will say.
- **Show you are listening:** nod, say "I see," "Go on."
- **Listen for feelings and needs,** not just facts. "I have called three times" means frustration.
- **Reflect and summarise:** "So the delivery was due yesterday and you have not received it. Is that right?"
- **Take notes** for complex requests.
- **Do not judge or argue** while listening.

**Questioning** helps you understand.

- **Open questions** (what, how, why, tell me about) get fuller answers: *"What happened when you tried to pay?"*
- **Closed questions** (yes/no or one fact) confirm details: *"Is the order number 4821?"*
- **Probing questions** go deeper: *"Can you tell me more about that?"*
- **Clarifying questions** check meaning: *"When you say 'slow,' how long did you wait?"*
- **Avoid leading or blaming questions:** "Did you read the instructions?" sounds accusing. Try "Let me check where it went wrong."

A good pattern: **listen, ask, summarise, then act.** Do not suggest a solution before you understand the problem.

## Clear, polite writing

Much customer service is written: emails, WhatsApp messages, letters, forms and social media replies. Writing has no tone of voice, so clarity and courtesy matter even more.

**Principles:**

- **Start with a greeting and the person's name.**
- **Thank them or acknowledge their message.**
- **Answer the question in the first lines.**
- **Be clear and concise:** short sentences, simple words, no jargon.
- **Be specific:** dates, amounts, next steps.
- **Be polite and positive:** say what you can do, not only what you cannot.
- **Use a logical structure:** short paragraphs and bullets for steps.
- **End with a next step or an offer of further help,** and a courteous closing.
- **Check spelling, names and numbers** before sending. Mistakes look careless.
- **Do not write in capitals** (it reads as shouting) or use too many exclamation marks.
- **Avoid sarcasm and blame.** Do not write anything you would not say to the customer's face, since messages can be forwarded or posted online.

**Rewrite example.**
*Weak:* "Your payment didn't go through. Try again."
*Better:* "Good afternoon Mrs Ade, thank you for your order. Unfortunately, your payment did not go through. This sometimes happens when a bank declines a card. You can try again with the same card, or pay by transfer to the account below. I will keep your order for 24 hours. Please let me know if I can help."

## Tone and body language

Many impressions come from **how** you say things, not only what you say.

**Tone of voice:** warm, calm, steady and friendly. Smile when you speak on the phone; people can hear it. Avoid sounding bored, rushed or defensive. Speak clearly and at a moderate pace.

**Body language (in person):**

- **Posture:** upright, open, facing the person.
- **Eye contact:** friendly and natural, remembering that norms differ and that, in some contexts, prolonged direct eye contact with elders or seniors may be seen as disrespectful.
- **Facial expression:** a genuine smile and an attentive face.
- **Gestures:** calm; avoid pointing, crossed arms, eye rolling or checking your phone.
- **Space and touch:** respect personal space; be careful with touch, following local customs.
- **Appearance:** neat and professional.

When words and body language disagree, people believe the body language. Saying "I am happy to help" while looking at your phone does not work.

**Words that help:** "Certainly," "I would be glad to," "Let me check that for you," "Thank you for your patience," "I understand," "I will make sure..." **Words to avoid:** "That's not my job," "You should have...," "I don't know" (without "but I will find out"), "Calm down," "It's company policy" (without explaining), and anything blaming.

## Cultural awareness

Nigeria is diverse: many ethnic groups, languages, religions and customs, and customers also come from abroad. Cultural awareness means respecting differences and avoiding assumptions.

- **Greetings matter.** In many communities a proper greeting comes before business. A quick "Good morning, how are you?" is polite and warmly received.
- **Respect for age and seniority:** use titles (Sir, Ma, Chief, Doctor, Alhaji, Alhaja, Mr, Mrs), and do not be over-familiar.
- **Names:** learn to pronounce and spell names correctly; ask if unsure.
- **Language:** use the language the customer is comfortable with, if you can, and speak clearly and without slang to those who are not fluent. Do not mock accents.
- **Religion and customs:** respect prayer times, fasting periods, holidays and dress norms where relevant.
- **Gender and fairness:** treat all customers with equal respect.
- **Directness:** some people prefer indirect or gentler communication; others prefer directness. Watch and adapt.
- **Time and patience:** attitudes to time and waiting differ; manage expectations clearly.
- **Customers with disabilities or special needs:** offer help respectfully, ask what they need rather than assuming, speak directly to the person, and be patient.

Avoid stereotypes. Treat each person as an individual, and if you make a mistake, apologise sincerely.

## Try it

```task
{
  "id": "cscm-m02-t1",
  "prompt": "Rewrite this weak reply into a clear, polite message of 50 to 100 words: *\"Your payment didn't go through. Try again.\"* Include a greeting with a name, thanks, the issue, an explanation or option, a next step and a courteous closing.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Good afternoon ...",
  "rules": [
    { "label": "Greets with a name", "pattern": "good (morning|afternoon|evening)|hello|dear|hi " },
    { "label": "Thanks or acknowledges", "pattern": "thank|appreciate" },
    { "label": "States the issue", "pattern": "payment" },
    { "label": "Offers an option or explanation", "pattern": "try again|transfer|another|option|card|bank|you can" },
    { "label": "States a next step or offer of help", "pattern": "let me know|please|i will|we will|help" },
    { "label": "Courteous closing", "pattern": "regards|sincerely|thank you|best wishes|kind" },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "Good afternoon Mrs Ade, thank you for your order. Unfortunately, your payment did not go through. This sometimes happens when a bank declines a card. You can try again with the same card, or pay by transfer to the account below. I will keep your order for 24 hours so you do not lose it. Please let me know if you need any help or would like me to send a payment link. Kind regards, Chidi, Customer Care.",
  "required": true
}
```

```task
{
  "id": "cscm-m02-t2",
  "prompt": "A customer says: *\"My order is wrong and I am very upset.\"* Write **five questions** you would ask to understand the problem (open, probing and clarifying), without blaming. One per line, each ending with a question mark.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Can you tell me what you received?",
  "rules": [
    { "label": "Five questions", "minLines": 5 },
    { "label": "Every line is a question", "pattern": "\\?\\s*$", "perLine": true },
    { "label": "Open question (what, how, tell me)", "pattern": "what|how|tell me|can you describe" },
    { "label": "Clarifying question (order number, when)", "pattern": "order number|when|which|do you mean|exactly" },
    { "label": "Does not blame (no 'did you read' or 'you should')", "pattern": "did you read|you should have|your fault", "absent": true }
  ],
  "sample": "I am sorry to hear that. Can you tell me what you received?\nWhat did you order, and what is different?\nCould you give me the order number so I can check it?\nWhen did the order arrive?\nHow would you like us to put it right?",
  "required": true
}
```

```task
{
  "id": "cscm-m02-t3",
  "prompt": "Write the **greeting and first three lines you would say** on the phone when answering a business call, and **three phrases** you will use to show respect and care. Use plain, warm language.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "Good morning, ...",
  "rules": [
    { "label": "Greets and names the business", "pattern": "good (morning|afternoon|evening)|thank you for calling" },
    { "label": "Gives own name and offers help", "pattern": "speaking|my name|this is|how (may|can) i help" },
    { "label": "Shows respect or care phrases", "pattern": "certainly|glad to|let me check|thank you for your patience|i understand|sir|ma\\b" },
    { "label": "At least four lines or sentences", "minLines": 4 }
  ],
  "sample": "Good morning, thank you for calling Fresh Mart. You are speaking with Ada. How may I help you today?\nCertainly, Sir, I would be glad to help you with that.\nLet me check that for you; it will take just a moment.\nThank you for your patience, Ma. I understand how important this is.",
  "required": false
}
```

Next lesson: serving customers in every channel.
