begin;
-- Course: Web Development: HTML, CSS, JavaScript and Bootstrap
insert into public.courses (id, format, completion_badge, slug, code, title, summary, description, category_id, difficulty, level, level_label, estimated_hours, is_free, status, published, skills, prerequisites, project_title, certificate_enabled, require_all_lessons, require_exercises, require_project, require_module_badges, passing_score, position)
values ('web-development-for-beginners', 'short', 'Web Development Basics', 'web-development-for-beginners', 'WEB', 'Web Development: HTML, CSS, JavaScript and Bootstrap', 'Learn to build real websites from scratch. Write HTML, style it with CSS, add behaviour with JavaScript and speed up with Bootstrap, practising in a live editor that shows what you build as you type, then publish it free.', 'A complete, practical introduction to web development, with no experience needed. Every lesson has an editor and a live preview built into the page, so you type code and watch the page change, without installing anything. You will learn how the web works and write your first page; every important HTML element (text, lists, links, images, forms, tables, semantic page structure, media and accessibility); CSS from selectors and the cascade through the box model, colour and typography, flexbox, grid, responsive design and animation; JavaScript from variables and logic to arrays, objects, the DOM, events, forms, fetch and storage; and Bootstrap 5 for building polished, responsive pages fast. Each lesson ends with tasks that are checked on your code and on the page you build, and every module has a check and a badge. You finish with a real website you publish at your own free web address.', 'coding', 'beginner', 1, 'Beginner to advanced', 14, true, 'available', true, array['Writing semantic, accessible HTML', 'Styling and layout with CSS, flexbox and grid', 'Responsive, mobile-first design', 'Animations and transitions', 'Programming with JavaScript and the DOM', 'Forms, events and fetching data', 'Building pages with Bootstrap 5', 'Publishing a website with GitHub Pages']::text[], array['No experience needed', 'A computer or phone with a modern browser. The editors run in the lesson page']::text[], 'A published website for a real business', true, false, false, false, true, 60, 7)
on conflict (id) do update set format = excluded.format, completion_badge = excluded.completion_badge, slug = excluded.slug, code = excluded.code, title = excluded.title, summary = excluded.summary, description = excluded.description, category_id = excluded.category_id, difficulty = excluded.difficulty, level = excluded.level, level_label = excluded.level_label, estimated_hours = excluded.estimated_hours, is_free = excluded.is_free, status = excluded.status, published = excluded.published, skills = excluded.skills, prerequisites = excluded.prerequisites, project_title = excluded.project_title, certificate_enabled = excluded.certificate_enabled, require_all_lessons = excluded.require_all_lessons, require_exercises = excluded.require_exercises, require_project = excluded.require_project, require_module_badges = excluded.require_module_badges, passing_score = excluded.passing_score, position = excluded.position;

update public.courses set access_type = 'free', price = null, currency = 'NGN', discount_price = null, discount_active = false, payment_status = 'active', delivery_type = 'self_paced', enrollment_status = 'open', enrollment_start = null, enrollment_end = null, community_access = false, instructor_support = false, duration_label = null, overview = null, audience = '{}'::text[], included = '{}'::text[], project_previews = '[]'::jsonb, instructor_name = null, instructor_title = null, instructor_bio = null, professional_outcome = null, commerce_seeded = true, course_type = 'free', outcomes = '{}'::text[], difficulty_max = null, duration_weeks = null, thumbnail = null, faqs = '[]'::jsonb, discount_label = null, discount_start = null, discount_end = null where id = 'web-development-for-beginners' and not commerce_seeded;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m01', 'web-development-for-beginners', 'How the Web Works and Your First Page', 1, 'HTML Basics', 'HTML', array['Explain how browsers, servers, HTML, CSS and JavaScript work together', 'Write the skeleton of a valid HTML page', 'Use headings, paragraphs and comments', 'Inspect any website with DevTools']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:html-the-structure', 'web-development-for-beginners', 'web-m01', 'html-the-structure', 'How the Web Works and Your First Page', 'See what happens when you open a website, learn the three languages every site is built from, and write your first real HTML page in an editor that shows the result as you type.', 30, $md$
## What happens when you open a website

You type `academy.cloudtechanalytics.com` into your browser and press Enter. In under a second, a page appears. Behind that second, three things happen:

1. Your **browser** (Chrome, Safari, Edge, Firefox) looks up where that website lives and sends a **request**: "please send me this page".
2. A computer called a **server**, somewhere in the world, answers with **files**.
3. Your browser reads those files and **draws the page** on your screen.

That is the whole web. The files the server sends are written in three languages. You will learn all three in this course.

| Part of the address | Example | What it means |
| :-- | :-- | :-- |
| Protocol | `https://` | How to talk to the server. The `s` means the connection is secure. |
| Domain | `academy.cloudtechanalytics.com` | The name of the website. It points to a server. |
| Path | `/courses` | Which page on that website you want. |

> [!NOTE]
> You do not need to install anything for this course. Every example here has an **editor and a live preview** built into the page. Change the code, and the preview updates. Later, when you build a full website, you will use a free editor on your computer.

## The three languages of every website

| Language | Its job | A house |
| :-- | :-- | :-- |
| **HTML** | The **structure and content**: headings, text, images, buttons, forms | The walls, doors and rooms |
| **CSS** | The **look**: colours, fonts, spacing, layout | The paint, tiles and furniture |
| **JavaScript** | The **behaviour**: things that react when you click or type | The electricity and switches |

Here is one tiny page with all three. Look at the three tabs (`index.html`, `style.css`, `script.js`), then change something in each one and watch the preview. Change the heading text. Change `#0f766e` to `crimson`. Change the message in the button's code.

```live
=== html
<h1>Mama Ngozi's Bakery</h1>
<p>Fresh bread baked every morning in Ikeja.</p>
<button id="order">Order now</button>
<p id="message"></p>
=== css
body {
  font-family: system-ui, sans-serif;
  text-align: center;
  padding: 24px;
}
h1 {
  color: #0f766e;
}
button {
  background: #0f766e;
  color: white;
  border: 0;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
}
=== js
const button = document.querySelector("#order");
const message = document.querySelector("#message");

button.addEventListener("click", function () {
  message.textContent = "Thank you! Your bread is on the way.";
});
```

Click **Order now** in the preview. That click is JavaScript. The green heading is CSS. The words and the button are HTML. Take away the CSS and you still have a working page, just plain. Take away the HTML and there is nothing to style. HTML always comes first.

## The anatomy of an HTML element

HTML is made of **elements**. An element usually has an opening tag, some content, and a closing tag:

```html
<p>Hello, Lagos!</p>
```

- `<p>` is the **opening tag**. The letter `p` stands for paragraph.
- `Hello, Lagos!` is the **content**.
- `</p>` is the **closing tag**. It is the same as the opening tag with a `/` added.

Some elements have **attributes**, extra information inside the opening tag, written as `name="value"`:

```html
<a href="https://www.google.com" target="_blank">Search the web</a>
```

Here `href` and `target` are attributes. `href` says where the link goes. `target="_blank"` says open it in a new tab.

A few elements have no content, so they have no closing tag. These are called **void elements**. The line break `<br>`, the horizontal line `<hr>` and the image `<img>` are the common ones.

Elements can sit **inside** other elements. This is called **nesting**, and it is how you build everything:

```live
=== html
<p>Today I am learning <strong>HTML</strong>. It is <em>easier</em> than I expected.</p>
```

The `<strong>` and `<em>` elements are inside the `<p>`. The browser shows `<strong>` as bold and `<em>` as italic. Always close the inner element before the outer one: `<p><strong>text</strong></p>` is correct, and `<p><strong>text</p></strong>` is wrong.

You can leave notes for yourself that the browser ignores. These are **comments**:

```html
<!-- This is a comment. Nobody sees it on the page. -->
```

## The skeleton of every page

Every full HTML page starts with the same skeleton. You will type it so many times that your fingers will learn it.

```live
=== html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Chioma Eze | Portfolio</title>
  </head>
  <body>
    <h1>Chioma Eze</h1>
    <p>Computer Science student at UNN, learning web development.</p>
  </body>
</html>
```

| Line | What it does |
| :-- | :-- |
| `<!DOCTYPE html>` | Tells the browser "this is a modern HTML page". Always the very first line. |
| `<html lang="en">` | The root. Everything else goes inside it. `lang="en"` says the page is in English, which helps screen readers and search engines. |
| `<head>` | Information **about** the page. Nothing in the head is shown on the page itself. |
| `<meta charset="UTF-8" />` | Lets the page show every letter correctly, including `₦`, `é` and emoji. |
| `<meta name="viewport" ... />` | Makes the page fit a phone screen properly. Without it, phones show a tiny zoomed-out desktop page. |
| `<title>` | The text on the browser tab, and the title in Google results. |
| `<body>` | Everything the visitor **sees**: headings, text, images, buttons. |

> [!TIP]
> In the preview, the tab title is not visible because the preview is only the page itself. On a real website, the `<title>` is what appears on the browser tab and in search results, so write a clear one for every page.

## Headings and paragraphs

Most of a web page is text, and text has structure. HTML gives you six levels of **headings**, from `<h1>` (the most important) down to `<h6>`, and **paragraphs** with `<p>`.

```live
=== html
<h1>Lagos Street Food Guide</h1>
<p>A short guide to eating well in Lagos on a small budget.</p>

<h2>Breakfast</h2>
<p>Akara and pap, moi moi, or bread and egg.</p>

<h2>Lunch</h2>
<h3>Rice dishes</h3>
<p>Jollof, fried rice and ofada rice.</p>
<h3>Swallow</h3>
<p>Amala, eba and pounded yam with soup.</p>

<hr />
<p>Last updated in October.</p>
```

Three rules to remember:

- Use **one `<h1>` per page**. It is the main title, like the title of a book.
- Go in order: `<h2>` for sections, `<h3>` for parts of a section. Do not skip levels just because you like how a heading looks. You will style the size with CSS later.
- The browser **ignores extra spaces and blank lines**. Ten spaces look like one. To start a new paragraph, use a new `<p>`. Use `<br>` only for a real line break, like in an address.

## See how real websites are built

Every website on the internet sends its HTML to you, so you can read it. Try this now on any website, including this one:

1. **Right-click** anywhere on the page and choose **Inspect** (or press `F12`).
2. A panel opens. Click the **Elements** tab. You are looking at the page's HTML.
3. Hover over a line, and the browser highlights that part of the page.

You can even change the text in the panel to see what a page would look like. The change disappears when you refresh, so you cannot break anything. This is how professional developers explore other people's work and fix their own.

## Common beginner mistakes

| Mistake | What happens | Fix |
| :-- | :-- | :-- |
| Forgetting a closing tag, like `<p>text` | The rest of the page may look wrong, because the browser guesses where it ends | Close every tag you open |
| Closing in the wrong order | The page may still show, but it is invalid and can break later | Close the inner tag first |
| Missing quotes, like `href=google.com` | The link breaks | Always put attribute values in quotes |
| Typing `<heading>` or `<paragraph>` | The browser does not know them and shows plain text | Use `<h1>` and `<p>` |
| Using headings to make text big | The structure becomes meaningless to screen readers and Google | Use the right level, and make text big with CSS |

## Try it

Fix this page first. A friend wrote it, but it does not follow the skeleton, and a few tags are broken. Read the checklist, fix the code, and click **Check my work**. The preview shows the page as you edit.

```webtask
{
  "id": "web-m01-t1",
  "minutes": 8,
  "required": true,
  "rules": [
    { "label": "The page starts with <!DOCTYPE html>", "in": "html", "pattern": "^\\s*<!doctype html>" },
    { "label": "The <html> tag says the language: lang=\"en\"", "in": "html", "pattern": "<html[^>]*\\blang=[\"']en" },
    { "label": "The head has a <title> with some text", "in": "html", "pattern": "<head>[\\s\\S]*<title>[^<\\s][^<]*</title>[\\s\\S]*</head>" },
    { "label": "The head has the UTF-8 charset meta tag", "in": "html", "pattern": "<meta[^>]*charset=[\"']?utf-8" },
    { "label": "The page shows an <h1> heading with text", "selector": "h1", "contains": "\\S" },
    { "label": "Both paragraphs are closed properly (two <p> and two </p>)", "in": "html", "pattern": "</p>", "min": 2 }
  ],
  "hint": "The first line should be <!DOCTYPE html>. Put <meta charset=\"UTF-8\" /> and a <title>...</title> inside <head>. Check that every <p> has its </p>.",
  "height": 280
}
=== prompt
This page is not valid. Fix it so that it has the full skeleton: a doctype, `<html lang="en">`, a `<head>` with the charset and a title, and a `<body>`. Then close the paragraphs that are not closed.
=== html
<html>
<head>
</head>
<body>
  <h1>My first page</h1>
  <p>I am learning to build websites.
  <p>Today I learned about tags and elements.
</body>
</html>
=== sample html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My first page</title>
</head>
<body>
  <h1>My first page</h1>
  <p>I am learning to build websites.</p>
  <p>Today I learned about tags and elements.</p>
</body>
</html>
=== note
A valid skeleton does not change how this small page looks, so why bother? Because search engines, screen readers, phones and other browsers all depend on it, and because the habit will protect you when your pages get bigger.
```

Now build something of your own. Make a profile page for a person (you or an imaginary friend) using headings, paragraphs and a few of the things you learned today.

```webtask
{
  "id": "web-m01-t2",
  "minutes": 10,
  "required": true,
  "rules": [
    { "label": "Exactly one <h1> with the person's name", "selector": "h1", "min": 1, "max": 1, "contains": "[A-Za-z]{2,}" },
    { "label": "At least two <h2> section headings", "selector": "h2", "min": 2 },
    { "label": "At least three paragraphs with real sentences", "selector": "p", "min": 3, "contains": "[A-Za-z]+ [A-Za-z]+ [A-Za-z]+" },
    { "label": "At least one word in bold (<strong>) and one in italics (<em>)", "in": "html", "pattern": "<strong>[^<]+</strong>[\\s\\S]*<em>[^<]+</em>|<em>[^<]+</em>[\\s\\S]*<strong>[^<]+</strong>" },
    { "label": "A horizontal line (<hr>) between two sections", "selector": "hr" }
  ],
  "hint": "Start with <h1>Your name</h1>, add <h2>About me</h2> with a paragraph, then <hr /> and <h2>My goals</h2>. Use <strong> and <em> inside a sentence.",
  "height": 300
}
=== prompt
Build a one-page profile in the editor. Give it an `<h1>` with the name, at least two `<h2>` sections (for example **About me** and **My goals**), at least three paragraphs, a word in `<strong>`, a word in `<em>`, and an `<hr />` between the sections.
=== html
<h1></h1>
=== sample html
<h1>Chioma Eze</h1>
<p>I am a <strong>Computer Science</strong> student at UNN. I love solving problems and I am learning how websites work.</p>

<hr />

<h2>About me</h2>
<p>I grew up in Enugu and I enjoy reading, football and <em>building small things</em> on my computer.</p>

<h2>My goals</h2>
<p>This year I want to build my own website, learn data analysis, and apply for an internship.</p>
<p>My long-term goal is to build useful software for businesses in Nigeria.</p>
=== note
There is no single correct answer. What matters is that the structure is clean: one h1, h2 for sections, and paragraphs for text.
```

