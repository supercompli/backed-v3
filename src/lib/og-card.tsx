import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { OG_IMAGE_SIZE, SITE_NAME, SITE_URL } from "@/lib/seo";

// next/og can't use the next/font woff2 files, so the site's typeface
// (Plus Jakarta Sans) ships as static .ttf instances in assets/fonts.
const fontMedium = await readFile(
  join(process.cwd(), "assets/fonts/PlusJakartaSans-500.ttf"),
);
const fontExtraBold = await readFile(
  join(process.cwd(), "assets/fonts/PlusJakartaSans-800.ttf"),
);

// Mirrors the theme tokens in src/app/globals.css.
const COLOR = {
  primaryDark: "#162a24",
  greenDark: "#234c40",
  green: "#2f6454",
  softGreen: "#e8f1ed",
  accent: "#c8e36e",
};

const DOMAIN = new URL(SITE_URL).host;

export function renderOgCard() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "Plus Jakarta Sans",
          color: "#ffffff",
          // Soft accent glow (top-right) over the dark green gradient. Kept as a
          // background layer: an offset absolutely-positioned glow gets clipped
          // by Satori and leaves a hard seam.
          backgroundImage: [
            `radial-gradient(circle at 88% 12%, rgba(200, 227, 110, 0.2) 0%, rgba(200, 227, 110, 0) 44%)`,
            `linear-gradient(135deg, ${COLOR.primaryDark} 0%, ${COLOR.greenDark} 58%, ${COLOR.green} 100%)`,
          ].join(", "),
        }}
      >
        {/* Badge mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="76" height="76" viewBox="0 0 24 24">
            <path
              d="M12 2 L20 5.2 V11.2 C20 16 16.6 19.9 12 22 C7.4 19.9 4 16 4 11.2 V5.2 Z"
              fill={COLOR.accent}
            />
            <path
              d="M8.2 12.2 L10.9 14.9 L15.9 9.2"
              fill="none"
              stroke={COLOR.primaryDark}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            style={{
              marginLeft: 22,
              fontSize: 52,
              fontWeight: 800,
              letterSpacing: -1.5,
            }}
          >
            {SITE_NAME}
          </div>
        </div>

        {/* Tagline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: -3,
            }}
          >
            <div>Professional Indemnity,</div>
            <div style={{ color: COLOR.accent }}>simplified.</div>
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 32,
              fontWeight: 500,
              color: COLOR.softGreen,
              opacity: 0.85,
            }}
          >
            Specialist insurance for South African professionals.
          </div>
        </div>

        {/* Domain pill */}
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "14px 30px",
              borderRadius: 999,
              border: "2px solid rgba(255, 255, 255, 0.28)",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: 0.3,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 12,
                backgroundColor: COLOR.accent,
                marginRight: 16,
              }}
            />
            {DOMAIN}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      fonts: [
        {
          name: "Plus Jakarta Sans",
          data: fontMedium,
          style: "normal",
          weight: 500,
        },
        {
          name: "Plus Jakarta Sans",
          data: fontExtraBold,
          style: "normal",
          weight: 800,
        },
      ],
    },
  );
}
