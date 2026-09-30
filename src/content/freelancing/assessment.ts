import type { AssessmentDef } from "../types";

const C = "freelancing-for-beginners";

/** Freelancing for Beginners: a check for each module (it awards the module badge) and a final assessment. */
export const FREEL_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "freel-m01-check",
    courseId: C,
    kind: "module",
    moduleId: "freel-m01",
    title: "Choose Your Skill and Offer: module check",
    passingScore: 60,
    questions: [
      { id: "freel-m01-q1", prompt: "Which offer is easier to sell?", options: ["I design Instagram flyers for small food businesses", "I do design, writing, video and websites", "I can do anything", "Freelancer available"], answer: 0, explanation: "A clear, focused offer is easier to understand and buy." },
      { id: "freel-m01-q2", prompt: "What should a clear offer include?", options: ["What they get, for whom, how fast and what's included", "Only your name", "Your life story", "A long list of every tool you know"], answer: 0, explanation: "Answer the client's four questions." },
      { id: "freel-m01-q3", prompt: "You have no clients yet. How do you get samples?", options: ["Create concept pieces or redesign existing work", "Copy other people's portfolios", "Use company logos without permission", "Wait until someone hires you"], answer: 0, explanation: "Make your own samples and label them as concepts." },
      { id: "freel-m01-q4", prompt: "How many skills should you start selling?", options: ["One", "Five", "As many as possible", "None"], answer: 0, explanation: "Focus makes marketing easier." },
      { id: "freel-m01-q5", prompt: "What is freelancing?", options: ["Doing paid project work for clients as your own boss", "A full-time office job", "Unpaid volunteering", "A get-rich-quick scheme"], answer: 0, explanation: "You work project by project for clients." },
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
      { id: "freel-m02-q1", prompt: "On Fiverr, how do clients usually find you?", options: ["Through the gigs you list", "Only by phone", "Through job adverts in newspapers", "They can't"], answer: 0, explanation: "Fiverr is gig-based; on Upwork you send proposals." },
      { id: "freel-m02-q2", prompt: "A platform client asks to pay you directly outside the platform before the first job. What's the risk?", options: ["You lose protection and could get banned", "Nothing at all", "You'll be paid twice", "It's required"], answer: 0, explanation: "Keep payments on the platform." },
      { id: "freel-m02-q3", prompt: "Which profile title is best?", options: ["Social media flyer designer for small businesses", "Freelancer", "Hardworking person", "Available"], answer: 0, explanation: "Say what you offer." },
      { id: "freel-m02-q4", prompt: "What are sensible terms for a direct client?", options: ["50% upfront and 50% on delivery", "Payment 'whenever'", "100% after six months", "No agreement"], answer: 0, explanation: "Upfront payment reduces your risk." },
      { id: "freel-m02-q5", prompt: "A 'client' overpays and asks you to send the extra back. This is…", options: ["A common scam", "Good luck", "Normal practice", "A bank error to ignore"], answer: 0, explanation: "Overpayment scams are common." },
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
      { id: "freel-m03-q1", prompt: "Which pricing method suits most beginner work?", options: ["Per project", "Per year", "Free forever", "Per word only"], answer: 0, explanation: "A fixed price for a defined result is simple for both sides." },
      { id: "freel-m03-q2", prompt: "Why offer Basic, Standard and Premium packages?", options: ["They make choosing and saying yes easier", "They confuse clients", "Platforms require three", "To avoid setting prices"], answer: 0, explanation: "Most people pick the middle option." },
      { id: "freel-m03-q3", prompt: "What should the first line of a proposal show?", options: ["That you read and understood the brief", "Your full CV", "Your price only", "A long greeting"], answer: 0, explanation: "Make it about the client." },
      { id: "freel-m03-q4", prompt: "What should you agree in writing before starting?", options: ["Deliverables, deadline, rounds of changes, price and payment", "Nothing", "Only the client's name", "Your favourite colour"], answer: 0, explanation: "Clear scope prevents endless changes." },
      { id: "freel-m03-q5", prompt: "When should you raise your prices?", options: ["Every few jobs as reviews and skills grow", "Never", "Before your first job", "Every day"], answer: 0, explanation: "Grow prices with your reputation." },
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
      { id: "freel-m04-q1", prompt: "You'll miss a deadline. What should you do?", options: ["Tell the client early with a new date", "Go silent", "Deliver unfinished work", "Block the client"], answer: 0, explanation: "Early, honest updates keep trust." },
      { id: "freel-m04-q2", prompt: "A client asks for a fourth flyer when you agreed three. What's a good reply?", options: ["Offer it politely at an extra price", "Refuse rudely", "Do it free and complain", "Ignore the message"], answer: 0, explanation: "Out-of-scope work is extra." },
      { id: "freel-m04-q3", prompt: "What should a delivery note include?", options: ["What's included, how to use it and how to request changes", "Nothing", "Only an invoice", "A request for a tip"], answer: 0, explanation: "It makes delivery clear and professional." },
      { id: "freel-m04-q4", prompt: "How do freelancers mainly grow?", options: ["Reviews, testimonials and repeat clients", "Changing names often", "Lowering prices forever", "Avoiding clients"], answer: 0, explanation: "Happy clients bring more work." },
      { id: "freel-m04-q5", prompt: "How should you balance freelancing with school?", options: ["Set fixed hours and protect exam periods", "Take every job offered", "Skip classes for clients", "Work only at night before exams"], answer: 0, explanation: "Don't take on more than you can deliver well." },
    ],
  },
  {
    id: "freelancing-for-beginners-final",
    courseId: C,
    kind: "final",
    title: "Freelancing for Beginners: final assessment",
    passingScore: 60,
    questions: [
      { id: "freel-f01", prompt: "What's the best first step in freelancing?", options: ["Pick one skill and make a clear offer", "Quit school", "Sign up to every platform at once", "Buy expensive software"], answer: 0, explanation: "Start focused." },
      { id: "freel-f02", prompt: "How many samples should you have before pitching?", options: ["About 3–5", "None", "At least 100", "Just one sentence"], answer: 0, explanation: "A few strong samples are enough." },
      { id: "freel-f03", prompt: "Which is often easier for a first client?", options: ["Your network and local businesses", "Only international corporations", "Government contracts", "Celebrities"], answer: 0, explanation: "Direct clients know and trust you." },
      { id: "freel-f04", prompt: "Which should you never share with a client?", options: ["Your bank login or OTP", "Your portfolio", "Your delivery date", "Your price list"], answer: 0, explanation: "Protect your accounts." },
      { id: "freel-f05", prompt: "What are the four parts of a good proposal?", options: ["Show you read the brief, proof, plan, price and next step", "Greeting, weather, hobbies, sign-off", "Only a price", "Your CV and ID card"], answer: 0, explanation: "Short and about the client." },
      { id: "freel-f06", prompt: "Why agree the number of change rounds upfront?", options: ["It stops endless extra work", "It's required by law", "Clients never ask for changes", "It lowers your price"], answer: 0, explanation: "Clear scope protects your time." },
      { id: "freel-f07", prompt: "How quickly should you reply to client messages?", options: ["Within a day", "Within a month", "Only when work is done", "Never"], answer: 0, explanation: "Prompt replies build trust." },
      { id: "freel-f08", prompt: "What should you keep a record of?", options: ["Clients, jobs, amounts and dates paid", "Nothing", "Only complaints", "Other freelancers' prices"], answer: 0, explanation: "Records help with pricing, planning and tax." },
    ],
  },
];
