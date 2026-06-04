"use client";

import { useParams } from "next/navigation";
import { PublisherEditForm } from "@/components/admin/forms/publisher-edit-form";

export default function AdminPublisherNewPage() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  return <PublisherEditForm locale={locale} id="new" />;
}
