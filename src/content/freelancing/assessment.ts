import type { AssessmentDef } from "../types";

const C = "freelancing-for-beginners";

/**
 * Freelancing for Beginners: a check for each module (it awards the module badge, and
 * unlocks only after the module's tasks are done) and a final assessment. Questions are
 * scenarios with plausible wrong answers.
 */
export const FREEL_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "freel-m01-check",
    courseId: C,
    kind: "module",
    moduleId: "freel-m01",
    title: "Choose Your Skill and Offer: module check",
    passingScore: 60,
    questions: [
      { id: "freel-m01-q1", prompt: "Which offer is easiest for a client to say yes to?", options: ["I do design, writing, video and websites", "I design three Instagram flyers for small food businesses, delivered in 3 days with two rounds of changes", "Graphic designer available", "I can do anything you need"], answer: 1, explanation: "One clear deliverable, for a clear client, with time and what's included." },
      { id: "freel-m01-q2", prompt: "You have no clients yet. How do you show what you can do?", options: ["Wait until someone hires you", "Make 3-5 sample pieces, clearly labelled as concepts, and share them in one place", "Copy another designer's portfolio", "Use real brands' logos and claim they were clients"], answer: 1, explanation: "Concept pieces are honest proof of skill." },
      { id: "freel-m01-q3", prompt: "Which statement about freelancing is most realistic?", options: ["It's a quick way to get rich", "Most freelancers start small and grow as reviews and skills grow", "You need no skills at all", "Clients find you automatically"], answer: 1, explanation: "Reputation builds over time." },
      { id: "freel-m01-q4", prompt: "You redesign a local bakery's old flyer as a sample without their permission. What should you do?", options: ["Present it as paid client work", "Label it clearly as a concept redesign, not work they commissioned", "Use their logo on your portfolio as a client", "Hide the bakery's name and say it's yours"], answer: 1, explanation: "Be honest about what's a concept." },
      { id: "freel-m01-q5", prompt: "Why choose one skill to start with?", options: ["Platforms only allow one", "A focused offer is easier to explain, price and sell", "Other skills are illegal", "It doesn't matter"], answer: 1, explanation: "Clarity sells." },
    ],
  },
  {
    id: "freel-m02-check",
    courseId: C,
    kind: "module",
    moduleId: "freel-m02",
    title: "Find Clients and Get Paid: module check",
    passingScore: 60,
    questions: [
      { id: "freel-m02-q1", prompt: "A platform takes 20%. You want to take home ₦40,000. What should you charge?", options: ["₦40,000", "₦48,000", "₦50,000", "₦60,000"], answer: 2, explanation: "₦50,000 × 0.8 = ₦40,000." },
      { id: "freel-m02-q2", prompt: "A new client asks you to move off the platform before the first job to avoid fees. What should you do?", options: ["Agree, it saves money", "Keep the work on the platform, where both of you are protected", "Ask for double payment", "Share your bank login to speed things up"], answer: 1, explanation: "Off-platform deals remove protection and often break the rules." },
      { id: "freel-m02-q3", prompt: "Which profile title wins more work?", options: ["Freelancer", "Social media flyer designer for small businesses", "Hardworking person", "Available"], answer: 1, explanation: "Say exactly what you offer and to whom." },
      { id: "freel-m02-q4", prompt: "What are sensible payment terms for a new direct client?", options: ["Full payment after a month", "50% upfront and 50% on delivery, or 100% upfront for small jobs", "No payment until they're happy forever", "Payment in airtime only"], answer: 1, explanation: "Upfront payment protects you." },
      { id: "freel-m02-q5", prompt: "A 'client' overpays by ₦100,000 and asks you to send the extra back urgently. What's most likely happening?", options: ["An honest mistake", "A common scam: the original payment may be reversed after you send money", "A bonus", "A tax refund"], answer: 1, explanation: "Never refund 'overpayments' until the original payment is fully cleared and verified." },
    ],
  },
  {
    id: "freel-m03-check",
    courseId: C,
    kind: "module",
    moduleId: "freel-m03",
    title: "Price and Pitch Your Work: module check",
    passingScore: 60,
    questions: [
      { id: "freel-m03-q1", prompt: "A job needs 5 hours of work plus 1 hour of messages and changes, at ₦4,000 an hour. What's a fair fixed price?", options: ["₦20,000", "₦24,000", "₦5,000", "₦40,000"], answer: 1, explanation: "Count all your time: (5 + 1) × 4,000." },
      { id: "freel-m03-q2", prompt: "What should the first line of a proposal show?", options: ["Your life story", "That you've read and understood the client's brief", "Your price", "Your qualifications"], answer: 1, explanation: "Proposals are about the client's need." },
      { id: "freel-m03-q3", prompt: "Why offer Basic, Standard and Premium packages?", options: ["To confuse clients", "To make it easy to say yes at different budgets; many choose the middle", "Platforms require five packages", "To charge everyone the most"], answer: 1, explanation: "Choice helps clients decide." },
      { id: "freel-m03-q4", prompt: "What should you agree in writing before starting?", options: ["Nothing; trust is enough", "Deliverables and format, deadline, rounds of changes, price and payment terms", "Only the price", "Your favourite colour"], answer: 1, explanation: "Written scope prevents endless 'small changes'." },
      { id: "freel-m03-q5", prompt: "When should you raise your prices?", options: ["Never", "As you collect good reviews and stronger samples", "Every day", "Only when a client complains"], answer: 1, explanation: "Start competitive, then raise prices every few jobs." },
    ],
  },
  {
    id: "freel-m04-check",
    courseId: C,
    kind: "module",
    moduleId: "freel-m04",
    title: "Deliver Work and Get Great Reviews: module check",
    passingScore: 60,
    questions: [
      { id: "freel-m04-q1", prompt: "You'll miss a deadline by a day. What should you do?", options: ["Go silent and deliver late", "Tell the client early, with a new date", "Deliver unfinished work on time", "Blame the client"], answer: 1, explanation: "Early, honest updates keep trust." },
      { id: "freel-m04-q2", prompt: "A client asks for three extra designs at no extra cost. What's the best reply?", options: ["No way.", "Politely explain they're outside the agreed scope and offer a price and date", "Do them for free and resent it", "Ignore the message"], answer: 1, explanation: "Friendly, clear, with an offer." },
      { id: "freel-m04-q3", prompt: "Which file name is best for a delivery?", options: ["final final.png", "Kunle-Accessories-promo-1.png", "IMG_3021.png", "design.png"], answer: 1, explanation: "Clear names show care and help the client find things." },
      { id: "freel-m04-q4", prompt: "When is the best time to ask for a review?", options: ["Before you start", "Once the client has said they're happy with the work", "Never", "In the middle of a dispute"], answer: 1, explanation: "Ask when they're pleased." },
      { id: "freel-m04-q5", prompt: "You're offered a big job during exam week. What does this course suggest?", options: ["Always accept", "Protect exam periods and only take work you can deliver well", "Accept and deliver late", "Accept and ask someone else to do it secretly"], answer: 1, explanation: "One bad review costs more than one missed job." },
    ],
  },
  {
    id: "freelancing-for-beginners-final",
    courseId: C,
    kind: "final",
    title: "Freelancing for Beginners: final assessment",
    passingScore: 60,
    questions: [
      { id: "freel-f01", prompt: "What makes a strong freelance offer?", options: ["Listing every skill you have", "One clear deliverable, for a clear client, with a time and what's included", "The lowest price on the platform", "A long description of yourself"], answer: 1, explanation: "Specific offers are easy to buy." },
      { id: "freel-f02", prompt: "Which is a sign a 'client' may be a scammer?", options: ["They send a clear brief", "They ask you to pay to unlock the job", "They agree your scope in writing", "They pay 50% upfront"], answer: 1, explanation: "Never pay to get work." },
      { id: "freel-f03", prompt: "On a platform, where should payments go?", options: ["Through the platform", "Directly to your bank to avoid fees", "In cash only", "To a friend's account"], answer: 0, explanation: "The platform protects both sides." },
      { id: "freel-f04", prompt: "A ₦60,000 job on a platform with a 20% fee pays you…", options: ["₦60,000", "₦48,000", "₦12,000", "₦72,000"], answer: 1, explanation: "60,000 × 0.8." },
      { id: "freel-f05", prompt: "What are the four parts of a good proposal?", options: ["Show you read the brief, proof, your plan, price and next step", "Greeting, CV, photo, goodbye", "Price only", "Your qualifications, hobbies, location, age"], answer: 0, explanation: "Short and about the client." },
      { id: "freel-f06", prompt: "Why agree the number of rounds of changes in advance?", options: ["It's legally required", "It stops 'one more small change' turning into ten", "It makes the job longer", "Clients prefer unlimited changes"], answer: 1, explanation: "Scope protects your time." },
      { id: "freel-f07", prompt: "What should a delivery note include?", options: ["Only 'here you go'", "What's included with clear file names and formats, how to use them, and how to ask for changes", "Your next invoice only", "A request for a bigger budget"], answer: 1, explanation: "A professional handover." },
      { id: "freel-f08", prompt: "How do freelancers usually grow?", options: ["By luck", "Through good reviews, referrals, repeat clients and a growing portfolio", "By lowering prices forever", "By taking every job"], answer: 1, explanation: "Reputation compounds." },
    ],
  },
];
