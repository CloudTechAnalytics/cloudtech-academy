import type { AssessmentDef } from "../types";

const C = "build-your-student-portfolio";

/** Build Your Student Portfolio: a check for each module (it awards the module badge) and a final assessment. */
export const PORTF_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "portf-m01-check",
    courseId: C,
    kind: "module",
    moduleId: "portf-m01",
    title: "Plan Your Portfolio: module check",
    passingScore: 60,
    questions: [
      { id: "portf-m01-q1", prompt: "What does a portfolio do that a skills list on a CV doesn't?", options: ["It shows real work as proof of your skills", "It makes the CV longer", "It replaces your name", "It lists your hobbies"], answer: 0, explanation: "A portfolio shows what you can do instead of just saying it." },
      { id: "portf-m01-q2", prompt: "How many projects should you start with?", options: ["Your best three", "Every assignment you've ever done", "None", "At least twenty"], answer: 0, explanation: "Three strong pieces beat many weak ones." },
      { id: "portf-m01-q3", prompt: "Which project description is strongest?", options: ["Made a spreadsheet", "Built an Excel tracker that cut class dues reconciliation from two hours to ten minutes", "Did some Excel work", "Spreadsheet project"], answer: 1, explanation: "It states the problem solved and the result." },
      { id: "portf-m01-q4", prompt: "What are the four parts of each project summary?", options: ["Problem, what I did, result, link", "Name, age, hobby, photo", "Title, colour, font, size", "Price, date, place, time"], answer: 0, explanation: "The same four parts work on a page, on LinkedIn and in interviews." },
      { id: "portf-m01-q5", prompt: "What should you decide before building a portfolio?", options: ["Who it's for", "Which font to use", "How many pages to make", "Which phone to buy"], answer: 0, explanation: "Your audience shapes what you include." },
    ],
  },
  {
    id: "portf-m02-check",
    courseId: C,
    kind: "module",
    moduleId: "portf-m02",
    title: "Show Your Work: module check",
    passingScore: 60,
    questions: [
      { id: "portf-m02-q1", prompt: "What should lead each project?", options: ["A clear screenshot of the result", "A long paragraph", "Your phone number", "A photo of your laptop screen"], answer: 0, explanation: "Reviewers see the picture first." },
      { id: "portf-m02-q2", prompt: "Which file name is best?", options: ["final final 2.pdf", "Kolanut-sales-dashboard.pdf", "document1.pdf", "untitled.pdf"], answer: 1, explanation: "Clear names look professional and are easy to find." },
      { id: "portf-m02-q3", prompt: "How should you test a shared Drive link?", options: ["Open it in a private browser window", "Assume it works", "Only open it on your own account", "Email it to yourself"], answer: 0, explanation: "A private window shows what others see, including sign-in prompts." },
      { id: "portf-m02-q4", prompt: "What access should a portfolio link usually give?", options: ["View only", "Edit", "Owner", "No access"], answer: 0, explanation: "View-only stops others changing your work." },
      { id: "portf-m02-q5", prompt: "You want to show internship work that's confidential. What should you do?", options: ["Recreate it with made-up data and say so", "Post the original files", "Share your manager's login", "Screenshot client names"], answer: 0, explanation: "Never publish confidential work; recreate it safely." },
    ],
  },
  {
    id: "portf-m03-check",
    courseId: C,
    kind: "module",
    moduleId: "portf-m03",
    title: "Build Your Portfolio Page: module check",
    passingScore: 60,
    questions: [
      { id: "portf-m03-q1", prompt: "What is the main goal of a portfolio page?", options: ["One link that shows who you are and your best work", "A place to store every file", "A private diary", "A place for adverts"], answer: 0, explanation: "One link you can put everywhere." },
      { id: "portf-m03-q2", prompt: "Which free tool suits most students starting out?", options: ["Google Sites", "A paid web designer", "A printed booklet", "A spreadsheet"], answer: 0, explanation: "It's free, quick and clean." },
      { id: "portf-m03-q3", prompt: "Which detail doesn't need to be on your public portfolio?", options: ["Your home address", "Your name", "Your best projects", "Your email"], answer: 0, explanation: "Keep private details private; email and LinkedIn are enough." },
      { id: "portf-m03-q4", prompt: "What's a good test before sharing your page?", options: ["Open it in a private window on your phone and click every link", "Only look at it on your laptop", "Share it first and fix later", "Check the font"], answer: 0, explanation: "Most visitors will open it on a phone." },
      { id: "portf-m03-q5", prompt: "Where should you add your portfolio link?", options: ["On your CV and LinkedIn", "Nowhere", "Only in your email drafts", "In a private note"], answer: 0, explanation: "Put it where reviewers will look." },
    ],
  },
  {
    id: "portf-m04-check",
    courseId: C,
    kind: "module",
    moduleId: "portf-m04",
    title: "Share Your Work on LinkedIn: module check",
    passingScore: 60,
    questions: [
      { id: "portf-m04-q1", prompt: "Why do the first two lines of a LinkedIn post matter most?", options: ["LinkedIn shows only those before 'see more'", "They're in bold", "They set your profile photo", "Only they are searchable"], answer: 0, explanation: "The hook decides whether people keep reading." },
      { id: "portf-m04-q2", prompt: "Which order works well for a post?", options: ["Hook, story, result, thanks and a question", "Hashtags, then a long list of names", "A single emoji", "Your CV pasted in full"], answer: 0, explanation: "It's the shape of most strong posts." },
      { id: "portf-m04-q3", prompt: "How many hashtags should you usually use?", options: ["3–5 relevant ones", "20 or more", "None ever", "Only trending ones"], answer: 0, explanation: "A few relevant hashtags are enough." },
      { id: "portf-m04-q4", prompt: "Your project used practice data from a course. What should the post say?", options: ["That it's a course project with practice data", "That it's for a real client", "Nothing about it", "That you invented the data yourself for a company"], answer: 0, explanation: "Honesty builds trust." },
      { id: "portf-m04-q5", prompt: "How do you share an achievement without bragging?", options: ["Focus on what you learned and who helped", "Only praise yourself", "Tag everyone you know", "Use all capital letters"], answer: 0, explanation: "Lessons and stories get more engagement than self-praise." },
    ],
  },
  {
    id: "build-your-student-portfolio-final",
    courseId: C,
    kind: "final",
    title: "Build Your Student Portfolio: final assessment",
    passingScore: 60,
    questions: [
      { id: "portf-f01", prompt: "What's the strongest evidence of a skill for a student with little work experience?", options: ["A portfolio of real projects", "A long skills list", "A photo", "Your date of birth"], answer: 0, explanation: "Showing beats telling." },
      { id: "portf-f02", prompt: "Which counts as portfolio work?", options: ["Class projects, personal projects, volunteering and course badges", "Only paid jobs", "Only first-class grades", "Nothing before graduation"], answer: 0, explanation: "Students have more work to show than they think." },
      { id: "portf-f03", prompt: "What should each project show?", options: ["The problem, what you did, the result and a link", "Only the title", "Only the tools", "The date you started"], answer: 0, explanation: "Those four parts tell the whole story quickly." },
      { id: "portf-f04", prompt: "Before sharing a Drive link publicly, what should you check?", options: ["It opens without sign-in and doesn't give edit access", "The file is large", "It's in a zip", "It has a long name"], answer: 0, explanation: "View-only and publicly viewable is what you want." },
      { id: "portf-f05", prompt: "What should you remove before publishing class work?", options: ["Other people's personal details", "Your own name", "The results", "The images"], answer: 0, explanation: "Protect other people's privacy." },
      { id: "portf-f06", prompt: "What should a portfolio page's header include?", options: ["Your name, a one-line summary of what you do and a professional photo", "Your full CV", "A long poem", "Your home address"], answer: 0, explanation: "Visitors should know who you are in seconds." },
      { id: "portf-f07", prompt: "What makes a LinkedIn post about a project effective?", options: ["A strong hook, specific details, an image and an honest description", "As many hashtags as possible", "Vague excitement", "Tagging strangers"], answer: 0, explanation: "Specific, honest and visual posts get read." },
      { id: "portf-f08", prompt: "Where can students show verifiable CloudTech Academy badges?", options: ["On their portfolio page and LinkedIn, with the credential link", "Nowhere", "Only on paper", "Only in email"], answer: 0, explanation: "Each badge has a public credential page anyone can check." },
    ],
  },
];
