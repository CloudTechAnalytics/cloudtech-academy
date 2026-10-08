---
title: Forms and Tables
minutes: 35
summary: Collect information with forms (every input type, labels, built-in validation) and show data with tables. Build a sign-up form for a real event and a class timetable.
---

## Forms: how websites listen

Almost every useful website collects something from you: a login, a search, an order, a message. All of that starts with an HTML **form**.

A form is a container. Inside it are **controls** (the boxes, buttons and menus people fill in), and each control has a **label** that says what it is for. When someone presses the submit button, the browser gathers the answers and sends them to a server, or hands them to your JavaScript.

```html
<form action="/subscribe" method="post">
  ...controls go here...
</form>
```

- `action` is where the data is sent.
- `method` is how: `get` puts the data in the web address (good for searching), `post` sends it privately in the request (good for logins and sign-ups).

> [!NOTE]
> The preview in this course does not send forms anywhere. Pressing submit shows the browser's own checks (such as "Please fill out this field"), and later your JavaScript can react. Sending data to a real server is a topic for later courses.

## Labels and text inputs

Every input needs a `<label>`. Connect them with matching `for` and `id` values. When you do, clicking the label focuses the input, and a screen reader announces the label when the input is focused. Do not use `placeholder` as a replacement for a label, because it disappears when you type.

```live
=== html
<form>
  <p>
    <label for="name">Full name</label><br />
    <input type="text" id="name" name="name" placeholder="e.g. Ada Okafor" required />
  </p>
  <p>
    <label for="email">Email address</label><br />
    <input type="email" id="email" name="email" required />
  </p>
  <button type="submit">Register</button>
</form>
```

Click **Register** with the boxes empty, then with a bad email such as `ada`. The browser checks for you, and none of that needed JavaScript. Three attributes to know:

- `type` decides what kind of input it is and what the keyboard looks like on a phone.
- `name` is the **key** under which the answer is sent. Without it, the value is not submitted.
- `required` stops submission until the box is filled in.

## The input types

Choosing the right `type` gives you free validation and the right keyboard on mobile. Try each one.

| Type | For | Notes |
| :-- | :-- | :-- |
| `text` | Short text | The default |
| `email` | Email addresses | Checks for an `@` |
| `password` | Passwords | Hides the characters |
| `tel` | Phone numbers | Shows the number pad on phones |
| `number` | Numbers | Use `min`, `max` and `step` |
| `date` | A date | Shows a calendar picker |
| `url` | Web addresses | Checks for a valid URL |
| `range` | A slider | With `min` and `max` |
| `color` | A colour picker | Returns a code like `#ff0000` |
| `checkbox` | Yes or no, or pick several | `checked` ticks it |
| `radio` | Pick exactly one | Radios with the same `name` form a group |
| `file` | Upload a file | `accept="image/*"` limits the kind |

```live
=== html
<form>
  <p><label>Phone <input type="tel" name="phone" placeholder="0801 234 5678" /></label></p>
  <p><label>Tickets <input type="number" name="tickets" min="1" max="5" value="1" /></label></p>
  <p><label>Date <input type="date" name="date" /></label></p>
  <p><label>Budget <input type="range" name="budget" min="0" max="100" value="40" /></label></p>
  <p><label>Favourite colour <input type="color" name="colour" value="#0f766e" /></label></p>
  <p><label>Photo <input type="file" name="photo" accept="image/*" /></label></p>
</form>
```

Here the `<input>` is **inside** its `<label>`, which also links them. Either style works.

### Choices: checkboxes, radios and menus

```live
=== html
<form>
  <fieldset>
    <legend>How will you attend?</legend>
    <label><input type="radio" name="mode" value="in-person" checked /> In person</label><br />
    <label><input type="radio" name="mode" value="online" /> Online</label>
  </fieldset>

  <fieldset>
    <legend>Which sessions interest you?</legend>
    <label><input type="checkbox" name="topic" value="data" /> Data analysis</label><br />
    <label><input type="checkbox" name="topic" value="web" /> Web development</label><br />
    <label><input type="checkbox" name="topic" value="ai" /> AI tools</label>
  </fieldset>

  <p>
    <label for="city">Your city</label><br />
    <select id="city" name="city">
      <option value="">Choose one</option>
      <option value="lagos">Lagos</option>
      <option value="abuja">Abuja</option>
      <option value="ph">Port Harcourt</option>
    </select>
  </p>

  <p>
    <label for="note">Anything we should know?</label><br />
    <textarea id="note" name="note" rows="3" cols="40"></textarea>
  </p>
</form>
```

