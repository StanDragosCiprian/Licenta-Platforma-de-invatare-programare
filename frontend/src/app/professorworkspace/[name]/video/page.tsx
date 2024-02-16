
import { notFound} from "next/navigation";
import { HandleProfessorWorkout } from "../../../Entity/HandleProfessorWorkout";
import { UploadVideo } from "./UploadVideo";

export default async function VideoPage() {

  if (!(await HandleProfessorWorkout.getId())) {
    notFound();
  }
  return (
    <>
  
        <UploadVideo/>

    </>
  );
}
