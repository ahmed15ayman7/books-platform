import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { db } from "@/lib/db";

export interface MailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

interface SendResult {
  sent: number;
  failed: number;
}

let _transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (_transporter) return _transporter;

  const host = process.env["SMTP_HOST"];
  const user = process.env["SMTP_USER"];
  const pass = process.env["SMTP_PASSWORD"];

  if (!host || !user || !pass) return null;

  const port = parseInt(process.env["SMTP_PORT"] ?? "465", 10);
  const secure = process.env["SMTP_SECURE"] !== "false";

  _transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: { rejectUnauthorized: process.env["NODE_ENV"] === "production" },
  });

  return _transporter;
}

function getFromAddress(): string {
  const email = process.env["EMAIL_FROM_EMAIL"] ?? "info@booksplatform.net";
  const name = process.env["EMAIL_FROM_NAME"] ?? "منصة الكتب العالمية";
  return `${name} <${email}>`;
}

/** Send a single email. Returns true on success. */
export async function sendMail(message: MailMessage): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[mailer] SMTP not configured — email skipped:", message.subject);
    return false;
  }

  const to = Array.isArray(message.to) ? message.to.join(", ") : message.to;

  try {
    await transporter.sendMail({
      from: getFromAddress(),
      to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    });
    return true;
  } catch (err) {
    console.error("[mailer] sendMail failed:", err);
    return false;
  }
}

const BATCH_SIZE = 50;

/** Send the same email to many recipients in batches. Logs each batch to NotificationLog. */
export async function sendBulk(
  recipients: string[],
  message: Omit<MailMessage, "to">,
  logContext?: { type: string; productId?: string; articleId?: string },
): Promise<SendResult> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[mailer] SMTP not configured — bulk email skipped:", message.subject);
    return { sent: 0, failed: 0 };
  }

  const from = getFromAddress();
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);
    for (const to of batch) {
      try {
        await transporter.sendMail({
          from,
          to,
          subject: message.subject,
          html: message.html,
          text: message.text,
        });
        sent++;
        if (logContext) {
          await db.notificationLog.create({
            data: {
              type: logContext.type,
              recipient: to,
              subject: message.subject,
              body: message.text ?? message.html.slice(0, 500),
              status: "sent",
              productId: logContext.productId,
              articleId: logContext.articleId,
            },
          }).catch(() => {});
        }
      } catch (err) {
        failed++;
        console.error(`[mailer] Failed to send to ${to}:`, err);
        if (logContext) {
          await db.notificationLog.create({
            data: {
              type: logContext.type,
              recipient: to,
              subject: message.subject,
              body: String(err),
              status: "failed",
              errorMessage: String(err),
              productId: logContext.productId,
              articleId: logContext.articleId,
            },
          }).catch(() => {});
        }
      }
    }
  }

  return { sent, failed };
}

/** Reset cached transporter (useful in tests). */
export function _resetTransporter(): void {
  _transporter = null;
}
