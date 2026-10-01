import type { AssessmentDef } from "../types";

/**
 * AI Productivity Fundamentals: a check for each module (it awards the module badge, and
 * unlocks only after the module's tasks are done) and a final assessment. Questions are
 * scenarios with plausible wrong answers.
 */
export const AIPF_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "aipf-m01-check",
    courseId: "ai-productivity-fundamentals",
    kind: "module",
    moduleId: "aipf-m01",
    title: "Prompting Essentials: module check",
    passingScore: 60,
    questions: [
      { id: "aipf-m01-q1", prompt: "You ask an AI assistant to 'write a message to a customer' and get a bland letter starting 'Dear Valued Customer'. What is the most likely cause?", options: ["The AI tool is low quality", "The prompt didn't give the context, details and format it needed", "Customer messages can't be written by AI", "You should have used capital letters"], answer: 1, explanation: "With a vague prompt, the AI fills the gaps with the most average guess." },
      { id: "aipf-m01-q2", prompt: "Which prompt is most likely to get a message you can send almost as it is?", options: ["Write a polite reminder.", "Write a reminder about payment. Make it good.", "I run a tailoring shop in Aba. Remind Mr Eze, politely, that ₦25,000 for his suit is due on Friday. WhatsApp style, under 50 words.", "Reminder, customer, money, Friday."], answer: 2, explanation: "It has context, task, details and format." },
      { id: "aipf-m01-q3", prompt: "You want five product descriptions in the style of one you already like. What works best?", options: ["Describe the style in detail", "Paste the example and ask for five more in the same style", "Ask for 'professional' descriptions", "Write all five yourself first"], answer: 1, explanation: "Showing an example is more precise than describing a style." },
      { id: "aipf-m01-q4", prompt: "The AI's first draft is too formal and has the wrong closing time. What should you do?", options: ["Open a new chat and start again", "Reply in the same chat: 'Less formal, and we close at 6pm, not 8pm'", "Accept it; AI knows best", "Copy it into a different AI tool"], answer: 1, explanation: "Follow-ups in the same chat build on what it already knows." },
      { id: "aipf-m01-q5", prompt: "An AI tells you 15% of ₦240,000 is ₦32,000. What does this show?", options: ["AI never makes maths mistakes", "Numbers from AI can be wrong and need checking: the answer is ₦36,000", "15% is too complicated for AI", "You should round to ₦30,000"], answer: 1, explanation: "Language models predict text; check any number that matters." },
      { id: "aipf-m01-q6", prompt: "An AI gives you three studies, with authors and years, supporting your point. What should you do before using them?", options: ["Use them; they have authors and years", "Find each study yourself in a real source; AI can invent references that look real", "Use only the most recent one", "Ask the AI if they're real, and trust its answer"], answer: 1, explanation: "Made-up references look convincing. Only use what you've found yourself." },
    ],
  },
  {
    id: "aipf-m02-check",
    courseId: "ai-productivity-fundamentals",
    kind: "module",
    moduleId: "aipf-m02",
    title: "Using Claude: module check",
    passingScore: 60,
    questions: [
      { id: "aipf-m02-q1", prompt: "Claude summarises a supply contract and says payment is due 'within 30 days'. What should you do before telling your manager?", options: ["Nothing, Claude read the whole contract", "Find the payment clause and read it yourself", "Ask Claude again in a new chat", "Round it to a month"], answer: 1, explanation: "For numbers, dates and obligations, check the clause. Asking for clause numbers makes it quick." },
      { id: "aipf-m02-q2", prompt: "Which prompt makes a long contract quickest to check?", options: ["Is this contract good?", "Summarise this.", "List every deadline and amount of money, with the clause number each comes from, in a table.", "Make this shorter."], answer: 2, explanation: "Clause numbers let you verify each point against the original." },
      { id: "aipf-m02-q3", prompt: "A contract says late payments attract 2% interest 'for each month or part of a month'. You pay a ₦500,000 invoice 35 days late. What does 'or part of a month' mean for you?", options: ["You pay 2% once", "The 5 extra days count as a second month, so 4%", "Nothing, the days are rounded down", "Interest only applies after 60 days"], answer: 1, explanation: "Part of a month counts as a whole month. Small wording, real money." },
      { id: "aipf-m02-q4", prompt: "You need to explain a technical outage to customers. What should your prompt include?", options: ["Only the technical message", "Who the readers are, what they need to do, the tone and a length limit", "A request to make it sound impressive", "The word 'simplify' and nothing else"], answer: 1, explanation: "Rewrites work best when Claude knows the reader and the purpose." },
      { id: "aipf-m02-q5", prompt: "You use Claude every week for your catering business. What saves you repeating the same background each time?", options: ["Paste your whole menu into every chat", "A project with your price list as a file and instructions it always follows", "One very long chat for everything", "Nothing; it can't remember"], answer: 1, explanation: "Projects keep files and instructions for every chat inside them." },
      { id: "aipf-m02-q6", prompt: "Which project instruction is most useful for avoiding mistakes?", options: ["Be amazing", "Use the attached price list only; never invent a price, and ask me if unsure", "Write lots of detail", "Always agree with me"], answer: 1, explanation: "It tells Claude where the facts come from and what to do when they're missing." },
    ],
  },
  {
    id: "aipf-m03-check",
    courseId: "ai-productivity-fundamentals",
    kind: "module",
    moduleId: "aipf-m03",
    title: "Using ChatGPT: module check",
    passingScore: 60,
    questions: [
      { id: "aipf-m03-q1", prompt: "ChatGPT analyses your sales table and says sales grew 32% from May to June. What's the best next step?", options: ["Put it straight in the report", "Check that one figure yourself: (June ÷ May − 1) × 100", "Ask it to make the number bigger", "Assume it's rounded"], answer: 1, explanation: "Check the number you'll act on. Asking it to show its working also helps." },
      { id: "aipf-m03-q2", prompt: "ChatGPT cites a 2020 blog for the current fee to register a business. What should you do?", options: ["Use the fee: it has a source", "Check the fee on the official organisation's website, and trust that if they differ", "Ask for a different blog", "Average the two"], answer: 1, explanation: "Official facts come from official, current sources." },
      { id: "aipf-m03-q3", prompt: "ChatGPT links a real government page for a claim, but the page doesn't mention it. What does that tell you?", options: ["The page must be out of date", "A real link doesn't prove the claim: always check the source says what the answer says", "The claim is definitely false", "Nothing; the link is enough"], answer: 1, explanation: "AI can attach real sources to claims they don't support." },
      { id: "aipf-m03-q4", prompt: "Which custom instruction best protects you from confident wrong answers?", options: ["Keep answers short", "If you're not sure of a fact, say so instead of guessing", "Use British English", "Use lots of examples"], answer: 1, explanation: "It invites the AI to flag uncertainty instead of filling gaps." },
      { id: "aipf-m03-q5", prompt: "Which prompt will get the more useful marketing answer?", options: ["Tell me about marketing.", "Give me marketing tips.", "I sell leather sandals on Instagram from Kano at ₦12,000-₦18,000. Give five low-cost ideas for this month, each with one action, in a table.", "Marketing ideas please, as many as possible."], answer: 2, explanation: "Specific situation, specific output." },
      { id: "aipf-m03-q6", prompt: "Where can you see and delete what ChatGPT has remembered about you?", options: ["You can't", "In the settings, under personalisation and memory", "Only by deleting your account", "By asking it to forget in any chat and trusting that it did"], answer: 1, explanation: "Check the memory settings so you know what it knows about you." },
    ],
  },
  {
    id: "aipf-m04-check",
    courseId: "ai-productivity-fundamentals",
    kind: "module",
    moduleId: "aipf-m04",
    title: "Presentations with AI: module check",
    passingScore: 60,
    questions: [
      { id: "aipf-m04-q1", prompt: "What should you decide before asking AI for any slides?", options: ["The colour scheme", "Who's listening, what you want them to do or believe, and why they should care", "How many slides to make", "Which font to use"], answer: 1, explanation: "The message comes first; slides support it." },
      { id: "aipf-m04-q2", prompt: "Which slide headline is best?", options: ["Delivery Performance", "Slide 3", "1 in 8 of our deliveries is late", "Deliveries: An Overview"], answer: 2, explanation: "A headline that states the point tells the room what to take away." },
      { id: "aipf-m04-q3", prompt: "Your slide has three long paragraphs. What's the best fix?", options: ["Make the font smaller", "Cut to 3-5 short lines and move the detail into speaker notes", "Split it across four slides of paragraphs", "Read it out word for word"], answer: 1, explanation: "Slides support you; the detail belongs in what you say." },
      { id: "aipf-m04-q4", prompt: "An AI outline says a ₦9.5m van saving ₦270,000 a month 'pays for itself in 18 months'. Is that right?", options: ["Yes", "No: ₦9.5m ÷ ₦270,000 is about 35 months", "No: it's about 3 months", "You can't tell"], answer: 1, explanation: "Always check AI's arithmetic before presenting it." },
      { id: "aipf-m04-q5", prompt: "You have 10 minutes. Roughly how many content slides fit comfortably?", options: ["2", "About 5 to 8", "20", "40"], answer: 1, explanation: "About one to two minutes per slide." },
      { id: "aipf-m04-q6", prompt: "An AI slide generator gives you a polished 15-slide deck. What should you do?", options: ["Present it as it is", "Treat it as a rough draft: check facts, cut what doesn't support your message, rewrite in your words", "Add more slides", "Change only the colours"], answer: 1, explanation: "You know the audience and the facts; the tool doesn't." },
    ],
  },
  {
    id: "ai-productivity-fundamentals-final",
    courseId: "ai-productivity-fundamentals",
    kind: "final",
    title: "AI Productivity Fundamentals: final assessment",
    passingScore: 60,
    questions: [
      { id: "aipf-f01", prompt: "Which part is missing from this prompt? 'Write a short, friendly WhatsApp message under 50 words.'", options: ["Format", "Context and details: who it's from, to whom, and about what", "Tone", "Length"], answer: 1, explanation: "It says how, but not what or why." },
      { id: "aipf-f02", prompt: "The best way to get a draft from 'okay' to 'right' is to…", options: ["Start a new chat each time", "Reply with specific changes in the same chat", "Switch AI tools", "Make the prompt shorter"], answer: 1, explanation: "Follow-ups build on the conversation." },
      { id: "aipf-f03", prompt: "Which AI output most needs checking before you use it?", options: ["A rewritten paragraph in a friendlier tone", "A fee, a legal requirement or a calculated total", "Three caption ideas", "A list of brainstormed names"], answer: 1, explanation: "Facts and numbers you'll act on carry the most risk." },
      { id: "aipf-f04", prompt: "You paste a contract into Claude. What's the safest way to use its summary?", options: ["Forward the summary as the official version", "Ask for clause numbers and check the important points against the contract", "Ask for a shorter summary", "Trust it if it sounds confident"], answer: 1, explanation: "Clause numbers make checking quick." },
      { id: "aipf-f05", prompt: "What's a project in Claude for?", options: ["Sharing chats publicly", "Keeping related chats with the same files and instructions", "Making slides", "Searching the web"], answer: 1, explanation: "Background you'd otherwise repeat every time." },
      { id: "aipf-f06", prompt: "ChatGPT answers a question about current visa requirements with three links. What do you do?", options: ["Trust the answer since it has links", "Open the official source and check it says what the answer says, and that it's current", "Use whichever link loads fastest", "Ignore the links"], answer: 1, explanation: "Sources only help if you check them." },
      { id: "aipf-f07", prompt: "Which should you never paste into an AI chat?", options: ["A public report", "Your own draft email", "A customer's bank details", "A list of product names"], answer: 2, explanation: "Protect other people's private information." },
      { id: "aipf-f08", prompt: "Which presentation slide follows the advice in this course?", options: ["Title 'Overview' with 3 paragraphs", "Title '1 in 8 deliveries is late' with 3 short bullets and detail in the notes", "No title, one big table of 40 numbers", "Title 'Slide 5' with a 3D pie chart"], answer: 1, explanation: "A point-stating headline, few words, detail in your notes." },
    ],
  },
];
