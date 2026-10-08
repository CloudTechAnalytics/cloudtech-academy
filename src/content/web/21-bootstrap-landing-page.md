---
title: "Build a Complete Website with Bootstrap"
minutes: 40
summary: Put everything together. Plan and build a full, responsive, accessible landing page for a business, section by section, with Bootstrap and a little custom CSS and JavaScript, ready to publish.
---

## What you are going to build

Time to combine HTML, CSS, JavaScript and Bootstrap into one real project. You will build the **landing page of a small business**: a single page that makes a good first impression and gets visitors to act, whether that is to call, order or sign up. Sites like this are what small businesses in Lagos, Abuja and everywhere pay developers to build, and it is a strong piece for your portfolio.

We will build **Naija Eats**, a food delivery business. When you do your own in the tasks, choose any business you like: a salon, a tailor, a school, a tutor, a phone repair shop.

## Step 0: plan before you code

Professionals sketch before they type. A landing page usually has these sections, in this order:

| Section | Job |
| :-- | :-- |
| **Navbar** | Let people jump around, with the business name |
| **Hero** | One clear promise and one main button (the **call to action**) |
| **Services or menu** | What you offer, as cards |
| **About or why us** | Build trust in a few sentences |
| **Contact form** | An easy way to get in touch |
| **Footer** | Address, hours, social links, copyright |

Write down, in one sentence each: **Who is this for? What do they want? What is the one thing I want them to do?** For Naija Eats: *busy people in Lagos want good food delivered fast, and we want them to order.* Every section should help with that.

## Step 1: the skeleton and the navbar

Start with the full document, with Bootstrap linked, and the navbar from the last lesson. Because the page is one long page, the links jump to sections with ids, which you learned in lesson 2.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Naija Eats | Fast Food Delivery in Lagos</title>
    <meta name="description" content="Order fresh jollof rice, fried rice and more. Fast delivery across Lagos." />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <!-- navbar, sections and footer go here -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
  </body>
</html>
```

Notice the order: Bootstrap's CSS first, **then your own `style.css`**, so your rules can override Bootstrap's. Scripts go last, Bootstrap's before yours.

## Step 2: the hero

The hero is the first thing visitors see. It needs a short headline, one sentence of support, and a button. Utilities handle most of the layout.

```live
{ "bootstrap": true, "stack": true, "height": 360 }
=== html
<nav class="navbar navbar-expand-lg bg-dark sticky-top" data-bs-theme="dark">
  <div class="container">
    <a class="navbar-brand fw-bold" href="#home">Naija Eats</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="nav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="#menu">Menu</a></li>
        <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
        <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
      </ul>
    </div>
  </div>
</nav>

<header id="home" class="hero text-center text-white py-5">
  <div class="container py-4">
    <h1 class="display-4 fw-bold">Hot jollof, delivered fast.</h1>
    <p class="lead mb-4">Fresh Nigerian meals to your door in Lagos, every day until 10 pm.</p>
    <a href="#menu" class="btn btn-warning btn-lg px-4">See the menu</a>
  </div>
