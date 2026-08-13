import { NextResponse, type NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { query } from "@/lib/db";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { path?: string; locale?: string; referrer?: string | null };
    const path = String(body.path ?? "").slice(0, 500);
    if (!path) return NextResponse.json({ ok: false }, { status: 400 });

    const locale = ["en", "am", "om"].includes(body.locale ?? "") ? body.locale! : "en";
    const referrer = body.referrer ? String(body.referrer).slice(0, 500) : null;

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "";
    const secret = process.env.ADMIN_SESSION_SECRET ?? "dreamspace";
    const day = new Date().toISOString().slice(0, 10);
    const visitorHash = ip ? createHash("sha256").update(`${ip}:${day}:${secret}`).digest("hex") : null;

    await query("INSERT INTO pageviews (path, referrer, locale, visitor_hash) VALUES (?, ?, ?, ?)", [
      path,
      referrer,
      locale,
      visitorHash,
    ]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
