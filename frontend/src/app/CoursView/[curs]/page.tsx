import { CoursManager } from "@/app/Entity/CoursManager";
import { SelectCourses } from "./SelectCurs";
import Link from "next/link";
import { DragDropComponenst } from "./DragDropComponents";
const courses = new CoursManager();
const takeCoursesName = async (cursName: string) => {
  return await courses.getCourseTitles(cursName);
};
const getCours = async (cursName: string) => {
  return await courses.getCourse(cursName);
};
const verifyIfIsProfessorToAdd=async()=>{
  
}
export default async function CursViewList({ params }: any) {
  const courseTitles = await takeCoursesName(params.curs);
  const course = await getCours(params.curs);
  return (
    <>
      <div className="flex justify-center items-center h-screen mx-[26vw]">
        <div className="relative flex bg-clip-border rounded-xl bg-white text-gray-700 shadow-md w-[600px] h-[500px]">
          <div className="flex flex-col flex-1 p-4">
            <h2 className="text-4xl font-extrabold mb-4">{course.title}</h2>
            <p className="mb-4 text-lg font-normal text-gray-500 dark:text-gray-400">
              {course.description}
            </p>
          </div>
          <nav className="flex flex-col gap-1 min-w-[240px] p-2 font-sans text-base font-normal text-blue-gray-700 flex-2 overflow-auto h-[500px]">
            <DragDropComponenst
              courseTitles={courseTitles}
              coursName={params.curs}
            />
            <Link
              href={`/professorworkspace/${params.curs}`}
              className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-gray-300 focus:bg-gray-300 active:bg-gray-300 hover:text-blue-gray-900 focus:text-blue-gray-900 active:text-blue-gray-900 outline-none"
            >
              Add Cours
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
