---
title: "Arrays, Objects and JSON"
minutes: 40
summary: Work with real data. Store lists in arrays and records in objects, transform them with map, filter and reduce, and exchange data with the rest of the web using JSON.
---

## Why we need collections

So far each variable held one value. Real applications hold **many**: a list of products, a set of customers, the lessons in a course. JavaScript has two structures for this, and nearly everything you build will use them:

- An **array** is an ordered **list**: `["Rice", "Beans", "Yam"]`.
- An **object** is a **record** of named values: `{ name: "Ada", age: 22 }`.

## Arrays

```js
const fruits = ["Mango", "Orange", "Pawpaw"];
```

Items have a position called an **index**, and counting starts at **0**.

```live
=== js
const fruits = ["Mango", "Orange", "Pawpaw"];

console.log(fruits[0]);        // Mango, the first
console.log(fruits[2]);        // Pawpaw
console.log(fruits.length);    // 3
console.log(fruits[fruits.length - 1]);   // the last one, whatever the length

fruits.push("Banana");         // add to the end
console.log(fruits);

const removed = fruits.pop();  // remove from the end
console.log(removed, fruits);

console.log(fruits.includes("Orange"));   // true
console.log(fruits.indexOf("Pawpaw"));    // 2
console.log(fruits.join(" | "));          // Mango | Orange | Pawpaw
```

Other everyday methods: `unshift` and `shift` add and remove at the **start**, `slice(start, end)` copies a part, and `splice(start, count)` removes items in the middle. You can copy and combine arrays with the **spread** operator: `const more = [...fruits, "Guava"];`.

> [!NOTE]
> `const` stops you from replacing the array with a different one, but you can still add and remove items inside it.

## Looping through an array

```live
=== js
const prices = [1200, 850, 2300];

for (const price of prices) {
  console.log(price);
}

prices.forEach((price, index) => {
  console.log(`Item ${index + 1} costs ₦${price}`);
});
```

`forEach` runs a function for each item. The function you pass is an arrow function, which you met in the last lesson.

## The big three: map, filter and reduce

These three array methods do most of the daily work of a web developer. Each takes a function and gives back a **new** result, leaving the original untouched.

### map: transform every item

```live
=== js
const prices = [1200, 850, 2300];

const withVat = prices.map((price) => price * 1.075);
console.log(withVat);

const labels = prices.map((price) => `₦${price}`);
console.log(labels);
```

`map` returns an array of the **same length**, with each item transformed.

### filter: keep some items

```live
=== js
const prices = [1200, 850, 2300, 500];

const cheap = prices.filter((price) => price < 1000);
console.log(cheap);       // [850, 500]
```

`filter` keeps only the items for which the function returns `true`.

### reduce: boil a list down to one value

```live
=== js
const prices = [1200, 850, 2300];

const total = prices.reduce((sum, price) => sum + price, 0);
console.log(total);       // 4350
```

`reduce` carries a running value (`sum`) through the list. The `0` at the end is its starting value. It can total, count, find a maximum, or build anything.

### find, some, every and sort

```live
=== js
const scores = [72, 45, 88, 60];

console.log(scores.find((s) => s > 80));         // 88: the first match
console.log(scores.some((s) => s < 50));         // true: is there at least one?
console.log(scores.every((s) => s >= 40));       // true: are all of them?

// sort changes the array. Numbers need a comparison function!
const sorted = [...scores].sort((a, b) => a - b);
console.log(sorted);                              // [45, 60, 72, 88]
console.log([10, 9, 1].sort());                   // [1, 10, 9]  wrong: sorted as text
```

Without a comparison function, `sort` orders items as **text**, so 10 comes before 9. Always pass `(a, b) => a - b` for numbers.

## Objects

An object groups related values under **keys**, written as `key: value` pairs.

