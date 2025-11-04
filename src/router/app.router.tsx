import AuthPage from "@/auth/pages/AuthPage";
import {
  AuthenticatedRoute,
  NotAuthenticatedRoute,
} from "@/components/routes/ProtectedRoutes"; // Route guards for authentication
import { MoviesLayout } from "@/movies/layouts/MoviesLayout"; // Main app layout
import ActorPage from "@/movies/pages/ActorPage";
import DiscoverPage from "@/movies/pages/DiscoverPage";
import { HomePage } from "@/movies/pages/HomePage";
import MovieDetailsPage from "@/movies/pages/MovieDetailsPage";
import { SearchPage } from "@/movies/pages/SearchPage";
import { ScrollToTopLayout } from "@/utils/ScrollToTopLayout"; // Ensures scroll-to-top on navigation

import { createBrowserRouter } from "react-router";
import { MovieReviews } from "@/movies/pages/ReviewsPage";
import { lazy } from "react";

// Lazy-loaded components for code splitting
const AuthLayout = lazy(() => import("@/auth/layout/AuthLayout"));
const ProfileDashboard = lazy(() => import("@/movies/pages/ProfileDashboard"));

// Application Router
export const appRouter = createBrowserRouter([
  {
    // Top-level layout to handle scroll-to-top behavior
    element: <ScrollToTopLayout />,

    children: [
      {
        // Main movies layout (header + content outlet)
        path: "/",
        element: <MoviesLayout />,

        children: [
          { index: true, element: <HomePage /> }, // "/" -> Home page
          { path: ":type/:slug", element: <MovieDetailsPage /> }, // Dynamic movie/TV detail page
          { path: ":type/:slug/reviews", element: <MovieReviews /> }, // Reviews for a movie/TV show
          {
            path: "profile",
            element: (
              <AuthenticatedRoute>
                {/* Only authenticated users can access */}
                <ProfileDashboard />
              </AuthenticatedRoute>
            ),
          },
          { path: "person/:slug", element: <ActorPage /> }, // Actor page
          { path: "discover", element: <DiscoverPage /> }, // Discover movies/TV shows
          { path: "search", element: <SearchPage /> }, // Search results page
        ],
      },

      // Auth routes (login/register)
      {
        path: "/auth",
        element: (
          <NotAuthenticatedRoute>
            {/* Only non-authenticated users can access */}
            <AuthLayout />
          </NotAuthenticatedRoute>
        ),
        children: [
          { index: true, element: <AuthPage /> }, // Default auth page
        ],
      },
    ],
  },
]);
