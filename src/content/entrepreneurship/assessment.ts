import type { AssessmentDef } from "../types";

const C = "entrepreneurship-business-management";

type Q = AssessmentDef["questions"][number];
const q = (id: string, prompt: string, options: string[], answer: number, explanation: string): Q => ({ id, prompt, options, answer, explanation });

const check = (n: number, title: string, questions: Q[]): AssessmentDef => ({
  id: `ent-m${String(n).padStart(2, "0")}-check`,
  courseId: C,
  kind: "module",
  moduleId: `ent-m${String(n).padStart(2, "0")}`,
  title: `${title}: module check`,
  passingScore: 60,
  questions,
});

/** Entrepreneurship & Business Management: a check for each module (it awards the module badge) and a final assessment. */
export const ENT_ASSESSMENTS: AssessmentDef[] = [
  check(1, "The Entrepreneurial Mindset and Finding Opportunity", [
    q("ent-m01-q1", "Where should a business idea start?", ["With a product you like", "With a real problem people have", "With a logo", "With a loan"], 1, "Good businesses solve real problems for reachable customers."),
    q("ent-m01-q2", "Which is a sign a problem is worth solving?", ["Only you have it, and rarely", "Many people have it, often, and already spend money trying to fix it", "Nobody has tried to solve it", "It is easy to explain"], 1, "Frequency, pain and existing spending signal a real need."),
    q("ent-m01-q3", "What turns an idea into an opportunity?", ["Telling friends", "A real, reachable customer need with a way to earn", "A business name", "A website"], 1, "Opportunity needs customer, problem, solution, reason to choose you and a way to earn."),
    q("ent-m01-q4", "How should entrepreneurs treat failed tests?", ["Hide them", "As information about what to change", "As proof they should quit", "As bad luck only"], 1, "Failure in a cheap test teaches you cheaply."),
    q("ent-m01-q5", "What is a sensible way to limit personal risk when starting?", ["Borrow as much as possible", "Start small, test cheaply and avoid debt you cannot repay", "Quit your job at once", "Skip planning"], 1, "Limit the worst case you can afford."),
  ]),
  check(2, "Validating Your Idea", [
    q("ent-m02-q1", "Which interview question is best?", ["Would you buy my lunch service?", "Tell me about the last time you bought lunch at work", "Do you like my idea?", "How much would you pay in future?"], 1, "Past behaviour is a better guide than polite opinions about the future."),
    q("ent-m02-q2", "50 people are surveyed and 18 say they would buy. What percentage is that?", ["18%", "28%", "36%", "50%"], 2, "18 ÷ 50 = 36%."),
    q("ent-m02-q3", "Which is the strongest evidence of demand?", ["Compliments", "Likes on a post", "People paying a deposit", "A long survey reply"], 2, "Money paid is the best signal."),
    q("ent-m02-q4", "What is an MVP?", ["A finished, perfect product", "The simplest version that lets you learn from real customers", "A prize", "A brand name"], 1, "A minimum viable product tests the key assumptions quickly."),
    q("ent-m02-q5", "When should you set your go, change or stop rule?", ["After the test", "Before the test", "Never", "When you are tired"], 1, "Deciding in advance keeps you honest."),
  ]),
  check(3, "Business Model and Value Proposition", [
    q("ent-m03-q1", "How many blocks does the Business Model Canvas have?", ["Five", "Seven", "Nine", "Twelve"], 2, "It has nine blocks."),
    q("ent-m03-q2", "A good value proposition focuses on:", ["Your features", "The customer's problem and benefit", "Your history", "Your logo"], 1, "It says why the customer should choose you."),
    q("ent-m03-q3", "Which is a variable cost?", ["Rent", "Ingredients for each meal", "Annual insurance", "A salary"], 1, "Variable costs rise with each sale."),
    q("ent-m03-q4", "Which is a subscription revenue model?", ["A one-time sale", "A weekly meal plan paid regularly", "A commission", "A fine"], 1, "Subscriptions bring regular, predictable payments."),
    q("ent-m03-q5", "What is a competitor's repeated customer complaint?", ["Noise", "A free market research clue for your opening", "A legal problem", "Irrelevant"], 1, "Repeated complaints show gaps you can fill."),
  ]),
  check(4, "Business Planning and Strategy", [
    q("ent-m04-q1", "Which goal is SMART?", ["Grow the business", "Reach ₦600,000 monthly sales by the end of month 6", "Be successful", "Sell more"], 1, "It is specific, measurable and time-bound."),
    q("ent-m04-q2", "From ₦200,000 to ₦600,000 in six months needs about how much more each month?", ["₦40,000", "₦66,667", "₦100,000", "₦400,000"], 1, "400,000 ÷ 6 = 66,667."),
    q("ent-m04-q3", "In a SWOT, which is an external, harmful factor?", ["Strength", "Weakness", "Opportunity", "Threat"], 3, "Threats are external and harmful."),
    q("ent-m04-q4", "A risk with likelihood 4 and impact 4 scores:", ["8", "12", "16", "20"], 2, "4 × 4 = 16."),
    q("ent-m04-q5", "What is usually the best strategy for a new small business?", ["Compete on every product", "Focus on a niche it can serve better than larger rivals", "Copy the biggest rival", "Avoid planning"], 1, "Focus lets a small business win a segment."),
  ]),
  check(5, "Setting Up Legally in Nigeria", [
    q("ent-m05-q1", "Why register a limited company rather than operate as a sole proprietor?", ["It is cheaper", "It gives a separate legal entity and limited liability", "It removes taxes", "It needs no records"], 1, "A company separates the owner from the business's debts."),
    q("ent-m05-q2", "Which body registers companies and business names in Nigeria?", ["NAFDAC", "The CAC", "SON", "The Central Bank"], 1, "The Corporate Affairs Commission handles registration."),
    q("ent-m05-q3", "Selling packaged food generally also requires:", ["Nothing", "NAFDAC registration or approval", "A passport", "A taxi licence"], 1, "Food products are regulated by NAFDAC."),
    q("ent-m05-q4", "What does trademark registration add to CAC name registration?", ["Nothing", "Legal rights over a name, logo or slogan in a category", "A tax break", "A bank loan"], 1, "A trademark is separate and protects the brand."),
    q("ent-m05-q5", "Why use written contracts?", ["To impress", "To state who does what, price, delivery and how problems are handled", "To avoid tax", "They are optional decoration"], 1, "Clear terms prevent disputes."),
  ]),
  check(6, "Marketing and Selling", [
    q("ent-m06-q1", "₦50,000 on adverts wins 25 customers. What is the CAC?", ["₦500", "₦2,000", "₦25,000", "₦50,000"], 1, "50,000 ÷ 25 = ₦2,000."),
    q("ent-m06-q2", "Profit per order ₦3,500 and three orders per customer gives a CLV of:", ["₦3,500", "₦7,000", "₦10,500", "₦35,000"], 2, "3,500 × 3 = ₦10,500."),
    q("ent-m06-q3", "What is usually the cheapest and strongest marketing for a small service?", ["Billboards", "Word of mouth and referrals", "TV adverts", "Random flyers"], 1, "Trust-based referrals cost little and convert well."),
    q("ent-m06-q4", "A customer complains of a late delivery. What is the best reply?", ["Defend yourself", "Apologise, take responsibility, fix it and say how you will prevent it", "Ignore them", "Blame the rider"], 1, "A well-handled complaint can build loyalty."),
    q("ent-m06-q5", "What is the brand of a small business, above all?", ["Its logo", "Reliability and how it treats people", "Its colours", "Its slogan"], 1, "A logo cannot rescue poor service."),
  ]),
  check(7, "Operations and Management", [
    q("ent-m07-q1", "What is an SOP?", ["A sales order", "A short written procedure for how to do an important step", "A tax form", "A supplier"], 1, "SOPs make work repeatable."),
    q("ent-m07-q2", "One person makes 20 items a day and you get 30 orders. What is the shortfall?", ["5", "10", "20", "30"], 1, "30 − 20 = 10."),
    q("ent-m07-q3", "What should you do when a supplier delivers?", ["Pay without looking", "Check quantity and quality before paying", "Throw away the invoice", "Store it unchecked"], 1, "Check deliveries against the order."),
    q("ent-m07-q4", "How often should you update sales and expense records?", ["Once a year", "Daily or at least weekly", "Only for tax", "Never"], 1, "Regular updates keep records accurate."),
    q("ent-m07-q5", "What is a good rule for tools?", ["Buy the most expensive", "Pick a few cheap ones and use them consistently", "Use none", "Change them weekly"], 1, "A tool nobody uses is a waste."),
  ]),
  check(8, "Money: Pricing, Budgeting, Cash Flow and Funding", [
    q("ent-m08-q1", "A meal costs ₦2,800 and you add a 40% markup. What is the price?", ["₦3,200", "₦3,920", "₦4,000", "₦4,200"], 1, "2,800 × 1.4 = ₦3,920."),
    q("ent-m08-q2", "Fixed costs ₦150,000, price ₦3,500, variable cost ₦2,000. What is break-even?", ["50 units", "75 units", "100 units", "150 units"], 2, "150,000 ÷ 1,500 = 100."),
    q("ent-m08-q3", "Opening cash ₦100,000, cash in ₦300,000, cash out ₦340,000. What is the closing cash?", ["₦40,000", "₦60,000", "₦100,000", "₦140,000"], 1, "100,000 + 300,000 − 340,000 = ₦60,000."),
    q("ent-m08-q4", "Why separate business and personal money?", ["To show off", "To know your true profit and be taken seriously by banks and tax officials", "It is optional", "To avoid receipts"], 1, "Mixing the two hides the real numbers."),
    q("ent-m08-q5", "Before borrowing, you should test whether:", ["The loan is large", "The business can repay it even if sales are 20% lower than planned", "A friend approves", "The bank has a nice office"], 1, "Plan for a weaker case."),
  ]),
  check(9, "Leadership, People and Growth", [
    q("ent-m09-q1", "A helper costs ₦80,000 and adds 400 sales at ₦1,500 contribution each. What is the net gain?", ["₦80,000", "₦520,000", "₦600,000", "₦680,000"], 1, "600,000 − 80,000 = ₦520,000."),
    q("ent-m09-q2", "What does good delegation include?", ["Giving no information", "Clear outcome, deadline, standard, limits and check-in points", "Doing it yourself later", "Avoiding feedback"], 1, "Clarity makes delegation work."),
    q("ent-m09-q3", "What is a sign the business is ready to grow?", ["You feel bored", "Steady demand, profit and systems that work without constant firefighting", "A competitor grows", "You have spare cash only"], 1, "Growth needs demand, profit and capable systems."),
    q("ent-m09-q4", "What is a risk of growing too fast?", ["Too much sleep", "Costs rise before income and cash runs out", "Fewer customers always", "Lower tax"], 1, "Fast growth strains cash and quality."),
    q("ent-m09-q5", "Good KPIs for a person are:", ["Many and vague", "Few, clear and within their control", "Secret", "Only about speed"], 1, "Simple, controllable measures drive behaviour well."),
  ]),
  check(10, "Final Project: Your Business Plan", [
    q("ent-m10-q1", "Which part of the plan should you write last?", ["The problem", "The executive summary", "The risks", "The cash flow"], 1, "The summary condenses everything, so write it last."),
    q("ent-m10-q2", "Which statement is strongest in a plan?", ["Everyone will love it", "10 of 50 people paid a deposit, so we expect about 100 sales a month", "It cannot fail", "We will go viral"], 1, "Evidence beats hope."),
    q("ent-m10-q3", "What should the financial plan show?", ["Only the dream income", "Start-up costs, pricing, break-even, cash flow and funding", "Only the logo cost", "Nothing"], 1, "Funders want to see the numbers and how you worked them out."),
    q("ent-m10-q4", "What is the purpose of the 90-day plan?", ["To fill pages", "To turn the plan into specific actions with milestones", "To impress friends", "To avoid tax"], 1, "Action with milestones starts the business."),
    q("ent-m10-q5", "How should you prepare for investor questions?", ["Avoid them", "Have honest, evidence-based answers ready", "Make up numbers", "Change the subject"], 1, "Credibility comes from honest, supported answers."),
  ]),
  {
    id: `${C}-final`,
    courseId: C,
    kind: "final",
    title: "Entrepreneurship & Business Management: final assessment",
    passingScore: 60,
    questions: [
      q("ent-f01", "What do entrepreneurs do first?", ["Build the product", "Find and understand a real problem", "Register a company", "Buy stock"], 1, "Start with a problem worth solving."),
      q("ent-f02", "Which is the best sign of demand?", ["Positive comments", "Deposits from real customers", "Many followers", "A friend's approval"], 1, "People paying is the real test."),
      q("ent-f03", "A survey of 50 people finds 18 would buy; 10 then pay a deposit. What is the paying conversion?", ["10%", "20%", "36%", "55%"], 1, "10 ÷ 50 = 20%."),
      q("ent-f04", "Which block of the Business Model Canvas says why customers choose you?", ["Channels", "Value proposition", "Cost structure", "Key partners"], 1, "The value proposition is the promise of benefit."),
      q("ent-f05", "Which goal is SMART?", ["Be popular", "Serve 100 subscribers within 9 months", "Grow", "Do better"], 1, "It has a number and a time."),
      q("ent-f06", "Under CAMA 2020, can a company be formed by one person?", ["Yes", "No, always two", "Only for churches", "Only for public companies"], 0, "A single-person company is allowed."),
      q("ent-f07", "Which regulator generally registers packaged food products?", ["NAFDAC", "NCC", "FRSC", "CBN"], 0, "NAFDAC regulates food, drugs and cosmetics."),
      q("ent-f08", "₦50,000 of adverts wins 25 customers worth ₦10,500 profit each over time. Is it worth it?", ["No, CAC is ₦2,000 but lifetime value is only ₦500", "Yes, CAC ₦2,000 is far below the ₦10,500 value", "It cannot be known", "Only if it goes viral"], 1, "CLV far exceeds CAC."),
      q("ent-f09", "A meal costs ₦2,800 and sells at ₦3,920. What is the margin on price?", ["20%", "28.6%", "40%", "56%"], 1, "1,120 ÷ 3,920 = 28.6%."),
      q("ent-f10", "Fixed costs ₦150,000, contribution ₦1,500 a unit. How many units to break even?", ["50", "100", "150", "1,500"], 1, "150,000 ÷ 1,500 = 100."),
      q("ent-f11", "A negative closing cash balance forecast means you should:", ["Ignore it", "Act in advance: delay spending, collect faster or arrange funding", "Hide it", "Raise your salary"], 1, "Forecasts let you act before the shortfall."),
      q("ent-f12", "Which is the best way to handle personal and business money?", ["Mix them", "Use a separate business account and pay yourself a set amount", "Use cash only", "Use your friend's account"], 1, "Separation shows true profit."),
      q("ent-f13", "When is hiring justified?", ["When it feels like growth", "When the work needs it and the extra contribution exceeds the cost", "When a friend needs a job", "Never"], 1, "Compare the benefit with the all-in cost."),
      q("ent-f14", "What is the main risk of growing too fast?", ["Too many customers is never a problem", "Costs rise before income, quality slips and cash runs out", "Tax disappears", "Competitors vanish"], 1, "Growth strains cash and quality."),
      q("ent-f15", "What belongs in a credible business plan?", ["Hopes only", "Evidence from customers, a verified model, costs, break-even, cash flow, risks and a 90-day plan", "A logo only", "A long history"], 1, "Evidence and numbers make a plan believable."),
    ],
  },
];