</header>
=== css
.hero {
  background: linear-gradient(135deg, #0f766e, #134e4a);
}
```

`display-4` is Bootstrap's big heading style, and `lead` makes the intro paragraph larger. The `.hero` rule is the only custom CSS, a gradient background.

## Step 3: services as cards

Cards in a responsive grid, the pattern from the last lesson. Each one has an image area, a title, a line of text and a price.

```live
{ "bootstrap": true, "stack": true, "height": 380 }
=== html
<section id="menu" class="py-5">
  <div class="container">
    <h2 class="text-center fw-bold mb-4">Our menu</h2>
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h3 class="h5 card-title">Party jollof</h3>
            <p class="card-text">Smoky firewood-style jollof with chicken and plantain.</p>
          </div>
          <div class="card-footer bg-transparent border-0 fw-bold text-success">₦3,000</div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h3 class="h5 card-title">Fried rice</h3>
            <p class="card-text">Rice with vegetables and prawns, served hot.</p>
          </div>
          <div class="card-footer bg-transparent border-0 fw-bold text-success">₦2,800</div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h3 class="h5 card-title">Amala and ewedu</h3>
            <p class="card-text">Soft amala with ewedu, gbegiri and assorted meat.</p>
          </div>
          <div class="card-footer bg-transparent border-0 fw-bold text-success">₦2,500</div>
        </div>
      </div>
    </div>
  </div>
</section>
```

Notice `class="h5 card-title"` on an `<h3>`. The **heading level** (h3) should follow the page outline (h1, then h2, then h3) for accessibility and SEO, while `h5` only controls the **size**. This is the correct way to separate meaning from looks.

## Step 4: about and trust

A short section that says why people can trust you. Use real facts only: how long you have operated, where you are, what you promise. Do not invent reviews or numbers.

```live
{ "bootstrap": true, "stack": true, "height": 260 }
=== html
<section id="about" class="py-5 bg-light">
  <div class="container">
    <div class="row align-items-center g-4">
      <div class="col-md-6">
        <h2 class="fw-bold">Cooked fresh, every order</h2>
        <p class="text-muted">We cook each meal when you order it, with ingredients bought the same morning, and we deliver in under 45 minutes across Lagos Island and the Mainland.</p>
        <ul class="list-unstyled">
          <li class="mb-1">✔ No reheated food</li>
          <li class="mb-1">✔ Pay online or on delivery</li>
          <li>✔ Hot meals or your money back</li>
        </ul>
      </div>
      <div class="col-md-6">
        <div class="ratio ratio-16x9 rounded-3 overflow-hidden bg-success-subtle d-flex align-items-center justify-content-center fw-bold">Your photo goes here</div>
      </div>
    </div>
  </div>
</section>
```

`ratio ratio-16x9` keeps a box in a 16:9 shape on every screen, which is perfect for photos and videos. When you add a real image, give it good `alt` text and the `img-fluid` class so that it scales.

## Step 5: the contact form

A short form, labelled properly, validated by the browser, with a message from your own JavaScript when it is submitted.

```live
{ "bootstrap": true, "stack": true, "height": 470 }
=== html
<section id="contact" class="py-5">
  <div class="container" style="max-width: 560px">
    <h2 class="fw-bold text-center mb-4">Place an order</h2>
    <form id="order-form" class="needs-validation" novalidate>
      <div class="mb-3">
        <label for="name" class="form-label">Your name</label>
        <input id="name" class="form-control" required />
        <div class="invalid-feedback">Please tell us your name.</div>
      </div>
      <div class="mb-3">
        <label for="phone" class="form-label">Phone number</label>
        <input id="phone" type="tel" class="form-control" pattern="[0-9]{11}" placeholder="08012345678" required />
        <div class="invalid-feedback">Enter an 11-digit phone number.</div>
      </div>
      <div class="mb-3">
        <label for="dish" class="form-label">What would you like?</label>
        <select id="dish" class="form-select" required>
          <option value="">Choose a dish</option>
          <option>Party jollof</option>
          <option>Fried rice</option>
          <option>Amala and ewedu</option>
        </select>
        <div class="invalid-feedback">Please choose a dish.</div>
      </div>
      <button class="btn btn-success w-100" type="submit">Order now</button>
    </form>
    <div id="thanks" class="alert alert-success mt-3 d-none" role="status"></div>
  </div>
</section>
=== js
const form = document.querySelector("#order-form");
const thanks = document.querySelector("#thanks");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  form.classList.add("was-validated");
  if (!form.checkValidity()) return;

  const name = document.querySelector("#name").value.trim();
  const dish = document.querySelector("#dish").value;
  thanks.textContent = `Thank you, ${name}! We are preparing your ${dish}.`;
  thanks.classList.remove("d-none");
  form.reset();
  form.classList.remove("was-validated");
});
```

(A real site sends the order to a server, or opens WhatsApp with the order text, which is a common and simple choice for small businesses: a link like `https://wa.me/2348012345678?text=I%20would%20like%20to%20order`.)

