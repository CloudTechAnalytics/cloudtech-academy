---
title: "HTML: The Structure"
minutes: 25
summary: Learn how web pages are built, write your first HTML page with headings, text, links, images and lists, and open it in your browser.
---

## How a web page works

Every website is built from three languages that work together:

| Language | Job | Think of it as… |
| :-- | :-- | :-- |
| **HTML** | Structure and content | The walls and rooms of a house |
| **CSS** | Style and layout | The paint and furniture |
| **JavaScript** | Behaviour and interaction | The lights and switches |

Your browser reads these files and draws the page. You only need a text editor and a browser to start.

## Set up

Use a free code editor. **Visual Studio Code** (code.visualstudio.com) is the most popular. On a phone or a borrowed computer, **CodePen** (codepen.io) works in the browser.

1. Create a folder called `my-website`.
2. In VS Code, open that folder and create a file called `index.html`.

## Your first page

HTML uses **tags** in angle brackets. Most come in pairs: `<p>` opens a paragraph and `</p>` closes it. Type this into `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Chioma Eze</title>
  </head>
  <body>
    <h1>Chioma Eze</h1>
    <p>Computer Science student at UNN, learning web development.</p>

    <h2>My skills</h2>
    <ul>
      <li>HTML and CSS</li>
      <li>Excel</li>
      <li>Canva</li>
    </ul>

    <h2>Contact</h2>
    <p>Find me on <a href="https://www.linkedin.com">LinkedIn</a>.</p>
  </body>
</html>
```

Save it, then double-click the file to open it in your browser.

## The tags you'll use most

| Tag | What it's for |
| :-- | :-- |
| `<h1>` to `<h6>` | Headings, from most to least important. Use one `<h1>` per page |
| `<p>` | A paragraph |
| `<a href="…">` | A link |
| `<img src="…" alt="…">` | An image. `alt` describes it for screen readers |
| `<ul>` / `<ol>` with `<li>` | Bulleted or numbered lists |
| `<section>`, `<header>`, `<footer>` | Group parts of the page |

> [!TIP]
> The `<head>` holds information about the page (like the title in the browser tab). Everything visible goes inside `<body>`.

## Add an image

Put a photo called `me.jpg` in the same folder, then add:

```html
<img src="me.jpg" alt="Chioma smiling in front of the library" width="200" />
```

## Try it

1. Create `index.html` with your own name, a one-line intro and a heading.
2. Add a list of three skills and a link to your LinkedIn or GitHub.
3. Add an image with a helpful `alt` description.
4. Open the file in your browser, change something, save, and refresh to see the change.
