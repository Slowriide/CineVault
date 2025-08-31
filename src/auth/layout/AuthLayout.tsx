import { Outlet } from "react-router";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
