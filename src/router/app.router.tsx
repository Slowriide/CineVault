import AuthPage from "@/auth/pages/AuthPage";
import {
  AuthenticatedRoute,
  NotAuthenticatedRoute,
} from "@/components/routes/ProtectedRoutes";
import { MoviesLayout } from "@/movies/layouts/MoviesLayout";
import ActorPage from "@/movies/pages/ActorPage";
import DiscoverPage from "@/movies/pages/DiscoverPage";

import { HomePage } from "@/movies/pages/HomePage";
import MovieDetailsPage from "@/movies/pages/MovieDetailsPage";
import { SearchPage } from "@/movies/pages/SearchPage";

import { ScrollToTopLayout } from "@/utils/ScrollToTopLayout";

import { createHashRouter } from "react-router";
import { MovieReviews } from "@/movies/pages/ReviewsPage";
import { lazy } from "react";

const AuthLayout = lazy(() => import("@/auth/layout/AuthLayout"));
const ProfileDashboard = lazy(() => import("@/movies/pages/ProfileDashboard"));

export const appRouter = createHashRouter([
  // export const appRouter = createBrowserRouter([
  {
    element: <ScrollToTopLayout />,

    children: [
      {
        path: "/",
        element: <MoviesLayout />,

        children: [
          { index: true, element: <HomePage /> },
          { path: ":type/:slug", element: <MovieDetailsPage /> },
          { path: ":type/:slug/reviews", element: <MovieReviews /> },
          {
            path: "profile",
            element: (
              <AuthenticatedRoute>
                <ProfileDashboard />
              </AuthenticatedRoute>
            ),
          },
          { path: "person/:slug", element: <ActorPage /> },
          { path: "discover", element: <DiscoverPage /> },
          { path: "search", element: <SearchPage /> },
        ],
      },

      // Auth Routes
      {
        path: "/auth",
        element: (
          <NotAuthenticatedRoute>
            <AuthLayout />
          </NotAuthenticatedRoute>
        ),
        children: [{ index: true, element: <AuthPage /> }],
      },
    ],
  },
]);
