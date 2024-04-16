import { CoursManager } from "@/app/Entity/CoursManager";
import { SelectCourses } from "./SelectCourses";
import Link from "next/link";
import { DragDropComponenst } from "./DragDropComponents";
import {
  getFromServerCookie,
  urlBackend,
} from "@/app/UserServer/ServerRequest";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { JoinCours } from "./JoinCours";
import { HandleGenericFuntion } from "@/app/Entity/HandleGenericFuntion";
import { title } from "process";
const courses = new CoursManager();
const takeCourseName = async (courseName: string) => {
  return await courses.getCourseTitles(courseName);
};
const getCourse = async (courseName: string) => {
  return await courses.getCourse(courseName);
};
async function verifyProfessorCours(courseName: string): Promise<boolean> {
  const response = await fetch(
    `${urlBackend}courses/professorVerifyCourse/${courseName}`,
    getFromServerCookie(cookies().get("id")?.value)
  );
  const data = await response.json();
  return data;
}
const verifyPage = async (id: string, courseName: string) => {
  const response = await fetch(
    `${urlBackend}courses/${id}/${courseName}/vefiy/cours`
  );
  return response;
};
const verifyIfStudentHaveCours = async (
  professor: string,
  courseName: string
) => {
  if (cookies().get("id")?.value !== undefined) {
    const f = await fetch(
      `${urlBackend}courses/${professor}/${courseName}/isJoin/cours`,
      getFromServerCookie(cookies().get("id")?.value)
    );
    return await f.json();
  }
  return false;
};
async function isInCourse() {
  const courses = await fetch(`${urlBackend}courses/coursesPresentation`, {
    next: { revalidate: 0 },
    credentials: "include" as RequestCredentials,
    headers: {
      Cookie: `id=${cookies().get("id")?.value}`,
    },
  });
  const cours: any = await courses.json();
  console.log("cours: ", cours);
  if (Object.keys(cours).length === 0) {
    return false;
  } else {
    return true;
  }
}
export default async function CoursesViewList({ params }: any) {
  if (!(await isInCourse())) {
    notFound();
  }
  const courseTitles = await takeCourseName(params.courses);
  const course = await getCourse(params.courses);

  const isProfessorCours: boolean = await verifyProfessorCours(params.courses);
  const isPage = await verifyPage(params.professor, course.title);
  const i = await isPage.json();
  const isStudentInCours = await verifyIfStudentHaveCours(
    params.professor,
    params.courses
  );
  if (!i.isPageVerify) {
    notFound();
  }
  return (
    <>
      <div className="flex justify-center items-center h-screen mx-[26vw]">
        <div className="relative flex bg-clip-border rounded-xl bg-white text-gray-700 shadow-md w-[600px] h-[500px]">
          <div className="flex flex-col flex-1 p-4">
            <h2 className="text-4xl font-extrabold mb-4">
              {HandleGenericFuntion.replaceUnderlineWithSpace(course.title)}
            </h2>
            <p className="mb-4 text-lg font-normal text-gray-500 break-all dark:text-gray-400 ">
              {course.description}
            </p>
            {!isStudentInCours && !isProfessorCours ? (
              <JoinCours professor={params.professor} coursName={params.courses} />
            ) : undefined}
          </div>
          {isStudentInCours || isProfessorCours ? (
            <nav className="flex flex-col gap-1 min-w-[240px] p-2 font-sans text-base font-normal text-blue-gray-700 flex-2 overflow-auto h-[500px]">
              <DragDropComponenst
                courseTitles={courseTitles.map(
                  (title: { title: string; format: string }) => title.title
                )}
                coursName={params.courses}
                coursProfessor={params.professor}
                isProfessorCours={isProfessorCours}
                format={courseTitles.map(
                  (title: { title: string; format: string }) => title.format
                )}
              />
              {isProfessorCours ? (
                <Link
                  href={`/professorworkspace/${params.courses}`}
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
