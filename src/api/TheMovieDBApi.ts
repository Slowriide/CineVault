import axios from "axios";

const TMDBAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

TMDBAPI.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_TMDB_TOKEN;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { TMDBAPI };
