import { Button } from "@/components/ui/button";

interface Props {
  isActive: boolean;
  icon: React.ReactNode;
  labelOn: string;
  labelOff: string;
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => Promise<void>;
}

// A simple toggle button that changes label and style based on `isActive`
export const ToggleButton = ({
  icon,
  isActive,
  labelOff,
  labelOn,
  onClick,
}: Props) => {
  return (
    <Button
      size="lg"
      onClick={onClick}
      variant={isActive ? "default" : "outline"}
      className={isActive ? "bg-primary hover:bg-chart-5 col-span-1" : ""}
    >
      <span className="hidden xl:flex">{icon}</span>
      {isActive ? labelOn : labelOff}
    </Button>
  );
};
