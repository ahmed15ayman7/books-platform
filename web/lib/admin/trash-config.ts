/** مدة الاحتفاظ في سلة المحذوفات قبل الحذف النهائي التلقائي */
export const TRASH_RETENTION_DAYS = 30;

export function trashAutoPurgeAt(deletedAt: Date): Date {
  const at = new Date(deletedAt);
  at.setDate(at.getDate() + TRASH_RETENTION_DAYS);
  return at;
}

export function trashDaysRemaining(deletedAt: Date): number {
  const ms = trashAutoPurgeAt(deletedAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

export function trashExpirationCutoff(): Date {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - TRASH_RETENTION_DAYS);
  return cutoff;
}

export function expiredDeletedWhere() {
  return {
    deletedAt: { not: null, lte: trashExpirationCutoff() },
  } as const;
}
