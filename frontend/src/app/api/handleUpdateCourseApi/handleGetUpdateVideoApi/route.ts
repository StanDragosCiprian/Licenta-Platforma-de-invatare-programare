import { urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { courseName } = await req.json();
  console.log("courseName: ", courseName);
  const cookies = req.cookies.get("id");
  console.log("cookiebgs: ", cookies?.value);
  const option = {
    method: "GET",
    credentials: "include" as RequestCredentials,
    headers: {
      "Content-Type": "application/json",
      cookie: `id=${cookies?.value}`,
    },
  };
  const response = await fetch(
    `${urlBackend}courses/coursesProfessor/${courseName}/video`,
    option
  );
  const video=await response.json();
  console.log('video: ', video);
  if (!response.ok) {
    console.error("Error occurred:", response.status);
  }
  return new NextResponse(JSON.stringify({ videos: video }));
}
