import { urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
    const body= await req.json();
    const cookie= req.cookies.get("id");
    const option = {
        method: "POST",
        credentials: "include" as RequestCredentials,
        headers: {
            "Content-Type": "application/json",
            "Cookie": `id=${cookie?.value}`,
        },
        body: JSON.stringify(body),
    };
   const r= await fetch(`${urlBackend}admin/switch/professor/courses`, option);

    return new NextResponse(JSON.stringify({ videos: 5 , ok: r.ok }));
}