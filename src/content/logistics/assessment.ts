import type { AssessmentDef } from "../types";

const C = "logistics-freight-forwarding";

type Q = AssessmentDef["questions"][number];
const q = (id: string, prompt: string, options: string[], answer: number, explanation: string): Q => ({ id, prompt, options, answer, explanation });

const check = (n: number, title: string, questions: Q[]): AssessmentDef => ({
  id: `lff-m${String(n).padStart(2, "0")}-check`,
  courseId: C,
  kind: "module",
  moduleId: `lff-m${String(n).padStart(2, "0")}`,
  title: `${title}: module check`,
  passingScore: 60,
  questions,
});

/** Logistics & Freight Forwarding: a check for each module (it awards the module badge) and a final assessment. */
export const LFF_ASSESSMENTS: AssessmentDef[] = [
  check(1, "Logistics Fundamentals", [
    q("lff-m01-q1", "Which best describes logistics?", ["Only trucking", "Planning and managing the movement and storage of goods and their information", "Only customs clearance", "Only warehousing"], 1, "Logistics covers transport, storage, inventory, documents and information."),
    q("lff-m01-q2", "Who is the consignee?", ["The party sending the goods", "The party receiving the goods", "The shipping line", "The customs officer"], 1, "The consignee is the receiver; the shipper or consignor sends."),
    q("lff-m01-q3", "A customer buys FOB Shenzhen. Where does the seller's responsibility for loading end?", ["At the buyer's door", "On board the ship at Shenzhen", "At the Lagos port", "At customs in Nigeria"], 1, "FOB means the seller delivers on board at the port of loading."),
    q("lff-m01-q4", "What usually happens when you choose a faster service?", ["It costs less", "It costs more", "It needs no documents", "It removes risk"], 1, "Speed generally costs more; logistics trades cost against service."),
    q("lff-m01-q5", "Logistics cost ₦4,500,000 on sales of ₦60,000,000. What share of sales is that?", ["4.5%", "6%", "7.5%", "13%"], 2, "4.5 ÷ 60 = 7.5%."),
  ]),
  check(2, "Modes of Transport", [
    q("lff-m02-q1", "Which mode is usually cheapest per tonne for large international volumes?", ["Air", "Sea", "Courier", "Motorbike"], 1, "Sea freight has the lowest cost per tonne for bulk and containers."),
    q("lff-m02-q2", "A carton is 60 × 50 × 40 cm and weighs 18 kg. What is the chargeable air weight (÷ 6,000)?", ["18 kg", "20 kg", "120 kg", "50 kg"], 1, "Volumetric 20 kg is greater than actual 18 kg."),
    q("lff-m02-q3", "What does LCL mean?", ["Large Container Load", "Less than Container Load: shared container space", "Local Cargo Licence", "Loaded Container Lot"], 1, "LCL shares a container with other shippers."),
    q("lff-m02-q4", "What distinguishes multimodal from intermodal transport?", ["Nothing", "Multimodal is under one contract and one document", "Multimodal is by air only", "Intermodal means road only"], 1, "Multimodal has a single contract and responsible party."),
    q("lff-m02-q5", "Which cargo suits RoRo shipping?", ["Loose grain", "Vehicles driven on and off the ship", "Liquids in tankers", "Documents"], 1, "RoRo handles wheeled cargo such as cars."),
  ]),
  check(3, "The Role of a Freight Forwarder", [
    q("lff-m03-q1", "What does a freight forwarder usually do?", ["Owns the ships and planes", "Arranges the transport and related services for customers", "Collects duty", "Makes the goods"], 1, "Forwarders organise the journey, usually without owning the transport."),
    q("lff-m03-q2", "What is consolidation?", ["Splitting cargo in half", "Combining small shipments into one container or pallet for a better rate", "A customs charge", "A type of insurance"], 1, "Consolidation pools cargo from several customers."),
    q("lff-m03-q3", "Goods have a CIF value of $9,000. What is cover at 110% of CIF?", ["$9,000", "$9,900", "$10,800", "$8,100"], 1, "9,000 × 1.10 = $9,900."),
    q("lff-m03-q4", "Why is cargo insurance important?", ["It speeds customs", "Carrier liability is usually limited and far below the goods' value", "It replaces the invoice", "It is free"], 1, "Insurance covers the insured value; carrier liability is capped."),
    q("lff-m03-q5", "What should you give a forwarder when booking?", ["Only the price you want", "Complete and accurate goods, weight, dimensions, value and dates", "Nothing until the ship sails", "A verbal description only"], 1, "Accurate information avoids errors and delays."),
  ]),
  check(4, "Shipping Documents", [
    q("lff-m04-q1", "Which is NOT a function of a bill of lading?", ["Receipt for the goods", "Evidence of the contract of carriage", "Document of title", "A customs duty receipt"], 3, "A B/L is a receipt, a contract and a document of title, not a duty receipt."),
    q("lff-m04-q2", "How does an air waybill differ from a bill of lading?", ["It is a document of title", "It is not a document of title; goods go to the named consignee", "It is only for sea freight", "It is issued by customs"], 1, "The AWB is a contract and receipt, but not a title document."),
    q("lff-m04-q3", "The invoice says 15 cartons and the packing list says 14. What should you do?", ["Ignore it", "Correct the documents before shipment so they match", "Ship and fix later", "Change the invoice only"], 1, "Mismatches cause delays and fines; fix them before the vessel sails."),
    q("lff-m04-q4", "A clean bill of lading means:", ["The container was washed", "It has no remarks about damage", "It has no charges", "It is a copy"], 1, "A clean B/L records the goods in apparent good condition."),
    q("lff-m04-q5", "A shipment will not clear without a certificate. What do you do?", ["Make one up", "Obtain the genuine certificate; never falsify documents", "Pay the agent extra", "Change the goods description"], 1, "False documents are an offence."),
  ]),
  check(5, "Customs and Clearing", [
    q("lff-m05-q1", "CIF ₦5,000,000, duty 5%, VAT 7.5% on CIF plus duty. What is the total duty and VAT?", ["₦250,000", "₦393,750", "₦643,750", "₦875,000"], 2, "Duty ₦250,000 plus VAT ₦393,750."),
    q("lff-m05-q2", "What does the HS code decide?", ["The shipping line", "The duty rate and any restrictions", "The container colour", "The delivery date"], 1, "Classification drives duty and regulation."),
    q("lff-m05-q3", "What is demurrage?", ["A discount", "Charges for keeping a container beyond the free period", "A kind of insurance", "A customs form"], 1, "Delays after free days attract demurrage and storage."),
    q("lff-m05-q4", "Goods pass through a country to another destination with duty suspended. This is:", ["Temporary import", "Transit", "Re-export", "Retail"], 1, "Transit lets goods cross under customs control."),
    q("lff-m05-q5", "A bonded warehouse allows you to:", ["Avoid customs forever", "Store goods under customs control without paying duty until release", "Skip documents", "Ship by air only"], 1, "Duty is deferred while goods stay in bond."),
  ]),
  check(6, "Freight Rates and Quotations", [
    q("lff-m06-q1", "Why must a quotation list every charge?", ["It looks professional", "Hidden extras destroy trust and make quotes impossible to compare", "Customs requires it", "To raise the price"], 1, "Clear, complete quotes avoid disputes."),
    q("lff-m06-q2", "4 CBM at $90, plus $50, $35, $70 and $120 of other charges. What is the cost subtotal?", ["$360", "$635", "$730", "$275"], 1, "360 + 50 + 35 + 70 + 120 = $635."),
    q("lff-m06-q3", "A 15% margin on cost of $635 gives a price of about:", ["$650", "$730.25", "$760", "$1,000"], 1, "635 × 1.15 = $730.25."),
    q("lff-m06-q4", "What strengthens a forwarder's bargaining with carriers?", ["Small random bookings", "Volume, regular business and booking early", "Late payment", "Ignoring alternatives"], 1, "Consistent volume and trust win better rates."),
    q("lff-m06-q5", "A bunker surcharge covers:", ["Warehouse rent", "Changes in fuel cost", "Customs duty", "Insurance"], 1, "Bunker surcharges pass on fuel price changes."),
  ]),
  check(7, "Cargo Handling, Packing and Container Loading", [
    q("lff-m07-q1", "A 20-foot container has about 33 CBM and you plan to use 85%. Cartons are 0.12 CBM. How many fit?", ["275", "233", "200", "150"], 1, "28.05 ÷ 0.12 = 233.75, so 233."),
    q("lff-m07-q2", "What should you do before signing for damaged cargo?", ["Sign and complain later", "Note the damage on the delivery note and take photographs", "Refuse to speak", "Throw the carton away"], 1, "Unrecorded damage can cost you the claim."),
    q("lff-m07-q3", "Which code governs dangerous goods at sea?", ["IMDG", "HS", "CIF", "FIFO"], 0, "The IMDG Code governs sea carriage; IATA DGR governs air."),
    q("lff-m07-q4", "Why block and brace cargo in a container?", ["For appearance", "So it cannot shift and be damaged in transit", "To increase weight", "To avoid documents"], 1, "Shifting cargo is a major cause of damage."),
    q("lff-m07-q5", "Marking a carton '3 of 120' helps to:", ["Hide the goods", "Find missing cartons and prevent mix-ups", "Lower the duty", "Replace the packing list"], 1, "Numbered marks make shortages easy to detect."),
  ]),
  check(8, "Warehousing and Distribution", [
    q("lff-m08-q1", "Which method ships the earliest-expiring stock first?", ["FIFO", "FEFO", "LIFO", "WMS"], 1, "FEFO is first expired, first out, vital for food and medicine."),
    q("lff-m08-q2", "120 deliveries cost ₦480,000. What is the cost per delivery?", ["₦3,000", "₦4,000", "₦4,800", "₦40,000"], 1, "480,000 ÷ 120 = ₦4,000."),
    q("lff-m08-q3", "108 of 120 deliveries succeed on the first try. What is the success rate?", ["80%", "85%", "90%", "95%"], 2, "108 ÷ 120 = 90%."),
    q("lff-m08-q4", "What is cross-docking?", ["Storing goods for a year", "Moving inbound goods straight to outbound vehicles with little storage", "Counting stock", "Returning goods"], 1, "Cross-docking saves time and space."),
    q("lff-m08-q5", "How do cycle counts help?", ["They replace all records", "They find stock errors early through regular small counts", "They reduce deliveries", "They cut duty"], 1, "Frequent counts catch discrepancies sooner."),
  ]),
  check(9, "Technology and Tracking", [
    q("lff-m09-q1", "Which reference tracks a sea container?", ["Flight number", "Container number or bill of lading number", "Passport number", "Invoice date"], 1, "Containers are tracked by container, booking or B/L numbers."),
    q("lff-m09-q2", "34 of 40 shipments arrive on time. What is the on-time rate?", ["75%", "80%", "85%", "90%"], 2, "34 ÷ 40 = 85%."),
    q("lff-m09-q3", "What is the best way to tell a customer of a delay?", ["Wait until they ask", "Tell them early with the cause, a new date and what you are doing", "Blame the carrier only", "Say nothing"], 1, "Proactive, honest updates keep customers."),
    q("lff-m09-q4", "What does a shipment tracker spreadsheet need to be useful?", ["Clear columns, consistent entries and someone responsible", "Expensive software", "Only the customer's name", "No dates"], 0, "A well-kept spreadsheet beats a poorly used system."),
    q("lff-m09-q5", "'Vessel arrived' means:", ["Goods are ready to collect", "The ship is at the port; clearance and release are still to come", "Customs is finished", "The goods are delivered"], 1, "Arrival is only one milestone."),
  ]),
  check(10, "Compliance, Risk and Problem Solving", [
    q("lff-m10-q1", "Likelihood 4 and impact 3 give a risk score of:", ["7", "10", "12", "15"], 2, "4 × 3 = 12."),
    q("lff-m10-q2", "What is the best first reaction to a damaged shipment?", ["Hide it", "Get the facts, protect the cargo and tell the customer early", "Blame the driver", "Cancel the order"], 1, "Facts, protection and early communication come first."),
    q("lff-m10-q3", "What protects a forwarder from non-compliance?", ["Speed", "Systems: procedures, training, checklists and records", "Luck", "A big discount"], 1, "Good systems make compliance routine."),
    q("lff-m10-q4", "Which is a way to transfer risk?", ["Ignoring it", "Cargo insurance", "Hiding documents", "Delaying the shipment"], 1, "Insurance transfers financial loss to the insurer."),
    q("lff-m10-q5", "When at fault for a delay, a good customer message:", ["Makes excuses", "Owns the mistake, says what you are doing and gives the next update time", "Blames customs", "Is avoided"], 1, "Ownership and a plan keep trust."),
  ]),
  check(11, "Running a Forwarding Business", [
    q("lff-m11-q1", "Carrier and local costs $1,050, quote $1,300. What is the profit?", ["$150", "$250", "$350", "$1,300"], 1, "1,300 − 1,050 = $250."),
    q("lff-m11-q2", "Profit $250 on a $1,300 quote is a margin on selling price of about:", ["19.2%", "23.8%", "25%", "30%"], 0, "250 ÷ 1,300 = 19.2%."),
    q("lff-m11-q3", "Monthly overhead is $2,000 and profit per shipment $250. How many shipments to break even?", ["4", "6", "8", "10"], 2, "2,000 ÷ 250 = 8."),
    q("lff-m11-q4", "Why choose a niche?", ["To limit customers", "It is easier to stand out and build expertise", "Regulators require it", "It removes competition"], 1, "A niche lets a small forwarder compete on expertise."),
    q("lff-m11-q5", "Why watch cash flow in a forwarding business?", ["You pay carriers before customers pay you", "Carriers pay you first", "It never matters", "Customers always pay in advance"], 0, "Payment timing can strain a small forwarder."),
  ]),
  check(12, "Final Project: A Complete Shipment Plan", [
    q("lff-m12-q1", "How should the plan be organised for the customer?", ["Detail first, recommendation last", "Recommendation first, then supporting detail", "Only a price", "Only risks"], 1, "Lead with the decision, then show the support."),
    q("lff-m12-q2", "What should a quotation state clearly?", ["Only the total", "Every charge, the margin, validity and what is excluded", "Nothing about duty", "Only the carrier name"], 1, "Complete quotes avoid disputes."),
    q("lff-m12-q3", "Why include a delay allowance in transit time?", ["To look slow", "Delays are common and the customer needs a realistic date", "Customs requires it", "It lowers the price"], 1, "A realistic date prevents broken promises."),
    q("lff-m12-q4", "What belongs in the documents part?", ["Only the invoice", "The documents, certificates, permits, HS code and who prepares each", "Photos", "Nothing"], 1, "Complete document planning avoids clearance delays."),
    q("lff-m12-q5", "Why list risks with responses?", ["To fill space", "It shows you have planned for what could go wrong", "Customers dislike risks", "It is a tax rule"], 1, "Planned responses make delays and damage manageable."),
  ]),
  {
    id: `${C}-final`,
    courseId: C,
    kind: "final",
    title: "Logistics & Freight Forwarding: final assessment",
    passingScore: 60,
    questions: [
      q("lff-f01", "Which party arranges the movement of goods but usually does not own the transport?", ["The carrier", "The freight forwarder", "The consignee", "The customs officer"], 1, "Forwarders arrange transport using carriers' capacity."),
      q("lff-f02", "10 cartons of 60 × 50 × 40 cm and 18 kg each go by air at $5.50 a kg. What is the freight?", ["$990", "$1,100", "$1,320", "$11,000"], 1, "Chargeable 20 kg × 10 = 200 kg; 200 × 5.50 = $1,100."),
      q("lff-f03", "A bill of lading is all of the following EXCEPT:", ["A receipt", "Evidence of the contract of carriage", "A document of title", "A duty payment"], 3, "It does not prove payment of duty."),
      q("lff-f04", "What should you do about an error you find in the documents before shipment?", ["Ignore it", "Correct it so all documents match", "Ship anyway", "Delete the packing list"], 1, "Fix it before the vessel sails."),
      q("lff-f05", "CIF ₦5,000,000, duty 5%, VAT 7.5% on CIF plus duty. What is total duty and VAT?", ["₦643,750", "₦625,000", "₦875,000", "₦393,750"], 0, "250,000 + 393,750."),
      q("lff-f06", "What does a good quotation include?", ["Only the total", "Every charge, margin, validity and exclusions", "No exclusions", "Only freight"], 1, "Transparent quotes win trust."),
      q("lff-f07", "Cargo insurance at 110% of a $9,000 CIF value covers:", ["$9,000", "$9,900", "$8,100", "$10,000"], 1, "9,000 × 1.1."),
      q("lff-f08", "A planner uses 85% of a 33 CBM container and cartons of 0.12 CBM. How many cartons fit?", ["275", "233", "250", "200"], 1, "28.05 ÷ 0.12 = 233.75, so 233."),
      q("lff-f09", "Which stock method is best for food with expiry dates?", ["LIFO", "FEFO", "Random", "Last in"], 1, "FEFO ships the soonest-expiring stock first."),
      q("lff-f10", "120 deliveries cost ₦480,000 and 108 succeed first time. What are cost per delivery and first-attempt rate?", ["₦4,000 and 90%", "₦4,800 and 90%", "₦4,000 and 80%", "₦3,000 and 95%"], 0, "480,000 ÷ 120 = 4,000; 108 ÷ 120 = 90%."),
      q("lff-f11", "Your container is held because you made a document error. What is the best message?", ["Blame customs", "Own the mistake, say what you are doing and give an update time", "Say nothing until released", "Offer a discount only"], 1, "Ownership and a plan keep customers."),
      q("lff-f12", "Which risk has the highest score: A (4×3), B (2×5), C (3×4)?", ["A only", "B only", "A and C tie at 12", "None"], 2, "A = 12, B = 10, C = 12."),
      q("lff-f13", "A quote to the customer is $1,300 against costs of $1,050. What is the profit?", ["$150", "$250", "$350", "$450"], 1, "1,300 − 1,050 = 250."),
      q("lff-f14", "Overhead is $2,000 a month and profit per shipment is $250. What number of shipments breaks even?", ["6", "8", "10", "12"], 1, "2,000 ÷ 250 = 8."),
      q("lff-f15", "Which habit most protects a forwarder from compliance trouble?", ["Speed over accuracy", "Written procedures, checklists, trained staff and records", "Verbal agreements", "Skipping documents for trusted customers"], 1, "Systems make compliance routine."),
    ],
  },
];
