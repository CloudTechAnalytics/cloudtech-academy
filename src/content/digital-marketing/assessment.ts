import type { AssessmentDef } from "../types";

const C = "digital-marketing-sales";

type Q = AssessmentDef["questions"][number];
const q = (id: string, prompt: string, options: string[], answer: number, explanation: string): Q => ({ id, prompt, options, answer, explanation });

const check = (n: number, title: string, questions: Q[]): AssessmentDef => ({
  id: `dms-m${String(n).padStart(2, "0")}-check`,
  courseId: C,
  kind: "module",
  moduleId: `dms-m${String(n).padStart(2, "0")}`,
  title: `${title}: module check`,
  passingScore: 60,
  questions,
});

/** Digital Marketing & Sales: a check for each module (it awards the module badge) and a final assessment. */
export const DMS_ASSESSMENTS: AssessmentDef[] = [
  check(1, "Marketing Fundamentals and Strategy", [
    q("dms-m01-q1", "How do marketing and sales fit together?", ["They are unrelated", "Marketing builds interest and trust; sales turns it into a purchase", "Sales comes before marketing always", "Marketing only means ads"], 1, "They are two halves of winning customers."),
    q("dms-m01-q2", "Which is a SMART marketing goal?", ["Get more followers", "Win 30 customers from digital channels in three months at no more than ₦3,000 each", "Be popular", "Go viral"], 1, "It has numbers, a time frame and a cost limit."),
    q("dms-m01-q3", "You need 30 customers at ₦3,000 each. What is the budget?", ["₦30,000", "₦90,000", "₦120,000", "₦300,000"], 1, "30 × 3,000 = ₦90,000."),
    q("dms-m01-q4", "25% of leads become customers. How many leads for 30 customers?", ["30", "75", "120", "300"], 2, "30 ÷ 0.25 = 120."),
    q("dms-m01-q5", "How many channels should a new business start with?", ["All of them", "Two or three, done well", "One only forever", "None"], 1, "Spreading thin usually fails."),
  ]),
  check(2, "Brand and Positioning", [
    q("dms-m02-q1", "What is a brand?", ["Only a logo", "What people think, feel and expect about your business", "A slogan", "A colour"], 1, "A brand is a promise and a reputation."),
    q("dms-m02-q2", "What does positioning answer?", ["How much to charge", "For whom are we the best choice, and why?", "Where the office is", "What staff to hire"], 1, "It is your place in customers' minds."),
    q("dms-m02-q3", "Good positioning is:", ["Vague and broad", "Specific, different, valuable and believable", "The same as competitors", "Hidden"], 1, "Specificity and proof make it work."),
    q("dms-m02-q4", "Why define a tone of voice?", ["To sound the same as everyone", "So the brand sounds consistent across all messages", "To avoid customers", "It is optional decoration"], 1, "Consistency builds recognition and trust."),
    q("dms-m02-q5", "What does a brand guide help with?", ["Tax", "Anyone producing consistent work for the brand", "Hiring only", "Delivery"], 1, "It keeps logos, colours, fonts and voice consistent."),
  ]),
  check(3, "Content Marketing", [
    q("dms-m03-q1", "What is the best starting point for content ideas?", ["What competitors posted", "Real questions your customers ask", "Random trends", "Your favourite topic"], 1, "Answer real customer questions."),
    q("dms-m03-q2", "Which is a content pillar?", ["A single post", "A theme you return to, such as tips or customer stories", "A hashtag", "A paid ad"], 1, "Pillars keep content consistent."),
    q("dms-m03-q3", "What is repurposing?", ["Deleting old posts", "Turning one idea into several formats for different channels", "Posting the same file everywhere", "Copying competitors"], 1, "One idea can become many pieces."),
    q("dms-m03-q4", "How should you write for the web?", ["Long and dense", "Point first, short paragraphs and one clear call to action", "Full of jargon", "Without headings"], 1, "People scan."),
    q("dms-m03-q5", "Why plan with a content calendar?", ["To look busy", "To be consistent and avoid daily scrambling", "To avoid tracking", "To post at random"], 1, "A calendar keeps you consistent."),
  ]),
  check(4, "Social Media Marketing", [
    q("dms-m04-q1", "Which platform best suits a B2B consultant?", ["LinkedIn", "TikTok only", "None", "Snapchat only"], 0, "LinkedIn is the professional network."),
    q("dms-m04-q2", "90 likes, 20 comments and 10 shares on 4,000 followers give an engagement rate of:", ["1.5%", "2.5%", "3%", "30%"], 2, "120 ÷ 4,000 = 3%."),
    q("dms-m04-q3", "How should you choose a creator to work with?", ["Follower count only", "By fit, trust and engaged audience", "The cheapest", "Random"], 1, "Fit and trust beat raw numbers."),
    q("dms-m04-q4", "How should paid or gifted creator content be handled?", ["Hidden", "Clearly disclosed as an ad or partnership", "Deleted", "Posted twice"], 1, "Disclosure is expected and often required."),
    q("dms-m04-q5", "What is the best way to handle public criticism?", ["Ignore it", "Reply politely and solve the problem, in private if needed", "Argue", "Delete everything"], 1, "A calm response impresses other viewers."),
  ]),
  check(5, "Paid Advertising", [
    q("dms-m05-q1", "₦50,000 spent, 100,000 impressions. What is the CPM?", ["₦50", "₦500", "₦5,000", "₦50,000"], 1, "50,000 ÷ 100,000 × 1,000 = ₦500."),
    q("dms-m05-q2", "1,500 clicks on 100,000 impressions gives a CTR of:", ["0.15%", "1.5%", "15%", "150%"], 1, "1,500 ÷ 100,000 = 1.5%."),
    q("dms-m05-q3", "₦50,000 spend and 15 sales of ₦12,000 each. What is the ROAS?", ["0.36", "3.6", "36", "180"], 1, "180,000 ÷ 50,000 = 3.6."),
    q("dms-m05-q4", "High clicks but few leads suggests the problem is likely:", ["The audience size only", "The landing page or offer after the click", "The currency", "The time of day only"], 1, "Check what happens after the click."),
    q("dms-m05-q5", "How should you start paid ads?", ["With a very large budget", "Small, test a few versions and scale what works", "Change everything daily", "Never track"], 1, "Test small before you scale."),
  ]),
  check(6, "Search Engine Optimisation", [
    q("dms-m06-q1", "What is a long-tail keyword?", ["A very short popular term", "A longer, specific phrase with less competition", "A paid keyword", "A hashtag"], 1, "Specific phrases are easier to win and convert better."),
    q("dms-m06-q2", "Which intent is 'how to remove stains from a sofa'?", ["Transactional", "Informational", "Navigational", "Commercial"], 1, "The searcher wants to learn."),
    q("dms-m06-q3", "About how long should a title tag be?", ["10 characters", "50 to 60 characters", "200 characters", "500 characters"], 1, "Longer titles are cut off."),
    q("dms-m06-q4", "What most helps local search ranking and choice?", ["A complete Google Business Profile and good reviews", "Buying links", "Keyword stuffing", "Hiding your address"], 0, "Complete profiles and reviews matter."),
    q("dms-m06-q5", "What should you avoid in link building?", ["Useful content", "Buying links or link schemes", "Local directories", "Partnerships"], 1, "Link schemes risk penalties."),
  ]),
  check(7, "Email and WhatsApp Marketing", [
    q("dms-m07-q1", "960 delivered, 288 opened. What is the open rate?", ["28.8%", "30%", "33%", "96%"], 1, "288 ÷ 960 = 30%."),
    q("dms-m07-q2", "Before messaging people in bulk you must have:", ["Their consent", "Their address", "A discount", "A logo"], 0, "Permission and data protection rules apply."),
    q("dms-m07-q3", "A WhatsApp broadcast only reaches people who:", ["Have saved your number and agreed to receive it", "Follow you on Instagram", "Live in Lagos", "Are in a group"], 0, "Broadcasts need saved numbers and permission."),
    q("dms-m07-q4", "Which email usually has the highest open rate?", ["Welcome email", "Random promotion", "Spam", "Old newsletter"], 0, "Welcome emails are expected and timely."),
    q("dms-m07-q5", "What should every marketing message include?", ["A long story", "An easy way to opt out", "Jargon", "No call to action"], 1, "Easy unsubscribe protects trust and compliance."),
  ]),
  check(8, "Funnels, Landing Pages and Conversion", [
    q("dms-m08-q1", "40 of 1,000 visitors convert on A; 55 of 1,000 on B. What is B's relative improvement?", ["1.5%", "15%", "37.5%", "55%"], 2, "(5.5 − 4) ÷ 4 = 37.5%."),
    q("dms-m08-q2", "What should a landing page's headline do?", ["Be a surprise", "Match the ad or link they clicked", "Be as long as possible", "Hide the offer"], 1, "Consistency reassures visitors."),
    q("dms-m08-q3", "How many main actions should a landing page focus on?", ["Five", "One", "Ten", "None"], 1, "One page, one purpose."),
    q("dms-m08-q4", "In an A/B test, you should change:", ["Everything", "One thing at a time", "Nothing", "Only the logo"], 1, "Change one thing to learn what caused the result."),
    q("dms-m08-q5", "Which CTA is strongest?", ["Submit", "Get my free quote in 2 hours", "Click", "Learn"], 1, "It starts with a verb and states the benefit."),
  ]),
  check(9, "Analytics and Reporting", [
    q("dms-m09-q1", "A campaign costs ₦150,000 and brings ₦450,000. What is the ROI?", ["100%", "200%", "300%", "450%"], 1, "(450,000 − 150,000) ÷ 150,000 = 200%."),
    q("dms-m09-q2", "What do UTM parameters do?", ["Speed up a page", "Label links so analytics shows which campaign brought each visit", "Block ads", "Encrypt data"], 1, "UTMs identify source, medium and campaign."),
    q("dms-m09-q3", "Which is a vanity metric?", ["Cost per customer", "Followers on their own", "Sales", "Conversion rate"], 1, "Followers alone do not prove business results."),
    q("dms-m09-q4", "How should a report start?", ["With every chart", "With a summary and the headline result against the goal", "With jargon", "With excuses"], 1, "Start with the answer."),
    q("dms-m09-q5", "Revenue of ₦450,000 means profit of:", ["₦450,000", "Revenue minus costs, which need to be subtracted", "Nothing ever", "₦150,000 always"], 1, "Revenue is not profit."),
  ]),
  check(10, "Final Project: A Full Campaign", [
    q("dms-m10-q1", "How should a campaign plan be introduced to a client?", ["With a long history", "With a one-page summary of goal, plan, budget and expected result", "With only a logo", "Verbally only"], 1, "Decision makers need the summary first."),
    q("dms-m10-q2", "Why plan tracking before launch?", ["To look professional", "So you can learn which channels and messages worked", "It is required by law", "To avoid spending"], 1, "Without tracking you cannot learn."),
    q("dms-m10-q3", "60 customers at ₦3,000 each need a budget of:", ["₦60,000", "₦120,000", "₦180,000", "₦300,000"], 2, "60 × 3,000 = ₦180,000."),
    q("dms-m10-q4", "60 customers with a 25% lead-to-customer rate need how many leads?", ["60", "120", "240", "300"], 2, "60 ÷ 0.25 = 240."),
    q("dms-m10-q5", "What is a sensible rule for scaling a channel?", ["Scale after one good day", "Scale when cost per customer stays below target over a set period", "Never scale", "Scale every channel equally"], 1, "Use a clear, pre-agreed rule."),
  ]),
  {
    id: `${C}-final`,
    courseId: C,
    kind: "final",
    title: "Digital Marketing & Sales: final assessment",
    passingScore: 60,
    questions: [
      q("dms-f01", "What is the best first step in digital marketing?", ["Buy ads", "Understand your customer and set a clear goal", "Open every social account", "Design a logo"], 1, "Strategy starts with customer and goal."),
      q("dms-f02", "30 customers at ₦3,000 each means a budget of:", ["₦30,000", "₦90,000", "₦120,000", "₦300,000"], 1, "30 × 3,000."),
      q("dms-f03", "Which is the best positioning statement?", ["We are the best", "For busy professionals who have no time to cook, we deliver fresh lunch to the office; unlike canteens, we are on time or free", "We sell food", "Great food, great prices"], 1, "It names customer, need, benefit and difference."),
      q("dms-f04", "What does repurposing content mean?", ["Copying others", "Turning one idea into several formats for different channels", "Deleting posts", "Buying content"], 1, "One idea, many pieces."),
      q("dms-f05", "A post with 120 interactions on 4,000 followers has an engagement rate of:", ["1.2%", "3%", "12%", "30%"], 1, "120 ÷ 4,000 = 3%."),
      q("dms-f06", "₦50,000 spend, 15 sales of ₦12,000. What is the ROAS?", ["3.6", "0.36", "15", "30"], 0, "180,000 ÷ 50,000."),
      q("dms-f07", "High CTR and few leads most likely points to:", ["The landing page or offer", "The wrong currency", "Too many followers", "The logo"], 0, "The problem is after the click."),
      q("dms-f08", "Which is an informational keyword?", ["book sofa cleaning Lekki", "how to remove stains from a sofa", "FreshClean Lagos", "price of deep cleaning"], 1, "The searcher wants to learn."),
      q("dms-f09", "Which helps local search the most?", ["A complete Google Business Profile with reviews", "Buying links", "A longer title tag", "More hashtags"], 0, "Complete profiles and reviews drive local results."),
      q("dms-f10", "1,000 sent, 960 delivered, 288 opened, 48 clicked. What is the click-through rate on delivered?", ["4.8%", "5%", "16.7%", "30%"], 1, "48 ÷ 960 = 5%."),
      q("dms-f11", "What is required before messaging people in bulk on WhatsApp or email?", ["Their consent and a way to opt out", "Nothing", "A discount", "A new number"], 0, "Consent and opt-out are essential."),
      q("dms-f12", "A: 4% conversion; B: 5.5%. B's relative improvement is:", ["1.5%", "15%", "37.5%", "55%"], 2, "1.5 ÷ 4 = 37.5%."),
      q("dms-f13", "Which tracks which campaign brought a visit?", ["UTM parameters", "A logo", "A hashtag only", "A colour"], 0, "UTM labels carry source, medium and campaign."),
      q("dms-f14", "A campaign costs ₦150,000 and brings ₦450,000. ROI is:", ["100%", "200%", "300%", "450%"], 1, "(450,000 − 150,000) ÷ 150,000."),
      q("dms-f15", "Which is the most useful monthly report format?", ["A long list of every metric", "A short summary with the headline, key numbers, what worked, and next actions", "A single chart", "A verbal comment"], 1, "Summaries drive decisions."),
    ],
  },
];
