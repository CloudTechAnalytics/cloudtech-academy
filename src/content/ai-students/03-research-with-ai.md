---
title: Research with AI
minutes: 30
handsOn: 8
summary: Use AI to get an overview and search terms, find real sources yourself, summarise them with AI and check the summary against the source, and keep a research log that makes referencing easy.
---

## Where AI helps in research, and where it doesn't

AI is a strong **starting point** for research and a weak **finishing point**.

| Good for | Not good for |
| :-- | :-- |
| An overview of an unfamiliar topic | Being your source |
| Keywords, related ideas and debates to look up | Giving you references to cite |
| Summarising an article you've found | Current statistics, unless it searches and shows sources |
| Comparing arguments you've already read | Deciding what's true |

The rule: **AI points you to the research; it doesn't replace it.** Every fact and reference in your work must come from a source you have found and read yourself.

![A four-step research workflow: AI gives an overview and search terms, you find real sources, AI summarises and you check against the source, and you keep a research log](/images/courses/ai-students/research-workflow.svg "AI points to the research; you find, read and check the sources.")

## Step 1: get an overview and search terms

```text
I'm writing a 2,000-word essay on the effects of mobile money on small
businesses in Nigeria. Give me: a short overview of the topic, the 3 main
debates, and 10 search terms I could use on Google Scholar. Don't give me
references; I'll find the sources myself.
```

"Don't give me references" stops the most dangerous kind of answer: plausible citations that may not exist. Now take the search terms to **Google Scholar** (scholar.google.com), your **school library portal**, or trusted organisations' websites, not back to the chat.

**Search like a researcher.** Put phrases in quotation marks so the words stay together: `"mobile money" "small businesses" Nigeria`. Try synonyms the AI suggested ("SMEs", "micro-enterprises", "fintech", "financial inclusion"). Use Scholar's date filter to find recent work.

## Step 2: summarise a real source, then check it

Once you have a real article, AI becomes genuinely useful for reading it faster:

```text
Here is the abstract of an article I'm using. Summarise its main finding,
the evidence it uses (who, how many, where, when), and any limitations
the authors mention. Quote the exact sentence for each point.
```

"Quote the exact sentence" makes checking quick. And checking matters, because summaries go wrong in quiet ways. Here's a practice example. This is an invented abstract, written for this lesson:

```text
ABSTRACT (practice example)
This study examines whether mobile money use is linked to higher sales among
micro-enterprises in Kano State. We surveyed 412 market traders in 2023, of
whom 58% used mobile money for at least some sales. After controlling for
trader age, type of goods and years in business, mobile money users reported
average monthly sales 11% higher than non-users. Because the data come from a
single survey, we cannot show that mobile money causes higher sales; more
successful traders may simply be more likely to adopt it.
```

And here's an AI summary of it:

```text
- The study surveyed 1,200 traders across northern Nigeria.
- 58% of the traders used mobile money.
- Mobile money increases traders' sales by 11%.
- The authors call for more research.
```

Compare them line by line. Three of the four points are wrong or misleading:

- The study surveyed **412** traders in **Kano State**, not 1,200 across the north.
- The 58% figure is right.
- The authors explicitly say they **can't show mobile money causes** higher sales. "Increases" turns a link into a cause, which is the exact claim the authors warn against.
- "Call for more research" is vague and isn't what the limitation says.

If you'd cited that summary, your essay would contain two factual errors and one claim the study denies. The summary saved reading time; the check saved your marks.

## Step 3: keep a research log

For each source you actually use, write one line in a log as you go:

**Author (year), title, where you found it | what it says, with a number if there is one | which point in your essay it supports**

It takes two minutes per source, and it turns referencing at the end from a panic into a copy-paste.

> [!WARNING]
> Some assistants can **search the web and show links**, such as ChatGPT search, Gemini, Copilot or Perplexity. That's better than no sources, but open every link: summaries can misstate what a page says, exactly as in the example above.

## Try it

Use the practice abstract and AI summary above for the first two.

```answer
{
  "id": "aistu-m03-a1",
  "prompt": "How many traders did the study actually survey?",
  "answer": 412,
  "format": "number",
  "required": true
}
```

```answer
{
  "id": "aistu-m03-a2",
  "prompt": "Which word in the AI summary's third bullet turns the study's **link** into a **cause** the authors say they can't prove? Type the one word.",
  "answer": "increases",
  "format": "text",
  "accept": ["increase"],
  "explanation": "A fair version: \"Mobile money users reported 11% higher monthly sales, but the study can't show mobile money caused this.\"",
  "required": true
}
```

```task
{
  "id": "aistu-m03-t1",
  "prompt": "Pick a topic for an essay or project of your own. Write **five search terms** you'd use on Google Scholar, one per line. Use quotation marks around at least two phrases.",
  "minutes": 5,
  "rows": 6,
  "placeholder": "\"mobile money\" Nigeria SMEs\n...",
  "rules": [
    { "label": "Five search terms, one per line", "minLines": 5 },
    { "label": "At least two phrases in quotation marks", "pattern": "[\"“][^\"”\\n]+[\"”]", "min": 2 },
    { "label": "Short search terms, not sentences (under 10 words each)", "pattern": "^[ \\t]*(\\S+[ \\t]+){10,}\\S+", "absent": true }
  ],
  "sample": "\"mobile money\" \"small businesses\" Nigeria\n\"financial inclusion\" micro-enterprises\nfintech adoption \"market traders\"\n\"mobile payments\" SME performance Africa\n\"digital financial services\" Kano",
  "required": true
}
```

```task
{
  "id": "aistu-m03-t2",
  "prompt": "Find **one real source** on your topic (Google Scholar, your library, or an official website). Write its **research log entry**: author and year, title, where you found it | what it says (with a number if possible) | which point in your work it supports.",
  "minutes": 10,
  "rows": 4,
  "placeholder": "Author (2022), Title, Journal / website | It found that ... | Supports my point that ...",
  "rules": [
    { "label": "Includes a year in brackets or a date", "pattern": "\\(\\s*(19|20)\\d{2}\\s*\\)|(19|20)\\d{2}" },
    { "label": "Says where you found it (journal, website, link, library…)", "pattern": "journal|http|www\\.|doi|\\.org|\\.gov|\\.edu|scholar|library|report|press|publish" },
    { "label": "Says what the source says", "pattern": "found|shows|says|argues|reports|estimates|suggests|concludes" },
    { "label": "Says which of your points it supports", "pattern": "support|my point|evidence for|backs|use it for|shows that my" },
    { "label": "At least 25 words", "minWords": 25 }
  ],
  "sample": "World Bank (2022), The Global Findex Database 2021, worldbank.org | It reports that 45% of adults in Nigeria had an account with a bank or mobile money provider in 2021 | Supports my point that financial inclusion in Nigeria is still low, so mobile money has room to grow.",
  "note": "One line, three parts. When you write the essay, you know exactly what to cite and why.",
  "required": true
}
```
