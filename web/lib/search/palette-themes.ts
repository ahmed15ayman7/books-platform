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
  panel: "border-[var(--brand-gray-200)] bg-white",
  panelShadow: "shadow-[0_24px_64px_rgba(15,23,42,0.14)]",
  header: "border-[var(--brand-gray-200)] bg-white",
  input: "text-[var(--brand-gray-900)]",
  inputPlaceholder: "placeholder:text-[var(--brand-gray-500)]",
  icon: "text-[var(--brand-gray-500)]",
  kbd: "border-[var(--brand-gray-200)] bg-[var(--brand-gray-100)] text-[var(--brand-gray-500)]",
  closeBtn:
    "text-[var(--brand-gray-500)] hover:bg-[var(--brand-gray-100)] hover:text-[var(--brand-gray-900)]",
  section: "border-[var(--brand-gray-200)] bg-[var(--brand-gray-50)]",
  sectionHeader: "border-[var(--brand-gray-200)]",
  sectionTitle: "text-[var(--brand-gray-900)]",
  sectionBadge: "bg-white text-[var(--brand-gray-500)]",
  sectionIcon: "text-[var(--brand-red)]",
  itemHover: "hover:bg-[var(--brand-gray-100)]",
  itemTitle: "text-[var(--brand-gray-900)]",
  itemSubtitle: "text-[var(--brand-gray-500)]",
  thumb: "border-[var(--brand-gray-200)] bg-white",
  thumbIcon: "text-[var(--brand-gray-500)]",
  divider: "divide-[var(--brand-gray-200)]",
  footer: "border-[var(--brand-gray-200)] text-[var(--brand-gray-500)]",
  empty: "text-[var(--brand-gray-500)]",
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
