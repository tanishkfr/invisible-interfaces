import type { Metadata } from "next";
import { metadata as homepageMetadata } from "@/app/page";

// Keep existing /v2 links working while the homepage is the canonical exhibition.
export { default } from "@/app/page";
export const metadata: Metadata = {
  ...homepageMetadata,
  robots: { index: false, follow: true },
};
