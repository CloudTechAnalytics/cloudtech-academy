---
title: Transitions, Transforms, Animation and Pseudo-elements
minutes: 35
summary: Bring pages to life with smooth hover effects, transforms and keyframe animations, add decorative touches with ::before and ::after, and do it all in a way that is fast and kind to users.
---

## Motion with a purpose

Small amounts of motion make a site feel alive and tell people what is clickable: a button that lifts when you hover, a menu that slides open, a spinner that shows something is loading. Too much motion is annoying and slows pages down. The rule is: **motion should help the user**, not just decorate.

CSS can do all of this with no JavaScript, and in this lesson you will use three tools: **transitions**, **transforms** and **animations**.

## Transitions: smooth changes

Normally when a style changes, for example on hover, it changes instantly. A **transition** makes the change happen gradually.

```css
.button {
  background: #0f766e;
  transition: background 0.3s ease;
}
.button:hover {
  background: #115e59;
}
```

The `transition` shorthand has the property to animate, the duration, and the **timing function**. You can add a delay as a fourth value.

| Part | Example | Meaning |
| :-- | :-- | :-- |
| Property | `background`, `transform`, `opacity` or `all` | What changes smoothly |
| Duration | `0.3s` or `300ms` | How long it takes. 0.15s to 0.4s feels natural |
| Timing | `ease`, `linear`, `ease-in-out` | The speed curve |
| Delay | `0.1s` | Wait before starting |

Hover over the buttons. Then change the duration to `1.5s` to see the effect clearly, and then put it back to something quick.

```live
=== html
<button class="btn">Hover me</button>
<button class="btn outline">Outline button</button>
=== css
body { font-family: system-ui, sans-serif; padding: 24px; }
.btn {
  background: #0f766e;
  color: white;
  border: 2px solid #0f766e;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease, transform 0.2s ease;
}
.btn:hover {
  background: #115e59;
  transform: translateY(-2px);
}
.btn:active {
  transform: translateY(0);
}
.outline {
  background: transparent;
  color: #0f766e;
}
.outline:hover {
  background: #0f766e;
  color: white;
}
```

## Transforms: move, scale and rotate

`transform` changes how an element is drawn **without disturbing the layout** around it, and that is why it is fast and why it is the best partner for transitions.

| Function | What it does |
| :-- | :-- |
| `translate(x, y)` or `translateY(-4px)` | Moves the element |
| `scale(1.05)` | Makes it bigger (1.05 means 5% bigger) |
| `rotate(10deg)` | Turns it |
| `skew(10deg)` | Slants it |

You can combine them in one line: `transform: translateY(-4px) scale(1.03);`.

A card that lifts when you hover over it is very common.

```live
=== html
<div class="cards">
  <article class="card"><h3>Excel</h3><p>Formulas and charts.</p></article>
  <article class="card"><h3>SQL</h3><p>Questions for data.</p></article>
  <article class="card"><h3>Python</h3><p>Automate your work.</p></article>
</div>
=== css
body { font-family: system-ui, sans-serif; padding: 24px; }
.cards { display: flex; gap: 16px; flex-wrap: wrap; }
.card {
  flex: 1 1 140px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 2px 6px rgb(0 0 0 / 6%);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 28px rgb(0 0 0 / 14%);
}
```

> [!TIP]
> For smooth, fast animation, animate only **`transform`** and **`opacity`**. Animating `width`, `height`, `top` or `margin` forces the browser to recalculate the whole layout and can make pages stutter on cheap phones.

## Keyframe animations

A transition goes from one state to another when something triggers it. An **animation** runs by itself and can pass through many steps. You describe the steps with `@keyframes`, then attach them to an element with `animation`.

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero {
  animation: fade-in 0.8s ease-out;
}
```

The shorthand is `animation: name duration timing delay iteration-count direction`. Useful values include `infinite` (repeat forever), `alternate` (go back and forth) and `forwards` (stay at the end).

```live
=== html
<h2 class="fade">Welcome back</h2>
<div class="spinner" role="status" aria-label="Loading"></div>
<button class="pulse">Subscribe</button>
=== css
body { font-family: system-ui, sans-serif; padding: 24px; }

@keyframes fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade { animation: fade-in 0.8s ease-out; }

