import { format } from "date-fns";

export function formatShiftTime(date: string) {
  return format(new Date(date), "h:mm a");
}