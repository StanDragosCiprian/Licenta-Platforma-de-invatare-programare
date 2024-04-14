import { urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { courseName } = await req.json();
  const cookies = req.cookies.get("id");
  const option = {
    method: "GET",
    credentials: "include" as RequestCredentials,
    headers: {
      cookie: `id=${cookies?.value}`,
    },
  };
  const response = await fetch(
    `${urlBackend}courses/docs/coursesProfessor/${courseName}/get/pdf`,
    option
  );
  const video=await response.json();

  return new NextResponse(JSON.stringify({ videos: video, ok: response.ok }));
}
