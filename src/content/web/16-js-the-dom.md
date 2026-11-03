---
title: "The DOM: Changing a Page with JavaScript"
minutes: 35
summary: Learn how JavaScript sees a page as a tree of elements, and how to find elements, change their text, styles and classes, and create new ones. Build a live product list from data.
---

## The page as a tree

When the browser loads your HTML, it builds a living model of the page in memory, called the **DOM** (Document Object Model). Each element becomes an **object** in a tree: `<html>` at the top, `<head>` and `<body>` below it, and so on down to every paragraph and link.

JavaScript can read this tree and **change** it, and the browser instantly redraws the page. This is how every interactive website works: JavaScript changes the DOM, and the visitor sees a new page.

The special object `document` is your starting point. The work always has three steps:

1. **Find** an element.
2. **Change** it (its text, style, classes or attributes).
3. Do this **in response to something** (a click, a timer, data arriving). That is the next lesson.

## Finding elements

`document.querySelector()` finds the **first** element that matches a CSS selector, the same selectors you already know:

```js
const title = document.querySelector("h1");              // by tag
const button = document.querySelector("#order-btn");     // by id
const firstCard = document.querySelector(".card");       // first with this class
const link = document.querySelector("nav a");            // a link inside nav
```

To find **all** matches, use `querySelectorAll()`, which returns a list you can loop over:

```js
const cards = document.querySelectorAll(".card");
cards.forEach((card) => console.log(card.textContent));
```

If nothing matches, `querySelector` returns `null`, and trying to use it gives the famous error `Cannot read properties of null`. When you see that, check your selector and check that the script runs **after** the elements exist (that is why scripts go at the end of `<body>`).

## Changing text and HTML

```live
=== html
<h1 id="title">Welcome</h1>
<p id="message">Loading...</p>
=== js
const title = document.querySelector("#title");
const message = document.querySelector("#message");

title.textContent = "Welcome to Mama Ngozi's Kitchen";
message.textContent = "We are open today until 8 pm.";
```

- `textContent` sets or reads the **text**. Safe and the one to use most.
- `innerHTML` sets the content as **HTML**, so tags work: `box.innerHTML = "<strong>Open</strong>"`.

> [!WARNING]
> Never put text that came from a user (for example from a form or a URL) into `innerHTML`. A visitor could include a `<script>` or other harmful HTML in it, which is a security hole called XSS. Use `textContent` for user text.

## Changing styles and classes

You can set a style directly, but the better way is to **add and remove classes** and keep the look in CSS:

```live
=== html
<p id="note">This note changes.</p>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
.highlight {
  background: #fde68a;
  padding: 8px 12px;
  border-radius: 8px;
}
=== js
const note = document.querySelector("#note");

note.classList.add("highlight");        // add a class
// note.classList.remove("highlight");  // remove it
// note.classList.toggle("highlight");  // add if missing, remove if present

note.style.color = "#b45309";           // direct style (camelCase names)
note.style.fontSize = "1.4rem";
```

`classList` has `add`, `remove`, `toggle` and `contains`. Direct styles use camelCase (`backgroundColor`, not `background-color`).

## Changing attributes

```live
=== html
<a id="link" href="#">Visit</a>
<br />
<img id="photo" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='90'><rect width='160' height='90' fill='%230f766e'/></svg>" alt="Old picture" />
=== js
const link = document.querySelector("#link");
link.setAttribute("href", "https://academy.cloudtechanalytics.com");
link.textContent = "Visit CloudTech Academy";
console.log(link.getAttribute("href"));

const photo = document.querySelector("#photo");
photo.alt = "A green rectangle";           // many attributes are also properties
console.log(photo.alt);
```

## Creating and removing elements

This is where the DOM becomes powerful: you can build parts of the page from data. The steps are **create, fill, add**.

```live
=== html
<h2>Shopping list</h2>
<ul id="list"></ul>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
li { padding: 4px 0; }
=== js
const list = document.querySelector("#list");

const item = document.createElement("li");   // 1. create
item.textContent = "Rice";                   // 2. fill
list.appendChild(item);                      // 3. add to the page

const second = document.createElement("li");
second.textContent = "Beans";
list.append(second);                         // append also works
```

To remove an element, call `element.remove()`. To insert at the start, use `prepend()`.

## Building a page from data

Now combine this with arrays of objects from the last lesson. This is the pattern behind nearly every real web page: **take a list of data and turn each item into elements.**

```live
{ "stack": true, "height": 380 }
=== html
<h2>Our products</h2>
<div id="products" class="grid"></div>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
.card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px; }
.card h3 { margin: 0 0 6px; }
.price { font-weight: bold; color: #0f766e; }
.out { opacity: 0.5; }
=== js
const products = [
  { name: "Ankara bag", price: 12000, inStock: true },
  { name: "Sandals", price: 18500, inStock: false },
  { name: "Scarf", price: 8500, inStock: true },
];

const container = document.querySelector("#products");

products.forEach((product) => {
  const card = document.createElement("article");
  card.className = "card";
  if (!product.inStock) card.classList.add("out");

  const name = document.createElement("h3");
  name.textContent = product.name;

  const price = document.createElement("p");
  price.className = "price";
  price.textContent = `₦${product.price.toLocaleString()}`;

  card.append(name, price);
  container.append(card);
});
```

Add a fourth product to the array and see a fourth card appear, with no HTML edited. `toLocaleString()` formats the number with commas.

### Template literals with innerHTML

Building elements one by one is clear but long. For content **you control** (not user input), you can generate a whole chunk of HTML from a template literal:

```live
=== html
<ul id="menu"></ul>
=== js
const dishes = [
  { name: "Jollof rice", price: 3000 },
  { name: "Fried rice", price: 2800 },
];

const menu = document.querySelector("#menu");
menu.innerHTML = dishes.map((d) => `<li>${d.name}: ₦${d.price}</li>`).join("");
```

`map` turns each dish into a string of HTML, and `join("")` glues them together. This is short and common, and it is only safe when the data is yours, never from a visitor.

## Walking the tree

Sometimes you start from one element and want a neighbour:

```js
element.parentElement          // the parent
element.children               // the child elements
element.nextElementSibling     // the next sibling
element.closest(".card")       // the nearest ancestor matching a selector
```

`closest()` is especially useful in the next lesson, when you click a button inside a card and need to know which card it belongs to.

## Try it

Fill a list from an array of data, using `createElement` or a template.

```webtask
{
  "id": "web-m16-t1",
  "minutes": 12,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "The list (#lessons) ends up with one <li> for each of the four lessons", "selector": "#lessons li", "min": 4, "max": 4 },
    { "label": "Each list item shows the lesson title: HTML, CSS, JavaScript and Bootstrap", "page": "HTML[\\s\\S]*CSS[\\s\\S]*JavaScript[\\s\\S]*Bootstrap" },
    { "label": "The completed lessons have the done class (two items)", "selector": "#lessons li.done", "min": 2, "max": 2 },
    { "label": "Your JavaScript uses querySelector and creates elements or a template", "in": "js", "pattern": "querySelector\\(" },
    { "label": "It uses a loop or forEach/map over the lessons array", "in": "js", "pattern": "\\.forEach\\(|\\.map\\(|for\\s*\\(" },
    { "label": "The HTML file itself was not changed: the list is built by JavaScript", "in": "html", "pattern": "<li", "absent": true }
  ],
  "hint": "const list = document.querySelector(\"#lessons\"); lessons.forEach((lesson) => { const li = document.createElement(\"li\"); li.textContent = lesson.title; if (lesson.done) li.classList.add(\"done\"); list.append(li); });",
  "height": 320
}
=== prompt
The `lessons` array holds four lessons. Build the list **with JavaScript**: for each lesson, create an `<li>` inside `#lessons`, set its text to the lesson's `title`, and add the class `done` when `lesson.done` is `true`. Do not write any `<li>` in the HTML.
=== html
<h2>My learning path</h2>
<ul id="lessons"></ul>
=== css
body {
  font-family: system-ui, sans-serif;
  padding: 16px;
}
li.done {
  text-decoration: line-through;
  color: #6b7280;
}
=== js
const lessons = [
  { title: "HTML", done: true },
  { title: "CSS", done: true },
  { title: "JavaScript", done: false },
  { title: "Bootstrap", done: false },
];

// Write your code below
=== sample js
const lessons = [
  { title: "HTML", done: true },
  { title: "CSS", done: true },
  { title: "JavaScript", done: false },
  { title: "Bootstrap", done: false },
];

const list = document.querySelector("#lessons");

lessons.forEach((lesson) => {
  const li = document.createElement("li");
  li.textContent = lesson.title;
  if (lesson.done) li.classList.add("done");
  list.append(li);
});
```

Now change an existing page: update text, toggle classes and attributes.

```webtask
{
  "id": "web-m16-t2",
  "minutes": 10,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "The heading text now says: Open today", "selector": "#status", "contains": "^\\s*Open today\\s*$" },
    { "label": "The heading has the open class", "selector": "#status.open", "min": 1 },
    { "label": "The link points to the contact page: href ends with contact.html", "selector": "#cta[href$='contact.html']", "min": 1 },
    { "label": "The link text is Contact us", "selector": "#cta", "contains": "^\\s*Contact us\\s*$" },
    { "label": "The old paragraph with class old is removed from the page", "selector": ".old", "min": 0, "max": 0 },
    { "label": "A new paragraph with class new is added to the page", "selector": "p.new", "min": 1 }
  ],
  "hint": "heading.textContent = \"Open today\"; heading.classList.add(\"open\"); cta.setAttribute(\"href\", \"contact.html\"); cta.textContent = \"Contact us\"; document.querySelector(\".old\").remove(); const p = document.createElement(\"p\"); p.className = \"new\"; p.textContent = \"...\"; document.body.append(p);",
  "height": 320
}
=== prompt
Using JavaScript only, make these changes: set the heading `#status` text to `Open today` and give it the class `open`; set the link `#cta` to point to `contact.html` with the text `Contact us`; remove the paragraph with class `old`; and add a new paragraph with the class `new` to the page.
=== html
<h1 id="status">Closed</h1>
<p class="old">This notice is out of date.</p>
<a id="cta" href="#">Learn more</a>
=== css
body {
  font-family: system-ui, sans-serif;
  padding: 16px;
}
.open {
  color: #15803d;
}
=== js
// Write your code here
=== sample js
const heading = document.querySelector("#status");
heading.textContent = "Open today";
heading.classList.add("open");

const cta = document.querySelector("#cta");
cta.setAttribute("href", "contact.html");
cta.textContent = "Contact us";

document.querySelector(".old").remove();

const notice = document.createElement("p");
notice.className = "new";
notice.textContent = "We are open from 8 am to 6 pm.";
document.body.append(notice);
```

```answer
{
  "id": "web-m16-a1",
  "prompt": "Which property sets an element's text safely, without interpreting HTML tags? Type its name.",
  "answer": "textContent",
  "format": "text",
  "accept": ["textcontent", "element.textContent", ".textContent"],
  "explanation": "textContent treats everything as plain text. innerHTML parses HTML, which is risky with user-provided text.",
  "required": true
}
```
