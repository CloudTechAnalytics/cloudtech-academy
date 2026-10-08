---
title: "JavaScript Basics: Variables, Types and the Console"
minutes: 35
summary: Meet JavaScript, the language that makes pages react. Learn variables, data types, operators, strings and numbers, print results to the console, and read error messages like a developer.
---

## What JavaScript does

HTML gives a page its structure and CSS gives it its look. **JavaScript** gives it a **brain**. With it a page can react when you click, check a form before it is sent, show and hide things, calculate a total, fetch fresh data, remember your settings, and much more. Everything you do on sites like Jumia, Twitter or Google Maps that is not just reading is JavaScript.

JavaScript is also a full programming language. In this lesson you learn its building blocks. They are the same ideas you will find in nearly every language, so time spent here pays off for years.

> [!NOTE]
> JavaScript and Java are different languages with similar names. They have nothing to do with each other.

## Running your first code: console.log

The simplest way to see what your code does is to **print** it. `console.log()` prints a value to the **console**, a special panel for developers. In this course the editor shows the console output right below the preview. In your own browser you open it with `F12`, then click **Console**.

Click into the code, change the message, and watch the output change.

```live
=== js
console.log("Hello, Lagos!");
console.log(2 + 3);
console.log("I am learning", "JavaScript");
```

Each `console.log` prints one line. Two things to notice: a piece of text goes in **quotes**, and a statement ends with a **semicolon** `;`.

On a real page, your JavaScript lives in a `<script>` element, or in a file you load with `<script src="script.js"></script>` just before `</body>`. In the editors, the **script.js** tab does this for you.

## Variables: named boxes for values

A **variable** is a name for a value, like a labelled box. You create one with `let` or `const`:

```js
const shopName = "Mama Ngozi's Kitchen";   // const: will not be reassigned
let customers = 12;                        // let: can change later
customers = customers + 1;                 // now it is 13
```

- **`const`** for values that will not be reassigned. Use this by default.
- **`let`** for values that will change.
- You may see **`var`** in older code. It has confusing rules, so avoid it.

Naming rules: use letters, digits, `_` and `$`, never start with a digit, and no spaces. By convention, JavaScript names use **camelCase**: `totalPrice`, `firstName`, `isLoggedIn`. Make names say what the value is.

```live
=== js
const price = 1200;
const quantity = 3;
let total = price * quantity;
console.log(total);

total = total + 500;     // let allows changing it
console.log(total);

// price = 1500;         // remove the // to see the error for a const
```

Remove the `//` in front of the last line. The console shows a red **TypeError**: you tried to change a `const`. Errors are not failure. They are the computer telling you exactly what is wrong, and you will learn to love them.

## Data types

Every value has a **type**. There are a few basic ones.

| Type | Example | Used for |
| :-- | :-- | :-- |
| **String** | `"Ada"`, `'Lagos'`, `` `Hello` `` | Text |
| **Number** | `42`, `3.14`, `-7` | Whole and decimal numbers |
| **Boolean** | `true`, `false` | Yes or no answers |
| **undefined** | `undefined` | A variable that has no value yet |
| **null** | `null` | A value that is deliberately empty |

Later you will meet **arrays** (lists) and **objects** (records), which hold many values. Use `typeof` to ask for the type of a value:

```live
=== js
console.log(typeof "hello");
console.log(typeof 42);
console.log(typeof true);
console.log(typeof undefined);

let notSetYet;
console.log(notSetYet);       // undefined

console.log(typeof "5");      // a string, even though it looks like a number
console.log("5" + 3);         // joins the text: "53"
console.log(5 + 3);           // adds the numbers: 8
```

That last pair matters. The `+` **adds numbers** but **joins strings**, so `"5" + 3` gives `"53"`. This is the most common source of bugs for beginners, and it is why knowing the type of a value matters.

## Strings

Strings are text, and JavaScript has many tools for them.

```live
=== js
const name = "  Ada Okafor  ";

console.log(name.length);               // how many characters
console.log(name.trim());               // remove spaces at the ends
console.log(name.trim().toUpperCase()); // ADA OKAFOR
console.log(name.includes("Okafor"));   // true
console.log(name.trim().slice(0, 3));   // first three characters: Ada
console.log(name.replace("Ada", "Bola"));
console.log("a,b,c".split(","));        // an array: ["a","b","c"]
```

