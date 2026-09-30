import type { AssessmentDef } from "../types";

const C = "chatgpt-for-students";

/** ChatGPT for Students: a check for each module (it awards the module badge) and a final assessment. */
export const AISTU_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "aistu-m01-check",
    courseId: C,
    kind: "module",
    moduleId: "aistu-m01",
    title: "AI Fundamentals: module check",
    passingScore: 60,
    questions: [
      { id: "aistu-m01-q1", prompt: "How does an AI assistant like ChatGPT produce its answers?", options: ["It looks each answer up in a verified database", "It predicts a likely helpful reply from patterns it learned in text", "A person types every answer", "It copies the first Google result"], answer: 1, explanation: "It predicts text from patterns, which is why it can sound right and still be wrong." },
      { id: "aistu-m01-q2", prompt: "What is a 'hallucination' in AI?", options: ["A confident answer that is made up or wrong", "A very long answer", "An answer in another language", "A slow response"], answer: 0, explanation: "AI can state false facts, figures or references confidently." },
      { id: "aistu-m01-q3", prompt: "Which of these is AI most reliable for?", options: ["Exact statistics for your essay", "References to cite", "Explaining a topic in simpler words", "Your lecturer's marking scheme"], answer: 2, explanation: "Explaining and rephrasing are its strengths; facts and references need checking." },
      { id: "aistu-m01-q4", prompt: "Before using AI for a graded assignment, what should you do first?", options: ["Check your course's rules on AI", "Ask the AI if it's allowed", "Use it and hope for the best", "Delete your notes"], answer: 0, explanation: "Each school and lecturer sets their own rules." },
      { id: "aistu-m01-q5", prompt: "Which is a good use of AI for learning?", options: ["Having it write your assessment", "Having it explain a topic and quiz you on it", "Copying its answers into an exam", "Submitting its references without checking"], answer: 1, explanation: "Use AI to understand and practise, not to do the assessment for you." },
    ],
  },
  {
    id: "aistu-m02-check",
    courseId: C,
    kind: "module",
    moduleId: "aistu-m02",
    title: "Study with AI: module check",
    passingScore: 60,
    questions: [
      { id: "aistu-m02-q1", prompt: "Why ask the AI to quiz you and wait for your answers?", options: ["Being tested helps you remember much better than rereading", "It makes the AI faster", "Quizzes are required by law", "It saves data"], answer: 0, explanation: "Testing yourself is one of the most reliable ways to learn." },
      { id: "aistu-m02-q2", prompt: "Which prompt will give the most useful explanation?", options: ["Explain elasticity.", "Elasticity?", "I'm a 100-level Economics student. Explain elasticity of demand simply, with a fuel-price example.", "Tell me everything about economics."], answer: 2, explanation: "Your level, the topic and an example make the explanation fit you." },
      { id: "aistu-m02-q3", prompt: "Why build flashcards from your own lecture notes?", options: ["It keeps the practice close to what your lecturer actually taught", "Notes are shorter than textbooks", "AI can't read textbooks", "It's faster to print"], answer: 0, explanation: "Your notes reflect your course, so the practice matches your exams better." },
      { id: "aistu-m02-q4", prompt: "An AI shows the working for a maths problem. What should you do?", options: ["Trust it completely", "Use it to understand the method, and check each step", "Copy it into your assignment", "Ignore the steps"], answer: 1, explanation: "AI can still make calculation mistakes." },
      { id: "aistu-m02-q5", prompt: "What makes a revision plan from AI actually useful?", options: ["It fits your real timetable and you follow it", "It's as long as possible", "It covers every day with no breaks", "It's in a table"], answer: 0, explanation: "A realistic plan you follow beats a perfect one you don't." },
    ],
  },
  {
    id: "aistu-m03-check",
    courseId: C,
    kind: "module",
    moduleId: "aistu-m03",
    title: "Research with AI: module check",
    passingScore: 60,
    questions: [
      { id: "aistu-m03-q1", prompt: "What is AI best used for in research?", options: ["As your source", "As a starting point: an overview and search terms", "To provide references to cite", "To decide what's true"], answer: 1, explanation: "AI points you to the research; it doesn't replace it." },
      { id: "aistu-m03-q2", prompt: "An AI gives you three references. What must you do?", options: ["Cite them straight away", "Find and open each one yourself to check it exists and says what you claim", "Ask the AI if they're real", "Use only the first one"], answer: 1, explanation: "AI can invent realistic-looking references." },
      { id: "aistu-m03-q3", prompt: "Where should you search for academic articles?", options: ["Google Scholar or your school library", "Only in the AI chat", "Social media comments", "Random blogs"], answer: 0, explanation: "Scholarly databases and libraries hold real, citable sources." },
      { id: "aistu-m03-q4", prompt: "An assistant searches the web and shows links. What's still wise?", options: ["Open the links and check the pages say what the summary claims", "Nothing, links are always correct", "Remove the links", "Only read the summary"], answer: 0, explanation: "Summaries can misstate what a page says." },
      { id: "aistu-m03-q5", prompt: "What's a good way to use AI on a real article you've found?", options: ["Ask it to summarise the argument, evidence and limitations, then read key parts yourself", "Ask it to rewrite the article as your essay", "Ask it to invent more articles", "Skip reading completely"], answer: 0, explanation: "The summary saves time; you still read and understand." },
    ],
  },
  {
    id: "aistu-m04-check",
    courseId: C,
    kind: "module",
    moduleId: "aistu-m04",
    title: "Writing with AI: module check",
    passingScore: 60,
    questions: [
      { id: "aistu-m04-q1", prompt: "Which use of AI keeps the writing yours?", options: ["Write my essay on climate change.", "Here's my draft paragraph. What's unclear?", "Write 2,000 words I can submit.", "Paraphrase this article so it's not detected."], answer: 1, explanation: "You write; the AI gives feedback." },
      { id: "aistu-m04-q2", prompt: "Why ask for a list of problems instead of a rewrite?", options: ["You learn from fixing them, and the writing stays yours", "Lists are shorter", "AI can't rewrite", "It's required"], answer: 0, explanation: "Fixing the problems yourself makes you a better writer." },
      { id: "aistu-m04-q3", prompt: "What should you ask AI for before you start writing?", options: ["A structure for your own position and points", "The finished essay", "Random quotes", "A word count"], answer: 0, explanation: "An outline of your own ideas makes writing easier." },
      { id: "aistu-m04-q4", prompt: "What can make writing sound AI-generated?", options: ["Your own examples", "Generic phrasing and words like 'delve' in every paragraph", "Short sentences", "Clear headings"], answer: 1, explanation: "Your own voice and examples are more convincing." },
      { id: "aistu-m04-q5", prompt: "Your course allows AI but asks you to declare it. What do you write?", options: ["Nothing", "A short, honest note on how you used it", "That you didn't use it", "The AI's full chat history only"], answer: 1, explanation: "For example: 'I used ChatGPT to suggest a structure and check grammar.'" },
    ],
  },
  {
    id: "chatgpt-for-students-final",
    courseId: C,
    kind: "final",
    title: "ChatGPT for Students: final assessment",
    passingScore: 60,
    questions: [
      { id: "aistu-f01", prompt: "Why can AI assistants give wrong answers confidently?", options: ["They predict likely text rather than look up verified facts", "They are always connected to your school", "They are slow", "They only speak English"], answer: 0, explanation: "Prediction from patterns can produce plausible but false answers." },
      { id: "aistu-f02", prompt: "What's the first thing to check before using AI on graded work?", options: ["Your course's rules on AI", "Your internet speed", "The AI's version", "Your word count"], answer: 0, explanation: "Rules differ between schools and lecturers." },
      { id: "aistu-f03", prompt: "Which study technique helps you remember most?", options: ["Rereading notes many times", "Being quizzed and answering before you see the answers", "Highlighting everything", "Reading AI summaries only"], answer: 1, explanation: "Testing yourself beats rereading." },
      { id: "aistu-f04", prompt: "Which prompt is best for learning?", options: ["Solve this for me.", "Explain this topic at my level, then ask me three questions and wait for my answers.", "Tell me everything.", "Write my notes."], answer: 1, explanation: "Level, explanation and a quiz make it active learning." },
      { id: "aistu-f05", prompt: "An AI suggests a reference for your essay. What do you do?", options: ["Find and read the real source before citing it", "Cite it immediately", "Cite the AI instead", "Change the author's name"], answer: 0, explanation: "AI references can be invented." },
      { id: "aistu-f06", prompt: "Where should your citations come from?", options: ["Sources you've found and read yourself", "The AI's answer", "Your friend's essay", "The first search result"], answer: 0, explanation: "You cite real sources you've checked." },
      { id: "aistu-f07", prompt: "Which is an honest use of AI in writing?", options: ["Getting feedback on your own draft", "Submitting an AI-written essay as your own", "Using AI to disguise copied text", "Letting AI write your exam answers"], answer: 0, explanation: "Feedback on your own work keeps it yours." },
      { id: "aistu-f08", prompt: "If you can't explain something you submitted, what does that suggest?", options: ["You haven't really learned it yet", "It's excellent work", "The AI was wrong", "Nothing"], answer: 0, explanation: "Being able to explain it shows you understand it." },
    ],
  },
];
