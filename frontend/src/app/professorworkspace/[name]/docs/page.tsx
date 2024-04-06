import { HandleProfessorWorkout } from "@/app/Entity/HandleProfessorWorkout";
import { DocumentComponents } from "./DocumentComponents";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { HandleProfessor } from "@/app/Entity/HandleProfessor";

export default async function documents({ params }: any) {
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
        />
      </div>
    </>
  );
}
