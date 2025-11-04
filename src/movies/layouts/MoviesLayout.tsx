import { Outlet } from "react-router";
import { CustomHeader } from "../components/CustomHeader";

// MoviesLayout: Wraps all movie-related pages with a header and outlet for nested routes
export const MoviesLayout = () => {
  return (
    <div className="min-h-screen">
      {/* CustomHeader component renders the header/navigation */}
      <CustomHeader />

      {/* Outlet renders the nested route components */}
      <Outlet />
    </div>
  );
};
