---
title: Flexbox: Layout in One Direction
minutes: 40
summary: Master flexbox, the tool behind most navigation bars, card rows and centred layouts. Learn the container and item properties one at a time, then build a real navbar and a card row that adapts to any screen.
---

## The layout problem

Until now elements stacked down the page, one under another. Real pages put things **side by side**: a logo on the left and a menu on the right, three cards in a row, a button centred in a box. **Flexbox** (the Flexible Box Layout) is the CSS tool for this.

You use it with one line on a parent:

```css
.row { display: flex; }
```

That parent becomes a **flex container** and its direct children become **flex items**. They line up in a row. Try it. Remove `display: flex` and watch the boxes stack, then put it back.

```live
=== html
<div class="row">
  <div>One</div>
  <div>Two</div>
  <div>Three</div>
</div>
=== css
body { font-family: system-ui, sans-serif; }
.row {
  display: flex;
}
.row div {
  background: #ccfbf1;
  border: 2px solid #0f766e;
  padding: 20px;
}
```

## Two directions: the main axis and the cross axis

Everything in flexbox follows from one picture. Items are laid out along a **main axis** (by default, left to right), and the **cross axis** runs at 90 degrees to it (top to bottom).

- `justify-content` positions items along the **main** axis.
- `align-items` positions items along the **cross** axis.

If you ever forget which is which, remember that **justify** is the **main** direction.

## Properties for the container

| Property | What it does | Common values |
| :-- | :-- | :-- |
| `flex-direction` | The direction of the main axis | `row` (default), `column`, `row-reverse` |
| `justify-content` | Spacing along the main axis | `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly` |
| `align-items` | Alignment on the cross axis | `stretch` (default), `center`, `flex-start`, `flex-end` |
| `flex-wrap` | Whether items may drop onto a new line | `nowrap` (default), `wrap` |
| `gap` | Space between items | `16px`, `1rem` |

Change `justify-content` in the next example to each value, then change `align-items`. This is the best way to learn them.

```live
=== html
<div class="row">
  <div>A</div>
  <div class="tall">B</div>
  <div>C</div>
</div>
=== css
body { font-family: system-ui, sans-serif; }
.row {
  display: flex;
  justify-content: space-between;   /* try: flex-start, center, flex-end, space-around */
  align-items: center;              /* try: flex-start, flex-end, stretch */
  gap: 12px;
  height: 200px;
  background: #f3f4f6;
  padding: 12px;
}
.row div {
  background: #ccfbf1;
  border: 2px solid #0f766e;
  padding: 16px 24px;
}
.tall { padding: 40px 24px; }
```

### Centring anything

The most famous CSS problem, how to centre something in the middle of a box, has a three-line answer:

```css
.box {
  display: flex;
  justify-content: center;   /* horizontally */
  align-items: center;       /* vertically */
  min-height: 200px;
}
```

```live
=== html
<div class="box"><p>I am perfectly centred.</p></div>
=== css
body { font-family: system-ui, sans-serif; margin: 0; }
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #ecfdf5;
}
```

## Properties for the items

Items can also be controlled one by one.

| Property | What it does |
| :-- | :-- |
| `flex-grow` | How much of the **spare space** this item takes compared with the others. `0` means none |
| `flex-shrink` | How willing it is to **shrink** when space is short |
| `flex-basis` | Its **starting size** before growing or shrinking |
| `flex` | A shorthand for all three: `flex: 1 1 200px` |
| `align-self` | Overrides `align-items` for this one item |
| `order` | Changes the display order without changing the HTML |

The most useful is `flex: 1`, which means "share the free space equally". Here the middle item grows to fill all the room, and the others stay their natural size.

```live
=== html
<div class="row">
  <div>Fixed</div>
  <div class="grow">I take all the free space</div>
  <div>Fixed</div>
</div>
=== css
body { font-family: system-ui, sans-serif; }
.row { display: flex; gap: 8px; }
.row div {
  background: #ccfbf1;
  border: 2px solid #0f766e;
  padding: 16px;
}
.grow { flex: 1; }
```

