---
title: "Fetch, Async Code and Local Storage"
minutes: 35
summary: Get live data from the internet with fetch, understand promises and async/await, handle loading, empty and error states properly, and remember things in the browser with localStorage.
---

## Code that has to wait

Some things take time: downloading data from a server, waiting for a timer, reading a file. If JavaScript froze while waiting, the whole page would hang. So JavaScript starts these jobs, carries on with other work, and comes back when the result is ready. This is called **asynchronous** code.

You have already used the idea. Here a timer runs a function **later**, while the rest of the code does not wait:

```live
=== js
console.log("1. Start");

setTimeout(() => {
  console.log("3. This runs after one second");
}, 1000);

console.log("2. This runs immediately");
```

The output order is 1, 2, 3, not 1, 3, 2. `setInterval` is the same but repeats, for example every second for a clock.

## Promises and async/await

A **promise** is an object that stands for a result that will arrive later: "I promise to give you a value, or an error". Modern JavaScript lets you work with promises using two keywords that make the code read top to bottom:

- `async` before a function means "this function does waiting work".
- `await` inside it means "pause here until the promise has a result".

```live
=== js
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log("Cooking...");
  await wait(1000);          // pause here, but the page stays responsive
  console.log("Ready to serve!");
}

run();
```

## fetch: getting data from a server

`fetch(url)` asks a server for something and returns a promise. The pattern has three steps:

1. `await fetch(url)` gets the **response**.
2. Check `response.ok` to see if it worked (status 200 to 299).
3. `await response.json()` reads the body as JSON and turns it into a JavaScript value.

To keep these examples working without an internet connection, they fetch from a small piece of JSON built into the address (a `data:` URL). A real address works exactly the same way.

```live
=== js
const url = 'data:application/json,[{"name":"Rice","price":1500},{"name":"Beans","price":1200}]';

async function loadProducts() {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("The server said no");
  }
  const products = await response.json();
  console.log(products);
  console.log(`First product: ${products[0].name}`);
}

loadProducts();
```

## A real API

An **API** is a way for one program to ask another for data. Many are free. This one, from Open-Meteo, gives the current weather for any place using its latitude and longitude, and needs no account. Run it, and then try other coordinates. (Abuja is about 9.07, 7.40.)

```live
{ "title": "Needs internet: the weather in Lagos" }
=== html
<h2>Lagos weather</h2>
<p id="out">Loading...</p>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
=== js
async function showWeather() {
  const out = document.querySelector("#out");
  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=6.52&longitude=3.38&current_weather=true";
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    out.textContent = `It is ${data.current_weather.temperature}°C with wind at ${data.current_weather.windspeed} km/h.`;
  } catch (error) {
    out.textContent = "Could not load the weather. Check your connection.";
  }
}
showWeather();
```

## Handling errors: try, catch, finally

Networks fail. Servers go down. Data arrives in a shape you did not expect. A professional page **always** plans for failure, using `try` and `catch`:

```js
try {
  // code that might fail
} catch (error) {
  // runs only if something above threw an error
} finally {
  // runs either way, handy for hiding a loading spinner
}
```

> [!WARNING]
> `fetch` only fails (throws) when the **network** fails. A response such as 404 Not Found or 500 Server Error is **not** an exception, so you must check `response.ok` yourself.

## The three states of any data screen

Whenever a page shows data from somewhere else, design **three** states, not one:

| State | What the user sees |
| :-- | :-- |
| **Loading** | A message or spinner, so they know something is happening |
| **Error** | A clear message and, if possible, a way to try again |
| **Empty or success** | The data, or a friendly "nothing here yet" |

