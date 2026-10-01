import type { AssessmentDef } from "../types";

const C = "python-for-beginners";

/**
 * Python for Beginners: a check for each module (it awards the module badge, and unlocks
 * only after the module's tasks are done) and a final assessment. Questions ask what code
 * does, with plausible wrong answers.
 */
export const PY_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "py-m01-check",
    courseId: C,
    kind: "module",
    moduleId: "py-m01",
    title: "First Steps in Python: module check",
    passingScore: 60,
    questions: [
      { id: "py-m01-q1", prompt: "What does this print? price = 2500; quantity = 4; print(price * quantity)", options: ["25004", "10000", "2500 * 4", "An error"], answer: 1, explanation: "Both are numbers, so * multiplies." },
      { id: "py-m01-q2", prompt: "What is \"7\" + \"3\" in Python?", options: ["10", "\"73\"", "An error", "\"10\""], answer: 1, explanation: "Text plus text joins the strings." },
      { id: "py-m01-q3", prompt: "print(\"Age: \" + 20) gives a TypeError. Which fix works?", options: ["print(\"Age: \" + \"twenty\" + 20)", "print(f\"Age: {20}\")", "print(\"Age: \" - 20)", "print(Age: 20)"], answer: 1, explanation: "An f-string, or str(20), turns the number into text." },
      { id: "py-m01-q4", prompt: "You restart Colab and run a cell that uses name, but get NameError: name 'name' is not defined. Why?", options: ["Python forgot how to print", "The cell that created name hasn't been run since the restart", "Variables can't be called name", "Colab is offline"], answer: 1, explanation: "Restarting clears memory; run the earlier cells again." },
      { id: "py-m01-q5", prompt: "Which is a valid variable name?", options: ["first name", "2nd_course", "first_name", "first-name"], answer: 2, explanation: "Letters, numbers and underscores; no spaces or hyphens; can't start with a number." },
      { id: "py-m01-q6", prompt: "What type is True?", options: ["str", "int", "bool", "float"], answer: 2, explanation: "True and False are booleans." },
    ],
  },
  {
    id: "py-m02-check",
    courseId: C,
    kind: "module",
    moduleId: "py-m02",
    title: "Decisions, Lists and Loops: module check",
    passingScore: 60,
    questions: [
      { id: "py-m02-q1", prompt: "scores = [67, 81, 54]. What is scores[1]?", options: ["67", "81", "54", "An error"], answer: 1, explanation: "Positions start at 0, so [1] is the second item." },
      { id: "py-m02-q2", prompt: "What does range(1, 5) produce in a for loop?", options: ["1, 2, 3, 4, 5", "1, 2, 3, 4", "0, 1, 2, 3, 4", "5 numbers starting at 5"], answer: 1, explanation: "range stops before the second number." },
      { id: "py-m02-q3", prompt: "score = 65. With if score >= 70: A, elif score >= 60: B, else: C, what grade?", options: ["A", "B", "C", "A and B"], answer: 1, explanation: "The first true condition wins: 65 is not >= 70 but is >= 60." },
      { id: "py-m02-q4", prompt: "Python says SyntaxError: expected ':' on an if line. What's wrong?", options: ["The variable is misspelled", "The if line is missing its colon at the end", "You used == instead of =", "The list is empty"], answer: 1, explanation: "if, elif, else and for lines end with a colon." },
      { id: "py-m02-q5", prompt: "Which line correctly checks whether score is exactly 70?", options: ["if score = 70:", "if score == 70:", "if score === 70:", "if (score) 70:"], answer: 1, explanation: "== compares; = assigns." },
      { id: "py-m02-q6", prompt: "scores = [67, 81, 54]. What does print(scores[3]) give?", options: ["54", "None", "IndexError: list index out of range", "67"], answer: 2, explanation: "Three items have positions 0 to 2. Use scores[-1] for the last item." },
    ],
  },
  {
    id: "py-m03-check",
    courseId: C,
    kind: "module",
    moduleId: "py-m03",
    title: "Functions and a Mini Project: module check",
    passingScore: 60,
    questions: [
      { id: "py-m03-q1", prompt: "def area(w, h): w * h. What does print(area(3, 4)) show?", options: ["12", "None", "An error", "w * h"], answer: 1, explanation: "Without return, the function gives back None." },
      { id: "py-m03-q2", prompt: "student = {\"name\": \"Musa\", \"level\": 300}. What is student[\"level\"]?", options: ["\"level\"", "300", "Musa", "An error"], answer: 1, explanation: "A dictionary looks up a value by its key." },
      { id: "py-m03-q3", prompt: "student[\"Name\"] gives KeyError: 'Name'. Why?", options: ["Dictionaries can't hold names", "Keys must match exactly; the key is \"name\" in lower case", "The dictionary is empty", "You need a list instead"], answer: 1, explanation: "Use the exact key, or .get() with a default." },
      { id: "py-m03-q4", prompt: "spending = {\"Food\": 28000, \"Data\": 6000}. What is sum(spending.values())?", options: ["2", "34000", "\"Food\"", "28000"], answer: 1, explanation: ".values() gives the amounts; sum adds them." },
      { id: "py-m03-q5", prompt: "What does max(spending, key=spending.get) return for {\"Food\": 28000, \"Data\": 6000}?", options: ["28000", "\"Food\"", "\"Data\"", "6000"], answer: 1, explanation: "It returns the key whose value is largest." },
      { id: "py-m03-q6", prompt: "What does f\"{1234567:,.0f}\" produce?", options: ["1234567", "1,234,567", "1.234.567", "1,234,567.0"], answer: 1, explanation: ", adds thousands separators and .0f shows no decimals." },
    ],
  },
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
    ],
  },
];
