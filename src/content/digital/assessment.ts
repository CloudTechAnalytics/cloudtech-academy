import type { AssessmentDef } from "../types";

const C = "digital-skills-for-students";

/** Digital Skills for Students: a check for each module (it awards the module badge) and a final assessment. */
export const DIGI_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "digi-m01-check",
    courseId: C,
    kind: "module",
    moduleId: "digi-m01",
    title: "Files and Cloud Storage: module check",
    passingScore: 60,
    questions: [
      { id: "digi-m01-q1", prompt: "Which file name is best?", options: ["ECO201-assignment-2-demand-curves.docx", "Document1.docx", "final final.docx", "new.docx"], answer: 0, explanation: "It says what the file is without opening it." },
      { id: "digi-m01-q2", prompt: "Why write dates as YYYY-MM-DD in file names?", options: ["So files sort in date order", "It looks nicer", "It's required by Windows", "To make names shorter"], answer: 0, explanation: "Year first sorts correctly." },
      { id: "digi-m01-q3", prompt: "What is the main benefit of cloud storage?", options: ["Your files survive if your device is lost", "Files open faster offline", "It makes files smaller", "It removes viruses"], answer: 0, explanation: "A copy is kept online." },
      { id: "digi-m01-q4", prompt: "What access should you usually give when sharing a file?", options: ["Viewer", "Editor", "Owner", "Public editor"], answer: 0, explanation: "Give edit access only when needed." },
      { id: "digi-m01-q5", prompt: "How should you send a very large file?", options: ["Share a cloud link", "Split it into 50 emails", "Print it", "Rename it"], answer: 0, explanation: "Links avoid attachment limits." },
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
      { id: "digi-m02-q1", prompt: "Which Docs mode shows your edits as suggestions the owner can accept?", options: ["Suggesting", "Viewing", "Editing", "Printing"], answer: 0, explanation: "Suggesting mode tracks proposed changes." },
      { id: "digi-m02-q2", prompt: "How do you assign a task to someone in a Docs comment?", options: ["Type @ and their name", "Use bold text", "Change the font colour", "Email them separately"], answer: 0, explanation: "Mentioning someone assigns and notifies them." },
      { id: "digi-m02-q3", prompt: "Where can you see who wrote what in a Google Doc?", options: ["Version history", "Page setup", "Word count", "Explore"], answer: 0, explanation: "File → Version history." },
      { id: "digi-m02-q4", prompt: "Which tool is best for collecting survey responses?", options: ["Google Forms", "Google Slides", "Google Calendar", "Google Docs"], answer: 0, explanation: "Forms collects answers into a Sheet." },
      { id: "digi-m02-q5", prompt: "How do you add your weekly lectures to Google Calendar?", options: ["As recurring events that repeat weekly", "One event for the whole semester", "In a Google Doc", "As a Form"], answer: 0, explanation: "Set Repeat weekly." },
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
      { id: "digi-m03-q1", prompt: "Which subject line is best?", options: ["ECO 201 – Request for extension on Assignment 2", "Hello", "Urgent!!!", "(no subject)"], answer: 0, explanation: "Specific subjects get opened and answered." },
      { id: "digi-m03-q2", prompt: "Which email address is most professional?", options: ["amaka.obi@gmail.com", "sweetgirl2004@gmail.com", "bigboss_king@yahoo.com", "xoxo@gmail.com"], answer: 0, explanation: "Use your name." },
      { id: "digi-m03-q3", prompt: "Which greeting suits an email to a lecturer?", options: ["Dear Dr Adewale,", "Hey!", "Yo sir", "Hi dear"], answer: 0, explanation: "Formal emails need a formal greeting." },
      { id: "digi-m03-q4", prompt: "You haven't had a reply. When should you follow up?", options: ["After three to five working days", "After one hour", "Never", "Every day until they reply"], answer: 0, explanation: "Give people time, then send a short, polite follow-up." },
      { id: "digi-m03-q5", prompt: "Which is good email practice?", options: ["One topic per email and checking attachments", "Writing 'pls' and 'u'", "Very long paragraphs", "No sign-off"], answer: 0, explanation: "Clear, brief and polite." },
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
      { id: "digi-m04-q1", prompt: "Which password is strongest?", options: ["Jollof-Rice-At-Eight-Tonight!", "Tunde1234", "password", "12345678"], answer: 0, explanation: "Long passphrases are strong and memorable." },
      { id: "digi-m04-q2", prompt: "Someone claiming to be from your bank asks for the OTP you just received. What do you do?", options: ["Refuse; never share verification codes", "Share it quickly", "Share half of it", "Send it by email instead"], answer: 0, explanation: "No genuine organisation asks for your OTP." },
      { id: "digi-m04-q3", prompt: "Which account should you secure with two-step verification first?", options: ["Your email", "A game account", "A news site", "A shopping wishlist"], answer: 0, explanation: "Email can reset your other accounts." },
      { id: "digi-m04-q4", prompt: "A 'scholarship' asks you to pay ₦5,000 to process your award. This is most likely…", options: ["A scam", "A normal fee", "A government requirement", "A bank charge"], answer: 0, explanation: "Genuine scholarships don't ask winners to pay." },
      { id: "digi-m04-q5", prompt: "Why should you never reuse passwords?", options: ["If one site is hacked, attackers try it everywhere", "Sites don't allow it", "It slows your phone", "It uses more data"], answer: 0, explanation: "Reuse spreads one breach to all your accounts." },
    ],
  },
  {
    id: "digital-skills-for-students-final",
    courseId: C,
    kind: "final",
    title: "Digital Skills for Students: final assessment",
    passingScore: 60,
    questions: [
      { id: "digi-f01", prompt: "Why put the course code first in file names?", options: ["So files for the same course sort together", "It's required by Google", "It makes files smaller", "It hides the file"], answer: 0, explanation: "Consistent names sort neatly." },
      { id: "digi-f02", prompt: "How much free storage does a Google account include?", options: ["15 GB", "1 GB", "100 GB", "Unlimited"], answer: 0, explanation: "Shared between Drive, Gmail and Photos." },
      { id: "digi-f03", prompt: "What does linking a Google Form to Sheets do?", options: ["Puts every response in a spreadsheet", "Deletes responses", "Sends the form by SMS", "Prints the form"], answer: 0, explanation: "Responses → Link to Sheets." },
      { id: "digi-f04", prompt: "What should the opening line of an email to someone who doesn't know you say?", options: ["Who you are", "Your favourite colour", "An apology for existing", "Nothing"], answer: 0, explanation: "Introduce yourself briefly." },
      { id: "digi-f05", prompt: "What is phishing?", options: ["A fake message trying to steal your details or money", "A way to back up files", "A type of email signature", "A Google tool"], answer: 0, explanation: "Watch for urgency, odd links and requests for codes." },
      { id: "digi-f06", prompt: "A friend messages asking for money urgently, which is unusual. What should you do?", options: ["Call them to check it's really them", "Send it immediately", "Share your PIN", "Forward it to everyone"], answer: 0, explanation: "Their account may have been hacked." },
      { id: "digi-f07", prompt: "Which should you avoid posting publicly?", options: ["Your home address and travel plans", "A project you're proud of", "Your course badge", "A LinkedIn article"], answer: 0, explanation: "Protect personal details." },
      { id: "digi-f08", prompt: "What does a password manager do?", options: ["Stores strong, unique passwords for you", "Shares your passwords with friends", "Makes all passwords the same", "Turns off two-step verification"], answer: 0, explanation: "You only need to remember one strong password." },
    ],
  },
];
