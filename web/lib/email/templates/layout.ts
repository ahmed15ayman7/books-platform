import { absoluteUrl } from "@/lib/seo/site";

const BRAND_RED = "#c0392b";
const BRAND_DARK = "#1a1a2e";
const BRAND_GRAY = "#6b7280";
const BRAND_BG = "#f8f9fa";
const BORDER = "#e5e7eb";

export interface LayoutOptions {
  locale?: string;
  manageToken?: string;
  /** Pre-rendered body HTML to inject inside the content area */
  bodyHtml: string;
  preheader?: string;
}

function footerLinks(locale: string, manageToken?: string): string {
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const manageHref = manageToken
    ? absoluteUrl(`/ar/newsletter/preferences?token=${manageToken}`)
    : absoluteUrl("/ar/newsletter/preferences");

  const unsubHref = manageToken
    ? absoluteUrl(`/api/v1/newsletter/unsubscribe?token=${manageToken}`)
    : "#";

  const manageLabel = isAr ? "إدارة تفضيلاتك" : "Manage preferences";
  const unsubLabel = isAr ? "إلغاء الاشتراك" : "Unsubscribe";
  const privacyLabel = isAr ? "سياسة الخصوصية" : "Privacy policy";
  const siteLabel = isAr ? "زيارة الموقع" : "Visit website";

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" dir="${dir}" style="margin-top:32px;border-top:1px solid ${BORDER};padding-top:24px;">
      <tr>
        <td align="center" style="padding:0 16px;">
          <p style="margin:0 0 12px 0;font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:${BRAND_GRAY};text-align:center;">
            <a href="${manageHref}" style="color:${BRAND_RED};text-decoration:none;">${manageLabel}</a>
            &nbsp;&bull;&nbsp;
            <a href="${unsubHref}" style="color:${BRAND_GRAY};text-decoration:none;">${unsubLabel}</a>
            &nbsp;&bull;&nbsp;
            <a href="${absoluteUrl("/ar/privacy")}" style="color:${BRAND_GRAY};text-decoration:none;">${privacyLabel}</a>
            &nbsp;&bull;&nbsp;
            <a href="${absoluteUrl("/ar")}" style="color:${BRAND_GRAY};text-decoration:none;">${siteLabel}</a>
          </p>
          <p style="margin:0;font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:${BRAND_GRAY};text-align:center;">
            © ${new Date().getFullYear()} منصة الكتب العالمية — Books Platform
          </p>
        </td>
      </tr>
    </table>`;
}

export function wrapLayout(options: LayoutOptions): string {
  const { locale = "ar", manageToken, bodyHtml, preheader } = options;
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";
  const fontFamily = "'Segoe UI', Tahoma, Arial, sans-serif";

  const logoUrl = absoluteUrl("/logo.png");

  return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>منصة الكتب العالمية</title>
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${BRAND_BG};font-family:${fontFamily};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>` : ""}
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND_BG}">
    <tr>
      <td align="center" style="padding:24px 16px 48px 16px;">
        <!-- Email container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:${BRAND_DARK};padding:24px 32px;text-align:center;">
              <a href="${absoluteUrl("/ar")}" style="text-decoration:none;">
                <img src="${logoUrl}" alt="منصة الكتب العالمية" width="160" height="40"
                  style="display:inline-block;height:40px;width:auto;max-width:160px;" />
              </a>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td dir="${dir}" style="padding:32px 32px 24px 32px;color:${BRAND_DARK};">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 32px 32px 32px;">
              ${footerLinks(locale, manageToken)}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
