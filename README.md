# CineVault

CineVault is a modern movie and TV show web application built with React, TypeScript, and React Query. It allows users to browse movies, TV shows, actors, and reviews, manage personal watchlists, favorites, and track their reviews.

---

## Author

**Your Name**

- GitHub: [Slowriide]https://github.com/Slowriide
- LinkedIn: [Thiago Gobbi]https://www.linkedin.com/in/thiago-gobbi-b500421a6/
- Email: thiagomgobbi7@gmail.com

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Routing](#routing)
- [API & Data Handling](#api--data-handling)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Home page with trending, popular, and top-rated movies & TV shows.
- Detailed movie/TV show pages with trailers, cast, and similar content.
- Actor pages with full filmography, biography, and stats.
- Discover and search pages with filtering and sorting options.
- User authentication with protected profile dashboard.
- Profile management for favorites, watchlist, watched movies, and reviews.
- Fully responsive design with dynamic backdrops and posters.
- Pagination and lazy loading for large datasets.
- Notifications with Sonner Toaster for feedback messages.

---

## Tech Stack

- **Frontend:** React 18, TypeScript
- **Routing:** React Router v6 (`createHashRouter`)
- **State & Data Fetching:** React Query (`@tanstack/react-query`)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Authentication:** Supabase
- **Notifications:** Sonner Toaster

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/cinevault.git
cd cinevault
```

2. Install dependencies

   npm install

   or

   yarn install

3. Create a .env file with your API keys and Supabase credentials:
   VITE_TMDB_API_KEY=your_tmdb_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

4. Start the development server:

   npm run dev

   or

   yarn dev

---

# Available Scripts

- dev: Runs the app in development mode

- build: Builds the app for production

- preview: Previews the production build locally

- lint: Lints the codebase with ESLint

---

# Project Structure

/src
├─ /api # Api call actions
├─ /auth # Authentication pages & layouts
├─ /components # Reusable UI components
├─ /context # React context (AuthContext)
├─ /interfaces # TypeScript interfaces and types
├─ /lib # General Utiliti functions
├─ /movies # Pages, hooks, layouts for movies & TV shows
├─ /router # App routes configuration
├─ /utils # Utility functions (slugify, tmdb utils, etc.)
└─ main.tsx # App entry point

---

# API & Data Handling

- TMDb API: Fetches movies, TV shows, and actors.
- Supabase: Stores user favorites, watchlists, watched movies, and reviews.
- React Query: Handles caching, background fetching, and error handling for API calls.

# Caching & Performance:

- Genres are cached in localStorage for 7 days.
- Movie and TV show details are normalized to a standard format.
- Lazy loading used for sections with large datasets.
