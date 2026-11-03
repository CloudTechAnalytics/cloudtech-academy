import type { AssessmentDef } from "../types";

const C = "python-for-beginners";

/** A module check: it awards the module badge, and unlocks only after the module's tasks are done. */
const check = (moduleId: string, title: string, questions: AssessmentDef["questions"]): AssessmentDef => ({
  id: `${moduleId}-check`,
  courseId: C,
  kind: "module",
  moduleId,
  title: `${title}: module check`,
  passingScore: 60,
  questions,
});

/**
 * Python for Beginners: a check for each module and a final assessment. Questions ask what
 * code does, with plausible wrong answers.
 */
export const PY_ASSESSMENTS: AssessmentDef[] = [
  check("py-m01", "First Steps in Python", [
    { id: "py-m01-q1", prompt: "What does print(2 + 3) show?", options: ["2 + 3", "5", "23", "An error"], answer: 1, explanation: "Without quotes, Python works out the sum." },
    { id: "py-m01-q2", prompt: "What does print(\"2 + 3\") show?", options: ["5", "2 + 3", "\"2 + 3\"", "An error"], answer: 1, explanation: "In quotes, it's text, printed exactly as written." },
    { id: "py-m01-q3", prompt: "What does Python do with a line that starts with #?", options: ["Runs it twice", "Ignores it: it's a comment", "Prints it", "Stops the program"], answer: 1, explanation: "Comments are notes for people." },
    { id: "py-m01-q4", prompt: "You type Print(\"Hi\") and get NameError: name 'Print' is not defined. Why?", options: ["Colab is offline", "Capitals matter: the function is print", "Text needs single quotes", "Hi is too short"], answer: 1, explanation: "Python is case-sensitive." },
    { id: "py-m01-q5", prompt: "Colab disconnected while you were away. What should you do before carrying on?", options: ["Nothing", "Run your earlier cells again, e.g. Runtime → Run all", "Delete the notebook", "Restart your computer"], answer: 1, explanation: "A disconnect clears everything that was run." },
    { id: "py-m01-q6", prompt: "Which part of an error message should you read first?", options: ["The first line", "The last line", "The middle", "None: just retype the code"], answer: 1, explanation: "The last line names the error and what went wrong." },
  ]),
  check("py-m04", "Variables and Data Types", [
    { id: "py-m04-q1", prompt: "balance = 5000, then balance = balance - 1800. What is balance?", options: ["5000", "1800", "3200", "An error"], answer: 2, explanation: "The right side is worked out first, then stored." },
    { id: "py-m04-q2", prompt: "Which is a valid variable name?", options: ["first name", "2nd_course", "first_name", "first-name"], answer: 2, explanation: "Letters, numbers and underscores; no spaces or hyphens; can't start with a number." },
    { id: "py-m04-q3", prompt: "What type is 4.0?", options: ["int", "float", "str", "bool"], answer: 1, explanation: "A decimal point makes it a float." },
    { id: "py-m04-q4", prompt: "What is \"7\" + \"3\"?", options: ["10", "\"73\"", "An error", "\"10\""], answer: 1, explanation: "Text plus text joins the strings." },
    { id: "py-m04-q5", prompt: "What does int(9.99) give?", options: ["10", "9", "9.99", "An error"], answer: 1, explanation: "int() cuts off the decimals; it doesn't round." },
    { id: "py-m04-q6", prompt: "age = 20. Which prints \"Age: 20\" without an error?", options: ["print(\"Age: \" + age)", "print(f\"Age: {age}\")", "print(\"Age: {age}\")", "print(Age: age)"], answer: 1, explanation: "An f-string puts the value into the text." },
  ]),
  check("py-m05", "Numbers and Maths", [
    { id: "py-m05-q1", prompt: "What is 7 // 2?", options: ["3.5", "3", "1", "4"], answer: 1, explanation: "// divides and drops the remainder." },
    { id: "py-m05-q2", prompt: "What is 17 % 5?", options: ["3.4", "2", "3", "85"], answer: 1, explanation: "% gives the remainder: 17 = 3 × 5 + 2." },
    { id: "py-m05-q3", prompt: "What is 2 + 3 * 4?", options: ["20", "14", "24", "9"], answer: 1, explanation: "Multiplication comes before addition." },
    { id: "py-m05-q4", prompt: "What does 10 / 2 give?", options: ["5", "5.0", "\"5\"", "2"], answer: 1, explanation: "/ always returns a float." },
    { id: "py-m05-q5", prompt: "130 students, 18 seats per bus. Which gives the number of buses needed?", options: ["130 // 18", "round(130 / 18)", "math.ceil(130 / 18)", "130 % 18"], answer: 2, explanation: "ceil rounds up: 8 buses, not 7." },
    { id: "py-m05-q6", prompt: "What does f\"{1234567:,.0f}\" produce?", options: ["1234567", "1,234,567", "1.234.567", "1,234,567.0"], answer: 1, explanation: ", adds thousands separators and .0f shows no decimals." },
  ]),
  check("py-m06", "Working with Text", [
    { id: "py-m06-q1", prompt: "word = \"Python\". What is word[0]?", options: ["P", "y", "n", "Python"], answer: 0, explanation: "Indexes start at 0." },
    { id: "py-m06-q2", prompt: "word = \"Python\". What is word[-1]?", options: ["P", "n", "o", "An error"], answer: 1, explanation: "-1 is always the last character." },
    { id: "py-m06-q3", prompt: "code = \"ECO201\". What is code[0:3]?", options: ["ECO2", "ECO", "CO2", "201"], answer: 1, explanation: "A slice stops before the second index." },
    { id: "py-m06-q4", prompt: "What does \"  lagos \".strip().title() give?", options: ["\"  Lagos \"", "\"Lagos\"", "\"LAGOS\"", "\"lagos\""], answer: 1, explanation: "strip removes outer spaces; title capitalises." },
    { id: "py-m06-q5", prompt: "What does \"a,b,c\".split(\",\") give?", options: ["\"abc\"", "[\"a\", \"b\", \"c\"]", "[\"a,b,c\"]", "3"], answer: 1, explanation: "split breaks text into a list at each comma." },
    { id: "py-m06-q6", prompt: "name = \"musa\"; name.upper(); print(name). What prints?", options: ["MUSA", "musa", "Musa", "An error"], answer: 1, explanation: "Methods return a new string; store it with name = name.upper()." },
  ]),
  check("py-m07", "Conditions: if, elif and else", [
    { id: "py-m07-q1", prompt: "score = 65. With if score >= 70: A, elif score >= 60: B, else: C, what grade?", options: ["A", "B", "C", "A and B"], answer: 1, explanation: "The first true condition wins." },
    { id: "py-m07-q2", prompt: "Which line checks whether score is exactly 70?", options: ["if score = 70:", "if score == 70:", "if score === 70:", "if (score) 70:"], answer: 1, explanation: "== compares; = assigns." },
    { id: "py-m07-q3", prompt: "Python says SyntaxError: expected ':' on an if line. What's wrong?", options: ["A misspelt variable", "The if line is missing its colon", "You used ==", "The block is too long"], answer: 1, explanation: "if, elif and else lines end with a colon." },
    { id: "py-m07-q4", prompt: "When is a and b true?", options: ["When either is true", "When both are true", "When both are false", "Always"], answer: 1, explanation: "and needs both sides." },
    { id: "py-m07-q5", prompt: "Why is if day == \"Sat\" or \"Sun\": always true?", options: ["It isn't", "\"Sun\" on its own is non-empty text, which counts as true", "or is broken", "Days are special"], answer: 1, explanation: "Write day == \"Sat\" or day == \"Sun\", or day in [...]." },
    { id: "py-m07-q6", prompt: "name = \"\". What does if name: do?", options: ["Runs its block", "Skips its block: empty text counts as false", "Gives an error", "Prints the name"], answer: 1, explanation: "Empty text, 0, None and empty lists are falsy." },
  ]),
  check("py-m08", "Lists and Tuples", [
    { id: "py-m08-q1", prompt: "scores = [67, 81, 54]. What is scores[1]?", options: ["67", "81", "54", "An error"], answer: 1, explanation: "Positions start at 0." },
    { id: "py-m08-q2", prompt: "scores = [67, 81, 54]. What does scores[3] give?", options: ["54", "None", "IndexError: list index out of range", "67"], answer: 2, explanation: "Three items have positions 0 to 2." },
    { id: "py-m08-q3", prompt: "Which adds 90 to the end of scores?", options: ["scores.add(90)", "scores.append(90)", "scores + 90", "scores[3] = 90"], answer: 1, explanation: "append adds one item to the end." },
    { id: "py-m08-q4", prompt: "a = [1, 2]; b = a; b.append(3). What is a?", options: ["[1, 2]", "[1, 2, 3]", "[3]", "An error"], answer: 1, explanation: "b = a gives the same list a second name. Use a.copy() for a real copy." },
    { id: "py-m08-q5", prompt: "What does sorted([3, 1, 2], reverse=True) give?", options: ["[1, 2, 3]", "[3, 2, 1]", "None", "[3, 1, 2]"], answer: 1, explanation: "reverse=True sorts largest first." },
    { id: "py-m08-q6", prompt: "What's the main difference between a list and a tuple?", options: ["Tuples hold only numbers", "A tuple can't be changed after it's made", "Lists can't be indexed", "There's none"], answer: 1, explanation: "Use tuples for fixed groups of values." },
  ]),
  check("py-m02", "Loops: for and while", [
    { id: "py-m02-q1", prompt: "What does range(1, 5) produce in a for loop?", options: ["1, 2, 3, 4, 5", "1, 2, 3, 4", "0, 1, 2, 3, 4", "5 numbers starting at 5"], answer: 1, explanation: "range stops before the second number." },
    { id: "py-m02-q2", prompt: "total = 0; for x in [5, 10, 15]: total += x. What is total?", options: ["15", "30", "51015", "0"], answer: 1, explanation: "The loop adds each value." },
    { id: "py-m02-q3", prompt: "A loop sets total = 0 inside its block, then adds the amount. What happens?", options: ["The right total", "Only the last amount survives", "An error", "Double the total"], answer: 1, explanation: "Start totals before the loop, not inside it." },
    { id: "py-m02-q4", prompt: "What does break do in a loop?", options: ["Skips one item", "Stops the loop immediately", "Pauses for a second", "Restarts the loop"], answer: 1, explanation: "continue skips one item; break stops." },
    { id: "py-m02-q5", prompt: "When should you use a while loop?", options: ["To loop over a list", "When you don't know in advance how many repeats you need", "Never", "Only with numbers"], answer: 1, explanation: "while repeats as long as a condition is true." },
    { id: "py-m02-q6", prompt: "What does [x * 2 for x in [1, 2, 3]] give?", options: ["[1, 2, 3, 1, 2, 3]", "[2, 4, 6]", "12", "[1, 2, 3]"], answer: 1, explanation: "A list comprehension makes a new list, doubling each item." },
  ]),
  check("py-m09", "Dictionaries and Sets", [
    { id: "py-m09-q1", prompt: "student = {\"name\": \"Musa\", \"level\": 300}. What is student[\"level\"]?", options: ["\"level\"", "300", "Musa", "An error"], answer: 1, explanation: "A dictionary looks up a value by its key." },
    { id: "py-m09-q2", prompt: "student[\"Name\"] gives KeyError: 'Name'. Why?", options: ["Dictionaries can't hold names", "Keys must match exactly; the key is \"name\"", "The dictionary is empty", "You need a list"], answer: 1, explanation: "Use the exact key, or .get() with a default." },
    { id: "py-m09-q3", prompt: "What does student.get(\"hall\", \"None yet\") return if there's no hall key?", options: ["An error", "None yet", "hall", "False"], answer: 1, explanation: "get returns the default when the key is missing." },
    { id: "py-m09-q4", prompt: "spending = {\"Food\": 28000, \"Data\": 6000}. What is sum(spending.values())?", options: ["2", "34000", "\"Food\"", "28000"], answer: 1, explanation: ".values() gives the amounts; sum adds them." },
    { id: "py-m09-q5", prompt: "What does max(spending, key=spending.get) return for {\"Food\": 28000, \"Data\": 6000}?", options: ["28000", "\"Food\"", "\"Data\"", "6000"], answer: 1, explanation: "It returns the key whose value is largest." },
    { id: "py-m09-q6", prompt: "What is len(set([\"Lagos\", \"Abuja\", \"Lagos\"]))?", options: ["3", "2", "1", "An error"], answer: 1, explanation: "A set keeps each value once." },
  ]),
  check("py-m03", "Functions and a Mini Project", [
    { id: "py-m03-q1", prompt: "def area(w, h): w * h. What does print(area(3, 4)) show?", options: ["12", "None", "An error", "w * h"], answer: 1, explanation: "Without return, the function gives back None." },
    { id: "py-m03-q2", prompt: "def add_vat(price, rate=7.5): ... What does add_vat(1000) use for rate?", options: ["0", "7.5", "An error", "1000"], answer: 1, explanation: "The default is used when the argument is left out." },
    { id: "py-m03-q3", prompt: "What's the difference between print and return in a function?", options: ["None", "return sends the value back so it can be used; print only shows it", "print is faster", "return shows it on screen"], answer: 1, explanation: "Calculations should return their result." },
    { id: "py-m03-q4", prompt: "A variable created inside a function. Can code outside the function use it?", options: ["Yes, always", "No: it's local to the function", "Only in Colab", "Only if it's a number"], answer: 1, explanation: "Pass values in as arguments and out with return." },
    { id: "py-m03-q5", prompt: "def f(): return 1, 2. What does a, b = f() store in b?", options: ["1", "2", "(1, 2)", "An error"], answer: 1, explanation: "The returned values are unpacked in order." },
    { id: "py-m03-q6", prompt: "greet() gives TypeError: missing 1 required positional argument: 'name'. What's the fix?", options: ["Delete the function", "Pass a name, e.g. greet(\"Ada\"), or give name a default", "Use print instead", "Restart Colab"], answer: 1, explanation: "The function needs the argument it was defined with." },
  ]),
  check("py-m10", "Errors, Modules and Next Steps", [
    { id: "py-m10-q1", prompt: "int(\"forty\") raises which error?", options: ["TypeError", "ValueError", "NameError", "KeyError"], answer: 1, explanation: "The type is right (text) but the value can't be converted." },
    { id: "py-m10-q2", prompt: "In try: ... except ValueError: ..., when does the except block run?", options: ["Always", "Only if a ValueError happens in the try block", "Never", "Before the try block"], answer: 1, explanation: "except handles the error you name." },
    { id: "py-m10-q3", prompt: "Why avoid a bare except: that catches everything?", options: ["It's slower", "It hides real bugs, like typos, and the program carries on wrongly", "It's not allowed", "It only works in Colab"], answer: 1, explanation: "Catch the specific errors you expect." },
    { id: "py-m10-q4", prompt: "What does raise ValueError(\"...\") do?", options: ["Prints a warning and continues", "Stops with that error, unless something catches it", "Fixes the value", "Nothing"], answer: 1, explanation: "Raise errors for inputs that make no sense." },
    { id: "py-m10-q5", prompt: "After import statistics, how do you get the median of scores?", options: ["median(scores)", "statistics.median(scores)", "scores.median()", "import median"], answer: 1, explanation: "Use the module name, a dot and the function." },
    { id: "py-m10-q6", prompt: "How do you install a package in a Colab cell?", options: ["install requests", "!pip install requests", "import pip requests", "pip(requests)"], answer: 1, explanation: "The ! runs a command; pip installs packages." },
  ]),
  {
    id: "python-for-beginners-final",
    courseId: C,
    kind: "final",
    title: "Python for Beginners: final assessment",
    passingScore: 60,
    questions: [
      { id: "py-f01", prompt: "What does this print? total = 0; for x in [5, 10, 15]: total += x; print(total)", options: ["15", "30", "51015", "0"], answer: 1, explanation: "The loop adds each value to total." },
      { id: "py-f02", prompt: "Which line stores text in a variable?", options: ["city = Lagos", "city = \"Lagos\"", "\"city\" = Lagos", "city == \"Lagos\""], answer: 1, explanation: "Text goes in quotes; = assigns." },
      { id: "py-f03", prompt: "What does len([4, 8, 15, 16]) return?", options: ["4", "43", "16", "3"], answer: 0, explanation: "len counts items." },
      { id: "py-f04", prompt: "Lines inside an if or a for loop must be…", options: ["In capital letters", "Indented under the line that ends with a colon", "On one line", "In quotes"], answer: 1, explanation: "Indentation defines blocks in Python." },
      { id: "py-f05", prompt: "What does this return? def grade(s): return \"Pass\" if s >= 50 else \"Fail\"; grade(49)", options: ["Pass", "Fail", "None", "49"], answer: 1, explanation: "49 is not >= 50." },
      { id: "py-f06", prompt: "Which loop prints every key and value of a dictionary d?", options: ["for k in d.values(): print(k)", "for k, v in d.items(): print(k, v)", "for d in k: print(d)", "print(d.items)"], answer: 1, explanation: ".items() gives key-value pairs." },
      { id: "py-f07", prompt: "NameError: name 'totl' is not defined. What's the most likely cause?", options: ["Python is broken", "A typo: the variable is called total", "The number is too big", "You need a list"], answer: 1, explanation: "Check the spelling of the name in the error." },
      { id: "py-f08", prompt: "What's 17 % 5?", options: ["3.4", "2", "3", "85"], answer: 1, explanation: "% gives the remainder: 17 = 3 × 5 + 2." },
      { id: "py-f09", prompt: "What does \"Data Analysis\".split() give?", options: ["\"DataAnalysis\"", "[\"Data\", \"Analysis\"]", "2", "[\"D\", \"a\", ...]"], answer: 1, explanation: "split() with no argument splits on spaces." },
      { id: "py-f10", prompt: "Which safely converts text to a number without crashing on bad input?", options: ["int(text)", "try: n = int(text) except ValueError: n = None", "number(text)", "text.int()"], answer: 1, explanation: "try and except handle the error." },
    ],
  },
];
