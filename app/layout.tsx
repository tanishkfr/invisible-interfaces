import type { Metadata, Viewport } from "next";
import { Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500"],
  variable: "--font-newsreader",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-plex-mono",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://invisible-interfaces.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Invisible Interfaces",
    template: "%s — Invisible Interfaces",
  },
  description:
    "An interactive research-through-design exhibition about attention, delegation, and accountable return.",
  authors: [{ name: "Tanishk Salagame", url: "https://github.com/tanishkfr" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Invisible Interfaces",
    description:
      "A task travels from demanded attention to entrusted absence—and returns with an accountable receipt.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Invisible Interfaces",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invisible Interfaces",
    description:
      "A task travels from demanded attention to entrusted absence—and returns with an accountable receipt.",
    images: ["/opengraph-image.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={newsreader.variable + " " + plexMono.variable}>
      <body>
        <noscript>
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#000",
              padding: "1.5rem",
            }}
          >
            <p className="text-center font-mono text-[0.8125rem] leading-relaxed text-ink-dim">
              THIS ESSAY REQUIRES JAVASCRIPT.
              <br />
              IT IS ABOUT INTERFACES; IT IS ONE.
            </p>
          </div>
        </noscript>
        {children}
      </body>
    </html>
  );
}