import { HandleProfessorWorkout } from "@/app/Entity/HandleProfessorWorkout";
import { PreviewVideo } from "@/app/PreviwComponents/PreviewVideoComponents/PreviewVideo";
import { urlBackend } from "@/app/UserServer/ServerRequest";
import { notFound } from "next/navigation";
const takeCoursVide = async (cursName: string, idCurs: string) => {
  const curs = await fetch(`${urlBackend}courses/${cursName}/${idCurs}/videoCurs`);
  return curs.json();
};
const takeVideoPath = async (video: string): Promise<string> => {
  const allVideo = video.split(".");
  return `${urlBackend}courses/${allVideo[0]}/${allVideo[1]}/video`;
};
export default async function PreviewVideoProfessor({ params }: any) {
  if (!(await HandleProfessorWorkout.getId())) {
    notFound();
  }
  const curs = await takeCoursVide(params.name, params.idCurs);
  const video = await takeVideoPath(curs.videoPath);
  return (
    <>
      <PreviewVideo
        title={curs.title}
        description={curs.description}
        videoPath={video}
      />
    </>
  );
}
