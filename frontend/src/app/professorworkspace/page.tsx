import { UserRecever } from "../Entity/UserRecever";
import { CoursesName } from "./CoursesName";
import { notFound } from "next/navigation";
import { EditCard } from "./EditCards";
import { cookies } from "next/headers";
import { HandleProfessorWorkout } from "../Entity/HandleProfessorWorkout";

export default async function ProfessorCourses() {
  const userManager = new UserRecever();
  if (!(await HandleProfessorWorkout.getProfessorId())) {
    notFound();
  }
  return (
    <>
      <div className="flex flex-wrap">
        <div className="flex justify-center items-center h-screen mx-[36vw]">
          <CoursesName isUpdated={false} courseName="" setDialog={undefined} />
        </div>
      </div>
    </>
  );
}
