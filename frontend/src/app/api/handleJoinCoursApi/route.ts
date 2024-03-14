import {
  sendToServerCookies,
  urlBackend,
} from "@/app/UserServer/ServerRequest";
import { getCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { professor, coursName } = await req.json();
  const cookie: any = await req.cookies.get("id");
  console.log("cookie: ", cookie);
  const f = await fetch(
    `${urlBackend}curs/${professor}/${coursName}/join/cours`,
    sendToServerCookies({ id: cookie }, undefined)
  );
  return new NextResponse(JSON.stringify({ t: 5 }));
}

