---
title: Recruitment and Selection
minutes: 30
summary: Attract candidates, screen CVs, interview and assess fairly and handle references, offers and fairness.
---

## Attracting candidates

**Recruitment** is finding and attracting suitable candidates; **selection** is choosing among them. A great hire is worth far more than the cost of doing the process well, and a poor hire is expensive in lost time, errors, morale and the cost of starting again.

**Where to find candidates:**

- **Internal:** promote or transfer existing staff (motivating, cheaper, known).
- **Referrals** from staff, with a fair process.
- **Job boards and social media:** LinkedIn, Jobberman-type sites, Facebook and WhatsApp groups.
- **Your own website and shop or office notice.**
- **Schools, universities, training institutes, youth service (NYSC) and professional bodies.**
- **Recruitment agencies** for senior or specialist roles (compare fees and check reputation).
- **Walk-ins and speculative applications.**

**Writing a good job advert:**

- A **clear job title** people actually search for.
- A **short summary** of the business and the role.
- **Main duties** and **essential requirements** (not a wish list).
- **Location, hours, type of contract** and, where possible, **pay or pay range.** Honest pay information attracts the right people and saves time.
- **How to apply,** with a closing date and contact.
- **An inclusive tone** without discriminatory wording about age, gender, religion, tribe, marital status or disability.
- Beware of **scams:** never ask candidates to pay for a job, interview or "processing." Say clearly that no fee is charged.

Your reputation as an employer matters: respond to applicants, treat people courteously, and pay on time. People talk.

## Screening CVs

You may receive many applications. Screen **consistently** against the essential criteria in the person specification.

1. **Decide the criteria** and how much each matters before you read applications.
2. **Score each CV** against them (for example 0 to 5 for each criterion).
3. **Check for the essentials first,** then the desirables.
4. **Look for evidence,** not buzzwords: achievements, results, responsibilities, progress in roles.
5. **Note gaps or concerns** to ask about, not as automatic rejection.
6. **Shortlist** the best, typically 3 to 8 for interview.
7. **Keep records** of how you scored, in case a decision is questioned.
8. **Tell unsuccessful applicants** politely, if you can.

Example scoring matrix with weights: experience 40%, skills 30%, education 20%, communication 10%. Candidate A scores 4, 3, 5, 3 (out of 5):

- Experience 4 × 0.40 = 1.6
- Skills 3 × 0.30 = 0.9
- Education 5 × 0.20 = 1.0
- Communication 3 × 0.10 = 0.3
- **Total = 3.8 out of 5.**

Do not let unconscious bias (name, school, appearance, gender, tribe, age) shape your decision. Focus on the criteria.

## Interviewing and assessment

**Prepare:** read the CV, plan questions linked to the criteria, set the time and room, and invite appropriately.

**Structured interviews** are the fairest and most reliable. Ask **all** candidates the **same core questions,** in the same order, and score each answer using a guide.

**Types of questions:**

- **Behavioural:** "Tell me about a time when...". Past behaviour predicts future behaviour. Use **STAR:** the **S**ituation, the **T**ask, the **A**ction the candidate took, and the **R**esult.
- **Situational:** "What would you do if...?"
- **Technical or knowledge:** test required skills.
- **Motivation and fit:** why this role and this business.

Examples: *"Tell me about a time you dealt with an angry customer. What happened and what did you do?"* and *"A customer says the price on the shelf is lower than at the till. What do you do?"*

**During the interview:** put the candidate at ease, explain the process, listen more than you talk, take notes, give them the chance to ask questions, and describe the role honestly, including its challenges.

**Other assessments:** a practical test (for example a till exercise or a writing task), a work trial, a presentation, a case study or a short aptitude test. Make sure they relate to the job.

**Decide using the evidence,** scoring each candidate against the criteria, ideally with a second interviewer. Avoid illegal or inappropriate questions about marriage, pregnancy plans, religion, tribe or family responsibilities.

## References, offers and fairness

