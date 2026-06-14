// Root layout — passes through to [locale]/layout.tsx which owns all <html> and metadata.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
