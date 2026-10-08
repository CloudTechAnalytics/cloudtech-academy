---
title: "Events and Forms: Making Pages Interactive"
minutes: 40
summary: Respond to clicks, typing and form submissions. Read what users enter, validate it with friendly messages, build a counter, a dark mode switch, a menu toggle and a to-do list, and keep the page accessible.
---

## Events: things that happen on a page

A page is full of **events**: a click, a key press, text typed in a box, a form submitted, the mouse moving over something, the page finishing loading. JavaScript lets you **listen** for an event on an element and run a function when it happens.

```js
element.addEventListener("click", function () {
  // runs every time the element is clicked
});
```

The recipe is always the same three steps from the last lesson: **find** the element, **listen** for the event, **change** the page.

```live
=== html
<button id="order">Order now</button>
<p id="message">Nothing ordered yet.</p>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
button { background: #0f766e; color: white; border: 0; padding: 12px 24px; border-radius: 8px; font-size: 1rem; cursor: pointer; }
=== js
const button = document.querySelector("#order");
const message = document.querySelector("#message");

button.addEventListener("click", () => {
  message.textContent = "Thank you! Your bread is on the way.";
});
```

Click the button in the preview. The function you pass is called a **callback**: you hand it over and the browser calls it later, at the right moment.

### The event object

The browser gives your callback an **event object** with details about what happened. Its most useful parts are `event.target` (the element that was clicked) and `event.key` (the key pressed).

```live
=== html
<ul id="menu">
  <li>Jollof rice</li>
  <li>Fried rice</li>
  <li>Ofada rice</li>
</ul>
<p id="chosen">Click a dish.</p>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
li { cursor: pointer; padding: 6px; }
li:hover { background: #ccfbf1; }
=== js
const menu = document.querySelector("#menu");
const chosen = document.querySelector("#chosen");

menu.addEventListener("click", (event) => {
  chosen.textContent = `You picked: ${event.target.textContent}`;
});
```

Notice we listened on the **list**, not on every item. A click on an item **bubbles up** to its parent, so one listener handles any number of items, even ones added later. This is called **event delegation**, and it keeps code short and fast.

## The events you will use most

| Event | Fires when | Typical use |
| :-- | :-- | :-- |
| `click` | An element is clicked or tapped | Buttons, menus, cards |
| `input` | The value of a field changes, on every keystroke | Live search, character counters |
| `change` | A field is changed and then left | Dropdowns, checkboxes |
| `submit` | A form is submitted | Validate and send forms |
| `keydown` | A key is pressed | Shortcuts, pressing Enter |
| `mouseover` | The pointer enters an element | Hover effects (CSS does most) |
| `DOMContentLoaded` | The page's HTML is ready | Running setup code |

## A counter: state plus display

Most interactive things follow one pattern: keep the **state** (the data) in a variable, change it in an event handler, and then **update the display** from it.

```live
=== html
<p>Tickets: <strong id="count">0</strong></p>
<button id="minus">-</button>
<button id="plus">+</button>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; font-size: 1.2rem; }
button { width: 44px; height: 44px; font-size: 1.4rem; border-radius: 8px; border: 1px solid #0f766e; background: white; cursor: pointer; }
=== js
let count = 0;
const display = document.querySelector("#count");

function render() {
  display.textContent = count;
}

document.querySelector("#plus").addEventListener("click", () => {
  count++;
  render();
});

document.querySelector("#minus").addEventListener("click", () => {
  if (count > 0) count--;      // never below zero
  render();
});
```

## Forms: reading what the user typed

A text input has a `value`. To read it, use `input.value`. A checkbox has `checked` (true or false). For a form, listen for `submit` and call `event.preventDefault()` to stop the browser from reloading the page, so that **you** decide what happens.

