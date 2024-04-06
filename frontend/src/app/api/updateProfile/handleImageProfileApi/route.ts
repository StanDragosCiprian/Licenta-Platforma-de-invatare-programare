import {
  getFromServerCookie,
  sendToServerCookies,
  urlBackend,
} from "@/app/UserServer/ServerRequest";
import { getCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  console.log("formData: ", formData.values);
  const cookie: any = await req.cookies.get("id");
  const role: any = await req.cookies.get("role");
  console.log('role: ', role.value);
  //rest of your code
  const response = await fetch(
    `http://localhost:3000/${role.value}/upload/profile/image`,
    {
      method: "POST",
      body: formData,
      headers: {
        Cookie: `id=${cookie.value}`,
      },
    }
  );
  console.log(await response.json());
  return new NextResponse(JSON.stringify({ isUpdate: true }));
}
