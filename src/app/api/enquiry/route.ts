// Stub for the viewing, owner and contact forms: validates required fields, logs, succeeds.
// Wire this to email or the CRM before launch.
const required: Record<string, string[]> = {
  viewing: ["name", "email", "property", "date"],
  owner: ["name", "email", "city", "type"],
  contact: ["name", "email", "message"],
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, string> | null;
  const kind = body?.kind;
  if (!body || !kind || !(kind in required)) return Response.json({ error: "Unknown form" }, { status: 400 });
  const missing = required[kind].filter((k) => !String(body[k] ?? "").trim());
  if (missing.length) return Response.json({ error: "Missing fields", missing }, { status: 422 });
  console.log(`[enquiry:${kind}]`, body);
  return Response.json({ ok: true, reference: `AR-${Date.now().toString(36).toUpperCase().slice(-6)}` });
}
