import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  Home,
  Popcorn,
  LogInIcon,
  LogOutIcon,
  User,
  Clapperboard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SearchBar } from "./SearchBar";
import { NavButton } from "./NavButton";
import { cn } from "@/lib/utils";

export const CustomHeader = () => {
  const { session, signOut } = useAuth(); // Auth context for session info and logout

  // Track if the page has been scrolled to apply sticky header styling
  const [scrolled, setScrolled] = useState(false);

  // Track if the search bar is focused to expand it and hide nav links on mobile
  const [searchFocused, setSearchFocused] = useState(false);

  const location = useLocation(); // React Router location to determine active nav link

  // Log out the user
  const handleLogout = async () => {
    await signOut();
  };

  // Check if a path matches current location for active nav button
  const isActive = (path: string) => location.pathname === path;

  // Add scroll event listener to toggle `scrolled` state
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
      <div className="max-w-[1600px] mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Branding */}
        <Link
          to="/"
          className={cn(
            "flex items-center space-x-2 hover:opacity-80 transition-opacity duration-300 ease-in-out mr-2 ",
            searchFocused ? "hidden md:flex" : "flex"
          )}
        >
          {/* Icon */}
          <Clapperboard className="h-6 w-6 text-primary" />
          {/* Full name for desktop */}
          <span className="font-bold text-lg text-gradient-accent hidden md:flex ">
            CineVault
          </span>
          {/* Abbreviated logo for mobile */}
          <span className="font-bold text-lg text-gradient-accent  md:hidden ">
            CV
          </span>
        </Link>

        {/* Search Bar */}
        <div
          className={cn(
            "flex transition-all duration-300 ease-in-out",
            searchFocused
              ? "flex-1 lg:flex-initial lg:w-full lg:max-w-xl lg:mx-auto"
              : "w-full max-w-xl mx-auto"
          )}
        >
          <SearchBar
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* Navigation Links */}
        <nav
          className={cn(
            "flex items-center space-x-2 transition-opacity duration-300 ease-in-out",
            searchFocused ? "hidden md:flex" : "flex" // Hide nav on mobile when search focused
          )}
        >
          {/* Home Button */}
          <NavButton
            to={"/"}
            icon={<Home className="h-4 w-4 md:mr-2" />}
            label={"Home"}
            isActive={isActive("/")}
          />

          {/* Discover Button */}
          <NavButton
            to={"/discover"}
            icon={<Popcorn className="h-4 w-4 md:mr-2" />}
            label={"Discover"}
            isActive={isActive("/discover")}
          />

          {/* Profile Button */}
          <NavButton
            to={"/profile"}
            icon={<User className="h-4 w-4 md:mr-2" />}
            label={"Profile"}
            isActive={isActive("/profile")}
          />

          {/* Auth Button */}
          {session ? (
            <NavButton
              to={"/auth"}
              icon={<LogOutIcon className="h-4 w-4 md:mr-2" />}
              label={"Log Out"}
              isActive={isActive("/auth")}
              onClick={handleLogout}
            />
          ) : (
            <NavButton
              to={"/auth"}
              icon={<LogInIcon className="h-4 w-4 md:mr-2" />}
              label={"Log In"}
              isActive={isActive("/auth")}
            />
          )}
        </nav>
      </div>
    </header>
  );
};
