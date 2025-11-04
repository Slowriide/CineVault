import { Calendar } from "lucide-react";
import { useMemo } from "react";

interface PersonDatesProps {
  date: Date;
  isBirth: boolean;
  birthYear: number | undefined;
  deathYear?: number | undefined;
}

/**
 * Displays a formatted birth or death date with age information.
 */
export const PersonDates = ({
  date,
  birthYear,
  isBirth,
  deathYear,
}: PersonDatesProps) => {
  // Format the date into a readable string (e.g., "January 5, 1970")
  const formattedDate = useMemo(
    () =>
      new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [date]
  );

  // Calculate and display age (current or at death)
  const ageInfo = useMemo(() => {
    if (!birthYear) return "";
    if (isBirth) return ` (${new Date().getFullYear() - birthYear} years old)`;
    if (deathYear) return ` (${deathYear - birthYear} years old)`;
    return "";
  }, [birthYear, deathYear, isBirth]);

  return (
    <div className="flex items-center space-x-2">
      {/* Calendar icon for visual clarity */}
      <Calendar className="w-4 h-4 text-muted-foreground" />
      <span className="text-muted-foreground">Born:</span>
      <span className="text-foreground">
        {formattedDate}
        {ageInfo}
      </span>
    </div>
  );
};