```answer
{
  "id": "web-m01-a1",
  "prompt": "Which of the three web languages controls **colours, fonts and spacing**? Type its name.",
  "answer": "CSS",
  "format": "text",
  "accept": ["css", "cascading style sheets"],
  "explanation": "HTML gives the structure, CSS the look, and JavaScript the behaviour.",
  "required": true
}
```
$md$, true, true, 1, array['web-m01-a1', 'web-m01-t1', 'web-m01-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m02', 'web-development-for-beginners', 'Text, Lists, Links and Images', 2, 'HTML Content', 'HTMLTEXT', array['Format text with meaningful elements', 'Build ordered, unordered and nested lists', 'Write absolute, relative, anchor, email and phone links', 'Add images with useful alt text']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:html-text-links-images', 'web-development-for-beginners', 'web-m02', 'html-text-links-images', 'Text, Lists, Links and Images', 'Learn the HTML elements you will use on every page: text emphasis, quotes and code, lists, links of every kind, and images with proper alt text. Build a small recipe page as you go.', 30, $md$
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
$md$, true, true, 2, array['web-m02-a1', 'web-m02-t1', 'web-m02-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m03', 'web-development-for-beginners', 'Page Structure: Semantic HTML', 3, 'Semantic HTML', 'SEMANTIC', array['Structure a page with header, nav, main, section, article, aside and footer', 'Choose between semantic elements and div', 'Use classes and ids', 'Create a clear heading outline']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:html-semantic-layout', 'web-development-for-beginners', 'web-m03', 'html-semantic-layout', 'Page Structure: Semantic HTML and Layout Elements', 'Learn to build a page the way professionals do, with header, nav, main, section, article, aside and footer, and when to use div and span. Lay out a complete school website homepage.', 30, $md$
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
$md$, true, true, 3, array['web-m03-a1', 'web-m03-t1', 'web-m03-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m04', 'web-development-for-beginners', 'Forms and Tables', 4, 'Forms and Tables', 'FORMS', array['Build forms with labels and every input type', 'Use built-in validation attributes', 'Group controls with fieldset and legend', 'Build accessible data tables']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:html-forms-tables', 'web-development-for-beginners', 'web-m04', 'html-forms-tables', 'Forms and Tables', 'Collect information with forms (every input type, labels, built-in validation) and show data with tables. Build a sign-up form for a real event and a class timetable.', 35, $md$
## Forms: how websites listen

Almost every useful website collects something from you: a login, a search, an order, a message. All of that starts with an HTML **form**.

A form is a container. Inside it are **controls** (the boxes, buttons and menus people fill in), and each control has a **label** that says what it is for. When someone presses the submit button, the browser gathers the answers and sends them to a server, or hands them to your JavaScript.

```html
<form action="/subscribe" method="post">
  ...controls go here...
</form>
```

- `action` is where the data is sent.
- `method` is how: `get` puts the data in the web address (good for searching), `post` sends it privately in the request (good for logins and sign-ups).

> [!NOTE]
> The preview in this course does not send forms anywhere. Pressing submit shows the browser's own checks (such as "Please fill out this field"), and later your JavaScript can react. Sending data to a real server is a topic for later courses.

## Labels and text inputs

Every input needs a `<label>`. Connect them with matching `for` and `id` values. When you do, clicking the label focuses the input, and a screen reader announces the label when the input is focused. Do not use `placeholder` as a replacement for a label, because it disappears when you type.

```live
=== html
<form>
  <p>
    <label for="name">Full name</label><br />
    <input type="text" id="name" name="name" placeholder="e.g. Ada Okafor" required />
  </p>
  <p>
    <label for="email">Email address</label><br />
    <input type="email" id="email" name="email" required />
  </p>
  <button type="submit">Register</button>
</form>
```

Click **Register** with the boxes empty, then with a bad email such as `ada`. The browser checks for you, and none of that needed JavaScript. Three attributes to know:

- `type` decides what kind of input it is and what the keyboard looks like on a phone.
- `name` is the **key** under which the answer is sent. Without it, the value is not submitted.
- `required` stops submission until the box is filled in.

## The input types

Choosing the right `type` gives you free validation and the right keyboard on mobile. Try each one.

| Type | For | Notes |
| :-- | :-- | :-- |
| `text` | Short text | The default |
| `email` | Email addresses | Checks for an `@` |
| `password` | Passwords | Hides the characters |
| `tel` | Phone numbers | Shows the number pad on phones |
| `number` | Numbers | Use `min`, `max` and `step` |
| `date` | A date | Shows a calendar picker |
| `url` | Web addresses | Checks for a valid URL |
| `range` | A slider | With `min` and `max` |
| `color` | A colour picker | Returns a code like `#ff0000` |
| `checkbox` | Yes or no, or pick several | `checked` ticks it |
| `radio` | Pick exactly one | Radios with the same `name` form a group |
| `file` | Upload a file | `accept="image/*"` limits the kind |

```live
=== html
<form>
  <p><label>Phone <input type="tel" name="phone" placeholder="0801 234 5678" /></label></p>
  <p><label>Tickets <input type="number" name="tickets" min="1" max="5" value="1" /></label></p>
  <p><label>Date <input type="date" name="date" /></label></p>
  <p><label>Budget <input type="range" name="budget" min="0" max="100" value="40" /></label></p>
  <p><label>Favourite colour <input type="color" name="colour" value="#0f766e" /></label></p>
  <p><label>Photo <input type="file" name="photo" accept="image/*" /></label></p>
</form>
```

Here the `<input>` is **inside** its `<label>`, which also links them. Either style works.

### Choices: checkboxes, radios and menus

```live
=== html
<form>
  <fieldset>
    <legend>How will you attend?</legend>
    <label><input type="radio" name="mode" value="in-person" checked /> In person</label><br />
    <label><input type="radio" name="mode" value="online" /> Online</label>
  </fieldset>

  <fieldset>
    <legend>Which sessions interest you?</legend>
    <label><input type="checkbox" name="topic" value="data" /> Data analysis</label><br />
    <label><input type="checkbox" name="topic" value="web" /> Web development</label><br />
    <label><input type="checkbox" name="topic" value="ai" /> AI tools</label>
  </fieldset>

  <p>
    <label for="city">Your city</label><br />
    <select id="city" name="city">
      <option value="">Choose one</option>
      <option value="lagos">Lagos</option>
      <option value="abuja">Abuja</option>
      <option value="ph">Port Harcourt</option>
    </select>
  </p>

  <p>
    <label for="note">Anything we should know?</label><br />
    <textarea id="note" name="note" rows="3" cols="40"></textarea>
  </p>
</form>
```

- `<fieldset>` groups related controls and `<legend>` names the group, which helps screen readers a lot.
- Radio buttons with the **same `name`** are a group: choosing one unchecks the others. The `value` is what gets sent.
- `<select>` makes a drop-down, with one `<option>` per choice.
- `<textarea>` is for longer text. Unlike `<input>`, it has a closing tag and its starting text goes between the tags.

## Helping people fill it in correctly

HTML can check a lot before JavaScript is needed:

| Attribute | What it does | Example |
| :-- | :-- | :-- |
| `required` | Must be filled in | `<input required />` |
| `minlength` and `maxlength` | Limit the length of text | `minlength="8"` for a password |
| `min` and `max` | Limit numbers and dates | `min="1" max="5"` |
| `pattern` | Must match a regular expression | `pattern="[0-9]{11}"` for an 11 digit phone number |
| `autocomplete` | Helps the browser fill it in | `autocomplete="email"` |
| `placeholder` | A grey hint inside the box | `placeholder="0801 234 5678"` |
| `disabled` | Cannot be used | `<button disabled>` |

## A complete sign-up form

This is the kind of form you will meet on any event page. Study each part, and try to submit it with mistakes.

```live
=== html
<h2>Lagos Tech Meetup: Register</h2>
<form>
  <p>
    <label for="fullname">Full name</label><br />
    <input id="fullname" name="fullname" type="text" autocomplete="name" required minlength="3" />
  </p>
  <p>
    <label for="mail">Email</label><br />
    <input id="mail" name="mail" type="email" autocomplete="email" required />
  </p>
  <p>
    <label for="phone">Phone (11 digits)</label><br />
    <input id="phone" name="phone" type="tel" pattern="[0-9]{11}" placeholder="08012345678" required />
  </p>
  <p>
    <label for="role">I am a</label><br />
    <select id="role" name="role" required>
      <option value="">Choose</option>
      <option>Student</option>
      <option>Graduate</option>
      <option>Working professional</option>
    </select>
  </p>
  <p><label><input type="checkbox" name="agree" required /> I agree to receive event updates</label></p>
  <button type="submit">Reserve my seat</button>
</form>
```

## Tables: showing data in rows and columns

A **table** is for data that really is a grid: timetables, price lists, results. (Do not use tables to lay out a page. That is the job of CSS, which you will learn soon.)

| Element | Role |
| :-- | :-- |
| `<table>` | The whole table |
| `<caption>` | A title for the table |
| `<thead>`, `<tbody>`, `<tfoot>` | The header, body and footer sections |
| `<tr>` | A table row |
| `<th>` | A header cell. Add `scope="col"` or `scope="row"` for accessibility |
| `<td>` | A data cell |

```live
=== html
<table border="1" cellpadding="8" cellspacing="0">
  <caption>Weekly timetable, JSS 1</caption>
  <thead>
    <tr>
      <th scope="col">Time</th>
      <th scope="col">Monday</th>
      <th scope="col">Tuesday</th>
      <th scope="col">Wednesday</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">8:00</th>
      <td>Mathematics</td>
      <td>English</td>
      <td>Science</td>
    </tr>
    <tr>
      <th scope="row">9:00</th>
      <td>English</td>
      <td>Mathematics</td>
      <td>Civic Education</td>
    </tr>
    <tr>
      <th scope="row">10:00</th>
      <td colspan="3">Break and assembly</td>
    </tr>
  </tbody>
</table>
```

A cell can stretch across columns with `colspan`, or across rows with `rowspan`. Here the break row uses `colspan="3"`. (The `border` and `cellpadding` attributes are only here so you can see the grid. In real sites you do this with CSS.)

## Try it

Build a contact form for a business. Every control needs a proper label, and the form must use the right input types.

```webtask
{
  "id": "web-m04-t1",
  "minutes": 12,
  "required": true,
  "rules": [
    { "label": "A heading (<h1> or <h2>) and a <form>", "selector": "h1, h2", "min": 1 },
    { "label": "A <form> element with controls inside it", "selector": "form input", "min": 1 },
    { "label": "A text input for the name, and an email input for the email", "selector": "input[type='text'], input[type='email']", "min": 2 },
    { "label": "Every input has a label connected with matching for and id", "in": "html", "pattern": "<label[^>]*for=[\"'][^\"']+[\"']" , "min": 3 },
    { "label": "A <select> with at least three <option> choices", "selector": "select option", "min": 3 },
    { "label": "A <textarea> for the message", "selector": "textarea", "min": 1 },
    { "label": "At least two fields are marked required", "selector": "[required]", "min": 2 },
    { "label": "A submit button with text", "selector": "button[type='submit']", "contains": "[A-Za-z]{3,}" }
  ],
  "hint": "Give each input an id and a matching label for=\"that-id\". Use type=\"email\" for the email, <select> with <option> items for the topic, <textarea> for the message, and <button type=\"submit\">Send</button>.",
  "height": 360
}
=== prompt
Build a "Contact us" form for a business. It needs a heading, a text input for the name and an email input for the email, a `<select>` with at least three topics, a `<textarea>` for the message, at least two `required` fields, and a submit button. Every input needs a `<label>` with a matching `for` and `id`.
=== html
<h2>Contact us</h2>
<form>

</form>
=== sample html
<h2>Contact us</h2>
<form>
  <p>
    <label for="name">Your name</label><br />
    <input type="text" id="name" name="name" required />
  </p>
  <p>
    <label for="email">Your email</label><br />
    <input type="email" id="email" name="email" required />
  </p>
  <p>
    <label for="topic">What is it about?</label><br />
    <select id="topic" name="topic">
      <option value="order">An order</option>
      <option value="complaint">A complaint</option>
      <option value="other">Something else</option>
    </select>
  </p>
  <p>
    <label for="msg">Message</label><br />
    <textarea id="msg" name="msg" rows="4" cols="40"></textarea>
  </p>
  <button type="submit">Send message</button>
</form>
=== note
Try pressing Send with the boxes empty. The browser stops you because of `required`, with no JavaScript. In the JavaScript lessons you will add your own messages and react to the form being submitted.
```

Now a table. Build a price list or timetable that a screen reader could navigate.

```webtask
{
  "id": "web-m04-t2",
  "minutes": 8,
  "required": true,
  "rules": [
    { "label": "A <table> with a <caption>", "selector": "table caption", "min": 1, "contains": "[A-Za-z]{3,}" },
    { "label": "A <thead> with header cells (<th scope=\"col\">), at least three", "selector": "thead th[scope='col']", "min": 3 },
    { "label": "A <tbody> with at least three rows", "selector": "tbody tr", "min": 3 },
    { "label": "Each row starts with a row header (<th scope=\"row\">)", "selector": "tbody th[scope='row']", "min": 3 },
    { "label": "At least one cell uses colspan or rowspan", "selector": "[colspan], [rowspan]", "min": 1 }
  ],
  "hint": "Start with <table><caption>...</caption><thead><tr><th scope=\"col\">...</th></tr></thead><tbody>...</tbody></table>. In each body row, make the first cell a <th scope=\"row\">.",
  "height": 320
}
=== prompt
Build a price list for a small business (for example a salon, a printing shop or a laundry). Use a `<caption>`, a `<thead>` with at least three column headers using `scope="col"`, a `<tbody>` with at least three rows where the first cell of each row is a `<th scope="row">`, and use `colspan` or `rowspan` at least once (for example a "Special offers" row).
=== html
<table border="1" cellpadding="8" cellspacing="0">

</table>
=== sample html
<table border="1" cellpadding="8" cellspacing="0">
  <caption>Laundry price list</caption>
  <thead>
    <tr>
      <th scope="col">Item</th>
      <th scope="col">Wash</th>
      <th scope="col">Wash and iron</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Shirt</th>
      <td>₦300</td>
      <td>₦500</td>
    </tr>
    <tr>
      <th scope="row">Trousers</th>
      <td>₦400</td>
      <td>₦600</td>
    </tr>
    <tr>
      <th scope="row">Bedsheet</th>
      <td>₦800</td>
      <td>₦1,000</td>
    </tr>
    <tr>
      <td colspan="3">Free pickup for orders above ₦5,000</td>
    </tr>
  </tbody>
</table>
```

```answer
{
  "id": "web-m04-a1",
  "prompt": "Which attribute on a `<label>` connects it to the input with a matching `id`? Type the attribute name.",
  "answer": "for",
  "format": "text",
  "accept": ["the for attribute", "for attribute"],
  "explanation": "<label for=\"email\"> goes with <input id=\"email\">. Clicking the label then focuses the input, and screen readers announce it.",
  "required": true
}
```
$md$, true, true, 4, array['web-m04-a1', 'web-m04-t1', 'web-m04-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m05', 'web-development-for-beginners', 'Media, SEO and Accessibility', 5, 'Accessible Web', 'A11Y', array['Embed video, audio and other content', 'Write page information for search engines and link sharing', 'Fix common accessibility problems', 'Audit a page with Lighthouse']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:html-media-seo-accessibility', 'web-development-for-beginners', 'web-m05', 'html-media-seo-accessibility', 'Media, Page Information, Search and Accessibility', 'Add audio, video and embeds, write the hidden page information that search engines and WhatsApp read, and build pages that everyone can use, including people who use a keyboard or a screen reader.', 30, $md$
## Audio, video and embeds

HTML can play sound and video with no extra software.

```html
<video controls width="480" poster="images/intro-thumbnail.jpg">
  <source src="videos/intro.mp4" type="video/mp4" />
  Your browser does not support video.
</video>

<audio controls>
  <source src="audio/welcome.mp3" type="audio/mpeg" />
</audio>
```

- `controls` shows the play button, volume and progress bar. Without it, nothing appears.
- `poster` is the picture shown before the video plays.
- The text inside the element is shown only by browsers that cannot play it.
- Never make a video **autoplay with sound**. People hate it, and browsers block it.

Videos are heavy. For anything long, it is better to **embed** a video from a service such as YouTube, which handles the streaming for you. To do this, use the **Share, Embed** button on the video, and paste the `<iframe>` it gives you:

```html
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="Welcome to our school, a two minute tour"
  loading="lazy"
  allowfullscreen
></iframe>
```

An `<iframe>` shows another web page inside yours. Google Maps embeds work the same way, which is handy for a "Find us" section. Always give an iframe a `title`, and add `loading="lazy"` so it loads only when the visitor scrolls to it.

> [!WARNING]
> Only embed content from sources you trust. An iframe loads someone else's page on your site.

## More useful elements you can try right now

Some elements give you interaction with no JavaScript at all.

```live
=== html
<details>
  <summary>How do I pay for my course?</summary>
  <p>You can pay by bank transfer, then upload your receipt. We confirm within a day.</p>
</details>
<details open>
  <summary>Can I learn on my phone?</summary>
  <p>Yes. Every lesson works on a phone browser.</p>
</details>

<p>Course progress: <progress value="65" max="100">65%</progress></p>
<p>Battery: <meter value="0.3" min="0" max="1" low="0.25" high="0.75" optimum="1">30%</meter></p>
<p>Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save. The word <abbr title="HyperText Markup Language">HTML</abbr> has a tooltip.</p>
<p>Published on <time datetime="2026-10-08">8 October 2026</time>.</p>
```

- `<details>` and `<summary>` make an expandable section, perfect for FAQs.
- `<progress>` and `<meter>` show a value on a scale.
- `<abbr>` explains an abbreviation when hovered. `<kbd>` shows a key. `<time>` gives a date in a form machines can read.

## The head: information about your page

You met `<head>` in lesson 1. It is also where you tell **search engines, browsers, and apps like WhatsApp** about your page. None of it shows on the page itself.

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Bright Future Academy | Primary and Secondary School in Ibadan</title>
  <meta
    name="description"
    content="A small, friendly school in Ibadan for ages 6 to 17. WAEC and NECO preparation, coding club and caring teachers."
  />
  <link rel="icon" href="favicon.png" />

  <!-- What appears when the link is shared on WhatsApp, Facebook or LinkedIn -->
  <meta property="og:title" content="Bright Future Academy" />
  <meta property="og:description" content="Quality education in Ibadan." />
  <meta property="og:image" content="https://example.com/images/school-share.jpg" />
</head>
```

| Tag | What it controls |
| :-- | :-- |
| `<title>` | The browser tab, bookmarks and the blue headline in Google results |
| `meta name="description"` | The grey text under the headline in Google. Aim for about 150 characters |
| `link rel="icon"` | The small icon in the browser tab |
| `meta property="og:..."` | The picture, title and text when someone **shares your link**. Without these, a shared link looks bare |

## Helping people find your page (SEO)

**SEO** (search engine optimisation) means making it easy for Google to understand what your page is about. Most of it is just good HTML:

1. A **clear, unique `<title>`** on every page, with the important words first.
2. A **description** that makes people want to click.
3. **One `<h1>`** and sensible headings that use the words people would search for.
4. **Descriptive `alt` text** on images and meaningful link text.
5. A page that is **fast** and **works on phones**. Google ranks mobile pages first.
6. **HTTPS**, which hosts like GitHub Pages give you for free.

No trick will put you at number one overnight. Pages that help real visitors win over time.

## Accessibility: a page for everyone

Around one in six people has some kind of disability. Some cannot see the screen and use a **screen reader** that reads the page aloud. Some cannot use a mouse and move with the **Tab key**. Some have low vision, some are colour-blind, some are on a bumpy bus with a bad screen in the sun. Building accessibly means they can all use your page, and it makes the page better for everyone.

Most of accessibility is things you already know, done properly:

| Do this | Because |
| :-- | :-- |
| Use semantic elements: `header`, `nav`, `main`, headings in order | Screen readers can jump around the page |
| Give every image an `alt` (empty for decoration) | Blind users hear what the picture shows |
| Label every form control with `<label>` | The field is announced when focused |
| Write meaningful link text | "Read the admissions guide", never "click here" |
| Set `lang="en"` on `<html>` | Screen readers use the right pronunciation |
| Use a real `<button>` for actions and `<a>` for links | They work with the keyboard for free |
| Keep a good colour contrast (you will check this in CSS) | Text is readable for low vision users |

### Try the keyboard

Click in the preview below and press **Tab** repeatedly. You can reach every link and button without a mouse, and you can see which one is focused. Press **Enter** on a link or button to use it. Everything a mouse can do must be possible this way.

```live
=== html
<a href="#main" style="position:absolute;left:-9999px" id="skip" onfocus="this.style.left='8px'" onblur="this.style.left='-9999px'">Skip to main content</a>
<nav>
  <a href="#a">Home</a> |
  <a href="#b">Courses</a> |
  <a href="#c">Contact</a>
</nav>
<main id="main">
  <h1>Keyboard test</h1>
  <button>Save</button>
  <button>Cancel</button>
  <label>Name <input type="text" /></label>
</main>
```

The first link is a **skip link**. It is hidden until it gets focus, and it lets keyboard users jump past a long menu straight to the content. Press Tab once to see it.

### ARIA, when HTML is not enough

**ARIA** attributes add meaning where plain HTML cannot. The first rule of ARIA is **do not use it if a normal element will do**: a `<button>` is better than a `<div role="button">`. A few useful ones:

```html
<button aria-label="Close menu">×</button>
<nav aria-label="Main menu">...</nav>
<img src="logo.svg" alt="" aria-hidden="true" />
```

`aria-label` gives an accessible name to something with no visible text, such as an icon button. Without it, a screen reader would just say "button".

## Check your own pages

Two free checks you can run on any page you build:

1. **The W3C validator** at validator.w3.org finds broken or invalid HTML.
2. **Chrome Lighthouse**. In Chrome, open DevTools with `F12`, click the **Lighthouse** tab, and run it for Accessibility and SEO. It gives a score and a list of fixes.

## Try it

First, write the head for a real page. A good head is what makes a link look professional when someone shares it on WhatsApp.

```webtask
{
  "id": "web-m05-t1",
  "minutes": 10,
  "required": true,
  "tabs": ["html"],
  "rules": [
    { "label": "<html lang=\"en\"> is set", "in": "html", "pattern": "<html[^>]*\\blang=[\"']en" },
    { "label": "The UTF-8 charset and the viewport meta tags are present", "in": "html", "pattern": "charset=[\"']?utf-8[\\s\\S]*name=[\"']viewport|name=[\"']viewport[\\s\\S]*charset=[\"']?utf-8" },
    { "label": "A <title> of at least 20 characters", "in": "html", "pattern": "<title>[^<]{20,}</title>" },
    { "label": "A meta description between 50 and 160 characters", "in": "html", "pattern": "<meta[^>]*name=[\"']description[\"'][^>]*content=[\"'][^\"']{50,160}[\"']|<meta[^>]*content=[\"'][^\"']{50,160}[\"'][^>]*name=[\"']description[\"']" },
    { "label": "Open Graph tags for og:title and og:description", "in": "html", "pattern": "property=[\"']og:title[\"'][\\s\\S]*property=[\"']og:description[\"']|property=[\"']og:description[\"'][\\s\\S]*property=[\"']og:title[\"']" },
    { "label": "A favicon link (rel=\"icon\")", "in": "html", "pattern": "<link[^>]*rel=[\"']icon[\"']" },
    { "label": "The page has an <h1> with the business name", "selector": "h1", "min": 1, "contains": "[A-Za-z]{3,}" }
  ],
  "hint": "Add <meta name=\"description\" content=\"...\" /> with a sentence about 100 characters long. For sharing, use <meta property=\"og:title\" content=\"...\" /> and <meta property=\"og:description\" content=\"...\" />. The favicon is <link rel=\"icon\" href=\"favicon.png\" />.",
  "height": 300
}
=== prompt
This page for a hair salon has no page information. Complete the `<head>`: `lang="en"` on `<html>`, the charset and viewport meta tags, a descriptive `<title>` (at least 20 characters), a meta **description** (50 to 160 characters), `og:title` and `og:description` tags, and a favicon link.
=== html
<!DOCTYPE html>
<html>
<head>

</head>
<body>
  <h1>Shine Hair Studio</h1>
  <p>Braids, natural hair care and styling in Lekki, Lagos.</p>
</body>
</html>
=== sample html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Shine Hair Studio | Braids and Natural Hair Care in Lekki</title>
  <meta name="description" content="Shine Hair Studio in Lekki, Lagos offers neat braids, natural hair care and styling. Book your appointment today." />
  <link rel="icon" href="favicon.png" />
  <meta property="og:title" content="Shine Hair Studio" />
  <meta property="og:description" content="Braids and natural hair care in Lekki, Lagos." />
</head>
<body>
  <h1>Shine Hair Studio</h1>
  <p>Braids, natural hair care and styling in Lekki, Lagos.</p>
</body>
</html>
```

Now the accessibility audit. This page looks fine to a sighted mouse user, but it has six accessibility problems. Find and fix them all.

```webtask
{
  "id": "web-m05-t2",
  "minutes": 12,
  "required": true,
  "rules": [
    { "label": "Every image has an alt attribute", "selector": "img:not([alt])", "min": 0, "max": 0 },
    { "label": "The profile photo's alt text describes it (at least 8 characters)", "selector": "img[src]", "attr": { "alt": ".{8,}" } },
    { "label": "Both form fields have a connected <label>", "selector": "label[for]", "min": 2 },
    { "label": "No link says \"click here\"", "in": "html", "pattern": ">\\s*click here\\s*<", "absent": true },
    { "label": "The icon-only button has an aria-label", "selector": "button[aria-label]", "min": 1 },
    { "label": "The headings go in order: one h1, then h2 (no h4 left)", "selector": "h4", "min": 0, "max": 0 },
    { "label": "The page language is set on <html>", "in": "html", "pattern": "<html[^>]*\\blang=" }
  ],
  "hint": "Add alt=\"...\" to the image, give each input an id and a <label for=\"...\">, change \"click here\" into text that says where the link goes, add aria-label=\"Search\" to the button, change <h4> to <h2>, and add lang=\"en\" to <html>.",
  "height": 340
}
=== prompt
Fix the accessibility problems in this page: the missing alt text, the form fields without labels, the "click here" link, the icon button with no name, the heading that skips levels, and the missing page language.
=== html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Ada Okafor | Data Analyst</title>
</head>
<body>
  <h1>Ada Okafor</h1>
  <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><circle cx='60' cy='60' r='60' fill='%230f766e'/></svg>" />
  <h4>About me</h4>
  <p>I help small businesses understand their numbers. <a href="#cv">click here</a> for my CV.</p>

  <h2>Search my blog</h2>
  <input type="text" id="q" />
  <button>🔍</button>

  <h2>Subscribe</h2>
  <input type="email" id="mail" placeholder="Your email" />
</body>
</html>
=== sample html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Ada Okafor | Data Analyst</title>
</head>
<body>
  <h1>Ada Okafor</h1>
  <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><circle cx='60' cy='60' r='60' fill='%230f766e'/></svg>" alt="A green circle used as Ada's profile picture" />
  <h2>About me</h2>
  <p>I help small businesses understand their numbers. <a href="#cv">Read my CV</a> for more.</p>

  <h2>Search my blog</h2>
  <label for="q">Search</label>
  <input type="text" id="q" />
  <button aria-label="Search">🔍</button>

  <h2>Subscribe</h2>
  <label for="mail">Your email</label>
  <input type="email" id="mail" placeholder="ada@example.com" />
</body>
</html>
=== note
Each of these fixes takes seconds, but together they decide whether a blind visitor, a keyboard user or Google can understand your page. Run Lighthouse on pages you build and fix what it finds.
```

```answer
{
  "id": "web-m05-a1",
  "prompt": "Which `<head>` tag sets the text shown on the **browser tab** and as the headline in Google results? Type the tag name without angle brackets.",
  "answer": "title",
  "format": "text",
  "accept": ["<title>", "the title tag", "title tag"],
  "explanation": "<title> is the page's name. Write a clear, unique one for every page.",
  "required": true
}
```
$md$, true, true, 5, array['web-m05-a1', 'web-m05-t1', 'web-m05-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m06', 'web-development-for-beginners', 'CSS Fundamentals: Selectors and the Cascade', 6, 'CSS Basics', 'CSS', array['Add CSS with an external stylesheet', 'Use element, class, id, descendant and pseudo-class selectors', 'Predict which rule wins with specificity', 'Use inheritance']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:css-the-style', 'web-development-for-beginners', 'web-m06', 'css-the-style', 'CSS Fundamentals: Selectors and the Cascade', 'Learn how CSS works, the three ways to add it, every kind of selector, and the rules that decide which style wins. Style a page from plain HTML to something you are proud of.', 35, $md$
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
$md$, true, true, 6, array['web-m06-a1', 'web-m06-t1', 'web-m06-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m07', 'web-development-for-beginners', 'The Box Model, Units, Display and Position', 7, 'Box Model', 'BOXMODEL', array['Control padding, borders and margins', 'Use border-box, rem, percentages and viewport units', 'Choose block, inline and inline-block', 'Place elements with sticky, relative and absolute']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:css-box-model-units', 'web-development-for-beginners', 'web-m07', 'css-box-model-units', 'The Box Model, Units, Display and Position', 'Understand the idea behind all CSS layout, that every element is a box. Control size, spacing, borders and units, choose how elements flow, and place things exactly with position.', 35, $md$
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
$md$, true, true, 7, array['web-m07-a1', 'web-m07-t1', 'web-m07-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m08', 'web-development-for-beginners', 'Colour, Fonts, Backgrounds and Effects', 8, 'CSS Styling', 'STYLING', array['Build a colour palette and check contrast', 'Set readable typography', 'Use gradients, shadows and rounded corners', 'Organise a design with CSS variables']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:css-colour-fonts-effects', 'web-development-for-beginners', 'web-m08', 'css-colour-fonts-effects', 'Colour, Fonts, Backgrounds and Visual Effects', 'Make pages look professional. Pick a colour palette, check contrast, style text so it is easy to read, use gradients and backgrounds, add shadows and rounded corners, and organise your design with CSS variables.', 35, $md$
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
$md$, true, true, 8, array['web-m08-a1', 'web-m08-t1', 'web-m08-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m09', 'web-development-for-beginners', 'Flexbox', 9, 'Flexbox', 'FLEXBOX', array['Use the main and cross axes', 'Build navbars, centred layouts and wrapping card rows', 'Control item growth with flex', 'Keep a footer at the bottom']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:css-flexbox', 'web-development-for-beginners', 'web-m09', 'css-flexbox', 'Flexbox: Layout in One Direction', 'Master flexbox, the tool behind most navigation bars, card rows and centred layouts. Learn the container and item properties one at a time, then build a real navbar and a card row that adapts to any screen.', 40, $md$
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
$md$, true, true, 9, array['web-m09-a1', 'web-m09-t1', 'web-m09-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m10', 'web-development-for-beginners', 'CSS Grid', 10, 'CSS Grid', 'CSSGRID', array['Define columns and rows with fr and repeat', 'Build a gallery that adapts with auto-fit', 'Span items across tracks', 'Lay out a page with named grid areas']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:css-grid', 'web-development-for-beginners', 'web-m10', 'css-grid', 'CSS Grid: Layout in Rows and Columns', 'Learn CSS Grid, the most powerful layout tool in CSS. Build a photo gallery that adapts to any screen with no media queries, and a complete page layout with named areas.', 35, $md$
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
$md$, true, true, 10, array['web-m10-a1', 'web-m10-t1', 'web-m10-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m11', 'web-development-for-beginners', 'Responsive Design', 11, 'Responsive Design', 'RESPONSV', array['Write mobile-first media queries', 'Make images and text flexible', 'Add dark mode with variables', 'Test on different screen sizes']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:css-responsive-design', 'web-development-for-beginners', 'web-m11', 'css-responsive-design', 'Responsive Design: One Site for Every Screen', 'Make pages that work on a phone, a tablet and a desktop. Learn mobile-first CSS, media queries, flexible images, fluid text and dark mode, and how to test on every screen size.', 35, $md$
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
$md$, true, true, 11, array['web-m11-a1', 'web-m11-t1', 'web-m11-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m12', 'web-development-for-beginners', 'Transitions and Animation', 12, 'CSS Motion', 'MOTION', array['Add smooth transitions and transforms', 'Write keyframe animations', 'Decorate with pseudo-elements', 'Respect reduced-motion preferences']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:css-transitions-animation', 'web-development-for-beginners', 'web-m12', 'css-transitions-animation', 'Transitions, Transforms, Animation and Pseudo-elements', 'Bring pages to life with smooth hover effects, transforms and keyframe animations, add decorative touches with ::before and ::after, and do it all in a way that is fast and kind to users.', 35, $md$
## Motion with a purpose

Small amounts of motion make a site feel alive and tell people what is clickable: a button that lifts when you hover, a menu that slides open, a spinner that shows something is loading. Too much motion is annoying and slows pages down. The rule is: **motion should help the user**, not just decorate.

CSS can do all of this with no JavaScript, and in this lesson you will use three tools: **transitions**, **transforms** and **animations**.

## Transitions: smooth changes

Normally when a style changes, for example on hover, it changes instantly. A **transition** makes the change happen gradually.

```css
.button {
  background: #0f766e;
  transition: background 0.3s ease;
}
.button:hover {
  background: #115e59;
}
```

The `transition` shorthand has the property to animate, the duration, and the **timing function**. You can add a delay as a fourth value.

| Part | Example | Meaning |
| :-- | :-- | :-- |
| Property | `background`, `transform`, `opacity` or `all` | What changes smoothly |
| Duration | `0.3s` or `300ms` | How long it takes. 0.15s to 0.4s feels natural |
| Timing | `ease`, `linear`, `ease-in-out` | The speed curve |
| Delay | `0.1s` | Wait before starting |

Hover over the buttons. Then change the duration to `1.5s` to see the effect clearly, and then put it back to something quick.

```live
=== html
<button class="btn">Hover me</button>
<button class="btn outline">Outline button</button>
=== css
body { font-family: system-ui, sans-serif; padding: 24px; }
.btn {
  background: #0f766e;
  color: white;
  border: 2px solid #0f766e;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease, transform 0.2s ease;
}
.btn:hover {
  background: #115e59;
  transform: translateY(-2px);
}
.btn:active {
  transform: translateY(0);
}
.outline {
  background: transparent;
  color: #0f766e;
}
.outline:hover {
  background: #0f766e;
  color: white;
}
```

## Transforms: move, scale and rotate

`transform` changes how an element is drawn **without disturbing the layout** around it, and that is why it is fast and why it is the best partner for transitions.

| Function | What it does |
| :-- | :-- |
| `translate(x, y)` or `translateY(-4px)` | Moves the element |
| `scale(1.05)` | Makes it bigger (1.05 means 5% bigger) |
| `rotate(10deg)` | Turns it |
| `skew(10deg)` | Slants it |

You can combine them in one line: `transform: translateY(-4px) scale(1.03);`.

A card that lifts when you hover over it is very common.

```live
=== html
<div class="cards">
  <article class="card"><h3>Excel</h3><p>Formulas and charts.</p></article>
  <article class="card"><h3>SQL</h3><p>Questions for data.</p></article>
  <article class="card"><h3>Python</h3><p>Automate your work.</p></article>
</div>
=== css
body { font-family: system-ui, sans-serif; padding: 24px; }
.cards { display: flex; gap: 16px; flex-wrap: wrap; }
.card {
  flex: 1 1 140px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 2px 6px rgb(0 0 0 / 6%);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 28px rgb(0 0 0 / 14%);
}
```

> [!TIP]
> For smooth, fast animation, animate only **`transform`** and **`opacity`**. Animating `width`, `height`, `top` or `margin` forces the browser to recalculate the whole layout and can make pages stutter on cheap phones.

## Keyframe animations

A transition goes from one state to another when something triggers it. An **animation** runs by itself and can pass through many steps. You describe the steps with `@keyframes`, then attach them to an element with `animation`.

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero {
  animation: fade-in 0.8s ease-out;
}
```

The shorthand is `animation: name duration timing delay iteration-count direction`. Useful values include `infinite` (repeat forever), `alternate` (go back and forth) and `forwards` (stay at the end).

```live
=== html
<h2 class="fade">Welcome back</h2>
<div class="spinner" role="status" aria-label="Loading"></div>
<button class="pulse">Subscribe</button>
=== css
body { font-family: system-ui, sans-serif; padding: 24px; }

@keyframes fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade { animation: fade-in 0.8s ease-out; }

@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner {
  width: 40px;
  height: 40px;
  margin: 16px 0;
  border: 5px solid #ccfbf1;
  border-top-color: #0f766e;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.06); }
}
.pulse {
  background: #b45309;
  color: white;
  border: 0;
  padding: 12px 28px;
  border-radius: 999px;
  font-size: 1rem;
  animation: pulse 1.6s ease-in-out infinite;
}
```

Click **Reset** and the fade-in plays again. A spinner is just a square with a coloured border, rounded into a circle, and rotated forever. Loading spinners on real sites are often built exactly this way.

### Be kind: reduce motion

Some people feel dizzy or sick when pages move a lot, and their device has a setting to say so. Respect it:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

Never rely on animation alone to carry meaning, and never make something flash quickly.

## Pseudo-elements: add decoration without extra HTML

A **pseudo-element** is a part of an element you can style, or an extra piece of content CSS draws for you, written with **two colons**.

| Pseudo-element | What it is |
| :-- | :-- |
| `::before` and `::after` | Extra content before or after an element's content. Needs `content: ""` to appear |
| `::first-letter` | The first letter, for a drop cap |
| `::first-line` | The first line of a paragraph |
| `::selection` | The text a user highlights |
| `::placeholder` | The grey hint text in an input |

`::before` and `::after` are the useful ones. They let you draw lines, icons, badges and shapes without adding elements to your HTML.

```live
=== html
<h2 class="title">Our services</h2>
<a class="link" href="#">Read more</a>
<blockquote class="quote">Learning to code changed how I work.</blockquote>
=== css
body { font-family: system-ui, sans-serif; padding: 24px; }

.title {
  position: relative;
  padding-bottom: 10px;
}
.title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 60px;
  height: 4px;
  background: #0f766e;
  border-radius: 2px;
}

.link {
  position: relative;
  color: #0f766e;
  text-decoration: none;
  font-weight: 600;
}
.link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 0;
  height: 2px;
  background: currentColor;
  transition: width 0.3s ease;
}
.link:hover::after {
  width: 100%;
}

.quote {
  margin: 24px 0;
  padding-left: 16px;
  border-left: 4px solid #fbbf24;
  font-style: italic;
}
.quote::before {
  content: "\201C";
  font-size: 2rem;
  color: #fbbf24;
}

::selection {
  background: #fde68a;
}
```

Hover over **Read more**: the underline grows from nothing, using only a pseudo-element, `width` and a transition. Select some text with the mouse to see the custom `::selection` colour.

## Try it

Make a button and a card react to the mouse with transitions.

```webtask
{
  "id": "web-m12-t1",
  "minutes": 12,
  "required": true,
  "tabs": ["css"],
  "rules": [
    { "label": "The button has a transition (a duration above 0s)", "selector": ".btn", "style": { "transition-duration": "^(?!0s$)" } },
    { "label": "The button changes on hover (a .btn:hover rule that changes the background)", "in": "css", "pattern": "\\.btn:hover\\s*\\{[^}]*background" },
    { "label": "The button moves or grows on hover with a transform", "in": "css", "pattern": "\\.btn:hover\\s*\\{[^}]*transform\\s*:\\s*(translate|scale)" },
    { "label": "The card has a transition that includes transform", "selector": ".card", "style": { "transition-property": "transform|all" } },
    { "label": "The card lifts on hover (a .card:hover rule with translateY and a stronger box-shadow)", "in": "css", "pattern": "\\.card:hover\\s*\\{[^}]*translateY\\([^)]*\\)[^}]*box-shadow|\\.card:hover\\s*\\{[^}]*box-shadow[^}]*translateY" },
    { "label": "The button shows the pointer cursor", "selector": ".btn", "style": { "cursor": "pointer" } },
    { "label": "The transitions are kept short (under 1 second)", "selector": ".btn", "style": { "transition-duration": "^(0\\.\\d+s|[1-9]\\d\\d ?ms)" } }
  ],
  "hint": ".btn { transition: background 0.3s ease, transform 0.2s ease; cursor: pointer; } .btn:hover { background: #115e59; transform: translateY(-2px); } .card { transition: transform 0.25s ease, box-shadow 0.25s ease; } .card:hover { transform: translateY(-6px); box-shadow: 0 14px 28px rgb(0 0 0 / 14%); }",
  "height": 340
}
=== prompt
Add hover effects. The `.btn` needs a `transition` (under 1 second), the pointer cursor, and a `.btn:hover` rule that changes the `background` and moves it with `transform`. The `.card` needs a transition on `transform` and `box-shadow`, and a `.card:hover` rule that lifts it with `translateY` and a stronger `box-shadow`.
=== html
<article class="card">
  <h3>Starter plan</h3>
  <p>Everything you need to begin.</p>
  <button class="btn">Choose plan</button>
</article>
=== css
body {
  font-family: system-ui, sans-serif;
  padding: 24px;
}
.card {
  width: 240px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgb(0 0 0 / 6%);
}
.btn {
  background: #0f766e;
  color: white;
  border: 0;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
}
=== sample css
body {
  font-family: system-ui, sans-serif;
  padding: 24px;
}
.card {
  width: 240px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgb(0 0 0 / 6%);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 28px rgb(0 0 0 / 14%);
}
.btn {
  background: #0f766e;
  color: white;
  border: 0;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}
.btn:hover {
  background: #115e59;
  transform: translateY(-2px);
}
```

Now an animation. Build a loading spinner and a fading-in message.

```webtask
{
  "id": "web-m12-t2",
  "minutes": 12,
  "required": true,
  "tabs": ["css"],
  "rules": [
    { "label": "A @keyframes called spin rotates the element by 360 degrees", "in": "css", "pattern": "@keyframes\\s+spin\\s*\\{[^@]*rotate\\(\\s*360deg" },
    { "label": "The spinner uses the spin animation and repeats forever", "selector": ".spinner", "style": { "animation-name": "spin", "animation-iteration-count": "infinite" } },
    { "label": "The spinner is a circle (border-radius 50%) at least 30px wide", "selector": ".spinner", "style": { "border-top-left-radius": "^(50%|[1-9]\\d+(\\.\\d+)?px)$", "width": "^(3\\d|[4-9]\\d|\\d{3,})(\\.\\d+)?px$" } },
    { "label": "A second @keyframes makes the message fade in (it changes opacity)", "in": "css", "pattern": "@keyframes\\s+(?!spin)[a-z-]+\\s*\\{[^@]*opacity" },
    { "label": "The message plays that animation once", "selector": ".message", "style": { "animation-name": "^(?!none$)(?!spin$)", "animation-iteration-count": "^1$" } },
    { "label": "Motion is switched off for people who prefer reduced motion", "in": "css", "pattern": "@media\\s*\\(\\s*prefers-reduced-motion\\s*:\\s*reduce" }
  ],
  "hint": "@keyframes spin { to { transform: rotate(360deg); } } .spinner { width: 40px; height: 40px; border: 5px solid #ccfbf1; border-top-color: #0f766e; border-radius: 50%; animation: spin 0.9s linear infinite; } @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .message { animation: fade-in 1s ease-out; } @media (prefers-reduced-motion: reduce) { * { animation: none; } }",
  "height": 340
}
=== prompt
Build a loading screen. Write `@keyframes spin` that rotates by `360deg`, and make `.spinner` a circle (at least 30px, `border-radius: 50%`, one coloured side of its border) that plays it forever with `animation: spin 0.9s linear infinite`. Write a second `@keyframes` that fades `.message` in with `opacity`, and play it once. Finally, switch the animations off inside `@media (prefers-reduced-motion: reduce)`.
=== html
<div class="loading">
  <div class="spinner" role="status" aria-label="Loading"></div>
  <p class="message">Getting your courses ready...</p>
</div>
=== css
body {
  font-family: system-ui, sans-serif;
  display: grid;
  place-items: center;
  min-height: 100vh;
  margin: 0;
}
.loading {
  text-align: center;
}
=== sample css
body {
  font-family: system-ui, sans-serif;
  display: grid;
  place-items: center;
  min-height: 100vh;
  margin: 0;
}
.loading {
  text-align: center;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.spinner {
  width: 44px;
  height: 44px;
  margin: 0 auto 16px;
  border: 5px solid #ccfbf1;
  border-top-color: #0f766e;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.message {
  animation: fade-in 1s ease-out;
}
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none;
  }
}
```

```answer
{
  "id": "web-m12-a1",
  "prompt": "For smooth, fast animations, you should animate `opacity` and which other property? Type its name.",
  "answer": "transform",
  "format": "text",
  "accept": ["transforms", "the transform property"],
  "explanation": "transform and opacity can be animated without recalculating the page layout, so they stay smooth even on slow phones.",
  "required": true
}
```
$md$, true, true, 12, array['web-m12-a1', 'web-m12-t1', 'web-m12-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m13', 'web-development-for-beginners', 'JavaScript Basics: Variables, Types and the Console', 13, 'JavaScript Basics', 'JS', array['Print and debug with console.log', 'Use let, const and the basic data types', 'Work with strings, numbers and template literals', 'Read error messages']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:javascript-the-behaviour', 'web-development-for-beginners', 'web-m13', 'javascript-the-behaviour', 'JavaScript Basics: Variables, Types and the Console', 'Meet JavaScript, the language that makes pages react. Learn variables, data types, operators, strings and numbers, print results to the console, and read error messages like a developer.', 35, $md$
## What JavaScript does

HTML gives a page its structure and CSS gives it its look. **JavaScript** gives it a **brain**. With it a page can react when you click, check a form before it is sent, show and hide things, calculate a total, fetch fresh data, remember your settings, and much more. Everything you do on sites like Jumia, Twitter or Google Maps that is not just reading is JavaScript.

JavaScript is also a full programming language. In this lesson you learn its building blocks. They are the same ideas you will find in nearly every language, so time spent here pays off for years.

> [!NOTE]
> JavaScript and Java are different languages with similar names. They have nothing to do with each other.

## Running your first code: console.log

The simplest way to see what your code does is to **print** it. `console.log()` prints a value to the **console**, a special panel for developers. In this course the editor shows the console output right below the preview. In your own browser you open it with `F12`, then click **Console**.

Click into the code, change the message, and watch the output change.

```live
=== js
console.log("Hello, Lagos!");
console.log(2 + 3);
console.log("I am learning", "JavaScript");
```

Each `console.log` prints one line. Two things to notice: a piece of text goes in **quotes**, and a statement ends with a **semicolon** `;`.

On a real page, your JavaScript lives in a `<script>` element, or in a file you load with `<script src="script.js"></script>` just before `</body>`. In the editors, the **script.js** tab does this for you.

## Variables: named boxes for values

A **variable** is a name for a value, like a labelled box. You create one with `let` or `const`:

```js
const shopName = "Mama Ngozi's Kitchen";   // const: will not be reassigned
let customers = 12;                        // let: can change later
customers = customers + 1;                 // now it is 13
```

- **`const`** for values that will not be reassigned. Use this by default.
- **`let`** for values that will change.
- You may see **`var`** in older code. It has confusing rules, so avoid it.

Naming rules: use letters, digits, `_` and `$`, never start with a digit, and no spaces. By convention, JavaScript names use **camelCase**: `totalPrice`, `firstName`, `isLoggedIn`. Make names say what the value is.

```live
=== js
const price = 1200;
const quantity = 3;
let total = price * quantity;
console.log(total);

total = total + 500;     // let allows changing it
console.log(total);

// price = 1500;         // remove the // to see the error for a const
```

Remove the `//` in front of the last line. The console shows a red **TypeError**: you tried to change a `const`. Errors are not failure. They are the computer telling you exactly what is wrong, and you will learn to love them.

## Data types

Every value has a **type**. There are a few basic ones.

| Type | Example | Used for |
| :-- | :-- | :-- |
| **String** | `"Ada"`, `'Lagos'`, `` `Hello` `` | Text |
| **Number** | `42`, `3.14`, `-7` | Whole and decimal numbers |
| **Boolean** | `true`, `false` | Yes or no answers |
| **undefined** | `undefined` | A variable that has no value yet |
| **null** | `null` | A value that is deliberately empty |

Later you will meet **arrays** (lists) and **objects** (records), which hold many values. Use `typeof` to ask for the type of a value:

```live
=== js
console.log(typeof "hello");
console.log(typeof 42);
console.log(typeof true);
console.log(typeof undefined);

let notSetYet;
console.log(notSetYet);       // undefined

console.log(typeof "5");      // a string, even though it looks like a number
console.log("5" + 3);         // joins the text: "53"
console.log(5 + 3);           // adds the numbers: 8
```

That last pair matters. The `+` **adds numbers** but **joins strings**, so `"5" + 3` gives `"53"`. This is the most common source of bugs for beginners, and it is why knowing the type of a value matters.

## Strings

Strings are text, and JavaScript has many tools for them.

```live
=== js
const name = "  Ada Okafor  ";

console.log(name.length);               // how many characters
console.log(name.trim());               // remove spaces at the ends
console.log(name.trim().toUpperCase()); // ADA OKAFOR
console.log(name.includes("Okafor"));   // true
console.log(name.trim().slice(0, 3));   // first three characters: Ada
console.log(name.replace("Ada", "Bola"));
console.log("a,b,c".split(","));        // an array: ["a","b","c"]
```

Methods can be **chained**: `name.trim().toUpperCase()` trims, then upper-cases the result.

### Template literals: building text easily

Joining strings with `+` gets messy. **Template literals** use backticks `` ` `` and let you drop values straight into the text with `${...}`:

```live
=== js
const customer = "Ada";
const total = 3600;

console.log("Hello " + customer + ", your total is ₦" + total + ".");   // the old way
console.log(`Hello ${customer}, your total is ₦${total}.`);              // much nicer
console.log(`VAT is ₦${total * 0.075}`);                                 // any expression works
```

You can also write text over many lines inside backticks.

## Numbers and maths

```live
=== js
console.log(10 + 4);     // 14   add
console.log(10 - 4);     // 6    subtract
console.log(10 * 4);     // 40   multiply
console.log(10 / 4);     // 2.5  divide
console.log(10 % 4);     // 2    remainder (modulo)
console.log(2 ** 3);     // 8    power

console.log(Math.round(4.6));    // 5
console.log(Math.floor(4.9));    // 4   round down
console.log(Math.ceil(4.1));     // 5   round up
console.log(Math.max(3, 9, 5));  // 9
console.log(Math.random());      // a random number between 0 and 1

console.log((3600 * 0.075).toFixed(2));   // "270.00": two decimals, as text
console.log(Number("42") + 1);            // 43: turn text into a number
console.log(Number("hello"));             // NaN: not a number
console.log(0.1 + 0.2);                   // 0.30000000000000004 !
```

The last line surprises everyone. Computers store decimals in binary, so some, like 0.1, cannot be stored exactly. It is not a JavaScript bug. For money, either round with `toFixed(2)`, or work in the smallest unit (kobo) and convert at the end. The Web Development with JavaScript course covers this in depth.

`NaN` means "Not a Number", the result of a maths operation that makes no sense, like `Number("hello")`.

## Comparing values

Comparisons give a boolean, `true` or `false`:

| Operator | Meaning | Example |
| :-- | :-- | :-- |
| `===` | Equal (value and type) | `5 === 5` is `true`, `5 === "5"` is `false` |
| `!==` | Not equal | `5 !== 6` is `true` |
| `>` `<` `>=` `<=` | Greater, less | `10 >= 10` is `true` |
| `&&` | AND: both must be true | `age >= 18 && hasId` |
| `\|\|` | OR: at least one is true | `isMember \|\| hasCoupon` |
| `!` | NOT: flips it | `!isLoggedIn` |

> [!WARNING]
> Always use **three** equals signs, `===`, to compare. A single `=` assigns a value, and the double `==` tries to convert types, which gives surprises such as `0 == ""` being true.

```live
=== js
const age = 20;
const hasId = true;

console.log(age >= 18);
console.log(age >= 18 && hasId);
console.log(age < 18 || hasId);
console.log(!hasId);
console.log(5 === "5");
console.log(5 == "5");
```

## Reading error messages

Errors will happen every day for as long as you write code. The skill is reading them. A message tells you the type of error and where it happened.

| Error | Usually means |
| :-- | :-- |
| `ReferenceError: price is not defined` | You used a name that does not exist, often a typo |
| `TypeError: Assignment to constant variable` | You changed a `const` |
| `SyntaxError: Unexpected token` | A missing quote, bracket or comma |

```live
{ "title": "Fix the bugs (expect-error)" }
=== js
const shopName = "Mama Ngozi's Kitchen;
console.log(shopName);
```

This code has a missing closing quote. Find it, fix it, and see the console print the name. Then break something else on purpose. When something does not work, **read the message, find the line, look for a typo**.

> [!TIP]
> A professional habit: when your code does not work, add `console.log` lines to see the value of a variable at each step. This is called **debugging**, and it is most of the job.

## Try it

First, a price calculator. Use variables and template literals, and print the results.

```webtask
{
  "id": "web-m13-t1",
  "minutes": 10,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "You use const or let to create variables", "in": "js", "pattern": "\\b(const|let)\\s+[a-zA-Z_]\\w*\\s*=", "min": 3 },
    { "label": "You use a template literal with ${...}", "in": "js", "pattern": "`[^`]*\\$\\{[^}]+\\}[^`]*`" },
    { "label": "It prints the subtotal, 3600", "output": "\\b3,?600\\b" },
    { "label": "It prints the VAT of 7.5%, which is 270", "output": "\\b270(\\.00)?\\b" },
    { "label": "It prints the total, 3870", "output": "\\b3,?870(\\.00)?\\b" },
    { "label": "There are no errors in the console", "output": "(?<![\\s\\S])(?![\\s\\S]*Error)[\\s\\S]*\\S" }
  ],
  "hint": "const price = 1200; const quantity = 3; const subtotal = price * quantity; const vat = subtotal * 0.075; const total = subtotal + vat; console.log(`Subtotal: ₦${subtotal}`); and similar for the VAT and total.",
  "height": 280
}
=== prompt
A customer buys **3 items at ₦1,200 each**, and VAT is **7.5%**. Using variables, calculate the subtotal, the VAT and the total, and print each on its own line with `console.log` and a template literal, such as `Subtotal: ₦3600`.
=== js
// Write your code here
=== sample js
const price = 1200;
const quantity = 3;
const vatRate = 0.075;

const subtotal = price * quantity;
const vat = subtotal * vatRate;
const total = subtotal + vat;

console.log(`Subtotal: ₦${subtotal}`);
console.log(`VAT: ₦${vat.toFixed(2)}`);
console.log(`Total: ₦${total.toFixed(2)}`);
=== note
`toFixed(2)` makes sure money shows two decimals, and it avoids long numbers like 270.00000000000006 that floating point can produce.
```

Now clean up user input with string methods.

```webtask
{
  "id": "web-m13-t2",
  "minutes": 10,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "You use trim() and toLowerCase() on the email", "in": "js", "pattern": "\\.trim\\(\\)[\\s\\S]*\\.toLowerCase\\(\\)|\\.toLowerCase\\(\\)[\\s\\S]*\\.trim\\(\\)" },
    { "label": "It prints the cleaned email: ada.okafor@example.com", "output": "^ada\\.okafor@example\\.com$" },
    { "label": "It prints the length of the cleaned email, 22", "output": "^22$" },
    { "label": "It prints the user name before the @: ada.okafor", "output": "^ada\\.okafor$" },
    { "label": "It prints true or false for whether the email includes \"@\"", "output": "^(true|false)$" },
    { "label": "You use split(\"@\") or slice/indexOf to get the user name", "in": "js", "pattern": "split\\(\\s*[\"']@[\"']\\s*\\)|indexOf\\(\\s*[\"']@[\"']\\s*\\)" }
  ],
  "hint": "const clean = rawEmail.trim().toLowerCase(); console.log(clean); console.log(clean.length); console.log(clean.split(\"@\")[0]); console.log(clean.includes(\"@\"));",
  "height": 280
}
=== prompt
A visitor typed their email with extra spaces and capital letters. Clean it with `trim()` and `toLowerCase()`, then print on separate lines: **1)** the cleaned email, **2)** its length, **3)** the part before the `@` (use `split("@")[0]`), and **4)** whether it includes `"@"`.
=== js
const rawEmail = "  Ada.Okafor@Example.COM  ";

