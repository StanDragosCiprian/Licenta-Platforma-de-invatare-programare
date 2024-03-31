import { urlBackend } from "@/app/UserServer/ServerRequest";
import EmailTablr from "../EmailTable";
import { cookies } from "next/headers";
const option = () => {
  const cookieStore = cookies();
  return {
    method: "GET",
    credentials: "include" as RequestCredentials,
    headers: {
      "Content-Type": "application/json",
      Cookie: `id=${cookieStore.get("id")?.value}`,
    },
  };
};
const getAllStudents = async () => {
  const req = await fetch(`${urlBackend}admin/all/students`, option());
  return await req.json();
};
const getAllProfessor = async () => {
    const req = await fetch(`${urlBackend}admin/all/professors`, option());
    return await req.json();
  };
const EditEmail = async () => {
  const student = await getAllStudents();
  const professor = await getAllProfessor();
  return (
    <>
      <EmailTablr students={student} professor={professor} />
    </>
  );
};

export default EditEmail;
