import type { AssessmentDef } from "../types";

const C = "professional-office-administration";

type Q = AssessmentDef["questions"][number];
const q = (id: string, prompt: string, options: string[], answer: number, explanation: string): Q => ({ id, prompt, options, answer, explanation });

const check = (n: number, title: string, questions: Q[]): AssessmentDef => ({
  id: `poa-m${String(n).padStart(2, "0")}-check`,
  courseId: C,
  kind: "module",
  moduleId: `poa-m${String(n).padStart(2, "0")}`,
  title: `${title}: module check`,
  passingScore: 60,
  questions,
});

/** Professional Office Administration: a check for each module (it awards the module badge) and a final assessment. */
export const POA_ASSESSMENTS: AssessmentDef[] = [
  check(1, "The Professional Administrator", [
    q("poa-m01-q1", "Which best describes the administrator's role?", ["Only typing", "Keeping the organisation running smoothly through communication, organisation, records and support", "Only answering phones", "Only ordering"], 1, "The role covers many supporting tasks."),
    q("poa-m01-q2", "A friend asks for a colleague's salary. What do you do?", ["Tell them", "Politely decline: it is confidential", "Guess", "Post it online"], 1, "Discretion is essential."),
    q("poa-m01-q3", "If unsure whether information is confidential you should:", ["Share it", "Treat it as confidential and ask", "Ignore it", "Post it"], 1, "When in doubt, protect it."),
    q("poa-m01-q4", "A vendor who is your relative offers a gift. You should:", ["Accept quietly", "Decline and declare the conflict of interest", "Hide it", "Ask for more"], 1, "Declare and decline."),
    q("poa-m01-q5", "Which behaviour is professional?", ["Gossiping", "Greeting visitors politely and keeping a tidy desk", "Personal calls all day", "Blaming colleagues"], 1, "Courtesy and tidiness."),
  ]),
  check(2, "Communication at Work", [
    q("poa-m02-q1", "A good email subject line is:", ["Hi", "Meeting", "Board meeting, Tuesday 12 March, 10 am, Room 2", "Urgent!!!"], 2, "Specific and informative."),
    q("poa-m02-q2", "What should minutes record?", ["Every word", "Decisions and actions with owners and deadlines", "Only attendance", "Opinions only"], 1, "Decisions and actions."),
    q("poa-m02-q3", "When you receive instructions you should:", ["Guess the details", "Ask questions and repeat back the main points", "Wait silently", "Ignore them"], 1, "Repeat back to confirm."),
    q("poa-m02-q4", "Which closing goes with a letter starting 'Dear Sir/Madam'?", ["Yours sincerely", "Yours faithfully", "Cheers", "Love"], 1, "Faithfully for Sir/Madam."),
    q("poa-m02-q5", "Which should you avoid in a work email?", ["A greeting", "Writing in capitals as if shouting", "A clear request", "A courteous closing"], 1, "Capitals read as shouting."),
  ]),
  check(3, "Time, Tasks and Diary Management", [
    q("poa-m03-q1", "Which tasks are 'important but not urgent'?", ["Crisis calls", "Planning and preparation", "Time wasters", "Some interruptions"], 1, "Plan them before they become urgent."),
    q("poa-m03-q2", "Five 1-hour meetings with a 15-minute buffer each take how long in total?", ["5 hours", "5.5 hours", "6.25 hours", "7 hours"], 2, "5 + 1.25."),
    q("poa-m03-q3", "What should you do when two managers give conflicting priorities?", ["Guess", "Ask which comes first", "Do neither", "Pick the easiest"], 1, "Ask, don't guess."),
    q("poa-m03-q4", "Why set reminders earlier than the deadline?", ["To annoy people", "So there is time to act", "It is a rule", "To look busy"], 1, "Early reminders leave time."),
    q("poa-m03-q5", "A polite way to handle a non-urgent interruption is:", ["Ignore them", "Say you are finishing something and will come to them at a set time", "Shout", "Leave"], 1, "Postpone politely with a time."),
  ]),
  check(4, "Records, Filing and Documents", [
    q("poa-m04-q1", "Which file name is best?", ["new doc.docx", "scan0001.pdf", "2026-03_BrightSchools_Invoice_0147.pdf", "letter final final 2.docx"], 2, "Date, name, type and number."),
    q("poa-m04-q2", "The 3-2-1 backup rule means:", ["3 copies, 2 types of storage, 1 off-site", "3 folders, 2 drives, 1 printer", "3 passwords, 2 locks, 1 key", "3 days, 2 weeks, 1 month"], 0, "A resilient backup approach."),
    q("poa-m04-q3", "Confidential paper should be:", ["Binned", "Shredded", "Left on the desk", "Taken home"], 1, "Shred sensitive waste."),
    q("poa-m04-q4", "Retention periods depend on:", ["Your mood", "Law, regulators and organisation policy", "The weather", "The size of the cabinet"], 1, "Check requirements."),
    q("poa-m04-q5", "Why number the top-level folders?", ["Decoration", "To keep them in a logical order", "To hide them", "It is required"], 1, "Numbering orders folders."),
  ]),
  check(5, "Office Software", [
    q("poa-m05-q1", "Which formula adds B2 to B10?", ["=B2+B10", "=SUM(B2:B10)", "=COUNT(B2:B10)", "=ADD(B2,B10)"], 1, "SUM adds a range."),
    q("poa-m05-q2", "6 chairs at ₦25,000, 3 desks at ₦40,000 and 20 reams at ₦4,800. What is the total?", ["₦336,000", "₦366,000", "₦396,000", "₦426,000"], 1, "150,000 + 120,000 + 96,000."),
    q("poa-m05-q3", "Why use styles in a word processor?", ["To waste time", "Consistent formatting and automatic contents", "To lower page count", "To hide text"], 1, "Styles save time."),
    q("poa-m05-q4", "A good presentation slide has:", ["Paragraphs of text", "One message with a few short bullets or a visual", "Tiny fonts", "Many effects"], 1, "One message per slide."),
    q("poa-m05-q5", "Mail merge is used to:", ["Delete files", "Produce many personalised letters from a list", "Print one page", "Scan documents"], 1, "Personalised bulk documents."),
  ]),
  check(6, "Meetings, Events and Travel", [
    q("poa-m06-q1", "When should an agenda be sent?", ["After the meeting", "In advance", "Never", "During the meeting"], 1, "Send ahead."),
    q("poa-m06-q2", "Event for 50 guests: ₦650,000 subtotal and 10% contingency. What is the total?", ["₦660,000", "₦700,000", "₦715,000", "₦750,000"], 2, "650,000 × 1.1."),
    q("poa-m06-q3", "715,000 ÷ 50 guests is:", ["₦12,300", "₦13,300", "₦14,300", "₦15,300"], 2, "Cost per guest."),
    q("poa-m06-q4", "Why use full names as on ID when booking flights?", ["It looks neat", "Names must match the travel documents", "To save money", "It is optional"], 1, "Mismatches cause refusals."),
    q("poa-m06-q5", "When should minutes be sent?", ["Within a day or two", "After a month", "Never", "Before the meeting"], 0, "Promptly while fresh."),
  ]),
  check(7, "Office Management and Supplies", [
    q("poa-m07-q1", "Use 10 reams a week, lead time 2 weeks, safety 1 week. What is the reorder level?", ["20", "30", "40", "50"], 1, "10 × 2 + 10."),
    q("poa-m07-q2", "Float ₦50,000 and vouchers ₦38,500. How much cash should be in the box?", ["₦8,500", "₦11,500", "₦38,500", "₦88,500"], 1, "50,000 − 38,500."),
    q("poa-m07-q3", "The box holds ₦11,000 instead. What do you do?", ["Hide it", "Investigate and report the ₦500 shortage", "Top up silently", "Ignore it"], 1, "Never hide differences."),
    q("poa-m07-q4", "How many quotations should you compare for a significant purchase?", ["One", "At least three", "Ten", "None"], 1, "Compare several."),
    q("poa-m07-q5", "What should be checked when supplies are delivered?", ["Nothing", "Quantity, items and condition against the delivery note", "Only the box", "The driver's name"], 1, "Check deliveries."),
  ]),
  check(8, "Final Project: An Office Administration Toolkit", [
    q("poa-m08-q1", "How should the toolkit open for the manager?", ["With the retention table", "With a one-page summary of the problems, contents, savings and rollout", "With the safety list", "With a joke"], 1, "Start with the summary."),
    q("poa-m08-q2", "Why should templates be usable on their own?", ["To look neat", "So a new administrator can use them without help", "It is a rule", "To lengthen the toolkit"], 1, "Practical templates."),
    q("poa-m08-q3", "How can you test a template?", ["Never", "Ask a friend to use it without help and see where they hesitate", "Print it", "Email it"], 1, "User testing finds problems."),
    q("poa-m08-q4", "Retention periods in the toolkit should:", ["Be guessed", "Be confirmed against current law and policy", "Be skipped", "Be permanent for everything"], 1, "Confirm requirements."),
    q("poa-m08-q5", "Reorder level: use 1 cartridge a month, lead 1 month, safety 1. What is it?", ["1", "2", "3", "4"], 1, "1 × 1 + 1 = 2."),
  ]),
  {
    id: `${C}-final`,
    courseId: C,
    kind: "final",
    title: "Professional Office Administration: final assessment",
    passingScore: 60,
    questions: [
      q("poa-f01", "An administrator must above all be:", ["Loud", "Reliable, organised, discreet and helpful", "Fast at gossip", "Rarely present"], 1, "Core qualities."),
      q("poa-f02", "What do you do about confidential information at a social gathering?", ["Share it", "Keep it private", "Hint at it", "Post it"], 1, "Discretion."),
      q("poa-f03", "Which is the best email practice?", ["Vague subject", "A specific subject, a greeting, the action and deadline, and a closing", "All capitals", "No greeting"], 1, "Clarity and courtesy."),
      q("poa-f04", "Five 1-hour meetings with 15-minute buffers use how many hours?", ["5", "5.75", "6.25", "7"], 2, "5 + 1.25."),
      q("poa-f05", "Which is the best file name?", ["scan.pdf", "2026-03-05_BoardMeeting_Minutes_v2.docx", "new.docx", "final final.docx"], 1, "Sortable and descriptive."),
      q("poa-f06", "The formula for quantity in B2 times price in C2 is:", ["=B2+C2", "=B2*C2", "=SUM(B2:C2)", "=B2/C2"], 1, "Multiplication."),
      q("poa-f07", "₦366,000 plus 7.5% VAT is:", ["₦373,000", "₦393,450", "₦400,000", "₦406,000"], 1, "366,000 × 1.075."),
      q("poa-f08", "What should be in minutes?", ["Everything said", "Decisions and actions with owners and dates", "Gossip", "Nothing"], 1, "Decisions and actions."),
      q("poa-f09", "Event: ₦650,000 plus 10% contingency for 50 guests costs per guest:", ["₦13,000", "₦14,300", "₦15,000", "₦16,000"], 1, "715,000 ÷ 50."),
      q("poa-f10", "Trip: flights ₦240,000, hotel ₦270,000, allowance ₦120,000. Total?", ["₦530,000", "₦630,000", "₦730,000", "₦830,000"], 1, "Sum."),
      q("poa-f11", "Reorder level for 10 reams a week, lead 2 weeks, safety 1 week is:", ["20", "30", "40", "50"], 1, "10 × 2 + 10."),
      q("poa-f12", "A petty cash shortage of ₦500 should be:", ["Hidden", "Investigated and reported", "Taken from the next float", "Ignored"], 1, "Report differences."),
      q("poa-f13", "Under the imprest system, the float is topped up by:", ["A round figure", "The exact amount spent, supported by vouchers", "Whatever is asked", "Nothing"], 1, "Exact reimbursement."),
      q("poa-f14", "Which gives the best price comparison?", ["Unit price only", "Total cost including delivery, with delivery time and warranty", "The vendor's reputation only", "The first quote"], 1, "Compare total value."),
      q("poa-f15", "Before disposing of old records you must:", ["Delete everything", "Check retention requirements and dispose securely", "Throw them away", "Give them to staff"], 1, "Confirm retention and shred."),
    ],
  },
];
