import { urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const bodyCours = await req.json();
  const cookie = req.cookies.get("id");
  const { courseName } = bodyCours;
  delete bodyCours.courseName;
  const option = {
    method: "POST",
    credentials: "include" as RequestCredentials,
    headers: {
      "Content-Type": "application/json",
      Cookie: `id=${cookie?.value}`,
    },
    body: JSON.stringify(bodyCours),
  };
  const res = await fetch(
    `${urlBackend}courses/compilator/coursesProfessor/${courseName}/Update/compile`,
    option
  );
  return new NextResponse(JSON.stringify({ ok: res.ok }));
}
