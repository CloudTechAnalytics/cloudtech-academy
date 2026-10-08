---
title: Colour, Fonts, Backgrounds and Visual Effects
minutes: 35
summary: Make pages look professional. Pick a colour palette, check contrast, style text so it is easy to read, use gradients and backgrounds, add shadows and rounded corners, and organise your design with CSS variables.
---

## Colour

You have already used colour names and hex codes. There are four ways to write a colour, and they are all the same thing underneath: a mix of red, green and blue light.

```css
color: crimson;                 /* a named colour (there are about 140) */
color: #0f766e;                 /* hex: red, green, blue as two digits each */
color: rgb(15 118 110);         /* the same, as decimal numbers 0 to 255 */
color: rgb(15 118 110 / 50%);   /* with transparency (alpha) */
color: hsl(176 77% 26%);        /* hue, saturation, lightness */
```

**HSL** is the friendliest for designing. **Hue** is the colour on a wheel (0 is red, 120 green, 240 blue), **saturation** is how vivid it is, and **lightness** is how light. Keep the hue the same and change the lightness, and you get a whole family of matching shades. Move the sliders in the next example mentally by editing the numbers.

```live
=== html
<div class="swatches">
  <div style="background: hsl(176 77% 12%)">12%</div>
  <div style="background: hsl(176 77% 22%)">22%</div>
  <div style="background: hsl(176 77% 32%)">32%</div>
  <div style="background: hsl(176 60% 50%)">50%</div>
  <div style="background: hsl(176 60% 75%); color: #134e4a">75%</div>
  <div style="background: hsl(176 60% 92%); color: #134e4a">92%</div>
</div>
=== css
body { font-family: system-ui, sans-serif; }
.swatches { display: flex; }
.swatches div {
  flex: 1;
  height: 80px;
  display: grid;
  place-items: center;
  color: white;
  font-weight: bold;
}
```

### Choosing a palette

Do not pick colours at random. A simple method that works:

- **One brand colour** (the colour of your logo, used for buttons and headings), about 10% of the page.
- **Neutral colours**: a near-black for text, a light grey for backgrounds, white, about 60% and 30% of the page.
- **One alert colour** for errors, such as a red, used sparingly.

Sites like **coolors.co** and **realtimecolors.com** let you build and test palettes.

### Contrast: can people read it?

Light grey text on a white background looks stylish, and is unreadable to many people, especially outdoors on a phone. The accessibility standard (WCAG) asks for a **contrast ratio of at least 4.5 to 1** for normal text. Free tools like the **WebAIM Contrast Checker** tell you the ratio for any two colours. Also, Chrome DevTools shows a warning when text has too little contrast.

```live
=== html
<p class="bad">This light grey text is hard to read.</p>
<p class="good">This dark grey text is easy to read.</p>
=== css
body { font-family: system-ui, sans-serif; font-size: 1.2rem; }
.bad  { color: #bbbbbb; }
.good { color: #374151; }
```

## Typography: text that is a pleasure to read

Most of a website is text, so typography is most of the design.

```css
body {
  font-family: "Inter", system-ui, sans-serif;  /* a stack: the first that exists wins */
  font-size: 1rem;           /* 16px, the browser default and a good body size */
  line-height: 1.6;          /* space between lines: 1.5 to 1.7 reads well */
}
h1 {
  font-size: 2.5rem;
  font-weight: 700;          /* 400 normal, 700 bold */
  letter-spacing: -0.02em;   /* tighter for large headings */
  line-height: 1.15;
}
.label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.8rem;
}
```

| Property | What it controls |
| :-- | :-- |
| `font-family` | Which font. Always end the list with `sans-serif` or `serif` as a safety net |
| `font-size`, `font-weight`, `font-style` | Size, boldness, italics |
| `line-height` | The space between lines of text |
| `letter-spacing` | The space between letters |
| `text-align` | `left`, `center`, `right`, `justify` |
| `text-transform` | `uppercase`, `lowercase`, `capitalize` |
| `text-decoration` | Underline, or `none` to remove it from links |
| `text-shadow` | A shadow behind the letters |

