"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminInput } from "@/components/admin/admin-form-field";
import { adminAutocompleteListClass } from "@/lib/admin/dropdown-styles";
import { adminToast } from "@/lib/admin/admin-toast";

export interface BookPickerItem {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  imageUrl: string | null;
}

interface BookMultiPickerProps {
  value: string[];
  selectedBooks: BookPickerItem[];
  onChange: (ids: string[], books: BookPickerItem[]) => void;
  max?: number;
  label?: string;
  placeholder?: string;
}

export function BookMultiPicker({
  value,
  selectedBooks,
  onChange,
  max = 10,
  label = "الكتب المرتبطة",
  placeholder = "ابحث عن كتاب بالاسم...",
}: BookMultiPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookPickerItem[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const q = new URLSearchParams({ search: term.trim(), limit: "8" });
      const res = await fetch(`/api/v1/admin/books?${q}`, { headers: adminAuthHeaders() });
      const data = (await res.json()) as { success: boolean; data?: BookPickerItem[] };
      if (data.success && data.data) {
        setResults(data.data.filter((b) => !value.includes(b.id)));
      }
    } finally {
      setLoading(false);
    }
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => void search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  function addBook(book: BookPickerItem) {
    if (value.length >= max) {
      adminToast.error(`الحد الأقصى ${max} كتب`);
      return;
    }
    onChange([...value, book.id], [...selectedBooks, book]);
    setQuery("");
    setResults([]);
  }

  function removeBook(id: string) {
    onChange(
      value.filter((v) => v !== id),
      selectedBooks.filter((b) => b.id !== id),
    );
  }

  return (
    <div className="space-y-3">
      <AdminInput
        label={label}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
      />
      {loading && <p className="text-xs text-[var(--admin-text-muted)]">جاري البحث...</p>}
      {results.length > 0 && (
        <ul className={adminAutocompleteListClass}>
          {results.map((book) => (
            <li key={book.id}>
              <button
                type="button"
                onClick={() => addBook(book)}
                className="flex w-full items-center gap-3 bg-white px-3 py-2 text-start text-sm text-[var(--brand-gray-900)] hover:bg-[var(--brand-gray-100)]"
              >
                <div className="relative h-10 w-8 shrink-0 overflow-hidden rounded bg-[var(--admin-surface-muted)]">
                  {book.imageUrl ? (
                    <Image src={book.imageUrl} alt="" fill className="object-cover" sizes="32px" />
                  ) : null}
                </div>
                <span className="truncate">{book.nameAr ?? book.nameEn}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {selectedBooks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedBooks.map((book) => (
            <span
              key={book.id}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] px-3 py-1 text-xs"
            >
              {book.nameAr ?? book.nameEn}
              <button
                type="button"
                onClick={() => removeBook(book.id)}
                className="text-[var(--admin-text-muted)] hover:text-[var(--error)]"
                aria-label="إزالة"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
