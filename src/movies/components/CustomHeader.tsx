import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Film, Search, Heart, Home } from "lucide-react";

export const CustomHeader = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  //! TODO:  mirar cosas
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // evita que el form recargue la página
    const query = inputRef.current?.value.trim();
    if (!query) return;
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };
  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        scrolled
          ? "border-b border-border/40 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="max-w-[1600px] mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <Film className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-gradient-accent">
            CinemaVault
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search movies, TV shows, actors..."
              className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50"
            />
          </div>
        </form>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-2">
          <Button
            asChild
            variant={isActive("/") ? "default" : "ghost"}
            size="sm"
            className={
              isActive("/") ? "bg-primary text-primary-foreground" : ""
            }
          >
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>

          <Button
            asChild
            variant={isActive("/favorites") ? "default" : "ghost"}
            size="sm"
            className={
              isActive("/favorites") ? "bg-primary text-primary-foreground" : ""
            }
          >
            <Link to="/favorites">
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};
