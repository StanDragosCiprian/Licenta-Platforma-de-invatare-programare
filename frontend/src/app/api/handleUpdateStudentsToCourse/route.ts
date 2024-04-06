import { urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const bodyCours = await req.json();
  const cookie = req.cookies.get("id");

  const option = {
    method: "POST",
    credentials: "include" as RequestCredentials,
    headers: {
      "Content-Type": "application/json",
      Cookie: `id=${cookie?.value}`,
    },
    body: JSON.stringify(bodyCours),
  };
  if (bodyCours.grad === "Professor") {
    const res = await fetch(
      `${urlBackend}courses/add/professors/to/couses`,
      option
    );
    const r = await res.text();
  } else if (bodyCours.grad === "Student") {
    const res = await fetch(
      `${urlBackend}courses/add/students/to/couses`,
      option
    );
    const r = await res.text();
  }
  return new NextResponse(JSON.stringify({ text: 5 }));
}
