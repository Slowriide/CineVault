import { Link } from "react-router";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

// Define the component's expected props:
// - title: main heading text of the error message
// - message: a short description of the error
// - action (optional): provides a button link to a different page (e.g., "Go Home")
// - height (optional): allows customizing the component’s vertical size
interface ErrorProps {
  title: string;
  message: string;
  action?: { to: string; label: string };
  height?: string;
}

// CustomError component: displays an error message with an optional action button.
// Useful for 404 pages, network errors, or empty-state messages.
export const CustomError = ({ action, message, title, height }: ErrorProps) => {
  return (
    // Main container centered horizontally (and optionally vertically)
    <div
      className={cn(
        "flex items-center justify-center justify-items-center",
        height ? height : "min-h-screen" // Use custom height if provided, otherwise take full screen
      )}
    >
      {/* Centered text content block */}
      <div className="text-center space-y-4">
        {/* Error title (large and bold) */}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>

        {/* Error message (secondary text color) */}
        <p className="text-muted-foreground">{message}</p>

        {/* Optional button that links to a specific route */}
        {action && (
          <Button asChild variant={"outline"}>
            <Link to={action.to}>{action.label}</Link>
          </Button>
        )}
      </div>
    </div>
  );
};
