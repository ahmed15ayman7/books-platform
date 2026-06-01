import crypto from "node:crypto";
import type { Prisma } from "@prisma/client";

export type SubmissionFormValues = {
  authorName?: string;
  authorEmail?: string;
  authorPhone?: string;
  authorBio?: string;
  bookTitle?: string;
  bookSummary?: string;
  bookLanguage?: string;
  bookCategory?: string;
  fileUrl?: string;
  coverUrl?: string;
  allowFreeDownload?: boolean;
};

export function generateDraftToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

export function generateDraftSlug(): string {
  return `draft-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}

export function splitAuthorName(name: string | undefined) {
  if (!name?.trim()) return { first: undefined, last: undefined };
  const parts = name.trim().split(/\s+/);
  return {
    first: parts[0],
    last: parts.slice(1).join(" ") || undefined,
  };
}

export function formValuesToDraftData(values: SubmissionFormValues) {
  const { first, last } = splitAuthorName(values.authorName);
  return {
    title: values.bookTitle?.trim() || "مسودة",
    content: values.bookSummary?.trim() || null,
    authorEmail: values.authorEmail?.trim() || null,
    authorFirstName: first ?? null,
    authorLastName: last ?? null,
    authorPhone: values.authorPhone?.trim() || null,
    authorBio: values.authorBio?.trim() || null,
    bookLanguage: values.bookLanguage?.trim() || null,
    bookCategory: values.bookCategory?.trim() || null,
    fileUrl: values.fileUrl?.trim() || null,
    imageUrl: values.coverUrl?.trim() || null,
    allowFreeDownload: values.allowFreeDownload ?? false,
    formData: values as Prisma.InputJsonValue,
  };
}

export function draftToFormValues(draft: {
  title: string;
  content: string | null;
  authorEmail: string | null;
  authorFirstName: string | null;
  authorLastName: string | null;
  authorPhone: string | null;
  authorBio: string | null;
  bookLanguage: string | null;
  bookCategory: string | null;
  fileUrl: string | null;
  imageUrl: string | null;
  allowFreeDownload: boolean;
  formData: unknown;
}): SubmissionFormValues {
  const stored = draft.formData as SubmissionFormValues | null;
  if (stored && typeof stored === "object") {
    return {
      authorName: stored.authorName ?? [draft.authorFirstName, draft.authorLastName].filter(Boolean).join(" "),
      authorEmail: stored.authorEmail ?? draft.authorEmail ?? "",
      authorPhone: stored.authorPhone ?? draft.authorPhone ?? "",
      authorBio: stored.authorBio ?? draft.authorBio ?? "",
      bookTitle: stored.bookTitle ?? (draft.title === "مسودة" ? "" : draft.title),
      bookSummary: stored.bookSummary ?? draft.content ?? "",
      bookLanguage: stored.bookLanguage ?? draft.bookLanguage ?? "",
      bookCategory: stored.bookCategory ?? draft.bookCategory ?? "",
      fileUrl: stored.fileUrl ?? draft.fileUrl ?? "",
      coverUrl: stored.coverUrl ?? draft.imageUrl ?? "",
      allowFreeDownload: stored.allowFreeDownload ?? draft.allowFreeDownload,
    };
  }

  return {
    authorName: [draft.authorFirstName, draft.authorLastName].filter(Boolean).join(" "),
    authorEmail: draft.authorEmail ?? "",
    authorPhone: draft.authorPhone ?? "",
    authorBio: draft.authorBio ?? "",
    bookTitle: draft.title === "مسودة" ? "" : draft.title,
    bookSummary: draft.content ?? "",
    bookLanguage: draft.bookLanguage ?? "",
    bookCategory: draft.bookCategory ?? "",
    fileUrl: draft.fileUrl ?? "",
    coverUrl: draft.imageUrl ?? "",
    allowFreeDownload: draft.allowFreeDownload,
  };
}

export function canAccessDraft(
  draft: { userId: string | null; draftToken: string | null },
  userId: string | null,
  draftToken: string | null,
): boolean {
  if (userId && draft.userId === userId) return true;
  if (draftToken && draft.draftToken === draftToken) return true;
  return false;
}

export const DRAFT_SELECT = {
  id: true,
  status: true,
  title: true,
  content: true,
  authorEmail: true,
  authorFirstName: true,
  authorLastName: true,
  authorPhone: true,
  authorBio: true,
  bookLanguage: true,
  bookCategory: true,
  fileUrl: true,
  imageUrl: true,
  allowFreeDownload: true,
  currentStep: true,
  draftToken: true,
  userId: true,
  formData: true,
  updatedAt: true,
  createdAt: true,
} as const;
