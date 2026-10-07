/**
 * Business, trade and professional skills courses.
 *
 * Each is a structured, paid course with a full curriculum. They are listed here in full (modules and what each covers) so
 * the catalogue and course pages are complete, and they open for enrolment when an admin sets them to Available and opens
 * enrolment: until then they show "Opens soon". The prices are the starting prices: admins change them in the dashboard
 * (the seed writes them once and never again).
 */
import type { CertificateRules, CourseDef, ModuleDef } from "./catalog";

const mod = (id: string, title: string, topics: string[]): ModuleDef => ({ id, title, lessons: [], topics });

const rules: CertificateRules = { enabled: true, requireAllLessons: true, requireExercises: true, requireProject: true, requireModuleBadges: false, passingScore: 60 };

type Spec = {
  id: string;
  code: string;
  title: string;
  categoryId: "business-entrepreneurship" | "trade-logistics" | "professional-skills";
  summary: string;
  description: string;
  overview: string;
  /** "3 months", "2 to 3 months" */
  duration: string;
  weeks: number;
  level: "beginner" | "beginner-intermediate";
  price: number;
  skills: string[];
  prerequisites: string[];
  audience: string[];
  outcomes: string[];
  projectTitle: string;
  projectSummary: string;
  modules: ModuleDef[];
  faqs?: { q: string; a: string }[];
};

/** Questions every course answers the same way. A course can add its own. */
const commonFaqs = (s: Spec): { q: string; a: string }[] => [
  { q: "How long does the course take?", a: `Plan for ${s.duration}. It is self-paced, so you can study around work or school, and your progress is saved as you go.` },
  { q: "Do I need any experience?", a: s.level === "beginner" ? "No. The course starts from the beginning and assumes no experience." : "No experience is needed. It starts with the basics and builds up to more advanced practice." },
  { q: "Will I get a certificate?", a: "Yes, when you complete the lessons, pass the assessments and submit the final project. Paying for the course does not award the certificate on its own." },
  { q: "How do I pay?", a: "You pay once, by bank transfer to the Academy account, and send your receipt. The course opens as soon as the payment is confirmed." },
  ...(s.faqs ?? []),
];

function course(s: Spec): CourseDef {
  return {
    id: s.id,
    slug: s.id,
    code: s.code,
    title: s.title,
    summary: s.summary,
    description: s.description,
    overview: s.overview,
    categoryId: s.categoryId,
    difficulty: "beginner",
    difficultyMax: s.level === "beginner-intermediate" ? "intermediate" : undefined,
    level: 2,
    levelLabel: s.level === "beginner-intermediate" ? "Beginner to Intermediate" : "Beginner",
    durationLabel: s.duration,
    durationWeeks: s.weeks,
    isFree: false,
    status: "coming_soon",
    skills: s.skills,
    prerequisites: s.prerequisites,
    projectTitle: s.projectTitle,
    projectPreviews: [{ title: s.projectTitle, summary: s.projectSummary }],
    audience: s.audience,
    outcomes: s.outcomes,
    faqs: commonFaqs(s),
    certificate: rules,
    modules: s.modules,
    // Paid, one payment, self-paced. Enrolment stays closed until the course content is ready and an admin opens it.
    courseType: "professional",
    access: "paid",
    price: s.price,
    currency: "NGN",
    deliveryType: "self_paced",
    enrollmentStatus: "closed",
    communityAccess: false,
    instructorSupport: false,
    included: [],
  };
}

