import {
  getFromServerCookie,
  sendToServerCookies,
  urlBackend,
} from "@/app/UserServer/ServerRequest";
import { getCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  //{ role: 'student', content: 'Dragos', newValue: 'za' }
  let request: any;
  const { role, content, newValue, email, urlApi } = await req.json();
  const cookie: any = await req.cookies.get("id");
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `id=${cookie.value}`, // Include the cookie in the headers
    },
    body: JSON.stringify({
      content: content,
      newValue: newValue,
      email: email,
    }),
  };
  if (role === "student") {
    request = await fetch(`${urlBackend}student${urlApi}`, option);
  } else if (role === "professor") {
    if (urlApi === "/update/username")
      await fetch(`${urlBackend}courses/rename/file`, option);
    request = await fetch(`${urlBackend}professor${urlApi}`, option);
  } else if (role === "admin") {
    request = await fetch(`${urlBackend}admin${urlApi}`, option);
  }

  return new NextResponse(JSON.stringify({ isUpdate: await request.json() ,ok:request.ok}));
}
