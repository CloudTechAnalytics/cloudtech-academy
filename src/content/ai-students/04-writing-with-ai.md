---
title: Writing with AI, Honestly
minutes: 25
handsOn: 5
summary: Use AI as a writing coach, not a ghostwriter: plan your own argument, ask for a list of problems instead of a rewrite, fix them yourself, and declare honestly how you used AI.
---

## A coach, not a ghostwriter

There's a big difference between these two requests:

- **"Write my essay on social media regulation."** The AI does the thinking. You learn nothing, the result sounds like everyone else's, and in most courses it isn't allowed.
- **"Here's my paragraph. List what's unclear or weak. Don't rewrite it."** You do the thinking; the AI points at problems; you fix them and get better at writing.

![Asking an AI to write your essay means it does the thinking; asking it to list the problems in your draft means you do the thinking; a four-step routine of plan, write, ask for problems and declare](/images/courses/ai-students/coach-not-ghostwriter.svg "A coach lists the problems; a ghostwriter does your thinking.")

The second approach keeps the work yours and keeps you within most schools' rules. Always check your course's AI policy first: if it says no AI in assessed writing, that includes feedback on drafts.

## Plan your own argument

A good plan is half the essay. Give the AI **your** position and points, and ask only for structure:

```text
My essay question is "Should social media be regulated in Nigeria?"
My position: yes, but lightly, with strong protection for free speech.
My points: misinformation during elections, cyberbullying of young people,
the risk that regulation is used to silence critics. Suggest a structure
with an introduction, three body sections and a conclusion, and tell me
what kind of evidence each section needs. Don't write any of the essay.
```

Then write each section yourself, following the plan and using sources you've found and read.

## Ask for problems, not rewrites

Here's a real-style draft paragraph from a student essay:

```text
Social media has many effects on society in this modern day and age. In
today's world, there is no doubt that social media has both advantages and
disadvantages that affect people in various ways. Some people believe it
should be regulated while some people believe it should not be regulated.
Misinformation is a problem. In conclusion, regulation is important.
```

Instead of "improve this", ask for a list:

```text
Here is a paragraph from my essay. Don't rewrite it. List the 4 biggest
problems with it, in order of importance, and explain each in one sentence.
```

A good reply:

```text
1. No clear point: the paragraph never says what it argues.
2. Filler: "in this modern day and age" and "in today's world" say the same
   thing and add nothing.
3. No evidence or example: "misinformation is a problem" needs a specific
   case or source.
4. "In conclusion" in a body paragraph confuses the reader, and the final
   sentence doesn't follow from what came before.
```

Now **you** fix each problem. That's the learning: next time, you won't write the filler in the first place.

> [!WARNING]
> Watch for AI "voice" creeping in: *delve*, *tapestry*, *moreover* in every paragraph, *in today's fast-paced world*, and a smooth, general style with no specific examples. Lecturers notice it, and it's weaker writing anyway. Your own voice, with your own examples, is more convincing.

## Say how you used it

If your course allows AI, it may ask you to **declare** how you used it. A short, specific, honest note is enough:

> I used ChatGPT to suggest a structure for this essay and to list problems in two draft paragraphs, which I then revised myself. All research, arguments and writing are my own.

Be specific about **what** you used it for. "I used AI" alone tells the reader nothing.

## Try it

```task
{
  "id": "aistu-m04-t1",
  "prompt": "Rewrite the student paragraph above **yourself**, fixing the four problems: make a clear point in the first sentence, cut the filler, add one specific example (real or clearly realistic), and don't use \"in conclusion\".",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Social media should be regulated because ...",
  "rules": [
    { "label": "No filler phrases (\"modern day and age\", \"in today's world\", \"there is no doubt\")", "pattern": "modern day|day and age|today's world|there is no doubt|no doubt that", "absent": true },
    { "label": "No \"in conclusion\" in a body paragraph", "pattern": "in conclusion", "absent": true },
    { "label": "No AI-style words (delve, tapestry, moreover, fast-paced)", "pattern": "delve|tapestry|moreover|fast-paced|in the realm", "absent": true },
    { "label": "Includes a specific example (a year, a number, a named event or platform)", "pattern": "\\d|whatsapp|facebook|twitter|x \\(|tiktok|instagram|election|inec|covid" },
    { "label": "A real paragraph: 50 to 130 words", "minWords": 50, "maxWords": 130 }
  ],
  "sample": "Social media should be regulated in Nigeria, but only to limit harm that spreads faster than it can be corrected. During the 2023 elections, false results and edited videos circulated widely on WhatsApp and X before any official figures were released, and corrections reached far fewer people than the original posts. Light rules, such as requiring platforms to label disputed election content and act quickly on court orders, would reduce this harm without giving the government power to remove criticism.",
  "note": "The first sentence makes a claim; the middle gives evidence; the last sentence ties it back to the argument. In a real essay, the evidence in the middle needs a source you've read.",
  "required": true
}
```

```task
{
  "id": "aistu-m04-t2",
  "prompt": "Write the prompt you'd use to get **feedback, not a rewrite**, on a paragraph of your own. Say what kind of feedback you want and how many points.",
  "minutes": 4,
  "rows": 4,
  "placeholder": "Here is a paragraph from my ... Don't rewrite it. ...",
  "rules": [
    { "label": "Tells it not to rewrite", "pattern": "don't rewrite|do not rewrite|no rewrit|without rewriting|don't change|do not change|don't fix" },
    { "label": "Asks for a list of problems or feedback", "pattern": "list|problems|weak|unclear|feedback|issues|point out" },
    { "label": "Sets a number or focus (3 problems, the argument, clarity…)", "pattern": "\\d|three|four|five|argument|clarity|evidence|structure|grammar" }
  ],
  "sample": "Here is a paragraph from my essay on youth unemployment. Don't rewrite it. List the 3 biggest problems with my argument and clarity, in order of importance, with one sentence each on why it's a problem.",
  "required": true
}
```

```task
{
  "id": "aistu-m04-t3",
  "prompt": "Write an honest **AI-use declaration** for a piece of work where you used AI for planning and feedback only.",
  "minutes": 3,
  "rows": 3,
  "placeholder": "I used ...",
  "rules": [
    { "label": "Names the tool you used", "pattern": "chatgpt|claude|gemini|copilot|perplexity|ai assistant|meta ai" },
    { "label": "Says specifically what you used it for (structure, outline, feedback, grammar…)", "pattern": "structure|outline|plan|feedback|problems|grammar|spelling|questions|ideas" },
    { "label": "Says what is your own work", "pattern": "my own|i wrote|written by me|i revised|myself|are mine" }
  ],
  "sample": "I used ChatGPT to suggest an essay structure and to list problems in two of my draft paragraphs, which I then revised myself. All research, arguments and writing are my own.",
  "required": true
}
```
