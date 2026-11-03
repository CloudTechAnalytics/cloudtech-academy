---
title: The Box Model, Units, Display and Position
minutes: 35
summary: Understand the idea behind all CSS layout, that every element is a box. Control size, spacing, borders and units, choose how elements flow, and place things exactly with position.
---

## Everything is a box

This is the most important idea in CSS. Every element on a page, a heading, a paragraph, a button, an image, is a rectangular **box**. The box has four layers, from the inside out:

1. **Content**: the text or image itself.
2. **Padding**: breathing space between the content and the border, inside the box.
3. **Border**: a line around the padding.
4. **Margin**: empty space **outside** the border, pushing other boxes away.

Look at the example. The **blue** area is the content, the **green** is the padding, the **dark** line is the border, and the **orange** is the margin. Change the numbers and watch each layer grow.

```live
=== html
<div class="outer">
  <div class="box">
    <div class="content">Content</div>
  </div>
</div>
=== css
body { font-family: system-ui, sans-serif; }
.outer {
  background: #fed7aa;        /* orange: you can see the margin through this */
  display: inline-block;
}
.box {
  background: #bbf7d0;        /* green: this shows the padding */
  padding: 24px;              /* space inside the border */
  border: 6px solid #1f2937;
  margin: 28px;               /* space outside the border */
}
.content {
  background: #bfdbfe;        /* blue: the content itself */
  padding: 8px 12px;
}
```

> [!TIP]
> In Chrome, right-click an element, choose **Inspect**, and look at the diagram at the bottom of the **Styles** panel. It shows the content, padding, border and margin of any element on any website, with the actual numbers.

## Padding, border and margin

Each of the three can be set for all four sides, or one side at a time.

```css
.card {
  padding: 20px;                 /* all four sides */
  padding: 10px 20px;            /* top and bottom 10, left and right 20 */
  padding: 10px 20px 30px 40px;  /* top, right, bottom, left, clockwise */
  padding-left: 12px;            /* just one side */

  border: 2px solid #e5e7eb;     /* width, style, colour */
  border-radius: 12px;           /* rounded corners; 50% makes a circle */

  margin: 0 auto;                /* no top and bottom margin, and centred */
}
```

Remember the clockwise order **top, right, bottom, left**. A quick trick is TRouBLe.

### Centring a box

To centre a block horizontally, give it a **width** and set the left and right margins to `auto`. The browser splits the free space equally.

```live
=== html
<div class="card">I am centred on the page.</div>
=== css
.card {
  width: 300px;
  margin: 24px auto;
  padding: 20px;
  background: #ecfdf5;
  border: 2px solid #0f766e;
  border-radius: 12px;
  text-align: center;
}
```

## The size trap, and border-box

By default, `width` sets the width of the **content only**. Padding and border are added on top. So a box with `width: 300px` and `padding: 20px` is really 340px wide, and layouts break.

You can fix it with one line that nearly every professional stylesheet starts with:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

With `border-box`, the `width` includes the padding and border, so a 300px box is always 300px. Compare the two boxes. They have identical CSS except the first line.

```live
=== html
<div class="a">content-box (the default)</div>
<div class="b">border-box</div>
=== css
div {
  width: 220px;
  padding: 30px;
  border: 6px solid #1f2937;
  margin-bottom: 12px;
  background: #fef3c7;
  font-family: system-ui, sans-serif;
}
.b {
  box-sizing: border-box;
}
```

The first box is 292px wide (220 + 60 + 12) and the second is exactly 220px. From now on, we use `border-box` everywhere.

## Units: how big is big?

| Unit | What it is | Good for |
| :-- | :-- | :-- |
| `px` | A pixel | Borders, shadows, small precise sizes |
| `%` | A percentage of the **parent** | Widths that adjust, like `width: 50%` |
| `rem` | A multiple of the page's base font size (usually 16px) | **Font sizes and spacing.** Respects the user's settings |
| `em` | A multiple of the **current element's** font size | Spacing inside a component |
| `vw` and `vh` | 1% of the browser window's width or height | Full-screen sections: `min-height: 100vh` |
| `ch` | The width of the "0" character | Readable line length: `max-width: 65ch` |

A good habit: use **`rem` for text and spacing**, and `%` or `max-width` for widths. Then the page scales gracefully if someone has made their text bigger.

Instead of fixing a width, use `max-width` and let the box shrink on small screens:

```css
.container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}
```

This box is as wide as its parent up to 900px, and then it stops growing and centres. It works on every screen.

