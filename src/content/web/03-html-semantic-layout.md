---
title: Page Structure: Semantic HTML and Layout Elements
minutes: 30
summary: Learn to build a page the way professionals do, with header, nav, main, section, article, aside and footer, and when to use div and span. Lay out a complete school website homepage.
---

## Why structure matters

Look at any website, such as a news site or a school page. You can point out the parts without reading a word: the **top** with the logo and menu, the **main** content, a **sidebar**, and the **bottom** with contact details.

Early websites built all of this with the same meaningless element, `<div>`. A browser, a search engine or a screen reader could not tell a menu from a footer. Modern HTML gives each part its own element with a **meaning**. This is called **semantic HTML**, and it matters for three reasons:

1. **Accessibility.** A blind visitor with a screen reader can jump straight to the main content or the menu.
2. **Search engines.** Google understands your page better, which helps people find it.
3. **You.** Code you can read is code you can fix. `<footer>` is clearer than `<div class="bottom-thing">`.

## The building blocks of a page

| Element | What it is for |
| :-- | :-- |
| `<header>` | The introduction at the top of a page or section: logo, title, tagline |
| `<nav>` | A block of navigation links, like the main menu |
| `<main>` | The main content of the page. **Use only one** per page |
| `<section>` | A themed group of content, usually with its own heading |
| `<article>` | A self-contained piece that could stand alone: a blog post, a news story, a product card |
| `<aside>` | Related but secondary content, like a sidebar or a tip box |
| `<footer>` | The closing part of a page or section: contact details, copyright, links |

Here is a page using all of them. You cannot see much difference in the preview, because the browser adds no styling to these elements, but the **structure** is what counts. Use the **Phone** and **Full** buttons above the preview, and edit the code to see how the page reads from top to bottom.

```live
=== html
<header>
  <h1>Greenfield Secondary School</h1>
  <p>Learning for life, in the heart of Enugu.</p>
  <nav>
    <a href="#about">About</a> |
    <a href="#news">News</a> |
    <a href="#contact">Contact</a>
  </nav>
</header>

<main>
  <section id="about">
    <h2>About us</h2>
    <p>We are a day and boarding school for students aged 10 to 17.</p>
  </section>

  <section id="news">
    <h2>School news</h2>
    <article>
      <h3>Our team wins the state science fair</h3>
      <p>Three students from SS2 won first prize for a water-saving irrigation model.</p>
    </article>
    <article>
      <h3>Entrance exams open</h3>
      <p>Applications for the new session close on 30 November.</p>
    </article>
  </section>

  <aside>
    <h2>Did you know?</h2>
    <p>Our library has over 5,000 books.</p>
  </aside>
</main>

<footer id="contact">
  <p>Greenfield Secondary School, 14 Independence Layout, Enugu</p>
  <p>&copy; 2026 Greenfield Secondary School</p>
</footer>
```

### How to choose the right one

Ask yourself a short question:

- Is it **the whole top or bottom of the page**? `<header>` or `<footer>`.
- Is it **a menu of links**? `<nav>`.
- Is it **a standalone item** you could post on its own, like a story or a product? `<article>`.
- Is it **a chapter of the page** with a heading? `<section>`.
- Is it **a side note**? `<aside>`.
- Is it **just a box** for styling or grouping, with no special meaning? `<div>`.

> [!TIP]
> A `<section>` should almost always have a heading. If you cannot think of a heading for it, you probably want a `<div>`.

## The generic boxes: div and span

Sometimes you only need a box to group things so that CSS can style them. For that, HTML has two elements with **no meaning** at all:

- `<div>` is a **block** box. It starts on a new line and takes the full width available.
- `<span>` is an **inline** box. It stays inside a line of text.

These two ideas, **block** and **inline**, are fundamental. A paragraph, heading or div is a block: it stacks like a brick. A `<strong>`, `<a>` or `<span>` is inline: it flows along with the text.

