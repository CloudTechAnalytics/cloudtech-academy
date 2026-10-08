---
title: Text, Lists, Links and Images
minutes: 30
summary: Learn the HTML elements you will use on every page: text emphasis, quotes and code, lists, links of every kind, and images with proper alt text. Build a small recipe page as you go.
---

## Shaping text

You already know headings and paragraphs. HTML has a few more elements to say **what a piece of text means**. The browser gives each a default look, but the point is meaning: a screen reader, or Google, understands your page better.

| Element | Meaning | Default look |
| :-- | :-- | :-- |
| `<strong>` | Important text | **Bold** |
| `<em>` | Emphasis, the word you would stress when speaking | *Italic* |
| `<mark>` | Highlighted, relevant text | Yellow background |
| `<small>` | Side comments and fine print | Smaller |
| `<sub>` and `<sup>` | Subscript and superscript, like H₂O and m² | Lowered or raised |
| `<del>` and `<ins>` | Text removed or added, like an old and new price | Strikethrough and underline |
| `<code>` | A bit of computer code | Monospace |
| `<blockquote>` | A longer quotation from someone else | Indented block |

Try them all in the editor. Change the words and watch the preview.

```live
=== html
<p>Our <strong>jollof rice</strong> is cooked on firewood, so please be <em>patient</em>.</p>
<p>Special offer: <del>₦3,500</del> <ins>₦2,800</ins> this week only. <mark>Free delivery in Yaba.</mark></p>
<p>Water is H<sub>2</sub>O and the room is 20 m<sup>2</sup>.</p>
<p><small>Prices include VAT. Delivery fees may apply.</small></p>
<blockquote>
  <p>The best way to learn to code is to build something you care about.</p>
</blockquote>
<p>To show the page title in CSS you write <code>color: green;</code> like this.</p>
```

> [!NOTE]
> You may see `<b>` for bold and `<i>` for italic in older pages. They only change the look. Prefer `<strong>` and `<em>` when the text really is important or emphasised, and use CSS for pure decoration.

### Line breaks, spaces and special characters

The browser squeezes extra spaces, so you cannot lay out a poem by pressing the space bar. Use these instead:

- `<br />` makes a line break inside a paragraph, which is right for an address or a poem.
- `<pre>` keeps your spaces and line breaks exactly, which is right for code.
- **Entities** let you type characters that HTML uses itself, or that are not on the keyboard.

| You want | Type |
| :-- | :-- |
| `<` and `>` shown on the page | `&lt;` and `&gt;` |
| `&` | `&amp;` |
| A space that will not break | `&nbsp;` |
| © | `&copy;` |
| ₦ | `&#8358;` (or just type ₦, since the page is UTF-8) |

```live
=== html
<p>Hosea House<br />12 Allen Avenue<br />Ikeja, Lagos</p>

<pre>
Item        Price
Zobo        ₦500
Chapman     ₦1,200
</pre>

<p>To make a paragraph you write &lt;p&gt;Hello&lt;/p&gt;. &copy; 2026 Mama Ngozi &amp; Sons.</p>
```

## Lists

Lists are everywhere on the web: menus, steps, features, navigation bars. HTML has three kinds.

- `<ul>` is an **unordered list** with bullets, when the order does not matter.
- `<ol>` is an **ordered list** with numbers, when the order matters, like steps in a recipe.
- `<dl>` is a **description list**, a set of terms and their meanings.

Every item in a `<ul>` or `<ol>` goes inside an `<li>` (list item). You can put a list **inside** an `<li>` to make a nested list.

```live
=== html
<h2>Ingredients</h2>
<ul>
  <li>4 cups of rice</li>
  <li>Tomato stew base
    <ul>
      <li>6 fresh tomatoes</li>
      <li>2 red peppers</li>
      <li>1 onion</li>
    </ul>
  </li>
  <li>Thyme, curry and bay leaf</li>
</ul>

<h2>Method</h2>
<ol>
  <li>Blend the tomatoes, peppers and onion.</li>
  <li>Fry the mixture until the water dries.</li>
  <li>Add the rice and a little stock, then cover and cook.</li>
</ol>

<h2>Words to know</h2>
<dl>
  <dt>Party jollof</dt>
  <dd>Jollof cooked in a large pot, usually on firewood, for a crowd.</dd>
  <dt>Bottom pot</dt>
  <dd>The slightly burnt, smoky rice at the bottom. Many people fight over it.</dd>
</dl>
```

Notice that a nested list sits inside the `<li>`, before its closing tag. Many beginners put it after `</li>`, which is invalid.

## Links

Links are what make the web a web. A link is an `<a>` (anchor) element, and the `href` attribute holds where it goes.

```html
<a href="https://www.bbc.com/news">Read the news</a>
```

There are four kinds of address you will use:

