import type { AssessmentDef } from "../types";

const C = "import-export-mini-importation";

type Q = AssessmentDef["questions"][number];
const q = (id: string, prompt: string, options: string[], answer: number, explanation: string): Q => ({ id, prompt, options, answer, explanation });

const check = (n: number, title: string, questions: Q[]): AssessmentDef => ({
  id: `iemi-m${String(n).padStart(2, "0")}-check`,
  courseId: C,
  kind: "module",
  moduleId: `iemi-m${String(n).padStart(2, "0")}`,
  title: `${title}: module check`,
  passingScore: 60,
  questions,
});

/**
 * Import, Export & Mini Importation: a check for each module (it awards the module badge and unlocks only after the
 * module's tasks are done) and a final assessment. Questions are scenarios with plausible wrong answers.
 */
export const IEMI_ASSESSMENTS: AssessmentDef[] = [
  check(1, "Import and Export Fundamentals", [
    q("iemi-m01-q1", "A supplier in Guangzhou sells goods to a trader in Lagos. What is this for Nigeria?", ["An export", "An import", "A re-export", "Domestic trade"], 1, "Goods coming into a country are its imports; for China the same sale is an export."),
    q("iemi-m01-q2", "Which person physically deals with Customs on arrival and gets the goods released for you?", ["The supplier", "The clearing agent", "The airline pilot", "Your customer"], 1, "A licensed clearing agent (customs broker) handles the declaration, payment of duty and release."),
    q("iemi-m01-q3", "A quote says FOB Shenzhen. What does that mean?", ["The seller delivers to your door in Lagos", "The seller puts the goods on board the ship at Shenzhen; cost and risk are yours from then", "You collect from the factory gate", "The seller pays all duty in Nigeria"], 1, "FOB means the seller loads the goods on the vessel at the named port; after that the freight and risk are the buyer's."),
    q("iemi-m01-q4", "Which is the best way to handle the risk of a first import?", ["Order a full container to get the lowest price", "Start small, test, then grow", "Pay the whole amount upfront to get a discount", "Skip the paperwork on small orders"], 1, "A small first order limits what you can lose while you learn."),
    q("iemi-m01-q5", "Two suppliers quote $2.40 EXW and $2.80 FOB for the same item. Why can't you say the first is cheaper?", ["EXW is always cheaper", "The terms cover different costs, so EXW needs extra transport costs added", "FOB means free", "Quotes never differ in terms"], 1, "Under EXW you pay for getting the goods to the port as well; only after adding those costs can you compare."),
  ]),
  check(2, "Product Research and Market Validation", [
    q("iemi-m02-q1", "What should you start with when choosing a product?", ["The cheapest item on a supplier site", "Evidence that customers already want it", "What your friend imports", "The heaviest product"], 1, "Demand first: a cheap product nobody buys is not a bargain."),
    q("iemi-m02-q2", "A product lands at ₦6,500 and sells for ₦10,000. What is the margin?", ["15%", "35%", "54%", "65%"], 1, "Profit ₦3,500 divided by the selling price ₦10,000 is 35%."),
    q("iemi-m02-q3", "Why are small, light and durable products good for beginners?", ["Customs ignores them", "Freight and breakage take less of the margin", "They never need a supplier", "They are always restricted"], 1, "Freight is charged by weight and size, and fragile goods are costly to lose."),
    q("iemi-m02-q4", "What is the best way to test a new product before a large order?", ["Order a container and see", "Pre-sell, order a sample and place a small first order", "Ask the supplier if it will sell", "Copy a competitor's price"], 1, "Pre-selling and a small order give real evidence at low cost."),
    q("iemi-m02-q5", "You plan to import cosmetic creams. What must you check first?", ["Nothing: cosmetics are unregulated", "NAFDAC and other approval requirements", "Only the colour of the packaging", "Only the supplier's logo"], 1, "Cosmetics are regulated products in Nigeria and need approval before sale."),
  ]),
  check(3, "Supplier Sourcing", [
    q("iemi-m03-q1", "What is the benefit of contacting three to five suppliers for one product?", ["It annoys suppliers into lowering prices", "You learn the real price and quality range", "Platforms require it", "It removes the need for samples"], 1, "Several quotes show what is normal, so you can spot a bargain or a trap."),
    q("iemi-m03-q2", "A supplier profile lists electronics, shoes and furniture. What does that suggest?", ["A specialised factory", "Probably a trading company", "A government agency", "A guaranteed bargain"], 1, "A true factory usually focuses on one line of goods."),
    q("iemi-m03-q3", "Which message gets the most useful reply from a supplier?", ["Price?", "One that gives the model, quantity and destination and asks for tier pricing, MOQ, sample price and lead time", "Please send your catalogue", "I want your lowest price"], 1, "Specific questions get specific answers and show you are serious."),
    q("iemi-m03-q4", "Supplier B quotes $2.40 EXW and Supplier A quotes $2.80 FOB. How should you compare them?", ["Choose B because it is cheaper", "Adjust both to the same terms before ranking", "Choose A because the price is higher", "Ignore the terms"], 1, "Add the missing costs so the quotes cover the same stages."),
    q("iemi-m03-q5", "When may a sourcing agent be useful?", ["Never", "When you are a beginner with a language gap and need factories checked", "Only for orders above a million dollars", "To avoid paying any duty"], 1, "Agents can find and check suppliers for a fee; verify the agent too."),
  ]),
  check(4, "Supplier Verification", [
    q("iemi-m04-q1", "A supplier refuses a live video call of the factory. What should you conclude?", ["Nothing; calls are unnecessary", "It is a red flag; be careful or find another supplier", "They are very busy and therefore reliable", "The price must be low"], 1, "A genuine supplier will usually show their factory live."),
    q("iemi-m04-q2", "After weeks of normal emails, the supplier sends new bank details. What do you do?", ["Pay to the new account at once", "Confirm by phone on a trusted number before paying anything", "Reply and ask them to send it twice", "Send half to each account"], 1, "A change of bank details is a classic sign of hacking or fraud."),
    q("iemi-m04-q3", "Which payment method gives the most protection for a first order on Alibaba?", ["Cash to an agent", "Trade Assurance on the platform", "Gift cards", "A personal account transfer"], 1, "Protected payment holds you covered if the order does not arrive or match."),
    q("iemi-m04-q4", "What does a pre-shipment inspection check?", ["The factory's staff numbers", "The finished goods against your specification before you pay the balance", "Your bank's rate", "The shipping line's ship"], 1, "An inspector checks quantity, quality and packing before the goods leave."),
    q("iemi-m04-q5", "A price is far below every other supplier and they want full payment today. What is most likely?", ["A genuine clearance sale", "A scam or a very poor product", "A special loyalty price", "A good deal you must grab"], 1, "Bait prices and pressure to pay quickly are common fraud signs."),
  ]),
  check(5, "Negotiation, MOQ and Samples", [
    q("iemi-m05-q1", "Which request is best when the MOQ is higher than you want?", ["Demand they ignore the MOQ", "Ask for a smaller trial order, mixed models or a stock supplier", "Accept it and order more than you can sell", "Stop replying"], 1, "There are several ways to reach a workable first order without over-buying."),
    q("iemi-m05-q2", "Why show a supplier your plan to reorder?", ["It has no effect", "A repeat buyer is worth a better price", "It lets you skip the sample", "It removes the MOQ by law"], 1, "Suppliers prefer buyers who return."),
    q("iemi-m05-q3", "What do you do with a sample when the bulk order arrives?", ["Throw it away", "Keep it as the standard to compare the bulk goods against", "Resell it first", "Give it to the shipping line"], 1, "The sample is your evidence if the bulk quality is worse."),
    q("iemi-m05-q4", "A common payment arrangement for manufactured goods is:", ["100% a year in advance", "About 30% deposit and the balance before shipment or against documents", "Nothing until you resell", "100% in cash to the agent"], 1, "A deposit starts production and the balance is held until the goods are checked or shipped."),
    q("iemi-m05-q5", "Why write a purchase order?", ["It is required to open a bank account", "It records the product, price, quantity, terms and delivery so there is no later dispute", "It replaces the commercial invoice", "It avoids duty"], 1, "A clear PO prevents arguments about what was agreed."),
  ]),
  check(6, "International Shipping", [
    q("iemi-m06-q1", "A carton is 60 × 40 × 50 cm and weighs 15 kg. What is the chargeable air weight (divisor 6,000)?", ["15 kg", "20 kg", "120 kg", "6,000 kg"], 1, "Volumetric weight is 120,000 ÷ 6,000 = 20 kg, which is greater than 15 kg actual."),
    q("iemi-m06-q2", "Which freight option usually suits heavy, bulky, non-urgent goods?", ["Courier", "Sea freight", "Air freight", "Hand luggage"], 1, "Sea freight costs far less per unit of cargo, at the price of time."),
    q("iemi-m06-q3", "What does LCL mean?", ["Large Container Load", "Less than Container Load: your goods share a container", "Low-Cost Logistics", "Local Cargo Licence"], 1, "LCL shares a container and you pay for your cubic metres."),
    q("iemi-m06-q4", "Why buy cargo insurance?", ["It speeds up customs", "Carrier liability is low, so loss or damage in transit would otherwise be yours", "It is free", "It replaces the invoice"], 1, "Insurance covers the value of the goods against loss or damage."),
    q("iemi-m06-q5", "Which is the best way to plan stock around transit time?", ["Use the shortest quoted time", "Use the longest realistic time with a buffer", "Ignore delays", "Order the day you run out"], 1, "Holidays, congestion and inspections regularly add time."),
  ]),
  check(7, "Import Documentation and Customs", [
    q("iemi-m07-q1", "Which document is the receipt and contract of carriage for sea freight?", ["Packing list", "Bill of lading", "Air waybill", "Certificate of origin"], 1, "The bill of lading is the sea transport document; the air waybill is its air equivalent."),
    q("iemi-m07-q2", "Why does the HS code matter?", ["It sets your selling price", "It decides the duty rate and whether the goods are restricted", "It names the supplier", "It is only for exports"], 1, "The code classifies the goods for duty, permits and statistics."),
    q("iemi-m07-q3", "CIF value ₦2,000,000, duty 10%, VAT 7.5% on CIF plus duty. What is the total duty and VAT?", ["₦200,000", "₦350,000", "₦365,000", "₦500,000"], 2, "Duty ₦200,000 plus VAT 7.5% of ₦2,200,000 = ₦165,000 gives ₦365,000."),
    q("iemi-m07-q4", "What is the most common cause of customs delay?", ["Documents that do not match each other or the goods", "A shipment that is too small", "Paying duty on time", "Using an invoice"], 0, "Mismatches in quantities, descriptions or values draw questions and fines."),
    q("iemi-m07-q5", "A supplier offers to write half the true value on the invoice to reduce duty. What do you do?", ["Agree; everyone does it", "Refuse: under-declaring is an offence that can lead to seizure and penalties", "Agree for small orders only", "Agree but pay the agent more"], 1, "False declarations risk the whole shipment and your record."),
  ]),
  check(8, "Nigerian Import Procedures", [
    q("iemi-m08-q1", "Which body registers food, drinks, drugs and cosmetics for sale in Nigeria?", ["SON", "NAFDAC", "NCC", "CAC"], 1, "NAFDAC regulates and registers these products."),
    q("iemi-m08-q2", "When is the Form M raised?", ["After the goods arrive", "Before the goods are shipped, through an authorised bank", "Only for exports", "Never for small orders"], 1, "The import declaration is made before shipment, using the supplier's proforma invoice."),
    q("iemi-m08-q3", "What happens if containers stay beyond the free days at the port?", ["Nothing", "Storage and demurrage charges build up every day", "Duty is refunded", "Customs pays the cost"], 1, "Delay is expensive; storage and demurrage accrue daily."),
    q("iemi-m08-q4", "Someone offers to 'settle' an official with cash to speed clearance. What do you do?", ["Accept to save time", "Refuse; it is bribery and exposes you to prosecution", "Pay half", "Pay through a friend"], 1, "Pay duty only through official channels and keep receipts."),
    q("iemi-m08-q5", "Why keep a file of documents for every shipment?", ["To impress the supplier", "To answer later questions, work out true costs and repeat what worked", "Because the bank deletes records", "It replaces insurance"], 1, "Records protect you and make the next shipment easier."),
  ]),
  check(9, "Landed Cost, Pricing and Profit", [
    q("iemi-m09-q1", "Why must you price from landed cost and not from the supplier's quote?", ["The quote is always wrong", "The quote leaves out freight, duty, VAT, clearing, transport and charges", "Customs sets your price", "Margins are fixed by law"], 1, "Many costs sit between the factory price and your shelf."),
    q("iemi-m09-q2", "Landed cost per unit is ₦6,000. What price gives a 40% margin?", ["₦8,400", "₦9,000", "₦10,000", "₦12,000"], 2, "6,000 ÷ (1 − 0.40) = ₦10,000. Adding 40% to cost (₦8,400) would only be a 28.6% margin."),
    q("iemi-m09-q3", "A product costs ₦6,000 and sells at ₦10,000. What is the markup on cost?", ["40%", "50%", "66.7%", "100%"], 2, "Profit ₦4,000 divided by cost ₦6,000 is 66.7%; the margin on price is 40%."),
    q("iemi-m09-q4", "The dollar rises from ₦1,500 to ₦1,650 before you pay. What is the effect?", ["No effect", "Your naira cost rises by 10%", "Your naira cost falls", "Duty is cancelled"], 1, "1,650 ÷ 1,500 is 10% higher, so every dollar of cost costs more naira."),
    q("iemi-m09-q5", "What is a good use of a landed cost calculator?", ["Reusing the same formulas for every product and testing a weaker naira", "Printing for the customs officer", "Setting the supplier's price", "Replacing the invoice"], 0, "One calculator with inputs and formulas prevents mistakes and shows the effect of changes."),
  ]),
  check(10, "Selling Imported Products", [
    q("iemi-m10-q1", "Why is wholesale useful even with a smaller margin?", ["It is more profitable per unit", "It turns stock into cash quickly so you can reorder", "It avoids tax", "It needs no stock"], 1, "Faster cash flow lets you keep the business moving."),
    q("iemi-m10-q2", "You sell 60 a month, lead time is 2 months and you want a 1-month buffer. When do you reorder?", ["At 60 units", "At 120 units", "At 180 units", "At zero"], 2, "60 × (2 + 1) = 180 units."),
    q("iemi-m10-q3", "What is the best way to use profit?", ["Spend it all straight away", "Count it first, then reinvest in what sells", "Reinvest in slow stock", "Hide it from the records"], 1, "Count profit before the next order so you do not spend working capital."),
    q("iemi-m10-q4", "Which product listing is strongest?", ["Power bank for sale", "A power bank that charges your phone four times, with price, delivery and a clear way to order", "Best price ever", "Cheap! DM"], 1, "Benefits, price, delivery and a call to action turn viewers into buyers."),
    q("iemi-m10-q5", "How should you grow from one product to many?", ["Add ten products at once", "Add one new thing at a time and keep the winners funded", "Stop selling the first product", "Copy every competitor"], 1, "Focused steps keep cash and quality under control."),
  ]),
  check(11, "Export Fundamentals and Finding Buyers", [
    q("iemi-m11-q1", "Which payment term is riskiest for an exporter shipping to a new buyer?", ["Letter of credit", "Open account (pay later)", "Deposit plus balance before release", "Payment in advance"], 1, "Shipping on credit leaves you chasing money abroad."),
    q("iemi-m11-q2", "What does a phytosanitary certificate show?", ["The buyer's credit history", "That plant products are free of pests", "The exchange rate", "The ship's name"], 1, "It is issued for plant products by the agricultural quarantine authority."),
    q("iemi-m11-q3", "Total cost per tonne is ₦1,800,000 and you want 20% profit on cost. What is the FOB price?", ["₦1,820,000", "₦2,000,000", "₦2,160,000", "₦3,600,000"], 2, "1,800,000 × 1.20 = ₦2,160,000."),
    q("iemi-m11-q4", "How should you treat a new overseas buyer?", ["Ship at once on their word", "Check their company, references and history before shipping", "Ignore them", "Ask them to pay in cash at the port"], 1, "Verify buyers as carefully as you verify suppliers."),
    q("iemi-m11-q5", "What is a safe starting term with a new buyer?", ["Full credit for 90 days", "A deposit with the balance before goods or documents are released, or a letter of credit", "Nothing in writing", "Payment after they resell"], 1, "It protects you while the relationship builds."),
  ]),
  check(12, "Final Project: Your Trade Business", [
    q("iemi-m12-q1", "Which opening is best for your business plan?", ["A general statement about trade", "A specific product, buyer and the evidence of demand", "A list of all products you like", "Your logo"], 1, "Specifics and evidence make a plan believable."),
    q("iemi-m12-q2", "What does stress-testing the plan mean?", ["Reading it aloud", "Changing the exchange rate, freight and price to see whether it still works", "Printing it", "Showing it to the supplier"], 1, "A plan that only works if everything goes right is fragile."),
    q("iemi-m12-q3", "Why include the compliance part?", ["To fill space", "Permits, approvals and the HS code decide whether the goods can be cleared and what they cost", "Customs requires a plan", "Banks ask for pictures"], 1, "Compliance problems can stop or seize a shipment."),
    q("iemi-m12-q4", "Which statement is best supported with numbers?", ["It will sell well", "I expect to sell 40 units at ₦12,000 in 30 days to my existing customers", "Everyone wants this", "The price is fair"], 1, "Numbers let a reader judge the plan."),
    q("iemi-m12-q5", "Why list your biggest risks with fixes?", ["To scare the reader", "To show you have thought about what could go wrong and how you will respond", "Risks do not matter", "It is a customs rule"], 1, "A plan with answers to its main risks is more credible and safer."),
  ]),
  {
    id: `${C}-final`,
    courseId: C,
    kind: "final",
    title: "Import, Export & Mini Importation: final assessment",
    passingScore: 60,
    questions: [
      q("iemi-f01", "Which is the best first import for a beginner?", ["A full container of one untested product", "A small test order after a sample, with the full landed cost worked out", "Whatever is cheapest", "Whatever a friend imported last year"], 1, "Small, tested and costed limits the loss while you learn."),
      q("iemi-f02", "A quote says DAP Lagos. What do you still have to handle?", ["Nothing at all", "Import clearance, duty and taxes", "Export clearance in China", "Loading the ship"], 1, "Under DAP the seller delivers to the named place; the buyer clears the goods into the country."),
      q("iemi-f03", "Which of these is a typical sign of a supplier scam?", ["A business licence that matches the bank account", "A far lower price, pressure to pay in full and a refusal to do a video call", "A sample offer", "A request to use Trade Assurance"], 1, "Bait prices, pressure and refusal to show the factory are classic fraud signs."),
      q("iemi-f04", "You are buying 300 units and the supplier's MOQ is 500. What is a sensible response?", ["Walk away without asking", "Ask for a trial order, tier pricing, or a stock supplier", "Order 5,000 for the discount", "Pay double"], 1, "There are options that keep your risk small."),
      q("iemi-f05", "Ten cartons, each 60 × 40 × 50 cm and 15 kg, go by air at $6 per kg. What is the freight cost?", ["$900", "$1,000", "$1,200", "$7,200"], 2, "Chargeable weight is 20 kg a carton × 10 = 200 kg; 200 × $6 = $1,200."),
      q("iemi-f06", "The commercial invoice and bill of lading describe the goods differently. What is the likely result?", ["Faster clearance", "Delay, questions and possibly fines until corrected", "A lower duty rate", "Nothing"], 1, "Customs expects documents that agree with each other and with the goods."),
      q("iemi-f07", "Which agency's approval do imported packaged foods and cosmetics generally need for sale in Nigeria?", ["NAFDAC", "NCC", "CAC", "The airline"], 0, "NAFDAC registers and regulates these products."),
      q("iemi-f08", "CIF ₦3,000,000, duty 20%, VAT 7.5% on CIF plus duty. What is the total duty and VAT?", ["₦600,000", "₦825,000", "₦870,000", "₦900,000"], 2, "Duty ₦600,000 plus VAT 7.5% of ₦3,600,000 = ₦270,000."),
      q("iemi-f09", "The landed cost per unit is ₦7,420. Which selling price gives about a 35% margin?", ["₦10,017", "₦11,415", "₦14,840", "₦7,680"], 1, "7,420 ÷ 0.65 is about ₦11,415."),
      q("iemi-f10", "Why can't you add 40% to cost and call it a 40% margin?", ["You can", "Markup is on cost and margin is on price; a 40% markup is only a 28.6% margin", "Customs forbids it", "Margins are fixed"], 1, "A cost of 100 plus 40% sells at 140, and 40 ÷ 140 is 28.6%."),
      q("iemi-f11", "A customs officer's friend offers to 'reduce' the duty for cash. What do you do?", ["Pay to save money", "Refuse and pay only through official channels with receipts", "Pay half", "Ask a colleague to pay it"], 1, "Bribery is an offence and exposes you to more demands and prosecution."),
      q("iemi-f12", "You sell 60 units a month, with a 2-month lead time and a 1-month buffer. Where is your reorder point?", ["60", "120", "180", "240"], 2, "60 × (2 + 1) = 180."),
      q("iemi-f13", "A new overseas buyer wants 2 tonnes on 60 days' credit. What do you do?", ["Agree", "Check them and ask for a deposit with the balance before release, or a letter of credit", "Ship without papers", "Ask them to pay the airline"], 1, "Credit with an unknown buyer is the riskiest term."),
      q("iemi-f14", "What do you do with your records of a completed shipment?", ["Delete them", "Keep a full file of documents, receipts and photos", "Give them all to the agent", "Keep only the invoice"], 1, "Complete records protect you and help you cost the next shipment."),
      q("iemi-f15", "What makes a trade business plan credible?", ["Confident words", "Real prices, a verified supplier, a full landed cost, tested assumptions and named risks with fixes", "A long document", "A famous product"], 1, "Evidence, numbers and tested assumptions matter more than length."),
    ],
  },
];