## Pattern 1: a navigation bar

The logo on the left, links on the right. This is on nearly every website.

```live
=== html
<header class="bar">
  <a class="logo" href="#">CloudTech</a>
  <nav>
    <a href="#">Courses</a>
    <a href="#">Projects</a>
    <a href="#">About</a>
    <a class="cta" href="#">Sign up</a>
  </nav>
</header>
=== css
body { margin: 0; font-family: system-ui, sans-serif; }
.bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  background: #1f2937;
}
.bar nav {
  display: flex;
  align-items: center;
  gap: 20px;
}
.bar a { color: #e5e7eb; text-decoration: none; }
.logo { font-weight: bold; font-size: 1.2rem; color: white; }
.cta {
  background: #0f766e;
  color: white !important;
  padding: 8px 16px;
  border-radius: 8px;
}
```

Notice that the `<nav>` is itself a flex container, to space out its own links. Flex containers nest freely, and that is how complicated layouts are built from simple parts.

## Pattern 2: a row of cards that wraps

```live
=== html
<div class="cards">
  <article class="card"><h3>Excel</h3><p>Formulas, tables and charts.</p></article>
  <article class="card"><h3>SQL</h3><p>Ask questions of data.</p></article>
  <article class="card"><h3>Python</h3><p>Automate your work.</p></article>
  <article class="card"><h3>Web</h3><p>Build your first site.</p></article>
</div>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card {
  flex: 1 1 200px;          /* grow, shrink, start at 200px */
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
}
```

Use the **Phone** and **Full** buttons above the preview. The cards sit in a row on a wide screen and drop onto new lines on a phone, with no media queries. `flex: 1 1 200px` means "start at 200px, and grow to share the extra space". The row wraps because of `flex-wrap: wrap`.

## Pattern 3: a footer that stays at the bottom

On a short page, the footer floats up in the middle of the screen, which looks wrong. Flexbox fixes it. Make the body a column that is at least as tall as the window, and let the main area grow.

```live
=== html
<header>Header</header>
<main>Main content is short.</main>
<footer>Footer stays at the bottom.</footer>
=== css
body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: system-ui, sans-serif;
}
header, footer { background: #1f2937; color: white; padding: 16px; }
main { flex: 1; padding: 16px; }
```

## Flexbox or grid?

Flexbox lays things out in **one direction** (a row or a column). When you need **rows and columns together**, such as a whole page or a gallery, use **grid**, which is the next lesson. In practice you will use both, often together: grid for the page, flexbox for the components inside it.

## Try it

Build a navigation bar with flexbox. The HTML is ready.

```webtask
{
  "id": "web-m09-t1",
  "minutes": 12,
  "required": true,
  "tabs": ["css"],
  "rules": [
    { "label": "The header is a flex container", "selector": "header", "style": { "display": "flex" } },
    { "label": "The logo and the menu are pushed to opposite ends (space-between)", "selector": "header", "style": { "justify-content": "space-between" } },
    { "label": "Items are centred vertically (align-items: center)", "selector": "header", "style": { "align-items": "center" } },
    { "label": "The links are laid out in a row (the nav is also a flex container)", "selector": "nav", "style": { "display": "flex" } },
    { "label": "There is a gap of at least 12px between the links", "selector": "nav", "style": { "column-gap": "^(1[2-9]|[2-9]\\d|\\d{3,})(\\.\\d+)?px$" } },
    { "label": "The header has padding and a background colour", "selector": "header", "style": { "padding-top": "^([89]|\\d{2,})(\\.\\d+)?px$", "background-color": "^(?!rgba\\(0, 0, 0, 0\\))" } }
  ],
  "hint": "header { display: flex; justify-content: space-between; align-items: center; padding: 14px 24px; background: #1f2937; } nav { display: flex; gap: 20px; }",
  "height": 320
}
=== prompt
Turn this into a navigation bar. The `<header>` should be a flex container with the logo on the left and the menu on the right (`justify-content: space-between`), items vertically centred, padding and a background colour. The `<nav>` should also be a flex container with a `gap` of at least 12px between the links.
=== html
<header>
  <a class="logo" href="#">Lagos Eats</a>
  <nav>
    <a href="#">Restaurants</a>
    <a href="#">Offers</a>
    <a href="#">Help</a>
  </nav>
</header>
<main style="padding: 24px">
  <h1>Hungry?</h1>
  <p>Order from the best places in Lagos.</p>
</main>
=== css
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
header a {
  color: white;
  text-decoration: none;
}
.logo {
  font-weight: bold;
}
=== sample css
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  background: #1f2937;
}
header a {
  color: white;
  text-decoration: none;
}
.logo {
  font-weight: bold;
}
nav {
  display: flex;
  gap: 20px;
}
```

