import type { Metadata } from "next";
import CinematicExperience from "@/components/v2/CinematicExperience";
import artifact from "@/content/v2-artifact.json";
import "./v2/v2.css";

export const metadata: Metadata = {
  title: "The exhibition",
  description: "One photograph. Five relationships with computing. A continuous cinematic exhibition about human attention.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Invisible Interfaces — The exhibition",
    description: "A cinematic, scroll-driven exploration of how human-computer interaction evolved. One photograph. Five relationships.",
    type: "website",
    url: "/",
    images: [{ url: "/v2/shore.webp", width: artifact.web_dimensions[0], height: artifact.web_dimensions[1], alt: "The red-boat photograph that connects the five acts of Invisible Interfaces" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invisible Interfaces — The exhibition",
    description: "One photograph. Five relationships with computing. A cinematic exhibition controlled by scrolling.",
    images: ["/v2/shore.webp"],
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <CinematicExperience />;
}
