import { db } from "@/lib/db";

export const ReferralService = {
  async trackClick(code: string, meta: { ipAddress?: string; userAgent?: string; referer?: string }) {
    const link = await db.referralLink.findUnique({ where: { code } });
    if (!link || !link.isActive) return;

    // Increment click count
    await db.referralLink.update({
      where: { id: link.id },
      data: { clickCount: { increment: 1 } },
    });

    // Log the click
    await db.referralClick.create({
      data: {
        linkId: link.id,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        referer: meta.referer,
      },
    });
  },

  async createCommission(orderId: string, referralCode: string) {
    const link = await db.referralLink.findUnique({
      where: { code: referralCode },
      include: { ambassador: true },
    });

    if (!link || !link.ambassador) return;

    const order = await db.order.findUnique({ where: { id: orderId }, select: { total: true } });
    if (!order) return;

    const rate = Number(link.ambassador.commissionRate) / 100;
    const amount = Number(order.total) * rate;

    await db.commission.create({
      data: {
        ambassadorId: link.ambassadorId,
        orderId,
        linkId: link.id,
        amount,
        rate: link.ambassador.commissionRate,
        status: "PENDING",
      },
    });

    // Increment conversion count
    await db.referralLink.update({
      where: { id: link.id },
      data: { conversionCount: { increment: 1 } },
    });
  },
};
