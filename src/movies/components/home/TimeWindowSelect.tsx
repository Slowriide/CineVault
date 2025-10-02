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

export const TimeWindowSelect = ({
  value,
  onValueChange,
}: TimeWindowSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Time Window" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="day">Today</SelectItem>
        <SelectItem value="week">This Week</SelectItem>
      </SelectContent>
    </Select>
  );
};