**References:** contact previous employers (with the candidate's permission) to confirm dates, role and performance, and ask specific questions: *"Would you re-employ this person? What were their strengths? Why did they leave?"* Verify qualifications and, where the job requires it (handling cash, security), appropriate background checks within the law.

**The offer:**

1. Phone the successful candidate and then confirm in **writing:** job title, start date, pay and benefits, hours, probation, notice period, and conditions (such as satisfactory references).
2. Give them time to consider.
3. Be ready to **negotiate** within your pay structure, and keep it fair compared with others in similar roles.
4. When they accept, send the **contract** (module 9) and prepare their induction.
5. **Tell the unsuccessful candidates** politely.

**Fairness:** treat all candidates equally, document decisions and base them on job-related criteria. Under the Constitution and other laws, discrimination on grounds such as ethnic group, sex, religion or circumstances of birth is prohibited, and specific protections exist for people with disabilities. Keep candidate data confidential and delete it when no longer needed.

Measure your process: **time to hire** (days from advert to acceptance), **cost per hire** (adverts, agency fees, staff time ÷ hires), **quality** (performance and retention of new hires).

## Try it

```task
{
  "id": "hrpm-m03-t1",
  "prompt": "Write a **job advert** (80 to 150 words) for a role of your choice: title, short business summary, main duties, essential requirements, location and hours, pay or pay range, how to apply and a closing date, and a line saying no fee is charged.",
  "minutes": 15,
  "rows": 10,
  "placeholder": "Cashier wanted ...",
  "rules": [
    { "label": "Has a job title", "pattern": "wanted|vacancy|hiring|we are looking|position|role|job" },
    { "label": "States duties", "pattern": "duties|you will|responsibilit" },
    { "label": "States requirements", "pattern": "requirements|you must|essential|you have|experience" },
    { "label": "States pay in naira", "pattern": "₦\\s?\\d" },
    { "label": "States how to apply and a closing date", "pattern": "apply[\\s\\S]*(closing|deadline|by )|(closing|deadline)[\\s\\S]*apply" },
    { "label": "Says no fee is charged", "pattern": "no fee|free of charge|do not pay|never ask|not charge|no payment" },
    { "label": "Between 80 and 150 words", "minWords": 80, "maxWords": 155 }
  ],
  "sample": "Shop Cashier wanted at Fresh Mart, Ikeja. We are a busy supermarket looking for an honest, friendly cashier to join our team. Duties: scan items, take payments by cash, card and transfer, balance the till each shift and help customers. Requirements: WAEC or equivalent, good arithmetic, and a polite manner; cash-handling experience is an advantage. Location and hours: Ikeja, shifts of 8 hours including weekends. Pay: ₦120,000 a month plus pension. To apply, send your CV to jobs@freshmart.example by Friday 28 March. No fee is charged at any stage of our recruitment, and we will never ask applicants to pay anything.",
  "required": true
}
```

```task
{
  "id": "hrpm-m03-t2",
  "prompt": "Score **Candidate A** with weights **experience 40%, skills 30%, education 20%, communication 10%**. Scores out of 5: **4, 3, 5, 3**. Show each weighted score and the total out of 5, and say why you decided the weights before reading CVs.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Experience = ...",
  "rules": [
    { "label": "Experience 1.6", "pattern": "1\\.6" },
    { "label": "Skills 0.9", "pattern": "0\\.9" },
    { "label": "Education 1.0", "pattern": "1\\.0|\\b1\\b" },
    { "label": "Total of 3.8", "pattern": "3\\.8" },
    { "label": "Explains fairness or bias", "pattern": "fair|bias|consistent|objective|same criteria|favour" }
  ],
  "sample": "Experience = 4 x 0.4 = 1.6. Skills = 3 x 0.3 = 0.9. Education = 5 x 0.2 = 1.0. Communication = 3 x 0.1 = 0.3.\nTotal = 1.6 + 0.9 + 1.0 + 0.3 = 3.8 out of 5.\nI decide the weights before reading CVs so that every candidate is judged by the same criteria, which keeps the process fair and reduces bias.",
  "required": true
}
```

```task
{
  "id": "hrpm-m03-t3",
  "prompt": "Write **six structured interview questions** for your role: at least three **behavioural** (\"Tell me about a time...\") and one **situational**. One per line, each ending with a question mark. Add what a strong answer would include on the same line after the question.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Tell me about a time ...? Strong answer: ...",
  "rules": [
    { "label": "Six lines", "minLines": 6 },
    { "label": "At least three behavioural questions", "pattern": "tell me about a time|describe a time|give an example", "min": 3 },
    { "label": "A situational question", "pattern": "what would you do|how would you handle|if a customer|if you" },
    { "label": "Every line has a question mark", "pattern": "\\?", "perLine": true },
    { "label": "Says what a strong answer includes", "pattern": "strong answer|good answer|look for" }
  ],
  "sample": "Tell me about a time you dealt with an angry customer. What did you do? Strong answer: stays calm, listens, solves it and follows up.\nTell me about a time you made a mistake with money or stock. What happened? Strong answer: admits it, reports it quickly and fixes the cause.\nDescribe a time you worked under pressure. How did you cope? Strong answer: prioritises and keeps accuracy.\nGive an example of when you helped a colleague? Strong answer: teamwork and initiative.\nWhat would you do if the till is short by ₦5,000 at the end of your shift? Strong answer: recounts, checks receipts, reports honestly.\nWhy do you want this job and what do you want to learn here? Strong answer: genuine interest and realistic goals.",
  "required": false
}
```

Next lesson: onboarding and induction.
