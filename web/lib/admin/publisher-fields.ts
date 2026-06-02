/** Sync legacy `title` column used in search and old imports. */
export function syncPublisherTitle(name: string, nameAr: string): string {
  const ar = nameAr.trim();
  const en = name.trim();
  return ar || en || "Publisher";
}

export interface PublisherBilingualInput {
  name: string;
  nameAr: string;
  content?: string;
  contentAr?: string;
}

export function publisherBilingualDbData(input: PublisherBilingualInput) {
  const name = input.name.trim();
  const nameAr = input.nameAr.trim();
  const title = syncPublisherTitle(name, nameAr);
  return {
    name,
    nameAr: nameAr || null,
    title,
    content: input.content?.trim() || null,
    contentAr: input.contentAr?.trim() || null,
  };
}
