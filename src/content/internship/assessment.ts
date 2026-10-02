import type { AssessmentDef } from "../types";

const C = "get-your-first-internship";

/**
 * Get Your First Internship: a check for each module (it awards the module badge, and
 * unlocks only after the module's tasks are done) and a final assessment. Questions are
 * scenarios with plausible wrong answers.
 */
export const INTERN_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "intern-m01-check",
    courseId: C,
    kind: "module",
    moduleId: "intern-m01",
    title: "Get Ready for an Internship: module check",
    passingScore: 60,
    questions: [
      { id: "intern-m01-q1", prompt: "Your SIWES starts in February. When should you start looking for a placement?", options: ["The week before", "Two to three months before", "After it has started", "Your coordinator finds it for you, so never"], answer: 1, explanation: "You usually find the organisation yourself, and good placements go early." },
      { id: "intern-m01-q2", prompt: "Two placements are offered: one where you'd mostly run errands, one where you'd help with real work in your field. Which is better for you?", options: ["The errands one, it's easier", "The one with real work in your field", "Whichever is closer to home, always", "Neither"], answer: 1, explanation: "Experience you can put on your CV and talk about matters most." },
      { id: "intern-m01-q3", prompt: "You have no work experience. How can you show 'willingness to learn'?", options: ["Say 'I'm a fast learner' on your CV", "Courses and badges you've completed on your own, and projects", "Apply to more places", "Use a bigger font"], answer: 1, explanation: "Evidence beats claims." },
      { id: "intern-m01-q4", prompt: "What should your SIWES logbook contain?", options: ["Your timetable", "Regular entries about what you did, filled in as you go", "Only the first and last day", "Your supervisor's phone number"], answer: 1, explanation: "It's assessed, and it's hard to reconstruct later." },
      { id: "intern-m01-q5", prompt: "Which CV file name stands out best to a recruiter?", options: ["CV.pdf", "CV-Chinedu-Okeke.pdf", "Document1.pdf", "MyCVFinal2.docx"], answer: 1, explanation: "Recruiters see hundreds of files called CV.pdf." },
    ],
  },
  {
    id: "intern-m02-check",
    courseId: C,
    kind: "module",
    moduleId: "intern-m02",
    title: "Find Opportunities: module check",
    passingScore: 60,
    questions: [
      { id: "intern-m02-q1", prompt: "An 'internship' asks you to pay ₦15,000 for training before you start. What should you do?", options: ["Pay, it's an investment", "Walk away: genuine employers don't charge you to start", "Negotiate the fee down", "Pay half"], answer: 1, explanation: "Paying to get a job is the clearest sign of a scam." },
      { id: "intern-m02-q2", prompt: "An offer from a big bank comes from a Gmail address. What does that suggest?", options: ["Banks use Gmail to save money", "It's probably fake; check the bank's official website and LinkedIn", "It's a special programme", "Nothing"], answer: 1, explanation: "Big organisations use their own email domains." },
      { id: "intern-m02-q3", prompt: "A small accounting firm near you doesn't advertise internships. What's the best approach?", options: ["Don't bother", "Send a short, polite enquiry email with your CV and a clear question", "Turn up without notice every day", "Message their staff on social media at midnight"], answer: 1, explanation: "Many small businesses take keen students who ask." },
      { id: "intern-m02-q4", prompt: "What do you need most for a remote internship?", options: ["A car", "A laptop, reliable internet or data, a quiet place for calls and clear writing", "An office address", "A big following on social media"], answer: 1, explanation: "Remote work depends on tools and communication." },
      { id: "intern-m02-q5", prompt: "A recruiter asks for your BVN 'for payroll' before any interview. What should you do?", options: ["Send it", "Refuse; never share your BVN, PIN or OTP with an unverified employer", "Send only part of it", "Send it by SMS instead of email"], answer: 1, explanation: "Genuine employers verify identity after an offer, through proper channels." },
    ],
  },
  {
    id: "intern-m03-check",
    courseId: C,
    kind: "module",
    moduleId: "intern-m03",
    title: "Apply and Stand Out: module check",
    passingScore: 60,
    questions: [
      { id: "intern-m03-q1", prompt: "Which approach usually works better?", options: ["The same CV sent to 100 places", "Ten applications, each tailored to the advert", "One application a month", "Applying only to famous companies"], answer: 1, explanation: "Tailoring shows employers you match what they need." },
      { id: "intern-m03-q2", prompt: "An advert mentions Canva and Google Sheets, and you've used both. What should you do with your CV?", options: ["Nothing", "Make sure those words appear, in the context of what you did with them", "Add every tool you've heard of", "Remove other skills"], answer: 1, explanation: "Use the advert's words where they're true." },
      { id: "intern-m03-q3", prompt: "How long should an internship cover letter be?", options: ["One line", "Under 200 words, in three short paragraphs", "Two pages", "As long as possible"], answer: 1, explanation: "Short and specific gets read." },
      { id: "intern-m03-q4", prompt: "Which sentence belongs in a strong cover letter?", options: ["I am a passionate, dynamic go-getter.", "I ran my department's Instagram for six weeks and grew it from 300 to 1,100 followers.", "I need this internship badly.", "Please consider me for any role."], answer: 1, explanation: "A specific example beats adjectives." },
      { id: "intern-m03-q5", prompt: "You applied two weeks ago and heard nothing. What should you do?", options: ["Apply again with the same CV", "Send one short, polite follow-up, then move on", "Call every day", "Post a complaint online"], answer: 1, explanation: "Silence is normal; one follow-up is enough." },
    ],
  },
  {
    id: "intern-m04-check",
    courseId: C,
    kind: "module",
    moduleId: "intern-m04",
    title: "Ace the Interview: module check",
    passingScore: 60,
    questions: [
      { id: "intern-m04-q1", prompt: "In a STAR answer, what should the Action part focus on?", options: ["What the team did", "What you personally did, using 'I'", "The background", "What you'd do next time"], answer: 1, explanation: "The interviewer is assessing you, not your group." },
      { id: "intern-m04-q2", prompt: "How long should your 'Tell me about yourself' answer be?", options: ["10 seconds", "About 60 seconds", "Five minutes", "As long as it takes to read your CV"], answer: 1, explanation: "A focused summary: studies, skills, why this role." },
      { id: "intern-m04-q3", prompt: "Which question is best to ask at the end of an internship interview?", options: ["How many days off do interns get?", "What would success look like for an intern after six months?", "Can I finish early on Fridays?", "I have no questions"], answer: 1, explanation: "It shows you're thinking about doing the job well." },
      { id: "intern-m04-q4", prompt: "During an online interview, where should you look when you speak?", options: ["At your own face on screen", "At the camera", "At your notes", "Out of the window"], answer: 1, explanation: "Looking at the camera reads as eye contact." },
      { id: "intern-m04-q5", prompt: "What should you do the same day after an interview?", options: ["Nothing", "Send a short thank-you email mentioning something you discussed", "Call to ask if you got it", "Post about it on social media"], answer: 1, explanation: "A brief thank-you leaves a good final impression." },
    ],
  },
  {
    id: "get-your-first-internship-final",
    courseId: C,
    kind: "final",
    title: "Get Your First Internship: final assessment",
    passingScore: 60,
    questions: [
      { id: "intern-f01", prompt: "What is SIWES?", options: ["A scholarship", "A required industrial work experience scheme for many university and polytechnic programmes", "A type of exam", "An online course"], answer: 1, explanation: "Run with the Industrial Training Fund (ITF)." },
      { id: "intern-f02", prompt: "Which is a warning sign of a fake internship?", options: ["An interview on video", "A request to pay for training before you start", "An offer letter on company letterhead after interviews", "A start date"], answer: 1, explanation: "Genuine employers pay you." },
      { id: "intern-f03", prompt: "Which source lists Nigerian internships?", options: ["Jobberman and MyJobMag", "Only newspapers", "WhatsApp chain messages", "None exist"], answer: 0, explanation: "Plus LinkedIn, company career pages and your school." },
      { id: "intern-f04", prompt: "What's the best way to tailor your CV for an application?", options: ["Change the font", "Use the advert's words for skills you really have, and put the most relevant experience first", "Make it three pages", "Remove your education"], answer: 1, explanation: "Match what they asked for, truthfully." },
      { id: "intern-f05", prompt: "Which cover letter structure does this course recommend?", options: ["Why this role, one or two matching examples, thanks and a clear close", "Your life story", "A list of skills only", "A copy of your CV"], answer: 0, explanation: "Three short paragraphs." },
      { id: "intern-f06", prompt: "What does STAR stand for?", options: ["Skills, Talent, Ability, Results", "Situation, Task, Action, Result", "Start, Try, Act, Repeat", "Story, Teamwork, Attitude, Respect"], answer: 1, explanation: "A structure for 'tell me about a time…' answers." },
      { id: "intern-f07", prompt: "How should you track your applications?", options: ["In your head", "In a sheet with company, role, date applied, status and follow-up date", "By email search", "You don't need to"], answer: 1, explanation: "So nothing slips through." },
      { id: "intern-f08", prompt: "What should you prepare before any interview?", options: ["Nothing; be spontaneous", "Research the organisation, re-read the advert, and prepare stories and questions", "Only your outfit", "A list of salary demands"], answer: 1, explanation: "Preparation shows interest and calms nerves." },
    ],
  },
];