## Display: how elements flow

Remember **block** and **inline** from lesson 3. The `display` property controls this.

| Value | Behaviour |
| :-- | :-- |
| `block` | Starts a new line and fills the width. You can set width, height, margin and padding |
| `inline` | Flows within a line. **Ignores width and height**, and top and bottom margins |
| `inline-block` | Flows within a line, but you can set width, height and margins |
| `none` | Removes the element completely, as though it was never there |
| `flex` and `grid` | The modern layout systems, which get their own lessons |

```live
=== html
<p>
  Navigation:
  <a href="#">Home</a>
  <a href="#">Menu</a>
  <a href="#">Contact</a>
</p>
<p class="hidden">You cannot see me.</p>
=== css
body { font-family: system-ui, sans-serif; }
a {
  display: inline-block;       /* now width, padding and margin work */
  background: #0f766e;
  color: white;
  padding: 10px 18px;
  margin: 4px;
  border-radius: 8px;
  text-decoration: none;
}
.hidden {
  display: none;
}
```

A very common job: turn a plain link into a button. The secret is `display: inline-block` and some padding.

## Overflow

What happens when content is bigger than its box? The `overflow` property decides:

```css
.scroll-box {
  height: 120px;
  overflow: auto;   /* adds a scrollbar only when needed */
}
```

The values are `visible` (the default, it spills out), `hidden` (cuts it off), `scroll` and `auto`.

## Position: placing things exactly

Normally elements flow one after another. The `position` property lets you move an element out of its normal place.

| Value | Behaviour |
| :-- | :-- |
| `static` | The default. In normal flow |
| `relative` | In normal flow, but you can nudge it with `top`, `left` and so on. It also becomes the **anchor** for absolute children |
| `absolute` | Taken **out of the flow** and placed relative to the nearest positioned parent |
| `fixed` | Stays fixed to the **browser window**, even when you scroll |
| `sticky` | Flows normally, then **sticks** to an edge when you scroll past it |

The classic uses are a **badge on a card** (absolute inside relative) and a **menu bar that stays at the top** (sticky or fixed). Scroll inside the preview to see the sticky bar. See also how the "New" badge sits on the corner of the card.

```live
=== html
<header class="bar">CloudTech Shop</header>
<div class="card">
  <span class="badge">New</span>
  <h3>Wireless earbuds</h3>
  <p>₦18,500</p>
</div>
<p>Scroll down.</p>
<div style="height: 500px"></div>
<p>The bar stayed at the top.</p>
=== css
body { font-family: system-ui, sans-serif; margin: 0; }
.bar {
  position: sticky;
  top: 0;
  background: #1f2937;
  color: white;
  padding: 14px 20px;
  z-index: 10;
}
.card {
  position: relative;        /* the anchor for the badge */
  width: 220px;
  margin: 24px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}
.badge {
  position: absolute;        /* placed against the card */
  top: -10px;
  right: -10px;
  background: crimson;
  color: white;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
}
```

When elements overlap, `z-index` decides which one is on top. A higher number sits in front. It only works on positioned elements.

> [!WARNING]
> Do not use absolute positioning to build a whole page layout. It is fragile and breaks on different screens. Use it for small things like badges and use flexbox and grid (the next lessons) for layout.

## Try it

Style a product card using the box model. The HTML is ready, and your CSS has to make it look like a real card.

