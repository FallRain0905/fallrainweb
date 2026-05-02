import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { fetchFavicon } from "@/lib/icon";

const linkSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  description: z.string().optional(),
  icon_url: z.string().optional(),
  category_id: z.string().min(1),
  sort_order: z.number().optional(),
});

export async function GET() {
  const links = await db.link.findMany({
    orderBy: { sort_order: "asc" },
    include: { category: true },
  });
  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data = linkSchema.parse(body);

  // Auto-fetch icon if not provided
  if (!data.icon_url) {
    const favicon = await fetchFavicon(data.url);
    if (favicon) data.icon_url = favicon;
  }

  const link = await db.link.create({ data });
  return NextResponse.json(link, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;

  const parsed = linkSchema.partial().parse(data);

  // Auto-fetch icon if URL changed and icon not provided
  if (data.url && !data.icon_url) {
    const favicon = await fetchFavicon(data.url);
    if (favicon) parsed.icon_url = favicon;
  }

  const link = await db.link.update({ where: { id }, data: parsed });
  return NextResponse.json(link);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db.link.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
