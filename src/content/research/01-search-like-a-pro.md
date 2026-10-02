---
title: Search Like a Pro
minutes: 25
handsOn: 8
summary: Find good sources in minutes: turn questions into keywords, use Google's search operators to cut out noise, search Google Scholar and official sites, and keep a short log of what you found and how.
---

## From question to keywords

Search engines match **words**, not questions. A whole question brings back pages that happen to use the same everyday words, often forums and blogs. Pull out the **key terms** instead:

| Your question | Better search |
| :-- | :-- |
| What are the effects of youth unemployment in Nigeria? | youth unemployment Nigeria effects |
| How does mobile money help small businesses? | mobile money small business growth |
| Is social media bad for students' grades? | social media use academic performance students |

Then add **synonyms**, the other words experts use for the same thing: *unemployment / joblessness*; *small business / SME / micro-enterprise*; *grades / academic performance / CGPA*. Different words find different sources.

**A worked example.** Amaka's assignment asks about the impact of youth unemployment on crime in Nigeria.

1. First search: `does youth unemployment cause crime in Nigeria` → news opinion pieces and a forum thread.
2. Keywords: `youth unemployment crime Nigeria` → better, but mostly newspapers.
3. She notices articles use the phrase "unemployment rate" and the word "insecurity", and searches: `"youth unemployment" insecurity Nigeria` → more relevant, including reports.
4. Narrowed to official data: `unemployment site:nigerianstat.gov.ng` → the National Bureau of Statistics' own labour force reports.
5. Same keywords in Google Scholar → journal articles, some with hundreds of citations.

Five focused searches, each using what the last one taught her. That's the skill.

## Search operators

Operators are short codes you type into Google's search box to control the results:

| Operator | What it does | Example |
| :-- | :-- | :-- |
| `"quotes"` | This exact phrase | `"youth unemployment rate"` |
| `site:` | Only this website or domain | `unemployment site:nigerianstat.gov.ng` |
| `filetype:` | Only this type of file | `SME survey filetype:pdf` |
| `-` | Leave this word out | `python -snake` |
| `OR` | Either word (in capitals) | `SME OR "small business"` |
| `after:` / `before:` | Pages dated after or before | `fintech Nigeria after:2023-01-01` |

Combine them: `"mobile money" Nigeria site:.gov.ng filetype:pdf` finds PDF reports on mobile money from Nigerian government websites.

> [!TIP]
> `site:.gov.ng`, `site:.edu` or `site:.org` narrow results to governments, universities or organisations. That doesn't guarantee quality, but it removes a lot of noise.

## Search where the research is

For assignments you usually need **academic** and **official** sources:

- **Google Scholar** (scholar.google.com) searches journal articles, theses and books. Two features worth knowing: **Cited by** (newer work that builds on an article: often the most useful click) and the **date filter** on the left for recent work.
- **Your school's library portal** often gives free access to databases your lecturers expect you to use.
- **Official statistics** come from the organisation itself: the **National Bureau of Statistics** (nigerianstat.gov.ng), the **Central Bank of Nigeria** (cbn.gov.ng), the **World Bank**, the **WHO**. Use the original, not a blog quoting it.

## Keep a search log

As you go, note each useful source and **the search that found it**. When your lecturer asks where a figure came from, or you need more sources at midnight before the deadline, you'll know exactly what to do.

```text
Source: NBS, Nigeria Labour Force Survey, latest quarter (nigerianstat.gov.ng)
Search: unemployment site:nigerianstat.gov.ng filetype:pdf
Why useful: official unemployment figures by age group
```

## Try it

```task
{
  "id": "rsrch-m01-t1",
  "prompt": "Write one Google search that finds **PDF files** about **unemployment** from the **National Bureau of Statistics' website** (nigerianstat.gov.ng) only.",
  "minutes": 3,
  "rows": 2,
  "placeholder": "unemployment ...",
  "rules": [
    { "label": "Searches for unemployment", "pattern": "unemployment" },
    { "label": "Limited to the NBS website with site:", "pattern": "site:\\s*(www\\.)?nigerianstat\\.gov\\.ng" },
    { "label": "Only PDF files with filetype:", "pattern": "filetype:\\s*pdf" }
  ],
  "sample": "unemployment site:nigerianstat.gov.ng filetype:pdf",
  "note": "Try it in Google. Add a phrase in quotes, like \"labour force\", to narrow it further.",
  "required": true
}
```

```task
{
  "id": "rsrch-m01-t2",
  "prompt": "Take a research question of your own (or: *Is social media bad for students' grades?*). Write, one per line: your **keywords**, then **two synonyms** for one of them, then **one search with an operator** that you'd actually run.",
  "minutes": 5,
  "rows": 4,
  "placeholder": "Keywords: ...\nSynonyms: ...\nSearch: ...",
  "rules": [
    { "label": "At least three lines", "minLines": 3 },
    { "label": "Lists synonyms", "pattern": "synonym|also called|or |/" },
    { "label": "One search uses an operator (\"quotes\", site:, filetype:, OR, -, after:)", "pattern": "[\"“][^\"”\\n]+[\"”]|site:|filetype:|\\bOR\\b|after:|before:|\\s-\\w" },
    { "label": "Keywords, not a full question (no question mark)", "pattern": "^\\s*keywords?\\s*:[^\\n]*\\?", "absent": true }
  ],
  "sample": "Keywords: social media use, academic performance, university students, Nigeria\nSynonyms: academic performance / grades / CGPA\nSearch: \"social media use\" \"academic performance\" students Nigeria after:2020-01-01",
  "required": true
}
```

```task
{
  "id": "rsrch-m01-t3",
  "prompt": "Run your searches in Google and Google Scholar. Write a **search log entry** for the best source you found: the source with its website, the exact search that found it, and why it's useful.",
  "minutes": 2,
  "rows": 4,
  "placeholder": "Source: ...\nSearch: ...\nWhy useful: ...",
  "rules": [
    { "label": "Names the source and where it's from (a website, journal or link)", "pattern": "https?://|www\\.|\\.org|\\.gov|\\.edu|\\.ng|\\.com|journal|scholar" },
    { "label": "Includes the search you used", "pattern": "search\\s*:" },
    { "label": "Says why it's useful", "pattern": "useful|because|gives|shows|provides|has data|figures" }
  ],
  "sample": "Source: Nigeria Labour Force Survey (latest quarter), National Bureau of Statistics (nigerianstat.gov.ng)\nSearch: unemployment site:nigerianstat.gov.ng filetype:pdf\nWhy useful: official unemployment rates by age group, so I can show how youth unemployment compares with the national rate.",
  "required": true
}
```
