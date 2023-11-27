import { CoursCard } from "./CoursCard/CoursCard";
import { ICursCard } from "./core/ICursCard";
import { urlBackend } from "./UserServer/ServerRequest";

async function getData() {
  const courses = await fetch(`${urlBackend}curs/cursPresentation`,{ next: { revalidate: 5 } });
  const cours: any[] = await courses.json();
  return Object.values(cours);
}

export default async function Page() {
  const courses: ICursCard[] = await getData();

  return (
    <>
      <div className="flex flex-wrap">
        {courses.map((curs: ICursCard, index: number) => (
          <div key={index}>
            <CoursCard
              title={curs.title}
              description={curs.description}
              image={curs.image}
            />
          </div>
        ))}
      </div>
    </>
  );
}
