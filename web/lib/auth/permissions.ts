/**
 * صلاحيات لوحة التحكم — المدير الرئيسي (isSuperAdmin) يتجاوز كل الفحوصات.
 */
export const PERMISSIONS = {
  dashboard: { view: "dashboard.view" },

  books: {
    view: "books.view",
    create: "books.create",
    update: "books.update",
    delete: "books.delete",
    marketing: "books.marketing",
  },

  publishers: {
    view: "publishers.view",
    create: "publishers.create",
    update: "publishers.update",
    delete: "publishers.delete",
  },

  categories: {
    view: "categories.view",
    create: "categories.create",
    update: "categories.update",
    delete: "categories.delete",
  },

  authors: {
    view: "authors.view",
    create: "authors.create",
    update: "authors.update",
    delete: "authors.delete",
  },

  articles: {
    view: "articles.view",
    create: "articles.create",
    update: "articles.update",
    delete: "articles.delete",
  },

  media: {
    view: "media.view",
    create: "media.create",
    update: "media.update",
    delete: "media.delete",
  },

  submissions: {
    view: "submissions.view",
    approve: "submissions.approve",
    reject: "submissions.reject",
  },

  orders: {
    view: "orders.view",
    update: "orders.update",
  },

  comments: {
    view: "comments.view",
    moderate: "comments.moderate",
    delete: "comments.delete",
  },

  newsletter: {
    view: "newsletter.view",
    send: "newsletter.send",
  },

  b2b: {
    view: "b2b.view",
    create: "b2b.create",
    update: "b2b.update",
    delete: "b2b.delete",
  },

  ambassadors: {
    view: "ambassadors.view",
    create: "ambassadors.create",
    update: "ambassadors.update",
    delete: "ambassadors.delete",
  },

  notifications: {
    broadcast: "notifications.broadcast",
  },

  pages: {
    view: "pages.view",
    update: "pages.update",
  },

  settings: {
    view: "settings.view",
    update: "settings.update",
  },

  account: {
    view: "account.view",
    update: "account.update",
  },

  passkey: {
    manage: "passkey.manage",
  },

  hero: {
    view: "hero.view",
    create: "hero.create",
    update: "hero.update",
    delete: "hero.delete",
  },

  audit: {
    view: "audit.view",
  },

  users: {
    view: "users.view",
    create: "users.create",
    update: "users.update",
    delete: "users.delete",
  },
} as const;

type PermissionValues<T> = T extends Record<string, infer U>
  ? U extends string
    ? U
    : PermissionValues<U>
  : never;

export type Permission = PermissionValues<typeof PERMISSIONS>;

function collectPermissions(): Permission[] {
  const list: string[] = [];
  for (const group of Object.values(PERMISSIONS)) {
    for (const key of Object.values(group)) {
      list.push(key);
    }
  }
  return list as Permission[];
}

export const ALL_PERMISSIONS = collectPermissions();

