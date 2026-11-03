---
title: Eliciting requirements
minutes: 25
summary: Draw out what people really need with interviews, workshops, observation and documents, ask questions that get facts rather than opinions, and dig to the root cause.
---

## The problem

Ask Ashgrove's managing partner what she needs and she'll say "a better system". Ask the accounts officer and she'll say "the lawyers send their time sheets late". Ask a lawyer and they'll say "accounts send invoices with the wrong rates". Everyone is partly right, and nobody has the whole picture.

Requirements aren't sitting in people's heads waiting to be collected. They have to be **elicited**: drawn out, checked against each other and against the evidence. People describe symptoms, propose solutions and forget the workarounds they've done for years. A BA's skill is to get past all three to what's actually happening and what's actually needed.

## A story from the field: what the dispatcher never said

An e-commerce company in Port Harcourt wanted a system to assign delivery riders to orders. The analyst, Ibrahim, interviewed the head dispatcher, Mr Okon, for an hour. Mr Okon described a tidy process: orders arrive, he picks the nearest rider, he sends the address by phone.

Ibrahim wrote it all down and felt ready. But before leaving, he asked, "Could I sit next to you for the afternoon and watch?"

Within twenty minutes he saw something Mr Okon had not mentioned. Every few orders, Mr Okon did not pick the nearest rider. He glanced at a handwritten board on the wall and chose someone else. Ibrahim asked why. "Oh, that is the board of who is reliable. Some riders lose parcels. I do not give them the expensive orders."

That board was a **hidden requirement**. The system Ibrahim had been about to specify would have assigned the nearest rider every time and taken away the one piece of judgement keeping expensive parcels safe. Mr Okon had not hidden it on purpose. It was so natural to him that he never thought of it as part of the process.

This is why one technique is never enough. People tell you what they *think* they do, in a meeting, in the neat version. **Observation** shows what they actually do. A good analyst combines interviews, observation, documents and questions to several people, and then checks what each one said against the others.

## The concept

### Elicitation techniques

| Technique | Best for | Watch out for |
| :-- | :-- | :-- |
| **Interviews** | depth, sensitive topics, one person's view | hearing one side only |
| **Workshops** | agreeing across groups, prioritising | loud voices dominating |
| **Observation** (job shadowing) | how work really happens, workarounds | people behaving differently when watched |
| **Document and data analysis** | facts, volumes, current rules | documents describe how it should work, not how it does |
| **Surveys** | many people, simple questions | shallow answers |

Use more than one. Observation and data often contradict interviews, and the contradiction is usually where the real problem is.

### Questions that get facts

- **Open** questions get stories: "Walk me through what happens when a matter's work is finished." "How do you know an invoice is overdue?"
- **Closed** questions confirm details: "Is that every month?" "Who signs it off?"
- **Avoid leading questions**, which plant the answer: "Don't you think automatic reminders would help?" Ask instead: "What happens after an invoice is sent?"
- **Ask for examples**: "Tell me about the last invoice that was paid late." A specific case beats a general opinion.
- **Ask about exceptions**: "When doesn't it work like that?"

### Five whys

Keep asking "why?" to get from the symptom to the root cause:

1. Why are invoices paid late? *Clients don't pay until they're chased.*
2. Why aren't they chased sooner? *Nobody notices until a partner asks.*
3. Why does nobody notice? *Overdue invoices aren't listed anywhere; you'd have to filter the spreadsheet.*
4. Why isn't there a list? *The spreadsheet has no due date, only the issue date.*
5. Why not? *Ashgrove never set payment terms, so there's no "due" to measure against.*

The root cause isn't the software. It's that Ashgrove has no payment terms, so nothing is ever technically overdue until someone gets annoyed.

## Example

Interview notes, organised the way a BA records them, from the accounts officer:

| Type | Note |
| :-- | :-- |
| Fact | Issues about 17 invoices a month, by email, as PDFs made in Word. |
| Fact | Lawyers send their time to her by WhatsApp or on paper, usually 1–3 weeks after the work. |
| Pain point | Spends 2–3 days a month chasing payments by phone, mostly when a partner asks about a client. |
| Workaround | Keeps her own list of "slow payers" in a notebook. |
| Idea (hers) | "If the invoice said 'due in 30 days', clients would take it more seriously." |

Separating facts, pain points, workarounds and ideas keeps you honest. The notebook of slow payers is gold: it's a requirement (see who pays late) that nobody would ever have written down.

## A real-world scenario: an interview that digs

Imagine you are interviewing the manager of a small clinic who says, "Patients wait too long." That is a complaint, not a requirement. Here is how a skilled analyst turns it into usable information, using **open questions** and **probing follow-ups**.

