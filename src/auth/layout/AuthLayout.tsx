import { Outlet } from "react-router";

// The AuthLayout component serves as a layout wrapper for authentication-related routes
// (e.g., login, register, password reset pages).
// It uses React Router's <Outlet> to render child routes inside this layout.
export const AuthLayout = () => {
  return (
    // A full-screen container with a subtle gradient background.
    // The "min-h-screen" class ensures the layout always takes at least the full viewport height.
    <div className="min-h-screen bg-gradient-subtle">
      {/* <Outlet> acts as a placeholder for nested routes defined under this layout. */}
      <Outlet />
    </div>
  );
};

// Export the component as default for easier imports in the routing configuration.
export default AuthLayout;
