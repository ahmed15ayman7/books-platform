import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { robots: { index: false, follow: false } };

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function BooksTalkRedirect({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/media/books-talk`);
}
