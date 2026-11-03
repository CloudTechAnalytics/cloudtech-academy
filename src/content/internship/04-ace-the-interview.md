---
title: Ace the Interview
minutes: 25
summary: Prepare for common internship interview questions, answer with the STAR method, handle online interviews, and follow up afterwards.
---

## Before the interview

- **Research the organisation:** what it does, its products or services, and any recent news. Read its website and LinkedIn page.
- **Re-read the advert** and your application.
- **Prepare three stories** from school, projects, volunteering or work that show your skills.
- **Plan logistics:** the address and travel time, or for online interviews the link, a charged laptop, data and a quiet room.

## Common questions

| Question | What they want to know |
| :-- | :-- |
| "Tell me about yourself." | A 60-second summary: studies, skills, why this role |
| "Why do you want this internship?" | You've researched them and have a real reason |
| "Tell me about a time you worked in a team." | How you collaborate |
| "What's your biggest weakness?" | Self-awareness, and what you're doing about it |
| "Do you have any questions for us?" | Interest. Always have two ready |

## Answer with STAR

For "tell me about a time…" questions, use **STAR**:

- **Situation:** the background, in one sentence.
- **Task:** what you needed to do.
- **Action:** what **you** did (say "I", not "we").
- **Result:** what happened, with a number if you can.

> **Example:** "In my second year, our departmental dinner had 40% fewer sign-ups than planned two weeks before the date (**S**). As publicity lead, I had to fill the tickets (**T**). I designed Canva posters, set up a Google Form and asked each class rep to share it in their WhatsApp groups (**A**). We sold out three days before the event (**R**)."

![The STAR method with an example: situation, task, action and result for a student who filled a club meeting](/images/courses/internship/star.svg "STAR: Situation, Task, Action, Result.")

## Online interviews

- Test the link, camera and microphone the day before.
- Sit facing a window or light, with a plain background.
- Look at the camera when you speak, not your own face.
- Keep your phone on silent and close other tabs.
- Have your CV and notes nearby, but don't read from them.

## Good questions to ask them

- "What would a typical day look like for an intern?"
- "What would success look like at the end of the internship?"
- "Who would I be working with most closely?"

![What to do before, during and after an internship interview, and three good questions to ask the employer](/images/courses/internship/interview-journey.svg "Before, during and after the interview.")

## After the interview

Send a short thank-you email the same day:

```text
Subject: Thank you – Data Analyst Intern interview

Dear Mr Okafor,

Thank you for speaking with me today about the Data Analyst Intern role.
I enjoyed hearing about how your team uses Power BI for weekly sales
reviews, and I'm even more keen to join.

Kind regards,
Efosa Igbinedion
```

## Try it

```task
{
  "id": "intern-m04-t1",
  "prompt": "Write your **\"Tell me about yourself\"** answer: about 60 seconds spoken (roughly 110 to 170 words). Cover what you study, one or two skills with evidence, and why you want **this kind** of internship. Then practise it out loud.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "I'm a ... student at ...",
  "rules": [
    { "label": "Says what you study and where", "pattern": "\\b(i'm|i am)\\b[^.\\n]*(student|studying|graduate)" },
    { "label": "Names a skill or tool", "pattern": "excel|sql|python|canva|power bi|google|writing|research|sales|customer|design|social media|data|accounting|coding" },
    { "label": "Gives evidence (a project, role or result with a number)", "pattern": "\\d" },
    { "label": "Says why you want this internship", "pattern": "want|keen|interested|excited|looking for|hope to|would like" },
    { "label": "About 60 seconds spoken (110 to 170 words)", "minWords": 110, "maxWords": 170 }
  ],
  "sample": "I'm a 300 level Statistics student at the University of Benin. Most of my best work has been with data: in my second year I cleaned and analysed survey responses from 400 students for a departmental project on transport costs, and presented the results to our head of department. Since then I've taught myself Excel pivot tables and Power BI, and I built a dashboard of a fictional distributor's sales that I've put in my portfolio. Outside class, I'm treasurer of our departmental association, which has taught me to keep records accurate and explain numbers to people who don't like them. I'm looking for a data internship because I want to see how real businesses use data to make decisions, and to learn from analysts who do it every day. Your team's weekly sales reviews are exactly the kind of work I'd like to be part of.",
  "required": true
}
```

```task
{
  "id": "intern-m04-t2",
  "prompt": "Write one **STAR story** about solving a problem or working in a team, one part per line: `Situation:`, `Task:`, `Action:` (what **you** did, using \"I\") and `Result:` (with a number if you can).",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Situation: ...\nTask: ...\nAction: ...\nResult: ...",
  "rules": [
    { "label": "Situation:", "pattern": "^\\s*situation\\s*:\\s*\\S" },
    { "label": "Task:", "pattern": "^\\s*task\\s*:\\s*\\S" },
    { "label": "Action: in the first person (I…)", "pattern": "^\\s*action\\s*:[^\\n]*\\bI\\b" },
    { "label": "Result: with a number or clear outcome", "pattern": "^\\s*result\\s*:[^\\n]*(\\d|doubled|half|all |every|on time|sold out|first)" }
  ],
  "sample": "Situation: Two weeks before our departmental dinner, sign-ups were 40% below what we needed to cover the venue.\nTask: As publicity lead, I had to fill the gap without extra budget.\nAction: I asked class reps for their WhatsApp groups, made three short posts with a countdown in Canva, and offered a group price for tables of five.\nResult: We reached 120 sign-ups, 20 more than our target, and covered the venue cost.",
  "required": true
}
```

```task
{
  "id": "intern-m04-t3",
  "prompt": "Write **two questions** you'd ask an interviewer at the end, one per line. They should show you're thinking about doing the job well, not about time off.",
  "minutes": 3,
  "rows": 3,
  "placeholder": "...?\n...?",
  "rules": [
    { "label": "Two questions", "pattern": "\\?", "min": 2 },
    { "label": "About the work, the team or success in the role", "pattern": "day|week|success|team|work with|learn|project|expect|measure|first month|tools" },
    { "label": "Not about leave, pay or finishing early", "pattern": "leave|holiday|days off|salary|pay|finish early|work from home every", "absent": true }
  ],
  "sample": "What would success look like for an intern at the end of the six months?\nWhich tools does the team use most for its weekly reports?",
  "required": true
}
```

Then do a practice video call with a friend using your answers, and ask for honest feedback on one thing to improve.
