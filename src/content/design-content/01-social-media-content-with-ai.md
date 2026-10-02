---
title: Social Media Content with AI
minutes: 30
handsOn: 5
summary: Pick three content themes, plan two weeks of posts with AI and make the plan realistic, write captions in your own brand voice with a hook and a call to action, and turn one idea into posts for several platforms.
---

## Decide what you post about

Posting whatever comes to mind is exhausting, and followers can't tell what you're for. Choose **three content themes** (sometimes called content pillars) that your audience cares about, and make almost every post fit one of them.

For **Glow by Ada**, a small hair salon in Wuse, Abuja, whose customers are mostly working women aged 25 to 40:

1. **Show the work:** before-and-after photos, new styles, transformations.
2. **Help the customer:** hair-care tips, what to ask your stylist, how to make styles last.
3. **Build trust:** reviews, the team, behind the scenes, how the salon keeps tools clean.

Notice that only one of the three is "selling". People follow accounts that are useful or interesting; the bookings come from trust.

If you're stuck, ask AI, and give it your real business and customers:

```text
I run a small hair salon in Wuse, Abuja. Most customers are working women
aged 25-40 who book on weekends. Suggest three Instagram content themes and
explain in one line why each would interest these customers.
```

## Plan two weeks, then make it real

Ask AI for a calendar you can edit:

```text
Create a 2-week Instagram content calendar for my salon, 3 posts a week
(Tuesday, Thursday, Saturday), using these themes: show the work,
hair-care tips, build trust. Table columns: date, theme, post idea,
format (photo, carousel or reel).
```

A typical answer:

| Date | Theme | Post idea | Format |
| :-- | :-- | :-- | :-- |
| Tue 3 | Show the work | Before and after: knotless braids | Photo |
| Thu 5 | Help the customer | 5 ways to make braids last longer | Carousel |
| Sat 7 | Build trust | Meet our stylist Chioma | Photo |
| Tue 10 | Show the work | 30-second time-lapse of a silk press | Reel |
| Thu 12 | Help the customer | Satin scarf or bonnet: which is better? | Reel |
| Sat 14 | Build trust | Customer review of the month | Photo |

Now **edit it like the owner**:

- **Remove what you can't actually make.** No camera stand for a time-lapse? Swap it for a photo carousel of the steps.
- **Add real dates:** your promotions, public holidays, paydays (end of month is when bookings rise).
- **Check you have the material:** permission from a customer to post her photo and review.

Put the final plan where you'll see it: a spreadsheet, a notebook, your phone calendar.

## Write captions in your voice

AI captions often sound like every other business ("Elevate your look with our premium services!"). Two things fix that: **describe your brand voice**, and **show an example you like**.

```text
Our voice is warm, confident and a little playful. Short sentences, no
slang, no exclamation marks in every line. A caption we liked:
"Braids that last. Edges that stay happy. Book your Saturday slot now."

Write 3 caption options for a before-and-after photo of knotless braids.
Each needs a hook in the first line, one idea, a clear call to action,
and 3-5 relevant hashtags.
```

Compare a generic caption with one in the salon's voice:

```text
Generic:
Elevate your look with our premium braiding services! ✨💯 Our talented
stylists are here to make you look your absolute best. Contact us today!!!
#hair #braids #beauty #style #love #instagood #fashion #salon #abuja
```

```text
In the salon's voice:
Six hours of work. Six weeks of easy mornings.
Chioma's knotless braids are light on the scalp and neat at the edges, so
they still look fresh at your next meeting.
Book your Saturday slot: link in bio or WhatsApp 0803 555 0142.
#knotlessbraids #abujahair #wusesalon #protectivestyles
```

What a good caption has:

- **A hook** in the first line, because that's all people see before "more".
- **One idea**, not five.
- **A call to action**: book, reply, save, share, visit, with how.
- **A few specific hashtags** (3 to 5 your customers actually search), not 15 generic ones.

Read every caption before posting. Change anything that doesn't sound like you, and never post a price, promise or claim you haven't checked.

## One idea, many platforms

A good idea can feed several platforms, each in its own style:

