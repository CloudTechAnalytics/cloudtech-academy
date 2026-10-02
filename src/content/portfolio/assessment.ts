import type { AssessmentDef } from "../types";

const C = "build-your-student-portfolio";

/**
 * Build Your Student Portfolio: a check for each module (it awards the module badge, and
 * unlocks only after the module's tasks are done) and a final assessment. Questions are
 * scenarios with plausible wrong answers.
 */
export const PORTF_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "portf-m01-check",
    courseId: C,
    kind: "module",
    moduleId: "portf-m01",
    title: "Plan Your Portfolio: module check",
    passingScore: 60,
    questions: [
      { id: "portf-m01-q1", prompt: "Your CV says 'Skilled in Excel'. What does a portfolio add?", options: ["A longer list of skills", "Proof: the actual work, such as a tracker or dashboard you built", "Your hobbies", "A nicer font"], answer: 1, explanation: "A portfolio shows what you can do instead of saying it." },
      { id: "portf-m01-q2", prompt: "You're applying for data internships. Which piece is least relevant to put in your best three?", options: ["An Excel tracker used by 120 students", "A Power BI dashboard from a course project", "A wedding flyer you designed", "A SQL analysis of a practice database"], answer: 2, explanation: "Good work, but it doesn't show what data recruiters look for. Choose for your audience." },
      { id: "portf-m01-q3", prompt: "Which project result is strongest?", options: ["Made a spreadsheet", "Learned a lot about Excel", "Cut dues reconciliation from two hours to ten minutes", "Worked hard on it"], answer: 2, explanation: "A concrete, measurable outcome." },
      { id: "portf-m01-q4", prompt: "A strong group assignment includes classmates' names and matric numbers. What should you do before adding it?", options: ["Add it as it is", "Check you're allowed to share it and remove other students' personal details", "Delete your own name", "Only share the title"], answer: 1, explanation: "Protect other people's information." },
      { id: "portf-m01-q5", prompt: "What are the four parts of each project write-up?", options: ["Problem, what I did, result, see it", "Title, date, grade, lecturer", "Name, school, course, year", "Tools, colours, fonts, images"], answer: 0, explanation: "The same structure works on a page, on LinkedIn and in interviews." },
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
      { id: "portf-m02-q1", prompt: "You open your shared Drive link in a private window and it asks you to sign in. What's wrong?", options: ["Nothing", "The sharing setting isn't 'Anyone with the link can view'", "The file is too big", "Private windows can't open Drive"], answer: 1, explanation: "Reviewers won't request access; they'll move on." },
      { id: "portf-m02-q2", prompt: "Where's the best place to share code and a data analysis notebook?", options: ["As a WhatsApp attachment", "A GitHub repository with a README", "A photo of your screen", "Printed copies"], answer: 1, explanation: "GitHub keeps code readable and shareable." },
      { id: "portf-m02-q3", prompt: "Which should lead a project on your portfolio?", options: ["A clean screenshot of the result", "A photo of your laptop screen", "A long paragraph", "Your CV"], answer: 0, explanation: "A clear picture shows the work in a second." },
      { id: "portf-m02-q4", prompt: "Your internship dashboard used the company's real customer data. How can you include it?", options: ["Share the real file", "Recreate it with made-up data and say so", "Blur half of it and share", "Ask a friend to post it"], answer: 1, explanation: "Never publish confidential work; rebuild it with practice data." },
      { id: "portf-m02-q5", prompt: "You shared a file with 'Anyone with the link can edit'. What's the risk?", options: ["None", "Anyone with the link can change or delete your work", "It loads slowly", "Recruiters can't see it"], answer: 1, explanation: "Share as view-only." },
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
      { id: "portf-m03-q1", prompt: "What is the main goal of a portfolio page?", options: ["To have many pages", "One link that shows who you are, what you can do and how to reach you", "To show your photos", "To replace LinkedIn"], answer: 1, explanation: "One link for your CV, LinkedIn and applications." },
      { id: "portf-m03-q2", prompt: "Which header line works best?", options: ["Welcome to my website!!!", "Economics graduate · Excel, SQL and Power BI", "Hello, I am a hardworking person", "My Portfolio"], answer: 1, explanation: "It says what you do in one line." },
      { id: "portf-m03-q3", prompt: "Which contact details belong on a public portfolio page?", options: ["Email and LinkedIn", "Home address and phone number", "Date of birth", "Your BVN"], answer: 0, explanation: "Enough to reach you, without exposing private details." },
      { id: "portf-m03-q4", prompt: "You paste your Google Sites link into your CV, but it ends in /edit. What's the problem?", options: ["Nothing", "It's the editing link, not the published page: others can't view it properly", "Links can't go on CVs", "It needs https"], answer: 1, explanation: "Share the published address." },
      { id: "portf-m03-q5", prompt: "A friend looks at your page for 30 seconds and can't say what you do. What should you change first?", options: ["The colour scheme", "The header line: make it say clearly what you do", "Add more projects", "Add music"], answer: 1, explanation: "The header carries the first impression." },
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
      { id: "portf-m04-q1", prompt: "Why does the first line of a LinkedIn post matter most?", options: ["It's printed in bold", "Only the opening lines show before 'see more'", "It sets the hashtags", "LinkedIn deletes the rest"], answer: 1, explanation: "The hook decides whether anyone reads on." },
      { id: "portf-m04-q2", prompt: "Which opening is the stronger hook?", options: ["I am humbled and honoured to announce another milestone.", "I just built my first sales dashboard, and it found something I didn't expect.", "Good morning LinkedIn!", "Please read this post."], answer: 1, explanation: "Specific and curious beats vague and self-praising." },
      { id: "portf-m04-q3", prompt: "Your post is about a course project with fictional data. What should you say?", options: ["Nothing, it looks more impressive as real work", "That it's a course project with practice data", "That it was for a big company", "That it's confidential"], answer: 1, explanation: "Honesty builds trust and is easy to check." },
      { id: "portf-m04-q4", prompt: "How many hashtags does this course suggest?", options: ["None", "3-5 relevant ones", "15-20 popular ones", "One per word"], answer: 1, explanation: "A few relevant tags beat a long list." },
      { id: "portf-m04-q5", prompt: "What makes people more likely to reply to your post?", options: ["Ending with a question, and replying to comments", "Using capital letters", "Posting at midnight", "Tagging 30 people"], answer: 0, explanation: "A question invites conversation; replying keeps it going." },
    ],
  },
  {
    id: "build-your-student-portfolio-final",
    courseId: C,
    kind: "final",
    title: "Build Your Student Portfolio: final assessment",
    passingScore: 60,
    questions: [
      { id: "portf-f01", prompt: "What should you decide first when planning a portfolio?", options: ["The colour scheme", "Who it's for", "How many pages", "The domain name"], answer: 1, explanation: "Your audience shapes everything else." },
      { id: "portf-f02", prompt: "How many projects should you start with?", options: ["Your best three", "All of them", "One", "Twenty"], answer: 0, explanation: "Three strong pieces beat many weak ones." },
      { id: "portf-f03", prompt: "Which project write-up is best?", options: ["Made an app.", "Built a budget tracker in Python that 30 hostel mates now use to split bills. See it: GitHub link", "I like coding.", "App project 2026"], answer: 1, explanation: "Problem, what you did, result, link." },
      { id: "portf-f04", prompt: "How should you check a share link before sending it?", options: ["Open it in a private window without signing in", "Click it while signed in", "Send it to yourself on WhatsApp", "No need to check"], answer: 0, explanation: "That's how a recruiter will see it." },
      { id: "portf-f05", prompt: "What should you never publish in a portfolio?", options: ["Your own class project", "Confidential data from an employer", "A screenshot of your dashboard", "Your CloudTech badges"], answer: 1, explanation: "Recreate it with practice data instead." },
      { id: "portf-f06", prompt: "Which is the best use of your portfolio link?", options: ["Keep it private", "Put it on your CV, LinkedIn and applications", "Only share it when asked twice", "Print it"], answer: 1, explanation: "One link, everywhere." },
      { id: "portf-f07", prompt: "Which LinkedIn post structure does this course recommend?", options: ["Hook, story, result or proof, thanks and a question", "Hashtags first, then text", "Only a picture", "A list of all your courses"], answer: 0, explanation: "Hook, story, proof, then invite a reply." },
      { id: "portf-f08", prompt: "Your post is about a badge you earned. What's the best way to share it?", options: ["Screenshot only", "Use the badge's Share on LinkedIn button so the post links to your verifiable credential", "Type the badge name", "Don't share badges"], answer: 1, explanation: "A link lets anyone verify it." },
    ],
  },
];
