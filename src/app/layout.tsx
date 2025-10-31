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

        {/* Headless UI CDN for modern UI components */}
        <script src="https://unpkg.com/@headlessui/react@latest/dist/headlessui.prod.js" async />

        {/* Font Awesome CDN for icons */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

        {/* Google Fonts for modern typography */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

        {/* AOS Animation Library */}
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js" async />

        {/* Chart.js for beautiful charts */}
        <script src="https://cdn.jsdelivr.net/npm/chart.js" async />

        {/* Alpine.js for reactive components */}
        <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" />

        {/* Custom favicon and meta tags */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 font-sans antialiased" style={{ fontFamily: 'Inter, system-ui, sans-serif' }} suppressHydrationWarning>
        {children}

        {/* Initialize AOS animations */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if (typeof AOS !== 'undefined') {
              AOS.init({
                duration: 800,
                once: true,
                offset: 100
              });
            }
          `
        }} />
      </body>
    </html>
  );
}
