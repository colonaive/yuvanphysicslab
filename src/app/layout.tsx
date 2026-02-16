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
  metadataBase: new URL("https://yuvan-physics-lab.netlify.app"),
  title: {
    default: "Yuvan Physics Lab",
    template: "%s | Yuvan Physics Lab",
  },
  description: "Digital garden exploring Physics, Geometry, and Machine Learning.",
  openGraph: {
    title: "Yuvan Physics Lab",
    description: "Digital garden exploring Physics, Geometry, and Machine Learning.",
    type: "website",
    locale: "en_US",
    siteName: "Yuvan Physics Lab",
    url: "/",
    images: [
      {
        url: "/brand/whatsapp-og.png",
        width: 1200,
        height: 630,
        alt: "Yuvan Physics Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yuvan Physics Lab",
    description: "Digital garden exploring Physics, Geometry, and Machine Learning.",
    images: ["/brand/whatsapp-og.png"],
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
