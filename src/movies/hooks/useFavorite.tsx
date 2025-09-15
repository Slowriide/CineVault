import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import { useState, useEffect } from "react";

const FAVORITES_KEY = "movieapp_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<(MovieMovieDB | TvShowMovieDB)[]>(
    []
  );

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing favorites from localStorage:", error);
      }
    }
  }, []);

  const saveFavorites = (newFavorites: (MovieMovieDB | TvShowMovieDB)[]) => {
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  const addFavorite = (item: MovieMovieDB | TvShowMovieDB) => {
    setFavorites((prev) => {
      const newFavs = [...prev, item];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const removeFavorite = (id: number) => {
    const newFavorites = favorites.filter((item) => item.id !== id);
    saveFavorites(newFavorites);
  };

  const isFavorite = (id: number) => {
    return favorites.some((item) => item.id === id);
  };

  const toggleFavorite = (item: MovieMovieDB | TvShowMovieDB) => {
    if (favorites.some((fav) => fav.id === item.id)) {
      setFavorites((prev) => {
        const newFavs = prev.filter((fav) => fav.id !== item.id);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs));
        return newFavs;
      });
    } else {
      addFavorite(item);
    }
  };
  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
};
