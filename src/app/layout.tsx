import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Professional Indemnity, simplified.`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "BackedSure is a South African specialist insurance platform for Professional Indemnity cover. Complete one simple online application and find suitable cover for your profession.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: `${SITE_NAME} - Professional Indemnity, simplified.`,
    description:
      "BackedSure is a South African specialist insurance platform for Professional Indemnity cover.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_ZA",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-ZA"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            email: "hello@backedsure.co.za",
            areaServed: "ZA",
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_URL}/professions?search={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
