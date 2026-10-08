---
title: "Publish, Test and Polish Your Website"
minutes: 45
summary: Run a launch checklist, then put your website online for free with GitHub Pages so anyone can open it at a real web address. Learn how to test on real devices, keep it updated and what to do next.
---

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
