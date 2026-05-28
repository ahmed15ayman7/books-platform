"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import type { SalesPoint, SalesSeries } from "@/lib/admin/sales-stats";

const COLORS = {
  revenue: "#b11e2e",
  discount: "#f59e0b",
  orders: "#3b82f6",
  grid: "#262626",
  axis: "#6b6b6b",
};

interface Props {
  data: SalesSeries;
}

const dayFmt = new Intl.DateTimeFormat("ar-EG", { month: "short", day: "numeric" });
const fullDateFmt = new Intl.DateTimeFormat("ar-EG", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});
const numFmt = new Intl.NumberFormat("ar-EG");

function formatCurrency(value: number, currency: string) {
  return `${numFmt.format(Math.round(value))} ${currency}`;
}

function ChartTooltip({
  active,
  payload,
  label,
  currency,
}: TooltipContentProps & { currency: string }) {
  if (!active || !payload?.length || !label) return null;
  const point = payload[0]?.payload as SalesPoint | undefined;
  if (!point) return null;

  return (
    <div className="rounded-lg border border-[var(--brand-gray-700)] bg-[var(--brand-gray-900)] px-3 py-2 text-xs shadow-xl">
      <p className="mb-1.5 font-medium text-white">
        {fullDateFmt.format(new Date(label))}
      </p>
      <div className="space-y-1">
        <p className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-[var(--brand-gray-300)]">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: COLORS.revenue }}
            />
            الإيرادات
          </span>
          <span className="font-mono font-semibold text-white">
            {formatCurrency(point.revenue, currency)}
          </span>
        </p>
        <p className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-[var(--brand-gray-300)]">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: COLORS.discount }}
            />
            الخصومات
          </span>
          <span className="font-mono font-semibold text-white">
            {formatCurrency(point.discount, currency)}
          </span>
        </p>
        <p className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-[var(--brand-gray-300)]">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: COLORS.orders }}
            />
            الطلبات
          </span>
          <span className="font-mono font-semibold text-white">
            {numFmt.format(point.orders)}
          </span>
        </p>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--brand-gray-400)]">
      <span className="flex items-center gap-1.5">
        <span
          className="inline-block h-2.5 w-2.5 rounded-sm"
          style={{ background: COLORS.revenue }}
        />
        الإيرادات
      </span>
      <span className="flex items-center gap-1.5">
        <span
          className="inline-block h-2.5 w-2.5 rounded-sm"
          style={{ background: COLORS.discount }}
        />
        الخصومات
      </span>
      <span className="flex items-center gap-1.5">
        <span
          className="inline-block h-2.5 w-2.5 rounded-sm"
          style={{ background: COLORS.orders }}
        />
        الطلبات
      </span>
    </div>
  );
}

export function SalesAreaChart({ data }: Props) {
  const { points, totals, currency } = data;

  const hasData = useMemo(
    () => points.some((p) => p.revenue > 0 || p.orders > 0),
    [points],
  );

  return (
    <div className="rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)] p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">
            المبيعات والإيرادات
          </h2>
          <p className="mt-0.5 text-xs text-[var(--brand-gray-500)]">
            آخر {numFmt.format(points.length)} يوم
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[var(--brand-gray-500)]">
              إجمالي الإيرادات
            </p>
            <p className="mt-0.5 font-mono text-sm font-bold text-white">
              {formatCurrency(totals.revenue, currency)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[var(--brand-gray-500)]">
              الخصومات
            </p>
            <p className="mt-0.5 font-mono text-sm font-bold text-[#f59e0b]">
              {formatCurrency(totals.discount, currency)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[var(--brand-gray-500)]">
              عدد الطلبات
            </p>
            <p className="mt-0.5 font-mono text-sm font-bold text-white">
              {numFmt.format(totals.orders)}
            </p>
          </div>
        </div>
      </div>

      {hasData ? (
        <>
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={points}
                margin={{ top: 8, right: 12, left: 12, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="sales-revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.revenue} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={COLORS.revenue} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sales-discount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.discount} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={COLORS.discount} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sales-orders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.orders} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={COLORS.orders} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v: string) => dayFmt.format(new Date(v))}
                  tick={{ fill: COLORS.axis, fontSize: 11 }}
                  axisLine={{ stroke: COLORS.grid }}
                  tickLine={false}
                  minTickGap={20}
                />
                <YAxis
                  yAxisId="currency"
                  tick={{ fill: COLORS.axis, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => numFmt.format(v)}
                  width={48}
                />
                <YAxis
                  yAxisId="orders"
                  orientation="right"
                  tick={{ fill: COLORS.axis, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => numFmt.format(v)}
                  width={32}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ stroke: COLORS.grid, strokeWidth: 1 }}
                  content={(props) => <ChartTooltip {...props} currency={currency} />}
                />
                <Area
                  yAxisId="currency"
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.revenue}
                  strokeWidth={2}
                  fill="url(#sales-revenue)"
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
                <Area
                  yAxisId="currency"
                  type="monotone"
                  dataKey="discount"
                  stroke={COLORS.discount}
                  strokeWidth={1.5}
                  fill="url(#sales-discount)"
                  activeDot={{ r: 3, strokeWidth: 0 }}
                />
                <Area
                  yAxisId="orders"
                  type="monotone"
                  dataKey="orders"
                  stroke={COLORS.orders}
                  strokeWidth={1.5}
                  fill="url(#sales-orders)"
                  activeDot={{ r: 3, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3">
            <Legend />
          </div>
        </>
      ) : (
        <div className="flex h-72 flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-[var(--brand-gray-400)]">لا توجد بيانات مبيعات بعد</p>
          <p className="text-xs text-[var(--brand-gray-600)]">
            سيظهر الرسم البياني تلقائياً عند تسجيل أول طلب مدفوع
          </p>
        </div>
      )}
    </div>
  );
}