// Write your code below
=== sample js
const rawEmail = "  Ada.Okafor@Example.COM  ";

const clean = rawEmail.trim().toLowerCase();
console.log(clean);
console.log(clean.length);
console.log(clean.split("@")[0]);
console.log(clean.includes("@"));
```

```answer
{
  "id": "web-m13-a1",
  "prompt": "What does `\"5\" + 3` give in JavaScript? Type the result without quotes.",
  "answer": "53",
  "format": "text",
  "accept": ["\"53\"", "'53'", "the string 53", "53 (a string)"],
  "explanation": "When one side of + is a string, JavaScript joins them as text instead of adding, so \"5\" + 3 is the string \"53\". Convert with Number() if you want 8.",
  "required": true
}
```
$md$, true, true, 13, array['web-m13-a1', 'web-m13-t1', 'web-m13-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m14', 'web-development-for-beginners', 'Decisions, Loops and Functions', 14, 'JS Logic', 'JSLOGIC', array['Make decisions with if, else and switch', 'Repeat work with for and while loops', 'Write and call functions with parameters and return values', 'Use arrow functions and understand scope']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:js-logic-functions', 'web-development-for-beginners', 'web-m14', 'js-logic-functions', 'Decisions, Loops and Functions', 'Teach your code to make decisions with if and switch, repeat work with loops, and package logic into reusable functions. Build a grade calculator, a discount function and a times table.', 35, $md$
## Making decisions with if

Programs become useful when they can **choose**. The `if` statement runs a block of code only when a condition is true.

```js
if (age >= 18) {
  console.log("You can register.");
} else {
  console.log("Sorry, you must be 18 or older.");
}
```

The condition goes in brackets and must be true or false. Use `else if` for more than two options. JavaScript checks them from the top and runs the **first** one that is true.

```live
=== js
const score = 72;

if (score >= 70) {
  console.log("Grade A");
} else if (score >= 60) {
  console.log("Grade B");
} else if (score >= 50) {
  console.log("Grade C");
} else {
  console.log("Fail");
}
```

Change `score` to 65, 50 and 30 and watch the result. Notice that we do not need to write `score >= 70 && score <= 100` in the first branch. By the time the code reaches `else if`, we already know the score is below 70.

### Truthy and falsy

In a condition, JavaScript does not need a real `true` or `false`. Some values count as **falsy**: `false`, `0`, `""` (empty text), `null`, `undefined` and `NaN`. Everything else is **truthy**. So you can write:

```js
const name = "";
if (name) {
  console.log(`Hello ${name}`);
} else {
  console.log("Please enter your name.");   // runs, because "" is falsy
}
```

### The ternary operator

For a quick choice between two values, there is a short form: `condition ? valueIfTrue : valueIfFalse`.

```live
=== js
const isMember = true;
const price = 5000;

const finalPrice = isMember ? price * 0.9 : price;
console.log(`You pay ₦${finalPrice}`);

const stock = 0;
console.log(stock > 0 ? "In stock" : "Sold out");
```

### switch: one value, many cases

When you compare one value against many fixed options, `switch` reads more clearly than a long chain:

```live
=== js
const day = "Saturday";

switch (day) {
  case "Saturday":
  case "Sunday":
    console.log("Weekend: we open at 10 am.");
    break;
  case "Friday":
    console.log("Open until 10 pm.");
    break;
  default:
    console.log("Open 8 am to 6 pm.");
}
```

Each `case` needs a `break`, or the code falls through into the next case. (Above, Saturday and Sunday share a result on purpose.)

## Loops: repeating work

Imagine printing the numbers 1 to 100 by writing 100 lines. A **loop** repeats code for you.

### The for loop

```js
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
```

It has three parts inside the brackets, separated by semicolons:

1. `let i = 1`: the start. Runs once.
2. `i <= 5`: the condition. The loop continues while it is true.
3. `i++`: runs after each round. It adds 1 to `i`.

```live
=== js
for (let i = 1; i <= 5; i++) {
  console.log(`Round ${i}`);
}

let total = 0;
for (let n = 1; n <= 10; n++) {
  total = total + n;
}
console.log(`The sum of 1 to 10 is ${total}`);
```

### while

A `while` loop repeats as long as a condition is true. Use it when you do not know in advance how many rounds you need.

```live
=== js
let balance = 10000;
let years = 0;

while (balance < 20000) {
  balance = balance * 1.1;   // grows 10% a year
  years++;
}
console.log(`It takes ${years} years to double ₦10,000 at 10% a year.`);
```

> [!WARNING]
> If the condition never becomes false, the loop runs forever and freezes the page. Always make sure something inside the loop moves it towards finishing.

### Looping over a list

When you have a list of things (you will learn arrays properly in the next lesson), `for...of` visits each one:

```live
=== js
const items = ["Rice", "Beans", "Plantain"];

for (const item of items) {
  console.log(`Buy ${item}`);
}
```

Two helpful keywords: `break` stops a loop early, and `continue` skips to the next round.

## Functions: reusable recipes

A **function** is a named block of code you can run whenever you want, as many times as you want. It takes **inputs** (parameters) and can give back an **output** (a return value). Functions are the most important idea in programming: they let you write something once and reuse it.

```js
function addVat(price) {
  return price * 1.075;
}

console.log(addVat(1000));   // 1075
console.log(addVat(2000));   // 2150
```

- `function addVat(price)` **declares** the function. `price` is a parameter, a variable that exists only inside.
- `return` sends a value back and ends the function.
- `addVat(1000)` **calls** the function. `1000` is the argument.

```live
=== js
function greet(name) {
  return `Hello, ${name}! Welcome to CloudTech Academy.`;
}

console.log(greet("Ada"));
console.log(greet("Chidi"));

function area(width, height) {
  return width * height;
}
console.log(area(5, 4));
```

### Default values and arrow functions

You can give a parameter a default value for when it is not supplied. And modern JavaScript has a shorter way to write functions, the **arrow function**:

```live
=== js
function delivery(fee = 1500) {
  return `Delivery: ₦${fee}`;
}
console.log(delivery());       // uses the default
console.log(delivery(2500));

// The same idea as an arrow function
const double = (n) => n * 2;
console.log(double(21));

const fullName = (first, last) => `${first} ${last}`;
console.log(fullName("Ada", "Okafor"));
```

For a one-line arrow function, the result after `=>` is returned automatically. You will see arrow functions everywhere, especially as arguments to other functions (as you will soon see with events and arrays).

### Scope: where a variable lives

A variable made inside a function (or inside `{ }` with `let` and `const`) exists only there:

```live
=== js
function test() {
  const secret = 42;
  console.log(secret);     // works here
}
test();
// console.log(secret);    // would be a ReferenceError: secret is not defined here
```

This is helpful, because it stops different parts of your code from interfering with each other. A good rule: **keep variables as local as you can.**

### Functions that make decisions

Real programs combine all three ideas: a function that uses `if`, called from a loop.

```live
=== js
function discount(total) {
  if (total >= 50000) return total * 0.85;
  if (total >= 20000) return total * 0.9;
  return total;
}

