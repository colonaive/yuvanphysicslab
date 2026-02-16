import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { colors, typography } from "@/theme/tokens";
import type { CSSProperties } from "react";
import Script from "next/script";
import { themeInitScript } from "@/lib/theme";
import { RouteTracker } from "@/components/site/RouteTracker";
import { BackToTopButton } from "@/components/site/BackToTopButton";

const headingFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["500", "600", "700"],
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yrcphysics.com"),
  title: {
    default: "YRC Physics Lab | Geometry, Causality & Learning",
    template: "%s | YRC Physics Lab",
  },
  description:
    "A formal research notebook on geometry, causal structure, chronology protection, and machine learning in theoretical physics.",
  keywords: [
    "chronology protection",
    "causal structure",
    "geometry in physics",
    "theoretical physics research",
    "machine learning and geometry",
    "young physics researcher",
  ],
  authors: [{ name: "Yuvan Raam Chandra" }],
  creator: "Yuvan Raam Chandra",
  alternates: {
    canonical: "https://yrcphysics.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "YRC Physics Lab | Geometry, Causality & Learning",
    description:
      "A formal research notebook on geometry, causal structure, chronology protection, and machine learning in theoretical physics.",
    url: "https://yrcphysics.com",
    siteName: "YRC Physics Lab",
    images: [
      {
        url: "/brand/ypl-logo-lockup-header-light-clean.png",
        width: 1200,
        height: 630,
        alt: "YRC Physics Lab",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YRC Physics Lab | Geometry, Causality & Learning",
    description:
      "A formal research notebook on geometry, causal structure, chronology protection, and machine learning in theoretical physics.",
    images: ["/brand/ypl-logo-lockup-header-light-clean.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-128.png", sizes: "128x128", type: "image/png" },
      { url: "/icon-256.png", sizes: "256x256", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-512.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: colors.light.bg },
    { media: "(prefers-color-scheme: dark)", color: colors.dark.bg },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeStyles = {
    "--font-heading-stack": typography.fonts.heading,
    "--font-body-stack": typography.fonts.body,
    "--type-h1": typography.scale.h1,
    "--type-h2": typography.scale.h2,
    "--type-h3": typography.scale.h3,
    "--type-body": typography.scale.body,
    "--leading-h1": String(typography.lineHeights.headingTight),
    "--leading-h2": String(typography.lineHeights.h2),
    "--leading-h3": String(typography.lineHeights.h3),
    "--leading-body": String(typography.lineHeights.body),
  } as CSSProperties;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Lab" />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body
        className={`${headingFont.variable} ${bodyFont.variable} min-h-screen bg-bg text-text antialiased flex flex-col`}
        style={themeStyles}
      >
        <RouteTracker />
        {children}
        <BackToTopButton />
      </body>
    </html>
  );
}
