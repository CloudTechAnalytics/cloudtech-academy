import type { AssessmentDef } from "../types";

/**
 * Career Essentials: a check for each module (it awards the module badge, and unlocks only
 * after the module's tasks are done) and a final assessment. Questions are scenarios with
 * plausible wrong answers, so they test judgement rather than recall.
 */
export const CAREER_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "career-m01-check",
    courseId: "career-essentials",
    kind: "module",
    moduleId: "career-m01",
    title: "Build a CV with AI: module check",
    passingScore: 60,
    questions: [
      { id: "career-m01-q1", prompt: "Which CV bullet is strongest?", options: ["Responsible for handling customer complaints", "Resolved an average of 25 complaints a week, cutting repeat complaints by a third", "Excellent at handling customers in a fast-paced environment", "Handled complaints and other duties as assigned"], answer: 1, explanation: "It starts with an action and shows a result with numbers. The others describe duties or make unprovable claims." },
      { id: "career-m01-q2", prompt: "A candidate's CV is a stylish two-column template with skill bars and a photo. Recruiters searching the ATS for 'Excel' never find them. What is the most likely reason?", options: ["The ATS rejects CVs with photos automatically", "The ATS couldn't read the layout, and 'Excel' only appeared as a skill bar graphic, not as text", "Recruiters don't search for Excel", "The CV was too long"], answer: 1, explanation: "Columns and graphics can scramble or hide text. A skill bar is a picture; only words can be searched." },
      { id: "career-m01-q3", prompt: "You ask AI to improve your bullets and it writes \"Increased sales by 45%\". You never measured sales. What should you do?", options: ["Keep it: recruiters rarely check", "Change it to 40% to be safe", "Remove the number or replace it with something you can honestly back up", "Ask the AI for a bigger number"], answer: 2, explanation: "Everything on a CV must be true and explainable in an interview." },
      { id: "career-m01-q4", prompt: "An advert asks for 'stakeholder management'. You regularly updated three department heads on project progress. What's the best way to show it?", options: ["Don't mention it; you've never had that job title", "Copy the whole advert into your skills section", "Write a bullet about updating the three department heads, using the phrase 'stakeholder management'", "Add 'stakeholder management' to your skills list only"], answer: 2, explanation: "Use the advert's words to describe things you actually did, in a bullet that proves it." },
      { id: "career-m01-q5", prompt: "Where should your phone number and email go on an ATS-friendly CV?", options: ["In the page header, so they repeat on every page", "In the body text at the top, under your name", "In an image with icons", "On a separate cover page"], answer: 1, explanation: "Some systems don't read headers, footers or images. Plain text at the top is safest." },
      { id: "career-m01-q6", prompt: "You paste your CV into Notepad as a test and the job titles and dates come out jumbled together. What does that tell you?", options: ["Notepad is broken", "An ATS will probably read it in the same jumbled way, so simplify the layout", "You should send it as an image instead", "Nothing: ATS reads differently from Notepad"], answer: 1, explanation: "The copy-paste test is a quick way to see your CV the way software reads it." },
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
      { id: "career-m02-q1", prompt: "A recruiter searches LinkedIn for \"customer service Lagos\". Which headline is most likely to appear and get a click?", options: ["Hardworking, passionate and God-fearing", "Open to opportunities", "Customer Service Representative | 3 years in retail banking | Complaints handling & CRM | Lagos", "Looking for job urgently"], answer: 2, explanation: "It contains the searched words and tells the recruiter in seconds what the person does." },
      { id: "career-m02-q2", prompt: "Why should the first line of your About section be a strong hook?", options: ["It's printed in a bigger font", "LinkedIn shows only the opening lines before 'see more', so it decides whether people read on", "It's the only part recruiters can search", "It sets your profile URL"], answer: 1, explanation: "Most visitors only see the start. Make it count." },
      { id: "career-m02-q3", prompt: "Which skill is most useful to list on your profile?", options: ["Team player", "Hardworking", "Microsoft Excel", "Passionate"], answer: 2, explanation: "Recruiters search for concrete skills spelled the way adverts spell them. Show teamwork in your experience instead." },
      { id: "career-m02-q4", prompt: "An AI tool writes your About section: \"Results-driven professional passionate about leveraging synergies to drive impact.\" What's the problem?", options: ["It's too short", "It's generic: it could describe anyone and proves nothing", "It's in the first person", "It doesn't mention LinkedIn"], answer: 1, explanation: "Specific facts and numbers beat buzzwords. Rewrite it in your own words." },
      { id: "career-m02-q5", prompt: "You're job hunting but don't want your current employer to see. What should you do?", options: ["Don't use LinkedIn", "Turn on Open to work and show it to recruiters only", "Write 'secretly looking' in your headline", "Delete your current job from your profile"], answer: 1, explanation: "The recruiters-only setting hides it from people at your company." },
      { id: "career-m02-q6", prompt: "Which profile photo works best?", options: ["A group photo from a wedding, cropped", "A recent head-and-shoulders photo facing the camera, with good light and a plain background", "Your company logo", "A heavily filtered selfie"], answer: 1, explanation: "People trust profiles where they can clearly see who they're dealing with." },
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
      { id: "career-m03-q1", prompt: "Product names are in column B and sales in column F (rows 2 to 21). Which formula gives total sales of Chapman?", options: ['=SUM(F2:F21,"Chapman")', '=SUMIF(B2:B21,"Chapman",F2:F21)', '=COUNTIF(B2:B21,"Chapman")', '=SUMIF(F2:F21,"Chapman",B2:B21)'], answer: 1, explanation: "SUMIF(where to look, what to match, what to add). COUNTIF would count entries, and the last option has the ranges swapped." },
      { id: "career-m03-q2", prompt: "Your total uses =SUM(F2:F20), but the data runs to row 21. What happens?", options: ["Excel adds row 21 automatically", "The last row is silently left out and the total is too low", "You get an error message", "Nothing: SUM ignores row numbers"], answer: 1, explanation: "Ranges must cover all the data. Using a Table, or checking the status bar total, catches this." },
      { id: "career-m03-q3", prompt: "Puff-puff sold 50 packs and Chapman 26 bottles, but Chapman brought in more money. What explains that?", options: ["The data is wrong", "Chapman costs more per unit, so fewer units bring in more money", "Puff-puff sales weren't counted", "Excel rounds small numbers"], answer: 1, explanation: "Units and money tell different stories. Say which one you mean." },
      { id: "career-m03-q4", prompt: "You filtered the table to Snacks and forgot to clear the filter. What's the risk?", options: ["The hidden rows are deleted", "You or a colleague may think the visible rows are all the data", "Formulas stop working", "The file won't save"], answer: 1, explanation: "Filters only hide rows, but hidden rows are easy to forget. Clear filters when you're done." },
      { id: "career-m03-q5", prompt: "Week 1 sales were ₦80,000 and week 2 were ₦100,000. What is the growth?", options: ["20%", "25%", "₦20,000%", "125%"], answer: 1, explanation: "(100,000 ÷ 80,000 − 1) × 100 = 25%. Divide by the old value, not the new one." },
      { id: "career-m03-q6", prompt: "Which chart title is most useful for the shop owner?", options: ["Chart 1", "Sales by product", "Zobo brings in over a third of all sales", "Bar chart"], answer: 2, explanation: "An action title states the finding, so nobody has to work it out." },
    ],
  },
  {
    id: "career-essentials-final",
    courseId: "career-essentials",
    kind: "final",
    title: "Career Essentials: final assessment",
    passingScore: 60,
    questions: [
      { id: "career-f01", prompt: "Which bullet would you put on a CV?", options: ["Responsible for managing the shop's social media", "Grew the shop's Instagram from 800 to 3,500 followers in six months with a weekly posting plan", "Social media guru with a passion for engagement", "Did social media and other tasks"], answer: 1, explanation: "Action, what was done, and a measurable result." },
      { id: "career-f02", prompt: "What does an applicant tracking system (ATS) mainly do with your CV?", options: ["Rejects 75% of CVs automatically", "Reads the text into fields so recruiters can search and filter candidates", "Checks your grammar", "Sends your CV to every company"], answer: 1, explanation: "The real risks are not being readable, and not using the words recruiters search for." },
      { id: "career-f03", prompt: "Which CV is most likely to be read correctly by an ATS?", options: ["Two columns with icons and skill bars", "One column, standard headings, contact details as text at the top", "A scanned photo of a printed CV", "A CV designed in a slide-show tool with text boxes"], answer: 1, explanation: "Simple layouts keep text in a readable order." },
      { id: "career-f04", prompt: "How should you use AI to tailor a CV to a job advert?", options: ["Ask it to rewrite your CV to match the advert exactly, whatever you've done", "Ask it to compare the advert's requirements with your CV and suggest truthful changes", "Paste the advert into your CV", "Use the same CV for every job"], answer: 1, explanation: "AI is good at comparing and rewording. You decide what's true." },
      { id: "career-f05", prompt: "Which LinkedIn headline follows the formula role | skills | focus | location?", options: ["Looking for opportunities", "Graphic Designer | Canva & Illustrator | Brand identity for small businesses | Ibadan", "Designer", "Passionate creative soul"], answer: 1, explanation: "It's searchable and clear in one glance." },
      { id: "career-f06", prompt: "What belongs at the end of a LinkedIn About section?", options: ["Your date of birth", "What you're looking for and how to contact you", "A list of hashtags", "Nothing; it should stop after the hook"], answer: 1, explanation: "Tell readers what you want and how to reach you." },
      { id: "career-f07", prompt: "Category is in column C and sales in column F, rows 2 to 21. Which formula totals Drinks sales?", options: ['=SUMIF(C2:C21,"Drinks",F2:F21)', '=COUNTIF(C2:C21,"Drinks")', '=SUM(C2:C21,"Drinks")', '=SUMIF(F2:F21,"Drinks",C2:C21)'], answer: 0, explanation: "Look in C for Drinks, add up F." },
      { id: "career-f08", prompt: "Drinks sales were ₦121,800 out of a total of ₦196,800. What share is that?", options: ["About 38%", "About 62%", "About 162%", "About 75%"], answer: 1, explanation: "121,800 ÷ 196,800 ≈ 0.619, or about 62%." },
      { id: "career-f09", prompt: "What is a PivotTable best for?", options: ["Typing new data quickly", "Totals by group, such as sales by product, without writing formulas", "Checking spelling", "Formatting cells"], answer: 1, explanation: "Drag a field to Rows and a number to Values." },
      { id: "career-f10", prompt: "Which chart suits 'how did weekly sales change over three months'?", options: ["A pie chart", "A line chart", "A 3D column chart", "A table only"], answer: 1, explanation: "Lines show change over time; bars compare items." },
    ],
  },
];
