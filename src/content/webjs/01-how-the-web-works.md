---
title: How the web works
minutes: 10
summary: What happens when someone opens a web page, what HTML, CSS and JavaScript each do, and how to run your first JavaScript in the browser you already have, with nothing to install.
---

## The problem

Tallybook's customers pay invoices from a web page on their phones. The page today is a single form that reloads everything on every click, shows totals only after submitting, and is hard to use with a screen reader or on a small screen. In this course you'll build a better one: the "pay an invoice" page of Tallybook's customer portal, talking to the API from the Databases and APIs course.

## The concept

### A page load, step by step

1. The browser asks a server for a page (an HTTP request, as in the Linux course).
2. The server returns **HTML**, which links to **CSS** and **JavaScript** files; the browser fetches those too.
3. The browser builds the **DOM**, a live tree of the page's elements, applies the CSS, and runs the JavaScript.
4. JavaScript can change the DOM, react to clicks and typing, and call APIs without reloading the page.

![The browser requests a page, the server returns HTML, the browser fetches the linked CSS and JavaScript, builds the DOM tree and runs the JavaScript; below, HTML for structure, CSS for presentation, JavaScript for behaviour](/images/courses/webjs/page-load.svg "A page load: request, HTML, CSS and JavaScript, then the DOM.")

### Three languages, three jobs

| Language | Job | Example |
| :-- | :-- | :-- |
| **HTML** | structure and meaning | "this is a form with a field labelled Amount" |
| **CSS** | presentation and layout | "on phones, stack the summary under the table" |
| **JavaScript** | behaviour | "when the amount changes, update the balance shown" |

### Running JavaScript today

Every browser has a **console** for running JavaScript. Open any page, press **F12** (or Ctrl+Shift+J on Windows, Cmd+Option+J on a Mac) and choose **Console**. Type a line and press Enter. Every JavaScript example in this course runs there. For the HTML examples, save the code as a file ending in `.html` and open it in your browser, or paste it into a free online editor such as CodePen.

## Example

Your first lines of JavaScript. `console.log` prints a value:

```js
console.log("Hello from Tallybook");
console.log(2 + 2, typeof "2", "2" + 2, "6" * 2);
```

```text
Hello from Tallybook
4 string 22 12
```

The last two results surprise most people. `+` with a string **joins** text, so `"2" + 2` is `"22"`. But `*` only works on numbers, so JavaScript quietly converts `"6"` to a number. Values from forms always arrive as **text**, so this matters on a payment page: convert them deliberately (lesson 2).

```js
const amountFromForm = "1500";
console.log(amountFromForm + 500);
console.log(Number(amountFromForm) + 500);
```

```text
1500500
2000
```

## Walkthrough

1. Open your browser's console and run both blocks. Then try `"10" - 3` and `"10" + 3`.
2. On any website, open DevTools' **Elements** tab and find the page's `<h1>`. That's the DOM.
3. Open DevTools' **Network** tab and reload a page. How many files did it load?
4. For Tallybook's pay-an-invoice page, list one job for each of HTML, CSS and JavaScript.

## Practice

```answer
{
  "id": "web-01-p1",
  "prompt": "What does `\"2\" + 2` give in JavaScript?",
  "answer": "22",
  "jsVerify": "\"2\" + 2",
  "hint": "With a string, + joins text.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which language describes a page's structure and meaning?",
    "options": ["CSS", "HTML", "JavaScript", "SQL"],
    "answer": 1,
    "explanation": "CSS styles it; JavaScript adds behaviour."
  },
  {
    "prompt": "A form field's value is \"1500\". What is `value + 500`?",
    "options": ["2000", "\"1500500\"", "An error", "1500"],
    "answer": 1,
    "explanation": "Form values are text; convert with Number() first."
  },
  {
    "prompt": "What is the DOM?",
    "options": ["A database", "The browser's live tree of the page's elements, which JavaScript can read and change", "A CSS file", "A server"],
    "answer": 1,
    "explanation": "JavaScript changes pages through the DOM."
  }
]
```
