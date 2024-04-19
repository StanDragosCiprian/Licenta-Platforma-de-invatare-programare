import { CoursCard } from "./CoursCard/CoursCard";
import { ICourseCard } from "./core/ICoursesCard";
import { urlBackend } from "./UserServer/ServerRequest";
import Link from "next/link";
import { cookies } from "next/headers";
import { HandleGenericFuntion } from "./Entity/HandleGenericFuntion";
async function getData() {
  const courses = await fetch(`${urlBackend}courses/coursesPresentation`, {
    next: { revalidate: 0 },
    credentials: "include" as RequestCredentials,
    headers: {
      Cookie: `id=${cookies().get("id")?.value}`,
    },
  });
  const cours: any[] = await courses.json();
  return Object.values(cours);
}

export default async function Page() {
  const courses: ICourseCard[] = await getData();

  return (
    <>
      <div className="flex flex-wrap">
        {courses.map((courses: ICourseCard, index: number) => (
          <div key={index}>
            <Link href={`/CoursView/${courses.professor}/${courses.title}`}>
              <CoursCard
                title={HandleGenericFuntion.replaceUnderlineWithSpace(
                  courses.title
                )}
                description={courses.description}
                image={courses.image}
                professor={courses.professor}
              />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
