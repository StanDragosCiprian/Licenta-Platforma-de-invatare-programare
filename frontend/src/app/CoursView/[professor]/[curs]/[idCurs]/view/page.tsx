import { HandleProfessorWorkout } from "@/app/Entity/HandleProfessorWorkout";
import { PreviewVideo } from "@/app/PreviwComponents/PreviewVideoComponents/PreviewVideo";
import { urlBackend } from "@/app/UserServer/ServerRequest";
import { notFound } from "next/navigation";
import PdfViewer from "../docsView/DocsView";
import { redirect } from "next/navigation";
import { CompilerViewComponents } from "../compilerView/CompilorViewComponents";
const takeCoursVide = async (cursName: string, idCurs: string) => {
  const curs = await fetch(
    `${urlBackend}courses/${cursName}/${idCurs}/get/cours`
  );
  return curs.json();
};
const takeVideoPath = async (video: string): Promise<string> => {
  const allVideo = video.split(".");
  return `${urlBackend}courses/video/${allVideo[0]}/${allVideo[1]}/get/video`;
};
const takeCompilator = async (
  professor: string,
  cursName: string,
  idCurs: string
) => {
  const curs = await fetch(
    `${urlBackend}courses/compilator/${professor}/${cursName}/${idCurs}/get/exercices/format`
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
    media = `${urlBackend}courses/docs/`;
    media += curs.documentFormatName;
    media = media.replace(".", "/");
  } else if (curs.format === "Compilator") {
    curs = await takeCompilator(params.professor, params.curs, params.idCurs);
  }

  return (
    <>
      {curs.format === "Video" ? (
        <div className="flex justify-center items-center h-screen w-screen">
          <PreviewVideo
            title={curs.title}
            description={curs.description}
            videoPath={media}
          />
        </div>
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
