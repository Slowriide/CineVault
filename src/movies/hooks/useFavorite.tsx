import { useState, useEffect } from "react";

export type FavoriteItem = {
  id: number;
  title?: string; // movies
  name?: string; // tv shows
  poster_path?: string;
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

  const addFavorite = (item: FavoriteItem) => {
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

  const toggleFavorite = (item: FavoriteItem) => {
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
