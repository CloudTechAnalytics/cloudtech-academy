---
title: "Decisions, Loops and Functions"
minutes: 35
summary: Teach your code to make decisions with if and switch, repeat work with loops, and package logic into reusable functions. Build a grade calculator, a discount function and a times table.
---

## Making decisions with if

Programs become useful when they can **choose**. The `if` statement runs a block of code only when a condition is true.

```js
if (age >= 18) {
  console.log("You can register.");
} else {
  console.log("Sorry, you must be 18 or older.");
}
```

The condition goes in brackets and must be true or false. Use `else if` for more than two options. JavaScript checks them from the top and runs the **first** one that is true.

```live
=== js
const score = 72;

if (score >= 70) {
  console.log("Grade A");
} else if (score >= 60) {
  console.log("Grade B");
} else if (score >= 50) {
  console.log("Grade C");
} else {
  console.log("Fail");
}
```

Change `score` to 65, 50 and 30 and watch the result. Notice that we do not need to write `score >= 70 && score <= 100` in the first branch. By the time the code reaches `else if`, we already know the score is below 70.

### Truthy and falsy

In a condition, JavaScript does not need a real `true` or `false`. Some values count as **falsy**: `false`, `0`, `""` (empty text), `null`, `undefined` and `NaN`. Everything else is **truthy**. So you can write:

```js
const name = "";
if (name) {
  console.log(`Hello ${name}`);
} else {
  console.log("Please enter your name.");   // runs, because "" is falsy
}
```

### The ternary operator

For a quick choice between two values, there is a short form: `condition ? valueIfTrue : valueIfFalse`.

```live
=== js
const isMember = true;
const price = 5000;

const finalPrice = isMember ? price * 0.9 : price;
console.log(`You pay ₦${finalPrice}`);

const stock = 0;
console.log(stock > 0 ? "In stock" : "Sold out");
```

### switch: one value, many cases

When you compare one value against many fixed options, `switch` reads more clearly than a long chain:

```live
=== js
const day = "Saturday";

switch (day) {
  case "Saturday":
  case "Sunday":
    console.log("Weekend: we open at 10 am.");
    break;
  case "Friday":
    console.log("Open until 10 pm.");
    break;
  default:
    console.log("Open 8 am to 6 pm.");
}
```

Each `case` needs a `break`, or the code falls through into the next case. (Above, Saturday and Sunday share a result on purpose.)

## Loops: repeating work

Imagine printing the numbers 1 to 100 by writing 100 lines. A **loop** repeats code for you.

### The for loop

```js
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
```

It has three parts inside the brackets, separated by semicolons:

1. `let i = 1`: the start. Runs once.
2. `i <= 5`: the condition. The loop continues while it is true.
3. `i++`: runs after each round. It adds 1 to `i`.

```live
=== js
for (let i = 1; i <= 5; i++) {
  console.log(`Round ${i}`);
}

let total = 0;
for (let n = 1; n <= 10; n++) {
  total = total + n;
}
console.log(`The sum of 1 to 10 is ${total}`);
```

### while

A `while` loop repeats as long as a condition is true. Use it when you do not know in advance how many rounds you need.

```live
=== js
let balance = 10000;
let years = 0;

while (balance < 20000) {
  balance = balance * 1.1;   // grows 10% a year
  years++;
}
console.log(`It takes ${years} years to double ₦10,000 at 10% a year.`);
```

> [!WARNING]
> If the condition never becomes false, the loop runs forever and freezes the page. Always make sure something inside the loop moves it towards finishing.

### Looping over a list

When you have a list of things (you will learn arrays properly in the next lesson), `for...of` visits each one:

```live
=== js
const items = ["Rice", "Beans", "Plantain"];

for (const item of items) {
  console.log(`Buy ${item}`);
}
```

Two helpful keywords: `break` stops a loop early, and `continue` skips to the next round.

## Functions: reusable recipes

A **function** is a named block of code you can run whenever you want, as many times as you want. It takes **inputs** (parameters) and can give back an **output** (a return value). Functions are the most important idea in programming: they let you write something once and reuse it.

```js
function addVat(price) {
  return price * 1.075;
}

console.log(addVat(1000));   // 1075
console.log(addVat(2000));   // 2150
```

- `function addVat(price)` **declares** the function. `price` is a parameter, a variable that exists only inside.
- `return` sends a value back and ends the function.
- `addVat(1000)` **calls** the function. `1000` is the argument.

```live
=== js
function greet(name) {
  return `Hello, ${name}! Welcome to CloudTech Academy.`;
}

console.log(greet("Ada"));
console.log(greet("Chidi"));

function area(width, height) {
  return width * height;
}
console.log(area(5, 4));
```

### Default values and arrow functions

You can give a parameter a default value for when it is not supplied. And modern JavaScript has a shorter way to write functions, the **arrow function**:

