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

export const metadata: Metadata = {
  title: "Invisible Interfaces",
  description:
    "An interactive essay on how interaction design gave people their attention back.",
  openGraph: {
    title: "Invisible Interfaces",
    description:
      "An interactive essay on how interaction design gave people their attention back.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invisible Interfaces",
    description:
      "An interactive essay on how interaction design gave people their attention back.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${plexMono.variable}`}>
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
