import { urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { role } = body;
  const cookie = req.cookies.get("id");
  delete body.role;
  const option = {
    method: "POST",
    credentials: "include" as RequestCredentials,
    headers: {
      "Content-Type": "application/json",
      Cookie: `id=${cookie?.value}`,
    },
    body: JSON.stringify(body),
  };
  if (role === "student") {
    await fetch(`${urlBackend}admin/delete/student`, option);
  } else if (role === "professor") {
    await fetch(`${urlBackend}admin/delete/professor`, option);
  }

  return new NextResponse(JSON.stringify({ videos: 5 }));
}
