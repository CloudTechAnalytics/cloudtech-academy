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

> [!TIP]
> Right-click any part of a page in Chrome and choose **Inspect** to see its HTML and CSS. You can change values there to test ideas before editing your file.

## Try it

1. Create `style.css`, link it, and paste the starting style.
2. Change the main colour to one you like (try a site like coolors.co).
3. Wrap two or three projects in `<div class="card">` inside a `<div class="projects">`, and add the flexbox rules.
4. Make your browser window narrow to check it still looks good on a phone.