export const PERMISSION_GROUPS: {
  id: string;
  labelAr: string;
  labelEn: string;
  permissions: { key: Permission; labelAr: string; labelEn: string }[];
}[] = [
  {
    id: "dashboard",
    labelAr: "لوحة التحكم",
    labelEn: "Dashboard",
    permissions: [{ key: PERMISSIONS.dashboard.view, labelAr: "عرض", labelEn: "View" }],
  },
  {
    id: "books",
    labelAr: "الكتب",
    labelEn: "Books",
    permissions: [
      { key: PERMISSIONS.books.view, labelAr: "عرض", labelEn: "View" },
      { key: PERMISSIONS.books.create, labelAr: "إضافة", labelEn: "Create" },
      { key: PERMISSIONS.books.update, labelAr: "تعديل", labelEn: "Update" },
      { key: PERMISSIONS.books.delete, labelAr: "حذف", labelEn: "Delete" },
      { key: PERMISSIONS.books.marketing, labelAr: "تسويق", labelEn: "Marketing" },
    ],
  },
  {
    id: "publishers",
    labelAr: "الناشرون",
    labelEn: "Publishers",
    permissions: [
      { key: PERMISSIONS.publishers.view, labelAr: "عرض", labelEn: "View" },
      { key: PERMISSIONS.publishers.create, labelAr: "إضافة", labelEn: "Create" },
      { key: PERMISSIONS.publishers.update, labelAr: "تعديل", labelEn: "Update" },
      { key: PERMISSIONS.publishers.delete, labelAr: "حذف", labelEn: "Delete" },
    ],
  },
  {
    id: "categories",
    labelAr: "التصنيفات",
    labelEn: "Categories",
    permissions: [
      { key: PERMISSIONS.categories.view, labelAr: "عرض", labelEn: "View" },
      { key: PERMISSIONS.categories.create, labelAr: "إضافة", labelEn: "Create" },
      { key: PERMISSIONS.categories.update, labelAr: "تعديل", labelEn: "Update" },
      { key: PERMISSIONS.categories.delete, labelAr: "حذف", labelEn: "Delete" },
    ],
  },
  {
    id: "authors",
    labelAr: "المؤلفون",
    labelEn: "Authors",
    permissions: [
      { key: PERMISSIONS.authors.view, labelAr: "عرض", labelEn: "View" },
      { key: PERMISSIONS.authors.create, labelAr: "إضافة", labelEn: "Create" },
      { key: PERMISSIONS.authors.update, labelAr: "تعديل", labelEn: "Update" },
      { key: PERMISSIONS.authors.delete, labelAr: "حذف", labelEn: "Delete" },
    ],
  },
  {
    id: "articles",
    labelAr: "المقالات",
    labelEn: "Articles",
    permissions: [
      { key: PERMISSIONS.articles.view, labelAr: "عرض", labelEn: "View" },
      { key: PERMISSIONS.articles.create, labelAr: "إضافة", labelEn: "Create" },
      { key: PERMISSIONS.articles.update, labelAr: "تعديل", labelEn: "Update" },
      { key: PERMISSIONS.articles.delete, labelAr: "حذف", labelEn: "Delete" },
    ],
  },
  {
    id: "media",
    labelAr: "الميديا",
    labelEn: "Media",
    permissions: [
      { key: PERMISSIONS.media.view, labelAr: "عرض", labelEn: "View" },
      { key: PERMISSIONS.media.create, labelAr: "إضافة", labelEn: "Create" },
      { key: PERMISSIONS.media.update, labelAr: "تعديل", labelEn: "Update" },
      { key: PERMISSIONS.media.delete, labelAr: "حذف", labelEn: "Delete" },
    ],
  },
  {
    id: "submissions",
    labelAr: "طلبات النشر",
    labelEn: "Submissions",
    permissions: [
      { key: PERMISSIONS.submissions.view, labelAr: "عرض", labelEn: "View" },
      { key: PERMISSIONS.submissions.approve, labelAr: "موافقة", labelEn: "Approve" },
      { key: PERMISSIONS.submissions.reject, labelAr: "رفض", labelEn: "Reject" },
    ],
  },
  {
    id: "orders",
    labelAr: "الطلبات",
    labelEn: "Orders",
    permissions: [
      { key: PERMISSIONS.orders.view, labelAr: "عرض", labelEn: "View" },
      { key: PERMISSIONS.orders.update, labelAr: "تعديل", labelEn: "Update" },
    ],
  },
  {
    id: "comments",
    labelAr: "التعليقات",
    labelEn: "Comments",
    permissions: [
      { key: PERMISSIONS.comments.view, labelAr: "عرض", labelEn: "View" },
      { key: PERMISSIONS.comments.moderate, labelAr: "مراجعة", labelEn: "Moderate" },
      { key: PERMISSIONS.comments.delete, labelAr: "حذف", labelEn: "Delete" },
    ],
  },
  {
    id: "newsletter",
    labelAr: "النشرة",
    labelEn: "Newsletter",
    permissions: [
      { key: PERMISSIONS.newsletter.view, labelAr: "عرض", labelEn: "View" },
      { key: PERMISSIONS.newsletter.send, labelAr: "إرسال", labelEn: "Send" },
    ],
  },
  {
    id: "b2b",
    labelAr: "B2B",
    labelEn: "B2B",
    permissions: [
      { key: PERMISSIONS.b2b.view, labelAr: "عرض", labelEn: "View" },
      { key: PERMISSIONS.b2b.create, labelAr: "إضافة", labelEn: "Create" },
      { key: PERMISSIONS.b2b.update, labelAr: "تعديل", labelEn: "Update" },
      { key: PERMISSIONS.b2b.delete, labelAr: "حذف", labelEn: "Delete" },
    ],
  },
  {
    id: "ambassadors",
    labelAr: "السفراء",
    labelEn: "Ambassadors",
    permissions: [
      { key: PERMISSIONS.ambassadors.view, labelAr: "عرض", labelEn: "View" },
      { key: PERMISSIONS.ambassadors.create, labelAr: "إضافة", labelEn: "Create" },
      { key: PERMISSIONS.ambassadors.update, labelAr: "تعديل", labelEn: "Update" },
      { key: PERMISSIONS.ambassadors.delete, labelAr: "حذف", labelEn: "Delete" },
    ],
  },
  {
    id: "notifications",
    labelAr: "الإشعارات",
    labelEn: "Notifications",
    permissions: [
      { key: PERMISSIONS.notifications.broadcast, labelAr: "بث", labelEn: "Broadcast" },
    ],
  },
  {
    id: "pages",
    labelAr: "صفحات ثابتة",
    labelEn: "Static pages",
    permissions: [
      { key: PERMISSIONS.pages.view, labelAr: "عرض", labelEn: "View" },
      { key: PERMISSIONS.pages.update, labelAr: "تعديل", labelEn: "Update" },
    ],
  },
  {
    id: "settings",
    labelAr: "الإعدادات",
    labelEn: "Settings",
    permissions: [
      { key: PERMISSIONS.settings.view, labelAr: "عرض", labelEn: "View" },
      { key: PERMISSIONS.settings.update, labelAr: "تعديل", labelEn: "Update" },
    ],
  },
  {
    id: "account",
    labelAr: "حسابي",
    labelEn: "My account",
    permissions: [
      { key: PERMISSIONS.account.view, labelAr: "عرض", labelEn: "View" },
      { key: PERMISSIONS.account.update, labelAr: "تعديل", labelEn: "Update" },
    ],
  },
  {
    id: "passkey",
    labelAr: "Passkey",
    labelEn: "Passkey",
    permissions: [
      { key: PERMISSIONS.passkey.manage, labelAr: "إدارة", labelEn: "Manage" },
    ],
  },
  {
    id: "hero",
    labelAr: "سلايدر الرئيسية",
    labelEn: "Hero slider",
    permissions: [
      { key: PERMISSIONS.hero.view, labelAr: "عرض", labelEn: "View" },
      { key: PERMISSIONS.hero.create, labelAr: "إضافة", labelEn: "Create" },
      { key: PERMISSIONS.hero.update, labelAr: "تعديل", labelEn: "Update" },
      { key: PERMISSIONS.hero.delete, labelAr: "حذف", labelEn: "Delete" },
    ],
  },
  {
    id: "audit",
    labelAr: "سجل الأحداث",
    labelEn: "Audit log",
    permissions: [{ key: PERMISSIONS.audit.view, labelAr: "عرض", labelEn: "View" }],
  },
  {
    id: "users",
    labelAr: "مديرو النظام",
    labelEn: "Admin users",
    permissions: [
      { key: PERMISSIONS.users.view, labelAr: "عرض", labelEn: "View" },
      { key: PERMISSIONS.users.create, labelAr: "إضافة", labelEn: "Create" },
      { key: PERMISSIONS.users.update, labelAr: "تعديل", labelEn: "Update" },
      { key: PERMISSIONS.users.delete, labelAr: "تعطيل", labelEn: "Deactivate" },
    ],
  },
];

