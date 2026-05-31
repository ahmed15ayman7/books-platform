export function withCreate(userId: string) {
  return { createdById: userId, updatedById: userId };
}

export function withUpdate(userId: string) {
  return { updatedById: userId };
}

export function withSoftDelete(userId: string) {
  return { deletedById: userId, deletedAt: new Date() };
}

export const notDeleted = { deletedAt: null } as const;
