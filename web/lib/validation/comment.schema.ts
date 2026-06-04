import { z } from "zod";

const optionalEmailSchema = z.preprocess(
  (val) => {
    if (val === undefined || val === null) return undefined;
    if (typeof val === "string" && val.trim() === "") return undefined;
    return val;
  },
  z.string().email().max(254).optional(),
);

export const createCommentSchema = z.object({
  authorName: z.string().trim().min(2).max(100),
  email: optionalEmailSchema,
  content: z.string().trim().min(5).max(2000),
  productId: z.string().cuid().optional(),
  articleId: z.string().cuid().optional(),
  parentId: z.string().cuid().optional(),
  // Honeypot field — must be empty
  website: z.literal("").optional(),
}).refine((data) => data.productId ?? data.articleId, {
  message: "Either productId or articleId is required",
});

export const createRatingSchema = z.object({
  productId: z.string().cuid(),
  email: z.string().email().max(254),
  stars: z.number().int().min(1).max(5),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CreateRatingInput = z.infer<typeof createRatingSchema>;
