import type { Metadata, Viewport } from "next";
import { Archivo, Inter_Tight } from "next/font/google";
import { site } from "@/content/site";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

/** Wide grotesque for display. The width axis is the point — it lets the
 *  headline stretch without simply getting heavier. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description:
    "Independent creative direction across photography, film, brand identity and web. Selected work, albums and prints.",
  openGraph: {
    type: "website",
    title: `${site.name} — ${site.role}`,
    description:
      "Independent creative direction across photography, film, brand identity and web.",
    siteName: site.name,
    url: site.url,
    images: [{ url: "/media/hero-poster.png", width: 1280, height: 720 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${interTight.variable}`}>
      <head>
        {/* Reveal animations render their start state into the server HTML.
            Without JS that state never advances, so the page would be there
            but invisible. This hands the content straight over instead. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
