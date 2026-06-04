"use client";

import { useParams, useSearchParams } from "next/navigation";
import { ArticleEditForm } from "@/components/admin/forms/article-edit-form";

export default function AdminArticleEditPage() {
  const params = useParams<{ locale?: string; id: string }>();
  const searchParams = useSearchParams();
  const locale = params.locale ?? "ar";
  const id = params.id;
  const initialBookId = searchParams.get("bookId") ?? undefined;

  return <ArticleEditForm locale={locale} id={id} initialBookId={initialBookId} />;
}