```live
=== html
<div>This is a div. It is a block, so it takes the whole row.</div>
<div>Another div on a new line.</div>
<p>This paragraph has a <span>span</span>, a <strong>strong</strong> and a <a href="#">link</a> that all stay inside the same line.</p>
```

You will use `<div>` constantly. The skill is to use a meaningful element first, and a `<div>` only when nothing else fits.

## Classes and ids: names for your elements

To style or target a particular element later (with CSS and JavaScript), you give it a name using an attribute.

| Attribute | Rule | Example |
| :-- | :-- | :-- |
| `class` | A **group** name. Many elements can share it, and an element can have several, separated by spaces | `<article class="card featured">` |
| `id` | A **unique** name. Only one element per page can have a given id | `<section id="contact">` |

Names should say what the thing **is**, not what it looks like. `class="warning"` is better than `class="red-text"`, because you might change the colour but the meaning stays.

## Headings give a page its outline

Search engines and screen readers read your headings like a table of contents. Keep one `<h1>` for the page title, `<h2>` for each main section, and `<h3>` for subsections. Do not skip a level.

```text
h1  Greenfield Secondary School
  h2  About us
  h2  School news
    h3  Our team wins the state science fair
    h3  Entrance exams open
  h2  Did you know?
```

## Putting it together: a school homepage

Here is a more complete homepage with a class and an id on several elements. In later lessons you will style this exact kind of page with CSS. Study the structure, then change the school to a business you know.

```live
=== html
<header class="site-header">
  <h1>Bright Future Academy</h1>
  <nav class="main-nav" aria-label="Main menu">
    <ul>
      <li><a href="#programmes">Programmes</a></li>
      <li><a href="#staff">Staff</a></li>
      <li><a href="#apply">Apply</a></li>
    </ul>
  </nav>
</header>

<main>
  <section class="hero">
    <h2>Quality education you can trust</h2>
    <p>Nursery, primary and secondary, with small classes and caring teachers.</p>
  </section>

  <section id="programmes">
    <h2>Our programmes</h2>
    <article class="card">
      <h3>Primary</h3>
      <p>Ages 6 to 11. Reading, maths, science and creative arts.</p>
    </article>
    <article class="card">
      <h3>Secondary</h3>
      <p>Ages 12 to 17. WAEC and NECO preparation, plus coding club.</p>
    </article>
  </section>

  <section id="staff">
    <h2>Meet our staff</h2>
    <p>Our teachers are trained, certified and passionate.</p>
  </section>

  <section id="apply">
    <h2>Apply now</h2>
    <p>Applications for the next term are open until <strong>15 January</strong>.</p>
  </section>
</main>

<footer>
  <p>Call 0801 234 5678 or visit us at 7 School Road, Ibadan.</p>
</footer>
```

## Try it

Build a landing page for a small business using the semantic elements. It has to have a clear structure, a menu inside `<nav>`, and at least two articles.

```webtask
{
  "id": "web-m03-t1",
  "minutes": 12,
  "required": true,
  "rules": [
    { "label": "A <header> that contains the <h1> page title", "selector": "header h1", "min": 1 },
    { "label": "A <nav> with at least three links", "selector": "nav a", "min": 3 },
    { "label": "Exactly one <main> element", "selector": "main", "min": 1, "max": 1 },
    { "label": "At least two <section> elements, each with an <h2> heading", "selector": "section h2", "min": 2 },
    { "label": "At least two <article> elements", "selector": "article", "min": 2 },
    { "label": "A <footer> with some text", "selector": "footer", "contains": "[A-Za-z]{3,}" },
    { "label": "At least one class attribute on an element", "in": "html", "pattern": "class=[\"'][a-z][a-z0-9 -]*[\"']" }
  ],
  "hint": "Wrap the title in <header>, the menu in <nav>, the page's content in <main> with <section> parts, and end with <footer>. Use <article> for items like products or news stories, and give an element a class like <article class=\"card\">.",
  "height": 320
}
=== prompt
Build the homepage of a small business you know: a salon, a tailor, a phone repair shop, a church, or a football club. Use a `<header>` with an `<h1>`, a `<nav>` with at least three links, one `<main>` with at least two `<section>` parts (each with an `<h2>`), at least two `<article>` items inside them (for example services or products), and a `<footer>`. Give at least one element a `class`.
=== html
<h1></h1>
=== sample html
<header>
  <h1>Shine Hair Studio</h1>
  <nav>
    <a href="#services">Services</a>
    <a href="#prices">Prices</a>
    <a href="#contact">Contact</a>
  </nav>
</header>
<main>
  <section id="services">
    <h2>Our services</h2>
    <article class="card">
      <h3>Braids</h3>
      <p>Knotless braids, cornrows and twists, done neatly and on time.</p>
    </article>
    <article class="card">
      <h3>Natural hair care</h3>
      <p>Wash, treatment and styling for natural hair.</p>
    </article>
  </section>
  <section id="prices">
    <h2>Prices</h2>
    <p>Braids from ₦15,000. Natural hair care from ₦8,000.</p>
  </section>
</main>
<footer id="contact">
  <p>Shine Hair Studio, 5 Admiralty Way, Lekki. Call 0802 345 6789.</p>
</footer>
=== note
Notice there is not a single `<div>` here. Meaningful elements did all the work. You will add the look with CSS in the next lessons.
```

