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
              className="ml-1 w-6 h-6 text-gray-800 dark:text-white"
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
                d="M15 17v1a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2M6 1v4a1 1 0 0 1-1 1H1m13.14.772 2.745 2.746M18.1 5.612a2.086 2.086 0 0 1 0 2.953l-6.65 6.646-3.693.739.739-3.692 6.646-6.646a2.087 2.087 0 0 1 2.958 0Z"
              />
            </svg>
            <span className="side-bar-text">Add to your cours</span>
          </Link>
        </li>
      ) : null}
    </>
  );
};
