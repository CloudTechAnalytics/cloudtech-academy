---
title: The Prompt Framework: Role, Context, Task, Rules, Format
minutes: 20
summary: Learn the seven building blocks of a strong prompt (role, context, task, rules, format, example and check), what to follow for each, a ready-to-copy template, and the common mistakes that give weak answers.
---

## A story to start: same tool, two results

Two assistants at a travel agency in Abuja were asked to write a reply to a customer whose flight was cancelled. They used the same AI tool on the same day.

Amaka typed: *"Write an email about a cancelled flight."* She got a generic apology with no names, no next steps and a sentence that began "We hope this message finds you well." She spent twenty minutes rewriting it.

Bayo typed a paragraph that described the situation, the customer, what the agency could offer, the tone, and the exact shape of the reply. The first answer was nearly ready to send.

The difference was not the tool and not luck. Bayo followed a **framework**: a short checklist of things a good prompt contains. In this lesson you will learn it, and you will be able to use it on almost any task.

## Why a framework helps

A prompt is a **brief**. If you hired a skilled freelancer and said only "write something about a cancelled flight", you would get a poor result, and it would be your fault, not theirs. A good brief answers the questions the freelancer would otherwise have to guess.

The framework is those questions, in an order that is easy to remember:

![Seven steps to a strong prompt: role, context, task, rules, format, example, check, each with a one-line question and a sample sentence](/images/courses/ai-productivity/prompt-framework.svg "Seven steps, each answering a question the AI cannot guess.")

You do not need all seven every time. A simple request needs two or three. Work that others will see needs most of them. Let us go through each, with what to follow and a sample sentence.

## 1. Role: who should the AI act as?

A role sets the **voice and the level of expertise**. Compare "explain a loan" with "act as a patient bank customer-service officer explaining a loan to someone who has never borrowed". The second answer will use simpler words and a more helpful tone.

**What to follow:** pick a real, specific job, and add the audience if it helps.

- Weak: "You are an expert."
- Strong: "Act as a friendly small-business marketing coach."

## 2. Context: what is the situation?

Context is the most important part and the one people skip. The AI knows nothing about you. Tell it:

- **Who you are** and what your business or role is.
- **Who the output is for** (customer, boss, class, the public).
- **What has happened** so far, and any facts it cannot guess.

**What to follow:** include the names, places, amounts and dates that matter.

- Weak: "I have a shop."
- Strong: "I run a juice shop near the University of Ibadan. Most customers are students, and Friday is our busiest day."

## 3. Task: what exactly should it do?

The task is **one clear job**, stated with a strong verb: write, summarise, compare, list, rewrite, explain, plan, draft.

**What to follow:** one task per prompt where possible. If you have three jobs, do them one after another.

- Weak: "Help me with marketing."
- Strong: "Write three WhatsApp messages announcing that we now deliver on weekends."

## 4. Rules: what must and must not happen?

Rules are the **boundaries**: length, things to include, things to avoid, facts it must not invent.

**What to follow:** make rules specific and checkable. Numbers work well.

- "Under 40 words each."
- "No emojis."
- "Do not promise a delivery time."
- "Use only the price list I pasted; if a price is missing, say so."

That last style of rule, telling the AI to stick to your facts and admit gaps, is one of the best protections against made-up answers.

## 5. Format: how should the answer look?

If you do not say, you get a default wall of text. Ask for the **shape** you will actually use.

**What to follow:** name the format (table, numbered list, email, three bullets, one paragraph), the length, and the tone.

- "A table with three columns: message, best time to send, reason."
- "A short email with a clear subject line."
- "Plain language a 15-year-old could follow."

## 6. Example: what does good look like?

An example is the fastest way to get a **style** right. Paste a sample you like and say "match this style and length".

**What to follow:** include one good example, clearly separated from your instructions, and say what to copy from it (tone, length, structure).

> "Here is a message our customers liked: 'Weekend special! Fresh zobo, 50cl, ₦500 until 6pm. Come early.' Write three more in the same style."

## 7. Check: how do we make it safer and better?

The last step asks the AI to **help you catch its mistakes** before you do.

**What to follow:** pick one or more of these lines.

- "Ask me any questions you need answered before you start."
- "List any assumptions you made."
- "Tell me which parts you are not sure about."
- "After you write it, check it against my rules and fix anything that breaks them."

Asking for questions first is especially strong for longer pieces such as proposals and reports, because it makes the AI collect the facts instead of guessing them.

## Putting it together: a template you can copy

Here is the framework as a fill-in template. Delete lines you do not need.

```text
ROLE: Act as [a specific job].
CONTEXT: I am [who you are]. This is for [audience]. Background: [facts, names, numbers, dates].
TASK: [One clear job: write / summarise / compare / plan ...]
RULES: [Length, must include, must avoid, use only the facts above].
FORMAT: [Table / email / list], [tone], [length].
EXAMPLE: [A sample you like, if you have one].
CHECK: Ask me questions first if anything is unclear, and list your assumptions.
```

