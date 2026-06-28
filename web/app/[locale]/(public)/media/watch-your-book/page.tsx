import type { Metadata } from "next";
import { localeHref } from "@/lib/i18n/href";
import { redirect } from "next/navigation";

export const metadata: Metadata = { robots: { index: false, follow: false } };

interface Props {
  params: Promise<{ locale: string }>;
}

/** Legacy channel removed — send users to the media hub. */
export default async function LegacyWatchYourBookMediaPage({ params }: Props) {
  const { locale } = await params;
  redirect(localeHref(locale, "/media"));
}
