import { sendFiles, urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.formData();

  const professorName = body.get("professorName");
  const courseName = body.get("courseName");
  const pdfTitle = body.get("pdfTitle");
  const newPdfTitle = body.get("newPdfTitle");
  body.delete("professorName");
  body.delete("courseName");
  body.delete("pdfTitle");
  body.delete("newPdfTitle");
  const id = await req.cookies.get("id");
  const res = await fetch(
    `${urlBackend}courses/docs/${professorName}/${pdfTitle}/${courseName}/${newPdfTitle}/add/pdf/Update/pdfInput`,
    sendFiles(body, id?.value)
  );
    const r = await res.text();
    return new NextResponse(JSON.stringify({ text: r, ok: res.ok }));
}
