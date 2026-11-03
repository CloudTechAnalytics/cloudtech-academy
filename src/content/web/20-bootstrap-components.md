---
title: "Bootstrap Components: Navbar, Cards, Forms, Modals and More"
minutes: 40
summary: Use Bootstrap's ready-made components to build real interfaces fast. Build a responsive navbar, cards, alerts, forms with validation, an accordion and a modal, and learn to read the Bootstrap documentation.
---

## Components: pre-built pieces

In the last lesson you used Bootstrap's grid and utilities. Its **components** are bigger pre-built pieces of interface: a navigation bar, a card, a modal dialog, an accordion. Each is a pattern of HTML with the right class names. You do not need to memorise them. Professional developers keep the **documentation** open at **getbootstrap.com/docs** and copy the example for the component they need, then change the words.

Learning to read that documentation is the real skill, so each component below shows the pattern, and you should open the docs and find the same one.

## Buttons

```live
{ "bootstrap": true, "height": 280 }
=== html
<div class="container py-3">
  <p>
    <button class="btn btn-primary">Primary</button>
    <button class="btn btn-secondary">Secondary</button>
    <button class="btn btn-success">Success</button>
    <button class="btn btn-danger">Danger</button>
    <button class="btn btn-warning">Warning</button>
    <button class="btn btn-light border">Light</button>
  </p>
  <p>
    <button class="btn btn-outline-primary">Outline</button>
    <button class="btn btn-primary btn-sm">Small</button>
    <button class="btn btn-primary btn-lg">Large</button>
    <button class="btn btn-primary" disabled>Disabled</button>
  </p>
  <div class="d-grid gap-2"><button class="btn btn-success">Full width (d-grid)</button></div>
</div>
```

Always begin with `btn`, then add a colour class. Use `<button>` for actions and `<a class="btn">` for links that look like buttons.

## Alerts, badges and spinners

```live
{ "bootstrap": true, "height": 330 }
=== html
<div class="container py-3">
  <div class="alert alert-success" role="alert">Your order was placed successfully.</div>
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    Payment failed. Please try again.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  <p>
    Inbox <span class="badge text-bg-danger">4</span>
    <span class="badge rounded-pill text-bg-success">New</span>
  </p>
  <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>
  <div class="progress mt-3" role="progressbar" aria-label="Course progress" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">
    <div class="progress-bar bg-success" style="width: 65%">65%</div>
  </div>
</div>
```

Click the **x** on the red alert. It disappears, because `data-bs-dismiss="alert"` is wired up by Bootstrap's JavaScript. Notice the `visually-hidden` text, which lets screen readers hear what a spinner means. Bootstrap builds accessibility into its patterns, so keep those attributes.

## Cards

A card is a flexible box for a piece of content: a product, a course, a profile.

```live
{ "bootstrap": true, "stack": true, "height": 360 }
=== html
<div class="container py-3">
  <div class="row row-cols-1 row-cols-md-3 g-3">
    <div class="col">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Excel for Data Analysis</h5>
          <p class="card-text">Formulas, pivot tables and charts, with practice in your browser.</p>
        </div>
        <div class="card-footer bg-transparent border-0">
          <a href="#" class="btn btn-primary">Start free</a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">SQL for Data Analysis</h5>
          <p class="card-text">Write real queries and get instant feedback.</p>
        </div>
        <div class="card-footer bg-transparent border-0">
          <a href="#" class="btn btn-primary">Start free</a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Python for Beginners</h5>
          <p class="card-text">Your first lines of code, step by step.</p>
        </div>
        <div class="card-footer bg-transparent border-0">
          <a href="#" class="btn btn-primary">Start free</a>
        </div>
      </div>
    </div>
  </div>
</div>
```

`h-100` makes the cards in a row the same height. The `row-cols-*` classes put them in a responsive grid, using the lesson 19 skills.

## The navbar

