import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "ERP Scolaire Mauritanie",
  description: "Système de gestion scolaire moderne adapté au contexte mauritanien avec support bilingue français/arabe.",
  keywords: ["ERP", "scolaire", "Mauritanie", "éducation", "gestion", "écoles", "Next.js", "TypeScript"],
  authors: [{ name: "ERP Scolaire Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ERP Scolaire Mauritanie",
    description: "Système de gestion scolaire moderne pour les établissements mauritaniens",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ERP Scolaire Mauritanie",
    description: "Système de gestion scolaire moderne pour les établissements mauritaniens",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-gray-900">
        {children}
        <Toaster />
      </body>
    </html>
  );
}