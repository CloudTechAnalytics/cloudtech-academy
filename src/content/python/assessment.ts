import type { AssessmentDef } from "../types";

const C = "python-for-beginners";

/** Python for Beginners: a check for each module (it awards the module badge) and a final assessment. */
export const PY_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "py-m01-check",
    courseId: C,
    kind: "module",
    moduleId: "py-m01",
    title: "First Steps in Python: module check",
    passingScore: 60,
    questions: [
      { id: "py-m01-q1", prompt: "What does print(\"Hi\") do?", options: ["Shows Hi as output", "Saves a file called Hi", "Prints on paper", "Creates a variable"], answer: 0, explanation: "print() displays output." },
      { id: "py-m01-q2", prompt: "Which is a valid variable name?", options: ["first_name", "first name", "1name", "first-name"], answer: 0, explanation: "Use lowercase and underscores; no spaces, hyphens or leading numbers." },
      { id: "py-m01-q3", prompt: "What type is \"Lagos\"?", options: ["str", "int", "float", "bool"], answer: 0, explanation: "Text in quotes is a string." },
      { id: "py-m01-q4", prompt: "What is 2500 * 4?", options: ["10000", "25004", "2504", "625"], answer: 0, explanation: "* multiplies." },
      { id: "py-m01-q5", prompt: "What does \"5\" + \"5\" give?", options: ["\"55\"", "10", "An error", "\"10\""], answer: 0, explanation: "Adding strings joins them." },
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
      { id: "py-m02-q1", prompt: "Which operator checks whether two values are equal?", options: ["==", "=", "!=", "=>"], answer: 0, explanation: "= assigns; == compares." },
      { id: "py-m02-q2", prompt: "How does Python know which lines belong inside an if?", options: ["Indentation", "Curly brackets", "Semicolons", "Line numbers"], answer: 0, explanation: "Indented lines after the colon belong to the block." },
      { id: "py-m02-q3", prompt: "With courses = [\"ECO\", \"STA\", \"GST\"], what is courses[0]?", options: ["\"ECO\"", "\"STA\"", "\"GST\"", "An error"], answer: 0, explanation: "Counting starts at 0." },
      { id: "py-m02-q4", prompt: "What does len([67, 81, 54]) return?", options: ["3", "202", "81", "54"], answer: 0, explanation: "len counts the items." },
      { id: "py-m02-q5", prompt: "Which numbers does range(1, 5) produce?", options: ["1, 2, 3, 4", "1, 2, 3, 4, 5", "0 to 5", "5 only"], answer: 0, explanation: "range stops before the second number." },
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
      { id: "py-m03-q1", prompt: "Which keyword defines a function?", options: ["def", "function", "func", "define"], answer: 0, explanation: "def grade(score): starts a function." },
      { id: "py-m03-q2", prompt: "What does return do?", options: ["Sends a result back from a function", "Restarts the program", "Prints to the screen", "Deletes a variable"], answer: 0, explanation: "The caller receives the returned value." },
      { id: "py-m03-q3", prompt: "How do you get the name from student = {\"name\": \"Musa\"}?", options: ["student[\"name\"]", "student.name()", "student[0]", "name[student]"], answer: 0, explanation: "Use the key in square brackets." },
      { id: "py-m03-q4", prompt: "Which loops through a dictionary's keys and values together?", options: ["for key, value in d.items():", "for d in range():", "while d:", "for key in d.values():"], answer: 0, explanation: ".items() gives each key and value pair." },
      { id: "py-m03-q5", prompt: "What does sum(spending.values()) calculate?", options: ["The total of all amounts", "The number of items", "The largest amount", "The first key"], answer: 0, explanation: "It adds up every value." },
    ],
  },
  {
    id: "python-for-beginners-final",
    courseId: C,
    kind: "final",
    title: "Python for Beginners: final assessment",
    passingScore: 60,
    questions: [
      { id: "py-f01", prompt: "Which free tool runs Python in your browser?", options: ["Google Colab", "Microsoft Paint", "Canva", "WhatsApp Web"], answer: 0, explanation: "Colab needs only a Google account." },
      { id: "py-f02", prompt: "What type is 3.75?", options: ["float", "int", "str", "bool"], answer: 0, explanation: "Decimals are floats." },
      { id: "py-f03", prompt: "What does f\"{name} is {age}\" do?", options: ["Puts the variables' values inside the text", "Creates a file", "Prints the letter f", "Causes an error"], answer: 0, explanation: "f-strings insert values into text." },
      { id: "py-f04", prompt: "score = 55. Which branch runs: if score >= 70 … elif score >= 50 … else …?", options: ["The elif branch", "The if branch", "The else branch", "None of them"], answer: 0, explanation: "55 fails the first test and passes the second." },
      { id: "py-f05", prompt: "What does scores.append(90) do?", options: ["Adds 90 to the end of the list", "Removes 90", "Sorts the list", "Replaces the first item"], answer: 0, explanation: "append adds one item to the end." },
      { id: "py-f06", prompt: "Why use a function?", options: ["To reuse code without repeating it", "To make code slower", "To store images", "To connect to Wi-Fi"], answer: 0, explanation: "Write once, call many times." },
      { id: "py-f07", prompt: "What is a dictionary?", options: ["A collection of key: value pairs", "A list of numbers only", "A type of loop", "A Colab setting"], answer: 0, explanation: "Dictionaries map keys to values." },
      { id: "py-f08", prompt: "What does int(\"20\") return?", options: ["The number 20", "The text \"20\"", "An error", "20.0 as text"], answer: 0, explanation: "int() converts text to a whole number." },
    ],
  },
];
