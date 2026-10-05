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

![index.html, style.css and script.js feed into the browser, which draws the page; below, a minimal HTML file with its head (the title) and body (everything visible)](/images/courses/web/three-languages.svg "HTML, CSS and JavaScript files come together in the browser to draw the page.")

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

```answer
{
  "id": "web-m01-a1",
  "prompt": "This image tag works, but it's missing something every image should have for screen readers and for when the image fails to load: `<img src=\"me.jpg\" width=\"200\" />`. Which **attribute** is missing?",
  "answer": "alt",
  "format": "text",
  "accept": ["alt attribute", "alt=", "alt text"],
  "explanation": "alt describes the image, for example alt=\"Chioma smiling in front of the library\".",
  "required": true
}
```

```task
{
  "id": "web-m01-t1",
  "prompt": "Build your own `index.html` in VS Code (or CodePen), open it in your browser, then paste the **whole file** here. It needs: the `<!DOCTYPE html>` line, a `<title>`, **one** `<h1>` with your name, a paragraph about you, a list of at least three skills, a link, and an image with a helpful `alt`.",
  "minutes": 20,
  "rows": 16,
  "placeholder": "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n  ...",
  "rules": [
    { "label": "Starts with <!DOCTYPE html>", "pattern": "<!doctype html>" },
    { "label": "Has <html lang=\"…\">", "pattern": "<html[^>]*\\blang=\"[a-z-]+\"" },
    { "label": "Has a <title> in the head", "pattern": "<title>[^<]+</title>" },
    { "label": "An <h1> with your name", "pattern": "<h1[\\s>]" },
    { "label": "Not more than one <h1>", "pattern": "<h1[\\s>][\\s\\S]*<h1[\\s>]", "absent": true },
    { "label": "A paragraph (<p>)", "pattern": "<p[\\s>][^<]{10,}" },
    { "label": "A list with at least three items", "pattern": "<li[\\s>]", "min": 3 },
    { "label": "A link to a real address (<a href=\"https://…\">)", "pattern": "<a[^>]+href=\"https?://[^\"]+\"" },
    { "label": "An image with a non-empty alt", "pattern": "<img[^>]+alt=\"[^\"]{5,}\"" }
  ],
  "sample": "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    <title>Chioma Eze</title>\n  </head>\n  <body>\n    <h1>Chioma Eze</h1>\n    <img src=\"me.jpg\" alt=\"Chioma smiling in front of the library\" width=\"200\" />\n    <p>Computer Science student at UNN, learning web development.</p>\n    <h2>My skills</h2>\n    <ul>\n      <li>HTML and CSS</li>\n      <li>Excel</li>\n      <li>Canva</li>\n    </ul>\n    <h2>Contact</h2>\n    <p>Find me on <a href=\"https://github.com/chioma-eze\">GitHub</a>.</p>\n  </body>\n</html>",
  "note": "Your page will look plain: that's right for now. The next module adds the style.",
  "required": true
}
```
