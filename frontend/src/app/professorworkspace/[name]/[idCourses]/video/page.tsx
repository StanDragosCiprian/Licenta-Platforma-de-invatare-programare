import { HandleProfessorWorkout } from "@/app/Entity/HandleProfessorWorkout";
import { PreviewVideo } from "@/app/CoursView/[professor]/[courses]/PreviewVideo";
import { urlBackend } from "@/app/UserServer/ServerRequest";
import { notFound } from "next/navigation";
const takeCoursVide = async (coursesName: string, idCourses: string) => {
  const courses = await fetch(`${urlBackend}courses/video/${coursesName}/${idCourses}/videoCourse`);
  return courses.json();
};
const takeVideoPath = async (video: string): Promise<string> => {
  const allVideo = video.split(".");
  return `${urlBackend}courses/video/${allVideo[0]}/${allVideo[1]}/get/video`;
};
export default async function PreviewVideoProfessor({ params }: any) {
  if (!(await HandleProfessorWorkout.getId())) {
    notFound();
  }
  const courses = await takeCoursVide(params.name, params.idCourse);
  const video = await takeVideoPath(courses.videoPath);
  return (
    <>
      <PreviewVideo
        title={courses.title}
        description={courses.description}
        videoPath={video}
      />
    </>
  );
}