The navbar is the most complicated component and the one you will use on almost every site. It collapses into a **hamburger button** on small screens, using Bootstrap's JavaScript. Study its structure, then use the **Phone** and **Desktop** preview buttons to see it change. On the phone, click the hamburger button.

```live
{ "bootstrap": true, "stack": true, "height": 300 }
=== html
<nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
  <div class="container">
    <a class="navbar-brand fw-bold" href="#">CloudTech</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="mainNav">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link active" aria-current="page" href="#">Courses</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Projects</a></li>
        <li class="nav-item"><a class="nav-link" href="#">About</a></li>
      </ul>
      <a class="btn btn-success" href="#">Sign up</a>
    </div>
  </div>
</nav>
<main class="container py-4"><h1>Page content</h1></main>
```

How it works:

- `navbar-expand-lg` means "show the full menu from the `lg` breakpoint upwards, and collapse it below".
- The **toggler** button has `data-bs-toggle="collapse"` and `data-bs-target="#mainNav"`, which points to the `id` of the part that opens and closes.
- The collapsing part has the classes `collapse navbar-collapse` and that `id`.

Two ids must match exactly: `data-bs-target="#mainNav"` and `id="mainNav"`. If they do not, the button does nothing, and that is the most common Bootstrap bug.

## Forms

Bootstrap makes forms look good with a few classes: `form-label`, `form-control`, `form-select`, `form-check`. Inputs are connected to labels exactly as in lesson 4.

```live
{ "bootstrap": true, "stack": true, "height": 480 }
=== html
<div class="container py-3" style="max-width: 480px">
  <form class="needs-validation" novalidate>
    <div class="mb-3">
      <label for="name" class="form-label">Full name</label>
      <input type="text" class="form-control" id="name" required />
      <div class="invalid-feedback">Please enter your name.</div>
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input type="email" class="form-control" id="email" placeholder="name@example.com" required />
      <div class="invalid-feedback">Please enter a valid email.</div>
    </div>
    <div class="mb-3">
      <label for="track" class="form-label">Track</label>
      <select class="form-select" id="track">
        <option>Data analysis</option>
        <option>Web development</option>
        <option>Business</option>
      </select>
    </div>
    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" id="agree" required />
      <label class="form-check-label" for="agree">I agree to the terms</label>
    </div>
    <div class="input-group mb-3">
      <span class="input-group-text">₦</span>
      <input type="number" class="form-control" aria-label="Amount" placeholder="Budget" />
    </div>
    <button class="btn btn-primary w-100" type="submit">Register</button>
  </form>
</div>
=== js
document.querySelectorAll(".needs-validation").forEach((form) => {
  form.addEventListener("submit", (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add("was-validated");   // shows green or red feedback on each field
  });
});
```

Press **Register** with the form empty. Bootstrap's `was-validated` class (added by the small script) makes the invalid fields red, and the `invalid-feedback` text appears under them. This combines HTML's built-in validation from lesson 4 with Bootstrap styling.

## Accordion and modal

An **accordion** shows one panel at a time. A **modal** is a dialog that appears over the page. Both are driven by `data-bs-*` attributes, so you write no JavaScript.

