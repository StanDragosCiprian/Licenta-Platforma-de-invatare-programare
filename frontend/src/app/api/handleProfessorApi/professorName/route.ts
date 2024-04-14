import { getFromServerCookie, urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const id=await req.cookies.get("id");
    const professor = await fetch(
        `${urlBackend}courses/professorName`,
        getFromServerCookie(id?.value)
      );
      const r=await professor.text();
      return new NextResponse(JSON.stringify({"text":r,"ok":professor.ok}));
}