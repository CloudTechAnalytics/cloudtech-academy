---
title: CSS Fundamentals: Selectors and the Cascade
minutes: 35
summary: Learn how CSS works, the three ways to add it, every kind of selector, and the rules that decide which style wins. Style a page from plain HTML to something you are proud of.
---

## What CSS does

HTML gives a page its structure, but on its own it looks like a plain document. **CSS** (Cascading Style Sheets) is the language that controls how it looks: colours, fonts, spacing, layout, even animation.

A CSS **rule** has two parts, a **selector** that says *which* elements, and a **declaration block** that says *how* to style them:

```css
h1 {
  color: crimson;
  font-size: 40px;
}
```

- `h1` is the **selector**: every `<h1>` on the page.
- Inside `{ }` are the **declarations**. Each has a **property** (`color`), a colon, a **value** (`crimson`) and ends with a semicolon.

Try it. The CSS is in the second tab. Change the colour names and the sizes, and add a new rule for `p`.

```live
=== html
<h1>Mama Ngozi's Kitchen</h1>
<p>Home-style Nigerian food, cooked fresh every day.</p>
<p>Open Monday to Saturday, 10 am to 8 pm.</p>
=== css
h1 {
  color: crimson;
  font-size: 40px;
}
```

## Three ways to add CSS

| Way | How | When to use it |
| :-- | :-- | :-- |
| **External file** | `<link rel="stylesheet" href="style.css">` in the `<head>` | **Always, for real sites.** One file styles every page |
| **Internal** | A `<style>` element in the `<head>` | A quick one-page experiment |
| **Inline** | `style="color: red;"` on one element | Rarely: it is hard to maintain and hard to override |

In the editors on this course, the CSS tab is your `style.css`, and the preview connects it for you. When you build your own site in lesson 22, you will add the `<link>` line yourself:

```html
<head>
  <link rel="stylesheet" href="style.css" />
</head>
```

## Selectors: choosing what to style

The selector is the heart of CSS. Learn these and you can style anything.

| Selector | Matches | Example |
| :-- | :-- | :-- |
| **Element** | Every element of that type | `p { }` |
| **Class** | Elements with that `class` | `.card { }` |
| **ID** | The one element with that `id` | `#contact { }` |
| **Group** | Several selectors at once | `h1, h2, h3 { }` |
| **Descendant** | Inside another element, at any depth | `nav a { }` |
| **Child** | A direct child only | `ul > li { }` |
| **Universal** | Everything | `* { }` |
| **Attribute** | Elements with an attribute | `input[type="email"] { }` |

Try each one in this example. Read the CSS, then change which elements it selects.

```live
=== html
<header>
  <h1>Bright Future Academy</h1>
  <nav>
    <a href="#a">Home</a>
    <a href="#b">Programmes</a>
    <a href="#c">Apply</a>
  </nav>
</header>
<main>
  <p class="lead">Quality education in Ibadan.</p>
  <p>Small classes and caring teachers.</p>
  <p class="note">Applications close on 15 January.</p>
  <p id="phone">Call 0801 234 5678</p>
</main>
=== css
* {
  font-family: system-ui, sans-serif;
}
h1 {
  color: #0f766e;
}
nav a {
  color: #b45309;
  margin-right: 12px;
}
.lead {
  font-size: 1.4rem;
  font-weight: bold;
}
.note {
  background: #fef3c7;
  padding: 8px;
}
#phone {
  color: crimson;
}
```

> [!TIP]
> Prefer **classes** for styling. Ids are unique and very strong (you will see why in a moment), so they are better saved for jumping to a section and for JavaScript.

### Pseudo-classes: styling a state

A **pseudo-class** adds a colon and styles an element in a particular state:

```css
a:hover { color: crimson; }        /* when the mouse is over it */
button:active { transform: scale(0.97); } /* while it is pressed */
input:focus { outline: 3px solid #0f766e; } /* when it is selected */
li:first-child { font-weight: bold; }
li:nth-child(even) { background: #f3f4f6; }  /* every second item */
```

