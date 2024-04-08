import { urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const bodyCours = await req.json();
  const cookie = req.cookies.get("id");
  const {grad}=bodyCours;
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
  console.log(bodyCours);
  if (grad === "Professor") {
    const res = await fetch(
      `${urlBackend}courses/add/professors/to/couses`,
      option
    );
    const r = await res.text();
    console.log('r: ', r);
  } else if (grad === "Student") {
    const res = await fetch(
      `${urlBackend}courses/add/students/to/couses`,
      option
    );
    const r = await res.text();
    console.log('r: ', r);
  }
  return new NextResponse(JSON.stringify({ text: 5 }));
}
