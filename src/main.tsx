import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { AppRoutes } from "./App";
import "./styles/index.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
);

// Public pages are prerendered (scripts/prerender.mjs). Hydrate only when the HTML was rendered
// for this address. Everything else renders from scratch: signed-in pages (served from app.html,
// an empty shell) and the 404 page, since an address missing from the build may still be a
// course or lesson an admin added later.
const renderedFor = root.dataset.route;
const path = window.location.pathname.replace(/(.)\/$/, "$1");
if (root.hasChildNodes() && renderedFor === path) {
  hydrateRoot(root, app);
} else {
  root.textContent = "";
  createRoot(root).render(app);
}
