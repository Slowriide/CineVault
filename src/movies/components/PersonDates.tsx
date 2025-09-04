import { Calendar } from "lucide-react";

interface PersonDatesProps {
  date: Date;
  isBirth: boolean;
  birthYear: number | undefined;
  deathYear?: number | undefined;
}

export const PersonDates = ({
  date,
  birthYear,
  isBirth,
  deathYear,
}: PersonDatesProps) => {
  if (isBirth)
    return (
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">Born:</span>
        <span className="text-foreground">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {birthYear && ` (${new Date().getFullYear() - birthYear} years old)`}
        </span>
      </div>
    );

  return (
    <div className="flex items-center space-x-2">
      <Calendar className="w-4 h-4 text-muted-foreground" />
      <span className="text-muted-foreground">Died:</span>
      <span className="text-foreground">
        {new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        {birthYear && deathYear && ` (${deathYear - birthYear} years old)`}
      </span>
    </div>
  );
};
