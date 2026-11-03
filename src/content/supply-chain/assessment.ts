import type { AssessmentDef } from "../types";

const C = "supply-chain-management";

type Q = AssessmentDef["questions"][number];
const q = (id: string, prompt: string, options: string[], answer: number, explanation: string): Q => ({ id, prompt, options, answer, explanation });

const check = (n: number, title: string, questions: Q[]): AssessmentDef => ({
  id: `scm-m${String(n).padStart(2, "0")}-check`,
  courseId: C,
  kind: "module",
  moduleId: `scm-m${String(n).padStart(2, "0")}`,
  title: `${title}: module check`,
  passingScore: 60,
  questions,
});

/** Supply Chain Management: a check for each module (it awards the module badge) and a final assessment. */
export const SCM_ASSESSMENTS: AssessmentDef[] = [
  check(1, "Supply Chain Fundamentals", [
    q("scm-m01-q1", "Which best describes a supply chain?", ["Only the trucks that deliver goods", "The network of organisations and activities that turns materials into products and delivers them to customers", "A warehouse", "A purchasing department"], 1, "A supply chain spans suppliers, makers, distributors, retailers and customers."),
    q("scm-m01-q2", "In which direction does money normally flow?", ["Forward, from suppliers to customers", "Backward, from customers toward suppliers", "Only between banks", "It does not flow"], 1, "Customers pay retailers, who pay distributors, who pay manufacturers and suppliers."),
    q("scm-m01-q3", "Which product suits a responsive supply chain?", ["Cement", "Fashion sneakers with changing demand", "Table salt", "Rice with steady sales"], 1, "Uncertain, fast-changing demand needs speed and flexibility."),
    q("scm-m01-q4", "What is the main difference between SCM and logistics?", ["None", "SCM also covers planning, sourcing, making and partner relationships; logistics moves and stores goods", "Logistics is wider", "SCM is only about customs"], 1, "Logistics is one part of SCM."),
    q("scm-m01-q5", "Poor information in a supply chain usually leads to:", ["Better decisions", "Late deliveries, stockouts or excess stock", "Lower tax", "Faster transport"], 1, "Many chain problems start with late or wrong information."),
  ]),
  check(2, "Demand Planning and Forecasting", [
    q("scm-m02-q1", "Sales were 120, 135, 150 and 140. What is the 3-month moving average of the latest three?", ["135", "141.7", "145", "150"], 1, "(135 + 150 + 140) ÷ 3 = 141.7."),
    q("scm-m02-q2", "December sales are 300 and the average month is 200. What is the December seasonal index?", ["0.67", "1.0", "1.5", "2.0"], 2, "300 ÷ 200 = 1.5."),
    q("scm-m02-q3", "Forecast 140, actual 150. What is the percentage error against actual?", ["5%", "6.7%", "7.1%", "10%"], 1, "10 ÷ 150 = 6.7%."),
    q("scm-m02-q4", "What does consistently over-forecasting cause?", ["Stockouts", "Excess stock and tied-up cash", "Faster delivery", "Lower costs"], 1, "Forecasting too high means ordering too much."),
    q("scm-m02-q5", "What is the purpose of S&OP?", ["To print reports", "To agree one plan across sales, operations, purchasing and finance", "To hire staff", "To set tax"], 1, "S&OP aligns departments around a single set of numbers."),
  ]),
  check(3, "Sourcing and Supplier Management", [
    q("scm-m03-q1", "Make: ₦2,000,000 fixed plus ₦300 a unit. Buy: ₦500 a unit. What is the break-even volume?", ["4,000", "8,000", "10,000", "20,000"], 2, "2,000,000 ÷ (500 − 300) = 10,000."),
    q("scm-m03-q2", "At 12,000 units with those costs, which is cheaper?", ["Buy", "Make", "They are equal", "Cannot tell"], 1, "Make = ₦5,600,000; buy = ₦6,000,000."),
    q("scm-m03-q3", "Lead times were 10, 12, 14, 10, 14 days. What is the average?", ["10", "11", "12", "14"], 2, "60 ÷ 5 = 12."),
    q("scm-m03-q4", "Why does lead time variability matter?", ["It does not", "It forces you to plan around the longer time or hold safety stock", "It lowers cost", "It removes risk"], 1, "Variable lead times make planning harder."),
    q("scm-m03-q5", "A good way to reduce risk with a critical single supplier is to:", ["Ignore it", "Pre-qualify a backup and hold safety stock", "Pay early", "Cancel orders"], 1, "Backups and buffers protect supply."),
  ]),
  check(4, "Inventory Management", [
    q("scm-m04-q1", "D = 12,000, S = ₦5,000, H = ₦120. What is the EOQ?", ["500", "1,000", "2,000", "12,000"], 1, "√(2 × 12,000 × 5,000 ÷ 120) = 1,000."),
    q("scm-m04-q2", "Demand 40 a day, lead time 9 days, safety stock 50. What is the reorder point?", ["360", "410", "450", "490"], 1, "40 × 9 + 50 = 410."),
    q("scm-m04-q3", "In ABC analysis, A items are:", ["The cheapest items", "The few items making up about 80% of usage value", "The slowest items", "Returned items"], 1, "A items are high-value and managed tightly."),
    q("scm-m04-q4", "Why do cycle counts help?", ["They replace every record", "They find stock errors early through regular small counts", "They cut prices", "They reduce demand"], 1, "Frequent counts catch discrepancies sooner."),
    q("scm-m04-q5", "What happens to safety stock if you want a higher service level?", ["It falls", "It rises, often steeply", "It stays the same", "It vanishes"], 1, "Higher service levels need more buffer."),
  ]),
  check(5, "Operations and Production Planning", [
    q("scm-m05-q1", "A bakery plans 900 loaves on a capacity of 1,000. What is utilisation?", ["80%", "90%", "100%", "110%"], 1, "900 ÷ 1,000 = 90%."),
    q("scm-m05-q2", "Steps make 120, 80 and 100 units an hour. What is the line output?", ["120", "100", "80", "300"], 2, "The bottleneck sets the output: 80."),
    q("scm-m05-q3", "Which of these is a lean waste?", ["Overproduction", "Customer value", "Right-first-time", "Standard work"], 0, "Making more than is needed is waste."),
    q("scm-m05-q4", "2,000 units with 3% defects at ₦1,500 rework each. What is the weekly cost?", ["₦45,000", "₦60,000", "₦90,000", "₦150,000"], 2, "60 units × ₦1,500 = ₦90,000."),
    q("scm-m05-q5", "Speeding up a non-bottleneck step will usually:", ["Raise total output", "Only build a queue in front of the bottleneck", "Lower defects", "Cut demand"], 1, "Output is limited by the bottleneck."),
  ]),
  check(6, "Warehousing and Distribution", [
    q("scm-m06-q1", "Why slot fast-moving items near dispatch?", ["To hide them", "To cut picker travel, the biggest part of picking time", "To raise rent", "It is a law"], 1, "Less travel means higher productivity."),
    q("scm-m06-q2", "Four pickers pick 480 lines in 8 hours. What is lines per picker-hour?", ["12", "15", "60", "120"], 1, "480 ÷ (4 × 8) = 15."),
    q("scm-m06-q3", "One warehouse costs ₦13,000,000 and two cost ₦15,000,000 in total. When might two still be right?", ["Never", "When faster service wins or keeps enough extra sales", "When rent falls", "When stock is lower"], 1, "Service benefit can outweigh higher cost."),
    q("scm-m06-q4", "What is cross-docking?", ["Long-term storage", "Moving inbound goods almost directly to outbound vehicles", "Stock counting", "Returning goods"], 1, "It cuts storage and handling."),
    q("scm-m06-q5", "What is a 3PL?", ["A tax", "A third-party logistics provider that stores and ships for you", "A forecasting method", "A type of container"], 1, "3PLs outsource warehousing and fulfilment."),
  ]),
  check(7, "Transport and Logistics", [
    q("scm-m07-q1", "A 500 km trip carries 8 tonnes for ₦400,000. What is the cost per tonne-km?", ["₦50", "₦100", "₦400", "₦500"], 1, "400,000 ÷ (8 × 500) = ₦100."),
    q("scm-m07-q2", "A 10-tonne truck carries 7.5 tonnes. What is its load utilisation?", ["50%", "65%", "75%", "85%"], 2, "7.5 ÷ 10 = 75%."),
    q("scm-m07-q3", "Three trips cost ₦120,000 each; one combined route costs ₦210,000. What is the saving?", ["₦90,000", "₦150,000", "₦210,000", "₦360,000"], 1, "360,000 − 210,000 = ₦150,000."),
    q("scm-m07-q4", "For urgent medicines, which carrier choice is usually better?", ["The cheapest, even if often late", "The more reliable one, even if dearer", "Either", "None"], 1, "Reliability matters more than a small saving."),
    q("scm-m07-q5", "Why use a carrier scorecard?", ["To lower fuel", "To track on-time %, damage and cost so you can manage performance", "To set tax", "To avoid contracts"], 1, "Measurement drives improvement."),
  ]),
  check(8, "Supply Chain Technology and Data", [
    q("scm-m08-q1", "Which formula totals column B where column A is 'Cement'?", ["=SUM(A:B)", "=SUMIF(A:A,\"Cement\",B:B)", "=COUNT(B:B)", "=IF(A1,B1)"], 1, "SUMIF adds the values that meet a condition."),
    q("scm-m08-q2", "Which is a data quality problem?", ["A unique supplier code", "The same supplier entered under three different names", "A required lead time field", "One unit of measure"], 1, "Duplicates distort analysis."),
    q("scm-m08-q3", "What is the benefit of shipment visibility?", ["It speeds the ship", "Earlier warning and action when something goes wrong", "It removes duties", "It lowers tax"], 1, "Visibility helps only if someone acts on it."),
    q("scm-m08-q4", "What should come first when choosing a system?", ["The most expensive tool", "The process and problem to solve", "A logo", "The vendor's slogan"], 1, "Fix the process before automating it."),
    q("scm-m08-q5", "'Garbage in, garbage out' means:", ["Dirty warehouses are cheaper", "Poor input data produces poor results", "Waste should be recycled", "Always delete data"], 1, "Analysis is only as good as the data."),
  ]),
  check(9, "Risk, Resilience and Sustainability", [
    q("scm-m09-q1", "A 5% chance of a ₦40,000,000 loss has an expected loss of:", ["₦200,000", "₦2,000,000", "₦4,000,000", "₦20,000,000"], 1, "0.05 × 40,000,000 = ₦2,000,000."),
    q("scm-m09-q2", "Buying insurance against a risk is an example of:", ["Avoiding it", "Transferring it", "Accepting it", "Ignoring it"], 1, "Insurance transfers the financial loss."),
    q("scm-m09-q3", "Why can lean chains be fragile?", ["They hold little stock and rely on few suppliers", "They are always expensive", "They use too many suppliers", "They have no costs"], 0, "Little buffer means little room for shocks."),
    q("scm-m09-q4", "20 tonnes over 500 km at 0.1 kg CO₂ per tonne-km gives about:", ["100 kg", "500 kg", "1,000 kg", "10,000 kg"], 2, "10,000 tonne-km × 0.1 = 1,000 kg."),
    q("scm-m09-q5", "What should a contingency plan state?", ["Only the budget", "The trigger, actions, owners and communication", "A logo", "Nothing until a crisis"], 1, "Plans must be written before they are needed."),
  ]),
  check(10, "Performance Measurement", [
    q("scm-m10-q1", "1,000 units ordered and 940 shipped from stock. What is the fill rate?", ["90%", "92%", "94%", "96%"], 2, "940 ÷ 1,000 = 94%."),
    q("scm-m10-q2", "COGS ₦240m and average inventory ₦40m. What is inventory turnover?", ["4", "5", "6", "8"], 2, "240 ÷ 40 = 6."),
    q("scm-m10-q3", "Days of inventory 61, sales outstanding 30, payables 45. What is the cash-to-cash cycle?", ["16 days", "46 days", "76 days", "136 days"], 1, "61 + 30 − 45 = 46."),
    q("scm-m10-q4", "What does cost to serve show?", ["Only the product cost", "The true cost of supplying a customer or channel", "The supplier's margin", "Customs duty"], 1, "Same revenue can have very different service costs."),
    q("scm-m10-q5", "What is the last step of PDCA?", ["Plan", "Do", "Check", "Act: adopt or adjust"], 3, "Act adopts what worked or adjusts and restarts."),
  ]),
  check(11, "Global Supply Chains and Trade", [
    q("scm-m11-q1", "$5.00 at ₦1,500 plus 30% costs is a landed cost of:", ["₦7,500", "₦8,750", "₦9,750", "₦11,250"], 2, "7,500 × 1.30 = ₦9,750."),
    q("scm-m11-q2", "Lead time 40 days and sales 25 a day. How many units are in the pipeline?", ["250", "640", "1,000", "1,500"], 2, "40 × 25 = 1,000."),
    q("scm-m11-q3", "If the naira weakens, what happens to the cost of a dollar-priced import?", ["It falls", "It rises", "No change", "Duty disappears"], 1, "Each dollar costs more naira."),
    q("scm-m11-q4", "Why compare sources on total landed cost?", ["The supplier's price leaves out freight, duty and other costs", "It is a law", "It lowers duty", "It speeds shipping"], 0, "Only landed cost shows the real comparison."),
    q("scm-m11-q5", "What is nearshoring?", ["Sourcing from nearby countries", "Selling only locally", "Storing goods near the sea", "Using only air freight"], 0, "Nearshoring shortens distance and lead time."),
  ]),
  check(12, "Final Project: Analyse and Improve a Supply Chain", [
    q("scm-m12-q1", "What should open your project report?", ["A long history", "A one-paragraph summary of problems, recommendations and benefit", "A list of every idea", "A picture"], 1, "Decision-makers need the summary first."),
    q("scm-m12-q2", "How should you choose which problems to solve?", ["All of them", "Rank by size of benefit and ease", "Pick at random", "Pick the easiest only"], 1, "Focus on the few that matter most."),
    q("scm-m12-q3", "Why show formulas and workings?", ["To fill pages", "So a reader can check your numbers", "Because it is required by customs", "To hide results"], 1, "Transparent workings build credibility."),
    q("scm-m12-q4", "What belongs in the business case?", ["Benefit only", "Benefit, cost and effort, and risks", "Only the cost", "Only the supplier"], 1, "A fair case weighs benefit against cost and risk."),
    q("scm-m12-q5", "How will you know if your improvements worked?", ["Hope", "Measure a KPI before and after", "Ask no one", "Wait a year"], 1, "A KPI with a baseline shows the result."),
  ]),
  {
    id: `${C}-final`,
    courseId: C,
    kind: "final",
    title: "Supply Chain Management: final assessment",
    passingScore: 60,
    questions: [
      q("scm-f01", "Which flow runs backward through a supply chain?", ["Goods", "Money", "Finished products", "Raw materials"], 1, "Customers pay back toward suppliers."),
      q("scm-f02", "Which strategy suits stable, predictable products?", ["Efficient", "Responsive", "Neither", "Both exactly"], 0, "Stable demand rewards a low-cost efficient chain."),
      q("scm-f03", "The 3-month moving average of 135, 150, 140 is about:", ["135", "141.7", "150", "142.5 exactly"], 1, "425 ÷ 3 = 141.7."),
      q("scm-f04", "A seasonal index of 1.5 and an underlying level of 220 give a forecast of:", ["220", "310", "330", "370"], 2, "220 × 1.5 = 330."),
      q("scm-f05", "Make-or-buy break-even: fixed ₦2,000,000, variable ₦300, buy ₦500. What volume?", ["5,000", "8,000", "10,000", "20,000"], 2, "2,000,000 ÷ 200 = 10,000."),
      q("scm-f06", "What is the EOQ for D = 12,000, S = ₦5,000, H = ₦120?", ["500", "1,000", "1,200", "2,400"], 1, "√1,000,000 = 1,000."),
      q("scm-f07", "Which items does ABC analysis ask you to control most tightly?", ["A items", "B items", "C items", "None"], 0, "A items carry most of the value."),
      q("scm-f08", "A process makes 120, 80 and 100 units an hour in sequence. What limits output?", ["The 120 step", "The 80 step", "The 100 step", "The average"], 1, "The slowest step is the bottleneck."),
      q("scm-f09", "One warehouse costs ₦13m, two cost ₦15m in total. Which is cheaper?", ["Two warehouses", "One warehouse", "Equal", "Cannot tell"], 1, "13 < 15."),
      q("scm-f10", "A 500 km trip with 8 tonnes costing ₦400,000 is how much per tonne?", ["₦40,000", "₦50,000", "₦100,000", "₦400,000"], 1, "400,000 ÷ 8 = 50,000."),
      q("scm-f11", "What most improves data quality?", ["More spreadsheets", "Unique codes, standard units and validation on entry", "Hiding the data", "Deleting old records"], 1, "Clean master data prevents errors."),
      q("scm-f12", "5% chance of a ₦40m loss; backup costs ₦1.5m a year. What follows?", ["Expected loss ₦2m exceeds the cost, so a backup is justified", "Never buy a backup", "Expected loss is ₦200,000", "Expected loss is ₦20m"], 0, "0.05 × 40m = ₦2m."),
      q("scm-f13", "COGS ₦240m and average inventory ₦40m give days of inventory of about:", ["30", "45", "61", "90"], 2, "365 ÷ 6 = 61."),
      q("scm-f14", "Days of inventory 61, receivables 30, payables 45. What is cash-to-cash?", ["46 days", "76 days", "16 days", "136 days"], 0, "61 + 30 − 45 = 46."),
      q("scm-f15", "An import's landed cost is ₦9,750 and the local price is ₦9,200. Which is cheaper per unit?", ["Import by ₦550", "Local by ₦550", "Equal", "Import by ₦1,000"], 1, "Local is ₦550 cheaper."),
    ],
  },
];
