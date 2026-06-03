export function withCreate(userId: string) {
  return { createdById: userId, updatedById: userId };
}

export function withUpdate(userId: string) {
  return { updatedById: userId };
}

export function withSoftDelete(userId: string) {
  return { deletedById: userId, deletedAt: new Date() };
}

export function withRestore(userId: string) {
  return { deletedById: null, deletedAt: null, updatedById: userId };
}

export const notDeleted = { deletedAt: null } as const;

export const onlyDeleted = { deletedAt: { not: null } } as const;
