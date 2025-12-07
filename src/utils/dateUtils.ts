/**
 * Date utility functions
 * Centralized date formatting and manipulation utilities
 */

export interface DateParts {
  datePart: string;
  dayPart: string;
}

/**
 * Format date as "7 Feb, 20 – Thursday"
 * @param date - Date object to format
 * @returns Formatted date string
 */
export const formatDeliveryDate = (date: Date | null | undefined): string => {
  if (!date || !(date instanceof Date)) {
    return "";
  }
  
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear().toString().slice(-2);
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  
  return `${day} ${month}, ${year} – ${weekday}`;
};

/**
 * Format date for display in cards
 * @param date - Date object
 * @returns Object with datePart and dayPart
 */
export const formatDeliveryDateParts = (date: Date | null | undefined): DateParts => {
  if (!date || !(date instanceof Date)) {
    return { datePart: "", dayPart: "" };
  }
  
  const formatted = formatDeliveryDate(date);
  const parts = formatted.split(" – ");
  
  return {
    datePart: parts[0] || "",
    dayPart: parts[1] || ""
  };
};

/**
 * Format relative time (e.g., "2 days ago", "Today")
 * @param date - Date object
 * @returns Relative time string
 */
export const formatRelativeTime = (date: Date | null | undefined): string => {
  if (!date || !(date instanceof Date)) {
    return "";
  }
  
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return formatDeliveryDate(date);
  }
};

export default {
  formatDeliveryDate,
  formatDeliveryDateParts,
  formatRelativeTime
};

