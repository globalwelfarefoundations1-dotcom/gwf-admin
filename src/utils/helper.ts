export const formattedDate = new Date().toLocaleDateString("en-US", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
});
