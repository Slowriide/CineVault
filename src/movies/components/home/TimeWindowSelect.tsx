import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeWindowSelectProps {
  value: "day" | "week";
  onValueChange: (value: "day" | "week") => void;
}

/**
 * Dropdown select for choosing a trending time window ("day" or "week").
 */
export const TimeWindowSelect = ({
  value,
  onValueChange,
}: TimeWindowSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      {/* Trigger button for the select */}
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Time Window" />
      </SelectTrigger>

      {/* Dropdown options */}
      <SelectContent>
        <SelectItem value="day">Today</SelectItem>
        <SelectItem value="week">This Week</SelectItem>
      </SelectContent>
    </Select>
  );
};
