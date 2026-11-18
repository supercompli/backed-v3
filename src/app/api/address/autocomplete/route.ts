import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";

// The Amazon Location Service API key is referer-restricted (allowlisted in
// the AWS console), so every request — including this server-to-server call —
// must send a Referer header matching that allowlist, or AWS returns
// 403 "requires header(s) not present in the request: referer".
const REFERER = `${SITE_URL}/`;

interface AmazonAutocompleteItem {
  PlaceId?: string;
  PlaceType?: string;
  Title?: string;
  Address?: {
    Label?: string;
  };
}

interface AmazonAutocompleteResponse {
  ResultItems?: AmazonAutocompleteItem[];
}

export async function POST(request: Request) {
  const { query } = (await request.json()) as { query?: string };
  const queryText = query?.trim();

  if (!queryText || queryText.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  const apiKey = process.env.AWS_GEO_PLACES_API_KEY;
  const region = process.env.AWS_GEO_REGION;

  if (!apiKey || !region) {
    return NextResponse.json({ suggestions: [], configured: false });
  }

  const url = new URL(`https://places.geo.${region}.amazonaws.com/v2/autocomplete`);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Referer: REFERER },
    body: JSON.stringify({
      QueryText: queryText,
      MaxResults: 5,
      Filter: {
        IncludeCountries: ["ZAF"],
      },
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { suggestions: [], error: "Address lookup is unavailable." },
      { status: 502 },
    );
  }

  const data = (await response.json()) as AmazonAutocompleteResponse;
  const suggestions =
    data.ResultItems?.map((item) => ({
      id: item.PlaceId ?? item.Address?.Label ?? item.Title ?? "",
      label: item.Address?.Label ?? item.Title ?? "",
      placeType: item.PlaceType ?? "",
    })).filter((item) => item.id && item.label) ?? [];

  return NextResponse.json({ suggestions, configured: true });
}
