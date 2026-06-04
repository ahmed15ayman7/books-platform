import {
  hasPermission,
  PERMISSIONS,
  type Permission,
} from "@/lib/auth/permissions";

export const TRASH_TYPES = ["books", "articles", "publishers", "hero", "users"] as const;
export type TrashType = (typeof TRASH_TYPES)[number];

export const DRAFT_TYPES = ["books", "articles", "publishers", "submissions"] as const;
export type DraftType = (typeof DRAFT_TYPES)[number];

export const TRASH_TYPE_LABELS: Record<TrashType, string> = {
  books: "الكتب",
  articles: "المقالات",
  publishers: "الناشرون",
  hero: "سلايدر الرئيسية",
  users: "مديرو النظام",
};

export const DRAFT_TYPE_LABELS: Record<DraftType, string> = {
  books: "الكتب",
  articles: "المقالات",
  publishers: "الناشرون",
  submissions: "طلبات النشر",
};

const TRASH_DELETE_PERMISSION: Record<TrashType, Permission> = {
  books: PERMISSIONS.books.delete,
  articles: PERMISSIONS.articles.delete,
  publishers: PERMISSIONS.publishers.delete,
  hero: PERMISSIONS.hero.delete,
  users: PERMISSIONS.users.delete,
};

const DRAFT_VIEW_PERMISSION: Record<DraftType, Permission> = {
  books: PERMISSIONS.books.view,
  articles: PERMISSIONS.articles.view,
  publishers: PERMISSIONS.publishers.view,
  submissions: PERMISSIONS.submissions.view,
};

const DRAFT_PUBLISH_PERMISSION: Record<Exclude<DraftType, "submissions">, Permission> = {
  books: PERMISSIONS.books.update,
  articles: PERMISSIONS.articles.update,
  publishers: PERMISSIONS.publishers.update,
};

type PermUser = { isSuperAdmin: boolean; permissions: Permission[] };

export function canAccessTrashType(user: PermUser, type: TrashType): boolean {
  return hasPermission(user, TRASH_DELETE_PERMISSION[type]);
}

export function canAccessDraftType(user: PermUser, type: DraftType): boolean {
  return hasPermission(user, DRAFT_VIEW_PERMISSION[type]);
}

export function getAccessibleTrashTypes(user: PermUser): TrashType[] {
  return TRASH_TYPES.filter((t) => canAccessTrashType(user, t));
}

export function getAccessibleDraftTypes(user: PermUser): DraftType[] {
  return DRAFT_TYPES.filter((t) => canAccessDraftType(user, t));
}

export function canAccessTrashHub(user: PermUser): boolean {
  return getAccessibleTrashTypes(user).length > 0;
}

export function canAccessDraftsHub(user: PermUser): boolean {
  return getAccessibleDraftTypes(user).length > 0;
}

export function canPublishDraftType(user: PermUser, type: DraftType): boolean {
  if (type === "submissions") return false;
  return hasPermission(user, DRAFT_PUBLISH_PERMISSION[type]);
}

export const TRASH_DELETE_PERMISSIONS = Object.values(TRASH_DELETE_PERMISSION);
export const DRAFT_VIEW_PERMISSIONS = Object.values(DRAFT_VIEW_PERMISSION);