```live
=== html
<ul class="menu">
  <li><a href="#">Jollof rice</a></li>
  <li><a href="#">Fried rice</a></li>
  <li><a href="#">Ofada rice</a></li>
  <li><a href="#">Pounded yam</a></li>
</ul>
<input type="text" placeholder="Click here to focus" />
=== css
.menu {
  list-style: none;
  padding: 0;
  width: 220px;
}
.menu li:nth-child(even) {
  background: #f3f4f6;
}
.menu li:first-child {
  font-weight: bold;
}
.menu a {
  display: block;
  padding: 10px;
  color: #1f2937;
  text-decoration: none;
}
.menu a:hover {
  background: #0f766e;
  color: white;
}
input:focus {
  outline: 3px solid #0f766e;
}
```

Hover over the items and click the box. Those effects need no JavaScript.

## The cascade: what happens when rules disagree

What if two rules style the same element?

```css
p { color: black; }
.note { color: crimson; }
```

A paragraph with `class="note"` gets **both**. The browser decides with three rules, in this order:

1. **Specificity.** The more specific selector wins. Roughly: an id beats a class, and a class beats an element. So `.note` beats `p`.
2. **Order.** If the specificity is equal, the rule written **later** wins.
3. **`!important`.** It beats everything, but it makes code hard to change. Avoid it.

| Selector | Specificity (stronger to weaker) |
| :-- | :-- |
| `style="..."` inline | Strongest |
| `#phone` | Id |
| `.note`, `a:hover`, `[type="text"]` | Class level |
| `p`, `h1`, `::before` | Element level |

```live
=== html
<p>An ordinary paragraph.</p>
<p class="note">A paragraph with the note class.</p>
<p class="note" id="special">A paragraph with a class and an id.</p>
=== css
p {
  color: black;
}
.note {
  color: crimson;
}
#special {
  color: royalblue;
}
```

Which colour does each paragraph get? Predict first, then change the rules and see. If you ever write CSS that does not seem to work, the answer is almost always a more specific rule somewhere else. In the browser, **right-click, Inspect** and look at the **Styles** panel: it shows every rule that applies and crosses out the ones that lost.

### Inheritance

Some properties, such as `color`, `font-family` and `line-height`, are **inherited**: children use their parent's value unless they set their own. That is why one rule on `body` can set the font for the whole page.

```css
body {
  font-family: system-ui, sans-serif;
  color: #1f2937;
}
```

Others, like `border`, `margin` and `padding`, are not inherited. That makes sense, since a border around a list should not appear around every item.

## Colours and units, the quick version

You will go deep in later lessons, but you need a little now:

```css
color: crimson;            /* a colour name */
color: #0f766e;            /* a hex code: red, green, blue */
color: rgb(15 118 110);    /* the same colour, in rgb */
font-size: 18px;           /* pixels */
font-size: 1.25rem;        /* a multiple of the base size, better */
```

Look for a colour code you like on a site such as coolors.co, or pick one from your browser's DevTools colour picker.

## A clean starting style

Many projects start with something like this. Put it at the top of your CSS and your page already looks calm and readable.

```live
=== html
<h1>Tech Meetup Lagos</h1>
<p class="lead">Free monthly talks for people learning data and web development.</p>
<p>Next meeting: <strong>Saturday 15 November</strong>, Yaba.</p>
<a class="button" href="#">Reserve a seat</a>
=== css
body {
  font-family: system-ui, sans-serif;
  color: #1f2937;
  background: #f9fafb;
  line-height: 1.6;
  max-width: 640px;
  margin: 0 auto;
  padding: 24px;
}
h1 {
  color: #0f766e;
}
.lead {
  font-size: 1.25rem;
}
.button {
  display: inline-block;
  background: #0f766e;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
}
.button:hover {
  background: #115e59;
}
```

`max-width` and `margin: 0 auto` keep your text a comfortable width and centre it on a wide screen. Do not worry about how they work yet. The next lesson explains exactly that.

## Try it

First, style a page with the selectors you learned. The HTML is already written.

