---
title: Brand and Positioning
minutes: 25
summary: Build a brand identity, position your business clearly, set a consistent tone of voice and write a simple brand guide.
---

## Brand identity

A **brand** is what people think, feel and expect when they meet your business. It is shaped by your name, logo and look, but above all by **what you do and how you treat people.** A brand is a promise, and a reputation is how well you keep it.

**Brand identity** is the visible and verbal expression of the brand:

- **Name and tagline:** easy to say, spell, remember and search for. Check that it is not already taken.
- **Logo:** simple, clear at small sizes (a phone screen, a profile photo) and in one colour.
- **Colours:** one or two main colours and a few supporting ones. Colours carry meaning and make you recognisable.
- **Typography:** one or two fonts, readable on a phone.
- **Imagery:** the style of photos and graphics you use, consistently.
- **Voice:** how you write and speak.
- **Experience:** how customers are treated in messages, delivery and support.

You do not need an expensive designer to start. A clean, consistent look made with simple tools beats a fancy but inconsistent one. Use the same logo, colours and fonts everywhere, so people recognise you.

## Positioning and messaging

**Positioning** is the place you hold in your customers' minds compared with alternatives. It answers: *For whom are we the best choice, and why?* Without a clear position, you compete on price, which is a hard way to win.

A simple **positioning statement:**

*For [target customer] who [need or problem], [brand] is the [category] that [key benefit]. Unlike [alternative], we [reason to believe].*

Example: *For busy professionals in Lagos who have no time to cook, FreshBox is the healthy meal subscription that delivers balanced lunches to the office. Unlike fast food or canteens, we cook with fresh ingredients and deliver on time, every working day.*

Good positioning is **specific** (a clear audience), **different** (not what every competitor says), **valuable** (customers care) and **believable** (you can prove it).

**Messaging** turns positioning into words. Create:

- A **core message:** one sentence for the main promise.
- **Three supporting messages:** proof points or benefits.
- **Audience versions:** the same promise, phrased for each segment.
- **Proof:** numbers, reviews, awards, guarantees and examples.

Lead with the **customer's problem and benefit**, not with how long you have been in business or your list of features.

## Tone of voice

Your **tone of voice** is your brand's personality in words. Decide how you want to sound, and stay consistent across posts, emails, WhatsApp messages and customer service.

Pick three or four traits, and for each say what it means and what it does not. Example:

| Trait | We are | We are not |
| :-- | :-- | :-- |
| **Friendly** | Warm, welcoming, use first names | Overly casual or jokey with complaints |
| **Clear** | Plain, short sentences, no jargon | Vague, long or technical |
| **Honest** | Open about prices, delivery times and limits | Hyping or hiding things |
| **Helpful** | Practical tips, quick replies | Pushy or salesy |

Tone can adapt (more playful on social media, more careful in an apology), but the personality should be recognisably the same. Write the way your customers speak, and check that your writing sounds like a real person.

## A simple brand guide

A **brand guide** is a short document so that anyone (you, a freelancer, an employee) can produce consistent work. For a small business, one to three pages is enough:

1. **Brand story and mission:** why you exist, in two or three sentences.
2. **Positioning statement** and **core message.**

3. **Audience:** your main segment(s).
4. **Logo:** versions, minimum size, space around it, and what not to do.
5. **Colours:** with their codes (so they can be matched exactly).
6. **Fonts:** names and where to use them.
7. **Imagery style:** examples and rules.
8. **Tone of voice:** traits, do and don't, example phrases.
9. **Examples:** a sample post, a sample email, a sample reply to a complaint.
10. **Contact:** who owns the brand and approves new materials.

Keep it where your team can find it, and update it when the business changes.

## Try it

```task
{
  "id": "dms-m02-t1",
  "prompt": "Write your **positioning statement** using: *For [customer] who [need], [brand] is the [category] that [benefit]. Unlike [alternative], we [reason to believe].*",
  "minutes": 10,
  "rows": 5,
  "placeholder": "For ... who ..., ... is the ... that ... Unlike ..., we ...",
  "rules": [
    { "label": "Starts with 'For' and names a customer", "pattern": "for [a-z]" },
    { "label": "Includes 'who' and a need", "pattern": "who " },
    { "label": "Says 'is the ... that'", "pattern": "is the [^.]* that" },
    { "label": "Contrasts with an alternative using 'Unlike'", "pattern": "unlike" },
    { "label": "Between 25 and 80 words", "minWords": 25, "maxWords": 85 }
  ],
  "sample": "For busy professionals in Lagos who have no time to cook, FreshBox is the healthy meal subscription that delivers balanced lunches to the office every working day. Unlike fast food or canteens, we cook with fresh ingredients, show the nutrition on every box and deliver on time or the next meal is free.",
  "required": true
}
```

```task
{
  "id": "dms-m02-t2",
  "prompt": "Define your **tone of voice**: four traits, each with what you are and what you are not. One trait per line in the form \"Trait: we are ... / we are not ...\".",
  "minutes": 10,
  "rows": 6,
  "placeholder": "Friendly: we are ... / we are not ...",
  "rules": [
    { "label": "Four lines", "minLines": 4 },
    { "label": "Each line has 'we are' and 'we are not'", "pattern": "we are[^\\n]*we are not", "perLine": true },
    { "label": "Includes clear or honest or helpful or friendly", "pattern": "clear|honest|helpful|friendly|warm|professional|playful" }
  ],
  "sample": "Friendly: we are warm and use first names / we are not too casual when handling a complaint\nClear: we are plain and use short sentences / we are not vague or technical\nHonest: we are open about prices and delivery times / we are not hyping or hiding limits\nHelpful: we are practical and reply quickly / we are not pushy or salesy",
  "required": true
}
```

```task
{
  "id": "dms-m02-t3",
  "prompt": "Write your **core message** (one sentence) and **three supporting messages** with proof. One per line, labelled.",
  "minutes": 10,
  "rows": 6,
  "placeholder": "Core message: ...\nSupport 1: ... (proof: ...)",
  "rules": [
    { "label": "Four lines", "minLines": 4 },
    { "label": "Has a core message", "pattern": "core message" },
    { "label": "Has three supporting messages", "pattern": "support 1[\\s\\S]*support 2[\\s\\S]*support 3" },
    { "label": "Includes proof (numbers, reviews, guarantee)", "pattern": "proof|reviews?|\\d+|guarantee|customers" }
  ],
  "sample": "Core message: fresh, healthy lunch delivered to your desk, on time, every working day.\nSupport 1: balanced meals with the nutrition shown on every box (proof: reviewed by a registered dietitian)\nSupport 2: on time or your next meal is free (proof: 96% on-time delivery last quarter)\nSupport 3: loved by busy professionals (proof: 4.8 average rating from 210 reviews)",
  "required": false
}
```

Next lesson: content marketing.
