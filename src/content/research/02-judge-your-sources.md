---
title: Judge Your Sources
minutes: 30
handsOn: 6
summary: Tell a reliable source from a weak one in minutes using five checks, read laterally like a fact-checker, trace a viral claim back to its original, and spot the red flags of misinformation.
---

## Not all sources are equal

A peer-reviewed journal article, a government statistics report and a viral WhatsApp message can all "say" something about the same topic. They aren't equally trustworthy.

| Usually strong | Use with care | Usually avoid in assignments |
| :-- | :-- | :-- |
| Peer-reviewed journal articles, academic books | Reputable newspapers; well-known organisations' reports | Anonymous blogs, social media posts |
| Official statistics (NBS, CBN, WHO, World Bank) | Wikipedia (good for an overview and for its references) | Sites selling something, clickbait sites |

![Sources grouped as usually strong, use with care and usually avoid, followed by the five checks: who, where, when, why and what evidence](/images/courses/research/source-strength.svg "How strong is this source? Five checks decide.")

"Use with care" doesn't mean "don't use". A good newspaper report is fine for recent events, but for a statistic, cite the original source the newspaper used.

## Five checks for any source

1. **Who** wrote it? A named expert or organisation, or nobody?
2. **Where** is it published? A journal, a university, a government, or an unknown site?
3. **When** was it published? Is it recent enough for your topic? Statistics from 2012 don't describe today.
4. **Why** does it exist? To inform, or to sell, campaign or get clicks?
5. **What evidence** does it give? Data and references, or just claims?

**A quick example.** A page titled *"10 Shocking Facts About Nigerian Students"* on a site called *naija-gist-daily.com* has no author, no date, and says "studies show 80% of students sleep less than 5 hours" without a link. Who? Nobody. Where? A gossip site. When? Unknown. Why? Clicks (the headline gives it away). Evidence? None. Five red marks: don't use it, and don't repeat the 80%.

## Read laterally, like a fact-checker

Professional fact-checkers don't decide whether a website is trustworthy by reading it closely; a well-designed fake looks convincing. They **leave the page** and open new tabs to see what **others** say about it. This is called **lateral reading**:

- Search the organisation's or author's name. Who are they? Who funds them?
- Search the claim itself. Do reliable sources report the same thing?
- Find the **original** source of a statistic, not a page repeating it.

A handy habit is **SIFT**: **S**top; **I**nvestigate the source; **F**ind better coverage; **T**race claims to the original.

![SIFT: stop, investigate the source, find better coverage, and trace the claim to the original](/images/courses/research/sift.svg "SIFT: Stop, Investigate, Find better coverage, Trace.")

## Trace a claim: a worked example

This message is circulating on WhatsApp:

```text
*BREAKING*  CBN says inflation hit 60% last month!!! Prices will double
before December. Forward to everyone you love. 🙏🏾
```

Tracing it:

1. **Stop.** ALL CAPS "BREAKING", "forward to everyone" and no link: classic red flags.
2. **Investigate the source.** It says "CBN", but there's no link to anything the CBN published.
3. **Find better coverage.** Search `inflation rate Nigeria` and look at reputable newspapers' latest reports. They quote a monthly inflation figure, and say where it comes from.
4. **Trace to the original.** Nigeria's official inflation rate is published by the **National Bureau of Statistics** in its monthly **Consumer Price Index (CPI)** report, at nigerianstat.gov.ng, not by the CBN. Open the latest report and read the headline figure yourself.

Whatever the real figure is this month, you now have it from the organisation that actually measures it, with a date. That's what goes in an assignment.

> [!WARNING]
> Screenshots, "forwarded many times" messages and quotes with no link are the easiest things to fake. Don't believe or share them until you've traced them.

## Red flags

- Headlines in CAPITALS, or written to make you angry or afraid.
- No author, no date, no sources.
- A statistic with no link to where it came from.
- A web address imitating a real one, such as an extra word, letter or a strange ending.

## Try it

```answer
{
  "id": "rsrch-m02-a1",
  "prompt": "Which organisation publishes Nigeria's official monthly inflation figure? Give its short name.",
  "answer": "NBS",
  "format": "text",
  "accept": ["national bureau of statistics", "the nbs", "the national bureau of statistics", "nigerian bureau of statistics"],
  "hint": "It's in step 4 of the worked example.",
  "explanation": "The National Bureau of Statistics publishes it in the monthly CPI report. The CBN uses the figure, but doesn't produce it.",
  "required": true
}
```

```task
{
  "id": "rsrch-m02-t1",
  "prompt": "Find **one online source** on a topic you're studying and run the **five checks** on it. Write one line per check, starting with `Who:`, `Where:`, `When:`, `Why:` and `Evidence:`, then a final line `Verdict:` saying whether you'd cite it and why.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "Who: ...\nWhere: ...\nWhen: ...\nWhy: ...\nEvidence: ...\nVerdict: ...",
  "rules": [
    { "label": "Who:", "pattern": "^\\s*who\\s*:\\s*\\S" },
    { "label": "Where:", "pattern": "^\\s*where\\s*:\\s*\\S" },
    { "label": "When:", "pattern": "^\\s*when\\s*:\\s*\\S" },
    { "label": "Why:", "pattern": "^\\s*why\\s*:\\s*\\S" },
    { "label": "Evidence:", "pattern": "^\\s*evidence\\s*:\\s*\\S" },
    { "label": "A verdict with a reason", "pattern": "^\\s*verdict\\s*:[^\\n]*(because|since|as |but|so )" }
  ],
  "sample": "Who: The World Bank, an international development organisation; authors named.\nWhere: worldbank.org, published as an official report.\nWhen: 2024, recent enough for my topic.\nWhy: To inform governments and researchers; it isn't selling anything.\nEvidence: Survey data from 140 countries, with methods explained and references.\nVerdict: I'd cite it, because it's an official, recent source with clear evidence.",
  "required": true
}
```

```task
{
  "id": "rsrch-m02-t2",
  "prompt": "Trace a real claim with SIFT: pick a statistic you've seen shared online or in a news article. Write the claim, then where you **traced it to** (the original source and its link), and whether the original says the same thing.",
  "minutes": 8,
  "rows": 5,
  "placeholder": "Claim: ...\nOriginal source: ...\nDoes it match: ...",
  "rules": [
    { "label": "States the claim", "pattern": "^\\s*claim\\s*:\\s*\\S" },
    { "label": "Names the original source with a link or website", "pattern": "https?://|www\\.|\\.gov|\\.org|\\.int|\\.edu|\\.ng" },
    { "label": "Says whether the original matches (yes, no, partly, matches, differs…)", "pattern": "match|same|differ|yes|no |partly|wrong|correct|exaggerat|out of date|older" }
  ],
  "sample": "Claim: A news article says over 60% of Nigerians are poor.\nOriginal source: National Bureau of Statistics, Nigeria Multidimensional Poverty Index 2022 (nigerianstat.gov.ng)\nDoes it match: Partly. The report says 63% are multidimensionally poor, which counts things like health, education and living standards, not just income. The article left that out.",
  "required": true
}
```
