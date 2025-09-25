import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router";

interface NavButtonProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

export const NavButton = (props: NavButtonProps) => {
  const { icon, isActive, label, to, onClick } = props;
  return (
    <Button
      asChild
      variant={isActive ? "default" : "ghost"}
      size="sm"
      className={isActive ? "bg-primary text-primary-foreground" : ""}
      onClick={onClick}
      aria-label={label}
    >
      <Link to={to}>
        {icon}
        <span className="hidden md:flex">{label}</span>
      </Link>
    </Button>
  );
};
