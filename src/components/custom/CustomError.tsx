import { Link } from "react-router";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface ErrorProps {
  title: string;
  message: string;
  action?: { to: string; label: string };
  height?: string;
}

export const CustomError = ({ action, message, title, height }: ErrorProps) => {
  return (
    <div
      className={cn(
        "flex items-start justify-center justify-items-center",
        height ? height : "min-h-screen"
      )}
    >
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{message}</p>
        {action && (
          <Button asChild variant={"outline"}>
            <Link to={action.to}>{action.label}</Link>
          </Button>
        )}
      </div>
    </div>
  );
};
