"use client";

import { EntityMarketingDialog } from "@/components/share/entity-marketing-dialog";

interface BookMarketingDialogProps {
  bookTitle: string;
  publicUrl: string;
  imageUrl?: string | null;
}

export function BookMarketingDialog({ bookTitle, publicUrl, imageUrl }: BookMarketingDialogProps) {
  return (
    <EntityMarketingDialog
      entityType="book"
      title={bookTitle}
      publicUrl={publicUrl}
      imageUrl={imageUrl}
    />
  );
}
