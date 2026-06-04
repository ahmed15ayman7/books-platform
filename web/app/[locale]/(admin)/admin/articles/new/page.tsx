"use client";

import { useParams, useSearchParams } from "next/navigation";
import { ArticleEditForm } from "@/components/admin/forms/article-edit-form";

export default function AdminArticleNewPage() {
  const params = useParams<{ locale?: string }>();
  const searchParams = useSearchParams();
  const locale = params.locale ?? "ar";
  const initialBookId = searchParams.get("bookId") ?? undefined;
  return <ArticleEditForm locale={locale} id="new" initialBookId={initialBookId} />;
}
