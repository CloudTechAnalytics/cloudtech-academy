---
title: Media, Page Information, Search and Accessibility
minutes: 30
summary: Add audio, video and embeds, write the hidden page information that search engines and WhatsApp read, and build pages that everyone can use, including people who use a keyboard or a screen reader.
---

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