- `<fieldset>` groups related controls and `<legend>` names the group, which helps screen readers a lot.
- Radio buttons with the **same `name`** are a group: choosing one unchecks the others. The `value` is what gets sent.
- `<select>` makes a drop-down, with one `<option>` per choice.
- `<textarea>` is for longer text. Unlike `<input>`, it has a closing tag and its starting text goes between the tags.

## Helping people fill it in correctly

HTML can check a lot before JavaScript is needed:

| Attribute | What it does | Example |
| :-- | :-- | :-- |
| `required` | Must be filled in | `<input required />` |
| `minlength` and `maxlength` | Limit the length of text | `minlength="8"` for a password |
| `min` and `max` | Limit numbers and dates | `min="1" max="5"` |
| `pattern` | Must match a regular expression | `pattern="[0-9]{11}"` for an 11 digit phone number |
| `autocomplete` | Helps the browser fill it in | `autocomplete="email"` |
| `placeholder` | A grey hint inside the box | `placeholder="0801 234 5678"` |
| `disabled` | Cannot be used | `<button disabled>` |

## A complete sign-up form

This is the kind of form you will meet on any event page. Study each part, and try to submit it with mistakes.

```live
=== html
<h2>Lagos Tech Meetup: Register</h2>
<form>
  <p>
    <label for="fullname">Full name</label><br />
    <input id="fullname" name="fullname" type="text" autocomplete="name" required minlength="3" />
  </p>
  <p>
    <label for="mail">Email</label><br />
    <input id="mail" name="mail" type="email" autocomplete="email" required />
  </p>
  <p>
    <label for="phone">Phone (11 digits)</label><br />
    <input id="phone" name="phone" type="tel" pattern="[0-9]{11}" placeholder="08012345678" required />
  </p>
  <p>
    <label for="role">I am a</label><br />
    <select id="role" name="role" required>
      <option value="">Choose</option>
      <option>Student</option>
      <option>Graduate</option>
      <option>Working professional</option>
    </select>
  </p>
  <p><label><input type="checkbox" name="agree" required /> I agree to receive event updates</label></p>
  <button type="submit">Reserve my seat</button>
</form>
```

## Tables: showing data in rows and columns

A **table** is for data that really is a grid: timetables, price lists, results. (Do not use tables to lay out a page. That is the job of CSS, which you will learn soon.)

| Element | Role |
| :-- | :-- |
| `<table>` | The whole table |
| `<caption>` | A title for the table |
| `<thead>`, `<tbody>`, `<tfoot>` | The header, body and footer sections |
| `<tr>` | A table row |
| `<th>` | A header cell. Add `scope="col"` or `scope="row"` for accessibility |
| `<td>` | A data cell |

```live
=== html
<table border="1" cellpadding="8" cellspacing="0">
  <caption>Weekly timetable, JSS 1</caption>
  <thead>
    <tr>
      <th scope="col">Time</th>
      <th scope="col">Monday</th>
      <th scope="col">Tuesday</th>
      <th scope="col">Wednesday</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">8:00</th>
      <td>Mathematics</td>
      <td>English</td>
      <td>Science</td>
    </tr>
    <tr>
      <th scope="row">9:00</th>
      <td>English</td>
      <td>Mathematics</td>
      <td>Civic Education</td>
    </tr>
    <tr>
      <th scope="row">10:00</th>
      <td colspan="3">Break and assembly</td>
    </tr>
  </tbody>
</table>
```

A cell can stretch across columns with `colspan`, or across rows with `rowspan`. Here the break row uses `colspan="3"`. (The `border` and `cellpadding` attributes are only here so you can see the grid. In real sites you do this with CSS.)

## Try it

Build a contact form for a business. Every control needs a proper label, and the form must use the right input types.

