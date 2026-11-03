---
title: The Entrepreneurial Mindset and Finding Opportunity
minutes: 25
summary: Learn what entrepreneurs do differently, spot problems worth solving, tell an opportunity from an idea and assess your own strengths, resources and risks.
---

## What entrepreneurs do differently

An **entrepreneur** starts and builds a business to meet a need, accepting risk in the hope of reward. You do not need a special personality, a big idea or a lot of money. You need to **notice problems, test solutions and keep learning.**

Habits that successful entrepreneurs share:

- **They start with a problem,** not a product. They ask who is struggling and why.
- **They test before they build.** A cheap experiment beats a long debate.
- **They treat failure as information.** A failed test tells them what to change.
- **They take small, calculated risks** and protect what they cannot afford to lose.
- **They sell.** Nothing happens until someone pays.
- **They keep records and watch money.** Many good ideas die of poor cash management.
- **They keep going when it is hard,** and change direction when the evidence says so.

Entrepreneurship is also not only for people leaving jobs. You can start small beside a job or studies, and many do.

## Spotting problems worth solving

Good businesses solve real problems. Look for:

- **Things that annoy you or people near you.** "I always have to travel to X to get Y."
- **Things people already pay for, badly.** Unreliable, slow, overpriced or low-quality services.
- **Changes** that create new needs: a new rule, technology, price rise, habit or population shift.
- **Waste:** goods that spoil, time that is lost, money that leaks.
- **Gaps between what exists and what people say they want.**

A problem is **worth solving** when:

1. **Many people** have it, or a few people have it badly.
2. It happens **often** or costs a lot.
3. People are **already trying to fix it**, and spending money or time.
4. You can reach those people.
5. You can solve it **at a price they will pay** that leaves you a profit.

Weak example: "People in my area might like a nice café." Stronger example: "Office workers on my street have 30 minutes for lunch, queue for 15 minutes at the only canteen and often skip lunch."

## Opportunity versus idea

An **idea** is a thought. An **opportunity** is an idea that fits a real, reachable need, at a time when you can act on it, with a way to make money.

| Idea | Opportunity |
| :-- | :-- |
| "I'll sell shoes." | "Students at my university buy fashionable shoes but cannot get good prices; I can source from a supplier and deliver to hostels." |
| Based on what you like | Based on what customers need and will pay for |
| Untested | Supported by evidence |

Turn an idea into an opportunity by naming **who** the customer is, **what problem** they have, **how** you solve it, **why** they would choose you and **how** you earn. If you cannot fill those in, you still have only an idea.

## Your strengths, resources and risks

Before you commit, take stock:

- **Skills and knowledge:** what are you good at that others value?
- **Experience and contacts:** who can you reach, buy from and learn from?
- **Money and assets:** what can you invest, and what can you afford to lose?
- **Time:** how many hours a week can you really give?
- **Weak points:** skills you lack, which you can learn, buy or partner for.
- **Personal risk:** your obligations, your income and your tolerance for uncertainty.

Then ask what could go wrong and **what is the worst you can accept?** Start in a way that limits that loss: test with a small budget, keep your job while you build, and avoid debt you cannot repay.

## Try it

```task
{
  "id": "ent-m01-t1",
  "prompt": "List **five problems** you or people around you face that someone might pay to solve. One per line, in the form \"Who - problem - why it hurts\".",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Office workers - 15-minute queue for lunch - they skip meals",
  "rules": [
    { "label": "Five lines", "minLines": 5 },
    { "label": "Each line names who has the problem and the problem (uses a dash)", "pattern": "-", "perLine": true },
    { "label": "Mentions real people (students, workers, traders, parents, farmers...)", "pattern": "student|worker|trader|parent|farmer|shop|owner|customer|family|people|women|men|driver|resident" },
    { "label": "Says why it hurts (time, money, stress, waste, risk)", "pattern": "time|money|cost|waste|stress|late|queue|expensive|unreliable|risk|lose|skip" }
  ],
  "sample": "Office workers on my street - queue 15 minutes for lunch at the only canteen - they skip meals or waste their break\nStudents in hostels - cannot find good-priced fashionable shoes nearby - they overpay or travel far\nSmall food sellers - cannot keep records of sales - they do not know if they make a profit\nParents - struggle to find reliable after-school lessons - their children fall behind\nMarket traders - lose stock to spoilage because of poor storage - they waste money",
  "required": true
}
```

```task
{
  "id": "ent-m01-t2",
  "prompt": "Choose **one** of your problems and turn it into an **opportunity statement** in 50 to 110 words: who the customer is, their problem, how you would solve it, why they would choose you and how you would earn money.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "My customers are ...",
  "rules": [
    { "label": "Names the customer", "pattern": "customer|student|worker|trader|parent|owner|people|buyers?" },
    { "label": "Names the problem", "pattern": "problem|struggle|cannot|can't|difficult|lose|waste|slow|expensive" },
    { "label": "Says how you solve it", "pattern": "solve|offer|provide|sell|deliver|supply|service|i would|we would|i will" },
    { "label": "Says why they would choose you", "pattern": "because|cheaper|faster|better|closer|reliable|choose|different" },
    { "label": "Says how you earn", "pattern": "earn|charge|price|fee|margin|sell|₦|revenue|per " },
    { "label": "Between 50 and 110 words", "minWords": 50, "maxWords": 115 }
  ],
  "sample": "My customers are office workers on Allen Avenue who have only 30 minutes for lunch. Their problem is that the one canteen has a 15-minute queue, so many skip lunch or eat poorly. I would offer a pre-ordered lunch box service: they order by WhatsApp by 10 am and I deliver hot meals to their office at 12:30. They would choose me because it saves their break, the food is fresh and I deliver to their desk. I would earn ₦2,500 per meal, with a profit of about ₦700 on each, and a weekly subscription discount to encourage regular orders.",
  "required": true
}
```

```task
{
  "id": "ent-m01-t3",
  "prompt": "Do a **personal audit**. One line each: two skills you have, two contacts or resources, how many hours a week you can give, the most money you can afford to lose and one weakness you must cover. At least six lines.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Skill 1: ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "Lists skills", "pattern": "skill" },
    { "label": "Lists contacts or resources", "pattern": "contact|resource|network|equipment|space|savings|friend|supplier" },
    { "label": "States hours per week", "pattern": "\\d+\\s*(hours|hrs)|hours" },
    { "label": "States money you can afford to lose", "pattern": "₦\\s?\\d|afford|lose" },
    { "label": "Names a weakness and how to cover it", "pattern": "weak|lack|learn|partner|hire|cover" }
  ],
  "sample": "Skill 1: cooking for large groups\nSkill 2: managing orders and customer chat on WhatsApp\nContact 1: a cousin who owns a delivery bike\nResource 2: my mother's kitchen on weekdays\nHours: I can give 25 hours a week alongside my job\nMoney I can afford to lose: ₦150,000 of savings\nWeakness: I know nothing about bookkeeping, so I will learn the basics in this course and use a simple spreadsheet",
  "required": false
}
```

Next lesson: how to test whether your idea will really work.
