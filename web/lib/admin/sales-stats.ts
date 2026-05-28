import { db } from "@/lib/db";

export type SalesPoint = {
  date: string;
  revenue: number;
  discount: number;
  orders: number;
};

export type SalesSeries = {
  points: SalesPoint[];
  totals: {
    revenue: number;
    discount: number;
    orders: number;
  };
  currency: string;
};

type RawRow = {
  bucket: Date;
  revenue: string;
  discount: string;
  orders: bigint;
};

export async function getDailySalesSeries(days = 30): Promise<SalesSeries> {
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (days - 1));

  const rows = await db.$queryRaw<RawRow[]>`
    SELECT
      date_trunc('day', paid_at) AS bucket,
      COALESCE(SUM(total), 0)::text AS revenue,
      COALESCE(SUM(discount), 0)::text AS discount,
      COUNT(*)::bigint AS orders
    FROM orders
    WHERE paid_at IS NOT NULL
      AND paid_at >= ${since}
    GROUP BY bucket
    ORDER BY bucket ASC
  `;

  const byDate = new Map<string, SalesPoint>();
  for (const r of rows) {
    const key = r.bucket.toISOString().slice(0, 10);
    byDate.set(key, {
      date: key,
      revenue: Number(r.revenue),
      discount: Number(r.discount),
      orders: Number(r.orders),
    });
  }

  const points: SalesPoint[] = [];
  const totals = { revenue: 0, discount: 0, orders: 0 };
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setUTCDate(d.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    const point = byDate.get(key) ?? { date: key, revenue: 0, discount: 0, orders: 0 };
    points.push(point);
    totals.revenue += point.revenue;
    totals.discount += point.discount;
    totals.orders += point.orders;
  }

  return { points, totals, currency: "EGP" };
}