Now a row of pricing cards that adapts to the screen width.

```webtask
{
  "id": "web-m09-t2",
  "minutes": 12,
  "required": true,
  "tabs": ["css"],
  "rules": [
    { "label": "The container is a flex container that wraps", "selector": ".plans", "style": { "display": "flex", "flex-wrap": "wrap" } },
    { "label": "There is a gap of at least 16px between the cards", "selector": ".plans", "style": { "column-gap": "^(1[6-9]|[2-9]\\d|\\d{3,})(\\.\\d+)?px$" } },
    { "label": "Each card grows to share the space (flex-grow: 1)", "selector": ".plan", "style": { "flex-grow": "^1$" } },
    { "label": "Each card starts at about 220px (flex-basis between 200px and 260px)", "selector": ".plan", "style": { "flex-basis": "^(2[0-5]\\d|260)px$" } },
    { "label": "The cards have padding and a border or shadow", "selector": ".plan", "style": { "padding-top": "^(1[2-9]|[2-9]\\d)(\\.\\d+)?px$" } },
    { "label": "The button inside each card sits at the bottom: the card is a flex column", "selector": ".plan", "style": { "display": "flex", "flex-direction": "column" } }
  ],
  "hint": ".plans { display: flex; flex-wrap: wrap; gap: 16px; } .plan { flex: 1 1 220px; display: flex; flex-direction: column; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; } .plan a { margin-top: auto; }",
  "height": 380
}
=== prompt
Build a responsive pricing section. `.plans` is a flex container that wraps with a `gap` of at least 16px. Each `.plan` starts at about 220px and grows to share the space (`flex: 1 1 220px`), has padding, and is itself a flex column so that the button can be pushed to the bottom with `margin-top: auto`.
=== html
<div class="plans">
  <section class="plan">
    <h3>Starter</h3>
    <p>₦5,000 a month</p>
    <p>One user, basic reports.</p>
    <a href="#">Choose</a>
  </section>
  <section class="plan">
    <h3>Business</h3>
    <p>₦15,000 a month</p>
    <p>Five users, reports, support and an extra line to make this card taller.</p>
    <a href="#">Choose</a>
  </section>
  <section class="plan">
    <h3>Company</h3>
    <p>₦40,000 a month</p>
    <p>Unlimited users.</p>
    <a href="#">Choose</a>
  </section>
</div>
=== css
body {
  font-family: system-ui, sans-serif;
  padding: 16px;
}
.plan a {
  background: #0f766e;
  color: white;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  text-decoration: none;
}
=== sample css
body {
  font-family: system-ui, sans-serif;
  padding: 16px;
}
.plans {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.plan {
  flex: 1 1 220px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}
.plan a {
  margin-top: auto;
  background: #0f766e;
  color: white;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  text-decoration: none;
}
=== note
Press the **Phone** button in the preview and watch the cards stack. The buttons still line up at the bottom of each card, which is a classic flexbox trick: `margin-top: auto` pushes an item to the end of its column.
```

```answer
{
  "id": "web-m09-a1",
  "prompt": "Which CSS property, set on the flex container, positions items along the **main axis**? Type the property name.",
  "answer": "justify-content",
  "format": "text",
  "explanation": "justify-content works along the main axis, and align-items works along the cross axis.",
  "required": true
}
```
