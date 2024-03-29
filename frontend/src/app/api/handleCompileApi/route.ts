import {
  sendToServerCookies,
  urlBackend,
} from "@/app/UserServer/ServerRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    professor,
    coursName,
    id,
    language,
  }: {
    professor: string;
    coursName: string;
    id: string;
    language: string;
  } = getUrl(body);

  const f = await fetch(
    `${urlBackend}courses/${professor}/${coursName}/${language}/${id}/execute/script`,
    sendToServerCookies(body, undefined)
  );
  console.log();
  return new NextResponse(JSON.stringify(await f.json()));
}
function getUrl(body: any): {
  professor: string;
  coursName: string;
  id: string;
  language: string;
} {
  const professor = body.professor;
  const coursName = body.coursName;
  const id = body.id;
  const language = body.language;
  delete body.professor;
  delete body.coursName;
  delete body.id;
  delete body.language;
  return {
    professor: professor,
    coursName: coursName,
    id: id,
    language: language,
  };
}