const orders = [8000, 25000, 60000];
for (const order of orders) {
  console.log(`Order ₦${order} costs ₦${discount(order)}`);
}
```

## Try it

Write a function that turns a score into a grade, then use it for three students.

```webtask
{
  "id": "web-m14-t1",
  "minutes": 10,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "You wrote a function (function or arrow) for the grade", "in": "js", "pattern": "function\\s+\\w+\\s*\\(|(const|let)\\s+\\w+\\s*=\\s*\\([^)]*\\)\\s*=>|(const|let)\\s+\\w+\\s*=\\s*\\w+\\s*=>" },
    { "label": "It uses if / else if to choose the grade", "in": "js", "pattern": "\\bif\\s*\\(", "min": 2 },
    { "label": "The function is called at least three times", "in": "js", "pattern": "console\\.log\\(\\s*\\w*[gG]rade\\w*\\(|\\bgrade\\w*\\(\\s*\\d+", "min": 3 },
    { "label": "A score of 85 prints A", "output": "85\\D.*\\bA\\b" },
    { "label": "A score of 62 prints B", "output": "62\\D.*\\bB\\b" },
    { "label": "A score of 45 prints F", "output": "45\\D.*\\bF\\b" }
  ],
  "hint": "function grade(score) { if (score >= 70) return \"A\"; if (score >= 60) return \"B\"; if (score >= 50) return \"C\"; return \"F\"; } console.log(`85: ${grade(85)}`); and the same for 62 and 45.",
  "height": 280
}
=== prompt
Write a function `grade(score)` that returns `"A"` for 70 and above, `"B"` for 60 to 69, `"C"` for 50 to 59, and `"F"` below 50. Then print the grades for the scores **85, 62 and 45**, each on its own line, like `85: A`.
=== js
// Write your function and call it three times
=== sample js
function grade(score) {
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  return "F";
}

console.log(`85: ${grade(85)}`);
console.log(`62: ${grade(62)}`);
console.log(`45: ${grade(45)}`);
```

Now a loop. Print a multiplication table and add up some numbers.

```webtask
{
  "id": "web-m14-t2",
  "minutes": 10,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "You use a for or while loop", "in": "js", "pattern": "\\bfor\\s*\\(|\\bwhile\\s*\\(" },
    { "label": "It prints the first line of the 7 times table: 7 x 1 = 7", "output": "7\\D+1\\D+7\\b" },
    { "label": "It prints 7 x 5 = 35", "output": "7\\D+5\\D+35\\b" },
    { "label": "It prints the last line: 7 x 10 = 70", "output": "7\\D+10\\D+70\\b" },
    { "label": "It prints the sum of the numbers from 1 to 100, which is 5050", "output": "\\b5050\\b" },
    { "label": "There are no errors in the console", "output": "(?<![\\s\\S])(?![\\s\\S]*Error)[\\s\\S]*\\S" }
  ],
  "hint": "for (let i = 1; i <= 10; i++) { console.log(`7 x ${i} = ${7 * i}`); } let sum = 0; for (let n = 1; n <= 100; n++) { sum += n; } console.log(`Sum: ${sum}`);",
  "height": 280
}
=== prompt
Use a loop to print the **7 times table** from 7 x 1 to 7 x 10, each on its own line like `7 x 3 = 21`. Then use another loop to add up the numbers from **1 to 100** and print the total.
=== js
// Write your loops here
=== sample js
for (let i = 1; i <= 10; i++) {
  console.log(`7 x ${i} = ${7 * i}`);
}

let sum = 0;
for (let n = 1; n <= 100; n++) {
  sum = sum + n;
}
console.log(`Sum of 1 to 100: ${sum}`);
```

```answer
{
  "id": "web-m14-a1",
  "prompt": "What does `function add(a, b) { return a + b; }` give back for `add(2, 3)`? Type the number.",
  "answer": "5",
  "format": "number",
  "explanation": "The function adds its two arguments and returns the result, which the call add(2, 3) becomes.",
  "required": true
}
```
$md$, true, true, 14, array['web-m14-a1', 'web-m14-t1', 'web-m14-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m15', 'web-development-for-beginners', 'Arrays, Objects and JSON', 15, 'JS Data', 'JSDATA', array['Store lists in arrays and records in objects', 'Transform data with map, filter and reduce', 'Work with arrays of objects', 'Convert data with JSON.stringify and JSON.parse']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:js-arrays-objects', 'web-development-for-beginners', 'web-m15', 'js-arrays-objects', 'Arrays, Objects and JSON', 'Work with real data. Store lists in arrays and records in objects, transform them with map, filter and reduce, and exchange data with the rest of the web using JSON.', 40, $md$
## Why we need collections

So far each variable held one value. Real applications hold **many**: a list of products, a set of customers, the lessons in a course. JavaScript has two structures for this, and nearly everything you build will use them:

- An **array** is an ordered **list**: `["Rice", "Beans", "Yam"]`.
- An **object** is a **record** of named values: `{ name: "Ada", age: 22 }`.

## Arrays

```js
const fruits = ["Mango", "Orange", "Pawpaw"];
```

Items have a position called an **index**, and counting starts at **0**.

```live
=== js
const fruits = ["Mango", "Orange", "Pawpaw"];

console.log(fruits[0]);        // Mango, the first
console.log(fruits[2]);        // Pawpaw
console.log(fruits.length);    // 3
console.log(fruits[fruits.length - 1]);   // the last one, whatever the length

fruits.push("Banana");         // add to the end
console.log(fruits);

const removed = fruits.pop();  // remove from the end
console.log(removed, fruits);

console.log(fruits.includes("Orange"));   // true
console.log(fruits.indexOf("Pawpaw"));    // 2
console.log(fruits.join(" | "));          // Mango | Orange | Pawpaw
```

Other everyday methods: `unshift` and `shift` add and remove at the **start**, `slice(start, end)` copies a part, and `splice(start, count)` removes items in the middle. You can copy and combine arrays with the **spread** operator: `const more = [...fruits, "Guava"];`.

> [!NOTE]
> `const` stops you from replacing the array with a different one, but you can still add and remove items inside it.

## Looping through an array

```live
=== js
const prices = [1200, 850, 2300];

for (const price of prices) {
  console.log(price);
}

prices.forEach((price, index) => {
  console.log(`Item ${index + 1} costs ₦${price}`);
});
```

`forEach` runs a function for each item. The function you pass is an arrow function, which you met in the last lesson.

## The big three: map, filter and reduce

These three array methods do most of the daily work of a web developer. Each takes a function and gives back a **new** result, leaving the original untouched.

### map: transform every item

```live
=== js
const prices = [1200, 850, 2300];

const withVat = prices.map((price) => price * 1.075);
console.log(withVat);

const labels = prices.map((price) => `₦${price}`);
console.log(labels);
```

`map` returns an array of the **same length**, with each item transformed.

### filter: keep some items

```live
=== js
const prices = [1200, 850, 2300, 500];

const cheap = prices.filter((price) => price < 1000);
console.log(cheap);       // [850, 500]
```

`filter` keeps only the items for which the function returns `true`.

### reduce: boil a list down to one value

```live
=== js
const prices = [1200, 850, 2300];

const total = prices.reduce((sum, price) => sum + price, 0);
console.log(total);       // 4350
```

`reduce` carries a running value (`sum`) through the list. The `0` at the end is its starting value. It can total, count, find a maximum, or build anything.

### find, some, every and sort

```live
=== js
const scores = [72, 45, 88, 60];

console.log(scores.find((s) => s > 80));         // 88: the first match
console.log(scores.some((s) => s < 50));         // true: is there at least one?
console.log(scores.every((s) => s >= 40));       // true: are all of them?

// sort changes the array. Numbers need a comparison function!
const sorted = [...scores].sort((a, b) => a - b);
console.log(sorted);                              // [45, 60, 72, 88]
console.log([10, 9, 1].sort());                   // [1, 10, 9]  wrong: sorted as text
```

Without a comparison function, `sort` orders items as **text**, so 10 comes before 9. Always pass `(a, b) => a - b` for numbers.

## Objects

An object groups related values under **keys**, written as `key: value` pairs.

```live
=== js
const student = {
  name: "Ada Okafor",
  age: 22,
  isEnrolled: true,
  skills: ["HTML", "CSS"],
  address: { city: "Enugu", state: "Enugu" }
};

console.log(student.name);              // dot notation
console.log(student["age"]);            // bracket notation, for keys held in variables
console.log(student.skills[1]);         // CSS
console.log(student.address.city);      // nested: Enugu

student.age = 23;                       // change a value
student.email = "ada@example.com";      // add a new key
delete student.isEnrolled;              // remove a key
console.log(student);

console.log(Object.keys(student));      // the key names
console.log(student?.phone?.number);    // undefined, no crash (optional chaining)
```

Use `?.` (optional chaining) to read something that might not exist, without an error when it is missing.

### Methods: functions inside objects

```live
=== js
const cart = {
  items: [1200, 850],
  total() {
    return this.items.reduce((sum, p) => sum + p, 0);
  },
};
console.log(cart.total());
```

### Destructuring: unpacking values

```live
=== js
const product = { name: "Ankara bag", price: 12000, inStock: true };

const { name, price } = product;
console.log(name, price);

const [first, second] = ["Rice", "Beans", "Yam"];
console.log(first, second);
```

## Arrays of objects: the shape of real data

Almost all real data, whether from a database or an API, is an **array of objects**: a list where each item is a record. It is the shape you will use most. Study this example carefully, because you will use these patterns all the time.

```live
=== js
const products = [
  { name: "Ankara bag", price: 12000, inStock: true },
  { name: "Sandals", price: 18500, inStock: false },
  { name: "Necklace", price: 6000, inStock: true },
  { name: "Scarf", price: 8500, inStock: true },
];

// Names of the products in stock
const available = products.filter((p) => p.inStock).map((p) => p.name);
console.log(available);

// The total value of everything in stock
const stockValue = products.filter((p) => p.inStock).reduce((sum, p) => sum + p.price, 0);
console.log(`Stock value: ₦${stockValue}`);

// The cheapest product
const cheapest = products.reduce((min, p) => (p.price < min.price ? p : min));
console.log(cheapest.name);

// Sorted from most to least expensive, without changing the original
const byPrice = [...products].sort((a, b) => b.price - a.price);
console.log(byPrice.map((p) => `${p.name}: ₦${p.price}`));

// Find one by name
console.log(products.find((p) => p.name === "Scarf"));
```

Methods chain: `filter(...).map(...)` filters first, then transforms what is left.

## JSON: data as text

When a browser asks a server for data, or when you save data in the browser, it has to travel as **text**. The standard format is **JSON** (JavaScript Object Notation). It looks almost exactly like a JavaScript object, with two rules: **keys are in double quotes**, and there are no functions or comments.

```json
{"id": 7, "title": "Pay rent", "done": false, "tags": ["home", "money"]}
```

Two functions convert between JavaScript values and JSON text:

- `JSON.stringify(value)` turns a value into JSON text.
- `JSON.parse(text)` turns JSON text back into a value.

```live
=== js
const task = { id: 7, title: "Pay rent", done: false, tags: ["home", "money"] };

const text = JSON.stringify(task);
console.log(text);
console.log(typeof text);          // string

const back = JSON.parse(text);
console.log(back.title);
console.log(typeof back);          // object

console.log(JSON.stringify(task, null, 2));   // pretty-printed
```

You will use exactly this to talk to servers in lesson 18, and to store data in the browser.

## Try it

Work with a list of products. Use `filter`, `map` and `reduce`.

```webtask
{
  "id": "web-m15-t1",
  "minutes": 12,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "You use filter()", "in": "js", "pattern": "\\.filter\\(" },
    { "label": "You use reduce() to add up a total", "in": "js", "pattern": "\\.reduce\\(" },
    { "label": "It prints the names of the in-stock products under ₦10,000: Scarf and Basket", "output": "Scarf[\\s\\S]*Basket|Basket[\\s\\S]*Scarf" },
    { "label": "It does not print Necklace (it is out of stock)", "output": "(?<![\\s\\S])(?![\\s\\S]*Necklace)[\\s\\S]*\\S" },
    { "label": "It prints the total value of the in-stock products, 48000", "output": "\\b48,?000\\b" },
    { "label": "It prints the most expensive product, Sandals", "output": "Sandals" }
  ],
  "hint": "const cheapInStock = products.filter((p) => p.inStock && p.price < 10000).map((p) => p.name); const stockValue = products.filter((p) => p.inStock).reduce((sum, p) => sum + p.price, 0); const priciest = products.reduce((max, p) => (p.price > max.price ? p : max)); then console.log each result.",
  "height": 300
}
=== prompt
Using the `products` array: **1)** print the names of the products that are **in stock and cost under ₦10,000**; **2)** print the **total value of all the in-stock products**; **3)** print the **name of the most expensive product** (in stock or not). Use `filter`, `map` and `reduce`.
=== js
const products = [
  { name: "Ankara bag", price: 12000, inStock: true },
  { name: "Sandals", price: 18500, inStock: true },
  { name: "Necklace", price: 6000, inStock: false },
  { name: "Scarf", price: 8500, inStock: true },
  { name: "Basket", price: 9000, inStock: true },
];

// Write your code below
=== sample js
const products = [
  { name: "Ankara bag", price: 12000, inStock: true },
  { name: "Sandals", price: 18500, inStock: true },
  { name: "Necklace", price: 6000, inStock: false },
  { name: "Scarf", price: 8500, inStock: true },
  { name: "Basket", price: 9000, inStock: true },
];

const cheapInStock = products.filter((p) => p.inStock && p.price < 10000).map((p) => p.name);
console.log(cheapInStock);

const stockValue = products.filter((p) => p.inStock).reduce((sum, p) => sum + p.price, 0);
console.log(`Stock value: ₦${stockValue}`);

const priciest = products.reduce((max, p) => (p.price > max.price ? p : max));
console.log(priciest.name);
```

Now objects and JSON.

```webtask
{
  "id": "web-m15-t2",
  "minutes": 10,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "You create an object with name, age and a skills array", "in": "js", "pattern": "name\\s*:[\\s\\S]*age\\s*:[\\s\\S]*skills\\s*:\\s*\\[" },
    { "label": "It prints the second skill, CSS, by index", "output": "^CSS$" },
    { "label": "You add a city property, and the JSON text printed contains \"city\":\"Lagos\"", "output": "\"city\":\"Lagos\"" },
    { "label": "You use JSON.stringify", "in": "js", "pattern": "JSON\\.stringify\\(" },
    { "label": "You use JSON.parse and print the title from the text: Pay rent", "in": "js", "pattern": "JSON\\.parse\\(" },
    { "label": "It prints Pay rent", "output": "^Pay rent$" }
  ],
  "hint": "const student = { name: \"Ada\", age: 22, skills: [\"HTML\", \"CSS\"] }; console.log(student.skills[1]); student.city = \"Lagos\"; console.log(JSON.stringify(student)); const task = JSON.parse(text); console.log(task.title);",
  "height": 300
}
=== prompt
**1)** Create an object `student` with `name`, `age` and a `skills` array containing `"HTML"` and `"CSS"`. Print the **second skill**. **2)** Add a `city` property with the value `"Lagos"`, and print the object as JSON text with `JSON.stringify`. **3)** Parse the JSON text `text` below with `JSON.parse` and print its `title`.
=== js
const text = '{"id": 7, "title": "Pay rent", "done": false}';

// Write your code below
=== sample js
const text = '{"id": 7, "title": "Pay rent", "done": false}';

const student = { name: "Ada", age: 22, skills: ["HTML", "CSS"] };
console.log(student.skills[1]);

student.city = "Lagos";
console.log(JSON.stringify(student));

const task = JSON.parse(text);
console.log(task.title);
```

```answer
{
  "id": "web-m15-a1",
  "prompt": "What is the index of `\"Beans\"` in `[\"Rice\", \"Beans\", \"Yam\"]`? Type the number.",
  "answer": "1",
  "format": "number",
  "explanation": "Array positions start at 0, so Rice is 0, Beans is 1 and Yam is 2.",
  "required": true
}
```
$md$, true, true, 15, array['web-m15-a1', 'web-m15-t1', 'web-m15-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m16', 'web-development-for-beginners', 'The DOM: Changing a Page with JavaScript', 16, 'The DOM', 'DOM', array['Find elements with querySelector', 'Change text, classes and attributes', 'Create and remove elements', 'Build a page from data']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:js-the-dom', 'web-development-for-beginners', 'web-m16', 'js-the-dom', 'The DOM: Changing a Page with JavaScript', 'Learn how JavaScript sees a page as a tree of elements, and how to find elements, change their text, styles and classes, and create new ones. Build a live product list from data.', 35, $md$
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
$md$, true, true, 16, array['web-m16-a1', 'web-m16-t1', 'web-m16-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m17', 'web-development-for-beginners', 'Events and Forms', 17, 'JS Events', 'EVENTS', array['Listen for clicks, input and submit events', 'Read form values and validate with clear messages', 'Use event delegation', 'Build a counter, a toggle and a to-do list']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:js-events-forms', 'web-development-for-beginners', 'web-m17', 'js-events-forms', 'Events and Forms: Making Pages Interactive', 'Respond to clicks, typing and form submissions. Read what users enter, validate it with friendly messages, build a counter, a dark mode switch, a menu toggle and a to-do list, and keep the page accessible.', 40, $md$
## Events: things that happen on a page

A page is full of **events**: a click, a key press, text typed in a box, a form submitted, the mouse moving over something, the page finishing loading. JavaScript lets you **listen** for an event on an element and run a function when it happens.

```js
element.addEventListener("click", function () {
  // runs every time the element is clicked
});
```

The recipe is always the same three steps from the last lesson: **find** the element, **listen** for the event, **change** the page.

```live
=== html
<button id="order">Order now</button>
<p id="message">Nothing ordered yet.</p>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
button { background: #0f766e; color: white; border: 0; padding: 12px 24px; border-radius: 8px; font-size: 1rem; cursor: pointer; }
=== js
const button = document.querySelector("#order");
const message = document.querySelector("#message");

button.addEventListener("click", () => {
  message.textContent = "Thank you! Your bread is on the way.";
});
```

Click the button in the preview. The function you pass is called a **callback**: you hand it over and the browser calls it later, at the right moment.

### The event object

The browser gives your callback an **event object** with details about what happened. Its most useful parts are `event.target` (the element that was clicked) and `event.key` (the key pressed).

```live
=== html
<ul id="menu">
  <li>Jollof rice</li>
  <li>Fried rice</li>
  <li>Ofada rice</li>
</ul>
<p id="chosen">Click a dish.</p>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
li { cursor: pointer; padding: 6px; }
li:hover { background: #ccfbf1; }
=== js
const menu = document.querySelector("#menu");
const chosen = document.querySelector("#chosen");

menu.addEventListener("click", (event) => {
  chosen.textContent = `You picked: ${event.target.textContent}`;
});
```

Notice we listened on the **list**, not on every item. A click on an item **bubbles up** to its parent, so one listener handles any number of items, even ones added later. This is called **event delegation**, and it keeps code short and fast.

## The events you will use most

| Event | Fires when | Typical use |
| :-- | :-- | :-- |
| `click` | An element is clicked or tapped | Buttons, menus, cards |
| `input` | The value of a field changes, on every keystroke | Live search, character counters |
| `change` | A field is changed and then left | Dropdowns, checkboxes |
| `submit` | A form is submitted | Validate and send forms |
| `keydown` | A key is pressed | Shortcuts, pressing Enter |
| `mouseover` | The pointer enters an element | Hover effects (CSS does most) |
| `DOMContentLoaded` | The page's HTML is ready | Running setup code |

## A counter: state plus display

Most interactive things follow one pattern: keep the **state** (the data) in a variable, change it in an event handler, and then **update the display** from it.

```live
=== html
<p>Tickets: <strong id="count">0</strong></p>
<button id="minus">-</button>
<button id="plus">+</button>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; font-size: 1.2rem; }
button { width: 44px; height: 44px; font-size: 1.4rem; border-radius: 8px; border: 1px solid #0f766e; background: white; cursor: pointer; }
=== js
let count = 0;
const display = document.querySelector("#count");

function render() {
  display.textContent = count;
}

document.querySelector("#plus").addEventListener("click", () => {
  count++;
  render();
});

document.querySelector("#minus").addEventListener("click", () => {
  if (count > 0) count--;      // never below zero
  render();
});
```

## Forms: reading what the user typed

A text input has a `value`. To read it, use `input.value`. A checkbox has `checked` (true or false). For a form, listen for `submit` and call `event.preventDefault()` to stop the browser from reloading the page, so that **you** decide what happens.

```live
=== html
<form id="signup" novalidate>
  <p>
    <label for="name">Your name</label><br />
    <input id="name" name="name" type="text" />
  </p>
  <p>
    <label for="email">Email</label><br />
    <input id="email" name="email" type="email" />
  </p>
  <button type="submit">Join</button>
</form>
<p id="error" role="alert" style="color: #b91c1c"></p>
<p id="result"></p>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
input { padding: 8px; border: 1px solid #9ca3af; border-radius: 6px; }
button { background: #0f766e; color: white; border: 0; padding: 10px 22px; border-radius: 8px; cursor: pointer; }
=== js
const form = document.querySelector("#signup");
const error = document.querySelector("#error");
const result = document.querySelector("#result");

form.addEventListener("submit", (event) => {
  event.preventDefault();                  // do not reload the page
  error.textContent = "";
  result.textContent = "";

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();

  if (name === "") {
    error.textContent = "Please enter your name.";
    return;
  }
  if (!email.includes("@")) {
    error.textContent = "Please enter a valid email address.";
    return;
  }

  result.textContent = `Welcome, ${name}! We will email ${email}.`;
});
```

Try it with an empty name, then with `ada` as the email, then with correct values. Three habits make this a good form:

1. **`trim()`** the values, since people add spaces.
2. **Validate**, then show a **clear, specific message** next to the problem, not a mysterious "invalid".
3. Put the message in an element with `role="alert"`, so screen readers announce it.

> [!NOTE]
> JavaScript validation is for the visitor's **convenience**. It can be bypassed, so a real server must always check the data again. Never trust the browser alone for anything important.

### Live feedback with the input event

The `input` event fires on every keystroke. It is great for character counters and live search.

```live
=== html
<label for="bio">Your bio (max 80 characters)</label><br />
<textarea id="bio" rows="3" cols="40"></textarea>
<p id="left">80 characters left</p>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
.warn { color: #b91c1c; font-weight: bold; }
=== js
const bio = document.querySelector("#bio");
const left = document.querySelector("#left");
const MAX = 80;

bio.addEventListener("input", () => {
  const remaining = MAX - bio.value.length;
  left.textContent = `${remaining} characters left`;
  left.classList.toggle("warn", remaining < 10);
});
```

## Toggling: a dark mode switch and a menu

Two of the most common interactions are a switch that adds or removes a class.

```live
=== html
<button id="theme" aria-pressed="false">Dark mode</button>
<h2>Welcome</h2>
<p>This page can switch between light and dark.</p>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; background: white; color: #1f2937; transition: background 0.3s, color 0.3s; }
body.dark { background: #111827; color: #f3f4f6; }
button { padding: 10px 18px; border-radius: 8px; border: 1px solid currentColor; background: transparent; color: inherit; cursor: pointer; }
=== js
const button = document.querySelector("#theme");

button.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  button.setAttribute("aria-pressed", isDark);   // tell screen readers the state
});
```

`classList.toggle` returns whether the class is now on, which is handy for keeping `aria-pressed` correct. A menu that opens on small screens works the same way: a button toggles a class that shows or hides the links, and sets `aria-expanded`.

```live
{ "stack": true, "height": 260 }
=== html
<header class="bar">
  <strong>CloudTech</strong>
  <button id="menu-btn" aria-expanded="false" aria-controls="links">Menu</button>
  <nav id="links" class="links">
    <a href="#">Courses</a> <a href="#">Projects</a> <a href="#">About</a>
  </nav>
</header>
=== css
body { margin: 0; font-family: system-ui, sans-serif; }
.bar { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; padding: 12px 16px; background: #1f2937; color: white; }
.bar button { background: #0f766e; color: white; border: 0; padding: 8px 14px; border-radius: 6px; cursor: pointer; }
.links { display: none; width: 100%; padding-top: 10px; }
.links.open { display: block; }
.links a { color: #d1d5db; margin-right: 12px; }
=== js
const btn = document.querySelector("#menu-btn");
const links = document.querySelector("#links");

btn.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
});
```

## Keyboard events

```live
=== html
<p>Click here, then press any key. Press Escape to clear.</p>
<input id="box" placeholder="Type something, press Enter" />
<ul id="log"></ul>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
=== js
const box = document.querySelector("#box");
const log = document.querySelector("#log");

box.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && box.value.trim() !== "") {
    const li = document.createElement("li");
    li.textContent = box.value.trim();
    log.append(li);
    box.value = "";
  }
  if (event.key === "Escape") box.value = "";
});
```

## Putting it together: a to-do list

This small app combines everything: data in an array, a form, event delegation, and rendering from state. Read it slowly, because it is the pattern behind countless real applications.

```live
{ "stack": true, "height": 420 }
=== html
<h2>My tasks</h2>
<form id="form">
  <label for="task" class="sr">New task</label>
  <input id="task" placeholder="What needs doing?" />
  <button>Add</button>
</form>
<ul id="tasks"></ul>
<p id="summary"></p>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; max-width: 420px; }
.sr { position: absolute; left: -9999px; }
form { display: flex; gap: 8px; }
input { flex: 1; padding: 10px; border: 1px solid #9ca3af; border-radius: 8px; }
button { background: #0f766e; color: white; border: 0; padding: 10px 16px; border-radius: 8px; cursor: pointer; }
ul { list-style: none; padding: 0; }
li { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; cursor: pointer; }
li.done span { text-decoration: line-through; color: #9ca3af; }
li button { background: transparent; color: #b91c1c; padding: 0 6px; }
=== js
let tasks = [
  { id: 1, text: "Finish lesson 17", done: false },
  { id: 2, text: "Practise events", done: true },
];
let nextId = 3;

const list = document.querySelector("#tasks");
const summary = document.querySelector("#summary");

function render() {
  list.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.dataset.id = task.id;
    li.className = task.done ? "done" : "";

    const text = document.createElement("span");
    text.textContent = task.text;       // textContent: safe for user input

    const del = document.createElement("button");
    del.textContent = "x";
    del.setAttribute("aria-label", `Delete ${task.text}`);
    del.dataset.action = "delete";

    li.append(text, del);
    list.append(li);
  });
  const left = tasks.filter((t) => !t.done).length;
  summary.textContent = `${left} of ${tasks.length} tasks left`;
}

document.querySelector("#form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#task");
  const text = input.value.trim();
  if (text === "") return;
  tasks.push({ id: nextId++, text, done: false });
  input.value = "";
  render();
});

list.addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (!li) return;
  const id = Number(li.dataset.id);
  if (event.target.dataset.action === "delete") {
    tasks = tasks.filter((t) => t.id !== id);
  } else {
    const task = tasks.find((t) => t.id === id);
    task.done = !task.done;
  }
  render();
});

