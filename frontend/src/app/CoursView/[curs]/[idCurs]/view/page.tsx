import { HandleProfessorWorkout } from "@/app/Entity/HandleProfessorWorkout";
import { PreviewVideo } from "@/app/PreviwComponents/PreviewVideoComponents/PreviewVideo";
import { urlBackend } from "@/app/UserServer/ServerRequest";
import { notFound } from "next/navigation";
import PdfViewer from "../docsView/DocsView";
import { redirect } from "next/navigation";
const takeCoursVide = async (cursName: string, idCurs: string) => {
  const curs = await fetch(`${urlBackend}curs/${cursName}/${idCurs}/videoCurs`);
  return curs.json();
};
const takeVideoPath = async (video: string): Promise<string> => {
  const allVideo = video.split(".");
  return `${urlBackend}curs/${allVideo[0]}/${allVideo[1]}/video`;
};
export default async function View({ params }: any) {
  if (!(await HandleProfessorWorkout.getId())) {
    redirect("http://localhost:3001/account/sign");
  }
  const curs = await takeCoursVide(params.curs, params.idCurs);
  let media: string = "";
  if (curs.format === "Video") {
    media = await takeVideoPath(curs.videoPath);
  } else if (curs.format === "Pdf") {
    media = `${urlBackend}Curs/`;
    media += curs.documentFormatName;
    media = media.replace(".", "/");
    console.log("media: ", media);
  }

  return (
    <>
      {curs.format === "Video" ? (
        <PreviewVideo
          title={curs.title}
          description={curs.description}
          videoPath={media}
        />
      ) : (
        <PdfViewer url={media} />
      )}
    </>
  );
}
