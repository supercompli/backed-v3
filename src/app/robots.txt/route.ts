import { SITE_URL } from "@/lib/seo";

const robots = `Content-Signal: search=yes, ai-train=yes

User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /api
Disallow: /legal

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

export function GET() {
  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Signal": "search=yes, ai-train=yes",
    },
  });
}