const SPECS: Spec[] = [
  /* ---------------------------------------------------------------- Business & Entrepreneurship */
  {
    id: "entrepreneurship-business-management",
    code: "ENT",
    title: "Entrepreneurship & Business Management",
    categoryId: "business-entrepreneurship",
    summary: "Turn an idea into a real, running business: validate it, plan it, register it, fund it and manage it.",
    description:
      "A practical course for people who want to start or run a business. You learn how to find and test an opportunity, build a business model, plan the money, handle registration and compliance in Nigeria, and manage operations and people. You finish with a complete business plan you can use.",
    overview:
      "Most businesses fail from avoidable mistakes: building something nobody wants, mispricing it, or running out of cash. This course takes you through the whole journey in order, from the first idea to a business that is registered, priced, funded and managed, with a real business plan as your final project.",
    duration: "3 months",
    weeks: 12,
    level: "beginner-intermediate",
    price: 75000,
    skills: ["Idea validation", "Business model design", "Business planning", "Pricing and cash flow", "Business registration in Nigeria", "Managing operations and people"],
    prerequisites: ["No experience needed", "A business idea, or the wish to find one"],
    audience: ["Aspiring entrepreneurs", "Small business owners who want more structure", "Graduates and professionals planning a side business", "Managers who want to understand how a business works end to end"],
    outcomes: ["Test an idea with real customers before spending money", "Build a clear business model and value proposition", "Write a business plan with a budget and cash flow", "Register and set up a business properly in Nigeria", "Price your product and track profit", "Manage operations, a team and growth"],
    projectTitle: "Your business plan",
    projectSummary: "A complete plan for a real or realistic business: the customer, the offer, the model, the money and the first 90 days.",
    modules: [
      mod("ent-m01", "The entrepreneurial mindset and finding opportunity", ["What entrepreneurs do differently", "Spotting problems worth solving", "Opportunity versus idea", "Your strengths, resources and risks"]),
      mod("ent-m02", "Validating your idea", ["Who your customer really is", "Customer interviews and surveys", "Testing demand cheaply", "Minimum viable product", "Deciding to go, change or stop"]),
      mod("ent-m03", "Business model and value proposition", ["The Business Model Canvas", "Value proposition", "Revenue models", "Costs and key resources", "Competitors and positioning"]),
      mod("ent-m04", "Business planning and strategy", ["Vision, mission and goals", "Setting objectives and milestones", "A one-page plan and a full plan", "Strategy basics", "Risks and how to plan for them"]),
      mod("ent-m05", "Setting up legally in Nigeria", ["Business structures: sole proprietor, partnership, limited company", "CAC registration", "Tax identification and taxes", "Licences, permits and contracts", "Protecting your name and brand"]),
      mod("ent-m06", "Marketing and selling", ["Marketing basics for a new business", "Choosing channels", "Branding on a small budget", "Selling and customer service", "Referrals and repeat customers"]),
      mod("ent-m07", "Operations and management", ["Turning an offer into a repeatable process", "Suppliers and quality", "Inventory and delivery", "Tools that save time", "Systems and record keeping"]),
      mod("ent-m08", "Money: pricing, budgeting, cash flow and funding", ["Pricing for profit", "Costs, margins and break-even", "Budgets and cash flow forecasts", "Separating business and personal money", "Funding options: savings, loans, grants, investors"]),
      mod("ent-m09", "Leadership, people and growth", ["Leading yourself and others", "Hiring your first people", "Delegation and accountability", "Measuring performance", "When and how to grow"]),
      mod("ent-m10", "Final project: your business plan", ["Pulling your work together", "Writing the plan", "Presenting and defending it", "Your first 90 days"]),
    ],
  },
  {
    id: "business-development-sales",
    code: "BDS",
    title: "Business Development & Sales",
    categoryId: "business-entrepreneurship",
    summary: "Find customers, hold better sales conversations, handle objections and close deals, with a pipeline you can manage.",
    description:
      "A practical sales course for people who need to bring in customers: salespeople, founders and business developers. You learn to find the right prospects, run a sales conversation, handle objections, negotiate and close, then manage a pipeline and measure results.",
    overview:
      "Selling is a skill that can be learned. This course gives you a clear process, from finding the right prospects to closing and keeping them, with scripts, role plays and a sales plan of your own to finish.",
    duration: "2 to 3 months",
    weeks: 10,
    level: "beginner-intermediate",
    price: 60000,
    skills: ["Prospecting and lead generation", "Discovery and sales conversations", "Objection handling", "Negotiation and closing", "Pipeline and CRM management", "Sales metrics"],
    prerequisites: ["No experience needed"],
    audience: ["Sales representatives and new salespeople", "Founders and business owners who sell themselves", "Business development officers", "Anyone moving into a sales or account role"],
    outcomes: ["Find and qualify the right prospects", "Run a discovery conversation that uncovers real needs", "Present and propose with confidence", "Handle objections and negotiate", "Close deals and keep customers", "Track a pipeline and report on results"],
    projectTitle: "Your sales plan and pitch",
    projectSummary: "A target customer profile, a prospecting plan, a pitch and a pipeline for a real or realistic product.",
    modules: [
      mod("bds-m01", "Sales fundamentals", ["What selling really is", "The sales process from lead to loyal customer", "Business development versus sales", "Ethics and trust"]),
      mod("bds-m02", "Understanding your customer", ["Ideal customer profile", "Customer needs, pains and gains", "Buyers, users and decision makers", "Competitor awareness"]),
      mod("bds-m03", "Prospecting and lead generation", ["Where leads come from", "Cold outreach by call, message and email", "Referrals and networking", "Social selling on LinkedIn and WhatsApp", "Qualifying leads"]),
      mod("bds-m04", "The sales conversation", ["Preparing for a meeting", "Opening and building rapport", "Asking good discovery questions", "Listening and note taking", "Presenting your solution"]),
      mod("bds-m05", "Objections and negotiation", ["Why people object", "Handling price, trust and timing objections", "Negotiation principles", "Discounts without losing value", "Walking away well"]),
      mod("bds-m06", "Proposals and closing", ["Writing a proposal that gets read", "Quotations and terms", "Closing techniques that respect the customer", "Follow-up that works", "After the sale"]),
      mod("bds-m07", "Pipeline, CRM and sales operations", ["Pipeline stages", "Using a CRM or a spreadsheet", "Forecasting", "Daily and weekly sales routines"]),
      mod("bds-m08", "Partnerships and key accounts", ["Finding and approaching partners", "Account management", "Upselling and cross-selling", "Handling large customers"]),
      mod("bds-m09", "Measuring sales", ["Sales metrics that matter", "Conversion rates and cycle length", "Reports for managers", "Improving what you measure"]),
      mod("bds-m10", "Final project: sales plan and pitch", ["Choosing your product and market", "Building the plan", "Delivering the pitch", "Review and next steps"]),
    ],
  },
  {
    id: "digital-marketing-sales",
    code: "DMS",
    title: "Digital Marketing & Sales",
    categoryId: "business-entrepreneurship",
    summary: "Plan and run marketing that brings in customers: content, social media, ads, search, email and conversion, with the numbers to prove it works.",
    description:
      "A practical digital marketing course for business owners, marketers and beginners. You learn strategy and brand, content and social media, paid ads, search, email and WhatsApp marketing, sales funnels and analytics, then run a full campaign plan.",
    overview:
      "Digital marketing is not posting and hoping. You learn to start with the customer, pick the right channels, make content and ads that work, and measure results so you know what to do more of. You finish by planning and building a full campaign.",
    duration: "3 months",
    weeks: 12,
    level: "beginner-intermediate",
    price: 75000,
    skills: ["Marketing strategy", "Content and social media", "Paid advertising", "Search engine optimisation", "Email and WhatsApp marketing", "Funnels and analytics"],
    prerequisites: ["No experience needed", "A smartphone or computer with internet"],
    audience: ["Business owners who market themselves", "Aspiring digital marketers", "Social media managers", "Sales teams that want more leads"],
    outcomes: ["Build a marketing strategy around your customer", "Create content that people want to read and share", "Run and measure paid ads", "Make a website and content easier to find on Google", "Use email and WhatsApp to sell", "Report on what is working"],
    projectTitle: "A complete marketing campaign",
    projectSummary: "Strategy, content calendar, ad set-up, funnel and measurement plan for a real or realistic business.",
    modules: [
      mod("dms-m01", "Marketing fundamentals and strategy", ["How marketing and sales fit together", "Customers and segments", "Setting goals", "Choosing channels and a budget"]),
      mod("dms-m02", "Brand and positioning", ["Brand identity", "Positioning and messaging", "Tone of voice", "A simple brand guide"]),
      mod("dms-m03", "Content marketing", ["Content that serves the customer", "Formats: posts, video, blogs", "Writing for the web", "A content calendar", "Repurposing content"]),
      mod("dms-m04", "Social media marketing", ["Choosing platforms", "Instagram, Facebook, TikTok, LinkedIn and X", "Community and engagement", "Working with creators", "Social media routines"]),
      mod("dms-m05", "Paid advertising", ["How online ads work", "Meta (Facebook and Instagram) ads", "Google and YouTube ads", "Audiences, budgets and creative", "Reading ad results"]),
      mod("dms-m06", "Search engine optimisation", ["How search works", "Keyword research", "On-page SEO", "Local search and Google Business Profile", "Links and authority"]),
      mod("dms-m07", "Email and WhatsApp marketing", ["Building a list", "Email campaigns and automation", "WhatsApp Business and broadcasts", "Messages that get replies"]),
      mod("dms-m08", "Funnels, landing pages and conversion", ["The customer journey", "Landing pages that convert", "Offers and calls to action", "Testing and improving"]),
      mod("dms-m09", "Analytics and reporting", ["Key marketing metrics", "Google Analytics basics", "Tracking campaigns", "Reporting to a boss or client"]),
      mod("dms-m10", "Final project: a full campaign", ["Planning the campaign", "Building the assets", "Setting up tracking", "Presenting the plan"]),
    ],
  },
  {
    id: "ecommerce-online-business",
    code: "ECOM",
    title: "E-commerce & Online Business",
    categoryId: "business-entrepreneurship",
    summary: "Choose a product, build an online store, take payments, deliver orders and bring in customers.",
    description:
      "A hands-on course for people who want to sell online: on their own store, on social media and on marketplaces. You learn to choose a niche and products, set up a store, handle payments and delivery, attract customers and look after them.",
    overview:
      "Selling online is simple to start and hard to do well. This course covers the whole chain: what to sell, where to sell it, how to get paid, how to deliver and how to bring in customers, with a launched store as your project.",
    duration: "2 months",
    weeks: 8,
    level: "beginner-intermediate",
    price: 60000,
    skills: ["Product and niche selection", "Building an online store", "Payments and pricing", "Fulfilment and delivery", "Online customer acquisition", "Customer service and returns"],
    prerequisites: ["No experience needed"],
    audience: ["People starting an online shop", "Small businesses moving online", "Social media sellers who want a real store", "Anyone curious about online business models"],
    outcomes: ["Pick a niche and products with real demand", "Set up a store and product pages that sell", "Accept payments safely", "Plan delivery, stock and returns", "Bring in traffic and repeat customers", "Read simple store numbers and grow"],
    projectTitle: "Launch an online store",
    projectSummary: "A working store or storefront with products, payments, delivery options and a launch plan.",
    modules: [
      mod("ecom-m01", "How online business works", ["E-commerce models: own store, marketplace, social, dropshipping", "Costs and margins", "Choosing a model that fits you"]),
      mod("ecom-m02", "Niche and product selection", ["Finding a niche", "Product research and demand", "Suppliers and sourcing", "Pricing and profit per order"]),
      mod("ecom-m03", "Building your store", ["Choosing a platform", "Store design and product pages", "Photos and descriptions that sell", "Policies and trust signals"]),
      mod("ecom-m04", "Payments and checkout", ["Payment methods for Nigeria and abroad", "Card, transfer and cash on delivery", "Fraud and chargebacks", "Invoices and receipts"]),
      mod("ecom-m05", "Fulfilment and delivery", ["Stock and inventory", "Packaging", "Couriers and delivery options", "Tracking and delays"]),
      mod("ecom-m06", "Marketing and traffic", ["Social media and WhatsApp selling", "Ads for a store", "Search and email", "Reviews and referrals"]),
      mod("ecom-m07", "Customer service and returns", ["Answering customers well", "Returns and refunds", "Handling complaints", "Building loyalty"]),
      mod("ecom-m08", "Analytics, scaling and final project", ["Store metrics that matter", "Improving conversion", "Scaling what works", "Launching your store"]),
    ],
  },

  /* ---------------------------------------------------------------- Trade & Logistics */
  {
    id: "import-export-mini-importation",
    code: "IEMI",
    title: "Import, Export & Mini Importation",
    categoryId: "trade-logistics",
    summary: "Research products, find and verify suppliers, ship internationally, clear customs, work out your landed cost and build a profitable import or export business.",
    description:
      "Learn how to research products, identify and evaluate suppliers, negotiate purchases, understand international shipping, calculate landed costs, understand import documentation and develop a practical import/export business.",
    overview:
      "Importing and exporting can be very profitable, and very expensive when done wrong. This course walks you through the whole process in order, from choosing a product and testing the market, through finding and verifying suppliers, negotiating, shipping, documents and customs, to calculating your true costs and selling at a profit. It covers Nigerian import procedures and the basics of exporting, and ends with a complete import or export business project.",
    duration: "3 months",
    weeks: 12,
    level: "beginner-intermediate",
    price: 75000,
    skills: ["Product research and market validation", "Supplier sourcing and verification", "Negotiation, MOQ and samples", "International shipping and freight", "Import documentation and customs", "Landed cost and pricing"],
    prerequisites: ["No experience needed", "Basic arithmetic and spreadsheet use"],
    audience: ["People starting a mini importation business", "Small traders who want to import directly", "Business owners who want to export", "Anyone working in or moving into trade, shipping or sourcing"],
    outcomes: ["Choose products with real demand and margin", "Find, check and compare suppliers on Alibaba and other platforms", "Negotiate prices, order quantities and samples", "Choose between air and sea freight and work with freight forwarders", "Prepare import documents and understand HS codes and customs", "Calculate landed cost, price your goods and plan your profit", "Understand export basics and find international buyers"],
    projectTitle: "Your import or export business plan",
    projectSummary: "A complete plan: product, supplier shortlist, shipping route, documents, landed cost and pricing, and how you will sell.",
    faqs: [
      { q: "Does this course help me import into Nigeria?", a: "Yes. It covers Nigerian import procedures as well as general international trade, so you learn what applies when your goods arrive." },
      { q: "Do I need money to start importing?", a: "Not to take the course. It shows you how to test a product and work out costs before you commit money, so you buy with the numbers in front of you." },
    ],
    modules: [
      mod("iemi-m01", "Import and export fundamentals", ["What importing and exporting are", "Mini importation versus full trade", "Who is involved: buyers, suppliers, forwarders, customs", "Trade terms (Incoterms) in plain language", "Risks and how to manage them"]),
      mod("iemi-m02", "Product research and market validation", ["Finding product ideas", "Checking demand and competition", "Estimating margin before you buy", "Testing the market with small orders", "Avoiding restricted and risky products"]),
      mod("iemi-m03", "Supplier sourcing", ["Where to find suppliers", "Alibaba and international supplier platforms", "Reading a supplier profile", "Comparing suppliers fairly", "Trade shows and agents"]),
      mod("iemi-m04", "Supplier verification", ["Spotting scams and unreliable suppliers", "Checking company details and certificates", "Trade assurance and safe payment methods", "Factory audits and inspections", "Red flags checklist"]),
      mod("iemi-m05", "Negotiation, MOQ and samples", ["How to negotiate with suppliers", "Minimum order quantity (MOQ)", "Ordering and evaluating samples", "Payment terms and deposits", "Writing a clear purchase order"]),
      mod("iemi-m06", "International shipping", ["Air freight versus sea freight", "LCL, FCL and courier options", "Working with freight forwarders", "Packaging, labelling and insurance", "Transit times and tracking"]),
      mod("iemi-m07", "Import documentation and customs", ["Commercial invoice, packing list and bill of lading or airway bill", "HS codes and why they matter", "Duties, taxes and valuation", "How customs clearance works", "Common delays and how to avoid them"]),
      mod("iemi-m08", "Nigerian import procedures", ["Who regulates imports into Nigeria", "Registration, permits and restricted items", "Clearing through the ports and airports", "Working with licensed clearing agents", "Compliance and record keeping"]),
      mod("iemi-m09", "Landed cost, pricing and profit", ["What goes into landed cost", "Product cost, freight, insurance, duty and handling", "Exchange rates and payment charges", "Setting a selling price and margin", "A landed cost calculator you can reuse"]),
      mod("iemi-m10", "Selling imported products", ["Where and how to sell", "Wholesale versus retail", "Stock, cash flow and reordering", "Marketing imported goods", "Growing from one product to many"]),
      mod("iemi-m11", "Export fundamentals and finding buyers", ["Export basics and what sells abroad", "Export documents and rules", "Finding international buyers", "Pricing and payment terms for export", "Shipping to the buyer"]),
      mod("iemi-m12", "Final project: your import or export business", ["Choosing your product and market", "Building the supplier and shipping plan", "Calculating costs and price", "Presenting your business plan"]),
    ],
  },
  {
    id: "procurement-sourcing",
    code: "PROC",
    title: "Procurement & Sourcing",
    categoryId: "trade-logistics",
    summary: "Buy the right goods and services, from the right suppliers, at the right price: from RFQs and negotiation to purchase orders and supplier management.",
    description:
      "A practical procurement course for people who buy for a business, an organisation or a project. You learn how to find and evaluate suppliers, run RFQs and tenders, negotiate, raise purchase orders, control cost, manage suppliers and source locally and internationally, ethically.",
    overview:
      "Procurement quietly decides how much a business spends and how well it runs. This course teaches the full process, from understanding a need to paying the supplier, with templates you can use at work and a practical procurement project to finish.",
    duration: "3 months",
    weeks: 12,
    level: "beginner-intermediate",
    price: 75000,
    skills: ["Supplier identification and evaluation", "RFQ and RFP", "Negotiation", "Purchase orders and processes", "Cost control", "Supplier relationship management"],
    prerequisites: ["No experience needed"],
    audience: ["Procurement and purchasing officers", "Store, admin and operations staff who buy for their company", "Business owners who want better supplier deals", "People moving into supply chain roles"],
    outcomes: ["Explain how the procurement cycle works", "Find and evaluate suppliers fairly", "Write RFQs and RFPs and compare bids", "Negotiate better prices and terms", "Raise purchase orders and follow the process", "Control cost and manage suppliers over time", "Source locally and internationally with integrity"],
    projectTitle: "A practical procurement project",
    projectSummary: "Source a real or realistic purchase end to end: the need, supplier shortlist, RFQ, evaluation, negotiation and purchase order.",
    modules: [
      mod("proc-m01", "Procurement fundamentals", ["What procurement is and why it matters", "Procurement versus purchasing", "The procurement cycle", "Roles and departments"]),
      mod("proc-m02", "Supplier identification", ["Understanding the requirement", "Where to find suppliers", "Long list to short list", "Local and international options"]),
      mod("proc-m03", "Vendor evaluation", ["Evaluation criteria", "Scoring suppliers", "Quality, delivery, price and risk", "Visits, references and trials"]),
      mod("proc-m04", "RFQ and RFP", ["When to use RFQ, RFP and tenders", "Writing a clear request", "Comparing and scoring bids", "Fairness and documentation"]),
      mod("proc-m05", "Negotiation", ["Preparing to negotiate", "Price, terms and total cost", "Tactics and how to respond to them", "Win-win agreements"]),
      mod("proc-m06", "Purchase orders and contracts", ["Purchase requisitions and approvals", "Writing a purchase order", "Contract basics", "Delivery, inspection and payment"]),
      mod("proc-m07", "Procurement processes and controls", ["Approval limits and segregation of duties", "Three-way matching", "Documentation and audit trails", "Procurement policies"]),
      mod("proc-m08", "Inventory coordination", ["Stock levels and reorder points", "Working with stores and warehouse", "Forecasting demand", "Avoiding stockouts and overstock"]),
      mod("proc-m09", "Cost control and savings", ["Total cost of ownership", "Spend analysis", "Reducing cost without hurting quality", "Reporting savings"]),
      mod("proc-m10", "Supplier relationship management", ["Performance reviews", "Developing key suppliers", "Handling disputes and delays", "Risk and backup suppliers"]),
      mod("proc-m11", "Local and international sourcing, and ethics", ["Local versus international sourcing", "Import costs and lead times", "Conflicts of interest and bribery", "Sustainable and ethical procurement"]),
      mod("proc-m12", "Final project: a practical procurement", ["Choosing the purchase", "Running the process", "Evaluating and negotiating", "Presenting your recommendation"]),
    ],
  },
  {
    id: "logistics-freight-forwarding",
    code: "LFF",
    title: "Logistics & Freight Forwarding",
    categoryId: "trade-logistics",
    summary: "Understand how goods move by road, sea and air, and how a freight forwarder plans, documents, clears and delivers a shipment.",
    description:
      "A practical course on logistics and freight forwarding for people who work in or want to enter shipping, clearing and forwarding, warehousing and transport. You learn the modes of transport, shipping documents, customs, freight rates, warehousing and how to run a forwarding business.",
    overview:
      "Every shipment is a chain of decisions: which mode, which route, which documents, who clears it and who delivers it. This course teaches the whole chain and how a freight forwarder coordinates it, ending with a complete shipment plan.",
    duration: "3 months",
    weeks: 12,
    level: "beginner-intermediate",
    price: 100000,
    skills: ["Transport modes and routes", "Shipping documentation", "Customs and clearing", "Freight rates and quotations", "Warehousing and distribution", "Running a forwarding business"],
    prerequisites: ["No experience needed"],
    audience: ["Aspiring freight forwarders and clearing agents", "Logistics and warehouse staff", "Importers and exporters who manage shipments", "Anyone planning a career in shipping and transport"],
    outcomes: ["Explain how cargo moves by road, rail, sea and air", "Choose the right mode and route for a shipment", "Prepare and check shipping documents", "Understand customs clearance and port processes", "Build a freight quotation", "Plan warehousing and last-mile delivery", "Understand how to set up and run a forwarding business"],
    projectTitle: "A complete shipment plan",
    projectSummary: "Plan a shipment from origin to delivery: mode, route, documents, customs, quotation and delivery.",
    modules: [
      mod("lff-m01", "Logistics fundamentals", ["What logistics covers", "The players in a shipment", "Logistics and trade terms", "Costs and service levels"]),
      mod("lff-m02", "Modes of transport", ["Road and rail", "Sea freight: containers, bulk, RoRo", "Air freight", "Multimodal and intermodal transport"]),
      mod("lff-m03", "The role of a freight forwarder", ["What forwarders do", "Forwarder, carrier, agent and broker", "Choosing and working with a forwarder", "Liability and insurance"]),
      mod("lff-m04", "Shipping documents", ["Commercial invoice and packing list", "Bill of lading and airway bill", "Certificates of origin and other certificates", "Document checks and common errors"]),
      mod("lff-m05", "Customs and clearing", ["How customs works", "HS codes, duty and valuation", "Clearing at ports and airports", "Bonded goods, transit and temporary import"]),
      mod("lff-m06", "Freight rates and quotations", ["How freight is priced", "Surcharges and extra charges", "Building a quotation", "Negotiating with carriers"]),
      mod("lff-m07", "Cargo handling, packing and container loading", ["Packing and marking", "Container types and loading", "Dangerous and special cargo", "Cargo insurance and claims"]),
      mod("lff-m08", "Warehousing and distribution", ["Warehouse operations", "Inventory handling", "Distribution networks", "Last-mile delivery"]),
      mod("lff-m09", "Technology and tracking", ["Tracking shipments", "Logistics software and spreadsheets", "Data for better decisions", "Communication with customers"]),
      mod("lff-m10", "Compliance, risk and problem solving", ["Regulations and compliance", "Delays, damage and disputes", "Risk management", "Customer service in logistics"]),
      mod("lff-m11", "Running a forwarding business", ["Business models for forwarders", "Licences and requirements in Nigeria", "Pricing and profit", "Finding and keeping customers"]),
      mod("lff-m12", "Final project: a complete shipment plan", ["Choosing a shipment", "Planning mode, route and documents", "Costing and quoting", "Presenting your plan"]),
    ],
  },
  {
    id: "supply-chain-management",
    code: "SCM",
    title: "Supply Chain Management",
    categoryId: "trade-logistics",
    summary: "See and improve the whole chain from raw materials to the customer: planning, sourcing, making, storing, delivering and measuring.",
    description:
      "A practical supply chain course covering demand planning, sourcing, inventory, operations, warehousing, transport, risk and performance. You learn how the parts of a supply chain connect and how to improve cost, speed and reliability.",
    overview:
      "A supply chain is only as strong as its weakest link. This course shows you the whole chain and the decisions that make it work, with spreadsheet exercises and a final project where you analyse and improve a real or realistic supply chain.",
    duration: "3 months",
    weeks: 12,
    level: "beginner-intermediate",
    price: 100000,
    skills: ["Demand planning and forecasting", "Inventory management", "Sourcing and supplier management", "Warehousing and transport", "Supply chain risk", "Performance measurement"],
    prerequisites: ["No experience needed", "Basic spreadsheet use helps"],
    audience: ["Supply chain, operations and planning staff", "Procurement and logistics professionals who want the bigger picture", "Business owners with stock and suppliers", "Graduates entering supply chain careers"],
    outcomes: ["Map a supply chain and find its weak points", "Forecast demand and plan stock", "Decide how much to order and when", "Work with suppliers and carriers", "Understand and reduce supply chain risk", "Measure performance with the right numbers", "Recommend improvements to a real chain"],
    projectTitle: "Analyse and improve a supply chain",
    projectSummary: "Map a supply chain, find its biggest problems with real or realistic numbers, and recommend improvements.",
    modules: [
      mod("scm-m01", "Supply chain fundamentals", ["What a supply chain is", "Flows of goods, information and money", "Supply chain strategy", "Careers and roles"]),
      mod("scm-m02", "Demand planning and forecasting", ["Why demand is hard to predict", "Simple forecasting methods", "Seasonality and trends", "Sales and operations planning"]),
      mod("scm-m03", "Sourcing and supplier management", ["Make or buy", "Choosing and developing suppliers", "Lead times and reliability", "Supplier risk"]),
      mod("scm-m04", "Inventory management", ["Why hold stock", "Reorder point and safety stock", "Economic order quantity", "ABC analysis", "Stock accuracy and cycle counts"]),
      mod("scm-m05", "Operations and production planning", ["Capacity and scheduling", "Lean basics and waste", "Quality management", "Bottlenecks"]),
      mod("scm-m06", "Warehousing and distribution", ["Warehouse layout and flow", "Picking, packing and dispatch", "Distribution network design", "Cross-docking and fulfilment"]),
      mod("scm-m07", "Transport and logistics", ["Choosing transport modes", "Route and load planning", "Transport cost and service", "Working with carriers"]),
      mod("scm-m08", "Supply chain technology and data", ["ERP and planning tools", "Tracking and visibility", "Using spreadsheets for supply chain analysis", "Data quality"]),
      mod("scm-m09", "Risk, resilience and sustainability", ["Types of supply chain risk", "Contingency and backup plans", "Resilience versus cost", "Sustainable supply chains"]),
      mod("scm-m10", "Performance measurement", ["KPIs: fill rate, on-time delivery, inventory turns", "Cost to serve", "Dashboards and reviews", "Continuous improvement"]),
      mod("scm-m11", "Global supply chains and trade", ["Global sourcing", "Trade, tariffs and lead times", "Currency and cost", "Managing across countries"]),
      mod("scm-m12", "Final project: analyse and improve a supply chain", ["Mapping the chain", "Finding the problems with data", "Recommending improvements", "Presenting your case"]),
    ],
  },

  /* ---------------------------------------------------------------- Professional Skills */
  {
    id: "project-management",
    code: "PMGT",
    title: "Project Management",
    categoryId: "professional-skills",
    summary: "Plan, run and finish projects on time and on budget: scope, schedule, cost, risk, people and stakeholders.",
    description:
      "A complete project management course for beginners and early-career managers. You learn how to start a project, define scope, build a schedule and budget, manage risk, quality and people, work in agile and traditional ways, track progress and close a project well.",
    overview:
      "Good project managers are in demand in every industry. This course teaches the full lifecycle with real tools and templates (charters, work breakdown structures, schedules, risk registers and status reports) and ends with a complete project plan. If you are new to the subject, start with the free Project Management Fundamentals course and continue here.",
    duration: "3 months",
    weeks: 12,
    level: "beginner-intermediate",
    price: 100000,
    skills: ["Project initiation and scope", "Scheduling and the critical path", "Budgeting and cost control", "Risk management", "Stakeholders and communication", "Agile and traditional methods"],
    prerequisites: ["No experience needed", "The free Project Management Fundamentals course is a good start"],
    audience: ["Aspiring and new project managers", "Team leads and coordinators who run projects", "Professionals preparing for project roles", "Business owners who run projects"],
    outcomes: ["Write a project charter and define scope", "Build a work breakdown structure and schedule", "Plan a budget and track cost", "Identify and manage risks", "Lead teams and communicate with stakeholders", "Run projects in agile and traditional ways", "Track progress, report and close a project"],
    projectTitle: "A complete project plan",
    projectSummary: "A full plan for a real or realistic project: charter, scope, schedule, budget, risks, communication and status reports.",
    modules: [
      mod("pmgt-m01", "Project management fundamentals", ["What a project is", "The project lifecycle", "The project manager's role", "Methodologies: traditional, agile and hybrid"]),
      mod("pmgt-m02", "Initiating a project", ["Business case and objectives", "Stakeholder identification", "The project charter", "Feasibility and go or no-go"]),
      mod("pmgt-m03", "Scope and planning", ["Requirements gathering", "Scope statement", "Work breakdown structure", "Planning documents"]),
      mod("pmgt-m04", "Schedule management", ["Activities and dependencies", "Estimating time", "Critical path method", "Gantt charts and schedule tools", "Resource levelling"]),
      mod("pmgt-m05", "Cost and budget management", ["Estimating cost", "Building a budget", "Cost control and contingency", "Earned value basics"]),
      mod("pmgt-m06", "Risk management", ["Identifying risks", "Qualitative and quantitative assessment", "Risk responses", "The risk register"]),
      mod("pmgt-m07", "Quality, procurement and change", ["Quality planning and control", "Buying for a project", "Change control", "Managing scope creep"]),
      mod("pmgt-m08", "People, teams and stakeholders", ["Building and leading a team", "Motivation and conflict", "Stakeholder engagement", "Communication planning and meetings"]),
      mod("pmgt-m09", "Agile and hybrid delivery", ["Agile values and Scrum", "Backlogs, sprints and reviews", "Kanban", "Choosing and mixing approaches"]),
      mod("pmgt-m10", "Execution, monitoring and reporting", ["Running the plan", "Tracking progress", "Status reports and dashboards", "Corrective action"]),
      mod("pmgt-m11", "Closing and learning", ["Handover and acceptance", "Closing contracts", "Lessons learned", "Celebrating and archiving"]),
      mod("pmgt-m12", "Final project: a complete project plan", ["Choosing your project", "Building the plan", "Presenting it", "Review"]),
    ],
  },
  {
    id: "human-resources-people-management",
    code: "HRPM",
    title: "Human Resources & People Management",
    categoryId: "professional-skills",
    summary: "Hire well, onboard, develop and manage people fairly, and handle the legal and human side of work.",
    description:
      "A practical course for HR officers, managers and business owners. You learn recruitment, onboarding, performance management, training, pay and benefits, employee relations, labour law basics in Nigeria, and how to build a healthy workplace.",
    overview:
      "People are the hardest and most important part of any organisation. This course teaches the HR cycle from workforce planning to exit, with templates you can use at once (job descriptions, interview guides, appraisal forms, policies) and a practical HR project to finish.",
    duration: "3 months",
    weeks: 12,
    level: "beginner-intermediate",
    price: 75000,
    skills: ["Recruitment and selection", "Onboarding and training", "Performance management", "Employee relations", "Labour law basics in Nigeria", "HR policies and records"],
    prerequisites: ["No experience needed"],
    audience: ["HR officers and assistants", "Managers and team leads", "Business owners who employ people", "Graduates entering HR"],
    outcomes: ["Plan staffing and write job descriptions", "Recruit, interview and select fairly", "Onboard and train new staff", "Run performance reviews that help", "Handle discipline, grievances and exits properly", "Understand pay, benefits and basic labour law", "Write and apply HR policies"],
    projectTitle: "An HR starter pack",
    projectSummary: "Job descriptions, a hiring plan, an onboarding checklist, an appraisal form and core HR policies for a real or realistic company.",
    modules: [
      mod("hrpm-m01", "HR fundamentals", ["The role of HR", "The employee lifecycle", "HR and line managers", "Ethics and confidentiality"]),
      mod("hrpm-m02", "Workforce planning and job design", ["Planning how many people you need", "Job analysis and job descriptions", "Organisation structures", "Budgeting for people"]),
      mod("hrpm-m03", "Recruitment and selection", ["Attracting candidates", "Screening CVs", "Interviewing and assessment", "References, offers and fairness"]),
      mod("hrpm-m04", "Onboarding and induction", ["The first 90 days", "Induction plans", "Probation", "Making new hires productive"]),
      mod("hrpm-m05", "Training and development", ["Finding training needs", "Training methods", "Career development", "Measuring training"]),
      mod("hrpm-m06", "Performance management", ["Setting goals", "Appraisals and feedback", "Coaching conversations", "Handling poor performance"]),
      mod("hrpm-m07", "Pay, benefits and recognition", ["Pay structures", "Benefits and pensions", "Rewards and recognition", "Payroll basics"]),
      mod("hrpm-m08", "Employee relations and discipline", ["Handling grievances", "Discipline step by step", "Conflict and mediation", "Termination and exit"]),
      mod("hrpm-m09", "Labour law and compliance in Nigeria", ["Employment contracts", "Working conditions, leave and notice", "Pension, NSITF and ITF basics", "Records and compliance"]),
      mod("hrpm-m10", "Culture, engagement and wellbeing", ["Building culture", "Engagement and retention", "Diversity and inclusion", "Health, safety and wellbeing"]),
      mod("hrpm-m11", "HR data, tools and policies", ["HR records and systems", "Key HR metrics", "Writing HR policies", "Using spreadsheets for HR"]),
      mod("hrpm-m12", "Final project: an HR starter pack", ["Choosing the company", "Building the pack", "Presenting it", "Review"]),
    ],
  },
  {
    id: "customer-service-client-management",
    code: "CSCM",
    title: "Customer Service & Client Management",
    categoryId: "professional-skills",
    summary: "Serve customers well in person, by phone and online: communication, complaints, relationships and keeping clients for the long term.",
    description:
      "A practical beginner course for customer-facing staff, front desk teams and anyone who manages clients. You learn communication, service standards, handling complaints, difficult people, managing client relationships and measuring service quality.",
    overview:
      "Customers remember how you made them feel. This course gives you the skills and scripts to serve customers well in every channel, handle problems calmly and build lasting client relationships, with a practical service improvement project to finish.",
    duration: "2 months",
    weeks: 8,
    level: "beginner",
    price: 50000,
    skills: ["Customer communication", "Handling complaints", "Client relationship management", "Service standards", "Phone and online service", "Measuring satisfaction"],
    prerequisites: ["No experience needed"],
    audience: ["Customer service and front desk staff", "Sales and support teams", "Small business owners who deal with clients", "Anyone starting a customer-facing job"],
    outcomes: ["Communicate clearly and warmly with customers", "Handle complaints and angry customers calmly", "Serve well by phone, WhatsApp, email and in person", "Manage client expectations and relationships", "Keep clients and win repeat business", "Measure and improve service quality"],
    projectTitle: "A service improvement plan",
    projectSummary: "Review a real or realistic customer service operation and write a plan to improve it, with scripts and standards.",
    modules: [
      mod("cscm-m01", "What great customer service is", ["Customers, clients and expectations", "Why service matters to a business", "Your role and attitude", "Professional behaviour"]),
      mod("cscm-m02", "Communication skills", ["Listening and questioning", "Clear, polite writing", "Tone and body language", "Cultural awareness"]),
      mod("cscm-m03", "Serving customers in every channel", ["In person and at the front desk", "Phone etiquette", "WhatsApp, email and social media", "Live chat and response times"]),
      mod("cscm-m04", "Handling complaints and difficult people", ["Why customers complain", "A step by step complaint process", "Staying calm with angry customers", "Saying no well", "Service recovery"]),
      mod("cscm-m05", "Client relationship management", ["Understanding client needs", "Setting and managing expectations", "Regular contact and follow-up", "Handling key clients"]),
      mod("cscm-m06", "Service standards and systems", ["Service standards and scripts", "Tickets, records and tools", "Working in a team", "Escalation"]),
      mod("cscm-m07", "Measuring and improving service", ["Satisfaction surveys and feedback", "Service metrics", "Learning from complaints", "Building loyalty"]),
      mod("cscm-m08", "Final project: a service improvement plan", ["Choosing a service to review", "Finding the problems", "Writing the plan and scripts", "Presenting it"]),
    ],
  },
  {
    id: "professional-office-administration",
    code: "POA",
    title: "Professional Office Administration",
    categoryId: "professional-skills",
    summary: "Run an office well: organise, schedule, communicate, file, manage documents and support a team with professional tools.",
    description:
      "A practical beginner course for office assistants, administrators and secretaries. You learn professional communication, time management, documents and records, Microsoft and Google office tools, meetings and travel, and how to support managers and teams.",
    overview:
      "An organised office is the backbone of any business. This course teaches the day-to-day skills of a professional administrator: managing the diary and the inbox, writing well, keeping records, using office tools and supporting meetings, with a practical office admin project to finish.",
    duration: "2 months",
    weeks: 8,
    level: "beginner",
    price: 50000,
    skills: ["Professional communication", "Time and diary management", "Records and filing", "Office software", "Meetings and travel", "Supporting a team"],
    prerequisites: ["No experience needed", "Basic computer use"],
    audience: ["Aspiring and new office administrators", "Receptionists and secretaries", "Executive and personal assistants", "Graduates preparing for office jobs"],
    outcomes: ["Communicate professionally in writing and in person", "Manage a diary, inbox and tasks", "Organise files and records, on paper and digital", "Use word processing, spreadsheet and email tools well", "Plan meetings, events and travel", "Support managers and teams with confidence"],
    projectTitle: "An office administration toolkit",
    projectSummary: "Templates, a filing system, a meeting pack and a weekly routine for a real or realistic office.",
    modules: [
      mod("poa-m01", "The professional administrator", ["The role of office administration", "Professional conduct and confidentiality", "Dress, behaviour and teamwork", "Ethics at work"]),
      mod("poa-m02", "Communication at work", ["Writing emails and letters", "Telephone and front desk", "Minutes, memos and reports", "Giving and receiving instructions"]),
      mod("poa-m03", "Time, tasks and diary management", ["Prioritising", "Managing a manager's diary", "Reminders and follow-up", "Handling interruptions"]),
      mod("poa-m04", "Records, filing and documents", ["Paper and digital filing", "Naming and organising files", "Confidential and sensitive records", "Archiving and retention"]),
      mod("poa-m05", "Office software", ["Word processing for professional documents", "Spreadsheets for lists and simple budgets", "Presentations", "Email, calendars and cloud storage"]),
      mod("poa-m06", "Meetings, events and travel", ["Planning and running meetings", "Agendas and minutes", "Organising events", "Booking travel and accommodation"]),
      mod("poa-m07", "Office management and supplies", ["Ordering and stock", "Working with vendors", "Petty cash and expenses", "Health, safety and equipment"]),
      mod("poa-m08", "Final project: an office administration toolkit", ["Choosing the office", "Building the toolkit", "Presenting it", "Review"]),
    ],
  },
  {
    id: "bookkeeping-small-business-finance",
    code: "BKP",
    title: "Bookkeeping & Small Business Finance",
    categoryId: "professional-skills",
    summary: "Keep proper books, read financial statements, manage cash and understand tax, so you always know how your business is doing.",
    description:
      "A practical course for small business owners, bookkeepers and anyone who wants to understand business money. You learn how to record transactions, keep a cashbook and ledgers, reconcile accounts, prepare basic statements, budget, manage cash and understand tax basics.",
    overview:
      "If you cannot see your numbers, you cannot run your business. This course teaches the practical bookkeeping process step by step, then how to read the statements and use them to make decisions, with spreadsheet tools and a set of books of your own to finish.",
    duration: "2 to 3 months",
    weeks: 10,
    level: "beginner-intermediate",
    price: 60000,
    skills: ["Double-entry bookkeeping", "Cashbooks and ledgers", "Reconciliation", "Financial statements", "Budgeting and cash flow", "Tax basics"],
    prerequisites: ["No experience needed", "Basic arithmetic"],
    audience: ["Small business owners who keep their own books", "Aspiring bookkeepers and accounts assistants", "Store and admin staff who handle money", "Freelancers and traders"],
    outcomes: ["Record every transaction correctly", "Keep a cashbook, ledgers and a trial balance", "Reconcile bank statements", "Prepare a profit and loss statement and a balance sheet", "Budget and manage cash flow", "Understand VAT, PAYE and company tax basics in Nigeria", "Use spreadsheets or software to keep books"],
    projectTitle: "A set of books for a small business",
    projectSummary: "Record a month of real or realistic transactions and prepare the trial balance, financial statements and a cash flow forecast.",
    modules: [
      mod("bkp-m01", "Why books matter: accounting basics", ["The purpose of bookkeeping", "Assets, liabilities, equity, income and expenses", "The accounting equation", "Cash and accrual basis"]),
      mod("bkp-m02", "Double-entry bookkeeping", ["Debits and credits", "The chart of accounts", "Journals and ledgers", "The trial balance"]),
      mod("bkp-m03", "Recording daily transactions", ["Sales and receipts", "Purchases and payments", "The cashbook and petty cash", "Invoices, receipts and documents"]),
      mod("bkp-m04", "Bank and account reconciliation", ["Bank reconciliation", "Customer and supplier accounts", "Finding and fixing errors", "Month-end routine"]),
      mod("bkp-m05", "Inventory, assets and adjustments", ["Stock records", "Fixed assets and depreciation", "Accruals and prepayments", "Bad debts"]),
      mod("bkp-m06", "Financial statements", ["The profit and loss statement", "The balance sheet", "The cash flow statement", "Reading and explaining the numbers"]),
      mod("bkp-m07", "Budgeting, cash flow and decisions", ["Budgets and forecasts", "Managing cash flow", "Break-even and margins", "Using the numbers to decide"]),
      mod("bkp-m08", "Tax and compliance in Nigeria", ["Taxes a small business meets", "VAT and PAYE basics", "Company income tax basics", "Keeping records for tax", "Working with an accountant"]),
      mod("bkp-m09", "Tools: spreadsheets and accounting software", ["Setting up books in a spreadsheet", "Accounting software overview", "Backups and security", "Good habits"]),
      mod("bkp-m10", "Final project: a set of books", ["Recording the transactions", "Preparing the statements", "Writing a short report", "Review"]),
    ],
  },
];

export const BUSINESS_COURSES: CourseDef[] = SPECS.map((s) => course(s));
