/**
 * Practice projects built on the fictional datasets in public/datasets.
 *
 * To add a project: add an entry to PRACTICE_PROJECTS (it gets its own page at /projects/<id>).
 * To add a dataset: generate its CSV files into public/datasets/<id>/, add it to DATASETS and describe
 * every column in DATA_DICTIONARY, then run `npm run datasets:meta`. `npm run test:content` checks that
 * every column is described and every SQL starter runs.
 */
import META from "./dataset-meta.json";

export type DatasetInfo = { id: string; name: string; description: string; files: string[] };

export const DATASETS: DatasetInfo[] = [
  {
    id: "logistics",
    name: "Harbourline Freight (logistics)",
    description: "A freight company's customers, shipments, routes, payments and staff, January 2025 to August 2026.",
    files: ["customers", "shipments", "routes", "payments", "employees"],
  },
  {
    id: "sales",
    name: "Kolanut Distribution (sales)",
    description:
      "An FMCG distributor's order lines from January 2025 to June 2026, with its 90 customers (shops, supermarkets and wholesalers across six regions) and 16 products. Prices rose in January 2026.",
    files: ["orders", "customers", "products"],
  },
  {
    id: "cleaning",
    name: "Kolanut customer export (messy)",
    description: "Kolanut's customer list as exported from its old system: duplicates, stray spaces, mixed capitals, three date formats and money stored as text.",
    files: ["customer_list_raw"],
  },
  {
    id: "hr",
    name: "Kolanut Distribution (HR)",
    description: "The distributor's 80 staff, their June 2026 attendance, and leave records since January 2025.",
    files: ["employees", "attendance", "leave"],
  },
  {
    id: "retail",
    name: "Voltline Electronics (retail, raw)",
    description:
      "An eight-store electronics chain's raw till export from January 2025 to June 2026, as the tills produced it: a duplicated upload, mixed date formats, inconsistent store names and test transactions. With stores, products, dated cost prices, monthly targets and stock-out records. Used in the Data Analyst Capstone.",
    files: ["sales_raw", "stores", "products", "cost_prices", "targets", "stockouts"],
  },
  {
    id: "agile",
    name: "Kolanut kiosk app (agile delivery)",
    description:
      "A Scrum team's board for Kolanut's kiosk ordering app, exported after six two-week sprints (to 22 May 2026): every story, spike and bug with its points, sprint, status and dates, and the sprints with their goals and commitments.",
    files: ["backlog", "sprints"],
  },
  {
    id: "process",
    name: "Harbourline import clearance (event log)",
    description:
      "Every import clearance Harbourline handled at Lagos port from January to June 2026, with an event log of each activity's start and end time. Includes a pre-arrival document checklist piloted from 1 May. Used in Process Improvement with BPMN and Lean.",
    files: ["cases", "events"],
  },
  {
    id: "rentals",
    name: "Lagos and Abuja rental listings",
    description: "2,400 apartment and house listings in 14 areas of Lagos and Abuja, listed between July 2025 and June 2026, with their features and annual rent. Includes missing sizes and a few rents typed with an extra zero. Used in Machine Learning Fundamentals.",
    files: ["listings"],
  },
  {
    id: "loans",
    name: "Ladder Microfinance (loans)",
    description: "5,000 small-business loans disbursed in 2024 and 2025, with the borrower's business, revenue, loan terms, repayment history and whether the loan defaulted. Used in Machine Learning Fundamentals.",
    files: ["loans"],
  },
  {
    id: "wallet",
    name: "Paystream mobile wallet (customers and transactions)",
    description: "1,500 customers of a mobile wallet and their 65,825 transactions from January 2025 to June 2026. A competitor launched in March 2026. Used in Feature Engineering and Model Evaluation.",
    files: ["customers", "transactions"],
  },
  {
    id: "experiments",
    name: "Paystream experiments",
    description: "Four of a mobile wallet's experiments from 2026: a signup-flow A/B test (12,000 users), a homepage banner test (daily counts), a transfer-fee test (8,000 users) and a state-by-state rollout of cash-out agents (weekly active users). Used in Experimentation and A/B Testing.",
    files: ["onboarding", "banner_daily", "fee_test", "rollout"],
  },
  {
    id: "demand",
    name: "Kolanut Lagos depot (daily demand)",
    description: "Daily units sold for six products at Kolanut's Lagos depot from July 2022 to June 2026, with promotions and prices, and a holiday calendar showing depot closures. Prices rose in January 2026. Used in Time Series Forecasting.",
    files: ["daily_sales", "holidays"],
  },
  {
    id: "llmops",
    name: "Paystream assistant in production (evaluation and safety)",
    description: "A 400-case regression suite with results for the live release and two candidates, 240 red-team attacks run with and without a guardrail, guardrail scores on 3,000 reviewed messages, four months of daily metrics, and the incident log. Used in LLM Evaluation and Safety in Production.",
    files: ["eval_cases", "eval_results", "redteam_attacks", "redteam_results", "guardrail_reviews", "daily_metrics", "incidents"],
  },
  {
    id: "agents",
    name: "Paystream support agent (tools and recorded runs)",
    description: "The accounts and transfers a support agent's tools read, 150 support requests labelled with the right action, and step-by-step recordings of two agent versions handling every request. Used in AI Agents and Tool Use.",
    files: ["accounts", "transfers", "requests", "runs", "steps"],
  },
  {
    id: "genai",
    name: "Paystream support (help centre and AI evaluations)",
    description: "Paystream's 25 help articles, 83 customer questions linked to the article that answers them, 900 labelled support tickets with the categories a small and a large model gave them, and human and judge grades for two versions of a help assistant. Used in Generative AI Engineering.",
    files: ["articles", "questions", "tickets", "answer_evals"],
  },
  {
    id: "legal",
    name: "Ashgrove Chambers (legal)",
    description: "A Lagos law firm's clients, matters, court hearings and invoices from 2024 to August 2026.",
    files: ["clients", "matters", "hearings", "invoices"],
  },
];

