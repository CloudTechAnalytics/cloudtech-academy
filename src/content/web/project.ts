import type { ProjectDef } from "../types";

export const WEB_PROJECT: ProjectDef = {
  id: "web-business-website",
  courseId: "web-development-for-beginners",
  title: "A published website for a real business",
  required: true,
  summary: "Design, build and publish a responsive, accessible multi-section website for a real or imaginary small business, using HTML, CSS, JavaScript and Bootstrap.",
  brief: `Choose a small business you know, such as a salon, a tailor, a food seller, a school, a church or a tutor, or invent one. Build its website and publish it at a live address.

Plan first: write down who the site is for, what they want and the one action you want them to take. Then build it with the skills from this course: semantic HTML, a responsive layout (Bootstrap, your own CSS, or both), at least one piece of JavaScript that makes the page react (for example a validated contact form, a menu toggle, a filter or a dark mode that remembers its setting), and a launch checklist.

Submit the **live address** of your site (GitHub Pages, Netlify or Vercel) and a link to your code on GitHub, with a short note on what the business is and which parts you are proudest of. Use only real content: do not invent customer reviews or statistics.`,
  tasks: [
    "A plan: the visitor, what they want and the main action, in a few sentences.",
    "A responsive navbar and a hero with one h1 and a clear call to action.",
    "At least three content sections (services, about, prices, gallery or similar) using cards, a grid or flexbox.",
    "A contact or order form with labelled fields and validation messages from JavaScript.",
    "At least one more piece of JavaScript that responds to the visitor.",
    "Accessible and mobile friendly: alt text, a sensible heading order, keyboard use, good contrast and no sideways scrolling on a phone.",
    "Page information: lang, a descriptive title, a meta description, a favicon and Open Graph tags.",
    "Published at a live address, with a README in the repository, and checked with Lighthouse.",
  ],
  datasets: [],
  rubric: [
    "The site is live, the address works, and the repository has a clear README.",
    "The HTML is valid and semantic, with a single h1 and a logical heading outline.",
    "The layout is responsive and looks good on a phone, a tablet and a desktop.",
    "The form and the JavaScript work, give clear feedback, and handle bad input.",
    "The site is accessible: alt text, labels, keyboard use, readable contrast, and a good Lighthouse accessibility score.",
    "The content is real and well written, with no invented reviews or statistics, and the site has a clear call to action.",
  ],
};
