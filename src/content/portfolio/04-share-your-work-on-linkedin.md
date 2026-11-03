---
title: Share Your Work on LinkedIn
minutes: 20
summary: Write a professional LinkedIn post about a project, badge or achievement that people actually read, without sounding like you're bragging.
---

## Why post at all

Recruiters, lecturers and future colleagues notice people who **show their work**. One good post about a project can do more than months of silently applying. And every post is proof of your skills that stays on your profile.

## The shape of a good post

Most strong LinkedIn posts follow a simple pattern:

1. **Hook (1–2 lines):** why someone should keep reading. LinkedIn shows only the first lines before "…see more".
2. **Story:** what you did, the challenge, and what you learned.
3. **Result or proof:** a number, a picture, a link.
4. **Thanks and a question:** credit people who helped, and invite a reply.

![A LinkedIn post with four parts: a hook that shows before see more, the story, the proof, and thanks with a question](/images/courses/portfolio/post-anatomy.svg "Hook, story, proof, thanks and a question.")

## An example

```text
I just built my first sales dashboard, and it found something I didn't
expect.

For the CloudTech Academy Power BI course, I analysed 4,000 orders from
a (fictional) drinks distributor. Revenue grew 19% overall, but one
region's sales had nearly halved.

What I learned:
→ Clean data first. Half my time was fixing dates and duplicates.
→ One clear chart beats five busy ones.
→ The interesting finding is usually in the breakdown, not the total.

Thanks to my study group for testing the dashboard with me.
Which tool do you use for analysis: Excel or Power BI?

#PowerBI #DataAnalytics #StudentProject
```

## Tips that make a difference

- **Add a picture:** a screenshot of your work, or your badge or certificate image.
- **Be specific.** "Built a dashboard showing revenue by region" beats "Learned so much!"
- **Keep it honest.** Say "course project" or "practice data" when that's what it is.
- **Tag thoughtfully:** people or organisations genuinely involved, not everyone you know.
- **Use 3–5 relevant hashtags**, not 20.
- **Reply to comments**, especially in the first hour.

> [!TIP]
> Sharing a CloudTech Academy badge? Use the **Share on LinkedIn** button on your badge. It fills in a post and links to your verifiable credential page.

## Posting achievements without bragging

Focus on **what you learned and who helped**, rather than how great you are. "I'm proud to share…" is fine once; a whole post of self-praise isn't. People engage with lessons and stories.

## Try it

Here are two opening lines for the same post. Only the first two lines show before "…see more".

- **A.** *I am very pleased and honoured to announce that I have successfully completed yet another course on my learning journey.*
- **B.** *I just built my first sales dashboard, and it found something I didn't expect.*

```answer
{
  "id": "portf-m04-a1",
  "prompt": "Which opening is the stronger hook? Type the letter.",
  "answer": "B",
  "format": "text",
  "accept": ["b.", "(b)"],
  "explanation": "B is specific and makes you curious about what it found. A is about the poster, not the work, and says nothing anyone would click for.",
  "required": true
}
```

```task
{
  "id": "portf-m04-t1",
  "prompt": "Write a LinkedIn post about one project or badge from your portfolio, with the four parts: a **hook** in the first line, the **story** (what you did and learned), a **result or proof** with a number, and **thanks plus a question**. End with 3 to 5 hashtags.",
  "minutes": 12,
  "rows": 12,
  "placeholder": "Hook...\n\nWhat I did...\nWhat I learned...\n\nThanks to ... Question?\n#tag #tag #tag",
  "rules": [
    { "label": "A short hook on the first line (under 20 words)", "pattern": "(?<![\\s\\S])\\s*(\\S+[ \\t]+){0,19}\\S+[ \\t]*\\n" },
    { "label": "Says what you learned", "pattern": "learn|taught me|lesson|realised|realized|discovered|found out" },
    { "label": "Includes a number or result", "pattern": "\\d" },
    { "label": "Asks readers a question", "pattern": "\\?" },
    { "label": "3 to 5 hashtags", "pattern": "#\\w+", "min": 3 },
    { "label": "Not more than 5 hashtags", "pattern": "(#\\w+[^#]*){6}", "absent": true },
    { "label": "Honest and humble: no \"humbled and honoured\" or \"another milestone\"", "pattern": "humbled|honou?red to announce|another milestone|yet another", "absent": true }
  ],
  "sample": "I just built my first sales dashboard, and it found something I didn't expect.\n\nFor the CloudTech Academy Power BI course, I analysed 4,000 orders from a (fictional) drinks distributor. Revenue grew 19%, but one region's sales nearly halved.\n\nWhat I learned:\n→ Clean data first: half my time was fixing dates and duplicates.\n→ The interesting finding is usually in the breakdown, not the total.\n\nThanks to my study group for testing it with me. Which do you use for analysis: Excel or Power BI?\n#PowerBI #DataAnalytics #StudentProject",
  "required": true
}
```

Read your first two lines on their own: would you click "see more"? If not, rewrite the hook. Then post it, or schedule it for this week. If it's about a CloudTech badge, use the badge's **Share on LinkedIn** button so the post links to your verifiable credential.
