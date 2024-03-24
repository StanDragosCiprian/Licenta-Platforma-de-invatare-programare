import { CoursManager } from "@/app/Entity/CoursManager";
import { SelectCourses } from "./SelectCurs";
import Link from "next/link";
import { DragDropComponenst } from "./DragDropComponents";
import {
  getFromServerCookie,
  urlBackend,
} from "@/app/UserServer/ServerRequest";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { JoinCours } from "./JoinCours";
const courses = new CoursManager();
const takeCoursesName = async (cursName: string) => {
  return await courses.getCourseTitles(cursName);
};
const getCours = async (cursName: string) => {
  return await courses.getCourse(cursName);
};
async function verifyProfessorCours(coursName: string): Promise<boolean> {
  const response = await fetch(
    `${urlBackend}courses/professorVerifyCours/${coursName}`,
    getFromServerCookie(cookies().get("id")?.value)
  );
  const data = await response.json();
  return data;
}
const verifyPage = async (id: string, cursName: string) => {
  const response = await fetch(
    `${urlBackend}courses/${id}/${cursName}/vefiy/cours`
  );
  return response;
};
const verifyIfStudentHaveCours = async (
  professor: string,
  coursName: string
) => {
  console.log(cookies().get("id")?.value);
  console.log(`${urlBackend}courses/${professor}/${coursName}/isJoin/cours`);
  const f = await fetch(
    `${urlBackend}courses/${professor}/${coursName}/isJoin/cours`,
    getFromServerCookie(cookies().get("id")?.value)
  );
  return await f.json();
};
export default async function CursViewList({ params }: any) {
  const courseTitles = await takeCoursesName(params.curs);
  const course = await getCours(params.curs);
  const isProfessorCours:boolean = await verifyProfessorCours(params.curs);
  const isPage = await verifyPage(params.professor, course.title);
  const i = await isPage.json();
  const isStudentInCours = await verifyIfStudentHaveCours(
    params.professor,
    params.curs
  );
  if (!i.isPageVerify) {
    notFound();
  }
  return (
    <>
      <div className="flex justify-center items-center h-screen mx-[26vw]">
        <div className="relative flex bg-clip-border rounded-xl bg-white text-gray-700 shadow-md w-[600px] h-[500px]">
          <div className="flex flex-col flex-1 p-4">
            <h2 className="text-4xl font-extrabold mb-4">{course.title}</h2>
            <p className="mb-4 text-lg font-normal text-gray-500 dark:text-gray-400">
              {course.description}
            </p>
            {!isStudentInCours && !isProfessorCours? (
              <JoinCours professor={params.professor} coursName={params.curs} />
            ) : undefined}
          </div>
          {isStudentInCours || isProfessorCours ? (
            <nav className="flex flex-col gap-1 min-w-[240px] p-2 font-sans text-base font-normal text-blue-gray-700 flex-2 overflow-auto h-[500px]">
              <DragDropComponenst
                courseTitles={courseTitles}
                coursName={params.curs}
                coursProfessor={params.professor}
              />
              {isProfessorCours ? (
                <Link
                  href={`/professorworkspace/${params.curs}`}
                  className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-gray-300 focus:bg-gray-300 active:bg-gray-300 hover:text-blue-gray-900 focus:text-blue-gray-900 active:text-blue-gray-900 outline-none"
                >
                  Add Cours
                </Link>
              ) : null}
            </nav>
          ) : undefined}
        </div>
      </div>
    </>
  );
}
