---
title: "Bootstrap 5: Setup, the Grid and Utilities"
minutes: 35
summary: Meet Bootstrap, the world's most popular CSS framework. Add it to a page, lay out content with its 12-column responsive grid, and style quickly with utility classes for spacing, colour, text and flexbox.
---

## What is Bootstrap?

Writing every piece of CSS yourself gives total control, but it takes time. **Bootstrap** is a free, ready-made collection of CSS and JavaScript that solves the common jobs for you: a responsive grid, navigation bars, buttons, cards, forms, modals and much more. You do not write the CSS. You add **class names** to your HTML, and the styles are already there.

It is used by millions of sites, including many company dashboards and startup pages, so you will meet it in real jobs. The honest trade-offs:

| Strength | Weakness |
| :-- | :-- |
| Fast: a polished page in minutes | Sites can look alike if you do not customise |
| Responsive and tested on every browser | You carry CSS you may not use |
| Consistent, well-documented, huge community | You must learn its class names |

Everything you learned about HTML and CSS still matters. Bootstrap is built on it, and you will often add your own CSS on top. Learning it is faster when you understand what it is doing for you.

## Adding Bootstrap to a page

You add Bootstrap with two lines from a **CDN** (a fast public server), no downloading needed. The CSS goes in the `<head>`, and the JavaScript goes just before `</body>`. Here is the standard starter page:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My Bootstrap page</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
  </head>
  <body>
    <h1>Hello, Bootstrap!</h1>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
```

The **viewport** meta tag is essential: without it, Bootstrap's responsive layout does not work on phones. The JavaScript bundle is needed only for interactive parts such as menus that collapse, modals and carousels.

In this course's editors, Bootstrap 5 is already loaded for you, so you can write just the body HTML. Try some Bootstrap classes right now:

```live
{ "bootstrap": true, "height": 260 }
=== html
<div class="container py-4">
  <h1 class="text-primary">Hello, Bootstrap!</h1>
  <p class="lead">Styled with class names only.</p>
  <button class="btn btn-primary">Primary</button>
  <button class="btn btn-outline-secondary">Outline</button>
  <button class="btn btn-success">Success</button>
</div>
```

There is not one line of CSS here, yet the page already looks professional.

## Containers

Everything in a Bootstrap page sits in a **container**, which centres the content and sets its width and side padding.

| Class | Behaviour |
| :-- | :-- |
| `.container` | Fixed maximum width that grows at each breakpoint, centred |
| `.container-fluid` | Always full width |
| `.container-md` | Full width until the `md` breakpoint, then fixed |

## The grid system

Bootstrap's grid divides the width into **12 columns**. You make a `.row`, put columns inside it, and say how many of the 12 each column takes. The row's columns always add up to 12 (or wrap onto a new line if they go over).

```html
<div class="container">
  <div class="row">
    <div class="col-8">Takes 8 of 12 columns</div>
    <div class="col-4">Takes 4 of 12 columns</div>
  </div>
</div>
```

The magic is the **breakpoint** prefixes, which make the layout responsive:

| Prefix | From screen width | Typical device |
| :-- | :-- | :-- |
| (none) | Always, from 0 | Phones |
| `sm` | 576px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 992px | Laptops |
| `xl` | 1200px | Desktops |
| `xxl` | 1400px | Large screens |

A class like `col-md-4` means "4 columns wide, **from the md breakpoint upwards**". Below that, columns stack to full width. This is exactly the mobile-first idea from lesson 11, with no media query to write. Try the next example in the three preview sizes (**Phone**, **Fit** and **Desktop**).

```live
{ "bootstrap": true, "stack": true, "height": 380 }
=== html
<div class="container py-3">
  <div class="row g-3">
    <div class="col-12 col-md-4"><div class="p-3 bg-primary-subtle border rounded">One</div></div>
    <div class="col-12 col-md-4"><div class="p-3 bg-success-subtle border rounded">Two</div></div>
    <div class="col-12 col-md-4"><div class="p-3 bg-warning-subtle border rounded">Three</div></div>
  </div>
  <div class="row g-3 mt-2">
    <div class="col-6 col-lg-3"><div class="p-3 bg-light border rounded">A</div></div>
    <div class="col-6 col-lg-3"><div class="p-3 bg-light border rounded">B</div></div>
    <div class="col-6 col-lg-3"><div class="p-3 bg-light border rounded">C</div></div>
    <div class="col-6 col-lg-3"><div class="p-3 bg-light border rounded">D</div></div>
  </div>
</div>
```

On a phone the first row stacks (each `col-12`), and the second shows two per row (`col-6`). On a wide screen, the first has three across and the second four across. `g-3` is a **gutter** class that puts a gap between columns.

### Useful grid tricks

- `col` with no number: equal-width columns that share the row.
- `col-auto`: a column only as wide as its content.
- `offset-md-2`: pushes a column right by 2 columns.
- `row-cols-1 row-cols-md-3`: "one per row on small screens, three per row from md" for a set of equal cards, with no need to number each column.

```live
{ "bootstrap": true, "stack": true, "height": 280 }
=== html
<div class="container py-3">
  <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
    <div class="col"><div class="p-3 border rounded">Excel</div></div>
    <div class="col"><div class="p-3 border rounded">SQL</div></div>
    <div class="col"><div class="p-3 border rounded">Python</div></div>
    <div class="col"><div class="p-3 border rounded">Web</div></div>
    <div class="col"><div class="p-3 border rounded">Power BI</div></div>
    <div class="col"><div class="p-3 border rounded">AI tools</div></div>
  </div>
