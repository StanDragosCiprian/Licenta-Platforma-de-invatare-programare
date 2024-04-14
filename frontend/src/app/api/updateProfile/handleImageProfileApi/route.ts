
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const cookie: any = await req.cookies.get("id");
  const role: any = await req.cookies.get("role");
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
  );if(response.ok){
  return new NextResponse(JSON.stringify({ isUpdate: true }));
  }else{
    return new NextResponse(JSON.stringify({ isUpdate: false }));
  }
}
