---
title: Search Engine Optimisation
minutes: 30
summary: Understand how search works, research keywords, optimise pages, win local search with Google Business Profile and build links and authority.
---

## How search works

When someone types a question into a search engine such as Google, the engine looks through pages it has found and stored (**crawling and indexing**), then ranks the ones it believes best answer that search (**ranking**). **Search engine optimisation (SEO)** is the work of making your website and content easy for search engines to find and understand, and genuinely helpful to the people searching.

SEO is valuable because search traffic is **high-intent** (people are looking for what you offer now) and **free to click** once you rank. Its limits: it is slow (often weeks or months), competitive, and the rules change. There are no tricks. The lasting approach is to **be the most useful, trustworthy result** for a clear search.

Three broad areas:

- **Content:** pages that answer what people search for.
- **Technical:** a site that is fast, secure, mobile-friendly and easy for search engines to read.
- **Authority:** other trusted sites linking to and mentioning you, plus good reviews.

## Keyword research

A **keyword** is a word or phrase people type into search. **Keyword research** finds what your customers search for, in their words.

Steps:

1. **Brainstorm** the products, services, problems and questions of your customers.
2. **Use tools:** Google's search suggestions and "People also ask", related searches at the bottom of results, and free keyword tools. Look at your competitors' pages.
3. **Check intent.** What does the searcher want?
   - **Informational:** "how to remove stains from a sofa."
   - **Commercial investigation:** "best sofa cleaning service in Lagos."
   - **Transactional:** "book sofa cleaning Lekki."
   - **Navigational:** "FreshClean Lagos."
4. **Judge difficulty and volume.** Popular, broad keywords ("cleaning") are very competitive. **Longer, specific phrases (long-tail)** such as "affordable sofa cleaning in Lekki" have fewer searches but are easier to win and convert better.
5. **Choose one main keyword per page,** with a few related ones.
6. **Map keywords to pages** in a simple sheet: keyword, intent, page, status.

For a local business, always include **place names** (area, city) where relevant.

## On-page SEO

**On-page SEO** is what you do on each page.

- **Title tag:** the clickable headline in search results. Include the main keyword near the start, keep it to roughly 50 to 60 characters so it is not cut off, and make it appealing. *"Sofa Cleaning in Lekki, Lagos | FreshClean"*.
- **Meta description:** the short summary under the title. Roughly 140 to 155 characters, with a benefit and a call to action. It does not directly rank you but influences clicks.
- **Headings:** one clear main heading (H1) with the topic, and subheadings (H2, H3) that organise the page.
- **Content:** answer the searcher's question fully, clearly and honestly. Write for people. Use the keyword and related words naturally, never stuffed.
- **URLs:** short and descriptive (`/sofa-cleaning-lekki`).
- **Images:** descriptive file names and **alt text** that describes the image (helps accessibility and search).
- **Internal links:** link related pages to each other with clear link text.
- **Speed and mobile:** most Nigerian searches are on phones. Compress images, avoid heavy pages and test on a phone.
- **Trust:** contact details, address, reviews, clear pricing or ranges, and a secure (HTTPS) site.

## Local search and Google Business Profile

For a business serving a local area, **local SEO** is often the fastest win. When people search "salon near me" or "plumber in Yaba," Google shows a **map and a list of local businesses**, drawn largely from **Google Business Profile** (GBP), a free listing.

Set it up well:

1. **Claim and verify** your business profile.
2. **Complete every field:** exact business name, correct category, address or service area, phone, website, hours, services, products and a clear description.
3. **Add good photos** of the premises, team, work and products, and update them.
4. **Ask happy customers for reviews,** and reply to every review, good or bad, politely.
5. **Post updates** and offers regularly.
6. **Keep name, address and phone (NAP) consistent** everywhere online.
7. **Use messaging, booking and Q&A features** where available.
8. **Add your location to your website** and embed the map.

Reviews and complete, accurate information strongly influence local ranking and whether people choose you.

## Links and authority

Search engines see a link from another site as a **vote of trust,** especially from relevant, reputable sites. Earn links the honest way:

- **Create genuinely useful content** others want to reference.
- **Get listed** in respected local directories, trade associations and chambers.
- **Partner and collaborate:** guest articles, suppliers who list you, community organisations.
- **Get press and mentions** for real news about your business.
- **Share your content** so people find it.

