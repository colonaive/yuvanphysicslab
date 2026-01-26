import "./globals.css";
import type { Metadata } from "next";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Lab" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