@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner {
  width: 40px;
  height: 40px;
  margin: 16px 0;
  border: 5px solid #ccfbf1;
  border-top-color: #0f766e;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.06); }
}
.pulse {
  background: #b45309;
  color: white;
  border: 0;
  padding: 12px 28px;
  border-radius: 999px;
  font-size: 1rem;
  animation: pulse 1.6s ease-in-out infinite;
}
```

Click **Reset** and the fade-in plays again. A spinner is just a square with a coloured border, rounded into a circle, and rotated forever. Loading spinners on real sites are often built exactly this way.

### Be kind: reduce motion

Some people feel dizzy or sick when pages move a lot, and their device has a setting to say so. Respect it:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

Never rely on animation alone to carry meaning, and never make something flash quickly.

## Pseudo-elements: add decoration without extra HTML

A **pseudo-element** is a part of an element you can style, or an extra piece of content CSS draws for you, written with **two colons**.

| Pseudo-element | What it is |
| :-- | :-- |
| `::before` and `::after` | Extra content before or after an element's content. Needs `content: ""` to appear |
| `::first-letter` | The first letter, for a drop cap |
| `::first-line` | The first line of a paragraph |
| `::selection` | The text a user highlights |
| `::placeholder` | The grey hint text in an input |

`::before` and `::after` are the useful ones. They let you draw lines, icons, badges and shapes without adding elements to your HTML.

```live
=== html
<h2 class="title">Our services</h2>
<a class="link" href="#">Read more</a>
<blockquote class="quote">Learning to code changed how I work.</blockquote>
=== css
body { font-family: system-ui, sans-serif; padding: 24px; }

.title {
  position: relative;
  padding-bottom: 10px;
}
.title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 60px;
  height: 4px;
  background: #0f766e;
  border-radius: 2px;
}

.link {
  position: relative;
  color: #0f766e;
  text-decoration: none;
  font-weight: 600;
}
.link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 0;
  height: 2px;
  background: currentColor;
  transition: width 0.3s ease;
}
.link:hover::after {
  width: 100%;
}

.quote {
  margin: 24px 0;
  padding-left: 16px;
  border-left: 4px solid #fbbf24;
  font-style: italic;
}
.quote::before {
  content: "\201C";
  font-size: 2rem;
  color: #fbbf24;
}

::selection {
  background: #fde68a;
}
```

Hover over **Read more**: the underline grows from nothing, using only a pseudo-element, `width` and a transition. Select some text with the mouse to see the custom `::selection` colour.

## Try it

Make a button and a card react to the mouse with transitions.

```webtask
{
  "id": "web-m12-t1",
  "minutes": 12,
  "required": true,
  "tabs": ["css"],
  "rules": [
    { "label": "The button has a transition (a duration above 0s)", "selector": ".btn", "style": { "transition-duration": "^(?!0s$)" } },
    { "label": "The button changes on hover (a .btn:hover rule that changes the background)", "in": "css", "pattern": "\\.btn:hover\\s*\\{[^}]*background" },
    { "label": "The button moves or grows on hover with a transform", "in": "css", "pattern": "\\.btn:hover\\s*\\{[^}]*transform\\s*:\\s*(translate|scale)" },
    { "label": "The card has a transition that includes transform", "selector": ".card", "style": { "transition-property": "transform|all" } },
    { "label": "The card lifts on hover (a .card:hover rule with translateY and a stronger box-shadow)", "in": "css", "pattern": "\\.card:hover\\s*\\{[^}]*translateY\\([^)]*\\)[^}]*box-shadow|\\.card:hover\\s*\\{[^}]*box-shadow[^}]*translateY" },
    { "label": "The button shows the pointer cursor", "selector": ".btn", "style": { "cursor": "pointer" } },
    { "label": "The transitions are kept short (under 1 second)", "selector": ".btn", "style": { "transition-duration": "^(0\\.\\d+s|[1-9]\\d\\d ?ms)" } }
  ],
  "hint": ".btn { transition: background 0.3s ease, transform 0.2s ease; cursor: pointer; } .btn:hover { background: #115e59; transform: translateY(-2px); } .card { transition: transform 0.25s ease, box-shadow 0.25s ease; } .card:hover { transform: translateY(-6px); box-shadow: 0 14px 28px rgb(0 0 0 / 14%); }",
  "height": 340
}
=== prompt
Add hover effects. The `.btn` needs a `transition` (under 1 second), the pointer cursor, and a `.btn:hover` rule that changes the `background` and moves it with `transform`. The `.card` needs a transition on `transform` and `box-shadow`, and a `.card:hover` rule that lifts it with `translateY` and a stronger `box-shadow`.
=== html
<article class="card">
  <h3>Starter plan</h3>
  <p>Everything you need to begin.</p>
  <button class="btn">Choose plan</button>
