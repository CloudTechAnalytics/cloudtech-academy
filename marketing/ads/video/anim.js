// A tiny timeline for the ad videos. Each video page defines window.DURATION and window.render(t); the renderer
// (render-video.cjs) sets t for every frame, takes a screenshot and stitches the frames into an MP4.
const clamp = (x) => Math.min(1, Math.max(0, x));
const P = (t, a, b) => clamp((t - a) / (b - a));
const ease = {
  out: (x) => 1 - Math.pow(1 - x, 3),
  inout: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  back: (x) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  },
};
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

/** Shows a scene between a and b, fading in and out over f seconds. */
function scene(el, t, a, b, f = 0.35) {
  const on = t >= a && t <= b;
  el.style.visibility = on ? "visible" : "hidden";
  el.style.opacity = on ? Math.min(P(t, a, a + f), 1 - P(t, b - f, b)) : 0;
}
/** Slides and fades an element in from (x, y) with a small scale. */
function pop(el, t, a, d = 0.55, o = {}) {
  const { y = 50, x = 0, s = 0.92, back = false } = o;
  const p = P(t, a, a + d);
  const e = back ? ease.back(p) : ease.out(p);
  el.style.opacity = ease.out(p);
  el.style.transform = `translate(${(1 - e) * x}px,${(1 - e) * y}px) scale(${s + (1 - s) * e})`;
}
/** Reveals text one character at a time. */
function type(el, text, t, a, cps = 30) {
  el.textContent = text.slice(0, Math.floor(Math.max(0, t - a) * cps));
}
/** Pops each .w word of an element in turn. */
function words(el, t, a, step = 0.11, d = 0.45) {
  $$(".w", el).forEach((w, i) => pop(w, t, a + i * step, d, { y: 38, s: 0.96 }));
}
/** Slow drift of the background glows and grid, so even still scenes feel alive. */
function ambient(t) {
  const g = $(".glow");
  if (g) g.style.transform = `translate(${Math.sin(t * 0.5) * 40}px,${Math.cos(t * 0.4) * 30}px)`;
  const gr = $(".grid");
  if (gr) gr.style.backgroundPosition = `${t * 6}px ${t * 6}px`;
  const bar = $(".progress i");
  if (bar && window.DURATION) bar.style.width = `${(t / window.DURATION) * 100}%`;
}
