---
title: Publish Your First Website
minutes: 30
summary: Put your personal website online for free with GitHub Pages, so anyone can open it at a real web address.
---

## What you're building

By the end of this module you'll have a live personal website at an address like `https://your-username.github.io`. You can put it on your CV, LinkedIn and portfolio.

Before you start, your `my-website` folder should contain:

```text
my-website/
  index.html
  style.css
  script.js
  me.jpg
```

## Check the content

A good first personal site has:

1. **Header:** your name and one line on what you do.
2. **About:** two or three sentences.
3. **Projects:** two or three cards, each with a title, a sentence and a link.
4. **Contact:** email, LinkedIn and GitHub links.

Keep file names lowercase with no spaces (`me.jpg`, not `My Photo.JPG`). Web servers treat `Me.jpg` and `me.jpg` as different files.

## Publish with GitHub Pages

You need a free GitHub account (see the Git & GitHub course).

1. On GitHub, create a **new public repository** named exactly `your-username.github.io`, replacing `your-username` with your GitHub username.
2. Click **uploading an existing file** (or **Add file → Upload files**), drag in everything from your `my-website` folder, and commit.
3. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose **main** and **/ (root)**, and save.
4. Wait a minute or two, then open `https://your-username.github.io`.

Your site is live. Every time you commit a change, it updates within a few minutes.

![A folder is uploaded to a public GitHub repository, GitHub Pages deploys it from the main branch, and the site goes live; a checklist for before sharing: phone, links, images and the Console](/images/courses/web/publish.svg "Folder to repository to live site: every commit updates it.")

> [!TIP]
> Any other public repository can be published the same way. Its address will be `https://your-username.github.io/repository-name`.

## Other free options

- **Netlify** (netlify.com): drag your folder onto the page to publish.
- **Vercel** (vercel.com): connects to GitHub and publishes on every push.

## Check before you share

- Open the site on your phone.
- Click every link and check every image loads (broken images are usually a file name mismatch).
- Right-click → **Inspect** → **Console** to check for red errors.

## Try it

```answer
{
  "id": "web-m04-a1",
  "prompt": "Your GitHub username is `chioma-eze`. What must you name the repository so GitHub Pages publishes it at `https://chioma-eze.github.io`?",
  "answer": "chioma-eze.github.io",
  "format": "text",
  "required": true
}
```

```answer
{
  "id": "web-m04-a2",
  "prompt": "Your page shows a broken image. The HTML says `<img src=\"me.jpg\" …>` and the file you uploaded is called `Me.JPG`. What should the file be renamed to?",
  "answer": "me.jpg",
  "format": "text",
  "explanation": "Web servers treat capital and small letters as different, so Me.JPG and me.jpg are different files. Keep file names lowercase with no spaces.",
  "required": true
}
```

```task
{
  "id": "web-m04-t1",
  "prompt": "Publish your site (GitHub Pages, Netlify or Vercel), open it on your phone, and click every link. Paste the **live address** on the first line, then one line saying what you checked or fixed.",
  "minutes": 20,
  "rows": 3,
  "placeholder": "https://your-username.github.io\nChecked: ...",
  "rules": [
    { "label": "A live site address (github.io, netlify.app, vercel.app or your own domain)", "pattern": "https?://[\\w.-]+\\.(github\\.io|netlify\\.app|vercel\\.app|[a-z]{2,})(/\\S*)?" },
    { "label": "Not a github.com repository page (that's the code, not the live site)", "pattern": "https?://(www\\.)?github\\.com/", "absent": true },
    { "label": "Says what you checked or fixed (phone, links, images, console…)", "pattern": "phone|mobile|link|image|console|error|fixed|checked" }
  ],
  "sample": "https://chioma-eze.github.io\nChecked: opened it on my phone, clicked all three project links, and fixed one image that wasn't loading because the file was called Me.JPG.",
  "required": true
}
```

Then add the address to your LinkedIn, CV and portfolio page.
