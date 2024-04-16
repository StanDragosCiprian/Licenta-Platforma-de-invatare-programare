import { HandleProfessorWorkout } from "@/app/Entity/HandleProfessorWorkout";
import { PreviewVideo } from "@/app/CoursView/[professor]/[courses]/PreviewVideo";
import { urlBackend } from "@/app/UserServer/ServerRequest";
import { notFound } from "next/navigation";
import PdfViewer from "../docsView/DocsView";
import { redirect } from "next/navigation";
import { CompilerViewComponents } from "../compilerView/CompilorViewComponents";
import { cookies } from "next/headers";
const takeCoursVide = async (courseName: string, idCourse: string) => {
  const courses = await fetch(
    `${urlBackend}courses/${courseName}/${idCourse}/get/cours`
  );
  return courses.json();
};
const takeVideoPath = async (video: string): Promise<string> => {
  const allVideo = video.split(".");
  return `${urlBackend}courses/video/${allVideo[0]}/${allVideo[1]}/get/video`;
};
const takeCompilator = async (
  professor: string,
  courseName: string,
  idCourse: string
) => {
  const courses = await fetch(
    `${urlBackend}courses/compilator/${professor}/${courseName}/${idCourse}/get/exercices/format`
  );
  return courses.json();
};

export default async function View({ params }: any) {
  if (!(await HandleProfessorWorkout.getId())) {
    redirect("http://localhost:3001/account/sign");
  }
  let course = await takeCoursVide(params.courses, params.idCourses);
  let media: string = "";
  if (course.format === "Video") {
    media = await takeVideoPath(course.videoPath);
  } else if (course.format === "Pdf") {
    media = `${urlBackend}courses/docs/`;
    media += course.documentFormatName;
    media = media.replace(".", "/");
  } else if (course.format === "Compilator") {
    course = await takeCompilator(params.professor, params.courses, params.idCourses);
  }

  return (
    <>
      {course.format === "Video" ? (
        <div className="flex justify-center items-center h-screen w-screen">
          <PreviewVideo
            title={course.title}
            description={course.description}
            videoPath={media}
          />
        </div>
      ) : course.format === "Pdf" ? (
        <PdfViewer url={media} />
      ) : (
        <CompilerViewComponents
          title={course.title}
          problemRequire={course.problemRequire}
          problemExemples={course.problemExemples}
          format={"Compilator"}
          idCourses={params.idCourses}
          professor={params.professor}
          courseName={params.courses}
        />
      )}
    </>
  );
}