```live
=== js
const student = {
  name: "Ada Okafor",
  age: 22,
  isEnrolled: true,
  skills: ["HTML", "CSS"],
  address: { city: "Enugu", state: "Enugu" }
};

console.log(student.name);              // dot notation
console.log(student["age"]);            // bracket notation, for keys held in variables
console.log(student.skills[1]);         // CSS
console.log(student.address.city);      // nested: Enugu

student.age = 23;                       // change a value
student.email = "ada@example.com";      // add a new key
delete student.isEnrolled;              // remove a key
console.log(student);

console.log(Object.keys(student));      // the key names
console.log(student?.phone?.number);    // undefined, no crash (optional chaining)
```

Use `?.` (optional chaining) to read something that might not exist, without an error when it is missing.

### Methods: functions inside objects

```live
=== js
const cart = {
  items: [1200, 850],
  total() {
    return this.items.reduce((sum, p) => sum + p, 0);
  },
};
console.log(cart.total());
```

### Destructuring: unpacking values

```live
=== js
const product = { name: "Ankara bag", price: 12000, inStock: true };

const { name, price } = product;
console.log(name, price);

const [first, second] = ["Rice", "Beans", "Yam"];
console.log(first, second);
```

## Arrays of objects: the shape of real data

Almost all real data, whether from a database or an API, is an **array of objects**: a list where each item is a record. It is the shape you will use most. Study this example carefully, because you will use these patterns all the time.

```live
=== js
const products = [
  { name: "Ankara bag", price: 12000, inStock: true },
  { name: "Sandals", price: 18500, inStock: false },
  { name: "Necklace", price: 6000, inStock: true },
  { name: "Scarf", price: 8500, inStock: true },
];

// Names of the products in stock
const available = products.filter((p) => p.inStock).map((p) => p.name);
console.log(available);

// The total value of everything in stock
const stockValue = products.filter((p) => p.inStock).reduce((sum, p) => sum + p.price, 0);
console.log(`Stock value: ₦${stockValue}`);

// The cheapest product
const cheapest = products.reduce((min, p) => (p.price < min.price ? p : min));
console.log(cheapest.name);

// Sorted from most to least expensive, without changing the original
const byPrice = [...products].sort((a, b) => b.price - a.price);
console.log(byPrice.map((p) => `${p.name}: ₦${p.price}`));

// Find one by name
console.log(products.find((p) => p.name === "Scarf"));
```

Methods chain: `filter(...).map(...)` filters first, then transforms what is left.

## JSON: data as text

When a browser asks a server for data, or when you save data in the browser, it has to travel as **text**. The standard format is **JSON** (JavaScript Object Notation). It looks almost exactly like a JavaScript object, with two rules: **keys are in double quotes**, and there are no functions or comments.

```json
{"id": 7, "title": "Pay rent", "done": false, "tags": ["home", "money"]}
```

Two functions convert between JavaScript values and JSON text:

- `JSON.stringify(value)` turns a value into JSON text.
- `JSON.parse(text)` turns JSON text back into a value.

```live
=== js
const task = { id: 7, title: "Pay rent", done: false, tags: ["home", "money"] };

const text = JSON.stringify(task);
console.log(text);
console.log(typeof text);          // string

const back = JSON.parse(text);
console.log(back.title);
console.log(typeof back);          // object

console.log(JSON.stringify(task, null, 2));   // pretty-printed
```

You will use exactly this to talk to servers in lesson 18, and to store data in the browser.

## Try it

Work with a list of products. Use `filter`, `map` and `reduce`.

