// Stub: logs the address and succeeds. Wire this to the mailing-list provider before launch.
export async function POST(req: Request) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }
  console.log("[subscribe]", email);
  return Response.json({ ok: true });
}
