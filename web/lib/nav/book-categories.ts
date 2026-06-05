/** Seven book categories — order matches booksplatform.net legacy nav */
export const BOOK_CATEGORY_LABELS_AR = [
  "تقنيات وعلوم",
  "دراسات اجتماعية",
  "لغات وآداب",
  "فلسفات وثقافات",
  "أديان وعقائد",
  "اقتصاد وتنمية",
  "أفكار وسياسات",
  "اخرى"
] as const;

export type BookCategoryLabelAr = (typeof BOOK_CATEGORY_LABELS_AR)[number];

/** English labels aligned with legacy site */
export const BOOK_CATEGORY_LABELS_EN: Record<BookCategoryLabelAr, string> = {
  "تقنيات وعلوم": "Tech & Science",
  "دراسات اجتماعية": "Social Studies",
  "لغات وآداب": "Languages & Literature",
  "فلسفات وثقافات": "Philosophy & Culture",
  "أديان وعقائد": "Religions & Beliefs",
  "اقتصاد وتنمية": "Economy & Development",
  "أفكار وسياسات": "Ideas & Politics",
  "اخري":"Other"
};
