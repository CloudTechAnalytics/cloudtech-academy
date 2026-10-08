---
title: CSS Grid: Layout in Rows and Columns
minutes: 35
summary: Learn CSS Grid, the most powerful layout tool in CSS. Build a photo gallery that adapts to any screen with no media queries, and a complete page layout with named areas.
---

## Why grid?

Flexbox lays out items in **one direction**. But a lot of design is **two-dimensional**: a gallery with rows and columns, a dashboard, a whole page with a header, a sidebar, the main content and a footer. **CSS Grid** is made for this.

As with flexbox, you switch it on with one line on the parent:

```css
.gallery { display: grid; }
```

Then you describe the **columns** (and optionally the rows), and the children fall into the cells.

## Columns, rows and the fr unit

```css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;   /* three equal columns */
  gap: 16px;
}
```

`fr` means a **fraction** of the free space. `1fr 1fr 1fr` is three equal columns. `1fr 2fr` is two columns where the second is twice as wide as the first. You can mix units: `200px 1fr` is a fixed 200px sidebar next to a flexible main area.

Instead of repeating, write `repeat(3, 1fr)`. Edit the next example: change the number of columns, then try `200px 1fr 1fr`.

```live
=== html
<div class="grid">
  <div>1</div><div>2</div><div>3</div>
  <div>4</div><div>5</div><div>6</div>
  <div>7</div>
</div>
=== css
body { font-family: system-ui, sans-serif; }
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.grid div {
  background: #ccfbf1;
  border: 2px solid #0f766e;
  padding: 24px;
  text-align: center;
  font-weight: bold;
}
```

Seven boxes fill three columns, and the grid makes a new row on its own. Rows are created automatically (`grid-auto-rows` sets their height if you want to control it).

## A gallery that adapts with no media queries

Here is the line that makes grid special:

```css
grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
```

Read it as: "make as many columns as will fit, each at least 220px, and share the leftover space equally". On a wide screen you might get four columns, on a tablet two, on a phone one, with no extra code. Use the **Phone** and **Full** buttons to watch it.

```live
=== html
<div class="gallery">
  <figure><div class="pic" style="background:#0f766e"></div><figcaption>Lagos</figcaption></figure>
  <figure><div class="pic" style="background:#b45309"></div><figcaption>Abuja</figcaption></figure>
  <figure><div class="pic" style="background:#4338ca"></div><figcaption>Enugu</figcaption></figure>
  <figure><div class="pic" style="background:#be123c"></div><figcaption>Kano</figcaption></figure>
  <figure><div class="pic" style="background:#15803d"></div><figcaption>Ibadan</figcaption></figure>
  <figure><div class="pic" style="background:#a21caf"></div><figcaption>Calabar</figcaption></figure>
</div>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}
figure { margin: 0; }
.pic {
  height: 120px;
  border-radius: 12px;
}
figcaption {
  margin-top: 6px;
  font-weight: 600;
}
```

`auto-fit` collapses empty columns so your items stretch to fill the row. Its sibling, `auto-fill`, keeps the empty columns.

## Placing items: spanning rows and columns

Items can stretch across several cells. This is how you make a "featured" item bigger than the rest.

```css
.featured {
  grid-column: span 2;   /* two columns wide */
  grid-row: span 2;      /* two rows tall */
}
```

```live
=== html
<div class="grid">
  <div class="featured">Featured</div>
  <div>B</div>
  <div>C</div>
  <div>D</div>
  <div>E</div>
</div>
=== css
body { font-family: system-ui, sans-serif; }
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 80px;
  gap: 10px;
}
.grid div {
  background: #fde68a;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-weight: bold;
}
.featured {
  grid-column: span 2;
  grid-row: span 2;
  background: #fbbf24 !important;
}
```

## Page layouts with named areas

The most readable way to lay out a whole page is to **draw it**. In `grid-template-areas` you write the layout as a picture, one string per row, and then assign each element a name with `grid-area`.

```live
=== html
<div class="page">
  <header>Header</header>
  <nav>Menu</nav>
  <main>Main content goes here. This is the biggest area.</main>
  <aside>Side note</aside>
  <footer>Footer</footer>
</div>
=== css
body { margin: 0; font-family: system-ui, sans-serif; }
.page {
  display: grid;
  grid-template-columns: 160px 1fr 140px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "nav    main   aside"
    "footer footer footer";
  min-height: 100vh;
  gap: 8px;
}
header { grid-area: header; background: #1f2937; color: white; }
nav    { grid-area: nav;    background: #ccfbf1; }
main   { grid-area: main;   background: #f3f4f6; }
aside  { grid-area: aside;  background: #fef3c7; }
footer { grid-area: footer; background: #1f2937; color: white; }
.page > * { padding: 16px; }
```

The drawing in `grid-template-areas` **is** the layout. To move the sidebar to the left or to stack everything on a phone, you only redraw the picture. In the next lesson you will do exactly that with media queries.

## Aligning inside the grid

Grid has the same alignment ideas as flexbox:

- `justify-items` and `align-items` align items inside their cells.
- `place-items: center` is the shorthand for both, and the shortest way to centre something.
- `justify-content` and `align-content` position the whole grid inside its container.

## Grid or flexbox?

| Use flexbox when | Use grid when |
| :-- | :-- |
| Content is in **one line**: a navbar, a row of buttons | You need **rows and columns** together: a gallery, a dashboard |
| The size of the **content** decides the layout | The **layout** decides the size of the content |
| You are laying out a small component | You are laying out a whole page or section |

They are not rivals. A typical page uses a grid for the overall structure and flexbox inside the pieces, such as in the navbar and in each card.

## Try it

Build a responsive product gallery that needs no media queries.

