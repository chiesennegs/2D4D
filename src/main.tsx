import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import { App } from "./App";

// HashRouter (not BrowserRouter) because this is deployed to GitHub Pages,
// which has no server-side rewrite rule to fall back to index.html for a
// deep link like /capture/right on refresh. Hash-based routes always load
// index.html at the base URL, so this works with zero server config and
// keeps working if the base path changes later (e.g. a custom domain).
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
