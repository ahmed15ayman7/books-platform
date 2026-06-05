export interface SearchPaletteTheme {
  panel: string;
  panelShadow: string;
  header: string;
  input: string;
  inputPlaceholder: string;
  icon: string;
  kbd: string;
  closeBtn: string;
  section: string;
  sectionHeader: string;
  sectionTitle: string;
  sectionBadge: string;
  sectionIcon: string;
  itemHover: string;
  itemTitle: string;
  itemSubtitle: string;
  thumb: string;
  thumbIcon: string;
  divider: string;
  footer: string;
  empty: string;
  overlay: string;
}

export const adminSearchTheme: SearchPaletteTheme = {
  panel: "border-[var(--admin-border)] bg-[var(--admin-surface)]",
  panelShadow: "shadow-[0_24px_64px_rgba(15,23,42,0.14)]",
  header: "border-[var(--admin-border)] bg-[var(--admin-surface)]",
  input: "text-[var(--admin-text)]",
  inputPlaceholder: "placeholder:text-[var(--admin-text-subtle)]",
  icon: "text-[var(--admin-text-subtle)]",
  kbd: "border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-text-subtle)]",
  closeBtn:
    "text-[var(--admin-text-subtle)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)]",
  section: "border-[var(--admin-border)] bg-[var(--admin-surface-muted)]/60",
  sectionHeader: "border-[var(--admin-border)]",
  sectionTitle: "text-[var(--admin-text)]",
  sectionBadge: "bg-[var(--admin-surface)] text-[var(--admin-text-subtle)]",
  sectionIcon: "text-[var(--admin-accent)]",
  itemHover: "hover:bg-[var(--admin-hover)]",
  itemTitle: "text-[var(--admin-text)]",
  itemSubtitle: "text-[var(--admin-text-subtle)]",
  thumb: "border-[var(--admin-border)] bg-[var(--admin-surface-muted)]",
  thumbIcon: "text-[var(--admin-text-subtle)]",
  divider: "divide-[var(--admin-border)]/70",
  footer: "border-[var(--admin-border)] text-[var(--admin-text-subtle)]",
  empty: "text-[var(--admin-text-subtle)]",
  overlay: "bg-slate-900/25 backdrop-blur-[3px]",
};

export const publicSearchTheme: SearchPaletteTheme = {
  panel: "border-[var(--brand-gray-200)] bg-white",
  panelShadow: "shadow-[0_24px_64px_rgba(15,23,42,0.16)]",
  header: "border-[var(--brand-gray-200)] bg-white",
  input: "text-[var(--brand-gray-900)]",
  inputPlaceholder: "placeholder:text-[var(--brand-gray-400)]",
  icon: "text-[var(--brand-gray-500)]",
  kbd: "border-[var(--brand-gray-200)] bg-[var(--brand-gray-50)] text-[var(--brand-gray-500)]",
  closeBtn:
    "text-[var(--brand-gray-500)] hover:bg-[var(--brand-gray-100)] hover:text-[var(--brand-gray-900)]",
  section: "border-[var(--brand-gray-200)] bg-[var(--brand-gray-50)]/80",
  sectionHeader: "border-[var(--brand-gray-200)]",
  sectionTitle: "text-[var(--brand-gray-900)]",
  sectionBadge: "bg-white text-[var(--brand-gray-500)]",
  sectionIcon: "text-[var(--brand-red)]",
  itemHover: "hover:bg-white",
  itemTitle: "text-[var(--brand-gray-900)]",
  itemSubtitle: "text-[var(--brand-gray-500)]",
  thumb: "border-[var(--brand-gray-200)] bg-white",
  thumbIcon: "text-[var(--brand-gray-400)]",
  divider: "divide-[var(--brand-gray-200)]",
  footer: "border-[var(--brand-gray-200)] text-[var(--brand-gray-500)]",
  empty: "text-[var(--brand-gray-500)]",
  overlay: "bg-[var(--brand-black)]/40 backdrop-blur-[4px]",
};
