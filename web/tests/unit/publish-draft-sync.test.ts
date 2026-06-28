import { describe, it, expect } from "vitest";
import {
  canSyncDraftToServer,
  stepRequiredFieldsComplete,
  type DraftSubmissionInput,
} from "@/lib/validation/submission.schema";

const step0Complete: DraftSubmissionInput = {
  authorName: "أحمد",
  authorEmail: "author@example.com",
};

const step1Complete: DraftSubmissionInput = {
  ...step0Complete,
  bookTitle: "كتاب تجريبي",
  bookSummary: "ملخص يتجاوز الحد الأدنى للنص المطلوب في النموذج.",
  bookLanguage: "ar",
};

describe("canSyncDraftToServer", () => {
  it("syncs when step 0 required fields are complete", () => {
    expect(canSyncDraftToServer(0, step0Complete)).toBe(true);
  });

  it("syncs on step 1 when only step 0 is complete (draft for cover upload)", () => {
    expect(canSyncDraftToServer(1, step0Complete)).toBe(true);
  });

  it("syncs on step 1 when step 1 fields are complete", () => {
    expect(canSyncDraftToServer(1, step1Complete)).toBe(true);
  });

  it("does not sync when step 0 is incomplete", () => {
    expect(
      canSyncDraftToServer(1, {
        authorName: "",
        authorEmail: "author@example.com",
      }),
    ).toBe(false);
  });

  it("does not sync on step 2 without prior steps", () => {
    expect(canSyncDraftToServer(2, {})).toBe(false);
  });
});

describe("stepRequiredFieldsComplete", () => {
  it("requires author name and email on step 0", () => {
    expect(stepRequiredFieldsComplete(0, step0Complete)).toBe(true);
    expect(
      stepRequiredFieldsComplete(0, { authorName: "x", authorEmail: "" }),
    ).toBe(false);
  });

  it("requires book fields on step 1", () => {
    expect(stepRequiredFieldsComplete(1, step1Complete)).toBe(true);
    expect(
      stepRequiredFieldsComplete(1, {
        ...step0Complete,
        bookTitle: "title",
        bookSummary: "",
        bookLanguage: "ar",
      }),
    ).toBe(false);
  });
});