```live
=== html
<form id="signup" novalidate>
  <p>
    <label for="name">Your name</label><br />
    <input id="name" name="name" type="text" />
  </p>
  <p>
    <label for="email">Email</label><br />
    <input id="email" name="email" type="email" />
  </p>
  <button type="submit">Join</button>
</form>
<p id="error" role="alert" style="color: #b91c1c"></p>
<p id="result"></p>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
input { padding: 8px; border: 1px solid #9ca3af; border-radius: 6px; }
button { background: #0f766e; color: white; border: 0; padding: 10px 22px; border-radius: 8px; cursor: pointer; }
=== js
const form = document.querySelector("#signup");
const error = document.querySelector("#error");
const result = document.querySelector("#result");

form.addEventListener("submit", (event) => {
  event.preventDefault();                  // do not reload the page
  error.textContent = "";
  result.textContent = "";

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();

  if (name === "") {
    error.textContent = "Please enter your name.";
    return;
  }
  if (!email.includes("@")) {
    error.textContent = "Please enter a valid email address.";
    return;
  }

  result.textContent = `Welcome, ${name}! We will email ${email}.`;
});
```

Try it with an empty name, then with `ada` as the email, then with correct values. Three habits make this a good form:

1. **`trim()`** the values, since people add spaces.
2. **Validate**, then show a **clear, specific message** next to the problem, not a mysterious "invalid".
3. Put the message in an element with `role="alert"`, so screen readers announce it.

> [!NOTE]
> JavaScript validation is for the visitor's **convenience**. It can be bypassed, so a real server must always check the data again. Never trust the browser alone for anything important.

### Live feedback with the input event

The `input` event fires on every keystroke. It is great for character counters and live search.

```live
=== html
<label for="bio">Your bio (max 80 characters)</label><br />
<textarea id="bio" rows="3" cols="40"></textarea>
<p id="left">80 characters left</p>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
.warn { color: #b91c1c; font-weight: bold; }
=== js
const bio = document.querySelector("#bio");
const left = document.querySelector("#left");
const MAX = 80;

bio.addEventListener("input", () => {
  const remaining = MAX - bio.value.length;
  left.textContent = `${remaining} characters left`;
  left.classList.toggle("warn", remaining < 10);
});
```

## Toggling: a dark mode switch and a menu

Two of the most common interactions are a switch that adds or removes a class.

```live
=== html
<button id="theme" aria-pressed="false">Dark mode</button>
<h2>Welcome</h2>
<p>This page can switch between light and dark.</p>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; background: white; color: #1f2937; transition: background 0.3s, color 0.3s; }
body.dark { background: #111827; color: #f3f4f6; }
button { padding: 10px 18px; border-radius: 8px; border: 1px solid currentColor; background: transparent; color: inherit; cursor: pointer; }
=== js
const button = document.querySelector("#theme");

button.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  button.setAttribute("aria-pressed", isDark);   // tell screen readers the state
});
```

`classList.toggle` returns whether the class is now on, which is handy for keeping `aria-pressed` correct. A menu that opens on small screens works the same way: a button toggles a class that shows or hides the links, and sets `aria-expanded`.

```live
{ "stack": true, "height": 260 }
=== html
<header class="bar">
  <strong>CloudTech</strong>
  <button id="menu-btn" aria-expanded="false" aria-controls="links">Menu</button>
  <nav id="links" class="links">
    <a href="#">Courses</a> <a href="#">Projects</a> <a href="#">About</a>
  </nav>
</header>
=== css
body { margin: 0; font-family: system-ui, sans-serif; }
.bar { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; padding: 12px 16px; background: #1f2937; color: white; }
.bar button { background: #0f766e; color: white; border: 0; padding: 8px 14px; border-radius: 6px; cursor: pointer; }
.links { display: none; width: 100%; padding-top: 10px; }
.links.open { display: block; }
.links a { color: #d1d5db; margin-right: 12px; }
=== js
const btn = document.querySelector("#menu-btn");
const links = document.querySelector("#links");

btn.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
});
```

## Keyboard events

```live
=== html
<p>Click here, then press any key. Press Escape to clear.</p>
<input id="box" placeholder="Type something, press Enter" />
<ul id="log"></ul>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; }
=== js
const box = document.querySelector("#box");
const log = document.querySelector("#log");

box.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && box.value.trim() !== "") {
    const li = document.createElement("li");
    li.textContent = box.value.trim();
    log.append(li);
    box.value = "";
  }
  if (event.key === "Escape") box.value = "";
});
```

## Putting it together: a to-do list

This small app combines everything: data in an array, a form, event delegation, and rendering from state. Read it slowly, because it is the pattern behind countless real applications.

