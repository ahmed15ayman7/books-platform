import { z } from "zod";

export const addToWishlistSchema = z.object({
  email: z.string().email().max(254),
  productId: z.string().cuid(),
});

export const removeWishlistItemSchema = z.object({
  accessToken: z.string().min(1),
});

export const subscribeNewsletterSchema = z.object({
  email: z.string().email().max(254),
  locale: z.enum(["ar", "en"]).default("ar"),
  source: z.string().max(50).optional(),
});

export type AddToWishlistInput = z.infer<typeof addToWishlistSchema>;
export type SubscribeNewsletterInput = z.infer<typeof subscribeNewsletterSchema>;
