import type { Metadata } from "next";
import Experience from "@/components/Experience";

export const metadata: Metadata = {
  title: "The original exhibition",
  alternates: { canonical: "/v1" },
  openGraph: { url: "/v1" },
  robots: { index: false, follow: true },
};

export default function OriginalPage() {
  return <Experience />;
}
