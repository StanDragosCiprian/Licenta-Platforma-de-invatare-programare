import { urlBackend } from "@/app/UserServer/ServerRequest";
import { ExercicesComponens } from "./ExercicesComponents";
import { cookies } from "next/headers";
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
export default async function Exercices({ params }: any) {
  const professorEmail = await takeEcryptedProfessorId();
  return (
    <div className="flex justify-center items-center h-full w-screen overflow-auto">
      <ExercicesComponens
        setDialog={undefined}
        courseName={params.name}
        isUpdated={false}
        exercicesName={""}
        professorEmail={professorEmail}
      />
    </div>
  );
}