```webtask
{
  "id": "web-m04-t1",
  "minutes": 12,
  "required": true,
  "rules": [
    { "label": "A heading (<h1> or <h2>) and a <form>", "selector": "h1, h2", "min": 1 },
    { "label": "A <form> element with controls inside it", "selector": "form input", "min": 1 },
    { "label": "A text input for the name, and an email input for the email", "selector": "input[type='text'], input[type='email']", "min": 2 },
    { "label": "Every input has a label connected with matching for and id", "in": "html", "pattern": "<label[^>]*for=[\"'][^\"']+[\"']" , "min": 3 },
    { "label": "A <select> with at least three <option> choices", "selector": "select option", "min": 3 },
    { "label": "A <textarea> for the message", "selector": "textarea", "min": 1 },
    { "label": "At least two fields are marked required", "selector": "[required]", "min": 2 },
    { "label": "A submit button with text", "selector": "button[type='submit']", "contains": "[A-Za-z]{3,}" }
  ],
  "hint": "Give each input an id and a matching label for=\"that-id\". Use type=\"email\" for the email, <select> with <option> items for the topic, <textarea> for the message, and <button type=\"submit\">Send</button>.",
  "height": 360
}
=== prompt
Build a "Contact us" form for a business. It needs a heading, a text input for the name and an email input for the email, a `<select>` with at least three topics, a `<textarea>` for the message, at least two `required` fields, and a submit button. Every input needs a `<label>` with a matching `for` and `id`.
=== html
<h2>Contact us</h2>
<form>

</form>
=== sample html
<h2>Contact us</h2>
<form>
  <p>
    <label for="name">Your name</label><br />
    <input type="text" id="name" name="name" required />
  </p>
  <p>
    <label for="email">Your email</label><br />
    <input type="email" id="email" name="email" required />
  </p>
  <p>
    <label for="topic">What is it about?</label><br />
    <select id="topic" name="topic">
      <option value="order">An order</option>
      <option value="complaint">A complaint</option>
      <option value="other">Something else</option>
    </select>
  </p>
  <p>
    <label for="msg">Message</label><br />
    <textarea id="msg" name="msg" rows="4" cols="40"></textarea>
  </p>
  <button type="submit">Send message</button>
</form>
=== note
Try pressing Send with the boxes empty. The browser stops you because of `required`, with no JavaScript. In the JavaScript lessons you will add your own messages and react to the form being submitted.
```

Now a table. Build a price list or timetable that a screen reader could navigate.

```webtask
{
  "id": "web-m04-t2",
  "minutes": 8,
  "required": true,
  "rules": [
    { "label": "A <table> with a <caption>", "selector": "table caption", "min": 1, "contains": "[A-Za-z]{3,}" },
    { "label": "A <thead> with header cells (<th scope=\"col\">), at least three", "selector": "thead th[scope='col']", "min": 3 },
    { "label": "A <tbody> with at least three rows", "selector": "tbody tr", "min": 3 },
    { "label": "Each row starts with a row header (<th scope=\"row\">)", "selector": "tbody th[scope='row']", "min": 3 },
    { "label": "At least one cell uses colspan or rowspan", "selector": "[colspan], [rowspan]", "min": 1 }
  ],
  "hint": "Start with <table><caption>...</caption><thead><tr><th scope=\"col\">...</th></tr></thead><tbody>...</tbody></table>. In each body row, make the first cell a <th scope=\"row\">.",
  "height": 320
}
=== prompt
Build a price list for a small business (for example a salon, a printing shop or a laundry). Use a `<caption>`, a `<thead>` with at least three column headers using `scope="col"`, a `<tbody>` with at least three rows where the first cell of each row is a `<th scope="row">`, and use `colspan` or `rowspan` at least once (for example a "Special offers" row).
=== html
<table border="1" cellpadding="8" cellspacing="0">

</table>
=== sample html
<table border="1" cellpadding="8" cellspacing="0">
  <caption>Laundry price list</caption>
  <thead>
    <tr>
      <th scope="col">Item</th>
      <th scope="col">Wash</th>
      <th scope="col">Wash and iron</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Shirt</th>
      <td>₦300</td>
      <td>₦500</td>
    </tr>
    <tr>
      <th scope="row">Trousers</th>
      <td>₦400</td>
      <td>₦600</td>
    </tr>
    <tr>
      <th scope="row">Bedsheet</th>
      <td>₦800</td>
      <td>₦1,000</td>
    </tr>
    <tr>
      <td colspan="3">Free pickup for orders above ₦5,000</td>
    </tr>
  </tbody>
</table>
```

```answer
{
  "id": "web-m04-a1",
  "prompt": "Which attribute on a `<label>` connects it to the input with a matching `id`? Type the attribute name.",
  "answer": "for",
  "format": "text",
  "accept": ["the for attribute", "for attribute"],
  "explanation": "<label for=\"email\"> goes with <input id=\"email\">. Clicking the label then focuses the input, and screen readers announce it.",
  "required": true
}
```
