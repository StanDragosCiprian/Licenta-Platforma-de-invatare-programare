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
  let stats: boolean = false;
  if (role === "student") {
    const r = await fetch(`${urlBackend}admin/delete/student`, option);
    stats = r.ok;
  } else if (role === "professor") {
    const t = await fetch(
      `${urlBackend}courses/delete/professor/courses`,
      option
    );
    console.log(t);
    console.log(`${urlBackend}courses/delete/professor/courses`);
    const r = await fetch(`${urlBackend}admin/delete/professor`, option);
    stats = r.ok;
  }

  return new NextResponse(JSON.stringify({ ok: stats }));
}
