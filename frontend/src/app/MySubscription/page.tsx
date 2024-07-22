import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { urlBackend } from "../UserServer/ServerRequest";
import { ICourseCard } from "../core/ICoursesCard";
import Link from "next/link";
import { CoursCard } from "../CoursCard/CoursCard";
import { HandleGenericFunction } from "../Entity/HandleGenericFuntion";
async function getData() {
    const courses = await fetch(`${urlBackend}courses/myCourses`, {
      next: { revalidate: 0 },
      credentials: "include" as RequestCredentials,
      headers: {
        Cookie: `id=${cookies().get("id")?.value}`,
      },
    });
    const cours: any[] = await courses.json();
    return Object.values(cours);
  }
const MySubscription =async () => {
    const courses: ICourseCard[] = await getData();
    if(cookies().get("id")===undefined){
    notFound();
    }
    return (
        <>
      <div className="flex flex-wrap">
        {courses.map((course: ICourseCard, index: number) => (
          <div key={index}>
            <Link href={`/CoursView/${course.professor}/${course.title}`}>
              <CoursCard
                title={HandleGenericFunction.replaceUnderlineWithSpace(
                  course.title
                )}
                description={course.description}
                image={course.image}
                professor={course.professor}
              />
            </Link>
          </div>
        ))}
      </div>
    </>
    );
}

export default MySubscription;