</div>
```

## Utility classes: styling with class names

Utilities are small single-purpose classes. They replace lots of CSS you would otherwise write. The most useful groups:

### Spacing: margin and padding

The pattern is `{property}{sides}-{size}`:

- Property: `m` for margin, `p` for padding.
- Sides: `t` top, `b` bottom, `s` start (left), `e` end (right), `x` left and right, `y` top and bottom, or nothing for all four.
- Size: `0` to `5` (0, 0.25rem, 0.5rem, 1rem, 1.5rem, 3rem), or `auto`.

So `p-3` is padding of 1rem on all sides, `mt-4` is a top margin of 1.5rem, `px-5` is horizontal padding of 3rem, and `mx-auto` centres a block.

### Text, colour and borders

| Purpose | Classes |
| :-- | :-- |
| Text align | `text-start` `text-center` `text-end` |
| Text weight and size | `fw-bold` `fw-light` `fs-1` to `fs-6` `lead` |
| Text colour | `text-primary` `text-success` `text-danger` `text-muted` `text-white` |
| Background | `bg-primary` `bg-light` `bg-dark` `bg-success-subtle` |
| Border | `border` `border-0` `border-2` `border-primary` |
| Rounded corners | `rounded` `rounded-3` `rounded-pill` `rounded-circle` |
| Shadow | `shadow-sm` `shadow` `shadow-lg` |
| Width | `w-25` `w-50` `w-75` `w-100` |

### Display and flexbox utilities

You already know flexbox, and Bootstrap lets you use it with classes:

| Class | Same as |
| :-- | :-- |
| `d-flex` | `display: flex` |
| `flex-column` | `flex-direction: column` |
| `justify-content-between` | `justify-content: space-between` |
| `align-items-center` | `align-items: center` |
| `gap-3` | `gap: 1rem` |
| `d-none d-md-block` | Hidden on phones, shown from `md` up |

```live
{ "bootstrap": true, "stack": true, "height": 340 }
=== html
<div class="container py-4">
  <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
    <span class="fs-4 fw-bold text-success">Naija Eats</span>
    <button class="btn btn-sm btn-outline-success">Order now</button>
  </div>

  <div class="p-4 bg-light rounded-3 shadow-sm text-center">
    <h2 class="fw-bold">Fresh jollof, fast delivery</h2>
    <p class="text-muted mb-3">Across Lagos, every day until 10 pm.</p>
    <a href="#" class="btn btn-success px-4">See the menu</a>
  </div>

  <p class="d-none d-md-block mt-3 text-muted">This line only shows from tablet size upwards.</p>
</div>
```

That whole page, with a header, a hero box and a button, has no custom CSS. The class names read like a description of the design, and once you know the patterns you can build quickly.

## The colour system

Bootstrap's colours have names, not hex codes: `primary` (blue), `secondary` (grey), `success` (green), `danger` (red), `warning` (yellow), `info`, `light` and `dark`. They work in many classes: `btn-danger`, `text-danger`, `bg-danger`, `border-danger`, `alert-danger`. Pick by **meaning**: success for good news, danger for errors and destructive actions, warning for cautions.

## Customising Bootstrap

You can override Bootstrap with your own CSS. Load your stylesheet **after** Bootstrap's so your rules win. Bootstrap 5 also exposes CSS variables, so a brand colour is a small change:

```css
:root {
  --bs-primary: #0f766e;
  --bs-primary-rgb: 15, 118, 110;
}
.btn-primary {
  --bs-btn-bg: #0f766e;
  --bs-btn-border-color: #0f766e;
  --bs-btn-hover-bg: #115e59;
  --bs-btn-hover-border-color: #115e59;
}
```

```live
{ "bootstrap": true, "height": 220 }
=== html
<div class="container py-4">
  <button class="btn btn-primary btn-lg">My brand button</button>
  <span class="badge text-bg-primary ms-2">New</span>
