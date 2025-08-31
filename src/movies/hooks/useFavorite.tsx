import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import { useState, useEffect } from "react";

export type FavoriteItem = (MovieMovieDB | TvShowMovieDB) & {
  media_type: "movie" | "tv";
};

const FAVORITES_KEY = "movieapp_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

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

  const saveFavorites = (newFavorites: FavoriteItem[]) => {
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  const addFavorite = (
    item: MovieMovieDB | TvShowMovieDB,
    mediaType: "movie" | "tv"
  ) => {
    const favoriteItem: FavoriteItem = { ...item, media_type: mediaType };
    const newFavorites = [...favorites, favoriteItem];
    saveFavorites(newFavorites);
  };

  const removeFavorite = (id: number) => {
    const newFavorites = favorites.filter((item) => item.id !== id);
    saveFavorites(newFavorites);
  };

  const isFavorite = (id: number) => {
    return favorites.some((item) => item.id === id);
  };

  const toggleFavorite = (
    item: MovieMovieDB | TvShowMovieDB,
    mediaType: "movie" | "tv"
  ) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item, mediaType);
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
