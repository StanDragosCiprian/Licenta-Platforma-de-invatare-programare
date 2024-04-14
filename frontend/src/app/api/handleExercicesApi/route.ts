import { urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const f = await fetch(
    `${urlBackend}courses/compilator/${body.professor}/${body.coursName}/${body.language}/${body.id}/compile`
  );
  return new NextResponse(JSON.stringify({ text: await f.text(),ok:f.ok }));
}
