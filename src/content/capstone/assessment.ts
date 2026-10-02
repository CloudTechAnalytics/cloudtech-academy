import type { AssessmentDef } from "../types";

/**
 * Final assessment for the Data Analyst Capstone. Judgement questions about the end-to-end
 * process: each scenario has a tempting wrong answer an inexperienced analyst would choose.
 */
export const CAP_ASSESSMENT: AssessmentDef = {
  id: "data-analyst-capstone-final",
  courseId: "data-analyst-capstone",
  title: "Data Analyst Capstone: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "capq01",
      prompt: "A manager asks you to 'analyse sales'. What should you do first?",
      options: ["Build a dashboard of everything", "Agree specific questions, definitions and deliverables", "Clean the data", "Ask for more data"],
      answer: 1,
      explanation: "A plan with specific questions tells you when you're finished.",
    },
    {
      id: "capq02",
      prompt: "Power Query's column profile shows no problems, but you haven't changed any settings. What might you be missing?",
      options: ["Nothing", "Problems after the first 1,000 rows, because profiling defaults to the top 1,000", "Problems in the column names", "Hidden columns"],
      answer: 1,
      explanation: "Profile the entire data set.",
    },
    {
      id: "capq03",
      prompt: "A month's file was uploaded twice. Which step order is right?",
      options: ["Calculate totals, then remove duplicates", "Remove duplicates, then calculate", "Either order", "Average the two copies"],
      answer: 1,
      explanation: "Clean first, then calculate.",
    },
    {
      id: "capq04",
      prompt: "Joining sales lines to a cost table on product code alone doubles the row count. Why?",
      options: ["The sales doubled", "Each product has several cost rows over time; you must pick the cost in force on the sale date", "The join type is wrong", "Duplicates in sales"],
      answer: 1,
      explanation: "A range lookup keeps one cost per sale; check row counts after every join.",
    },
    {
      id: "capq05",
      prompt: "Revenue grew 37%, like-for-like growth was 18%, and prices rose 18%. What's the best summary?",
      options: ["Strong volume growth", "Existing stores' volume was flat; growth came from the price rise and a new store", "Prices fell", "The data is wrong"],
      answer: 1,
      explanation: "Decompose the headline before reporting it.",
    },
    {
      id: "capq06",
      prompt: "A new store opened in July with a mature store's target from day one and reached 55% of target by December, then beat target in the spring. What should the report say?",
      options: ["The store is failing", "The target was unrealistic for a new store; on its trajectory, the store is doing well", "Remove the store from the report", "Report only the 55%"],
      answer: 1,
      explanation: "Judge the target before judging the store.",
    },
    {
      id: "capq07",
      prompt: "Which chart title is best for a board report?",
      options: ["Gross profit by category", "Solar now earns twice the gross profit of phones", "Category analysis", "Figure 2"],
      answer: 1,
      explanation: "State the finding in the title.",
    },
    {
      id: "capq08",
      prompt: "You estimate ₦6.5m of sales lost to a stock-out. What must accompany the figure?",
      options: ["Nothing; it's a number", "The method and assumptions, ideally with a range", "A chart", "The SQL code"],
      answer: 1,
      explanation: "An estimate without assumptions won't be trusted.",
    },
    {
      id: "capq09",
      prompt: "What comes first in an executive summary?",
      options: ["The methodology", "The answer to the main question", "The data sources", "Acknowledgements"],
      answer: 1,
      explanation: "Busy readers may read only the first lines.",
    },
    {
      id: "capq10",
      prompt: "One store's transactions fall 27% starting in a particular month. What's the best next step?",
      options: ["Blame the store manager", "Find the date it started and ask the business what changed then", "Exclude the store", "Wait another year"],
      answer: 1,
      explanation: "Step changes usually have a specific cause; the business can often tell you.",
    },
    {
      id: "capq11",
      prompt: "Some sales lines have negative quantities. After investigation they're customer returns. What do you do?",
      options: ["Delete them", "Keep them, so returns reduce net sales, and note the decision in your log", "Make them positive", "Move them to another file"],
      answer: 1,
      explanation: "Returns are real business events.",
    },
    {
      id: "capq12",
      prompt: "You want to publish your capstone for employers. What works best?",
      options: ["The raw files only", "A short case study (problem, data, approach, findings with numbers) with links to the full report and code", "A long PDF with every query", "Nothing: employers don't look"],
      answer: 1,
      explanation: "Readable in a minute, with the detail one click away.",
    },
  ],
};