```webtask
{
  "id": "web-m10-t1",
  "minutes": 12,
  "required": true,
  "tabs": ["css"],
  "rules": [
    { "label": "The container is a grid", "selector": ".products", "style": { "display": "grid" } },
    { "label": "It uses repeat(auto-fit, minmax(...)) so the columns adapt", "in": "css", "pattern": "\\.products\\s*\\{[^}]*repeat\\(\\s*auto-(fit|fill)\\s*,\\s*minmax\\(" },
    { "label": "There is a gap of at least 12px between the items", "selector": ".products", "style": { "column-gap": "^(1[2-9]|[2-9]\\d|\\d{3,})(\\.\\d+)?px$" } },
    { "label": "Each product card has padding, a border and rounded corners", "selector": ".product", "style": { "padding-top": "^(1[2-9]|[2-9]\\d)(\\.\\d+)?px$", "border-top-width": "^[1-9]", "border-top-left-radius": "^([6-9]|\\d{2,})(\\.\\d+)?px$" } },
    { "label": "The featured product spans two columns", "in": "css", "pattern": "\\.featured\\s*\\{[^}]*grid-column\\s*:\\s*span\\s*2" },
    { "label": "The prices are bold", "selector": ".price", "style": { "font-weight": "^(bold|[6-9]00)$" } }
  ],
  "hint": ".products { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; } .product { padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; } .featured { grid-column: span 2; } .price { font-weight: bold; }",
  "height": 380
}
=== prompt
Style this shop. `.products` is a grid using `repeat(auto-fit, minmax(180px, 1fr))` with a `gap` of at least 12px. Each `.product` has padding, a border and rounded corners. `.featured` spans two columns (`grid-column: span 2`). `.price` is bold.
=== html
<div class="products">
  <article class="product featured">
    <h3>Ankara tote bag</h3>
    <p class="price">₦12,000</p>
    <p>Our best seller this month.</p>
  </article>
  <article class="product"><h3>Leather sandals</h3><p class="price">₦18,500</p></article>
  <article class="product"><h3>Beaded necklace</h3><p class="price">₦6,000</p></article>
  <article class="product"><h3>Adire scarf</h3><p class="price">₦8,500</p></article>
  <article class="product"><h3>Woven basket</h3><p class="price">₦9,000</p></article>
</div>
=== css
body {
  font-family: system-ui, sans-serif;
  padding: 16px;
}
=== sample css
body {
  font-family: system-ui, sans-serif;
  padding: 16px;
}
.products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}
.product {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}
.featured {
  grid-column: span 2;
  background: #fef3c7;
}
.price {
  font-weight: bold;
}
```

Now lay out a whole page using named grid areas.

```webtask
{
  "id": "web-m10-t2",
  "minutes": 12,
  "required": true,
  "tabs": ["css"],
  "rules": [
    { "label": "The page is a grid with a grid-template-areas drawing", "in": "css", "pattern": "grid-template-areas\\s*:\\s*[\"'][a-z ]+[\"']\\s+[\"'][a-z ]+[\"']\\s+[\"'][a-z ]+[\"']" },
    { "label": "Every part is given its area with grid-area (header, nav, main, footer)", "in": "css", "pattern": "grid-area\\s*:\\s*(header|nav|main|footer)", "min": 4 },
    { "label": "The page grid has two columns: a fixed side column and a flexible main column", "selector": ".layout", "style": { "display": "grid", "grid-template-columns": "^\\d+(\\.\\d+)?px \\d+(\\.\\d+)?px$" } },
    { "label": "The header spans the full width of the grid", "selector": "header", "style": { "grid-column-start": "^(1|header)", "grid-column-end": "^(3|-1|header|span 2)" } },
    { "label": "The footer is below the main area and also spans the whole grid", "selector": "footer", "style": { "grid-column-start": "^(1|footer)" } }
  ],
  "hint": ".layout { display: grid; grid-template-columns: 200px 1fr; grid-template-areas: \"header header\" \"nav main\" \"footer footer\"; gap: 8px; } header { grid-area: header; } nav { grid-area: nav; } main { grid-area: main; } footer { grid-area: footer; }",
  "height": 360
}
=== prompt
Lay out this page with a grid. `.layout` should have two columns (a fixed `200px` side column and a flexible `1fr` main column) and a `grid-template-areas` drawing with three rows: the header across the top, the nav beside the main content, and the footer across the bottom. Give each element its `grid-area`.
=== html
<div class="layout">
  <header>School portal</header>
  <nav>
    <p>Timetable</p>
    <p>Results</p>
    <p>Fees</p>
  </nav>
  <main>
    <h2>Welcome back, Chidi</h2>
    <p>Your next class is Mathematics at 9 am.</p>
  </main>
  <footer>Greenfield School 2026</footer>
</div>
=== css
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
.layout > * {
  padding: 16px;
}
header, footer {
  background: #1f2937;
  color: white;
}
nav {
  background: #ccfbf1;
}
main {
  background: #f3f4f6;
}
=== sample css
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-areas:
    "header header"
    "nav main"
    "footer footer";
  gap: 8px;
  min-height: 100vh;
}
.layout > * {
  padding: 16px;
}
header { grid-area: header; }
nav { grid-area: nav; background: #ccfbf1; }
main { grid-area: main; background: #f3f4f6; }
footer { grid-area: footer; }
header, footer {
  background: #1f2937;
  color: white;
}
```

```answer
{
  "id": "web-m10-a1",
  "prompt": "In `grid-template-columns: 1fr 2fr`, how many times wider is the second column than the first? Type the number.",
  "answer": "2",
  "format": "number",
  "explanation": "The fr unit divides the free space in proportion: 1 part to the first column and 2 parts to the second, so the second is twice as wide.",
  "required": true
}
```
