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

1. Finish your four sections: header, about, projects and contact.
2. Publish the site with GitHub Pages.
3. Test it on your phone and fix anything broken.
4. Add the link to your LinkedIn, CV and portfolio page.