And here is that template filled in, for the travel agency's cancelled flight:

```text
ROLE: Act as a calm, helpful customer-service officer at a travel agency.
CONTEXT: I work at a travel agency in Abuja. A customer, Mr Danjuma, booked
a flight to London on 14 June. The airline cancelled it today. We can offer
a free rebooking on 15 or 17 June, or a full refund within 7 days.
TASK: Write a reply email to Mr Danjuma.
RULES: Apologise once, sincerely. Do not blame the airline. Offer both
options clearly. Under 120 words. Do not promise compensation.
FORMAT: A short email with a subject line, plain friendly English.
CHECK: Before you write, ask me if any detail is missing.
```

Compare that to "Write an email about a cancelled flight", and you can see why Bayo's first draft was nearly ready.

## Common mistakes and quick fixes

| Mistake | What happens | Fix |
| :-- | :-- | :-- |
| Too vague ("make it good") | Bland, average output | Say what good means: length, tone, reader |
| No context | Generic text with no real facts | Add who, what, numbers, dates |
| Several tasks in one prompt | Some get ignored or muddled | One task at a time |
| Hidden rules in your head | It breaks them | Write each rule down |
| Pasting private data | Privacy risk | Remove names, numbers and passwords first |
| Accepting the first answer | Missed improvements | Reply with specific changes in the same chat |
| Trusting facts and figures | Wrong numbers, invented sources | Check anything that matters |

## Try it

```task
{
  "id": "aipf-m01-t8",
  "prompt": "Turn this weak prompt into a strong one using the framework. Include at least a **role**, **context**, a clear **task**, **rules** and a **format**. Invent realistic details.\n\n> Write something for my business.",
  "minutes": 8,
  "rows": 9,
  "placeholder": "ROLE: Act as ...\nCONTEXT: I ...\nTASK: ...\nRULES: ...\nFORMAT: ...",
  "rules": [
    { "label": "Sets a role (act as, you are…)", "pattern": "act as|you are|role|pretend|as a " },
    { "label": "Gives context (I run, my business, customers, audience…)", "pattern": "context|I run|I own|I work|my (shop|business|company|team|class)|our (shop|business|customers)|customers|audience" },
    { "label": "States a clear task with a verb (write, draft, create, list, summarise…)", "pattern": "write|draft|create|list|summari[sz]e|plan|compare|rewrite|explain" },
    { "label": "Includes rules or limits (under N words, do not, must, no …)", "pattern": "under \\d+|do not|don't|must|never|no [a-z]+|at most|only|avoid" },
    { "label": "Sets a format (table, email, list, bullets, paragraphs, tone…)", "pattern": "table|email|list|bullet|paragraph|format|tone|message|subject|columns|steps" },
    { "label": "Long enough to be a real brief (at least 50 words)", "minWords": 50 }
  ],
  "sample": "ROLE: Act as a friendly small-business marketing coach.\nCONTEXT: I run a tailoring shop in Aba. Most customers are office workers who need suits and native wear altered quickly. We are quietest on Mondays and Tuesdays.\nTASK: Write three short WhatsApp status messages that bring in customers on slow days.\nRULES: Under 35 words each. No emojis. Do not promise discounts I have not approved. Use a real benefit such as same-day alterations.\nFORMAT: A table with three columns: message, best time to post, reason.\nCHECK: Ask me any questions you need before you start.",
  "note": "Try your prompt in an AI assistant. Then try \"Write something for my business\" and compare. The difference is the point of the lesson.",
  "required": true
}
```

```task
{
  "id": "aipf-m01-t9",
  "prompt": "Here is a prompt that breaks several rules: *\"Make a post about our sale and also write a contract and tell me about marketing, make it good.\"* List **three problems** with it and say how you would fix each. One per line.",
  "minutes": 5,
  "rows": 6,
  "placeholder": "1. Problem: ... Fix: ...",
  "rules": [
    { "label": "Three separate lines", "minLines": 3 },
    { "label": "Spots the several tasks in one prompt (too many tasks, one at a time, separate)", "pattern": "several|many|multiple|too much|three tasks|one task|one at a time|separate|split" },
    { "label": "Spots the vague wording (make it good, vague, unclear, what good means)", "pattern": "vague|good|unclear|specific|define|what.*mean" },
    { "label": "Spots missing context or details (no context, who, details, facts, audience…)", "pattern": "context|detail|who|audience|facts|background|missing|nothing about" },
    { "label": "Says how to fix (should, add, split, tell, give…)", "pattern": "should|add|split|tell|give|include|fix|instead" }
  ],
  "sample": "1. Problem: it asks for three different jobs at once (a post, a contract and marketing advice). Fix: do them one at a time, each as its own prompt.\n2. Problem: \"make it good\" is vague. Fix: say what good means, such as length, tone and who will read it.\n3. Problem: it gives no context or details about the sale (what, when, price, audience). Fix: add the facts the AI cannot guess.",
  "required": true
}
```