/** What each file and column means. Every column in every CSV must be described here. */
export const DATA_DICTIONARY: Record<string, Record<string, { about: string; columns: Record<string, string> }>> = {
  logistics: {
    customers: {
      about: "Companies that ship with Harbourline, one row per customer.",
      columns: {
        customer_id: "Unique customer number. Links to shipments.customer_id.",
        company_name: "Customer's company name.",
        industry: "The customer's industry, such as Electronics or Construction.",
        city: "City of the customer's main office.",
        country: "Nigeria, Ghana or Benin.",
        signup_date: "Date the customer opened an account.",
        account_manager_id: "Harbourline employee who manages the account. Links to employees.employee_id. Blank if unassigned.",
      },
    },
    shipments: {
      about: "Every shipment booked from January 2025 to August 2026, one row per shipment.",
      columns: {
        shipment_id: "Unique shipment number. Links to payments.shipment_id.",
        customer_id: "Customer who booked it. Links to customers.customer_id.",
        route_id: "Route used. Links to routes.route_id.",
        booking_date: "Date the shipment was booked.",
        ship_date: "Date it left the origin. Blank if it hasn't shipped yet or was cancelled.",
        delivery_date: "Date it arrived. Blank if not delivered.",
        status: "Delivered, In transit, Booked or Cancelled.",
        containers: "Number of containers (or equivalent units).",
        weight_kg: "Total weight in kilograms.",
        freight_charge: "Amount charged to the customer, in naira.",
      },
    },
    routes: {
      about: "The lanes Harbourline operates, one row per route.",
      columns: {
        route_id: "Unique route number.",
        origin: "Where shipments start.",
        destination: "Where shipments end.",
        mode: "Sea, Air or Road.",
        target_transit_days: "Promised door-to-door time in days. A delivery that takes longer is late.",
      },
    },
    payments: {
      about: "Customer payments against shipments. A shipment can have more than one payment, or none yet.",
      columns: {
        payment_id: "Unique payment number.",
        shipment_id: "Shipment being paid for. Links to shipments.shipment_id.",
        payment_date: "Date the money was received.",
        amount: "Amount paid, in naira.",
        method: "Card, Bank transfer or Cheque.",
      },
    },
    employees: {
      about: "Harbourline's staff.",
      columns: {
        employee_id: "Unique employee number.",
        full_name: "Employee's name.",
        role: "Job title, such as Account Manager or Customs Specialist.",
        team: "Sales, Operations, Customs or Finance.",
        hire_date: "Date they joined.",
        manager_id: "Their manager's employee_id. Blank for the most senior staff.",
      },
    },
  },
  sales: {
    orders: {
      about: "Every order line from January 2025 to June 2026. One order line is one product on one order.",
      columns: {
        order_id: "Unique order line number.",
        order_date: "Date of the order.",
        customer_id: "Customer who ordered. Links to customers.customer_id.",
        product_id: "Product ordered. Links to products.product_id.",
        quantity: "Cartons ordered.",
        unit_price: "Price per carton in naira, before discount. Prices rose in January 2026.",
        discount_pct: "Discount given on the line: 0, 5 or 10 (per cent).",
      },
    },
    customers: {
      about: "The shops, supermarkets and wholesalers Kolanut sells to.",
      columns: {
        customer_id: "Unique customer number.",
        customer_name: "Business name.",
        channel: "Wholesale, Supermarket or Kiosk.",
        region: "One of six sales regions, such as Lagos or North West.",
        city: "City or town.",
        sales_rep: "Kolanut sales rep who looks after the customer.",
        joined_date: "Date they became a customer.",
        credit_limit: "Maximum they can owe at any time, in naira.",
      },
    },
    products: {
      about: "Kolanut's 16 products. Each is sold by the carton.",
      columns: {
        product_id: "Unique product number.",
        product_name: "Product and pack size, for example Malt drink 330ml (24).",
        category: "Beverages, Snacks, Household or Personal care.",
        list_price: "Current list price per carton, in naira.",
      },
    },
  },
  cleaning: {
    customer_list_raw: {
      about: "Kolanut's customer list exported from an old system, errors and all. The clean version is sales/customers.csv.",
      columns: {
        "Customer Name": "Business name. Watch for extra spaces, different capitals and duplicates.",
        Region: "Sales region, written many ways: LAGOS, lagos, SW, South-West and so on.",
        City: "City or town, with inconsistent capitals and spacing.",
        Phone: "Phone number in several formats, with and without +234 and spaces.",
        "Date Joined": "Date they became a customer, in three formats: 2023-10-22, 22/10/2023 (day first) and 22-Oct-2023.",
        "Credit Limit": "Credit limit stored as text, sometimes with ₦, commas or .00. Some are blank.",
        Channel: "Wholesale, Supermarket or Kiosk.",
      },
    },
  },
  hr: {
    employees: {
      about: "Everyone who has worked at Kolanut, including people who have left.",
      columns: {
        employee_id: "Unique employee number.",
        full_name: "Employee's name.",
        department: "Finance, Operations, Customer Service, Human Resources, Sales or IT.",
        job_level: "Junior, Mid, Senior or Manager.",
        hire_date: "Date they joined.",
        exit_date: "Date they left. Blank if still employed.",
        monthly_salary: "Monthly salary in naira.",
        status: "Active or Resigned.",
      },
    },
    attendance: {
      about: "Daily attendance for June 2026, one row per employee per working day.",
      columns: {
        date: "Working day.",
        employee_id: "Links to employees.employee_id.",
        status: "Present, Late, Absent or On leave.",
        hours_worked: "Hours worked that day (0 when absent or on leave).",
      },
    },
    leave: {
      about: "Leave requests since January 2025.",
      columns: {
        leave_id: "Unique leave request number.",
        employee_id: "Links to employees.employee_id.",
        leave_type: "Annual, Sick or Compassionate.",
        start_date: "First day of leave.",
        end_date: "Last day of leave.",
        days: "Number of days requested.",
        approved: "Yes or No.",
      },
    },
  },
  legal: {
    clients: {
      about: "Ashgrove Chambers' clients.",
      columns: {
        client_id: "Unique client number.",
        client_name: "Client's name.",
        client_type: "Company or Individual.",
        onboarded_date: "Date they became a client.",
      },
    },
    matters: {
      about: "Legal matters (cases and pieces of work) the firm has handled.",
      columns: {
        matter_id: "Unique matter number.",
        client_id: "Links to clients.client_id.",
        matter_title: "Short description, such as Tenancy recovery.",
        practice_area: "Property, Corporate, Employment, Family, Intellectual property or Commercial litigation.",
        responsible_lawyer: "Lawyer in charge of the matter.",
        opened_date: "Date the matter was opened.",
        closed_date: "Date it was closed. Blank if still open or on hold.",
        status: "Open, Closed or On hold.",
      },
    },
    hearings: {
      about: "Court hearings for each matter.",
      columns: {
        hearing_id: "Unique hearing number.",
        matter_id: "Links to matters.matter_id.",
        hearing_date: "Date of the hearing.",
        court: "Court where it took place.",
        outcome: "Heard, Adjourned, Judgment delivered, Struck out, or Scheduled if it hasn't happened yet.",
      },
    },
    invoices: {
      about: "Invoices issued to clients.",
      columns: {
        invoice_id: "Unique invoice number.",
        matter_id: "Links to matters.matter_id.",
        issued_date: "Date the invoice was issued.",
        amount_ngn: "Invoice amount in naira.",
        status: "Paid, Outstanding or Overdue.",
        paid_date: "Date it was paid. Blank if unpaid.",
      },
    },
  },
  llmops: {
    eval_cases: {
      about: "The regression suite: one row per test case.",
      columns: {
        case_id: "Case ID.",
        category: "Topic, or Out of scope and Safety for cases the assistant must decline.",
        difficulty: "easy, medium or hard.",
        input: "The customer message used in the test.",
        expected_behaviour: "What a passing answer must do.",
      },
    },
    eval_results: {
      about: "One row per case per release.",
      columns: {
        release: "r1-live, r2-new-prompt or r3-small-model.",
        case_id: "Case tested.",
        passed: "1 if the answer met the expected behaviour.",
        input_tokens: "Tokens sent to the model.",
        output_tokens: "Tokens in the answer.",
        latency_ms: "Time to answer, in milliseconds.",
      },
    },
    redteam_attacks: {
      about: "Attacks written by the security team.",
      columns: {
        attack_id: "Attack ID.",
        technique: "Attack technique, such as Obfuscation or Role-play.",
        prompt: "The attack text.",
      },
    },
    redteam_results: {
      about: "Each attack run against each release, with the input guardrail off and on.",
      columns: {
        attack_id: "Attack run.",
        release: "Release attacked.",
        guardrail: "off or on.",
        succeeded: "1 if the attack achieved its goal.",
      },
    },
    guardrail_reviews: {
      about: "Production messages scored by the guardrail and reviewed by people.",
      columns: {
        message_id: "Message ID.",
        language: "English or Pidgin.",
        guardrail_score: "The guardrail's score from 0 to 1: higher means more likely harmful.",
        harmful: "1 if reviewers judged the message harmful.",
      },
    },
    daily_metrics: {
      about: "One row per day of the live assistant, May to August 2026.",
      columns: {
        date: "Day.",
        release: "Release live that day.",
        conversations: "Conversations handled.",
        thumbs_up: "Thumbs-up ratings.",
        thumbs_down: "Thumbs-down ratings.",
        handovers: "Conversations handed to a person.",
        refusals: "Conversations where the assistant refused to help.",
        p95_latency_ms: "95th percentile response time, in milliseconds.",
        graded_sample: "Conversations randomly sampled and graded by a support lead.",
        graded_correct: "Of those, how many were graded correct.",
      },
    },
    incidents: {
      about: "Incidents during the period.",
      columns: {
        incident_id: "Incident ID.",
        title: "What happened.",
        started: "Date it started.",
        detected: "Date it was detected.",
        resolved: "Date it was fixed.",
        how_detected: "How the team found out.",
        severity: "High or Medium.",
      },
    },
  },
  agents: {
    accounts: {
      about: "One row per Paystream account.",
      columns: {
        account_id: "Account ID, such as PS100150.",
        tier: "Verification tier: 1, 2 or 3.",
        status: "active, locked or frozen.",
        card_status: "none, active or frozen.",
        opened_date: "Date the account was opened.",
      },
    },
    transfers: {
      about: "One row per transfer over the two months before 15 September 2026.",
      columns: {
        transfer_id: "Transfer ID, such as TRF401805.",
        account_id: "Account that sent the transfer.",
        created_at: "Date and time the transfer was made (UTC).",
        amount_ngn: "Amount in naira.",
        destination: "Receiving bank, or Paystream user.",
        status: "successful, failed or pending.",
        debited: "1 if the sender's account was debited.",
        reversed_at: "When a failed transfer's money was returned. Blank if not reversed.",
        narration: "The note the sender typed. A few contain prompt injection attempts.",
      },
    },
    requests: {
      about: "Support requests sent to the agent, each labelled with the right action by a support lead.",
      columns: {
        request_id: "Request ID.",
        account_id: "The logged-in customer's account.",
        received_at: "Date and time the request arrived (UTC).",
        message: "The customer's message.",
        expected_action: "The right final action: answer, open_transfer_case, freeze_card, escalate_fraud, escalate_human or ask_for_details.",
      },
    },
    runs: {
      about: "One row per agent run: each request handled by v1 and by v2.",
      columns: {
        run_id: "Run ID: the request ID and the version.",
        request_id: "Request handled.",
        version: "v1 or v2.",
        steps: "Number of tool calls, including the final reply.",
        final_action: "What the agent did in the end. none if it stopped without replying.",
        stop_reason: "completed, or max_steps if the loop hit its limit.",
        input_tokens: "Input tokens across all steps.",
        output_tokens: "Output tokens across all steps.",
        seconds: "Total time for the run.",
      },
    },
    steps: {
      about: "One row per tool call in every run.",
      columns: {
        run_id: "Run the step belongs to.",
        step: "Step number within the run.",
        tool: "Tool the model called.",
        arguments: "Arguments, as JSON.",
        result: "ok, not_found or error.",
        input_tokens: "Input tokens sent for this step.",
        output_tokens: "Output tokens the model wrote at this step.",
        seconds: "Time taken by this step.",
      },
    },
  },
  genai: {
    articles: {
      about: "One row per help centre article.",
      columns: {
        article_id: "Article ID, such as KB005.",
        title: "Article title.",
        category: "Help centre section, such as Transfers or Cards.",
        body: "Article text.",
      },
    },
    questions: {
      about: "Customer questions for testing retrieval and answers.",
      columns: {
        question_id: "Question ID.",
        question: "The customer's question, as written.",
        relevant_article_id: "The article that answers it. Blank when the help centre doesn't answer the question.",
      },
    },
    tickets: {
      about: "One row per support ticket, with a person's label and two models' labels.",
      columns: {
        ticket_id: "Ticket ID.",
        created_date: "Date the ticket arrived.",
        text: "The customer's message. Some contain phone or account numbers, and a few contain prompt injection attempts.",
        true_category: "The category a support lead assigned.",
        small_model_category: "The category a small model chose.",
        large_model_category: "The category a large model chose.",
        input_tokens: "Tokens sent to the model for this ticket, including the prompt.",
      },
    },
    answer_evals: {
      about: "Graded answers from two versions of the help assistant to every question.",
      columns: {
        question_id: "Question answered.",
        system: "v1 no retrieval or v2 retrieval.",
        cited_article_id: "Article the answer cited. Blank if none.",
        human_grade: "A support lead's grade: Correct, Partly correct, Incorrect, Correctly refused, or Answered when it should refuse.",
        judge_grade: "The grade an LLM judge gave the same answer.",
      },
    },
  },
  demand: {
    daily_sales: {
      about: "One row per product per day at the Lagos depot.",
      columns: {
        date: "Day.",
        product: "Product name.",
        category: "Beverages, Snacks, Household or Personal care.",
        units: "Cases sold that day. Zero on days the depot was closed.",
        on_promotion: "1 if the product was on a price promotion that day.",
        price_ngn: "Selling price per case that day, in naira.",
      },
    },
    holidays: {
      about: "Public holidays from 2022 to 2026, and whether the depot closed.",
      columns: {
        date: "Date of the holiday.",
        holiday: "Holiday name, such as Eid al-Fitr or Christmas Day.",
        depot_closed: "1 if the depot was closed that day.",
      },
    },
  },
  experiments: {
    onboarding: {
      about: "One row per new user in the signup-flow test (old flow A against new flow B), May 2026.",
      columns: {
        user_id: "Unique user ID.",
        signup_date: "Date the user signed up and was assigned a variant.",
        variant: "A (old signup flow) or B (new flow), assigned at random.",
        platform: "Android or iOS.",
        acquisition_channel: "How the user arrived: Referral, Agent, Social ads or Organic.",
        region: "State of the user.",
        completed_kyc_7d: "1 if the user completed identity verification within 7 days of signup.",
        txns_first_14d: "Number of transactions in the first 14 days.",
        value_first_14d_ngn: "Total value of those transactions in naira.",
      },
    },
    banner_daily: {
      about: "Daily totals for the homepage banner test, June 2026, by variant.",
      columns: {
        date: "Day.",
        variant: "A (current homepage) or B (new banner).",
        users: "Users who saw that variant's homepage that day.",
        clicks: "Users who clicked the banner area.",
      },
    },
    fee_test: {
      about: "One row per existing user in the transfer-fee test: ₦10 (Control) against ₦25 (Higher fee), over 28 days.",
      columns: {
        user_id: "Unique user ID.",
        variant: "Control (₦10 per transfer) or Higher fee (₦25), assigned at random.",
        transfers_28d: "Transfers made in the 28 days.",
        fee_revenue_28d_ngn: "Transfer fees paid in the 28 days, in naira.",
        active_on_day_28: "1 if the user still had an active wallet on day 28.",
      },
    },
    rollout: {
      about: "Weekly active users by state for the first 26 weeks of 2026. Cash-out agents launched in Kano, Kaduna and Enugu from week 14.",
      columns: {
        state: "State.",
        week: "Week number of 2026.",
        week_start: "First day of the week.",
        agents_launched: "1 from the week agents were available in that state.",
        weekly_active_users: "Users with at least one transaction that week.",
      },
    },
  },
  wallet: {
    customers: {
      about: "One row per customer.",
      columns: {
        customer_id: "Unique customer ID. Links to transactions.customer_id.",
        signup_date: "Date the customer opened their wallet.",
        state: "State of residence.",
        age_band: "Age group.",
        acquisition_channel: "How the customer joined: Referral, Agent, Social ads or Organic.",
        kyc_tier: "Identity verification level, 1 (basic) to 3 (full). Higher tiers have higher limits.",
      },
    },
    transactions: {
      about: "One row per transaction attempt.",
      columns: {
        transaction_id: "Unique transaction ID, in date order.",
        customer_id: "Links to customers.customer_id.",
        transaction_date: "Date of the transaction.",
        type: "Transfer, Airtime, Bill payment, Card payment or Cash out.",
        amount_ngn: "Amount in naira.",
        status: "Success or Failed.",
      },
    },
  },
  rentals: {
    listings: {
      about: "One row per rental listing.",
      columns: {
        listing_id: "Unique listing ID.",
        city: "Lagos or Abuja.",
        area: "Neighbourhood, such as Yaba, Ikoyi or Gwarinpa.",
        property_type: "Self-contain, Mini flat, Flat, Terrace or Duplex.",
        bedrooms: "Number of bedrooms.",
        bathrooms: "Number of bathrooms.",
        size_sqm: "Floor area in square metres. Blank when the agent didn't give it.",
        serviced: "Yes if service charges cover cleaning, security and facilities.",
        furnished: "Yes if furnished.",
        power: "Prepaid meter, Prepaid meter and generator, or 24-hour power.",
        parking_spaces: "Number of parking spaces.",
        year_built: "Year the building was completed.",
        listed_date: "Date the listing appeared.",
        annual_rent_ngn: "Asking rent per year in naira. A few have a typing error.",
      },
    },
  },
  loans: {
    loans: {
      about: "One row per loan, with whether it defaulted.",
      columns: {
        loan_id: "Unique loan ID.",
        disbursed_date: "Date the loan was paid out.",
        region: "State or territory of the business.",
        business_type: "The borrower's business, such as Retail shop or Food vendor.",
        borrower_age: "Borrower's age in years at application.",
        years_in_business: "How long the business has been running, in whole years.",
        monthly_revenue_ngn: "Average monthly revenue declared on the application.",
        loan_amount_ngn: "Amount lent in naira.",
        term_months: "Length of the loan in months.",
        interest_rate_monthly_pct: "Interest rate per month, in percent.",
        previous_loans: "Number of earlier loans with Ladder.",
        previous_late_payments: "Late payments across those earlier loans.",
        group_loan: "Yes if part of a group loan, where borrowers guarantee each other.",
        has_guarantor: "Yes if an individual guarantor signed for the loan.",
        mobile_money_txns_per_month: "Average mobile money transactions per month on the business account.",
        defaulted: "1 if the loan defaulted, 0 if it was repaid.",
      },
    },
  },
  process: {
    cases: {
      about: "One row per import clearance (a shipment of one or more containers).",
      columns: {
        case_id: "Unique clearance ID, such as CLR-0042. Links to events.case_id.",
        importer_type: "The customer's business: Manufacturer, Retailer, Pharmaceutical, Construction or Electronics.",
        containers: "Number of containers in the shipment.",
        arrival_datetime: "When the vessel arrived and the containers were discharged (YYYY-MM-DD HH:MM).",
        docs_complete_on_arrival: "Yes if the customer's documents were complete when first checked; No if corrections were needed.",
        customs_channel: "Green (no inspection), Yellow (document review by customs) or Red (physical inspection).",
        checklist_pilot: "Yes for clearances from 1 May 2026, when documents were checked before arrival with a checklist.",
        released_datetime: "When the containers were released from the port.",
        delivered_datetime: "When they were delivered to the customer.",
        demurrage_ngn: "Demurrage charged: ₦45,000 per container per day at port after 3 free days.",
      },
    },
    events: {
      about: "The event log: every activity in every clearance, with its start and end time.",
      columns: {
        case_id: "Links to cases.case_id.",
        activity: "What was done, such as Check documents or Physical inspection.",
        team: "Who did it: Documentation, Customs broker, Customs, Finance, Terminal or Haulage.",
        start_time: "When the activity started (YYYY-MM-DD HH:MM).",
        end_time: "When it finished.",
      },
    },
  },
  agile: {
    backlog: {
      about: "Every item on the team's board: stories, a spike and bugs, as exported on 22 May 2026.",
      columns: {
        item_id: "Unique item ID, such as KOA-121.",
        type: "Story, Spike or Bug.",
        title: "Short title of the item.",
        epic: "The epic (feature area) it belongs to.",
        release: "MVP (needed for the pilot) or Later.",
        points: "Story points estimated by the team. Blank for bugs.",
        created_date: "Date the item was added to the backlog.",
        sprint: "Sprint the item was planned into (or found in, for bugs). Blank if not yet planned.",
        status: "To do, In progress or Done.",
        started_date: "Date work started. Blank if not started.",
        done_date: "Date the item met the definition of done. Blank if not done.",
      },
    },
    sprints: {
      about: "The team's two-week sprints.",
      columns: {
        sprint: "Sprint number.",
        start_date: "First day of the sprint.",
        end_date: "Last working day of the sprint.",
        goal: "The sprint goal.",
        committed_points: "Story points the team committed to at sprint planning. Blank for sprints not yet planned.",
        status: "Closed, Planned or Future.",
      },
    },
  },
  retail: {
    sales_raw: {
      about: "Every line of every till transaction, exactly as the stores' tills exported it. Not cleaned: profile it before you use it.",
      columns: {
        txn_id: "Transaction ID. The first three letters are the store code (see stores.store_code). A transaction can have several lines.",
        line_no: "Line number within the transaction.",
        txn_date: "Date of the transaction, as exported. Most stores use YYYY-MM-DD; check them all.",
        txn_time: "Time of the transaction (24-hour HH:MM).",
        branch: "Store name as typed into each till's settings. Not consistent.",
        product_code: "Product sold. Links to products.product_code.",
        qty: "Quantity. Negative for a return.",
        unit_price: "Selling price per unit in naira, before discount.",
        discount: "Discount on the line in naira (negative on a return of a discounted item).",
        payment_method: "Cash, Card, Transfer or Instalment.",
      },
    },
    stores: {
      about: "Voltline's eight stores.",
      columns: {
        store_id: "Unique store number. Links to targets and stockouts.",
        store_code: "Three-letter code used at the start of every txn_id.",
        store_name: "The store's official name.",
        city: "City.",
        opened_date: "Date the store opened.",
        floor_area_sqm: "Sales floor area in square metres.",
        manager: "Store manager.",
      },
    },
    products: {
      about: "The 22 products Voltline sells, with current (2026) list prices.",
      columns: {
        product_code: "Unique product code.",
        product_name: "Product name.",
        category: "Phones, Laptops, Accessories, Solar & power or Home appliances.",
        brand: "Brand.",
        list_price: "Current list price in naira (from January 2026). 2025 sales were at lower prices.",
      },
    },
    cost_prices: {
      about: "What Voltline pays for each product, and the date each cost applies from.",
      columns: {
        product_code: "Links to products.product_code.",
        effective_from: "The cost applies to sales on or after this date, until the next row for the same product.",
        unit_cost: "Cost per unit in naira.",
      },
    },
    targets: {
      about: "Monthly net-sales targets for each store, set at the start of each year.",
      columns: {
        store_id: "Links to stores.store_id.",
        month: "Month, as YYYY-MM.",
        net_sales_target: "Target net sales for the store that month, in naira.",
      },
    },
    stockouts: {
      about: "Periods when a store had run out of a product.",
      columns: {
        store_id: "Links to stores.store_id.",
        product_code: "Links to products.product_code.",
        out_from: "First day out of stock.",
        back_in: "First day back in stock.",
      },
    },
  },
};

