import { CoursCard } from "@/app/CoursCard/CoursCard";
import { HandleProfessorWorkout } from "@/app/Entity/HandleProfessorWorkout";
import {
  getFromServerCookie,
  urlBackend,
} from "@/app/UserServer/ServerRequest";
import { ICourseCard } from "@/app/core/ICoursesCard";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
async function getData() {
  const courses = await fetch(
    `${urlBackend}courses/coursesProfessor`,
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
  return (
    <>
      <div className="flex flex-wrap">
        {professorCours.map((course: ICourseCard, index: number) => (
          <div key={index}>
            <Link href={`/CoursView/${course.professor}/${course.title}`}>
              <CoursCard
                title={course.title}
                description={course.description}
                image={course.image}
                professor={course.professor}
              />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
