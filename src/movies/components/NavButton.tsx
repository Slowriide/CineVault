import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router";

interface NavButtonProps {
  to: string; // The route path this button links to
  icon: React.ReactNode; // Icon displayed on the button
  label: string; // Text label for the button
  isActive: boolean; // Determines if the button represents the current route
  onClick?: () => void; // Optional click handler
}

/**
 * NavButton component
 *
 * A reusable navigation button used in headers or sidebars.
 * Combines an icon and label with a link.
 * Supports active styling based on the current route.
 */
export const NavButton = (props: NavButtonProps) => {
  const { icon, isActive, label, to, onClick } = props;

  return (
    <Button
      asChild // Render the child element (Link) inside Button for correct accessibility
      variant={isActive ? "default" : "ghost"} // Active route gets default styling
      size="sm"
      className={isActive ? "bg-primary text-primary-foreground" : ""} // Extra styling if active
      onClick={onClick} // Call optional onClick handler
      aria-label={label} // Accessibility: screen readers
    >
      {/* Link wrapper */}
      <Link to={to}>
        {icon} {/* Display the icon */}
        <span className="hidden md:flex">{label}</span>{" "}
        {/* Show label on md+ screens */}
      </Link>
    </Button>
  );
};