export const NAV_PERMISSION_BY_HREF: Record<string, Permission> = {
  "/admin/dashboard": PERMISSIONS.dashboard.view,
  "/admin/home-slider": PERMISSIONS.hero.view,
  "/admin/books": PERMISSIONS.books.view,
  "/admin/publishers": PERMISSIONS.publishers.view,
  "/admin/categories": PERMISSIONS.categories.view,
  "/admin/authors": PERMISSIONS.authors.view,
  "/admin/articles": PERMISSIONS.articles.view,
  "/admin/media": PERMISSIONS.media.view,
  "/admin/submissions": PERMISSIONS.submissions.view,
  "/admin/orders": PERMISSIONS.orders.view,
  "/admin/comments": PERMISSIONS.comments.view,
  "/admin/newsletter": PERMISSIONS.newsletter.view,
  "/admin/b2b": PERMISSIONS.b2b.view,
  "/admin/ambassadors": PERMISSIONS.ambassadors.view,
  "/admin/notifications": PERMISSIONS.notifications.broadcast,
  "/admin/pages": PERMISSIONS.pages.view,
  "/admin/contact": PERMISSIONS.settings.view,
  "/admin/settings": PERMISSIONS.settings.view,
  "/admin/audit-log": PERMISSIONS.audit.view,
  "/admin/users": PERMISSIONS.users.view,
  "/admin/trash": PERMISSIONS.books.delete,
  "/admin/drafts": PERMISSIONS.books.view,
};

export function parsePermissionsJson(value: unknown): Permission[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (p): p is Permission =>
      typeof p === "string" && (ALL_PERMISSIONS as string[]).includes(p)
  );
}

export function hasPermission(
  user: { isSuperAdmin: boolean; permissions: Permission[] },
  permission: Permission
): boolean {
  if (user.isSuperAdmin) return true;
  return user.permissions.includes(permission);
}

export function hasAnyPermission(
  user: { isSuperAdmin: boolean; permissions: Permission[] },
  permissions: Permission[]
): boolean {
  if (user.isSuperAdmin) return true;
  return permissions.some((p) => user.permissions.includes(p));
}

export function sanitizePermissions(input: unknown): Permission[] {
  return parsePermissionsJson(input);
}
