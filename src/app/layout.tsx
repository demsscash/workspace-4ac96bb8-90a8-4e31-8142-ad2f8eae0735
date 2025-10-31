import type { Metadata } from "next";
import "./globals.css";

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-gray-50 font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