```text
Take this tip: "Sleep with a satin scarf to keep braids neat longer."
Turn it into: an Instagram caption; a 20-second reel script with what to
show in each shot; a WhatsApp status under 20 words; and a short LinkedIn
post about what running a salon has taught me about customer care.
```

- **Reels and TikTok** live or die in the first two seconds: start with the result or the problem, not your logo.
- **WhatsApp status** is short and personal.
- **LinkedIn** is about you as a professional or business owner, not a sales flyer.

> [!WARNING]
> Use only photos you own or have permission to use, and ask customers before posting their faces. If you use AI-generated images, don't present them as real results.

## Try it

Use your own business, club, cause or personal brand, or an invented one if you prefer.

```task
{
  "id": "dce-m01-t1",
  "prompt": "Write your **three content themes**, one per line: the theme, a colon, and an example post for it. Make sure at most one is about selling.",
  "minutes": 5,
  "rows": 4,
  "placeholder": "Show the work: before-and-after of ...\n...",
  "rules": [
    { "label": "Three themes, one per line, each with an example after a colon", "pattern": "^[^:\\n]{3,}:[ \\t]*\\S", "min": 3 },
    { "label": "Each theme has a concrete example (at least 25 words in total)", "minWords": 25 }
  ],
  "sample": "Show the work: before-and-after of a client's knotless braids\nHelp the customer: 5 ways to make braids last longer\nBuild trust: meet our stylist Chioma and how she started",
  "required": true
}
```

```task
{
  "id": "dce-m01-t2",
  "prompt": "Write **one caption** for a real post you'd make: a hook on the first line, one idea, a call to action that says how, and 3 to 5 specific hashtags on the last line.",
  "minutes": 7,
  "rows": 7,
  "placeholder": "Hook line\n\nOne idea...\nCall to action...\n#tag #tag #tag",
  "rules": [
    { "label": "Starts with a short hook (first line under 12 words)", "pattern": "(?<![\\s\\S])\\s*(\\S+[ \\t]+){0,11}\\S+[ \\t]*\\n" },
    { "label": "Has a call to action (book, order, DM, WhatsApp, visit, reply, save, link in bio…)", "pattern": "book|order|dm|whatsapp|call|visit|reply|save|share|link in bio|message|shop|register|sign up|come" },
    { "label": "3 to 5 hashtags", "pattern": "#\\w+", "min": 3 },
    { "label": "Not more than 5 hashtags", "pattern": "(#\\w+[^#]*){6}", "absent": true },
    { "label": "No piles of exclamation marks or 'elevate your'", "pattern": "!!|elevate your|look your absolute best", "absent": true }
  ],
  "sample": "Six hours of work. Six weeks of easy mornings.\nChioma's knotless braids are light on the scalp and neat at the edges, so they still look fresh at your next meeting.\nBook your Saturday slot: link in bio or WhatsApp 0803 555 0142.\n#knotlessbraids #abujahair #wusesalon #protectivestyles",
  "required": true
}
```

```task
{
  "id": "dce-m01-t3",
  "prompt": "Turn the same idea into a **20-second reel script**: one line per shot, each starting with its time (e.g. `0-2s:`), saying what's on screen. The first shot must hook the viewer.",
  "minutes": 7,
  "rows": 7,
  "placeholder": "0-2s: ...\n2-6s: ...\n...",
  "rules": [
    { "label": "At least four shots, each starting with a time like 0-2s:", "pattern": "^\\s*\\d+\\s*[-–]\\s*\\d+\\s*s(ec)?\\s*:", "min": 4 },
    { "label": "Starts at 0 seconds", "pattern": "^\\s*0\\s*[-–]" },
    { "label": "Ends with a call to action", "pattern": "book|order|dm|whatsapp|follow|visit|link|save|share|call|message" }
  ],
  "sample": "0-2s: Close-up of the finished braids swinging as the client turns. Text: \"6 weeks later and still neat?\"\n2-7s: Chioma ties a satin scarf on a client at night, in the mirror.\n7-13s: Morning: scarf off, braids still neat. Text: \"Satin keeps the frizz away.\"\n13-18s: Quick cuts of three more clients' braids.\n18-20s: Salon front. Text: \"Book your Saturday slot. Link in bio.\"",
  "required": true
}
```
