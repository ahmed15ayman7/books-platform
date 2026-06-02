import { AuthorSubmissionsClient } from "@/components/auth/author-submissions-client";

export default async function AuthorSubmissionsPage() {
  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <AuthorSubmissionsClient />
    </div>
  );
}
