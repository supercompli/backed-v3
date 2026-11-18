import { NextResponse } from "next/server";
import { getQuoteProfession } from "@/data/professions";
import { PI_PRODUCT_SLUG, parseQuoteProducts } from "@/data/quoteProducts";
import { evaluatePIRisk } from "@/lib/rating/evaluatePIRisk";
import { sendQuoteEmails } from "@/lib/email";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PIQuoteAnswers } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as PIQuoteAnswers;

  const profession = getQuoteProfession(body.professionSlug);
  if (!profession) {
    return NextResponse.json({ error: "Unknown profession." }, { status: 400 });
  }

  if (!body.contact?.email || !body.contact?.consent) {
    return NextResponse.json({ error: "Contact details and consent are required." }, { status: 400 });
  }

  const products = parseQuoteProducts(body.products);
  body.products = products.length ? products : [PI_PRODUCT_SLUG];

  const result = evaluatePIRisk(profession, body);

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("quote_requests").insert({
      user_id: user?.id ?? null,
      profession_slug: profession.slug,
      answers: body,
      result,
      rating_version: result.ratingVersion,
      risk_classification: result.riskClassification,
      contact_email: body.contact.email,
    });
  }

  try {
    await sendQuoteEmails({ answers: body, profession, result });
  } catch (error) {
    console.error("Unable to send quote confirmation emails", error);
  }

  return NextResponse.json({ result });
}