```live
{ "stack": true, "height": 340 }
=== html
<button id="good">Load products</button>
<button id="bad">Load broken data</button>
<p id="status" role="status"></p>
<ul id="items"></ul>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
button { padding: 8px 14px; border-radius: 8px; border: 1px solid #0f766e; background: white; cursor: pointer; margin-right: 6px; }
.error { color: #b91c1c; }
=== js
const GOOD = 'data:application/json,[{"name":"Rice","price":1500},{"name":"Beans","price":1200},{"name":"Yam","price":2500}]';
const BAD = 'data:application/json,{oops';

const status = document.querySelector("#status");
const items = document.querySelector("#items");

async function loadItems(url) {
  status.className = "";
  status.textContent = "Loading...";          // state 1: loading
  items.innerHTML = "";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Bad response");
    const data = await response.json();
    if (data.length === 0) {
      status.textContent = "Nothing here yet.";   // empty state
      return;
    }
    data.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name}: ₦${item.price}`;
      items.append(li);
    });
    status.textContent = `Loaded ${data.length} items`;   // success
  } catch (error) {
    status.className = "error";                           // state 2: error
    status.textContent = "Could not load items. Please try again.";
  }
}

document.querySelector("#good").addEventListener("click", () => loadItems(GOOD));
document.querySelector("#bad").addEventListener("click", () => loadItems(BAD));
```

Click both buttons. The broken data makes `response.json()` throw, and the `catch` turns that into a friendly message instead of a blank page and a console error.

## Sending data: POST requests

To **send** data, give `fetch` a second argument describing the request. You will use this when you build real applications:

```js
const response = await fetch("https://example.com/api/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ item: "Ankara bag", quantity: 2 }),
});
const result = await response.json();
```

The method is `POST`, the headers say the body is JSON, and the body is your data converted with `JSON.stringify`. (This example address does not exist, so it is shown rather than run.)

## localStorage: remembering things

`localStorage` lets a page save small pieces of text **in the visitor's browser**. The data stays even after they close the tab. It is perfect for settings (dark mode), a draft message, or a shopping cart. It stores only **strings**, so objects and arrays go through `JSON.stringify` and `JSON.parse`.

```live
=== js
localStorage.setItem("theme", "dark");
console.log(localStorage.getItem("theme"));        // dark
console.log(localStorage.getItem("nothing"));      // null: never saved

const cart = [{ item: "Rice", qty: 2 }];
localStorage.setItem("cart", JSON.stringify(cart));      // save an array as text

const saved = JSON.parse(localStorage.getItem("cart") || "[]");   // read it back safely
console.log(saved[0].item);

localStorage.removeItem("theme");
```

The `|| "[]"` is a safe default for the first visit, when nothing has been saved yet and `getItem` returns `null`.

> [!NOTE]
> In these lesson editors, `localStorage` is provided by the preview and lasts only until the preview reloads. On a real published site it persists, per website and per browser. Never store passwords or other secrets in it: any script on the page can read it.

A classic use is a dark mode that remembers your choice:

```live
=== html
<button id="theme">Toggle theme</button>
<p>Your choice is saved with localStorage.</p>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; background: white; color: #1f2937; }
body.dark { background: #111827; color: #f3f4f6; }
button { padding: 10px 18px; border-radius: 8px; cursor: pointer; }
=== js
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

document.querySelector("#theme").addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});
```

## Try it

Load data with fetch and handle success and failure.

```webtask
{
  "id": "web-m18-t1",
  "minutes": 15,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "You use async, await and fetch", "in": "js", "pattern": "async[\\s\\S]*await\\s+fetch\\(" },
    { "label": "You check response.ok", "in": "js", "pattern": "\\.ok\\b" },
    { "label": "You use try and catch to handle failure", "in": "js", "pattern": "try\\s*\\{[\\s\\S]*catch\\s*\\(" },
    { "label": "The list #items shows the three products as <li> elements", "selector": "#items li", "min": 3, "max": 3 },
    { "label": "The first item shows Rice and its price 1500", "selector": "#items li", "contains": "Rice.*1,?500" },
    { "label": "The status tells the user: Loaded 3 items", "selector": "#status", "contains": "Loaded 3 items" }
  ],
  "hint": "async function loadItems(url) { try { const response = await fetch(url); if (!response.ok) throw new Error(\"Bad response\"); const data = await response.json(); data.forEach((item) => { const li = document.createElement(\"li\"); li.textContent = `${item.name}: ₦${item.price}`; items.append(li); }); status.textContent = `Loaded ${data.length} items`; } catch (error) { status.textContent = \"Could not load items.\"; } } loadItems(GOOD);",
  "height": 320
}
=== prompt
Write `async function loadItems(url)`. Inside a `try`, `await fetch(url)`, check `response.ok`, parse the JSON, add an `<li>` for each item to `#items` with text like `Rice: ₦1500`, and set `#status` to `Loaded 3 items` (using the real count). In the `catch`, set `#status` to `Could not load items.`. Then call it with `GOOD`.
=== html
<p id="status" role="status">Loading...</p>
<ul id="items"></ul>
=== js
const GOOD = 'data:application/json,[{"name":"Rice","price":1500},{"name":"Beans","price":1200},{"name":"Yam","price":2500}]';
const BAD = 'data:application/json,{oops';

