import AuthLayout from "@/auth/layout/AuthLayout";
import { LoginPage } from "@/auth/pages/LoginPage";
import { RegisterPage } from "@/auth/pages/RegisterPage";
import { MoviesLayout } from "@/movies/layouts/MoviesLayout";
import { FavoritesPage } from "@/movies/pages/FavoritesPage";
import { HomePage } from "@/movies/pages/HomePage";
import { MovieDetailsPage } from "@/movies/pages/MovieDetailsPage";
import { createBrowserRouter, Navigate } from "react-router";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MoviesLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "movie-page",
        element: <MovieDetailsPage />,
      },
      {
        path: "favorites-page",
        element: <FavoritesPage />,
      },
    ],
  },

  //Auth Routes
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={"auth/login"} />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={"/"} />,
  },
]);
