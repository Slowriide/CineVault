import { RouterProvider } from "react-router";
import { appRouter } from "./router/app.router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export const CineVault = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster richColors position="bottom-right" />
        <AuthProvider>
          <RouterProvider router={appRouter} />;
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
};
