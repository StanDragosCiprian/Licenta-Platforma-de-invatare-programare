import Link from "next/link";
import { UserRecever } from "../Entity/UserRecever";
import { CoursManager } from "../Entity/CoursManager";
import { SelectCours } from "./SelectCours";
import { cookies } from "next/headers";
const getProfessor = async () => {
  const userManager = new UserRecever();
  return await userManager.getUser("");
};
const takeCoursesName = async () => {
 
    const professor: any = await getProfessor();
  const courses: CoursManager = new CoursManager();
  const allCours: string[] = [];
  for (let cours of professor.coursesId) {
    const c = await courses.coursName(cours);
    allCours.push(c);
  }
  return allCours;
  
  
};
export const AddToCours = async () => {
  const cours = await takeCoursesName();
  return (
    <>
     
        <li className="flex flex-row mb-4">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 13A6 6 0 1 0 7 1a6 6 0 0 0 0 12Zm0 0v6M4.5 7A2.5 2.5 0 0 1 7 4.5"
              />
            </svg>

           <SelectCours allCours={cours}/>
          </div>
        </li>
     
    </>
  );
};
