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
async function getData() {
  const courses = await fetch(
    `${urlBackend}curs/cursProfessor`,
    getFromServerCookie(cookies().get("id")?.value)
  );
  const cours: any[] = await courses.json();
  return Object.values(cours);
}
export default async function PreviewCours() {
  if (!(await HandleProfessorWorkout.getId())) {
    notFound();
  }
  const professorCurs: any = await getData();
  console.log("professorCurs: ", professorCurs);
  return (
    <>
      <div className="flex flex-wrap">
        {professorCurs.map((curs: ICursCard, index: number) => (
          <div key={index}>
            <Link href={`/professorworkspace/professorCurs/${curs.title}`}>
            <CoursCard
              title={curs.title}
              description={curs.description}
              image={curs.image}
            />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
