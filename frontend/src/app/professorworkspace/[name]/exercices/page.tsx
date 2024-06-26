import { urlBackend } from "@/app/UserServer/ServerRequest";
import { ExercicesComponens } from "./ExercicesComponents";
import { cookies } from "next/headers";
import { HandleProfessorWorkout } from "@/app/Entity/HandleProfessorWorkout";
import { notFound } from "next/navigation";
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
  if (!(await HandleProfessorWorkout.getProfessorId())) {
    notFound();
  }
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
