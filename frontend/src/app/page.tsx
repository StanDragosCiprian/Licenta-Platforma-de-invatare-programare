import { CoursCard } from "./CoursCard/CoursCard";
import { ICourseCard } from "./core/ICursCard";
import { urlBackend } from "./UserServer/ServerRequest";
import Link from "next/link";

async function getData() {
  const courses = await fetch(`${urlBackend}courses/cursPresentation`,{ next: { revalidate: 5 } });
  const cours: any[] = await courses.json();
  return Object.values(cours);
}

export default async function Page() {
  const courses: ICourseCard[] = await getData();
  console.log('courses: ', courses);
 
  return (
    <>
      <div className="flex flex-wrap">
        {courses.map((curs: ICourseCard, index: number) => (
          <div key={index}>
            <Link href={`/CoursView/${curs.professor}/${curs.title}`}>
            <CoursCard
                title={curs.title}
                description={curs.description}
                image={curs.image} professor={curs.professor}            />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
