import {
  getFromServerCookie,
  sendToServerCookies,
  urlBackend,
} from "@/app/UserServer/ServerRequest";
import { getCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const { professor, coursName } = await req.json();
  const cookie: any = await req.cookies.get("id");
  const f = await fetch(
    `${urlBackend}courses/${professor}/${coursName}/isJoin/cours'`,
    getFromServerCookie(cookie)
  );
  return new NextResponse(JSON.stringify({ t: 5 }));
}
