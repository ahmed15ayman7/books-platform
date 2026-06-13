import type { Metadata } from "next";
import { AuthorSubmissionsClient } from "@/components/auth/author-submissions-client";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AuthorSubmissionsPage() {
  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <AuthorSubmissionsClient />
    </div>
  );
}
