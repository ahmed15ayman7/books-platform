import { z } from "zod";

export const createSubmissionSchema = z.object({
  authorName: z.string().min(2).max(100),
  authorEmail: z.string().email().max(254),
  authorPhone: z.string().max(20).optional(),
  authorBio: z.string().max(500).optional(),
  bookTitle: z.string().min(2).max(200),
  bookSummary: z.string().min(50).max(3000),
  bookLanguage: z.string().min(2).max(10),
  bookCategory: z.string().max(100).optional(),
  fileUrl: z.string().url().optional(),
  coverUrl: z.string().url().optional(),
  allowFreeDownload: z.boolean().default(false),
  // Honeypot
  website: z.literal("").optional(),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;

export const draftSubmissionSchema = z.object({
  authorName: z.string().max(100).optional(),
  authorEmail: z.union([z.string().email().max(254), z.literal("")]).optional(),
  authorPhone: z.string().max(20).optional(),
  authorBio: z.string().max(500).optional(),
  bookTitle: z.string().max(200).optional(),
  bookSummary: z.string().max(3000).optional(),
  bookLanguage: z.string().max(10).optional(),
  bookCategory: z.string().max(100).optional(),
  fileUrl: z.string().url().optional().or(z.literal("")),
  coverUrl: z.string().url().optional().or(z.literal("")),
  allowFreeDownload: z.boolean().optional(),
  currentStep: z.number().int().min(0).max(2).optional(),
});

export type DraftSubmissionInput = z.infer<typeof draftSubmissionSchema>;

export const claimDraftSchema = z.object({
  draftToken: z.string().min(16),
});

export const STEP_REQUIRED_FIELDS: Record<number, (keyof DraftSubmissionInput)[]> = {
  0: ["authorName", "authorEmail"],
  1: ["bookTitle", "bookSummary", "bookLanguage"],
};

export function stepRequiredFieldsComplete(
  step: number,
  values: DraftSubmissionInput,
): boolean {
  const fields = STEP_REQUIRED_FIELDS[step];
  if (!fields) return false;
  return fields.every((field) => {
    const val = values[field];
    if (typeof val === "string") return val.trim().length > 0;
    return val !== undefined && val !== null;
  });
}
