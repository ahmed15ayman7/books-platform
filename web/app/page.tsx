import { redirect } from "next/navigation";

// The proxy middleware rewrites / to /ar, so this is a safety fallback only.
export default function RootPage() {
  redirect("/ar");
}
