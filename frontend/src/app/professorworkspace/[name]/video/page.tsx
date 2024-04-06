import { notFound } from "next/navigation";
import { UploadVideo } from "./UploadVideo";
import { HandleProfessor } from "@/app/Entity/HandleProfessor";
import { cookies } from "next/headers";
import { urlBackend } from "@/app/UserServer/ServerRequest";
const takeEcryptedProfessorId = async () => {
  const professor = await fetch(`${urlBackend}professor/get/email/encripted`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: `id=${cookies().get("id")?.value}`,
    },
  });
  return await professor.text();
};
export default async function VideoPage({ params }: any) {
  const professorEmail = await takeEcryptedProfessorId();
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
          professorEmail={professorEmail}
        />
      </div>
    </>
  );
}