| Kind | Example | Goes to |
| :-- | :-- | :-- |
| **Absolute** | `https://www.bbc.com/news` | Another website. The full address. |
| **Relative** | `about.html` or `pages/contact.html` | Another file on **your own** site. |
| **Anchor** | `#contact` | A place on the **same page** whose `id` is `contact`. |
| **Action** | `mailto:ada@example.com` or `tel:+2348012345678` | Opens an email or the phone dialler. |

Two attributes are worth knowing: `target="_blank"` opens the link in a new tab, and when you use it add `rel="noopener noreferrer"`, which stops the new page from controlling yours.

Anchor links are the easiest to try, because they work inside the preview. (Links to other websites are switched off in the preview, so click on the ones below to scroll, and look at how the others are written.)

```live
=== html
<nav>
  <a href="#menu">Menu</a> |
  <a href="#prices">Prices</a> |
  <a href="#contact">Contact</a>
</nav>

<h2 id="menu">Menu</h2>
<p>Jollof rice, fried rice, ofada rice, beans and plantain.</p>
<div style="height: 400px"></div>

<h2 id="prices">Prices</h2>
<p>A plate starts at ₦1,500. Delivery is extra.</p>
<div style="height: 400px"></div>

<h2 id="contact">Contact</h2>
<p>
  <a href="https://wa.me/2348012345678" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a><br />
  <a href="mailto:orders@mamangozi.example">orders@mamangozi.example</a><br />
  <a href="tel:+2348012345678">Call 0801 234 5678</a>
</p>
<p><a href="#menu">Back to the top</a></p>
```

> [!TIP]
> Write link text that makes sense on its own. **"Download the price list"** is helpful. **"Click here"** is not, because screen reader users often jump from link to link and hear only the link text.

## Images

An image is an `<img>` element. It is a void element, so it has no closing tag, but it needs two attributes:

- `src`: the **source**, where the picture file is.
- `alt`: the **alternative text**, a short description for people who cannot see it, and what shows if the image fails to load.

```html
<img src="images/jollof.jpg" alt="A steaming plate of party jollof rice with fried plantain" width="600" height="400" />
```

Good habits with images:

- **Write useful alt text.** Describe what matters: "Chioma presenting her project at UNN", not "image1.jpg" or "photo". If an image is only decoration, use an empty `alt=""` so screen readers skip it.
- **Set `width` and `height`.** The browser then saves space before the image loads, so the page does not jump.
- **Use the right format.** JPG for photos, PNG for graphics that need transparency, WebP for both with smaller files, SVG for logos and icons that stay sharp at any size.
- **Keep files small.** A 6 MB photo straight from a phone will make your page slow on mobile data. Resize and compress it before you use it.
- **Use `<figure>` and `<figcaption>`** when an image has a caption.

The images in this editor are tiny pictures built right into the code, because the preview has no folder of files. On your own site, `src` will point to a file in your images folder.

```live
=== html
<figure>
  <img
    src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180'><rect width='320' height='180' fill='%230f766e'/><text x='160' y='100' font-size='26' fill='white' text-anchor='middle' font-family='sans-serif'>Jollof rice</text></svg>"
    alt="A green card with the words Jollof rice"
    width="320"
    height="180"
  />
  <figcaption>Figure 1. Our best seller, served with plantain.</figcaption>
</figure>
```

## Putting it together: a recipe page

Here is a complete page that uses everything from this lesson. Read it, change it, break it on purpose, and fix it.

```live
=== html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Party Jollof Rice</title>
  </head>
  <body>
    <h1>Party Jollof Rice</h1>
    <p><em>Serves 6.</em> Cooking time: <strong>1 hour 30 minutes</strong>.</p>

    <img
      src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='360' height='160'><rect width='360' height='160' fill='%23b45309'/><text x='180' y='90' font-size='28' fill='white' text-anchor='middle' font-family='sans-serif'>Party Jollof</text></svg>"
      alt="Orange-brown party jollof rice, the finished dish"
      width="360"
      height="160"
    />

    <h2 id="ingredients">Ingredients</h2>
    <ul>
      <li>4 cups parboiled rice</li>
      <li>6 tomatoes and 2 red peppers, blended</li>
      <li>1 cup of vegetable oil</li>
    </ul>

    <h2 id="method">Method</h2>
    <ol>
      <li>Fry the blended mix until the water dries.</li>
      <li>Add the rice and enough stock to cover.</li>
      <li>Cook on low heat for 45 minutes.</li>
    </ol>

    <p>Jump to the <a href="#ingredients">ingredients</a> or the <a href="#method">method</a>.</p>
    <p><small>Recipe by Mama Ngozi. &copy; 2026.</small></p>
  </body>
</html>
```

## Try it

First, build a menu page for a small restaurant. It must use a list, a link and an image with alt text.

