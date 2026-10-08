---
title: Responsive Design: One Site for Every Screen
minutes: 35
summary: Make pages that work on a phone, a tablet and a desktop. Learn mobile-first CSS, media queries, flexible images, fluid text and dark mode, and how to test on every screen size.
---

## Why responsive?

In Nigeria, and most of the world, **most people visit websites on a phone**. A page designed only for a big laptop screen forces them to pinch and scroll sideways, and they leave. A **responsive** website adapts its layout to the screen it is shown on, from a small phone to a wide monitor, with a single set of HTML and CSS.

You already have the tools:

- `<meta name="viewport" content="width=device-width, initial-scale=1">` in the head, so phones do not shrink the page.
- Flexible units (`%`, `rem`, `fr`, `max-width`) instead of fixed pixel widths.
- Flexbox with `flex-wrap`, and grid with `auto-fit`.

This lesson adds the last piece, the **media query**, plus a few habits that make responsive design easy.

## Mobile first

Start by designing for the **smallest screen**, where everything is a single column, and then **add** layout for bigger screens. This is called **mobile-first**, and it works better than the opposite because:

- A phone page is simple, and simple is easier to get right.
- Phones download only the base CSS, with no layout code they do not need.
- Adding space on a big screen is easier than squeezing a big layout onto a small one.

## Media queries

A **media query** applies CSS only when a condition is true, usually the width of the screen.

```css
/* Base styles: phones */
.features {
  display: grid;
  gap: 16px;
}

/* From 700px wide upwards: two columns */
@media (min-width: 700px) {
  .features {
    grid-template-columns: 1fr 1fr;
  }
}

/* From 1000px wide upwards: three columns */
@media (min-width: 1000px) {
  .features {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

Read `@media (min-width: 700px)` as "when the screen is **at least** 700px wide". Everything inside its braces applies only then, and the later rules override the earlier ones thanks to the cascade.

Watch it happen. Use the preview's **Phone** button (a narrow screen), then **Fit**, then **Desktop**, and see the layout change from one column to two to three.

```live
{ "stack": true, "height": 420 }
=== html
<h2 class="title">Why learn with us?</h2>
<section class="features">
  <article><h3>Practise in your browser</h3><p>Nothing to install.</p></article>
  <article><h3>Earn badges</h3><p>Show what you can do.</p></article>
  <article><h3>Go at your pace</h3><p>Learn on any device.</p></article>
