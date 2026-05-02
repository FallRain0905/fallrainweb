import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST() {
  const existing = await db.user.findFirst();
  if (existing) {
    return NextResponse.json({ error: "Admin user already exists" }, { status: 400 });
  }

  const password = await bcrypt.hash("admin123", 10);
  const user = await db.user.create({
    data: { username: "admin", password },
  });

  return NextResponse.json({ id: user.id, username: user.username, password: "admin123" });
}