```webtask
{
  "id": "web-m06-t1",
  "minutes": 12,
  "required": true,
  "tabs": ["css"],
  "rules": [
    { "label": "The body uses a different font family (not the browser default serif)", "selector": "body", "style": { "font-family": "sans-serif|system-ui|Arial|Helvetica|Verdana|Tahoma|Trebuchet|Georgia|Segoe" } },
    { "label": "The <h1> has a colour other than black", "selector": "h1", "style": { "color": "^(?!rgb\\(0, 0, 0\\))" } },
    { "label": "Elements with class \"note\" have a background colour", "selector": ".note", "style": { "background-color": "^(?!rgba\\(0, 0, 0, 0\\))" } },
    { "label": "The element with id \"phone\" is bold", "selector": "#phone", "style": { "font-weight": "^(bold|[6-9]00)$" } },
    { "label": "Links inside the <nav> have no underline", "selector": "nav a", "style": { "text-decoration-line": "none" } },
    { "label": "Hovering a link changes it (an a:hover rule exists)", "in": "css", "pattern": "a:hover\\s*\\{" },
    { "label": "Even list items have a different background (li:nth-child(even))", "in": "css", "pattern": "li:nth-child\\(\\s*(even|2n)\\s*\\)" }
  ],
  "hint": "Write rules like: body { font-family: system-ui, sans-serif; } h1 { color: #0f766e; } .note { background: #fef3c7; } #phone { font-weight: bold; } nav a { text-decoration: none; } nav a:hover { color: crimson; } li:nth-child(even) { background: #f3f4f6; }",
  "height": 360
}
=== prompt
Style this page using only CSS. Give the `body` a sans-serif font, the `<h1>` a colour, the `.note` paragraph a background colour, the `#phone` paragraph bold text, remove the underline from links in the `<nav>`, add an `a:hover` rule, and give even list items a different background.
=== html
<header>
  <h1>Greenfield Secondary School</h1>
  <nav>
    <a href="#a">About</a>
    <a href="#b">News</a>
    <a href="#c">Contact</a>
  </nav>
</header>
<main>
  <p>A day and boarding school in Enugu.</p>
  <p class="note">Entrance exams open on 30 November.</p>
  <p id="phone">Call 0801 234 5678</p>
  <ul>
    <li>Mathematics</li>
    <li>English</li>
    <li>Science</li>
    <li>Civic Education</li>
  </ul>
</main>
=== css
/* Write your CSS here */
=== sample css
body {
  font-family: system-ui, sans-serif;
}
h1 {
  color: #0f766e;
}
nav a {
  text-decoration: none;
  margin-right: 12px;
}
a:hover {
  color: crimson;
}
.note {
  background: #fef3c7;
  padding: 8px;
}
#phone {
  font-weight: bold;
}
li:nth-child(even) {
  background: #f3f4f6;
}
=== note
Notice that you changed the whole look without touching the HTML. That is the power of separating structure and style.
```

Now solve a cascade puzzle. Two rules fight over the colour of the same paragraph. Without changing the HTML or deleting the existing rules, make the paragraph with `id="winner"` **green**.

```webtask
{
  "id": "web-m06-t2",
  "minutes": 8,
  "required": true,
  "tabs": ["css"],
  "rules": [
    { "label": "The paragraph with id \"winner\" is green", "selector": "#winner", "style": { "color": "rgb\\(0, 128, 0\\)|rgb\\(0, 1[0-9]{2}, [0-9]+\\)|rgb\\(\\d+, 1[2-9]\\d, \\d+\\)" } },
    { "label": "The existing .box rule is still there", "in": "css", "pattern": "\\.box\\s*\\{[^}]*color:\\s*crimson" },
    { "label": "You did not use !important", "in": "css", "pattern": "!important", "absent": true }
  ],
  "hint": "The .box rule is a class, and p is only an element, so the class wins. To beat a class you need a more specific selector, such as an id: #winner { color: green; }.",
  "height": 300
}
=== prompt
This page has a rule for `.box` that makes text crimson. The paragraph has both `class="box"` and `id="winner"`. Add a rule so it becomes a green colour, without using `!important`, and without deleting the existing rules.
=== html
<p class="box" id="winner">I want to be green.</p>
<p class="box">I stay crimson.</p>
=== css
.box {
  color: crimson;
  font-size: 1.5rem;
}
p {
  color: black;
}
=== sample css
.box {
  color: crimson;
  font-size: 1.5rem;
}
p {
  color: black;
}
#winner {
  color: green;
}
=== note
An id selector is more specific than a class, so it wins. That is why most developers use classes for styling: they stay easy to override. If ids and `!important` are everywhere, CSS becomes a fight.
```

```answer
{
  "id": "web-m06-a1",
  "prompt": "Which selector would style every element with `class=\"note\"`? Type the selector only.",
  "answer": ".note",
  "format": "text",
  "explanation": "A dot selects a class, a hash (#) selects an id, and a plain name like p selects every element of that type.",
  "required": true
}
```