```webtask
{
  "id": "web-m07-t1",
  "minutes": 12,
  "required": true,
  "tabs": ["css"],
  "rules": [
    { "label": "box-sizing: border-box is applied to the card", "selector": ".card", "style": { "box-sizing": "border-box" } },
    { "label": "The card has at least 16px of padding on every side", "selector": ".card", "style": { "padding-top": "^(1[6-9]|[2-9]\\d|\\d{3,})(\\.\\d+)?px$", "padding-left": "^(1[6-9]|[2-9]\\d|\\d{3,})(\\.\\d+)?px$" } },
    { "label": "The card has a visible border", "selector": ".card", "style": { "border-top-width": "^[1-9]", "border-top-style": "solid" } },
    { "label": "The card has rounded corners (at least 8px)", "selector": ".card", "style": { "border-top-left-radius": "^([89]|\\d{2,})(\\.\\d+)?px$" } },
    { "label": "The card is no wider than 320px and is centred (equal, non-zero side margins)", "selector": ".card", "style": { "max-width": "^(2\\d\\d|3[01]\\d|320)px$", "margin-left": "^[1-9]" } },
    { "label": "The button is display: inline-block with padding", "selector": ".buy", "style": { "display": "inline-block", "padding-top": "^([6-9]|\\d{2,})px$" } },
    { "label": "The price has a bigger font size than normal text (at least 1.25rem)", "selector": ".price", "style": { "font-size": "^(2\\d|[3-9]\\d)(\\.\\d+)?px$" } }
  ],
  "hint": ".card { box-sizing: border-box; max-width: 300px; margin: 24px auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; } .buy { display: inline-block; padding: 10px 20px; } .price { font-size: 1.5rem; }",
  "height": 380
}
=== prompt
Make this product card look professional with CSS only. The `.card` needs `box-sizing: border-box`, at least 16px padding, a solid border, rounded corners of at least 8px, a `max-width` of about 300px, and `margin: 24px auto` to centre it. The `.buy` link must be `display: inline-block` with padding, and `.price` must have a larger font size.
=== html
<div class="card">
  <h3>Ankara tote bag</h3>
  <p>Handmade in Abeokuta. Strong, light and colourful.</p>
  <p class="price">₦12,000</p>
  <a class="buy" href="#">Add to cart</a>
</div>
=== css
body {
  font-family: system-ui, sans-serif;
}
.buy {
  background: #0f766e;
  color: white;
  text-decoration: none;
  border-radius: 8px;
}
=== sample css
body {
  font-family: system-ui, sans-serif;
}
.card {
  box-sizing: border-box;
  max-width: 300px;
  margin: 24px auto;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}
.price {
  font-size: 1.5rem;
  font-weight: bold;
}
.buy {
  display: inline-block;
  padding: 10px 20px;
  background: #0f766e;
  color: white;
  text-decoration: none;
  border-radius: 8px;
}
=== note
The button looked flat because an inline element ignores vertical padding and margin. `display: inline-block` is the fix you will use all the time.
```

Next, position. Build a page with a header that sticks to the top as you scroll, and a card with a corner badge.

```webtask
{
  "id": "web-m07-t2",
  "minutes": 10,
  "required": true,
  "tabs": ["css"],
  "rules": [
    { "label": "The header is position: sticky and sticks at the top (top: 0)", "selector": "header", "style": { "position": "sticky", "top": "^0px$" } },
    { "label": "The header sits above other content (z-index of at least 1)", "selector": "header", "style": { "z-index": "^([1-9]|\\d{2,})$" } },
    { "label": "The card is position: relative (so the badge can be placed against it)", "selector": ".card", "style": { "position": "relative" } },
    { "label": "The badge is position: absolute", "selector": ".badge", "style": { "position": "absolute" } },
    { "label": "The badge is moved to a corner with top and right (not left at auto)", "in": "css", "pattern": "\\.badge\\s*\\{[^}]*\\btop\\s*:[^}]*\\bright\\s*:|\\.badge\\s*\\{[^}]*\\bright\\s*:[^}]*\\btop\\s*:" }
  ],
  "hint": "header { position: sticky; top: 0; z-index: 10; } .card { position: relative; } .badge { position: absolute; top: -10px; right: -10px; }",
  "height": 340
}
=== prompt
Make the `<header>` stick to the top while scrolling (`position: sticky` with `top: 0` and a `z-index`), make `.card` a positioned parent (`position: relative`), and place the `.badge` in the top right corner of the card (`position: absolute` with `top` and `right`).
=== html
<header>Naija Fashion Store</header>
<div class="card">
  <span class="badge">Sale</span>
  <h3>Adire shirt</h3>
  <p>₦9,500</p>
</div>
<div style="height: 600px"></div>
<p>The end of the page.</p>
=== css
body {
  font-family: system-ui, sans-serif;
  margin: 0;
}
header {
  background: #1f2937;
  color: white;
  padding: 14px 20px;
}
.card {
  width: 200px;
  margin: 28px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}
.badge {
  background: crimson;
  color: white;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
}
=== sample css
body {
  font-family: system-ui, sans-serif;
  margin: 0;
}
header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #1f2937;
  color: white;
  padding: 14px 20px;
}
.card {
  position: relative;
  width: 200px;
  margin: 28px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}
.badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: crimson;
  color: white;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
}
```

```answer
{
  "id": "web-m07-a1",
  "prompt": "In the box model, which layer is the space **outside** the border, pushing other boxes away? Type its name.",
  "answer": "margin",
  "format": "text",
  "accept": ["the margin", "margins"],
  "explanation": "Padding is inside the border; margin is outside it.",
  "required": true
}
```