Three rules for readable text:

1. **Line height of about 1.5** for body text.
2. **Short lines**: 45 to 75 characters per line. Use `max-width: 65ch` on text blocks.
3. **Enough size**: at least 16px on a phone.

```live
=== html
<article>
  <h1>Why your first website should be simple</h1>
  <p class="meta">Posted 8 October 2026 · 4 min read</p>
  <p>Most beginners try to build everything at once. A simple site that is finished teaches you more than a fancy one that never is. Start with one page, one goal, and one message.</p>
  <p>When it is live, you can improve it one piece at a time, and every improvement is a lesson.</p>
</article>
=== css
body {
  font-family: Georgia, "Times New Roman", serif;
  color: #1f2937;
  background: #fffdf8;
  padding: 24px;
}
article {
  max-width: 62ch;
  margin: 0 auto;
}
h1 {
  font-size: 2.2rem;
  line-height: 1.15;
  letter-spacing: -0.01em;
}
.meta {
  font-family: system-ui, sans-serif;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
}
p {
  font-size: 1.15rem;
  line-height: 1.7;
}
```

### Using fonts from Google Fonts

The fonts on a visitor's computer are limited. For a more distinctive look you can load a free font from **fonts.google.com**. Choose a font, copy the two lines it gives you into your `<head>`, and then use the name in your CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link
  href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
  rel="stylesheet"
