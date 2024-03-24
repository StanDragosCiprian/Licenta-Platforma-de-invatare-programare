import { CoursCard } from "@/app/CoursCard/CoursCard";
import { HandleProfessorWorkout } from "@/app/Entity/HandleProfessorWorkout";
import {
  getFromServerCookie,
  urlBackend,
} from "@/app/UserServer/ServerRequest";
import { ICourseCard } from "@/app/core/ICursCard";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
async function getData() {
  const courses = await fetch(
    `${urlBackend}courses/cursProfessor`,
    getFromServerCookie(cookies().get("id")?.value)
  );
  const cours: any[] = await courses.json();
  return Object.values(cours);
}

export default async function PreviewCours() {
  if (!(await HandleProfessorWorkout.getId())) {
    notFound();
  }
  const professorCours: any = await getData();
  console.log("professorCours: ", professorCours);

  return (
    <>
      <div className="flex flex-wrap">
        {professorCours.map((curs: ICourseCard, index: number) => (
          <div key={index}>
            <Link href={`/CoursView/${curs.professor}/${curs.title}`}>
              <CoursCard
                title={curs.title}
                description={curs.description}
                image={curs.image}
                professor={curs.professor}
              />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
