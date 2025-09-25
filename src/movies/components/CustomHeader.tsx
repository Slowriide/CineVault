import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { Film, Home, Popcorn, LogInIcon, LogOutIcon, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SearchBar } from "./SearchBar";
import { NavButton } from "./NavButton";

export const CustomHeader = () => {
  const { session, signOut } = useAuth();

  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
  };

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <span className="font-bold text-lg text-gradient-accent hidden md:flex ">
            CinemaVault
          </span>
          <span className="font-bold text-lg text-gradient-accent  md:hidden ">
            CV
          </span>
        </Link>

        {/* Search Bar */}

        <SearchBar />

        {/* Navigation Links */}
        <nav className="flex items-center space-x-2">
          <NavButton
            to={"/"}
            icon={<Home className="h-4 w-4 mr-2" />}
            label={"Home"}
            isActive={isActive("/")}
          />

          <NavButton
            to={"/discover"}
            icon={<Popcorn className="h-4 w-4 mr-2" />}
            label={"Discover"}
            isActive={isActive("/discover")}
          />

          <NavButton
            to={"/profile"}
            icon={<User className="h-4 w-4 mr-2" />}
            label={"Profile"}
            isActive={isActive("/profile")}
          />

          {session ? (
            <NavButton
              to={"/auth"}
              icon={<LogOutIcon className="h-4 w-4 mr-2" />}
              label={"Log Out"}
              isActive={isActive("/auth")}
              onClick={handleLogout}
            />
          ) : (
            <NavButton
              to={"/auth"}
              icon={<LogInIcon className="h-4 w-4 mr-2" />}
              label={"Log In"}
              isActive={isActive("/auth")}
            />
          )}
        </nav>
      </div>
    </header>
  );
};
