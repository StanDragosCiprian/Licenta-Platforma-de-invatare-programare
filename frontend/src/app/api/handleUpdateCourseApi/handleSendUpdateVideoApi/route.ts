import { urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const courseVideo: {
    title: string;
    description: string;
    videoPath: string;
    videoName?: string;
    coursName?: string;
  } = await req.json();
  const cookies = req.cookies.get("id");
  const { videoName } = courseVideo;
  const { coursName } = courseVideo;
  delete courseVideo.videoName;
  delete courseVideo.coursName;

  const option = {
    method: "POST",
    credentials: "include" as RequestCredentials,
    headers: {
      "Content-Type": "application/json",
      cookie: `id=${cookies?.value}`,
    },
    body: JSON.stringify(courseVideo),
  };
  const response = await fetch(
    `${urlBackend}courses/${coursName}/${videoName}/update/video`,
    option
  );
  return new NextResponse(JSON.stringify({ videos: 5 }));
}