export type ColumnMeta = { name: string; type: "number" | "date" | "text"; missing: number; distinct: number; min?: number | string; max?: number | string };
export type FileMeta = { rows: number; bytes: number; columns: ColumnMeta[]; preview: string[][] };
export type DatasetMeta = { zipBytes: number; files: Record<string, FileMeta> };

/** Rows, sizes, column types and previews, generated from the CSV files by scripts/dataset-meta.mjs. */
export const DATASET_META = META as unknown as Record<string, DatasetMeta>;

export type Tool = "SQL" | "Excel" | "Power BI" | "Python";
export const TOOLS: Tool[] = ["SQL", "Excel", "Power BI", "Python"];

export type Starter = { tool: Tool; title: string; language?: "sql" | "python"; code?: string; steps?: string[] };

export type CoverPattern = "chevron" | "bars" | "waves" | "grid" | "diagonal" | "dots";

export type PracticeProject = {
  /** Also the page address: /projects/<id>. */
  id: string;
  title: string;
  /** One sentence for cards and search results. */
  summary: string;
  company: string;
  industry: string;
  level: "Beginner" | "Intermediate";
  /** Rough time to answer every question and write up the findings. */
  hours: number;
  skills: Tool[];
  dataset: string;
  cover: { pattern: CoverPattern; bg: string; fg: string };
  /** The business background, one paragraph per entry. */
  context: string[];
  /** What the manager is asking for. */
  brief: string;
  questions: string[];
  deliverables: string[];
  approach: string[];
  starters: Starter[];
  /** Courses that teach the skills, first one is the main one. */
  courseSlugs: string[];
  /** Kept for the course pages: the course whose lessons and final project use this dataset. */
  courseSlug?: string;
  updated: string;
};

