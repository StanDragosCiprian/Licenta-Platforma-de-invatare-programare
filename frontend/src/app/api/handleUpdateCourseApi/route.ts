import { urlBackend } from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  //make a post request to this `${urlBackend}course/update`
  const updatedCourse = await req.json();
  const parsedBody = JSON.parse(updatedCourse.body);
  const cookies = await req.cookies.get("id");
  console.log("cookies: ", cookies?.value);
  const { cursBody, oldCoursName } = parsedBody;
  cursBody.oldCoursName = oldCoursName;
  console.log('cursBody: ', cursBody);
  const option = {
    method: "Post",
    credentials: "include" as RequestCredentials,
    headers: {
      "Content-Type": "application/json",
      cookie: `id=${cookies?.value}`,
    },
    body: JSON.stringify({ cursBody }),
  };
  const response = await fetch(`${urlBackend}courses/update`, option);
  if (!response.ok) {
    // Handle error response
    console.error("Error occurred:", response.status);
    // You can add additional error handling logic here
  }
  return new NextResponse(JSON.stringify({ text: 5 }));
  // Handle the response as needed
}
