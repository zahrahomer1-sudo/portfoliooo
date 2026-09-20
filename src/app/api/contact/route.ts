import { NextResponse } from "next/server";
import { contactSteps } from "@/content/site";

export const runtime = "nodejs";

type Payload = {
  answers?: Record<string, unknown>;
  trap?: unknown;
  elapsed?: unknown;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_FIELD = 4000;

/**
 * Enquiry delivery.
 *
 * No mail provider is configured in this repository, so the honest response to
 * a valid submission is 501 rather than a silent success. The client turns that
 * into a prefilled mailto so the enquiry is not lost. Set CONTACT_WEBHOOK_URL
 * (any endpoint that accepts JSON) or RESEND_API_KEY + CONTACT_TO to switch on
 * real delivery — no other change is needed.
 */
export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  // Hidden field filled, or submitted faster than anyone could read: drop it,
  // but answer 200 so a bot learns nothing from the difference.
  const elapsed = typeof body.elapsed === "number" ? body.elapsed : 0;
  if ((typeof body.trap === "string" && body.trap.length > 0) || elapsed < 3000) {
    return NextResponse.json({ ok: true });
  }

  const raw = body.answers;
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "bad_payload" }, { status: 400 });
  }

  const answers: Record<string, string> = {};
  for (const step of contactSteps) {
    const value = (raw as Record<string, unknown>)[step.id];
    const text = typeof value === "string" ? value.trim() : "";
    if (!text && !step.optional) {
      return NextResponse.json(
        { error: "missing_field", field: step.id },
        { status: 400 },
      );
    }
    if (text.length > MAX_FIELD) {
      return NextResponse.json(
        { error: "field_too_long", field: step.id },
        { status: 413 },
      );
    }
    answers[step.id] = text;
  }

  if (!EMAIL.test(answers.email ?? "")) {
    return NextResponse.json(
      { error: "invalid_email", field: "email" },
      { status: 400 },
    );
  }

  const lines = contactSteps
    .map((s) => `${s.question}\n${answers[s.id] || "—"}`)
    .join("\n\n");

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, text: lines }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  if (resendKey && to && from) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: answers.email,
        subject: `Enquiry — ${answers.name || "no name"}`,
        text: lines,
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "not_configured" }, { status: 501 });
}
