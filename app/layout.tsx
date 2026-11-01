import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tandai Tuntas — Ruang untuk hal penting",
  description: "Kelola tugas dan produksi video kreatif, dari ide hingga tayang.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