```live
{ "stack": true, "height": 420 }
=== html
<h2>My tasks</h2>
<form id="form">
  <label for="task" class="sr">New task</label>
  <input id="task" placeholder="What needs doing?" />
  <button>Add</button>
</form>
<ul id="tasks"></ul>
<p id="summary"></p>
=== css
body { font-family: system-ui, sans-serif; padding: 16px; max-width: 420px; }
.sr { position: absolute; left: -9999px; }
form { display: flex; gap: 8px; }
input { flex: 1; padding: 10px; border: 1px solid #9ca3af; border-radius: 8px; }
button { background: #0f766e; color: white; border: 0; padding: 10px 16px; border-radius: 8px; cursor: pointer; }
ul { list-style: none; padding: 0; }
li { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; cursor: pointer; }
li.done span { text-decoration: line-through; color: #9ca3af; }
li button { background: transparent; color: #b91c1c; padding: 0 6px; }
=== js
let tasks = [
  { id: 1, text: "Finish lesson 17", done: false },
  { id: 2, text: "Practise events", done: true },
];
let nextId = 3;

const list = document.querySelector("#tasks");
const summary = document.querySelector("#summary");

function render() {
  list.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.dataset.id = task.id;
    li.className = task.done ? "done" : "";

    const text = document.createElement("span");
    text.textContent = task.text;       // textContent: safe for user input

    const del = document.createElement("button");
    del.textContent = "x";
    del.setAttribute("aria-label", `Delete ${task.text}`);
    del.dataset.action = "delete";

    li.append(text, del);
    list.append(li);
  });
  const left = tasks.filter((t) => !t.done).length;
  summary.textContent = `${left} of ${tasks.length} tasks left`;
}

document.querySelector("#form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#task");
  const text = input.value.trim();
  if (text === "") return;
  tasks.push({ id: nextId++, text, done: false });
  input.value = "";
  render();
});

list.addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (!li) return;
  const id = Number(li.dataset.id);
  if (event.target.dataset.action === "delete") {
    tasks = tasks.filter((t) => t.id !== id);
  } else {
    const task = tasks.find((t) => t.id === id);
    task.done = !task.done;
  }
  render();
});

render();
```

Notice the **shape** of the app: the `tasks` array is the single source of truth, `render()` rebuilds the list from it, and each event handler only changes the data and calls `render()`. This is the idea behind frameworks like React, and you can build real software with this plain approach.

## Try it

Build a working counter. The buttons and display exist, and your job is to make them work.

```webtask
{
  "id": "web-m17-t1",
  "minutes": 12,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "The counter starts at 0", "selector": "#count", "contains": "^\\s*0\\s*$" },
    { "label": "Clicking + three times shows 3", "selector": "#count", "act": [{ "click": "#plus" }, { "click": "#plus" }, { "click": "#plus" }], "contains": "^\\s*3\\s*$" },
    { "label": "Clicking + twice and - once shows 1", "selector": "#count", "act": [{ "click": "#plus" }, { "click": "#plus" }, { "click": "#minus" }], "contains": "^\\s*1\\s*$" },
    { "label": "The counter never goes below 0", "selector": "#count", "act": [{ "click": "#minus" }, { "click": "#minus" }], "contains": "^\\s*0\\s*$" },
    { "label": "Clicking Reset after counting sets it back to 0", "selector": "#count", "act": [{ "click": "#plus" }, { "click": "#plus" }, { "click": "#reset" }], "contains": "^\\s*0\\s*$" },
    { "label": "You use addEventListener", "in": "js", "pattern": "addEventListener\\(\\s*[\"']click[\"']", "min": 2 }
  ],
  "hint": "let count = 0; const display = document.querySelector(\"#count\"); function render() { display.textContent = count; } document.querySelector(\"#plus\").addEventListener(\"click\", () => { count++; render(); }); For minus use if (count > 0) count--; and Reset sets count = 0.",
  "height": 300
}
=== prompt
Make the buttons work. `+` adds 1, `-` subtracts 1 but never goes below 0, and `Reset` sets the count back to 0. The number is shown in `#count`. Keep the count in a variable and update the display from it.
=== html
<p>Tickets: <strong id="count">0</strong></p>
<button id="minus">-</button>
<button id="plus">+</button>
<button id="reset">Reset</button>
=== css
body {
  font-family: system-ui, sans-serif;
  padding: 16px;
  font-size: 1.2rem;
}
button {
  min-width: 44px;
  height: 44px;
  margin-right: 6px;
  border-radius: 8px;
  cursor: pointer;
}
=== js
// Write your code here
=== sample js
let count = 0;
const display = document.querySelector("#count");

