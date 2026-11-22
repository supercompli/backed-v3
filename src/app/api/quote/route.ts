import { after, NextResponse } from "next/server";
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

  // Saving the request and sending notifications must not hold up the quote
  // result. In particular, an unavailable SMTP server can otherwise leave the
  // browser waiting indefinitely even though rating has already completed.
  after(async () => {
    try {
      const supabase = await getSupabaseServerClient();
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const { error } = await supabase.from("quote_requests").insert({
          user_id: user?.id ?? null,
          profession_slug: profession.slug,
          answers: body,
          result,
          rating_version: result.ratingVersion,
          risk_classification: result.riskClassification,
          contact_email: body.contact.email,
        });

        if (error) {
          console.error("Unable to save quote request", error);
        }
      }
    } catch (error) {
      console.error("Unable to save quote request", error);
    }

    try {
      await sendQuoteEmails({ answers: body, profession, result });
    } catch (error) {
      console.error("Unable to send quote confirmation emails", error);
    }
  });

  return NextResponse.json({ result });
}
