import type { AssessmentDef } from "../types";

const C = "web-development-for-beginners";

/** Web Development for Beginners: a check for each module (it awards the module badge) and a final assessment. */
export const WEB_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "web-m01-check",
    courseId: C,
    kind: "module",
    moduleId: "web-m01",
    title: "HTML: module check",
    passingScore: 60,
    questions: [
      { id: "web-m01-q1", prompt: "What is HTML for?", options: ["The structure and content of a page", "The colours and fonts", "Clicks and interaction", "Storing data"], answer: 0, explanation: "HTML is the structure; CSS styles it; JavaScript adds behaviour." },
      { id: "web-m01-q2", prompt: "Which tag makes a link?", options: ["<a href=\"…\">", "<link>", "<p>", "<h1>"], answer: 0, explanation: "The a (anchor) tag with href creates a link." },
      { id: "web-m01-q3", prompt: "What is the alt text on an image for?", options: ["Describing the image for screen readers and when it doesn't load", "Making it bigger", "Adding a border", "Linking it"], answer: 0, explanation: "alt makes images accessible." },
      { id: "web-m01-q4", prompt: "Where does visible page content go?", options: ["Inside <body>", "Inside <head>", "Before <!DOCTYPE html>", "Inside <title>"], answer: 0, explanation: "The head holds page information; the body holds what you see." },
      { id: "web-m01-q5", prompt: "How many <h1> headings should a page usually have?", options: ["One", "None", "One per paragraph", "As many as possible"], answer: 0, explanation: "One main heading, with h2 and below for sections." },
    ],
  },
  {
    id: "web-m02-check",
    courseId: C,
    kind: "module",
    moduleId: "web-m02",
    title: "CSS: module check",
    passingScore: 60,
    questions: [
      { id: "web-m02-q1", prompt: "What does CSS control?", options: ["Style and layout", "The page's text content", "Database queries", "Web addresses"], answer: 0, explanation: "CSS is the paint and furniture." },
      { id: "web-m02-q2", prompt: "Which selector targets elements with class=\"card\"?", options: [".card", "#card", "card", "*card"], answer: 0, explanation: "A dot selects a class; # selects an id." },
      { id: "web-m02-q3", prompt: "In the box model, what is padding?", options: ["Space inside the border", "Space outside the border", "The text itself", "The border line"], answer: 0, explanation: "Padding is inside; margin is outside." },
      { id: "web-m02-q4", prompt: "What does display: flex with flex-wrap: wrap help with?", options: ["Placing items side by side and wrapping them on small screens", "Changing font colour", "Hiding elements", "Adding links"], answer: 0, explanation: "Flexbox makes simple responsive layouts." },
      { id: "web-m02-q5", prompt: "How do you connect style.css to your page?", options: ["A <link rel=\"stylesheet\" href=\"style.css\"> tag in the head", "Rename it index.html", "Paste it into the title", "Put it in the same folder only"], answer: 0, explanation: "The link tag loads the stylesheet." },
    ],
  },
  {
    id: "web-m03-check",
    courseId: C,
    kind: "module",
    moduleId: "web-m03",
    title: "JavaScript: module check",
    passingScore: 60,
    questions: [
      { id: "web-m03-q1", prompt: "What does JavaScript add to a page?", options: ["Behaviour and interaction", "The main headings", "The fonts", "The web address"], answer: 0, explanation: "JavaScript makes pages respond." },
      { id: "web-m03-q2", prompt: "Where do JavaScript errors appear?", options: ["In the browser's Console", "In the page title", "In the CSS file", "Nowhere"], answer: 0, explanation: "Press F12 and open the Console." },
      { id: "web-m03-q3", prompt: "Which keyword is best for a value that won't change?", options: ["const", "let", "change", "var only"], answer: 0, explanation: "Use const for fixed values and let for values that change." },
      { id: "web-m03-q4", prompt: "What does addEventListener(\"click\", …) do?", options: ["Runs code when an element is clicked", "Deletes the element", "Styles the element", "Creates a link"], answer: 0, explanation: "It listens for the click event." },
      { id: "web-m03-q5", prompt: "What's the usual pattern for interaction?", options: ["Find an element, listen for an event, change something", "Write HTML, delete CSS, reload", "Open the console and wait", "Copy the page"], answer: 0, explanation: "Most interaction follows those three steps." },
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
      { id: "web-m04-q1", prompt: "What must your GitHub Pages personal site repository be called?", options: ["your-username.github.io", "website", "index.html", "my-site"], answer: 0, explanation: "That exact name publishes to your main GitHub Pages address." },
      { id: "web-m04-q2", prompt: "Where do you turn on GitHub Pages?", options: ["Settings → Pages", "Your profile README", "The Commits page", "Issues"], answer: 0, explanation: "Choose the main branch and root folder there." },
      { id: "web-m04-q3", prompt: "What should your home page file be named?", options: ["index.html", "home.htm", "Page1.html", "main.css"], answer: 0, explanation: "Web servers open index.html by default." },
      { id: "web-m04-q4", prompt: "An image works on your laptop but not online. What's the likely cause?", options: ["The file name's capitals don't match", "The internet is slow", "GitHub blocks images", "CSS is missing"], answer: 0, explanation: "Web servers treat Me.jpg and me.jpg as different files." },
      { id: "web-m04-q5", prompt: "Which of these can also publish a site for free?", options: ["Netlify", "Microsoft Word", "WhatsApp", "Excel"], answer: 0, explanation: "Netlify and Vercel are popular free options." },
    ],
  },
  {
    id: "web-development-for-beginners-final",
    courseId: C,
    kind: "final",
    title: "Web Development for Beginners: final assessment",
    passingScore: 60,
    questions: [
      { id: "web-f01", prompt: "Match the language to its job: CSS is for…", options: ["Style and layout", "Structure", "Interaction", "Hosting"], answer: 0, explanation: "HTML structure, CSS style, JavaScript behaviour." },
      { id: "web-f02", prompt: "Which tag makes a bulleted list item?", options: ["<li> inside <ul>", "<p> inside <h1>", "<a> inside <img>", "<title>"], answer: 0, explanation: "ul holds li items." },
      { id: "web-f03", prompt: "Which selector targets the element with id=\"contact\"?", options: ["#contact", ".contact", "contact", "@contact"], answer: 0, explanation: "# selects an id." },
      { id: "web-f04", prompt: "What does margin: 0 auto do on a box with a max-width?", options: ["Centres it horizontally", "Hides it", "Makes it bold", "Adds a border"], answer: 0, explanation: "Automatic left and right margins centre the box." },
      { id: "web-f05", prompt: "Where should you look first when your JavaScript doesn't work?", options: ["The browser Console", "The page title", "Your GitHub profile", "The CSS colours"], answer: 0, explanation: "Errors name the file and line." },
      { id: "web-f06", prompt: "What happens when you commit a change to a GitHub Pages site?", options: ["The live site updates within a few minutes", "Nothing ever changes", "The site is deleted", "You must re-register"], answer: 0, explanation: "Pages republishes on each commit." },
      { id: "web-f07", prompt: "Which file name is safest for the web?", options: ["profile-photo.jpg", "My Photo FINAL.JPG", "photo (1).jpeg", "Photo#1.jpg"], answer: 0, explanation: "Lowercase, hyphens, no spaces." },
      { id: "web-f08", prompt: "Which free editor is most popular for writing code?", options: ["Visual Studio Code", "Paint", "Calculator", "Notepad on a phone"], answer: 0, explanation: "VS Code is free and widely used." },
    ],
  },
];
