import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

export const ScrollToTopLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return <Outlet />;
};
