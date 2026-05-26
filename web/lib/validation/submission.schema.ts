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
