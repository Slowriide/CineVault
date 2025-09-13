import AuthLayout from "@/auth/layout/AuthLayout";
import AuthPage from "@/auth/pages/AuthPage";
import {
  AuthenticatedRoute,
  NotAuthenticatedRoute,
} from "@/components/routes/ProtectedRoutes";
import { MoviesLayout } from "@/movies/layouts/MoviesLayout";
import ActorPage from "@/movies/pages/ActorPage";
import DiscoverPage from "@/movies/pages/DiscoverPage";
import { FavoritesPage } from "@/movies/pages/FavoritesPage";
import { HomePage } from "@/movies/pages/HomePage";
import MovieDetailsPage from "@/movies/pages/MovieDetailsPage";
import { SearchPage } from "@/movies/pages/SearchPage";

import { ScrollToTopLayout } from "@/utils/ScrollToTopLayout";

import { createBrowserRouter } from "react-router";

export const appRouter = createBrowserRouter([
  {
    element: <ScrollToTopLayout />,

    children: [
      {
        path: "/",
        element: <MoviesLayout />,

        children: [
          { index: true, element: <HomePage /> },
          { path: ":type/:slug", element: <MovieDetailsPage /> },
          { path: "favorites-page", element: <FavoritesPage /> },
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
            <AuthLayout />,
          </NotAuthenticatedRoute>
        ),
        children: [{ index: true, element: <AuthPage /> }],
      },
    ],
  },
]);
