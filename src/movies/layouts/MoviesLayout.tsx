import { Outlet } from "react-router";
import { CustomHeader } from "../components/CustomHeader";

export const MoviesLayout = () => {
  return (
    <div className="min-h-screen">
      <CustomHeader />
      <Outlet />
    </div>
  );
};
