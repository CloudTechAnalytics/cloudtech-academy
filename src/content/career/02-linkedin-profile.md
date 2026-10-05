---
title: A Professional LinkedIn Profile
minutes: 30
summary: Build a LinkedIn profile recruiters can find and trust, using a complete example: a photo that works, a searchable headline, an About section in your own words, and skills spelled the way employers search.
---

## How recruiters find people on LinkedIn

Recruiters don't scroll LinkedIn hoping to bump into you. They **search**, usually with LinkedIn's recruiter tools, by **job title**, **skills**, **location** and keywords, then filter. The words on your profile decide whether you appear in those results at all, and your **photo, name and headline** decide whether anyone clicks.

So a good profile does two jobs:

1. **Gets found:** it contains the words a recruiter would type: "data analyst", "Excel", "Lagos", "customer service".
2. **Gets trusted:** once someone clicks, it quickly shows who you are, what you can do and proof that you've done it.

Your CV from the last module is your best source. The facts are the same; the profile just tells them in a more personal voice.

## A complete example profile

Here's the LinkedIn profile that goes with Tolulope's CV. Read it top to bottom the way a recruiter would.

```text
PHOTO       Head and shoulders, facing the camera, plain wall, daylight from a window
BANNER      Simple dark-green design: "Excel · SQL · Power BI | Turning sales data into decisions"
NAME        Tolulope Adeyemi
HEADLINE    Junior Data Analyst | Excel, SQL & Power BI | Building sales reports and
            dashboards | Lagos
LOCATION    Lagos, Nigeria
URL         linkedin.com/in/tolu-adeyemi

ABOUT
I turn messy sales data into reports that managers actually use.

During NYSC at Kolanut Distribution, I built a weekly sales dashboard in Excel
that cut a 3-hour manual report to 20 minutes, and cleaned customer lists from
three branches, removing 140 duplicates. Before that, a SIWES placement at Crestline
Bank taught me how much clear information matters when a customer is waiting.

I work in Excel (pivot tables, XLOOKUP, Power Query), SQL and Power BI, and I'm
completing CloudTech Academy's data courses.

I'm looking for a junior data analyst role in Lagos. Message me here or email
tolu.adeyemi@gmail.com.

EXPERIENCE
Sales Data Assistant (NYSC) · Kolanut Distribution Ltd · Mar 2025 - Feb 2026
- Built a weekly sales dashboard in Excel, cutting report preparation from
  3 hours to 20 minutes.
- Cleaned and merged customer lists from 3 branches, removing 140 duplicates.

SKILLS (top five pinned)
Data Analysis · Microsoft Excel · SQL · Power BI · Data Cleaning

LICENCES & CERTIFICATIONS
SQL for Data Analysis · CloudTech Academy · Credential ID CTA-SQL-7K4QM

FEATURED
Link to a sales dashboard project on GitHub, with a screenshot
```

What makes it work:

- **The headline has the searchable words**: the role (Junior Data Analyst), the tools (Excel, SQL, Power BI), what the person does (reports and dashboards) and the city.
- **The About section's first line is a hook.** LinkedIn only shows the opening lines before **"see more"**, so the first sentence has to make someone want to click.
- **Proof comes straight after**, with the same numbers as the CV.
- **It ends with what Tolulope wants and how to get in touch.**
- **Skills are spelled the way adverts spell them**, not "data wizard".

## Photo, banner and URL

- **Photo:** recent, just you, head and shoulders, facing the camera, good light, plain background. A phone photo next to a window works. No group photos, sunglasses, or heavy filters. People trust profiles with a real face.
- **Banner:** optional, but a simple design with your field in a few words beats LinkedIn's blank default. Canva has free "LinkedIn banner" templates.
- **Custom URL:** on your profile, choose **Edit public profile & URL** and set something like `linkedin.com/in/firstname-lastname`. Put it on your CV.

## Headline, About and skills

**Headline** (up to 220 characters). By default LinkedIn fills it with your current job title. Write your own with this formula:

**target role | key skills or tools | what you do or who you help | location (optional)**

| Weak | Strong |
| :-- | :-- |
| Student at UNILAG | Accounting Student at UNILAG \| Excel & Power BI \| Seeking a graduate analyst role |
| Unemployed | Customer Service Professional \| 3 years in retail banking \| Open to CX roles in Lagos |
| Hardworking and passionate | Graphic Designer \| Brand identity & social media design \| Canva, Illustrator \| Ibadan |

![A LinkedIn headline is built from target role, key tools, what you do and city, separated by bars, with two weak headlines rewritten as strong ones](/images/courses/career/headline-formula.svg "A headline is made of the words a recruiter would search for.")

Never write "unemployed" or "looking for job". Describe what you **do** and what you're aiming for.

**About** (up to 2,600 characters, but shorter is better). Write in the **first person**, in four short parts: a one-line hook, proof with numbers, your skills, and what you want plus how to reach you. Three to five short paragraphs is plenty.

![The four parts of a LinkedIn About section: a hook, proof with numbers, skills, and what you want with how to reach you, each with an example line](/images/courses/career/about-parts.svg "Hook, proof, skills, what you want.")

