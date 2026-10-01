import type { AssessmentDef } from "../types";

const C = "web-development-for-beginners";

/**
 * Web Development for Beginners: a check for each module (it awards the module badge, and
 * unlocks only after the module's tasks are done) and a final assessment. Questions are
 * scenarios with plausible wrong answers.
 */
export const WEB_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "web-m01-check",
    courseId: C,
    kind: "module",
    moduleId: "web-m01",
    title: "HTML: The Structure: module check",
    passingScore: 60,
    questions: [
      { id: "web-m01-q1", prompt: "Which part of a web page does HTML handle?", options: ["Colours and layout", "Structure and content", "Clicks and interaction", "Hosting"], answer: 1, explanation: "CSS styles it; JavaScript adds behaviour." },
      { id: "web-m01-q2", prompt: "Where does visible content like headings and paragraphs go?", options: ["Inside <head>", "Inside <body>", "Before <!DOCTYPE html>", "In the <title>"], answer: 1, explanation: "<head> holds information about the page; <body> holds what people see." },
      { id: "web-m01-q3", prompt: "Which line creates a working link to GitHub?", options: ["<link>https://github.com</link>", "<a href=\"https://github.com\">GitHub</a>", "<a>https://github.com</a>", "<href=\"https://github.com\">"], answer: 1, explanation: "The address goes in the href attribute of <a>." },
      { id: "web-m01-q4", prompt: "Which image tag is best?", options: ["<img src=\"me.jpg\">", "<img src=\"me.jpg\" alt=\"image\">", "<img src=\"me.jpg\" alt=\"Chioma smiling in front of the library\">", "<image>me.jpg</image>"], answer: 2, explanation: "The alt text should describe the image usefully." },
      { id: "web-m01-q5", prompt: "A page has five <h1> headings. What's the better structure?", options: ["Keep five", "One <h1> for the page title, <h2> for sections", "No headings", "Use <p> with bold text"], answer: 1, explanation: "One <h1> per page; sections below it." },
    ],
  },
  {
    id: "web-m02-check",
    courseId: C,
    kind: "module",
    moduleId: "web-m02",
    title: "CSS: The Style: module check",
    passingScore: 60,
    questions: [
      { id: "web-m02-q1", prompt: "You wrote style.css but the page looks unstyled. What's the most likely cause?", options: ["CSS doesn't work offline", "The <link rel=\"stylesheet\" href=\"style.css\"> line is missing or the file name doesn't match", "The browser is too old", "You need JavaScript first"], answer: 1, explanation: "The HTML must link the stylesheet with the exact file name." },
      { id: "web-m02-q2", prompt: "Which selector targets the one element with id=\"contact\"?", options: [".contact", "#contact", "contact", "*contact"], answer: 1, explanation: "# for ids, . for classes." },
      { id: "web-m02-q3", prompt: "What does max-width: 720px; margin: 0 auto; do to the body?", options: ["Hides it", "Keeps the content a comfortable width and centres it", "Makes it 720px tall", "Adds a border"], answer: 1, explanation: "A readable line length, centred on wide screens." },
      { id: "web-m02-q4", prompt: "Your cards squeeze into one tiny row on a phone. Which line helps?", options: ["flex-wrap: wrap;", "display: none;", "color: red;", "font-size: 2px;"], answer: 0, explanation: "Wrapping lets cards move onto new lines." },
      { id: "web-m02-q5", prompt: "In the box model, what's between the content and the border?", options: ["Margin", "Padding", "Outline", "Shadow"], answer: 1, explanation: "Padding is inside the border; margin is outside." },
    ],
  },
  {
    id: "web-m03-check",
    courseId: C,
    kind: "module",
    moduleId: "web-m03",
    title: "JavaScript: The Behaviour: module check",
    passingScore: 60,
    questions: [
      { id: "web-m03-q1", prompt: "Your button does nothing when clicked. Where should you look first?", options: ["The CSS file", "The browser Console for a red error", "Your router", "The page title"], answer: 1, explanation: "The Console names the file and line with the problem." },
      { id: "web-m03-q2", prompt: "The Console says 'button is not defined' but your code says const buton = …. What's wrong?", options: ["JavaScript is broken", "The variable name is spelled differently where it's created and where it's used", "Buttons can't be variables", "You need let instead of const"], answer: 1, explanation: "Names must match exactly." },
      { id: "web-m03-q3", prompt: "What are the three steps behind most interaction on a page?", options: ["Save, refresh, publish", "Find an element, listen for an event, change something", "Write HTML, write CSS, write HTML again", "Open, close, reload"], answer: 1, explanation: "querySelector, addEventListener, then change the page." },
      { id: "web-m03-q4", prompt: "What does classList.toggle(\"dark\") do?", options: ["Always adds the class", "Adds the class if it's missing, removes it if it's there", "Deletes the element", "Changes the text"], answer: 1, explanation: "Perfect for on/off switches." },
      { id: "web-m03-q5", prompt: "Where should <script src=\"script.js\"></script> usually go?", options: ["Before <!DOCTYPE html>", "Just before </body>", "Inside <title>", "In style.css"], answer: 1, explanation: "So the page's elements exist when the script runs." },
    ],
  },
  {
    id: "web-m04-check",
    courseId: C,
    kind: "module",
    moduleId: "web-m04",
    title: "Publish Your First Website: module check",
    passingScore: 60,
    questions: [
      { id: "web-m04-q1", prompt: "Your GitHub username is tobi-dev. Which repository name publishes to https://tobi-dev.github.io?", options: ["website", "tobi-dev.github.io", "tobi-dev", "github.io"], answer: 1, explanation: "The repository must be named exactly username.github.io." },
      { id: "web-m04-q2", prompt: "An image works on your laptop but is broken online. The HTML says me.jpg; the file is Me.JPG. Why?", options: ["GitHub doesn't host images", "Web servers treat capital letters as different, so the names don't match", "The image is too big", "It needs alt text"], answer: 1, explanation: "Keep file names lowercase with no spaces." },
      { id: "web-m04-q3", prompt: "You share github.com/tobi-dev/tobi-dev.github.io as your website. What's the problem?", options: ["Nothing", "That's the code page, not the live site; share https://tobi-dev.github.io", "It's too long", "GitHub links can't be shared"], answer: 1, explanation: "Share the live address." },
      { id: "web-m04-q4", prompt: "You commit a change to your site. What happens?", options: ["Nothing until you delete the repo", "The live site updates within a few minutes", "GitHub emails your visitors", "You must pay to update"], answer: 1, explanation: "GitHub Pages redeploys after each commit." },
      { id: "web-m04-q5", prompt: "What should you do before sharing your site?", options: ["Nothing", "Open it on your phone, click every link and check the Console for errors", "Make it private", "Remove the projects"], answer: 1, explanation: "Recruiters often open links on their phones." },
    ],
  },
  {
    id: "web-development-for-beginners-final",
    courseId: C,
    kind: "final",
    title: "Web Development for Beginners: final assessment",
    passingScore: 60,
    questions: [
      { id: "web-f01", prompt: "Which language controls colours, fonts and layout?", options: ["HTML", "CSS", "JavaScript", "Markdown"], answer: 1, explanation: "CSS is the style layer." },
      { id: "web-f02", prompt: "Which tag makes a bulleted list item?", options: ["<ul>", "<li>", "<ol>", "<p>"], answer: 1, explanation: "<li> items go inside <ul> (bullets) or <ol> (numbers)." },
      { id: "web-f03", prompt: "Why give images alt text?", options: ["It makes them load faster", "It describes them for screen readers and if they fail to load", "It's required for colour", "It adds a caption"], answer: 1, explanation: "Accessibility and resilience." },
      { id: "web-f04", prompt: "Which CSS makes cards sit side by side and wrap on phones?", options: ["display: flex; flex-wrap: wrap;", "display: none;", "position: fixed;", "float: center;"], answer: 0, explanation: "Flexbox with wrapping." },
      { id: "web-f05", prompt: "What does document.querySelector(\"#theme-btn\") do?", options: ["Creates a button", "Finds the element with id theme-btn", "Deletes the button", "Changes the theme"], answer: 1, explanation: "It finds an element so you can work with it." },
      { id: "web-f06", prompt: "Which keyword declares a value that won't change?", options: ["let", "const", "var only", "change"], answer: 1, explanation: "const for constants, let for values that change." },
      { id: "web-f07", prompt: "What's the live address of a GitHub Pages user site for username ada-dev?", options: ["github.com/ada-dev", "https://ada-dev.github.io", "ada-dev.com", "pages.github.com/ada-dev"], answer: 1, explanation: "username.github.io." },
      { id: "web-f08", prompt: "Your site works locally but a link is broken online. What's a likely cause?", options: ["The internet is down", "A file name or path mismatch, often capital letters or spaces", "HTML doesn't work online", "Too many links"], answer: 1, explanation: "Servers are strict about file names." },
    ],
  },
];
