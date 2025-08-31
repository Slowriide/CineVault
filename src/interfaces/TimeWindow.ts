export type TimeWindow = "day" | "week";

export function getTimeWindow(
  param: string | null,
  fallback: TimeWindow = "week"
): TimeWindow {
  return param === "day" || param === "week" ? param : fallback;
}
