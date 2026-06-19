import { absoluteUrl } from "@/lib/seo/site";
import { wrapLayout } from "./layout";

const BRAND_RED = "#c0392b";
const BRAND_DARK = "#1a1a2e";
const BRAND_GRAY = "#6b7280";

export interface WelcomeEmailData {
  email: string;
  confirmToken: string;
  manageToken: string;
  locale?: string;
}

export function renderWelcomeEmail(data: WelcomeEmailData): { html: string; text: string; subject: string } {
  const { email, confirmToken, manageToken, locale = "ar" } = data;
  const isAr = locale === "ar";

  const confirmUrl = absoluteUrl(`/api/v1/newsletter/confirm?token=${confirmToken}`);

  const subject = isAr
    ? "أكد اشتراكك في نشرة منصة الكتب العالمية"
    : "Confirm your Books Platform newsletter subscription";

  const headline = isAr ? "مرحباً بك في نشرة الكتب!" : "Welcome to the Books Newsletter!";
  const intro = isAr
    ? `شكراً على اشتراكك في نشرة <strong>منصة الكتب العالمية</strong>. اضغط الزر أدناه لتأكيد بريدك الإلكتروني واختيار تفضيلاتك.`
    : `Thank you for subscribing to the <strong>Books Platform</strong> newsletter. Click the button below to confirm your email address and set your content preferences.`;

  const note = isAr
    ? "ستصلك إشعارات الكتب والمقالات الجديدة المتوافقة مع تفضيلاتك التي تختارها."
    : "You'll receive notifications about new books and articles matching your chosen preferences.";

  const confirmLabel = isAr ? "تأكيد الاشتراك واختيار تفضيلاتي" : "Confirm & Choose Preferences";
  const ignoreNote = isAr
    ? "إذا لم تشترك أنت، تجاهل هذا البريد."
    : "If you didn't subscribe, you can safely ignore this email.";

  const bodyHtml = `
    <h1 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:${BRAND_DARK};">${headline}</h1>
    <p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:1.7;">${intro}</p>
    <p style="margin:0 0 28px 0;font-size:14px;color:${BRAND_GRAY};line-height:1.6;">${note}</p>

    <div style="text-align:center;margin-bottom:28px;">
      <a href="${confirmUrl}"
        style="display:inline-block;background:${BRAND_RED};color:#ffffff;font-size:16px;font-weight:700;
               padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:.3px;">
        ${confirmLabel}
      </a>
    </div>

    <p style="margin:0;font-size:12px;color:${BRAND_GRAY};line-height:1.6;">${ignoreNote}</p>
    <p style="margin:8px 0 0 0;font-size:11px;color:#9ca3af;">
      ${isAr ? "البريد الإلكتروني:" : "Email:"} ${email}
    </p>`;

  const html = wrapLayout({ locale, manageToken, bodyHtml, preheader: headline });

  const text = [
    headline,
    "",
    isAr ? "رابط التأكيد:" : "Confirmation link:",
    confirmUrl,
    "",
    ignoreNote,
  ].join("\n");

  return { html, text, subject };
}