</div>
=== css
.btn-primary {
  --bs-btn-bg: #0f766e;
  --bs-btn-border-color: #0f766e;
  --bs-btn-hover-bg: #115e59;
  --bs-btn-hover-border-color: #115e59;
}
.text-bg-primary {
  background-color: #0f766e !important;
}
```

## Try it

Build a responsive row of three feature boxes with the Bootstrap grid.

```webtask
{
  "id": "web-m19-t1",
  "minutes": 12,
  "required": true,
  "bootstrap": true,
  "stack": true,
  "height": 360,
  "tabs": ["html"],
  "rules": [
    { "label": "The content is in a .container", "selector": ".container .row", "min": 1 },
    { "label": "There are three columns in a .row", "selector": ".row > [class*='col']", "min": 3, "max": 3 },
    { "label": "On a phone (400px wide) each column takes the full row", "selector": ".row > [class*='col']", "at": 400, "style": { "width": "^(3[5-9]\\d|4\\d\\d)(\\.\\d+)?px$" } },
    { "label": "On a laptop (1000px wide) the three columns sit side by side (each about a third)", "selector": ".row > [class*='col']", "at": 1000, "style": { "width": "^(2[5-9]\\d|3[0-4]\\d)(\\.\\d+)?px$" } },
    { "label": "You used a breakpoint class such as col-md-4", "in": "html", "pattern": "col-(sm|md|lg)-4" },
    { "label": "Each column has a heading (<h3>) and some text", "selector": ".row h3", "min": 3 },
    { "label": "There is a gutter between columns (a g-* class on the row)", "in": "html", "pattern": "class=\"[^\"]*\\brow\\b[^\"]*\\bg-[1-5]\\b|class=\"[^\"]*\\bg-[1-5]\\b[^\"]*\\brow\\b" }
  ],
  "hint": "<div class=\"container py-4\"><div class=\"row g-3\"><div class=\"col-12 col-md-4\"><h3>Learn</h3><p>...</p></div> ...two more columns... </div></div>"
}
=== prompt
Using Bootstrap's grid, build a **features section**: a `.container` with a `.row g-3` holding **three columns** that are **full width on phones and one third of the row from the `md` breakpoint** (`col-12 col-md-4`). Each column needs an `<h3>` and a sentence. Bootstrap is already loaded for you.
=== html
<div class="container py-4">

</div>
=== sample html
<div class="container py-4">
  <div class="row g-3">
    <div class="col-12 col-md-4">
      <h3>Learn</h3>
      <p>Clear lessons with worked examples.</p>
    </div>
    <div class="col-12 col-md-4">
      <h3>Practise</h3>
      <p>Real tasks with instant feedback.</p>
    </div>
    <div class="col-12 col-md-4">
      <h3>Build</h3>
      <p>Finish with a project for your portfolio.</p>
    </div>
  </div>
</div>
```

Now style a card with utilities only.

```webtask
{
  "id": "web-m19-t2",
  "minutes": 10,
  "required": true,
  "bootstrap": true,
  "tabs": ["html"],
  "height": 340,
  "rules": [
    { "label": "The box has padding (p-3, p-4 or p-5)", "in": "html", "pattern": "class=\"[^\"]*\\bp-[345]\\b[^\"]*\"" },
    { "label": "It uses a rounded class and a shadow class", "in": "html", "pattern": "\\brounded(-[0-5])?\\b[\\s\\S]*\\bshadow(-sm|-lg)?\\b|\\bshadow(-sm|-lg)?\\b[\\s\\S]*\\brounded(-[0-5])?\\b" },
    { "label": "The heading is bold and uses a Bootstrap text colour (fw-bold, text-success or similar)", "in": "html", "pattern": "\\bfw-bold\\b[\\s\\S]*\\btext-(primary|success|danger|warning|info|dark)\\b|\\btext-(primary|success|danger|warning|info|dark)\\b[\\s\\S]*\\bfw-bold\\b" },
    { "label": "The text is centred (text-center)", "selector": ".text-center", "min": 1 },
    { "label": "The button is a Bootstrap button (btn btn-primary or btn-success) with a top margin (mt-3)", "selector": ".btn.mt-3", "min": 1 },
    { "label": "No custom <style> or style=\"\" is used: utilities only", "in": "html", "pattern": "<style|style=\"", "absent": true }
  ],
  "hint": "<div class=\"p-4 rounded-3 shadow text-center\"><h2 class=\"fw-bold text-success\">Starter plan</h2><p class=\"text-muted\">...</p><a class=\"btn btn-success mt-3\" href=\"#\">Choose</a></div>"
}
=== prompt
Style this pricing box using **only Bootstrap utility classes** (no custom CSS and no `style` attributes): padding (`p-4`), rounded corners (`rounded-3`), a shadow (`shadow`), centred text (`text-center`), a bold coloured heading (`fw-bold text-success`), muted paragraph text (`text-muted`), and a Bootstrap button (`btn btn-success`) with a top margin (`mt-3`).
=== html
<div class="container py-4">
  <div>
    <h2>Starter plan</h2>
    <p>₦5,000 a month. One user and basic reports.</p>
    <a href="#">Choose this plan</a>
  </div>
</div>
=== sample html
<div class="container py-4">
  <div class="p-4 rounded-3 shadow text-center">
    <h2 class="fw-bold text-success">Starter plan</h2>
    <p class="text-muted">₦5,000 a month. One user and basic reports.</p>
    <a href="#" class="btn btn-success mt-3">Choose this plan</a>
  </div>
</div>
```

```answer
{
  "id": "web-m19-a1",
  "prompt": "In Bootstrap, the grid divides the row into how many columns? Type the number.",
  "answer": "12",
  "format": "number",
  "explanation": "Bootstrap's grid has 12 columns per row, so col-4 is a third, col-6 a half and col-3 a quarter.",
  "required": true
}
```
