---
title: CSS layout and responsive design
minutes: 15
summary: Style the payment page with CSS, lay it out with flexbox and grid, design for phones first, and use a media query so it adapts to wider screens without separate pages.
---

## The problem

Most of Tallybook's customers open invoices on a phone, from a link in an email or WhatsApp message. The old page was designed on a laptop: on a phone, the table ran off the edge, the buttons were tiny, and customers had to pinch and zoom to pay.

**Responsive design** means one page that works at every width, designed for the smallest screen first.

## The concept

### CSS rules

```css
selector { property: value; }
```

Select by element (`button`), class (`.summary`) or id (`#amount`), and set properties such as `color`, `padding`, `font-size`.

### Layout

- **Flexbox** (`display: flex`) lines items up in a row or column, with gaps and alignment.
- **Grid** (`display: grid`) places items in rows and columns.

### Mobile first

Write the phone layout as the default. Then add **media queries** that change the layout when there's room:

```css
@media (min-width: 700px) { /* rules for wider screens */ }
```

### Touch-friendly

Tap targets at least about 44 pixels tall, body text at least 16px (which also stops phones zooming into form fields), and enough contrast to read in daylight.

![The phone layout stacks summary, invoice table and payment form in one column; a media query at 700px uses grid-template-columns and grid-template-areas to put the table on the left and the summary and form on the right](/images/courses/webjs/mobile-first.svg "Write the phone layout first; a media query adds columns when there's room.")

## Example

Add a stylesheet to `pay.html` from lesson 4. Put this inside `<head>`, and wrap the table and the balance in `<div class="layout">` with the balance in `<section class="summary">`:

```html
<style>
  :root { --ink: #1c1917; --muted: #57534e; --brand: #0f766e; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 16px/1.5 system-ui, sans-serif; color: var(--ink); }
  main { padding: 16px; max-width: 960px; margin: 0 auto; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e7e5e4; }
  .layout { display: grid; gap: 24px; }
  .summary { padding: 16px; border: 1px solid #e7e5e4; border-radius: 12px; }
  form { display: flex; flex-direction: column; gap: 8px; }
  input { font-size: 16px; padding: 12px; border: 1px solid var(--muted); border-radius: 8px; }
  button { min-height: 48px; font-size: 16px; color: white; background: var(--brand); border: 0; border-radius: 8px; }
  @media (min-width: 700px) {
    .layout { grid-template-columns: 2fr 1fr; align-items: start; }
  }
</style>
```

On a phone, `.layout` is a single column: the invoice table, then the summary. From 700 pixels wide, the media query turns it into two columns, table on the left and summary on the right, with no change to the HTML. The inputs are 16px with generous padding, and the button is 48px tall, so it's easy to tap.

## Walkthrough

1. Add the styles and resize the browser window across 700 pixels. Watch the layout switch.
2. In DevTools, turn on the device toolbar (Ctrl+Shift+M) and pick a phone. Is everything usable without zooming?
3. Change the brand colour to a pale yellow. Use DevTools' contrast checker on the button: does it pass?
4. Write a media query for very wide screens (the task below).

## Practice

```task
{
  "id": "web-05-t1",
  "prompt": "Write CSS so that the payment **form's fields sit side by side** (amount and reference in one row) on screens **at least 1000 pixels** wide, but stay stacked on smaller screens. Use a **media query** and **grid or flexbox**.",
  "minutes": 6,
  "rows": 8,
  "placeholder": "@media (min-width: 1000px) {\n  ...",
  "rules": [
    { "label": "A min-width media query of 1000px", "pattern": "@media\\s*\\(\\s*min-width\\s*:\\s*1000px\\s*\\)" },
    { "label": "Targets the form", "pattern": "form|#payment-form|\\.payment" },
    { "label": "Uses grid or flex in a row", "pattern": "grid-template-columns|flex-direction\\s*:\\s*row|display\\s*:\\s*grid" },
    { "label": "No fixed pixel width on the page body", "pattern": "body\\s*\\{[^}]*\\bwidth\\s*:\\s*\\d+px", "absent": true }
  ],
  "sample": "@media (min-width: 1000px) {\n  form {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    column-gap: 16px;\n    align-items: end;\n  }\n  form button { grid-column: 1 / -1; }\n}",
  "note": "The base styles still stack the fields; the media query only adds the two-column grid when there's room.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does 'mobile first' mean?",
    "options": ["Only support phones", "Write the phone layout as the default, then add rules for wider screens", "Build an app instead", "Test on phones last"],
    "answer": 1,
    "explanation": "Media queries add, rather than undo."
  },
  {
    "prompt": "Why set input font-size to at least 16px?",
    "options": ["It looks modern", "It's readable, and stops phones zooming in when the field is tapped", "Browsers require it", "It's faster"],
    "answer": 1,
    "explanation": "A common mobile annoyance avoided."
  },
  {
    "prompt": "What does `@media (min-width: 700px)` apply to?",
    "options": ["Screens narrower than 700px", "Screens at least 700px wide", "Printers only", "All screens"],
    "answer": 1,
    "explanation": "The wider layout switches on at 700px."
  }
]
```
