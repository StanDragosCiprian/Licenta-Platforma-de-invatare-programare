import { sendFiles, urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.formData();
    const professorName = body.get("professorName");
    const courseName = body.get("courseName");
    const pdfName = body.get("title");
    body.delete("professorName");
    body.delete("title");
    const id = await req.cookies.get("id");
    body.delete("data");
    const response = await fetch(
      `${urlBackend}courses/docs/${professorName}/${courseName}/${pdfName}/add/document/Docs`,
      sendFiles(body, id?.value)
    );
    const r = await response.text();

    return new NextResponse(JSON.stringify({ text: r , ok: response.ok}));
}