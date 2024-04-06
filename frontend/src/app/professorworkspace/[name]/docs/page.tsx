import { HandleProfessorWorkout } from "@/app/Entity/HandleProfessorWorkout";
import { DocumentComponents } from "./DocumentComponents";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { HandleProfessor } from "@/app/Entity/HandleProfessor";
import { urlBackend } from "@/app/UserServer/ServerRequest";
const takeEcryptedProfessorId = async () => {
  const professor = await fetch(`${urlBackend}professor/get/email/encripted`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: `id=${cookies().get("id")?.value}`,
    },
  });
  return await professor.text();
};
export default async function documents({ params }: any) {
  const professorEmail = await takeEcryptedProfessorId();
  const handleProfessor = new HandleProfessor(cookies().get("id")?.value);
  const professorName = await handleProfessor.getProfessorName();
  if (!(await handleProfessor.isProfessor())) {
    notFound();
  }
  return (
    <>
      <div className="flex justify-center items-center h-screen w-screen">
        <DocumentComponents
          isUpdated={false}
          documentName={""}
          coursName={params.name}
          setDialog={undefined}
          professorName={professorName}
          professorEmail={professorEmail}
        />
      </div>
    </>
  );
}