render();
```

Notice the **shape** of the app: the `tasks` array is the single source of truth, `render()` rebuilds the list from it, and each event handler only changes the data and calls `render()`. This is the idea behind frameworks like React, and you can build real software with this plain approach.

## Try it

Build a working counter. The buttons and display exist, and your job is to make them work.

```webtask
{
  "id": "web-m17-t1",
  "minutes": 12,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "The counter starts at 0", "selector": "#count", "contains": "^\\s*0\\s*$" },
    { "label": "Clicking + three times shows 3", "selector": "#count", "act": [{ "click": "#plus" }, { "click": "#plus" }, { "click": "#plus" }], "contains": "^\\s*3\\s*$" },
    { "label": "Clicking + twice and - once shows 1", "selector": "#count", "act": [{ "click": "#plus" }, { "click": "#plus" }, { "click": "#minus" }], "contains": "^\\s*1\\s*$" },
    { "label": "The counter never goes below 0", "selector": "#count", "act": [{ "click": "#minus" }, { "click": "#minus" }], "contains": "^\\s*0\\s*$" },
    { "label": "Clicking Reset after counting sets it back to 0", "selector": "#count", "act": [{ "click": "#plus" }, { "click": "#plus" }, { "click": "#reset" }], "contains": "^\\s*0\\s*$" },
    { "label": "You use addEventListener", "in": "js", "pattern": "addEventListener\\(\\s*[\"']click[\"']", "min": 2 }
  ],
  "hint": "let count = 0; const display = document.querySelector(\"#count\"); function render() { display.textContent = count; } document.querySelector(\"#plus\").addEventListener(\"click\", () => { count++; render(); }); For minus use if (count > 0) count--; and Reset sets count = 0.",
  "height": 300
}
=== prompt
Make the buttons work. `+` adds 1, `-` subtracts 1 but never goes below 0, and `Reset` sets the count back to 0. The number is shown in `#count`. Keep the count in a variable and update the display from it.
=== html
<p>Tickets: <strong id="count">0</strong></p>
<button id="minus">-</button>
<button id="plus">+</button>
<button id="reset">Reset</button>
=== css
body {
  font-family: system-ui, sans-serif;
  padding: 16px;
  font-size: 1.2rem;
}
button {
  min-width: 44px;
  height: 44px;
  margin-right: 6px;
  border-radius: 8px;
  cursor: pointer;
}
=== js
// Write your code here
=== sample js
let count = 0;
const display = document.querySelector("#count");

function render() {
  display.textContent = count;
}

document.querySelector("#plus").addEventListener("click", () => {
  count++;
  render();
});

document.querySelector("#minus").addEventListener("click", () => {
  if (count > 0) count--;
  render();
});

document.querySelector("#reset").addEventListener("click", () => {
  count = 0;
  render();
});
```

Now validate a form with clear messages.

```webtask
{
  "id": "web-m17-t2",
  "minutes": 15,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "An empty name shows an error that mentions the name", "selector": "#error", "act": [{ "type": ["#name", ""] }, { "type": ["#email", "ada@example.com"] }, { "submit": "#signup" }], "contains": "name" },
    { "label": "An email without @ shows an error that mentions the email", "selector": "#error", "act": [{ "type": ["#name", "Ada"] }, { "type": ["#email", "ada"] }, { "submit": "#signup" }], "contains": "email" },
    { "label": "Valid values show a welcome message with the name in #result", "selector": "#result", "act": [{ "type": ["#name", "Ada"] }, { "type": ["#email", "ada@example.com"] }, { "submit": "#signup" }], "contains": "Ada" },
    { "label": "With valid values the error message is empty", "selector": "#error:empty", "act": [{ "type": ["#name", "Ada"] }, { "type": ["#email", "ada@example.com"] }, { "submit": "#signup" }], "min": 1 },
    { "label": "You stop the page reloading with preventDefault", "in": "js", "pattern": "preventDefault\\(\\)" },
    { "label": "You trim the values", "in": "js", "pattern": "\\.trim\\(\\)" }
  ],
  "hint": "form.addEventListener(\"submit\", (event) => { event.preventDefault(); error.textContent = \"\"; result.textContent = \"\"; const name = nameInput.value.trim(); const email = emailInput.value.trim(); if (name === \"\") { error.textContent = \"Please enter your name.\"; return; } if (!email.includes(\"@\")) { error.textContent = \"Please enter a valid email.\"; return; } result.textContent = `Welcome, ${name}!`; });",
  "height": 340
}
=== prompt
Validate the sign-up form in JavaScript. On submit: stop the page reloading, trim both values, and clear any old messages. If the name is empty, put an error mentioning **name** in `#error`. If the email has no `@`, put an error mentioning **email** in `#error`. Otherwise show `Welcome, <name>!` in `#result` and leave `#error` empty.
=== html
<form id="signup" novalidate>
  <p>
    <label for="name">Name</label><br />
    <input id="name" type="text" />
  </p>
  <p>
    <label for="email">Email</label><br />
    <input id="email" type="email" />
  </p>
  <button type="submit">Join</button>
</form>
<p id="error" role="alert" style="color: #b91c1c"></p>
<p id="result"></p>
=== js
// Write your code here
=== sample js
const form = document.querySelector("#signup");
const error = document.querySelector("#error");
const result = document.querySelector("#result");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  error.textContent = "";
  result.textContent = "";

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();

  if (name === "") {
    error.textContent = "Please enter your name.";
    return;
  }
  if (!email.includes("@")) {
    error.textContent = "Please enter a valid email address.";
    return;
  }

  result.textContent = `Welcome, ${name}!`;
});
```

```answer
{
  "id": "web-m17-a1",
  "prompt": "Which method on the event object stops a form from reloading the page when it is submitted? Type the method name with brackets, like `name()`.",
  "answer": "preventDefault()",
  "format": "text",
  "accept": ["preventdefault", "event.preventDefault()", "event.preventDefault", "preventDefault"],
  "explanation": "event.preventDefault() cancels the browser's default action, so your own code decides what happens next.",
  "required": true
}
```
$md$, true, true, 17, array['web-m17-a1', 'web-m17-t1', 'web-m17-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m18', 'web-development-for-beginners', 'Fetch, Async Code and Local Storage', 18, 'Fetch and Storage', 'FETCHAPI', array['Use promises with async and await', 'Fetch JSON and check response.ok', 'Handle loading, error and empty states', 'Save data with localStorage']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:js-fetch-storage', 'web-development-for-beginners', 'web-m18', 'js-fetch-storage', 'Fetch, Async Code and Local Storage', 'Get live data from the internet with fetch, understand promises and async/await, handle loading, empty and error states properly, and remember things in the browser with localStorage.', 35, $md$
## Code that has to wait

Some things take time: downloading data from a server, waiting for a timer, reading a file. If JavaScript froze while waiting, the whole page would hang. So JavaScript starts these jobs, carries on with other work, and comes back when the result is ready. This is called **asynchronous** code.

You have already used the idea. Here a timer runs a function **later**, while the rest of the code does not wait:

```live
=== js
console.log("1. Start");

setTimeout(() => {
  console.log("3. This runs after one second");
}, 1000);

console.log("2. This runs immediately");
```

The output order is 1, 2, 3, not 1, 3, 2. `setInterval` is the same but repeats, for example every second for a clock.

## Promises and async/await

A **promise** is an object that stands for a result that will arrive later: "I promise to give you a value, or an error". Modern JavaScript lets you work with promises using two keywords that make the code read top to bottom:

- `async` before a function means "this function does waiting work".
- `await` inside it means "pause here until the promise has a result".

```live
=== js
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log("Cooking...");
  await wait(1000);          // pause here, but the page stays responsive
  console.log("Ready to serve!");
}

run();
```

## fetch: getting data from a server

`fetch(url)` asks a server for something and returns a promise. The pattern has three steps:

1. `await fetch(url)` gets the **response**.
2. Check `response.ok` to see if it worked (status 200 to 299).
3. `await response.json()` reads the body as JSON and turns it into a JavaScript value.

To keep these examples working without an internet connection, they fetch from a small piece of JSON built into the address (a `data:` URL). A real address works exactly the same way.

```live
=== js
const url = 'data:application/json,[{"name":"Rice","price":1500},{"name":"Beans","price":1200}]';

async function loadProducts() {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("The server said no");
  }
  const products = await response.json();
  console.log(products);
  console.log(`First product: ${products[0].name}`);
}

