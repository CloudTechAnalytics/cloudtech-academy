---
title: Cite and Organise Your Sources
minutes: 35
handsOn: 8
summary: Reference sources correctly and avoid plagiarism: when to cite, how to paraphrase properly, APA in-text citations and reference entries built from real details, and a free reference manager to do the formatting.
---

## Why citing matters

Citing gives credit for other people's work, lets your reader check your evidence, and protects you from **plagiarism**: presenting someone else's words or ideas as your own. Universities treat plagiarism seriously, and penalties range from losing marks to failing a course.

You must cite when you use someone's:

- **Words:** a quotation.
- **Ideas:** even when you write them in your own words.
- **Data:** a statistic, table or chart.

You don't need to cite **common knowledge**: facts most people in your field know and that are easy to find, like "Abuja is the capital of Nigeria". If in doubt, cite.

## Quote, paraphrase or summarise

Here's a passage from a source. (It's a made-up example for practice.)

> *"Small retailers in Lagos who adopted mobile payment terminals reported a 15 percent increase in average daily transactions within six months, largely because customers no longer needed to carry cash."*
> Bello, A. (2022), p. 34

- **Quote:** the exact words, in quotation marks, with the page: *Bello (2022) found that sales rose "largely because customers no longer needed to carry cash" (p. 34).* Use quotations sparingly, for words that matter in themselves.
- **Paraphrase:** the idea in **your own words and sentence structure**, with a citation: *Lagos shop owners who began accepting card and transfer payments saw about 15% more transactions a day within half a year, mainly because shoppers didn't have to bring cash (Bello, 2022).*
- **Summarise:** the main point of a longer source, briefly: *Accepting digital payments increased small retailers' sales in Lagos (Bello, 2022).*

**A paraphrase that's still plagiarism:**

> *Small retailers in Lagos who adopted mobile payment terminals saw a 15 percent rise in daily transactions within six months, mostly because customers no longer needed to carry cash (Bello, 2022).*

It has a citation, but it's the original sentence with three words swapped. That's called **patchwriting**, and most universities treat it as plagiarism. Fix it by closing the source, writing the idea from memory in your own way, then checking it against the original.

## APA style, the essentials

Your department names a referencing style. **APA** (7th edition) and **Harvard** are common in Nigerian universities and look similar. Both have two parts: an **in-text citation** where you use the source, and a **reference list** at the end.

**In-text (APA):**

| Situation | Format | Example |
| :-- | :-- | :-- |
| One author | (Surname, Year) | (Bello, 2022) |
| Two authors | (Surname & Surname, Year) | (Okafor & Bello, 2021) |
| Three or more | (First author et al., Year) | (Adeyemi et al., 2020) |
| Author in your sentence | Surname (Year) | Bello (2022) found that… |
| Quotation | add the page | (Bello, 2022, p. 34) |

**Reference list entry for a journal article (APA):**

```text
Surname, A. A., & Surname, B. B. (Year). Title of the article in sentence
    case. Journal Name in Title Case, Volume(Issue), first page–last page.
    https://doi.org/...
```

For example (made up to show the format):

```text
Okafor, N., & Bello, M. (2021). Digital payments and informal traders in
    Kano. Journal of African Economic Studies, 9(3), 112–130.
```

Details matter: initials not first names, the year in brackets, the volume followed by the issue in brackets with no space, and the page range. In the real thing the journal name and volume are in *italics*. Always follow the exact guide your department gives you.

## Let a tool do the formatting

- **Zotero** (free, zotero.org): install it and its browser extension. On any article page, click the extension to save the source. In Word or Google Docs, the Zotero plugin inserts citations and builds the reference list in the style you choose.
- **Google Scholar's "Cite" button** (the quotation mark under each result) gives a ready-formatted reference. Check it: it sometimes gets capitals, issue numbers or author names wrong.
- **Word's References tab** can store sources and build a reference list too.

Whatever you use: save each source **as soon as you find it**, and build the reference list **as you write**, not the night before the deadline.

## Try it

```task
{
  "id": "rsrch-m03-t1",
  "prompt": "**Paraphrase** the Bello (2022) passage in your own words and sentence structure, with an APA in-text citation. Keep the 15% figure.",
  "minutes": 6,
  "rows": 4,
  "placeholder": "...",
  "rules": [
    { "label": "Includes an APA citation: (Bello, 2022) or Bello (2022)", "pattern": "\\(bello,\\s*2022\\)|bello\\s*\\(2022\\)" },
    { "label": "Keeps the 15% figure", "pattern": "15" },
    { "label": "Doesn't copy the original's phrases (\"adopted mobile payment terminals\", \"average daily transactions\", \"no longer needed to carry cash\")", "pattern": "adopted mobile payment terminals|average daily transactions|no longer needed to carry cash|small retailers in lagos who", "absent": true },
    { "label": "A full sentence (15 to 60 words)", "minWords": 15, "maxWords": 60 }
  ],
  "sample": "According to Bello (2022), Lagos shop owners who began accepting card and transfer payments saw about 15% more sales a day within six months, mainly because shoppers didn't have to bring cash.",
  "required": true
}
```

```answer
{
  "id": "rsrch-m03-a1",
  "prompt": "Write the APA **in-text citation** for a 2021 article by **Ngozi Okafor and Musa Bello**, in brackets.",
  "answer": "(Okafor & Bello, 2021)",
  "format": "text",
  "accept": ["(okafor and bello, 2021)", "okafor & bello, 2021", "(okafor & bello 2021)"],
  "hint": "Two authors: both surnames joined with &, then a comma and the year.",
  "required": true
}
```

```task
{
  "id": "rsrch-m03-t2",
  "prompt": "Write the **APA reference list entry** for this (made-up) article:\n\n- Authors: Chinedu Eze, Fatima Yusuf and Bola Ade\n- Year: 2023\n- Title: Mobile money adoption among market women in Onitsha\n- Journal: Nigerian Journal of Business Research\n- Volume 14, issue 2, pages 45 to 67",
  "minutes": 6,
  "rows": 4,
  "placeholder": "Eze, C., ...",
  "rules": [
    { "label": "Authors as Surname, Initial., with & before the last", "pattern": "eze,\\s*c\\.,\\s*yusuf,\\s*f\\.,\\s*&\\s*ade,\\s*b\\." },
    { "label": "Year in brackets after the authors", "pattern": "\\(2023\\)\\." },
    { "label": "The article title", "pattern": "mobile money adoption among market women in onitsha" },
    { "label": "The journal name", "pattern": "nigerian journal of business research" },
    { "label": "Volume and issue as 14(2)", "pattern": "14\\(2\\)" },
    { "label": "The page range 45–67", "pattern": "45\\s*[-–]\\s*67" }
  ],
  "sample": "Eze, C., Yusuf, F., & Ade, B. (2023). Mobile money adoption among market women in Onitsha. Nigerian Journal of Business Research, 14(2), 45–67.",
  "note": "In the real reference list, the journal name and the volume number (14) are in italics. In the text, this source would be cited as (Eze et al., 2023), because it has three authors.",
  "required": true
}
```

Then set up Zotero (or use Google Scholar's Cite button), save three real sources for a topic you're working on, and generate their reference list. Check one entry against your department's style guide.
