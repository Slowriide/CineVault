import { Calendar } from "lucide-react";
import { useMemo } from "react";

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
  const formattedDate = useMemo(
    () =>
      new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [date]
  );

  const ageInfo = useMemo(() => {
    if (!birthYear) return "";
    if (isBirth) return ` (${new Date().getFullYear() - birthYear} years old)`;
    if (deathYear) return ` (${deathYear - birthYear} years old)`;
    return "";
  }, [birthYear, deathYear, isBirth]);

  return (
    <div className="flex items-center space-x-2">
      <Calendar className="w-4 h-4 text-muted-foreground" />
      <span className="text-muted-foreground">Born:</span>
      <span className="text-foreground">
        {formattedDate}
        {ageInfo}
      </span>
    </div>
  );
};
