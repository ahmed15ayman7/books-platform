import { z } from "zod";
import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiCreated, ApiErrors } from "@/lib/api-client/response";

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  topic: z.enum(["general", "publish", "partnership", "support"]).default("general"),
  subject: z.string().max(200).optional(),
  message: z.string().min(20).max(5000),
  locale: z.enum(["ar", "en"]).optional(),
  website: z.string().max(0).optional(),
});

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(ip)) return ApiErrors.rateLimited();

    const body = await request.json() as unknown;
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);
    if (parsed.data.website) return apiCreated({ ok: true });

    const msg = await db.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        topic: parsed.data.topic,
        subject: parsed.data.subject ?? null,
        message: parsed.data.message,
        locale: parsed.data.locale ?? null,
      },
    });

    return apiCreated({ id: msg.id });
  } catch (error) {
    console.error("[POST /api/v1/contact]", error);
    return ApiErrors.internal();
  }
}