Methods can be **chained**: `name.trim().toUpperCase()` trims, then upper-cases the result.

### Template literals: building text easily

Joining strings with `+` gets messy. **Template literals** use backticks `` ` `` and let you drop values straight into the text with `${...}`:

```live
=== js
const customer = "Ada";
const total = 3600;

console.log("Hello " + customer + ", your total is ₦" + total + ".");   // the old way
console.log(`Hello ${customer}, your total is ₦${total}.`);              // much nicer
console.log(`VAT is ₦${total * 0.075}`);                                 // any expression works
```

You can also write text over many lines inside backticks.

## Numbers and maths

```live
=== js
console.log(10 + 4);     // 14   add
console.log(10 - 4);     // 6    subtract
console.log(10 * 4);     // 40   multiply
console.log(10 / 4);     // 2.5  divide
console.log(10 % 4);     // 2    remainder (modulo)
console.log(2 ** 3);     // 8    power

console.log(Math.round(4.6));    // 5
console.log(Math.floor(4.9));    // 4   round down
console.log(Math.ceil(4.1));     // 5   round up
console.log(Math.max(3, 9, 5));  // 9
console.log(Math.random());      // a random number between 0 and 1

console.log((3600 * 0.075).toFixed(2));   // "270.00": two decimals, as text
console.log(Number("42") + 1);            // 43: turn text into a number
console.log(Number("hello"));             // NaN: not a number
console.log(0.1 + 0.2);                   // 0.30000000000000004 !
```

The last line surprises everyone. Computers store decimals in binary, so some, like 0.1, cannot be stored exactly. It is not a JavaScript bug. For money, either round with `toFixed(2)`, or work in the smallest unit (kobo) and convert at the end. The Web Development with JavaScript course covers this in depth.

`NaN` means "Not a Number", the result of a maths operation that makes no sense, like `Number("hello")`.

## Comparing values

Comparisons give a boolean, `true` or `false`:

| Operator | Meaning | Example |
| :-- | :-- | :-- |
| `===` | Equal (value and type) | `5 === 5` is `true`, `5 === "5"` is `false` |
| `!==` | Not equal | `5 !== 6` is `true` |
| `>` `<` `>=` `<=` | Greater, less | `10 >= 10` is `true` |
| `&&` | AND: both must be true | `age >= 18 && hasId` |
| `\|\|` | OR: at least one is true | `isMember \|\| hasCoupon` |
| `!` | NOT: flips it | `!isLoggedIn` |

> [!WARNING]
> Always use **three** equals signs, `===`, to compare. A single `=` assigns a value, and the double `==` tries to convert types, which gives surprises such as `0 == ""` being true.

```live
=== js
const age = 20;
const hasId = true;