Now spot the problems. This page is built entirely from `<div>` elements, which tells nobody anything. Replace the divs with the right semantic elements, without changing the visible text.

```webtask
{
  "id": "web-m03-t2",
  "minutes": 8,
  "required": true,
  "rules": [
    { "label": "The top block is a <header>", "selector": "header", "min": 1, "max": 1 },
    { "label": "The menu is a <nav> containing the three links", "selector": "nav a", "min": 3 },
    { "label": "The content is inside one <main>", "selector": "main", "min": 1, "max": 1 },
    { "label": "The side note is an <aside>", "selector": "aside", "min": 1 },
    { "label": "The bottom block is a <footer>", "selector": "footer", "min": 1 },
    { "label": "No <div> is left on the page", "in": "html", "pattern": "<div[\\s>]", "absent": true }
  ],
  "hint": "Change <div class=\"top\"> to <header>, <div class=\"menu\"> to <nav>, <div class=\"content\"> to <main>, <div class=\"side\"> to <aside> and <div class=\"bottom\"> to <footer>. Remember to change the closing tags too.",
  "height": 300
}
=== prompt
Rewrite this page using semantic elements: `<header>`, `<nav>`, `<main>`, `<aside>` and `<footer>`. Remove every `<div>`. The visible text must stay the same.
=== html
<div class="top">
  <h1>City Football Club</h1>
</div>
<div class="menu">
  <a href="#fixtures">Fixtures</a>
  <a href="#players">Players</a>
  <a href="#tickets">Tickets</a>
</div>
<div class="content">
  <h2>Next match</h2>
  <p>Saturday at 4 pm at the City Stadium.</p>
</div>
<div class="side">
  <h2>Club news</h2>
  <p>Our captain has signed a new contract.</p>
</div>
<div class="bottom">
  <p>City Football Club. All rights reserved.</p>
</div>
=== sample html
<header>
  <h1>City Football Club</h1>
</header>
<nav>
  <a href="#fixtures">Fixtures</a>
  <a href="#players">Players</a>
  <a href="#tickets">Tickets</a>
</nav>
<main>
  <h2>Next match</h2>
  <p>Saturday at 4 pm at the City Stadium.</p>
</main>
<aside>
  <h2>Club news</h2>
  <p>Our captain has signed a new contract.</p>
</aside>
<footer>
  <p>City Football Club. All rights reserved.</p>
</footer>
```

```answer
{
  "id": "web-m03-a1",
  "prompt": "Which HTML element holds a block of **navigation links**, such as a website's main menu? Type the tag name without the angle brackets.",
  "answer": "nav",
  "format": "text",
  "accept": ["<nav>", "the nav element"],
  "explanation": "<nav> tells browsers and screen readers that these links are navigation, so users can jump straight to them.",
  "required": true
}
```
