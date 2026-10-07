import type { AssessmentDef } from "../types";

const C = "ecommerce-online-business";

type Q = AssessmentDef["questions"][number];
const q = (id: string, prompt: string, options: string[], answer: number, explanation: string): Q => ({ id, prompt, options, answer, explanation });

const check = (n: number, title: string, questions: Q[]): AssessmentDef => ({
  id: `ecom-m${String(n).padStart(2, "0")}-check`,
  courseId: C,
  kind: "module",
  moduleId: `ecom-m${String(n).padStart(2, "0")}`,
  title: `${title}: module check`,
  passingScore: 60,
  questions,
});

/** E-commerce & Online Business: a check for each module (it awards the module badge) and a final assessment. */
export const ECOM_ASSESSMENTS: AssessmentDef[] = [
  check(1, "How Online Business Works", [
    q("ecom-m01-q1", "Which model needs the least money and effort to start for a small seller with a social following?", ["Building a custom website", "Social selling on Instagram and WhatsApp", "Opening a physical shop", "Importing a container"], 1, "Social selling is almost free to start."),
    q("ecom-m01-q2", "A ₦12,000 item costs ₦6,500, packaging ₦500, with a 10% marketplace commission. What is the profit before delivery and marketing?", ["₦3,000", "₦3,800", "₦4,500", "₦5,000"], 1, "12,000 − 6,500 − 500 − 1,200 = ₦3,800."),
    q("ecom-m01-q3", "What is a major weakness of dropshipping?", ["It needs a warehouse", "Thin margins and less control over quality and delivery", "It cannot be sold online", "It needs no supplier"], 1, "Dropshipping margins are thin and control is limited."),
    q("ecom-m01-q4", "Which is a benefit of an own online store compared with a marketplace?", ["Built-in traffic", "You own the brand and customer data", "No setup", "No competition"], 1, "An own store gives ownership and control."),
    q("ecom-m01-q5", "Before launching, you should:", ["Guess your costs", "Calculate the profit per order after all costs", "Skip packaging", "Ignore delivery"], 1, "Know your numbers first."),
  ]),
  check(2, "Niche and Product Selection", [
    q("ecom-m02-q1", "Which is a strong niche?", ["Bags", "Durable, stylish work totes for women who commute in Lagos", "Everything for everyone", "Random items"], 1, "A niche is specific, reachable and wanted."),
    q("ecom-m02-q2", "Price ₦12,000, product ₦6,500, packaging ₦500, delivery ₦1,000, payment fee ₦180. What is the contribution before marketing?", ["₦3,000", "₦3,820", "₦4,000", "₦5,500"], 1, "12,000 − 8,180 = ₦3,820."),
    q("ecom-m02-q3", "What is the break-even ROAS for a ₦12,000 price and ₦3,820 contribution?", ["About 1.5", "About 3.14", "About 5", "About 12"], 1, "12,000 ÷ 3,820 = 3.14."),
    q("ecom-m02-q4", "How should you test a new supplier?", ["Order a large stock at once", "Order samples and start with a small order", "Pay in full without checks", "Rely on photos"], 1, "Test small before committing."),
    q("ecom-m02-q5", "Which products usually suit beginners?", ["Fragile and heavy items", "Small, light, durable items with healthy margins", "Items needing special approval", "Unauthorised branded goods"], 1, "Small, light and durable is easier to ship and profit from."),
  ]),
  check(3, "Building Your Store", [
    q("ecom-m03-q1", "What matters most on a phone-first audience?", ["Heavy animations", "A fast, simple mobile experience", "Long forms", "Tiny buttons"], 1, "Most customers browse on mobile."),
    q("ecom-m03-q2", "Which belongs on a product page?", ["Only a logo", "Clear photos, price, key details, delivery and returns information, and reviews", "No price", "A long history"], 1, "Customers need all the information to buy."),
    q("ecom-m03-q3", "Which photo practice helps sell?", ["Poor lighting", "Natural light, a clean background and the product in use", "A single blurry image", "Edited colours that differ from reality"], 1, "Honest, clear photos build trust."),
    q("ecom-m03-q4", "Which is a trust signal?", ["Hidden contact details", "Real reviews, clear policies and secure checkout", "Misspellings", "No returns policy"], 1, "Trust signals reduce buyer fear."),
    q("ecom-m03-q5", "How should descriptions be written?", ["Exaggerated", "Benefit-led, specific and honest", "Vague", "Copied from competitors"], 1, "Honest detail reduces returns."),
  ]),
  check(4, "Payments and Checkout", [
    q("ecom-m04-q1", "With a fee of 1.5% plus ₦100 on a ₦12,000 order, what is the fee?", ["₦180", "₦280", "₦300", "₦1,800"], 1, "180 + 100 = ₦280."),
    q("ecom-m04-q2", "A customer sends a transfer screenshot. What should you do before shipping?", ["Ship immediately", "Confirm the money in your bank app or gateway", "Ask them to resend", "Ship half"], 1, "Screenshots can be edited."),
    q("ecom-m04-q3", "7% of 200 pay-on-delivery orders fail, each costing ₦1,500. What is the loss?", ["₦14,000", "₦21,000", "₦30,000", "₦42,000"], 1, "14 × 1,500 = ₦21,000."),
    q("ecom-m04-q4", "A buyer overpays and asks you to refund the difference. What should you do?", ["Refund at once", "Wait until the original payment is confirmed and cleared", "Keep the extra", "Ignore"], 1, "Overpayment scams are common."),
    q("ecom-m04-q5", "Why issue receipts and invoices?", ["It is decoration", "Customer trust, evidence and records for tax", "To avoid payment", "To hide sales"], 1, "Records protect both sides."),
  ]),
  check(5, "Fulfilment and Delivery", [
    q("ecom-m05-q1", "You sell 8 a day, lead time 10 days, safety 5 days. What is the reorder point?", ["80", "100", "120", "150"], 2, "8 × 15 = 120."),
    q("ecom-m05-q2", "Which matters most when choosing a courier?", ["Only the lowest price", "Price, speed, reliability, tracking and remittance together", "The courier's logo", "Nothing"], 1, "Reliability often outweighs the cheapest price."),
    q("ecom-m05-q3", "Why show delivery cost before checkout?", ["To confuse", "Surprise costs make customers abandon the cart", "It is optional decoration", "It lowers prices"], 1, "Transparency reduces abandonment."),
    q("ecom-m05-q4", "What should you do if a delivery will be late?", ["Say nothing", "Tell the customer early with the cause and a new date", "Blame them", "Cancel the order"], 1, "Proactive updates keep trust."),
    q("ecom-m05-q5", "Good packaging should:", ["Be as large as possible", "Protect the product and fit it", "Use no label", "Skip the invoice"], 1, "Protect, right-size and label."),
  ]),
  check(6, "Marketing and Traffic", [
    q("ecom-m06-q1", "₦60,000 ad spend brings 25 orders of ₦12,000. What is the ROAS?", ["2.0", "3.6", "5.0", "7.5"], 2, "300,000 ÷ 60,000 = 5.0."),
    q("ecom-m06-q2", "A break-even ROAS of 3.14 and an actual ROAS of 5.0 mean:", ["The ads lose money", "The ads are profitable", "Nothing", "Stop selling"], 1, "5.0 is above break-even."),
    q("ecom-m06-q3", "Which is an ethical way to get reviews?", ["Fake them", "Ask real customers a few days after delivery", "Pay for fake ones", "Delete bad ones"], 1, "Real reviews build trust."),
    q("ecom-m06-q4", "What should you do before adding customers to a broadcast list?", ["Add them all", "Get their permission", "Hide it", "Charge them"], 1, "Permission and privacy matter."),
    q("ecom-m06-q5", "Where should store ad traffic go?", ["The home page only", "The exact product page", "A blank page", "An unrelated page"], 1, "Match the ad to the page."),
  ]),
  check(7, "Customer Service and Returns", [
    q("ecom-m07-q1", "200 orders with a 5% return rate give how many returns?", ["5", "10", "20", "50"], 1, "5% of 200 = 10."),
    q("ecom-m07-q2", "What should a returns policy state?", ["Nothing", "What can be returned, time limit, how to start, who pays and what the customer gets", "Only the price", "Only the logo"], 1, "Clarity reduces arguments."),
    q("ecom-m07-q3", "Who pays when an item is faulty or wrong?", ["The customer", "You, quickly", "The courier always", "Nobody"], 1, "Faulty items are fixed at your cost."),
    q("ecom-m07-q4", "A good first reply to an angry customer is to:", ["Argue", "Apologise, take ownership and offer a clear fix", "Ignore", "Blame them"], 1, "Complaints are a chance to keep customers."),
    q("ecom-m07-q5", "60 of 200 customers order again. What is the repeat rate?", ["20%", "30%", "40%", "60%"], 1, "60 ÷ 200 = 30%."),
  ]),
  check(8, "Analytics, Scaling and Final Project", [
    q("ecom-m08-q1", "36 orders from 1,200 sessions give a conversion rate of:", ["1%", "2%", "3%", "4%"], 2, "36 ÷ 1,200 = 3%."),
    q("ecom-m08-q2", "100 carts created and 30 completed give an abandonment rate of:", ["30%", "50%", "70%", "100%"], 2, "(100 − 30) ÷ 100 = 70%."),
    q("ecom-m08-q3", "Conversion rises from 3% to 3.6% on 1,200 sessions. About how many orders?", ["36", "40", "43", "50"], 2, "1,200 × 0.036 = 43.2."),
    q("ecom-m08-q4", "When should you scale ad spend?", ["Before knowing your numbers", "When each order is profitable after all costs", "On the first day", "Never"], 1, "Scale proven unit economics."),
    q("ecom-m08-q5", "What should you do before launch?", ["Nothing", "Place a test order yourself from cart to delivery and return", "Hide your policies", "Skip photos"], 1, "A test order reveals problems."),
  ]),
  {
    id: `${C}-final`,
    courseId: C,
    kind: "final",
    title: "E-commerce & Online Business: final assessment",
    passingScore: 60,
    questions: [
      q("ecom-f01", "What is the best way to start for most beginners?", ["A large website first", "Start where your first customers are and prove people buy", "Import a container", "Spend heavily on ads"], 1, "Prove demand, then invest."),
      q("ecom-f02", "A ₦12,000 item with a 10% commission, ₦6,500 product cost and ₦500 packaging earns:", ["₦3,000", "₦3,800", "₦4,500", "₦5,500"], 1, "12,000 − 6,500 − 500 − 1,200."),
      q("ecom-f03", "Contribution before marketing is ₦3,820 on a ₦12,000 price. The break-even ROAS is about:", ["1.5", "3.14", "5", "12"], 1, "12,000 ÷ 3,820."),
      q("ecom-f04", "Which is a strong niche statement?", ["We sell stuff", "We sell durable work totes for women who commute in Lagos", "We sell everything", "Bags"], 1, "A niche names the product, customer and need."),
      q("ecom-f05", "How should you test a new supplier?", ["Order in bulk", "Order samples and a small first order", "Pay in full upfront", "Ignore quality"], 1, "Test before scaling."),
      q("ecom-f06", "A gateway fee is 1.5% plus ₦100 on ₦12,000. What do you receive?", ["₦11,520", "₦11,720", "₦11,820", "₦12,000"], 1, "12,000 − 280."),
      q("ecom-f07", "Which protects you from fake transfer screenshots?", ["Shipping at once", "Confirming payment in your bank app or gateway first", "Asking for a second screenshot", "Ignoring it"], 1, "Verify the money."),
      q("ecom-f08", "Courier A: ₦1,500, 95% on time. B: ₦1,100, 80% on time, each late costs ₦2,000. Which total is correct?", ["A ₦1,600; B ₦1,500", "A ₦1,500; B ₦1,100", "A ₦1,100; B ₦1,500", "A ₦1,700; B ₦1,300"], 0, "A = 1,500 + 100; B = 1,100 + 400."),
      q("ecom-f09", "₦60,000 of ads and 25 orders of ₦12,000 with ₦3,820 contribution each. Profit from ads?", ["₦35,500", "₦95,500", "₦240,000", "₦300,000"], 0, "95,500 − 60,000."),
      q("ecom-f10", "Which is a trust signal on a store?", ["Real reviews and clear policies", "No contact details", "Misspellings", "No returns"], 0, "Trust signals reduce fear."),
      q("ecom-f11", "5% of 200 orders are returned at ₦3,000 each. The monthly cost is:", ["₦10,000", "₦15,000", "₦30,000", "₦60,000"], 2, "10 × 3,000."),
      q("ecom-f12", "60 of 200 customers return to buy. The repeat rate is:", ["20%", "30%", "40%", "60%"], 1, "60 ÷ 200."),
      q("ecom-f13", "36 orders from 1,200 sessions and ₦432,000 revenue give an AOV of:", ["₦10,000", "₦12,000", "₦14,000", "₦36,000"], 1, "432,000 ÷ 36."),
      q("ecom-f14", "Conversion from 3% to 3.6% on 1,200 sessions adds about how many orders?", ["2", "7", "14", "20"], 1, "43.2 − 36 = 7.2."),
      q("ecom-f15", "When is it right to scale spending?", ["When each order is profitable after all costs and delivery is reliable", "On day one", "When competitors scale", "When you feel confident"], 0, "Scale proven economics."),
    ],
  },
];
