import { urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const updatedCourse = await req.json();
  const parsedBody = JSON.parse(updatedCourse.body);
  const cookies = await req.cookies.get("id");
  const { courseBody,  oldCourseName } = parsedBody;
  courseBody.oldCoursName = oldCourseName;
  const option = {
    method: "Post",
    credentials: "include" as RequestCredentials,
    headers: {
      "Content-Type": "application/json",
      cookie: `id=${cookies?.value}`,
    },
    body: JSON.stringify({ courseBody: courseBody }),
  };
  const response = await fetch(`${urlBackend}courses/update`, option);
  return new NextResponse(JSON.stringify({ ok:response.ok }));
}
