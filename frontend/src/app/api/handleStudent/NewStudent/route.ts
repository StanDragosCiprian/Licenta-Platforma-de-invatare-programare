import {
  sendToServer,
  urlBackend,
} from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const student = await req.json();
  let rp: any;
  const option = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: student.email }),
  };
  const professorResponse = await fetch(
    `${urlBackend}professor/is/email/exist`,
    option
  );
  const adminResponse = await fetch(
    `${urlBackend}admin/is/email/exist`,
    option
  );
  if (!professorResponse.ok) {
    const data = await professorResponse.json();
    rp = data.message;
  } else if (!adminResponse.ok) {
    const data = await adminResponse.json();
    rp = data.message;
  } else {
    const response = await fetch(
      `${urlBackend}student/new`,
      sendToServer(student)
    );
    if (response.ok) {
      const data = await response.json();
      rp = data.access_token;
    } else {
      const data = await response.json();
      rp = data.message;
    }
  }
  return new NextResponse(JSON.stringify({ studentData: await rp }));
}
