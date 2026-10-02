import type { AssessmentDef } from "../types";

/**
 * ChatGPT & AI for Students: a check for each module (it awards the module badge, and
 * unlocks only after the module's tasks are done) and a final assessment. Questions are
 * scenarios with plausible wrong answers.
 */
export const AISTU_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "aistu-m01-check",
    courseId: "chatgpt-for-students",
    kind: "module",
    moduleId: "aistu-m01",
    title: "AI Fundamentals for Students: module check",
    passingScore: 60,
    questions: [
      { id: "aistu-m01-q1", prompt: "How does an AI assistant like ChatGPT produce its answers?", options: ["It looks each answer up in a verified database", "It predicts a likely helpful reply from patterns it learned in text", "A person types every answer", "It copies the first Google result"], answer: 1, explanation: "Prediction from patterns is why it can sound right and still be wrong." },
      { id: "aistu-m01-q2", prompt: "An AI explains the power rule correctly, then says the derivative of x³ is 3x. What does this show?", options: ["The power rule is wrong", "AI can describe a method correctly and still apply it wrongly, so check each step", "Derivatives are too hard for AI", "You should ask a different AI"], answer: 1, explanation: "The correct answer is 3x². Use AI for the method; check the working yourself." },
      { id: "aistu-m01-q3", prompt: "Your course allows AI for understanding and practice but not in assessed writing. Which use is allowed?", options: ["Pasting an AI-written introduction into your essay", "Asking AI to paraphrase a source so it isn't detected", "Asking AI for practice questions on the topic", "Having AI write your conclusion and editing a few words"], answer: 2, explanation: "Practice questions help you learn; the others put AI writing into assessed work." },
      { id: "aistu-m01-q4", prompt: "An AI gives you a reference with authors, journal and page numbers. You can't find it on Google Scholar or your library. What should you do?", options: ["Cite it anyway, it looks real", "Don't use it: it may not exist, and citing a fake source can count as misconduct", "Change the year and use it", "Cite the AI instead"], answer: 1, explanation: "AI can invent realistic references. Only cite sources you've found and read." },
      { id: "aistu-m01-q5", prompt: "Which prompt gets the most useful explanation?", options: ["Explain inflation.", "Inflation?", "I'm a 100-level economics student. Explain inflation simply with a Nigerian example, then ask me a question to check I understood.", "Write everything about inflation."], answer: 2, explanation: "Your level, an example and a check question make it a learning conversation." },
    ],
  },
  {
    id: "aistu-m02-check",
    courseId: "chatgpt-for-students",
    kind: "module",
    moduleId: "aistu-m02",
    title: "Study Smarter with AI: module check",
    passingScore: 60,
    questions: [
      { id: "aistu-m02-q1", prompt: "Why does testing yourself work better than re-reading your notes?", options: ["It's faster", "Pulling answers from memory strengthens it; re-reading mostly builds a feeling of familiarity", "Re-reading damages memory", "It doesn't; they're the same"], answer: 1, explanation: "Retrieval practice, spaced over several days, is one of the most reliable ways to remember." },
      { id: "aistu-m02-q2", prompt: "You ask an AI to quiz you, and it asks three questions then immediately answers them. What should you add to your prompt?", options: ["Make it longer", "Ask one question at a time and wait for my answer", "Use harder words", "Nothing; that's how quizzes work"], answer: 1, explanation: "Waiting for your answer is what makes it practice rather than reading." },
      { id: "aistu-m02-q3", prompt: "Why paste your own lecture notes rather than ask for flashcards on the topic in general?", options: ["It's quicker to type", "The flashcards then match what your lecturer actually taught", "AI can't make flashcards otherwise", "It makes the AI more confident"], answer: 1, explanation: "Your notes keep the AI close to your course." },
      { id: "aistu-m02-q4", prompt: "The CPI rises from 150 to 165. An AI says inflation is 15%. What is it?", options: ["15%", "10%", "9.1%", "165%"], answer: 1, explanation: "(165 − 150) ÷ 150 × 100 = 10%. Check any calculation that matters." },
      { id: "aistu-m02-q5", prompt: "Which revision-plan prompt will give the most usable plan?", options: ["Make me a revision plan.", "Plan my revision, I have exams soon.", "I have MTH101 (hardest) on 10 June and CHM101 on 12 June; I can study 3 hours on weekdays. Spread the work and give MTH101 most time.", "Tell me how to revise."], answer: 2, explanation: "Real courses, dates, time available and priorities make a plan you can follow." },
    ],
  },
  {
    id: "aistu-m03-check",
    courseId: "chatgpt-for-students",
    kind: "module",
    moduleId: "aistu-m03",
    title: "Research with AI: module check",
    passingScore: 60,
    questions: [
      { id: "aistu-m03-q1", prompt: "What is AI most useful for at the start of a research project?", options: ["Writing your reference list", "An overview of the topic and search terms to take to Google Scholar or the library", "Providing statistics to quote", "Deciding your conclusion"], answer: 1, explanation: "AI points you to the research; it doesn't replace it." },
      { id: "aistu-m03-q2", prompt: "A study found a link between mobile money and higher sales but says it can't show cause. An AI summary says 'mobile money increases sales'. What's wrong?", options: ["Nothing", "It turns a link into a cause the authors say they can't prove", "It should say 'decreases'", "It's too short"], answer: 1, explanation: "Words like 'increases' or 'causes' can change what a study claims." },
      { id: "aistu-m03-q3", prompt: "Which prompt makes an AI summary of an article quickest to check?", options: ["Summarise this.", "Make this simpler.", "Summarise the main finding, evidence and limitations, quoting the exact sentence for each point.", "Is this article good?"], answer: 2, explanation: "Quoted sentences let you check each point against the source." },
      { id: "aistu-m03-q4", prompt: "Which Google Scholar search keeps the phrase together?", options: ["mobile money small businesses", "\"mobile money\" \"small businesses\" Nigeria", "mobile+money", "MOBILE MONEY"], answer: 1, explanation: "Quotation marks search for the exact phrase." },
      { id: "aistu-m03-q5", prompt: "What belongs in a research log entry?", options: ["Only the title", "Author and year, title and where you found it, what it says, and which of your points it supports", "The AI's summary", "Your feelings about the article"], answer: 1, explanation: "Those details make referencing quick and keep each source linked to your argument." },
    ],
  },
  {
    id: "aistu-m04-check",
    courseId: "chatgpt-for-students",
    kind: "module",
    moduleId: "aistu-m04",
    title: "Writing with AI, Honestly: module check",
    passingScore: 60,
    questions: [
      { id: "aistu-m04-q1", prompt: "Which request keeps the writing yours?", options: ["Write my essay introduction", "Rewrite this paragraph to sound better", "List the three biggest problems in my paragraph; don't rewrite it", "Paraphrase this source so it isn't detected"], answer: 2, explanation: "You get feedback; you do the fixing." },
      { id: "aistu-m04-q2", prompt: "Which sentence is filler that should be cut?", options: ["During the 2023 elections, false results circulated on WhatsApp.", "In this modern day and age, there is no doubt that social media affects society.", "Platforms should label disputed election content.", "Corrections reached fewer people than the original posts."], answer: 1, explanation: "It says nothing specific; the others make a point or give evidence." },
      { id: "aistu-m04-q3", prompt: "Your course says 'no AI in assessed essays'. Can you ask AI for feedback on your draft?", options: ["Yes, feedback isn't writing", "No: if the policy bans AI in assessed essays, that includes drafts unless your lecturer says otherwise", "Only on the conclusion", "Only if you don't declare it"], answer: 1, explanation: "Follow the policy; ask your lecturer if it's unclear." },
      { id: "aistu-m04-q4", prompt: "Which AI-use declaration is best?", options: ["I used AI.", "I used ChatGPT to suggest a structure and list problems in two paragraphs, which I revised myself. The research and writing are my own.", "No AI was harmed.", "AI helped a bit."], answer: 1, explanation: "Specific about the tool, the use, and what's yours." },
      { id: "aistu-m04-q5", prompt: "A paragraph uses 'delve', 'moreover' and 'tapestry' and has no specific examples. What's the best fix?", options: ["Add more of those words", "Rewrite it in your own words with a specific example from a source you've read", "Run it through another AI", "Make it longer"], answer: 1, explanation: "Specific evidence in your own voice is more convincing than smooth, generic text." },
    ],
  },
  {
    id: "chatgpt-for-students-final",
    courseId: "chatgpt-for-students",
    kind: "final",
    title: "ChatGPT & AI for Students: final assessment",
    passingScore: 60,
    questions: [
      { id: "aistu-f01", prompt: "Why can AI assistants give wrong answers confidently?", options: ["They predict likely text rather than look up verified facts", "They are connected to your school's records", "They are slow", "They only speak English"], answer: 0, explanation: "Prediction from patterns can produce plausible but false answers." },
      { id: "aistu-f02", prompt: "Which of these is the riskiest thing to take from an AI without checking?", options: ["An explanation of a concept in simpler words", "A reference to cite in your essay", "A practice quiz", "A revision timetable"], answer: 1, explanation: "References can be invented; find and read every source yourself." },
      { id: "aistu-f03", prompt: "What makes an AI quiz actual practice?", options: ["Asking for 50 questions", "Asking it to wait for your answer to each question before marking it", "Asking for the answers first", "Using multiple choice only"], answer: 1, explanation: "Answering from memory is the practice." },
      { id: "aistu-f04", prompt: "An AI summary says a study surveyed 1,200 people. The abstract says 412. What do you do?", options: ["Use 1,200, it's bigger", "Use 412 from the source, and check the rest of the summary too", "Average them", "Leave the number out and keep the summary"], answer: 1, explanation: "The source wins, and one error is a reason to check the others." },
      { id: "aistu-f05", prompt: "Where should you search for sources after getting search terms from AI?", options: ["In the same AI chat", "Google Scholar, your library portal, or trusted organisations' websites", "Social media", "Anywhere, as long as it's quick"], answer: 1, explanation: "Real sources come from real databases and publishers." },
      { id: "aistu-f06", prompt: "Which use of AI is most likely to break a 'no AI in assessed work' rule?", options: ["Getting a topic explained before a lecture", "Making flashcards from your notes", "Pasting AI-written paragraphs into your assignment", "Planning revision"], answer: 2, explanation: "It puts AI writing into assessed work." },
      { id: "aistu-f07", prompt: "What's the best way to improve your own paragraph with AI, where allowed?", options: ["Ask it to rewrite the paragraph", "Ask for a list of problems, then fix them yourself", "Ask for a longer version", "Ask it to add quotes"], answer: 1, explanation: "You learn from each fix and the writing stays yours." },
      { id: "aistu-f08", prompt: "What should an AI-use declaration say?", options: ["Nothing specific", "Which tool you used, what you used it for, and what is your own work", "That you didn't use AI, whatever you did", "Only the date"], answer: 1, explanation: "Specific and honest." },
    ],
  },
];
