import { urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const bodyCours = await req.json();  
    const {urlName}=bodyCours;
    delete bodyCours.urlName;
    const cookie = req.cookies.get("id");
    const option = {
        method: "POST",
        credentials: "include" as RequestCredentials,
        headers: {
          "Content-Type": "application/json",
          Cookie: `id=${cookie?.value}`,
        },
        body: JSON.stringify(bodyCours),
      };
      const res = await fetch(`${urlBackend}courses/compilator/${urlName}/new/exercices`, option);
      const r=await res.json();
      console.log('r: ', r);
      return new NextResponse(JSON.stringify({text:r}));
}