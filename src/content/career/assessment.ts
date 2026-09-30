import type { AssessmentDef } from "../types";

/** Career Essentials: a short check for each module (it awards the module badge) and a final assessment. */
export const CAREER_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "career-m01-check",
    courseId: "career-essentials",
    kind: "module",
    moduleId: "career-m01",
    title: "Build a CV with AI: module check",
    passingScore: 60,
    questions: [
      { id: "career-m01-q1", prompt: "Which bullet point is strongest?", options: ["Responsible for sales", "Did sales work", "Increased monthly sales by 20% by following up every enquiry within a day", "Sales"], answer: 2, explanation: "It starts with an action and shows a result." },
      { id: "career-m01-q2", prompt: "Why tell AI 'don't invent numbers'?", options: ["Numbers make CVs too long", "Your CV must be true, and you'll be asked about it", "AI can't count", "Recruiters dislike numbers"], answer: 1, explanation: "Only include figures you can back up in an interview." },
      { id: "career-m01-q3", prompt: "What's the best way to tailor a CV to a job?", options: ["Send the same CV everywhere", "Compare it with the advert and make the matching, true skills clear", "Copy the whole advert into your CV", "Add a photo"], answer: 1, explanation: "Show clearly how your real experience matches what the employer asked for." },
      { id: "career-m01-q4", prompt: "Which layout is safest for most CVs?", options: ["One simple column with clear headings", "Text inside images", "Three columns with graphics", "Handwritten and scanned"], answer: 0, explanation: "Simple layouts are easy for people and screening software to read." },
      { id: "career-m01-q5", prompt: "Which of these do you usually not need on a CV?", options: ["Your experience", "Your skills", "Your state of origin and religion", "Your contact details"], answer: 2, explanation: "Personal details like these aren't needed unless an employer specifically asks." },
    ],
  },
  {
    id: "career-m02-check",
    courseId: "career-essentials",
    kind: "module",
    moduleId: "career-m02",
    title: "A Professional LinkedIn Profile: module check",
    passingScore: 60,
    questions: [
      { id: "career-m02-q1", prompt: "Which LinkedIn headline is strongest?", options: ["Unemployed", "Looking for job", "Customer service professional | 3 years in retail banking | Open to CX roles in Lagos", "Hi"], answer: 2, explanation: "It says what you do, your experience and what you want, using words people search for." },
      { id: "career-m02-q2", prompt: "What makes a good LinkedIn profile photo?", options: ["A group photo from a party", "A clear, recent photo of your face with good light", "Your company logo", "No photo"], answer: 1, explanation: "People want to recognise you and see that you're real." },
      { id: "career-m02-q3", prompt: "In what voice should the About section usually be written?", options: ["First person: 'I help…'", "Third person, like a news story", "In capital letters", "As a list of hashtags"], answer: 0, explanation: "First person sounds natural and personal on LinkedIn." },
      { id: "career-m02-q4", prompt: "Why do the first two lines of your About section matter most?", options: ["They're printed in bold", "LinkedIn hides the rest behind 'see more'", "Only they are searchable", "They set your photo"], answer: 1, explanation: "Many people only read what shows before 'see more'." },
      { id: "career-m02-q5", prompt: "Where should you add the badges and certificates you earn?", options: ["Nowhere", "In the Licences & certifications section", "In your profile photo", "In your banner only"], answer: 1, explanation: "Licences & certifications is the section for courses and credentials." },
    ],
  },
  {
    id: "career-m03-check",
    courseId: "career-essentials",
    kind: "module",
    moduleId: "career-m03",
    title: "Quick Excel Analysis: module check",
    passingScore: 60,
    questions: [
      { id: "career-m03-q1", prompt: "What does pressing Ctrl + T on your data do?", options: ["Deletes it", "Turns it into an Excel Table with filters that grows with new rows", "Prints it", "Makes it a chart"], answer: 1, explanation: "Tables add filters and formatting, and expand automatically." },
      { id: "career-m03-q2", prompt: "Which formula adds up the Sales column F from row 2 to 13?", options: ["=SUM(F2:F13)", "SUM F2 to F13", "=ADD(F2,F13)", "=F2+F13"], answer: 0, explanation: "SUM adds every cell in the range. =F2+F13 would only add two cells." },
      { id: "career-m03-q3", prompt: "In the drinks shop data, what is total Snacks sales?", options: ["32,000", "82,600", "114,600", "7,500"], answer: 0, explanation: "=SUMIF(C2:C13,\"Snacks\",F2:F13) adds 7,500 + 10,000 + 10,500 + 4,000 = 32,000." },
      { id: "career-m03-q4", prompt: "What is a PivotTable good for?", options: ["Typing new data", "Quick totals by group, like sales by product, without formulas", "Checking spelling", "Changing fonts"], answer: 1, explanation: "Drag a field to Rows and a number to Values to get totals by group." },
      { id: "career-m03-q5", prompt: "Which chart is best for comparing sales of different products?", options: ["A bar or column chart", "A 3D pie chart", "No chart", "A line chart of product names"], answer: 0, explanation: "Bars make it easy to compare items side by side." },
    ],
  },
  {
    id: "career-essentials-final",
    courseId: "career-essentials",
    kind: "final",
    title: "Career Essentials: final assessment",
    passingScore: 60,
    questions: [
      { id: "career-f01", prompt: "Which CV bullet point is strongest?", options: ["Responsible for sales", "Increased monthly sales by 20% by following up every enquiry within a day", "Did sales", "Sales work"], answer: 1, explanation: "It starts with an action and shows a result." },
      { id: "career-f02", prompt: "When asking AI to improve your CV, why say 'don't invent numbers'?", options: ["Everything on your CV must be true", "Numbers make CVs longer", "AI can't count", "Recruiters dislike numbers"], answer: 0, explanation: "Only include what you can explain in an interview." },
      { id: "career-f03", prompt: "What's the best way to tailor a CV for a job?", options: ["Compare it with the advert and make the matching, true skills clear", "Send the same CV everywhere", "Copy the advert into your CV", "Add a photo"], answer: 0, explanation: "Show clearly how your real experience matches what the employer asked for." },
      { id: "career-f04", prompt: "Which LinkedIn headline is strongest?", options: ["Looking for job", "Customer service professional | 3 years in banking | Open to CX roles", "Hi", "Unemployed"], answer: 1, explanation: "It says what you do and what you want, using words people search for." },
      { id: "career-f05", prompt: "Why do the first two lines of your LinkedIn About section matter most?", options: ["LinkedIn hides the rest behind 'see more'", "They're in bold", "Only they're searchable", "They set your photo"], answer: 0, explanation: "Many people only read what shows before 'see more'." },
      { id: "career-f06", prompt: "What does pressing Ctrl + T on your data in Excel do?", options: ["Turns it into a Table with filters that grows with new rows", "Deletes it", "Prints it", "Makes a chart"], answer: 0, explanation: "Tables add filters and formatting, and expand automatically." },
      { id: "career-f07", prompt: "Which formula adds up cells F2 to F13?", options: ["=SUM(F2:F13)", "SUM F2 to F13", "=F2+F13", "=ADD(F2:F13)"], answer: 0, explanation: "SUM adds every cell in the range." },
      { id: "career-f08", prompt: "What is a PivotTable good for?", options: ["Quick totals by group, like sales by product", "Checking spelling", "Changing fonts", "Typing new data"], answer: 0, explanation: "Drag a field to Rows and a number to Values to get totals by group." },
    ],
  },
];
