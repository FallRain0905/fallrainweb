import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  sort_order: z.number().optional(),
});

export async function GET() {
  const categories = await db.category.findMany({
    orderBy: { sort_order: "asc" },
    include: { links: { orderBy: { sort_order: "asc" } } },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data = categorySchema.parse(body);

  const category = await db.category.create({ data });
  return NextResponse.json(category, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;

  const category = await db.category.update({
    where: { id },
    data: categorySchema.partial().parse(data),
  });
  return NextResponse.json(category);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
