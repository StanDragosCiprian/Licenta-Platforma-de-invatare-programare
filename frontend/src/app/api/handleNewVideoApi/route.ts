import { urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const bodyCours = await req.json();
  const { videoName } = bodyCours;
  delete bodyCours.videoName;
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
  const res = await fetch(
    `${urlBackend}courses/video/${videoName}/add/video/textInput`,
    option
  );
  const r = await res.text();
  return new NextResponse(JSON.stringify({ text: r, ok:res.ok }));
}
