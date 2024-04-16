import Link from "next/link";
import { UserRecever } from "../Entity/UserRecever";
// import { CoursManager } from "../Entity/CoursManager";
import { SelectCours } from "./SelectCours";
import { cookies } from "next/headers";
import IconCloudUpdate from "../IconsComponents/IconCloudUpdate";
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
            href="/professorworkspace/professorCourses"
            className="flex items-center"
          >
            <IconCloudUpdate />

            <span className="side-bar-text">Add to your course</span>
          </Link>
        </li>
      ) : null}
    </>
  );
};
