import type { AssessmentDef } from "../types";

const C = "business-development-sales";

type Q = AssessmentDef["questions"][number];
const q = (id: string, prompt: string, options: string[], answer: number, explanation: string): Q => ({ id, prompt, options, answer, explanation });

const check = (n: number, title: string, questions: Q[]): AssessmentDef => ({
  id: `bds-m${String(n).padStart(2, "0")}-check`,
  courseId: C,
  kind: "module",
  moduleId: `bds-m${String(n).padStart(2, "0")}`,
  title: `${title}: module check`,
  passingScore: 60,
  questions,
});

/** Business Development & Sales: a check for each module (it awards the module badge) and a final assessment. */
export const BDS_ASSESSMENTS: AssessmentDef[] = [
  check(1, "Sales Fundamentals", [
    q("bds-m01-q1", "Which best describes selling?", ["Pushing people to buy", "Helping someone solve a problem or reach a goal in exchange for money", "Talking the most", "Giving discounts"], 1, "Real selling is helping through understanding and advice."),
    q("bds-m01-q2", "What is qualifying a lead?", ["Giving the lead a certificate", "Checking they have the need, budget, authority and timing", "Sending a brochure", "Closing the deal"], 1, "Qualifying keeps your time on leads worth pursuing."),
    q("bds-m01-q3", "How does business development differ from sales?", ["It does not", "It creates new opportunities and relationships for the future, while sales converts current prospects", "It is only for large firms", "It is only closing"], 1, "BD opens doors; sales walks through them."),
    q("bds-m01-q4", "A product is not right for a prospect. What should you do?", ["Sell it anyway", "Say so honestly and suggest a better option", "Lower the price", "Stop replying"], 1, "Honesty builds trust and repeat business."),
    q("bds-m01-q5", "Which is an ethical sales habit?", ["Exaggerating benefits", "Keeping customers' confidences", "Speaking badly of competitors", "Hiding costs"], 1, "Ethics protect trust."),
  ]),
  check(2, "Understanding Your Customer", [
    q("bds-m02-q1", "What is an ideal customer profile?", ["A list of all customers", "A description of the customers who get and give the most value", "A price list", "A competitor list"], 1, "It focuses effort on the best-fit customers."),
    q("bds-m02-q2", "Which role controls the budget and gives the final yes?", ["User", "Gatekeeper", "Economic buyer", "Influencer"], 2, "The economic buyer approves the spend."),
    q("bds-m02-q3", "A shop owner says 'I want a cheaper generator'. The underlying need is likely:", ["A cheaper generator only", "To stop losing money to power cuts and fuel costs", "A nice colour", "More noise"], 1, "Dig beneath the stated request to the real driver."),
    q("bds-m02-q4", "How should you treat competitors in a sales conversation?", ["Criticise them", "Compare fairly with facts and focus on where you win", "Ignore them", "Copy their price"], 1, "Attacks reduce trust."),
    q("bds-m02-q5", "Where do you build an ICP from?", ["Guesses", "Your best existing customers", "Competitors' ads", "A random list"], 1, "Look for shared traits of your best customers."),
  ]),
  check(3, "Prospecting and Lead Generation", [
    q("bds-m03-q1", "Which source usually gives the highest quality leads?", ["Cold lists", "Referrals", "Random flyers", "Mass messages"], 1, "Referrals bring built-in trust."),
    q("bds-m03-q2", "What does BANT stand for?", ["Budget, Authority, Need, Timeline", "Brand, Audience, Name, Tone", "Buy, Ask, Negotiate, Tell", "Build, Approve, Notify, Track"], 0, "BANT is a standard qualifying checklist."),
    q("bds-m03-q3", "200 contacts give 2 customers. How many contacts are needed for 10 customers?", ["500", "1,000", "2,000", "20"], 1, "2 ÷ 200 = 1%, so 10 ÷ 0.01 = 1,000."),
    q("bds-m03-q4", "What makes a good cold message?", ["Long and about you", "Personal, brief, relevant and with one small ask", "Full of jargon", "No ask"], 1, "Relevance and a small ask get replies."),
    q("bds-m03-q5", "Before adding people to a WhatsApp group you should:", ["Add everyone", "Get their permission", "Hide the group", "Charge them"], 1, "Permission and privacy matter."),
  ]),
  check(4, "The Sales Conversation", [
    q("bds-m04-q1", "In SPIN, what does the 'I' stand for?", ["Interest", "Implication", "Information", "Idea"], 1, "Implication questions explore the effect of the problem."),
    q("bds-m04-q2", "Which discovery question is best?", ["Would you buy my product?", "What problems do you have with the generator?", "Do you like solar?", "Are you free?"], 1, "Open problem questions uncover real needs."),
    q("bds-m04-q3", "What is a benefit, compared with a feature?", ["What the product is", "What it does for the customer", "Its colour", "Its price"], 1, "Benefits answer 'what's in it for me'."),
    q("bds-m04-q4", "How much should you listen compared with talk in discovery?", ["Much less", "At least as much as you speak", "Not at all", "Only at the end"], 1, "Listening reveals needs."),
    q("bds-m04-q5", "How should a meeting end?", ["With goodbye only", "With a clear next step and date", "With a discount", "With silence"], 1, "Agree and confirm the next step."),
  ]),
  check(5, "Objections and Negotiation", [
    q("bds-m05-q1", "A customer raises an objection. What does it usually mean?", ["A firm no", "A request for more information or reassurance", "They hate you", "A bad lead"], 1, "Objections show engagement."),
    q("bds-m05-q2", "A ₦900,000 system saves ₦60,000 a month. What is the payback?", ["9 months", "12 months", "15 months", "18 months"], 2, "900,000 ÷ 60,000 = 15."),
    q("bds-m05-q3", "Cost ₦650,000, price ₦900,000. A 10% discount gives a profit per sale of:", ["₦90,000", "₦160,000", "₦250,000", "₦810,000"], 1, "810,000 − 650,000 = ₦160,000."),
    q("bds-m05-q4", "What is the best way to give a concession?", ["Give it freely", "Trade it for something in return", "Never give any", "Give it to all"], 1, "Trade, don't just give."),
    q("bds-m05-q5", "When should you walk away?", ["Never", "When terms would cost you money or damage the business, politely and leaving the door open", "At the first objection", "When the customer is rude only"], 1, "Walking away well protects value and reputation."),
  ]),
  check(6, "Proposals and Closing", [
    q("bds-m06-q1", "3 systems at ₦900,000 plus ₦150,000 installation and 7.5% VAT on the subtotal. What is the total?", ["₦2,850,000", "₦3,000,000", "₦3,063,750", "₦3,150,000"], 2, "Subtotal 2,850,000 plus VAT 213,750."),
    q("bds-m06-q2", "Why offer two or three options in a proposal?", ["To confuse", "The question becomes 'which one?' instead of 'yes or no?'", "It is required", "To hide the price"], 1, "Options frame the choice."),
    q("bds-m06-q3", "What should a good follow-up do?", ["Just ask 'any news?'", "Add value, such as an answer or useful information", "Pressure the customer", "Repeat the pitch"], 1, "Useful follow-ups keep interest."),
    q("bds-m06-q4", "Which closing technique respects the customer?", ["Fake scarcity", "A summary of agreed benefits followed by asking to proceed", "Hiding the price", "Pressure"], 1, "Honest, clear closing builds trust."),
    q("bds-m06-q5", "After the sale you should:", ["Forget the customer", "Deliver, check satisfaction and ask for a referral", "Only send invoices", "Raise the price"], 1, "The sale starts the relationship."),
  ]),
  check(7, "Pipeline, CRM and Sales Operations", [
    q("bds-m07-q1", "What should every deal in the pipeline have?", ["A discount", "A next step and a date", "A logo", "A nickname"], 1, "No next step means the deal is probably dead."),
    q("bds-m07-q2", "Deals: ₦2m at 80%, ₦5m at 40%, ₦1m at 20%. What is the weighted forecast?", ["₦3.8m", "₦4.6m", "₦8m", "₦2.7m"], 0, "1.6 + 2.0 + 0.2 = ₦3.8m."),
    q("bds-m07-q3", "What is the best CRM?", ["The most expensive", "The one you will use every day", "None", "A paper pile"], 1, "Usage matters more than features."),
    q("bds-m07-q4", "How much pipeline coverage is a common rule against a target?", ["Equal to the target", "About three to four times the target", "Half the target", "None"], 1, "Only a fraction of deals will close."),
    q("bds-m07-q5", "When should you update the CRM?", ["At month end", "The same day", "Never", "Once a year"], 1, "Same-day entry keeps data accurate."),
  ]),
  check(8, "Partnerships and Key Accounts", [
    q("bds-m08-q1", "What makes a good partnership?", ["One side wins", "Both sides win and know what they must do", "No paperwork", "Secrecy"], 1, "Clear mutual value works."),
    q("bds-m08-q2", "What is cross-selling?", ["Selling a higher version of the same item", "Offering something related, such as a maintenance plan", "Selling to rivals", "Selling cross-border"], 1, "Upselling is the higher version; cross-selling is related items."),
    q("bds-m08-q3", "100 customers, 20% buy a ₦50,000 plan. What is the extra revenue?", ["₦500,000", "₦1,000,000", "₦2,000,000", "₦5,000,000"], 1, "20 × 50,000 = ₦1,000,000."),
    q("bds-m08-q4", "A single customer is 40% of sales. What is the main risk?", ["None", "Losing them or late payment would be a crisis", "Too much profit", "Too many invoices"], 1, "Concentration risk is serious."),
    q("bds-m08-q5", "When should you upsell?", ["Always", "Only when it genuinely helps the customer", "Never", "When they are angry"], 1, "A good upsell is a service."),
  ]),
  check(9, "Measuring Sales", [
    q("bds-m09-q1", "Target ₦5m, actual ₦4.2m. What is the attainment?", ["80%", "84%", "88%", "92%"], 1, "4.2 ÷ 5 = 84%."),
    q("bds-m09-q2", "40 deals closed, 12 won. What is the win rate?", ["12%", "25%", "30%", "40%"], 2, "12 ÷ 40 = 30%."),
    q("bds-m09-q3", "400 leads give 12 wins. What is the overall conversion?", ["1%", "3%", "12%", "30%"], 1, "12 ÷ 400 = 3%."),
    q("bds-m09-q4", "Where should you focus first to improve results?", ["Everywhere", "The weakest stage with the biggest gain per effort", "The strongest stage", "Nowhere"], 1, "Fix the biggest leak."),
    q("bds-m09-q5", "Why beware of bad incentives?", ["They are legal", "Rewarding one number alone can drive bad behaviour such as heavy discounting or pointless calls", "They raise profit", "They are free"], 1, "Balance activity, quality and results."),
  ]),
  check(10, "Final Project: Sales Plan and Pitch", [
    q("bds-m10-q1", "How should a pitch begin?", ["With your life story", "With a hook about their problem", "With your price", "With a joke only"], 1, "Start with something relevant to them."),
    q("bds-m10-q2", "Revenue target ₦3.6m and deal size ₦900,000. How many wins are needed?", ["2", "3", "4", "5"], 2, "3,600,000 ÷ 900,000 = 4."),
    q("bds-m10-q3", "4 wins at a 25% proposal-to-win rate need how many proposals?", ["4", "8", "16", "25"], 2, "4 ÷ 0.25 = 16."),
    q("bds-m10-q4", "What should end your pitch?", ["Silence", "A clear next step with a date", "A new product", "An apology"], 1, "Ask for the next step."),
    q("bds-m10-q5", "How should you prepare for objections?", ["Ignore them", "Know the likely ones and have honest answers", "Argue", "Avoid the topic"], 1, "Preparation builds confidence."),
  ]),
  {
    id: `${C}-final`,
    courseId: C,
    kind: "final",
    title: "Business Development & Sales: final assessment",
    passingScore: 60,
    questions: [
      q("bds-f01", "Which is the best description of selling?", ["Convincing people to buy", "Helping solve a customer's problem in exchange for money", "Offering discounts", "Talking about your product"], 1, "Selling is helping."),
      q("bds-f02", "A lead with need, budget, authority and a near deadline is:", ["Cold", "Qualified", "Lost", "A competitor"], 1, "BANT is met."),
      q("bds-f03", "Which lead source is usually the highest quality?", ["Referrals", "Mass messages", "Random cold calls", "Posters"], 0, "Referrals carry trust."),
      q("bds-f04", "200 contacts → 20 replies → 8 meetings → 2 customers. Overall conversion?", ["1%", "2%", "10%", "25%"], 0, "2 ÷ 200 = 1%."),
      q("bds-f05", "Which question is a SPIN implication question?", ["How do you power the shop?", "How much sales do you lose when the power is out?", "Would you like solar?", "Do you have a generator?"], 1, "It explores the effect of the problem."),
      q("bds-f06", "A system costs ₦900,000 and saves ₦60,000 a month. What is the payback?", ["10 months", "12 months", "15 months", "20 months"], 2, "900,000 ÷ 60,000 = 15."),
      q("bds-f07", "Cost ₦650,000, price ₦900,000, 10% discount. Units needed for the same profit?", ["10% more", "25% more", "About 56% more", "100% more"], 2, "250,000 ÷ 160,000 = 1.56."),
      q("bds-f08", "What is the best response to 'give me 10% off or I walk'?", ["Give 10% at once", "Trade a smaller concession or a value-add for something in return", "Refuse and end the call", "Raise the price"], 1, "Trade, don't just give."),
      q("bds-f09", "3 × ₦900,000 + ₦150,000 + 7.5% VAT on the subtotal gives:", ["₦2,850,000", "₦3,063,750", "₦3,150,000", "₦3,213,750"], 1, "2,850,000 + 213,750."),
      q("bds-f10", "Deals: ₦2m at 80%, ₦5m at 40%, ₦1m at 20%. The weighted forecast is:", ["₦2.7m", "₦3.8m", "₦4.6m", "₦8m"], 1, "1.6 + 2.0 + 0.2."),
      q("bds-f11", "Which action best grows an existing account?", ["Ignoring them", "Offering a related product that genuinely helps, such as a maintenance plan", "Raising prices silently", "Reducing service"], 1, "Helpful cross-selling grows accounts."),
      q("bds-f12", "Win rate = deals won ÷ ?", ["Leads", "Deals closed (won plus lost)", "Proposals sent only", "Meetings"], 1, "Win rate compares wins with all closed deals."),
      q("bds-f13", "400 leads, 120 qualified, 48 proposals, 12 won. Which stage is weakest?", ["Lead to qualified (30%)", "Qualified to proposal (40%)", "Proposal to won (25%)", "All equal"], 2, "25% is the lowest conversion."),
      q("bds-f14", "Which is an ethical sales practice?", ["Fake scarcity", "Honest statements and keeping promises", "Hiding costs", "Insulting competitors"], 1, "Honesty and reliability build lasting trade."),
      q("bds-f15", "What should every pitch end with?", ["A joke", "One clear next step with a date", "A long apology", "A new price"], 1, "Clear next steps move deals forward."),
    ],
  },
];
