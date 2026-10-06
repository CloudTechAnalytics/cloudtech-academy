---
title: Design with Canva
minutes: 35
handsOn: 15
summary: Design a clean, professional social post or flyer in Canva, using templates and four rules (contrast, alignment, space, few fonts), check it the way viewers will see it, and download it in the right format.
---

## Get started

**Canva** is a free online design tool at **canva.com**, with apps for phone and computer. Sign up with your email or Google account. The free plan is enough for this module; items marked with a crown need a paid plan.

On the home page, search for what you want to make, and Canva opens a blank page in the right size:

| You're making | Search for | Size |
| :-- | :-- | :-- |
| A square Instagram or Facebook post | "Instagram post" | 1080 × 1080 pixels |
| A story, Reel cover or WhatsApp status | "Instagram story" | 1080 × 1920 pixels (tall) |
| A printed flyer | "Flyer" | A4 or A5 |

![Canvas sizes for a square post, a tall story and a printed flyer, the three export formats PNG, JPG and PDF Print, and sharing a view link](/images/courses/design-content/canva-sizes.svg "Pick the size first; export in the right format.")

Pick a **template** and click it to open it in the editor. Starting from a template isn't cheating; it gives you a layout that already works, and you'll change everything that matters.

## What goes wrong: a flyer, before and after

Here's a real-style flyer described element by element. It's for a weekend coding bootcamp.

**Before:**

- A busy photo of a computer lab fills the background.
- On top of it, in thin white letters: "LEARN CODING", then "Weekend Bootcamp for Beginners Aged 16-25 in Port Harcourt, Saturday and Sunday 10am to 4pm, ₦15,000 Only, Limited Spaces, Laptops Provided, Lunch Included, Certificate at the End, Call or WhatsApp 0806 555 0199 to Register".
- Five different fonts: one handwritten, one bold, one italic, one "techy", one plain.
- Text placed wherever there was space; some lines start at the left edge, some centred, one squeezed against the right edge.
- The logo is the same size as the headline.

It's hard to read, nothing stands out, and it looks rushed. Every problem is one of four rules:

| Rule | What it means | What went wrong | The fix |
| :-- | :-- | :-- | :-- |
| **Contrast** | Text must stand out from what's behind it | Thin white text on a busy photo | A dark solid shape behind the text, or a plain background with the photo beside it |
| **Alignment** | Things line up along invisible lines | Left, centred and right all mixed | Align everything left (or everything centred). Drag until Canva's pink guide lines appear |
| **Space** | Empty space around things lets the eye rest | One wall of text, nothing left out | Cut the text to essentials; keep a margin from every edge |
| **Few fonts** | One or two fonts at most | Five | One bold font for the headline, one plain font for everything else |

![A flyer before and after: a busy photo with thin text and many fonts, then a clean layout with a dark panel, left alignment, space, two fonts and the headline biggest](/images/courses/design-content/canva-rules.svg "Contrast, alignment, space, few fonts.")

And one more decision above all four: **what should people see first?** Make that the biggest thing.

**After:**

- Headline, big and bold: **"Learn to code in one weekend"**.
- Below it, three short lines: **Sat & Sun, 10am-4pm · Port Harcourt** / **₦15,000, laptops and lunch included** / **Ages 16-25, no experience needed**.
- At the bottom, the action, clearly separated: **WhatsApp 0806 555 0199 to book**.
- The photo moved to the top half, text on a plain dark panel below it. Two fonts. Everything aligned left. The logo small, in a corner.

Same information, far fewer words, and you can read it in three seconds.

## Make it yours

Replace the template's content with your own:

- **Text:** click any text box to edit it. Headlines of five or six words beat sentences.
- **Photos:** use **Uploads** to add your own pictures, then drag one onto a template photo to swap it in.
- **Colours:** click an element, then the colour square in the toolbar. Use two or three brand colours, consistently.
- **Logo:** upload it and place it in a corner, small.

