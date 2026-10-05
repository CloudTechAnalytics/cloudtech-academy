---
title: "JavaScript: The Behaviour"
minutes: 25
summary: Add interaction to your page with JavaScript, using variables, functions and a button that responds when someone clicks it.
---

## What JavaScript adds

HTML and CSS make a page look right. **JavaScript** makes it *do* things: respond to clicks, show and hide content, check forms, and fetch data.

Create `script.js` in your folder and link it just before `</body>` in `index.html`:

```html
<script src="script.js"></script>
```

## Try the console first

In your browser, press **F12** (or right-click → **Inspect**) and open the **Console** tab. Type each line and press Enter:

```js
2 + 3
"Hello " + "Lagos"
let name = "Tobi";
name.toUpperCase()
```

The console is where you test ideas and where errors appear.

## The basics

```js
// Variables hold values
let score = 72;
const school = "OAU";

// Conditions make decisions
if (score >= 60) {
  console.log("Passed");
} else {
  console.log("Try again");
}

// Functions are reusable blocks of code
function greet(person) {
  return "Welcome, " + person + "!";
}

console.log(greet("Amina"));
```

Use `const` for values that won't change and `let` for values that will.

## Make a button work

Add this to `index.html`:

```html
<button id="theme-btn">Dark mode</button>
```

And this to `script.js`:

```js
const button = document.querySelector("#theme-btn");

button.addEventListener("click", function () {
  document.body.classList.toggle("dark");
});
```

And this to `style.css`:

```css
body.dark {
  background: #111827;
  color: #f9fafb;
}
```

Click the button: the page switches between light and dark. This is the pattern behind most interaction: **find an element**, **listen for an event**, **change something**.

![Three steps: find the button with querySelector, listen for a click with addEventListener, change the page by toggling a dark class; the CSS rule body.dark then switches the page from light to dark](/images/courses/web/js-pattern.svg "Find an element, listen for an event, change something.")

> [!NOTE]
> If nothing happens, open the Console. A red error usually names the file and line with the problem. Typos in `querySelector` names are the most common cause.

## Try it

This code is meant to switch dark mode on, but clicking does nothing, and the Console shows **`Uncaught ReferenceError: button is not defined`**:

```js
const buton = document.querySelector("#theme-btn");
button.addEventListener("click", function () {
  document.body.classList.toggle("dark");
});
```

```answer
{
  "id": "web-m03-a1",
  "prompt": "Which variable name has a typo? Type the misspelled name exactly as it appears in the code.",
  "answer": "buton",
  "format": "text",
  "explanation": "The variable is created as buton but used as button. The error message names the one JavaScript can't find, which points you to the mismatch.",
  "required": true
}
```

```answer
{
  "id": "web-m03-a2",
  "prompt": "You need a variable for a score that will change as a quiz goes on. Which keyword should you declare it with: `let` or `const`?",
  "answer": "let",
  "format": "text",
  "explanation": "let for values that change; const for values that won't.",
  "required": true
}
```

```task
{
  "id": "web-m03-t1",
  "prompt": "Add a button that **shows and hides your Contact section**. Paste the three pieces: the **HTML** (the button and the section with an `id`), the **CSS** (a class that hides it), and the **JavaScript** (find the button, listen for a click, toggle the class).",
  "minutes": 15,
  "rows": 16,
  "placeholder": "<button id=\"contact-btn\">...</button>\n<section id=\"contact\">...</section>\n\n.hidden { ... }\n\nconst ...",
  "rules": [
    { "label": "A <button> with an id", "pattern": "<button[^>]*\\bid=\"[^\"]+\"" },
    { "label": "A contact section with an id", "pattern": "<(section|div|footer)[^>]*\\bid=\"contact[^\"]*\"" },
    { "label": "A CSS class that hides it (display: none)", "pattern": "\\.[\\w-]+\\s*\\{[^}]*display\\s*:\\s*none" },
    { "label": "Finds elements with document.querySelector or getElementById", "pattern": "document\\.(querySelector|getElementById)\\(", "min": 2 },
    { "label": "Listens for a click", "pattern": "addEventListener\\(\\s*[\"']click[\"']" },
    { "label": "Toggles the class", "pattern": "classList\\.toggle\\(" }
  ],
  "sample": "<button id=\"contact-btn\">Show contact details</button>\n<section id=\"contact\" class=\"hidden\">\n  <h2>Contact</h2>\n  <p>Email me at chioma.eze@example.com</p>\n</section>\n\n.hidden {\n  display: none;\n}\n\nconst contactButton = document.querySelector(\"#contact-btn\");\nconst contact = document.querySelector(\"#contact\");\ncontactButton.addEventListener(\"click\", function () {\n  contact.classList.toggle(\"hidden\");\n});",
  "note": "Find an element, listen for an event, change something: the same three steps as the dark mode button, and as most interaction on the web.",
  "required": true
}
```
