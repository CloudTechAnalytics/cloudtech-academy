import type { AssessmentDef } from "../types";

const C = "web-development-for-beginners";

type Q = AssessmentDef["questions"][number];
const q = (id: string, prompt: string, options: string[], answer: number, explanation: string): Q => ({ id, prompt, options, answer, explanation });
const check = (n: string, title: string, questions: Q[]): AssessmentDef => ({
  id: `web-${n}-check`,
  courseId: C,
  kind: "module",
  moduleId: `web-${n}`,
  title: `${title}: module check`,
  passingScore: 60,
  questions,
});

/**
 * Web Development: a check for each module (it awards the module badge, and unlocks only after the
 * module's tasks are done) and a final assessment. Questions are scenarios with plausible wrong answers.
 */
export const WEB_ASSESSMENTS: AssessmentDef[] = [
  check("m01", "How the Web Works and Your First Page", [
    q("web-m01-q1", "You type a web address and press Enter. What does the server send back to your browser?", ["A finished picture of the page", "Files (HTML, CSS and JavaScript) that the browser turns into the page", "Only the page's text", "An email with a link"], 1, "The browser draws the page from the files the server sends."),
    q("web-m01-q2", "A friend says: \"My page has the right words but looks plain, with no colours or layout.\" Which language is missing or not connected?", ["HTML", "CSS", "JavaScript", "SQL"], 1, "HTML gives structure and content; CSS controls colour, fonts and layout."),
    q("web-m01-q3", "Where does the text people see on a page, like headings and paragraphs, belong?", ["Inside <head>", "Inside <body>", "Before <!DOCTYPE html>", "Inside <title>"], 1, "<head> holds information about the page; <body> holds what visitors see."),
    q("web-m01-q4", "Which line is the correct way to write a link to Google?", ["<a>https://www.google.com</a>", "<link href=\"https://www.google.com\">Google</link>", "<a href=\"https://www.google.com\">Google</a>", "<href=\"https://www.google.com\">Google</href>"], 2, "A link is an <a> element, and its address goes in the href attribute."),
    q("web-m01-q5", "A page has a heading, and the next paragraph is not closed with </p>. What is the best fix?", ["Ignore it, browsers always guess right", "Add the closing </p> tag", "Delete the heading", "Replace the paragraph with <br>"], 1, "Close every tag you open. Guessing browsers can render the rest of the page wrongly."),
  ]),
  check("m02", "Text, Lists, Links and Images", [
    q("web-m02-q1", "Which element should you use for an ordered list of steps in a recipe?", ["<ul>", "<ol>", "<dl>", "<li> on its own"], 1, "<ol> numbers the items, which matters when order matters. <li> items go inside it."),
    q("web-m02-q2", "You want a link that jumps to the section <h2 id=\"prices\"> on the same page. What is the href?", ["href=\"prices\"", "href=\"#prices\"", "href=\".prices\"", "href=\"/prices.html\""], 1, "A # followed by the id jumps to that element on the same page."),
    q("web-m02-q3", "Which image tag follows good practice?", ["<img src=\"cake.jpg\">", "<img src=\"cake.jpg\" alt=\"image\">", "<img src=\"cake.jpg\" alt=\"A three-tier birthday cake with white icing\" width=\"600\" height=\"400\">", "<img alt=\"A cake\">"], 2, "Useful alt text, plus width and height so the page does not jump while the image loads. An image without src shows nothing."),
    q("web-m02-q4", "A link opens a page on another website in a new tab. Which attribute should you add for safety?", ["rel=\"noopener noreferrer\"", "alt=\"external\"", "download", "id=\"external\""], 0, "target=\"_blank\" should be paired with rel=\"noopener noreferrer\"."),
    q("web-m02-q5", "Which link text is best for someone using a screen reader to jump from link to link?", ["Click here", "Read more", "Download the 2026 price list (PDF)", "Link"], 2, "Link text should make sense on its own."),
  ]),
  check("m03", "Page Structure: Semantic HTML and Layout Elements", [
    q("web-m03-q1", "Why use <nav> and <footer> instead of <div> for every part of a page?", ["Divs are not allowed any more", "They tell browsers, search engines and screen readers what each part is", "They load faster", "They add colour automatically"], 1, "Semantic elements carry meaning that helps accessibility and search."),
    q("web-m03-q2", "A page has the site menu, a news story and a copyright line. Which elements fit best, in that order?", ["<div>, <div>, <div>", "<nav>, <article>, <footer>", "<header>, <aside>, <main>", "<section>, <nav>, <article>"], 1, "Navigation, a standalone story and the footer."),
    q("web-m03-q3", "How many <main> elements should one page have?", ["One", "As many as there are sections", "Zero", "Two, one per column"], 0, "<main> marks the single main content of the page."),
    q("web-m03-q4", "Which sentence about class and id is true?", ["Many elements can share an id, but a class must be unique", "Many elements can share a class, but an id must be unique on the page", "They are the same", "Only ids can be used in CSS"], 1, "Classes are for groups, ids for one-off elements."),
    q("web-m03-q5", "You need a plain box just to group some elements so CSS can style them, and nothing else fits. What do you use?", ["<section>", "<article>", "<div>", "<aside>"], 2, "<div> is the generic block box with no meaning, for when no meaningful element fits."),
  ]),
  check("m04", "Forms and Tables", [
    q("web-m04-q1", "Clicking the label \"Email\" should put the cursor in the email box. What makes that work?", ["Putting the label above the input", "A matching for on the <label> and id on the <input>", "Using placeholder text", "Giving the input a class"], 1, "<label for=\"email\"> goes with <input id=\"email\">."),
    q("web-m04-q2", "Which input type gives you a calendar picker?", ["type=\"text\"", "type=\"date\"", "type=\"number\"", "type=\"calendar\""], 1, "type=\"date\" shows a date picker. There is no calendar type."),
    q("web-m04-q3", "A form has three radio buttons for \"How will you attend?\" but the visitor can tick all three. What is wrong?", ["They need different ids", "They need the same name", "They need the required attribute", "Radios cannot be in a form"], 1, "Radio buttons with the same name form a group where only one can be chosen."),
    q("web-m04-q4", "A signup form accepts \"ada\" in the email box. Which change gets the browser to check it for an @?", ["Use type=\"text\"", "Use type=\"email\"", "Use a longer placeholder", "Remove the label"], 1, "type=\"email\" checks the format before submission."),
    q("web-m04-q5", "In a timetable table, which element is used for the header cell at the top of a column?", ["<td scope=\"col\">", "<th scope=\"col\">", "<tr scope=\"col\">", "<caption>"], 1, "<th> is a header cell, and scope says whether it heads a column or a row."),
  ]),
  check("m05", "Media, Page Information, Search and Accessibility", [
    q("web-m05-q1", "When someone shares your link on WhatsApp, which tags control the title and picture shown in the preview?", ["<h1> and <img>", "Open Graph meta tags such as og:title and og:image", "The favicon", "The viewport tag"], 1, "Open Graph tags describe the page for sharing."),
    q("web-m05-q2", "Which is the best meta description for a school's homepage?", ["School", "A small, friendly school in Ibadan for ages 6 to 17, with WAEC preparation and a coding club.", "Welcome to our website, which is the best website for the best school, best school, best school", "Click here"], 1, "A clear sentence of about 150 characters that makes people want to click."),
    q("web-m05-q3", "A button shows only a magnifying-glass icon. What should you add so a screen reader user knows what it does?", ["A bigger icon", "aria-label=\"Search\"", "A red border", "alt=\"Search\" on the button"], 1, "aria-label gives an accessible name to an icon-only control."),
    q("web-m05-q4", "Which step helps a keyboard-only visitor most?", ["Making every control reachable and usable with Tab and Enter", "Adding more images", "Using smaller text", "Hiding the focus outline"], 0, "Everything a mouse can do must also work with the keyboard."),
    q("web-m05-q5", "Lighthouse in Chrome DevTools reports an accessibility score of 62. What is the best next step?", ["Ignore it, scores do not matter", "Read the list of issues it gives and fix them, like missing alt text and labels", "Delete the page", "Add more colour"], 1, "Lighthouse lists concrete fixes."),
  ]),
  check("m06", "CSS Fundamentals: Selectors and the Cascade", [
    q("web-m06-q1", "You wrote style.css, but the page looks unstyled. What is the most likely cause?", ["CSS does not work offline", "The <link rel=\"stylesheet\" href=\"style.css\"> line is missing or the file name does not match", "The browser is too old", "JavaScript is needed first"], 1, "The HTML must link the stylesheet with the exact file name."),
    q("web-m06-q2", "Which selector targets the one element with id=\"contact\"?", [".contact", "#contact", "contact", "*contact"], 1, "# is for ids and . is for classes."),
    q("web-m06-q3", "A paragraph has class=\"note\". Your CSS has p { color: black; } above .note { color: crimson; }. What colour is it?", ["Black, because it was written first", "Crimson, because a class is more specific than an element", "Crimson only if you add !important", "Neither, they cancel out"], 1, "Specificity: a class beats an element selector."),
    q("web-m06-q4", "Which rule styles every link inside the <nav> and nothing else?", ["nav, a { }", "nav a { }", "nav > p { }", "a.nav { }"], 1, "A descendant selector: an <a> anywhere inside <nav>."),
    q("web-m06-q5", "Why is body { font-family: system-ui, sans-serif; } enough to set the font for the whole page?", ["Because body is the biggest element", "Because font-family is inherited by child elements", "Because CSS always applies to everything", "It is not enough"], 1, "Some properties, like font-family and color, are inherited."),
  ]),
  check("m07", "The Box Model, Units, Display and Position", [
    q("web-m07-q1", "A box has width: 300px, padding: 20px and a 5px border with the default box-sizing. How wide is it on the page?", ["300px", "340px", "350px", "320px"], 2, "300 + 20 + 20 + 5 + 5 = 350px. With box-sizing: border-box it would be 300px."),
    q("web-m07-q2", "Which two lines centre a box with a set width in its parent?", ["text-align: center;", "margin: 0 auto;", "padding: auto;", "display: center;"], 1, "Left and right margins of auto split the free space equally."),
    q("web-m07-q3", "Your link has padding: 12px 24px but the vertical padding does not push other lines away. What fixes it?", ["display: inline-block;", "position: static;", "float: none;", "display: inline;"], 0, "Inline elements ignore vertical sizing. inline-block respects it."),
    q("web-m07-q4", "You want a menu bar that stays at the top of the screen while the page scrolls. Which is the best choice?", ["position: sticky; top: 0;", "position: static;", "display: none;", "overflow: hidden;"], 0, "sticky flows normally, then sticks to the top when you scroll past it."),
    q("web-m07-q5", "Which unit is best for text size, so it respects the user's own text-size settings?", ["px", "rem", "vh", "cm"], 1, "rem scales with the base font size the user has chosen."),
  ]),
  check("m08", "Colour, Fonts, Backgrounds and Visual Effects", [
    q("web-m08-q1", "Your light grey text on white is stylish but hard to read. What should you check?", ["The colour contrast ratio, aiming for at least 4.5 to 1", "The font file size", "The image sizes", "The page title"], 0, "WCAG asks for at least 4.5 to 1 for normal text."),
    q("web-m08-q2", "Which gives comfortable, readable body text?", ["font-size: 12px; line-height: 1;", "font-size: 1rem; line-height: 1.6;", "font-size: 10px; line-height: 3;", "font-size: 2rem; line-height: 0.8;"], 1, "About 16px with a line height of 1.5 to 1.7."),
    q("web-m08-q3", "Your brand colour is used in forty rules and the client wants a new colour. What would have made this a one-line change?", ["Using color names", "CSS custom properties, like --brand set on :root and used with var(--brand)", "Using inline styles", "Using !important"], 1, "Variables let you change a value in one place."),
    q("web-m08-q4", "How do you draw a diagonal two-colour background with no image file?", ["background: url(gradient)", "background: linear-gradient(135deg, #0f766e, #134e4a);", "background: two-colours;", "background-image: diagonal;"], 1, "CSS gradients are drawn by the browser, so they load instantly."),
    q("web-m08-q5", "Why should a page use at most two fonts?", ["Browsers only allow two", "Every font file makes the page slower, and too many fonts look messy", "Fonts cost money", "More than two cannot be centred"], 1, "Speed and visual consistency."),
  ]),
  check("m09", "Flexbox: Layout in One Direction", [
    q("web-m09-q1", "Which property, set on the flex container, spreads items along the main axis with the first at one end and the last at the other?", ["align-items: center", "justify-content: space-between", "flex-wrap: wrap", "gap: 1rem"], 1, "space-between puts the free space between items."),
    q("web-m09-q2", "You want to centre one item both horizontally and vertically inside a tall box. Which works?", ["display: flex; justify-content: center; align-items: center;", "text-align: center;", "margin: auto;", "position: center;"], 0, "Flexbox centres on both axes with those two properties."),
    q("web-m09-q3", "Cards in a flex row shrink to tiny widths on a phone. Which change lets them drop onto new lines?", ["flex-wrap: wrap;", "display: block;", "overflow: hidden;", "flex-direction: row;"], 0, "flex-wrap: wrap allows items to move to a new line."),
    q("web-m09-q4", "What does flex: 1 1 200px mean for an item?", ["Always exactly 200px", "It can grow, can shrink, and starts at 200px", "It is hidden below 200px", "It must have 200 items"], 1, "grow 1, shrink 1, basis 200px."),
    q("web-m09-q5", "A navbar has a logo and links, and you want the logo on the left and links on the right. Which is the best approach?", ["Make the header display: flex; justify-content: space-between;", "Float the logo", "Use a table", "Use text-align: justify"], 0, "A classic flexbox pattern."),
  ]),
  check("m10", "CSS Grid: Layout in Rows and Columns", [
    q("web-m10-q1", "What does grid-template-columns: 1fr 2fr create?", ["Two equal columns", "Two columns where the second is twice as wide as the first", "One column of 3px", "Two rows"], 1, "fr divides the free space in proportion."),
    q("web-m10-q2", "Which line makes as many columns of at least 220px as will fit, sharing the leftover space?", ["grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));", "grid-template-columns: 220px;", "display: columns;", "grid-columns: auto;"], 0, "A responsive gallery with no media queries."),
    q("web-m10-q3", "You want one featured card to be twice as wide as the others in a grid. What do you give it?", ["grid-column: span 2;", "width: 200%;", "flex: 2;", "display: wide;"], 0, "Items can span multiple tracks."),
    q("web-m10-q4", "When is grid a better choice than flexbox?", ["When laying out items in a single row", "When you need rows and columns together, such as a gallery or a whole page layout", "Never, flexbox does everything", "Only for text"], 1, "Flexbox is one-dimensional, grid is two-dimensional."),
    q("web-m10-q5", "In grid-template-areas, what is the picture of strings used for?", ["Setting font sizes", "Drawing the page layout, then giving each element a name with grid-area", "Adding images", "Choosing colours"], 1, "The drawing is the layout."),
  ]),
  check("m11", "Responsive Design: One Site for Every Screen", [
    q("web-m11-q1", "Which is the mobile-first way to write a three-column layout?", ["Write three columns first, then remove them with max-width queries", "Write one column first, then add columns with @media (min-width: ...)", "Make two separate websites", "Use fixed pixel widths"], 1, "Start small and add layout as the screen grows."),
    q("web-m11-q2", "A wide photo overflows a narrow phone screen. Which rule is the standard fix?", ["img { width: 2000px; }", "img { max-width: 100%; height: auto; }", "img { display: none; }", "img { position: fixed; }"], 1, "The image shrinks to fit its container and keeps its proportions."),
    q("web-m11-q3", "What does font-size: clamp(1.8rem, 4vw + 1rem, 3rem) do?", ["Fixes the size at 3rem", "Scales with the screen but never below 1.8rem or above 3rem", "Makes text blink", "Applies only on phones"], 1, "clamp(min, ideal, max)."),
    q("web-m11-q4", "Where do you decide your breakpoints?", ["At the sizes of the latest iPhone", "Where your own layout starts to look stretched or crowded", "At 1000px always", "You cannot choose them"], 1, "Let the content decide."),
    q("web-m11-q5", "What does @media (prefers-reduced-motion: reduce) let you do?", ["Make the page smaller", "Switch off animations for people who asked their device for less motion", "Reduce the image sizes", "Hide the menu"], 1, "It respects an accessibility setting on the user's device."),
  ]),
  check("m12", "Transitions, Transforms, Animation and Pseudo-elements", [
    q("web-m12-q1", "You want a button to change colour smoothly over a third of a second on hover. What do you add?", ["transition: background 0.3s ease; on the button", "animation: hover;", "display: smooth;", "delay: 0.3s"], 0, "A transition makes a change gradual."),
    q("web-m12-q2", "Which two properties are the best to animate for smooth, fast motion?", ["width and height", "transform and opacity", "margin and top", "padding and border"], 1, "They do not force the browser to recalculate the page layout."),
    q("web-m12-q3", "What must you write inside ::before or ::after for the pseudo-element to appear?", ["content: \"\";", "display: pseudo;", "visible: true;", "text: before;"], 0, "Without a content property, the pseudo-element is not generated."),
    q("web-m12-q4", "A spinner should turn forever. Which animation shorthand does this?", ["animation: spin 0.9s linear infinite;", "animation: spin once;", "transition: spin 0.9s;", "transform: spin;"], 0, "infinite repeats the keyframes forever."),
    q("web-m12-q5", "Why add @media (prefers-reduced-motion: reduce) to your CSS?", ["To make animations faster", "Some people feel unwell with lots of motion, and it lets them turn it off", "It is required by browsers", "It improves SEO"], 1, "It is about accessibility and kindness."),
  ]),
  {
    id: "web-development-for-beginners-final",
    courseId: C,
    kind: "final",
    title: "Web Development: final assessment",
    passingScore: 60,
    questions: [
      q("web-f01", "Which language controls colours, fonts and layout?", ["HTML", "CSS", "JavaScript", "Markdown"], 1, "CSS is the style layer."),
      q("web-f02", "Which tag makes a bulleted list item?", ["<ul>", "<li>", "<ol>", "<p>"], 1, "<li> items go inside <ul> (bullets) or <ol> (numbers)."),
      q("web-f03", "Why give images alt text?", ["It makes them load faster", "It describes them for screen readers and if they fail to load", "It is required for colour", "It adds a caption"], 1, "Accessibility and resilience."),
      q("web-f04", "Which CSS makes cards sit side by side and wrap on phones?", ["display: flex; flex-wrap: wrap;", "display: none;", "position: fixed;", "float: center;"], 0, "Flexbox with wrapping."),
      q("web-f05", "A shared link on WhatsApp shows no title or picture. What is missing?", ["Open Graph meta tags in the head", "More paragraphs", "A bigger font", "A favicon only"], 0, "og:title, og:description and og:image."),
      q("web-f06", "Which selector is the most specific?", ["p", ".note", "#special", "p.note"], 2, "An id beats a class, which beats an element."),
      q("web-f07", "Which is the best way to build a page's overall header, sidebar, main content and footer?", ["A CSS grid with named areas", "Nested tables", "Absolute positioning for everything", "Images"], 0, "Grid is made for two-dimensional page layouts."),
      q("web-f08", "Your site works on your laptop, but on a phone the text is tiny and the page is zoomed out. What is missing?", ["The viewport meta tag", "A bigger heading", "More padding", "JavaScript"], 0, "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">."),
    ],
  },
];
