import { describe, it, expect } from "vitest";
import { createCommentSchema, createRatingSchema } from "@/lib/validation/comment.schema";
import { createSubmissionSchema } from "@/lib/validation/submission.schema";
import { addToWishlistSchema } from "@/lib/validation/wishlist.schema";

describe("Comment validation", () => {
  it("accepts valid comment", () => {
    const result = createCommentSchema.safeParse({
      authorName: "John Doe",
      email: "john@example.com",
      content: "Great book! I really enjoyed reading it.",
      productId: "cloez2d8i0000yz9qexampleid1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects comment with no product or article", () => {
    const result = createCommentSchema.safeParse({
      authorName: "John",
      email: "john@example.com",
      content: "Great book!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short content", () => {
    const result = createCommentSchema.safeParse({
      authorName: "John",
      email: "john@example.com",
      content: "ok",
      productId: "cloez2d8i0000yz9qexampleid1",
    });
    expect(result.success).toBe(false);
  });
});

describe("Rating validation", () => {
  it("accepts valid 5-star rating", () => {
    const result = createRatingSchema.safeParse({
      productId: "cloez2d8i0000yz9qexampleid1",
      email: "user@example.com",
      stars: 5,
    });
    expect(result.success).toBe(true);
  });

  it("rejects out-of-range stars", () => {
    const result = createRatingSchema.safeParse({
      productId: "cloez2d8i0000yz9qexampleid1",
      email: "user@example.com",
      stars: 6,
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero stars", () => {
    const result = createRatingSchema.safeParse({
      productId: "cloez2d8i0000yz9qexampleid1",
      email: "user@example.com",
      stars: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe("Submission validation", () => {
  it("accepts valid submission", () => {
    const result = createSubmissionSchema.safeParse({
      authorName: "Ahmed Mohamed",
      authorEmail: "ahmed@example.com",
      bookTitle: "My Book",
      bookSummary: "This is a wonderful book that tells the story of a great adventure and discovery.",
      bookLanguage: "ar",
    });
    expect(result.success).toBe(true);
  });

  it("rejects too-short summary", () => {
    const result = createSubmissionSchema.safeParse({
      authorName: "Ahmed",
      authorEmail: "ahmed@example.com",
      bookTitle: "Book",
      bookSummary: "Short",
      bookLanguage: "ar",
    });
    expect(result.success).toBe(false);
  });
});

describe("Wishlist validation", () => {
  it("accepts valid wishlist item", () => {
    const result = addToWishlistSchema.safeParse({
      email: "user@example.com",
      productId: "cloez2d8i0000yz9qexampleid1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = addToWishlistSchema.safeParse({
      email: "not-an-email",
      productId: "cloez2d8i0000yz9qexampleid1",
    });
    expect(result.success).toBe(false);
  });
});
