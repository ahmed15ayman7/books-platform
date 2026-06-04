"use client";

import { useParams } from "next/navigation";
import { MediaEditForm } from "@/components/admin/forms/media-edit-form";

export default function AdminMediaNewPage() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  return <MediaEditForm locale={locale} id="new" />;
}