</article>
=== css
body {
  font-family: system-ui, sans-serif;
  padding: 24px;
}
.card {
  width: 240px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgb(0 0 0 / 6%);
}
.btn {
  background: #0f766e;
  color: white;
  border: 0;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
}
=== sample css
body {
  font-family: system-ui, sans-serif;
  padding: 24px;
}
.card {
  width: 240px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgb(0 0 0 / 6%);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 28px rgb(0 0 0 / 14%);
}
.btn {
  background: #0f766e;
  color: white;
  border: 0;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}
.btn:hover {
  background: #115e59;
  transform: translateY(-2px);
}
```

Now an animation. Build a loading spinner and a fading-in message.

```webtask
{
  "id": "web-m12-t2",
  "minutes": 12,
  "required": true,
  "tabs": ["css"],
  "rules": [
    { "label": "A @keyframes called spin rotates the element by 360 degrees", "in": "css", "pattern": "@keyframes\\s+spin\\s*\\{[^@]*rotate\\(\\s*360deg" },
    { "label": "The spinner uses the spin animation and repeats forever", "selector": ".spinner", "style": { "animation-name": "spin", "animation-iteration-count": "infinite" } },
    { "label": "The spinner is a circle (border-radius 50%) at least 30px wide", "selector": ".spinner", "style": { "border-top-left-radius": "^(50%|[1-9]\\d+(\\.\\d+)?px)$", "width": "^(3\\d|[4-9]\\d|\\d{3,})(\\.\\d+)?px$" } },
    { "label": "A second @keyframes makes the message fade in (it changes opacity)", "in": "css", "pattern": "@keyframes\\s+(?!spin)[a-z-]+\\s*\\{[^@]*opacity" },
    { "label": "The message plays that animation once", "selector": ".message", "style": { "animation-name": "^(?!none$)(?!spin$)", "animation-iteration-count": "^1$" } },
    { "label": "Motion is switched off for people who prefer reduced motion", "in": "css", "pattern": "@media\\s*\\(\\s*prefers-reduced-motion\\s*:\\s*reduce" }
  ],
  "hint": "@keyframes spin { to { transform: rotate(360deg); } } .spinner { width: 40px; height: 40px; border: 5px solid #ccfbf1; border-top-color: #0f766e; border-radius: 50%; animation: spin 0.9s linear infinite; } @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .message { animation: fade-in 1s ease-out; } @media (prefers-reduced-motion: reduce) { * { animation: none; } }",
  "height": 340
}
=== prompt
Build a loading screen. Write `@keyframes spin` that rotates by `360deg`, and make `.spinner` a circle (at least 30px, `border-radius: 50%`, one coloured side of its border) that plays it forever with `animation: spin 0.9s linear infinite`. Write a second `@keyframes` that fades `.message` in with `opacity`, and play it once. Finally, switch the animations off inside `@media (prefers-reduced-motion: reduce)`.
=== html
<div class="loading">
  <div class="spinner" role="status" aria-label="Loading"></div>
  <p class="message">Getting your courses ready...</p>
</div>
=== css
body {
  font-family: system-ui, sans-serif;
  display: grid;
  place-items: center;
  min-height: 100vh;
  margin: 0;
}
.loading {
  text-align: center;
}
=== sample css
body {
  font-family: system-ui, sans-serif;
  display: grid;
  place-items: center;
  min-height: 100vh;
  margin: 0;
}
.loading {
  text-align: center;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.spinner {
  width: 44px;
  height: 44px;
  margin: 0 auto 16px;
  border: 5px solid #ccfbf1;
  border-top-color: #0f766e;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.message {
  animation: fade-in 1s ease-out;
}
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none;
  }
}
```

```answer
{
  "id": "web-m12-a1",
  "prompt": "For smooth, fast animations, you should animate `opacity` and which other property? Type its name.",
  "answer": "transform",
  "format": "text",
  "accept": ["transforms", "the transform property"],
  "explanation": "transform and opacity can be animated without recalculating the page layout, so they stay smooth even on slow phones.",
  "required": true
}
```
