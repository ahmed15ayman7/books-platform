/** تنسيق تواريخ لوحة التحكم (ar-EG) */
export function formatAdminDateTime(
  value: Date | string | null | undefined
): string {
  if (value == null) return "—";
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

export function formatAdminDate(value: Date | string | null | undefined): string {
  if (value == null) return "—";
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}
