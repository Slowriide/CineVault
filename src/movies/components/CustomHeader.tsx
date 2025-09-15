import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Film,
  Search,
  Home,
  Popcorn,
  LogInIcon,
  LogOutIcon,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const CustomHeader = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { session, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

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
            variant={isActive("/discover") ? "default" : "ghost"}
            size="sm"
            className={
              isActive("/discover") ? "bg-primary text-primary-foreground" : ""
            }
          >
            <Link to="/discover">
              <Popcorn className="h-4 w-4 mr-2" />
              Discover
            </Link>
          </Button>

          <Button
            asChild
            variant={isActive("/profile") ? "default" : "ghost"}
            size="sm"
            className={
              isActive("/profile") ? "bg-primary text-primary-foreground" : ""
            }
          >
            <Link to="/profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
          </Button>

          {session ? (
            <Button
              asChild
              variant={isActive("/auth") ? "default" : "ghost"}
              size="sm"
              className={
                isActive("/auth") ? "bg-primary text-primary-foreground" : ""
              }
              onClick={handleLogout}
            >
              <Link to="/auth">
                <LogOutIcon className="h-4 w-4 mr-2" />
                Log Out
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              variant={isActive("/auth") ? "default" : "ghost"}
              size="sm"
              className={
                isActive("/auth") ? "bg-primary text-primary-foreground" : ""
              }
            >
              <Link to="/auth">
                <LogInIcon className="h-4 w-4 mr-2" />
                Log In
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
