"""Twenty more voice-over videos (11 to 30), all 9:16 for TikTok, Reels and Shorts. Value first, soft call to action.

Rules: free courses are promoted as free; paid courses show no price; nothing promises a job, income or a result.
"""
from specs import FEMALE, MALE, SQL, FREE_CTA, SEE_CTA


def cta(headline, button, kicker="CloudTech Academy"):
    return dict(type="cta", kicker=kicker, headline=headline, button=button)


DEFAULT_VO_FREE = "It is free. Tap the link, and start today."
DEFAULT_VO_SEE = "Tap the link to see the courses."


def V(i, slug, title, voice, use, scenes):
    scenes = [dict(sc) for sc in scenes]
    for sc in scenes:
        if "vo" not in sc:
            sc["vo"] = DEFAULT_VO_FREE if "free" in (sc.get("button", "") + sc.get("kicker", "")).lower() else DEFAULT_VO_SEE
    return dict(id=f"{i:02d}-{slug}", title=title, fmt="9x16", voice=voice, use=use, scenes=scenes)


MORE = [
    V(11, "data-in-wrong-place", "Your data is scattered, not missing", MALE, "Business owners. Free courses.", [
        dict(type="hook", kicker="Business data", headline="Your business already has the *data.*", vo="Your business already has the data. It is just in the wrong place."),
        dict(type="chips", size="h2", headline="Where it *hides*", items=["WhatsApp orders", "Bank alerts", "Notebooks", "Excel files"], vo="In WhatsApp orders, bank alerts, a notebook, and three Excel files called final, final two, and final real."),
        dict(type="steps", size="h2", headline="Start *here*", items=[("Pick five questions", "What do you need to know?"), ("Find where the data lives", "List every source"), ("Then choose a tool", "Not the other way round")], vo="Start with five questions you want answered. Find where that data lives. Then choose a tool."),
        cta("Learn data *properly.*", "Start learning free →", "Free courses")]),
    V(12, "stop-select-star", "Stop writing SELECT star", FEMALE, "SQL learners. Free SQL course.", [
        dict(type="hook", kicker="SQL tip", headline="Learning SQL? *Stop doing this.*", vo="If you are learning S Q L, stop doing this."),
        dict(type="code", kicker="Name your columns", lang="SQL", code="SELECT customer, total\nFROM orders;", badge="Cleaner query", vo="Do not write select star on everything. Name the columns you need. It is clearer, faster, and safer when the table changes."),
        cta("Practise SQL *free.*", "Start the SQL course →", "Free · In your browser")]),
    V(13, "dashboard-question", "Your dashboard is not the problem", MALE, "Analytics and BI audiences.", [
        dict(type="hook", kicker="Dashboards", headline="Your dashboard isn't the *problem.*", vo="Your dashboard is not the problem. Your question is."),
        dict(type="ticks", size="h2", headline="Before you build, *finish this*", items=["I need to know ___", "So that I can ___", "One decision", "Two or three numbers"], vo="Finish this sentence. I need to know blank, so that I can blank. If you cannot, do not build the chart yet. A good dashboard supports one decision with two or three numbers."),
        cta("Build with a *purpose.*", "Learn Power BI free →", "Free course")]),
    V(14, "start-as-analyst", "You don't need to know everything", FEMALE, "Beginners curious about data careers.", [
        dict(type="hook", kicker="Data careers", headline="You don't need to know *everything.*", vo="You do not need to know everything to start as a data analyst."),
        dict(type="steps", size="h2", headline="Start *small*", items=[("Pick one tool", "Excel or SQL"), ("Solve real questions", "Do, don't just watch"), ("Add the next tool", "One step at a time")], vo="Pick one tool, Excel or S Q L. Learn it by solving real questions, not just watching. Then add the next one."),
        FREE_CTA]),
    V(15, "reports-never-match", "Why your report never matches", MALE, "Business and analysts.", [
        dict(type="hook", kicker="Reporting", headline="Why your monthly report never *matches.*", vo="Why does your monthly report never match?"),
        dict(type="ticks", size="h2", headline="Same data, *different totals*", items=["Refunds counted or not", "Order date or payment date", "Nobody wrote the definition"], vo="Two people, same data, two totals. One counted refunds, one did not. One used order date, one used payment date. Nobody wrote down the definition."),
        dict(type="steps", size="h2", headline="The *fix*", items=[("Define each number", "In one sentence"), ("Write it down once", "Share it with the team")], vo="Define every number in one sentence, and write it down once. The arguments stop."),
        cta("Learn it *properly.*", "See the free courses →", "Free courses")]),
    V(16, "xlookup", "Stop using VLOOKUP like it's 2012", FEMALE, "Excel users.", [
        dict(type="hook", kicker="Excel tip", headline="Stop using VLOOKUP like it's *2012.*", vo="Stop using VLOOKUP like it is two thousand and twelve."),
        dict(type="code", kicker="Use XLOOKUP", lang="Excel", code="=XLOOKUP(what, where, return)", badge="Excel", vo="X LOOKUP looks in any direction, does not break when you insert a column, and lets you say what to show if nothing is found."),
        cta("Learn Excel *properly.*", "Start the Excel course →", "Free · Practise in your browser")]),
    V(17, "ai-changes-job", "AI is changing this job", MALE, "AI and work audience.", [
        dict(type="hook", kicker="AI at work", headline="AI isn't replacing this job. It's *changing it.*", vo="A I is not replacing this job. It is changing it."),
        dict(type="ticks", size="h2", headline="The skill now is *checking*", items=["Does the total match the source?", "Is this trend real?", "Is the answer confidently wrong?"], vo="A I can draft a report summary in seconds. But it can be confidently wrong. The new skill is checking. Does the total match the source? Is the trend real?"),
        cta("Use AI *with judgement.*", "Start the free AI course →", "Free course")]),
    V(18, "cv-achievements", "Your CV says responsible for", FEMALE, "Job seekers.", [
        dict(type="hook", kicker="CV tip", headline="Recruiters skim past *\"responsible for\".*", vo="Your C V says responsible for. Recruiters skim past that."),
        dict(type="steps", size="h2", headline="Show *results*", items=[("Use numbers", "Money, time, percentages"), ("Start with action verbs", "Led, built, reduced"), ("Match the job advert", "Use their words")], vo="Use numbers. Start with action verbs. And match the words in the job advert."),
        dict(FREE_CTA, kicker="Free career course", vo="Our free Career Essentials course goes deeper. Tap the link to start.")]),
    V(19, "watching-isnt-learning", "Watching isn't learning", MALE, "Self-learners.", [
        dict(type="hook", kicker="Learning tip", headline="40 tutorials. Still can't *do it?*", vo="Forty tutorials watched, and you still cannot do it. Here is why."),
        dict(type="ticks", size="h2", headline="Watching feels like *learning*", items=["Close the video", "Do it yourself from scratch", "Get it wrong", "Fix it"], vo="Watching feels like learning, but it is not. Close the video. Do it yourself from scratch. Get it wrong. Fix it. That is the work."),
        cta("Practise with *instant feedback.*", "Start learning free →", "Free courses")]),
    V(20, "five-questions", "Five questions every shop owner should answer", FEMALE, "Small business owners.", [
        dict(type="hook", kicker="Small business", headline="Can you answer these *five questions?*", vo="Every shop owner should be able to answer five questions."),
        dict(type="ticks", size="h2", headline="Your *five questions*", items=["What sells most?", "What makes the most profit?", "Who buys again?", "What am I running out of?", "Where does my money go?"], vo="What sells most? What makes the most profit, not just revenue? Who buys again? What am I running out of? And where does my money go each month?"),
        cta("Know your *numbers.*", "See the courses →")]),
    V(21, "learn-sql-browser", "Learn SQL in a browser", MALE, "SQL curious.", [
        dict(type="hook", kicker="Free · No install", headline="Learning SQL in a browser *looks like this.*", vo="Here is what learning S Q L in a browser looks like."),
        dict(type="code", kicker="Write. Check. Fix.", lang="SQL", code=SQL, badge="SQL Querying", vo="You get a task, type your query, press check, and the platform tells you if the answer is right. Nothing to install."),
        FREE_CTA]),
    V(22, "automation-weekly", "If you copy and paste weekly, you are the automation", FEMALE, "Business and office workers.", [
        dict(type="hook", kicker="Automation", headline="Same copy and paste every week? *You're the automation.*", vo="If you copy and paste the same data every week, you are the automation."),
        dict(type="steps", size="h2", headline="The weekly *routine*", items=[("Download the file", "Same file, every week"), ("Copy, paste, fix formats", "Same steps"), ("Email it", "Again")], vo="Download a file. Copy columns. Fix formats. Email it. The same steps, every week. That is exactly what software does well."),
        dict(type="ticks", size="h2", headline="Your first *step*", items=["List what you repeat", "Find the longest task", "Start there"], vo="List what you repeat this week. Start with the task that takes the longest."),
        cta("Work smarter with *data and AI.*", "See free courses →", "Free courses")]),
    V(23, "python-three-lines", "A useful Python script in three lines", MALE, "Beginners.", [
        dict(type="hook", kicker="Python", headline="Your first useful script is *shorter than you think.*", vo="Your first useful Python script is shorter than you think."),
        dict(type="code", kicker="Total a list", lang="Python", code="prices = [1200, 850, 2300]\ntotal = sum(prices)\nprint(total)", badge="Python", vo="Make a list of prices. Add them up. Print the total. Three lines."),
        cta("Learn Python *free.*", "Start Python for Beginners →", "Free course")]),
    V(24, "median-not-mean", "Mean or median", FEMALE, "Data learners.", [
        dict(type="hook", kicker="Data concept", headline="Mean, median, mode. One stops you *lying with data.*", vo="Mean, median, mode. Only one will stop you lying with data."),
        dict(type="ticks", size="h2", headline="Outlier? *Use the median.*", items=["Mean: pulled by big values", "Median: the typical value", "Ask: mean or median?"], vo="Five people earn small, one earns a huge amount. The mean says everyone earns well. The median tells you what a typical person earns. When a few big values pull the average, use the median."),
        cta("Learn data *foundations.*", "Start the free course →", "Free course")]),
    V(25, "landed-cost", "Work out landed cost first", MALE, "Aspiring importers. Paid course.", [
        dict(type="hook", kicker="Importing", headline="Before you import, *work out this number.*", vo="Before you import anything, work out this number."),
        dict(type="steps", size="h2", headline="Landed *cost*", items=[("Invoice price", "What the supplier charges"), ("Shipping and customs", "Duty, clearing, charges"), ("Transport to your shop", "Then your real cost")], vo="Landed cost. Not the supplier's price, but the price plus shipping, customs duty, clearing, and transport to your shop. Always check current duty rules, because they change."),
        dict(SEE_CTA, vo="Our Import and Export course covers it step by step. Tap the link to see it.")]),
    V(26, "verify-your-skills", "Skills you can verify", FEMALE, "Job seekers.", [
        dict(type="hook", kicker="Badges", headline="Anyone can say they have a *certificate.*", vo="Anyone can say they have a certificate. Here is how an employer can check yours."),
        dict(type="ticks", size="h2", headline="Every badge has a *public page*", items=["Opens with one link", "Shows what you earned", "Add it to your CV and LinkedIn"], vo="Every badge you earn on CloudTech Academy has its own public page. An employer opens the link and sees what you earned and when. Add it to your C V or LinkedIn."),
        FREE_CTA]),
    V(27, "excel-duplicates", "Hidden duplicates in your spreadsheet", MALE, "Excel users.", [
        dict(type="hook", kicker="Data cleaning", headline="Your spreadsheet has a hidden problem: *duplicates.*", vo="Your spreadsheet has a hidden problem. Duplicates."),
        dict(type="ticks", size="h2", headline="Check *before you count*", items=["Same customer, two rows", "Counted twice", "Remove duplicates", "Ask why they appeared"], vo="Two rows for the same customer, and you count one person twice. Remove duplicates, and your total changes. Always check before you trust a count, then ask why they appeared."),
        cta("Clean data, *better decisions.*", "Start the Excel course →", "Free course")]),
    V(28, "students-ai", "Study smarter with AI", FEMALE, "Students.", [
        dict(type="hook", kicker="For students", headline="Use AI to study smarter, *not to cheat yourself.*", vo="Use A I to study smarter, not to cheat yourself."),
        dict(type="ticks", size="h2", headline="Good *uses*", items=["Explain a topic simply", "Make practice questions", "Check your understanding", "Always verify the answer"], vo="Ask it to explain a topic simply. Make practice questions. Check your understanding. And always verify what it tells you."),
        cta("Free for *students.*", "See the student courses →", "Free for students")]),
    V(29, "sell-online-start", "Selling online: where to start", MALE, "Small sellers. Paid courses.", [
        dict(type="hook", kicker="E-commerce", headline="Selling online but *not sure where to start?*", vo="Selling online, but not sure where to start?"),
        dict(type="steps", size="h2", headline="Start to *first order*", items=[("Pick a product", "Check demand and cost"), ("Set up and get paid safely", "Payments and delivery"), ("Reach customers", "Instagram, WhatsApp, search")], vo="Pick a product and check the demand and cost. Set up, get paid safely, and deliver. Then reach customers on Instagram, WhatsApp, and search."),
        dict(SEE_CTA, vo="Tap the link to see our online business courses.")]),
    V(30, "start-today", "Start today", FEMALE, "Cold audience, short.", [
        dict(type="hook", kicker="Free · No experience needed", headline="One free lesson *today.*", vo="You do not need a perfect plan. Just one lesson today."),
        dict(type="chips", size="h2", headline="Pick a *free course*", items=["Excel", "SQL", "Power BI", "Python", "AI tools", "Career skills"], vo="Pick a free course. Excel, S Q L, Power B I, Python, A I tools, or career skills."),
        FREE_CTA]),
]
