import AuthLayout from "@/auth/layout/AuthLayout";
import { LoginPage } from "@/auth/pages/LoginPage";
import { RegisterPage } from "@/auth/pages/RegisterPage";
import { MoviesLayout } from "@/movies/layouts/MoviesLayout";
import ActorPage from "@/movies/pages/ActorPage";
import { FavoritesPage } from "@/movies/pages/FavoritesPage";
import { HomePage } from "@/movies/pages/HomePage";
import MovieDetailsPage from "@/movies/pages/MovieDetailsPage";
import { ScrollToTopLayout } from "@/utils/ScrollToTopLayout";

import { createBrowserRouter, Navigate } from "react-router";

export const appRouter = createBrowserRouter([
  {
    element: <ScrollToTopLayout />,
    children: [
      {
        path: "/",
        element: <MoviesLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: ":type/:id", element: <MovieDetailsPage /> },
          { path: "favorites-page", element: <FavoritesPage /> },
          { path: "person/:id", element: <ActorPage /> },
        ],
      },

      // Auth Routes
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
          { index: true, element: <Navigate to="auth/login" /> },
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },
    ],
  },
]);
