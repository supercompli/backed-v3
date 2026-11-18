import { renderOgCard } from "@/lib/og-card";
import { OG_IMAGE_ALT } from "@/lib/seo";

export const alt = OG_IMAGE_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgCard();
}
