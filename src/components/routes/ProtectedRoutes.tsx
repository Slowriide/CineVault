import { useAuth } from "@/context/AuthContext";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router";

// AuthenticatedRoute component:
// Ensures that only authenticated users can access certain routes.
// If the user is not logged in, they are redirected to the "/auth" page.
export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { session, loading } = useAuth(); // Get authentication state from context

  // While authentication state is being checked, render nothing (avoid flicker)
  if (loading) return null;

  // If there is no session, redirect to the authentication page
  if (!session) return <Navigate to={"/auth"} />;

  // If user is authenticated, render the protected content
  return children;
};

// NotAuthenticatedRoute component:
// Ensures that authenticated users cannot access routes meant for guests
// (e.g., login or registration pages). Redirects them to the home page.
export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { session, loading } = useAuth();

  // Avoid rendering until auth state is resolved
  if (loading) return null;

  // If user is already logged in, redirect them to the home page
  if (session) return <Navigate to={"/"} />;

  // Otherwise, show the public (unauthenticated) content
  return children;
};
