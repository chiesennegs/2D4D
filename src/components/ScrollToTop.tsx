import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router doesn't reset scroll position on navigation. Without this,
 * advancing from a page you'd scrolled down on (e.g. Welcome's disclaimer
 * at the bottom) leaves the next page scrolled to the same offset instead
 * of starting at its top.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
