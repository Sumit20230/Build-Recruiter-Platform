import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UI_STRINGS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name?: string | null) {
  if (!name) return UI_STRINGS.INITIALS_FALLBACK;
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function formatDateRange(start?: string | null, end?: string | null) {
  const format = (value?: string | null) =>
    value
      ? new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(value))
      : "";
  return `${format(start)} - ${end ? format(end) : UI_STRINGS.DATE_PRESENT}`;
}
