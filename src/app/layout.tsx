import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Crimson_Pro, Source_Sans_3 } from "next/font/google";
import { colors, typography } from "@/theme/tokens";
import type { CSSProperties } from "react";

const headingFont = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Yuvan's Lab",
    template: "%s | Yuvan's Lab",
  },
  description: "Digital garden exploring Physics, Geometry, and Machine Learning.",
  openGraph: {
    title: "Yuvan's Lab",
    description: "Digital garden exploring Physics, Geometry, and Machine Learning.",
    type: "website",
    locale: "en_US",
    siteName: "Yuvan Physics Lab",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
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
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Lab" />
      </head>
      <body
        className={`${headingFont.variable} ${bodyFont.variable} min-h-screen bg-bg text-text antialiased flex flex-col`}
        style={themeStyles}
      >
        {children}
      </body>
    </html>
  );
}