```webtask
{
  "id": "web-m02-t1",
  "minutes": 10,
  "required": true,
  "rules": [
    { "label": "An <h1> with the restaurant name", "selector": "h1", "min": 1, "max": 1, "contains": "[A-Za-z]{3,}" },
    { "label": "A bulleted list (<ul>) with at least four <li> items", "selector": "ul > li", "min": 4 },
    { "label": "A numbered list (<ol>) with at least two items", "selector": "ol > li", "min": 2 },
    { "label": "At least one link with an href", "selector": "a[href]", "min": 1 },
    { "label": "An image with meaningful alt text (at least 8 characters)", "selector": "img[src]", "attr": { "alt": ".{8,}" } },
    { "label": "Some text is marked as important (<strong>) or emphasised (<em>)", "selector": "strong, em", "min": 1 }
  ],
  "hint": "Use <ul> for the menu items, <ol> for how to order, <a href=\"tel:...\"> for a phone link, and <img src=\"...\" alt=\"...\" /> for the picture. You can reuse the data:image/svg+xml picture from the recipe page.",
  "height": 320
}
=== prompt
Build a one-page menu for a small restaurant or food stall. Include: an `<h1>` with its name, a `<ul>` of at least four dishes (with prices), an `<ol>` of at least two steps for how to order, at least one link (a phone number with `tel:` or a website), an `<img>` with descriptive `alt` text, and at least one `<strong>` or `<em>`.
=== html
<h1></h1>
=== sample html
<h1>Mama Ngozi's Kitchen</h1>
<p>Home-style Nigerian food in <strong>Ikeja</strong>.</p>
<img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='140'><rect width='300' height='140' fill='%230f766e'/><text x='150' y='80' font-size='24' fill='white' text-anchor='middle' font-family='sans-serif'>Our kitchen</text></svg>" alt="A green banner that says Our kitchen" width="300" height="140" />
<h2>Menu</h2>
<ul>
  <li>Jollof rice and chicken, ₦3,000</li>
  <li>Fried rice and plantain, ₦2,800</li>
  <li>Amala and ewedu, ₦2,500</li>
  <li>Moi moi, ₦800</li>
</ul>
<h2>How to order</h2>
<ol>
  <li>Call us on <a href="tel:+2348012345678">0801 234 5678</a>.</li>
  <li>Tell us your dishes and your address.</li>
  <li>Pay on delivery.</li>
</ol>
=== note
Notice how the structure tells a story even with no styling: a title, a short intro, a picture, a menu and how to order. In the next lessons you will add the layout and the colours.
```

Now practise links on the same page. Make a short article with a table of contents that jumps to each section.

```webtask
{
  "id": "web-m02-t2",
  "minutes": 8,
  "required": true,
  "rules": [
    { "label": "At least three <h2> sections, each with an id", "selector": "h2[id]", "min": 3 },
    { "label": "At least three links that jump to a section on the page (href starting with #)", "selector": "a[href^='#']", "min": 3 },
    { "label": "One external link that opens in a new tab with rel=\"noopener noreferrer\"", "in": "html", "pattern": "<a\\b(?=[^>]*target=[\"']_blank)(?=[^>]*rel=[\"'][^\"']*noopener)[^>]*>" },
    { "label": "No link text says only \"click here\"", "in": "html", "pattern": ">\\s*click here\\s*<", "absent": true }
  ],
  "hint": "Give each <h2> an id, like <h2 id=\"tips\">, then write <a href=\"#tips\">Tips</a> in a list at the top. For the outside link use <a href=\"https://...\" target=\"_blank\" rel=\"noopener noreferrer\">.",
  "height": 300
}
=== prompt
Write a short article of your choice (for example **Five tips for studying at night**). At the top, add a list of links that jump to at least three sections. Each section is an `<h2>` with an `id`. At the bottom, add one link to another website that opens in a new tab and has `rel="noopener noreferrer"`. Do not use "click here" as link text.
=== html
<h1>Article title</h1>
=== sample html
<h1>Five tips for studying at night</h1>
<ul>
  <li><a href="#intro">Introduction</a></li>
  <li><a href="#tips">The tips</a></li>
  <li><a href="#summary">Summary</a></li>
</ul>

<h2 id="intro">Introduction</h2>
<p>Many students study at night because it is quiet. These tips help you stay awake and remember more.</p>

<h2 id="tips">The tips</h2>
<ol>
  <li>Sit at a desk, not on your bed.</li>
  <li>Take a short walk every hour.</li>
  <li>Keep water close.</li>
</ol>

<h2 id="summary">Summary</h2>
<p>Keep a routine, and sleep well after.</p>
<p>Read more about sleep on <a href="https://www.sleepfoundation.org" target="_blank" rel="noopener noreferrer">the Sleep Foundation website</a>.</p>
=== note
Anchor links are how long pages, like documentation and terms and conditions, let readers jump around. You will style them as a real navigation bar soon.
```

```answer
{
  "id": "web-m02-a1",
  "prompt": "Which attribute of the `<img>` element gives a text description for people who cannot see the picture? Type the attribute name.",
  "answer": "alt",
  "format": "text",
  "accept": ["alt text", "the alt attribute", "alt attribute"],
  "explanation": "alt is read aloud by screen readers and shown when the image fails to load. src only says where the file is.",
  "required": true
}
```
