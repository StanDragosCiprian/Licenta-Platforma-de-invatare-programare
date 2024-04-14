import { urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const bodyCours = await req.json();
  const cookie = req.cookies.get("id");
  console.log("cookie: ", cookie);
  const { grad } = bodyCours;
  delete bodyCours.grad;
  const option = {
    method: "POST",
    credentials: "include" as RequestCredentials,
    headers: {
      "Content-Type": "application/json",
      Cookie: `id=${cookie?.value}`,
    },
    body: JSON.stringify(bodyCours),
  };
  let res: Response;
  if (grad === "Professor") {
    res = await fetch(`${urlBackend}courses/add/professors/to/courses`, option);
    if(!res.ok)return new NextResponse(JSON.stringify({ ok: false }));
  } else if (grad === "Student") {
    res = await fetch(`${urlBackend}courses/add/students/to/couses`, option);
    if(!res.ok)return new NextResponse(JSON.stringify({ ok: false }));
  }
  
  return new NextResponse(JSON.stringify({ ok: true  }));
}
