# 50 ready-to-post social media posts

Everything you need to post without Claude.

| What | Where |
|---|---|
| The 50 images (1080 x 1350, the 4:5 feed size) | `png/` |
| Captions, tracked links and alt text | `captions.md` |
| 50-day posting plan (one post a day) | `posting-plan.md` |
| Same data as a spreadsheet | `posts.csv` (open in Excel) |
| Gallery with copy-caption and download buttons | `index.html` (double-click to open; works offline) |

## How to post
1. Open `index.html`. Click **Download image**, then **Copy caption**.
2. Post on Instagram, Facebook, LinkedIn or WhatsApp status.
3. Instagram does not make caption links clickable: put the link in your bio or a Story link sticker.
4. Use the tracked link in `captions.md` and change `utm_source=instagram` to the platform you use, so you can see what brings visitors.

## Before you post
- **Professional-course posts** show no price. Make sure that course's enrolment is open in the admin first.
- Posts do not promise jobs or income. Keep your own edits that way.

## Edit and rebuild
- Wording, links and hashtags: `posts_data.py`. Look and layouts: `build_posts.py`.
- Rebuild everything: `python marketing/posts/build_posts.py`. Rebuild some: `python marketing/posts/build_posts.py 7 12`.
- Needs Python and Chrome (set `CHROME` if it is not found). Fonts are in `marketing/ads/fonts`.
