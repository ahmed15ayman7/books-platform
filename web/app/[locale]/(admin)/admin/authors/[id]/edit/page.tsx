"use client";

import { useParams } from "next/navigation";
import { AuthorEditForm } from "@/components/admin/forms/author-edit-form";

export default function AdminAuthorEditPage() {
  const params = useParams<{ locale?: string; id: string }>();
  const locale = params.locale ?? "ar";
  return <AuthorEditForm locale={locale} id={params.id} />;
}