```live
=== js
function delivery(fee = 1500) {
  return `Delivery: ₦${fee}`;
}
console.log(delivery());       // uses the default
console.log(delivery(2500));

// The same idea as an arrow function
const double = (n) => n * 2;
console.log(double(21));

const fullName = (first, last) => `${first} ${last}`;
console.log(fullName("Ada", "Okafor"));
```

For a one-line arrow function, the result after `=>` is returned automatically. You will see arrow functions everywhere, especially as arguments to other functions (as you will soon see with events and arrays).

### Scope: where a variable lives

A variable made inside a function (or inside `{ }` with `let` and `const`) exists only there:

```live
=== js
function test() {
  const secret = 42;
  console.log(secret);     // works here
}
test();
// console.log(secret);    // would be a ReferenceError: secret is not defined here
```

This is helpful, because it stops different parts of your code from interfering with each other. A good rule: **keep variables as local as you can.**

### Functions that make decisions

Real programs combine all three ideas: a function that uses `if`, called from a loop.

```live
=== js
function discount(total) {
  if (total >= 50000) return total * 0.85;
  if (total >= 20000) return total * 0.9;
  return total;
}

const orders = [8000, 25000, 60000];
for (const order of orders) {
  console.log(`Order ₦${order} costs ₦${discount(order)}`);
}
```

## Try it

Write a function that turns a score into a grade, then use it for three students.

```webtask
{
  "id": "web-m14-t1",
  "minutes": 10,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "You wrote a function (function or arrow) for the grade", "in": "js", "pattern": "function\\s+\\w+\\s*\\(|(const|let)\\s+\\w+\\s*=\\s*\\([^)]*\\)\\s*=>|(const|let)\\s+\\w+\\s*=\\s*\\w+\\s*=>" },
    { "label": "It uses if / else if to choose the grade", "in": "js", "pattern": "\\bif\\s*\\(", "min": 2 },
    { "label": "The function is called at least three times", "in": "js", "pattern": "console\\.log\\(\\s*\\w*[gG]rade\\w*\\(|\\bgrade\\w*\\(\\s*\\d+", "min": 3 },
    { "label": "A score of 85 prints A", "output": "85\\D.*\\bA\\b" },
    { "label": "A score of 62 prints B", "output": "62\\D.*\\bB\\b" },
    { "label": "A score of 45 prints F", "output": "45\\D.*\\bF\\b" }
  ],
  "hint": "function grade(score) { if (score >= 70) return \"A\"; if (score >= 60) return \"B\"; if (score >= 50) return \"C\"; return \"F\"; } console.log(`85: ${grade(85)}`); and the same for 62 and 45.",
  "height": 280
}
=== prompt
Write a function `grade(score)` that returns `"A"` for 70 and above, `"B"` for 60 to 69, `"C"` for 50 to 59, and `"F"` below 50. Then print the grades for the scores **85, 62 and 45**, each on its own line, like `85: A`.
=== js
// Write your function and call it three times
=== sample js
function grade(score) {
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  return "F";
}

console.log(`85: ${grade(85)}`);
console.log(`62: ${grade(62)}`);
console.log(`45: ${grade(45)}`);
```

Now a loop. Print a multiplication table and add up some numbers.

```webtask
{
  "id": "web-m14-t2",
  "minutes": 10,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "You use a for or while loop", "in": "js", "pattern": "\\bfor\\s*\\(|\\bwhile\\s*\\(" },
    { "label": "It prints the first line of the 7 times table: 7 x 1 = 7", "output": "7\\D+1\\D+7\\b" },
    { "label": "It prints 7 x 5 = 35", "output": "7\\D+5\\D+35\\b" },
    { "label": "It prints the last line: 7 x 10 = 70", "output": "7\\D+10\\D+70\\b" },
    { "label": "It prints the sum of the numbers from 1 to 100, which is 5050", "output": "\\b5050\\b" },
    { "label": "There are no errors in the console", "output": "(?<![\\s\\S])(?![\\s\\S]*Error)[\\s\\S]*\\S" }
  ],
  "hint": "for (let i = 1; i <= 10; i++) { console.log(`7 x ${i} = ${7 * i}`); } let sum = 0; for (let n = 1; n <= 100; n++) { sum += n; } console.log(`Sum: ${sum}`);",
  "height": 280
}
=== prompt
Use a loop to print the **7 times table** from 7 x 1 to 7 x 10, each on its own line like `7 x 3 = 21`. Then use another loop to add up the numbers from **1 to 100** and print the total.
=== js
// Write your loops here
=== sample js
for (let i = 1; i <= 10; i++) {
  console.log(`7 x ${i} = ${7 * i}`);
}

let sum = 0;
for (let n = 1; n <= 100; n++) {
  sum = sum + n;
}
console.log(`Sum of 1 to 100: ${sum}`);
```

```answer
{
  "id": "web-m14-a1",
  "prompt": "What does `function add(a, b) { return a + b; }` give back for `add(2, 3)`? Type the number.",
  "answer": "5",
  "format": "number",
  "explanation": "The function adds its two arguments and returns the result, which the call add(2, 3) becomes.",
  "required": true
}
```
