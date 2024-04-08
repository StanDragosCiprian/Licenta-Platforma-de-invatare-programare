import { CoursCard } from "./CoursCard/CoursCard";
import { ICourseCard } from "./core/ICursCard";
import { urlBackend } from "./UserServer/ServerRequest";
import Link from "next/link";
import { cookies } from "next/headers";
import { HandleGenericFuntion } from "./Entity/HandleGenericFuntion";
async function getData() {
  const courses = await fetch(`${urlBackend}courses/cursPresentation`, {
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
        {courses.map((curs: ICourseCard, index: number) => (
          <div key={index}>
            <Link href={`/CoursView/${curs.professor}/${curs.title}`}>
              <CoursCard
                title={HandleGenericFuntion.replaceUnderlineWithSpace(
                  curs.title
                )}
                description={curs.description}
                image={curs.image}
                professor={curs.professor}
              />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
