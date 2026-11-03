---
title: How the Web Works and Your First Page
minutes: 30
summary: See what happens when you open a website, learn the three languages every site is built from, and write your first real HTML page in an editor that shows the result as you type.
---

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
