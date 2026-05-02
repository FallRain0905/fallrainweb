import { NextRequest, NextResponse } from "next/server";
import { fetchFavicon } from "@/lib/icon";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "url is required" }, { status: 400 });

  const iconUrl = await fetchFavicon(url);
  if (!iconUrl) return NextResponse.json({ error: "Could not fetch icon" }, { status: 404 });

  return NextResponse.json({ icon_url: iconUrl });
}
