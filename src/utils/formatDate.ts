// utils/formatDate.ts
import { format, isValid, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const malaysiaTimeZone = "Asia/Kuala_Lumpur";

// Accept string | number | Date. Return "—" if not parseable.
export function formatToMalaysiaTime(
  input: string | number | Date,
  dateFormat = "dd MMM yyyy, hh:mm a"
): string {
  if (input === null || input === undefined || input === "") return "—";

  let base: Date;

  // Normalize input
  if (input instanceof Date) {
    base = input;
  } else if (typeof input === "number") {
    base = new Date(input); // epoch ms
  } else {
    const s = input.trim();

    // If it's all digits, treat as epoch ms
    if (/^\d+$/.test(s)) {
      base = new Date(Number(s));
    } else {
      // Try ISO parsing (handles '2025-08-17T03:10:00Z', etc.)
      base = parseISO(s);
      // Fallback to native Date if parseISO fails
      if (!isValid(base)) base = new Date(s);
    }
  }

  if (!isValid(base)) return "—";

  const zoned = toZonedTime(base, malaysiaTimeZone);
  if (!isValid(zoned)) return "—";

  try {
    return format(zoned, dateFormat);
  } catch {
    return "—";
  }
}
