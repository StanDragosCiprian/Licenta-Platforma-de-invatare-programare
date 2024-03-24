import { notFound } from "next/navigation";
import { HandleProfessorWorkout } from "../../../Entity/HandleProfessorWorkout";
import { UploadVideo } from "./UploadVideo";

export default async function VideoPage() {
  if (!(await HandleProfessorWorkout.getId())) {
    notFound();
  }
  return (
    <>
      <div className="flex justify-center items-center h-screen w-screen">
        <UploadVideo isUpdated={false} videoName="" coursName="" setDialog={undefined} />
      </div>
    </>
  );
}