/>
```

```css
body { font-family: "Poppins", system-ui, sans-serif; }
```

Use **at most two fonts**, one for headings and one for text, and load only the weights you use, because every font file makes the page slower.

## Backgrounds and gradients

An element can have a background colour, an image, or both.

```css
.hero {
  background-color: #0f766e;
  background-image: url("images/lagos.jpg");
  background-size: cover;       /* fill the box, cropping if needed */
  background-position: center;
  background-repeat: no-repeat;
}
```

You can also draw **gradients** with CSS alone, with no image file, so they load instantly:

```css
background: linear-gradient(135deg, #0f766e, #134e4a);        /* diagonal, two colours */
background: linear-gradient(to right, #f59e0b, #ef4444);       /* left to right */
background: radial-gradient(circle at top right, #5eead4, #0f766e);
```

```live
=== html
<section class="hero">
  <h1>Learn skills that pay</h1>
  <p>Free courses in data, web and business.</p>
  <a href="#">Start learning</a>
</section>
=== css
body { margin: 0; font-family: system-ui, sans-serif; }
.hero {
  background: linear-gradient(135deg, #0f766e, #134e4a);
  color: white;
  text-align: center;
  padding: 72px 24px;
}
.hero h1 {
  font-size: 2.4rem;
  margin: 0 0 8px;
}
.hero a {
  display: inline-block;
  margin-top: 16px;
  background: #fbbf24;
  color: #1f2937;
  padding: 12px 28px;
  border-radius: 999px;
  font-weight: bold;
  text-decoration: none;
}
```

## Shadows, corners and transparency

Small touches make a design feel polished.

```css
.card {
  border-radius: 16px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 12%);  /* x, y, blur, colour */
}
.avatar {
  border-radius: 50%;     /* a perfect circle on a square image */
}
.dim { opacity: 0.6; }
```

```live
=== html
<div class="card">
  <h3>Starter plan</h3>
  <p class="price">₦5,000<span>/month</span></p>
  <a href="#">Choose</a>
</div>
=== css
body {
  background: #f3f4f6;
  font-family: system-ui, sans-serif;
  display: grid;
  place-items: center;
  height: 100vh;
  margin: 0;
}
.card {
  background: white;
  width: 240px;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgb(0 0 0 / 12%);
  text-align: center;
}
.price { font-size: 2rem; font-weight: bold; margin: 8px 0 20px; }
.price span { font-size: 1rem; font-weight: normal; color: #6b7280; }
.card a {
  display: block;
  background: #0f766e;
  color: white;
  padding: 12px;
  border-radius: 10px;
  text-decoration: none;
}
```

Keep shadows soft and low in opacity. A harsh black shadow looks dated.

## CSS variables: change your whole design in one place

If your brand colour appears in forty rules, changing it means forty edits. **Custom properties**, also called CSS variables, solve this. You define them once, usually on `:root` (the page itself), and use them with `var()`.

```css
:root {
  --brand: #0f766e;
  --brand-dark: #115e59;
  --text: #1f2937;
  --radius: 12px;
}

h1 { color: var(--brand); }
.button { background: var(--brand); border-radius: var(--radius); }
.button:hover { background: var(--brand-dark); }
```

Change `--brand` to orange once and the heading, the button and everything else follows. Try it.

```live
=== html
<h1>Mama Ngozi's Kitchen</h1>
<p>Fresh food, every day.</p>
<a class="button" href="#">Order now</a>
=== css
:root {
  --brand: #0f766e;
  --brand-dark: #115e59;
  --radius: 12px;
}
body { font-family: system-ui, sans-serif; }
h1 { color: var(--brand); }
.button {
  display: inline-block;
  background: var(--brand);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius);
  text-decoration: none;
}
.button:hover { background: var(--brand-dark); }
```

Change `--brand` to `#b45309` and see everything update. This habit makes redesigns easy and keeps your colours consistent.

## Try it

Build a hero section for a business using a gradient, good contrast, and a CSS variable for the brand colour.

```webtask
{
  "id": "web-m08-t1",
  "minutes": 12,
  "required": true,
  "tabs": ["css"],
  "rules": [
    { "label": "Brand colours are defined as CSS variables on :root and used with var()", "in": "css", "pattern": ":root\\s*\\{[^}]*--[a-z-]+\\s*:[^}]*\\}[\\s\\S]*var\\(--[a-z-]+\\)" },
    { "label": "The hero has a gradient background", "selector": ".hero", "style": { "background-image": "gradient" } },
    { "label": "The hero text is centred", "selector": ".hero", "style": { "text-align": "center" } },
    { "label": "The hero heading is large (at least 2.5rem, 40px)", "selector": ".hero h1", "style": { "font-size": "^(4\\d|[5-9]\\d|\\d{3,})(\\.\\d+)?px$" } },
    { "label": "The heading text is white or very light (all colour values above 200)", "selector": ".hero h1", "style": { "color": "^rgb\\((2[0-5]\\d), (2[0-5]\\d), (2[0-5]\\d)\\)$" } },
    { "label": "The button has rounded corners (at least 8px) and a box shadow", "selector": ".hero a", "style": { "border-top-left-radius": "^([89]|\\d{2,})(\\.\\d+)?px$", "box-shadow": "^(?!none)" } },
    { "label": "The hero has generous padding (at least 48px top)", "selector": ".hero", "style": { "padding-top": "^([4-9]\\d|\\d{3,})(\\.\\d+)?px$" } }
  ],
  "hint": ":root { --brand: #0f766e; --brand-dark: #134e4a; } .hero { background: linear-gradient(135deg, var(--brand), var(--brand-dark)); color: white; text-align: center; padding: 64px 24px; } .hero h1 { font-size: 2.6rem; color: white; } .hero a { border-radius: 999px; box-shadow: 0 6px 16px rgb(0 0 0 / 25%); }",
  "height": 360
}
=== prompt
Style this hero section. Define your brand colours as variables on `:root` and use them with `var()`. The `.hero` needs a gradient background, centred text and at least 48px of top padding. Make the `h1` large (at least 2.5rem) and white. Give the button rounded corners (at least 8px) and a `box-shadow`.
=== html
<section class="hero">
  <h1>Shine Hair Studio</h1>
  <p>Braids, natural hair and styling in Lekki.</p>
  <a href="#">Book an appointment</a>
</section>
=== css
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
.hero a {
  display: inline-block;
  margin-top: 16px;
  background: #fbbf24;
  color: #1f2937;
  padding: 12px 28px;
  text-decoration: none;
  font-weight: bold;
}
=== sample css
:root {
  --brand: #0f766e;
  --brand-dark: #134e4a;
}
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
.hero {
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  color: white;
  text-align: center;
  padding: 64px 24px;
}
.hero h1 {
  font-size: 2.6rem;
  color: white;
  margin: 0 0 8px;
}
.hero a {
  display: inline-block;
  margin-top: 16px;
  background: #fbbf24;
  color: #1f2937;
  padding: 12px 28px;
  border-radius: 999px;
  box-shadow: 0 6px 16px rgb(0 0 0 / 25%);
  text-decoration: none;
  font-weight: bold;
}
```

Now make an article readable. The text is hard to read because it is too light, too wide and too tightly spaced. Fix those three things with CSS.

```webtask
{
  "id": "web-m08-t2",
  "minutes": 10,
  "required": true,
  "tabs": ["css"],
  "rules": [
    { "label": "Paragraph text is dark enough to read (every colour value below 140)", "selector": "article p", "style": { "color": "^rgb\\((\\d{1,2}|1[0-3]\\d), (\\d{1,2}|1[0-3]\\d), (\\d{1,2}|1[0-3]\\d)\\)$" } },
    { "label": "Lines are not too long: the article is no wider than about 700px", "selector": "article", "style": { "max-width": "^([3-6]\\d\\d|700)(\\.\\d+)?px$" } },
    { "label": "The article is centred on the page (non-zero side margins)", "selector": "article", "style": { "margin-left": "^[1-9]" } },
    { "label": "Line height is generous: at least 1.5 times the font size", "selector": "article p", "style": { "line-height": "^(2[4-9]|[3-9]\\d)(\\.\\d+)?px$" } },
    { "label": "The body text is at least 16px", "selector": "article p", "style": { "font-size": "^(1[6-9]|[2-9]\\d)(\\.\\d+)?px$" } }
  ],
  "hint": "article { max-width: 65ch; margin: 0 auto; } p { color: #374151; font-size: 1.1rem; line-height: 1.7; }",
  "height": 340
}
=== prompt
Fix the readability of this article using only CSS: dark text (colour values below 140, such as `#374151`), a `max-width` of about 65ch (no more than 700px) with the article centred using auto margins, a font size of at least 16px, and a line height of at least 1.5.
=== html
<article>
  <h1>How to save money as a student</h1>
  <p>Open a savings account and move a small amount into it the day your allowance arrives. Cook at home when you can, share data bundles with friends, and keep track of what you spend for one month. You will be surprised at where the money goes.</p>
  <p>Small changes add up. Saving ₦2,000 a week is ₦104,000 in a year, which can pay for a laptop, a course or an emergency.</p>
</article>
=== css
body {
  font-family: system-ui, sans-serif;
}
p {
  color: #cccccc;
  font-size: 14px;
  line-height: 1;
}
=== sample css
body {
  font-family: system-ui, sans-serif;
}
article {
  max-width: 65ch;
  margin: 0 auto;
  padding: 24px;
}
p {
  color: #374151;
  font-size: 1.1rem;
  line-height: 1.7;
}
```

```answer
{
  "id": "web-m08-a1",
  "prompt": "What is the minimum **contrast ratio** the accessibility standard (WCAG) asks for with normal text? Type the first number only, as in \"3 to 1\" or \"7 to 1\".",
  "answer": "4.5",
  "format": "text",
  "accept": ["4.5 to 1", "4.5:1", "4.5 : 1"],
  "explanation": "A ratio of 4.5 to 1 is the minimum for normal-sized text. Large text can go down to 3 to 1.",
  "required": true
}
```
