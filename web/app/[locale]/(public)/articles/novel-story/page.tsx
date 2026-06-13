import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { robots: { index: false, follow: false } };

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function NovelStoryRedirect({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/media/novel-story`);
}
