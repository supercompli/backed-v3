import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, string>;

  if (!body.policyNumber || !body.customerName || !body.email || !body.description) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    await supabase.from("claims").insert({
      policy_number: body.policyNumber,
      customer_name: body.customerName,
      business: body.business ?? null,
      email: body.email,
      phone: body.phone ?? null,
      incident_date: body.incidentDate || null,
      description: body.description,
      status: "notified",
    });
  }

  return NextResponse.json({ success: true });
}
