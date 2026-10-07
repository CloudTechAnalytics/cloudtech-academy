"""The ten ad videos with voice-over.

Each video has a format (9x16, 1x1 or 16x9), a voice, and scenes. A scene has what appears on screen (kicker, headline,
items) and `vo`, the words the voice says. The voice is spelled to be said well ("A I", "C V", "S Q L"); the on-screen
captions are tidied back to "AI", "CV" and "SQL".

Rules for this copy: free courses are promoted as free; paid courses show no price; nothing promises a job, income or a
guaranteed result.
"""

FEMALE = "en-NG-EzinneNeural"
MALE = "en-NG-AbeoNeural"

SQL = "SELECT customer, SUM(total)\nFROM orders\nWHERE status = 'paid'\nGROUP BY customer;"

FREE_CTA = dict(type="cta", kicker="Your next skill starts here", headline="Start learning *free.*", button="Start learning free →")
SEE_CTA = dict(type="cta", kicker="CloudTech Academy", headline="Learn it *properly.*", button="See the course →")
SEE_COURSES = dict(type="cta", kicker="CloudTech Academy", headline="Learn it *properly.*", button="See the courses →")

VIDEOS = [
    dict(
        id="01-start-free",
        title="Start free: data, AI, tech and career skills",
        fmt="9x16",
        voice=FEMALE,
        use="Cold audiences. Instagram and Facebook Reels and Stories, YouTube Shorts. Free courses.",
        scenes=[
            dict(type="hook", kicker="Free · No experience needed", headline="Want a skill that gets you *noticed?*",
                 vo="Want a skill that gets you noticed? You can start today, and it is free."),
            dict(type="chips", size="h2", headline="Free courses in *data, AI & tech.*", items=["Excel", "SQL", "Power BI", "Python", "AI tools", "CV & LinkedIn"],
                 vo="CloudTech Academy has free courses in data, A I, technology, and career skills."),
            dict(type="code", kicker="Practise in your browser", lang="Practice", code=SQL, badge="SQL Querying",
                 vo="Practise right in your browser, and see straight away if your answer is correct. Finish a module, and earn a badge."),
            dict(type="steps", size="h2", headline="Learn. Practise. *Earn.*",
                 items=[("Learn step by step", "Clear lessons with worked examples"), ("Practise for real", "Instant feedback on your answers"), ("Earn badges", "Build projects, get certified")],
                 vo="Learn step by step. Practise for real. And earn badges you can show on your C V and LinkedIn."),
            dict(FREE_CTA, vo="No experience needed, and nothing to install. Tap the link, and start learning free today."),
        ],
    ),
    dict(
        id="02-excel-free",
        title="Free Excel course",
        fmt="9x16",
        voice=MALE,
        use="People who use Excel at work or school. Reels and Stories. Free course: Excel for Data Analysis.",
        scenes=[
            dict(type="hook", kicker="Free Excel course", headline="Still scared of *Excel?*",
                 vo="Still scared of Excel? You are not alone. Most people only ever learn the basics."),
            dict(type="ticks", size="h2", headline="Go beyond the *basics*", items=["Formulas and functions", "Pivot tables", "XLOOKUP and SUMIF", "Cleaning messy data", "Charts that explain"],
                 vo="In this free course, you learn formulas, pivot tables, lookups, data cleaning, and charts that explain your numbers."),
            dict(type="code", kicker="Try it on real data", lang="Excel", code='=SUMIF(Region,"Lagos",Sales)',
                 vo="Practise on real data in your browser, with instant feedback on every answer."),
            dict(type="cta", kicker="Free · At your own pace", headline="Learn Excel *properly.*", button="Start the Excel course →",
                 vo="Go at your own pace. Tap the link, and start the free Excel course today."),
        ],
    ),
    dict(
        id="03-sql-in-browser",
        title="Write real SQL in your browser",
        fmt="1x1",
        voice=MALE,
        use="Feed ads for people curious about tech and data. Free course: SQL for Data Analysis.",
        scenes=[
            dict(type="hook", kicker="Free · In your browser", headline="Write real *SQL.*\nNo setup.",
                 vo="Want to learn S Q L, without installing anything? You can write real queries in your browser."),
            dict(type="code", kicker="Run it and see", lang="SQL", code=SQL, badge="SQL Querying",
                 vo="Type your query, run it, and the platform checks your answer straight away. Get it right, and you earn a badge."),
            dict(type="cta", kicker="Free course", headline="Write your first query *today.*", button="Write your first query →",
                 vo="The course is free. Tap the link, and write your first query today."),
        ],
    ),
    dict(
        id="04-students-start-here",
        title="Student? Start here",
        fmt="1x1",
        voice=FEMALE,
        use="University students and graduates. Feed ads. Free courses for students.",
        scenes=[
            dict(type="hook", kicker="Free for students", headline="Student? *Start here.*", vo="Student? Here is where to start."),
            dict(type="ticks", size="h2", headline="Free skills for *school and your first job*",
                 items=["Study smarter with AI", "Build a CV that gets read", "Create a portfolio", "Go after your first internship"],
                 vo="Study smarter with A I. Build a C V that gets read. Create a portfolio. And go after your first internship."),
            dict(FREE_CTA, vo="It is all free for students. Tap the link, and start today."),
        ],
    ),
    dict(
        id="05-cv-that-gets-read",
        title="A CV that gets read",
        fmt="9x16",
        voice=FEMALE,
        use="Job seekers and final-year students. Reels and Stories. Free course: Career Essentials.",
        scenes=[
            dict(type="hook", kicker="Free career course", headline="Is your CV getting *ignored?*",
                 vo="Sending your C V everywhere, and hearing nothing back? Your C V might be the problem."),
            dict(type="steps", size="h2", headline="Fix it in *three steps*",
                 items=[("Write achievements", "Not just duties"), ("Tailor it to the job", "Match what they ask for"), ("Polish your LinkedIn", "A profile recruiters can read")],
                 vo="Learn to write achievements, not just duties. Tailor your C V to each job. And build a LinkedIn profile that recruiters understand."),
            dict(FREE_CTA, kicker="Free · At your own pace", vo="The course is free, and you go at your own pace. Tap the link, and start today."),
        ],
    ),
    dict(
        id="06-ai-at-work",
        title="Use AI at work, the smart way",
        fmt="16x9",
        voice=MALE,
        use="YouTube in-stream and landscape feed. Free course: AI Productivity Fundamentals.",
        scenes=[
            dict(type="hook", kicker="Free · AI productivity", headline="Use AI at work, *the smart way.*",
                 vo="A I tools can save you hours, but only if you use them well."),
            dict(type="chips", size="h2", headline="Learn the *tools and the skills*", items=["Prompting", "Claude", "ChatGPT", "Your own documents", "Presentations"],
                 vo="In this free course, you learn to write clear prompts, work with your own documents, research with sources, and build presentations."),
            dict(type="ticks", size="h2", headline="Use it with *your own judgement*",
                 items=["Write prompts that work", "Research with sources", "Check answers before you use them"],
                 vo="You will also learn to check what A I tells you, before you rely on it."),
            dict(FREE_CTA, button="Start the free course →", vo="Tap the link, and start the free A I course today."),
        ],
    ),
    dict(
        id="07-import-export",
        title="Import, Export and Mini Importation",
        fmt="9x16",
        voice=MALE,
        use="People who want to import or trade. Reels and Stories. Paid course; open enrolment first.",
        scenes=[
            dict(type="hook", kicker="Professional course", headline="Thinking of *importing goods?*",
                 vo="Thinking of importing goods, but worried about suppliers, shipping, and customs?"),
            dict(type="steps", size="h2", headline="From supplier to *your shelf*",
                 items=[("Find and verify suppliers", "Spot scams before you pay"), ("Ship and clear customs", "Documents, duty and Form M"), ("Work out landed cost", "Know your real cost first")],
                 vo="Learn to find and check suppliers, ship goods and clear customs, and work out your real landed cost, before you order."),
            dict(type="ticks", size="h2", headline="Also *covered*", items=["Negotiation and samples", "Selling what you import", "Exporting from Nigeria"],
                 vo="You also learn to negotiate, sell what you import, and how exporting works."),
            dict(SEE_CTA, vo="Twelve modules, with tasks, assessments, and a final project. Tap the link to see the course."),
        ],
    ),
    dict(
        id="08-logistics-supply-chain",
        title="Logistics and supply chain",
        fmt="16x9",
        voice=FEMALE,
        use="YouTube and landscape feed. Paid courses: Logistics & Freight Forwarding, Supply Chain Management.",
        scenes=[
            dict(type="hook", kicker="Professional courses", headline="Every product you buy has *travelled.*",
                 vo="Every product you buy has travelled. By road, sea, or air, through customs, and into a warehouse."),
            dict(type="chips", size="h2", headline="Learn how it *really works*", items=["Freight forwarding", "Shipping documents", "Customs", "Warehousing", "Demand planning", "Inventory"],
                 vo="Learn freight forwarding, shipping documents, customs clearance, warehousing, demand planning, and inventory."),
            dict(type="steps", size="h2", headline="Two courses, *one complete picture*",
                 items=[("Logistics & Freight Forwarding", "Move cargo, clear it, quote it"), ("Supply Chain Management", "Plan, buy, store and deliver")],
                 vo="Logistics and Freight Forwarding shows you how cargo moves. Supply Chain Management shows you how to plan the whole chain."),
            dict(SEE_COURSES, vo="Each course ends with a real project. Tap the link to see them."),
        ],
    ),
    dict(
        id="09-sell-online",
        title="Learn to sell online",
        fmt="9x16",
        voice=FEMALE,
        use="Small sellers and Instagram vendors. Reels and Stories. Paid courses: E-commerce & Online Business, Digital Marketing & Sales.",
        scenes=[
            dict(type="hook", kicker="Professional courses", headline="Want to sell *online?*", vo="Want to sell online, but not sure where to start?"),
            dict(type="steps", size="h2", headline="Start to *first order*",
                 items=[("Pick a niche and product", "Check demand and costs"), ("Set up and get paid safely", "Store pages, payments, delivery"), ("Reach customers", "Instagram, WhatsApp, ads, search")],
                 vo="Learn to pick a product, set up your store, take payments safely, and deliver. Then reach customers on Instagram, WhatsApp, ads, and search."),
            dict(type="ticks", size="h2", headline="And keep them *coming back*", items=["Handle returns and complaints", "Read your store numbers", "Measure your ad results"],
                 vo="You will also learn customer service, returns, and the numbers that show whether your ads are working."),
            dict(SEE_COURSES, vo="Practical lessons, real tasks, and a final project. Tap the link to see the courses."),
        ],
    ),
    dict(
        id="10-know-your-numbers",
        title="Know your numbers",
        fmt="1x1",
        voice=MALE,
        use="Small business owners. Feed ads. Paid courses: Bookkeeping & Small Business Finance, Entrepreneurship & Business Management.",
        scenes=[
            dict(type="hook", kicker="Professional courses", headline="Is your business making *money?*",
                 vo="Is your business making money, or just handling money?"),
            dict(type="ticks", size="h2", headline="Know your *numbers*",
                 items=["Record every transaction", "Read your profit and loss", "Plan your cash flow", "Know what tax records to keep"],
                 vo="Learn to record every transaction, read your profit and loss, plan your cash flow, and know what tax records to keep."),
            dict(SEE_COURSES, vo="Bookkeeping and Small Business Finance, and Entrepreneurship and Business Management. Tap the link to see them."),
        ],
    ),
]
