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

> [!NOTE]
> If nothing happens, open the Console. A red error usually names the file and line with the problem. Typos in `querySelector` names are the most common cause.

## Try it

1. Link `script.js` and add the dark mode button.
2. Add a second button that shows or hides your "Contact" section. Hint: toggle a class that sets `display: none`.
3. Open the Console, cause an error on purpose (misspell a variable), read the message, then fix it.
