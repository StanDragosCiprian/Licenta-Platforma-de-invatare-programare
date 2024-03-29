import { HandleProfessorWorkout } from "@/app/Entity/HandleProfessorWorkout";
import { PreviewVideo } from "@/app/PreviwComponents/PreviewVideoComponents/PreviewVideo";
import { urlBackend } from "@/app/UserServer/ServerRequest";
import { notFound } from "next/navigation";
import PdfViewer from "../docsView/DocsView";
import { redirect } from "next/navigation";
import { CompilerViewComponents } from "../compilerView/CompilorViewComponents";
const takeCoursVide = async (cursName: string, idCurs: string) => {
  const curs = await fetch(`${urlBackend}courses/${cursName}/${idCurs}/get/cours`);
  return curs.json();
};
const takeVideoPath = async (video: string): Promise<string> => {
  const allVideo = video.split(".");
  return `${urlBackend}courses/${allVideo[0]}/${allVideo[1]}/video`;
};
const takeCompilator = async (
  professor: string,
  cursName: string,
  idCurs: string
) => {
  const curs = await fetch(
    `${urlBackend}courses/${professor}/${cursName}/${idCurs}/get/exercices/format`
  );
  return curs.json();
};
export default async function View({ params }: any) {
  if (!(await HandleProfessorWorkout.getId())) {
    redirect("http://localhost:3001/account/sign");
  }
  let curs = await takeCoursVide(params.curs, params.idCurs);
  let media: string = "";
  if (curs.format === "Video") {
    media = await takeVideoPath(curs.videoPath);
  } else if (curs.format === "Pdf") {
    media = `${urlBackend}courses/`;
    media += curs.documentFormatName;
    media = media.replace(".", "/");
    console.log("media: ", media);
  } else if (curs.format === "Compilator") {
    curs = await takeCompilator(params.professor, params.curs, params.idCurs);
  }

  return (
    <>
      {curs.format === "Video" ? (
        <PreviewVideo
          title={curs.title}
          description={curs.description}
          videoPath={media}
        />
      ) : curs.format === "Pdf" ? (
        <PdfViewer url={media} />
      ) : (
        <CompilerViewComponents
          title={curs.title}
          problemRequire={curs.problemRequire}
          problemExemples={curs.problemExemples}
          format={"Compilator"}
          idCurs={params.idCurs}
          professor={params.professor}
          cursName={params.curs}
        />
      )}
    </>
  );
}
