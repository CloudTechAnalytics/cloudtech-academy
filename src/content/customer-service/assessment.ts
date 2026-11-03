import type { AssessmentDef } from "../types";

const C = "customer-service-client-management";

type Q = AssessmentDef["questions"][number];
const q = (id: string, prompt: string, options: string[], answer: number, explanation: string): Q => ({ id, prompt, options, answer, explanation });

const check = (n: number, title: string, questions: Q[]): AssessmentDef => ({
  id: `cscm-m${String(n).padStart(2, "0")}-check`,
  courseId: C,
  kind: "module",
  moduleId: `cscm-m${String(n).padStart(2, "0")}`,
  title: `${title}: module check`,
  passingScore: 60,
  questions,
});

/** Customer Service & Client Management: a check for each module (it awards the module badge) and a final assessment. */
export const CSCM_ASSESSMENTS: AssessmentDef[] = [
  check(1, "What Great Customer Service Is", [
    q("cscm-m01-q1", "What decides whether a customer is satisfied?", ["Only the price", "The experience compared with their expectations", "The size of the shop", "The logo"], 1, "Satisfaction is experience minus expectation."),
    q("cscm-m01-q2", "A customer's lifetime profit is ₦54,000. Losing 20 customers costs about:", ["₦540,000", "₦1,080,000", "₦2,160,000", "₦54,000"], 1, "20 × 54,000."),
    q("cscm-m01-q3", "Which attitude is best when you cannot solve a problem yourself?", ["That is not my department", "I will find out and make sure the right person helps you", "Come back later", "Ignore it"], 1, "Ownership keeps customers."),
    q("cscm-m01-q4", "Who is a client, compared with a customer?", ["Someone who never pays", "Someone served over time, often with advice or a contract", "A competitor", "A supplier"], 1, "Clients need a relationship."),
    q("cscm-m01-q5", "Which behaviour is professional?", ["Chatting on the phone while serving", "Greeting warmly and giving full attention", "Complaining about the business online", "Discussing other customers"], 1, "Attention and respect build trust."),
  ]),
  check(2, "Communication Skills", [
    q("cscm-m02-q1", "What is an open question?", ["Yes/no", "One starting with what, how or tell me about", "A shouted question", "A rude question"], 1, "Open questions get fuller answers."),
    q("cscm-m02-q2", "What does active listening include?", ["Interrupting early", "Giving full attention, reflecting and summarising", "Planning your reply only", "Looking at your phone"], 1, "Listen to understand."),
    q("cscm-m02-q3", "Which is better in writing to a customer?", ["All capitals", "A greeting, thanks, the answer first, a next step and a courteous closing", "Slang only", "No greeting"], 1, "Clarity and courtesy."),
    q("cscm-m02-q4", "Which phrase should you avoid?", ["Let me check that for you", "Calm down", "I understand", "Thank you for your patience"], 1, "'Calm down' inflames."),
    q("cscm-m02-q5", "Cultural awareness in Nigeria includes:", ["Ignoring greetings", "Proper greetings, respect for age and titles, and avoiding stereotypes", "Using slang with elders", "Assuming everyone is the same"], 1, "Respect and individuality."),
  ]),
  check(3, "Serving Customers in Every Channel", [
    q("cscm-m03-q1", "How soon should a phone be answered ideally?", ["Within 3 rings", "After 10 rings", "Never", "After a minute"], 0, "Prompt answering matters."),
    q("cscm-m03-q2", "180 of 200 messages got a first response within target. What is the compliance?", ["80%", "85%", "90%", "95%"], 2, "180 ÷ 200."),
    q("cscm-m03-q3", "Before promotional WhatsApp messages you should:", ["Send to everyone", "Get permission and respect 'stop'", "Hide the sender", "Use all capitals"], 1, "Permission and privacy."),
    q("cscm-m03-q4", "What should you do when you put a caller on hold?", ["Leave them for ten minutes", "Ask permission and check back every 30 to 60 seconds", "Hang up", "Transfer without telling"], 1, "Do not abandon callers."),
    q("cscm-m03-q5", "The worst response to a customer message is:", ["A quick acknowledgement", "Silence", "A polite no", "An apology"], 1, "Silence loses customers."),
  ]),
  check(4, "Handling Complaints and Difficult People", [
    q("cscm-m04-q1", "What does LAST stand for?", ["Listen, Apologise, Solve, Thank", "Leave, Argue, Shout, Transfer", "Look, Ask, Say, Tell", "Learn, Act, Stop, Teach"], 0, "A simple complaint process."),
    q("cscm-m04-q2", "28 of 40 complaints are resolved at first contact. What is the FCR?", ["60%", "65%", "70%", "75%"], 2, "28 ÷ 40."),
    q("cscm-m04-q3", "How should you say no?", ["Start with 'We can't'", "Acknowledge, explain honestly, offer alternatives and offer to escalate", "Lie", "Ignore"], 1, "A good no keeps the relationship."),
    q("cscm-m04-q4", "A ₦2,000 voucher compared with ₦54,000 lifetime profit is about:", ["0.4%", "3.7%", "10%", "37%"], 1, "2 ÷ 54."),
    q("cscm-m04-q5", "If a customer is abusive, you should:", ["Argue back", "Set a polite boundary, involve a manager and put your safety first", "Hang up silently", "Give in"], 1, "Boundaries and safety."),
  ]),
  check(5, "Client Relationship Management", [
    q("cscm-m05-q1", "A client asks for a report in 2 days; you need 4. What is best?", ["Promise 2 days", "Explain the realistic time and offer an option such as a summary first", "Ignore the request", "Deliver late silently"], 1, "Manage expectations."),
    q("cscm-m05-q2", "10 of 50 clients produce ₦16m of ₦20m. What share of revenue is that?", ["20%", "50%", "80%", "90%"], 2, "16 ÷ 20."),
    q("cscm-m05-q3", "What should a good follow-up do?", ["Just say 'checking in'", "Add value, such as progress, an idea or a useful tip", "Pressure the client", "Avoid contact"], 1, "Make contact useful."),
    q("cscm-m05-q4", "Why build relationships with several people at a key client?", ["To avoid work", "So the relationship does not depend on one contact", "To confuse them", "It is a rule"], 1, "Reduce dependence."),
    q("cscm-m05-q5", "What does under-promising and over-delivering mean?", ["Lie", "Give a realistic date and deliver as promised or earlier", "Deliver late", "Promise everything"], 1, "Realistic promises build trust."),
  ]),
  check(6, "Service Standards and Systems", [
    q("cscm-m06-q1", "Which is a good service standard?", ["Be nice", "Reply to WhatsApp messages within 15 minutes during opening hours", "Do your best", "Try hard"], 1, "Specific and measurable."),
    q("cscm-m06-q2", "What does a ticket record?", ["Only the price", "The request, owner, priority, status, actions and resolution", "Only the customer's name", "Nothing"], 1, "Everything needed to track a case."),
    q("cscm-m06-q3", "When should you escalate?", ["Never", "When the issue is beyond your authority, serious, or a deadline is at risk", "For every question", "Only on Fridays"], 1, "Escalation is the right step."),
    q("cscm-m06-q4", "How should scripts be used?", ["Read in a flat voice", "As flexible guides, personalised and updated", "Never", "Without thinking"], 1, "Natural but consistent."),
    q("cscm-m06-q5", "When escalating a complaint you should:", ["Pass it on without details", "Brief the next person fully so the customer does not repeat the story", "Blame colleagues", "Hide the issue"], 1, "Brief fully."),
  ]),
  check(7, "Measuring and Improving Service", [
    q("cscm-m07-q1", "84 of 100 responses are satisfied. What is CSAT?", ["74%", "84%", "94%", "100%"], 1, "84 ÷ 100."),
    q("cscm-m07-q2", "60% promoters, 25% passives, 15% detractors. What is NPS?", ["+15", "+25", "+45", "+60"], 2, "60 − 15."),
    q("cscm-m07-q3", "170 of 200 customers remain. What is retention?", ["70%", "80%", "85%", "90%"], 2, "170 ÷ 200."),
    q("cscm-m07-q4", "What is a Pareto view of complaints for?", ["Decoration", "Seeing which causes matter most", "Hiding data", "Ranking staff"], 1, "Find the vital few."),
    q("cscm-m07-q5", "Why close the feedback loop?", ["To save time", "Customers see that their feedback leads to change", "To avoid surveys", "It is optional"], 1, "Act and tell them."),
  ]),
  check(8, "Final Project: A Service Improvement Plan", [
    q("cscm-m08-q1", "How should the plan open for the manager?", ["With every metric", "With a one-page summary of problems, improvements, cost and expected gain", "With scripts only", "With a story"], 1, "Summary first."),
    q("cscm-m08-q2", "Which is the best evidence for the diagnosis?", ["Opinion only", "A mix of observation, customer comments, complaint data and response figures", "One complaint", "A guess"], 1, "Multiple evidence sources."),
    q("cscm-m08-q3", "WhatsApp response within 15 minutes is 65% against a 95% target. The gap is:", ["20 points", "30 points", "40 points", "95 points"], 1, "95 − 65."),
    q("cscm-m08-q4", "Why test scripts and standards on someone first?", ["It is a rule", "To find unnatural or confusing parts before use", "To avoid work", "To impress"], 1, "Test and simplify."),
    q("cscm-m08-q5", "What should the plan show about cost?", ["Nothing", "The cost of the plan and the expected benefit in naira", "Only the benefit", "Only staff names"], 1, "Show cost and benefit."),
  ]),
  {
    id: `${C}-final`,
    courseId: C,
    kind: "final",
    title: "Customer Service & Client Management: final assessment",
    passingScore: 60,
    questions: [
      q("cscm-f01", "Satisfaction is best described as:", ["Price only", "Experience compared with expectation", "Staff numbers", "Shop size"], 1, "Expectation matters."),
      q("cscm-f02", "A customer spends ₦15,000 a month for 12 months at a 30% margin. Lifetime profit is:", ["₦18,000", "₦54,000", "₦180,000", "₦540,000"], 1, "15,000 × 12 × 0.30."),
      q("cscm-f03", "Which question is a good open question?", ["Did you read the instructions?", "What happened when you tried to pay?", "Is it your fault?", "Yes or no?"], 1, "Open and non-blaming."),
      q("cscm-f04", "180 of 200 messages answered within target gives:", ["80%", "85%", "90%", "95%"], 2, "180 ÷ 200."),
      q("cscm-f05", "What is the first step when a customer complains?", ["Defend", "Listen fully", "Offer a refund", "Hang up"], 1, "Listen first."),
      q("cscm-f06", "28 of 40 complaints solved first time gives an FCR of:", ["60%", "65%", "70%", "75%"], 2, "28 ÷ 40."),
      q("cscm-f07", "A good way to say no is to:", ["Start with 'No'", "Acknowledge, explain, offer alternatives and offer to escalate", "Lie", "Ignore"], 1, "Keep the relationship."),
      q("cscm-f08", "10 of 50 clients give ₦16m of ₦20m. Their share of revenue is:", ["20%", "50%", "80%", "90%"], 2, "16 ÷ 20."),
      q("cscm-f09", "Which is a measurable service standard?", ["Be friendly", "Answer calls within 3 rings", "Try your best", "Be quick"], 1, "A number makes it measurable."),
      q("cscm-f10", "When should a case be escalated?", ["Never", "When it is beyond your authority, serious or a deadline is at risk", "Always", "Only on request"], 1, "Escalate appropriately."),
      q("cscm-f11", "60% promoters and 15% detractors give an NPS of:", ["+15", "+45", "+60", "+75"], 1, "60 − 15."),
      q("cscm-f12", "40 complaints: 18 late delivery. What share is that?", ["18%", "35%", "45%", "55%"], 2, "18 ÷ 40."),
      q("cscm-f13", "170 of 200 customers remain. Churn is:", ["10%", "15%", "17%", "85%"], 1, "30 ÷ 200."),
      q("cscm-f14", "Why record every customer contact?", ["To waste time", "So nothing is lost and customers do not repeat themselves", "To spy on staff", "It is optional"], 1, "Records keep service consistent."),
      q("cscm-f15", "What belongs in a service improvement plan?", ["Opinions only", "Evidence, root causes, standards, scripts, metrics, owners, cost and benefit", "A logo", "Staff gossip"], 1, "Evidence-based plans win approval."),
    ],
  },
];
