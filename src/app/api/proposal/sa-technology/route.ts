import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { sendSATechnologyProposalEmails } from "@/lib/email";
import { fillSantamTechnologyProposalPdfSA } from "@/lib/pdf/santamTechnologyFormSA";
import type { SATechnologyProposalAnswers } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as SATechnologyProposalAnswers;

  if (!body.businessName || !body.contactEmail || !body.declarationAccepted) {
    return NextResponse.json(
      { error: "Business name, contact email and declaration acceptance are required." },
      { status: 400 },
    );
  }

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    await supabase.from("sa_technology_pi_proposals").insert({
      business_name: body.businessName,
      contact_email: body.contactEmail,
      contact_mobile: body.contactMobile,
      answers: body,
      status: "submitted",
    });
  }

  let prefilledPdf: Uint8Array | undefined;
  try {
    prefilledPdf = await fillSantamTechnologyProposalPdfSA(body);
  } catch (error) {
    console.error("Unable to prefill the Santam SA Technology PI PDF", error);
  }

  try {
    await sendSATechnologyProposalEmails(body, prefilledPdf);
  } catch (error) {
    console.error("Unable to send SA technology PI proposal emails", error);
  }

  return NextResponse.json({ success: true });
}
