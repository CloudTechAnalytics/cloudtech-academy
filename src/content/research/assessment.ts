import type { AssessmentDef } from "../types";

/**
 * Research Skills for Students: a check for each module (it awards the module badge, and
 * unlocks only after the module's tasks are done) and a final assessment. Questions are
 * scenarios with plausible wrong answers.
 */
export const RSRCH_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "rsrch-m01-check",
    courseId: "research-skills-for-students",
    kind: "module",
    moduleId: "rsrch-m01",
    title: "Search Like a Pro: module check",
    passingScore: 60,
    questions: [
      { id: "rsrch-m01-q1", prompt: "Which search is likely to work best for an assignment on youth unemployment?", options: ["What are the effects of youth unemployment in Nigeria?", "\"youth unemployment\" Nigeria effects", "unemployment", "please help me find information on unemployment"], answer: 1, explanation: "Key terms, with the phrase kept together in quotes." },
      { id: "rsrch-m01-q2", prompt: "You want only PDF reports from Nigerian government websites about mobile money. Which search?", options: ["mobile money Nigeria government pdf", "\"mobile money\" site:.gov.ng filetype:pdf", "mobile money -gov -pdf", "site:pdf mobile money"], answer: 1, explanation: "site: limits the domain; filetype: limits the file type." },
      { id: "rsrch-m01-q3", prompt: "You found a useful 2015 article on Google Scholar. How do you find newer work that builds on it?", options: ["Search the title again", "Click 'Cited by' under the result", "Use filetype:pdf", "Add -2015 to the search"], answer: 1, explanation: "'Cited by' lists later work that cites the article." },
      { id: "rsrch-m01-q4", prompt: "Your search for 'small business' misses lots of relevant papers. What's the best next step?", options: ["Give up on the topic", "Try synonyms experts use, like SME and micro-enterprise", "Search the same words again", "Add more question words"], answer: 1, explanation: "Different words find different sources." },
      { id: "rsrch-m01-q5", prompt: "Where should a statistic on Nigeria's unemployment rate come from?", options: ["A blog that quotes it", "The National Bureau of Statistics' own publication", "A WhatsApp graphic", "Any site on the first page of Google"], answer: 1, explanation: "Use the organisation that produces the figure." },
    ],
  },
  {
    id: "rsrch-m02-check",
    courseId: "research-skills-for-students",
    kind: "module",
    moduleId: "rsrch-m02",
    title: "Judge Your Sources: module check",
    passingScore: 60,
    questions: [
      { id: "rsrch-m02-q1", prompt: "A page has no author, no date, a shocking headline and a statistic with no link. What should you do?", options: ["Use the statistic, it's striking", "Don't use it: trace the statistic to an original source or drop it", "Cite the page as 'anonymous'", "Use it if the website looks professional"], answer: 1, explanation: "Who, when and what evidence all fail." },
      { id: "rsrch-m02-q2", prompt: "What is lateral reading?", options: ["Reading a page slowly from top to bottom", "Leaving the page to check what other sources say about it and its claims", "Reading only the headings", "Reading sources side by side on paper"], answer: 1, explanation: "Fact-checkers judge a site by what others say about it." },
      { id: "rsrch-m02-q3", prompt: "A WhatsApp message says 'CBN says inflation hit 60%!!! Forward to everyone'. What's the strongest next step?", options: ["Forward it to warn people", "Find the latest official CPI report from the NBS and read the figure there", "Ask in the group if it's true", "Believe it because it mentions the CBN"], answer: 1, explanation: "Trace claims to the organisation that actually measures them." },
      { id: "rsrch-m02-q4", prompt: "A reputable newspaper quotes a World Bank figure. What should you cite?", options: ["The newspaper", "The World Bank report the figure came from, after checking it", "Both, without checking either", "Neither"], answer: 1, explanation: "Cite the original source of a statistic." },
      { id: "rsrch-m02-q5", prompt: "Which web address is a red flag for a fake news site imitating a real one?", options: ["bbc.com", "bbc-news-24.today", "nigerianstat.gov.ng", "who.int"], answer: 1, explanation: "Extra words and unusual endings are common in imitation sites." },
    ],
  },
  {
    id: "rsrch-m03-check",
    courseId: "research-skills-for-students",
    kind: "module",
    moduleId: "rsrch-m03",
    title: "Cite and Organise Your Sources: module check",
    passingScore: 60,
    questions: [
      { id: "rsrch-m03-q1", prompt: "You rewrite a source's idea entirely in your own words. Do you need to cite it?", options: ["No, the words are yours", "Yes, the idea is still someone else's", "Only if you quote it", "Only if it's a statistic"], answer: 1, explanation: "Cite ideas, words and data." },
      { id: "rsrch-m03-q2", prompt: "A student copies a sentence, changes three words and adds a citation. What is this?", options: ["A correct paraphrase", "Patchwriting, which most universities treat as plagiarism", "A quotation", "Common knowledge"], answer: 1, explanation: "A paraphrase needs your own words and sentence structure." },
      { id: "rsrch-m03-q3", prompt: "What is the APA in-text citation for a 2020 article by Adeyemi, Okon and Musa?", options: ["(Adeyemi, Okon & Musa, 2020)", "(Adeyemi et al., 2020)", "(Adeyemi 2020 et al.)", "(Adeyemi and others, 2020)"], answer: 1, explanation: "Three or more authors: first author, then et al." },
      { id: "rsrch-m03-q4", prompt: "In an APA reference, how should volume 14, issue 2 appear?", options: ["Vol. 14, No. 2", "14(2)", "14-2", "(14)2"], answer: 1, explanation: "Volume, then the issue in brackets, with no space." },
      { id: "rsrch-m03-q5", prompt: "Google Scholar's Cite button gives you a reference. What should you do?", options: ["Paste it without looking", "Use it, but check details like capitals, issue number and author names against the style guide", "Never use it", "Retype it from memory"], answer: 1, explanation: "It's a useful start, and sometimes gets details wrong." },
    ],
  },
  {
    id: "research-skills-for-students-final",
    courseId: "research-skills-for-students",
    kind: "final",
    title: "Research Skills for Students: final assessment",
    passingScore: 60,
    questions: [
      { id: "rsrch-f01", prompt: "Which operator limits results to one website or domain?", options: ["site:", "filetype:", "OR", "\"quotes\""], answer: 0, explanation: "site: restricts results to a domain." },
      { id: "rsrch-f02", prompt: "Which search finds the exact phrase 'financial inclusion'?", options: ["financial inclusion", "\"financial inclusion\"", "financial OR inclusion", "-financial inclusion"], answer: 1, explanation: "Quotation marks keep a phrase together." },
      { id: "rsrch-f03", prompt: "Which is the strongest source for an essay on Nigerian inflation?", options: ["A viral tweet", "The NBS Consumer Price Index report", "An anonymous blog", "A forum thread"], answer: 1, explanation: "The organisation that measures inflation." },
      { id: "rsrch-f04", prompt: "Which of the five checks asks whether a source exists to sell or get clicks?", options: ["Who", "When", "Why", "Where"], answer: 2, explanation: "Why: its purpose." },
      { id: "rsrch-f05", prompt: "What does the T in SIFT stand for?", options: ["Trust the first result", "Trace claims to the original", "Type better keywords", "Tell your friends"], answer: 1, explanation: "Stop, Investigate, Find better coverage, Trace to the original." },
      { id: "rsrch-f06", prompt: "Which needs a citation?", options: ["Abuja is the capital of Nigeria", "A statistic from a World Bank report", "Water boils when heated", "Lagos is a city"], answer: 1, explanation: "Data from a source must be cited; common knowledge doesn't need it." },
      { id: "rsrch-f07", prompt: "Which reference is correctly formatted in APA for a journal article?", options: ["Chinedu Eze 2023, Mobile money, Nigerian Journal, vol 14", "Eze, C. (2023). Mobile money adoption in Onitsha. Nigerian Journal of Business Research, 14(2), 45–67.", "Eze (Chinedu), Mobile money, 2023, pages 45 to 67", "Mobile money adoption. Eze 2023. 14.2"], answer: 1, explanation: "Surname, initial, year in brackets, title, journal, volume(issue), pages." },
      { id: "rsrch-f08", prompt: "What's the best time to build your reference list?", options: ["The night before the deadline", "As you find and use each source", "After submitting", "Only if the lecturer asks"], answer: 1, explanation: "Saving sources as you go prevents lost references and last-minute errors." },
    ],
  },
];
