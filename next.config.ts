import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // The iTOO Technology PI PDF template is read from disk at request time
  // (src/lib/pdf/itooTechnologyForm.ts) — ensure it's traced into the
  // serverless bundle for the route that fills it.
  outputFileTracingIncludes: {
    "/api/proposal/technology": ["./forms/**/*"],
  },
  async redirects() {
    return [
      {
        source: "/professional-indemnity/:profession/:subpage(cost|requirements|claims|exclusions)",
        destination: "/professional-indemnity/:profession",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
