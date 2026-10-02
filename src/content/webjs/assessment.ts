import type { AssessmentDef } from "../types";

/**
 * Final assessment for Web Development with JavaScript. Scenario questions on HTML, CSS,
 * JavaScript numbers, arrays, the DOM, accessibility, validation, fetch and testing.
 */
export const WJS_ASSESSMENT: AssessmentDef = {
  id: "web-development-with-javascript-final",
  courseId: "web-development-with-javascript",
  title: "Web Development with JavaScript: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "wjsq01",
      prompt: "A form field holds \"1500\". What does `field.value + 500` give?",
      options: ["2000", "\"1500500\"", "An error", "NaN"],
      answer: 1,
      explanation: "Form values are text; convert deliberately.",
    },
    {
      id: "wjsq02",
      prompt: "Why might `Math.floor(price * 100)` give the wrong number of kobo?",
      options: ["Math.floor is slow", "price * 100 can land just below the true value, such as 894.999... for 8.95", "It rounds up", "It never does"],
      answer: 1,
      explanation: "Avoid floats for money; parse the text instead.",
    },
    {
      id: "wjsq03",
      prompt: "Which array method adds up the balances of a list of invoices?",
      options: ["filter", "map", "reduce", "find"],
      answer: 2,
      explanation: "reduce combines items into one value.",
    },
    {
      id: "wjsq04",
      prompt: "Why use a `<button>` instead of a clickable `<div>`?",
      options: ["It looks better", "It works with the keyboard and is announced as a button", "Divs can't be clicked", "It's newer"],
      answer: 1,
      explanation: "The right element brings accessibility for free.",
    },
    {
      id: "wjsq05",
      prompt: "What does `<label for=\"amount\">` do for an `<input id=\"amount\">`?",
      options: ["Styles it", "Links the label to the input, for screen readers and clicking", "Validates it", "Nothing"],
      answer: 1,
      explanation: "Every input needs a linked label.",
    },
    {
      id: "wjsq06",
      prompt: "What does mobile-first CSS mean?",
      options: ["A separate mobile site", "Phone layout as the default, with media queries adding wider layouts", "Only phones are supported", "Testing on phones last"],
      answer: 1,
      explanation: "Add, don't undo.",
    },
    {
      id: "wjsq07",
      prompt: "Why use `textContent` rather than `innerHTML` to show what a user typed?",
      options: ["It's faster", "innerHTML can run what was typed as HTML", "textContent is newer", "No reason"],
      answer: 1,
      explanation: "Treat user input as text.",
    },
    {
      id: "wjsq08",
      prompt: "The page checks the payment amount. Must the API check it too?",
      options: ["No", "Yes: requests can be sent without the page", "Only for large amounts", "Only on mobile"],
      answer: 1,
      explanation: "Browser checks are for people; server checks are the rules.",
    },
    {
      id: "wjsq09",
      prompt: "How do you make an error message announced with its field?",
      options: ["Colour it red", "Link it with aria-describedby and set aria-invalid on the field", "Use alert()", "Use a tooltip"],
      answer: 1,
      explanation: "Connect messages and fields in the markup.",
    },
    {
      id: "wjsq10",
      prompt: "The API returns 409. What does `await fetch(...)` do?",
      options: ["Throws an error", "Returns a response whose status you must check", "Retries", "Returns null"],
      answer: 1,
      explanation: "fetch only throws on network failure.",
    },
    {
      id: "wjsq11",
      prompt: "A customer's connection drops while paying. What should the page say?",
      options: ["Nothing", "That the payment wasn't recorded, and to check their connection and try again", "Success", "Error 0"],
      answer: 1,
      explanation: "Always say what happened to their money.",
    },
    {
      id: "wjsq12",
      prompt: "Why put the page's calculations in plain functions?",
      options: ["Style", "So they can be tested without a page and reused", "Browsers require it", "Speed"],
      answer: 1,
      explanation: "Testable logic, thin event handlers.",
    },
  ],
};