</section>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; margin: 0; }
.features {
  display: grid;
  gap: 16px;
}
.features article {
  background: #ecfdf5;
  border: 1px solid #99f6e4;
  border-radius: 12px;
  padding: 16px;
}
@media (min-width: 600px) {
  .features { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 900px) {
  .features { grid-template-columns: repeat(3, 1fr); }
}
```

### Choosing breakpoints

The widths where your layout changes are called **breakpoints**. Common ones are about 600px, 900px and 1200px, but there is no magic list. A good method: make the window narrow, then widen it slowly, and add a breakpoint **where the layout starts to look stretched or crowded**. The content decides, not a particular phone model.

## Flexible images

An image has a fixed pixel size, so a wide picture will overflow a narrow phone screen. This rule, which belongs in nearly every stylesheet, fixes that:

```css
img {
  max-width: 100%;
  height: auto;
}
```

The image shrinks to fit its container, and it never grows beyond its real size. The `height: auto` keeps its proportions.

To make pictures of different shapes fill equal boxes neatly, use `object-fit`:

```css
.avatar {
  width: 120px;
  height: 120px;
  object-fit: cover;     /* crop to fill the box, do not squash */
  border-radius: 50%;
}
```

For serious sites, HTML can also offer different image files for different screens with `srcset` and `<picture>`, so phones download a small file and big screens a sharp one. You will meet them on your own when you start optimising for speed.

## Fluid typography with clamp()

Big headings that look great on a desktop can be too large for a phone. `clamp()` gives a value that scales with the screen between a minimum and a maximum:

```css
h1 {
  font-size: clamp(1.8rem, 4vw + 1rem, 3.2rem);
  /*          smallest  ideal           largest  */
}
```

Here the heading is never below 1.8rem or above 3.2rem, and in between it grows with the screen. No media query needed.

## A responsive navigation bar

On a phone there is no room for six links in a row. A simple pattern, with no JavaScript, is to let them wrap, or to stack them on small screens and place them in a row on larger ones:

```live
{ "stack": true, "height": 340 }
=== html
<header class="top">
  <a class="logo" href="#">Lagos Eats</a>
  <nav>
    <a href="#">Restaurants</a>
    <a href="#">Offers</a>
    <a href="#">Orders</a>
    <a href="#">Help</a>
  </nav>
</header>
<main>
  <h1>Hungry?</h1>
  <p>Order from the best places near you.</p>
</main>
=== css
body { margin: 0; font-family: system-ui, sans-serif; }
.top { background: #1f2937; padding: 12px 16px; }
.logo { color: white; font-weight: bold; text-decoration: none; display: block; margin-bottom: 8px; }
nav { display: flex; flex-wrap: wrap; gap: 8px 16px; }
nav a { color: #d1d5db; text-decoration: none; }
main { padding: 16px; }
h1 { font-size: clamp(1.8rem, 4vw + 1rem, 3rem); }

@media (min-width: 700px) {
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo { margin: 0; }
}
```

(A menu that opens and closes with a hamburger button needs JavaScript, and you will build one later in this course. Bootstrap also provides one ready-made.)

## Other media queries

Media queries can ask about more than width.

```css
/* Dark mode, when the visitor's device is set to dark */
@media (prefers-color-scheme: dark) {
  body { background: #111827; color: #f9fafb; }
}

/* Respect people who ask for less motion */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}

/* A cleaner page when printed */
@media print {
  nav, footer { display: none; }
}
```

Dark mode is easy when you use CSS variables: redefine the colour variables inside the media query, and the whole site switches.

```live
{ "stack": true, "height": 280 }
=== html
<main class="page">
  <h1>Dark mode ready</h1>
  <p>Change your device or browser to dark mode to see this page switch. The colours come from variables.</p>
  <a href="#">A link</a>
</main>
=== css
:root {
  --bg: #ffffff;
  --text: #1f2937;
  --brand: #0f766e;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #111827;
    --text: #f3f4f6;
    --brand: #5eead4;
  }
}
body { margin: 0; font-family: system-ui, sans-serif; background: var(--bg); color: var(--text); }
.page { padding: 24px; }
a { color: var(--brand); }
```

## Test on every screen

- In Chrome, press `F12`, then click the **device toolbar** icon (or press `Ctrl+Shift+M`). Pick a phone model, or drag the edge to any width, and the page resizes.
- Test on a **real phone** too, the real thing is always different. Once you publish a site (lesson 22), open it on your own phone.
- Check three sizes at least: a **phone** (about 375px), a **tablet** (about 768px) and a **desktop** (about 1280px).
- Look for horizontal scrolling, text that is too small, buttons too close together to tap (aim for about 44px), and images that are cut off.

## Try it

Make this feature section mobile-first: one column on a phone, two columns from 600px, and three from 900px.

```webtask
{
  "id": "web-m11-t1",
  "minutes": 12,
  "required": true,
  "stack": true,
  "height": 420,
  "tabs": ["css"],
  "rules": [
    { "label": "You use mobile-first media queries (@media (min-width: ...))", "in": "css", "pattern": "@media\\s*\\(\\s*min-width\\s*:", "min": 2 },
    { "label": "On a phone (400px wide) the cards are in one column", "selector": ".features", "at": 400, "style": { "display": "grid", "grid-template-columns": "^[\\d.]+px$" } },
    { "label": "On a tablet (700px wide) the cards are in two columns", "selector": ".features", "at": 700, "style": { "grid-template-columns": "^[\\d.]+px [\\d.]+px$" } },
    { "label": "On a desktop (1100px wide) the cards are in three columns", "selector": ".features", "at": 1100, "style": { "grid-template-columns": "^[\\d.]+px [\\d.]+px [\\d.]+px$" } },
    { "label": "There is a gap between the cards", "selector": ".features", "at": 400, "style": { "row-gap": "^(8|9|[1-9]\\d)(\\.\\d+)?px$" } }
  ],
  "hint": ".features { display: grid; gap: 16px; } @media (min-width: 600px) { .features { grid-template-columns: 1fr 1fr; } } @media (min-width: 900px) { .features { grid-template-columns: repeat(3, 1fr); } }",
  "bootstrap": false
}
=== prompt
Make `.features` a grid with a `gap`, one column by default, **two columns from 600px** and **three columns from 900px**, using `@media (min-width: ...)`. Use the **Phone**, **Fit** and **Desktop** buttons above the preview to check each size.
=== html
<section class="features">
  <article><h3>Learn</h3><p>Clear lessons with examples.</p></article>
  <article><h3>Practise</h3><p>Real tasks with instant feedback.</p></article>
  <article><h3>Build</h3><p>Finish with a project for your portfolio.</p></article>
</section>
=== css
body {
  font-family: system-ui, sans-serif;
  padding: 16px;
  margin: 0;
}
.features article {
  background: #ecfdf5;
  border: 1px solid #99f6e4;
  border-radius: 12px;
  padding: 16px;
}
=== sample css
body {
  font-family: system-ui, sans-serif;
  padding: 16px;
  margin: 0;
}
.features {
  display: grid;
  gap: 16px;
}
.features article {
  background: #ecfdf5;
  border: 1px solid #99f6e4;
  border-radius: 12px;
  padding: 16px;
}
@media (min-width: 600px) {
  .features {
    grid-template-columns: 1fr 1fr;
  }
}
@media (min-width: 900px) {
  .features {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

Now make a hero section that scales. It must have a flexible image, fluid text and a dark mode.

```webtask
{
  "id": "web-m11-t2",
  "minutes": 12,
  "required": true,
  "stack": true,
  "height": 380,
  "tabs": ["css"],
  "rules": [
    { "label": "Images shrink to fit their container (max-width: 100%)", "selector": "img", "style": { "max-width": "^100%$" } },
    { "label": "Images keep their proportions (height: auto)", "in": "css", "pattern": "img\\s*\\{[^}]*height\\s*:\\s*auto" },
    { "label": "The heading size uses clamp()", "in": "css", "pattern": "font-size\\s*:\\s*clamp\\(" },
    { "label": "clamp() starts from a smaller minimum size in rem", "in": "css", "pattern": "clamp\\(\\s*[\\d.]+rem" },
    { "label": "A dark mode: @media (prefers-color-scheme: dark)", "in": "css", "pattern": "@media\\s*\\(\\s*prefers-color-scheme\\s*:\\s*dark" },
    { "label": "Colours come from CSS variables (var(--...) is used at least twice)", "in": "css", "pattern": "var\\(--[a-z-]+\\)", "min": 2 },
    { "label": "On a wide screen the text and image sit side by side (the hero is a flex or grid row at 900px)", "selector": ".hero", "at": 900, "style": { "display": "^(flex|grid)$" } }
  ],
  "hint": "img { max-width: 100%; height: auto; } h1 { font-size: clamp(1.8rem, 4vw + 1rem, 3rem); } :root { --bg: #fff; --text: #1f2937; } @media (prefers-color-scheme: dark) { :root { --bg: #111827; --text: #f3f4f6; } } body { background: var(--bg); color: var(--text); } @media (min-width: 800px) { .hero { display: flex; align-items: center; gap: 24px; } }",
  "bootstrap": false
}
=== prompt
Make this hero responsive. Images must shrink to fit (`max-width: 100%; height: auto`). The `h1` uses `clamp()` for its size. Define `--bg` and `--text` variables and use them with `var()`, then redefine them inside `@media (prefers-color-scheme: dark)`. From 800px wide, the hero becomes a `display: flex` row with the text and the image side by side.
=== html
<section class="hero">
  <div class="text">
    <h1>Learn skills that matter</h1>
    <p>Free courses in data, web and business, from CloudTech Academy.</p>
  </div>
  <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='360'><rect width='600' height='360' rx='24' fill='%230f766e'/><text x='300' y='190' font-size='42' fill='white' text-anchor='middle' font-family='sans-serif'>Learn. Practise. Build.</text></svg>" alt="A green banner that says Learn, Practise, Build" width="600" height="360" />
</section>
=== css
body {
  margin: 0;
  padding: 16px;
  font-family: system-ui, sans-serif;
}
h1 {
  font-size: 3rem;
}
=== sample css
:root {
  --bg: #ffffff;
  --text: #1f2937;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #111827;
    --text: #f3f4f6;
  }
}
body {
  margin: 0;
  padding: 16px;
  font-family: system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
}
img {
  max-width: 100%;
  height: auto;
}
h1 {
  font-size: clamp(1.8rem, 4vw + 1rem, 3rem);
}
@media (min-width: 800px) {
  .hero {
    display: flex;
    align-items: center;
    gap: 24px;
  }
}
```

```answer
{
  "id": "web-m11-a1",
  "prompt": "A media query `@media (min-width: 700px)` applies when the screen is how wide? Type **at least** or **at most**.",
  "answer": "at least",
  "format": "text",
  "accept": ["atleast", "700px or more", "700 or wider", "min"],
  "explanation": "min-width means 'at least this wide', which is why mobile-first CSS uses min-width and adds layout for bigger screens.",
  "required": true
}
```
