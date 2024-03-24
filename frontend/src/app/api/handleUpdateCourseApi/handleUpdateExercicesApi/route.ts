import { urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const bodyCours = await req.json();  
    const {urlName}=bodyCours;
    console.log('urlName: ', urlName);
    delete bodyCours.urlName;
    console.log('bodyCours: ', bodyCours);
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
    //   const res = await fetch(`${urlBackend}courses/${urlName}/new/exercices`, option);
    //   const r=await res.json();
      return new NextResponse(JSON.stringify({text:5}));
}