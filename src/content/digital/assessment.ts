import type { AssessmentDef } from "../types";

const C = "digital-skills-for-students";

/**
 * Digital Skills for Students: a check for each module (it awards the module badge, and
 * unlocks only after the module's tasks are done) and a final assessment. Questions are
 * scenarios with plausible wrong answers.
 */
export const DIGI_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "digi-m01-check",
    courseId: C,
    kind: "module",
    moduleId: "digi-m01",
    title: "Files and Cloud Storage: module check",
    passingScore: 60,
    questions: [
      { id: "digi-m01-q1", prompt: "Which file name follows this course's rules?", options: ["final final assignment.docx", "Document1.docx", "ECO201-assignment-2-demand-curves.docx", "my assignment (2).docx"], answer: 2, explanation: "Course code first, hyphens, says what it is." },
      { id: "digi-m01-q2", prompt: "Why write dates in file names as 2026-03-14 rather than 14-03-2026?", options: ["It looks more professional", "Files then sort in date order automatically", "Computers can't read other formats", "It's shorter"], answer: 1, explanation: "Year-month-day sorts correctly as text." },
      { id: "digi-m01-q3", prompt: "Your laptop is stolen. Which files are safe?", options: ["Everything in Downloads", "Only files kept in a synced cloud folder like Google Drive or OneDrive", "Files on the desktop", "None"], answer: 1, explanation: "Cloud sync keeps a copy online." },
      { id: "digi-m01-q4", prompt: "A group member only needs to read your report. Which access should you give?", options: ["Editor", "Viewer", "Owner", "Anyone with the link can edit"], answer: 1, explanation: "Give the least access people need." },
      { id: "digi-m01-q5", prompt: "You need to send a 40 MB video to a lecturer. What's the best way?", options: ["Attach it to an email", "Share a view-only cloud link", "Split it into 10 emails", "Print it"], answer: 1, explanation: "Links avoid attachment limits." },
    ],
  },
  {
    id: "digi-m02-check",
    courseId: C,
    kind: "module",
    moduleId: "digi-m02",
    title: "Google Workspace for Students: module check",
    passingScore: 60,
    questions: [
      { id: "digi-m02-q1", prompt: "You want to propose changes to a group report without overwriting the owner's text. What should you use?", options: ["Edit directly", "Suggesting mode", "Download and email it", "Copy into a new document"], answer: 1, explanation: "Suggestions can be accepted or rejected." },
      { id: "digi-m02-q2", prompt: "A teammate says they wrote a section, but you're not sure. Where can you check?", options: ["The file name", "File → Version history", "The Share button", "The spelling checker"], answer: 1, explanation: "Version history shows who wrote what, and when." },
      { id: "digi-m02-q3", prompt: "Which formula counts the cells in D2:D20 that say Done?", options: ["=SUM(D2:D20)", "=COUNTIF(D2:D20, \"Done\")", "=COUNT(\"Done\")", "=IF(D2:D20 = Done)"], answer: 1, explanation: "COUNTIF counts cells matching a condition." },
      { id: "digi-m02-q4", prompt: "You've collected 120 Google Form responses. How do you analyse them?", options: ["Read each one on screen", "Responses → Link to Sheets", "Print the form", "Email each respondent"], answer: 1, explanation: "Every answer lands in a spreadsheet." },
      { id: "digi-m02-q5", prompt: "How do you add your Monday 10am lecture for the whole semester to Google Calendar?", options: ["Create it every week by hand", "Create one event and set it to repeat weekly", "Write it in Docs", "Add it as a task"], answer: 1, explanation: "Recurring events save time." },
    ],
  },
  {
    id: "digi-m03-check",
    courseId: C,
    kind: "module",
    moduleId: "digi-m03",
    title: "Professional Email: module check",
    passingScore: 60,
    questions: [
      { id: "digi-m03-q1", prompt: "Which email address should you use for a job application?", options: ["sweetgirl2004@gmail.com", "amaka.obi@gmail.com", "bigboss_king@yahoo.com", "xyz123abc@gmail.com"], answer: 1, explanation: "Simple and professional." },
      { id: "digi-m03-q2", prompt: "Which subject line is best for an extension request?", options: ["Hello sir", "Please help", "ECO 201 - Request for extension on Assignment 2 (Matric 21/0453)", "Urgent"], answer: 2, explanation: "Specific, so they know what it's about before opening it." },
      { id: "digi-m03-q3", prompt: "Which sentence is most appropriate to a lecturer?", options: ["pls sir i need d result asap", "Could you please let me know when the results will be released?", "Send me my result", "Hey, where's my result?"], answer: 1, explanation: "Polite, clear, no text-speak." },
      { id: "digi-m03-q4", prompt: "Your email says 'I have attached my medical note.' What must you check before sending?", options: ["The font", "That the attachment is actually there", "The time of day", "Nothing"], answer: 1, explanation: "Forgotten attachments are the most common email slip." },
      { id: "digi-m03-q5", prompt: "You haven't had a reply after five working days. What should you do?", options: ["Send three emails the same day", "Reply to your own email with a short, polite follow-up", "Complain to the department", "Give up"], answer: 1, explanation: "A polite follow-up keeps the context in one thread." },
    ],
  },
  {
    id: "digi-m04-check",
    courseId: C,
    kind: "module",
    moduleId: "digi-m04",
    title: "Stay Safe Online: module check",
    passingScore: 60,
    questions: [
      { id: "digi-m04-q1", prompt: "Which password is strongest?", options: ["Tunde1234", "P@ssw0rd", "Jollof-Rice-At-Eight-Tonight!", "123456789"], answer: 2, explanation: "Length beats complexity, and a passphrase is easy to remember." },
      { id: "digi-m04-q2", prompt: "Someone calling from 'your bank' asks for the OTP just sent to your phone. What should you do?", options: ["Give it, they're from the bank", "Refuse and hang up; no genuine organisation asks for your code", "Give half of it", "Ask them to call back"], answer: 1, explanation: "Never share verification codes." },
      { id: "digi-m04-q3", prompt: "Which account should you protect with two-step verification first?", options: ["A game account", "Your main email", "A shopping app", "A news site"], answer: 1, explanation: "Email can reset all your other accounts." },
      { id: "digi-m04-q4", prompt: "A friend messages on WhatsApp asking urgently for ₦20,000. What should you do?", options: ["Send it quickly", "Call them on a number you know to check it's really them", "Reply with your bank details", "Forward it to others"], answer: 1, explanation: "Hacked accounts are often used to ask friends for money." },
      { id: "digi-m04-q5", prompt: "An internship offer asks you to pay ₦15,000 for 'training materials' before you start. What is it most likely to be?", options: ["Normal practice", "A scam", "A scholarship", "A tax"], answer: 1, explanation: "Genuine employers don't charge you to start work." },
    ],
  },
  {
    id: "digital-skills-for-students-final",
    courseId: C,
    kind: "final",
    title: "Digital Skills for Students: final assessment",
    passingScore: 60,
    questions: [
      { id: "digi-f01", prompt: "Which folder structure follows this course?", options: ["Everything in Downloads", "School / 2025-2026 / ECO 201 / Assignments", "One folder per file", "A folder for each day"], answer: 1, explanation: "Shallow and organised by session and course." },
      { id: "digi-f02", prompt: "What's the main benefit of keeping your School folder in Google Drive or OneDrive?", options: ["Files open faster", "Automatic backup if your device is lost", "Free printing", "Better fonts"], answer: 1, explanation: "Cloud sync protects your work." },
      { id: "digi-f03", prompt: "Which Google tool collects survey responses into a spreadsheet?", options: ["Docs", "Forms", "Calendar", "Slides"], answer: 1, explanation: "Forms links to Sheets." },
      { id: "digi-f04", prompt: "What does Suggesting mode in Google Docs do?", options: ["Deletes others' text", "Shows your changes as suggestions the owner can accept or reject", "Translates the document", "Locks the document"], answer: 1, explanation: "Good for group work." },
      { id: "digi-f05", prompt: "Which email sign-off is most professional?", options: ["Thx", "Kind regards, Amaka Obi", "Bye", "Sent from my iPhone"], answer: 1, explanation: "A proper sign-off and your full name." },
      { id: "digi-f06", prompt: "Which is a sign of phishing?", options: ["A message from a known contact about a meeting you arranged", "A threat that your account closes in 24 hours unless you click a link", "A receipt for something you bought", "A newsletter you subscribed to"], answer: 1, explanation: "Urgency plus a link is a classic pattern." },
      { id: "digi-f07", prompt: "Which web address is most likely genuine for your bank's login?", options: ["yourbank-secure-login.xyz", "login.yourbank.com.ng", "yourbank.com.ng.verify-account.net", "y0urbank.com"], answer: 1, explanation: "Check the real domain just before the first single slash." },
      { id: "digi-f08", prompt: "What should you avoid posting publicly?", options: ["A photo of your graduation", "Your home address and travel plans", "Your project", "A thank-you post"], answer: 1, explanation: "Protect your personal information." },
    ],
  },
];