console.log(age >= 18);
console.log(age >= 18 && hasId);
console.log(age < 18 || hasId);
console.log(!hasId);
console.log(5 === "5");
console.log(5 == "5");
```

## Reading error messages

Errors will happen every day for as long as you write code. The skill is reading them. A message tells you the type of error and where it happened.

| Error | Usually means |
| :-- | :-- |
| `ReferenceError: price is not defined` | You used a name that does not exist, often a typo |
| `TypeError: Assignment to constant variable` | You changed a `const` |
| `SyntaxError: Unexpected token` | A missing quote, bracket or comma |

```live
{ "title": "Fix the bugs (expect-error)" }
=== js
const shopName = "Mama Ngozi's Kitchen;
console.log(shopName);
```

This code has a missing closing quote. Find it, fix it, and see the console print the name. Then break something else on purpose. When something does not work, **read the message, find the line, look for a typo**.

> [!TIP]
> A professional habit: when your code does not work, add `console.log` lines to see the value of a variable at each step. This is called **debugging**, and it is most of the job.

## Try it

First, a price calculator. Use variables and template literals, and print the results.

```webtask
{
  "id": "web-m13-t1",
  "minutes": 10,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "You use const or let to create variables", "in": "js", "pattern": "\\b(const|let)\\s+[a-zA-Z_]\\w*\\s*=", "min": 3 },
    { "label": "You use a template literal with ${...}", "in": "js", "pattern": "`[^`]*\\$\\{[^}]+\\}[^`]*`" },
    { "label": "It prints the subtotal, 3600", "output": "\\b3,?600\\b" },
    { "label": "It prints the VAT of 7.5%, which is 270", "output": "\\b270(\\.00)?\\b" },
    { "label": "It prints the total, 3870", "output": "\\b3,?870(\\.00)?\\b" },
    { "label": "There are no errors in the console", "output": "(?<![\\s\\S])(?![\\s\\S]*Error)[\\s\\S]*\\S" }
  ],
  "hint": "const price = 1200; const quantity = 3; const subtotal = price * quantity; const vat = subtotal * 0.075; const total = subtotal + vat; console.log(`Subtotal: ₦${subtotal}`); and similar for the VAT and total.",
  "height": 280
}
=== prompt
A customer buys **3 items at ₦1,200 each**, and VAT is **7.5%**. Using variables, calculate the subtotal, the VAT and the total, and print each on its own line with `console.log` and a template literal, such as `Subtotal: ₦3600`.
=== js
// Write your code here
=== sample js
const price = 1200;
const quantity = 3;
const vatRate = 0.075;

const subtotal = price * quantity;
const vat = subtotal * vatRate;
const total = subtotal + vat;

console.log(`Subtotal: ₦${subtotal}`);
console.log(`VAT: ₦${vat.toFixed(2)}`);
console.log(`Total: ₦${total.toFixed(2)}`);
=== note
`toFixed(2)` makes sure money shows two decimals, and it avoids long numbers like 270.00000000000006 that floating point can produce.
```

Now clean up user input with string methods.

```webtask
{
  "id": "web-m13-t2",
  "minutes": 10,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "You use trim() and toLowerCase() on the email", "in": "js", "pattern": "\\.trim\\(\\)[\\s\\S]*\\.toLowerCase\\(\\)|\\.toLowerCase\\(\\)[\\s\\S]*\\.trim\\(\\)" },
    { "label": "It prints the cleaned email: ada.okafor@example.com", "output": "^ada\\.okafor@example\\.com$" },
    { "label": "It prints the length of the cleaned email, 22", "output": "^22$" },
    { "label": "It prints the user name before the @: ada.okafor", "output": "^ada\\.okafor$" },
    { "label": "It prints true or false for whether the email includes \"@\"", "output": "^(true|false)$" },
    { "label": "You use split(\"@\") or slice/indexOf to get the user name", "in": "js", "pattern": "split\\(\\s*[\"']@[\"']\\s*\\)|indexOf\\(\\s*[\"']@[\"']\\s*\\)" }
  ],
  "hint": "const clean = rawEmail.trim().toLowerCase(); console.log(clean); console.log(clean.length); console.log(clean.split(\"@\")[0]); console.log(clean.includes(\"@\"));",
  "height": 280
}
=== prompt
A visitor typed their email with extra spaces and capital letters. Clean it with `trim()` and `toLowerCase()`, then print on separate lines: **1)** the cleaned email, **2)** its length, **3)** the part before the `@` (use `split("@")[0]`), and **4)** whether it includes `"@"`.
=== js
const rawEmail = "  Ada.Okafor@Example.COM  ";

// Write your code below
=== sample js
const rawEmail = "  Ada.Okafor@Example.COM  ";

const clean = rawEmail.trim().toLowerCase();
console.log(clean);
console.log(clean.length);
console.log(clean.split("@")[0]);
console.log(clean.includes("@"));
```

```answer
{
  "id": "web-m13-a1",
  "prompt": "What does `\"5\" + 3` give in JavaScript? Type the result without quotes.",
  "answer": "53",
  "format": "text",
  "accept": ["\"53\"", "'53'", "the string 53", "53 (a string)"],
  "explanation": "When one side of + is a string, JavaScript joins them as text instead of adding, so \"5\" + 3 is the string \"53\". Convert with Number() if you want 8.",
  "required": true
}
```
