import { notFound } from "next/navigation";
import { UploadVideo } from "./UploadVideo";
import { HandleProfessor } from "@/app/Entity/HandleProfessor";
import { cookies } from "next/headers";

export default async function VideoPage({ params }: any) {
  const handleProfessor = new HandleProfessor(cookies().get("id")?.value);
  const professorName = await handleProfessor.getProfessorName();
  if (!(await handleProfessor.isProfessor())) {
    notFound();
  }
  return (
    <>
      <div className="flex justify-center items-center h-screen w-screen">
        <UploadVideo
          isUpdated={false}
          videoName=""
          coursName={params.name}
          setDialog={undefined}
        />
      </div>
    </>
  );
}
