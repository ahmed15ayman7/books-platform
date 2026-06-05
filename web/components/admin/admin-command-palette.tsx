"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";
import { GlobalSearchPalette } from "@/components/search/global-search-palette";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { useAdminChrome } from "@/lib/admin/admin-chrome-context";
import { mapAdminSearchSections, type GlobalSearchPayload } from "@/lib/search/map-search-sections";
import { adminSearchTheme } from "@/lib/search/palette-themes";
import { modKeyLabel } from "@/lib/search/shortcut-labels";

export function AdminCommandPalette() {
  const { searchOpen, closeSearch } = useAdminChrome();
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";

  const fetchResults = useCallback(
    async (query: string, signal: AbortSignal) => {
      const res = await fetch(`/api/v1/admin/search?q=${encodeURIComponent(query)}`, {
        headers: adminAuthHeaders(),
        signal,
      });
      const json = (await res.json()) as { success: boolean; data?: GlobalSearchPayload };
      if (!res.ok || !json.success || !json.data) return [];
      return mapAdminSearchSections(json.data, locale);
    },
    [locale],
  );

  return (
    <GlobalSearchPalette
      open={searchOpen}
      onClose={closeSearch}
      theme={adminSearchTheme}
      topClassName="top-[max(4.5rem,8vh)]"
      modKeyLabel={modKeyLabel()}
      placeholder="ابحث عن كتاب، مقال، ميديا، ناشر، مؤلف..."
      emptyHint="اكتب حرفين على الأقل للبحث في كل أقسام لوحة التحكم"
      noResultsHint={(q) => `لا توجد نتائج لـ «${q}»`}
      ariaLabel="بحث لوحة التحكم"
      fetchResults={fetchResults}
      footer={
        <>
          <span>
            <kbd className="rounded border border-[var(--admin-border)] px-1">{modKeyLabel()}S</kbd>{" "}
            حفظ
          </span>
          <span>
            <kbd className="rounded border border-[var(--admin-border)] px-1">{modKeyLabel()}D</kbd>{" "}
            مسودة
          </span>
          <span>
            <kbd className="rounded border border-[var(--admin-border)] px-1">Esc</kbd> إغلاق
          </span>
        </>
      }
    />
  );
}
