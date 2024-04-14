import {
  sendToServerCookies,
  urlBackend,
} from "@/app/UserServer/ServerRequest";
import { getCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { professor, coursName } = await req.json();
  const cookie: any = await req.cookies.get("id");
  const f = await fetch(
    `${urlBackend}courses/${professor}/${coursName}/join/cours`,
    sendToServerCookies(JSON.stringify({ id: cookie }), undefined)
  );
  return new NextResponse(JSON.stringify({ ok: f.ok }));}

