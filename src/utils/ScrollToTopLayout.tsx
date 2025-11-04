import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

/**
 * ScrollToTopLayout
 *
 * This layout component ensures that whenever the user navigates
 * to a new route, the window scrolls to the top smoothly.
 *
 * Useful for pages with long scrollable content, so the user
 * starts at the top instead of staying at the previous scroll position.
 */
export const ScrollToTopLayout = () => {
  const { pathname } = useLocation(); // Get the current path

  // Run effect whenever the pathname changes (i.e., user navigates)
  useEffect(() => {
    // Smoothly scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  // Render nested routes
  return <Outlet />;
};
