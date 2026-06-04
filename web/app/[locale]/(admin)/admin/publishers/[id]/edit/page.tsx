"use client";

import { useParams } from "next/navigation";
import { PublisherEditForm } from "@/components/admin/forms/publisher-edit-form";

export default function AdminPublisherEditPage() {
  const params = useParams<{ locale?: string; id: string }>();
  const locale = params.locale ?? "ar";
  return <PublisherEditForm locale={locale} id={params.id} />;
}
