import { HandleProfessorWorkout } from "@/app/Entity/HandleProfessorWorkout";
import { DocumentComponents } from "./DocumentComponents";
import { notFound } from "next/navigation";

export default async function documents() {
  if (!(await HandleProfessorWorkout.getId())) {
    notFound();
  }
  return (
    <>
      <DocumentComponents />
    </>
  );
}