loadProducts();
```

## A real API

An **API** is a way for one program to ask another for data. Many are free. This one, from Open-Meteo, gives the current weather for any place using its latitude and longitude, and needs no account. Run it, and then try other coordinates. (Abuja is about 9.07, 7.40.)

```live
{ "title": "Needs internet: the weather in Lagos" }
=== html
<h2>Lagos weather</h2>
<p id="out">Loading...</p>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
=== js
async function showWeather() {
  const out = document.querySelector("#out");
  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=6.52&longitude=3.38&current_weather=true";
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    out.textContent = `It is ${data.current_weather.temperature}°C with wind at ${data.current_weather.windspeed} km/h.`;
  } catch (error) {
    out.textContent = "Could not load the weather. Check your connection.";
  }
}
showWeather();
```

## Handling errors: try, catch, finally

Networks fail. Servers go down. Data arrives in a shape you did not expect. A professional page **always** plans for failure, using `try` and `catch`:

```js
try {
  // code that might fail
} catch (error) {
  // runs only if something above threw an error
} finally {
  // runs either way, handy for hiding a loading spinner
}
```

> [!WARNING]
> `fetch` only fails (throws) when the **network** fails. A response such as 404 Not Found or 500 Server Error is **not** an exception, so you must check `response.ok` yourself.

## The three states of any data screen

Whenever a page shows data from somewhere else, design **three** states, not one:

| State | What the user sees |
| :-- | :-- |
| **Loading** | A message or spinner, so they know something is happening |
| **Error** | A clear message and, if possible, a way to try again |
| **Empty or success** | The data, or a friendly "nothing here yet" |

```live
{ "stack": true, "height": 340 }
=== html
<button id="good">Load products</button>
<button id="bad">Load broken data</button>
<p id="status" role="status"></p>
<ul id="items"></ul>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
button { padding: 8px 14px; border-radius: 8px; border: 1px solid #0f766e; background: white; cursor: pointer; margin-right: 6px; }
.error { color: #b91c1c; }
=== js
const GOOD = 'data:application/json,[{"name":"Rice","price":1500},{"name":"Beans","price":1200},{"name":"Yam","price":2500}]';
const BAD = 'data:application/json,{oops';

const status = document.querySelector("#status");
const items = document.querySelector("#items");

async function loadItems(url) {
  status.className = "";
  status.textContent = "Loading...";          // state 1: loading
  items.innerHTML = "";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Bad response");
    const data = await response.json();
    if (data.length === 0) {
      status.textContent = "Nothing here yet.";   // empty state
      return;
    }
    data.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name}: ₦${item.price}`;
      items.append(li);
    });
    status.textContent = `Loaded ${data.length} items`;   // success
  } catch (error) {
    status.className = "error";                           // state 2: error
    status.textContent = "Could not load items. Please try again.";
  }
}

document.querySelector("#good").addEventListener("click", () => loadItems(GOOD));
document.querySelector("#bad").addEventListener("click", () => loadItems(BAD));
```

Click both buttons. The broken data makes `response.json()` throw, and the `catch` turns that into a friendly message instead of a blank page and a console error.

## Sending data: POST requests

To **send** data, give `fetch` a second argument describing the request. You will use this when you build real applications:

```js
const response = await fetch("https://example.com/api/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ item: "Ankara bag", quantity: 2 }),
});
const result = await response.json();
```

The method is `POST`, the headers say the body is JSON, and the body is your data converted with `JSON.stringify`. (This example address does not exist, so it is shown rather than run.)

## localStorage: remembering things

`localStorage` lets a page save small pieces of text **in the visitor's browser**. The data stays even after they close the tab. It is perfect for settings (dark mode), a draft message, or a shopping cart. It stores only **strings**, so objects and arrays go through `JSON.stringify` and `JSON.parse`.

```live
=== js
localStorage.setItem("theme", "dark");
console.log(localStorage.getItem("theme"));        // dark
console.log(localStorage.getItem("nothing"));      // null: never saved

const cart = [{ item: "Rice", qty: 2 }];
localStorage.setItem("cart", JSON.stringify(cart));      // save an array as text

const saved = JSON.parse(localStorage.getItem("cart") || "[]");   // read it back safely
console.log(saved[0].item);

localStorage.removeItem("theme");
```

The `|| "[]"` is a safe default for the first visit, when nothing has been saved yet and `getItem` returns `null`.

> [!NOTE]
> In these lesson editors, `localStorage` is provided by the preview and lasts only until the preview reloads. On a real published site it persists, per website and per browser. Never store passwords or other secrets in it: any script on the page can read it.

A classic use is a dark mode that remembers your choice:

```live
=== html
<button id="theme">Toggle theme</button>
<p>Your choice is saved with localStorage.</p>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; background: white; color: #1f2937; }
body.dark { background: #111827; color: #f3f4f6; }
button { padding: 10px 18px; border-radius: 8px; cursor: pointer; }
=== js
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

document.querySelector("#theme").addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});
```

## Try it

Load data with fetch and handle success and failure.

```webtask
{
  "id": "web-m18-t1",
  "minutes": 15,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "You use async, await and fetch", "in": "js", "pattern": "async[\\s\\S]*await\\s+fetch\\(" },
    { "label": "You check response.ok", "in": "js", "pattern": "\\.ok\\b" },
    { "label": "You use try and catch to handle failure", "in": "js", "pattern": "try\\s*\\{[\\s\\S]*catch\\s*\\(" },
    { "label": "The list #items shows the three products as <li> elements", "selector": "#items li", "min": 3, "max": 3 },
    { "label": "The first item shows Rice and its price 1500", "selector": "#items li", "contains": "Rice.*1,?500" },
    { "label": "The status tells the user: Loaded 3 items", "selector": "#status", "contains": "Loaded 3 items" }
  ],
  "hint": "async function loadItems(url) { try { const response = await fetch(url); if (!response.ok) throw new Error(\"Bad response\"); const data = await response.json(); data.forEach((item) => { const li = document.createElement(\"li\"); li.textContent = `${item.name}: ₦${item.price}`; items.append(li); }); status.textContent = `Loaded ${data.length} items`; } catch (error) { status.textContent = \"Could not load items.\"; } } loadItems(GOOD);",
  "height": 320
}
=== prompt
Write `async function loadItems(url)`. Inside a `try`, `await fetch(url)`, check `response.ok`, parse the JSON, add an `<li>` for each item to `#items` with text like `Rice: ₦1500`, and set `#status` to `Loaded 3 items` (using the real count). In the `catch`, set `#status` to `Could not load items.`. Then call it with `GOOD`.
=== html
<p id="status" role="status">Loading...</p>
<ul id="items"></ul>
=== js
const GOOD = 'data:application/json,[{"name":"Rice","price":1500},{"name":"Beans","price":1200},{"name":"Yam","price":2500}]';
const BAD = 'data:application/json,{oops';

const status = document.querySelector("#status");
const items = document.querySelector("#items");

// Write loadItems below, and then call loadItems(GOOD)
=== sample js
const GOOD = 'data:application/json,[{"name":"Rice","price":1500},{"name":"Beans","price":1200},{"name":"Yam","price":2500}]';
const BAD = 'data:application/json,{oops';

const status = document.querySelector("#status");
const items = document.querySelector("#items");

async function loadItems(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Bad response");
    const data = await response.json();
    data.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name}: ₦${item.price}`;
      items.append(li);
    });
    status.textContent = `Loaded ${data.length} items`;
  } catch (error) {
    status.textContent = "Could not load items.";
  }
}

loadItems(GOOD);
=== note
Try changing the last line to `loadItems(BAD)` and see the error message appear. A page that handles failure kindly is a page people trust.
```

Now remember data between visits with localStorage.

```webtask
{
  "id": "web-m18-t2",
  "minutes": 8,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "You save the tasks array under the key \"tasks\" with JSON.stringify", "in": "js", "pattern": "localStorage\\.setItem\\(\\s*[\"']tasks[\"']\\s*,\\s*JSON\\.stringify\\(" },
    { "label": "You read it back with getItem and JSON.parse", "in": "js", "pattern": "JSON\\.parse\\(\\s*localStorage\\.getItem\\(\\s*[\"']tasks[\"']" },
    { "label": "It prints how many tasks were loaded: 2", "output": "^2$" },
    { "label": "It prints the first task's text: Pay rent", "output": "^Pay rent$" },
    { "label": "It prints the number of tasks that are done: 1", "output": "^Done: 1$" }
  ],
  "hint": "localStorage.setItem(\"tasks\", JSON.stringify(tasks)); const loaded = JSON.parse(localStorage.getItem(\"tasks\") || \"[]\"); console.log(loaded.length); console.log(loaded[0].text); console.log(`Done: ${loaded.filter((t) => t.done).length}`);",
  "height": 280
}
=== prompt
Save the `tasks` array in `localStorage` under the key `tasks`, then load it back (use `|| "[]"` as a safe default). Print: **1)** how many tasks you loaded, **2)** the text of the first task, **3)** `Done: ` followed by how many tasks are done.
=== js
const tasks = [
  { text: "Pay rent", done: false },
  { text: "Buy data", done: true },
];

// Write your code below
=== sample js
const tasks = [
  { text: "Pay rent", done: false },
  { text: "Buy data", done: true },
];

localStorage.setItem("tasks", JSON.stringify(tasks));

const loaded = JSON.parse(localStorage.getItem("tasks") || "[]");
console.log(loaded.length);
console.log(loaded[0].text);
console.log(`Done: ${loaded.filter((t) => t.done).length}`);
```

```answer
{
  "id": "web-m18-a1",
  "prompt": "`fetch` returns a response for a page that does not exist (a 404). Which property tells you if the request succeeded? Type its name, like `response.status`.",
  "answer": "response.ok",
  "format": "text",
  "accept": ["ok", ".ok", "response.ok"],
  "explanation": "fetch only throws on network failure. A 404 or 500 still gives a response, so you must check response.ok yourself.",
  "required": true
}
```
$md$, true, true, 18, array['web-m18-a1', 'web-m18-t1', 'web-m18-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m19', 'web-development-for-beginners', 'Bootstrap: Setup, the Grid and Utilities', 19, 'Bootstrap Grid', 'BSGRID', array['Add Bootstrap to a page', 'Build responsive layouts with the 12-column grid', 'Style with spacing, colour, text and flex utilities', 'Customise Bootstrap with CSS variables']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:bootstrap-grid-utilities', 'web-development-for-beginners', 'web-m19', 'bootstrap-grid-utilities', 'Bootstrap 5: Setup, the Grid and Utilities', 'Meet Bootstrap, the world''s most popular CSS framework. Add it to a page, lay out content with its 12-column responsive grid, and style quickly with utility classes for spacing, colour, text and flexbox.', 35, $md$
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
$md$, true, true, 19, array['web-m19-a1', 'web-m19-t1', 'web-m19-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m20', 'web-development-for-beginners', 'Bootstrap Components', 20, 'Bootstrap Components', 'BSCOMP', array['Build a responsive navbar', 'Use cards, alerts, buttons and forms', 'Add modals and accordions with data attributes', 'Read the Bootstrap documentation']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:bootstrap-components', 'web-development-for-beginners', 'web-m20', 'bootstrap-components', 'Bootstrap Components: Navbar, Cards, Forms, Modals and More', 'Use Bootstrap''s ready-made components to build real interfaces fast. Build a responsive navbar, cards, alerts, forms with validation, an accordion and a modal, and learn to read the Bootstrap documentation.', 40, $md$
## Components: pre-built pieces

In the last lesson you used Bootstrap's grid and utilities. Its **components** are bigger pre-built pieces of interface: a navigation bar, a card, a modal dialog, an accordion. Each is a pattern of HTML with the right class names. You do not need to memorise them. Professional developers keep the **documentation** open at **getbootstrap.com/docs** and copy the example for the component they need, then change the words.

Learning to read that documentation is the real skill, so each component below shows the pattern, and you should open the docs and find the same one.

## Buttons

```live
{ "bootstrap": true, "height": 280 }
=== html
<div class="container py-3">
  <p>
    <button class="btn btn-primary">Primary</button>
    <button class="btn btn-secondary">Secondary</button>
    <button class="btn btn-success">Success</button>
    <button class="btn btn-danger">Danger</button>
    <button class="btn btn-warning">Warning</button>
    <button class="btn btn-light border">Light</button>
  </p>
  <p>
    <button class="btn btn-outline-primary">Outline</button>
    <button class="btn btn-primary btn-sm">Small</button>
    <button class="btn btn-primary btn-lg">Large</button>
    <button class="btn btn-primary" disabled>Disabled</button>
  </p>
  <div class="d-grid gap-2"><button class="btn btn-success">Full width (d-grid)</button></div>
</div>
```

Always begin with `btn`, then add a colour class. Use `<button>` for actions and `<a class="btn">` for links that look like buttons.

## Alerts, badges and spinners

```live
{ "bootstrap": true, "height": 330 }
=== html
<div class="container py-3">
  <div class="alert alert-success" role="alert">Your order was placed successfully.</div>
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    Payment failed. Please try again.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  <p>
    Inbox <span class="badge text-bg-danger">4</span>
    <span class="badge rounded-pill text-bg-success">New</span>
  </p>
  <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>
  <div class="progress mt-3" role="progressbar" aria-label="Course progress" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">
    <div class="progress-bar bg-success" style="width: 65%">65%</div>
  </div>
</div>
```

Click the **x** on the red alert. It disappears, because `data-bs-dismiss="alert"` is wired up by Bootstrap's JavaScript. Notice the `visually-hidden` text, which lets screen readers hear what a spinner means. Bootstrap builds accessibility into its patterns, so keep those attributes.

## Cards

A card is a flexible box for a piece of content: a product, a course, a profile.

```live
{ "bootstrap": true, "stack": true, "height": 360 }
=== html
<div class="container py-3">
  <div class="row row-cols-1 row-cols-md-3 g-3">
    <div class="col">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Excel for Data Analysis</h5>
          <p class="card-text">Formulas, pivot tables and charts, with practice in your browser.</p>
        </div>
        <div class="card-footer bg-transparent border-0">
          <a href="#" class="btn btn-primary">Start free</a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">SQL for Data Analysis</h5>
          <p class="card-text">Write real queries and get instant feedback.</p>
        </div>
        <div class="card-footer bg-transparent border-0">
          <a href="#" class="btn btn-primary">Start free</a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Python for Beginners</h5>
          <p class="card-text">Your first lines of code, step by step.</p>
        </div>
        <div class="card-footer bg-transparent border-0">
          <a href="#" class="btn btn-primary">Start free</a>
        </div>
      </div>
    </div>
  </div>
</div>
```

`h-100` makes the cards in a row the same height. The `row-cols-*` classes put them in a responsive grid, using the lesson 19 skills.

## The navbar

The navbar is the most complicated component and the one you will use on almost every site. It collapses into a **hamburger button** on small screens, using Bootstrap's JavaScript. Study its structure, then use the **Phone** and **Desktop** preview buttons to see it change. On the phone, click the hamburger button.

```live
{ "bootstrap": true, "stack": true, "height": 300 }
=== html
<nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
  <div class="container">
    <a class="navbar-brand fw-bold" href="#">CloudTech</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="mainNav">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link active" aria-current="page" href="#">Courses</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Projects</a></li>
        <li class="nav-item"><a class="nav-link" href="#">About</a></li>
      </ul>
      <a class="btn btn-success" href="#">Sign up</a>
    </div>
  </div>
</nav>
<main class="container py-4"><h1>Page content</h1></main>
```

How it works:

- `navbar-expand-lg` means "show the full menu from the `lg` breakpoint upwards, and collapse it below".
- The **toggler** button has `data-bs-toggle="collapse"` and `data-bs-target="#mainNav"`, which points to the `id` of the part that opens and closes.
- The collapsing part has the classes `collapse navbar-collapse` and that `id`.

Two ids must match exactly: `data-bs-target="#mainNav"` and `id="mainNav"`. If they do not, the button does nothing, and that is the most common Bootstrap bug.

## Forms

Bootstrap makes forms look good with a few classes: `form-label`, `form-control`, `form-select`, `form-check`. Inputs are connected to labels exactly as in lesson 4.

```live
{ "bootstrap": true, "stack": true, "height": 480 }
=== html
<div class="container py-3" style="max-width: 480px">
  <form class="needs-validation" novalidate>
    <div class="mb-3">
      <label for="name" class="form-label">Full name</label>
      <input type="text" class="form-control" id="name" required />
      <div class="invalid-feedback">Please enter your name.</div>
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input type="email" class="form-control" id="email" placeholder="name@example.com" required />
      <div class="invalid-feedback">Please enter a valid email.</div>
    </div>
    <div class="mb-3">
      <label for="track" class="form-label">Track</label>
      <select class="form-select" id="track">
        <option>Data analysis</option>
        <option>Web development</option>
        <option>Business</option>
      </select>
    </div>
    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" id="agree" required />
      <label class="form-check-label" for="agree">I agree to the terms</label>
    </div>
    <div class="input-group mb-3">
      <span class="input-group-text">₦</span>
      <input type="number" class="form-control" aria-label="Amount" placeholder="Budget" />
    </div>
    <button class="btn btn-primary w-100" type="submit">Register</button>
  </form>
</div>
=== js
document.querySelectorAll(".needs-validation").forEach((form) => {
  form.addEventListener("submit", (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add("was-validated");   // shows green or red feedback on each field
  });
});
```

Press **Register** with the form empty. Bootstrap's `was-validated` class (added by the small script) makes the invalid fields red, and the `invalid-feedback` text appears under them. This combines HTML's built-in validation from lesson 4 with Bootstrap styling.

## Accordion and modal

An **accordion** shows one panel at a time. A **modal** is a dialog that appears over the page. Both are driven by `data-bs-*` attributes, so you write no JavaScript.

```live
{ "bootstrap": true, "stack": true, "height": 400 }
=== html
<div class="container py-3">
  <div class="accordion" id="faq">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#q1" aria-expanded="true" aria-controls="q1">How do I pay?</button>
      </h2>
      <div id="q1" class="accordion-collapse collapse show" data-bs-parent="#faq">
        <div class="accordion-body">By bank transfer. Upload your receipt and we confirm within a day.</div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#q2" aria-expanded="false" aria-controls="q2">Can I learn on my phone?</button>
      </h2>
      <div id="q2" class="accordion-collapse collapse" data-bs-parent="#faq">
        <div class="accordion-body">Yes. Every lesson works in a phone browser.</div>
      </div>
    </div>
  </div>

  <button type="button" class="btn btn-primary mt-4" data-bs-toggle="modal" data-bs-target="#orderModal">Place order</button>

  <div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="orderTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="orderTitle">Confirm your order</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">Two plates of jollof rice, delivered to Yaba. Total ₦6,000.</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-success" data-bs-dismiss="modal">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

The pattern for a modal is always a **trigger** with `data-bs-toggle="modal" data-bs-target="#id"`, and a `.modal` with that same `id`. Other components follow the same idea: tabs, dropdowns, carousels, tooltips and offcanvas menus.

## Other components worth knowing

| Component | Class | Good for |
| :-- | :-- | :-- |
| List group | `list-group` | Menus, settings, simple lists |
| Breadcrumb | `breadcrumb` | Showing where you are in a site |
| Pagination | `pagination` | Moving through pages of results |
| Dropdown | `dropdown` | A menu opened from a button |
| Carousel | `carousel` | A slideshow of images |
| Tabs and pills | `nav nav-tabs` | Switching between content panels |
| Offcanvas | `offcanvas` | A sliding side panel |
| Toast | `toast` | A small temporary notification |

For any of them: open the Bootstrap docs, find the component, copy the example, and change the text.

## When to use Bootstrap, and when not

Use Bootstrap when you need a consistent, responsive interface **quickly**: dashboards, admin pages, prototypes, internal tools, small business sites. Consider your own CSS (or a lighter tool) when a unique brand look is the goal, or when page speed is critical and you would load a lot of unused CSS. Many professionals use both: Bootstrap as a base and custom CSS to make it theirs.

## Try it

Build a responsive navbar. It must collapse on a phone and spread out on a laptop.

```webtask
{
  "id": "web-m20-t1",
  "minutes": 15,
  "required": true,
  "bootstrap": true,
  "stack": true,
  "height": 300,
  "tabs": ["html"],
  "rules": [
    { "label": "It is a <nav class=\"navbar navbar-expand-lg\"> with a .navbar-brand", "selector": "nav.navbar.navbar-expand-lg .navbar-brand", "min": 1, "contains": "[A-Za-z]{2,}" },
    { "label": "At least three .nav-link links in a .navbar-nav", "selector": ".navbar-nav .nav-link", "min": 3 },
    { "label": "There is a toggler button with data-bs-toggle=\"collapse\"", "selector": "button.navbar-toggler[data-bs-toggle='collapse']", "min": 1 },
    { "label": "The toggler's data-bs-target matches the id of the collapsing part", "in": "html", "pattern": "data-bs-target=[\"']#(\\w+)[\"'][\\s\\S]*?\\bid=[\"']\\1[\"']" },
    { "label": "On a phone (400px) the menu is hidden behind the toggler", "selector": ".navbar-collapse", "at": 400, "style": { "display": "none" } },
    { "label": "On a laptop (1000px) the menu is shown in a row", "selector": ".navbar-collapse", "at": 1000, "style": { "display": "flex" } },
    { "label": "Clicking the toggler on a phone starts opening the menu", "selector": ".navbar-collapse.collapsing, .navbar-collapse.show", "at": 400, "act": [{ "click": ".navbar-toggler" }], "min": 1 }
  ],
  "hint": "<nav class=\"navbar navbar-expand-lg bg-dark\" data-bs-theme=\"dark\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#\">Brand</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\" aria-controls=\"mainNav\" aria-expanded=\"false\" aria-label=\"Toggle navigation\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse\" id=\"mainNav\"><ul class=\"navbar-nav\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#\">Home</a></li>...</ul></div></div></nav>"
}
=== prompt
Build a responsive Bootstrap navbar: `<nav class="navbar navbar-expand-lg bg-dark">` with a `navbar-brand` (your business name), a **toggler button** (`navbar-toggler`, `data-bs-toggle="collapse"`, `data-bs-target="#mainNav"`), and a `div.collapse.navbar-collapse#mainNav` holding a `ul.navbar-nav` with **at least three** `nav-link` links. Use the preview's **Phone** and **Desktop** buttons to check it.
=== html
<nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">

</nav>
=== sample html
<nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
  <div class="container">
    <a class="navbar-brand" href="#">Naija Eats</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="mainNav">
      <ul class="navbar-nav me-auto">
        <li class="nav-item"><a class="nav-link active" href="#">Menu</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Offers</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
      </ul>
    </div>
  </div>
</nav>
```

Now a card with a modal.

```webtask
{
  "id": "web-m20-t2",
  "minutes": 12,
  "required": true,
  "bootstrap": true,
  "stack": true,
  "height": 320,
  "tabs": ["html"],
  "rules": [
    { "label": "A .card with a .card-body, a .card-title and .card-text", "selector": ".card .card-body .card-title", "min": 1, "contains": "[A-Za-z]{2,}" },
    { "label": "The card has a text paragraph (.card-text)", "selector": ".card .card-text", "min": 1 },
    { "label": "A button opens a modal: data-bs-toggle=\"modal\" with a data-bs-target", "selector": "[data-bs-toggle='modal'][data-bs-target]", "min": 1 },
    { "label": "The modal's id matches the button's target", "in": "html", "pattern": "data-bs-target=[\"']#(\\w+)[\"'][\\s\\S]*?\\bid=[\"']\\1[\"']" },
    { "label": "The modal has a title (.modal-title), a body (.modal-body) and a dismiss button (data-bs-dismiss=\"modal\")", "selector": ".modal .modal-title, .modal .modal-body, .modal [data-bs-dismiss='modal']", "min": 3 },
    { "label": "The card uses utility classes: a shadow and the .h-100 or .mb-3 spacing", "in": "html", "pattern": "class=\"card[^\"]*\\bshadow" }
  ],
  "hint": "<div class=\"card shadow-sm\" style=...><div class=\"card-body\"><h5 class=\"card-title\">...</h5><p class=\"card-text\">...</p><button class=\"btn btn-primary\" data-bs-toggle=\"modal\" data-bs-target=\"#detailsModal\">Details</button></div></div> and then a div.modal.fade#detailsModal with .modal-dialog > .modal-content > .modal-header/.modal-body."
}
=== prompt
Build a **course card** (`.card` with `.shadow-sm`, a `.card-body`, `.card-title`, `.card-text` and a button) where the button opens a **modal** with more details. The button needs `data-bs-toggle="modal"` and `data-bs-target="#detailsModal"`, and the modal is a `div.modal.fade` with `id="detailsModal"`, a `.modal-title`, a `.modal-body` and a button with `data-bs-dismiss="modal"`.
=== html
<div class="container py-4" >

</div>
=== sample html
<div class="container py-4">
  <div class="card shadow-sm" style="max-width: 20rem">
    <div class="card-body">
      <h5 class="card-title">Web Development</h5>
      <p class="card-text">HTML, CSS, JavaScript and Bootstrap, with a live editor.</p>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#detailsModal">Details</button>
    </div>
  </div>

  <div class="modal fade" id="detailsModal" tabindex="-1" aria-labelledby="detailsTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="detailsTitle">Course details</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">22 lessons, practised in your browser, with a badge for every module.</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

```answer
{
  "id": "web-m20-a1",
  "prompt": "A Bootstrap navbar toggler has `data-bs-target=\"#mainNav\"`. What must the collapsing part of the navbar have so the button works? Type the attribute and value, like `class=\"x\"`.",
  "answer": "id=\"mainNav\"",
  "format": "text",
  "accept": ["id=mainNav", "id='mainNav'", "id mainNav", "id=\"mainnav\"", "an id of mainNav"],
  "explanation": "The target is an id selector (#mainNav), so the collapsing element needs id=\"mainNav\". If they do not match, the button does nothing.",
  "required": true
}
```
$md$, true, true, 20, array['web-m20-a1', 'web-m20-t1', 'web-m20-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m21', 'web-development-for-beginners', 'Build a Complete Website with Bootstrap', 21, 'Landing Page', 'BSSITE', array['Plan the sections of a landing page', 'Build a hero, service cards, form and footer', 'Add custom CSS and JavaScript on top of Bootstrap', 'Make the page accessible and mobile friendly']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:bootstrap-landing-page', 'web-development-for-beginners', 'web-m21', 'bootstrap-landing-page', 'Build a Complete Website with Bootstrap', 'Put everything together. Plan and build a full, responsive, accessible landing page for a business, section by section, with Bootstrap and a little custom CSS and JavaScript, ready to publish.', 40, $md$
## What you are going to build

Time to combine HTML, CSS, JavaScript and Bootstrap into one real project. You will build the **landing page of a small business**: a single page that makes a good first impression and gets visitors to act, whether that is to call, order or sign up. Sites like this are what small businesses in Lagos, Abuja and everywhere pay developers to build, and it is a strong piece for your portfolio.

We will build **Naija Eats**, a food delivery business. When you do your own in the tasks, choose any business you like: a salon, a tailor, a school, a tutor, a phone repair shop.

## Step 0: plan before you code

Professionals sketch before they type. A landing page usually has these sections, in this order:

| Section | Job |
| :-- | :-- |
| **Navbar** | Let people jump around, with the business name |
| **Hero** | One clear promise and one main button (the **call to action**) |
| **Services or menu** | What you offer, as cards |
| **About or why us** | Build trust in a few sentences |
| **Contact form** | An easy way to get in touch |
| **Footer** | Address, hours, social links, copyright |

Write down, in one sentence each: **Who is this for? What do they want? What is the one thing I want them to do?** For Naija Eats: *busy people in Lagos want good food delivered fast, and we want them to order.* Every section should help with that.

## Step 1: the skeleton and the navbar

Start with the full document, with Bootstrap linked, and the navbar from the last lesson. Because the page is one long page, the links jump to sections with ids, which you learned in lesson 2.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Naija Eats | Fast Food Delivery in Lagos</title>
    <meta name="description" content="Order fresh jollof rice, fried rice and more. Fast delivery across Lagos." />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <!-- navbar, sections and footer go here -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
  </body>
</html>
```

Notice the order: Bootstrap's CSS first, **then your own `style.css`**, so your rules can override Bootstrap's. Scripts go last, Bootstrap's before yours.

## Step 2: the hero

The hero is the first thing visitors see. It needs a short headline, one sentence of support, and a button. Utilities handle most of the layout.

```live
{ "bootstrap": true, "stack": true, "height": 360 }
=== html
<nav class="navbar navbar-expand-lg bg-dark sticky-top" data-bs-theme="dark">
  <div class="container">
    <a class="navbar-brand fw-bold" href="#home">Naija Eats</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="nav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="#menu">Menu</a></li>
        <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
        <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
      </ul>
    </div>
  </div>
</nav>

<header id="home" class="hero text-center text-white py-5">
  <div class="container py-4">
    <h1 class="display-4 fw-bold">Hot jollof, delivered fast.</h1>
    <p class="lead mb-4">Fresh Nigerian meals to your door in Lagos, every day until 10 pm.</p>
    <a href="#menu" class="btn btn-warning btn-lg px-4">See the menu</a>
  </div>
</header>
=== css
.hero {
  background: linear-gradient(135deg, #0f766e, #134e4a);
}
```

`display-4` is Bootstrap's big heading style, and `lead` makes the intro paragraph larger. The `.hero` rule is the only custom CSS, a gradient background.

## Step 3: services as cards

Cards in a responsive grid, the pattern from the last lesson. Each one has an image area, a title, a line of text and a price.

```live
{ "bootstrap": true, "stack": true, "height": 380 }
=== html
<section id="menu" class="py-5">
  <div class="container">
    <h2 class="text-center fw-bold mb-4">Our menu</h2>
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h3 class="h5 card-title">Party jollof</h3>
            <p class="card-text">Smoky firewood-style jollof with chicken and plantain.</p>
          </div>
          <div class="card-footer bg-transparent border-0 fw-bold text-success">₦3,000</div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h3 class="h5 card-title">Fried rice</h3>
            <p class="card-text">Rice with vegetables and prawns, served hot.</p>
          </div>
          <div class="card-footer bg-transparent border-0 fw-bold text-success">₦2,800</div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h3 class="h5 card-title">Amala and ewedu</h3>
            <p class="card-text">Soft amala with ewedu, gbegiri and assorted meat.</p>
          </div>
          <div class="card-footer bg-transparent border-0 fw-bold text-success">₦2,500</div>
        </div>
      </div>
    </div>
  </div>
</section>
```

Notice `class="h5 card-title"` on an `<h3>`. The **heading level** (h3) should follow the page outline (h1, then h2, then h3) for accessibility and SEO, while `h5` only controls the **size**. This is the correct way to separate meaning from looks.

## Step 4: about and trust

A short section that says why people can trust you. Use real facts only: how long you have operated, where you are, what you promise. Do not invent reviews or numbers.

```live
{ "bootstrap": true, "stack": true, "height": 260 }
=== html
<section id="about" class="py-5 bg-light">
  <div class="container">
    <div class="row align-items-center g-4">
      <div class="col-md-6">
        <h2 class="fw-bold">Cooked fresh, every order</h2>
        <p class="text-muted">We cook each meal when you order it, with ingredients bought the same morning, and we deliver in under 45 minutes across Lagos Island and the Mainland.</p>
        <ul class="list-unstyled">
          <li class="mb-1">✔ No reheated food</li>
          <li class="mb-1">✔ Pay online or on delivery</li>
          <li>✔ Hot meals or your money back</li>
        </ul>
      </div>
      <div class="col-md-6">
        <div class="ratio ratio-16x9 rounded-3 overflow-hidden bg-success-subtle d-flex align-items-center justify-content-center fw-bold">Your photo goes here</div>
      </div>
    </div>
  </div>
</section>
```

`ratio ratio-16x9` keeps a box in a 16:9 shape on every screen, which is perfect for photos and videos. When you add a real image, give it good `alt` text and the `img-fluid` class so that it scales.

## Step 5: the contact form

A short form, labelled properly, validated by the browser, with a message from your own JavaScript when it is submitted.

```live
{ "bootstrap": true, "stack": true, "height": 470 }
=== html
<section id="contact" class="py-5">
  <div class="container" style="max-width: 560px">
    <h2 class="fw-bold text-center mb-4">Place an order</h2>
    <form id="order-form" class="needs-validation" novalidate>
      <div class="mb-3">
        <label for="name" class="form-label">Your name</label>
        <input id="name" class="form-control" required />
        <div class="invalid-feedback">Please tell us your name.</div>
      </div>
      <div class="mb-3">
        <label for="phone" class="form-label">Phone number</label>
        <input id="phone" type="tel" class="form-control" pattern="[0-9]{11}" placeholder="08012345678" required />
        <div class="invalid-feedback">Enter an 11-digit phone number.</div>
      </div>
      <div class="mb-3">
        <label for="dish" class="form-label">What would you like?</label>
        <select id="dish" class="form-select" required>
          <option value="">Choose a dish</option>
          <option>Party jollof</option>
          <option>Fried rice</option>
          <option>Amala and ewedu</option>
        </select>
        <div class="invalid-feedback">Please choose a dish.</div>
      </div>
      <button class="btn btn-success w-100" type="submit">Order now</button>
    </form>
    <div id="thanks" class="alert alert-success mt-3 d-none" role="status"></div>
  </div>
</section>
=== js
const form = document.querySelector("#order-form");
const thanks = document.querySelector("#thanks");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  form.classList.add("was-validated");
  if (!form.checkValidity()) return;

  const name = document.querySelector("#name").value.trim();
  const dish = document.querySelector("#dish").value;
  thanks.textContent = `Thank you, ${name}! We are preparing your ${dish}.`;
  thanks.classList.remove("d-none");
  form.reset();
  form.classList.remove("was-validated");
});
```

(A real site sends the order to a server, or opens WhatsApp with the order text, which is a common and simple choice for small businesses: a link like `https://wa.me/2348012345678?text=I%20would%20like%20to%20order`.)

## Step 6: footer and finishing touches

```live
{ "bootstrap": true, "height": 220 }
=== html
<footer class="bg-dark text-white-50 py-4 mt-4">
  <div class="container d-flex flex-column flex-md-row justify-content-between gap-2">
    <span>Naija Eats, 12 Admiralty Way, Lekki, Lagos</span>
    <span>Open daily, 10 am to 10 pm</span>
    <span>&copy; 2026 Naija Eats</span>
  </div>
</footer>
```

Finishing touches that separate a good page from a great one:

- **`scroll-behavior: smooth;`** on `html` in your CSS, so that links glide to their sections.
- **Spacing:** use the same vertical padding (`py-5`) for sections so the page has a steady rhythm.
- **Images:** add `alt` text to every image, and compress them. A 5 MB hero photo ruins mobile load time.
- **Contrast:** check text on coloured backgrounds, especially white on yellow.
- **Test:** open it on a real phone and click everything.

## The complete page

Here is the whole thing together, as one document. Read through it, run it, change the business name, colours and text to your own, and make it yours. This is the shape of the page you will build in the task.

```live
{ "bootstrap": true, "stack": true, "height": 520 }
=== html
<nav class="navbar navbar-expand-lg bg-dark sticky-top" data-bs-theme="dark">
  <div class="container">
    <a class="navbar-brand fw-bold" href="#home">Naija Eats</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="nav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="#menu">Menu</a></li>
        <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
        <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
      </ul>
    </div>
  </div>
</nav>

<header id="home" class="hero text-center text-white py-5">
  <div class="container py-4">
    <h1 class="display-4 fw-bold">Hot jollof, delivered fast.</h1>
    <p class="lead mb-4">Fresh Nigerian meals to your door in Lagos.</p>
    <a href="#menu" class="btn btn-warning btn-lg px-4">See the menu</a>
  </div>
</header>

<main>
  <section id="menu" class="py-5">
    <div class="container">
      <h2 class="text-center fw-bold mb-4">Our menu</h2>
      <div class="row row-cols-1 row-cols-md-3 g-4">
        <div class="col"><div class="card h-100 shadow-sm"><div class="card-body"><h3 class="h5 card-title">Party jollof</h3><p class="card-text">Smoky jollof with chicken and plantain.</p></div><div class="card-footer bg-transparent border-0 fw-bold text-success">₦3,000</div></div></div>
        <div class="col"><div class="card h-100 shadow-sm"><div class="card-body"><h3 class="h5 card-title">Fried rice</h3><p class="card-text">Rice with vegetables and prawns.</p></div><div class="card-footer bg-transparent border-0 fw-bold text-success">₦2,800</div></div></div>
        <div class="col"><div class="card h-100 shadow-sm"><div class="card-body"><h3 class="h5 card-title">Amala and ewedu</h3><p class="card-text">Soft amala with ewedu and gbegiri.</p></div><div class="card-footer bg-transparent border-0 fw-bold text-success">₦2,500</div></div></div>
      </div>
    </div>
  </section>

  <section id="about" class="py-5 bg-light">
    <div class="container">
      <h2 class="fw-bold">Cooked fresh, every order</h2>
      <p class="text-muted mb-0">Each meal is cooked when you order it and delivered in under 45 minutes.</p>
    </div>
  </section>

  <section id="contact" class="py-5">
    <div class="container" style="max-width: 520px">
      <h2 class="fw-bold text-center mb-3">Place an order</h2>
      <form>
        <div class="mb-3"><label for="n" class="form-label">Your name</label><input id="n" class="form-control" /></div>
        <div class="mb-3"><label for="p" class="form-label">Phone</label><input id="p" type="tel" class="form-control" /></div>
        <button class="btn btn-success w-100" type="submit">Order now</button>
      </form>
    </div>
  </section>
</main>

<footer class="bg-dark text-white-50 py-4">
  <div class="container text-center">&copy; 2026 Naija Eats, Lekki, Lagos</div>
</footer>
=== css
html { scroll-behavior: smooth; }
.hero { background: linear-gradient(135deg, #0f766e, #134e4a); }
.card { transition: transform 0.2s ease; }
.card:hover { transform: translateY(-4px); }
```

## Try it

Build the landing page for **your own** business idea. It should have a responsive Bootstrap navbar, a hero with a call to action, at least three service cards, a labelled contact form and a footer, and it must be accessible and mobile friendly.

```webtask
{
  "id": "web-m21-t1",
  "minutes": 25,
  "required": true,
  "bootstrap": true,
  "stack": true,
  "height": 480,
  "tabs": ["html", "css"],
  "rules": [
    { "label": "Page information: lang, a descriptive <title> (at least 15 characters) and the viewport tag", "in": "html", "pattern": "<html[^>]*\\blang=[\\s\\S]*<title>[^<]{15,}</title>[\\s\\S]*name=[\"']viewport|<html[^>]*\\blang=[\\s\\S]*name=[\"']viewport[\\s\\S]*<title>[^<]{15,}</title>" },
    { "label": "A responsive navbar with a brand, a toggler and at least three .nav-link links", "selector": "nav.navbar-expand-lg .navbar-brand, nav.navbar-expand-lg .navbar-toggler, nav.navbar-expand-lg .nav-link", "min": 5 },
    { "label": "A hero with exactly one <h1> and a call-to-action button link (.btn) inside the hero", "selector": "h1", "min": 1, "max": 1, "contains": "[A-Za-z]{3,}" },
    { "label": "The hero has a button link with a Bootstrap .btn class", "selector": "header a.btn, .hero a.btn", "min": 1 },
    { "label": "At least three service cards, each with a .card-title", "selector": ".card .card-title", "min": 3 },
    { "label": "On a phone (400px) the cards stack to full width", "selector": ".card", "at": 400, "style": { "width": "^(3[3-9]\\d|4\\d\\d)(\\.\\d+)?px$" } },
    { "label": "On a laptop (1000px) the cards sit side by side (each less than 400px wide)", "selector": ".card", "at": 1000, "style": { "width": "^(2\\d\\d|3\\d\\d)(\\.\\d+)?px$" } },
    { "label": "A contact form where every input has a connected label (at least two labels with for)", "selector": "form label[for]", "min": 2 },
    { "label": "The form has a submit button", "selector": "form button[type='submit'], form .btn", "min": 1 },
    { "label": "A <footer> containing a copyright line with a year", "selector": "footer", "contains": "20\\d\\d" },
    { "label": "Sections you can jump to: at least three links starting with # and matching ids", "selector": "a[href^='#']:not([href='#'])", "min": 3 },
    { "label": "Every image has alt text (none is missing it)", "selector": "img:not([alt])", "min": 0, "max": 0 },
    { "label": "Your own CSS file adds at least one custom rule that is not Bootstrap's (for example a hero background or a card hover)", "in": "css", "pattern": "[.#a-z][\\w.#-]*\\s*\\{[^}]*:[^}]*\\}" }
  ],
  "hint": "Follow the steps: navbar (with data-bs-target and a matching id), header.hero with h1 and a.btn, section#menu with row-cols-1 row-cols-md-3 cards, a form with label for/input id, and a footer with a year. Remember the title, lang and viewport."
}
=== prompt
Build a landing page for a business of your choice. Use the six steps from this lesson: a `navbar-expand-lg` navbar with a brand, toggler and at least three links; a hero with **one** `<h1>` and a `btn` call to action; at least three cards (`row-cols-1 row-cols-md-3`) each with a `card-title`; a contact form with labelled inputs and a submit button; and a footer with the year. Add `lang`, a descriptive `<title>` and the viewport meta tag, give any image `alt` text, and write at least one custom rule in the CSS tab.
=== html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <!-- navbar -->

  <!-- hero -->

  <!-- services -->

  <!-- contact form -->

  <!-- footer -->

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
=== css
/* Your own CSS goes here, after Bootstrap's */
=== sample html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Shine Hair Studio | Braids and Hair Care in Lekki</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <nav class="navbar navbar-expand-lg bg-dark sticky-top" data-bs-theme="dark">
    <div class="container">
      <a class="navbar-brand fw-bold" href="#home">Shine Hair Studio</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="nav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link" href="#services">Services</a></li>
          <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
          <li class="nav-item"><a class="nav-link" href="#contact">Book</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <header id="home" class="hero text-center text-white py-5">
    <div class="container py-4">
      <h1 class="display-4 fw-bold">Beautiful hair, done right.</h1>
      <p class="lead mb-4">Braids, natural hair care and styling in Lekki, Lagos.</p>
      <a href="#contact" class="btn btn-warning btn-lg px-4">Book an appointment</a>
    </div>
  </header>

  <main>
    <section id="services" class="py-5">
      <div class="container">
        <h2 class="text-center fw-bold mb-4">Our services</h2>
        <div class="row row-cols-1 row-cols-md-3 g-4">
          <div class="col"><div class="card h-100 shadow-sm"><div class="card-body"><h3 class="h5 card-title">Braids</h3><p class="card-text">Neat knotless braids and cornrows.</p></div></div></div>
          <div class="col"><div class="card h-100 shadow-sm"><div class="card-body"><h3 class="h5 card-title">Natural hair care</h3><p class="card-text">Wash, treatment and styling.</p></div></div></div>
          <div class="col"><div class="card h-100 shadow-sm"><div class="card-body"><h3 class="h5 card-title">Bridal styling</h3><p class="card-text">Hair for your big day.</p></div></div></div>
        </div>
      </div>
    </section>

    <section id="about" class="py-5 bg-light">
      <div class="container">
        <h2 class="fw-bold">Why choose us</h2>
        <p class="text-muted mb-0">We work by appointment, so you never wait, and we use gentle products.</p>
      </div>
    </section>

    <section id="contact" class="py-5">
      <div class="container" style="max-width: 520px">
        <h2 class="fw-bold text-center mb-3">Book an appointment</h2>
        <form>
          <div class="mb-3"><label for="name" class="form-label">Your name</label><input id="name" class="form-control" required /></div>
          <div class="mb-3"><label for="phone" class="form-label">Phone number</label><input id="phone" type="tel" class="form-control" required /></div>
          <button class="btn btn-success w-100" type="submit">Request booking</button>
        </form>
      </div>
    </section>
  </main>

  <footer class="bg-dark text-white-50 py-4">
    <div class="container text-center">&copy; 2026 Shine Hair Studio, Lekki, Lagos</div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
=== sample css
html {
  scroll-behavior: smooth;
}
.hero {
  background: linear-gradient(135deg, #7c2d12, #be123c);
}
.card {
  transition: transform 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
}
=== note
This is a full, publishable landing page. In the last lesson you will put it online. Before you do, open it in the **Phone** view and check that every section reads well on a small screen.
```

```answer
{
  "id": "web-m21-a1",
  "prompt": "In which order should you link the stylesheets so your own CSS can override Bootstrap's? Type **Bootstrap first** or **Your CSS first**.",
  "answer": "Bootstrap first",
  "format": "text",
  "accept": ["bootstrap first", "bootstrap, then yours", "bootstrap before mine", "bootstrap then your css"],
  "explanation": "When two rules have the same specificity, the one that comes later wins, so your stylesheet goes after Bootstrap's.",
  "required": true
}
```
$md$, true, true, 21, array['web-m21-a1', 'web-m21-t1']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('web-m22', 'web-development-for-beginners', 'Publish, Test and Polish Your Website', 22, 'First Website', 'WEBSITE', array['Run a launch checklist', 'Name files safely for the web', 'Publish with GitHub Pages', 'Test a live site on a phone and with Lighthouse']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('web-development-for-beginners:publish-your-first-website', 'web-development-for-beginners', 'web-m22', 'publish-your-first-website', 'Publish, Test and Polish Your Website', 'Run a launch checklist, then put your website online for free with GitHub Pages so anyone can open it at a real web address. Learn how to test on real devices, keep it updated and what to do next.', 45, $md$
## What you are building

By the end of this lesson your website will be live at an address like `https://your-username.github.io`. You can put it on your CV, LinkedIn and portfolio, and send it to anyone. For a developer, a live site that you built and can show is worth more than any certificate.

You can publish any of the pages you built in this course, for example the Bootstrap landing page from lesson 21. Before you start, your folder should look like this:

```text
my-website/
  index.html
  style.css
  script.js
  images/
    hero.jpg
    logo.svg
```

## Name files for the web

Web servers are strict about file names. Follow these rules and you will avoid the most common beginner problem, a **broken image that works on your laptop**:

- **All lowercase.** On the web, `Me.JPG` and `me.jpg` are **different** files.
- **No spaces.** Use a dash: `my-photo.jpg`, not `My Photo.jpg`.
- **Relative paths.** Link to `images/hero.jpg`, never to a path on your own computer like `C:\Users\Ada\Desktop\hero.jpg`. That file exists only on your machine.
- **Your homepage is called `index.html`.** Servers show it automatically when someone visits the folder.

## The pre-launch checklist

Every professional runs a checklist before launching. Go through this one on your site:

| Area | Check |
| :-- | :-- |
| **Content** | No spelling mistakes. No "Lorem ipsum". Real names, real contact details |
| **Page info** | Every page has a clear `<title>`, a meta description, `lang="en"`, the viewport tag and a favicon |
| **Links** | Click every link. External links use `target="_blank" rel="noopener noreferrer"` |
| **Images** | All load, all have `alt` text, all are compressed (aim for under 300 KB each) |
| **Mobile** | Open it on a real phone. Text is readable, nothing scrolls sideways, buttons are easy to tap |
| **Accessibility** | Use only the keyboard to move around. Run Lighthouse. Check colour contrast |
| **Cleanup** | No leftover `console.log` lines, no commented-out experiments, no unused files |
| **Console** | Open DevTools, then **Console**. No red errors |

### Test with Lighthouse

In Chrome, press `F12`, open the **Lighthouse** tab and click **Analyze page load**. It scores your page for Performance, Accessibility, Best Practices and SEO, and tells you exactly what to fix. Aim for 90 or above in each. Then fix and run it again.

## Fix a page before launch

Here is a page with the kind of problems that make it to the internet every day. In the task at the end of the lesson you will fix a page like this one.

```live
=== html
<h1>Ada Okafor</h1>
<img src="images/My Photo.JPG" alt="" />
<p>See my work on <a href="https://github.com/ada" target="_blank">GitHub</a>.</p>
<p>My CV: <a href="C:\Users\Ada\Desktop\cv.pdf">Download</a></p>
```

Count the problems before you read on: an uppercase file name with a space, a missing alt text, a new-tab link without `rel`, and a link to a file on someone's own computer. Four problems in four lines. Checking systematically is how you catch them.

## Publish with GitHub Pages

GitHub Pages hosts your site for free, with HTTPS included. You need a free GitHub account (the Git and GitHub course explains this in detail).

1. On GitHub, create a **new public repository** named exactly `your-username.github.io`, replacing `your-username` with your GitHub username.
2. Click **uploading an existing file** (or **Add file, then Upload files**), drag in everything from your `my-website` folder, and commit.
3. Go to **Settings, then Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose **main** and **/ (root)**, and save.
4. Wait a minute or two, then open `https://your-username.github.io`.

Your site is live. **Every time you commit a change, it updates within a few minutes.**

> [!TIP]
> Any other public repository can be published the same way. Its address will be `https://your-username.github.io/repository-name`. This is how you can host several projects.

> [!NOTE]
> If your site is in a project repository, the address has a path, so use **relative** links (`images/hero.jpg`, not `/images/hero.jpg`), because a link that starts with `/` points to the root of `github.io`, not your project.

### Other free options

| Service | How it works |
| :-- | :-- |
| **Netlify** (netlify.com) | Drag your folder onto the page and it publishes. Good for a quick demo |
| **Vercel** (vercel.com) | Connects to your GitHub repository and publishes on every push |
| **Cloudflare Pages** | Similar, with a very fast network |

All three give you a free address (like `yoursite.netlify.app`) and let you add your own domain later.

## Your own domain name

An address like `ada-okafor.com` looks more professional than `github.io`, and it costs a small yearly fee through a registrar. Once you own a domain, you point it at your host with DNS records, and the host's documentation (search "GitHub Pages custom domain") shows the steps. It is optional, and your free address is perfectly good for a portfolio.

## After launch

- **Test the real thing.** Open the live address on your phone, on mobile data, and on another browser.
- **Share it.** Add the address to your CV, LinkedIn profile and GitHub profile.
- **Keep improving.** Fix what you notice, and change something small every week. Each change is a commit, and your GitHub history shows that you build steadily.
- **Add a README** to the repository: a short page explaining what the site is, who it is for and how to run it. Recruiters look at it.

## Where to go next

You have learned the core of the web. Here is a sensible path:

1. **Build more.** A portfolio, a small business site, a recipe site, a school site. Each one makes you faster.
2. **Web Development with JavaScript** (the next course in this series) takes the same skills to a professional level: exact money handling, accessible forms, fetching from a real API and testing.
3. **Databases and APIs for Developers** shows how the server side works.
4. Go deeper into one area: JavaScript frameworks like React, CSS tools like Tailwind, or design with Figma.

## Try it

First, fix a page before launch. Apply the checklist to the code in the editor.

```webtask
{
  "id": "web-m22-t1",
  "minutes": 12,
  "required": true,
  "tabs": ["html", "js"],
  "rules": [
    { "label": "The profile image uses a lowercase file name with no spaces (for example images/ada.jpg)", "in": "html", "pattern": "<img[^>]*src=\"images/[a-z0-9-]+\\.(jpg|jpeg|png|webp)\"" },
    { "label": "The image has useful alt text (at least 8 characters)", "selector": "img[src]", "attr": { "alt": ".{8,}" } },
    { "label": "The external link opens in a new tab with rel=\"noopener noreferrer\"", "in": "html", "pattern": "<a\\b(?=[^>]*target=\"_blank\")(?=[^>]*rel=\"[^\"]*noopener)[^>]*>" },
    { "label": "The CV link points to a relative file (like cv.pdf), not to a path on someone's computer", "in": "html", "pattern": "href=\"([A-Za-z]:\\\\|file:)", "absent": true },
    { "label": "The CV link still works as a download link to cv.pdf", "selector": "a[href='cv.pdf'], a[href='files/cv.pdf']", "min": 1 },
    { "label": "The leftover console.log is removed from the JavaScript", "in": "js", "pattern": "console\\.log", "absent": true },
    { "label": "The page has a descriptive <title> of at least 15 characters and lang on <html>", "in": "html", "pattern": "<html[^>]*\\blang=[\\s\\S]*<title>[^<]{15,}</title>" }
  ],
  "hint": "Rename the image to images/ada-okafor.jpg, give it alt text, add rel=\"noopener noreferrer\" to the GitHub link, change the CV href to cv.pdf, delete the console.log line, and add lang=\"en\" and a longer title.",
  "height": 360
}
=== prompt
Fix this page for launch: rename the image to a lowercase file name with no spaces and give it real `alt` text, add `rel="noopener noreferrer"` to the external link, make the CV link relative (`cv.pdf`), remove the leftover `console.log`, and give the page `lang="en"` and a descriptive `<title>`.
=== html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Ada</title>
</head>
<body>
  <h1>Ada Okafor</h1>
  <img src="images/My Photo.JPG" alt="" />
  <p>See my work on <a href="https://github.com/ada" target="_blank">GitHub</a>.</p>
  <p>My CV: <a href="C:\Users\Ada\Desktop\cv.pdf">Download</a></p>
</body>
</html>
=== js
console.log("testing the page");
=== sample html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Ada Okafor | Data Analyst Portfolio</title>
</head>
<body>
  <h1>Ada Okafor</h1>
  <img src="images/ada-okafor.jpg" alt="Ada Okafor smiling in front of a laptop" />
  <p>See my work on <a href="https://github.com/ada" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
  <p>My CV: <a href="cv.pdf">Download</a></p>
</body>
</html>
=== sample js
// Nothing left over from testing.
```

Now publish your own site. This is the task that matters most. Publish with GitHub Pages, Netlify or Vercel, open it on your phone, and click every link.

```task
{
  "id": "web-m22-t2",
  "prompt": "Publish your site (GitHub Pages, Netlify or Vercel), open it on your phone, and click every link. Paste the **live address** on the first line, then one line saying what you checked or fixed.",
  "minutes": 20,
  "rows": 3,
  "placeholder": "https://your-username.github.io\nChecked: ...",
  "rules": [
    { "label": "A live site address (github.io, netlify.app, vercel.app or your own domain)", "pattern": "https?://[\\w.-]+\\.(github\\.io|netlify\\.app|vercel\\.app|[a-z]{2,})(/\\S*)?" },
    { "label": "Not a github.com repository page (that is the code, not the live site)", "pattern": "https?://(www\\.)?github\\.com/", "absent": true },
    { "label": "Says what you checked or fixed (phone, links, images, console...)", "pattern": "phone|mobile|link|image|console|error|fixed|checked" }
  ],
  "sample": "https://chioma-eze.github.io\nChecked: opened it on my phone, clicked all three project links, and fixed one image that was not loading because the file was called Me.JPG.",
  "required": true
}
```

```answer
{
  "id": "web-m22-a1",
  "prompt": "Your GitHub username is `chioma-eze`. What must you name the repository so GitHub Pages publishes it at `https://chioma-eze.github.io`?",
  "answer": "chioma-eze.github.io",
  "format": "text",
  "required": true
}
```

```answer
{
  "id": "web-m22-a2",
  "prompt": "Your page shows a broken image. The HTML says `<img src=\"me.jpg\" ...>` and the file you uploaded is called `Me.JPG`. What should the file be renamed to?",
  "answer": "me.jpg",
  "format": "text",
  "explanation": "Web servers treat capital and small letters as different, so Me.JPG and me.jpg are different files. Keep file names lowercase with no spaces.",
  "required": true
}
```

Then add the address to your LinkedIn, CV and portfolio page. Well done: you can now build and publish real websites.
$md$, true, true, 22, array['web-m22-a1', 'web-m22-a2', 'web-m22-t2', 'web-m22-t1']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;


-- Assessment: How the Web Works and Your First Page: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m01-check', 'web-development-for-beginners', 'module', 'web-m01', 'How the Web Works and Your First Page: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m01-q1', 'web-m01-check', 1, 'You type a web address and press Enter. What does the server send back to your browser?', '["A finished picture of the page","Files (HTML, CSS and JavaScript) that the browser turns into the page","Only the page''s text","An email with a link"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m01-q1', 1, 'The browser draws the page from the files the server sends.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m01-q2', 'web-m01-check', 2, 'A friend says: "My page has the right words but looks plain, with no colours or layout." Which language is missing or not connected?', '["HTML","CSS","JavaScript","SQL"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m01-q2', 1, 'HTML gives structure and content; CSS controls colour, fonts and layout.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m01-q3', 'web-m01-check', 3, 'Where does the text people see on a page, like headings and paragraphs, belong?', '["Inside <head>","Inside <body>","Before <!DOCTYPE html>","Inside <title>"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m01-q3', 1, '<head> holds information about the page; <body> holds what visitors see.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m01-q4', 'web-m01-check', 4, 'Which line is the correct way to write a link to Google?', '["<a>https://www.google.com</a>","<link href=\"https://www.google.com\">Google</link>","<a href=\"https://www.google.com\">Google</a>","<href=\"https://www.google.com\">Google</href>"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m01-q4', 2, 'A link is an <a> element, and its address goes in the href attribute.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m01-q5', 'web-m01-check', 5, 'A page has a heading, and the next paragraph is not closed with </p>. What is the best fix?', '["Ignore it, browsers always guess right","Add the closing </p> tag","Delete the heading","Replace the paragraph with <br>"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m01-q5', 1, 'Close every tag you open. Guessing browsers can render the rest of the page wrongly.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Text, Lists, Links and Images: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m02-check', 'web-development-for-beginners', 'module', 'web-m02', 'Text, Lists, Links and Images: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m02-q1', 'web-m02-check', 1, 'Which element should you use for an ordered list of steps in a recipe?', '["<ul>","<ol>","<dl>","<li> on its own"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m02-q1', 1, '<ol> numbers the items, which matters when order matters. <li> items go inside it.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m02-q2', 'web-m02-check', 2, 'You want a link that jumps to the section <h2 id="prices"> on the same page. What is the href?', '["href=\"prices\"","href=\"#prices\"","href=\".prices\"","href=\"/prices.html\""]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m02-q2', 1, 'A # followed by the id jumps to that element on the same page.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m02-q3', 'web-m02-check', 3, 'Which image tag follows good practice?', '["<img src=\"cake.jpg\">","<img src=\"cake.jpg\" alt=\"image\">","<img src=\"cake.jpg\" alt=\"A three-tier birthday cake with white icing\" width=\"600\" height=\"400\">","<img alt=\"A cake\">"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m02-q3', 2, 'Useful alt text, plus width and height so the page does not jump while the image loads. An image without src shows nothing.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m02-q4', 'web-m02-check', 4, 'A link opens a page on another website in a new tab. Which attribute should you add for safety?', '["rel=\"noopener noreferrer\"","alt=\"external\"","download","id=\"external\""]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m02-q4', 0, 'target="_blank" should be paired with rel="noopener noreferrer".')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m02-q5', 'web-m02-check', 5, 'Which link text is best for someone using a screen reader to jump from link to link?', '["Click here","Read more","Download the 2026 price list (PDF)","Link"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m02-q5', 2, 'Link text should make sense on its own.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Page Structure: Semantic HTML and Layout Elements: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m03-check', 'web-development-for-beginners', 'module', 'web-m03', 'Page Structure: Semantic HTML and Layout Elements: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m03-q1', 'web-m03-check', 1, 'Why use <nav> and <footer> instead of <div> for every part of a page?', '["Divs are not allowed any more","They tell browsers, search engines and screen readers what each part is","They load faster","They add colour automatically"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m03-q1', 1, 'Semantic elements carry meaning that helps accessibility and search.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m03-q2', 'web-m03-check', 2, 'A page has the site menu, a news story and a copyright line. Which elements fit best, in that order?', '["<div>, <div>, <div>","<nav>, <article>, <footer>","<header>, <aside>, <main>","<section>, <nav>, <article>"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m03-q2', 1, 'Navigation, a standalone story and the footer.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m03-q3', 'web-m03-check', 3, 'How many <main> elements should one page have?', '["One","As many as there are sections","Zero","Two, one per column"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m03-q3', 0, '<main> marks the single main content of the page.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m03-q4', 'web-m03-check', 4, 'Which sentence about class and id is true?', '["Many elements can share an id, but a class must be unique","Many elements can share a class, but an id must be unique on the page","They are the same","Only ids can be used in CSS"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m03-q4', 1, 'Classes are for groups, ids for one-off elements.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m03-q5', 'web-m03-check', 5, 'You need a plain box just to group some elements so CSS can style them, and nothing else fits. What do you use?', '["<section>","<article>","<div>","<aside>"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m03-q5', 2, '<div> is the generic block box with no meaning, for when no meaningful element fits.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Forms and Tables: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m04-check', 'web-development-for-beginners', 'module', 'web-m04', 'Forms and Tables: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m04-q1', 'web-m04-check', 1, 'Clicking the label "Email" should put the cursor in the email box. What makes that work?', '["Putting the label above the input","A matching for on the <label> and id on the <input>","Using placeholder text","Giving the input a class"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m04-q1', 1, '<label for="email"> goes with <input id="email">.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m04-q2', 'web-m04-check', 2, 'Which input type gives you a calendar picker?', '["type=\"text\"","type=\"date\"","type=\"number\"","type=\"calendar\""]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m04-q2', 1, 'type="date" shows a date picker. There is no calendar type.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m04-q3', 'web-m04-check', 3, 'A form has three radio buttons for "How will you attend?" but the visitor can tick all three. What is wrong?', '["They need different ids","They need the same name","They need the required attribute","Radios cannot be in a form"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m04-q3', 1, 'Radio buttons with the same name form a group where only one can be chosen.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m04-q4', 'web-m04-check', 4, 'A signup form accepts "ada" in the email box. Which change gets the browser to check it for an @?', '["Use type=\"text\"","Use type=\"email\"","Use a longer placeholder","Remove the label"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m04-q4', 1, 'type="email" checks the format before submission.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m04-q5', 'web-m04-check', 5, 'In a timetable table, which element is used for the header cell at the top of a column?', '["<td scope=\"col\">","<th scope=\"col\">","<tr scope=\"col\">","<caption>"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m04-q5', 1, '<th> is a header cell, and scope says whether it heads a column or a row.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Media, Page Information, Search and Accessibility: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m05-check', 'web-development-for-beginners', 'module', 'web-m05', 'Media, Page Information, Search and Accessibility: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m05-q1', 'web-m05-check', 1, 'When someone shares your link on WhatsApp, which tags control the title and picture shown in the preview?', '["<h1> and <img>","Open Graph meta tags such as og:title and og:image","The favicon","The viewport tag"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m05-q1', 1, 'Open Graph tags describe the page for sharing.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m05-q2', 'web-m05-check', 2, 'Which is the best meta description for a school''s homepage?', '["School","A small, friendly school in Ibadan for ages 6 to 17, with WAEC preparation and a coding club.","Welcome to our website, which is the best website for the best school, best school, best school","Click here"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m05-q2', 1, 'A clear sentence of about 150 characters that makes people want to click.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m05-q3', 'web-m05-check', 3, 'A button shows only a magnifying-glass icon. What should you add so a screen reader user knows what it does?', '["A bigger icon","aria-label=\"Search\"","A red border","alt=\"Search\" on the button"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m05-q3', 1, 'aria-label gives an accessible name to an icon-only control.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m05-q4', 'web-m05-check', 4, 'Which step helps a keyboard-only visitor most?', '["Making every control reachable and usable with Tab and Enter","Adding more images","Using smaller text","Hiding the focus outline"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m05-q4', 0, 'Everything a mouse can do must also work with the keyboard.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m05-q5', 'web-m05-check', 5, 'Lighthouse in Chrome DevTools reports an accessibility score of 62. What is the best next step?', '["Ignore it, scores do not matter","Read the list of issues it gives and fix them, like missing alt text and labels","Delete the page","Add more colour"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m05-q5', 1, 'Lighthouse lists concrete fixes.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: CSS Fundamentals: Selectors and the Cascade: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m06-check', 'web-development-for-beginners', 'module', 'web-m06', 'CSS Fundamentals: Selectors and the Cascade: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m06-q1', 'web-m06-check', 1, 'You wrote style.css, but the page looks unstyled. What is the most likely cause?', '["CSS does not work offline","The <link rel=\"stylesheet\" href=\"style.css\"> line is missing or the file name does not match","The browser is too old","JavaScript is needed first"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m06-q1', 1, 'The HTML must link the stylesheet with the exact file name.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m06-q2', 'web-m06-check', 2, 'Which selector targets the one element with id="contact"?', '[".contact","#contact","contact","*contact"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m06-q2', 1, '# is for ids and . is for classes.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m06-q3', 'web-m06-check', 3, 'A paragraph has class="note". Your CSS has p { color: black; } above .note { color: crimson; }. What colour is it?', '["Black, because it was written first","Crimson, because a class is more specific than an element","Crimson only if you add !important","Neither, they cancel out"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m06-q3', 1, 'Specificity: a class beats an element selector.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m06-q4', 'web-m06-check', 4, 'Which rule styles every link inside the <nav> and nothing else?', '["nav, a { }","nav a { }","nav > p { }","a.nav { }"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m06-q4', 1, 'A descendant selector: an <a> anywhere inside <nav>.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m06-q5', 'web-m06-check', 5, 'Why is body { font-family: system-ui, sans-serif; } enough to set the font for the whole page?', '["Because body is the biggest element","Because font-family is inherited by child elements","Because CSS always applies to everything","It is not enough"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m06-q5', 1, 'Some properties, like font-family and color, are inherited.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: The Box Model, Units, Display and Position: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m07-check', 'web-development-for-beginners', 'module', 'web-m07', 'The Box Model, Units, Display and Position: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m07-q1', 'web-m07-check', 1, 'A box has width: 300px, padding: 20px and a 5px border with the default box-sizing. How wide is it on the page?', '["300px","340px","350px","320px"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m07-q1', 2, '300 + 20 + 20 + 5 + 5 = 350px. With box-sizing: border-box it would be 300px.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m07-q2', 'web-m07-check', 2, 'Which two lines centre a box with a set width in its parent?', '["text-align: center;","margin: 0 auto;","padding: auto;","display: center;"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m07-q2', 1, 'Left and right margins of auto split the free space equally.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m07-q3', 'web-m07-check', 3, 'Your link has padding: 12px 24px but the vertical padding does not push other lines away. What fixes it?', '["display: inline-block;","position: static;","float: none;","display: inline;"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m07-q3', 0, 'Inline elements ignore vertical sizing. inline-block respects it.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m07-q4', 'web-m07-check', 4, 'You want a menu bar that stays at the top of the screen while the page scrolls. Which is the best choice?', '["position: sticky; top: 0;","position: static;","display: none;","overflow: hidden;"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m07-q4', 0, 'sticky flows normally, then sticks to the top when you scroll past it.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m07-q5', 'web-m07-check', 5, 'Which unit is best for text size, so it respects the user''s own text-size settings?', '["px","rem","vh","cm"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m07-q5', 1, 'rem scales with the base font size the user has chosen.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Colour, Fonts, Backgrounds and Visual Effects: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m08-check', 'web-development-for-beginners', 'module', 'web-m08', 'Colour, Fonts, Backgrounds and Visual Effects: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m08-q1', 'web-m08-check', 1, 'Your light grey text on white is stylish but hard to read. What should you check?', '["The colour contrast ratio, aiming for at least 4.5 to 1","The font file size","The image sizes","The page title"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m08-q1', 0, 'WCAG asks for at least 4.5 to 1 for normal text.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m08-q2', 'web-m08-check', 2, 'Which gives comfortable, readable body text?', '["font-size: 12px; line-height: 1;","font-size: 1rem; line-height: 1.6;","font-size: 10px; line-height: 3;","font-size: 2rem; line-height: 0.8;"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m08-q2', 1, 'About 16px with a line height of 1.5 to 1.7.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m08-q3', 'web-m08-check', 3, 'Your brand colour is used in forty rules and the client wants a new colour. What would have made this a one-line change?', '["Using color names","CSS custom properties, like --brand set on :root and used with var(--brand)","Using inline styles","Using !important"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m08-q3', 1, 'Variables let you change a value in one place.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m08-q4', 'web-m08-check', 4, 'How do you draw a diagonal two-colour background with no image file?', '["background: url(gradient)","background: linear-gradient(135deg, #0f766e, #134e4a);","background: two-colours;","background-image: diagonal;"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m08-q4', 1, 'CSS gradients are drawn by the browser, so they load instantly.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m08-q5', 'web-m08-check', 5, 'Why should a page use at most two fonts?', '["Browsers only allow two","Every font file makes the page slower, and too many fonts look messy","Fonts cost money","More than two cannot be centred"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m08-q5', 1, 'Speed and visual consistency.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Flexbox: Layout in One Direction: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m09-check', 'web-development-for-beginners', 'module', 'web-m09', 'Flexbox: Layout in One Direction: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m09-q1', 'web-m09-check', 1, 'Which property, set on the flex container, spreads items along the main axis with the first at one end and the last at the other?', '["align-items: center","justify-content: space-between","flex-wrap: wrap","gap: 1rem"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m09-q1', 1, 'space-between puts the free space between items.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m09-q2', 'web-m09-check', 2, 'You want to centre one item both horizontally and vertically inside a tall box. Which works?', '["display: flex; justify-content: center; align-items: center;","text-align: center;","margin: auto;","position: center;"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m09-q2', 0, 'Flexbox centres on both axes with those two properties.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m09-q3', 'web-m09-check', 3, 'Cards in a flex row shrink to tiny widths on a phone. Which change lets them drop onto new lines?', '["flex-wrap: wrap;","display: block;","overflow: hidden;","flex-direction: row;"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m09-q3', 0, 'flex-wrap: wrap allows items to move to a new line.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m09-q4', 'web-m09-check', 4, 'What does flex: 1 1 200px mean for an item?', '["Always exactly 200px","It can grow, can shrink, and starts at 200px","It is hidden below 200px","It must have 200 items"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m09-q4', 1, 'grow 1, shrink 1, basis 200px.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m09-q5', 'web-m09-check', 5, 'A navbar has a logo and links, and you want the logo on the left and links on the right. Which is the best approach?', '["Make the header display: flex; justify-content: space-between;","Float the logo","Use a table","Use text-align: justify"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m09-q5', 0, 'A classic flexbox pattern.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: CSS Grid: Layout in Rows and Columns: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m10-check', 'web-development-for-beginners', 'module', 'web-m10', 'CSS Grid: Layout in Rows and Columns: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m10-q1', 'web-m10-check', 1, 'What does grid-template-columns: 1fr 2fr create?', '["Two equal columns","Two columns where the second is twice as wide as the first","One column of 3px","Two rows"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m10-q1', 1, 'fr divides the free space in proportion.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m10-q2', 'web-m10-check', 2, 'Which line makes as many columns of at least 220px as will fit, sharing the leftover space?', '["grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));","grid-template-columns: 220px;","display: columns;","grid-columns: auto;"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m10-q2', 0, 'A responsive gallery with no media queries.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m10-q3', 'web-m10-check', 3, 'You want one featured card to be twice as wide as the others in a grid. What do you give it?', '["grid-column: span 2;","width: 200%;","flex: 2;","display: wide;"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m10-q3', 0, 'Items can span multiple tracks.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m10-q4', 'web-m10-check', 4, 'When is grid a better choice than flexbox?', '["When laying out items in a single row","When you need rows and columns together, such as a gallery or a whole page layout","Never, flexbox does everything","Only for text"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m10-q4', 1, 'Flexbox is one-dimensional, grid is two-dimensional.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m10-q5', 'web-m10-check', 5, 'In grid-template-areas, what is the picture of strings used for?', '["Setting font sizes","Drawing the page layout, then giving each element a name with grid-area","Adding images","Choosing colours"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m10-q5', 1, 'The drawing is the layout.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Responsive Design: One Site for Every Screen: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m11-check', 'web-development-for-beginners', 'module', 'web-m11', 'Responsive Design: One Site for Every Screen: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m11-q1', 'web-m11-check', 1, 'Which is the mobile-first way to write a three-column layout?', '["Write three columns first, then remove them with max-width queries","Write one column first, then add columns with @media (min-width: ...)","Make two separate websites","Use fixed pixel widths"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m11-q1', 1, 'Start small and add layout as the screen grows.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m11-q2', 'web-m11-check', 2, 'A wide photo overflows a narrow phone screen. Which rule is the standard fix?', '["img { width: 2000px; }","img { max-width: 100%; height: auto; }","img { display: none; }","img { position: fixed; }"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m11-q2', 1, 'The image shrinks to fit its container and keeps its proportions.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m11-q3', 'web-m11-check', 3, 'What does font-size: clamp(1.8rem, 4vw + 1rem, 3rem) do?', '["Fixes the size at 3rem","Scales with the screen but never below 1.8rem or above 3rem","Makes text blink","Applies only on phones"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m11-q3', 1, 'clamp(min, ideal, max).')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m11-q4', 'web-m11-check', 4, 'Where do you decide your breakpoints?', '["At the sizes of the latest iPhone","Where your own layout starts to look stretched or crowded","At 1000px always","You cannot choose them"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m11-q4', 1, 'Let the content decide.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m11-q5', 'web-m11-check', 5, 'What does @media (prefers-reduced-motion: reduce) let you do?', '["Make the page smaller","Switch off animations for people who asked their device for less motion","Reduce the image sizes","Hide the menu"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m11-q5', 1, 'It respects an accessibility setting on the user''s device.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Transitions, Transforms, Animation and Pseudo-elements: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m12-check', 'web-development-for-beginners', 'module', 'web-m12', 'Transitions, Transforms, Animation and Pseudo-elements: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m12-q1', 'web-m12-check', 1, 'You want a button to change colour smoothly over a third of a second on hover. What do you add?', '["transition: background 0.3s ease; on the button","animation: hover;","display: smooth;","delay: 0.3s"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m12-q1', 0, 'A transition makes a change gradual.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m12-q2', 'web-m12-check', 2, 'Which two properties are the best to animate for smooth, fast motion?', '["width and height","transform and opacity","margin and top","padding and border"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m12-q2', 1, 'They do not force the browser to recalculate the page layout.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m12-q3', 'web-m12-check', 3, 'What must you write inside ::before or ::after for the pseudo-element to appear?', '["content: \"\";","display: pseudo;","visible: true;","text: before;"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m12-q3', 0, 'Without a content property, the pseudo-element is not generated.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m12-q4', 'web-m12-check', 4, 'A spinner should turn forever. Which animation shorthand does this?', '["animation: spin 0.9s linear infinite;","animation: spin once;","transition: spin 0.9s;","transform: spin;"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m12-q4', 0, 'infinite repeats the keyframes forever.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m12-q5', 'web-m12-check', 5, 'Why add @media (prefers-reduced-motion: reduce) to your CSS?', '["To make animations faster","Some people feel unwell with lots of motion, and it lets them turn it off","It is required by browsers","It improves SEO"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m12-q5', 1, 'It is about accessibility and kindness.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: JavaScript Basics: Variables, Types and the Console: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m13-check', 'web-development-for-beginners', 'module', 'web-m13', 'JavaScript Basics: Variables, Types and the Console: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m13-q1', 'web-m13-check', 1, 'Your code says const price = 1200; and later price = 1500;. What happens?', '["The price becomes 1500","A TypeError: you cannot reassign a const","Nothing, JavaScript ignores it","The page reloads"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m13-q1', 1, 'const values cannot be reassigned. Use let for values that change.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m13-q2', 'web-m13-check', 2, 'What does console.log("5" + 3) print?', '["8","53","NaN","An error"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m13-q2', 1, 'With a string on one side, + joins text, so the result is "53".')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m13-q3', 'web-m13-check', 3, 'Which is the safest way to compare two values in JavaScript?', '["a = b","a == b","a === b","a equals b"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m13-q3', 2, '=== compares value and type, avoiding surprises from type conversion.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m13-q4', 'web-m13-check', 4, 'Which line builds the text Hello Ada using a template literal and a variable called name?', '["\"Hello ${name}\"","`Hello ${name}`","''Hello'' + name + ''''","Hello {name}"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m13-q4', 1, 'Template literals use backticks and ${...} for values.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m13-q5', 'web-m13-check', 5, 'The Console says: ReferenceError: totl is not defined. The variable is called total. What is the most likely cause?', '["A typo in the name","JavaScript is broken","The page has no CSS","You need var"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m13-q5', 0, 'A ReferenceError means a name that does not exist, often a spelling mistake.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Decisions, Loops and Functions: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m14-check', 'web-development-for-beginners', 'module', 'web-m14', 'Decisions, Loops and Functions: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m14-q1', 'web-m14-check', 1, 'score is 65. The code is: if (score >= 70) A; else if (score >= 60) B; else C. What is the result?', '["A","B","C","Nothing"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m14-q1', 1, 'JavaScript runs the first condition that is true, which is score >= 60.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m14-q2', 'web-m14-check', 2, 'How many times does for (let i = 1; i <= 5; i++) { ... } run its body?', '["4","5","6","It never stops"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m14-q2', 1, 'i takes the values 1, 2, 3, 4 and 5.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m14-q3', 'web-m14-check', 3, 'What does a function return if it has no return statement?', '["0","An empty string","undefined","null"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m14-q3', 2, 'Without return, the call gives undefined.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m14-q4', 'web-m14-check', 4, 'Why is it better to write a function once than to copy the same code in five places?', '["Functions run faster","You fix and change it in one place, and the code is shorter and clearer","Copying is not allowed","Functions use less memory always"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m14-q4', 1, 'Reuse means fewer bugs and easier changes.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m14-q5', 'web-m14-check', 5, 'A while loop never ends and freezes the page. What is the likely mistake?', '["The condition never becomes false","The loop has too few lines","You used let","The function is async"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m14-q5', 0, 'Something inside the loop must move it towards finishing.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Arrays, Objects and JSON: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m15-check', 'web-development-for-beginners', 'module', 'web-m15', 'Arrays, Objects and JSON: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m15-q1', 'web-m15-check', 1, 'What is the index of "Yam" in ["Rice", "Beans", "Yam"]?', '["1","2","3","0"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m15-q1', 1, 'Indexes start at 0, so Yam is at 2.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m15-q2', 'web-m15-check', 2, 'You have an array of products with prices and want only those under ₦5,000. Which method do you use?', '["map","filter","reduce","push"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m15-q2', 1, 'filter keeps the items for which the function returns true.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m15-q3', 'web-m15-check', 3, 'Which gives the total of all numbers in the prices array?', '["prices.reduce((sum, p) => sum + p, 0)","prices.filter((p) => p)","prices.map((p) => p + 1)","prices.length"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m15-q3', 0, 'reduce carries a running value through the list.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m15-q4', 'web-m15-check', 4, 'How do you turn the object task into JSON text to save it?', '["JSON.parse(task)","JSON.stringify(task)","task.toJSON","String.task(task)"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m15-q4', 1, 'stringify converts a value to text. parse converts text back to a value.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m15-q5', 'web-m15-check', 5, '[10, 9, 1].sort() gives [1, 10, 9]. Why, and what is the fix?', '["A bug in JavaScript, use sortNumbers","It sorts as text by default. Pass (a, b) => a - b","Arrays cannot be sorted","Use reverse()"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m15-q5', 1, 'Without a comparison function, sort compares items as strings.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: The DOM: Changing a Page with JavaScript: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m16-check', 'web-development-for-beginners', 'module', 'web-m16', 'The DOM: Changing a Page with JavaScript: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m16-q1', 'web-m16-check', 1, 'Which line finds the first element with class "card"?', '["document.getElement(\".card\")","document.querySelector(\".card\")","document.card","find(\".card\")"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m16-q1', 1, 'querySelector takes a CSS selector.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m16-q2', 'web-m16-check', 2, 'A form field''s text comes from a visitor. How should you put it into the page safely?', '["element.innerHTML = text","element.textContent = text","document.write(text)","eval(text)"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m16-q2', 1, 'textContent treats it as plain text, avoiding injected HTML or scripts.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m16-q3', 'web-m16-check', 3, 'The Console says: Cannot read properties of null. Which is the most likely cause?', '["querySelector found nothing, perhaps a wrong selector or the script ran before the element existed","The CSS is broken","A loop is too long","You used const"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m16-q3', 0, 'querySelector returns null when nothing matches.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m16-q4', 'web-m16-check', 4, 'What are the three steps to add a new list item to the page?', '["Find, read, delete","Create the element, fill it, append it","Save, reload, check","Copy, paste, refresh"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m16-q4', 1, 'createElement, set its text, then append it to a parent.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m16-q5', 'web-m16-check', 5, 'Why is toggling a CSS class often better than setting many styles in JavaScript?', '["Classes are faster to type only","The look stays in CSS, and JavaScript only decides when it applies","Styles cannot be set in JavaScript","Classes work without HTML"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m16-q5', 1, 'Keeping design in CSS makes code easier to maintain.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Events and Forms: Making Pages Interactive: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m17-check', 'web-development-for-beginners', 'module', 'web-m17', 'Events and Forms: Making Pages Interactive: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m17-q1', 'web-m17-check', 1, 'Which call runs a function every time a button is clicked?', '["button.onclick()","button.addEventListener(\"click\", handler)","button.click = handler()","button.run(handler)"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m17-q1', 1, 'addEventListener registers a callback for an event.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m17-q2', 'web-m17-check', 2, 'A form reloads the page when submitted, and your JavaScript never shows its message. What do you add to the submit handler?', '["event.preventDefault()","event.stop()","form.reload()","return true"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m17-q2', 0, 'preventDefault stops the browser''s default reload so your code decides what happens.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m17-q3', 'web-m17-check', 3, 'A list gets new items added later by JavaScript. How do you handle clicks on all items, old and new, with one listener?', '["Add a listener to every item when you create it and hope","Listen on the parent list and use event.target (event delegation)","Use setInterval","It is impossible"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m17-q3', 1, 'Clicks bubble up to the parent, so one listener handles any number of children.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m17-q4', 'web-m17-check', 4, 'Why must a real server validate a form again, even if your JavaScript already did?', '["JavaScript is slow","Visitors can bypass browser code, so the server cannot trust it","Servers cannot read forms","Validation only works on servers"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m17-q4', 1, 'Client-side validation is for convenience, not security.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m17-q5', 'web-m17-check', 5, 'Where should the validation message appear so a screen reader announces it?', '["In the console","In an element with role=\"alert\" or aria-live","In the title","In a comment"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m17-q5', 1, 'role="alert" announces the text when it changes.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Fetch, Async Code and Local Storage: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m18-check', 'web-development-for-beginners', 'module', 'web-m18', 'Fetch, Async Code and Local Storage: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m18-q1', 'web-m18-check', 1, 'fetch(url) gets a 404 Not Found response. What happens?', '["fetch throws an error","fetch gives a response whose ok is false, so you must check it","The page reloads","Nothing"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m18-q1', 1, 'fetch only throws on network failure. HTTP errors are normal responses.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m18-q2', 'web-m18-check', 2, 'What does await do inside an async function?', '["Stops the whole page","Pauses that function until the promise has a result, while the page stays responsive","Repeats the code","Deletes the promise"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m18-q2', 1, 'await waits for a promise without freezing the browser.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m18-q3', 'web-m18-check', 3, 'A data screen should have three states. Which is the right set?', '["Loading, error, and success or empty","Red, green, blue","Header, body, footer","Start, middle, end"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m18-q3', 0, 'Always plan for waiting, failure and results.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m18-q4', 'web-m18-check', 4, 'You want to save the array cart in localStorage. What do you write?', '["localStorage.setItem(\"cart\", cart)","localStorage.setItem(\"cart\", JSON.stringify(cart))","localStorage.cart = cart","localStorage.save(cart)"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m18-q4', 1, 'localStorage stores strings only, so convert with JSON.stringify.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m18-q5', 'web-m18-check', 5, 'Which is not a good thing to store in localStorage?', '["A theme preference","A draft message","A user''s password","A cart"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m18-q5', 2, 'Any script on the page can read localStorage, so never store secrets.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Bootstrap 5: Setup, the Grid and Utilities: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m19-check', 'web-development-for-beginners', 'module', 'web-m19', 'Bootstrap 5: Setup, the Grid and Utilities: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m19-q1', 'web-m19-check', 1, 'A page has Bootstrap''s grid but looks wrong on phones. Which tag is probably missing?', '["The viewport meta tag","A <footer>","A second stylesheet","A favicon"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m19-q1', 0, 'Without the viewport meta tag, phones show a zoomed-out desktop page.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m19-q2', 'web-m19-check', 2, 'What does class="col-12 col-md-4" do?', '["Full width on phones, one third of the row from the md breakpoint up","One third on phones and full width on tablets","Hides the column on phones","Gives the column 12 pixels"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m19-q2', 0, 'Columns apply from their breakpoint upwards, and below it they stack.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m19-q3', 'web-m19-check', 3, 'Which classes give an element 1.5rem of margin at the top and 1rem of padding on every side?', '["mt-4 p-3","m-4 pt-3","margin-top p-all","mt-1 p-1"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m19-q3', 0, 'mt-4 is 1.5rem top margin, p-3 is 1rem padding all round.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m19-q4', 'web-m19-check', 4, 'In which order should the stylesheets be linked so your own CSS can override Bootstrap?', '["Your CSS first, then Bootstrap","Bootstrap first, then your CSS","Order never matters","Only one stylesheet is allowed"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m19-q4', 1, 'The later rule wins when specificity is equal.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m19-q5', 'web-m19-check', 5, 'Which classes centre a block horizontally and make its text centred?', '["mx-auto text-center","center-all","d-center","align-self-center only"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m19-q5', 0, 'mx-auto sets auto side margins and text-center centres the text.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Bootstrap Components: Navbar, Cards, Forms, Modals and More: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m20-check', 'web-development-for-beginners', 'module', 'web-m20', 'Bootstrap Components: Navbar, Cards, Forms, Modals and More: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m20-q1', 'web-m20-check', 1, 'The hamburger button of your navbar does nothing. What is the most common cause?', '["The data-bs-target does not match the id of the collapsing part, or Bootstrap''s JavaScript is missing","The brand is too long","The cards are wrong","You used a footer"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m20-q1', 0, 'The toggler finds its target by id, and the JS bundle makes it work.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m20-q2', 'web-m20-check', 2, 'What does navbar-expand-lg mean?', '["The menu is always collapsed","The full menu shows from the lg breakpoint up, and collapses below it","The navbar is large only","The menu has a gradient"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m20-q2', 1, 'Below lg the links collapse behind the toggler.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m20-q3', 'web-m20-check', 3, 'You want cards in one row to be equal height. Which class do you add to each card?', '["h-100","w-100","d-flex","p-5"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m20-q3', 0, 'h-100 makes each card fill its column''s full height.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m20-q4', 'web-m20-check', 4, 'A button should open a modal with id="orderModal". Which attributes does the button need?', '["data-bs-toggle=\"modal\" data-bs-target=\"#orderModal\"","href=\"orderModal\"","onclick=\"modal\"","class=\"modal\""]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m20-q4', 0, 'The trigger names the target with a # selector.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m20-q5', 'web-m20-check', 5, 'When is writing your own CSS better than using Bootstrap?', '["Never","When you need a unique brand look, or must avoid loading unused CSS","When you have a navbar","When using a grid"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m20-q5', 1, 'Bootstrap is fast and consistent, but custom CSS gives uniqueness and can be lighter.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Build a Complete Website with Bootstrap: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m21-check', 'web-development-for-beginners', 'module', 'web-m21', 'Build a Complete Website with Bootstrap: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m21-q1', 'web-m21-check', 1, 'Why do professionals plan the sections of a landing page before coding?', '["It is a rule of HTML","Each section should help one clear goal for a specific visitor","Plans make pages load faster","Bootstrap requires it"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m21-q1', 1, 'A page works when every part supports the visitor and the main action.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m21-q2', 'web-m21-check', 2, 'A hero heading uses class="display-4" on an <h1>. What is the benefit of keeping it an <h1>?', '["It is bigger","The heading level gives the page its outline for screen readers and search, and the class only controls size","h1 loads faster","There is no benefit"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m21-q2', 1, 'Meaning (h1) and looks (display-4) are separate concerns.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m21-q3', 'web-m21-check', 3, 'A 5 MB hero photo makes your page slow on mobile data. What is the best fix?', '["Resize and compress it, and use img-fluid","Make it larger","Remove the alt text","Use position: fixed"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m21-q3', 0, 'Smaller images load faster, and images should scale to fit the screen.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m21-q4', 'web-m21-check', 4, 'A form on your landing page has inputs with no labels. What is the problem?', '["None, placeholders are enough","Screen readers cannot tell what each field is for, and tapping the label does not help","It will not submit","Bootstrap hides it"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m21-q4', 1, 'Every input needs a connected label.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m21-q5', 'web-m21-check', 5, 'Which testing step is the most important before sharing your site?', '["Opening it on a real phone and clicking everything","Changing the colours","Adding more sections","Checking it only on your laptop"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m21-q5', 0, 'Real devices reveal problems that desktop previews can hide.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Publish, Test and Polish Your Website: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-m22-check', 'web-development-for-beginners', 'module', 'web-m22', 'Publish, Test and Polish Your Website: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m22-q1', 'web-m22-check', 1, 'Your GitHub username is tobi-dev. Which repository name publishes to https://tobi-dev.github.io?', '["website","tobi-dev.github.io","tobi-dev","github.io"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m22-q1', 1, 'The repository must be named exactly username.github.io.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m22-q2', 'web-m22-check', 2, 'An image works on your laptop but is broken online. The HTML says me.jpg and the file is Me.JPG. Why?', '["GitHub does not host images","Web servers treat capital letters as different, so the names do not match","The image is too large","HTML is case sensitive for tags only"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m22-q2', 1, 'Names must match exactly. Use lowercase with no spaces.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m22-q3', 'web-m22-check', 3, 'You share github.com/tobi-dev/tobi-dev.github.io as your website. What is the problem?', '["Nothing","That is the code page, not the live site; share https://tobi-dev.github.io","It is too long","GitHub links cannot be shared"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m22-q3', 1, 'The live site has its own address.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m22-q4', 'web-m22-check', 4, 'A link in your page points to a file on the author''s own computer, like C:\Users\Ada\Desktop\cv.pdf. What happens online?', '["It works for everyone","It only exists on Ada''s computer, so it is broken for visitors","It opens a PDF viewer","GitHub fixes it"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m22-q4', 1, 'Use a relative path to a file inside the site, like cv.pdf.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-m22-q5', 'web-m22-check', 5, 'What does Lighthouse give you?', '["A score for performance, accessibility, best practices and SEO, with a list of fixes","A free domain","A new design","Hosting"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-m22-q5', 0, 'It audits the page and tells you what to improve.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Web Development: final assessment
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('web-development-for-beginners-final', 'web-development-for-beginners', 'final', null, 'Web Development: final assessment', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-f01', 'web-development-for-beginners-final', 1, 'Which language controls colours, fonts and layout?', '["HTML","CSS","JavaScript","Markdown"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-f01', 1, 'CSS is the style layer.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-f02', 'web-development-for-beginners-final', 2, 'Which tag makes a bulleted list item?', '["<ul>","<li>","<ol>","<p>"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-f02', 1, '<li> items go inside <ul> (bullets) or <ol> (numbers).')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-f03', 'web-development-for-beginners-final', 3, 'Why give images alt text?', '["It makes them load faster","It describes them for screen readers and if they fail to load","It is required for colour","It adds a caption"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-f03', 1, 'Accessibility and resilience.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-f04', 'web-development-for-beginners-final', 4, 'Which CSS makes cards sit side by side and wrap on phones?', '["display: flex; flex-wrap: wrap;","display: none;","position: fixed;","float: center;"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-f04', 0, 'Flexbox with wrapping.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-f05', 'web-development-for-beginners-final', 5, 'A shared link on WhatsApp shows no title or picture. What is missing?', '["Open Graph meta tags in the head","More paragraphs","A bigger font","A favicon only"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-f05', 0, 'og:title, og:description and og:image.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-f06', 'web-development-for-beginners-final', 6, 'Which selector is the most specific?', '["p",".note","#special","p.note"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-f06', 2, 'An id beats a class, which beats an element.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-f07', 'web-development-for-beginners-final', 7, 'Which is the best way to build a page''s overall header, sidebar, main content and footer?', '["A CSS grid with named areas","Nested tables","Absolute positioning for everything","Images"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-f07', 0, 'Grid is made for two-dimensional page layouts.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-f08', 'web-development-for-beginners-final', 8, 'Your site works on your laptop, but on a phone the text is tiny and the page is zoomed out. What is missing?', '["The viewport meta tag","A bigger heading","More padding","JavaScript"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-f08', 0, '<meta name="viewport" content="width=device-width, initial-scale=1">.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-f09', 'web-development-for-beginners-final', 9, 'Which JavaScript line finds the element with id "theme-btn"?', '["document.querySelector(\"#theme-btn\")","document.find(\"theme-btn\")","document.theme-btn","getId(\"theme-btn\")"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-f09', 0, 'querySelector takes a CSS selector, and # selects an id.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-f10', 'web-development-for-beginners-final', 10, 'Which keyword declares a value that will not be reassigned?', '["let","const","var only","change"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-f10', 1, 'Use const by default and let when a value changes.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-f11', 'web-development-for-beginners-final', 11, 'A user types a comment that goes onto the page. Which is safe?', '["innerHTML = comment","textContent = comment","document.write(comment)","eval(comment)"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-f11', 1, 'textContent never interprets HTML.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-f12', 'web-development-for-beginners-final', 12, 'Which sentence about fetch is true?', '["It throws an error on a 404 response","It only throws on network failure, so you check response.ok","It always returns an array","It needs jQuery"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-f12', 1, 'HTTP errors are still responses.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-f13', 'web-development-for-beginners-final', 13, 'You want a hamburger menu to collapse on a phone with Bootstrap. Which pieces do you need?', '["A navbar-expand class, a toggler button, a collapse element with a matching id, and Bootstrap''s JS","Only CSS","A table","An iframe"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-f13', 0, 'The toggler targets the collapse element by id and the JS bundle makes it work.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-f14', 'web-development-for-beginners-final', 14, 'What does mobile-first mean?', '["Write for phones first and add layout for larger screens with min-width queries","Only build for phones","Test only on phones","Use only fixed pixel widths"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-f14', 0, 'Start simple and enhance as screens grow.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-f15', 'web-development-for-beginners-final', 15, 'Your site is live but a link is broken. Which is a likely cause?', '["The internet is down","A file name or path mismatch, often capital letters, spaces or a path on your own computer","HTML does not work online","Too many links"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-f15', 1, 'Names and paths must match exactly on the server.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('web-f16', 'web-development-for-beginners-final', 16, 'Which is the best order to add resources to a page with Bootstrap and your own CSS?', '["Your CSS, then Bootstrap''s CSS","Bootstrap''s CSS, then your CSS, with scripts at the end of the body","Scripts in the head only","It does not matter"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('web-f16', 1, 'Later rules win, so your CSS must come after Bootstrap''s.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Project: A published website for a real business
insert into public.projects (id, course_id, title, summary, brief_md, tasks, datasets, rubric, required)
values ('web-business-website', 'web-development-for-beginners', 'A published website for a real business', 'Design, build and publish a responsive, accessible multi-section website for a real or imaginary small business, using HTML, CSS, JavaScript and Bootstrap.', $md$Choose a small business you know, such as a salon, a tailor, a food seller, a school, a church or a tutor, or invent one. Build its website and publish it at a live address.

Plan first: write down who the site is for, what they want and the one action you want them to take. Then build it with the skills from this course: semantic HTML, a responsive layout (Bootstrap, your own CSS, or both), at least one piece of JavaScript that makes the page react (for example a validated contact form, a menu toggle, a filter or a dark mode that remembers its setting), and a launch checklist.

Submit the **live address** of your site (GitHub Pages, Netlify or Vercel) and a link to your code on GitHub, with a short note on what the business is and which parts you are proudest of. Use only real content: do not invent customer reviews or statistics.$md$, array['A plan: the visitor, what they want and the main action, in a few sentences.', 'A responsive navbar and a hero with one h1 and a clear call to action.', 'At least three content sections (services, about, prices, gallery or similar) using cards, a grid or flexbox.', 'A contact or order form with labelled fields and validation messages from JavaScript.', 'At least one more piece of JavaScript that responds to the visitor.', 'Accessible and mobile friendly: alt text, a sensible heading order, keyboard use, good contrast and no sideways scrolling on a phone.', 'Page information: lang, a descriptive title, a meta description, a favicon and Open Graph tags.', 'Published at a live address, with a README in the repository, and checked with Lighthouse.']::text[], '{}'::text[], array['The site is live, the address works, and the repository has a clear README.', 'The HTML is valid and semantic, with a single h1 and a logical heading outline.', 'The layout is responsive and looks good on a phone, a tablet and a desktop.', 'The form and the JavaScript work, give clear feedback, and handle bad input.', 'The site is accessible: alt text, labels, keyboard use, readable contrast, and a good Lighthouse accessibility score.', 'The content is real and well written, with no invented reviews or statistics, and the site has a clear call to action.']::text[], true)
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, summary = excluded.summary, brief_md = excluded.brief_md, tasks = excluded.tasks, datasets = excluded.datasets, rubric = excluded.rubric, required = excluded.required;



-- Remove lessons of this course that no longer exist in the new version
delete from public.lessons where course_id = 'web-development-for-beginners' and slug not in ('html-the-structure','html-text-links-images','html-semantic-layout','html-forms-tables','html-media-seo-accessibility','css-the-style','css-box-model-units','css-colour-fonts-effects','css-flexbox','css-grid','css-responsive-design','css-transitions-animation','javascript-the-behaviour','js-logic-functions','js-arrays-objects','js-the-dom','js-events-forms','js-fetch-storage','bootstrap-grid-utilities','bootstrap-components','bootstrap-landing-page','publish-your-first-website');

commit;
