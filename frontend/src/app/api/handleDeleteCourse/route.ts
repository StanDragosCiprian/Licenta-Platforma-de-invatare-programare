import { urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { courseName } = body;
  const cookie = req.cookies.get("id");

  const option = {
    method: "POST",
    credentials: "include" as RequestCredentials,
    headers: {
      "Content-Type": "application/json",
      Cookie: `id=${cookie?.value}`,
    },
  };
  const res = await fetch(`${urlBackend}courses/${courseName}/delete`, option);
  return new NextResponse(JSON.stringify({ ok: res.ok }));
}
