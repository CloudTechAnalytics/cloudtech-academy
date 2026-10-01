---
title: Presentations with AI
minutes: 30
handsOn: 10
summary: Plan a presentation around one clear message, get an outline from AI, turn crowded slides into ones people can read, and write a headline and speaker notes, keeping your own judgement in charge.
---

## Start with the message, not the slides

Most weak presentations have the same problem: lots of slides and no clear point. AI can make that worse, because it will happily produce 15 tidy slides on anything. So before you open any tool, answer three questions, one sentence each:

1. **Who** is listening? (Your manager, a client, classmates, a panel?)
2. **What** do you want them to do or believe at the end?
3. **Why** should they care?

For example:

> *I'm presenting to the five-person management team of our bakery. I want them to approve buying a delivery van this quarter. It will cut our late deliveries and save money we currently pay dispatch riders.*

That's your presentation in miniature. Every slide either supports it or gets cut.

## Get an outline, then edit it hard

Give an AI assistant (ChatGPT, Claude, Gemini or Copilot) your three sentences and the facts it can't know, and ask for an **outline**, not finished slides:

```text
I'm presenting to our bakery's management team (5 people, 10 minutes) in
Port Harcourt. I want them to approve buying a used delivery van this
quarter. Facts: we pay dispatch riders about ₦450,000 a month; 1 in 8
deliveries is late; two corporate customers have complained this year; a
reliable used van costs about ₦9.5 million plus ₦180,000 a month to run.
Suggest a 6-slide outline in a problem, cost, solution, next step story.
For each slide: a headline that states the point, and 2-3 bullet points.
```

A typical outline comes back like this:

```text
1. A van would fix our delivery problem and pay for itself in about 3 years
2. 1 in 8 of our deliveries is late, and customers have noticed
   - 2 corporate clients complained this year
   - Late deliveries risk repeat orders
3. Dispatch riders cost us ₦5.4m a year
   - ₦450,000 a month, rising
4. A used van costs ₦9.5m, then ₦180,000 a month
   - Saves about ₦270,000 a month on riders
5. It pays for itself in about 35 months
6. Decision needed: approve the purchase this quarter
```

Now read it as **you**, the person who knows the room:

- **Check every number.** ₦450,000 − ₦180,000 = ₦270,000 saved a month, and ₦9.5m ÷ ₦270,000 ≈ 35 months. The AI got that right this time; it won't always.
- **Cut or merge** what your audience doesn't need. Slides 4 and 5 could be one.
- **Add what it doesn't know.** If the managing director's first question will be "what about the rainy season?", add the answer.

> [!TIP]
> Ask for a **story shape**, like "problem, cost of doing nothing, solution, cost, next step". Decks that follow a story are far easier to follow and to remember.

## Slides people can actually read

Your slides support you; they don't replace you. Compare a slide written like a document with one written for a screen:

**Before:**

```text
Delivery Performance
- Over the past six months we have observed that approximately one in
  every eight deliveries made by our dispatch riders has arrived later than
  the time agreed with the customer, which has led to complaints
- Two of our corporate customers have formally complained this year and one
  has indicated they may consider other suppliers if this continues
- Dispatch riders are often unavailable during peak periods
```

**After:**

```text
1 in 8 of our deliveries is late
- 2 corporate clients complained this year
- One may move to another bakery
- Riders aren't available at peak times
```

What changed:

- **The headline states the point.** "Delivery Performance" is a topic; "1 in 8 of our deliveries is late" is a finding.
- **Short lines**, about 8 words or fewer each, and 3 to 5 of them.
- **One big number** the room can remember.
- **The detail moves to your speaker notes**, where you say it out loud.

AI is good at exactly this kind of tightening:

```text
Rewrite this slide: a headline that states the point, then at most 4
bullets of no more than 8 words each. Move the rest into speaker notes
of about 60 words, in a confident, friendly tone.
```

## Build the deck and make it yours

Use the tool you already have:

- **PowerPoint** or **Google Slides:** pick a built-in theme and paste each slide's headline and bullets. One theme, one or two fonts, a few colours.
- **Canva:** choose a presentation template and replace the text. Fast, polished results.
- **AI slide generators** such as Copilot in PowerPoint, Gemini in Google Slides, Canva's AI tools or Gamma can draft a whole deck from a prompt, depending on your plan. Treat the result as a rough draft and edit it hard.

Before you present:

- **Say it out loud.** If a sentence sounds unnatural spoken, rewrite it in your own words.
- **Time yourself.** Allow about one to two minutes per slide.
- **End with a clear ask:** "I'd like approval to buy the van this quarter."