```webtask
{
  "id": "web-m15-t1",
  "minutes": 12,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "You use filter()", "in": "js", "pattern": "\\.filter\\(" },
    { "label": "You use reduce() to add up a total", "in": "js", "pattern": "\\.reduce\\(" },
    { "label": "It prints the names of the in-stock products under ₦10,000: Scarf and Basket", "output": "Scarf[\\s\\S]*Basket|Basket[\\s\\S]*Scarf" },
    { "label": "It does not print Necklace (it is out of stock)", "output": "(?<![\\s\\S])(?![\\s\\S]*Necklace)[\\s\\S]*\\S" },
    { "label": "It prints the total value of the in-stock products, 48000", "output": "\\b48,?000\\b" },
    { "label": "It prints the most expensive product, Sandals", "output": "Sandals" }
  ],
  "hint": "const cheapInStock = products.filter((p) => p.inStock && p.price < 10000).map((p) => p.name); const stockValue = products.filter((p) => p.inStock).reduce((sum, p) => sum + p.price, 0); const priciest = products.reduce((max, p) => (p.price > max.price ? p : max)); then console.log each result.",
  "height": 300
}
=== prompt
Using the `products` array: **1)** print the names of the products that are **in stock and cost under ₦10,000**; **2)** print the **total value of all the in-stock products**; **3)** print the **name of the most expensive product** (in stock or not). Use `filter`, `map` and `reduce`.
=== js
const products = [
  { name: "Ankara bag", price: 12000, inStock: true },
  { name: "Sandals", price: 18500, inStock: true },
  { name: "Necklace", price: 6000, inStock: false },
  { name: "Scarf", price: 8500, inStock: true },
  { name: "Basket", price: 9000, inStock: true },
];

// Write your code below
=== sample js
const products = [
  { name: "Ankara bag", price: 12000, inStock: true },
  { name: "Sandals", price: 18500, inStock: true },
  { name: "Necklace", price: 6000, inStock: false },
  { name: "Scarf", price: 8500, inStock: true },
  { name: "Basket", price: 9000, inStock: true },
];

const cheapInStock = products.filter((p) => p.inStock && p.price < 10000).map((p) => p.name);
console.log(cheapInStock);

const stockValue = products.filter((p) => p.inStock).reduce((sum, p) => sum + p.price, 0);
console.log(`Stock value: ₦${stockValue}`);

const priciest = products.reduce((max, p) => (p.price > max.price ? p : max));
console.log(priciest.name);
```

Now objects and JSON.

```webtask
{
  "id": "web-m15-t2",
  "minutes": 10,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "You create an object with name, age and a skills array", "in": "js", "pattern": "name\\s*:[\\s\\S]*age\\s*:[\\s\\S]*skills\\s*:\\s*\\[" },
    { "label": "It prints the second skill, CSS, by index", "output": "^CSS$" },
    { "label": "You add a city property, and the JSON text printed contains \"city\":\"Lagos\"", "output": "\"city\":\"Lagos\"" },
    { "label": "You use JSON.stringify", "in": "js", "pattern": "JSON\\.stringify\\(" },
    { "label": "You use JSON.parse and print the title from the text: Pay rent", "in": "js", "pattern": "JSON\\.parse\\(" },
    { "label": "It prints Pay rent", "output": "^Pay rent$" }
  ],
  "hint": "const student = { name: \"Ada\", age: 22, skills: [\"HTML\", \"CSS\"] }; console.log(student.skills[1]); student.city = \"Lagos\"; console.log(JSON.stringify(student)); const task = JSON.parse(text); console.log(task.title);",
  "height": 300
}
=== prompt
**1)** Create an object `student` with `name`, `age` and a `skills` array containing `"HTML"` and `"CSS"`. Print the **second skill**. **2)** Add a `city` property with the value `"Lagos"`, and print the object as JSON text with `JSON.stringify`. **3)** Parse the JSON text `text` below with `JSON.parse` and print its `title`.
=== js
const text = '{"id": 7, "title": "Pay rent", "done": false}';

// Write your code below
=== sample js
const text = '{"id": 7, "title": "Pay rent", "done": false}';

const student = { name: "Ada", age: 22, skills: ["HTML", "CSS"] };
console.log(student.skills[1]);

student.city = "Lagos";
console.log(JSON.stringify(student));

const task = JSON.parse(text);
console.log(task.title);
```

```answer
{
  "id": "web-m15-a1",
  "prompt": "What is the index of `\"Beans\"` in `[\"Rice\", \"Beans\", \"Yam\"]`? Type the number.",
  "answer": "1",
  "format": "number",
  "explanation": "Array positions start at 0, so Rice is 0, Beans is 1 and Yam is 2.",
  "required": true
}
```