```live
{ "bootstrap": true, "stack": true, "height": 400 }
=== html
<div class="container py-3">
  <div class="accordion" id="faq">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#q1" aria-expanded="true" aria-controls="q1">How do I pay?</button>
      </h2>
      <div id="q1" class="accordion-collapse collapse show" data-bs-parent="#faq">
        <div class="accordion-body">By bank transfer. Upload your receipt and we confirm within a day.</div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#q2" aria-expanded="false" aria-controls="q2">Can I learn on my phone?</button>
      </h2>
      <div id="q2" class="accordion-collapse collapse" data-bs-parent="#faq">
        <div class="accordion-body">Yes. Every lesson works in a phone browser.</div>
      </div>
    </div>
  </div>

  <button type="button" class="btn btn-primary mt-4" data-bs-toggle="modal" data-bs-target="#orderModal">Place order</button>

  <div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="orderTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="orderTitle">Confirm your order</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">Two plates of jollof rice, delivered to Yaba. Total ₦6,000.</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-success" data-bs-dismiss="modal">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

The pattern for a modal is always a **trigger** with `data-bs-toggle="modal" data-bs-target="#id"`, and a `.modal` with that same `id`. Other components follow the same idea: tabs, dropdowns, carousels, tooltips and offcanvas menus.

## Other components worth knowing

| Component | Class | Good for |
| :-- | :-- | :-- |
| List group | `list-group` | Menus, settings, simple lists |
| Breadcrumb | `breadcrumb` | Showing where you are in a site |
| Pagination | `pagination` | Moving through pages of results |
| Dropdown | `dropdown` | A menu opened from a button |
| Carousel | `carousel` | A slideshow of images |
| Tabs and pills | `nav nav-tabs` | Switching between content panels |
| Offcanvas | `offcanvas` | A sliding side panel |
| Toast | `toast` | A small temporary notification |

For any of them: open the Bootstrap docs, find the component, copy the example, and change the text.

## When to use Bootstrap, and when not

Use Bootstrap when you need a consistent, responsive interface **quickly**: dashboards, admin pages, prototypes, internal tools, small business sites. Consider your own CSS (or a lighter tool) when a unique brand look is the goal, or when page speed is critical and you would load a lot of unused CSS. Many professionals use both: Bootstrap as a base and custom CSS to make it theirs.

## Try it

Build a responsive navbar. It must collapse on a phone and spread out on a laptop.

```webtask
{
  "id": "web-m20-t1",
  "minutes": 15,
  "required": true,
  "bootstrap": true,
  "stack": true,
  "height": 300,
  "tabs": ["html"],
  "rules": [
    { "label": "It is a <nav class=\"navbar navbar-expand-lg\"> with a .navbar-brand", "selector": "nav.navbar.navbar-expand-lg .navbar-brand", "min": 1, "contains": "[A-Za-z]{2,}" },
    { "label": "At least three .nav-link links in a .navbar-nav", "selector": ".navbar-nav .nav-link", "min": 3 },
    { "label": "There is a toggler button with data-bs-toggle=\"collapse\"", "selector": "button.navbar-toggler[data-bs-toggle='collapse']", "min": 1 },
    { "label": "The toggler's data-bs-target matches the id of the collapsing part", "in": "html", "pattern": "data-bs-target=[\"']#(\\w+)[\"'][\\s\\S]*?\\bid=[\"']\\1[\"']" },
    { "label": "On a phone (400px) the menu is hidden behind the toggler", "selector": ".navbar-collapse", "at": 400, "style": { "display": "none" } },
    { "label": "On a laptop (1000px) the menu is shown in a row", "selector": ".navbar-collapse", "at": 1000, "style": { "display": "flex" } },
    { "label": "Clicking the toggler on a phone starts opening the menu", "selector": ".navbar-collapse.collapsing, .navbar-collapse.show", "at": 400, "act": [{ "click": ".navbar-toggler" }], "min": 1 }
  ],
  "hint": "<nav class=\"navbar navbar-expand-lg bg-dark\" data-bs-theme=\"dark\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#\">Brand</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\" aria-controls=\"mainNav\" aria-expanded=\"false\" aria-label=\"Toggle navigation\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse\" id=\"mainNav\"><ul class=\"navbar-nav\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#\">Home</a></li>...</ul></div></div></nav>"
}
=== prompt
Build a responsive Bootstrap navbar: `<nav class="navbar navbar-expand-lg bg-dark">` with a `navbar-brand` (your business name), a **toggler button** (`navbar-toggler`, `data-bs-toggle="collapse"`, `data-bs-target="#mainNav"`), and a `div.collapse.navbar-collapse#mainNav` holding a `ul.navbar-nav` with **at least three** `nav-link` links. Use the preview's **Phone** and **Desktop** buttons to check it.
=== html
<nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">

