---
title: "CSS: The Style"
minutes: 25
summary: Style your page with colours, fonts, spacing and a simple layout, and make it look good on a phone.
---

## Connect a stylesheet

CSS lives in its own file. In your `my-website` folder, create `style.css`, then link it inside the `<head>` of `index.html`:

```html
<link rel="stylesheet" href="style.css" />
```

## How CSS rules work

A rule has a **selector** (what to style) and **declarations** (how to style it):

```css
h1 {
  color: #1d4ed8;
  font-size: 40px;
}
```

This makes every `<h1>` blue and 40 pixels tall. Common selectors:

| Selector | Styles | Example |
| :-- | :-- | :-- |
| `p` | Every `<p>` | `p { line-height: 1.6; }` |
| `.card` | Anything with `class="card"` | `<div class="card">` |
| `#contact` | The one element with `id="contact"` | `<section id="contact">` |

![A CSS rule h1 with color and font-size, labelled selector, property and value, with the resulting blue heading; and three common selectors: an element, a class and an id](/images/courses/web/css-rule.svg "A rule is a selector plus property: value declarations.")

## A clean starting style

Paste this into `style.css`:

```css
body {
  font-family: system-ui, sans-serif;
  color: #1f2937;
  background: #f9fafb;
  max-width: 720px;
  margin: 0 auto;
  padding: 24px;
  line-height: 1.6;
}

h1 {
  color: #1d4ed8;
  margin-bottom: 4px;
}

a {
  color: #1d4ed8;
}

.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}
```

`max-width` and `margin: 0 auto` keep the text a comfortable width and centre it.

## The box model

Every element is a box. From the inside out:

- **content:** the text or image
- **padding:** space inside the border
- **border:** the line around it
- **margin:** space outside, between boxes

## Put things side by side with flexbox

```css
.projects {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.projects .card {
  flex: 1 1 200px;
}
```

Cards sit in a row on wide screens and wrap onto new lines on phones.

![Four cards in one row on a wide screen and stacked one per row on a phone, from the same flexbox CSS with flex-wrap and a gap](/images/courses/web/flexbox.svg "Flexbox: a row of cards on wide screens that wraps on phones.")

> [!TIP]
> Right-click any part of a page in Chrome and choose **Inspect** to see its HTML and CSS. You can change values there to test ideas before editing your file.

## Try it

```answer
{
  "id": "web-m02-a1",
  "prompt": "In the box model, which layer is the space **outside** the border, between one box and the next?",
  "answer": "margin",
  "format": "text",
  "accept": ["the margin", "margins"],
  "explanation": "Padding is inside the border; margin is outside it.",
  "required": true
}
```

```answer
{
  "id": "web-m02-a2",
  "prompt": "Which selector styles every element with `class=\"card\"`? Type the selector only.",
  "answer": ".card",
  "format": "text",
  "explanation": "A dot selects a class; a hash (#) selects an id; a plain name (p) selects a tag.",
  "required": true
}
```

```task
{
  "id": "web-m02-t1",
  "prompt": "Create `style.css`, link it, style your page, and put your projects in cards laid out with flexbox. Paste your **whole `style.css`** here. It needs: a `body` rule with a font, a colour of your choice, a `max-width` and `margin: 0 auto`; a `.card` rule with padding and rounded corners; and a `.projects` rule using flexbox with wrapping and a gap.",
  "minutes": 20,
  "rows": 16,
  "placeholder": "body {\n  font-family: ...;\n}",
  "rules": [
    { "label": "A body rule with a font-family", "pattern": "body\\s*\\{[^}]*font-family\\s*:" },
    { "label": "The body has a max-width and margin: 0 auto to centre it", "pattern": "body\\s*\\{[^}]*max-width\\s*:[^}]*margin\\s*:\\s*0\\s+auto|body\\s*\\{[^}]*margin\\s*:\\s*0\\s+auto[^}]*max-width\\s*:" },
    { "label": "A colour you chose (a # code or rgb)", "pattern": "color\\s*:\\s*(#[0-9a-f]{3,8}|rgb)" },
    { "label": "A .card rule with padding and border-radius", "pattern": "\\.card\\s*\\{[^}]*(padding[^}]*border-radius|border-radius[^}]*padding)" },
    { "label": "A .projects rule with display: flex", "pattern": "\\.projects\\s*\\{[^}]*display\\s*:\\s*flex" },
    { "label": "Flexbox wraps on small screens and has a gap", "pattern": "\\.projects\\s*\\{[^}]*(flex-wrap\\s*:\\s*wrap[^}]*gap|gap[^}]*flex-wrap\\s*:\\s*wrap)" }
  ],
  "sample": "body {\n  font-family: system-ui, sans-serif;\n  color: #1f2937;\n  background: #f9fafb;\n  max-width: 720px;\n  margin: 0 auto;\n  padding: 24px;\n  line-height: 1.6;\n}\nh1 {\n  color: #0f766e;\n}\na {\n  color: #0f766e;\n}\n.projects {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n.card {\n  flex: 1 1 200px;\n  background: white;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  padding: 16px;\n}",
  "note": "Make your browser window narrow: the cards should drop onto separate lines, which is how the page will look on a phone.",
  "required": true
}
```
