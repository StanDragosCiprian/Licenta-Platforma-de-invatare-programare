import { UserRecever } from "../Entity/UserRecever";
import { CoursesName } from "./CoursesName";
import { notFound } from "next/navigation";
import { EditCard } from "./EditCards";
import { cookies } from "next/headers";

export default async function ProfessorCourses() {
  const userManager = new UserRecever();
  const idIs =
    cookies().get("id") && (await userManager.isRole("admin/isProfessor"));
  if (!idIs) {
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
