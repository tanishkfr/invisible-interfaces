import type { Metadata } from "next";
import CinematicExperience from "@/components/v2/CinematicExperience";
import "./v2.css";

export const metadata: Metadata = {
  title: "The exhibition",
  description: "One photograph. Five relationships with computing. A continuous cinematic exhibition about human attention.",
  alternates: { canonical: "/v2" },
  robots: { index: false, follow: false },
};

export default function V2Page() {
  return <CinematicExperience />;
}
