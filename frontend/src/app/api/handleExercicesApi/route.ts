import {urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body=await req.json();

    //,sendToServerCookies()
    const f=await fetch(`${urlBackend}courses/${body.professor}/${body.coursName}/${body.language}/${body.id}/compile`);
    return new NextResponse(JSON.stringify({text:await f.text()}));
}