## Step 6: footer and finishing touches

```live
{ "bootstrap": true, "height": 220 }
=== html
<footer class="bg-dark text-white-50 py-4 mt-4">
  <div class="container d-flex flex-column flex-md-row justify-content-between gap-2">
    <span>Naija Eats, 12 Admiralty Way, Lekki, Lagos</span>
    <span>Open daily, 10 am to 10 pm</span>
    <span>&copy; 2026 Naija Eats</span>
  </div>
</footer>
```

Finishing touches that separate a good page from a great one:

- **`scroll-behavior: smooth;`** on `html` in your CSS, so that links glide to their sections.
- **Spacing:** use the same vertical padding (`py-5`) for sections so the page has a steady rhythm.
- **Images:** add `alt` text to every image, and compress them. A 5 MB hero photo ruins mobile load time.
- **Contrast:** check text on coloured backgrounds, especially white on yellow.
- **Test:** open it on a real phone and click everything.

## The complete page

Here is the whole thing together, as one document. Read through it, run it, change the business name, colours and text to your own, and make it yours. This is the shape of the page you will build in the task.

```live
{ "bootstrap": true, "stack": true, "height": 520 }
=== html
<nav class="navbar navbar-expand-lg bg-dark sticky-top" data-bs-theme="dark">
  <div class="container">
    <a class="navbar-brand fw-bold" href="#home">Naija Eats</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="nav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="#menu">Menu</a></li>
        <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
        <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
      </ul>
    </div>
  </div>
</nav>

<header id="home" class="hero text-center text-white py-5">
  <div class="container py-4">
    <h1 class="display-4 fw-bold">Hot jollof, delivered fast.</h1>
    <p class="lead mb-4">Fresh Nigerian meals to your door in Lagos.</p>
    <a href="#menu" class="btn btn-warning btn-lg px-4">See the menu</a>
  </div>
</header>

<main>
  <section id="menu" class="py-5">
    <div class="container">
      <h2 class="text-center fw-bold mb-4">Our menu</h2>
      <div class="row row-cols-1 row-cols-md-3 g-4">
        <div class="col"><div class="card h-100 shadow-sm"><div class="card-body"><h3 class="h5 card-title">Party jollof</h3><p class="card-text">Smoky jollof with chicken and plantain.</p></div><div class="card-footer bg-transparent border-0 fw-bold text-success">₦3,000</div></div></div>
        <div class="col"><div class="card h-100 shadow-sm"><div class="card-body"><h3 class="h5 card-title">Fried rice</h3><p class="card-text">Rice with vegetables and prawns.</p></div><div class="card-footer bg-transparent border-0 fw-bold text-success">₦2,800</div></div></div>
        <div class="col"><div class="card h-100 shadow-sm"><div class="card-body"><h3 class="h5 card-title">Amala and ewedu</h3><p class="card-text">Soft amala with ewedu and gbegiri.</p></div><div class="card-footer bg-transparent border-0 fw-bold text-success">₦2,500</div></div></div>
      </div>
    </div>
  </section>

  <section id="about" class="py-5 bg-light">
    <div class="container">
      <h2 class="fw-bold">Cooked fresh, every order</h2>
      <p class="text-muted mb-0">Each meal is cooked when you order it and delivered in under 45 minutes.</p>
    </div>
  </section>

  <section id="contact" class="py-5">
    <div class="container" style="max-width: 520px">
      <h2 class="fw-bold text-center mb-3">Place an order</h2>
      <form>
        <div class="mb-3"><label for="n" class="form-label">Your name</label><input id="n" class="form-control" /></div>
        <div class="mb-3"><label for="p" class="form-label">Phone</label><input id="p" type="tel" class="form-control" /></div>
        <button class="btn btn-success w-100" type="submit">Order now</button>
      </form>
    </div>
  </section>
</main>

<footer class="bg-dark text-white-50 py-4">
  <div class="container text-center">&copy; 2026 Naija Eats, Lekki, Lagos</div>
</footer>
=== css
html { scroll-behavior: smooth; }
.hero { background: linear-gradient(135deg, #0f766e, #134e4a); }
.card { transition: transform 0.2s ease; }
.card:hover { transform: translateY(-4px); }
```