> [!TIP]
> Designing several things for the same business? Keep your colours and fonts the same every time, so people recognise you. The free plan lets you keep a simple colour palette; paid plans add a full **Brand Kit**.

## Check, download and share

**Check it small.** Zoom out until the design is the size of a phone post in a feed. Can you read the headline? Is it obvious what to do next? If not, make the important thing bigger and cut something.

**Download** with **Share → Download**:

- **PNG** for social posts and anything with text (sharpest).
- **JPG** for photo-heavy images where a smaller file matters.
- **PDF Print** for flyers you'll print.

**Share a link.** **Share → Copy link** gives a view link anyone can open: useful for getting feedback, and for this module's last task.

To make the same design in another size (a post into a story), use **Resize** (a paid feature), or create a new design in the new size and copy your elements across.

## Try it

```answer
{
  "id": "dce-m02-a1",
  "prompt": "A poster has bright yellow text on a light grey background, and people say they can't read it from a distance. Which of the four rules is it breaking? (One word.)",
  "answer": "contrast",
  "format": "text",
  "required": true
}
```

```answer
{
  "id": "dce-m02-a2",
  "prompt": "You're sending a flyer to a print shop. Which download type should you choose in Canva? (Two words.)",
  "answer": "PDF Print",
  "format": "text",
  "accept": ["pdf", "print pdf", "pdf (print)"],
  "required": true
}
```

```task
{
  "id": "dce-m02-t1",
  "prompt": "Before you design, write a **design brief** for a real post or flyer, one item per line: the **size** (e.g. Instagram post), the **headline** (6 words or fewer), up to **three short detail lines**, the **call to action**, and your **two fonts or colours**.",
  "minutes": 6,
  "rows": 8,
  "placeholder": "Size: Instagram post\nHeadline: ...\nDetails: ...\nAction: ...\nFonts: ...",
  "rules": [
    { "label": "Says the size or format (Instagram post, story, flyer, A4…)", "pattern": "instagram|story|post|flyer|a4|a5|whatsapp|1080|poster|facebook|linkedin" },
    { "label": "Has a headline line of six words or fewer", "pattern": "^\\s*headline\\s*:\\s*(\\S+[ \\t]+){0,5}\\S+[ \\t]*$" },
    { "label": "Has a call to action (book, call, WhatsApp, visit, register, order…)", "pattern": "book|call|whatsapp|visit|register|order|dm|sign up|buy|apply|scan|link" },
    { "label": "Names your fonts or colours", "pattern": "font|colou?r|navy|white|black|gold|green|red|blue|yellow|orange|purple|pink|grey|gray|montserrat|poppins|roboto|inter|arial|open sans|playfair" },
    { "label": "At least five lines", "minLines": 5 }
  ],
  "sample": "Size: Instagram post (1080 × 1080)\nHeadline: Learn to code in one weekend\nDetails: Sat & Sun, 10am-4pm, Port Harcourt / ₦15,000, laptops and lunch included / Ages 16-25, no experience needed\nAction: WhatsApp 0806 555 0199 to book\nFonts and colours: Montserrat Bold and Open Sans; navy, white and one gold accent",
  "note": "Deciding the words before you open Canva is what stops the wall-of-text flyer. The design then only has to make the headline biggest and the action obvious.",
  "required": true
}
```

```task
{
  "id": "dce-m02-t2",
  "prompt": "Make the design in Canva from your brief, check it against the four rules, download it, then **paste its Canva view link** here (Share → Copy link). Add one line saying which rule you had to fix.",
  "minutes": 2,
  "rows": 3,
  "placeholder": "https://www.canva.com/design/...\nI fixed ...",
  "rules": [
    { "label": "A Canva design link", "pattern": "https?://(www\\.)?canva\\.com/design/\\S+" },
    { "label": "Says which rule you fixed (contrast, alignment, space or fonts)", "pattern": "contrast|align|space|spacing|font" }
  ],
  "sample": "https://www.canva.com/design/DAGxxxxxxxx/view\nI fixed contrast: my headline was white on a busy photo, so I put a dark panel behind it.",
  "required": true
}
```
