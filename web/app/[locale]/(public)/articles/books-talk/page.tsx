import { redirect } from "next/navigation";
import { localeHref } from "@/lib/i18n/href";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function BooksTalkRedirect({ params }: Props) {
  const { locale } = await params;
  redirect(localeHref(locale, "/media/books-talk"));
}
