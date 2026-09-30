import type { AssessmentDef } from "../types";

const C = "research-skills-for-students";

/** Research Skills for Students: a check for each module (it awards the module badge) and a final assessment. */
export const RSRCH_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "rsrch-m01-check",
    courseId: C,
    kind: "module",
    moduleId: "rsrch-m01",
    title: "Search Like a Pro: module check",
    passingScore: 60,
    questions: [
      { id: "rsrch-m01-q1", prompt: "Which search is likely to work best?", options: ["What are the effects of youth unemployment in Nigeria?", "youth unemployment Nigeria effects", "unemployment", "please help me find information"], answer: 1, explanation: "Search engines match key words, not whole questions." },
      { id: "rsrch-m01-q2", prompt: "What does putting words in \"quotes\" do on Google?", options: ["Searches for that exact phrase", "Removes those words", "Searches images only", "Translates them"], answer: 0, explanation: "Quotes find the exact phrase." },
      { id: "rsrch-m01-q3", prompt: "Which search finds PDFs about SMEs only on Nigerian government websites?", options: ["SME pdf government", "SME site:.gov.ng filetype:pdf", "SME -pdf", "\"SME government pdf\""], answer: 1, explanation: "site: limits the website; filetype: limits the file type." },
      { id: "rsrch-m01-q4", prompt: "Where should you search for journal articles?", options: ["Google Scholar or your school library portal", "Instagram", "WhatsApp groups", "Online shops"], answer: 0, explanation: "They search academic sources." },
      { id: "rsrch-m01-q5", prompt: "In Google Scholar, what does 'Cited by' help you find?", options: ["Newer work that builds on the article", "The author's phone number", "Cheaper books", "Images"], answer: 0, explanation: "It lists later papers that cite this one." },
    ],
  },
  {
    id: "rsrch-m02-check",
    courseId: C,
    kind: "module",
    moduleId: "rsrch-m02",
    title: "Judge Your Sources: module check",
    passingScore: 60,
    questions: [
      { id: "rsrch-m02-q1", prompt: "Which source is usually strongest for an assignment?", options: ["A peer-reviewed journal article", "An anonymous blog", "A viral WhatsApp message", "A social media comment"], answer: 0, explanation: "Peer-reviewed work has been checked by experts." },
      { id: "rsrch-m02-q2", prompt: "What is 'lateral reading'?", options: ["Opening new tabs to check what others say about a source or claim", "Reading faster", "Reading only the first line", "Reading sideways on your phone"], answer: 0, explanation: "Fact-checkers judge a source by what reliable others say about it." },
      { id: "rsrch-m02-q3", prompt: "A statistic appears with no link to where it came from. What should you do?", options: ["Trace it back to the original source before using it", "Use it anyway", "Round it up", "Share it"], answer: 0, explanation: "Unsourced statistics are easy to get wrong or fake." },
      { id: "rsrch-m02-q4", prompt: "Which is a red flag?", options: ["A named author and date", "No author, no date and no sources", "References at the end", "A university website"], answer: 1, explanation: "Missing author, date and sources are warning signs." },
      { id: "rsrch-m02-q5", prompt: "What does the 'T' in SIFT stand for?", options: ["Trace claims to the original", "Type faster", "Trust the headline", "Translate"], answer: 0, explanation: "Stop, Investigate the source, Find better coverage, Trace claims." },
    ],
  },
  {
    id: "rsrch-m03-check",
    courseId: C,
    kind: "module",
    moduleId: "rsrch-m03",
    title: "Cite and Organise: module check",
    passingScore: 60,
    questions: [
      { id: "rsrch-m03-q1", prompt: "When must you cite a source?", options: ["When you use someone's words, ideas or data", "Only when you quote exactly", "Never, if you change a few words", "Only in exams"], answer: 0, explanation: "Ideas and data need citing too, even in your own words." },
      { id: "rsrch-m03-q2", prompt: "What is plagiarism?", options: ["Presenting someone else's words or ideas as your own", "Citing too many sources", "Using a reference manager", "Writing a summary"], answer: 0, explanation: "It can happen by accident, so good habits matter." },
      { id: "rsrch-m03-q3", prompt: "Which is a proper paraphrase?", options: ["Changing two words of a sentence", "Expressing the idea in your own words and structure, with a citation", "Copying without quotes", "Deleting the citation"], answer: 1, explanation: "A paraphrase is genuinely your own wording, and still cited." },
      { id: "rsrch-m03-q4", prompt: "What does a reference manager like Zotero do?", options: ["Saves sources and formats citations for you", "Writes your essay", "Checks your grammar", "Finds free phones"], answer: 0, explanation: "It stores sources and builds citations in your style." },
      { id: "rsrch-m03-q5", prompt: "Which referencing style should you use?", options: ["The one your department specifies", "Any style you like", "No style", "A different style for each source"], answer: 0, explanation: "Follow your department's style guide exactly." },
    ],
  },
  {
    id: "research-skills-for-students-final",
    courseId: C,
    kind: "final",
    title: "Research Skills for Students: final assessment",
    passingScore: 60,
    questions: [
      { id: "rsrch-f01", prompt: "Which operator limits results to one website or domain?", options: ["site:", "filetype:", "OR", "\"quotes\""], answer: 0, explanation: "site: restricts results to a domain." },
      { id: "rsrch-f02", prompt: "Why try synonyms when searching?", options: ["Different words find different sources", "Search engines require them", "It makes results shorter", "It's faster to type"], answer: 0, explanation: "Experts may use other terms for the same idea." },
      { id: "rsrch-f03", prompt: "Which is the most reliable source of official Nigerian statistics?", options: ["The National Bureau of Statistics", "A viral tweet", "A random blog", "A forwarded message"], answer: 0, explanation: "Get statistics from the organisation that produces them." },
      { id: "rsrch-f04", prompt: "What should you check about any source?", options: ["Who wrote it, where it's published, when, why and what evidence it uses", "Only its colours", "Only the headline", "How many likes it has"], answer: 0, explanation: "Those five checks reveal most weak sources." },
      { id: "rsrch-f05", prompt: "A headline is designed to make you angry and has no sources. What's the best reaction?", options: ["Check it against reliable coverage before believing or sharing it", "Share it immediately", "Believe it because it's shocking", "Quote it in your essay"], answer: 0, explanation: "Emotional headlines with no sources are red flags." },
      { id: "rsrch-f06", prompt: "You use a statistic from a report, in your own words. Do you cite it?", options: ["Yes, data always needs a citation", "No, because it's in your own words", "Only if it's a quote", "Only in the reference list"], answer: 0, explanation: "Data and ideas need citing even when paraphrased." },
      { id: "rsrch-f07", prompt: "Which pair makes up a citation in APA or Harvard?", options: ["An in-text citation and a reference-list entry", "A footnote and a photo", "A hashtag and a link", "A title and a page colour"], answer: 0, explanation: "Both styles use in-text citations plus a reference list." },
      { id: "rsrch-f08", prompt: "When should you build your reference list?", options: ["As you research and write", "The night before the deadline", "After submitting", "Never"], answer: 0, explanation: "Saving sources as you go avoids lost references and accidental plagiarism." },
    ],
  },
];
