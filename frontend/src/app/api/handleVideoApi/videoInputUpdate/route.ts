import { sendFiles, urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const professorName = body.get("professorName");
  const courseName = body.get("courseName");
  const videoName = body.get("videoName");
  body.delete("professorName");
  body.delete("videoName");
  const id = await req.cookies.get("id");
  body.delete("data");
  const response = await fetch(
    `${urlBackend}courses/video/${professorName}/${videoName}/${courseName}/add/video/Update/videoInput`,
    sendFiles(body, id?.value)
  );
  const r = await response.text();

  return new NextResponse(JSON.stringify({ text: r, ok: response.ok }));
}
