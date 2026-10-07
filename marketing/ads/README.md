# CloudTech Academy ad pack

Six ad concepts as images in four sizes, and three videos. Every ad sends people to the **free** courses. Nothing here shows a price.

## What is in the folder

**Images** (`static/`, 24 PNGs). File name = `<concept>-<size>.png`

| Size | Pixels | Use for |
|---|---|---|
| `feed` | 1080 × 1350 (4:5) | Instagram feed, Facebook feed. The best default. |
| `square` | 1080 × 1080 (1:1) | Instagram and Facebook feed, carousels, Marketplace |
| `story` | 1080 × 1920 (9:16) | Instagram and Facebook Stories and Reels covers. Text stays out of the top 210 px and bottom 330 px, where the app draws its own buttons. |
| `link` | 1200 × 628 (1.91:1) | Facebook link ads, Audience Network, Google Display |

| Concept | Angle | Best for |
|---|---|---|
| `free-data` | Learn data. Free. (Excel, SQL, Power BI, Python) | Cold audiences, the main ad |
| `sql-browser` | Write real SQL in your browser | People curious about tech, careers |
| `badges` | Every skill earns a badge | LinkedIn-minded, career changers |
| `students` | Student? Start here. | University students, graduates |
| `path` | Zero to data analyst. Start free. | People who want a career route |
| `go-further` | From learner to professional (programmes, no price) | Retargeting people who already visited or signed up |

**Videos** (`video/out/`, H.264 MP4, 30 fps, silent with on-screen text)

| File | Size / length | Use for |
|---|---|---|
| `01-start-free-reel-9x16.mp4` | 1080 × 1920, 15 s | Instagram Reels and Stories, Facebook Reels and Stories, YouTube Shorts |
| `02-learn-practise-earn-youtube-16x9.mp4` | 1920 × 1080, 20 s | YouTube in-stream ads, Facebook and Instagram in-feed landscape |
| `03-students-square-1x1.mp4` | 1080 × 1080, 12 s | Instagram and Facebook feed, for students |

The videos have no sound on purpose: most people watch muted, and the words carry the message. You can add trending or licensed music inside Instagram, CapCut or the Meta ad editor.

## Links to use

Send ads to the sign-up page, or to the course list if you want people to browse first. Add `utm_` tags so you can tell the ads apart in analytics.

```
https://academy.cloudtechanalytics.com/sign-up?utm_source=instagram&utm_medium=paid_social&utm_campaign=free_courses&utm_content=free-data-feed
https://academy.cloudtechanalytics.com/courses?access=free&utm_source=facebook&utm_medium=paid_social&utm_campaign=free_courses&utm_content=students-square
```

Change `utm_source` (instagram, facebook, youtube) and `utm_content` (the file name) for each ad. For retargeting with `go-further`, link to `https://academy.cloudtechanalytics.com/programmes`.

## Copy to paste

Use these with the images and videos. Keep one idea per ad.

**Free courses (concept `free-data`, video 01)**
- Primary text: *Excel, SQL, Power BI and Python, taught step by step. Practise in your browser, earn a badge for every skill, and start today. Free.*
- Headline: *Learn data. Free.*
- Description: *Free courses in data, AI and tech.*
- Button: Sign Up (Meta) or Learn more

**SQL in the browser (`sql-browser`)**
- Primary text: *Write real SQL without installing anything. Run your query and see straight away if it is right. The first lesson is free.*
- Headline: *Write real SQL in your browser*
- Description: *No setup. No downloads.*
- Button: Learn more

**Badges (`badges`)**
- Primary text: *Finish a module, pass the check, and earn a badge you can share on LinkedIn. Every free course at CloudTech Academy comes with them.*
- Headline: *Every skill earns a badge*
- Description: *Free badges with every course.*
- Button: Sign Up

**Students (`students`, video 03)**
- Primary text: *Study smarter with AI, build a CV that gets read, create a portfolio and go after your first internship. All free for students.*
- Headline: *Student? Start here.*
- Description: *Free skills for school and your first job.*
- Button: Sign Up

**Career route (`path`)**
- Primary text: *Want to work in data? Start with Excel, then SQL, Power BI and Python. One free course at a time, with practice and badges along the way.*
- Headline: *Zero to data analyst. Start free.*
- Description: *A clear route, one free course at a time.*
- Button: Learn more

**Retargeting (`go-further`)**
- Primary text: *You have started learning. Ready to go further? Professional programmes in data, AI, cloud and software: full curriculum, real projects, a capstone and a certificate.*
- Headline: *From learner to professional*
- Description: *Explore the programmes.*
- Button: Learn more

**YouTube (video 02)**
- Headline (25 characters): *Learn data skills for free*
- Long headline (90 characters): *Free courses in data, AI and tech: learn, practise in your browser and earn badges*
- Call to action: Sign up
- Companion banner: use the `link` size.

## How to run it

1. **Start small.** Run 2 to 3 ads for 5 to 7 days before spending more. Meta needs about 50 sign-ups to learn well, so a small daily budget that you do not touch for the first few days works better than changing it daily.
2. **Test one thing at a time.** First test the concept (`free-data` vs `students` vs `path`). Then test the format (image vs video) on the winner.
3. **Goal.** Choose *Leads* or *Sign-ups*. If you cannot track sign-ups yet, choose *Traffic* with "landing page views".
4. **Audience to try first.** Nigeria, ages 18 to 34, interests such as data analysis, Microsoft Excel, Power BI, Python, SQL, online learning, internships. For `students`, also target university students. Broad targeting often beats narrow, so keep one ad set open.
5. **Placements.** Use Automatic placements, but check that Stories and Reels show the `story` size or the 9:16 video and not a cropped feed image.
6. **Retarget.** After a week, make an audience of people who visited the site or signed up, and show them `go-further`.
7. **YouTube.** Use skippable in-stream with video 02. Put the main message in the first 5 seconds, which is already how it is written.

## Before you spend

- **Tracking.** The site does not have a Meta Pixel or Google Ads tag yet, so Meta and Google cannot count sign-ups. I can add them. Until then, the UTM tags above show visits in analytics.
- **Claims.** The ads promise free courses, practice and badges. They do not promise jobs, income or guaranteed results, and they should not be edited to. Meta and Google both reject that kind of claim.
- **Landing page.** The page people land on is the free sign-up. Keep it that way for these ads.

## Rebuilding or changing anything

The designs are code, so wording, colours and sizes are easy to change.

- Images: edit `build_static.py` (headlines and copy are in `CONCEPTS`), then run `python marketing/ads/build_static.py`. It needs Chrome or Chromium; set `CHROME` to its path if it is not found.
- Videos: edit the HTML in `video/` (the timing is in the `render` function at the bottom), then run
  `node marketing/ads/video/render-video.cjs <page.html> <out.mp4> <width> <height> 30`.
  It needs Playwright and ffmpeg with libx264 (set `FFMPEG` to the ffmpeg path).
- `video/contact-sheet.py` pulls frames out of a video into one picture so you can check it without playing it.
