import Link from "next/link";
import { UserRecever } from "../Entity/UserRecever";
// import { CoursManager } from "../Entity/CoursManager";
import { SelectCours } from "./SelectCours";
import { cookies } from "next/headers";
const getProfessor = async () => {
  const userManager = new UserRecever();
  return await userManager.getUser("");
};
// const takeCoursesName = async () => {
//   const professor: any = await getProfessor();
//   const courses: CoursManager = new CoursManager();
//   const allCours: string[] = [];
//   for (let cours of professor.coursesId) {
//     const c = await courses.coursName(cours);
//     allCours.push(c);
//   }
//   return allCours;
// };
export const AddToCours = async () => {
  const userManager = new UserRecever();
  const professor: any = await userManager.getUser("");
  return (
    <>
      {professor?.role === "professor" ? (
        <li className="flex flex-row mb-4">
          <Link
            href="/professorworkspace/professorCurs"
            className="flex items-center"
          >
             <svg
              className="w-6 h-6 text-gray-500 mr-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <span className="side-bar-text">
              Add to your course
            </span>
          </Link>
        </li>
      ) : null}
    </>
  );
};
