
import { HandleProfessorWorkout } from "@/app/Entity/HandleProfessorWorkout";
import {
  getFromServerCookie,
  urlBackend,
} from "@/app/UserServer/ServerRequest";
import { ICoursesAllCard, ICourseCard } from "@/app/core/ICursCard";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Workbench from "./Workbench";
async function getData() {
  const courses = await fetch(
    `${urlBackend}courses/coursesProfessor/all`,
    getFromServerCookie(cookies().get("id")?.value)
  );
  const cours: ICoursesAllCard[] = await courses.json();
  return Object.values(cours);
}
export default async function ProfessorPreviewCours() {
  if (!(await HandleProfessorWorkout.getId())) {
    notFound();
  }
  const professorCours: ICoursesAllCard[] = await getData();
  console.log('professorCours: ', professorCours);
  return (
    <>
     <Workbench professorCours={professorCours} />
    </>
  );
}
