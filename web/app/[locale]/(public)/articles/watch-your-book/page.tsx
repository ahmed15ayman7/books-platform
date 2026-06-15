import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ locale: string }>;
}

/** Legacy channel removed — send users to the media hub. */
export default async function LegacyWatchYourBookArticlePage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/media`);
}