function render() {
  display.textContent = count;
}

document.querySelector("#plus").addEventListener("click", () => {
  count++;
  render();
});

document.querySelector("#minus").addEventListener("click", () => {
  if (count > 0) count--;
  render();
});

document.querySelector("#reset").addEventListener("click", () => {
  count = 0;
  render();
});
```

Now validate a form with clear messages.

```webtask
{
  "id": "web-m17-t2",
  "minutes": 15,
  "required": true,
  "tabs": ["js"],
  "rules": [
    { "label": "An empty name shows an error that mentions the name", "selector": "#error", "act": [{ "type": ["#name", ""] }, { "type": ["#email", "ada@example.com"] }, { "submit": "#signup" }], "contains": "name" },
    { "label": "An email without @ shows an error that mentions the email", "selector": "#error", "act": [{ "type": ["#name", "Ada"] }, { "type": ["#email", "ada"] }, { "submit": "#signup" }], "contains": "email" },
    { "label": "Valid values show a welcome message with the name in #result", "selector": "#result", "act": [{ "type": ["#name", "Ada"] }, { "type": ["#email", "ada@example.com"] }, { "submit": "#signup" }], "contains": "Ada" },
    { "label": "With valid values the error message is empty", "selector": "#error:empty", "act": [{ "type": ["#name", "Ada"] }, { "type": ["#email", "ada@example.com"] }, { "submit": "#signup" }], "min": 1 },
    { "label": "You stop the page reloading with preventDefault", "in": "js", "pattern": "preventDefault\\(\\)" },
    { "label": "You trim the values", "in": "js", "pattern": "\\.trim\\(\\)" }
  ],
  "hint": "form.addEventListener(\"submit\", (event) => { event.preventDefault(); error.textContent = \"\"; result.textContent = \"\"; const name = nameInput.value.trim(); const email = emailInput.value.trim(); if (name === \"\") { error.textContent = \"Please enter your name.\"; return; } if (!email.includes(\"@\")) { error.textContent = \"Please enter a valid email.\"; return; } result.textContent = `Welcome, ${name}!`; });",
  "height": 340
}
=== prompt
Validate the sign-up form in JavaScript. On submit: stop the page reloading, trim both values, and clear any old messages. If the name is empty, put an error mentioning **name** in `#error`. If the email has no `@`, put an error mentioning **email** in `#error`. Otherwise show `Welcome, <name>!` in `#result` and leave `#error` empty.
=== html
<form id="signup" novalidate>
  <p>
    <label for="name">Name</label><br />
    <input id="name" type="text" />
  </p>
  <p>
    <label for="email">Email</label><br />
    <input id="email" type="email" />
  </p>
  <button type="submit">Join</button>
</form>
<p id="error" role="alert" style="color: #b91c1c"></p>
<p id="result"></p>
=== js
// Write your code here
=== sample js
const form = document.querySelector("#signup");
const error = document.querySelector("#error");
const result = document.querySelector("#result");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  error.textContent = "";
  result.textContent = "";

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();

  if (name === "") {
    error.textContent = "Please enter your name.";
    return;
  }
  if (!email.includes("@")) {
    error.textContent = "Please enter a valid email address.";
    return;
  }

  result.textContent = `Welcome, ${name}!`;
});
```

```answer
{
  "id": "web-m17-a1",
  "prompt": "Which method on the event object stops a form from reloading the page when it is submitted? Type the method name with brackets, like `name()`.",
  "answer": "preventDefault()",
  "format": "text",
  "accept": ["preventdefault", "event.preventDefault()", "event.preventDefault", "preventDefault"],
  "explanation": "event.preventDefault() cancels the browser's default action, so your own code decides what happens next.",
  "required": true
}
```
