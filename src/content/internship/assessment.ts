import type { AssessmentDef } from "../types";

const C = "get-your-first-internship";

/** Get Your First Internship: a check for each module (it awards the module badge) and a final assessment. */
export const INTERN_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "intern-m01-check",
    courseId: C,
    kind: "module",
    moduleId: "intern-m01",
    title: "Get Ready for an Internship: module check",
    passingScore: 60,
    questions: [
      { id: "intern-m01-q1", prompt: "What does SIWES stand for?", options: ["Students Industrial Work Experience Scheme", "Student Internship and Work Education Service", "School Industry Work Exchange System", "Summer Internship Work Experience Scheme"], answer: 0, explanation: "It's run with the Industrial Training Fund (ITF)." },
      { id: "intern-m01-q2", prompt: "Who usually finds the SIWES placement organisation?", options: ["The student", "The ITF", "The lecturer", "The bank"], answer: 0, explanation: "Start looking two to three months early." },
      { id: "intern-m01-q3", prompt: "What do employers mainly look for in students?", options: ["Willingness to learn, reliability and communication", "Ten years of experience", "A first-class degree only", "A car"], answer: 0, explanation: "They don't expect experience from students." },
      { id: "intern-m01-q4", prompt: "Which CV file name is best?", options: ["CV-Firstname-Lastname.pdf", "CV.pdf", "document.docx", "myCV(3).doc"], answer: 0, explanation: "It stands out among hundreds of CV.pdf files." },
      { id: "intern-m01-q5", prompt: "How often should you fill in your SIWES logbook?", options: ["Every day or week", "Once at the end", "Never", "Only if asked"], answer: 0, explanation: "It's assessed, so keep it up to date." },
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
      { id: "intern-m02-q1", prompt: "An 'internship' asks you to pay a ₦15,000 training fee. What is it most likely?", options: ["A scam", "A normal requirement", "A government levy", "A bank charge"], answer: 0, explanation: "Genuine employers pay you, not the other way round." },
      { id: "intern-m02-q2", prompt: "How can you find remote internships on LinkedIn?", options: ["Use the Remote filter in LinkedIn Jobs", "Only through WhatsApp", "You can't", "By changing your photo"], answer: 0, explanation: "Filter by Remote." },
      { id: "intern-m02-q3", prompt: "A small business doesn't advertise internships. What can you do?", options: ["Email them a short, polite enquiry", "Assume they won't take interns", "Visit without warning every day", "Post about them online"], answer: 0, explanation: "Many small businesses take keen students who ask." },
      { id: "intern-m02-q4", prompt: "Which is a warning sign of a fake offer?", options: ["An offer with no interview, from a free email address", "An interview on video", "A clear job description", "A company LinkedIn page"], answer: 0, explanation: "Real employers interview candidates and use company email." },
      { id: "intern-m02-q5", prompt: "What should you never share with a recruiter?", options: ["Your BVN, PIN or OTP", "Your CV", "Your portfolio link", "Your LinkedIn"], answer: 0, explanation: "No legitimate employer needs these." },
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
      { id: "intern-m03-q1", prompt: "Which approach usually works better?", options: ["Ten tailored applications", "100 identical applications", "One application a year", "Only applying to big companies"], answer: 0, explanation: "Tailored applications get more responses." },
      { id: "intern-m03-q2", prompt: "How long should an internship cover letter be?", options: ["Under 200 words", "Three pages", "One line", "As long as possible"], answer: 0, explanation: "Short letters get read." },
      { id: "intern-m03-q3", prompt: "How do you tailor your CV to an advert?", options: ["Match its skills and tools where true, and lead with relevant work", "Copy the advert into your CV", "Add skills you don't have", "Change your name"], answer: 0, explanation: "Relevant and honest." },
      { id: "intern-m03-q4", prompt: "What's the best use of AI tools for a cover letter?", options: ["Drafting and polishing, then rewriting in your own voice and checking facts", "Sending whatever it writes", "Inventing experience", "Never reading it"], answer: 0, explanation: "Recruiters notice generic AI-sounding letters." },
      { id: "intern-m03-q5", prompt: "When should you follow up on an application?", options: ["After about two weeks, once, politely", "The next morning", "Every day", "Never"], answer: 0, explanation: "One short follow-up, then move on." },
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
      { id: "intern-m04-q1", prompt: "What does STAR stand for?", options: ["Situation, Task, Action, Result", "Skills, Talent, Ability, Results", "Start, Try, Act, Repeat", "Story, Topic, Answer, Review"], answer: 0, explanation: "A structure for 'tell me about a time…' answers." },
      { id: "intern-m04-q2", prompt: "In the Action part of STAR, you should say…", options: ["What you did, using 'I'", "What the team did, using 'we' only", "What you wish happened", "Nothing"], answer: 0, explanation: "Interviewers want your contribution." },
      { id: "intern-m04-q3", prompt: "How long should 'Tell me about yourself' take?", options: ["About 60 seconds", "Ten minutes", "Five seconds", "As long as possible"], answer: 0, explanation: "A short summary of studies, skills and why this role." },
      { id: "intern-m04-q4", prompt: "In an online interview, where should you look when speaking?", options: ["At the camera", "At your own video", "At your phone", "Away from the screen"], answer: 0, explanation: "It looks like eye contact." },
      { id: "intern-m04-q5", prompt: "What should you do after an interview?", options: ["Send a short thank-you email the same day", "Call them hourly", "Nothing", "Post about it with their names"], answer: 0, explanation: "It's polite and keeps you memorable." },
    ],
  },
  {
    id: "get-your-first-internship-final",
    courseId: C,
    kind: "final",
    title: "Get Your First Internship: final assessment",
    passingScore: 60,
    questions: [
      { id: "intern-f01", prompt: "Which is a benefit of an internship?", options: ["Experience, references and sometimes a job offer", "A guaranteed first-class degree", "No more exams", "Free data forever"], answer: 0, explanation: "Internships build experience and contacts." },
      { id: "intern-f02", prompt: "When should you start looking for a SIWES placement?", options: ["Two to three months before it begins", "The day before", "After it ends", "In your first week of school"], answer: 0, explanation: "Good placements go early." },
      { id: "intern-f03", prompt: "Which is a good place to find Nigerian internships?", options: ["LinkedIn Jobs and job boards like Jobberman", "Random Instagram DMs", "Chain messages", "Pop-up ads"], answer: 0, explanation: "Use established sources and check every offer." },
      { id: "intern-f04", prompt: "Which offer should you walk away from?", options: ["One that pays ₦300,000 weekly for vague data entry", "One with a clear role and interview", "A school-arranged placement", "A company career page listing"], answer: 0, explanation: "Too good to be true usually is." },
      { id: "intern-f05", prompt: "What are the three parts of a short cover letter?", options: ["Why this role, matching examples, thanks and close", "Your life story, hobbies, family", "Salary, leave, bonus", "Greeting only"], answer: 0, explanation: "Keep it focused." },
      { id: "intern-f06", prompt: "Why track your applications in a sheet?", options: ["So you know what you applied for and when to follow up", "Employers require it", "To share it publicly", "It isn't useful"], answer: 0, explanation: "Nothing slips through." },
      { id: "intern-f07", prompt: "What should you do before an interview?", options: ["Research the organisation and prepare STAR stories", "Nothing", "Memorise the advert word for word", "Ask a friend to go for you"], answer: 0, explanation: "Preparation shows interest and calms nerves." },
      { id: "intern-f08", prompt: "Which is a good question to ask an interviewer?", options: ["What would success look like at the end of the internship?", "How soon can I take leave?", "Do I have to come every day?", "Can I skip training?"], answer: 0, explanation: "It shows you want to do well." },
    ],
  },
];
