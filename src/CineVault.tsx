import { RouterProvider } from "react-router";
import { appRouter } from "./router/app.router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

// Create a React Query client to manage caching and data fetching
const queryClient = new QueryClient();

/**
 * CineVault is the root component of the app.
 * It sets up global providers: React Query, Auth, Router, and Toaster.
 */
export const CineVault = () => {
  return (
    <>
      {/* React Query provider to enable caching, background fetching, and query management */}
      <QueryClientProvider client={queryClient}>
        {/* Toaster for notifications (positioned bottom-right) */}
        <Toaster richColors position="bottom-right" />

        {/* Authentication context provider, gives access to session and user info */}
        <AuthProvider>
          {/* React Router provider, controls app routing with the pre-defined appRouter */}
          <RouterProvider router={appRouter} />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
};
