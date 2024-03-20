import { CoursCard } from "@/app/CoursCard/CoursCard";
import { HandleProfessorWorkout } from "@/app/Entity/HandleProfessorWorkout";
import {
  getFromServerCookie,
  urlBackend,
} from "@/app/UserServer/ServerRequest";
import { ICursCard } from "@/app/core/ICursCard";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProfessorWorkbenchComponents from "./ProfessorWorkbenchComponents";
import { IProfessor } from "@/app/core/IProfessor";
import Workbench from "./Workbench";
async function getData() {
  const courses = await fetch(
    `${urlBackend}curs/cursProfessor`,
    getFromServerCookie(cookies().get("id")?.value)
  );
  const cours: ICursCard[] = await courses.json();
  return Object.values(cours);
}
export default async function ProfessorPreviewCours() {
  if (!(await HandleProfessorWorkout.getId())) {
    notFound();
  }
  const professorCours: ICursCard[] = await getData();
  return (
    <>
     <Workbench professorCours={professorCours} />
    </>
  );
}