</nav>
=== sample html
<nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
  <div class="container">
    <a class="navbar-brand" href="#">Naija Eats</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="mainNav">
      <ul class="navbar-nav me-auto">
        <li class="nav-item"><a class="nav-link active" href="#">Menu</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Offers</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
      </ul>
    </div>
  </div>
</nav>
```

Now a card with a modal.

```webtask
{
  "id": "web-m20-t2",
  "minutes": 12,
  "required": true,
  "bootstrap": true,
  "stack": true,
  "height": 320,
  "tabs": ["html"],
  "rules": [
    { "label": "A .card with a .card-body, a .card-title and .card-text", "selector": ".card .card-body .card-title", "min": 1, "contains": "[A-Za-z]{2,}" },
    { "label": "The card has a text paragraph (.card-text)", "selector": ".card .card-text", "min": 1 },
    { "label": "A button opens a modal: data-bs-toggle=\"modal\" with a data-bs-target", "selector": "[data-bs-toggle='modal'][data-bs-target]", "min": 1 },
    { "label": "The modal's id matches the button's target", "in": "html", "pattern": "data-bs-target=[\"']#(\\w+)[\"'][\\s\\S]*?\\bid=[\"']\\1[\"']" },
    { "label": "The modal has a title (.modal-title), a body (.modal-body) and a dismiss button (data-bs-dismiss=\"modal\")", "selector": ".modal .modal-title, .modal .modal-body, .modal [data-bs-dismiss='modal']", "min": 3 },
    { "label": "The card uses utility classes: a shadow and the .h-100 or .mb-3 spacing", "in": "html", "pattern": "class=\"card[^\"]*\\bshadow" }
  ],
  "hint": "<div class=\"card shadow-sm\" style=...><div class=\"card-body\"><h5 class=\"card-title\">...</h5><p class=\"card-text\">...</p><button class=\"btn btn-primary\" data-bs-toggle=\"modal\" data-bs-target=\"#detailsModal\">Details</button></div></div> and then a div.modal.fade#detailsModal with .modal-dialog > .modal-content > .modal-header/.modal-body."
}
=== prompt
Build a **course card** (`.card` with `.shadow-sm`, a `.card-body`, `.card-title`, `.card-text` and a button) where the button opens a **modal** with more details. The button needs `data-bs-toggle="modal"` and `data-bs-target="#detailsModal"`, and the modal is a `div.modal.fade` with `id="detailsModal"`, a `.modal-title`, a `.modal-body` and a button with `data-bs-dismiss="modal"`.
=== html
<div class="container py-4" >

</div>
=== sample html
<div class="container py-4">
  <div class="card shadow-sm" style="max-width: 20rem">
    <div class="card-body">
      <h5 class="card-title">Web Development</h5>
      <p class="card-text">HTML, CSS, JavaScript and Bootstrap, with a live editor.</p>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#detailsModal">Details</button>
    </div>
  </div>

  <div class="modal fade" id="detailsModal" tabindex="-1" aria-labelledby="detailsTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="detailsTitle">Course details</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">22 lessons, practised in your browser, with a badge for every module.</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

```answer
{
  "id": "web-m20-a1",
  "prompt": "A Bootstrap navbar toggler has `data-bs-target=\"#mainNav\"`. What must the collapsing part of the navbar have so the button works? Type the attribute and value, like `class=\"x\"`.",
  "answer": "id=\"mainNav\"",
  "format": "text",
  "accept": ["id=mainNav", "id='mainNav'", "id mainNav", "id=\"mainnav\"", "an id of mainNav"],
  "explanation": "The target is an id selector (#mainNav), so the collapsing element needs id=\"mainNav\". If they do not match, the button does nothing.",
  "required": true
}
```
