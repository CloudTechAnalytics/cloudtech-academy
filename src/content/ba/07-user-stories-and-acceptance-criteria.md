---
title: User stories and acceptance criteria
minutes: 25
summary: Express requirements as user stories that keep the user and the reason in view, split them to a buildable size, and pin down "done" with Given/When/Then acceptance criteria.
---

## The problem

Ashgrove has chosen a supplier who works in two-week **sprints**, the agile way of building software in small, usable pieces. The supplier's developer looks at your requirements list and asks: "Which of these do I build first? And how will you decide it's finished?"

Agile teams don't work from long specifications. They work from a **backlog** of small items, each describing something a user needs and why, and each with a clear test of "done". The standard format for those items is the **user story**, and writing good ones is now a core BA skill in almost every job advert.

## The concept

### The user story format

> As a **[type of user]**, I want **[something]**, so that **[benefit]**.

- *As an accounts officer, I want a list of invoices past their due date, so that I know who to chase each Monday.*

The "so that" is the most important part. It tells the team **why**, which lets them suggest a better way to deliver the benefit, and it lets the product owner prioritise by value.

### INVEST: what makes a good story

| Letter | Means |
| :-- | :-- |
| **I**ndependent | can be built in any order |
| **N**egotiable | the details are open to discussion, not a contract |
| **V**aluable | gives a user something useful on its own |
| **E**stimable | the team can size it |
| **S**mall | fits in one sprint, ideally a few days |
| **T**estable | has clear acceptance criteria |

A story too big to build in a sprint is an **epic**: split it, usually by user, by step in the process, or by rule ("send reminders" → "first reminder", "second reminder", "don't remind clients on a payment plan").

### Acceptance criteria: Given / When / Then

Each story has a few acceptance criteria that define "done", written as scenarios:

- **Given** a starting situation,
- **When** something happens,
- **Then** this is the result.

Write one for the normal case and one for each important exception. They become the tests the team and the business use to accept the story.

## Example

> **As an** accounts officer, **I want** clients to receive an automatic reminder before their invoice is due, **so that** fewer invoices go overdue without me phoning anyone.
>
> **Acceptance criteria**
>
> 1. **Given** an unpaid invoice due on 30 June, **when** it is 23 June, **then** the client receives a reminder email showing the invoice number, amount and due date.
> 2. **Given** an invoice that was paid on 20 June, **when** it is 23 June, **then** no reminder is sent.
> 3. **Given** a client on an agreed payment plan, **when** a reminder would be due, **then** no reminder is sent, and the invoice appears on the accounts officer's exceptions list.

Criterion 2 catches the embarrassing bug (reminding someone who has paid). Criterion 3 comes straight from a business rule found in lesson 6. Good criteria are where the BA's knowledge of the edge cases pays off.

![A user story card reading As an accounts officer, I want clients to get an automatic reminder before the due date, so that fewer invoices go overdue without me phoning anyone; below it three numbered acceptance criteria: normal case, already paid, and payment-plan exception.](/images/courses/ba/user-story.svg "A story says who, what and why; its acceptance criteria say when it's done.")

## Walkthrough

1. Take your Must and Should requirements from lesson 6 and turn each into one or more user stories.
2. Check each against INVEST. Split anything too big: "a billing system" is an epic; "see overdue invoices sorted by days overdue" is a story.
3. Write acceptance criteria for each, covering the normal case and at least one exception.
4. Order the backlog: highest value and lowest risk first. The due date and the overdue list come before automatic reminders, because reminders need them.
5. Review the stories with the accounts officer. If she can't tell from a story what she'll be able to do, rewrite it.

## Practice

```task
{
  "id": "ba-07-t1",
  "prompt": "Write **three user stories** for Ashgrove's billing change, each in the form **As a … I want … so that …**, for at least **two different users** (for example the accounts officer, a partner, a lawyer or a client).",
  "minutes": 8,
  "rows": 8,
  "placeholder": "As an accounts officer, I want ..., so that ...",
  "rules": [
    { "label": "Three stories in the form As a … I want … so that …", "pattern": "as an? [^,\\n]+,?\\s*I want [^\\n]+?so that [^\\n]+", "min": 3 },
    { "label": "At least two different users", "pattern": "as an? (accounts|partner|lawyer|client|managing)[\\s\\S]*as an? (?!\\1)(accounts|partner|lawyer|client|managing)" },
    { "label": "The benefit isn't just restating the want (so that is followed by at least four words)", "pattern": "so that(?:[ \\t]+\\S+){4,}", "min": 3 }
  ],
  "sample": "As an accounts officer, I want a list of invoices past their due date, sorted by days overdue, so that I know who to chase first each Monday.\nAs a partner, I want to see the total overdue for each of my clients, so that I can raise it when I speak to them.\nAs a client, I want each invoice to show its due date and the firm's bank details, so that I can pay on time without having to ask.",
  "note": "Each story is small enough for one sprint and names a real user. The client story is easy to forget, but clients are the ones who actually pay.",
  "required": true
}
```

```task
{
  "id": "ba-07-t2",
  "prompt": "Write **acceptance criteria** for this story, in **Given / When / Then** form: *As a partner, I want to see the total overdue for each of my clients, so that I can raise it when I speak to them.* Write at least **three** scenarios: the normal case and at least two exceptions (for example a client with nothing overdue, or an invoice paid today).",
  "minutes": 8,
  "rows": 10,
  "placeholder": "1. Given ..., when ..., then ...",
  "rules": [
    { "label": "At least three scenarios with Given", "pattern": "\\bgiven\\b", "min": 3 },
    { "label": "Each has a When", "pattern": "\\bwhen\\b", "min": 3 },
    { "label": "Each has a Then", "pattern": "\\bthen\\b", "min": 3 },
    { "label": "Covers a client with nothing overdue", "pattern": "no (overdue|unpaid)|nothing overdue|not overdue|zero|₦0|all paid|fully paid" },
    { "label": "Includes a specific number, amount or date", "pattern": "\\d" }
  ],
  "sample": "1. Given a partner whose client Crestview Partners has two overdue invoices of ₦2.4m and ₦1.1m, when the partner opens the overdue view, then Crestview shows ₦3.5m overdue with 2 invoices.\n2. Given a client with no overdue invoices, when the partner opens the overdue view, then that client doesn't appear in the list.\n3. Given an overdue invoice that was paid this morning and recorded by accounts, when the partner opens the overdue view, then the invoice is no longer included in the client's total.\n4. Given a client handled by a different partner, when the partner opens the overdue view, then that client doesn't appear.",
  "note": "Scenario 4 adds a rule the story didn't state: partners see only *their* clients. Writing acceptance criteria is often where such rules surface, which is exactly why the BA writes them with the business, before anything is built.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why is the 'so that' part of a user story important?",
    "options": ["It's grammatically required", "It explains why, so the team can prioritise by value and suggest better ways to deliver it", "It names the developer", "It isn't important"],
    "answer": 1,
    "explanation": "The benefit is what the business actually wants."
  },
  {
    "prompt": "A story says: 'As a user, I want a complete billing system.' What's wrong?",
    "options": ["Nothing", "It's an epic: too big, with a vague user and no benefit; split it into small stories for specific users", "It needs more detail on the database", "It should be a non-functional requirement"],
    "answer": 1,
    "explanation": "Stories should be small, valuable and for a specific user."
  },
  {
    "prompt": "What are acceptance criteria for?",
    "options": ["To estimate cost", "To define when a story is done, as testable scenarios", "To name the developer", "To list the stakeholders"],
    "answer": 1,
    "explanation": "Given/When/Then scenarios become the tests the story must pass."
  }
]
```
