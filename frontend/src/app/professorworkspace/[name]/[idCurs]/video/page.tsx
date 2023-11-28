import { HandleProfessorWorkout } from "@/app/Entity/HandleProfessorWorkout";
import { PreviewVideo } from "@/app/PreviwComponents/PreviewVideoComponents/PreviewVideo";
import { urlBackend } from "@/app/UserServer/ServerRequest";
import { notFound } from "next/navigation";
const takeCoursVide = async (cursName: string, idCurs: string) => {
  const curs = await fetch(`${urlBackend}curs/${cursName}/${idCurs}/videoCurs`);
  return curs.json();
};
const takeVideoPath = async (
  cursName: string,
  video: string
): Promise<string> => {
  const professir = await HandleProfessorWorkout.getProfessorName();
  console.log("professir: ", professir);
  const allVideo = video.split(".");
  console.log(
    `${urlBackend}curs/John/${cursName}/${allVideo[0]}/${allVideo[1]}/video`
  );
  return `${urlBackend}curs/John/${cursName}/${allVideo[0]}/${allVideo[1]}/video`;
};
export default async function PreviewVideoProfessor({ params }: any) {
  if (!(await HandleProfessorWorkout.getId())) {
    notFound();
  }
  const curs = await takeCoursVide(params.name, params.idCurs);

  console.log("curs: ", curs.videoPath);
  const video = await takeVideoPath(params.name, curs.videoPath);
  console.log("video: ", video);
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
