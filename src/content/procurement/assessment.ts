import type { AssessmentDef } from "../types";

const C = "procurement-sourcing";

type Q = AssessmentDef["questions"][number];
const q = (id: string, prompt: string, options: string[], answer: number, explanation: string): Q => ({ id, prompt, options, answer, explanation });

const check = (n: number, title: string, questions: Q[]): AssessmentDef => ({
  id: `proc-m${String(n).padStart(2, "0")}-check`,
  courseId: C,
  kind: "module",
  moduleId: `proc-m${String(n).padStart(2, "0")}`,
  title: `${title}: module check`,
  passingScore: 60,
  questions,
});

/** Procurement & Sourcing: a check for each module (it awards the module badge) and a final assessment. */
export const PROC_ASSESSMENTS: AssessmentDef[] = [
  check(1, "Procurement Fundamentals", [
    q("proc-m01-q1", "What is the main difference between procurement and purchasing?", ["There is none", "Purchasing is the transaction; procurement is the whole process from need to review", "Procurement only applies to government", "Purchasing includes negotiation and procurement does not"], 1, "Purchasing is one step inside procurement."),
    q("proc-m01-q2", "Why can a 5% saving on purchases add more to profit than a 5% rise in sales?", ["Sales never add profit", "A saving goes straight to profit, while extra sales bring extra costs", "Savings are taxed less", "It cannot"], 1, "Savings drop to the bottom line; extra sales usually need extra cost to produce."),
    q("proc-m01-q3", "Which step comes right after identifying the need?", ["Paying the supplier", "Specifying the requirement", "Raising the purchase order", "Reviewing performance"], 1, "You need a clear specification before you can find or compare suppliers."),
    q("proc-m01-q4", "A person requests an item, picks the supplier, approves the order and signs the payment. What is the main problem?", ["It is faster", "No separation of duties, so errors or fraud can go unnoticed", "Suppliers dislike it", "It breaks the VAT rules"], 1, "Separating roles creates checks."),
    q("proc-m01-q5", "Which role records goods received and controls stock?", ["Requester", "Approver", "Stores", "Supplier"], 2, "Stores receives, inspects and records goods."),
  ]),
  check(2, "Supplier Identification", [
    q("proc-m02-q1", "Why write a specification before looking for suppliers?", ["It is required by law", "Vague requests produce quotes that cannot be compared", "It lowers prices automatically", "Suppliers need it for tax"], 1, "A clear specification lets you compare like with like."),
    q("proc-m02-q2", "What is a short list?", ["Every supplier you found", "The few suppliers you will ask for a quote", "Suppliers you rejected", "A list of items"], 1, "The long list is narrowed to the few worth a quote."),
    q("proc-m02-q3", "About how many suppliers should usually be on the short list?", ["One", "Two", "Three to five", "Twenty"], 2, "Fewer than three gives no comparison; many more slows you down."),
    q("proc-m02-q4", "A local quote is ₦6,800,000. An overseas quote is ₦5,200,000 plus ₦900,000 freight, duty and clearing. Which is cheaper?", ["Local by ₦700,000", "Overseas by ₦700,000", "They are equal", "Overseas by ₦1,600,000"], 1, "Overseas total ₦6,100,000 is ₦700,000 less, before considering lead time and risk."),
    q("proc-m02-q5", "Which is a good must-have question for cutting a long list?", ["Do they have a nice website?", "Can they supply the quantity in the time we need?", "Are they the largest company?", "Do they offer the lowest price?"], 1, "Must-haves test whether a supplier can do the job at all."),
  ]),
  check(3, "Vendor Evaluation", [
    q("proc-m03-q1", "Why use a weighted scoring matrix?", ["To avoid talking to suppliers", "To compare suppliers fairly on what matters most", "To justify the cheapest quote", "It is required for every purchase"], 1, "Weights show priorities and make the choice explainable."),
    q("proc-m03-q2", "When should the criteria and weights be agreed?", ["After seeing the quotes", "Before looking at the quotes", "After signing the contract", "Never"], 1, "Changing them afterwards to suit a favourite is biased."),
    q("proc-m03-q3", "Weights: price 40%, quality 30%, delivery 20%, service 10%. Supplier scores 8, 6, 7, 9. What is the total?", ["6.9", "7.3", "7.5", "30"], 1, "3.2 + 1.8 + 1.4 + 0.9 = 7.3."),
    q("proc-m03-q4", "What does a reference check give you that a brochure does not?", ["A lower price", "Evidence of how the supplier really performs for others", "A legal guarantee", "A discount"], 1, "Customers can say whether the supplier delivers and fixes problems."),
    q("proc-m03-q5", "What is a sensible way to start with a new, unproven supplier?", ["A very large order", "A small trial order", "Full payment in advance", "No checks"], 1, "A trial limits your exposure while you learn."),
  ]),
  check(4, "RFQ and RFP", [
    q("proc-m04-q1", "When is an RFQ most suitable?", ["A complex need where suppliers propose different solutions", "A clear, standard item where price is the main difference", "Never", "Only for government"], 1, "RFQs suit well-defined items; RFPs suit complex needs."),
    q("proc-m04-q2", "Three bids for 500 chairs: A ₦24,000 delivered; B ₦22,500 plus ₦400,000 delivery; C ₦23,000 delivered. Which has the lowest total?", ["A", "B", "C", "They are equal"], 2, "A = 12,000,000; B = 11,650,000; C = 11,500,000."),
    q("proc-m04-q3", "A bid is far lower than the others. What should you do?", ["Accept it straight away", "Check it meets the specification and ask what is included", "Reject it automatically", "Tell other suppliers its price"], 1, "Very low bids can hide misunderstandings, exclusions or later variations."),
    q("proc-m04-q4", "Supplier A asks a question about the RFQ. What is the fair response?", ["Answer only A", "Share the question and answer with all suppliers", "Ignore it", "Change the deadline for A"], 1, "All bidders must have the same information."),
    q("proc-m04-q5", "Why keep a record of bids, scoring and the decision?", ["To impress suppliers", "To make the decision auditable and defensible", "Because suppliers ask", "To avoid paying"], 1, "A documented decision can be explained and checked."),
  ]),
  check(5, "Negotiation", [
    q("proc-m05-q1", "What is a BATNA?", ["The best alternative to a negotiated agreement", "A bank transfer", "A budget approval", "The biggest available discount"], 0, "Your best alternative sets how strong your position is."),
    q("proc-m05-q2", "You buy 400 units at ₦15,000 with a 3% volume discount. What is the new total?", ["₦5,820,000", "₦5,850,000", "₦5,970,000", "₦6,000,000"], 0, "6,000,000 − 180,000 = ₦5,820,000."),
    q("proc-m05-q3", "A supplier says the offer ends today. What is the best response?", ["Accept immediately", "Stay calm, ask what could change, and avoid being rushed", "Walk out", "Threaten to report them"], 1, "Real deals rarely vanish in a day; pressure is a tactic."),
    q("proc-m05-q4", "Why negotiate payment terms as well as price?", ["They have no value", "Longer terms improve your cash flow, and early-payment discounts can save money", "Suppliers cannot change them", "They are set by law"], 1, "Terms are part of the total cost."),
    q("proc-m05-q5", "What should you do at the end of a negotiation?", ["Shake hands only", "Confirm the agreement in writing", "Delete the notes", "Reopen the price"], 1, "Written confirmation avoids later disputes."),
  ]),
  check(6, "Purchase Orders and Contracts", [
    q("proc-m06-q1", "What should happen before a purchase order is raised?", ["Nothing", "An approved purchase requisition", "Payment", "The goods arrive"], 1, "Approval prevents unauthorised commitments."),
    q("proc-m06-q2", "Ordered 200 at ₦3,500; 190 delivered, 12 damaged. What do you pay for?", ["200 units", "190 units", "178 units", "12 units"], 2, "190 − 12 = 178 good units, ₦623,000."),
    q("proc-m06-q3", "Why require the PO number on invoices and delivery notes?", ["For marketing", "So documents can be matched", "It is a tax rule", "It speeds up the supplier"], 1, "The number links order, delivery and invoice."),
    q("proc-m06-q4", "Which contract term deals with late delivery?", ["Confidentiality", "Penalties or liquidated damages", "Scope", "Governing language"], 1, "Penalty clauses set the consequence for lateness."),
    q("proc-m06-q5", "What do you do first when goods arrive with damage?", ["Sign without noting anything", "Note the damage on the delivery note and tell the supplier in writing", "Throw them away", "Pay in full and complain later"], 1, "Record and report it immediately, with evidence."),
  ]),
  check(7, "Procurement Processes and Controls", [
    q("proc-m07-q1", "What is order splitting?", ["Dividing deliveries by branch", "Breaking one purchase into smaller orders to stay under an approval limit", "Ordering from two suppliers", "A discount method"], 1, "It bypasses controls and is a fraud warning sign."),
    q("proc-m07-q2", "Which three documents are matched in a three-way match?", ["Quote, contract, receipt", "Purchase order, goods received note, invoice", "Requisition, tender, payment", "Invoice, bank statement, tax return"], 1, "PO, GRN and invoice must agree before payment."),
    q("proc-m07-q3", "PO 100 at ₦2,000; GRN 95; invoice for 100. What should you pay?", ["₦200,000", "₦190,000 after the invoice is corrected", "₦100,000", "Nothing ever"], 1, "Pay only for what was received: 95 × ₦2,000."),
    q("proc-m07-q4", "What is an audit trail?", ["A route to the warehouse", "Records that let someone follow a purchase from request to payment", "A supplier list", "A kind of tax"], 1, "Complete files answer 'why did we buy this?'."),
    q("proc-m07-q5", "What makes a procurement policy effective?", ["Being long and complex", "Being simple, known by staff and followed", "Staying secret", "Never changing"], 1, "A policy nobody follows gives false comfort."),
  ]),
  check(8, "Inventory Coordination", [
    q("proc-m08-q1", "Usage is 20 reams a day, lead time 7 days, safety stock 40. What is the reorder point?", ["140", "160", "180", "280"], 2, "20 × 7 = 140; plus 40 = 180."),
    q("proc-m08-q2", "What is safety stock for?", ["Decoration", "A buffer against late delivery or higher demand", "Returns", "Taxes"], 1, "It covers uncertainty during the lead time."),
    q("proc-m08-q3", "Sales of 400, 450 and 500 in three months. What is the moving average?", ["400", "450", "475", "500"], 1, "(400 + 450 + 500) ÷ 3 = 450."),
    q("proc-m08-q4", "What does FIFO mean for stock?", ["First in, first out: use old stock first", "Fast in, fast out", "Fixed inventory for orders", "Final in, final out"], 0, "FIFO reduces expiry and deterioration."),
    q("proc-m08-q5", "Frequent 'urgent' purchases usually suggest:", ["Good planning", "Reorder points and forecasts are wrong", "Suppliers are cheap", "Too much stock"], 1, "Fix the planning, not just the emergency."),
  ]),
  check(9, "Cost Control and Savings", [
    q("proc-m09-q1", "What does total cost of ownership include?", ["Only the purchase price", "Price plus delivery, running, maintenance, training and disposal costs", "Only the discount", "Only the tax"], 1, "TCO covers the whole life of the item."),
    q("proc-m09-q2", "Price ₦5,000 falls to ₦4,600 on 1,000 units. What is the saving?", ["₦40,000", "₦400,000", "₦4,600,000", "₦5,000,000"], 1, "(5,000 − 4,600) × 1,000 = ₦400,000."),
    q("proc-m09-q3", "What does the 80/20 rule suggest in spend analysis?", ["Treat all categories equally", "A few categories take most of the spend, so focus effort there", "Buy 80% locally", "Save 20%"], 1, "Focus on the biggest categories first."),
    q("proc-m09-q4", "Which is a false saving?", ["A negotiated lower price for the same quality", "A cheaper product that fails sooner and costs more overall", "Combining orders for a discount", "Removing duplicate purchases"], 1, "Savings must hold on total cost and quality."),
    q("proc-m09-q5", "Why separate cost reduction from cost avoidance in reports?", ["They are the same", "Reduction is money no longer spent; avoidance is a rise that did not happen", "Avoidance is illegal", "Finance dislikes savings"], 1, "Clear labelling keeps the figures credible."),
  ]),
  check(10, "Supplier Relationship Management", [
    q("proc-m10-q1", "46 of 50 orders arrive on time and complete. What is OTIF?", ["46%", "88%", "92%", "96%"], 2, "46 ÷ 50 = 92%."),
    q("proc-m10-q2", "A low-spend supplier is the only source of a critical part. What type is it?", ["Strategic", "Leverage", "Bottleneck", "Routine"], 2, "Low spend but high supply risk is a bottleneck item."),
    q("proc-m10-q3", "What is the best first step when a supplier fails to deliver?", ["Stop all contact", "Gather facts and tell them promptly in writing", "Cancel every order", "Post about it online"], 1, "Facts and clear communication fix more problems than anger."),
    q("proc-m10-q4", "Why qualify a backup supplier?", ["To waste time", "To reduce the risk of depending on one source", "To lower tax", "It is a legal requirement"], 1, "A backup protects against disruption."),
    q("proc-m10-q5", "What should a scorecard lead to?", ["A filing cabinet", "A conversation and an improvement plan", "A lawsuit", "A price increase"], 1, "Measures matter when they drive action."),
  ]),
  check(11, "Local and International Sourcing, and Ethics", [
    q("proc-m11-q1", "Imported goods ₦700,000, freight and insurance ₦120,000, duty and VAT ₦150,000, clearing ₦60,000, transport ₦20,000. What is the landed cost?", ["₦700,000", "₦850,000", "₦1,050,000", "₦1,100,000"], 2, "Add every cost: ₦1,050,000."),
    q("proc-m11-q2", "You discover a bidder is your relative. What do you do?", ["Say nothing", "Declare it and step back from the decision", "Help them quietly", "Cancel the bid"], 1, "Declare, step back, let someone else decide."),
    q("proc-m11-q3", "A supplier sends an expensive gift during a tender. What is the right response?", ["Keep it", "Decline or return it and record it", "Share it with the team secretly", "Ask for more"], 1, "Gifts during a tender can look like bribes."),
    q("proc-m11-q4", "Why is the lead time of an imported item a cost?", ["It is not", "You hold more stock and tie up cash while waiting", "Customs refunds it", "It lowers duty"], 1, "Long lead times increase stock needs and slow reaction."),
    q("proc-m11-q5", "Which is part of ethical procurement?", ["Ignoring working conditions if the price is low", "Asking about labour standards, environment and paying suppliers on time", "Hiding costs from suppliers", "Using only one supplier forever"], 1, "Ethics covers labour, environment and fair dealing."),
  ]),
  check(12, "Final Project: A Practical Procurement", [
    q("proc-m12-q1", "How should the recommendation be organised for a manager?", ["Evidence first, recommendation hidden at the end", "Lead with the recommendation, then show the evidence", "Only the price", "Only the supplier's brochure"], 1, "Managers need the decision first and the support after."),
    q("proc-m12-q2", "What should the supplier comparison show?", ["Unit price only", "Total cost, delivery, payment terms, warranty and scores", "Supplier names only", "Photos"], 1, "Compare on a common basis, including total cost."),
    q("proc-m12-q3", "What makes a saving figure credible?", ["A bigger number", "A clear baseline with evidence", "No explanation", "Including avoided costs as cash"], 1, "Finance must be able to check it."),
    q("proc-m12-q4", "Why include a risk and how you will manage it?", ["It lengthens the report", "It shows you thought about what could go wrong", "It is optional decoration", "It lowers the price"], 1, "Approvers want to know the risks and the response."),
    q("proc-m12-q5", "What belongs in the purchase order you draft?", ["Only the price", "Number, parties, item, quantity, price, delivery, payment terms and approval", "Your CV", "The supplier's bank PIN"], 1, "A complete PO prevents disputes."),
  ]),
  {
    id: `${C}-final`,
    courseId: C,
    kind: "final",
    title: "Procurement & Sourcing: final assessment",
    passingScore: 60,
    questions: [
      q("proc-f01", "What is the first step of the procurement cycle?", ["Paying the supplier", "Identifying the need", "Negotiating", "Issuing a purchase order"], 1, "Everything starts with a clear need."),
      q("proc-f02", "Which best describes procurement?", ["Raising purchase orders", "The whole process of getting goods and services, from need to review", "Paying invoices", "Storing goods"], 1, "Procurement spans the whole cycle."),
      q("proc-f03", "Weights: price 40%, quality 30%, delivery 20%, service 10%. Supplier X scores 9, 5, 6, 7. What is the total?", ["6.5", "7.0", "7.2", "27"], 1, "3.6 + 1.5 + 1.2 + 0.7 = 7.0."),
      q("proc-f04", "Why should all bidders receive the same information?", ["To confuse them", "To keep the competition fair", "It lowers prices automatically", "It is optional"], 1, "Fairness is the basis of a defensible award."),
      q("proc-f05", "A bidder offers a price 30% lower than the rest. What do you do first?", ["Award at once", "Check it meets the specification and what is excluded", "Disqualify them", "Tell the others"], 1, "Verify compliance before getting excited about price."),
      q("proc-f06", "What is a good negotiation approach?", ["Focus only on the unit price", "Prepare targets, a walk-away point and alternatives, and negotiate total cost", "Bluff about competitors", "Never ask questions"], 1, "Preparation and total cost thinking win better deals."),
      q("proc-f07", "400 units at ₦15,000 with a 3% discount. What is the total?", ["₦5,820,000", "₦5,880,000", "₦5,970,000", "₦6,000,000"], 0, "6,000,000 − 180,000 = ₦5,820,000."),
      q("proc-f08", "PO 100 at ₦2,000; GRN 95; invoice 100. What do you pay?", ["₦200,000", "₦190,000 once corrected", "₦100,000", "₦0 forever"], 1, "Pay for what was received."),
      q("proc-f09", "Which control stops one person running a purchase end to end?", ["Segregation of duties", "A bigger budget", "Longer lead times", "Price lists"], 0, "Splitting roles creates checks."),
      q("proc-f10", "Usage 30 boxes a day, lead time 5 days, safety stock 60. What is the reorder point?", ["150", "180", "210", "300"], 2, "30 × 5 = 150; plus 60 = 210."),
      q("proc-f11", "Printer A costs ₦150,000 plus ₦40,000 ink a year; Printer B ₦220,000 plus ₦15,000 a year. Over 3 years, which is cheaper?", ["A by ₦70,000", "B by ₦5,000", "They are equal", "A by ₦5,000"], 1, "A = 270,000; B = 265,000."),
      q("proc-f12", "Which statement about savings is correct?", ["Cost avoidance is cash saved", "Cost reduction is paying less than before for the same thing", "Savings need no evidence", "Savings never matter"], 1, "Reduction is real; avoidance should be labelled separately."),
      q("proc-f13", "46 of 50 orders are on time and complete. Targets are OTIF 95%. What follows?", ["The target is met", "OTIF is 92%, so the target is missed and an improvement plan is needed", "OTIF is 46%", "Nothing"], 1, "46/50 = 92%, below 95%."),
      q("proc-f14", "You have a conflict of interest in a tender. What do you do?", ["Declare it and step back", "Hide it", "Vote for your friend", "Resign immediately"], 0, "Declare, step back, let someone else decide."),
      q("proc-f15", "What makes an imported item's price comparable with a local one?", ["Its unit price alone", "Its full landed cost and lead-time risk", "Its logo", "Its country"], 1, "Compare total landed cost, not the quoted unit price."),
    ],
  },
];
