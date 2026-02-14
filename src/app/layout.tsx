import type { Metadata } from "next";
import { Chivo_Mono } from "next/font/google";
import "./globals.css";

const chivoMono = Chivo_Mono({
  subsets: ["latin"],
  variable: "--font-chivo-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agentic.video"),
  title: "av — Video memory for AI agents",
  description:
    "Index once, search many. Turn video files into searchable, queryable context — what jq is for JSON, but for video. Open-source CLI by Pixel ML.",
  keywords: [
    "av",
    "agentic video",
    "video search",
    "video indexing",
    "AI video",
    "video RAG",
    "video transcription",
    "video CLI",
    "Pixel ML",
    "pixelml-av",
    "video memory",
    "agentic workflows",
  ],
  authors: [{ name: "Pixel ML" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "av — Video memory for AI agents",
    description:
      "Index once, search many. Turn video files into searchable, queryable context — what jq is for JSON, but for video.",
    type: "website",
    url: "https://agentic.video",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "av — Video memory for AI agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "av — Video memory for AI agents",
    description:
      "Index once, search many. Turn video files into searchable, queryable context — what jq is for JSON, but for video.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={chivoMono.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
