import axios from "axios";

// Create a reusable Axios instance configured for The Movie Database (TMDB) API.
// The base URL is loaded from an environment variable for flexibility between environments.
const TMDBAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor to automatically attach the authorization token
// to every outgoing request, if it exists.
TMDBAPI.interceptors.request.use((config) => {
  // Retrieve the TMDB API token from environment variables.
  const token = import.meta.env.VITE_TMDB_TOKEN;

  // If a token is available, include it in the request headers using Bearer authentication.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Always return the modified config so Axios can continue the request.
  return config;
});

// Export the configured Axios instance for use throughout the app.
// This helps maintain consistent API behavior and reduces code duplication.
export { TMDBAPI };