**Skills.** Add the skills that appear in adverts for the jobs you want, using the advert's spelling, and pin your top few so they show first. Skip vague ones like "hardworking", "team player" or "passionate": everyone claims them and nobody searches for them. Show those qualities in your experience instead.

**AI can draft, you decide.** Give an AI assistant your CV and ask for five headline options and a first draft of your About section. Then rewrite it until it sounds like you. Recruiters read a lot of AI-written profiles, and the generic ones ("results-driven professional passionate about leveraging synergies") all sound the same.

```text
Here is my CV. Write 5 LinkedIn headline options under 200 characters, using
the format: target role | key tools | what I do | city. Use only skills and
facts from my CV. Then write an About section in the first person, under 150
words, starting with a one-line hook and ending with what I'm looking for.

[paste your CV]
```

> [!TIP]
> Turn on **Open to work** if you're job hunting. You can choose to show it to **recruiters only**, which hides it from people at your current employer.

## Try it

```task
{
  "id": "career-m02-t1",
  "prompt": "Write your LinkedIn **headline** using the formula **target role | key skills or tools | what you do | location**. Use your own details, or Tolulope's if you're practising.",
  "minutes": 5,
  "rows": 3,
  "placeholder": "Junior Data Analyst | Excel, SQL & Power BI | ...",
  "rules": [
    { "label": "At least three parts separated by |", "pattern": "\\|", "min": 2 },
    { "label": "Names a role or field (analyst, designer, developer, officer, student…)", "pattern": "analyst|designer|developer|engineer|officer|manager|assistant|accountant|marketer|writer|student|graduate|specialist|consultant|executive|representative|professional|nurse|teacher|scientist|lawyer" },
    { "label": "Names at least one skill or tool (Excel, Canva, SQL, customer service…)", "pattern": "excel|sql|power bi|python|canva|figma|illustrator|photoshop|customer|sales|marketing|social media|writing|account|research|design|data|support|project" },
    { "label": "Doesn't say \"unemployed\" or \"looking for job\"", "pattern": "unemployed|looking for (a )?job|jobless", "absent": true },
    { "label": "Fits LinkedIn's headline (under 35 words)", "maxWords": 35 }
  ],
  "sample": "Junior Data Analyst | Excel, SQL & Power BI | Building sales reports and dashboards | Lagos",
  "note": "A recruiter searching \"data analyst Lagos\" or \"Power BI\" finds this headline, and anyone reading it knows in two seconds what Tolulope does.",
  "required": true
}
```

```task
{
  "id": "career-m02-t2",
  "prompt": "Write your **About** section: a one-line hook, a paragraph of proof with at least one number, your skills, and what you're looking for with how to contact you. Put a blank line between paragraphs.",
  "minutes": 12,
  "rows": 12,
  "placeholder": "I turn ... into ...\n\nDuring ...\n\nI'm looking for ...",
  "rules": [
    { "label": "Written in the first person (I, I'm, my)", "pattern": "\\b(I|I'm|I've|my)\\b", "min": 3 },
    { "label": "At least three paragraphs", "minLines": 3 },
    { "label": "Includes a number as proof", "pattern": "\\d" },
    { "label": "Ends with what you want and how to reach you (message, email, connect…)", "pattern": "message|email|e-mail|connect|reach|contact|dm|call" },
    { "label": "Avoids empty buzzwords (passionate, results-driven, synergy, go-getter)", "pattern": "passionate|results-driven|synerg|go-getter|dynamic professional", "absent": true },
    { "label": "Between 60 and 220 words", "minWords": 60, "maxWords": 220 }
  ],
  "sample": "I turn messy sales data into reports that managers actually use.\n\nDuring NYSC at Kolanut Distribution, I built a weekly sales dashboard in Excel that cut a 3-hour manual report to 20 minutes, and cleaned customer lists from three branches, removing 140 duplicates.\n\nI work in Excel (pivot tables, XLOOKUP, Power Query), SQL and Power BI.\n\nI'm looking for a junior data analyst role in Lagos. Message me here or email tolu.adeyemi@gmail.com.",
  "note": "The hook says what Tolulope does in plain words. The proof has numbers. Nothing is claimed that the experience section doesn't back up.",
  "required": true
}
```

```task
{
  "id": "career-m02-t3",
  "prompt": "List the **five skills** you'll pin to the top of your profile, one per line, spelled the way job adverts spell them.",
  "minutes": 3,
  "rows": 6,
  "placeholder": "Microsoft Excel\n...",
  "rules": [
    { "label": "Five skills, one per line", "minLines": 5 },
    { "label": "No vague traits (hardworking, team player, passionate, fast learner)", "pattern": "hard ?working|team player|passionate|fast learner|go-getter|self-motivated", "absent": true },
    { "label": "Each line is a skill, not a sentence (under 6 words)", "pattern": "^\\s*[-•]?\\s*\\S+(\\s+\\S+){0,4}\\s*$", "perLine": true }
  ],
  "sample": "Data Analysis\nMicrosoft Excel\nSQL\nPower BI\nData Cleaning",
  "note": "These match what adverts ask for and what recruiters type into search. Qualities like teamwork belong in your experience bullets, where you can show them.",
  "required": true
}
```

Then make the changes on LinkedIn itself: photo, custom URL, headline, About, skills. Once you've earned this module's badge, add it under **Licences & certifications** with its credential ID and link.
