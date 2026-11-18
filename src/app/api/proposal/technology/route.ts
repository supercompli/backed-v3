import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { sendTechnologyProposalEmails } from "@/lib/email";
import { fillTechnologyProposalPdf } from "@/lib/pdf/itooTechnologyForm";
import { fillSantamTechnologyProposalPdf } from "@/lib/pdf/santamTechnologyForm";
import type { TechnologyProposalAnswers } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as TechnologyProposalAnswers;

  if (!body.insuredName || !body.contactEmail || !body.declarationAccepted) {
    return NextResponse.json(
      { error: "Insured name, contact email and declaration acceptance are required." },
      { status: 400 },
    );
  }

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    await supabase.from("technology_pi_proposals").insert({
      insured_name: body.insuredName,
      contact_email: body.contactEmail,
      contact_mobile: body.contactMobile,
      answers: body,
      status: "submitted",
    });
  }

  let prefilledPdf: Uint8Array | undefined;
  try {
    prefilledPdf = await fillTechnologyProposalPdf(body);
  } catch (error) {
    console.error("Unable to prefill the iTOO Technology PI PDF", error);
  }

  let santamPdf: Uint8Array | undefined;
  try {
    santamPdf = await fillSantamTechnologyProposalPdf(body);
  } catch (error) {
    console.error("Unable to prefill the Santam Technology PI PDF", error);
  }

  try {
    await sendTechnologyProposalEmails(body, prefilledPdf, santamPdf);
  } catch (error) {
    console.error("Unable to send technology PI proposal emails", error);
  }

  return NextResponse.json({ success: true });
}