Avoid buying links or link schemes, which can lead to penalties. Quality beats quantity.

Measure progress with free tools: **Google Search Console** shows which searches bring impressions and clicks and flags technical problems, and **Google Analytics** shows visits and behaviour. Be patient: review monthly, not daily.

## Try it

```task
{
  "id": "dms-m06-t1",
  "prompt": "For a **cleaning service in Lekki, Lagos**, list **eight keyword ideas**, one per line, each with its search intent (informational, commercial or transactional). Include some long-tail phrases with the place name.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "sofa cleaning in Lekki - transactional",
  "rules": [
    { "label": "Eight lines", "minLines": 8 },
    { "label": "Includes the place name", "pattern": "lekki|lagos", "min": 4 },
    { "label": "Includes intent labels", "pattern": "informational|commercial|transactional", "min": 6 },
    { "label": "Includes an informational keyword (how to)", "pattern": "how to|what is|why|tips" },
    { "label": "Includes a transactional keyword (book, hire, price)", "pattern": "book|hire|price|cost|near me|quote" }
  ],
  "sample": "sofa cleaning in Lekki - transactional\nhow to remove stains from a sofa - informational\nbest carpet cleaning service in Lagos - commercial\nhire office cleaners in Lekki - transactional\naffordable home cleaning Lekki Phase 1 - commercial\nprice of deep cleaning an apartment in Lagos - transactional\nhow often should you deep clean a house - informational\ncleaning company near me Lekki - transactional",
  "required": true
}
```

```task
{
  "id": "dms-m06-t2",
  "prompt": "Write the **title tag** (about 50 to 60 characters) and **meta description** (about 140 to 155 characters) for your page about sofa cleaning in Lekki. Then give three **on-page improvements** you would make to the page itself. Label each part.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Title tag: ...\nMeta description: ...\nImprovement 1: ...",
  "rules": [
    { "label": "Has a title tag", "pattern": "title tag" },
    { "label": "Has a meta description", "pattern": "meta description" },
    { "label": "Mentions the keyword and place", "pattern": "sofa cleaning[\\s\\S]*lekki|lekki[\\s\\S]*sofa cleaning" },
    { "label": "Has three improvements", "pattern": "improvement 1[\\s\\S]*improvement 2[\\s\\S]*improvement 3" },
    { "label": "Improvements mention headings, images, speed, links or reviews", "pattern": "heading|alt text|image|speed|mobile|internal link|review|url" }
  ],
  "sample": "Title tag: Sofa Cleaning in Lekki, Lagos | FreshClean\nMeta description: Professional sofa cleaning in Lekki. We remove stains and odours in one visit. Free quote on WhatsApp. Book today.\nImprovement 1: add one clear H1 heading and subheadings for prices and the process\nImprovement 2: add descriptive alt text to the before-and-after photos and compress them for speed\nImprovement 3: add customer reviews and an internal link to our carpet cleaning page",
  "required": true
}
```

```task
{
  "id": "dms-m06-t3",
  "prompt": "Write a **Google Business Profile checklist** with at least seven actions, one per line.",
  "minutes": 8,
  "rows": 9,
  "placeholder": "Claim and verify the profile",
  "rules": [
    { "label": "At least seven lines", "minLines": 7 },
    { "label": "Claim or verify", "pattern": "claim|verify" },
    { "label": "Complete fields: category, hours, address, phone", "pattern": "category|hours|address|phone|description" },
    { "label": "Photos", "pattern": "photo" },
    { "label": "Reviews and replies", "pattern": "review" },
    { "label": "Posts or updates", "pattern": "post|update|offer" },
    { "label": "Consistency of name, address and phone", "pattern": "consisten|nap" }
  ],
  "sample": "Claim and verify the business profile\nChoose the correct main category and add services\nComplete the address or service area, phone, website and opening hours\nWrite a clear description with the keywords customers use\nAdd good photos of the team, work and premises\nAsk happy customers for reviews and reply to every review\nPost updates and offers regularly\nKeep the name, address and phone consistent across the web",
  "required": false
}
```

Next lesson: email and WhatsApp marketing.