## Try it

Build the landing page for **your own** business idea. It should have a responsive Bootstrap navbar, a hero with a call to action, at least three service cards, a labelled contact form and a footer, and it must be accessible and mobile friendly.

```webtask
{
  "id": "web-m21-t1",
  "minutes": 25,
  "required": true,
  "bootstrap": true,
  "stack": true,
  "height": 480,
  "tabs": ["html", "css"],
  "rules": [
    { "label": "Page information: lang, a descriptive <title> (at least 15 characters) and the viewport tag", "in": "html", "pattern": "<html[^>]*\\blang=[\\s\\S]*<title>[^<]{15,}</title>[\\s\\S]*name=[\"']viewport|<html[^>]*\\blang=[\\s\\S]*name=[\"']viewport[\\s\\S]*<title>[^<]{15,}</title>" },
    { "label": "A responsive navbar with a brand, a toggler and at least three .nav-link links", "selector": "nav.navbar-expand-lg .navbar-brand, nav.navbar-expand-lg .navbar-toggler, nav.navbar-expand-lg .nav-link", "min": 5 },
    { "label": "A hero with exactly one <h1> and a call-to-action button link (.btn) inside the hero", "selector": "h1", "min": 1, "max": 1, "contains": "[A-Za-z]{3,}" },
    { "label": "The hero has a button link with a Bootstrap .btn class", "selector": "header a.btn, .hero a.btn", "min": 1 },
    { "label": "At least three service cards, each with a .card-title", "selector": ".card .card-title", "min": 3 },
    { "label": "On a phone (400px) the cards stack to full width", "selector": ".card", "at": 400, "style": { "width": "^(3[3-9]\\d|4\\d\\d)(\\.\\d+)?px$" } },
    { "label": "On a laptop (1000px) the cards sit side by side (each less than 400px wide)", "selector": ".card", "at": 1000, "style": { "width": "^(2\\d\\d|3\\d\\d)(\\.\\d+)?px$" } },
    { "label": "A contact form where every input has a connected label (at least two labels with for)", "selector": "form label[for]", "min": 2 },
    { "label": "The form has a submit button", "selector": "form button[type='submit'], form .btn", "min": 1 },
    { "label": "A <footer> containing a copyright line with a year", "selector": "footer", "contains": "20\\d\\d" },
    { "label": "Sections you can jump to: at least three links starting with # and matching ids", "selector": "a[href^='#']:not([href='#'])", "min": 3 },
    { "label": "Every image has alt text (none is missing it)", "selector": "img:not([alt])", "min": 0, "max": 0 },
    { "label": "Your own CSS file adds at least one custom rule that is not Bootstrap's (for example a hero background or a card hover)", "in": "css", "pattern": "[.#a-z][\\w.#-]*\\s*\\{[^}]*:[^}]*\\}" }
  ],
  "hint": "Follow the steps: navbar (with data-bs-target and a matching id), header.hero with h1 and a.btn, section#menu with row-cols-1 row-cols-md-3 cards, a form with label for/input id, and a footer with a year. Remember the title, lang and viewport."
}
=== prompt
Build a landing page for a business of your choice. Use the six steps from this lesson: a `navbar-expand-lg` navbar with a brand, toggler and at least three links; a hero with **one** `<h1>` and a `btn` call to action; at least three cards (`row-cols-1 row-cols-md-3`) each with a `card-title`; a contact form with labelled inputs and a submit button; and a footer with the year. Add `lang`, a descriptive `<title>` and the viewport meta tag, give any image `alt` text, and write at least one custom rule in the CSS tab.
=== html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <!-- navbar -->

  <!-- hero -->

  <!-- services -->

  <!-- contact form -->

  <!-- footer -->

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
=== css
/* Your own CSS goes here, after Bootstrap's */
=== sample html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Shine Hair Studio | Braids and Hair Care in Lekki</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <nav class="navbar navbar-expand-lg bg-dark sticky-top" data-bs-theme="dark">
    <div class="container">
      <a class="navbar-brand fw-bold" href="#home">Shine Hair Studio</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="nav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link" href="#services">Services</a></li>
          <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
          <li class="nav-item"><a class="nav-link" href="#contact">Book</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <header id="home" class="hero text-center text-white py-5">
    <div class="container py-4">
      <h1 class="display-4 fw-bold">Beautiful hair, done right.</h1>
      <p class="lead mb-4">Braids, natural hair care and styling in Lekki, Lagos.</p>
      <a href="#contact" class="btn btn-warning btn-lg px-4">Book an appointment</a>
    </div>
  </header>

  <main>
    <section id="services" class="py-5">
      <div class="container">
        <h2 class="text-center fw-bold mb-4">Our services</h2>
        <div class="row row-cols-1 row-cols-md-3 g-4">
          <div class="col"><div class="card h-100 shadow-sm"><div class="card-body"><h3 class="h5 card-title">Braids</h3><p class="card-text">Neat knotless braids and cornrows.</p></div></div></div>
          <div class="col"><div class="card h-100 shadow-sm"><div class="card-body"><h3 class="h5 card-title">Natural hair care</h3><p class="card-text">Wash, treatment and styling.</p></div></div></div>
          <div class="col"><div class="card h-100 shadow-sm"><div class="card-body"><h3 class="h5 card-title">Bridal styling</h3><p class="card-text">Hair for your big day.</p></div></div></div>
        </div>
      </div>
    </section>

    <section id="about" class="py-5 bg-light">
      <div class="container">
        <h2 class="fw-bold">Why choose us</h2>
        <p class="text-muted mb-0">We work by appointment, so you never wait, and we use gentle products.</p>
      </div>
    </section>

    <section id="contact" class="py-5">
      <div class="container" style="max-width: 520px">
        <h2 class="fw-bold text-center mb-3">Book an appointment</h2>
        <form>
          <div class="mb-3"><label for="name" class="form-label">Your name</label><input id="name" class="form-control" required /></div>
          <div class="mb-3"><label for="phone" class="form-label">Phone number</label><input id="phone" type="tel" class="form-control" required /></div>
          <button class="btn btn-success w-100" type="submit">Request booking</button>
        </form>
      </div>
    </section>
  </main>

  <footer class="bg-dark text-white-50 py-4">
    <div class="container text-center">&copy; 2026 Shine Hair Studio, Lekki, Lagos</div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
=== sample css
html {
  scroll-behavior: smooth;
}
.hero {
  background: linear-gradient(135deg, #7c2d12, #be123c);
}
.card {
  transition: transform 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
}
=== note
This is a full, publishable landing page. In the last lesson you will put it online. Before you do, open it in the **Phone** view and check that every section reads well on a small screen.
```

```answer
{
  "id": "web-m21-a1",
  "prompt": "In which order should you link the stylesheets so your own CSS can override Bootstrap's? Type **Bootstrap first** or **Your CSS first**.",
  "answer": "Bootstrap first",
  "format": "text",
  "accept": ["bootstrap first", "bootstrap, then yours", "bootstrap before mine", "bootstrap then your css"],
  "explanation": "When two rules have the same specificity, the one that comes later wins, so your stylesheet goes after Bootstrap's.",
  "required": true
}
```