const BASE = "https://academy.cloudtechanalytics.com/datasets";

export const PRACTICE_PROJECTS: PracticeProject[] = [
  {
    id: "logistics-operations",
    title: "Logistics Operations Analysis",
    summary: "Review a freight company's year: who ships the most, which routes run late, and what customers still owe.",
    company: "Harbourline Freight",
    industry: "Logistics",
    level: "Intermediate",
    hours: 4,
    skills: ["SQL", "Excel", "Power BI", "Python"],
    dataset: "logistics",
    cover: { pattern: "chevron", bg: "#1f3a5f", fg: "#2a9d8f" },
    context: [
      "Harbourline Freight moves containers and air cargo into West Africa, mainly through Lagos, for manufacturers, retailers and pharmaceutical companies in Nigeria, Ghana and Benin.",
      "The business has grown quickly, but the operations director suspects some routes regularly miss their promised transit times, and the finance team says too much money is still owed on delivered shipments. Nobody has looked at the whole picture in one place.",
    ],
    brief: "The operations director wants a short review of the last 20 months ahead of the annual planning meeting: who the biggest customers are, how volume has moved, which routes are unreliable, and where unpaid revenue is sitting.",
    questions: [
      "Who are the ten highest-volume customers?",
      "How did monthly shipment volume change?",
      "Which routes are busiest, and how reliable are they?",
      "How much revenue is still unpaid, and by whom?",
    ],
    deliverables: [
      "A one-page summary with your three most important findings and a recommendation for each.",
      "Your queries, workbook or notebook, so someone else can check the numbers.",
      "Optional: a one-page dashboard showing volume, on-time delivery and unpaid revenue.",
    ],
    approach: [
      "Look at each file and how they link: shipments connect customers, routes and payments.",
      "Decide what counts: exclude cancelled shipments from volume, and use delivered shipments with both dates for transit time.",
      "Transit time is delivery_date minus ship_date. A shipment is late when that is more than the route's target_transit_days.",
      "Unpaid revenue is the freight charge minus everything paid against the shipment.",
      "Write up the findings in plain language before you build any charts.",
    ],
    starters: [
      {
        tool: "SQL",
        title: "Top customers by shipments",
        language: "sql",
        code: `SELECT c.company_name,
       COUNT(*) AS shipments,
       SUM(s.containers) AS containers
FROM shipments s
JOIN customers c ON c.customer_id = s.customer_id
WHERE s.status <> 'Cancelled'
GROUP BY c.company_name
ORDER BY shipments DESC
LIMIT 10;`,
      },
      {
        tool: "Python",
        title: "Late deliveries by route",
        language: "python",
        code: `import pandas as pd

base = "${BASE}/logistics/"
shipments = pd.read_csv(base + "shipments.csv", parse_dates=["booking_date", "ship_date", "delivery_date"])
routes = pd.read_csv(base + "routes.csv")

delivered = shipments[shipments["status"] == "Delivered"].merge(routes, on="route_id")
delivered["transit_days"] = (delivered["delivery_date"] - delivered["ship_date"]).dt.days
delivered["late"] = delivered["transit_days"] > delivered["target_transit_days"]

delivered.groupby(["origin", "destination"])["late"].mean().sort_values(ascending=False).head(10)`,
      },
      {
        tool: "Excel",
        title: "In Excel",
        steps: [
          "Open shipments.csv and format it as a Table (Ctrl + T).",
          "Add customer names with XLOOKUP from customers.csv.",
          "Insert a PivotTable: company_name in Rows, count of shipment_id in Values, sorted largest to smallest.",
          "Filter status to exclude Cancelled.",
        ],
      },
    ],
    courseSlugs: ["sql-for-data-analysis", "advanced-sql", "power-bi-fundamentals", "python-for-data-analytics"],
    courseSlug: "sql-for-data-analysis",
    updated: "2026-09-30",
  },
  {
    id: "sales-performance",
    title: "Sales Performance Analysis",
    summary: "Find out which products, regions and customer channels drive a distributor's sales, and what its discounts really cost.",
    company: "Kolanut Distribution",
    industry: "FMCG distribution",
    level: "Beginner",
    hours: 3,
    skills: ["Excel", "Power BI", "Python", "SQL"],
    dataset: "sales",
    cover: { pattern: "bars", bg: "#264d3b", fg: "#e9c46a" },
    context: [
      "Kolanut Distribution sells drinks, snacks, household and personal care products by the carton to wholesalers, supermarkets and kiosks across six regions of Nigeria.",
      "Each sales rep looks after their own customers, and discounts of 5% or 10% are common to win bigger orders. Management can see total sales each month but not what's behind them.",
    ],
    brief: "The sales director wants to understand where revenue comes from and whether discounts are paying for themselves, before setting next year's targets.",
    questions: [
      "What are monthly sales, and how do they trend?",
      "Which product categories and regions sell the most?",
      "How do wholesale, supermarket and kiosk customers differ?",
      "How much revenue is given away in discounts?",
    ],
    deliverables: [
      "A short report or slide deck answering the four questions, with one chart each.",
      "A recommendation on discounts, backed by your numbers.",
      "Your workbook, dashboard or notebook.",
    ],
    approach: [
      "Revenue for a line is quantity × unit_price × (1 − discount_pct / 100).",
      "Bring in category from products and channel and region from customers.",
      "The discount given away on a line is quantity × unit_price × discount_pct / 100.",
      "Compare like with like: the data runs from January 2025 to June 2026, so 2026 is only half a year.",
    ],
    starters: [
      {
        tool: "Python",
        title: "Monthly revenue",
        language: "python",
        code: `import pandas as pd

orders = pd.read_csv("${BASE}/sales/orders.csv", parse_dates=["order_date"])
orders["revenue"] = orders["quantity"] * orders["unit_price"] * (1 - orders["discount_pct"] / 100)

monthly = orders.groupby(orders["order_date"].dt.to_period("M"))["revenue"].sum()
monthly.plot(title="Monthly revenue (₦)")`,
      },
      {
        tool: "SQL",
        title: "Revenue by category",
        language: "sql",
        code: `SELECT p.category,
       ROUND(SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0))) AS revenue
FROM orders o
JOIN products p ON p.product_id = o.product_id
GROUP BY p.category
ORDER BY revenue DESC;`,
      },
      {
        tool: "Power BI",
        title: "In Power BI",
        steps: [
          "Get data → Text/CSV and load all three files.",
          "In Model view, relate orders to products (product_id) and customers (customer_id).",
          "Create a measure: Revenue = SUMX(orders, orders[quantity] * orders[unit_price] * (1 - orders[discount_pct] / 100)).",
          "Build a line chart of Revenue by month and a bar chart by category.",
        ],
      },
    ],
    courseSlugs: ["excel-for-data-analysis", "power-bi-fundamentals", "power-bi-dax", "python-for-data-analytics"],
    courseSlug: "excel-for-data-analysis",
    updated: "2026-09-30",
  },
  {
    id: "price-rise-impact",
    title: "Price Rise Impact",
    summary: "Kolanut raised prices in January 2026. Did customers buy less, and did the rise pay off?",
    company: "Kolanut Distribution",
    industry: "FMCG distribution",
    level: "Intermediate",
    hours: 3,
    skills: ["Python", "Excel", "SQL"],
    dataset: "sales",
    cover: { pattern: "waves", bg: "#6d2e46", fg: "#f4a261" },
    context: [
      "Costs rose sharply in late 2025, so Kolanut increased its carton prices in January 2026. Sales reps warned that customers, especially kiosks, would buy less or switch to cheaper suppliers.",
      "Six months later, the board wants to know whether the price rise helped or hurt.",
    ],
    brief: "Compare the first half of 2026 with the first half of 2025 and tell the board what happened to prices, volumes and revenue, and where the effect was strongest.",
    questions: [
      "How much did the average price per carton rise, overall and by category?",
      "Did the number of cartons sold go up or down compared with the same months last year?",
      "Which products, channels or regions reacted most?",
      "Overall, did revenue grow, and how much of that came from price rather than volume?",
    ],
    deliverables: [
      "A one-page memo to the board with your answer and the evidence.",
      "A chart comparing January–June 2025 with January–June 2026.",
      "Your notebook or workbook.",
    ],
    approach: [
      "Compare January–June 2026 with January–June 2025, not with the whole of 2025. Seasons matter.",
      "Average price is total revenue before discount ÷ total cartons, not a plain average of unit_price.",
      "Split the change in revenue into a price effect and a volume effect.",
      "Be careful with small groups: a big percentage change on a few cartons can mislead.",
    ],
    starters: [
      {
        tool: "Python",
        title: "First half of each year",
        language: "python",
        code: `import pandas as pd

orders = pd.read_csv("${BASE}/sales/orders.csv", parse_dates=["order_date"])
h1 = orders[orders["order_date"].dt.month <= 6]

h1.groupby(h1["order_date"].dt.year).agg(
    order_lines=("order_id", "count"),
    cartons=("quantity", "sum"),
    avg_price=("unit_price", "mean"),
)`,
      },
      {
        tool: "SQL",
        title: "First half of each year",
        language: "sql",
        code: `SELECT strftime('%Y', order_date) AS year,
       COUNT(*) AS order_lines,
       SUM(quantity) AS cartons,
       ROUND(AVG(unit_price)) AS avg_price
FROM orders
WHERE CAST(strftime('%m', order_date) AS INTEGER) <= 6
GROUP BY year;`,
      },
    ],
    courseSlugs: ["python-for-data-analytics", "excel-for-data-analysis"],
    updated: "2026-09-30",
  },
  {
    id: "customer-data-cleanup",
    title: "Customer Data Clean-up",
    summary: "Turn a messy customer export into a clean, reliable list: duplicates, mixed formats, stray spaces and money stored as text.",
    company: "Kolanut Distribution",
    industry: "FMCG distribution",
    level: "Beginner",
    hours: 2,
    skills: ["Excel", "Python", "Power BI"],
    dataset: "cleaning",
    cover: { pattern: "grid", bg: "#334155", fg: "#7dd3fc" },
    context: [
      "Kolanut is moving to a new sales system. Before its customer list can be imported, it has to be cleaned. The export from the old system has been typed by different people over several years.",
      "Some customers appear more than once, each region is written several different ways, dates come in three formats and credit limits are stored as text.",
    ],
    brief: "Produce a clean customer list with one row per customer and consistent, correctly typed columns, and a short log of what you changed so the IT team can trust it.",
    questions: [
      "How many rows are there, and how many real customers once duplicates are removed?",
      "How many different ways is each region written, and what should the standard names be?",
      "Which dates are in which format, and what is each one as a real date?",
      "Which credit limits are missing, and what are the rest as numbers?",
    ],
    deliverables: [
      "A clean file with one row per customer and these columns: name, region, city, phone, date joined, credit limit, channel.",
      "A cleaning log: each problem you found, how many rows it affected, and what you did.",
      "Optional: compare your result with sales/customers.csv, the answer key.",
    ],
    approach: [
      "Never edit the raw file. Work on a copy or in Power Query, so every step can be repeated.",
      "Trim spaces and fix capitals before looking for duplicates, or the duplicates won't match.",
      "Map every region spelling (SW, South-West, south west…) to one of the six standard names.",
      "Dates like 22/10/2023 are day first. Convert all three formats to real dates.",
      "Remove ₦, commas and .00 from credit limits, then convert to numbers. Leave blanks as blanks and note them.",
    ],
    starters: [
      {
        tool: "Python",
        title: "First cleaning steps",
        language: "python",
        code: `import pandas as pd

raw = pd.read_csv("${BASE}/cleaning/customer_list_raw.csv", dtype=str)
df = raw.copy()

df["Customer Name"] = df["Customer Name"].str.strip().str.replace(r"\\s+", " ", regex=True).str.title()
df["Credit Limit"] = pd.to_numeric(df["Credit Limit"].str.replace(r"[₦,\\s]", "", regex=True), errors="coerce")
df["Date Joined"] = pd.to_datetime(df["Date Joined"], format="mixed", dayfirst=True)
df = df.drop_duplicates(subset="Customer Name")

print(len(raw), "rows before,", len(df), "after")`,
      },
      {
        tool: "Excel",
        title: "In Excel with Power Query",
        steps: [
          "Data → From Text/CSV → customer_list_raw.csv → Transform Data.",
          "Select the text columns → Transform → Format → Trim, then Capitalize Each Word.",
          "Use Replace Values on Region to map each spelling to the standard name.",
          "Change Date Joined to Date using Locale → English (United Kingdom) for day-first dates.",
          "Remove Duplicates on Customer Name, then Close & Load.",
        ],
      },
    ],
    courseSlugs: ["excel-for-data-analysis", "python-for-data-analytics"],
    updated: "2026-09-30",
  },
  {
    id: "law-firm-operations",
    title: "Law Firm Operations Analysis",
    summary: "Look at a Lagos law firm's workload and cash: open matters by practice area, how often hearings are adjourned, and overdue invoices.",
    company: "Ashgrove Chambers",
    industry: "Legal services",
    level: "Intermediate",
    hours: 4,
    skills: ["SQL", "Power BI", "Excel"],
    dataset: "legal",
    cover: { pattern: "diagonal", bg: "#2b2d42", fg: "#c9a227" },
    context: [
      "Ashgrove Chambers is a Lagos law firm working for companies and individuals across property, corporate, employment, family, intellectual property and commercial litigation matters.",
      "The managing partner feels the lawyers are stretched, that too many hearings are adjourned, and that clients are slow to pay, but has no figures to prove it.",
    ],
    brief: "Build the evidence for the partners' meeting: workload by practice area and lawyer, how often hearings go ahead, and which clients owe the firm money.",
    questions: [
      "How many matters are open per practice area and lawyer?",
      "What share of hearings end in an adjournment?",
      "Which clients have the most outstanding or overdue invoices?",
      "How long do matters take to close?",
    ],
    deliverables: [
      "A dashboard or one-page report for the partners.",
      "A list of the ten clients who owe the most, with amounts and how long overdue.",
      "Your queries or model.",
    ],
    approach: [
      "Matters link clients to hearings and invoices through matter_id.",
      "Leave Scheduled hearings out of the adjournment rate: they haven't happened yet.",
      "Time to close is closed_date minus opened_date, for closed matters only.",
      "Outstanding and Overdue are both unpaid; overdue ones are more urgent.",
    ],
    starters: [
      {
        tool: "SQL",
        title: "Adjournment rate by court",
        language: "sql",
        code: `SELECT court,
       COUNT(*) AS hearings,
       SUM(outcome = 'Adjourned') AS adjourned,
       ROUND(100.0 * SUM(outcome = 'Adjourned') / COUNT(*), 1) AS adjourned_pct
FROM hearings
WHERE outcome <> 'Scheduled'
GROUP BY court
ORDER BY adjourned_pct DESC;`,
      },
      {
        tool: "Power BI",
        title: "In Power BI",
        steps: [
          "Load all four files and relate them on client_id and matter_id.",
          "Create a measure: Adjournment rate = DIVIDE(CALCULATE(COUNTROWS(hearings), hearings[outcome] = \"Adjourned\"), CALCULATE(COUNTROWS(hearings), hearings[outcome] <> \"Scheduled\")).",
          "Build a matrix of open matters by practice_area and responsible_lawyer.",
          "Add a table of unpaid invoices by client_name.",
        ],
      },
    ],
    courseSlugs: ["power-bi-fundamentals", "sql-for-data-analysis", "data-modelling", "business-analysis-fundamentals"],
    courseSlug: "power-bi-fundamentals",
    updated: "2026-09-30",
  },
  {
    id: "employee-analytics",
    title: "Employee Analytics",
    summary: "Analyse attendance, lateness and leave across departments, and what staff turnover looks like.",
    company: "Kolanut Distribution",
    industry: "Human resources",
    level: "Beginner",
    hours: 3,
    skills: ["Excel", "SQL", "Python"],
    dataset: "hr",
    cover: { pattern: "dots", bg: "#4a3f6b", fg: "#f2a7c3" },
    context: [
      "Kolanut Distribution has six departments, and 80 people have worked there since it started keeping records. The HR manager has noticed more lateness in some teams and has had several resignations, but decisions so far have been based on impressions.",
      "HR has June 2026 attendance, leave records since January 2025, and a list of everyone who has worked at the company.",
    ],
    brief: "Prepare an HR review for the management team: where lateness and absence are highest, how leave is used, who is leaving, and how pay compares across levels.",
    questions: [
      "Which departments have the highest lateness and absence rates?",
      "How much leave is taken, by type and department?",
      "What is the resignation rate by department and job level?",
      "How does pay vary by level?",
    ],
    deliverables: [
      "A short HR report with a chart for each question.",
      "Two or three recommendations the management team could act on.",
      "Your workbook, queries or notebook.",
    ],
    approach: [
      "Attendance links to employees on employee_id; add department and level before summarising.",
      "Lateness rate is Late days ÷ all attendance rows for the department.",
      "Resignation rate is Resigned ÷ everyone who has worked in the department.",
      "Use approved leave only when measuring leave taken.",
    ],
    starters: [
      {
        tool: "SQL",
        title: "Lateness and absence by department",
        language: "sql",
        code: `SELECT e.department,
       COUNT(*) AS staff_days,
       ROUND(100.0 * SUM(a.status = 'Late') / COUNT(*), 1) AS late_pct,
       ROUND(100.0 * SUM(a.status = 'Absent') / COUNT(*), 1) AS absent_pct
FROM attendance a
JOIN employees e ON e.employee_id = a.employee_id
GROUP BY e.department
ORDER BY late_pct DESC;`,
      },
      {
        tool: "Python",
        title: "Resignation rate by department",
        language: "python",
        code: `import pandas as pd

employees = pd.read_csv("${BASE}/hr/employees.csv")
rate = employees.groupby("department")["status"].apply(lambda s: (s == "Resigned").mean() * 100)
rate.round(1).sort_values(ascending=False)`,
      },
    ],
    courseSlugs: ["data-analytics-foundations", "excel-for-data-analysis", "sql-for-data-analysis"],
    courseSlug: "data-analytics-foundations",
    updated: "2026-09-30",
  },
];

export const findProject = (id: string | undefined) => PRACTICE_PROJECTS.find((p) => p.id === id);

export const datasetUrl = (dataset: string, file: string) => `/datasets/${dataset}/${file}.csv`;
export const datasetZipUrl = (dataset: string) => `/datasets/${dataset}.zip`;

/** Totals for a dataset: files, rows and size of the CSV files. */
export function datasetTotals(id: string) {
  const files = Object.values(DATASET_META[id]?.files ?? {});
  return { files: files.length, rows: files.reduce((n, f) => n + f.rows, 0), bytes: files.reduce((n, f) => n + f.bytes, 0) };
}

export const formatBytes = (b: number) => (b < 1024 ? `${b} B` : b < 1024 * 1024 ? `${Math.round(b / 1024)} kB` : `${(b / 1024 / 1024).toFixed(1)} MB`);