const status = document.querySelector("#status");
const items = document.querySelector("#items");

// Write loadItems below, and then call loadItems(GOOD)
=== sample js
const GOOD = 'data:application/json,[{"name":"Rice","price":1500},{"name":"Beans","price":1200},{"name":"Yam","price":2500}]';
const BAD = 'data:application/json,{oops';

const status = document.querySelector("#status");
const items = document.querySelector("#items");

async function loadItems(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Bad response");
    const data = await response.json();
    data.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name}: ₦${item.price}`;
      items.append(li);
    });
    status.textContent = `Loaded ${data.length} items`;
  } catch (error) {
    status.textContent = "Could not load items.";
  }
}

loadItems(GOOD);
=== note
Try changing the last line to `loadItems(BAD)` and see the error message appear. A page that handles failure kindly is a page people trust.
```

Now remember data between visits with localStorage.

```webtask
{
  "id": "web-m18-t2",
  "minutes": 8,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "You save the tasks array under the key \"tasks\" with JSON.stringify", "in": "js", "pattern": "localStorage\\.setItem\\(\\s*[\"']tasks[\"']\\s*,\\s*JSON\\.stringify\\(" },
    { "label": "You read it back with getItem and JSON.parse", "in": "js", "pattern": "JSON\\.parse\\(\\s*localStorage\\.getItem\\(\\s*[\"']tasks[\"']" },
    { "label": "It prints how many tasks were loaded: 2", "output": "^2$" },
    { "label": "It prints the first task's text: Pay rent", "output": "^Pay rent$" },
    { "label": "It prints the number of tasks that are done: 1", "output": "^Done: 1$" }
  ],
  "hint": "localStorage.setItem(\"tasks\", JSON.stringify(tasks)); const loaded = JSON.parse(localStorage.getItem(\"tasks\") || \"[]\"); console.log(loaded.length); console.log(loaded[0].text); console.log(`Done: ${loaded.filter((t) => t.done).length}`);",
  "height": 280
}
=== prompt
Save the `tasks` array in `localStorage` under the key `tasks`, then load it back (use `|| "[]"` as a safe default). Print: **1)** how many tasks you loaded, **2)** the text of the first task, **3)** `Done: ` followed by how many tasks are done.
=== js
const tasks = [
  { text: "Pay rent", done: false },
  { text: "Buy data", done: true },
];

// Write your code below
=== sample js
const tasks = [
  { text: "Pay rent", done: false },
  { text: "Buy data", done: true },
];

localStorage.setItem("tasks", JSON.stringify(tasks));

const loaded = JSON.parse(localStorage.getItem("tasks") || "[]");
console.log(loaded.length);
console.log(loaded[0].text);
console.log(`Done: ${loaded.filter((t) => t.done).length}`);
```

```answer
{
  "id": "web-m18-a1",
  "prompt": "`fetch` returns a response for a page that does not exist (a 404). Which property tells you if the request succeeded? Type its name, like `response.status`.",
  "answer": "response.ok",
  "format": "text",
  "accept": ["ok", ".ok", "response.ok"],
  "explanation": "fetch only throws on network failure. A 404 or 500 still gives a response, so you must check response.ok yourself.",
  "required": true
}
```