```text
Analyst:  Walk me through what happens when a patient arrives.
Manager:  They sign in, wait, see the nurse, wait, see the doctor.
Analyst:  Where is the longest wait?
Manager:  Between the nurse and the doctor.
Analyst:  What is the doctor usually doing during that time?
Manager:  Often waiting for the patient's folder.
Analyst:  Where is the folder at that point?
Manager:  With the nurse, until she finishes writing.
Analyst:  How long does that take, roughly?
Manager:  Ten, maybe fifteen minutes. I never timed it.
Analyst:  Can I time a few this week?
```

Look at what happened in eleven lines:

- The vague complaint became a **specific wait** (nurse to doctor).
- A **cause** appeared (the paper folder is stuck with the nurse).
- A **number** appeared (10 to 15 minutes), flagged as a guess to be measured.
- The analyst asked to **observe and time**, instead of trusting the guess.

**Practical tips for interviews:**

1. Prepare five to eight open questions (How, What, Tell me about...) rather than yes or no questions.
2. Ask "why?" and "can you give me an example?" when an answer is vague.
3. Write down the person's own words and numbers, and mark which numbers are guesses.
4. End with: "Who else should I talk to?" and "What have I not asked that I should have?"

## Walkthrough

1. Before any interview, look at the data so you can ask informed questions. How many invoices did Ashgrove issue in 2025 (the first task below)?
2. Choose techniques for Ashgrove: interview the managing partner, the accounts officer and two lawyers; observe the accounts officer preparing a month's invoices; analyse the invoice data.
3. Write your interview questions for the accounts officer (the second task below).
4. Run "five whys" on another symptom, such as "invoices have the wrong rates".
5. After each interview, sort your notes into facts, pain points, workarounds and ideas, and send a short summary back to the interviewee to check you understood.

## Practice

```answer
{
  "id": "ba-03-p1",
  "prompt": "How many invoices did Ashgrove issue in **2025**?",
  "answer": 202,
  "format": "number",
  "dataset": "legal",
  "files": ["invoices"],
  "verify": "SELECT COUNT(*) FROM invoices WHERE issued_date BETWEEN '2025-01-01' AND '2025-12-31'",
  "hint": "Filter issued_date to 2025 and count.",
  "explanation": "202, about 17 a month. That matches what the accounts officer said, which is a useful check on the interview.",
  "required": true
}
```

```task
{
  "id": "ba-03-t1",
  "prompt": "Write **six to ten interview questions** for Ashgrove's accounts officer about how invoices are prepared, sent and chased. Put each question on its own line. Make most of them **open**, include at least one asking for a **specific example**, and avoid **leading** questions.",
  "minutes": 8,
  "rows": 10,
  "placeholder": "Walk me through what happens when ...?",
  "rules": [
    { "label": "Six to ten questions, each on its own line ending with ?", "pattern": "\\?\\s*$", "min": 6 },
    { "label": "At least four open questions (starting with what, how, why, who, when, walk me, tell me or describe)", "pattern": "^\\s*(\\d+[.)]\\s*|[-*]\\s*)?(what|how|why|who|when|which|walk me|tell me|describe|talk me)\\b", "min": 4 },
    { "label": "Asks for a specific example (last time, an example, recent)", "pattern": "last time|example|most recent|recent(ly)?|last (invoice|month|week)" },
    { "label": "No leading questions (don't you think, wouldn't it, isn't it, surely)", "pattern": "don'?t you think|wouldn'?t it|isn'?t it|surely|wouldn'?t you agree", "absent": true }
  ],
  "sample": "1. Walk me through what happens from the moment a lawyer finishes some work to the moment the client pays?\n2. How do you find out how much time to bill?\n3. Who checks an invoice before it goes out?\n4. How do you send invoices, and what does the client receive?\n5. How do you know when an invoice should have been paid?\n6. Tell me about the last invoice that was paid very late. What happened?\n7. What do you do when a client doesn't pay?\n8. What takes up most of your time each month?\n9. When does the process not work the way you've described?\n10. If you could change one thing, what would it be?",
  "note": "Question 6 will tell you more than the other nine together: a real case, with real dates and real reasons. And question 10 comes last on purpose, so her ideas don't steer the rest of the interview.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which question is leading?",
    "options": ["What happens after an invoice is sent?", "Don't you think automatic reminders would solve this?", "Tell me about the last late payment.", "Who approves invoices?"],
    "answer": 1,
    "explanation": "It plants the answer. Ask about what happens, not whether they agree with your idea."
  },
  {
    "prompt": "Interviews say invoices go out within a week; the data shows a median of three weeks after the work. What should you do?",
    "options": ["Trust the interviews", "Treat the gap as a finding: observe the process and ask about specific recent cases", "Trust the data and ignore the interviews", "Average the two"],
    "answer": 1,
    "explanation": "Contradictions between sources are often where the real problem is."
  },
  {
    "prompt": "What is 'five whys' for?",
    "options": ["Asking five people", "Getting from a symptom to its root cause", "Prioritising requirements", "Writing user stories"],
    "answer": 1,
    "explanation": "Keep asking why until you reach something you can actually change."
  }
]
```
