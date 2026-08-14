/**
 * Formats a status or key string by removing underscores/dashes and capitalizing each word.
 * E.g., "in_progress" -> "In Progress", "booking-status" -> "Booking Status"
 * @param {string} str 
 * @returns {string}
 */
export const formatStatus = (str) => {
  if (!str || typeof str !== "string") return str || "";
  return str
    .replace(/[_-]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