## Try it

```task
{
  "id": "aipf-m04-t1",
  "prompt": "Write the **three sentences** for a presentation you might really give: **who** is listening, **what** you want them to do or believe, and **why** they should care. One sentence per line.",
  "minutes": 4,
  "rows": 4,
  "placeholder": "I'm presenting to ...\nI want them to ...\nIt matters because ...",
  "rules": [
    { "label": "Three sentences, one per line", "minLines": 3 },
    { "label": "Says who the audience is (presenting to, audience, team, class, panel…)", "pattern": "presenting to|audience|team|class|panel|board|manager|client|lecturer|committee|members|customers|investors" },
    { "label": "Says what you want them to do or believe (want them to, approve, agree, choose…)", "pattern": "want them to|approve|agree|choose|support|fund|believe|decide|buy|adopt|join|sign" },
    { "label": "Says why it matters (because, so that, will save, will help…)", "pattern": "because|so that|will save|will help|will cut|will reduce|will increase|matters|which means|so we" }
  ],
  "sample": "I'm presenting to the five-person management team of our bakery.\nI want them to approve buying a used delivery van this quarter.\nIt matters because 1 in 8 deliveries is late and the van would save about ₦270,000 a month on riders.",
  "required": true
}
```

```task
{
  "id": "aipf-m04-t2",
  "prompt": "Rewrite this crowded slide so people can read it: a **headline that states the point**, then **3 or 4 short bullets** (8 words or fewer each). Put the headline on the first line and each bullet on its own line starting with `-`.\n\n> **Staff Training**\n> - During the last quarter, only 12 of our 40 shop staff completed the customer service training that was introduced in January, mainly because the sessions were held on Saturdays\n> - Shops where staff completed the training had 30% fewer customer complaints than shops where they did not\n> - Staff have told us that weekday sessions during quiet hours would be easier to attend",
  "minutes": 7,
  "rows": 6,
  "placeholder": "Headline that states the point\n- ...\n- ...\n- ...",
  "rules": [
    { "label": "Three or four bullets starting with -", "pattern": "^\\s*-\\s+\\S", "min": 3 },
    { "label": "No more than four bullets", "pattern": "(^\\s*-\\s+\\S[^\\n]*\\n?){5}", "absent": true },
    { "label": "The headline isn't just the topic (\"Staff Training\")", "pattern": "^\\s*staff training\\s*$", "absent": true },
    { "label": "Keeps the key numbers (12 of 40, or 30%)", "pattern": "12|30%|30 ?percent" },
    { "label": "Short enough for a slide (under 45 words in total)", "maxWords": 45 },
    { "label": "Bullets are short (no bullet over 9 words)", "pattern": "^[ \\t]*-[ \\t]+(\\S+[ \\t]+){9,}\\S+", "absent": true }
  ],
  "sample": "Trained shops get 30% fewer complaints\n- Only 12 of 40 staff are trained\n- Saturday sessions are the main barrier\n- Staff prefer quiet weekday hours\n- Proposal: move training to weekdays",
  "note": "The headline is the finding, the bullets are the evidence and the fix, and the detail (that training started in January, the exact wording of staff feedback) moves into speaker notes. Notice the sample uses four bullets; three would also work.",
  "required": true
}
```

```task
{
  "id": "aipf-m04-t3",
  "prompt": "Write about **60 words of speaker notes** for your rewritten training slide: what you'd actually say while it's on screen. Write it the way you'd speak, in the first person.",
  "minutes": 5,
  "rows": 6,
  "placeholder": "What we found is ...",
  "rules": [
    { "label": "Spoken, first person (I, we, our…)", "pattern": "\\b(I|we|our|us)\\b", "min": 2 },
    { "label": "Mentions the evidence (30%, 12 of 40…)", "pattern": "30|12|40" },
    { "label": "Ends with what you're asking for (propose, suggest, ask, recommend…)", "pattern": "propose|suggest|ask|recommend|approve|would like|let's|we should" },
    { "label": "About 60 words (40 to 90)", "minWords": 40, "maxWords": 90 }
  ],
  "sample": "Here's what stood out. The shops where staff finished the training had 30% fewer complaints, but only 12 of our 40 staff have managed to attend, mostly because sessions are on Saturdays. When we asked, staff said quiet weekday hours would work much better. So I'd like to propose moving the training to weekday mornings from next month.",
  "required": true
}
```

Finally, build three real slides in PowerPoint, Google Slides or Canva: a title slide, your rewritten training slide with its notes, and a closing slide with a clear ask.
