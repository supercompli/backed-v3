import { NextResponse } from "next/server";
import { sendContactEmails, type ContactSubmission } from "@/lib/email";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Partial<ContactSubmission>;

  try {
    body = (await request.json()) as Partial<ContactSubmission>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !EMAIL_PATTERN.test(email) || !message) {
    return NextResponse.json(
      { error: "Name, a valid email, and a message are required." },
      { status: 400 },
    );
  }

  if (name.length > 150 || email.length > 254 || message.length > 5_000) {
    return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
  }

  try {
    const result = await sendContactEmails({ name, email, message });

    if (!result.sent) {
      throw new Error(result.reason);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unable to send contact emails", error);
    return NextResponse.json(
      { error: "Unable to send your message right now." },
      { status: 503 },
    );
  }
}
