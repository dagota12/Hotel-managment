/**
 * Formats a 24-hour time string (e.g., "17:00", "09:30", "14:05")
 * into a human-friendly 12-hour format (e.g., "5:00 PM", "9:30 AM", "2:05 PM").
 * Returns the input unchanged or "—" if empty/invalid.
 */
export function formatTime(time: string | null | undefined): string {
  if (!time || !time.trim() || time === "—") return "—";
  
  const parts = time.split(":");
  if (parts.length < 2) return time;

  const hours24 = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (isNaN(hours24) || isNaN(minutes)) return time;

  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${hours12}:${formattedMinutes} ${period}`;
}
